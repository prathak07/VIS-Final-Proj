function makemap() {
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
        var svg = d3.select("#graph")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

        var hovertip = d3.select("#graph")
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
        var div = d3.select("#graph")
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
            var dataLeague = data[i].league;

            // Grab data ratings
            var dataRatings = data[i].ratings;
            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++)  {
                var jsonCountry = json.features[j].properties.name;

                if (dataCountry == jsonCountry) {

                // Copy the data value into the JSON
                json.features[j].properties.teams = dataValue;
                json.features[j].properties.league = dataLeague;
                json.features[j].properties.ratings = dataRatings;
                // Stop looking through the JSON
                break;
                }
            }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        var euro = svg.selectAll("path")
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
                    hovertip.text("Country: " + d.properties.name +", Number of Teams: " + d.properties.teams + ", League: " + d.properties.league + ", Ratings: " + d.properties.ratings);
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

        var legend = d3.select("#graph").append("svg")
                    .attr("class", "legend")
                    .attr("width", 140)
                    .attr("height", 200)
                    .style("position","absolute")
                    .style("left",800)
                    .style("top",350)
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
                tooltip.text("Team: " + d.team + " Number of PLayers: " + d.value + ", League: " + d.league + ", Ratings: " + d.ratings);
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
            .on("click",function(d){
                barGraph_types(d.country,d.team);
                pieChart_types(d.country,d.team);
                parallelCoordinates_types(d.country,d.team);
                parallelCoordinates_all(d.country,d.team);
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


function barGraph_types(country,team) {
    document.getElementById("graph").innerHTML = '<div id="first"></div><div id="second"></div><div id="third"></div>';
    
    var color = d3.scale.category10();
    
    var pos = ['def','mid','gk','for'];

    var margin = {top: 20, right: 20, bottom: 150, left: 100},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var chart = d3.select("#first").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var hovertip = d3.select("#first")
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

    d3.csv('./data/'+country+'/'+team+'_players_types.csv', function(d) {
        d.overall_rating = +d.overall_rating;
        return d;
        }, function(error, data) {
        if (error) throw error;

        x.domain(data.map(function(d) { return d.type; }));
        y.domain([0, d3.max(data, function(d) { return d.overall_rating; })]);

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x",0 - (height / 2))
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Overall_Ratings");
        

        chart.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.type); })
            .attr("y", function(d) { return y(d.overall_rating); })
            .attr("height", function(d) { return height - y(d.overall_rating); })
            .attr("width", x.rangeBand())
            .style("fill", function(d) {
                console.log(d.type+" "+color(pos.indexOf(d.type)));
                return color(pos.indexOf(d.type));
            })
            .on("mouseover",function(d) {
                d3.select(this).style("fill",'rgb(69,173,168)');
                hovertip.text("Team: " + team + ", Count: " + d.count + ", Ratings: " + d.overall_rating + ", Attributes: " + d.attributes);
                hovertip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return hovertip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
                d3.select(this).style("fill",color(pos.indexOf(d.type)));
                return hovertip.style("visibility", "hidden");
            })
            .on("click",function(d){
                barGraph_player(country,team,d.type,color(pos.indexOf(d.type)));
                screePlot(country,team,d.type,color(pos.indexOf(d.type)));
                loadings(country,team,d.type,color(pos.indexOf(d.type)));
                parallelCoordinates_players(country,team,d.type,color(pos.indexOf(d.type)));
            });
    });
}


function pieChart_types(country,team) {
    
    var color = d3.scale.category10();
    
    var pos = ['def','mid','gk','for'];

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom
        radius = Math.min(width, height) / 2;
    
    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.count; });

    var svg = d3.select("#second").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var hovertip = d3.select("#second")
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

    d3.csv('./data/'+country+'/'+team+'_players_types.csv', function(d) {
        d.count = +d.count;
        return d;
        }, function(error, data) {
        if (error) throw error;

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(pos.indexOf(d.data.type)); })
            .on("mouseover",function(d) {
                d3.select(this).style("fill",'rgb(69,173,168)');
                hovertip.text("Team: " + team + ", Count: " + d.data.count + ", Ratings: " + d.data.overall_rating + ", Attributes: " + d.data.attributes + ", Type: " + d.data.type);
                hovertip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return hovertip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
                d3.select(this).style("fill",color(pos.indexOf(d.data.type)));
                return hovertip.style("visibility", "hidden");
            })
            .on("click",function(d){
                barGraph_player(country,team,d.data.type,color(pos.indexOf(d.data.type)));
                screePlot(country,team,d.data.type,color(pos.indexOf(d.data.type)));
                loadings(country,team,d.data.type,color(pos.indexOf(d.data.type)));
                parallelCoordinates_players(country,team,d.data.type,color(pos.indexOf(d.data.type)));
            });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return "Count: " + d.data.count; })
            .style("text-anchor", "middle");
        
        var legend = d3.select("#second").append("svg")
                .attr("class", "legend")
                .attr("width", 140)
                .attr("height", 200)
                .style("left",800)
                .style("top",600)
                .selectAll("g")
                .data(pos)
                .enter()
                .append("g")
                .attr('transform', function(d, i) {
                    var x = 0;
                    var y = i * 20;
                    return 'translate(' + x + ',' + y + ')'
                });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d) {
                    // console.log(d);
                    return color(pos.indexOf(d));
                })
                .style("stroke",'black');

            legend.append("text")
                .data(pos)
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function(d) { return d; });
    });
}


function parallelCoordinates_types(country,team) {

    var margin = {top: 50, right: 10, bottom: 10, left: 10},
        width = 1600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {},
        dragging = {};

    var color = d3.scale.category10();

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var pos = ['def','mid','gk','for'];

    var hovertip = d3.select("#third")
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

    var svg = d3.select("#third").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv('./data/'+country+'/'+team+'_players_types.csv', function(error, player) {

      // Extract the list of dimensions and create a scale for each.
      x.domain(dimensions = d3.keys(player[0]).filter(function(d) {
        return d != "count" && d != "type" && d != "attributes" && (y[d] = d3.scale.linear()
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
            .attr("d", path)
            .style("stroke", function(d) {
                //console.log(d);
                return color(pos.indexOf(d.type));
            })
            .style("fill","none")
            .on("mouseover",function(d) {
                hovertip.text("Team: " + team + ", Count: " + d.count + ", Ratings: " + d.overall_rating + ", Attributes: " + d.attributes);
                hovertip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return hovertip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
                return hovertip.style("visibility", "hidden");
            });

      // Add a group element for each dimension.
      var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.behavior.drag()
            .origin(function(d) { return {x: x(d)}; })
            .on("dragstart", function(d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
        }));

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

      var legend = d3.select("#third").append("svg")
                .attr("class", "legend")
                .attr("width", 140)
                .attr("height", 200)
                .style("position","absolute")
                .style("left",1600)
                .style("top",1000)
                .selectAll("g")
                .data(pos)
                .enter()
                .append("g")
                .attr('transform', function(d, i) {
                    var x = 0;
                    var y = i * 20;
                    return 'translate(' + x + ',' + y + ')'
                });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d) {
                    return color(pos.indexOf(d));
                })
                .style("stroke",'black');

            legend.append("text")
                .data(pos)
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function(d) { return d; });
    });

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
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


function parallelCoordinates_all(country,team) {

    var margin = {top: 50, right: 10, bottom: 10, left: 10},
        width = 1600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {},
        dragging = {};

    var color = d3.scale.category10();

    var pos = ['def','mid','gk','for'];

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var hovertip = d3.select("#graph")
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

    d3.csv('./data/'+country+'/'+team+'_players.csv', function(error, player) {

      // Extract the list of dimensions and create a scale for each.
      x.domain(dimensions = d3.keys(player[0]).filter(function(d) {
        return d != "name" && d != "position" && (y[d] = d3.scale.linear() // && d != "id"
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
            .attr("d", path)
            .style("stroke", function(d) {
                return color(pos.indexOf(d.position));
            })
            .style("fill","none")
            .on("mouseover",function(d) {
                hovertip.text("Name: " + d.name + ", Ratings: " + d.overall_rating);
                hovertip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return hovertip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
                return hovertip.style("visibility", "hidden");
            });

      // Add a group element for each dimension.
      var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.behavior.drag()
            .origin(function(d) { return {x: x(d)}; })
            .on("dragstart", function(d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
        }));

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

      var legend = d3.select("#graph").append("svg")
                .attr("class", "legend")
                .attr("width", 140)
                .attr("height", 200)
                .style("position","absolute")
                .style("left",1600)
                .style("top",400)
                .selectAll("g")
                .data(pos)
                .enter()
                .append("g")
                .attr('transform', function(d, i) {
                    var x = 0;
                    var y = i * 20;
                    return 'translate(' + x + ',' + y + ')'
                });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d) {
                    return color(pos.indexOf(d));
                })
                .style("stroke",'black');

            legend.append("text")
                .data(pos)
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function(d) { return d; });
    });

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
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


function barGraph_player(country,team,type,color) {
    document.getElementById("graph").innerHTML = '<div id="first"></div><div id="second"></div><div id="third"></div>';

    var margin = {top: 20, right: 20, bottom: 150, left: 100},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var chart = d3.select("#first").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var hovertip = d3.select("#first")
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

    d3.csv('./data/'+country+'/'+team+'_players_'+type+'.csv', function(d) {
        d.overall_rating = +d.overall_rating;
        return d;
        }, function(error, data) {
        if (error) throw error;

        x.domain(data.map(function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.overall_rating; })]);

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x",0 - (height / 2))
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Overall_Ratings");
        

        chart.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.name); })
            .attr("y", function(d) { return y(d.overall_rating); })
            .attr("height", function(d) { return height - y(d.overall_rating); })
            .attr("width", x.rangeBand())
            .style("fill", color)
            .on("mouseover",function(d) {
                d3.select(this).style("fill",'rgb(69,173,168)');
                hovertip.text("Team: " + team + ", Ratings: " + d.overall_rating);
                hovertip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return hovertip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
                d3.select(this).style("fill",color);
                return hovertip.style("visibility", "hidden");
            })
            .on("click",function(d){
                //
            });
            
    });
}


function screePlot(country,team,type,color) {
    file_name = './data/'+country+'/'+team+'_players_'+type+'_scree_loadings.csv';

    var margin = {top: 20, right: 20, bottom: 150, left: 100},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#second").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal().rangeRoundPoints([0 , width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var colLine1 = d3.svg.line()
        .x(function(d) { return x(d.variable); })
        .y(function(d) { return y(d.col1); })
        .interpolate("linear");

    d3.csv(file_name, function(error, data) {
        data.forEach(function(d) {
            d.variable = d.variable;
            d.col1 = +d.col1;
        });

        x.domain(data.map(function(d) { return d.variable; }));
        y.domain([0, d3.max(data, function(d) { return Math.max(d.col1); })]);

        svg.append("path")
            .attr("class", "line")
            .style("stroke", color)
            .style("fill","none")
            .attr("d", colLine1(data));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -75)
            .attr("x",0 - (height / 2))
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Loadings");
        
    });
}


function loadings(country,team,type,color) {
    document.getElementById("third").innerHTML = '<div id="pca3"></div>';
    file_name = './data/'+country+'/'+team+'_players_'+type+'_pca3_loadings.csv';

    var width = 650,
        size = 200,
        padding = 25;

    var x = d3.scale.linear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scale.linear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(6);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(6);

    d3.csv(file_name, function(error, data) {
        if (error) throw error;

        var domainByTrait = {},
            traits = d3.keys(data[0]).filter(function(d) { return d !== "name"; }),
            n = traits.length;

        traits.forEach(function(trait) {
            domainByTrait[trait] = d3.extent(data, function(d) { return Number(d[trait]); });
        });

        xAxis.tickSize(size * n);
        yAxis.tickSize(-size * n);

        var svg = d3.select("#pca3").append("svg")
            .attr("width", size * n + padding)
            .attr("height", size * n + padding)
            .attr("transform", "translate(" + 475 + "," + 0 + ")")
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

        svg.selectAll(".x.axis")
            .data(traits)
            .enter().append("g")
            .attr("class", "x axis")
            .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
            .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

        svg.selectAll(".y.axis")
            .data(traits)
            .enter().append("g")
            .attr("class", "y axis")
            .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
            .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

        var brush = d3.svg.brush()
            .x(x)
            .y(y)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

        var cell = svg.selectAll(".cell")
            .data(cross(traits, traits))
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) {return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";})
            .each(plot);

        // Titles for the diagonal.
        cell.filter(function(d) { return d.i === d.j; }).append("text")
            .attr("x", padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text(function(d) { return d.x; });

        cell.call(brush);

        function plot(p) {
            var cell = d3.select(this);

            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);

            cell.append("rect")
                .attr("class", "frame")
                .attr("x", padding / 2)
                .attr("y", padding / 2)
                .attr("width", size - padding)
                .attr("height", size - padding);

            cell.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("cx", function(d) { return x(d[p.x]); })
                .attr("cy", function(d) { return y(d[p.y]); })
                .attr("r", 4)
                .style("fill", color)
                ;
        }

        var brushCell;

        // Clear the previously-active brush, if any.
        function brushstart(p) {
            if (brushCell !== this) {
                d3.select(brushCell).call(brush.clear());
                x.domain(domainByTrait[p.x]);
                y.domain(domainByTrait[p.y]);
                brushCell = this;
            }
        }

        // Highlight the selected circles.
        function brushmove(p) {
            var e = brush.extent();
            svg.selectAll("circle").classed("hidden", function(d) {
            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
                || e[0][1] > d[p.y] || d[p.y] > e[1][1];
            });
        }

        // If the brush is empty, select all circles.
        function brushend() {
            if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
        }
    });

    function cross(a, b) {
      var c = [], n = a.length, m = b.length, i, j;
      for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
      return c;
    }
}


function parallelCoordinates_players(country,team,type,color) {

    file_name = './data/'+country+'/'+team+'_players_'+type+'.csv';

    var margin = {top: 50, right: 10, bottom: 10, left: 10},
        width = 1600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {},
        dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var hovertip = d3.select("#graph")
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

    d3.csv(file_name, function(error, player) {

      // Extract the list of dimensions and create a scale for each.
      x.domain(dimensions = d3.keys(player[0]).filter(function(d) {
        return d != "name" && d != "position" && (y[d] = d3.scale.linear() // && d != "id"
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
            .attr("d", path)
            .style("stroke", function(d) {
                return color;
            })
            .style("fill","none")
            .on("mouseover",function(d) {
                hovertip.text("Name: " + d.name + ", Ratings: " + d.overall_rating);
                hovertip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return hovertip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
                return hovertip.style("visibility", "hidden");
            });

      // Add a group element for each dimension.
      var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.behavior.drag()
            .origin(function(d) { return {x: x(d)}; })
            .on("dragstart", function(d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
        }));

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

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
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