const cityInput = document.querySelector(".city-input");
  const searchButton = document.querySelector(".search-btn");
  const locationButton = document.querySelector(".location-btn");

  const API_KEY = "5903dcf99ad560d06cb1229a0091b272";

  const getWeatherDetails = (cityName, latitude, longitude) => {
      // Redirect to weather.html with query parameters
      window.location.href = `weather.html?city=${cityName}&lat=${latitude}&lon=${longitude}`;
  };

  const getCityCoordinates = () => {
      const cityName = cityInput.value.trim();
      if (cityName === "") return;
      const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

      fetch(API_URL)
      .then(response => response.json())
      .then(data => {
          if (!data.length) return alert(`No coordinates found for ${cityName}`);
          const { lat, lon, name } = data[0];
          getWeatherDetails(name, lat, lon);
      })
      .catch(() => {
          alert("An error occurred while fetching the coordinates!");
      });
  };

  const getUserCoordinates = () => {
      navigator.geolocation.getCurrentPosition(
          position => {
              const { latitude, longitude } = position.coords;
              const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
              fetch(API_URL)
              .then(response => response.json())
              .then(data => {
                  const { name } = data[0];
                  getWeatherDetails(name, latitude, longitude);
              })
              .catch(() => {
                  alert("An error occurred while fetching the city name!");
              });
          },
          error => {
              if (error.code === error.PERMISSION_DENIED) {
                  alert("Geolocation request denied. Please reset location permission to grant access again.");
              } else {
                  alert("Geolocation request error. Please reset location permission.");
              }
          }
      );
  };

  searchButton.addEventListener("click", getCityCoordinates);
  locationButton.addEventListener("click", getUserCoordinates);