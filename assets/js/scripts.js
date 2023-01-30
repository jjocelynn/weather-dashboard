let APIKey = "d052d09f2d383be8f3bac08e6cde5910";
let search = document.querySelector("#search");
let historyArr = [];
let forecastUrl;

/////////////// Function runs when page is loaded ///////////////
// gets data from local storage and prints it under the search area if there is
$(function () {
    historyArr = JSON.parse(localStorage.getItem("location")) || [];
    for (i = 0; i < historyArr.length; i++) {
        createBtns(historyArr[i]);
    }
})

//////////////// Create buttons (search history) ////////////////
let createBtns = function (locationBtn) {
    let historyBtn = document.createElement("button");
    historyBtn.textContent = locationBtn;
    historyBtn.setAttribute("type", "button");
    historyBtn.setAttribute("class", "btn btn-primary border mb-2 custom-bg");
    $("#history").append(historyBtn);
}

//////////////////////// Search button  /////////////////////////
//when search is pressed (search is saved, put in a url, fetch is run)
$("#searchBtn").click(function () {
    let city = search.value;
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";

    //fetches url. if url is okay, save history, then run display content function. else, prompt user to try again
    fetch(queryUrl)
        .then(function (response) {
            if (response.ok) {
                //clears line if #valid previously had text
                $("#valid").text("");

                //checks if the city has already been searched, if not, add it to the array, create a button, and save it to local storage.
                if (historyArr.includes(city)) {
                    console.log(city + " is already in search history");
                } else {
                    historyArr.push(city);
                    createBtns(city);
                    localStorage.setItem("location", JSON.stringify(historyArr));
                    console.log("adding " + city + " to search history");
                }
                return response.json();
            } else {
                $("#valid").text("Sorry, nothing came up. Please try again");
            }
        })
        .then(function (responseData) {
            displayCurrent(responseData);
        });
})

///////////////////// Display current stats /////////////////////
let displayCurrent = function (data) {
    //card title (location, date, and icon)
    let location = data["name"];
    let date = dayjs().format("M/DD/YYYY");
    let iconId = data["weather"][0]["icon"];
    let iconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png"
    let iconImg = document.createElement("img");
    iconImg.setAttribute("style", "width:13%");
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

    //returning information needed for the 5 day forecast
    let lat = data["coord"]["lat"];
    let lon = data["coord"]["lon"];
    forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";
    forecast();
};

/////////// Display 5-day forecast conditions(at noon) //////////
let forecast = function () {
    let forecastArr = [];
    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //runs through the dataset. If day is larger than today, and time = noon, collect data and add it to an array.
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
            //taking data collected above, and displaying it on the screen
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

//////////////////////// History button /////////////////////////
$("#history").click(function (event) {
    let locationClick = event.target.textContent;
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + locationClick + "&appid=" + APIKey + "&units=metric";

    fetch(queryUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (responseData) {
            displayCurrent(responseData);
        })
});