let APIKey = "d052d09f2d383be8f3bac08e6cde5910";
let search = document.querySelector("#search");
let forecastUrl;
let historyArr = [];
let city;

////////////////////// function runs on page load ///////////////////
$(function () {
    historyArr = JSON.parse(localStorage.getItem("location")) || [];
    console.log("previous history: " + historyArr);
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

    //fetches url. if url returns valid, save history(in array and button), then run display content function)
    fetch(queryUrl)
        .then(function (response) {
            if (response.ok) {
                $("#valid").text("");
                if (historyArr.includes(city)) {
                    console.log(city + " is already in search history")
                } else {
                    console.log("adding " + city + " to search history");
                    historyArr.push(city);
                    localStorage.setItem("location", JSON.stringify(historyArr));
                    createBtns(city);
                }
                return response.json();
            } else {
                $("#valid").text("Sorry, nothing came up. Please try again");
            }
        })
        .then(function (responseData) {
            display(responseData);
        });
})

///////////////////// function that creates history buttons ///////////////
let createBtns = function (btnLocation) {
    let historyBtns = document.createElement("button");
    historyBtns.textContent = btnLocation;
    historyBtns.setAttribute("type", "button");
    historyBtns.setAttribute("class", "btn btn-primary border mb-2 custom-bg");
    $("#history").append(historyBtns);
}

////////////////////// displays current stats //////////////////////////////
let display = function (data) {
    //card title (location, date, and icon)
    let location = data["name"];
    let date = dayjs().format("M/DD/YYYY");
    let iconId = data["weather"][0]["icon"];
    let iconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png"
    let iconImg = document.createElement("img");
    iconImg.setAttribute("style", "width:10%");
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
    forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";
    forecast();
};

////////////////////// displays 5 day forcasted weather (at noon) //////////////////////
let forecast = function () {
    let forecastArr = [];
    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (i = 0; i < data.list.length; i++) {
                let today = dayjs().format("YYYY-MM-DD");
                let dayAndTime = data["list"][i]["dt_txt"].split(" ");
                let day = dayAndTime[0];
                let time = dayAndTime[1];

                if ((today < day) && (time == "12:00:00")) {
                    let date = dayjs(day).format("MM/DD/YYYY");
                    let icon = data["list"][i]["weather"][0]["icon"];
                    let temp = data["list"][i]["main"]["temp"];
                    let wind = data["list"][i]["wind"]["speed"];
                    let humidity = data["list"][i]["main"]["humidity"];

                    let forecastDay = {
                        date: date,
                        icon: icon,
                        temp: temp,
                        wind: wind,
                        humidity: humidity
                    }
                    forecastArr.push(forecastDay);
                }
            }
            for (i = 0; i < forecastArr.length; i++) {
                let day = "";
                day = "#day" + (i + 1); //to select div id from html
                document.querySelector(day).querySelector(".icon").textContent = ""; //setting value to nothing (incase there is already an icon)

                let date = forecastArr[i]["date"];
                let temp = forecastArr[i]["temp"];
                let wind = forecastArr[i]["wind"];
                let humidity = forecastArr[i]["humidity"];

                let iconId = forecastArr[i]["icon"];
                let iconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png"

                let iconImg = document.createElement("img");
                iconImg.setAttribute("src", iconUrl);
                iconImg.setAttribute("alt", "weather icon");

                document.querySelector(day).querySelector(".card-title").textContent = date;
                document.querySelector(day).querySelector(".icon").append(iconImg);
                document.querySelector(day).querySelector(".temp").textContent = temp;
                document.querySelector(day).querySelector(".wind").textContent = wind;
                document.querySelector(day).querySelector(".humidity").textContent = humidity;
            }
        })




}

////////////////////// when a button is clicked in the history ///////////////////
$("#history").click(function (event) {
    let locationClick = event.target.textContent;
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + locationClick + "&appid=" + APIKey + "&units=metric";

    fetch(queryUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (responseData) {
            display(responseData);
        })
});


//useful: https://openweathermap.org/current#data