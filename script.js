const tempdiv = document.querySelector(".temp");
const conditiondiv = document.querySelector(".condition span");
const conditionIcon = document.querySelector(".condition img");
const timediv = document.querySelector(".time");
const citydiv = document.querySelector(".cityName");
const searchFormdiv = document.getElementById("searchForm");
const searchInputdiv = document.getElementById("searchInput");
const imgdiv = document.querySelector(".imgdiv");
const WeatherApiKey = "cdc70beb63034d52ab915622251710";
const suggestionDiv = document.querySelector(".suggestion");
const suggestionBtn = document.querySelector("#suggestionBtn");
const AIapiKey = "AIzaSyAPDeUNwi7Cef16mqn0qM0MlquxzD8N0Go";

//please do not try to use the apiKeys, they have a rate limit of 4 requests per minute and 20 requests per day.

let aiCity;
let aiTemperature;
let aiCondition;

document.addEventListener("keydown", (e) => {
  var k = e.key;
  if (((k >= "a" && k <= "z") || (k >= "A" && k <= "Z")) && k.length === 1) {
    searchInputdiv.focus();
  }
});

searchFormdiv.addEventListener("submit", function (event) {
  event.preventDefault();

  let cityname = searchInputdiv.value.trim();
  if (cityname === "") {
    alert("Please enter a valid city name");
    return;
  }
  searchInputdiv.blur();
  weatherApi(cityname);
  searchInputdiv.value = "";
  suggestionDiv.style.display = "none";
  suggestionDiv.textContent = "Please Wait...";
});

async function updateDOM(data) {
  const image = document.createElement("img");
  if (imgdiv.innerHTML != "") {
    imgdiv.innerHTML = "";
  } // removes the previous image first if some image was already present in the imgdiv so that more than 1 images never get attached in the div.
  imgdiv.append(image);
  // const current = data.current;
  // const location = data.location;
  const { location, current } = data; //-- this is known as object destructuring. does the same task as the above 2 commented lines.
  tempdiv.textContent = `Temperature:  ${current.temp_c}°C`;
  // Latitude: ${location.lat}
  // longitude: ${location.lon}  //-- can add this lat/long info in the citydiv.innerText if required.
  citydiv.innerText = `City: ${location.name}

        Country: ${location.country}

        Local Time: ${location.localtime}

        region: ${location.region}

        Time Zone: ${location.tz_id}
    `;
  conditiondiv.textContent = `Condition: ${current.condition.text}`;
  image.src = `https:${current.condition.icon}`;
  image.alt = current.condition.text;
}

async function weatherApi(city) {
  try {
    const url = `https://api.weatherapi.com/v1/current.json?q=${city}&lang=english&key=${WeatherApiKey}
`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Invalid response");
    }

    const data = await response.json();
    // console.log("Fetched data", data);
    updateDOM(data);
    aiCity = data.location.name;
    aiTemperature = data.current.temp_c;
    aiCondition = data.current.condition.text;
    suggestionBtn.style.display = "block";
    const suggestion = await getSuggestion(aiCity, aiTemperature, aiCondition);
    suggestionDiv.textContent = `Tip: ${suggestion}`;
  } catch (error) {
    console.error("Error fetching data", error.message);
    alert(
      "Unable fetching data. Please try after some time or with a different city name."
    );
  }
}

async function getSuggestion(city, temperature, condition) {
  try {
    const prompt = `The weather is ${temperature}°C with ${condition} conditions in ${city}. Give a short 1-sentence advice on what to wear or what to eat. Also, add one relative emoji at the end of the advice.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${AIapiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    const suggestion = data.candidates[0].content.parts[0].text;
    return suggestion;
  } catch (error) {
    if (
      error.message.includes("429") ||
      error.message.includes("RESOURCE_EXHAUSTED")
    ) {
      return "Resource Limit Exhausted. Please try after some time or use a new resource key.";
    }
    console.log(error);
    return "Some error occurred. Please wait try after some time.";
  }
}

suggestionBtn.addEventListener("click", (e) => {
  suggestionDiv.style.display = "block";
});
