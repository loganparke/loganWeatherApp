var searchIconEl = document.querySelector("#search-icon");
var searchInputEl = document.querySelector("#input");
var bodyEl = document.querySelector("#body");
var infoEl = document.querySelector("#info");
var placeDayEl = document.querySelector("#place-day");
var iconHolderEl = document.querySelector("#icon-holder");
var forcastEl = document.querySelector("#forcast");
var cityBtnEl = document.querySelector("#city-btns");
var fiveDay = document.querySelector("#five-day");


var searchTerm = searchInputEl.value.trim();

var storeCities = [];

//date functionality
var time = new Date();
var date = (time.getMonth()+1) + '/' + time.getDate() + '/' + time.getFullYear();

var openSearch = function() {
    searchInputEl.classList.remove("hidden");
    searchIconEl.classList.add("hidden");
    searchInputEl.focus();
};

var inputSubmitHandler = function(btncity){
    var city = searchInputEl.value.trim();
    searchInputEl.value = '';
    if (city != '') {
        getLoctionCoordinate(city);
    } else {
        alert("please enter a valid location");
    }
    storeCities.push(city);
    localStorage.setItem("cities", JSON.stringify(storeCities));
    //console.log(localStorage);
    }
var cityBtnHandler = function(city){
    getLoctionCoordinate(city);
    storeCities.push(city);
    localStorage.setItem("cities", JSON.stringify(storeCities));
}

var getLoctionCoordinate = function(location){
    var apiUrl = "http://api.positionstack.com/v1/forward?access_key=2e6350e3cc0e5b5db6bc0afb15e5bebd&query=" + location + "&limit=1";
    //api key 2e6350e3cc0e5b5db6bc0afb15e5bebd
    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                var latitude = data.data[0].latitude;
                var longitude = data.data[0].longitude;
                var city = location;
                getWeather(latitude, longitude, city);

            });
        }
    });

}

var getWeather = function(lat, lon, city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude={part}&appid=8f61e0023c6e1437703000e3cde18905";
    // api key 8f61e0023c6e1437703000e3cde18905
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });

    //display map
    // map = new google.maps.Map(document.getElementById("map"), {
    //     center: {lat: lat, lng: lon},
    //     zoom:8,
    // });
}

var displayWeather = function(data, city){
    //delete any previously displayed data
    infoEl.innerHTML = "";
    placeDayEl.innerHTML = "";
    forcastEl.innerHTML = "";
    iconHolderEl.innerHTML = ""

    var type = data.current.weather[0].main.toLowerCase();

    var iconEl = document.createElement("img");
    iconEl.classList.add("w-50")
    switch(type){
        case "clear":
            bodyEl.className ="";
            bodyEl.classList.add("sun");
            iconEl.src = "./assets/images/day.svg"
            break;
        case "rain":
            bodyEl.className ="";
            bodyEl.classList.add("rain");
            iconEl.src = "./assets/images/rainy-6.svg"
            break;
        case "snow":
            bodyEl.className ="";
            bodyEl.classList.add("snow");
            iconEl.src = "./assets/images/snowy-6.svg"
            break;
        case "clouds":
            bodyEl.className ="";
            bodyEl.classList.add("cloud");
            iconEl.src = "./assets/images/cloudy.svg"
            break;
    };
    iconHolderEl.appendChild(iconEl);

    var cityEl = document.createElement("h2");
    cityEl.textContent = city.toUpperCase() + " ";
    placeDayEl.appendChild(cityEl);
    var dateEl = document.createElement("span");
    dateEl.textContent = date;
    placeDayEl.appendChild(dateEl);

    var tempEl = document.createElement("li");
    tempEl.textContent = "Temp: " + data.current.temp + " °F";
    infoEl.appendChild(tempEl);

    var typeEl = document.createElement("li");
    typeEl.textContent = "conditions: " + type;
    infoEl.appendChild(tempEl);

    var windEl = document.createElement("li");
    windEl.textContent = "Wind: " + data.current.wind_speed + " mph";
    infoEl.appendChild(windEl);

    var HumidEl = document.createElement("li");
    HumidEl.textContent = "Humitidy: " + data.current.humidity + " %";
    infoEl.appendChild(HumidEl);

    var uviEl = document.createElement("li");
    uviEl.textContent = "UV Index: ";
    var uviNum = document.createElement("span");
    uviNum.textContent = data.current.uvi;
    if (uviNum.textContent < 2) {
        uviNum.classList.add("uvi", "uvi-good");
    } else if (uviNum.textContent < 6) {
        uviNum.classList.add("uvi", "uvi-ok");
    } else {
        uviNum.classList.add("uvi", "uvi-bad");
    }
    uviEl.appendChild(uviNum);
    infoEl.appendChild(uviEl);

    //for createing the next 5 days forcast
    fiveDay.classList.remove("hidden");

    for (var i = 0; i < 5; i++){
        var cardEl = document.createElement("div");
        cardEl.classList.add("forcast-card", "w-18");

        var forcastDate = (time.getMonth()+1) + '/' + (time.getDate()+1+i) + '/' + time.getFullYear();
        cardEl.textContent = forcastDate;
        forcastEl.appendChild(cardEl);

        var tempEl = document.createElement("h6");
        tempEl.textContent = "temperature";
        var min = document.createElement("p")
        min.textContent = "min: " + Math.round(data.daily[i].temp.min) + " °F";
        var max = document.createElement("p")
        max.textContent = "max: " + Math.round(data.daily[i].temp.max) + "°F";
        cardEl.appendChild(tempEl);
        cardEl.appendChild(min);
        cardEl.appendChild(max);
        
        var iconEl = document.createElement("div");
        iconEl.textContent = data.daily[i].weather.main;
        cardEl.appendChild(iconEl);

        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + Math.round(data.daily[i].wind_speed) + " mph";
        cardEl.appendChild(windEl);

        var HumidEl = document.createElement("p");
        HumidEl.textContent = "Humitidy: " + data.daily[i].humidity + " %";
        cardEl.appendChild(HumidEl);
    }
}

var displayStorage = function() {
    //display 10 most recent city searches
    var getCities = JSON.parse(localStorage.getItem("cities"));
    console.log(getCities);
    
    for (var i = 0; i < getCities.length; i++) {
        if (getCities[i] === "" || getCities[i] === " "){
            getCities.splice(i,1);
        }
    }

    for (var i = getCities.length; i > (getCities.length - 10) && i > 0; i--){
        var cityBtn = document.createElement("button");
        cityBtn.textContent = getCities[i-1];
        cityBtn.classList.add("city-click", "w-100");
        cityBtnEl.appendChild(cityBtn);
    }
}

searchIconEl.addEventListener("click", openSearch);
searchInputEl.addEventListener("keydown", function (e) {
    if (e.code === "Enter"){
        inputSubmitHandler();
    }
});
cityBtnEl.addEventListener("click", function(event) {
    if (event.target.classList.contains('city-click')){
        var cityName = event.target.textContent;
        cityBtnHandler(cityName);
    }
});

displayStorage();
