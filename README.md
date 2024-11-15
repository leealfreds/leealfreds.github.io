# Creating a bar chart in D3

In this exercise you will be creating a barchart from scratch using a new dataset. The dataset contains 
a numeric value indicating how common a given name was (over time).

You should be defining your graph inside the file script.js using the following steps (you can also get inspiration from the code we wrote in class)

- read your data `names-data.csv`
- define the dimensionality of your final window. Once you have plotted the final graph, come back to this step and adjust the sizes to improve the aspect ratio of your graph.
- define a variable called `name` where you will set the name you intend to visualize the graph for
- set the x-scale and the y-scale for your graph. Remember, the idea is to have on the x axis the years, and on the y axis the number associated `name` in the given year
- time to append a group of bars to your `svg` element. Remember you can use `g` to group bars together in a single group.
- now it is time to create the x and y axis and append them to your final visualization. Try to improve the way the axis and the ticks look. For example, search online for ways to rotate the axis tick (65 degrees should do), and to reduce/increase the number of ticks visualized.

Once you are satisfied with the result update your code on Github and add a screenshot of your result directly on the repository. Then, submite the screenshot and the `script.js` file on Gradescope.

