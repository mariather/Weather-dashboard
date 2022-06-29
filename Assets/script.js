// cambiar css


// Global 
const openWeatherAppId = '2c4a921d55c896205bdca23294d0393d';


// HTML 
let citySearch = $('#citySearch');
let  searchInputEl = $('#input');
let foreCastContainer = $('#foreCast');
let previousCities = $('#previousCities');



function searchInput(cityName) {
    cityName.preventDefault()
    callCurrentWeatherDataAPI(searchInputEl.val())
}

//Current one
function callCurrentWeatherDataAPI(cityName) {
    let urlApi = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${cityName}&appid=${openWeatherAppId}`;
    fetch(urlApi)
    .then(response => response.json())
    .then(data => {
        cityName = data.name;
        callOneCallAPI(cityName, data.coord.lon, data.coord.lat);
        displayPreviousCities(cityName);
        })
    .catch(error => {
        console.log('Error:');
    });

    return;
}


function callOneCallAPI(cityName, longitude, latitude) {
    let urlApi = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lon=${longitude}&lat=${latitude}&appid=${openWeatherAppId}`
    fetch(urlApi)
    .then(response => response.json())
    .then(data => {
        displayCurrentWeather(cityName, data.current);
        displayWeekForecast(data.daily)
    });
}


function displayCurrentWeather(cityName, currentWeather) {
    
    $('#actualWeatherName').html(cityName); 
    $('#actualWeatherDate').html(moment().format('M/D/YYYY')) //date
    $('#actualWeatherIcon').attr('src', `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`); //icon of weather conditions
    $('#temperature').html(currentWeather.temp) //temp
    $('#humidity').html(currentWeather.humidity) //humidity
    $('#wind').html(currentWeather.wind_speed) //windspeed
   

    $('#cityWeatherContainer').css('display', 'block')
}


function displayWeekForecast(forecastData) {
    // temperature, wind, humidity

    foreCastContainer.html('');
    for (let index = 1; index <= 5; index++) {      //5 days display
        let divEl = $(`
        <div class="foreCastCard">
        <p style="font-weight: 800">${moment().clone().add(index,'days').format("M/D/YYYY")}</p>
        <img src="http://openweathermap.org/img/wn/${forecastData[index].weather[0].icon}.png" alt="forcast day icon">
        <p>Temp: ${forecastData[index].temp.day}°F</p>
        <p>Wind: ${forecastData[index].wind_speed}MPH</p>
        <p>Humidity: ${forecastData[index].humidity}%</p>
        </div>`)
        divEl.appendTo(foreCastContainer)
    }
}

function displayPreviousCities(cityName, initialStart) {
    // search history 
    let matchFound = false;
    $('#previousCities').children('').each(function(i) {
        if (cityName == $(this).text()) {
            matchFound = true;
            return;
        }
    });
    if (matchFound) {return;}

    let buttonEl = $(`<button type="button" class="col-12 mt-3 btn btn-secondary">${cityName}</button>`)
    buttonEl.on('click', previousButtonClick);
    buttonEl.prependTo(previousCities);

    if (!initialStart) {savePreviousData(cityName)};
}



//declare events and load previous Cities

function init() { 
    citySearch.submit(searchInput)
    tempArr = JSON.parse(localStorage.getItem('previousSearches'))
    if (tempArr != null){
        for (let index = 0; index < tempArr.length; index++) {
            displayPreviousCities(tempArr[index], true)
        }
    }
}

init()


function savePreviousData(cityName) {
    tempItem = JSON.parse(localStorage.getItem('previousCities'))
    if (tempItem != null) {
        localStorage.setItem('previousCities', JSON=(tempItem.concat(cityName)))
    } else {
        tempArr = [cityName];
        localStorage.setItem('previousCities', JSON=stringify(tempArr))
    }
}

function previousButtonClick(event) {
    callCurrentWeatherDataAPI(event.target.innerHTML)
}


    
   

