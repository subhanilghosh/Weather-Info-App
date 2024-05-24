const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", (req, res) => {
  const API_KEY = process.env.API_KEY;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  const cityname = req.body.cityname;
  axios
    .get(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityname +
        "&appid=" +
        API_KEY +
        "&units=metric"
    )
    .then((response) => {
      const data = response.data;
      const temp = data.main.temp;
      const mintemp = data.main.temp_min;
      const maxtemp = data.main.temp_max;
      const pressure = data.main.pressure;
      const humidity = data.main.humidity;
      const desc = data.weather[0].description;
      const icon = data.weather[0].icon;
      const iconurl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write(`<style type="text/css">
                body {
                    background-color: DodgerBlue;
                    text-align: center;
                }
                .container {
                    background-color: Lavender;
                    width: 500px;
                    border-style: dashed;
                    border-radius: 15px;
                    margin-left: 30%;
                    margin-top: 100px;
                }
                </style>`);
      res.write("<div class='container'>");
      res.write(
        "<h1>Temperature in " + cityname + " is " + temp + "&deg;C</h1>"
      );
      res.write("<h2> min temp : " + mintemp + "</h2>");
      res.write("<h2> max temp : " + maxtemp + "</h2>");
      res.write("<h2> pressure : " + pressure + "</h2>");
      res.write("<h2> humidity : " + humidity + "</h2>");
      res.write("<h2> condition : " + desc + "</h2>");
      res.write("<img src = " + iconurl + ">");
      res.write("</div>");
      res.send();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error! unable to fetch weather data");
    });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
