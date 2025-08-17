import { createSlice, current } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  city: '',
  cityName: '', 
  cityIMGURL: '',
  cityDescription: '',
  cityExtract: '',
  cityLocation: { lat: 0, lng: 0 },
  error: '',
  loading: false,
  cityState: '',
  country: '',
  weatherText: '',
  weatherIcon: '',
  temperature: '',
  feelsLike: '',
  windSpeed: '',
  humidity: '',
  visibility: '',
  precipitation: '',
  currency: '',
  localtime: '',
  apiStatus: 0,
  currentLocation: {
    lat: 0,
    lng: 0,
  },
  toCityState: '',
  toCountry: '',
  toCurrencyCode: '',
  toCountryIMGURL: '',  
  countryIMGURL: '',
  currencyCode: '',
  exchangeRate: 0,
  toTimezone: '',
  toggleChatBox: false,

}

export const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    fetchCityDataStart: (state) => {
      state.loading = true
      state.error = ''
    },
    fetchCityDataSuccess: (state,action) => {
      state.city = action.payload.city
      state.cityName = action.payload.cityName    
      state.cityIMGURL = action.payload.cityIMGURL
      state.cityDescription = action.payload.cityDescription
      state.cityExtract = action.payload.cityExtract
      state.cityLocation = action.payload.cityLocation
      state.error = ''

    },
    fetchCityDataFailure: (state, action) => {
      state.error = action.payload.error
    },
    fetchCityWeatherDataStart: (state) => {
      state.error = ''
    },
    fetchCityWeatherDataSuccess: (state, action) => {
      state.weatherText = action.payload.weatherText
      state.weatherIcon = action.payload.weatherIcon
      state.temperature = action.payload.temperature
      state.feelsLike = action.payload.feelsLike
      state.windSpeed = action.payload.windSpeed
      state.humidity = action.payload.humidity
      state.visibility = action.payload.visibility
      state.precipitation = action.payload.precipitation
    },
    fetchWeatherCityDataFailure: (state, action) => {
      state.error = action.payload.error
    },
    updateCurrentLocationData: (state, action) => {
      state.currentLocation = {
        lat: action.payload.lat,
        lng: action.payload.lng,
      }
      state.cityState = action.payload.cityState || '';
      state.country = action.payload.country || '';



    },
    updateToLocationData: (state, action) => {
      state.toCountry = action.payload.toCountry || '';
      state.toCityState = action.payload.toCityState || '';
  },
    fetchExcchangeRateData: (state, action) => {
      state.exchangeRate = action.payload.exchangeRate || 0;
    },
    fetchCountryData: (state, action) => {
      state.country = action.payload.country || '';
      state.currencyCode = action.payload.currencyCode || '';
      state.countryIMGURL = action.payload.countryIMGURL || '';
      state.is24hr = action.payload.is24hr || false;
      state.localtime = action.payload.localtime || '';
    },
    fetchtoCountryData: (state, action) => {
      state.toCountry = action.payload.toCountry || '';
      state.toCurrencyCode = action.payload.toCurrencyCode || '';
      state.toCountryIMGURL = action.payload.toCountryIMGURL || '';
      
    },
    fetchToTimezoneData: (state, action) => {
      state.toTimezone = action.payload.toTimezone || '';
    },
    loadingComplete: (state) => {
      state.loading = false;
      state.error = '';
    },
}
})

export const { fetchCityDataFailure, fetchCityDataSuccess, fetchCityDataStart, fetchCityWeatherDataStart,
  fetchWeatherCityDataFailure, fetchCityWeatherDataSuccess, updateCurrentLocationData, updateToLocationData,
  fetchExcchangeRateData, fetchCountryData, fetchtoCountryData, fetchToTimezoneData,loadingComplete,
          } = travelSlice.actions

export default travelSlice.reducer;

export const fetchCityData = (city) => async (dispatch, getState) => {
  try {
    dispatch(fetchCityDataStart());
    const proxyUrlWiki = 'https://api.allorigins.win/raw?url=';
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`;
    const responseWiki = await fetch(proxyUrlWiki + encodeURIComponent(wikiUrl));
    if (!responseWiki.ok) {
      throw new Error('City data not found');
    }
    const cityData = await responseWiki.json();
    dispatch(fetchCityDataSuccess({
      city,
      cityName: cityData.title,
      cityIMGURL: cityData.originalimage?.source || '',
      cityDescription: cityData.description,
      cityExtract: cityData.extract,
      apiStatus: responseWiki.status,
      cityLocation: {
        lat: cityData.coordinates?.lat || 0,
        lng: cityData.coordinates?.lon || 0
      }
    }));
    
    if (responseWiki.status === 404) {
      toast.error('City not found');
      return;
    }


  
    dispatch(fetchCityWeatherDataStart());
    const APIkey = import.meta.env.VITE_WEATHERAPI_KEY;
    const weatherResponse = await fetch(`https://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${encodeURIComponent(city)}`);
    if (!weatherResponse.ok) {
      throw new Error('Weather data not found');
    }
    const weatherData = await weatherResponse.json();
    dispatch(fetchCityWeatherDataSuccess({
      weatherText: weatherData.current.condition.text,
      weatherIcon: weatherData.current.condition.icon,
      temperature: weatherData.current.temp_c,
      feelsLike: weatherData.current.feelslike_c,
      windSpeed: weatherData.current.wind_kph,
      humidity: weatherData.current.humidity,
      visibility: weatherData.current.vis_km,
      precipitation: weatherData.current.precip_mm
    }));
 

  
    window.navigator.geolocation.getCurrentPosition(async (position) => {
      const currLat = position.coords.latitude;
      const currLng = position.coords.longitude;
    
        const responseGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${currLat}&longitude=${currLng}&localityLanguage=en`);
        if (!responseGeo.ok) {
          throw new Error('Location data not found');
        }
        const currentLocationData = await responseGeo.json();
        
        dispatch(updateCurrentLocationData({
          lat: currentLocationData.latitude,
          lng: currentLocationData.longitude,
          country: currentLocationData.countryName,
          cityState: currentLocationData.principalSubdivision,

      }));
        
     
    });

    // await new Promise((resolve) => {
    //   window.navigator.geolocation.getCurrentPosition(async (position) => {
    //   const lat = position.coords.latitude;
    //   const lng = position.coords.longitude;
    //   const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${currLat}&longitude=${currLng}&localityLanguage=en`);
    //   const currentLocationData = await response.json();
    //   console.log("This is current location data:", currentLocationData);
    //   dispatch(updateCurrentLocationData(
    //     {
    //        lat: currentLocationData.latitude,
    //        lng: currentLocationData.longitude,
    //        country: currentLocationData.countryName,
    //        cityState: currentLocationData.principalSubdivision,

    //   }
    //   ));
    //   resolve(); 
    //   });
    // });


  
    const cityLoc = getState().travel.cityLocation;
    const cityLat = cityLoc.lat;
    const cityLng = cityLoc.lng;
    const responseToLoc = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${cityLat}&longitude=${cityLng}&localityLanguage=en`);
    if (!responseToLoc.ok) { 
      throw new Error('To location data not found');
    } 
    const toLocationData = await responseToLoc.json();
    
    dispatch(updateToLocationData({
      toCountry: toLocationData.countryName,
      toCityState: toLocationData.principalSubdivision,
    }));
  
  

    const country = getState().travel.country;
    const responseCountry = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=true`);
    if (!responseCountry.ok) {
      throw new Error('Country data not found');
    }
    const countryData1 = await responseCountry.json();
    
    const countryInfo1 = countryData1[0];
    dispatch(fetchCountryData({
      currencyCode: countryInfo1.currencies ? Object.keys(countryInfo1.currencies)[0] : '',
      country: countryInfo1.name.common,
      countryIMGURL: countryInfo1.flags?.png || '',
    }));



    const toCountry = getState().travel.toCountry;
    const responseToCountry = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(toCountry)}?fullText=true`);
    if (!responseToCountry.ok) {
      throw new Error('Country2 data not found');
    }
    const countryData2 = await responseToCountry.json();
    const countryInfo2 = countryData2[0];
    
    dispatch(fetchtoCountryData({
      toCurrencyCode: countryInfo2.currencies ? Object.keys(countryInfo2.currencies)[0] : '',
      toCountry: countryInfo2.name.common,
      toCountryIMGURL: countryInfo2.flags?.png || '',  
    }));
  


    const toCurrencyCode = getState().travel.toCurrencyCode;
    const currencyCode = getState().travel.currencyCode;
    const APIKEY = import.meta.env.VITE_EXCHANGERATE_API_KEY;
    const proxyUrlExchange = 'https://api.allorigins.win/raw?url=';
    const exchangeUrl = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest/${toCurrencyCode}`;
    const responseExchange = await fetch(proxyUrlExchange + encodeURIComponent(exchangeUrl));
    if (!responseExchange.ok) {
      throw new Error('Exchange rate data not found');
    }
    const exchangeRateData = await responseExchange.json();
    const exchangeRate = exchangeRateData.conversion_rates[currencyCode];
    dispatch(fetchExcchangeRateData({
      exchangeRate: exchangeRate || 0,
    }));


 
    const cityLoc2 = getState().travel.cityLocation;
    const cityLat2 = cityLoc2.lat;
    const cityLng2 = cityLoc2.lng;
    const timezoneAPIKEY = import.meta.env.VITE_TIMEZONEDB_KEY;
    const responseTimezone = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneAPIKEY}&format=json&by=position&lat=${cityLat2}&lng=${cityLng2}`);
    if (!responseTimezone.ok) {
      throw new Error('Timezone data not found');
    }
    const timezoneData = await responseTimezone.json();
    
    dispatch(fetchToTimezoneData({
      toTimezone: timezoneData.formatted || '',
    }));

    dispatch(loadingComplete());
  }
  catch (error) {
    console.error('Error fetching city data:', error);
    dispatch(fetchCityDataFailure({ error: error.message }));
    // toast.error('Error fetching city data: ' + error.message);
        dispatch(loadingComplete());

  }
  finally {
    dispatch(loadingComplete());
  }

}