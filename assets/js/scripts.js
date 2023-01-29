let APIKey = "d052d09f2d383be8f3bac08e6cde5910";
let city = document.querySelector("#search");


$("#searchBtn").click(function (event) {
    event.preventDefault();
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city.value + "&appid=" + APIKey + "&units=metric";
    console.log(city.value + " " + queryUrl);

    fetch(queryUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let temp = data["main"]["temp"];
            let wind = data["wind"]["speed"];
            let humidity = data["main"]["humidity"];
            $("#currentTemp #temp").text(temp);
            $("#currentTemp #wind").text(wind);
            $("#currentTemp #humidity").text(humidity);
        });
})