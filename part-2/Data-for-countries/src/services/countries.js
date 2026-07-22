import axios from "axios";
const baseURL = `https://studies.cs.helsinki.fi/restcountries/api/all`;

const getCountries = (input) => {
  const request = axios.get(baseURL);
  return request.then((response) => response.data);
};

const getWeather = (capital) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  console.log(`Fetching weather of ${capital}`);
  const request = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`,
  );
  return request.then((response) => response.data);
};

export default { getCountries, getWeather };
