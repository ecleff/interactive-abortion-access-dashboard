

const margin = { top: 10, right: 10, bottom: 10, left: 10 }
  width =1000 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;


d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {
  // create a path generator
  var path = d3.geoPath();

  // create the map container
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.csv("ab_counties.csv").then(function(data) {
 
    // create a map of legal status by county fips code
    var statusByFips = d3.rollup(data, 
      // v => v.legal_status, 
      v => v[0].legal_status,
      d => d.origin_fips_code
    );
    console.log(statusByFips);


    // create a map of average distance by fips
  var distanceByFips = d3.rollup(data,
    v => d3.mean(v, d => d.avg_distance),
    d => d.origin_fips_code
  );
  console.log(distanceByFips);

  // create the county map
  var countyMap = d3.rollup(data, function(v) {
    return {
      lat: +v[0].lat,
      lng: +v[0].lng,
      avg_distance: +v[0].avg_distance
    };
  }, function(d) {
    return d.origin_fips_code;
  });
  console.log(countyMap)
  console.log(countyMap.keys())
  console.log(countyMap.get('01001').lng);
console.log(countyMap.get('01001').lat);

  // projection
    // define the projection
// define the projection
var projection = d3.geoAlbersUsa()
    .scale(1200) // increase the scale to zoom in
    .translate([width / 2, height / 2 + 50]) // move the center down by 50 pixels
    // .rotate([96, 0]); // rotate the map to center it on the southern part of the US


console.log(projection)
  
    // color
    const myColor = d3.scaleOrdinal()
      .domain(["Legal", "Illegal", "Six-Week Ban"])
      .range(["#7294b7", "#863233", "#d38889"]);

    // create the US map
us_map =    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
          var fips = d.id;
          var status = statusByFips.get(fips);
          return myColor(status);
        });


// testing tooltip stuff
// create a path generator

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
us_map.on("mouseover", function(d) {
      tooltip.transition()
          .duration(200)
          .style("opacity", .9);
      tooltip.html( 
        "Legal Status: " + statusByFips.get(d.id))
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
    })
    
us_map.on("mouseout", function(d) {
      tooltip.transition()
          .duration(500)
          .style("opacity", 0);
    })
    

// add mouseover event to the county map


      // create a new g element for the bubble plot


// radius range
var circleRadiusRange = [3, 10];

// Define the logarithmic scale for the domain of avg_distance
var distanceScale = d3.scaleLog()
  .domain(d3.extent(data, function(d) { return d.avg_distance; }))
  .range(circleRadiusRange);
  
// create the circle elements
// create the circle elements
// create circles for each county
// svg.append("g")
//   .attr("class", "circles")
//   .selectAll("circle")
//   .data(countyMap)
//   .enter().append("circle")
//     .attr("cx", function(d) { return projection([d[1].lng, d[1].lat])[0]; })
//     .attr("cy", function(d) { return projection([d[1].lng, d[1].lat])[1]; })
//     .attr("r", function(d) { return distanceByFips.get(d[0]); })
//     .style("fill", "red")
//     .style("opacity", 0.5);
function updateCircles(data, scale = 1) {
  // draw dots for each earthquake
  var circs = svg.append("g")
      .selectAll('circle')
      .data(data)
      .join('circle')
      .style("stroke-width", 2 / scale)
      .style("stroke", "gray")
      .attr("fill-opacity", 0.5)
      .attr("fill", "orange")
      .attr("cx", function (d) {
        var coords = countyMap.get(d.origin_fips_code);
          // console.log(projection([coords.lng, coords.lat]))
          return coords.lng
      })
      .attr("cy", function (d) { 
        var coords = countyMap.get(d.origin_fips_code);
        return coords.lat })
      .attr("r", function (d) {
          return distanceScale(d.avg_distance) / (scale / 1.2);
      })
    }
    updateCircles(data);




// create circles for each county
// svg.selectAll("circle")
//   .data(data)
//   .join("circle")
//   .attr("cx", function(d) {
//     var coords = countyMap.get(d.key);
//     if (!coords) {
//       return null;
//     }
//     return projection([coords.lng, coords.lat])[0];
//   })
//   .attr("cy", function(d) {
//     var coords = countyMap.get(d.key);
//     if (!coords) {
//       return null;
//     }
//     return projection([coords.lng, coords.lat])[1];
//   })
//   .attr("r", 9
//   // function(d) {
//   //   return distanceScale(d.value.avg_distance);
//   // }
//   )
  
  // .attr("cx", function(d) {
  //   var coords = countyMap.get(d.origin_fips_code);
  //   console.log(coords);
  //   return projection([coords.lng, coords.lat])[0];
  // })
  // .attr("cy", function(d) {
  //   var coords = countyMap.get(d.origin_fips_code);
  //   console.log(coords);
  //   return projection([coords.lng, coords.lat])[1];
  // })
  // .attr("r", 9
  // // function(d) {
  // //   return distanceScale(countyMap.get(d.key).avg_distance);
  // // }
  // )
  // .style("fill", "white")
  // .style("fill-opacity", 0.5)
  // .style("stroke", "black")
  // .style("stroke-opacity", 0.5);


  });
});


