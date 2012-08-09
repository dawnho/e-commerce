window.createList = function () {

  var name,
      data = [],
      headers = [],
      margin = {top: 0, right: 10, bottom: 20, left: 10},
      width = 940,
      height = 306,
      color
      sortBy = 'name';
  
  var dispatch = d3.dispatch('headerClick');

  function chart() {

    newDataArray = [];
      for (var j in data) {
        var newValue = {};
        newDataArray[j] = $.extend({}, newValue, data[j]);
    }
    newDataArray.sort(sortFunction);

    var table = d3.select("#list");
    if (!table.empty()) {table.text(null);}
    table = table.append("table")
    .attr('width', width-margin.left-margin.right+'px')
    .attr('height', height-margin.top-margin.bottom+'px')
    .style('margin-left', margin.left+'px')
    .style('margin-right', margin.right+'px')
    .style('margin-top', margin.top+'px')
    .style('margin-bottom', margin.bottom+'px');

    table.append("thead").classed("list-head", true).append("tr").style("width", '100%').selectAll("th")
      .data(headers)
      .enter().append("th")
      .style('width', function(d,i) {if(i % 12 == 0){return '200px';} else if (i % 12 == 1){return '134px';} else {return '56px';}})
      .attr("class", function(d,i) {if (i % 12 == 0){return 'name';} else if (i % 12 == 1) {return 'group';} else {return 'scores'}})
      .append("a")
      .style("cursor", "pointer")
      .style("font-weight", "bold")
      .on('click', function(d,i) { dispatch.headerClick(d,i); })
      .text(function(d) {return d;})
      .style("font-size", "12px")
      .style("font", 'Arial');
    var rows = table.append("tbody").style("width", "100%")
      .classed("list-body", true)
      .style("height", "inherit")
      .style("display", "block")
      .style("overflow", "auto")
      .selectAll("tr")
      .data(newDataArray)
      .enter().append("tr")
        .style("width", "inherit")
        .style("background", "#EEE")
        .style("border-bottom-style", "solid")
        .style("border-bottom-color", "white")
        .style("border-bottom-width", "1px")
        .style("line-height", "1.5em")
        .on("mouseover", function(d){
          d3.select(this).style("background", "#bebebe");
          d3.selectAll('.line-path').style("display", 'none').style('stroke-opacity', '1');
          d3.select(".path"+d.index).style("display", null).style("stroke-width", "2.5px");
        })
        .on("mouseout", function(d){
          d3.select(this).style("background", null);
          d3.selectAll('.line-path').style("display", null).style('stroke-opacity', null).style("stroke-width", null);
        });
    var cells = rows.selectAll("td")
      .data(function(row) {
        return headers.map(function(col) {
          return row[col];
        });
      })
      .enter().append("td")
      .style('width', function(d,i) {if(i % 12 == 0){return '200px';} else if (i % 12 == 1){return '134px';} else {return '56px';}})
      .attr("class", function(d,i) {if (i % 12 == 0){return 'name';} else if (i % 12 == 1) {return 'group';} else {return 'scores'}})
      .text(function(d){if (d=='0.00') {return 'null';} else {return d;}});
    return chart;
  };
  function sortFunction(a,b) {
    if (sortBy == 'name' || sortBy == 'group') {
      if (a[sortBy] == b[sortBy]) {return 0;}
      return (a[sortBy] < b[sortBy]) ? -1: 1;
    } else {
      return (b[sortBy] - a[sortBy]);
    }
  }

  chart.headers = function(_) {
    if (!arguments.length) return headers;
    headers = _;
    return chart;
  };

  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };

  chart.sortBy = function(_) {
    if (!arguments.length) return sortBy;
    sortBy = _;
    return chart;
  };

  chart.dispatch = dispatch;

  return chart;

};