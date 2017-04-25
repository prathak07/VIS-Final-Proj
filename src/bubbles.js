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

    d3.csv("../data/"+country+".csv", function(error, data){

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