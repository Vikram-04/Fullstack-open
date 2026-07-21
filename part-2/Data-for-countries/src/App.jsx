import { useEffect, useState } from "react";
import services from "./services/countries";

const Country = ({ data }) => {
  const langs = Object.values(data.languages);
  const langList = langs.map((lang) => <li key={lang}>{lang}</li>);
  const [temp, setTemp] = useState(null);
  const [wind, setWind] = useState(null);
  useEffect(() => {
    try {
      services.getWeather(data.capital).then((cityWeather) => {
        console.log(cityWeather);
        setTemp(cityWeather.main.temp);
        setWind(cityWeather.wind.speed);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div>
      <h2>{data.name.common}</h2>
      <p>Capital: {data.capital}</p>
      <p>Area: {data.area}</p>
      <h3>Languages</h3>
      <ul>{langList}</ul>
      <img src={data.flags.png}></img>
      <h2>Weather in {data.capital}</h2>
      <p>Temperature: {temp} degree celcius</p>
      <p>Wind: {wind} m/s</p>
    </div>
  );
};

const Data = ({ countries, handleShow }) => {
  console.log(countries.length);
  if (countries.length === 0) {
    return null;
  } else if (countries.length > 10) {
    return <p>Too many countries</p>;
  } else if (countries.length > 1) {
    const listItems = countries.map((country) => (
      <li key={country.name.common}>
        {country.name.common}&nbsp;
        <button onClick={() => handleShow(country.name.common)}>show</button>
      </li>
    ));
    return <ul>{listItems}</ul>;
  } else {
    return <Country data={countries[0]}></Country>;
  }
};

function App() {
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    console.log("use effect ran");
    if (country != "") {
      console.log("fetching countries");
      services.getCountries(country).then((data) => {
        setCountries(
          data.filter((c) =>
            c.name.common.toLowerCase().startsWith(country.toLowerCase()),
          ),
        );
      });
    } else {
      setCountries([]);
    }
  }, [country]);

  const handleInput = (event) => {
    setCountry(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleShow = (input) => {
    setCountry(input);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        find countries: <input value={country} onChange={handleInput}></input>
      </form>
      <Data countries={countries} handleShow={handleShow}></Data>
    </>
  );
}

export default App;
