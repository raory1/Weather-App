const cityInputEl = document.getElementById("city-input")
const searchBtnEl = document.getElementById("search-btn")
const dateEl = document.getElementById("date")
const weatherTemperatureEl = document.getElementById("weather-temperature")
const weatherStatusEl = document.getElementById("weather-status")
const weatherIconEl = document.getElementById("weather-icon")

const api = {
    key: API_KEY,
    base: "http://api.weatherapi.com/v1/",
    lang: "pt-br",
    units: "metric"
}

const dateFormat = {
    year: "numeric",
    month: "long",
    day: "numeric"
}

function search(city, key) {
    console.log(`${api.base}current.json?key=${key}&q=${city}&aqi=no`)
    fetch(`${api.base}current.json?key=${key}&q=${city}&aqi=no`)
    .then(response => {
        if(!response.ok) {
            throw new Error("Por favor, insira um local válido.")
        }
        return response.json();
    })
    .catch(err => {
        alert(err.message)
    })
    .then(response => {
        console.log(response)
        displayUpdate(response)
    })
}

function getUserLocation() {
    fetch('http://ip-api.com/json/?fields=61439')
    .then((response) => response.json())
    .then((response) => search(response.city, api.key));
}

function getDate(response) {
    const date = new Date(response.location.localtime)
    return date.toLocaleDateString("en", dateFormat)
}

function getUserInfo() {
    getUserLocation()
    //getData()
}

function changeBackground(response) {
    const bg = response.current.is_day == 1 ? "url('./assets/img/day-background.png')" : "url('./assets/img/night-background.png')"
    document.documentElement.style.setProperty('--background-img', `${bg}`);
}

function displayUpdate(response) {
    dateEl.innerHTML = getDate(response)
    weatherTemperatureEl.innerHTML = `${parseInt(response.current.temp_c)}º`
    weatherStatusEl.innerHTML = response.current.condition.text
    weatherIconEl.src = response.current.condition.icon
    cityInputEl.value = `${response.location.name}, ${response.location.region}`
    changeBackground(response)
}

getUserInfo()

searchBtnEl.addEventListener("click", () => {
    search(cityInputEl.value, api.key)
})