window.createList = function () {

  var name,
      data = [],
      headers = [],
      margin = {top: 10, right: 50, bottom: 10, left: 50},
      width = 940,
      height = 400,
      color;
  
  dispatch = d3.dispatch('legendClick');

  function chart() {
    console.log(data);
    var table = d3.select("#list");
    if (!table.empty()) {table.text(null);}
    table = table.append("table")
    .attr('width', width);

    table.append("thead").classed("list-head", true).append("tr").style("width", "100%").selectAll("th")
      .data(headers)
      .enter().append("th")
      .style('width', function(d,i) {if(i % 12 == 0){return '246px';} else if (i % 12 == 1){return '134px';} else {return '56px';}})
      .attr("class", function(d,i) {if (i % 12 == 0){return 'name';} else if (i % 12 == 1) {return 'group';} else {return 'scores'}})
      .append("a")
      .style("cursor", "pointer")
      .on("mouseclick", function(d) {console.log(d); sortData();})
      .text(function(d) {return d;})
      .style("font-size", "12px")
      .style("font", 'Arial');
    var rows = table.append("tbody").style("width", "100%")
      .classed("list-body", true)
      .selectAll("tr")
      .data(data)
      .enter().append("tr")
      .style("width", "940px")
      .style("background", "#EEE")
      .style("border-bottom-style", "solid")
      .style("border-bottom-color", "white")
      .style("border-bottom-width", "1px")
      .style("line-height", "1.5em");
    var cells = rows.selectAll("td")
      .data(function(row) {
        return headers.map(function(col) {
          return row[col];
        });
      })
      .enter().append("td")
      .style('width', function(d,i) {if(i % 12 == 0){return '246px';} else if (i % 12 == 1){return '134px';} else {return '56px';}})
      .attr("class", function(d,i) {if (i % 12 == 0){return 'name';} else if (i % 12 == 1) {return 'group';} else {return 'scores'}})
      .text(function(d){if (d=='0.00') {return 'null';} else {return d;}});
    return chart;
  };

/*

    //.data(data);
    //list.enter().append


    var productsByName = nestByGroup.entries(name.top(Infinity));

    var group = d3.select(this).selectAll(".group")
    .data(productsByGroup, function(d) { return d.key; });

    var groupEnter = group.enter().append("div")
    .attr("class", "group");

    var product = date.order().selectAll(".product")
    .data(function(d) { return d.values; }, function(d) { return d.index; });

    var productEnter = product.enter().append("div")
    .attr("class", "product");

    productEnter.append("div")
    .attr("class", "amazon")
    .text(function(d) { return d.Amazon; });

    productEnter.append("div")
    .attr("class", "amazon")
    .text(function(d) { return d.Amazon; });v 

    productEnter.append("div")
    .attr("class", "time")
    .text(function(d) { return formatTime(d.date); });

    productEnter.append("div")
    .attr("class", "origin")
    .text(function(d) { return d.origin; });

    productEnter.append("div")
    .attr("class", "destination")
    .text(function(d) { return d.destination; });

    productEnter.append("div")
    .attr("class", "distance")
    .text(function(d) { return formatNumber(d.distance) + " mi."; });

    productEnter.append("div")
    .attr("class", "delay")
    .classed("early", function(d) { return d.delay < 0; })
    .text(function(d) { return formatChange(d.delay) + " min."; });

    product.exit().remove();

    product.order();*/
  
  function sortData() {

  };


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

  return chart;

};