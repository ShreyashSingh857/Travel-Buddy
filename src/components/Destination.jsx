import React, { use } from "react";
import NavBar from "./NavBar";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import mapIcon from "../assets/mapIcon.png";
import { fetchCityData } from "../features/travelSlice";
import Loader from "./Loader";
const Destination = () => {
  const { id } = useParams();
  const [city, setCity] = useState("");
  
  useEffect(() => {
    setCity(id);
  }, [id]);
  const [myLocation, setMyLocation] = useState({
    lat: 0, 
    lng: 0,
  });
  
  const error = useSelector((state) => state.travel.error);
  const cityIMGURL = useSelector((state) => state.travel.cityIMGURL);
  const cityDescription = useSelector((state) => state.travel.cityDescription);
  const cityExtract = useSelector((state) => state.travel.cityExtract);
  const cityName = useSelector((state) => state.travel.cityName);
  const cityLocation = useSelector((state) => state.travel.cityLocation);
  const weatherText = useSelector((state) => state.travel.weatherText);
  const weatherIcon = useSelector((state) => state.travel.weatherIcon);
  const temperature = useSelector((state) => state.travel.temperature);
  const feelsLike = useSelector((state) => state.travel.feelsLike);
  const windSpeed = useSelector((state) => state.travel.windSpeed);
  const humidity = useSelector((state) => state.travel.humidity);
  const visibility = useSelector((state) => state.travel.visibility);
  const precipitation = useSelector((state) => state.travel.precipitation);
  const cityState = useSelector((state) => state.travel.cityState);
  const country = useSelector((state) => state.travel.country);
  const toCityState = useSelector((state) => state.travel.toCityState);
  const toCountry = useSelector((state) => state.travel.toCountry); 
  const toCurrencyCode = useSelector((state) => state.travel.toCurrencyCode);
  const currencyCode = useSelector((state) => state.travel.currencyCode);
  const exchangeRate = useSelector((state) => state.travel.exchangeRate);
  const toCountryIMGURL = useSelector((state) => state.travel.toCountryIMGURL);
  const countryIMGURL = useSelector((state) => state.travel.countryIMGURL);
  const toTimezone = useSelector((state) => state.travel.toTimezone); 
  const [is24hr, setIs24hr] = useState(true);
  const [toTime, setToTime] = useState("");
  const loading = useSelector((state) => state.travel.loading);
  const toggleChatBox = useSelector((state) => state.travel.toggleChatBox);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCityData(city));
  }, [dispatch, id, city]);
  
  
  useEffect(() => {
    if (!toTimezone) return;
    setToTime(new Date(toTimezone));
    const interval = setInterval(() => {
      setToTime((prevTime) => new Date(new Date(prevTime).getTime() + 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [toTimezone]);
  const formatTime = (time) => {
    if (!time) return "";
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24hr,
    };
    return new Date(time).toLocaleTimeString("en-US", options);
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
  

  if (loading) return <Loader />;

  return (
    <div>
      <NavBar />
      <div className="flex w-full h-full justify-center flex-row gap-4">
        <div className="flex flex-col items-center lg:w-1/2 p-4 md:w-full sm:w-full">
          <div>
            <a
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(city)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={cityIMGURL}
                alt={city}
                className="w-72 h-60 rounded-2xl border-4 border-white shadow-lg hover:scale-110 transition-transform duration-300"
              />
            </a>
          </div>
          <div className="mt-4 rounded-2xl bg-white/10 p-4 shadow-lg gap-4">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-bold text-white cityName text-center ">
                {cityName}
              </h1>
              <div className="flex items-center justify-center m-2 bg-white w-8 h-8 rounded-2xl hover:bg-white/20 transition-colors duration</h1>-300">
                <a
                  href={`https://www.google.com/maps?q=${cityLocation.lat},${cityLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={mapIcon} alt="" className="w-4" />
                </a>
              </div>
            </div>
            <p className="text-white text-xl mt-2 text-center ">
              {cityDescription}
            </p>
            <p className="text-white text-lg mt-2">{cityExtract}</p>
            <p className="text-white text-lg mt-2">{cityName}, {toCityState}, {toCountry}</p>
          </div>
        </div>
        <div className="flex flex-col items-center lg:w-1/2 p-4 gap-4 md:w-full sm:w-full">
          <div className="w-4/5 bg-white/10 p-4 rounded-2xl shadow-lg flex flex-col items-center pt-8 pb-8">
            <h1 className="text-3xl cityName text-white text-center">
              Weather in {cityName}
            </h1>
            <div className="flex items-center w-full justify-evenly pt-2">
              <div className="mt-4 text-white text-lg flex flex-col items-center">
                <div className="flex items-center justify-center">
                  <img
                    src={weatherIcon}
                    alt={weatherText}
                    className="w-16 h-16"
                  />
                  <p className="text-white text-4xl">
                    {Math.round(temperature)}°C
                  </p>
                </div>
                <p className="text-white text-center text-lg">{weatherText}</p>
              </div>
              <div className="text-white text-lg flex flex-col items-center gap-2">
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
                    <span className="text-[16px]">{visibility}km</span>
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
                    <span className="text-[16px]">{humidity}%</span>
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
                    <span className="text-[16px]">{windSpeed}km/h</span>
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
                    <span className="text-[16px]">{precipitation}mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 flex flex-col items-center gap-4 pt-8 w-4/5 bg-white/10 pb-8 rounded-2xl">
            <h1 className="text-3xl font-bold text-white cityName">
              Exchange rate in {country} and {toCountry}
            </h1>
            <div className="flex items-center gap-2 text-white text-xl pt-6">
              <img
                src={toCountryIMGURL}
                alt={toCountry}
                className="w-10 h-8"
              />
              <span>
                1 {toCurrencyCode} = {exchangeRate} {currencyCode}
              </span>
              <img src={countryIMGURL} alt={country} className="w-10 h-8" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 pt-4 w-4/5 bg-white/10 pb-8 rounded-2xl">
            <h1 className="text-white cityName text-3xl">
              Local Time in {city}
            </h1>
            <div className="flex items-center gap-2 text-white text-xl">
              <span className="text-white text-3xl cityName">
                {formatTime(toTime)}
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
                {formatDay(toTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destination;
