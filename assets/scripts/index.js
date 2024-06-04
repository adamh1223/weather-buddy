const apikey = 'H9TJ8BKE7DPQZDTRYGPUX9VUT'

document.addEventListener("DOMContentLoaded", () => {
    const apiKey = 'H9TJ8BKE7DPQZDTRYGPUX9VUT';
    
    const form = document.getElementById('location-form');
    const input = document.getElementById('location-input');
    const forecastDiv = document.getElementById('forecast');
    const locationDiv = document.getElementById('location');
    const recentSearchesList = document.getElementById('recent-searches-list');
    const recentSearchesTitle = document.getElementById('recent-searches-title');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const location = input.value.trim();
        if (location) {
            fetchWeatherData(location, apiKey);
            saveSearch(location);
            displayRecentSearches();
            return location;
        }
    });

    function fetchWeatherData(location, apiKey) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/next10days?unitGroup=us&key=${apiKey}&contentType=json`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    alert(`Unable to find ${location}`)
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const days = data.days;
                const currentDate = new Date(); // Get the current date

                let forecastHtml = '';
                let locationHTML = `<h4>${data.resolvedAddress}</h4>`;

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
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
    }

    function saveSearch(location) {
        let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        if (!searches.includes(location)) {
            searches.push(location);
            localStorage.setItem('recentSearches', JSON.stringify(searches));
        }
    }

    function displayRecentSearches() {
        let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        recentSearchesList.innerHTML = '';
        searches.forEach(search => {
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            let span = document.createElement('span');
            span.textContent = search;
            span.classList.add('search-text');
            span.addEventListener('click', () => {
                input.value = search;
                fetchWeatherData(search, apiKey);
            });
            li.appendChild(span);
            recentSearchesList.appendChild(li);
            recentSearchesTitle.classList.remove('hide');
        });
    }

    // Display recent searches on page load
    displayRecentSearches();
});

