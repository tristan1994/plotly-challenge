
// Initialize a function
function init(){
    // Select drop down menu in the HTML
    var dropDownMenu = d3.select("#selDataset")
    //Getting data from json
    d3.json("samples.json").then(data => {
        console.log(data)
        var idName = data.names;
        idName.forEach(name => dropDownMenu.append('option').text(name).property('value', name))    
    buildPlot(idName[0]);
    demographic(idName[0]);
    });
};



//Create a function for new graph for each ID
function optionChanged(id){
    buildPlot(id);
    demographic(id);
}

function buildPlot(id) {
    //Getting data from json
    d3.json("samples.json").then(function(data){
        console.log(data)
        //Store samples
        var sample = data.samples;
        var filteredSample = sample.filter(d => d.id == id)[0];
        
        var x_value = filteredSample.sample_values.slice(0, 10).reverse();
        var y_value = filteredSample.otu_ids.slice(0,10).map(OTUID => 'OTU' + OTUID).reverse();
        var label = filteredSample.otu_labels.slice(0,10).reverse();
        // Create a trace
        var traceBar = {
            x: x_value,
            y: y_value,
            type: "bar",
            text: label,
            orientation: 'h'
        };

        var dataBar = [traceBar];
        var layoutBar = {
            title: "Top 10 OTU in Sample"
        };

        Plotly.newPlot("bar", dataBar, layoutBar);

        // Create a trace
        var traceBubble = {
            x: filteredSample.otu_ids,
            y: filteredSample.sample_values,
            mode: 'markers',
            marker: {
                size: filteredSample.sample_values,
                color: filteredSample.otu_ids
            },
            text: label
        };

        var dataBubble = [traceBubble];

        var layoutBubble = {
            title: "Bacteria in Sample and Correspoding Frequency",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Frequency'}
        };

        Plotly.newPlot("bubble", dataBubble, layoutBubble);
    });
};

init();



function demographic(UID) {
    var panel = d3.select("#sample-metadata");
    panel.html("")
    d3.json("samples.json").then(data => {
        var demoInfo = data.metadata
        demoInfo = demoInfo.filter(patientRow => patientRow.id == UID)[0]
        Object.entries(demoInfo).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    })
    
}
