document.getElementById("city").addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    searchButton();
  }
});

function cancelButton() {
  localStorage.clear();
  document.getElementById("currentWeatherDiv").innerHTML = "";
  document.getElementById("dayForecast").innerHTML = "";
  document.getElementById("city").value = "";
}

function getStoredCity() {
  city = localStorage.getItem("Citta'");
  if (city) {
    document.getElementById("city").value = city;
    searchButton();
  }
}

async function searchButton() {
  currentWeatherContainer = document.getElementById("dayForecast").innerHTML =
    "";
  const apiKey = "da87304a3ad43a1fb03adfa1fbf11ad5";
  const city = document.getElementById("city").value;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=it`;
  localStorage.setItem("Citta'", city);
  try {
    const weatherData = await fetch(weatherUrl).then((response) =>
      response.json()
    );
    const forecastData = await fetch(forecastUrl).then((response) =>
      response.json()
    );
    try {
      getCurrentWeather(weatherData);
      getForecast(forecastData);
      return true;
    } catch (error) {
      alert("Errore durante il caricamento dei dati");
      return false;
    }
  } catch {
    alert("Citta non trovata");
    return false;
  }
}

function getCurrentWeather(data) {
  currentWeatherContainer = document.getElementById("currentWeatherDiv");
  currentWeatherContainer.innerHTML = `
  <div class="card-body m-3  text-center"> 
      <h2>${data.name} - Oggi</h2>
          <ul>
              <li><span>Temperatura:</span> ${data.main.temp}°C</li>
              <li><span>Meteo:</span> ${data.weather[0].description}</li>
              <li><span>Umidita:</span> ${data.main.humidity}%</li>
              <li><span>Velocita del vento:</span> ${data.wind.speed}m/s</li>
          </ul>
  </div>`;
}

function getForecast(data) {
  let daysForecast = new Set();
  dayForecastContainer = document.getElementById("dayForecast");
  let i = 0;
  let index = 0;
  for (let item of data.list) {
    index++;
    if (i > 4) {
      let cards = document.getElementById("forecastCards");
      daysForecast.clear();
      return;
    }
    if (index > 7 && index % 7 == 2) {
      let date = convertDate(item.dt * 1000);
      if (!daysForecast.has(date)) {
        daysForecast.add(date);
        dayForecastContainer.innerHTML += setForecastDay([
          item.dt * 1000,
          `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          item.main.temp,
          item.weather[0].description,
        ]);
        i++;
      }
    }
  }
}

function getDayOfTheWeek(timestamp) {
  let daysOW = [
    "Domenica",
    "Lunedi",
    "Martedi",
    "Mercoledi",
    "Giovedi",
    "Venerdi",
    "Sabato",
  ];
  let newDate = new Date(timestamp);
  return daysOW[newDate.getDay()];
}

function setForecastDay(info) {
  return `
<div class="col mt-3 mb-3 d-flex align-items-stretch id="forecastCards"">
  <div class="card shadow">
    <div class="card-body m-3 p-0">
      <ul>
        <li><span>${getDayOfTheWeek(info[0])} - ${convertDate(
    info[0]
  )}</span></li>
        <li>
          <img src="${info[1]}" alt="Icon" />
        </li>
        <li><span>Temp:</span> ${info[2]}</li>
        <li><span>Meteo:</span> ${info[3]}</li>
      </ul>
    </div>
  </div>
</div>`;
}

function convertDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
