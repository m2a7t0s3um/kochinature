// 地図初期化（高知市周辺）
const map = L.map('map').setView([33.5597, 133.5311], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// 現在地表示
navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  L.marker([lat, lng]).addTo(map)
    .bindPopup("現在地")
    .openPopup();
});

// 自然スポット（サンプル）
const spots = [
  {
    name: "仁淀川",
    lat: 33.5076,
    lng: 133.1545,
    category: "river",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Niyodo_river.jpg",
    weather: "晴れ",
    water: "良好"
  },
  {
    name: "柏島",
    lat: 32.7806,
    lng: 132.6336,
    category: "sea",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Kashiwajima.jpg",
    weather: "曇り",
    water: "非常に良好"
  }
];

let markers = [];

function showSpots(list) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  list.forEach(spot => {
    const marker = L.marker([spot.lat, spot.lng]).addTo(map);
    marker.on('click', () => {
      document.getElementById("info").innerHTML = `
        <h3>${spot.name}</h3>
        <img src="${spot.image}">
        <p>☀ 天気: ${spot.weather}</p>
        <p>💧 水質: ${spot.water}</p>
      `;
    });
    markers.push(marker);
  });
}

function filterCategory(category) {
  if (category === "all") {
    showSpots(spots);
  } else {
    showSpots(spots.filter(s => s.category === category));
  }
}

showSpots(spots);
