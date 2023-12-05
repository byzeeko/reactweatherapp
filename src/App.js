import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, ListGroup } from "react-bootstrap";
import rainImage from './image/rain.png';
import partlyCloudyNight from './image/partly_cloudy_night.png';
import cloudy from './image/cloudy.jpg';
import snowy from './image/snowy.png';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);

  const getDayOfWeek = (dateString) => {
    const daysOfWeek = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  };

  const weatherConditionImages = {
    rain: rainImage,
    partlycloudynight: partlyCloudyNight,
    cloudy: cloudy,
    snow: snowy,
    // Add more conditions and corresponding image paths as needed
  };

  const getWeatherCondition = (hour) => {
    // Vous devrez peut-être ajuster cela en fonction de votre structure de données réelle
    const weatherCondition = hour.icon; // En supposant qu'il y a une propriété 'weather' dans votre objet 'hour'
  
    // Supprimer les tirets de la chaîne de caractères
    const weatherConditionWithoutDashes = weatherCondition.replace(/-/g, '');
  
    return weatherConditionWithoutDashes;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("weatherData");

        if (cachedData) {
          setWeatherData(JSON.parse(cachedData));
          console.log("Données météo récupérées depuis le cache.");
        } else {
          const response = await axios.get(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/creutzwald?unitGroup=metric&key=${process.env.REACT_APP_API_KEY}&contentType=json`
          );

          setWeatherData(response.data);
          console.log("Données météo récupérées avec succès :", response.data);

          localStorage.setItem("weatherData", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données météo",
          error
        );
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {weatherData && weatherData.days && (
        <div>
          {weatherData.days.map((day, index) => (
            <Container
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "grey",
                marginBottom: "200px",
              }}
            >
              <h1 className="text-center">
                {getDayOfWeek(day.datetime)} {day.datetime}
              </h1>
              <p> Température maximale : {day.tempmax} °C </p>
              <p> Température minimum : {day.tempmin} °C </p>

              {/* Liste horizontale des heures */}
              <ListGroup horizontal style={{ overflowX: "auto" }}>
                {day.hours.map((hour, hourIndex) => (
                  <ListGroup.Item key={hourIndex}>
                    <img
                      src={weatherConditionImages[getWeatherCondition(hour)]}
                      alt={getWeatherCondition(hour)}
                      style={{ maxWidth: "50px", maxHeight: "50px" }}
                    />
                    {`${hour.datetime.split(":").slice(0, 2).join(":")} ${hour.temp}°`}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Container>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
