const apikey = 'H9TJ8BKE7DPQZDTRYGPUX9VUT'

document.addEventListener("DOMContentLoaded", () => {
    const apiKey = 'H9TJ8BKE7DPQZDTRYGPUX9VUT';
    
    const form = document.getElementById('location-form');
    const input = document.getElementById('location-input');
    const forecastDiv = document.getElementById('forecast');
    const locationDiv = document.getElementById('location')

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const location = input.value.trim();
        if (location) {
            fetchWeatherData(location, apiKey);
        }
    });

    function fetchWeatherData(location, apiKey) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/next10days?unitGroup=us&key=${apiKey}&contentType=json`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const days = data.days;
                const currentDate = new Date(); // Get the current date

                let forecastHtml = '';
                let locationHTML = `<p>${data.resolvedAddress}</p>`;

                days.forEach((day, index) => {
                    const dayDate = new Date(day.datetime); // Convert datetime string to Date object

                    // Check if the date is today or a future date
                    if (dayDate >= currentDate) {
                        forecastHtml += `
                            <div class="day-forecast d-inline-block p-3 m-1 text-center">
                                <h5>${new Date(day.datetime).toDateString()}:</h5>
                                <img src="./assets/images/PNG/1st Set - Color/${day.icon}.png">
                                <h4 class="text-center"><strong>${day.temp}°F</strong></h4>
                                <p> ${day.conditions}</p>
                                <p d-inline-block><strong>H:</strong> ${day.tempmax}°F</p>
                                <p d-inline-block><strong>L:</strong> ${day.tempmin}°F</p>                        
                                <p><strong>Humidity:</strong> ${day.humidity}%</p>
                                <p><strong>Wind:</strong> ${day.windspeed} mph</p>
                            </div>
                        `;
                }
            });
            forecastDiv.innerHTML = forecastHtml;
            locationDiv.innerHTML = locationHTML;
            // document.querySelectorAll('.day-forecast').forEach((div, index) => {
            //     div.addEventListener('click', () => {
            //         const isExpanded = div.classList.contains('expanded');
                    
            //         if (isExpanded) {
            //             document.querySelectorAll('.day-forecast').forEach(d => {
            //                 d.style.display = 'inline-block';
            //                 d.style.width = '15.5%';
            //                 d.classList.remove('expanded');
            //                 const hourlyDiv = document.getElementById(`hourly-${index}`);
            //                 hourlyDiv.style.display = 'none';
            //                 hourlyDiv.innerHTML = '';
            //             });
            //         } else {
            //             document.querySelectorAll('.day-forecast').forEach((d, i) => {
            //                 if (i !== index) {
            //                     d.style.display = 'none';
            //                 } else {
            //                     d.style.width = '100%';
            //                     d.classList.add('expanded');
            //                     //fetchHourlyForecast(days[index].datetime, index);
            //                 }
            //             });
            //         }
            //     });
            // });
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
    }
})