// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };
  
  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;
  
  
var svg = d3.select("body")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function(demographicsData){
    console.log(demographicsData)

    demographicsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      console.log(data.poverty)
    });
    
    var xScale = d3.scaleLinear()
      .domain([8.5, d3.max(demographicsData, d => d.poverty*1)])
      .range([0, svgWidth]);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(demographicsData, d => d.healthcare*1)])
    .range([svgHeight, 0])

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);


    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);
    chartGroup.append("g")
      .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle").data(demographicsData).enter();
    circlesGroup.append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("class","stateCircle")
        .attr("opacity", ".5")
        .on("click", function(data) {     
          toolTip.show(data,this);
        });

        circlesGroup.append("text")
        .text(function(d){
          return d.abbr;
        })
        .attr("dx", d => xScale(d.poverty))
        .attr("dy", d => yScale(d.healthcare) + 10/2.5)
        .attr("font-size","10")
        .attr("class","stateText")
        .on("mouseover", function(data, index) {
          toolTip.show(data,this);
        d3.select(this).style("stroke","#323232")
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data,this)
         d3.select(this).style("stroke","#e3e3e3")
        });
    
      var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([40, -60])
      .html(function(d) {
        return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
      });

    chartGroup.call(toolTip);
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare(%)");
      chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty(%)");
    });