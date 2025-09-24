const apiKey = "93dd92de51976d993179f266a8d09379"; 
let currentUnit = "metric";

function formatTemp(temp) {
    return `${Math.round(temp)}°${currentUnit === "metric" ? "C" : "F"}`;
}

function getWeatherByCity(city) {
    const cityName = city || document.getElementById("cityInput").value;
    if (!cityName) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${currentUnit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${currentUnit}`;
    renderWeather(url, forecastUrl);
}

async function renderWeather(currentUrl, forecastUrl) {
    try {
        const currentRes = await fetch(currentUrl);
        const forecastRes = await fetch(forecastUrl);
        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

    if (currentData.cod !== 200) {
        alert("City not found!");
        return;
    }

        
    const currentWeather = document.getElementById("currentWeather");
    currentWeather.classList.add("active");
    currentWeather.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="Weather icon">
        <h2>${currentData.name}, ${currentData.sys.country}</h2>
        <p><strong>${formatTemp(currentData.main.temp)}</strong> | ${currentData.weather[0].description}</p>
        <p>Humidity: ${currentData.main.humidity}%</p>
        <p>Wind: ${currentData.wind.speed} ${currentUnit === "metric" ? "m/s" : "mph"}</p>
        `;

        const forecastContainer = document.getElementById("forecast");
        const forecastTitle = document.getElementById("forecastTitle");
        forecastContainer.classList.add("active");
        forecastTitle.style.display = "block";
        forecastContainer.innerHTML = "";

        const dailyData = {};
        forecastData.list.forEach(item => {
          const date = new Date(item.dt_txt);
          const day = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
          if (!dailyData[day]) {
            dailyData[day] = { temps: [], icons: [] };
          }
          dailyData[day].temps.push(item.main.temp);
          dailyData[day].icons.push(item.weather[0].icon);
        });

        const days = Object.keys(dailyData).slice(0, 5);
        days.forEach(day => {
          const temps = dailyData[day].temps;
          const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
          const icon = dailyData[day].icons[Math.floor(dailyData[day].icons.length / 2)];
          forecastContainer.innerHTML += `
            <div class="forecast-day">
              <h4>${day}</h4>
              <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
              <p>${formatTemp(avgTemp)}</p>
              <p>Avg Forecast</p>
            </div>
          `;
        });

      } catch (error) {
        alert("Error fetching weather data!");
        console.error(error);
    }
}

function setUnit(unit) {
    currentUnit = unit;
    const cityName = document.getElementById("cityInput").value;
    if (cityName) {
        getWeatherByCity(cityName);
    }
}