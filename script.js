const margin = { top: 10, right: 10, bottom: 10, left: 50 }
  width =550 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;


// counties
d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {



  // create the map container
  var svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.csv("data.nosync/all_yrs_counties.csv").then(function(data) {
 
    // create a map of legal status by county fips code
    var statusByFips = d3.rollup(data, 
      // v => v.legal_status, 
      v => v[0].legal_status,
      d => d.origin_fips_code,

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

const projection = d3.geoIdentity()
.scale(0.5)
// .translate([width / 2, height / 2])


    console.log(projection)
    console.log(topojson.feature(us, us.objects.counties).features)


const path = d3.geoPath(projection)
// .projection(projection)

console.log(path)
    // color
const myColor = d3.scaleOrdinal()
      .domain(["Legal", "Illegal", "Six-Week Ban"])
      .range(["#364759", "#944748", "#8C5F62"])
      // .range(["#7294b7", "#99514D", "#d38889"])
      ;


    // create the US map
us_map =    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .style("stroke", "grey")
        .style("stroke-width", "0.2px")
        .style("opacity", "0.9")
        .style("fill", "#2B1212")
        // .style("fill", function(d) {
        //   var fips = d.id;
        //   var status = statusByFips.get(fips);
        //   return myColor(status);
        // });
        
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

  us_map.style("stroke", function(d) {
    var fips = d.id;
    var status = statusByFips.get(fips);
    if (status === selectedValue) {
      return "#a6a5a5";
    } else {
      return "#2B1212"; // Use a gray color for unselected values
    }
  });

  us_map.style("stroke-width", function(d) {
    var fips = d.id;
    var status = statusByFips.get(fips);
    if (status === selectedValue) {
      return "0.4";
    } else {
      return "0.01"; // Use a gray color for unselected values
    }
  });

  // const filteredData = data.filter(d => selectedValue.includes(d.legal_status));
  let filteredData = data;
  if (selectedValue !== "all") {
    filteredData = data.filter(d => selectedValue.includes(d.legal_status));
  }
 console.log(selectedValue)
 
console.log(filteredData)


  const yAxisLabel = getYAxisLabel(selectedValue);
  d3.select("#scatter-plot-container")
    .select(".y-axis-label")
    .text(yAxisLabel);


  getYAxisLabel(selectedValue)

  updateSecondGraph(filteredData);
}

// Add event listeners to the inputs to update the map

document.getElementById("legal-status").addEventListener("change", updateMap);

// Initialize the map with all selected
updateMap();


console.log(selectedValue)

function getYAxisLabel(selectedValue) {
  if (selectedValue === "Illegal") {
    return "Illegal caption";
  } else if (selectedValue === "Legal") {
    return "Legal caption";
  } else if (selectedValue === "Six-Week Ban") {
    return "Six-week Ban caption";
  } 
  else {
    return "All caption";
  }}
// update graphs below map

// console.log(selectedValue)


function updateSecondGraph(filteredData, selectedValue) {
  filteredData.forEach(function (d) {
    d["population"] = +d["population"];
    d["avg_distance"] = +d["avg_distance"];

  });
  console.log(filteredData)

 // Get the unique set of legal statuses from the filtered data
 const legalStatuses = new Set(["all", ...filteredData.map(d => d.legal_status)]);


//  text
var legalStatusSelect = document.getElementById("legal-status");
var textBox = document.getElementById("text-box");

// Set the initial text of the text box
textBox.innerHTML = "<p>The overturn of Roe v. Wade had immediate and harmful consequences for the nation as a whole, but it hit certain states particularly hard. Select from the menu above to read more about the shifting legal status of abortion in the U.S. from 2022.</p>";

legalStatusSelect.addEventListener("change", function() {
  var legalStatus = legalStatusSelect.value;

  if (legalStatus === "Legal") {
    textBox.innerHTML = "<p>As of 2023, abortion remains legal in 36 states. Some states, like California and Minnesota, already had abortion as a legal right in the state constitution before Roe fell. Certain states have even enacted expanded protection laws to promote wider access.</p>";
  } else if (legalStatus === "Illegal") {
    textBox.innerHTML = "<p>As of 2023, abortion has been made illegal in 13 states: Texas, Louisiana, South Dakota, Arkansas, Oklahoma, Mississippi, Missouri, Tennessee, Alabama, Idaho, and West Virginia. Georgia law prohibits abortion after 6 weeks, which you can learn more about by selecting 'Six-Week Ban' from the menu drop-down. Certain states within this group even have enacted legal measures against people seeking out-of-state abortion care.</p>";
  } else if (legalStatus === "Six-Week Ban") {
    textBox.innerHTML = "<p>The legality of abortion in Georgia is questionable. While not fully illegal like in other states, the The Georgia HB481 is a six-week abortion ban that states that; except in certain situations, physicians practicing medicine in the state of Georgia would be prohibited from offering abortion services to pregnant women if a so-called 'fetal heartbeat' is present, which typically occurs in the 6th week of pregnancy.</p>";
  } else {
    textBox.innerHTML = "<p>The overturn of Roe v. Wade had immediate and harmful consequences for the nation as a whole, but it hit certain states particularly hard. Select from the menu above to read more about the shifting legal status of abortion in the U.S. from 2022.</p>";
  }
});

  // If a specific legal status is selected, show the scatter plot

  
// Create an array of objects for the scatterplot
const filteredData2022 = filteredData.filter(d => d.year === "2022");
const scatterData = filteredData2022.map(d => {
return {
  x: +d.population,
  y: +d.avg_distance,
  legal_status: d.legal_status,
  origin_county_name: d.origin_county_name
};
});
console.log(scatterData)


const scatterDiv = d3.select("#scatter-plot-container")
// Remove any existing scatter plot
scatterDiv.selectAll("*").remove();

const scatterPlotWidth = 980;
const scatterPlotHeight = 450;

const scatterPlotSvg = scatterDiv
  .append("svg")
  .attr("width", scatterPlotWidth)
  .attr("height", scatterPlotHeight);

  
// Define the dimensions of the scatter plot
// const margin = { top: 10, right: 10, bottom: 30, left: 50 };
const margin = { top: 50, right: 30, bottom: 30, left: 200 }

const width = scatterPlotWidth - margin.left - margin.right;
const height = scatterPlotHeight - margin.top - margin.bottom;

// Define the x and y scales
  const xScale = d3.scaleLinear()
  .domain([d3.min(scatterData, d => d.x), d3.max(scatterData, d => d.x)])
  .range([0, width]);

  const formatNumber = d3.format(".2s");
  xAxis = scatterPlotSvg.append("g")
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
  .style("fill", "white")
  .text("population");

const yScale = d3.scaleLinear()
  .domain([d3.min(scatterData, d => d.y), d3.max(scatterData, d => d.y)])
  .range([height, 0]);
  scatterPlotSvg.append("g")
    .call(d3.axisLeft(yScale).ticks(5).tickFormat(formatNumber))
    .selectAll("text")
    .style("fill", "white")
    .style("font-size", "4px");

    scatterPlotSvg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+250)
    .attr("x", -margin.top+40)
    .style("fill", "white")
    .text("average distance");



  const myColor = d3.scaleOrdinal()
      .domain(["Legal", "Illegal", "Six-Week Ban"])
      .range(["#364759", "#944748", "#8C5F62"])
      // .range(["#7294b7", "#863233", "#d38889"])
      ;


// tooltip
  // Its opacity is set to 0: we don't see it by default.
  const tooltip = d3
    .select("#scatter-plot-container")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px");
    // .style("padding", "10px");

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  const mouseover = function (event, d) {
    tooltip.style("opacity", 1);
  };

  const mousemove = function (event, d) {
    tooltip
      .html(
        `${d.origin_county_name}<br>Average distance to nearest abortion provider: ${formatNumber(d.y)} mi <br> Population: ${formatNumber(d.x)}`
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px");
  };

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  const mouseleave = function (event, d) {
    tooltip.transition().duration(200).style("opacity", 0);
  };

// Draw the scatterplot circles
scatterPlotSvg.selectAll("circle")
.data(scatterData)
.enter()
.append("circle")
.attr("cx", d => xScale(d.x))
.attr("cy", d => yScale(d.y))
.attr("r", 7)
.attr("opacity", "0.7")
.attr("fill", d => myColor(d.legal_status))
.on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);


// slider for scatter

// Add an event listener to the button created in the html part
function updatePlot() {
  // Get the value of the button
  xlim = this.value;

  // Update X axis
  xScale.domain([0, xlim]);
  xAxis.transition().duration(1000).call(d3.axisBottom(xScale))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(0)")
    .style("text-anchor", "start")
    .style("font-size", "12px");



  // Update chart
  scatterPlotSvg.selectAll("circle")

  .data(scatterData)
.attr("class", "bubbles")
  // .enter()
  // .append("circle")
  .join("circle")
  .attr("cx", d => xScale(d.x))
  .attr("cy", d => yScale(d.y))
  .attr("r", 7)
  .attr("fill", d => myColor(d.legal_status));
}

d3.select("#mySlider")
.style("background-color", "#a6a5a5")   // change the track color
.style("outline", "none")           // remove the default focus outline
.style("appearance", "none")        // remove the default slider styling
.style("height", "6px")             // set the track height
.style("border-radius", "5px")      // round the track corners
.style("cursor", "pointer")         // set the cursor to a pointer on hover
.style("margin", "auto")  
.on("input", updatePlot);

d3.select("#mySlider::-webkit-slider-thumb") // target the slider thumb element for webkit browsers
    .style("background-color", "black")   // change the thumb color
    .style("border", "none")            // remove the default border
    .style("height", "16px")            // set the thumb height
    .style("width", "16px")             // set the thumb width
    .style("border-radius", "50%")      // round the thumb into a circle
    .style("margin-top", "-5px")        // position the thumb vertically
    .style("cursor", "pointer");   
// line graph for average distance
const dataByYear = d3.group(filteredData, d => d.year);
const meanData = Array.from(dataByYear, ([year, data]) => ({
  year,
  avg_distance: d3.mean(data, d => d.avg_distance)
}));
console.log(dataByYear)
console.log(meanData)



// Line chart
const lineDiv = d3.select("#line-chart")
// Remove any existing scatter plot
lineDiv.selectAll("*").remove();

const linePlotWidth = 850;
const linePlotHeight = 500;

const lineSvg = lineDiv
  .append("svg")
  .attr("width", linePlotWidth)
  .attr("height", linePlotHeight);



// Define the x and y scales
// Define the x and y scales
const xLine = d3.scaleLinear()
.domain(d3.extent(meanData, d => +d.year))
.range([0, width]);

const yLine = d3.scaleLinear()
// .domain([0, d3.max(meanData, d => +d.avg_distance)])
.domain([0, 300])
.range([height, 0]);

// axes
const formatYear = d3.format("d")
lineSvg.append("g")
.attr("transform", `translate(0, ${height})`)
.call(d3.axisBottom(xLine).ticks(5).tickFormat(formatYear))
.selectAll("text")
  .attr("transform", "translate(-10,0)rotate(0)")
  .style("fill", "white")
  .style("text-anchor", "start")
  .style("font-size", "12px");
lineSvg.append("text")
.attr("text-anchor", "end")
.attr("x", width)
.attr("y", height+45 )
.style("fill", "white")
.text("year");

// lineSvg.append("g")
// .call(d3.axisLeft(yLine).ticks(5))
// .selectAll("text")
// .style("font-size", "4px")
// .style("fill", "white");





lineSvg.append("text")
.attr("text-anchor", "start")
.attr("transform", "rotate(-90)")
.attr("y", -margin.left+250)
.attr("x", -margin.top-150)
.style("fill", "white")
.text("average distance");



// line colors
const lineColor = d3.scaleOrdinal()
.domain(["all","Legal", "Illegal", "Six-Week Ban"])
.range(["white","#7294b7", "#863233", "#d38889"]);





// Draw the line
const line = d3.line()
.x(d => xLine(d.year))
.y(d => yLine(+d.avg_distance));
lineSvg.append("path")
.datum(meanData)
.attr("fill", "none")
.transition()
.duration(2000)
.attr("stroke",   "#a6a5a5")
.attr("stroke-width", 2)
.attr("d", line)

// Add circles for each data point
lineSvg.selectAll("circle")
.data(meanData)
.enter()
.append("circle")
.attr("cx", d => xLine(d.year))
.attr("cy", d => yLine(+d.avg_distance))
.attr("r", 4)
.attr("fill", "#a6a5a5")
.on("mouseover", function(event, d) {
  d3.select(this)
    .style("stroke", "white");
  tooltip.transition()
    .duration(200)
    .style("opacity", 0.9);
  tooltip.html(`${d.year}: ${formatNumber(d.avg_distance)} mi`)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 28) + "px");
})
.on("mousemove", function(event) {
  tooltip.style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 28) + "px");
})
.on("mouseleave", function(event) {
  d3.select(this)
    .style("stroke", "none");
  tooltip.transition()
    .duration(500)
    .style("opacity", 0);
});;


// bar chart by state
const dataByState = d3.group(filteredData2022, d => d.state_name);
const meanStateData = Array.from(dataByState, ([state, data]) => {
  const legalStatus = data[0].legal_status; 
  return{
  state,
  legal_status: legalStatus,
  avg_distance: d3.mean(data, d => d.avg_distance)
};
});
// console.log(dataByYear)
console.log(meanStateData)


// bar
const barDiv = d3.select("#bar-chart")
// Remove any existing scatter plot
barDiv.selectAll("*").remove();

const barPlotWidth = 980;
const barPlotHeight = 500;

const barSvg = barDiv
  .append("svg")
  .attr("width", barPlotWidth- margin.left - margin.right)
  .attr("height", barPlotHeight- margin.top - margin.bottom);




// Sort meanStateData by avg_distance in descending order
meanStateData.sort((a, b) => b.avg_distance - a.avg_distance);
// Set the x and y scales
// const xBar = d3.scaleBand()
//   .range([0, width])
//   .domain(meanStateData.map(d => d.state))
//   .padding(0.1);

// const yBar = d3.scaleLinear()
//   .range([height, 0])
//   .domain([0, d3.max(meanStateData, d => d.avg_distance)]);


// // Create the bars
// barSvg.selectAll(".bar")
//   .data(meanStateData)
//   .enter().append("rect")
//   .attr("class", "bar")
//   .attr("x", d => xBar(d.state))
//   .attr("y", d => yBar(d.avg_distance))
//   .attr("width", xBar.bandwidth())
//   .attr("height", d => height - yBar(d.avg_distance))
//   .attr("fill", d => myColor(d.legal_status));

// // Add the x-axis
// barSvg.append("g")
//   .attr("class", "x-axis")
//   .attr("transform", `translate(0,${height})`)
//   .call(d3.axisBottom(xBar));

//  barSvg.append("text")
// .attr("text-anchor", "end")
// .attr("x", width)
// .attr("y", height+45 )
// .style("fill", "white")
// .text("State")
// // Add the y-axis
// barSvg.append("g")
//   .attr("class", "y-axis")
//   .call(d3.axisLeft(yBar));
// Set the x and y scales
const xBar = d3.scaleLinear()
  .range([0, width])
  .domain([0, d3.max(meanStateData, d => d.avg_distance)]);

const yBar = d3.scaleBand()
  .range([height, 0])
  .domain(meanStateData.map(d => d.state))
  .padding(0.1);

// Create the bars
barSvg.selectAll(".bar")
.attr("class", "bars")
  .data(meanStateData)
  .enter().append("rect")

  .attr("class", "bar")
  .attr("y", d => yBar(d.state))
  .attr("x", 0)
  .attr("height", yBar.bandwidth())
  .attr("width", d => xBar(d.avg_distance))
  .attr("fill", d => myColor(d.legal_status))
  .on("mouseover", function(event, d) {
    d3.select(this)
      .style("stroke", "white");
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip.html(`State: ${d.state}`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  })
  .on("mousemove", function(event) {
    tooltip.style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseleave", function(event) {
    d3.select(this)
      .style("stroke", "none");
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });
;

// Add the y-axis
barSvg.append("g")
  .attr("class", "y-axis")
  .call(d3.axisLeft(yBar));

// Add the x-axis
barSvg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xBar));

// Add the state labels
// barSvg.selectAll(".label")
//   .data(meanStateData)
//   .enter().append("text")
//   .attr("class", "label")
//   .attr("x", d => xBar(d.avg_distance)) // Set the x position of the labels based on the avg_distance value
//   .attr("y", d => yBar(d.state) + yBar.bandwidth() / 2) // Set the y position of the labels to the center of the bar
//   .attr("dy", "0.35em") // Center the text vertically
//   .style("fill","white")



  barSvg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height+45 )
  .style("fill", "white")
  .text("average distance");





 }



  });
});
