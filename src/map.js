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