d3.csv("reptdata.csv").then(
    function (dataset) {
        const zoom = d3.zoom()
            .scaleExtent([0.5, 10])  // Set zoom scale range
            .on("zoom", function (event) {
                // Apply the zoom transform to the <g> element that holds the tree
                bound.attr("transform", event.transform);
            });
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
        const width = 800;
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
            .call(zoom);
        //.attr("style", "width: 100%; height: auto;");


        const legendTree = svg.selectAll(".legend")
            .data(categoryArray)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legendTree.append("rect")
            .attr("x", -cx + 10)
            .attr("y", -cy + 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale);

        legendTree.append("text")
            .attr("x", -cx + 40)  // Adjusted text position to avoid overlap with the color box
            .attr("y", -cy + 20)
            .attr("dy", ".35em")
            .attr("fill", "#E0E0E0")
            .style("text-anchor", "start")
            .text(function (d) { return d; });

        console.log("aaa");
        console.log(rootd.links());

        let bound = svg.append("g")
            .attr("transform", `translate(10,0)`)
        // Append links.
        let link = bound.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", .5)
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
            .style("color", "black")
            .style("padding", "5px")
            .style("background-color", "rgba(255,255,255,0.8)")
            .style("pointer-events", "none");


        console.log("haasdfuh");
        console.log(rootd.descendants());
        // Append nodes.
        let nodes = bound.append("g")
            .selectAll()
            .data(rootd.descendants())
            .enter().append("g")
            .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)

        function getColorScaleDendrogram(d) {
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

        }


       
        nodes
            .append("circle")
            .style("visibility", d => d.depth === 5 ? "hidden" : "visible")
            .attr("fill", d => getColorScaleDendrogram(d))
            .on('mouseover', function () {

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
                    .html(getTaxonomyName(d.depth) + (d.data[0] == undefined ? "" : ": " + d.data[0]));
            })
            .on('mouseout', function () {
                Tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
            })
            .attr("r", 1.5);

        nodes.append("text")
            .attr("dy", "0.31em")  
            .attr("x", d => d.x < Math.PI ? 6 : -6)  
            .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")  
            .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)  
            .style("fill", "#333")
            .style("font-size", "2px")
            .text(d => d.data[0])
            .filter(d => d.children) 
            .clone(true).lower()
            .attr("stroke", "white");

        /////////////////////////


        const iucnStatuses = ["Least Concern", "Near Threatened", "Vulnerable", "Endangered", "Critically Endangered"];


        const validDataset = dataset.filter(d => {
            const xValue = d["Maximum Longevity (years)"];
            const yValue = d["Mean number of offspring per litter or number of eggs per clutch"];
            return !isNaN(xValue) && !isNaN(yValue);
        });

        console.log("aaaaaaa"); console.log(validDataset);
        const marginScatter = { top: 40, right: 40, bottom: 50, left: 60 };
        const widthScatter = 500 - marginScatter.left - marginScatter.right;
        const heightScatter = 400 - marginScatter.top - marginScatter.bottom;

        svg = d3.select("#scatterplot")
            .attr("width", widthScatter + marginScatter.left + marginScatter.right)
            .attr("height", heightScatter + marginScatter.top + marginScatter.bottom)
            .append("g")
            .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");


        const xScale = d3.scaleLinear()
            .domain([0, 150])
            .range([0, widthScatter]);
        console.log("max" + d3.max(validDataset, d => d["Maximum Longevity (years)"]));
        const yScale = d3.scaleLinear()
            .domain([0, 150])
            .range([heightScatter, 0]);


        const colorScaleScatter = d3.scaleOrdinal(d3.schemeReds[5])
            .domain(iucnStatuses);

        //console.log(iucnStatuses); 
        //console.log(colorScaleScatter.domain()); 


        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + heightScatter + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        svg.append("text")
            .attr("x", widthScatter / 2)
            .attr("y", heightScatter + marginScatter.bottom - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .attr("fill", "#E0E0E0")
            .text("Maximum Longevity (years)");

        svg.append("text")
            .attr("x", -150)
            .attr("y", heightScatter / 2 - 200)
            .attr("transform", "rotate(-90)")
            .attr("fill", "#E0E0E0")
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Mean Number of Offspring or Eggs per Clutch");



        const dots = svg.selectAll("circle")
            .data(validDataset)
            .enter().append("circle")
            .attr("cx", d => xScale(d["Maximum Longevity (years)"]))
            .attr("cy", d => yScale(d["Mean number of offspring per litter or number of eggs per clutch"]))
            .attr("r", 3)
            .attr("fill", d => colorScaleScatter(d["IUCN redlist assessment"]))
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1);
                tooltip.style("visibility", "visible");
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`Species: ${d.Species}<br>Longevity: ${d["Maximum Longevity (years)"]} years<br>Offspring: ${d["Mean number of offspring per litter or number of eggs per clutch"]}`)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 38) + "px");
            })
            .on("mouseout", function () {
                d3.select(this)
                    .style("stroke", "none");
                tooltip.style("visibility", "hidden");
                tooltip.transition().duration(10).style("opacity", 0);
            });


        const legend = svg.selectAll(".legend")
            .data(iucnStatuses)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(0," + i * 20 + ")");


        legend.append("rect")
            .attr("x", widthScatter - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScaleScatter);


        legend.append("text")
            .attr("x", widthScatter - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("fill", "#E0E0E0")
            .style("text-anchor", "end")
            .text(d => d); 

        ////////////////////////////////////////\
        const zoomHeatmap = d3.zoom()
            .scaleExtent([0.5, 10])  
            .on("zoom", function (event) {
                d3.select("#heatmap").attr("transform", event.transform);
            });

            const taxonomicLevels = ["Order", "Suborder", "Family", "Genus"];


            

            var margin = { top: 40, right: 5, bottom: 40, left: 120 };
            var widthHeatmap = 600 - margin.left - margin.right;
            var heightHeatmap = 400 - margin.top - margin.bottom;


        const dropdown = d3.select("#dropdown")
            .attr("class", "dropdown")
            .style("align-self", "start")
            .attr("transform", "translate(" + 0 + "," + margin.top + ")")
            .on("change", function () {
                const selectedLevel = this.value;
                updateHeatmap(selectedLevel);
            });

        dropdown.selectAll("option")
            .data(taxonomicLevels)
            .enter().append("option")
            .attr("value", d => d)
            .text(d => d);


            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background-color", "rgba(255,255,255,0.8)")
                .style("padding", "5px")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px") 
                .style("border-radius", "5px")
                .style("opacity", 0)
                .style("color", "black")
                .style("pointer-events", "none");

        let clicked = false;
        
        function highlightDendrogram(taxonomicCategory, status, taxonomicLevel) {
            let selectedValue = d3.select("#dropdown").property("value")
            if (!clicked) {
                console.log(taxonomicCategory);
                const matchingDatasetEntries = dataset.filter(d =>
                    (
                        d["Order"] === taxonomicCategory ||
                        d["Suborder"] === taxonomicCategory ||
                        d["Family"] === taxonomicCategory ||
                        d["Genus"] === taxonomicCategory) &&
                    d["IUCN redlist assessment"] === status
                );
                const matchingNamesSet = new Set();
                matchingDatasetEntries.forEach(entry => {
                    if (entry["Order"]) matchingNamesSet.add(entry["Order"]);
                    if (entry["Suborder"]) matchingNamesSet.add(entry["Suborder"]);
                    if (entry["Family"]) matchingNamesSet.add(entry["Family"]);
                    if (entry["Genus"]) matchingNamesSet.add(entry["Genus"]);
                });
               
                const matchingSpeciesSet = new Set();
                matchingDatasetEntries.forEach(entry => {
                    if (entry["Order"] === taxonomicCategory) matchingSpeciesSet.add(entry.Species);
                    if (entry["Suborder"] === taxonomicCategory) matchingSpeciesSet.add(entry.Species);
                    if (entry["Family"] === taxonomicCategory) matchingSpeciesSet.add(entry.Species);
                    if (entry["Genus"] === taxonomicCategory) matchingSpeciesSet.add(entry.Species);
                });

                function findMatchingNodesRecursively(node) {
                    let matchingNodes = []; 
                   
                    if (node.data && matchingNamesSet.has(node.data[0])) {
                        if (node.depth >= getDepth(selectedValue))
                        {
                            matchingNodes.push(node);
                        }
                    }

                    if (node.children) {
                        node.children.forEach(child => {
                            matchingNodes = matchingNodes.concat(findMatchingNodesRecursively(child));
                        });
                    }

                    return matchingNodes;
                }

                const rootMatchingNodes = findMatchingNodesRecursively(rootd);

                nodes.selectAll("circle")
                    .attr("fill", d => {
                        if (rootMatchingNodes.some(node => node.data[0] === d.data[0])) {
                            return "red";
                        }
                        return "none";
                    });


                console.log("aaaa");
                console.log(matchingNamesSet);
                d3.select("#scatterplot")
                    .selectAll("circle")
                    .attr("fill", function (d) {
                        if (matchingSpeciesSet.has(d.Species)) {
                            return colorScaleScatter(d["IUCN redlist assessment"]); 
                        }
                        return "none"; 
                    })


                clicked = true;
            }
            else
            {
                clicked = false;
                nodes.selectAll("circle")
                    .attr("fill", d => getColorScaleDendrogram(d)); 
                d3.select("#scatterplot")
                    .selectAll("circle")
                    .attr("fill", d => colorScaleScatter(d["IUCN redlist assessment"]));
            }
        }
        function updateHeatmap(taxonomicLevel) {
            const taxonomicData = d3.group(dataset,
                d => d[taxonomicLevel],
                d => d["IUCN redlist assessment"]
            );

            const taxonomicCategories = Array.from(taxonomicData.keys()); 
            var xScale = d3.scaleBand()
                .domain(iucnStatuses) 
                .range([0, widthHeatmap])
                .padding(0.05);

            var yScale = d3.scaleBand()
                .domain(taxonomicCategories) 
                .range([0, heightHeatmap])
                .padding(0.05);

            var colorScaleHeat = d3.scaleSequential(d3.interpolateYlGnBu)
                .domain([0, d3.max(iucnStatuses, status =>
                    d3.max(taxonomicCategories, category => {
                        const categoryData = taxonomicData.get(category)?.get(status);
                        return categoryData ? categoryData.length : 0;
                    })
                )]);
            d3.select("#heatmap").remove();

            svg = d3.select("#bottom-right")
                .append("svg")
                .attr("id", "heatmap")
                .attr("width", widthHeatmap + margin.left + margin.right)
                .attr("height", heightHeatmap + margin.top + margin.bottom)
                .call(zoomHeatmap)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var cells = svg.selectAll(".cell")
                .data(iucnStatuses.flatMap(status =>
                    taxonomicCategories.map(category => ({
                        category, status, count: taxonomicData.get(category)?.get(status)?.length || 0
                    }))
                ))
                .enter().append("rect")
                .attr("x", d => xScale(d.status))  
                .attr("y", d => yScale(d.category)) 
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .style("fill", d => colorScaleHeat(d.count))
                .on("mouseover", function (event, d) {
                    d3.select(this)
                        .style("stroke", "black")
                        .style("opacity", 1);
                    tooltip.style("visibility", "visible");
                    tooltip.transition().duration(200).style("opacity", 1);
                    tooltip.html(`${taxonomicLevel}: ${d.category}<br>Status: ${d.status}<br># Species: ${d.count}`)
                        .style("left", (event.pageX + 20) + "px")
                        .style("top", (event.pageY - 38) + "px");
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .style("stroke", "none");
                    tooltip.style("visibility", "hidden");
                    tooltip.transition().duration(10).style("opacity", 0);
                })
                .on("click", function (event, d) {
                    highlightDendrogram(d.category, d.status, taxonomicLevel);
                })
                .style("opacity", 0)  
                .transition() 
                .duration(500)  
                .style("opacity", 1);  


            const xaxisHeat = svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + heightHeatmap + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .style("text-anchor", "middle")
                .attr("transform", "translate(0, 15)");

  
            const yaxisHeat = svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));


            const legend = svg.selectAll(".legend")
                .data(colorScaleHeat.ticks(5))
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${i * 15}, ${heightHeatmap + margin.bottom + 20})`);

            legend.append("rect")
                .attr("x", 0 - margin.left + 32)
                .attr("y", -heightHeatmap - margin.bottom - 60)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", d => colorScaleHeat(d));

            legend.append("text")
                .attr("x", -90)
                .attr("y", -heightHeatmap - margin.bottom - 30)
                .style("font-size", "10px")
                .style("text-anchor", "start")
                .attr("fill", "#E0E0E0")
                .text((d, i) => {
                    if (i === 0) {
                        return "Less";
                    } else if (i === colorScaleHeat.ticks(5).length - 1) {
                        return "More";
                    } else {
                        return "";
                    }
                });

            svg.append("text")
                .attr("x", widthHeatmap / 2)
                .attr("y", -10)
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .attr("fill", "#E0E0E0")
                .text(`Heatmap of IUCN Status by ${taxonomicLevel}`);


        }


            updateHeatmap("Order");
    

        d3.select("#switchLeast")
            .attr("transform", "translate(" + 0 + "," + 90 + ")")
            .style("padding","5px")
            .on("click", function () {
            if (iucnStatuses.includes("Least Concern")) {
                iucnStatuses.splice(iucnStatuses.indexOf("Least Concern"), 1);  
            } else {
                iucnStatuses.unshift("Least Concern");  
            }

            updateHeatmap(d3.select('#dropdown option:checked').text());
        });

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

function getDepth(name) {
    switch (name) {
        case "Root":
            return 0;
        case "Order":
            return 1;
        case "Suborder":
            return 2;
        case "Family":
            return 3;
        case "Genus":
            return 4;
    }
}
