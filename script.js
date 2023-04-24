

const margin = { top: 10, right: 10, bottom: 10, left: 10 }
  width =980 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;


// counties
d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {



  // create the map container
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.csv("all_yrs_counties.csv").then(function(data) {
 
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

const projection = d3.geoMercator()
  .scale([50]) // adjust the scale value to zoom in/out
  .translate([width / 4, height / 4]) // adjust the translate values to center the map
  // .center(d3.geoCentroid(topojson.feature(us, us.objects.counties).features))
  .fitSize([width, height], topojson.feature(us, us.objects.counties).features);
    // .scale(-100) // increase the scale to zoom in
    // .translate([width, height + 50]) // move the center down by 50 pixels
    // .rotate([96, 0]); // rotate the map to center it on the southern part of the US
    console.log(projection)
    console.log(topojson.feature(us, us.objects.counties).features)
// var path = d3.geoPath().projection(projection);

const path = d3.geoPath()
// .projection(projection)
console.log(path)
    // color
const myColor = d3.scaleOrdinal()
      .domain(["Legal", "Illegal", "Six-Week Ban"])
      .range(["#7294b7", "#99514D", "#d38889"]);


    // create the US map
us_map =    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .style("stroke", "grey")
        .style("stroke-width", "0.2px")
        // .style("op")
        .style("fill", function(d) {
          var fips = d.id;
          var status = statusByFips.get(fips);
          return myColor(status);
        });
        
// Define a function to update the map based on the selected checkboxes


function updateMap() {
  // Get the selected checkbox values
  // var selectedValues = Array.from(document.querySelectorAll('input[name="legal-status"]:checked'))
  //   .map(function(input) { return input.value; });
  // // Update the map fill colors based on the selected values
  // us_map.style("fill", function(d) {
  //   var fips = d.id;
  //   var status = statusByFips.get(fips);
  //   if (selectedValues.includes(status)) {
  //     return myColor(status);
  //   } else {
  //     return "#ccc"; // Use a gray color for unselected values
  //   }
  // });

  var selectedValue = document.getElementById("legal-status").value;
  
  // Update the map fill colors based on the selected value
  us_map.style("fill", function(d) {
    var fips = d.id;
    var status = statusByFips.get(fips);
    if (selectedValue === "all" || status === selectedValue) {
      return myColor(status);
    } else {
      return "#ccc"; // Use a gray color for unselected values
    }
  });
  
  // Filter the data based on the selected value
  // var filteredData;
  // if (selectedValue === "all") {
  //   filteredData = data;
  // } else {
  //   filteredData = data.filter(function(d) {
  //     return d.legal_status === selectedValue;
  //   });
  // }
  

  const filteredData = data.filter(d => selectedValue.includes(d.legal_status));

  // Clear the existing small multiples graphs
 
 
  console.log(filteredData)
  updateSecondGraph(filteredData);
}

// Add event listeners to the checkbox inputs to update the map
// document.querySelectorAll('input[name="legal-status"]').forEach(function(input) {
//   input.addEventListener("change", updateMap);
// });
document.getElementById("legal-status").addEventListener("change", updateMap);

// Initialize the map with all checkboxes selected
updateMap();

function updateSecondGraph(filteredData) {
  // Get the unique set of states from the filtered data
  const states = new Set(filteredData.map(d => d.state_name));
  
  // Define the dimensions of each chart
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 200 - margin.left - margin.right;
  const height = 150 - margin.top - margin.bottom;



  
  // Loop through each state and create a small multiples bar chart
  states.forEach(state => {
    // Filter the data for the current state
    const stateData = filteredData.filter(d => d.state_name === state);
    console.log(stateData)


    const svg2 = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

        // svg2.selectAll("g").remove();
        // svg2.selectAll("text").remove();

        svg2.selectAll("*").remove();

   
    // Define the x and y scales
    const xScale = d3.scaleBand()
      .domain(stateData.map(d => d.county))
      .range([0, width])
      .padding(0.1);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => +d.avg_distance)])
      .range([height, 0]);
    
    // Draw the x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    svg2.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start")
      .style("font-size", "6px");
    svg2.append("g")
      .call(yAxis)
      .append("text")
      .selectAll("text")
      .style("font-size", "6px")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Avg Distance");
    // color
      const myColor = d3.scaleOrdinal()
      .domain(["Legal", "Illegal", "Six-Week Ban"])
      .range(["#7294b7", "#863233", "#d38889"]);
    // Draw the bars
    svg2.selectAll(".bar")
      .data(stateData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.county))
      .attr("y", d => yScale(+d.avg_distance))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(+d.avg_distance))
      .attr("fill", d => myColor(d.legal_status));
  });
}



  });
});


