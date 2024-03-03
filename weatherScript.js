const API_KEY = "5903dcf99ad560d06cb1229a0091b272";

window.onload = () => {
    // Retrieve query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('city');
    const latitude = urlParams.get('lat');
    const longitude = urlParams.get('lon');

    // Call API to get weather details based on coordinates
    getWeatherDetails(cityName, latitude, longitude);
};

const displayCurrentWeather = (currentWeather) => {
    const cityNameElement = document.getElementById("city-name");
    const temperatureElement = document.getElementById("temperature");
    const windElement = document.getElementById("wind");
    const humidityElement = document.getElementById("humidity");

    cityNameElement.textContent = `${currentWeather.cityName}`;
    temperatureElement.textContent = `Temperature: ${currentWeather.temperature}°C`;
    windElement.textContent = `Wind: ${currentWeather.wind} M/S`;
    humidityElement.textContent = `Humidity: ${currentWeather.humidity}%`;
};

const displayForecast = (forecast) => {
    const weatherCardsElement = document.getElementById("weather-cards");

    forecast.forEach((item) => {
        const card = createWeatherCard(item);
        weatherCardsElement.insertAdjacentHTML("beforeend", card);
    });
};

const createWeatherCard = (item) => {
    const day = getDayOfWeek(item.date); // Function to get day of week
    const temperature = item.temperature;
    const wind = item.wind;
    const humidity = item.humidity;
    const icon = getWeatherIcon(item.icon, temperature);

    return `<li class="card">
                <h3>${day}</h3>
                <img src="${icon}" alt="Weather Icon" style="width: 100px; height: auto;">
                <h6>Temp: ${temperature}°C</h6>
                <h6>Wind: ${wind} M/S</h6>
                <h6>Humidity: ${humidity}%</h6>
            </li>`;
};

const getWeatherIcon = (weatherCondition, temperature) => {
    // Default image path
    let imagePath = "images/default.png";

// Conditions for selecting weather icons based on temperature and weather condition
if (temperature > 25 ) {
    // Hot weather
    imagePath = "images/clear.png";
} else if (temperature < 10 && temperature >0) {
    // Cold weather
    imagePath = "images/snow.png";
} else if (temperature > 10 && temperature <= 16) {
    // Moderate weather
    imagePath = "images/mist.png";
}
else if (temperature <=0)
{
    imagePath = "images/snow.png";
}

    else{
    // Moderate weather with different conditions
    switch (weatherCondition) {
        case "Clear":
            imagePath = "images/clear.png";
            break;
        case "Rain":
            imagePath = "images/rain.png";
            break;
        case "Snow":
            imagePath = "images/snow.png";
            break;
        case "Clouds":
            imagePath = "images/cloud.png";
            break;
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Dust":
        case "Fog":
            imagePath = "images/mist.png";
            break;
        default:
            imagePath = "images/clear.png";
            break;
    }
}


    return imagePath;
};

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDay();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        const currentWeather = {
            cityName: cityName,
            country: '', // You can retrieve this information from the API if needed
            temperature: (data.list[0].main.temp - 273.15).toFixed(2), // Convert temperature from Kelvin to Celsius
            wind: data.list[0].wind.speed,
            humidity: data.list[0].main.humidity
        };

        const forecastData = fiveDaysForecast.map(item => ({
            date: new Date(item.dt_txt).getDay(),
            temperature: (item.main.temp - 273.15).toFixed(2), // Convert temperature from Kelvin to Celsius
            wind: item.wind.speed,
            humidity: item.main.humidity,
            icon: item.weather[0].icon
        }));

        // Display current weather and forecast
        displayCurrentWeather(currentWeather);
        displayForecast(forecastData);
    })
    .catch(error => {
        alert(`An error occurred while fetching the weather forecast: ${error.message}`);
    });
};

// Function to get day of week from date
const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date];
};



document.addEventListener('DOMContentLoaded', function() {

    var uvIndexTrendData = {
        labels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM'],
        datasets: [{
            label: 'UV Index Trend',
            data: [3, 4, 6, 7, 5, 4],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    var uvIndexTrendOptions = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };


    var uvIndexChartCanvas = document.getElementById('uv-index-chart').getContext('2d');
    var uvIndexChart = new Chart(uvIndexChartCanvas, {
        type: 'line',
        data: uvIndexTrendData,
        options: uvIndexTrendOptions
    });


    var uvIndexValueElement = document.getElementById('uv-index-value');
    var uvIndexLevelElement = document.getElementById('uv-index-level');
    var uvIndexRecommendationElement = document.getElementById('uv-index-recommendation');


    var uvIndexValue = 6;
    uvIndexValueElement.textContent = 'UV Index: ' + uvIndexValue;


    if (uvIndexValue < 3) {
        uvIndexLevelElement.textContent = 'UV Index Level: Low';
        uvIndexRecommendationElement.textContent = 'Recommendation: No protection required';
    } else if (uvIndexValue < 6) {
        uvIndexLevelElement.textContent = 'UV Index Level: Moderate';
        uvIndexRecommendationElement.textContent = 'Recommendation: Wear sunscreen and protective clothing';
    } else if (uvIndexValue < 8) {
        uvIndexLevelElement.textContent = 'UV Index Level: High';
        uvIndexRecommendationElement.textContent = 'Recommendation: Seek shade during midday hours';
    } else if (uvIndexValue < 11) {
        uvIndexLevelElement.textContent = 'UV Index Level: Very high';
        uvIndexRecommendationElement.textContent = 'Recommendation: Minimize sun exposure between 10 a.m. and 4 p.m.';
    } else {
        uvIndexLevelElement.textContent = 'UV Index Level: Extreme';
        uvIndexRecommendationElement.textContent = 'Recommendation: Avoid being outside during midday hours';
    }
});


    function fetchWeatherData(cityName) {
      const API_KEY = '5903dcf99ad560d06cb1229a0091b272';
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

      fetch(API_URL)
        .then(response => response.json())
        .then(data => {
          const weatherCondition = data.weather[0].main.toLowerCase();
          let imageUrl;
          switch (weatherCondition) {
            case 'clear':
              imageUrl = 'images/clear.png';
              break;
            case 'clouds':
              imageUrl = 'images/clouds.png';
              break;
            case 'rain':
              imageUrl = 'images/rain.png';
              break;
            case 'snow':
              imageUrl = 'images/snow.png';
              break;
            default:
              imageUrl = 'images/clear.png';
          }
          document.getElementById('weather-image').src = imageUrl;
        })
        .catch(error => console.error('Error fetching weather data:', error));
    }


    fetchWeatherData('Delhi');



var map = L.map('air-quality-map').setView([0, 0], 3);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);


navigator.geolocation.getCurrentPosition(function(position) {
    var userLat = position.coords.latitude;
    var userLng = position.coords.longitude;


    map.setView([userLat, userLng], 13);


    L.marker([userLat, userLng]).addTo(map).bindPopup('Your Location');


    var airQualityLevels = {
        'good': 'green',
        'moderate': 'yellow',
        'unhealthy for sensitive groups': 'orange',
        'unhealthy': 'red',
        'very unhealthy': 'purple',
        'hazardous': 'black'
    };


    var currentAirQuality = 'good';


    var color = airQualityLevels[currentAirQuality];
    L.circleMarker([userLat, userLng], {
        radius: 8,
        color: color,
        fillOpacity: 0.8
    }).addTo(map).bindPopup('Air Quality: ' + currentAirQuality);
});

var map = L.map('air-quality-map').setView([0, 0], 3);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);


navigator.geolocation.getCurrentPosition(function(position) {
    var userLat = position.coords.latitude;
    var userLng = position.coords.longitude;


    map.setView([userLat, userLng], 13);


    L.marker([userLat, userLng]).addTo(map).bindPopup('Your Location');


    var airQualityLevels = {
        'good': 'green',
        'moderate': 'yellow',
        'unhealthy for sensitive groups': 'orange',
        'unhealthy': 'red',
        'very unhealthy': 'purple',
        'hazardous': 'black'
    };


    var currentAirQuality = 'good';


    var color = airQualityLevels[currentAirQuality];
    L.circleMarker([userLat, userLng], {
        radius: 8,
        color: color,
        fillOpacity: 0.8
    }).addTo(map).bindPopup('Air Quality: ' + currentAirQuality);
});




const uvIndexValue = getUVIndexValue();


document.getElementById('uv-index-value').textContent = uvIndexValue;


let uvIndexLevel;
if (uvIndexValue < 3) {
  uvIndexLevel = 'Low';
} else if (uvIndexValue < 6) {
  uvIndexLevel = 'Moderate';
} else if (uvIndexValue < 8) {
  uvIndexLevel = 'High';
} else if (uvIndexValue < 11) {
  uvIndexLevel = 'Very High';
} else {
  uvIndexLevel = 'Extreme';
}


document.getElementById('uv-index-level').textContent = `UV Index Level: ${uvIndexLevel}`;


let eyeProtectionRecommendation;
if (uvIndexValue < 3) {
  eyeProtectionRecommendation = 'No protection needed';
} else {
  eyeProtectionRecommendation = 'Wear sunglasses and hat';
}


document.getElementById('uv-index-recommendation').textContent = `Recommendation: ${eyeProtectionRecommendation}`;