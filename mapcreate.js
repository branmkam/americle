//INIT CONSTANTS
const c = uscities;
const clen = Object.keys(c.city_ascii).length; //30k atm
const maxdist = 5000; //in km - to be used for color scaling
const citynames = Array.from(Object.values(c.city_ascii));

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
const states = Array.from(Object.values(c.state_name));
const statenames = states.filter(onlyUnique).sort();

ids = [];
canGuess = true;
firstTime = true;
geoMode = false;

//COOKIES - set cookie expiration to tomorrow at midnight
let tom = new Date(new Date().getTime() + 24*60*60*1000);
tom.setHours(0);
tom.setMinutes(0);
tom.setSeconds(0);
tom.setMilliseconds(0);
document.cookie = `expires= ${tom}`;

//get largest population size by state
// let largeCities = [];
// for(const index in statenames)
// {
//     let larg = states.findIndex(x => x == statenames[index]);
//     largeCities.push([statenames[index], citynames[larg], c.population[larg], larg]);
// }

// console.log(largeCities.sort((a, b) => a[2] - b[2]));


number_cities = 500; //for reshuffle
// let order = Array.from(Array(number_cities).keys());
// order = order.sort(() => Math.random() - 0.5);
// id('resp').innerHTML = order;

//get day
let date = new Date();
let start = new Date(2022, 4, 17); //5/17/2022 day 0
//current day
let numdays = (date.getTime() - start.getTime()) / (1000*60*60*24);
let day = Math.floor(numdays);
let order = [254,38,0,89,108,106,93,61,4,56,74,111,81,33,205,117,229,235,241,149,161,137,148,153,234,289,242,141,207,343,26,23,3,94,444,189,63,85,266,249,376,212,273,15,50,255,330,16,157,326,293,332,333,25,70,228,44,51,80,78,362,42,62,363,191,352,139,478,132,448,127,186,492,484,495,483,400,389,486,380,179,8,398,172,453,379,433,319,1,204,357,156,322,304,222,305,39,321,257,147,203,110,181,18,28,284,98,72,303,271,310,476,318,279,441,53,198,54,442,126,109,490,288,499,187,225,21,278,457,57,459,121,104,202,320,473,479,471,272,238,358,197,498,58,10,328,454,166,481,355,465,152,401,128,299,34,404,409,388,159,369,95,311,397,423,418,214,378,79,295,384,344,27,199,262,20,37,30,138,160,35,287,265,348,144,13,286,2,274,264,227,282,269,296,253,195,493,64,185,43,345,168,386,466,200,432,308,301,223,339,22,372,155,69,237,350,399,291,201,447,445,5,248,263,84,302,403,32,151,41,393,91,122,73,11,406,354,467,14,443,482,440,183,360,101,65,298,215,49,239,36,213,460,290,210,489,221,130,309,114,24,146,381,313,124,451,270,410,323,258,240,413,261,136,292,87,429,116,100,129,123,337,140,231,370,428,485,464,165,125,306,312,338,422,9,450,327,297,415,361,226,366,497,455,307,102,275,480,468,382,230,71,317,336,97,300,283,46,208,462,12,48,469,247,17,285,158,190,335,142,154,6,209,115,436,19,92,329,342,134,346,260,259,437,193,88,324,175,7,192,419,280,277,29,421,52,113,45,60,356,349,145,251,118,218,40,420,461,59,47,246,188,314,31,112,268,243,281,439,488,245,385,405,276,412,211,396,105,424,375,96,383,446,351,174,407,75,83,411,316,90,334,367,219,341,236,417,252,169,438,340,76,232,176,120,347,427,449,77,119,458,82,494,224,178,99,184,133,373,365,135,477,256,368,371,143,162,220,170,392,391,470,194,325,315,67,434,353,163,107,164,103,206,402,331,196,66,414,86,267,131,475,425,68,364,150,496,374,377,430,177,359,171,408,182,416,294,167,463,180,474,472,431,491,487,216,435,173,217,250,452,395,426,233,387,244,456,394,390,55];
id('puzzlenum').innerHTML = "Puzzle #" + (day+1);
chosen_id = order[day % number_cities];


// //equal-chance state randomizer
// let abr_statenames = states.slice(0,number_cities).filter(onlyUnique).sort();
// chosen_state = statenames[Math.floor(Math.random()*abr_statenames.length)];
// while(['Puerto Rico'].includes(chosen_state)) // no PR cities at the moment
// {
//     chosen_state = statenames[Math.floor(Math.random()*statenames.length)];
// }

// //choose city with state as ID
// inChosenState = states.slice(0,number_cities)
// .map(function(s, index) {return [s == chosen_state, index]})
// .filter(s => s[0] == true)
// .map(s => s[1]);

// chosen_id = inChosenState[Math.floor(Math.random()*inChosenState.length)];


//INIT MAP


var corner1 = L.latLng(90, -180);
var corner2 = L.latLng(5, -35);
var bounds = L.latLngBounds(corner1, corner2);

var mapOptions = {
    center: [40, -96],
    zoom: 5,
    maxBounds: bounds,
 }

 var map = new L.map('map', mapOptions);

// Creating the Layer object
var layer =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 14,
}).addTo(map);


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

  id('closehow').onclick = closeHow;
  id('openhow').onclick = openHow;


//SELECT BUTTONS
id('states').innerHTML += '<option>Any state</option>';
for(const s in statenames)
{
    id('states').innerHTML += '<option>' + statenames[s] + '</option>';
}

//INIT MODE CHOOSE:
id('mode').innerHTML = `<input type="checkbox" id="modeselect"/> Geographer Mode (no zoom past current level)`

document.addEventListener("keypress", function(event) {
    if (event.code === "Space" && firstTime) {
        event.preventDefault();
        id('modeselect').checked = id('modeselect').checked ? false : true;
    }
  });

document.addEventListener("keypress", function(event) {
    if (event.code === "Escape") {
        event.preventDefault();
        closeHow();
    }
  });
 


//FUNCTIONS

function checkMarker(){
    if(canGuess) 
    {
        closeHow();

        //FIND CITY ID
        let state = id('states').value;
        let lowercities = citynames.map(x => x.toLowerCase());
        cityId = -1;
        if(state == 'Any state') //finds largest city across all states
        {
            cityId = lowercities.findIndex(x => x == enter.value.toLowerCase().trim());
        }
        else
        {
            //filter by state
            let isInState = states.map(s => s == state);
            for(let index = 0; index < isInState.length; index++)
            {
                if(isInState[index] && lowercities[index] == enter.value.toLowerCase().trim())
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
            inner = '<tr><th>Guess</th><th>City</th><th>Distance (mi)</th></tr>';
            for(const index in ids)
            {
                let fill = fillColor(ids[index][0], chosen_id);
                inner += '<tr id="tr' + index + '"><td style="color:' + fill + '" >' + ids[index][2] + '</td><td style="color:' + fill + '" >' + c.city_ascii[ids[index][0]] + ", " 
                + c.state_id[ids[index][0]] + '</td><td style="color:' + fill + '" >' + ids[index][1] + '</td></tr>';
            }
            id('guesses').innerHTML = inner;
            let pop = c.population[cityId].toString();
            let plength = pop.length;
            for(let i = plength - 3; i >= 1; i -= 3)
            {
                pop = pop.slice(0, i) + ',' + pop.slice(i);
            }

            id('resp').innerHTML = "#" + ids.length + ": " + c.city_ascii[cityId] + ", " + c.state_id[cityId] + ": Metro population of " + pop;
            cookieIds(); //save to cookie
        }
        else //found right city
        {
            id('counter').style.backgroundColor="#00770077";
            canGuess = false;
            enter.value = ''; 
            addMarker(cityId);
            ids = ids.sort((a, b) => a[1] - b[1] ); //sort by closest km
            ids.unshift([cityId,  'FOUND!', ids.length+1]); //show at top
            inner = '<tr><th>Guess</th><th>City</th><th>Distance (mi)</th></tr>';
            for(const index in ids)
            {
                inner += '<tr id="tr' + index + '"><td>' + ids[index][2] + '</td><td>' + c.city_ascii[ids[index][0]] + ", " 
                + c.state_id[ids[index][0]] + '</td><td>' + ids[index][1] + '</td></tr>';
            }
            id('guesses').innerHTML = inner;
            id('resp').innerHTML = 'You win in ' + ids.length + ' guesses!';
            cookieIds(); //save to cookie
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
    var st = "#" + (ids.length+1) + ": " + c.city_ascii[i] + ", " + c.state_id[i] + "<br/>" + getDistance(i, chosen_id) + 'mi';
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

    const d = R * co * 0.621371; // in mi
    return Math.round(d);
}

function fillColor(id, chosen_id) //construct hexcode for color here - do later
{
    let distance = getDistance(id, chosen_id);
    let val = Math.min(250, Math.round(distance/3.1) - 250);
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

function closeHow()
{
    id('howtoplay').style.display = 'none';
    if(firstTime)
    {
        geoMode = id('modeselect').checked;
        if(geoMode)
        {
            map.removeLayer(layer);
            var geoLayer =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 5,
                minZoom: 4,
            }).addTo(map);
            id('geomode').innerHTML = 'Geographer Mode';
        }
        id('mode').innerHTML = '';
    }
    firstTime = false;
}

function openHow()
{
    id('howtoplay').style.display = 'block';
}

//cookies for future
function cookieIds()
{
    let idsOnly = ids.map(s => s[0]);
    let guessesOnly = ids.map(s => s[2]);
    let idsString = idsOnly.join('|');
    let guessesString = guessesOnly.join('|');
    let cookieString = `ids=${idsString}; guesses=${guessesString}; canGuess=${canGuess}; expires=${tom};path=/"`
    document.cookie = cookieString; 
    console.log(document.cookie);
    console.log(getCookie('ids'));
}

//from w3schools
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    console.log(ca);
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }