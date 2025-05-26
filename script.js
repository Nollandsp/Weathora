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
// Rappel des ID et Nom de Class utilisé
let form = document.getElementById("search-form");
let input = document.getElementById("search-input");
let cityNameEl = document.querySelector(".city h3");
let cityDescEl = document.querySelector(".city p");
let temp1 = document.querySelector(".tempartures1");
let temp2 = document.querySelector(".tempartures2");
let statValues = document.querySelectorAll(".stat-value");
let backgroundImage = document.querySelector(".img-back");
let loader = document.getElementById("loader");
let weatherIcon = document.getElementById("weather-icon");

let API_KEY = "8eb2d4000ed188a4ae05666fa24891c9";

// Permet d'obtenir et faire dispraître loader
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

    const fullCityName = geoData[0].nom;
    const department = geoData[0].departement.nom;

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${fullCityName}&appid=${API_KEY}&units=metric&lang=fr`
    );
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      alert("Erreur météo : " + weatherData.message);
      return;
    }

    const weatherMain = weatherData.weather[0].main;
    const weatherDescription = weatherData.weather[0].description;
    const temp = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;
    const pressure = weatherData.main.pressure;
    const wind = weatherData.wind.speed;

    // Mise à jour de l'icône météo en temps réel
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = weatherDescription;

    // Affichage des infos dans la page
    cityNameEl.textContent = fullCityName;
    cityDescEl.textContent = `${weatherDescription}, ${department}`;
    temp1.textContent = `${temp.toFixed(1)}°C`;
    temp2.textContent = `Météo : ${weatherDescription}`;
    statValues[0].textContent = `${feelsLike.toFixed(1)}°C`;
    statValues[1].textContent = `${wind} m/s`;
    statValues[2].textContent = `${humidity}%`;
    statValues[3].textContent = `${pressure} hPa`;

    updateBackground(weatherMain);

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
const map = L.map("map").setView([48.8566, 2.3522], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);
const marker = L.marker([48.8566, 2.3522])
  .addTo(map)
  .bindPopup("Paris")
  .openPopup();
