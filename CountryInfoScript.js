///for anyone editing this file, please write detailed documentation...
///As of 12/10/2022 we are using the leaflet, openstreetmap, and geonames api
///The current purpose of this app is to get a location and based on that location, get the country and receive the facts
///about the country
///For the geonames api we will use the code CloudlessStudio as it is registered to that account 

//read docs of this api at https://leafletjs.com/reference.html
//--------------------------------------------------------------
var map = L.map('map').setView([51.505, -0.09], 5);  ///initialize map start point is england. 
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
        .openOn(map);   //show this on the map
    callGeoNamesApi(LATITUDE,LONGITUDE);  //call geonames api
    
}

function callGeoNamesApi(LT,LN){   // call geonames api with lat and lon values from our map
    console.log("http://api.geonames.org/countrySubdivisionJSON?lat="+LT+"&lng="+LN+"&username=cloudlessstudio") //test case
    fetch("http://api.geonames.org/countrySubdivisionJSON?lat="+LT+"&lng="+LN+"&username=cloudlessstudio") //get the name data of our country based on lat and lon
    .then((r) => r.json())  //convert d for data into json obj
    .then((response)=>{ 
        showName(response)  //call show name function based on data
    })
}

function callRestCountriesApi(name){
    // let name_full = name.split(" ");
    // let n = ""
    // for(let i in name_full){
    //     n+= name_full[i];
    // }
    console.log("https://restcountries.com/v3.1/name/"+name) //print correct api link
    fetch("https://restcountries.com/v3.1/name/"+name)  // rest countries api + nation name
    .then((r)=>r.json())
    .then((response)=>{
        showInfo(response)              //call show info fucntion
    })
}
///https://restcountries.com/v3.1/name/
//so far as of 12/10/22 it is very slow and often throws erros if not selecting a proper country...
function showName(apiResponse){
    const nationBox = document.getElementById("nation-name"); //get nation name container in HTML
    const countryName= apiResponse.countryName; ///get country name 
    console.log(countryName);
    nationBox.innerText = countryName;  //put country name into the div
    callRestCountriesApi(countryName); //call the other api 'rest countries' and pass the country name as param
}

function showInfo(apiResponse){   
    const nation = document.getElementById("nation-name").innerText;
    console.log(nation);                                 //create references to div elements for facts
    const flagBox = document.getElementById("nation-flag");
    const langBox = document.getElementById("nation-lan");
    const populationBox = document.getElementById("nation-pop");
    const currencyBox = document.getElementById("nation-cur");
    const areaBox = document.getElementById("nation-area");
    const carBox = document.getElementById("nation-car");
    const capitalBox = document.getElementById("nation-capital");
    ////WORK IN PROGRESS
    let capital = "";
    let flag = "";
    let currency = "";
    let lang ="";
    let population ="";
    let car = "";
    let area ="";
    
    console.log(apiResponse);
    for(let i in apiResponse){
       capital = apiResponse[i].capital[0];
       lang = apiResponse[i].languages;
    }
    
    
    



    //  console.log(flag);
     console.log(lang);
    //  console.log(population);
    //  console.log(currency);
    //  console.log(area);
    //  console.log(car);
    console.log(capital);

}


