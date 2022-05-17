//INIT CONSTANTS
const c = uscities;
const clen = Object.keys(uscities.city_ascii).length; //30k atm
const maxdist = 5000; //in km - to be used for color scaling
const citynames = Array.from(Object.values(c.city_ascii));

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
const states = Array.from(Object.values(c.state_name));
const statenames = states.filter(onlyUnique).sort();

ids = [];
canGuess = true;


//top 400 cities, not top 5
chosen_id = 5 + Math.floor(Math.random()*395);
while(c.state_id[chosen_id] == 'PR') // no PR cities - for now
{
    chosen_id = 5 + Math.floor(Math.random()*395);
}


//INIT MAP

var mapOptions = {
    center: [38, -96],
    zoom: 5
 }

 var map = new L.map('map', mapOptions);

// Creating the Layer object
var layer =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
        '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 5,
    minZoom: 4,
}).addTo(map);

window.map = map;

//INIT BUTTON ONCLICK | ENTER EVENT
let button = id('guess');
let enter = id('enter');
button.onclick = checkMarker;

enter.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkMarker();
    }
  });


//SELECT BUTTONS
id('states').innerHTML += '<option>Any state</option>';
for(const s in statenames)
{
    id('states').innerHTML += '<option>' + statenames[s] + '</option>';
}

//FUNCTIONS

function checkMarker(){
    if(canGuess) 
    {
        //FIND CITY ID
        let state = id('states').value;
        let lowercities = citynames.map(x => x.toLowerCase());
        cityId = -1;
        if(state == 'Any state') //finds largest city across all states
        {
            cityId = lowercities.findIndex(x => x == enter.value.toLowerCase());
        }
        else
        {
            //filter by state
            let isInState = states.map(s => s == state);
            for(let index = 0; index < isInState.length; index++)
            {
                if(isInState[index] && lowercities[index] == enter.value.toLowerCase())
                {
                    cityId = index;
                    break;
                }    
            }
        }


        //CITY ID GOTTEN
        if(cityId < 0) //no city found
        {
            //put warning
        }
        else if(ids.map(x => x[0]).includes(cityId)) //largest city w/ name already present
        {
            id('resp').innerHTML = "Oops! That city already been guessed! Try another!";
        }
        else if(cityId != chosen_id)
        {
            enter.value = ''; 
            addMarker(cityId);
            ids = ids.sort((a, b) => a[1] - b[1] ); //sort by closest km
            ids.unshift([cityId, getDistance(cityId, chosen_id), ids.length+1]); //show at top
            inner = '<tr><th>Guess</th><th>City</th><th>Distance (km)</th></tr>';
            for(const index in ids)
            {
                inner += '<tr id="tr' + index + '"><td>' + ids[index][2] + '</td><td>' + c.city_ascii[ids[index][0]] + ", " 
                + c.state_id[ids[index][0]] + '</td><td>' + ids[index][1] + '</td></tr>';
            }
            id('guesses').innerHTML = inner;
            let pop = c.population[cityId].toString();
            let plength = pop.length;
            for(let i = plength - 3; i >= 1; i -= 3)
            {
                pop = pop.slice(0, i) + ',' + pop.slice(i);
            }

            id('resp').innerHTML = "#" + ids.length + ": " + c.city_ascii[cityId] + ", " + c.state_id[cityId] + ": Metro population of " + pop;
        }
        else //found right city
        {
            id('counter').style.backgroundColor="#00dd0077";
            canGuess = false;
            enter.value = ''; 
            addMarker(cityId);
            ids = ids.sort((a, b) => a[1] - b[1] ); //sort by closest km
            ids.unshift([cityId,  'FOUND!', ids.length+1]); //show at top
            inner = '<tr><th>Guess</th><th>City</th><th>Distance (km)</th></tr>';
            for(const index in ids)
            {
                inner += '<tr id="tr' + index + '"><td>' + ids[index][2] + '</td><td>' + c.city_ascii[ids[index][0]] + ", " 
                + c.state_id[ids[index][0]] + '</td><td>' + ids[index][1] + '</td></tr>';
            }
            id('guesses').innerHTML = inner;
            id('resp').innerHTML = 'You win in ' + ids.length + ' guesses!';
            //chosen_id you win here
        }
    }
}


function id(id) {
    return document.getElementById(id);
}

//i is city id
function addMarker(i) {
    //Add marker
    var circle = L.circleMarker([c.lat[i], c.lng[i]], {
        color: '#000000',
        fillColor: chosen_id == i ? '#00ff33' : fillColor(i, chosen_id),
        fillOpacity: 1,
        radius: 4
    }).addTo(map);
    var st = "#" + (ids.length+1) + ": " + c.city_ascii[i] + ", " + c.state_id[i] + "<br/>" + getDistance(i, chosen_id) + 'km';
    circle.bindPopup(st).addTo(map).openPopup();
}

function getDistance(i1, i2) {
    lat1 = c.lat[i1];
    lat2 = c.lat[i2];
    lon1 = c.lng[i1];
    lon2 = c.lng[i2];
    //Haversine formula for lat/long
    const R = 6371; // km
    const phi1 = lat1 * Math.PI/180; // φ, λ in radians
    const phi2 = lat2 * Math.PI/180;
    const deltaphi = (lat2-lat1) * Math.PI/180;
    const deltalamb = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltalamb/2) * Math.sin(deltalamb/2);
    const co = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * co; // in km
    return Math.round(d);
}

function fillColor(id, chosen_id) //construct hexcode for color here - do later
{
    let distance = getDistance(id, chosen_id);
    let val = Math.min(250, Math.round(distance/6) - 250);
    if(val > 0) //far - redder
    {
        color = '#fa' + ((250-val) < 16 ? '0' : '') + (250-val).toString(16) + '00';
    }
    else //closer - greener
    {
        color = '#' +  ((250-(val*-1)) < 16 ? '0' : '') + (250-(val*-1)).toString(16) + 'fa00';
    }
    return color;
}

function thousandCities()
{
    for(let j = 0; j < 1000; j++)
    {
        addMarker(j);
    }
}