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
  height = 600 - margin.top - margin.bottom;
document.addEventListener("DOMContentLoaded", function() {
const svg = d3
  // .select("#chart")
  .select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("border", "1px solid black");

  console.log(svg)
// Map and projection
// const projection = d3.geoMercator()
    // .scale(width / 1.3 / Math.PI)
    // .translate([width / 2, height / 2])

// Load external data and boot
d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {
console.log(us)

  
const path = d3.geoPath();
  
const projection = d3.geoAlbersUsa()
  .fitSize([width, height], us);
    // Draw the map
    svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
        .join("path")
        .attr("d", path)
        .attr("fill", d => {
          // Replace this with your own data value to color mapping
          return "steelblue";
        });
});
});