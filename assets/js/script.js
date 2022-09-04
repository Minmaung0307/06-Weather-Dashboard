var apiKey = "607ebc04ab1b6a5d43954dccb5254963";

//
// var city = document.getElementById("city");

//displays
var img = document.getElementById("img");
var temp = document.getElementById("temp");
var humid = document.getElementById("humid");
var winSpeed = document.getElementById("windSpeed");
// var UVi = document.getElementById("UVi");

//buttons
var searchBtn = document.getElementById("search");
var clearBtn = document.getElementById("clear");
var historyListData = JSON.parse(localStorage.getItem("search")) || [];
var showHistory = document.getElementById("showHistory");

var cityName = document.getElementById("cityName");
var currentWeather = document.getElementById("current-weather");

var forecastWeather = document.getElementById("fitleForecast");
var fivedayForecast = document.getElementById("fiveday-Forecast");

// var showWeather = localStorage.getItem("city") || "";

//Get Current Weather
function getCurrentWeather(lat, lon) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;
  // console.log(requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log("data");
      // console.log(data);
      cityName.textContent = "Current Weather of " + data.name;
      temp.textContent = "Temperature: " + data.main.temp;
      humid.textContent = "Humidity: " + data.main.humidity;
      winSpeed.textContent = "Windspeed: " + data.wind.speed;

      var icon = document.getElementById("img");
      var iconId = data.weather[0].icon;
      icon.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + iconId + "@2x.png"
      );
      // fivedayWeather.textContent = data.name;
      // var lat = data[0].lat;
      // var lon = data[0].lon;
    });
}

//Fiveday Forecast
function getFiveDayWeather(lat, lon) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;
  // console.log(requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      // forecastWeather.textContent =
      //   "Next Five Day Weather Forecast of " + data.city.name;

      return response.json();
    })
    .then(function (data) {
      // console.log(data.list);
      // console.log(data.list[1].weather[0].icon);
      var url = data.url;

      var forecastContainer = document.createElement("div");
      forecastContainer.classList.add("row");
      var forecastHeader = document.createElement("h3");
      forecastHeader.classList.add("col-md-12");
      forecastHeader.textContent =
        "Fiveday Weather Forecast of " + data.city.name;
      forecastContainer.appendChild(forecastHeader);

      for (var i = 0; i < data.list.length; i++) {
        // console.log(data.list[i].dt_txt);
        if (data.list[i].dt_txt.includes("03:00:00")) {
          // var cityForecast = document.createElement("div");
          // var titleForecast = document.createElement("h3");
          // forecastWeather.textContent =
          //   "Next Five Day Weather Forecast of " + data.city.name;
          // cityForecast.appendChild();

          var forecastDiv = document.createElement("div");

          var tempP = document.createElement("p");
          tempP.textContent = "Temp: " + data.list[i].main.temp;

          var humidP = document.createElement("p");
          humidP.textContent = "Humid: " + data.list[i].main.humidity;

          var windP = document.createElement("p");
          windP.textContent = "W-speed: " + data.list[i].wind.speed;

          var icon = document.createElement("img");
          var iconId = data.list[i].weather[0].icon;
          icon.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" + iconId + "@2x.png"
          );

          // console.log(tempP);

          forecastDiv.appendChild(icon);
          forecastDiv.classList.add("col-md-2");
          forecastDiv.appendChild(tempP);
          forecastDiv.appendChild(humidP);
          forecastDiv.appendChild(windP);
          forecastContainer.appendChild(forecastDiv);
          // fivedayForecast.appendChild(forecastDiv);
          // console.log(data.list[i]);
        }
      }
      fivedayForecast.appendChild(forecastContainer);
    });
}

//Geolocation
function getLatLon(city) {
  // console.log(city);
  fivedayForecast.innerHTML = "";
  var requestUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=5&appid=" +
    apiKey;
  // console.log(requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      getCurrentWeather(lat, lon);
      getFiveDayWeather(lat, lon);
    });
}

//button listener
searchBtn.addEventListener("click", function () {
  //what happens when search btn is clicked

  //cityname will be recorded
  var cityName = city.value;
  // console.log(historyListData);
  historyListData.push(cityName);
  localStorage.setItem("search", JSON.stringify(historyListData));
  // console.log(cityName);
  getLatLon(cityName);
  showHistoryList();
});

clearBtn.addEventListener("click", function () {
  clearHistory();
});

function showHistoryList() {
  showHistory.innerHTML = "";
  for (var i = 0; i < historyListData.length; i++) {
    var historyItem = document.createElement("input");
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", historyListData[i]);
    historyItem.addEventListener("click", function (hys = historyListData[i]) {
      getLatLon(hys);
    });
    showHistory.append(historyItem);
  }
}

showHistoryList();

function clearHistory() {
  localStorage.clear();
  historyListData = [];
  showHistoryList();
}

// if (historyListData.length > 0) {
//   getLatLon(historyListData[historyListData.length - 1]);
// }
