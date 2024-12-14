// const apiKey = 'YOUR_API_KEY'; // Ganti dengan API key Anda
// const url = `https://api.airvisual.com/v2/city?city=Jakarta&state=DKI%20Jakarta&country=Indonesia&key=${apiKey}`;

// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//     // Proses data untuk ditampilkan di peta
//   })
//   .catch(error => console.error('Error:', error));

// // Inisialisasi peta
// const map = L.map('map').setView([-6.2088, 106.8456], 10); // Koordinat Jakarta

// // Tambahkan layer peta
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   maxZoom: 19,
// }).addTo(map);

// // Tambahkan marker untuk kualitas udara
// const airQualityIndex = data.data.current.pollution.aqius; // Ambil AQI dari data
// L.marker([-6.2088, 106.8456]).addTo(map)
//   .bindPopup(`Indeks Kualitas Udara: ${airQualityIndex}`)
//   .openPopup();

//   navigator.geolocation.getCurrentPosition(position => {
//     const userLat = position.coords.latitude;
//     const userLon = position.coords.longitude;
  
//     // Update peta dengan lokasi pengguna
//     map.setView([userLat, userLon], 13);
//     L.marker([userLat, userLon]).addTo(map)
//       .bindPopup('Lokasi Anda')
//       .openPopup();
//   });

  
   // Initialize the map
   var map = L.map('map').fitWorld();

   // Set up the OpenStreetMap layer
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       maxZoom: 18,
   }).addTo(map);

   // Function to get air quality data
   function getAirQuality(lat, lon) {
       const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
       const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

       fetch(url)
           .then(response => response.json())
           .then(data => {
               const aqi = data.list[0].main.aqi;
               const components = data.list[0].components;
               let aqiText = '';
               switch (aqi) {
                   case 1:
                       aqiText = 'Good';
                       break;
                   case 2:
                       aqiText = 'Fair';
                       break;
                   case 3:
                       aqiText = 'Moderate';
                       break;
                   case 4:
                       aqiText = 'Poor';
                       break;
                   case 5:
                       aqiText = 'Very Poor';
                       break;
                   default:
                       aqiText = 'Unknown';
               }
               L.popup()
                   .setLatLng([lat, lon])
                   .setContent(`
                       <div class="info">
                           <strong>Air Quality Index:</strong> ${aqiText}<br>
                           <strong>PM2.5:</strong> ${components.pm2_5} µg/m³<br>
                           <strong>PM10:</strong> ${components.pm10} µg/m³<br>
                           <strong>O3:</strong> ${components.o3} µg/m³<br>
                           <strong>NO2:</strong> ${components.no2} µg/m³<br>
                           <strong>SO2:</strong> ${components.so2} µg/m³<br>
                           <strong>CO:</strong> ${components.co} µg/m³
                       </div>
                   `)
                   .openOn(map);
           })
           .catch(error => console.error('Error fetching air quality data:', error));
   }

   // Function to handle location found
   function onLocationFound(e) {
       var radius = e.accuracy / 2;

       L.marker(e.latlng).addTo(map)
           .bindPopup("You are within " + radius + " meters from this point").openPopup();

       L.circle(e.latlng, radius).addTo(map);

       getAirQuality(e.latlng.lat, e.latlng.lng);
   }

   // Function to handle location error
   function onLocationError(e) {
       alert(e.message);
   }

   // Locate the user
   map.on('locationfound', onLocationFound);
   map.on('locationerror', onLocationError);

   map.locate({setView: true, maxZoom: 16});
