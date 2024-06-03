const apikey = 'H9TJ8BKE7DPQZDTRYGPUX9VUT'

document.addEventListener("DOMContentLoaded", () => {
    const apiKey = 'H9TJ8BKE7DPQZDTRYGPUX9VUT';
    const location = 'Russellville, AR, United States';
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/next10days?unitGroup=us&key=${apiKey}&contentType=json`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const forecastDiv = document.getElementById('forecast');
            const days = data.days;
            const currentDate = new Date();
            let forecastHtml = '';

            days.forEach(day => {
                const dayDate = new Date(day.datetime);
                if (dayDate >= currentDate) {
                    forecastHtml += `
                        <div class="day-forecast d-inline-block p-3 m-1" id="day">
                            <h4>${new Date(day.datetime).toDateString()}:</h4>
                            <img src="./assets/images/PNG/1st Set - Color/${day.icon}.png">
                            <h4 class="text-center"><strong>${day.temp}°F</strong></h4>
                            <p> ${day.conditions}</p>
                            <p d-inline-block><strong>H:</strong> ${day.tempmax}°F</p>
                            <p d-inline-block><strong>L:</strong> ${day.tempmin}°F</p>
                            ${dayDate.toDateString() === currentDate.toDateString() ? `<p><strong>Feels like:</strong> ${day.feelslike}°F</hp>` : ''}
                            
                            <p> ${day.description}</p>
                            
                            <p><strong>Humidity:</strong> ${day.humidity}%</p>
                            <p><strong>Wind Speed:</strong> ${day.windspeed} mph</p>
                            <p><strong>Sunrise:</strong> ${day.sunrise}</p>
                            <p><strong>Sunset:</strong> ${day.sunset}</p>
                        </div>
                    `;
                }
            });
            forecastDiv.innerHTML = forecastHtml;
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
});