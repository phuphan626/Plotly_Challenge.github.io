// Read in the samples.json file using D3 and .then function to print the dataset in the console
file_path = './samples.json';
// Create the function to build bar chart and bubble chart
function render_chart(sample) {
    // Get data for selected id
    d3.json(file_path).then((data) => {
        for (var i = 0; i < data.samples.length; i++) {
            if (data.samples[i].id == sample) {
                var sample_data = data.samples[i]
            }
        };
        // Get the array of data
        var sample_values = sample_data.sample_values;
        var otu_ids = sample_data.otu_ids;
        var otu_labels = sample_data.otu_labels;
        // Slice out the first ten and reverse them to get in descending order
        var x_values = sample_values.slice(0, 10).reverse();
        var y_values = otu_ids.slice(0, 10).reverse().map(values => `OTU ${values}`) // Mapping the values with OTU in front
        var hover_text = otu_labels.slice(0, 10).reverse();
        // Create the bar chart trace and layout
        var bar_chart = {
            x: x_values,
            y: y_values,
            text: hover_text,
            type: 'bar',
            orientation: 'h'
        };
        var bar_data = [bar_chart];
        var layout = {
            title: `Top 10 OTUs in Sample ${sample}`
        };
        Plotly.newPlot('bar', bar_data, layout, { responsive: true });
        // Create the bubble trace and layout
        var bubble_chart = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };
        var bubble_data = [bubble_chart];
        var bubble_layout = {
            title: `All Bacteria in Sample ${sample} and Corresponding Frequency`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Frequency' }
        };
        Plotly.newPlot('bubble', bubble_data, bubble_layout, { responsive: true });
    });
};

// Create function to build metadata panel and gauge chart
function metadata_panel(sample) {
    d3.json(file_path).then((data) => {
        for (var i = 0; i < data.metadata.length; i++) {
            if (data.metadata[i].id == sample) {
                var sample_data = data.metadata[i]
            }
        };
        // Create some variable to hold values and places
        var panel_data = d3.select('tbody');
        var tb = document.querySelector('tbody');
        while (tb.childNodes.length) {
            tb.removeChild(tb.childNodes[0]);
        };
        Object.entries(sample_data).forEach(([key, value]) => {
            var row = panel_data.append('tr');
            var cell = row.append('td');
            cell.text(`${key}:${value}`)
                // Getting the washing frequency 
            if (key == 'wfreq') {
                wash_frequency = value;
            };
        });
        // Create the gauge chart
        var gauge_chart = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wash_frequency,
            gauge: {
                axis: {
                    range: [0, 10],
                    dtick: 2
                },
                bar: { color: '#003333' },
                steps: [
                    { range: [0, 2], color: "#FFF9C4" },
                    { range: [2, 4], color: "#F0F4C3" },
                    { range: [4, 6], color: "#DCEDC8" },
                    { range: [6, 8], color: "#C8E6C9" },
                    { range: [8, 10], color: "#B2DFDB" }
                ],
            },
            title: 'Washing Frequency',
            type: "indicator",
            mode: "gauge+number"
        };
        var gauge_data = [gauge_chart];
        // Create layout
        var gauge_layout = { width: 400, height: 450, margin: { l: -100, t: 0, b: 0 } };
        // Plot the gauge chart
        Plotly.newPlot('gauge', gauge_data, gauge_layout, { responsive: true });
    });
};
// Create the init function
function init() {
    // Get the dropdown element from html
    var selection = d3.select('#selDataset');
    d3.json(file_path).then(function(data) {
        // Get the ids for dropdown 
        data.names.forEach(name => selection.append('option').text(name).property('value'));
        console.log(data);
    });
    render_chart('940');
    metadata_panel('940');
};
// Create function to display data
function optionChanged(id) {
    render_chart(id);
    metadata_panel(id);
};
// Initialize the page
init();