window.createParallel = function () {

	var margin = [30, 50, 30, 50],
    width = 940,
    height = 400,
    color,
    chartWidth = width - margin[1] - margin[3],
    chartHeight = height - margin[0] - margin[2],
    axisLabels = [],
    data,
    dimensions,
    brushDirty;

  var dispatch = d3.dispatch('brushing', 'empty');

  function chart() {

		var foreground = d3.select(".foreground");
	  var x = d3.scale.ordinal().domain(axisLabels).rangePoints([0, chartWidth]),
	    	y = {},
	  		line = d3.svg.line().interpolate("cardinal").tension(0.95);

	  if (foreground.empty()) {

			var axis = d3.svg.axis().orient("left"),
			    background;

		  var svg = d3.select("#parallel").append("svg:svg")
		        .attr("width", width)
		        .attr("height", height)
		        .append("svg:g")
		        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

		  d3.select(".title").append("a")
	      .attr("href", "javascript:reset()")
	      .attr("class", "reset")
	      .text("reset")
	      .style("display", "none");

	    var newData = customNullY(data);

		  axisLabels.forEach(function(d) {
		    y[d] = d3.scale.linear()
		      .domain([d3.min(newData, function(p) { return +p[d]; }), 1.0])
		      .range([chartHeight, 0]);

		    y[d].brush = d3.svg.brush()
		      .y(y[d])
		      .on("brush", brush);

		    y[d].brushDirty;
		  });

		  // Add background lines (the gray lines that remain after a path is hidden.)
		  background = svg.append("svg:g")
			  .attr("class", "background")
			  .selectAll("path")
			  .data(newData)
			  .enter().append("svg:path")
			  .attr("d", path)
			  .style("stroke", "#e8e8e8")
			  .style("fill", "none");

		  // Add foreground lines.
		  foreground = svg.append("svg:g")
			  .attr("class", "foreground")
			  .selectAll("path")
			  .data(newData)
			  .enter().append("svg:path")
			  .attr("class", function(d) { return d.group + ' line-path ' + 'path'+d.index; })
			  .attr("x", function(d) {return })
			  .attr("d", path)
			  .style("fill", "none")
			  .style("stroke", function(d, i) {return color[d.group]});


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

			g.selectAll(".axis")
				.select("path")
				.attr("stroke-width", 1);

			g.selectAll(".tick")
				.attr("stroke-width", 2);


		  // Add a brush for each axis.
		  g.append("svg:g")
			  .attr("class", "brush")
			  .each(function(d) { d3.select(this).call(y[d].brush); })
			  .selectAll("rect")
			  .attr("x", -8)
			  .attr("width", 16);

		} else {
			var newData = customNullY(data);

			axisLabels.forEach(function(d) {
		    y[d] = d3.scale.linear()
		      .domain([d3.min(newData, function(p) { return +p[d]; }), 1.0])
		      .range([chartHeight, 0]);

		    y[d].brush = d3.svg.brush()
		      .y(y[d])
		      .on("brush", brush);

		    y[d].brushDirty;
		  });

			foreground.text(null);
			foreground=foreground.selectAll("path")
			  .data(newData)
			  .enter().append("svg:path")
			  .attr("class", function(d) { return d.group + ' line-path ' + 'path'+d.index; })
			  .attr("x", function(d) {return })
			  .attr("d", path)
			  .style("fill", "none")
			  .style("stroke", function(d, i) {return color[d.group]});

			d3.selectAll('.brush')
				.each(function(d) {d3.select(this).call(y[d].brush); })

		}
		return chart;

	  //sets nulls to a custom Y-value
	  function customNullY(data) {
	  	newDataArray = [];
	  	for (var j in data) {
	  		var newValue = {};
	  		newDataArray[j] = $.extend({}, newValue, data[j]);
	  	}

	  	nullValues = {"Amazon":0.6, "Buy.com":0.55, "HSN":0.78, "JCP":0.65, "Macy\'s":0.76,
    		"Odotco":0.74, "QVC":0.65, "Sears":0.7, "Target":0.65, "Walmart":0.82};

    	for (var i in newDataArray) {
    		for (var key in newDataArray[i]) {
    			if (newDataArray[i][key] == '0.00') {
    				newDataArray[i][key] = nullValues[key];
    			}
    		}
    	}
    	return newDataArray;
	  }

	  function dragstart(d) {
	  	i = axisLabels.indexOf(d);
	  	console.log(i);
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
	  	if (y[d].brush.empty()) {
        dispatch.empty(dimensions[d]);
	  	}
	  }

		// Returns the path for a given data point.
	  function path(d) {
	    return line(axisLabels.map(function(p) { return [x(p), y[p](d[p])]; }));
	  }

	  // Handles a brush event, toggling the display of foreground lines.
	  function brush() {
	    var actives = axisLabels.filter(function(p) { return !y[p].brush.empty(); }),
	    		extents = actives.map(function(p) { return y[p].brush.extent(); }),
	    		extents_out = actives.map(function(p) { return [p, y[p].brush.extent()] });
	    foreground.classed("fade", function(d) {
	      return !actives.every(function(p, i) {
	        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
	      });
	    });
	    dispatch.brushing(extents_out);
	  }
	};

	chart.dispatch = dispatch;

	chart.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

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

  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };

  chart.dimensions = function(_) {
    if (!arguments.length) return dimensions;
    dimensions = _;
    return chart;
  };

	return chart;

};