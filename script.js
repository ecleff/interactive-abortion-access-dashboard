// // make the SVG and viewbox
// const svg = d3.select("#chart").append("svg")
//     .attr("preserveAspectRatio", "xMinYMin meet")
//     .style("background-color", "#fff")
//     .attr("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight)
//     .attr("id", "map-svg")
//     .classed("svg-content", true);

// let projectionScale = 250;

// // define the settings for map projection
// const projection = d3.geoOrthographic()
//     .translate([window.innerWidth / 2, window.innerHeight / 2])
//     // .rotate([90, -20, 0]) // Mexico side
//     .rotate([-33, -20, 0]) // Africa side
//     // .rotate([-121, -20, 0]) // Eastern side
//     .scale(projectionScale)
//     .center([0, 0]);

// // create the geo path generator
// let geoPathGenerator = d3.geoPath().projection(projection);

// // will be used later for grid lines
// const graticule = d3.geoGraticule();

// var files = [
//     { "type": "json", "file": "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson" },
//     { "type": "csv", "file": "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv" }
// ];
// var promises = [];

// files.forEach(function (d) {
//     if (d.type == "json") {
//         promises.push(d3.json(d.file));
//     } else {
//         promises.push(d3.csv(d.file));
//     }
// });

// Promise.all(promises).then(function (values) {
//     // console.log(values)
//     drawMap(values[0], values[1])
// });

// function drawMap(geo, data) {
//     console.log("GEO: ", geo.features)
//     console.log("dataset: ", data)

//     var colorScale = d3.scaleLinear()
//         .domain(d3.extent(data, function (d) { return +d.pop }))
//         .range(["white", "#9c1c25"])
//         .nice();

//     console.log("BINS: ", colorScale.domain())

//     var legend = svg.append("g")
//         .attr("transform", "translate(100,100)");

//     legend.append("rect")
//         .attr("width", 20)
//         .attr("height", 100)
//         .attr("stroke-weight", 0.5)
//         .attr("stroke", "gray")
//         .attr("fill", "white");

//     legend.append("text")
//         .attr('x', 40)
//         .attr('y', 10)
//         .text(colorScale.domain()[1])

//     legend.append("text")
//         .attr('x', 40)
//         .attr('y', 90)
//         .text(colorScale.domain()[0])

//     let dataMax = colorScale.domain()[1];

//     // draw legend
//     for (var i = 1; i < 6; i++) {
//         legend.append("rect")
//             .attr("x", 0)
//             .attr("y", (i * 20) - 20)
//             .attr("width", 20)
//             .attr("height", 20)
//             .attr("fill", function () {
//                 return colorScale(dataMax / i);
//             })
//     }

//     // add grid lines
//     svg.append("path")
//         .datum(graticule)
//         .attr("class", "graticule")
//         .attr("d", geoPathGenerator)
//         .style("fill", "none");

//     console.log(geo.features)

//     // Draw the map
//     svg.append("g")
//         .selectAll("path")
//         .data(geo.features)
//         .join("path")
//         .attr("class", 'continent')
//         // draw each country
//         .attr("d", geoPathGenerator)
//         .attr("country", function (d) { return d.id })
//         // set the color of each country
//         .attr("fill", function (d) {
//             let country = data.find(el => el.code == d.id);

//             if (country == undefined) {
//                 console.log("no pop data!");
//                 console.log("no match: ", d.properties.name)
//                 return colorScale(0)
//             } else {
//                 d.properties.pop = +country.pop;
//                 console.log("match: ", d.properties.name)
//                 return colorScale(+country.pop);
//             }
//         })
//         .on('mouseover', function (e, d) {
//             console.log(d.properties)
//             d3.select(this)
//                 .transition()
//                 .duration(200)
//                 .style("stroke", "black")
//         })
//         .on('mouseout', function (d) {
//             d3.select(this)
//                 .transition()
//                 .duration(200)
//                 .style("stroke", "#d0d0d0")
//         });;
// }

// const sensitivity = 75

// var drag = d3.drag().on('drag', function (event) {
//     console.log(event)
//     const rotate = projection.rotate()
//     const k = sensitivity / projection.scale()
//     projection.rotate([
//         rotate[0] + event.dx * k,
//         rotate[1] - event.dy * k
//     ])
//     geoPathGenerator = d3.geoPath().projection(projection)
//     svg.selectAll("path").attr("d", geoPathGenerator)
// })

// const zoom = d3.zoom().on('zoom', function (event) {
//     console.log(event)
//     projection.scale(projectionScale * event.transform.k)
//     geoPathGenerator = d3.geoPath().projection(projection)
//     svg.selectAll("path").attr("d", geoPathGenerator)
// })

// svg.call(drag)
// svg.call(zoom)



// // The svg
// const svg = d3
//   .select("svg")
//   // .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);
// // const svg = d3.select("svg"),
// //   width = +svg.attr("width"),
// //   height = +svg.attr("height");

// // Map and projection
// const path = d3.geoPath();
// const projection = d3.geoMercator()
//   .scale(70)
//   .center([0,20])
//   .translate([width / 2, height / 2]);

// // Data and color scale
// let data = new Map()
// const colorScale = d3.scaleThreshold()
//   .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
//   .range(d3.schemeBlues[7]);

// // Load external data and boot
// Promise.all([
// d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
//     data.set(d.code, +d.pop)
// })
// ]).then(function(loadData){
//     let topo = loadData[0]
// console.log(data)
// console.log(topo)
//     // Draw the map
//   svg.append("g")
//     .selectAll("path")
//     .data(topo.features)
//     .join("path")
//       // draw each country
//       .attr("d", d3.geoPath()
//         .projection(projection)
//       )
//       // set the color of each country
//       .attr("fill", function (d) {
//         d.total = data.get(d.id) || 0;
//         return colorScale(d.total);
//       })
// })

const margin = { top: 10, right: 10, bottom: 10, left: 10 }
  width =1000 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;
// document.addEventListener("DOMContentLoaded", function() {
// const svg = d3
//   .select("body").append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`)
//   .attr("border", "1px solid black");

//   console.log(svg)

// // Load external data and boot
// d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {
// console.log(us)

  
// const path = d3.geoPath();
  
// const projection = d3.geoAlbersUsa()
//   .fitSize([width, height], us);
//     // Draw the map
//     svg.append("g")
//     .selectAll("path")
//     .data(topojson.feature(us, us.objects.states).features)
//         .join("path")
//         .attr("d", path)
//         .attr("fill", d => {
//           // Replace this with your own data value to color mapping
//           return "steelblue";
//         });
// });
// });
// d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {
//   // create a path generator
//   var path = d3.geoPath();

//   // create the map container
//   var svg = d3.select("body").append("svg")
//       .attr("width", width)
//       .attr("height", height);
// d3.csv("ab_counties.csv").then(function(data) {
//   // var statusByCounty = d3.rollup(data,
//   //   v => v[0].legal_status,
//   //   d => d.fips
    
//   // );
//   // console.log(statusByCounty)
//         // create a map of legal status by state
//         var statusByState = d3.rollup(data, 
//           v => v[0].legal_status, 
//           d => d.region
//         );
//         console.log(statusByState)

//           // create a map of legal status by county

//     // var statusByCounty = d3.rollup(data,
//     //   v => v[0].legal_status,
//     //   d => d.county
//     // );

//     // console.log(statusByCounty)
//     // color

//   const myColor = d3.scaleOrdinal()
//     .domain(["Legal", "Illegal", "Six-Week Ban"])
//     .range(["#231123", "#558c8c", "#82204a"]);

//   // create the US map
//   svg.append("g")
//       .attr("class", "states")
//       .selectAll("path")
//       .data(topojson.feature(us, us.objects.states).features)
//       .enter().append("path")
//       .attr("d", path)
//       // .style("fill", d => myColor(d.legal_status))
//       .style("fill", function(d) {
//         // var legalStatus = statusByState.get(d.properties.name);
//         // return legalStatus ? myColor(legalStatus) : "#ccc";
//         // return myColor(statusByState.get(d.properties.name));
//         var stateName = d.properties.name;
//         var status = statusByState.get(stateName);
//         return myColor(status);
//       });

//   // create the US map
//   // svg.append("g")
//   // .attr("class", "counties")
//   // .selectAll("path")
//   // .data(topojson.feature(us, us.objects.counties).features)
//   // .enter().append("path")
//   // .attr("d", path)
//   // .style("fill", function(d) {
//   // //   var countyName = d.properties.name;
//   // // var status = statusByCounty.get(countyName);
//   // // return status ? myColor(status) : "#ccc";
//   // var countyName = d.properties.name;
//   // var status = statusByCounty.get(countyName);
//   // return status ? myColor(status) : "#ccc";
//   // });
//   });
// });
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

    // color
    const myColor = d3.scaleOrdinal()
      .domain(["Legal", "Illegal", "Six-Week Ban"])
      .range(["#231123", "#558c8c", "#82204a"]);

    // create the US map
    svg.append("g")
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
  });
});


