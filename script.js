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
        
        //// Specify the chart’s dimensions.
        const width = 1800;
        const height = width;
        const cx = width * 0.5; 
        const cy = height * 0.50; 
        const radius = Math.min(width, height) / 5;

        // Create a radial tree layout. The layout’s first dimension (x)
        // is the angle, while the second (y) is the radius.
        let layout = d3.tree()
            .size([2 * Math.PI, radius])
            .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

        layout(root);

        console.log(root);

        var categoryArray = [];

        root.children.forEach(d => {
            categoryArray.push(d.data[0])
            console.log(d)
        });

        let colorScale = d3.scaleOrdinal()
            //.domain(categoryArray)
            .range(["red", "green", "blue", "yellow"]);  
        console.log(colorScale);

        var svg = d3.select("#tree")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-cx, -cy, width, height])
            .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

        let bound = svg.append("g")
            .attr("transform", `translate(10,0)`)
        // Append links.
        let link = bound.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll()
            .data(root.links())
            .join("path")
            .attr("d", d3.linkRadial()
                .angle((d) => d.x)
                .radius((d) => d.y))


        // Append nodes.
        let nodes = bound.append("g")
            .selectAll()
            .data(root.descendants())
            .enter()
            .append("circle")
            .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
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
            //.attr("fill", d => colorScale((d.data.Order != undefined) ? d.data.Order : d.data[1].Order))
            .attr("r", 2.5)
        console.log(nodes)
        // Append labels.
        //let labels = bound.append("g")
        //    .attr("stroke-linejoin", "round")
        //    .attr("stroke-width", 1)
        //    .selectAll("text")
        //    .data(root.descendants()) 
        //    .enter()
        //    .append("text")
        //    .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
        //    .attr("stroke", "black")
        //    .attr("stroke-width", 0.5)  
        //    .text(d => d.data[0]);  // Use the most specific available level (Species > Genus > Family > Order)

        //console.log(labels);

        //let layout = d3.tree()
        //    .size([dimensions.height, dimensions.width])
        //layout(root);

        //var svg = d3.select("#tree")
        //    .style("width", dimensions.width + "px")
        //    .style("height", dimensions.height + "px")

        //let bound = svg.append("g")
        //    .attr("transform", `translate(10,0)`)

        //let link = bound.insert("g")
        //    .attr("fill", "none")
        //    .attr("stroke", "#555")
        //    .attr("stroke-opacity", 0.4)
        //    .attr("stroke-width", 2)
        //    .selectAll("path")
        //    .data(root.links()) 
        //    .join("path")
        //    .attr("d", d3.linkHorizontal()
        //        .x(d => d.y)
        //        .y(d => d.x));


        ////fix node color
        ////height 0 has direct objects
        ////height 5 has   
        //const nodes = bound.append("g")
        //    .selectAll("circle")
        //    .data(root.descendants()) 
        //    .enter()
        //    .append("circle")
        //    .attr("transform", d => `translate(${d.y},${d.x})`)
        //    .attr("fill", d => console.log(d))
        //    .attr("r", 4)



        //let labels = bound.append("g")
        //    .attr("stroke-linejoin", "round")
        //    .attr("stroke-width", 1)
        //    .selectAll("text")
        //    .data(root.descendants())  // Bind the descendant data for labels
        //    .enter()
        //    .append("text")
        //    .attr("transform", d => `translate(${d.y},${d.x})`)
        //    .attr("stroke", "black")
        //    .attr("stroke-width", 0.5)  // Optional: Add stroke width for legibility
        //    .text(d => d.data[0]);  // Use the most specific available level (Species > Genus > Family > Order)

        console.log(labels);
        console.log(root.descendants());
    }

)