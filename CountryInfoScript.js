///for anyone editing this file, please write detailed documentation...
///As of 12/15/2022 we are using the leaflet, openstreetmap, restcountries and geonames api
///The current purpose of this app is to get a location and based on that location, get the country and receive the facts
///about the country
///For the geonames api we will use the code CloudlessStudio as it is registered to that account 

//read docs of this api at https://leafletjs.com/reference.html
//--------------------------------------------------------------
let j = 0; //global var for looping through the countries
let info_message = true;
var map = L.map('map', {minZoom: 3,maxZoom: 7}).setView([51.505, -0.09], 3);  ///initialize map start point is england. 
//map.setMaxBounds(map.getBounds());
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'   //creating the look of the map, with attribution
}).addTo(map);  //adding the attribution and visuals to map


var popup = L.popup(); //create popup
map.addEventListener('click', onMapClick); //adding an event listener to map, works like a button

function onMapClick(e) {
    let loc = e.latlng;       //access latitude longitude json obj
    console.log(loc.lat);  //console log lat and long
    console.log(loc.lng);

    let LATITUDE = loc.lat.toString().slice(0, 5);
    let LONGITUDE = loc.lng.toString().slice(0, 5);
    popup
        .setLatLng(loc)
        .setContent("This location is: " + LATITUDE+","+LONGITUDE)     //show user where they clicked
        .openOn(map);                                                   //show this on the map
    callGeoNamesApi(LATITUDE,LONGITUDE);                                //call geonames api
    
}

function callGeoNamesApi(LT,LN){      // call geonames api with lat and lon values from our map
    console.log("http://api.geonames.org/countrySubdivisionJSON?lat="+LT+"&lng="+LN+"&username=cloudlessstudio") //test case
    fetch("http://api.geonames.org/countrySubdivisionJSON?lat="+LT+"&lng="+LN+"&username=cloudlessstudio") //get the name data of our country based on lat and lon
    .then((r) => r.json())  //convert d for data into json obj
    .then((response)=>{ 
        showName(response)  //call show name function based on data
    })
}


// TODO: add time out on first api call
// TODO: modal instead of alert
// https://colors.muz.li/

function callRestCountriesApi(name){
        if(name == "Congo Republic"){
        name = "Republic of the Congo";   //congo fix
        j = 1;                            //getting the second nation in list
        }
        else if(name == "Iran"){           //iran bug
        j = 1;                             //getting the second nation in list
        }
        else{
        j = 0;   //getting the first nation in list
        }
        console.log("https://restcountries.com/v3.1/name/"+name) //print correct api link
        fetch("https://restcountries.com/v3.1/name/"+name)  // rest countries api + nation name
        .then((r)=>r.json())
        .then((response)=>{
            showInfo(response)              //call show info fucntion
        })
    }


///https://restcountries.com/v3.1/name/
//so far as of 12/15/22 it is okay speed, sometimes api times out
function showName(apiResponse){
    const nationBox = document.getElementById("nation-name"); //get nation name container in HTML
    const countryName= apiResponse.countryName; ///get country name 
    if(countryName == "Antarctica" || countryName === undefined){                  //check if stuff is undefined
        alert("You either clicked an ocean, Antarctica or we are having issues... try again soon!");
    }
    else{
        console.log(countryName);
        nationBox.innerText = countryName;  //put country name into the div
        callRestCountriesApi(countryName); //call the other api 'rest countries' and pass the country name as param
    }

}

function showInfo(apiResponse){
    if(info_message){
        document.getElementById("info").remove(); 
        info_message =false;
    }
     
    const nation = document.getElementById("nation-name").innerText;
    console.log(nation);                                 //create references to div elements for facts
    const flagBox = document.getElementById("nation-flag");   
    const flagSrc = document.getElementById("flag-src");
    const langBox = document.getElementById("nation-lan");
    const populationBox = document.getElementById("nation-pop");
    const currencyBox = document.getElementById("nation-cur");
    const areaBox = document.getElementById("nation-area");
    const carBox = document.getElementById("nation-car");
    const capitalBox = document.getElementById("nation-capital");
    ////WORK IN PROGRESS
    let capital = "";                      //declare all the variables
    let flag = "";
    let currency = "";
    let lang ="";
    let population ="";
    let car = "";
    let area ="";
    

    console.log(apiResponse);          
    for(let i in apiResponse){                //loop through the json api response
       capital = apiResponse[j].capital;                            // first capital
       lang = Object.values(apiResponse[j].languages);         //get all languages in an array
       population = apiResponse[j].population;          //get first population
       flag = apiResponse[j].flags.png;           //get flag
       currency = Object.values(apiResponse[j].currencies)[0].name;        //get currency name first item, in array
        area = apiResponse[j].area;                   //get first area
        car = apiResponse[j].car.side;                //get first car side
    }
    
    
    flagSrc.src = flag;                               //show the flag src 
    flagSrc.removeAttribute("hidden");
    for(let j in lang){                                               //show the languages based on how many there are
        if(lang.length >=3){
            langBox.innerText = lang[0]+", "+lang[1]+", "+lang[2];          //show 3 languages
        }
        else if(lang.length ==2){
            langBox.innerText = lang[0]+", "+lang[1];   //show 2 languages
        }
        else{
            langBox.innerText = lang[0];              //show one language
        }
        
    }
    populationBox.innerText = population;       //show population
    currencyBox.innerText = currency;         //show currency
    areaBox.innerText = area;             //show are in km
    carBox.innerText = car;               //show car driving side
    capitalBox.innerText =capital;          //show capital



    console.log(flag);
     console.log(lang);
     console.log(population);
    console.log(currency);
      console.log(area);
     console.log(car);
    console.log(capital);

}


