// =============================
// 地図初期化
// =============================
const map = L.map('map').setView([33.5597, 133.5311], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// =============================
// OpenWeatherMap APIキー
// =============================
const WEATHER_API_KEY = "ここにあなたのAPIキー";

// =============================
// 高知県 自然スポット
// =============================
const spots = [
  {
    name: "柏島",
    lat: 32.7807,
    lng: 132.6352,
    category: "sea",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Kashiwajima.jpg"
  },
  {
    name: "仁淀ブルー",
    lat: 33.5778,
    lng: 133.1000,
    category: "river",
    img: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Niyodo_river.jpg",
    water: {
      transparency: "",
      temperature: "",
      quality: "（参考値）"
    }
  },
  {
    name: "四万十川",
    lat: 32.9876,
    lng: 132.9334,
    category: "river",
    water: {
      transparency: "",
      temperature: "",
      quality: "（参考値）"
    }
  },
  {
    name: "梶ヶ森",
    lat: 33.7626,
    lng: 133.6374,
    category: "mountain"
  }
];

let markers = [];

// =============================
// 天気取得
// =============================
async function getWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${WEATHER_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  return `
    🌤 天気：${data.weather[0].description}<br>
    🌡 気温：${data.main.temp}℃
  `;
}

// =============================
// マーカー表示
// =============================
function showMarkers(category) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  spots
    .filter(s => category === 'all' || s.category === category)
    .forEach(async s => {

      let weatherInfo = "";
      try {
        weatherInfo = await getWeather(s.lat, s.lng);
      } catch {
        weatherInfo = "天気情報取得失敗";
      }

      let waterInfo = "";
      if (s.category === "river" && s.water) {
        waterInfo = `
          <hr>
          💧 水質情報（参考）<br>
          透明度：${s.water.transparency}<br>
          水温：${s.water.temperature}<br>
          状態：${s.water.quality}
        `;
      }

      const popupContent = `
        <b>${s.name}</b><br>
        ${s.img ? `<img src="${s.img}" width="120"><br>` : ""}
        <hr>
        ${weatherInfo}
        ${waterInfo}
      `;

      const marker = L.marker([s.lat, s.lng])
        .addTo(map)
        .bindPopup(popupContent);

      markers.push(marker);
    });
}

showMarkers("all");

// =============================
// カテゴリー切替
// =============================
function filterCategory(cat) {
  showMarkers(cat);
}

// =============================
// 現在地表示
// =============================
map.locate({ setView: true, maxZoom: 12 });

map.on('locationfound', e => {
  L.marker(e.latlng)
    .addTo(map)
    .bindPopup("📍 現在地")
    .openPopup();
});
