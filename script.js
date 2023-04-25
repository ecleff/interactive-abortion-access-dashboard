

const margin = { top: 10, right: 10, bottom: 10, left: 10 }
  width =980 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;


// counties
d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {



  // create the map container
  var svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.csv("data/all_yrs_counties.csv").then(function(data) {
 
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


  var selectedValue = document.getElementById("legal-status").value;
  
  // Update the map fill colors based on the selected value
  us_map.style("fill", function(d) {
    var fips = d.id;
    var status = statusByFips.get(fips);
    if (selectedValue === "all" || status === selectedValue) {
      return myColor(status);
    } else {
      return "#2B1212"; // Use a gray color for unselected values
    }
  });

  // const filteredData = data.filter(d => selectedValue.includes(d.legal_status));
  let filteredData = data;
  if (selectedValue !== "all") {
    filteredData = data.filter(d => selectedValue.includes(d.legal_status));
  }
 console.log(selectedValue)
 
  console.log(filteredData)
  updateSecondGraph(filteredData);
}

// Add event listeners to the inputs to update the map

document.getElementById("legal-status").addEventListener("change", updateMap);

// Initialize the map with all selected
updateMap();

// update graphs below map





function updateSecondGraph(filteredData, selectedValue) {
  filteredData.forEach(function (d) {
    d["population"] = +d["population"];
    d["avg_distance"] = +d["avg_distance"];

  });
  console.log(filteredData)

 // Get the unique set of legal statuses from the filtered data
 const legalStatuses = new Set(["all", ...filteredData.map(d => d.legal_status)]);

  
 // Only show the line chart if "all" is selected
 if (selectedValue === "all") {
   // Group the data by year and calculate the mean average distance
   const dataByYear = d3.group(filteredData, d => d.year);
   const meanData = Array.from(dataByYear, ([year, data]) => ({
     year,
     avg_distance: d3.mean(data, d => d.avg_distance)
   }));

   // Define the dimensions of the chart
   const margin = { top: 20, right: 20, bottom: 30, left: 50 };
   const width = 500 - margin.left - margin.right;
   const height = 300 - margin.top - margin.bottom;
 

   console.log(dataByYear)
   console.log(meanData)
   // Select the SVG element and set its dimensions
   const svg2 = d3.select("body")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform", `translate(${margin.left}, ${margin.top})`);
 
   // Define the x and y scales
   const xScale = d3.scaleLinear()
     .domain(d3.extent(meanData, d => +d.year))
     .range([0, width]);
   const yScale = d3.scaleLinear()
     .domain([0, d3.max(meanData, d => +d.avg_distance)])
     .range([height, 0]);
 
   // Draw the x and y axes
   const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
   const yAxis = d3.axisLeft(yScale);
   svg2.append("g")
     .attr("transform", `translate(0, ${height})`)
     .call(xAxis);
   svg2.append("g")
     .call(yAxis);
 
   // Draw the line
   const line = d3.line()
     .x(d => xScale(+d.year))
     .y(d => yScale(+d.avg_distance));
   svg2.append("path")
     .datum(meanData)
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 2)
     .attr("d", line);
 } else {

  // If a specific legal status is selected, show the scatter plot

// Create an array of objects for the scatterplot
const scatterData = filteredData.map(d => {
return {
  x: +d.population,
  y: +d.avg_distance,
  legal_status: d.legal_status
};
});
console.log(scatterData)

const scatterDiv = d3.select("#scatter-plot-container")
// Remove any existing scatter plot
scatterDiv.selectAll("*").remove();

const scatterPlotWidth = 600;
const scatterPlotHeight = 400;

const scatterPlotSvg = scatterDiv
  .append("svg")
  .attr("width", scatterPlotWidth)
  .attr("height", scatterPlotHeight);

  
// Define the dimensions of the scatter plot
const margin = { top: 20, right: 20, bottom: 30, left: 50 };

const width = scatterPlotWidth - margin.left - margin.right;
const height = scatterPlotHeight - margin.top - margin.bottom;

// Define the x and y scales
  const xScale = d3.scaleLinear()
  .domain([d3.min(scatterData, d => d.x), d3.max(scatterData, d => d.x)])
  .range([0, width]);

  const formatNumber = d3.format(".2s");
  scatterPlotSvg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScale).tickFormat(formatNumber))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(0)")
    .style("text-anchor", "start")
    .style("font-size", "12px");
    scatterPlotSvg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height+45 )
  .text("population");

const yScale = d3.scaleLinear()
  .domain([d3.min(scatterData, d => d.y), d3.max(scatterData, d => d.y)])
  .range([height, 0]);
  scatterPlotSvg.append("g")
    .call(d3.axisLeft(yScale).ticks(5))
    .selectAll("text")
    .style("font-size", "12px");

    scatterPlotSvg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+120)
    .attr("x", -margin.top)
    .text("average distance");



  const myColor = d3.scaleOrdinal()
      .domain(["Legal", "Illegal", "Six-Week Ban"])
      .range(["#7294b7", "#863233", "#d38889"]);
// Draw the scatterplot circles
scatterPlotSvg.selectAll("circle")
.data(scatterData)
.enter()
.append("circle")
.attr("cx", d => xScale(d.x))
.attr("cy", d => yScale(d.y))
.attr("r", 3)
.attr("fill", d => myColor(d.legal_status));

// line graph for average distance
const dataByYear = d3.group(filteredData, d => d.year);
const meanData = Array.from(dataByYear, ([year, data]) => ({
  year,
  avg_distance: d3.mean(data, d => d.avg_distance)
}));
console.log(dataByYear)
console.log(meanData)
const lineDiv = d3.select("#line-chart")
// Remove any existing scatter plot
lineDiv.selectAll("*").remove();

const linePlotWidth = 600;
const linePlotHeight = 400;

const lineSvg = lineDiv
  .append("svg")
  .attr("width", linePlotWidth)
  .attr("height", linePlotHeight);

  
// Define the dimensions of the scatter plot
// const margin = { top: 20, right: 20, bottom: 30, left: 50 };

// const width = scatterPlotWidth - margin.left - margin.right;
// const height = scatterPlotHeight - margin.top - margin.bottom;

// Define the x and y scales


 }



//  small multiples

 // If a specific legal status is selected, show the small multiples bar chart
  //  ...
  //    Get the unique set of states from the filtered data
  // const states = new Set(filteredData.map(d => d.state_name));
  
  // // Define the dimensions of each chart
  // const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  // const width = 200 - margin.left - margin.right;
  // const height = 150 - margin.top - margin.bottom;



  
  // // Loop through each state and create a small multiples bar chart
  // states.forEach(state => {
  //   // Filter the data for the current state
  //   const stateData = filteredData.filter(d => d.state_name === state);
  //   // console.log(stateData)


  //   const svg2 = d3.select("body")
  //   .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform",
  //         "translate(" + margin.left + "," + margin.top + ")");

  //       // svg2.selectAll("g").remove();
  //       // svg2.selectAll("text").remove();

  //       svg2.selectAll("*").remove();

   
  //   // Define the x and y scales
  //   const xScale = d3.scaleBand()
  //     .domain(stateData.map(d => d.county))
  //     .range([0, width])
  //     .padding(0.1);
  //   const yScale = d3.scaleLinear()
  //     .domain([0, d3.max(stateData, d => +d.avg_distance)])
  //     .range([height, 0]);
    
  //   // Draw the x and y axes
  //   const xAxis = d3.axisBottom(xScale);
  //   const yAxis = d3.axisLeft(yScale);
  //   svg2.append("g")
  //     .attr("transform", `translate(0, ${height})`)
  //     .call(xAxis)
  //     .selectAll("text")
  //     .attr("y", 0)
  //     .attr("x", 9)
  //     .attr("dy", ".35em")
  //     .attr("transform", "rotate(90)")
  //     .style("text-anchor", "start")
  //     .style("font-size", "6px");
  //   svg2.append("g")
  //     .call(yAxis)
  //     .append("text")
  //     .selectAll("text")
  //     .style("font-size", "6px")
  //     .attr("fill", "#000")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", "0.71em")
  //     .attr("text-anchor", "end")
  //     .text("Avg Distance");
  //   // color
  //     const myColor = d3.scaleOrdinal()
  //     .domain(["Legal", "Illegal", "Six-Week Ban"])
  //     .range(["#7294b7", "#863233", "#d38889"]);
  //   // Draw the bars
  //   svg2.selectAll(".bar")
  //     .data(stateData)
  //     .enter()
  //     .append("rect")
  //     .attr("class", "bar")
  //     .attr("x", d => xScale(d.county))
  //     .attr("y", d => yScale(+d.avg_distance))
  //     .attr("width", xScale.bandwidth())
  //     .attr("height", d => height - yScale(+d.avg_distance))
  //     .attr("fill", d => myColor(d.legal_status));
  // });
  // const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  // const width = 600 - margin.left - margin.right;
  // const height = 400 - margin.top - margin.bottom;

  // // Remove any existing chart elements
  // d3.select("#second-chart").selectAll("*").remove();

  // // Create a new SVG element for the chart
  // const svg2 = d3.select("body")
  //   .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", `translate(${margin.left},${margin.top})`);

  // // Calculate the mean avg_distance for each year
  // const meanData = d3.rollup(filteredData, v => d3.mean(v, d => d.avg_distance), d => d.year);

  // // Convert the meanData map to an array of objects
  // const meanDataArray = Array.from(meanData, d => ({ year: d[0], avg_distance: d[1] }));

  // // Define the x and y scales
  // const xScale = d3.scaleLinear()
  //   .domain(d3.extent(meanDataArray, d => d.year))
  //   .range([0, width]);
  // const yScale = d3.scaleLinear()
  //   .domain([0, d3.max(meanDataArray, d => d.avg_distance)])
  //   .range([height, 0]);

  // // Draw the x and y axes
  // const xAxis = d3.axisBottom(xScale);
  // const yAxis = d3.axisLeft(yScale);
  // svg2.append("g")
  //   .attr("transform", `translate(0,${height})`)
  //   .call(xAxis);
  // svg2.append("g")
  //   .call(yAxis);

  // // Define the line function
  // const line = d3.line()
  //   .x(d => xScale(d.year))
  //   .y(d => yScale(d.avg_distance));

  // // Draw the line chart
  // svg2.append("path")
  //   .datum(meanDataArray)
  //   .attr("fill", "none")
  //   .attr("stroke", "steelblue")
  //   .attr("stroke-width", 2)
  //   .attr("d", line);

}

  });
});


