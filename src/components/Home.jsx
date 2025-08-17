import NavBar from "./NavBar";
import { useState, useEffect, use } from "react";
import mapIcon from "../assets/mapIcon.png";
const Home = () => {
  const [location, setLocation] = useState({
    lat: "",
    lng: "",
  });
  const [city, setCity] = useState("");
  const [mainCity, setMainCity] = useState("");
  const [cityIMGURL, setCityIMGURL] = useState("");
  const [error, setError] = useState("");
  const [cityDescription, setCityDescription] = useState("");
  const [cityExtract, setCityExtract] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [weatherText, setWeatherText] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [temp, setTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [visibility, setVisibility] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [precipitation, setPrecipitation] = useState("");
  const [currency, setCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [flagURL, setFlagURL] = useState("");
  const [is24hr, setIs24hr] = useState(true);
  const [localTime, setLocalTime] = useState("");
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    async function mycityResponse() {
      if (!location.lat || !location.lng) return;
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.lat}&longitude=${location.lng}&localityLanguage=en`
        );
        const data = await response.json();
       
        setCity(data.locality);
        
        setMainCity(data.city);
        setState(data.principalSubdivision);
        setCountry(data.countryName);
      } catch (err) {
        setError("Failed to fetch city data.");
       
      }
    }
    mycityResponse();
  }, [location.lat, location.lng]);

  useEffect(() => {
    async function fetchCityDetails() {
      if (!city) return;
      try {
        console.log("inside fetchCityDetails");
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          city
        )}`;
        const response = await fetch(proxyUrl + encodeURIComponent(wikiUrl));
        const cityData = await response.json();
      
        if (cityData.originalimage && cityData.originalimage.source) {
          setCityIMGURL(cityData.originalimage.source);
         
          setCityDescription(cityData.description);
          setCityExtract(cityData.extract);
        } else {
          setCityIMGURL("");
        }
      } catch (err) {
        setError("Failed to fetch city details.");
        console.log(err);
      }
    }
    fetchCityDetails();
  }, [city]);
  useEffect(() => {
    async function fetchWeather() {
      
      if (!city) return;
      try {
        
        const APIkey = import.meta.env.VITE_WEATHERAPI_KEY;
        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${encodeURIComponent(
            city
          )}`
        );
        const weatherData = await response.json();
       
        setWeatherText(weatherData.current.condition.text);
        setWeatherIcon(weatherData.current.condition.icon);
        setTemp(weatherData.current.temp_c);
        setFeelsLike(weatherData.current.feelslike_c);
        setVisibility(weatherData.current.vis_km);
        setHumidity(weatherData.current.humidity);
        setWind(weatherData.current.wind_kph);
        setPrecipitation(weatherData.current.precip_mm);
      } catch (err) {
        setError("Failed to fetch weather data.");
        console.log(err);
      }
    }
    fetchWeather();
  }, [city]);

  useEffect(() => {
    async function fetchCurrency() {
      if (!country) return;
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
            country
          )}?fullText=true`
        );
        const data = await response.json();
       
        const currencyObj = data[0].currencies;
        const currencyCode = Object.keys(currencyObj)[0];
        setFlagURL(data[0].flags.png);
        setCurrency(currencyCode);
      } catch (err) {
        setError("Failed to fetch currency data.");
        console.log(err);
      }
    }
    fetchCurrency();
  }, [country]);
  useEffect(() => {
    if (!currency) return;
    async function fetchExchangeRate() {
      try {
        const response = await fetch(
          `https://api.frankfurter.app/latest?from=USD&to=${currency}`
        );
        const data = await response.json();
        setExchangeRate(data.rates[currency]);
      } catch (err) {
        setError("Failed to fetch exchange rate data.");
        console.log(err);
      }
    }
    fetchExchangeRate();
  }, [country, currency]);
  useEffect(() => {
    if (!exchangeRate) return;
    
  }, [exchangeRate]);
  useEffect(() => {
    async function fetchLocalTime() {
      if (!location.lat || !location.lng) return;
      try {
        const APIKEY = import.meta.env.VITE_TIMEZONEDB_KEY;
        const response = await fetch(
          `https://api.timezonedb.com/v2.1/get-time-zone?key=${APIKEY}&format=json&by=position&lat=${location.lat}&lng=${location.lng}`
        );
        const data = await response.json();
        
        const initialTime = new Date(data.formatted);
        setLocalTime(initialTime);
      } catch (err) {
        setError("Failed to fetch local time data.");
        console.log(err);
      }
    }
    fetchLocalTime();
  }, [location.lat, location.lng]);

  useEffect(() => {
    if (!localTime) return;

    const interval = setInterval(() => {
      setLocalTime((prevTime) => new Date(new Date(prevTime).getTime() + 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [localTime]);
  const formatTime = (time) => {
    if (!time) return "";
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24hr,
    };
    return time.toLocaleTimeString("en-US", options);
  };
  const formatDay = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <NavBar />
      <div className="flex w-full h-full justify-center flex-row gap-4">
        <div className="flex flex-col items-center gap-4 w-1/2 p-4">
          <div className="flex flex-col items-center">
            <a
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(city)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cityIMGURL && (
                <img
                  src={
                    cityIMGURL ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1200px-Mumbai_03-2016_30_Gateway_of_India.jpg"
                  }
                  alt={city}
                  className="w-72 h-60 rounded-2xl border-4 border-white shadow-lg hover:scale-110 transition-transform duration-300"
                />
              )}
            </a>
          </div>
          <div className="flex flex-col justify-center gap-4 pt-8 px-20 bg-white/10 pb-8 rounded-2xl ">
            <div className="flex justify-center items-center gap-2">
              <h1 className="text-3xl font-bold text-white cityName">
                Welcome to {city || "Mumbai"}
              </h1>
              <div className="flex items-center justify-center m-2 bg-white w-8 h-8 rounded-2xl hover:bg-white/20 transition-colors duration-300">
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={mapIcon} alt="" className="w-4" />
                </a>
              </div>
            </div>

            <p className="text-lg text-white">
              {cityDescription || "Financial capital of India"}
            </p>
            <p className="text-lg text-white">
              {cityExtract ||
                "Mumbai, also known as Bombay, is the capital city of the Indian state of Maharashtra. Mumbai is the financial capital and the most populous city proper of India with an estimated population of 12.5 million (1.25 crore). Mumbai is the centre of the Mumbai Metropolitan Region, which is among the most populous metropolitan areas in the world with a population of over 23 million. Mumbai lies on the Konkan coast on the west coast of India and has a deep natural harbour. In 2008, Mumbai was named an alpha world city. Mumbai has the highest number of billionaires out of any city in Asia."}
            </p>
            <p className="text-lg text-white">
              {city}, {mainCity}, {state}, {country}
            </p>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 w-1/2 p-4 ">
          <div className="flex flex-col items-center gap-4 pt-8 w-4/5 bg-white/10 pb-8 rounded-2xl">
            <h1 className="text-3xl font-bold text-white cityName">
              Weather in {city || "Mumbai"}
            </h1>
            <div className="flex items-center justify-evenly w-full">
              <div className="flex justify-center gap-2 flex-col">
                <div className="flex items-center">
                  <img src={weatherIcon} alt="" />
                  <span className="text-4xl text-white">
                    {Math.round(temp)}°C
                  </span>
                </div>
                <span className="text-lg text-white text-center">
                  {weatherText}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg text-white">
                  Feels like {Math.round(feelsLike)}°C
                </span>
                <div className="flex items-center gap-6 text-white">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    <span>{visibility}km</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3.25C12 3.25 7 9.5 7 13a5 5 0 0010 0c0-3.5-5-9.75-5-9.75z"
                      />
                    </svg>
                    <span>{humidity}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 12h16M2 16h12a4 4 0 100-8H6"
                      />
                    </svg>
                    <span>{wind}km/h</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 13v-1a4 4 0 10-8 0v1M8 17h.01M12 17h.01M16 17h.01"
                      />
                    </svg>
                    <span>{precipitation}mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 pt-8 w-4/5 bg-white/10 pb-8 rounded-2xl">
            <h1 className="text-3xl font-bold text-white cityName">
              Exchange rate in {country || "India"}
            </h1>
            <div className="flex items-center gap-2 text-white text-xl pt-6">
              <img
                src="https://flagpedia.net/data/flags/w1600/us.png"
                alt="USA"
                className="w-10 h-8"
              />
              <span>
                1 USD = {exchangeRate} {currency}
              </span>
              <img src={flagURL} alt="" className="w-10 h-8" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 pt-4 w-4/5 bg-white/10 pb-8 rounded-2xl">
            <h1 className="text-white cityName text-3xl">
              Local Time in {city}
            </h1>
            <div className="flex items-center gap-2 text-white text-xl">
              <span className="text-white text-3xl cityName">
                {formatTime(localTime)}
              </span>
              <button
                onClick={() => setIs24hr(!is24hr)}
                className="px-2 py-2 bg-white/10 rounded-3xl hover:bg-white/30 transition-colors duration-300 flex items-center"
                title={is24hr ? "Switch to 12-hour" : "Switch to 24-hour"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6h4"
                  />
                  {/* <text x="12" y="20" textAnchor="middle" fontSize="6" fill="white">{is24hr ? "24" : "12"}</text> */}
                </svg>
              </button>
            </div>
            <div>
              <span className="text-2xl font-bold text-white cityName">
                {formatDay(localTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
