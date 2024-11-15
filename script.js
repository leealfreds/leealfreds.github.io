d3.csv("name-data.csv").then(
    function (dataset) {

        console.log(dataset)

        var dimensions = {
            width: 1600,
            height: 800,
            margin: {
                top: 10,
                bottom: 60,
                right: 10,
                left: 80
            }
        }

        var svg = d3.select("#barchart")
            .style("width", dimensions.width + "px")
            .style("height", dimensions.height + "px")
        var name = dataset.columns[6]

        var xScale = d3.scaleBand()
            .domain(d3.map(dataset, d => +d.year))
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
            .padding(0.2)
        var max = d3.max(dataset, d => +d.Helen)
        console.log(max)
        var yScale = d3.scaleLinear()
            .domain([0, max * 1.05])
            .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

        var bars = svg.append("g")
            .selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", d => xScale(+d.year))
            .attr("y", d => yScale(+d.Helen))
            .attr("height", d => yScale(0) - yScale(+d.Helen))
            .attr("width", d => xScale.bandwidth())
            .attr("fill", "#69b3a2")



        console.log(bars)
        var xAxisGen = d3.axisBottom()
            .tickValues(xScale.domain().filter(function (d, i) { return !(i % 1.5) }))
            .scale(xScale)

        var xAxis = svg.append("g")
            .call(xAxisGen)
            .style("transform", `translateY(${(dimensions.height - dimensions.margin.bottom)}px)`)
            //.attr("transform", "rotate(-65)")


        var yAxisGen = d3.axisLeft().scale(yScale)
        var yAxis = svg.append("g")
            .call(yAxisGen)
            .style("transform", `translateX(${dimensions.margin.left}px)`)

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", (dimensions.width / 2))
            .attr("y", dimensions.height - dimensions.margin.bottom +40)
            .text("Years");
            
        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("x", -dimensions.height / 2 + 120)
            .attr("y", dimensions.margin.left - 60)
            .text("# of People Named Helen")

    }

)