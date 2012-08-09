window.createLegend = function () {

  var margin = {top: 10, right: 20, bottom: 10, left: 20},
      width = 700,
      height = 70,
      color,
      data = [];
  
  var dispatch = d3.dispatch('legendClick');


  function chart() {
    var legendData = data.slice(0);
    legendData.push('All / Reset');
    var wrap = d3.select('#legend').append('svg:svg')
      .attr('class', 'legend')
      .attr('width', width)
      .attr('height', height);
    var series = wrap.selectAll('.series')
      .data(legendData);
    var seriesEnter = series.enter().append('svg:g').attr('class', function(d){return 'series '+ d;})
      .on('click', function(d,i) { dispatch.legendClick(d,i); });

    seriesEnter.append('svg:circle')
      .style('fill', function(d,i) { return color[d] })
      .style('stroke', function(d,i) { return color[d] })
      .style('stroke-width', 2)
      .attr('r', 5);
    seriesEnter.append('svg:text')
      .text(function(d) { return d })
      .attr('text-anchor', 'start')
      .attr('dy', '.32em')
      .attr('dx', '8')
      .style("font-size", "14px");
    series.classed('disabled', function(d) { return d.disabled });
    series.exit().remove();

      //Set legend series locations
      var seriesWidths = [];

      series.each(function(d,i) {
        seriesWidths.push(d3.select(this).select('text').node()
          .getComputedTextLength() + 28); // 28 is ~ the width of the circle plus some padding
      });

      var seriesPerRow = 0,
      legendWidth = 0,
      columnWidths = [];

      while ( legendWidth < width && seriesPerRow < seriesWidths.length) {
        columnWidths[seriesPerRow] = seriesWidths[seriesPerRow];
        legendWidth += seriesWidths[seriesPerRow++];
      }

      while ( legendWidth > width && seriesPerRow > 1 ) {
        columnWidths = [];
        seriesPerRow--;

        for (k = 0; k < seriesWidths.length; k++) {
          if (seriesWidths[k] > (columnWidths[k % seriesPerRow] || 0) )
            columnWidths[k % seriesPerRow] = seriesWidths[k];
        }

        legendWidth = columnWidths.reduce(function(prev, cur, index, array) {
          return prev + cur;
        });
      }
      var xPositions = [];
      for (var i = 0, curX = 0; i < seriesPerRow; i++) {
        xPositions[i] = curX+margin.left+6;
        curX += columnWidths[i];
      }
      series
        .attr('transform', function(d, i) {
          return 'translate(' + xPositions[i % seriesPerRow] + ',' + (15 + Math.floor(i / seriesPerRow) * 20) + ')';
        });
      return chart;
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

  chart.align = function(_) {
    if (!arguments.length) return align;
    align = _;
    return chart;
  };

  chart.dispatch = dispatch;

  return chart;
};

