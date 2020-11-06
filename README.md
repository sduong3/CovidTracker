<!--
*** Thanks for checking out this README Template. If you have a suggestion that would
*** make this better, please fork the repo and create a pull request or simply open
*** an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Technologies Used](#technologies-used)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contact](#contact)


<!-- ABOUT THE PROJECT -->
## About The Project
A React web-app that determines the number of COVID-19 cases within a region of the user’s
choosing. The UI/UX must be mobile and desktop friendly.

Features

Interactive Map of the US:
* Populate the map with data on the number of COVID-19 cases at various
businesses/locations.
* The user should be able to set a radius and tap a spot on the map. Using the radius and
the location they choose, the app should display the number of COVID-19 cases within
that “hotspot”.
* Multiple users should be able to add, remove, and modify case counts on the map at the
same time
* The map view should update in real-time if other users add, remove, or modify cases on
the map.

Search bar:
* Users should be able to search by city and state to produce the aggregated COVID-19
stats for that region.


### Technologies Used
* create-react-app
* react-google-maps
* Firebase
* axios
* [covid-api](https://covid-api.com/api/)


<!-- GETTING STARTED -->
## Installation

Run the following commands in git bash:
1. git clone https://github.com/sduong3/CovidTracker.git
2. cd covidtracker
3. npm install
4. npm start

<!-- Usage -->
## Usage

On launch, the app populates the map view with markers (defaulted to San Francisco in California).

Updating case count at location
=====
When the user clicks on the marker, an InfoWindow view will popup where it displays the city name and the # of COVID-19 cases in the area.
The user can modify the case count in this view.
* Clicking on the "Confirm Changes" button will update the case count for that city.
* Clicking on the "Clear" button will reset the case count to 0 for that city.
This information is persisted in firebase. It can be confirmed by the following":
1. Click on the marker at San Francisco.
2. Modify the case count number in the input field.
3. Click on "Confirm Changes" button
4. Click on a different marker (Sacramento)
5. Click back to San Francisco marker
6. The value you set previously should remain

And

1. After updating some case count values of various cities.
2. Refresh the page
3. Click on the markers that you changed
4. The value you set previously should remain

Hotspot
=====
When the user clicks on the map, the user should see a circle appear on the map. The user can set the radius of the hotspot by modifying the
radius number at input field next to Radius label.

1. Radius set to 1200
2. Click on map
3. Hotspot circle should appear where user clicked
4. Set radius to 12000
5. Hotspot circle gets bigger
6. Set radius to 120000
7. Hotspot circle gets bigger

Note: Unable to easily retrieve amount of COVID-19 cases in hotspot boundaries. The covid API I'm using does not easily accomplish that.

Search bar
=====
When the user searches a location on the search bar, the map only renders markers of all cities in that state. I designed it so the map will
only display relevant cities rather than populating the entire map.

On the right side of the app, there is an aggregated data section. If the city/state is found in the dataset of the COVID-API, the UI
will update with relevant information. Otherwise, it will simply display "N/A".

Search for valid city (found in API)
1. Search San Francisco
2. Program determines that city is located in California.
3. Generate markers for all cities in California
4. Both state statistics and city statistics are shown

Search for valid state (found in API)
1. Search Nevada
2. Generate markers for all cities in Nevada
3. Only state statistics is shown. City statistics are "N/A" because Nevada is not a city

Search for invalid city (not found in API)
1. Search San Jose
2. Program determines that city is located in California.
3. Generate markers for all cities in California
4. Only state statistics are shown. San Jose data is not present in API so city statistics are "N/A"

Invalid search (not in United States)
1. Search China
2. Program determines that searched location is not in United States.
3. Both state statistics and city statistics are "N/A"




<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Steven Duong - stvenduong@gmail.com

Project Link: [https://github.com/sduong3/CovidTracker](https://github.com/sduong3/CovidTracker)
