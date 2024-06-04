const apikey = 'H9TJ8BKE7DPQZDTRYGPUX9VUT'

//Prepare page on content load
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
        //If location exists
        if (location) {
            fetchWeatherData(location, apiKey);
            saveSearch(location);
            displayRecentSearches();
            //We will need this later in the displayRecentSearches function and saveSearch function
            return location;
        }
    });

    function fetchWeatherData(location, apiKey) {
        //Template string to input location desired by user
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/next10days?unitGroup=us&key=${apiKey}&contentType=json`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    //Alert for bad user data
                    alert(`Unable to find ${location}`)
                    //Error handling
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const days = data.days;
                const currentDate = new Date(); // Get the current date

                //Create changeable variable forcastHTML and locationHTML, define locationHTML because we already have that. We will define forecastHTML when we loop through the array
                let forecastHtml = '';
                let locationHTML = `<h4>${data.resolvedAddress}</h4>`;

                //Loop through the array we got from the API
                days.forEach((day, index) => {
                    const dayDate = new Date(day.datetime); // Convert datetime string to Date object

                    // Check if the date is today or a future date. The API gives us yesterday, we want to omit this.
                    if (dayDate >= currentDate) {
                        //Create HTML for the forecast using the retrieved data from the API call
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
            //populate location div and forecast div
            forecastDiv.innerHTML = forecastHtml;
            locationDiv.innerHTML = locationHTML;
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            //HTTP status of 422: the server understands the content type of the request entity, and the syntax of the request entity is correct, 
            //but it was unable to process the contained instructions.
            response.status(422)
            alert('Unable to process this request.')
        });
    }

    //Save search to local storage
    function saveSearch(location) {
        let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        if (!searches.includes(location)) {
            searches.push(location);
            localStorage.setItem('recentSearches', JSON.stringify(searches));
        }
    }
    //Display recent searches on the page
    function displayRecentSearches() {
        let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        //Make sure we're not reposting the whole list every time
        recentSearchesList.innerHTML = '';
        //Loop through the array of searches
        searches.forEach(search => {
            //Create list item element
            let li = document.createElement('li');
            //Add new class
            li.classList.add('list-group-item');
            //Create span
            let span = document.createElement('span');
            span.textContent = search;
            span.classList.add('search-text');
            //Add event listener if user clicks a recent search, rerun the search
            span.addEventListener('click', () => {
                input.value = search;
                fetchWeatherData(search, apiKey);
            });
            li.appendChild(span);
            recentSearchesList.appendChild(li);
            //Show recent searches after there is at least one recent search
            recentSearchesTitle.classList.remove('hide');
        });
    }

    // Display recent searches on page load
    displayRecentSearches();
});

