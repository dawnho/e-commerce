function productList(div) {
        var productsByName = nestByGroup.entries(all.top(40));

        div.each(function() {
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

          product.order();
        });
      };