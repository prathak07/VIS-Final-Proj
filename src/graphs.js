function makemap() {
        document.getElementById("map").innerHTML = '';
        document.getElementById("graph").innerHTML = '';
        //Width and height of map
        var width = 1000;
        var height = 800;

        var str = "Belgium,England,France,Germany,Italy,Netherlands,Poland,Portugal,Scotland,Spain,Switzerland";

        // D3 Projection
        var projection = d3.geo.mercator()
                            .center([ 13, 52 ])
                            .translate([ width/2, height/2 ])
                            .scale([ width/1.5 ]);

        // Define path generator
        var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
                     .projection(projection);  // tell path generator to use albersUsa projection


        // Define linear scale for output
        var color = d3.scale.linear()
                      .range(["rgb(213,222,217)","rgb(69,173,168)"]);

        var legendText = ["Soccer Data", "No Soccer Data"];

        //Create SVG element and append map to the SVG
        var svg = d3.select("#map")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

        var hovertip = d3.select("#map")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "rgba(0, 0, 0, 0.75)")
            .style("border-radius", "6px")
            .style("font", "12px sans-serif")
            .text("hovertip");

        // Append Div for tooltip to SVG
        var div = d3.select("#map")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

        // Load in my states data!
        d3.csv("./data/number_of_teams.csv", function(data) {
        color.domain([0,1]); // setting the range of the input data

        // Load GeoJSON data and merge with states data
        d3.json("./lib/europe.geojson", function(json) {

        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {

            // Grab State Name
            var dataCountry = data[i].country;

            // Grab data value
            var dataValue = data[i].number_of_teams;

            // Grab data league
            var dataLeague = data[i].league

            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++)  {
                var jsonCountry = json.features[j].properties.name;

                if (dataCountry == jsonCountry) {

                // Copy the data value into the JSON
                json.features[j].properties.teams = dataValue;
                json.features[j].properties.league = dataLeague;
                // Stop looking through the JSON
                break;
                }
            }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d) {

                // Get data value
                var value = d.properties.teams;

                if (value) {
                    //If value exists…
                    return color(1);
                }
                else {
                    //If value is undefined…
                    return "rgb(213,222,217)";
                }
            })
            .on("mouseover",function(d) {
                if(str.includes(d.properties.name)) {
                    hovertip.text("Country: " + d.properties.name +", Number of Teams: " + d.properties.teams + ", League: " + d.properties.league);
                    hovertip.style("visibility", "visible");
                }
            })
            .on("mousemove", function() {
                return hovertip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(){return hovertip.style("visibility", "hidden");})
            .on("click",function(d) {
                if(str.includes(d.properties.name)) {
                    leagueBubble(d.properties.name);
                }
            });


        // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
        var legend = d3.select("#graph").append("svg")
                        .attr("class", "legend")
                        .attr("width", 140)
                        .attr("height", 200)
                        .selectAll("g")
                        .data(color.domain().slice().reverse())
                        .enter()
                        .append("g")
                        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                  .attr("width", 18)
                  .attr("height", 18)
                  .style("fill", color)
                  .style("stroke",'black');

            legend.append("text")
                  .data(legendText)
                  .attr("x", 24)
                  .attr("y", 9)
                  .attr("dy", ".35em")
                  .text(function(d) { return d; });
            });

        });
}

function leagueBubble(country) {
    document.getElementById("map").innerHTML = '';
    document.getElementById("graph").innerHTML = '';

    console.log(country);

    var diameter = 800; //max size of the bubbles

    var color = d3.scale.linear()
        .domain([15, 30])
        .range([d3.rgb('rgb(213,222,217)').brighter(), d3.rgb('rgb(69,173,168)').darker()]);

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var tooltip = d3.select("#graph")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "8px")
        .style("background-color", "rgba(0, 0, 0, 0.75)")
        .style("border-radius", "6px")
        .style("font", "12px sans-serif")
        .text("tooltip");

    d3.csv("./data/"+country+".csv", function(error, data){

        //convert numerical values from strings to numbers
        data = data.map(function(d) {
            d.value = +d["count"];
            return d;
        });


        //bubbles needs very specific format, convert data to this.
        var nodes = bubble.nodes({children:data}).filter(function(d) {
            return !d.children;
        });


        //setup the chart
        var bubbles = svg.append("g")
            .attr("transform", "translate(0,0)")
            .selectAll(".bubble")
            .data(nodes)
            .enter();

        //create the bubbles
        bubbles.append("circle")
            .attr("r", function(d){ return d.r; })
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
            .style("fill", function(d) { return color(d.value); })
            .on("mouseover",function(d) {
                tooltip.text("Team: " + d.team + " Number of PLayers: " + d.value + ", League: " + d.league);
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
            .on("click",function(d){
                parallelCoordinates(d.country,d.team);
            });

        //format the text for each bubble
        bubbles.append("text")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y + 5; })
            .attr("text-anchor", "middle")
            .text(function(d){ return d["team"]; })
            .style({
                "fill":"black",
                "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
                "font-size": "12px"
            })
            .style("pointer-events", "none");

    });
}

function parallelCoordinates(country,team) {
    document.getElementById("map").innerHTML = '';
    document.getElementById("graph").innerHTML = '';

    var margin = {top: 50, right: 10, bottom: 10, left: 10},
        width = 1600 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv('./data/'+country+'/'+team+'_players.csv', function(error, player) {

      // Extract the list of dimensions and create a scale for each.
      x.domain(dimensions = d3.keys(player[0]).filter(function(d) {
        return d != "name" && d != "id" && d != "position" && (y[d] = d3.scale.linear()
            .domain(d3.extent(player, function(p) { return +p[d]; }))
            .range([height, 0]));
      }));

      // Add grey background lines for context.
      background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(player)
            .enter().append("path")
            .attr("d", path);

      // Add blue foreground lines for focus.
      foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(player)
            .enter().append("path")
            .attr("d", path);

      // Add a group element for each dimension.
      var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

      // Add an axis and title.
      g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .attr("transform", "rotate(-65)")
            .text(function(d) { return d; });

      // Add and store a brush for each axis.
      g.append("g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    });

    // Returns the path for a given data point.
    function path(d) {
      return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
          extents = actives.map(function(p) { return y[p].brush.extent(); });
      foreground.style("display", function(d) {
        return actives.every(function(p, i) {
          return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
      });
    }

}

