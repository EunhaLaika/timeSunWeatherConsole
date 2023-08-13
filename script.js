
  const apiKey = '8d7ea31d0050170ef1fe866565fe735c';
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + apiKey;
  const temperatureGauge = document.getElementById('temperatureGauge');
  const ctx2 = temperatureGauge.getContext('2d');

  let userLocation = null;
  


  function handleEnterKey(event) {
    if (event.key === 'Enter') {
      searchWeatherByCity();
    }
  }
  function searchWeatherByCity() {
    userLocation = null;
    const city = document.getElementById('cityInput').value;
    fetchWeatherData(apiUrl + '&q=' + city);
  }

  function searchWeatherByLocation() {
navigator.geolocation.getCurrentPosition(position => {
  fetchWeatherData(apiUrl + '&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude)
    .then(data => {
      document.getElementById('cityInput').value = data.name;
    });
});
}

function fetchWeatherData(url) {
return fetch(url)
  .then(response => response.json())
  .then(data => {
    const currentTemp = data.main.temp;
    const weatherDescription = data.weather[0].description;

    const lat123 = data.coord.lat;
    const lon123 = data.coord.lon;



async function getSunAltitudeData(latitude, longitude) {
    const date = new Date();

    let sunAltitudeData = [];
    let currentSunAltitude;
    for (let hour = 0; hour < 25; hour++) {
        date.setHours(hour);
        const sunPosition = SunCalc.getPosition(date, latitude, longitude);
        sunAltitudeData.push({ hour, altitude: sunPosition.altitude });

        if (hour === date.getHours()) {
            currentSunAltitude = sunPosition.altitude;
        }
    }

    return { sunAltitudeData, currentSunAltitude };
}

async function drawSunAltitudeChart(latitude, longitude) {
    const { sunAltitudeData, currentSunAltitude } = await getSunAltitudeData(latitude, longitude);

    const hours = sunAltitudeData.map(data => data.hour);
    const altitudes = sunAltitudeData.map(data => data.altitude * (180 / Math.PI));

    const currentTime = new Date().getHours();
    const currentAltitude = currentSunAltitude * (180 / Math.PI);


    const chartData = [
      {
          x: hours,
          y: altitudes,
          type: 'scatter',
          mode: 'lines',
          line: {
              color: 'white' // 그래프 색상
          }
      },
      {
          x: [currentTime],
          y: [altitudes[currentTime]], // Update y value to match the altitude at the current time
          type: 'scatter',
          mode: 'markers',
          marker: {
              size: 10,
              color: 'white'
          }
      },
      {
          x: [0, 24], // x range from 0 to 24
          y: [0, 0], // y values are set to 0
          type: 'scatter',
          mode: 'lines',
          line: {
              color: 'rgba(255, 255, 255, 1)', // line color with 50% transparency

          }
      }
  ];
  

    const chartLayout = {

        xaxis: {

            dtick: 1,
            gridcolor: 'rgba(255, 255, 255, 0.3)', // x축 격자색 변경
            zerolinecolor: 'rgba(255, 255, 255, 0.3)',// x축 0선 색상 변경
            

              range: [0, 24] // x축 범위 지정
        },
        
        yaxis: {

            dtick: 10,
            gridcolor: 'rgba(255, 255, 255, 0.3)', // x축 격자색 변경
            zerolinecolor: 'rgba(255, 255, 255, 0.3)' // x축 0선 색상 변경
        },
        showlegend: false, // 범례를 숨김
        width: 100,
        height: 50,
        plot_bgcolor: 'black', // 그래프 배경색을 투명하게 변경


        margin: {
            l: 1,
            r: 1,
            t: 1,
            b: 1
          }


        
    };

    const chartConfig = {
      displayModeBar: false // Disable the default Plotly toolbar
  };
    Plotly.newPlot('solar-altitude-chart', chartData, chartLayout);
}
drawSunAltitudeChart(lat123, lon123);


    drawTemperatureGauge(currentTemp, weatherDescription);
    return data;
  });
}

function drawTemperatureGauge(currentTemp, weatherDescription) {
const gaugeRadius = 120;
const centerX = temperatureGauge.width / 2;
const centerY = temperatureGauge.height / 2;
const minValue = -20;
const maxValue = 40;



// Clear previous drawing
ctx2.clearRect(0, 0, temperatureGauge.width, temperatureGauge.height);

// Draw gauge background
ctx2.beginPath();
ctx2.arc(centerX, centerY, gaugeRadius, 0, 2 * Math.PI, false);
ctx2.lineWidth = 2;
ctx2.strokeStyle = 'white';
ctx2.stroke();

 // Draw temperature ticks
 ctx2.lineWidth = 2;
ctx2.textAlign = 'center';
ctx2.textBaseline = 'middle';
ctx2.font = '14px Arial';
ctx2.strokeStyle = 'white'; // Change the stroke color to white
ctx2.fillStyle = 'white'; // Change the fill color to white


for (let i = minValue; i < maxValue; i += 1) {
  const angle = 2 * Math.PI * (i - minValue) / (maxValue - minValue) + Math.PI / 2;

  const lineWidth = i % 10 === 0 ? 2 : (i % 5 === 0 ? 1.5 : 1);
  const lineLength = i % 10 === 0 ? 15 : (i % 5 === 0 ? 10 : 5);

  const x1 = centerX + (gaugeRadius - lineLength) * Math.cos(angle);
  const y1 = centerY + (gaugeRadius - lineLength) * Math.sin(angle);
  const x2 = centerX + gaugeRadius * Math.cos(angle);
  const y2 = centerY + gaugeRadius * Math.sin(angle);

  ctx2.beginPath();
  ctx2.moveTo(x1, y1);
  ctx2.lineTo(x2, y2);
  ctx2.lineWidth = lineWidth;
  ctx2.strokeStyle = 'white';
  ctx2.stroke();

  if (i % 10 === 0) {
    ctx2.fillText(i, centerX + (gaugeRadius - 30) * Math.cos(angle), centerY + (gaugeRadius - 30) * Math.sin(angle));
  }
}



// Draw temperature needle
const drawNeedle = (value, color) => {
  const angle = 2 * Math.PI * (value - minValue) / (maxValue - minValue) + Math.PI / 2;
  const x = centerX + (gaugeRadius - 10) * Math.cos(angle);
  const y = centerY + (gaugeRadius - 10) * Math.sin(angle);
  ctx2.beginPath();
  ctx2.moveTo(centerX, centerY);
  ctx2.lineTo(x, y);
  ctx2.lineWidth = 4;
  ctx2.strokeStyle = color;
  ctx2.stroke();
};
// Draw current weather description
ctx2.font = '18px Arial';
ctx2.fillStyle = 'white';
ctx2.fillText(weatherDescription, centerX, centerY - gaugeRadius / 2);

drawNeedle(currentTemp, 'white');

}

  // Example: Fetch weather data for Seoul
  fetchWeatherData(apiUrl + '&q=Seoul');

  // Update weather data every 10 minutes
  setInterval(() => {
    if (userLocation) {
      fetchWeatherData(apiUrl + '&lat=' + userLocation.lat + '&lon=' + userLocation.lon);
    } else {
      const city = document.getElementById('cityInput').value || 'Seoul';
      fetchWeatherData(apiUrl + '&q=' + city);
    }
  }, 600000);



  const temperatureGauge2 = document.getElementById('temperatureGauge2');
  const ctx3 = temperatureGauge2.getContext('2d');





    drawTemperatureGauge2();




    function drawTemperatureGauge2() {
const gaugeRadius = 120;
const centerX = temperatureGauge2.width / 2;
const centerY = temperatureGauge2.height / 2;
const minValue = 0;
const maxValue = 60;

// Draw gauge background
ctx3.beginPath();
ctx3.arc(centerX, centerY, gaugeRadius, 0, 2 * Math.PI, false);
ctx3.lineWidth = 2;
ctx3.strokeStyle = 'white';
ctx3.stroke();

// Draw temperature ticks
ctx3.lineWidth = 2;
ctx3.textAlign = 'center';
ctx3.textBaseline = 'middle';
ctx3.font = '14px Arial';
ctx3.strokeStyle = 'white'; // Change the stroke color to white
ctx3.fillStyle = 'white'; // Change the fill color to white

for (let i = minValue; i <= maxValue; i += 1) {
  const angle = 2 * Math.PI * (i - minValue) / (maxValue - minValue) - Math.PI / 2;

  const lineWidth = i % 10 === 0 ? 2 : (i % 5 === 0 ? 1.5 : 1);
  const lineLength = i % 10 === 0 ? 15 : (i % 5 === 0 ? 10 : 5);

  const x1 = centerX + (gaugeRadius - lineLength) * Math.cos(angle);
  const y1 = centerY + (gaugeRadius - lineLength) * Math.sin(angle);
  const x2 = centerX + gaugeRadius * Math.cos(angle);
  const y2 = centerY + gaugeRadius * Math.sin(angle);

  ctx3.beginPath();
  ctx3.moveTo(x1, y1);
  ctx3.lineTo(x2, y2);
  ctx3.lineWidth = lineWidth;
  ctx3.strokeStyle = 'white';
  ctx3.stroke();

  if (i % 10 === 0 && i !== 0) {
    ctx3.fillText(i / 5, centerX + (gaugeRadius - 30) * Math.cos(angle), centerY + (gaugeRadius - 30) * Math.sin(angle));
  }
}
}

function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secondHand = document.querySelector('.second-hand');
  const minuteHand = document.querySelector('.minute-hand');
  const hourHand = document.querySelector('.hour-hand');

  const secondsDegrees = ((seconds / 60) * 360) + 90;
  const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
  const hoursDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
}

setInterval(updateClock, 1000);


