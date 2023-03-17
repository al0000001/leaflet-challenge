// IMPORT TO READ
// Some code are copied and learnt from this link with adjustment to solve this challenge https://github.com/Sundakiy/leaflet-challenge/blob/main/leaflet-part-1/static/js/logic.js 

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    let baseMaps = {
      "maps": street,
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      earthquakes_info: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        25.27, 133.77
      ],
      zoom: 2,
      layers: [street, earthquakes]
    });
    // Layer Control 
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
    legend.addTo(myMap)
  
  }
// Store our API endpoint as queryUrl.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
                
d3.json(url).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

   // Binding a popup to each layer
   // Code are copied and learnt from this link with adjustment to solve this challenge https://github.com/Sundakiy/leaflet-challenge/blob/main/leaflet-part-1/static/js/logic.js 
    function onEachFeature(feature, layer){
      layer.bindPopup("<h3> Location: " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br><h3> Magnitude: " + feature.properties.mag +  "</h3>" + "<br><h3> depth: " + feature.geometry.coordinates[2] + "</h3>");
    }

    // Create a variable for earthquakes to house latlng, each feature for popup, and cicrle radius/color/weight/opacity
    function createCircleMarker(feature, latlng){
       let options = {
        radius:feature.properties.mag*3,
        fillColor: fill_color(feature.geometry.coordinates[2]),
        color: "black",
        weight: 0.5,
        opacity: 100,
        fillOpacity: 1
       } 
       return L.circleMarker(latlng,options);
    }
//Define fill_color function to be used on line 53
function fill_color(i) {
  if (i>= 90) return "#932191";
  else if (i >= 70 && i > 50) return "#AD3D6F";  
  else if (i >= 50 && i > 30) return "#C7594B";
  else if (i >= 30 && i > 10) return "#FF5733";
  else if (i >= 10 && i > -10) return "#FF9300";
  else return "#FFC30F";
}

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });

    // Send earthquakes layer to the createMap function - will start creating the map and add features
    createMap(earthquakes);
}

//Learnt from CHATGPT creating legend and coordinate with CSS script
let legend = L.control({position: 'bottomright'});
legend.onAdd = function(myMap) {
    let div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += "<h4 style='text-align: center'> Earthquake_Depth </h4>";
         grades = [-10,10,30, 50,70,90]  
         colors = ["#FFC30F", "#FF9300", "#FF5733","#C7594B", "#AD3D6F", "#932191"]
    // loop through density intervals
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<div><span style="background-color:' + colors[i]  + '"></span><span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+') + '</span></div>';
    }
    return div;
};