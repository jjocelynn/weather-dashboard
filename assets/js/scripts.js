let APIKey = "d052d09f2d383be8f3bac08e6cde5910";
let search = document.querySelector("#search");
let forecastUrl;
let historyArr = [];
let city;

$(function () {
    historyArr = JSON.parse(localStorage.getItem("location")) || [];
    console.log(historyArr);
    for (i = 0; i < historyArr.length; i++) {
        createBtns(historyArr[i]);
    }
})

////////////////////// search button pressed ///////////////////////
//when search button is pressed (search is saved, put in a url, fetch is run)
$("#searchBtn").click(function (event) {
    event.preventDefault();

    city = search.value;
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";
    console.log(city + " " + queryUrl);

    //fetches url. if url returns valid, save history(in array and button), then run display content function)
    fetch(queryUrl)
        .then(function (response) {
            if (response.ok) {
                $("#valid").text("");
                if (historyArr.includes(city)) {
                    console.log("already searched")
                } else {
                    console.log("adding to list");
                    historyArr.push(city);
                    localStorage.setItem("location", JSON.stringify(historyArr));
                    createBtns(city);
                }
                return response.json();
            } else {
                $("#valid").text("Sorry, nothing came up. Please try again")
            }
        })
        .then(function (responseData) {
            display(responseData);
        });
})

//////////////////////function that creates history buttons///////////////
let createBtns = function (btnLocation) {
    let historyBtns = document.createElement("button");
    historyBtns.textContent = btnLocation;
    historyBtns.setAttribute("type", "button");
    historyBtns.setAttribute("class", "btn btn-primary border-bottom");
    $("#history").append(historyBtns);
}

//////////////////////displays current stats//////////////////////////////
let display = function (data) {
    console.log(data);

    //card title (location, date, and icon)
    let location = data["name"];
    let date = dayjs().format("M/DD/YYYY");
    let iconId = data["weather"][0]["icon"];
    let iconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png"
    let iconImg = document.createElement("img");
    iconImg.setAttribute("src", iconUrl);
    iconImg.setAttribute("alt", "weather icon");

    $("#location").text(location + " (" + date + ")");
    $("#location").append(iconImg);


    //body information (current weather conditions)
    let temp = data["main"]["temp"];
    let wind = data["wind"]["speed"];
    let humidity = data["main"]["humidity"];
    $("#currentTemp #temp").text(temp);
    $("#currentTemp #wind").text(wind);
    $("#currentTemp #humidity").text(humidity);

    //returning 5 day forecast information
    let lat = data["coord"]["lat"];
    let lon = data["coord"]["lon"];
    forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric&cnt=50";
    forecast();
};


////////////////////////displays 5 day forcasted weather//////////////////////
let forecast = function () {
    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(forecastUrl)
            console.log(data);
            //let temp = data["list"][""]
        })
}


///////////////////////////when a button is clicked in the history///////////////////
$("#history").click(function (event) {
    let locationClick = event.target.textContent;
    console.log(locationClick);

    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + locationClick + "&appid=" + APIKey + "&units=metric";
    console.log(locationClick + " " + queryUrl);

    fetch(queryUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (responseData) {
            display(responseData);
        })
});


//useful: https://openweathermap.org/current#data