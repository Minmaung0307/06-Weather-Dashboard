var apiKey = "607ebc04ab1b6a5d43954dccb5254963";

//displays
var img = document.getElementById("img");
var temp = document.getElementById("temp");
var humid = document.getElementById("humid");
var winSpeed = document.getElementById("windSpeed");
var UVi = document.getElementById("UVi");

//buttons
var searchBtn = document.getElementById("search");
var clearBtn = document.getElementById("clear");
var historyListData = JSON.parse(localStorage.getItem("search")) || [];
var showHistory = document.getElementById("showHistory");

var cityName = document.getElementById("cityName");
var currentWeather = document.getElementById("current-weather");

var forecastWeather = document.getElementById("fitleForecast");
var fivedayForecast = document.getElementById("fiveday-Forecast");

//Get Current Weather
function getCurrentWeather(lat, lon) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
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
      console.log(data);
      // cityName.textContent = "Current Weather of " + data.current.name;
      temp.textContent = "Temperature: " + data.current.temp;
      humid.textContent = "Humidity: " + data.current.humidity;
      winSpeed.textContent = "Windspeed: " + data.current.wind_speed;
      UVi.textContent = "UVi: " + data.current.uvi;
      var uvibg = "";
      if (data.current.uvi <= 2) {
        uvibg = "badge badge-success";
      } else if (data.current.uvi >= 3 && data.current.uvi >= 7) {
        uvibg = "badge badge-warning";
      } else {
        uvibg = "badge badge-danger";
      }
      UVi.setAttribute("class", uvibg);

      var icon = document.getElementById("img");
      var iconId = data.current.weather[0].icon;
      icon.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + iconId + "@2x.png"
      );
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
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      // console.log(data.list[1].weather[0].icon);
      cityName.textContent = "Current Weather of " + data.city.name;
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
      // console.log(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      getCurrentWeather(lat, lon);
      getFiveDayWeather(lat, lon);
    });
}

//button listener
searchBtn.addEventListener("click", function () {
  //cityname will be recorded
  var cityName = city.value;
  // console.log(historyListData);
  if (historyListData.indexOf(cityName) == -1) {
    historyListData.push(cityName);
  }
  // historyListData.push(cityName);
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
    const historyItem = document.createElement("input");
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", historyListData[i]);
    historyItem.addEventListener("click", function () {
      // alert(historyItem.value);
      getLatLon(historyItem.value);
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
