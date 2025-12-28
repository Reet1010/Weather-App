const tempdiv = document.querySelector(".temp");
const conditiondiv = document.querySelector(".condition span");
const conditionIcon = document.querySelector(".condition img");
const timediv = document.querySelector(".time");
const citydiv = document.querySelector(".cityName");
const searchFormdiv = document.getElementById("searchForm");
const searchInputdiv = document.getElementById("searchInput");
const imgdiv = document.querySelector(".imgdiv");
const apiKey = "cdc70beb63034d52ab915622251710";
// please do not use this apiKey for commercial purposes. I'm requesting you.

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
});

function updateDOM(data) {
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
    const url = `https://api.weatherapi.com/v1/current.json?q=${city}&lang=english&key=${apiKey}
`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Invalid response");
    }

    const data = await response.json();
    // console.log("Fetched data", data);
    updateDOM(data);
  } catch (error) {
    console.error("Error fetching data", error.message);
    alert(
      "Unable fetching data. Please try after some time or with a different city name."
    );
  }
}
