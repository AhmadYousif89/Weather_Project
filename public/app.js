const apiKey = "&appid=c0e5f9ecddf707c444289b7f0a8dd9f5&units=metric";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const dt = new Date().toLocaleString();
const date = document.querySelector("#date");
const zipCode = document.getElementById("zip");
const city = document.querySelector("#city");
const generate = document.querySelector(".btn");
const recentData = document.querySelector(".show");
const errMsg = document.querySelector("div.error");
const errMsg2 = document.querySelector("small.error");
const dataErrMsg = document.querySelector(".showdata");
const img = document.querySelector("#icon");
const tmp = document.querySelector("#temp");
const desc = document.querySelector("#desc");
const cityName = document.querySelector("#cityname");
const coordinates = document.querySelector("#coords");

// Fetch data from weather API (GET)
const getWeatherData = async () => {
  const response = await fetch(
    `${apiUrl}${zipCode.value.trim()}${city.value.trim()}${apiKey}`
  );
  const data = await response.json();
  console.log(data);
  try {
    if (data.cod == 200) {
      // Deconstructing incoming {data}...
      const {
        weather: [{ icon, description }],
        main: { temp, feels_like },
        name: cityname,
        sys: { country },
        coord: { lat, lon },
      } = data;
      const myData = {
        dt,
        icon,
        temp,
        feels_like,
        description,
        cityname,
        country,
        lat,
        lon,
      };
      // Send the new data to the server.
      sendData("/post", myData);
      try {
        // Display the new data to UI.
        dataErrMsg.textContent = "";
        img.src = `https://openweathermap.org/img/w/${icon}.png`;
        tmp.innerHTML = `${temp}<span>°</span> C`;
        desc.textContent = `${description}`;
        date.textContent = `${dt}`;
        cityName.innerHTML = `City of <span>${cityname}</span> in <span>${country}</span> `;
        coordinates.innerHTML = `long : [ <span>${lon}</span> ] lat : [ <span>${lat}</span> ]`;
        city.value = "";
        zipCode.value = "";
      } catch (err) {
        console.log("Error : " + err);
      }
    } else {
      errMsg.innerHTML = `Enter valid <strong>zip code</strong> or <strong>city name</strong>`;
      city.value = "";
      zipCode.value = "";
      hideErrMsg();
    }
  } catch (err) {
    console.log("Error : " + err);
  }
};

// Send fetched data to the server (POST)
const sendData = async (url, data = {}) => {
  await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// Display most recent data fetched from the server (GET)
const showRecent = async () => {
  const res = await fetch("/post");
  const data = await res.json();
  try {
    if (data.constructor !== Object) {
      dataErrMsg.textContent = "No Recent Data";
    } else {
      dataErrMsg.textContent = "";
      img.src = `https://openweathermap.org/img/w/${data.icon}.png`;
      tmp.innerHTML = `${data.temp}<span>°</span> C`;
      desc.textContent = `${data.description}`;
      date.textContent = `${data.dt}`;
      cityName.innerHTML = `City of <span>${data.cityname}</span> in <span>${data.country}</span> `;
      coordinates.innerHTML = `long : [ <span>${data.lon}</span> ] lat : [ <span>${data.lat}</span> ]`;
    }
  } catch (err) {
    console.log("Error : " + err);
  }
};

// EventListeners..
recentData.addEventListener("click", () => {
  showRecent();
});
generate.addEventListener("click", () => {
  checkValues();
});

// Helper Functions
/* ************ */
function checkValues() {
  if (city.value && zipCode.value) {
    errMsg2.textContent = "Please Choose One Field";
    hideErrMsg();
  } else {
    checkForSpChar(city.value);
    getWeatherData();
  }
}

function checkForSpChar(e) {
  const specialChars = /[0123456789`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (specialChars.test(e)) {
    city.value = "";
  }
}

function hideErrMsg() {
  setTimeout(() => {
    errMsg.textContent = "";
    errMsg2.textContent = "";
  }, 3000);
}
