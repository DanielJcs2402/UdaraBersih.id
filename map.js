 // Inisialisasi Peta
 const map = L.map('map').setView([-6.200000, 106.816666], 10); // Koordinat Jakarta

 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: 'Peta oleh <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
 }).addTo(map);

 // Marker untuk lokasi pengguna
 let userMarker;

 // Mendapatkan lokasi pengguna
 if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(position => {
         const { latitude, longitude } = position.coords;
         map.setView([latitude, longitude], 13);

         if (!userMarker) {
             userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("Lokasi Anda").openPopup();
         } else {
             userMarker.setLatLng([latitude, longitude]);
         }

         getAQI(latitude, longitude);
     }, () => {
         alert("Gagal mendapatkan lokasi Anda.");
     });
    } else {
        alert("Geolokasi tidak didukung di browser Anda.");
    }

    // Mendapatkan data AQI menggunakan API IQAir (Gratis, dengan batasan harian)
    async function getAQI(lat, lon) {
        const API_KEY = 'your_api_key_here'; // Ganti dengan API Key Anda dari IQAir atau layanan lain
        const URL = `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${API_KEY}`;

        try {
            const response = await axios.get(URL);
            const data = response.data;

            const location = data.data.city;
            const aqi = data.data.current.pollution.aqius;
            const status = getAQIStatus(aqi);

            document.getElementById('location').innerText = `Lokasi: ${location}`;
            document.getElementById('aqi').innerText = `AQI: ${aqi}`;
            document.getElementById('status').innerText = `Status: ${status}`;
        } catch (error) {
            console.error("Gagal mendapatkan data AQI:", error);
        }
    }
  // Fungsi untuk menentukan status AQI
  function getAQIStatus(aqi) {
    if (aqi <= 50) return "Baik";
    if (aqi <= 100) return "Sedang";
    if (aqi <= 150) return "Tidak Sehat untuk Kelompok Sensitif";
    if (aqi <= 200) return "Tidak Sehat";
    if (aqi <= 300) return "Sangat Tidak Sehat";
    return "Berbahaya";
}