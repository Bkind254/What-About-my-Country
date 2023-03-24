import React from "react";
import "./Country.css";
import { useState } from "react";

function Country() {
  const [country, setCountry] = useState("");
  const [countryData, setCountryData] = useState(null);

  const renderCountry = (data) => {
    setCountryData(data);
  };

  const getCountryData = (country) => {
    fetch(`https://restcountries.com/v2/name/${country}`)
      .then((response) => response.json())
      .then(([data]) => renderCountry(data))
      .catch((err) => console.error(`${err.message} 💥`));
  };

  /////// Reverse Geocoding ///////
  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const whereAmI = () => {
    getPosition()
      .then((pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        return fetch(
          `https://geocode.xyz/${lat},${lng}?geoit=json&auth=136199543100324234370x124559`
        );
      })
      .then((res) => {
        if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(`You are in ${data.city}, ${data.country}`);

        return fetch(`https://restcountries.com/v2/name/${data.country}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error(`Country not found (${res.status})`);

        return res.json();
      })
      .then(([data]) => renderCountry(data))
      .catch((err) => console.error(`${err.message} 💥`));
  };

  const handleCountryInput = (event) => {
    setCountry(event.target.value);
  };

  const handleSubmit = () => {
    getCountryData(country);
  };

  return (
    <main className="container">
      <div className="countries">
        {countryData ? (
          <article className="country">
            <img className="country__img" src={countryData.flag} />
            <div className="country__data">
              <h3 className="country__name">{countryData.name}</h3>
              <h4 className="country__region">{countryData.region}</h4>
              <p className="country__row">
                <span>👫</span>
                {(+countryData.population / 1000000).toFixed(1)}m people
              </p>
              <p className="country__row">
                <span>🗣</span>
                {countryData.languages.length > 1
                  ? `${countryData.languages[0].name},${countryData.languages[1].name}`
                  : countryData.languages[0].name}
              </p>
              <p className="country__row">
                <span>💰</span>
                {countryData.currencies[0].name}
              </p>
            </div>
          </article>
        ) : (
          <p>Click the button bellow</p>
        )}
      </div>

      <button className="btn-country" onClick={whereAmI}>
        What about my country?
      </button>
      <input
        placeholder="search any other country"
        type="text"
        id="countryInput"
        value={country}
        onChange={handleCountryInput}
      />
      <button className="btn" onClick={handleSubmit}>
        Search
      </button>
    </main>
  );
}

export default Country;
