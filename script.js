const cityInput = document.querySelector("#city-input");
const searchBtn= document.querySelector("#search-button");

const weatherInfoSection= document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection= document.querySelector(".search-city");
const countryTxt= document.querySelector(".country-txt");
const tempTxt= document.querySelector(".temp-txt");
const conditionTxt= document.querySelector(".weather-condition-txt");
const humidityTxt= document.querySelector(".humidity-value-txt");
const windTxt= document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");
const forecastItemsContainer = document.querySelector(".forecast-items-container");

const apiKey='531bc0ae6e7cdff79bb63e51198778e8'
https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
    
})

cityInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})

async function getFetchData(endpoint,city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response=await fetch(apiUrl)
    return response.json()
}

function getWeatherIcon(id) {
    if( id <= 232) 
        return "thunderstorm.svg";
    else if(id <= 321)
        return "drizzle.svg";
    else if(id <= 531)
        return "rain.svg";
    else if(id <= 622)
        return "snow.svg";
    else if(id <= 781)
        return "atmosphere.svg";
    else if(id <= 800) 
        return "clear.svg";
    else
        return "clouds.svg";
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = { weekday: 'short',month: 'short', day: '2-digit' };
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData= await getFetchData("weather",city);
    if(weatherData.cod !== 200) {
        showDisplaySection(notFoundSection)
        return;
    }

    const{
        name:country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
    } =weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = `${Math.round(temp)} °C`;
    conditionTxt.textContent = main;
    humidityTxt.textContent = `${humidity}%`;
    windTxt.textContent = `${speed} m/s`;

    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
    currentDateTxt.textContent = getCurrentDate();

    await updateForecastInfo(city);
    showDisplaySection(weatherInfoSection)
}

async function updateForecastInfo(city) {
    const forecastData = await getFetchData("forecast", city);
    const timetaken="12:00:00"
    const todayDate= new Date().toISOString().split('T')[0];
    forecastItemsContainer.innerHTML = "";
    forecastData.list.forEach((forecastWeather) => {
        if(forecastWeather.dt_txt.includes(timetaken) && !forecastWeather.dt_txt.includes(todayDate))
            updateForecastItems(forecastWeather);
    })
}

function updateForecastItems(weatherData) {
    const {
        main: { temp },
        weather: [{id}],
        dt_txt:date,
    } = weatherData;

    const dateTaken= new Date(date);
    const dateOption={month: 'short', day: '2-digit' };
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);
    const forecastItem =
        `<div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                    <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
                </div>`

    forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
    [weatherInfoSection, notFoundSection, searchCitySection].forEach(section => 
        section.style.display = "none");
    section.style.display = "flex";
}
