// Transition du bouton Découviri
window.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("scrollToForecast");
  const target = document.getElementById("decouvrir");

  if (button && target) {
    button.addEventListener("click", function () {
      target.scrollIntoView({ behavior: "smooth" });
    });
  }
});

// DEBUT DE L'UTILISATION DE L'API //
let form = document.getElementById("search-form");
let input = document.getElementById("search-input");
let suggestionsContainer = document.getElementById("suggestions-container");
let cityNameEl = document.querySelector(".city h3");
let cityDescEl = document.querySelector(".city p");
let temp1 = document.querySelector(".tempartures1");
let temp2 = document.querySelector(".tempartures2");
let statValues = document.querySelectorAll(".stat-value");
let backgroundImage = document.querySelector(".img-back");
let loader = document.getElementById("loader");
let weatherIcon = document.getElementById("weather-icon");
let forecastCards = document.getElementById("forecast-cards");

let API_KEY = "8eb2d4000ed188a4ae05666fa24891c9";

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  setTimeout(() => {
    loader.style.display = "none";
  }, 500);
}

// Changement de fond en fonction de la météo
function updateBackground(weatherMain) {
  let imagePath;
  switch (weatherMain.toLowerCase()) {
    case "clear":
      imagePath = "./Images/clear.jpg";
      break;
    case "clouds":
      imagePath = "./Images/clouds.jpg";
      break;
    case "rain":
    case "drizzle":
      imagePath = "./Images/rain.jpg";
      break;
    case "thunderstorm":
      imagePath = "./Images/thunderstorm.jpg";
      break;
    case "snow":
      imagePath = "./Images/snow.jpg";
      break;
    case "mist":
    case "fog":
    case "haze":
      imagePath = "./Images/mist.jpg";
      break;
    default:
      imagePath = "./Images/default.jpg";
      break;
  }

  if (backgroundImage) {
    backgroundImage.src = imagePath;
  }
}

let debounceTimeout;

// Autocomplétion suggestions
input.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  const query = input.value.trim();
  if (query.length < 1) {
    suggestionsContainer.innerHTML = "";
    return;
  }

  debounceTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
          query
        )}&fields=departement&boost=population&limit=5`
      );
      const data = await response.json();

      suggestionsContainer.innerHTML = "";

      data.forEach((commune) => {
        const suggestion = document.createElement("div");
        suggestion.textContent = `${commune.nom} (${commune.departement.nom})`;
        suggestion.addEventListener("click", () => {
          input.value = commune.nom;
          suggestionsContainer.innerHTML = "";
        });
        suggestionsContainer.appendChild(suggestion);
      });
    } catch (error) {
      console.error("Erreur fetch suggestions :", error);
    }
  }, 300);
});

// Fermer suggestions si clic à l'extérieur
document.addEventListener("click", (e) => {
  if (!suggestionsContainer.contains(e.target) && e.target !== input) {
    suggestionsContainer.innerHTML = "";
  }
});

// Fonction pour afficher les prévisions à 5 jours
function updateForecastCards(data) {
  forecastCards.innerHTML = "";
  const days = {};

  data.list.forEach((entry) => {
    const date = new Date(entry.dt_txt);
    const day = date.toLocaleDateString("fr-FR", { weekday: "short" });
    const time = date.getHours();

    if (!days[day] && time === 12) {
      days[day] = entry;
    }
  });

  Object.entries(days).forEach(([day, entry]) => {
    const icon = entry.weather[0].icon;
    const temp = entry.main.temp.toFixed(1);
    const desc = entry.weather[0].description;

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <p><strong>${day}</strong></p>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" />
      <p>${temp}°C</p>
    `;
    forecastCards.appendChild(card);
  });
}

// Fonction principale de récupération météo
async function getWeather(city) {
  try {
    showLoader();

    const geoResponse = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${city}&fields=departement&boost=population&limit=1`
    );
    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      alert("Ville non trouvée");
      return;
    }

    let fullCityName = geoData[0].nom;
    let department = geoData[0].departement.nom;

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${fullCityName}&appid=${API_KEY}&units=metric&lang=fr`
    );
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      alert("Erreur météo : " + weatherData.message);
      return;
    }

    let weatherMain = weatherData.weather[0].main;
    let weatherDescription = weatherData.weather[0].description;
    let temp = weatherData.main.temp;
    let feelsLike = weatherData.main.feels_like;
    let humidity = weatherData.main.humidity;
    let pressure = weatherData.main.pressure;
    let wind = weatherData.wind.speed;

    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = weatherDescription;

    cityNameEl.textContent = fullCityName;
    cityDescEl.textContent = `${weatherDescription}, ${department}`;
    temp1.textContent = `${temp.toFixed(1)}°C`;
    temp2.textContent = `Météo : ${weatherDescription}`;
    statValues[0].textContent = `${feelsLike.toFixed(1)}°C`;
    statValues[1].textContent = `${wind} m/s`;
    statValues[2].textContent = `${humidity}%`;
    statValues[3].textContent = `${pressure} hPa`;

    updateBackground(weatherMain);

    // Récupération des prévisions 5 jours
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${fullCityName}&appid=${API_KEY}&units=metric&lang=fr`
    );
    const forecastData = await forecastResponse.json();
    updateForecastCards(forecastData);

    // Mise à jour de la carte avec Leaflet
    const { lat, lon } = weatherData.coord;
    map.setView([lat, lon], 13);
    marker.setLatLng([lat, lon]).bindPopup(fullCityName).openPopup();
  } catch (error) {
    console.error("Erreur:", error);
    alert("Une erreur est survenue");
  } finally {
    hideLoader();
  }
}

// Gestion du formulaire
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city !== "") {
    getWeather(city);
  }
});

// Carte Leaflet par défaut (Paris)
let map = L.map("map").setView([48.8566, 2.3522], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);
let marker = L.marker([48.8566, 2.3522])
  .addTo(map)
  .bindPopup("Paris")
  .openPopup();
