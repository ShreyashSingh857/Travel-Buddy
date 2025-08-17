# Travel Buddy — React + Redux

Find quick facts about any city: summary, images, live weather, exchange rate, and local time. Built with React, Redux Toolkit, and a handful of public APIs.

---

## ✨ Features
- 🔎 **City search** with Wikipedia summary + image  
- 🌦 **Live weather** (condition, temp, humidity, wind, visibility, precipitation)  
- 💱 **Exchange rate** between your country and the destination country  
- 🕒 **Local time** at the destination (12/24-hour toggle)  
- 📍 **Your current location** (reverse-geocoded) and destination map shortcut  
- ⚠️ Robust **loading & error states** with toasts

---

## 🛠 Tech Stack
- **React 18**, **Vite**
- **Redux Toolkit** for state + async thunks
- **React Router**
- **Tailwind CSS** (utility styling)
- **react-toastify** (notifications)

**APIs**
- Wikipedia REST API  
- WeatherAPI  
- BigDataCloud Reverse Geocoding  
- REST Countries  
- ExchangeRate-API  
- TimeZoneDB

---

## 🚀 Getting Started

### 1) Clone & install
```bash
git clone https://github.com/<your-username>/react-travel-buddy.git
cd react-travel-buddy
npm install
```

### 2) Environment variables
Create a file named **`.env.local`** in the project root (same level as `package.json`) and add:

```
VITE_WEATHERAPI_KEY=your_weatherapi_key
VITE_EXCHANGERATE_API_KEY=your_exchangerate_api_key
VITE_TIMEZONEDB_KEY=your_timezonedb_key
```

> Vite only exposes vars that start with `VITE_`.  
> Do **not** add quotes or spaces around `=`.  
> `.env.local` is ignored by Git via `.gitignore`.

### 3) Run dev server
```bash
npm run dev
```

### 4) Build for production
```bash
npm run build
```

---

## 📂 Project Structure
```
src/
  components/
    Destination.jsx
    Home.jsx
    Loader.jsx
    NavBar.jsx
  features/
    store.js
    travelSlice.js
  assets/
  App.jsx
  main.jsx
  index.css
```

---

## 🔗 How It Works (high level)
1. **NavBar** takes a city query and navigates to `/destination/:id`.  
2. **Destination** listens to route param changes and dispatches `fetchCityData(id)`.  
3. **travelSlice** thunks:
   - Wikipedia → city summary, image, coordinates  
   - WeatherAPI → current weather  
   - BigDataCloud → reverse-geocode current position & destination  
   - REST Countries → currency + flags  
   - ExchangeRate-API → conversion rate (dest → home)  
   - TimeZoneDB → formatted local time

---


## 🧪 Troubleshooting
- **Env variable is `undefined`**  
  - Ensure the name starts with `VITE_` and there are **no spaces** around `=`  
  - Restart dev server after editing `.env.local`
- **Geolocation denied**  
  - Browser will block current location; app still works for searched cities  
- **CORS on Wikipedia or ExchangeRate**  
  - We proxy some requests via `https://api.allorigins.win/raw?url=...`

---

## 🗺️ Roadmap (nice-to-haves)
- Favorites / recent searches  
- Better empty/error UI states  
- Unit tests for reducers and thunks  
- PWA offline shell

---

## 📜 License
MIT — feel free to fork and build on it.

---

## 🙌 Credits
- Icons & images via APIs listed above  
- Built with ❤️ using React + Redux

---

### Screenshots
![Home page](./src/assets/Screenshot%202025-08-17%20125834.png)
![Destination page](./src/assets/Screenshot%202025-08-17%20130001.png)