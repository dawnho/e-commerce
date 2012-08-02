window.createParallel = function () {

	var margin = [30, 50, 50, 50],
    width = 940,
    height = 400,
    color = d3.scale.category_custom().range(),
    chartWidth = width - margin[1] - margin[3],
    chartHeight = height - margin[0] - margin[2],
    axisLabels = [];

  function chart() {
	  var x = d3.scale.ordinal().domain(axisLabels).rangePoints([0, chartWidth]),
    	  y = {};

		var line = d3.svg.line().interpolate("cardinal").tension(0.95),
		    axis = d3.svg.axis().orient("left"),
		    background,
		    foreground;

	  var svg = d3.select("#parallel").append("svg:svg")
	        .attr("width", width)
	        .attr("height", height)
	        .append("svg:g")
	        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

	  axisLabels.forEach(function(d) {
	    y[d] = d3.scale.linear()
	      .domain([d3.min(data, function(p) { return +p[d]; }), 1.0])
	      .range([chartHeight, 0]);

	    y[d].brush = d3.svg.brush()
	      .y(y[d])
	      .on("brush", brush);
	  });

	  // Add background lines (the gray lines that remain after a path is hidden.)
	  background = svg.append("svg:g")
		  .attr("class", "background")
		  .selectAll("path")
		  .data(data)
		  .enter().append("svg:path")
		  .attr("d", path)
		  .style("stroke", "#e8e8e8")
		  .style("fill", "none");


	  // Add foreground lines.
	  foreground = svg.append("svg:g")
		  .attr("class", "foreground")
		  .selectAll("path")
		  .data(data)
		  .enter().append("svg:path")
		  .attr("d", path)
		  .attr("class", function(d) { return d.group; })
		  .attr("x", function(d) {return })
		  .style("fill", "none")
		  .style("stroke", function(d, i) {return color[i % color.length]});


	  // Add a group element for each column.
	  var g = svg.selectAll(".column")
		.data(axisLabels)
		.enter().append("svg:g")
		  .attr("class", "column")
		  .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
		  .call(d3.behavior.drag()
		  	.origin(function(d) { return {x: x(d)}; })
		  	.on("dragstart", dragstart)
		  	.on("drag", drag)
		  	.on("dragend", dragend));

	  // Add an axis and title.
	  g.append("svg:g")
		  .attr("class", "axis")
		  .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
		  .append("svg:text")
			  .attr("text-anchor", "middle")
			  .attr("y", -9)
			  .text(String);

		g.selectAll(".axis")
			.select("g")
			.attr("class", "nullGroup");
			
		g.selectAll(".nullGroup")
			.select("text")
			.text("Null");		

	  // Add a brush for each axis.
	  g.append("svg:g")
		  .attr("class", "brush")
		  .each(function(d) { d3.select(this).call(y[d].brush); })
		  .selectAll("rect")
		  .attr("x", -8)
		  .attr("width", 16);

	  function dragstart(d) {
	  	i = axisLabels.indexOf(d);
	  }

	  function drag(d) {
	  	x.range()[i] = d3.event.x;
	  	axisLabels.sort(function(a, b) { return x(a) - x(b); });
	  	g.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
	  	foreground.attr("d", path);
	  }

	  function dragend(d) {
	  	x.domain(axisLabels).rangePoints([0, chartWidth]);
	  	var t = d3.transition().duration(500);
	  	t.selectAll(".column").attr("transform", function(d) { return "translate(" + x(d) + ")"; });
	  	t.selectAll(".foreground path").attr("d", path);
	  }

		// Returns the path for a given data point.
	  function path(d) {
	    return line(axisLabels.map(function(p) { return [x(p), y[p](d[p])]; }));
	  }

	  // Handles a brush event, toggling the display of foreground lines.
	  function brush() {
	    var actives = axisLabels.filter(function(p) { return !y[p].brush.empty(); }),
	    extents = actives.map(function(p) { return y[p].brush.extent(); });
	    foreground.classed("fade", function(d) {
	      return !actives.every(function(p, i) {
	        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
	      });
	    });
	  }
	};

	chart.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	chart.data = function(_) {
		if (!arguments.length) return data;
		data = _;
		return chart;
	}

	chart.axisLabels = function(_) {
		if (!arguments.length) return axisLabels;
		axisLabels = _;
		return chart;
	}

	chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	}

	chart.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	chart.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return chart;
	};

	return chart;

};