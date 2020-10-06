// create svgHeight and svgWidth variables 
var svgWidth = 960;
var svgHeight = 600;

// create the margin variable
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 50
};

// create width and height variable 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG that will hold the chart
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group and move it with transform
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data from csv
d3.csv("assets/data/data.csv").then(function(healthData){
    console.log(healthData);
    
    healthData.forEach(function(data){
        console.log(data);
        // grab the necessary variables for the plot,
        //make sure poverty and healthcare variables are integers
        data.poverty = + data.poverty;
        data.healthcare = + data.healthcare
    });
    
    // create x and y scales for the plot
    var xScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.poverty) * 0.9, d3.max(healthData, d => d.poverty) * 1.1])
    .range([0, width]);
    
    var yScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.healthcare) * 0.8, d3.max(healthData, d => d.healthcare) * 1.1])
    .range([height, 0]);

    // create x and y axis
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .classed("circle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d=> yScale(d.healthcare))
        .attr("r", 16)
        .attr("fill", "lightblue")
        
    // add the text to the circles
    var textSelection = chartGroup.selectAll('.text')
    console.log(textSelection)

        textSelection.data(healthData)
        .enter()
        .append("text")
        .classed('text', true)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("transform", `translate(-10, 6)`)
        .text(d => {
            return d.abbr
        })
        .style("fill", "white" )


    // create a label group for x and y abels    
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 })`);

    // create x label variable
    var xLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .text("In Poverty (%) ")
        .style("font-weight", "bold")

    
    // create y label variable
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height/2))
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .text("Locks Healthcare (%)")
        .style("font-weight", "bold")
});

  // Format the data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;

  });


  ////////////////////////////////////////////////////////////////
  // Click-handling functions
  ////////////////////////////////////////////////////////////////

  
  // Create function for handling poverty click
  function poverty_click() {

    // Transition axis labels
    chartGroup.selectAll("#in_poverty")
      .attr("class", "active")
    chartGroup.selectAll("#age").remove();
    chartGroup.append("text")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight * 1.15)
      .attr("id", "age")
      .text("Age (Median)");
    chartGroup.selectAll("#household_income").remove();
    chartGroup.append("text")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight * 1.2)
      .attr("id", "household_income")
      .text("Household Income (Median)");

    // Transition x-axis
    var xScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.poverty) - 2, d3.max(healthData, d => d.poverty) + 2])
      .range([0, chartWidth]);
    var xAxis = d3.axisBottom(xScale);
    d3.select("#xAxis")
      .transition()
      .duration(2000)
      .call(xAxis);

    // Transition plot
    chartGroup.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("cx", function(d) {return xScale(d.poverty);});
    chartGroup.selectAll("#dot_label")
      .transition()
      .duration(2000)
      .attr("x", function(d) {return xScale(d.poverty) - 5.5;});

    // Add event listeners
    chartGroup.selectAll("#in_poverty")
      .on("click", poverty_click);
    chartGroup.selectAll("#age")
      .on("click", age_click);
    chartGroup.selectAll("#household_income")
      .on("click", income_click);
    chartGroup.selectAll("#lacks_healthcare")
      .on("click", healthcare_click);
    chartGroup.selectAll("#smokes")
      .on("click", smokes_click);
    chartGroup.selectAll("#obese")
      .on("click", obese_click);

  };

  // Create function for handling age click
  function age_click() {
      
    // Transition axis labels
    chartGroup.selectAll("#age")
      .attr("class", "active")
    chartGroup.selectAll("#in_poverty").remove();
    chartGroup.append("text")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight * 1.1)
      .attr("id", "in_poverty")
      .text("In Poverty (%)");
      chartGroup.selectAll("#household_income").remove();
    chartGroup.append("text")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight * 1.2)
      .attr("id", "household_income")
      .text("Household Income (Median)");
    
    // Transition x-axis
    var xScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.age) - 2, d3.max(healthData, d => d.age) + 3])
      .range([0, chartWidth]);
    var xAxis = d3.axisBottom(xScale);
    d3.select("#xAxis")
      .transition()
      .duration(2000)
      .call(xAxis);
    
    // Transition plot
    chartGroup.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("cx", function(d) {return xScale(d.age);});
    chartGroup.selectAll("#dot_label")
      .transition()
      .duration(2000)
      .attr("x", function(d) {return xScale(d.age) - 5.5;});

    // Add event listeners
    chartGroup.selectAll("#in_poverty")
      .on("click", poverty_click);
    chartGroup.selectAll("#age")
      .on("click", age_click);
    chartGroup.selectAll("#household_income")
      .on("click", income_click);
    chartGroup.selectAll("#lacks_healthcare")
      .on("click", healthcare_click);
    chartGroup.selectAll("#smokes")
      .on("click", smokes_click);
    chartGroup.selectAll("#obese")
      .on("click", obese_click);
  
  };

  // Create function for handling income click
  function income_click() {

    // Transition axis labels
    chartGroup.selectAll("#household_income")
      .attr("class", "active")
    chartGroup.selectAll("#in_poverty").remove();
    chartGroup.append("text")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight * 1.1)
      .attr("id", "in_poverty")
      .text("In Poverty (%)");
    chartGroup.selectAll("#age").remove();
    chartGroup.append("text")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight * 1.15)
      .attr("id", "age")
      .text("Age (Median)");
    
    // Transition x-axis
    var xScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.income) - 1500, d3.max(healthData, d => d.income)])
      .range([0, chartWidth]);
    var xAxis = d3.axisBottom(xScale);
    d3.select("#xAxis")
      .transition()
      .duration(2000)
      .call(xAxis);
    
    // Transition plot
    chartGroup.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("cx", function(d) {return xScale(d.income);});
    chartGroup.selectAll("#dot_label")
      .transition()
      .duration(2000)
      .attr("x", function(d) {return xScale(d.income) - 5.5;});

    // Add event listeners
    chartGroup.selectAll("#in_poverty")
      .on("click", poverty_click);
    chartGroup.selectAll("#age")
      .on("click", age_click);
    chartGroup.selectAll("#household_income")
      .on("click", income_click);
    chartGroup.selectAll("#lacks_healthcare")
      .on("click", healthcare_click);
    chartGroup.selectAll("#smokes")
      .on("click", smokes_click);
    chartGroup.selectAll("#obese")
      .on("click", obese_click);
        
  };

  // Create function for handling healthcare click
  function healthcare_click() {

    // Transition axis labels
    chartGroup.selectAll("#lacks_healthcare")
      .attr("class", "active")
    chartGroup.selectAll("#smokes").remove();
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "2.75em")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("id", "smokes")
      .text("Smokes (%)");
    chartGroup.selectAll("#obese").remove();
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1.5em")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("id", "obese")
      .text("Obese (%)");
      
    // Transition y-axis
    var yScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.healthcare) - 2, d3.max(healthData, d => d.healthcare) + 2])
      .range([chartHeight, 0]);
    var yAxis = d3.axisLeft(yScale);
    d3.select("#yAxis")
      .transition()
      .duration(2000)
      .call(yAxis);
      
    // Transition plot
    chartGroup.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("cy", function(d) {return yScale(d.healthcare);});
      chartGroup.selectAll("#dot_label")
      .transition()
      .duration(2000)
      .attr("y", function(d) {return yScale(d.healthcare) + 3;});

    // Add event listeners
    chartGroup.selectAll("#in_poverty")
      .on("click", poverty_click);
    chartGroup.selectAll("#age")
      .on("click", age_click);
    chartGroup.selectAll("#household_income")
      .on("click", income_click);
    chartGroup.selectAll("#lacks_healthcare")
      .on("click", healthcare_click);
    chartGroup.selectAll("#smokes")
      .on("click", smokes_click);
    chartGroup.selectAll("#obese")
      .on("click", obese_click);

  };


  // Create function for handling smokes click
  function smokes_click() {

    // Transition axis labels
    chartGroup.selectAll("#smokes")
      .attr("class", "active")
    chartGroup.selectAll("#lacks_healthcare").remove();
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "4em")        
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("id", "lacks_healthcare")
      .text("Lacks Healthcare (%)");
    chartGroup.selectAll("#obese").remove();
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1.5em")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("id", "obese")
      .text("Obese (%)");
      
    // Transition y-axis
    var yScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.smokes) - 2, d3.max(healthData, d => d.smokes) + 2])
      .range([chartHeight, 0]);
    var yAxis = d3.axisLeft(yScale);
    d3.selectAll("#yAxis")
      .transition()
      .duration(2000)
      .call(yAxis);
      
    // Transition plot
    chartGroup.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("cy", function(d) {return yScale(d.smokes);});
      chartGroup.selectAll("#dot_label")
      .transition()
      .duration(2000)
      .attr("y", function(d) {return yScale(d.smokes) + 3;});

    // Add event listeners
    chartGroup.selectAll("#in_poverty")
      .on("click", poverty_click);
    chartGroup.selectAll("#age")
      .on("click", age_click);
    chartGroup.selectAll("#household_income")
      .on("click", income_click);
    chartGroup.selectAll("#lacks_healthcare")
      .on("click", healthcare_click);
    chartGroup.selectAll("#smokes")
      .on("click", smokes_click);
    chartGroup.selectAll("#obese")
      .on("click", obese_click);

  };

  // Create function for handling obese click
  function obese_click() {

    // Transition axis labels
    chartGroup.selectAll("#obese")
      .attr("class", "active")
    chartGroup.selectAll("#lacks_healthcare").remove();
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "4em")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("id", "lacks_healthcare")
      .text("Lacks Healthcare (%)");
    chartGroup.selectAll("#smokes").remove();
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "2.75em")
      .attr("class", "aText")
      .attr("class", "standby")
      .attr("id", "smokes")
      .text("Smokes (%)");
      
    // Transition y-axis
    var yScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.obesity) - 2, d3.max(healthData, d => d.obesity) + 2])
      .range([chartHeight, 0]);
    var yAxis = d3.axisLeft(yScale);
    d3.selectAll("#yAxis")
      .transition()
      .duration(2000)
      .call(yAxis);
      
    // Transition plot
    chartGroup.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("cy", function(d) {return yScale(d.obesity);});
      chartGroup.selectAll("#dot_label")
      .transition()
      .duration(2000)
      .attr("y", function(d) {return yScale(d.obesity) + 3;});

    // Add event listeners
    chartGroup.selectAll("#in_poverty")
      .on("click", poverty_click);
    chartGroup.selectAll("#age")
      .on("click", age_click);
    chartGroup.selectAll("#household_income")
      .on("click", income_click);
    chartGroup.selectAll("#lacks_healthcare")
      .on("click", healthcare_click);
    chartGroup.selectAll("#smokes")
      .on("click", smokes_click);
    chartGroup.selectAll("#obese")
      .on("click", obese_click);

  };


