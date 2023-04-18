// make the SVG and viewbox
// set up the SVG element
var svg = d3.select("#chart").append("svg")
  .attr("width", 960)
  .attr("height", 600);

// create the projection
var projection = d3.geoAlbersUsa();


// Load the GeoJSON data
d3.json("us-states.json").then(function(geoData) {

  // Load the CSV data
  d3.csv("usa_counties_map_to_conv.csv").then(function(data) {

    // Roll up the data by state, selecting the top entry for legal status
    var rolledUpData = d3.rollup(data, function(v) {
      return {
        legalStatus: v[0].legal_status
      };
    }, function(d) {
      return d.region;
    });

    // Convert the rolled up data to an object
    var rolledUpDataObject = Object.fromEntries(rolledUpData);

    // Create a new GeoJSON object with the rolled up data
    var newGeoData = topojson.feature(geoData, geoData.objects.states).features.map(function(state) {
      return {
        type: "Feature",
        properties: {
          name: state.properties.NAME,
          legalStatus: rolledUpDataObject[state.properties.NAME].legalStatus
        },
        geometry: state.geometry
      };
    });

    // Create a choropleth map
    // ...
  // Define the color scale based on legal status
  var colorScale = d3.scaleOrdinal()
    .domain(["Legal", "Illegal", "Unknown"])
    .range(["green", "red", "gray"]);


  // Set the choropleth fill color based on legal status value
  svg.selectAll("path")
    .data(features)
    .join("path")
    .attr("d", path)
    .attr("fill", function(d) {
      return colorScale(d.properties.legal_status);
    });

  });
});





// var vlSpec = 

// {
//     "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//     "width": 500,
//     "height": 300,
//     "data": {
//         "url": "/my_file.json",
//         "format": {"type": "json", "feature": "features"}
//       },
//     "projection": {
//       "type": "albersUsa"
//     },
//     "mark": "geoshape",
//     "encoding": {
//       "color": {
//         "field": "properties.legal_status",
//         "type": "nominal"
//       }
//     }
//   }
  
// // {
// //     "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
// //     "data": {
// //       "url": "my_file.topojson"
// //     },
// //     "transform": [
// //       {
// //         "lookup": "id",
// //         "from": {
// //           "data": {
// //             "url": "/my_file.topojson",
// //             "format": {
// //               "type": "topojson",
// //               "feature": "subregion"
// //             }
// //           },
// //           "key": "id"
// //         }
// //       }
// //     ],
// //     "vconcat": [
// //       {
// //         "mark": {"type": "geoshape", "stroke": "white"},
// //         "encoding": {
// //           "color": {
// //             "field": "legal_status",
// //             "type": "nominal",
// //             "scale": {"scheme": "greens"},
// //             "legend": {"title": "Population"}
// //           },
// //           "tooltip": [
// //             {"field": "region", "type": "nominal", "title": "State"},
// //             {"field": "legal_status", "type": "nominal", "title": "Abortion Legal Status"}
// //           ]
// //         }
// //       },
// //       {
// //         "layer": [
// //           {
// //             "mark": {"type": "circle", "opacity": 0.8, "color": "black", "size": {"field": "avg_distance",
// //         "type": "quantitative"}},
// //             "encoding": {
// //               "longitude": {"field": "long", "type": "quantitative"},
// //               "latitude": {"field": "lat", "type": "quantitative"}
// //             }
// //           }
// //         ],
// //         "data": {
// //           "url": "/my_file.topojson"
// //         }
// //       }
// //     ],
// //     "projection": {"type": "albersUsa"}
// //   }
  
//   vegaEmbed("#vis", vlSpec);