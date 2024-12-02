d3.csv("reptdata.csv").then(
    function (dataset) {

        console.log(dataset)
        //var limitedDataset = dataset.slice(200, 398);
        //console.log(limitedDataset)
        var nestedData = d3.group(dataset, d => d.Order, d => d.Suborder, d => d.Family, d => d.Genus, d => d.Species)
        //var dimensions = {
        //    width: 1600,
        //    height: 1600,
        //    margin: {
        //        top: 10,
        //        bottom: 60,
        //        right: 10,
        //        left: 80
        //    }
        //}
        var root = d3.hierarchy(nestedData)
        const orderArray = Array.from(new Set(dataset.map(obj => obj.Order)))
            .map(Order => dataset.find(obj => obj.Order === Order));
        console.log(orderArray);

        const subOrderArray = Array.from(new Set(dataset.map(obj => obj.Suborder)))
            .map(Suborder => dataset.find(obj => obj.Suborder === Suborder));
        console.log(subOrderArray);

        const familyArray = Array.from(new Set(dataset.map(obj => obj.Family)))
            .map(Family => dataset.find(obj => obj.Family === Family));
        console.log(familyArray);

        const genusArray = Array.from(new Set(dataset.map(obj => obj.Genus)))
            .map(Genus => dataset.find(obj => obj.Genus === Genus))
        console.log(genusArray);

        var mergeHolder = d3.merge([orderArray, subOrderArray, familyArray, genusArray])
        console.log("adfasdf");

        var nestedHolder = d3.group(mergeHolder, d => d.Order, d => d.Suborder, d => d.Family, d => d.Genus);
        console.log(nestedHolder);
        var rootd = d3.hierarchy(nestedHolder);

        console.log(rootd);
        //// Specify the chart’s dimensions.
        const width = 900;
        const height = width;
        const cx = width * 0.5; 
        const cy = height * 0.5; 
        const radius = Math.min(width, height) / 2;

  
        let layout = d3.tree()
            .size([2* Math.PI, radius])
            .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);


        layout(rootd);

        console.log(root);

        var categoryArray = [];

        root.children.forEach(d => {
            categoryArray.push(d.data[0])
            console.log(d)
        });

        let colorScale = d3.scaleOrdinal(d3.schemeReds[4]);
        console.log(colorScale);



        var svg = d3.select("#tree")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-cx, -cy, width, height])
            //.attr("style", "width: 100%; height: auto;");

           
        svg.selectAll("treeDotLegend")
            .data(categoryArray)
            .enter()
            .append("circle")
            .attr("cx", -cx+ 10)
            .attr("cy", function (d, i) { return (-cy + 30) + i * 25 })
            .attr("r", 7)
            .style("fill", function (d) { return colorScale(d) })

        svg.selectAll("treeLegend")
            .data(categoryArray)
            .enter()
            .append("text")
            .attr("x", -cx+20)
            .attr("y", function (d, i) { return (-cy + 35) + i * 25 })
            .style("fill", function (d) { return colorScale(d) })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")




        console.log("aaa");
        console.log(rootd.links());

        let bound = svg.append("g")
            .attr("transform", `translate(10,0)`)
        // Append links.
        let link = bound.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll()
            .data(rootd.links().filter(l => l.source.depth !== 5 && l.target.depth !== 5))
            .join("path")
            .attr("d", d3.linkRadial()
                .angle((d) => d.x)
                .radius((d) => d.y));



        var Tooltip = d3.select("#leftHolder")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute") 
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")


        console.log("haasdfuh");
        console.log(rootd.descendants());
        // Append nodes.
        let nodes = bound.append("g")
            .selectAll()
            .data(rootd.descendants())
            .enter()
            .append("circle")
            .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
            .style("visibility", d => d.depth === 5 ? "hidden" : "visible")
            .attr("fill", d => {
                let currentNode = d;
                let orderValue = null;

                while (currentNode) {
                    if (categoryArray.indexOf(currentNode.data[0]) !== -1) {
                        orderValue = currentNode.data[0];
                        break;  
                    }
                    currentNode = currentNode.parent; 
                }

                if (!orderValue) {
                    orderValue = 0;
                }

        
                return colorScale(orderValue);
            })
            .on('mouseover', function (d, i) {

                nodes.selectAll().style("opacity", 0.5)

                d3.select(this).transition()
                    .duration('50')
                    .attr("style", "outline: thin solid black;");

                Tooltip
                    .style("opacity", 1)
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)

               
            
            })
            .on('mousemove', function (event, d) {
               
                console.log(d);
                console.log(this);
                Tooltip
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px")
                    .html(getTaxonomyName(d.depth)  + (d.data[0] == undefined? "" : ": " + d.data[0]));
            })
            .on('mouseout', function (d)
            {
                d3.select(this).transition()
                    .duration('50')
                    .attr("style");

                Tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0)
            })
            .attr("r", 3.0)
        console.log(nodes)

        console.log(root.descendants());



        ////////////////////////////////////////
        d3.json("countries.geo.json").then(
            function (geoset) {
                
            }
        )



    }

)
function getTaxonomyName(num) {
    switch (num)
    {
        case 0:
            return "Root";
        case 1:
            return "Order";
        case 2:
            return "Suborder";
        case 3:
            return "Family";
        case 4:
            return "Genus";
    }
}