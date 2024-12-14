const airQualityDiv = document.getElementById('air-quality');
const details = document.getElementById('details');

function getAQIColor(aqi) {
    if (aqi <= 50) return { color: '#e6f9e6', textColor: '#2e7d32', emoji: '😊', label: 'Good' };
    if (aqi <= 100) return { color: '#fffde7', textColor: '#fbc02d', emoji: '😐', label: 'Moderate' };
    if (aqi <= 150) return { color: '#ffe0b2', textColor: '#fb8c00', emoji: '😷', label: 'Unhealthy for Sensitive Groups' };
    if (aqi <= 200) return { color: '#ffcdd2', textColor: '#e53935', emoji: '🤒', label: 'Unhealthy' };
    if (aqi <= 300) return { color: '#e1bee7', textColor: '#8e24aa', emoji: '🤢', label: 'Very Unhealthy' };
    return { color: '#d7ccc8', textColor: '#5d4037', emoji: '☠️', label: 'Hazardous' };
}

async function fetchAirQuality() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // API Air Quality
            const API_KEY = "e3352ed7-6fea-4c13-a391-f4893f77c8dd";
            const url = `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${API_KEY}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                const aqi = data.data.current.pollution.aqius;
                const city = data.data.city;
                const pm25 = aqi;

                // Dapatkan warna dan emoji
                const { color, textColor, emoji, label } = getAQIColor(aqi);

                // Update tampilan
                airQualityDiv.style.backgroundColor = color;
                airQualityDiv.style.color = textColor;
                airQualityDiv.querySelector('.emoji').innerText = emoji;
                airQualityDiv.querySelector('h1').innerText = `${label}`;
                details.innerText = `PM2.5: ${pm25} • ${label} • ${city}`;
            } catch (error) {
                console.error("Error fetching data:", error);
                details.innerText = "Failed to fetch air quality data.";
            }
        });
    } else {
        details.innerText = "Geolocation is not supported by this browser.";
    }
}

fetchAirQuality();


setInterval(fetchAirQuality, 300000);

document.querySelector('.search-bar button').addEventListener('click', function () {
    const city = document.querySelector('.search-bar input').value;
    if (city) {
        alert(`Fetching air quality data for ${city}...`);
    } else {
        alert('Please enter a city or country!');
    }
});
