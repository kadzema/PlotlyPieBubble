var sample = document.querySelector("#selDataset")
var metaList = document.querySelector("#metaList")


function optionChanged(newValue){
    // update metadata
    d3.json("/metadata/"+newValue,function(error2,dataset3){
        datasetKeys = Object.keys(dataset3);
        // remove old text
        metaList.innerHTML = '';
        for(var i = 0; i < datasetKeys.length; i++){
            var newP = document.createElement("p");
            newP.innerHTML = datasetKeys[i] + ": " + dataset3[datasetKeys[i]];
            metaList.appendChild(newP);
        }
    }
    )
    //update piechart
    //update bubblechart
     // draw pie plot and the bubble chart!
     d3.json("/samples/"+newValue, function(error, dataset) {
        
        // get the top 10
        var sampleValues10 = dataset[0].sample_values.slice(0,10);
        var otuIDs10 = dataset[0].otu_ids.slice(0,10);


        // all of the records - for the bubble chart
        var sampleValuesFull = dataset[0].sample_values;
        var otuIDsFull = dataset[0].otu_ids;

        // first ten records for pie chart will go here
        var otuDesc10 = [];
        var otuDescFull = [];

        // get the descriptions
        d3.json("/otu",function(error2,dataset2){

            // get just the descriptions for the ids in the sample set of 10
            for(var o = 0;o< otuIDs10.length;o++){
                otuDesc10.push(dataset2[otuIDs10[o]]);
            }
                    
            //order all of the otu descs so they match to the full data
            for(var o = 0;o< otuIDsFull.length;o++){
                otuDescFull.push(dataset2[otuIDsFull[o]]);
            }

            // update the pie chart
            var newTitle = {
                title: newValue + " Top 10 Samples"// updates the title
            };
            Plotly.relayout("piePlot", newTitle)
            Plotly.restyle("piePlot","values", [sampleValues10])
            Plotly.restyle("piePlot", "labels", [otuIDs10])
            Plotly.restyle("piePlot","hovertext",[otuDesc10])


            // update the bubble chart
            var newMarker = {marker: {
                size: sampleValuesFull,
                color: otuIDsFull,
                colorscale: 'Earth'
            }}

            var newTitle = {
                title: newValue + " Sample Counts per Sample ID"
            }

            Plotly.restyle('bubbleChart', "x",[otuIDsFull]);
            Plotly.restyle('bubbleChart',"y",[sampleValuesFull]);
            Plotly.restyle('bubbleChart',"text",[otuDescFull]);
            Plotly.restyle('bubbleChart', newMarker);
            Plotly.relayout('bubbleChart',newTitle);

        })  

        

    })

    // update the washing gauge
    d3.json("/wfreq/"+newValue,function(error4,dataset4){
        var washings = dataset4;
        console.log("new washings value",washings)
        // test all the values
        // washings = 9;

        // Trig to calc meter point

        // divide 180 by the number of visible sections
        // this is the # of degrees in the arc
        // divide this number by 2 - this is the midway point of the arc
        // multiple determine how each value correlates to the section 
        // for example, with 10 sections, 0-9, value of 0 is 1 greater than itself  * 18 - 9 subtracted from 180 (since this is all reversed)
        // var degrees = 180 - (((washings +1) *18)-9);
        
        //why does this break on 5?
        
        if(washings==0){
            var degrees = 180
        }
        else{
            var degrees = 180 - ((washings *20)-10);
        }
        var startingPoint = 'M -.0 -0.025 L .0 0.025 L '
        if (washings == 5){
            // degrees = 90.5
            startingPoint = 'M -.007 -0.025 L .007 0.025 L '
        }
        var radius = .5;
        var radians = degrees * Math.PI / 180;
        console.log("radians",radians);
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        console.log(x);
        console.log(y);

        // Path: may have to change to create a better triangle
        var mainPath = startingPoint,
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var newHover = [{text: String(washings)}];
        // var newHover = String(washings);

    //     var data = [{ type: 'scatter',
    //     x: [0], y:[0],
    //         marker: {size: 28, color:'850000'}, //the size and color of the dial "knob"
    //         showlegend: false,
    //         name: 'washings/week',
    //         text: washings,
    //         hoverinfo: 'text+name'},
    //     // { values: [50/7, 50/7, 50/7, 50/7, 50/7, 50/7, 50/7, 50],
    //     // rotation: 90,
    //     // // direction: "clockwise",
    //     // text: ['6', '5', '4', '3', '2',
    //     // '1', '0', ''],
    //     // textinfo: 'text',
    //     // textposition:'inside',
    //     // marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
    //     //                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
    //     //                         'rgba(210, 206, 145, .5)', 'rgba(220, 220, 175, .5)',
    //     //                         'rgba(222, 224, 185, .5)',
    //     //                         'rgba(255, 255, 255, 0)']},
    //     // // labels: ['9', '8', '7', '6', '5', '4', '3','2','1','0', ''],
    //     // labels: ['6', '5', '4', '3','2','1','0', ''],
    //     // hoverinfo: 'label',
    //     // hole: .5,
    //     // type: 'pie',
    //     // showlegend: false
    //     // }
    //     { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
    //         // values: [50/9, 50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9, 50],
    //         // values: [5,5,5,5,5,5,5,5,5,5,50], //percentage of 100?
    //         // values: [50/10,50/10,50/10,50/10,50/10,50/10,50/10,50/10,50/10,50/10,50],
    //         // values: [5,5,5,5,5,5,5,5,5,5,50],
    //         // values: [50/7,50/7,50/7,50/7,50/7,50/7,50/7,50],
    //         // values: [50/8,50/8,50/8,50/8,50/8,50/8,50/8,50/8,50],
    //         // values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
    //     values: [5,5,5,5,5,5,5,5,5,5,50],
    //         rotation: 90,
    //         // text: ['9', '8','7', '6','5', '4','3', '2', '1', '0', ''], 
    //         // text: [ '6','5', '4','3', '2', '1', '0', ''],
    //         // text: [ '7','6','5', '4','3', '2', '1', '0', ''],
    //         // text: [ '8','7','6','5', '4','3', '2', '1', '0', ''],
    //         text: [ '9', '8','7','6','5', '4','3', '2', '1', '0', ''],
    //         textinfo: 'text',
    //         textposition:'inside',
    //         // marker: {colors:[ 'rgba(1, 33, 0, .5)','rgba(7, 66, 0, .5)',
    //         // 'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
    //         //                    'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
    //         //                    'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)', 'rgba(255, 0, 0, .5)',
    //         //                    'rgba(255, 255, 255, 0)']},
    //         marker: {colors:[ 'rgba(1, 33, 0, .5)','rgba(7, 66, 0, .5)',
    //             'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
    //                                'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
    //                                'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
    //                                'rgba(249, 240, 220, .5)', 'rgba(255, 0, 0, .5)',
    //                                'rgba(255, 255, 255, 0)']},
    //         // labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
    //         // labels: ['6', '5', '4', '3', '2', '1', '0', ''],
    //         // labels: ['7', '6', '5', '4', '3', '2', '1', '0', ''],
    //         // labels: ['8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
    //         labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
    //         hoverinfo: 'label',
    //         hole: .5,
    //         type: 'pie',
    //         showlegend: false
    //       }
    // ];

    //     var layout = {
    //     shapes:[{
    //         type: 'path',
    //         path: path,
    //         fillcolor: '850000',
    //         line: {
    //             color: '850000'
    //         }
    //         }],
    //     title: 'Washings Per Week',
    //     height: 500,
    //     width: 500,
    //     xaxis: {zeroline:false, showticklabels:false,
    //                 showgrid: false, range: [-1, 1]},
    //     yaxis: {zeroline:false, showticklabels:false,
    //                 showgrid: false, range: [-1, 1]}
    //     };

        var newLayout = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
                }]
            };

        Plotly.relayout('washGauge',newLayout);
        console.log("newHover",newHover);
        //can't get this to change
        // Plotly.restyle('washGauge','text',newHover);

    })
}




function init() {

    var defaultOptionName = "BB_940"

    // populate the dropdown
    d3.json("/names", function(error, dataset) {
        d3.select("#selDataset")
        .selectAll("option").data(dataset)
        .enter().append("option")
        .attr("value", function(d){return d;})
        // can use this if we want to set a specific default selected value, but first one is ok
        // .attr("selected", function(d){
        //      return d === defaultOptionName;
        // })
        .text(function(d){ return d; });
    }

    // do the rest of my logic here?
    // have a function (getdata) that is passed the first sample id returned from /names call
    // buildCharts is a function
    // getData(dataset[0],buildCharts)
    // getData can also be passed seleceted ID and updateCharts function when new ID is selected
    // see optionChanged function

    )

    // draw default pie plot and the bubble chart!
    d3.json("/samples/"+defaultOptionName, function(error, dataset) {

        // get the top 10
        var sampleValues10 = dataset[0].sample_values.slice(0,10);
        var otuIDs10 = dataset[0].otu_ids.slice(0,10);
        // 
        var sampleValuesFull = dataset[0].sample_values;
        var otuIDsFull = dataset[0].otu_ids;

        var otuDesc10 = [];
        var otuDescFull = [];

        // get the descriptions
        d3.json("/otu",function(error2,dataset2){
            // get just the descriptions for the ids in the sample set of 10

            // instead of doing somthing here, call a function to do it
            // //call back is a place holder for another function - in this case buildCharts since this is the initial load
            // buildCharts(dataset[0], dataset2)
            // callback(dataset[0],dataset2)

            for(var o = 0;o< otuIDs10.length;o++){
                otuDesc10.push(dataset2[otuIDs10[o]]);
            }
                    
            //order all of the otu descs so they match to the full data
            for(var o = 0;o< otuIDsFull.length;o++){
                otuDescFull.push(dataset2[otuIDsFull[o]]);
            }

            var data = [{
                values: sampleValues10,
                labels: otuIDs10,
                hovertext: otuDesc10,
                type: "pie",
            }]
            var layout = {
                 title: defaultOptionName + " Top 10 Samples",
                height: 600,
                // width: 800 //without gauge
                width: 600
              };
    
            // //   pie chart
            Plotly.plot("piePlot",data,layout)


            //should we look at max count to see if marker size should be multiplied by a factor to appear more pronounced?s
            var trace1 = [{
                x: otuIDsFull,
                y: sampleValuesFull,
                text: otuDescFull,
                hoverinfo: "x+y+text",
                mode: 'markers',
                marker: {
                  size: sampleValuesFull,
                  color: otuIDsFull,
                  colorscale: 'Earth'
                }
              }];
              
              var layout2 = {
                title: defaultOptionName + " Sample Counts per Sample ID",
                showlegend: false,
                height: 600,
                width: 1180, 
                yaxis:
                {
    
                  titlefont:
                  {
                    size:12,
                    color:"#800000"
                  },
                  domain:sampleValuesFull, //i have no idea how this is used or why this makes the y appear in the hover
                //   showgrid:false,
                //   showline:false,
                //   showticklabels:false,
                //   zeroline:true,
                //   type:"linear",
                //   range:[0,0], // what does this mean also? how are domain and range used in bubble chart?
                  autorange:true
                },
                hovermode:"closest",
              };
    
            Plotly.newPlot('bubbleChart', trace1, layout2);
        })
    })

    // populate the metadata
    d3.json("/metadata/"+defaultOptionName,function(error3,dataset3){
        console.log(dataset3);
        datasetKeys = Object.keys(dataset3);
        for(var i = 0; i < datasetKeys.length; i++){
            var newP = document.createElement("p");
            newP.innerHTML = datasetKeys[i] + ": " + dataset3[datasetKeys[i]];
            metaList.appendChild(newP)
        }
    

    })

    //show the # of washings
    // min = 0; max = 9
    d3.json("/wfreq/"+defaultOptionName,function(error4,dataset4){
        var washings = dataset4;
        
        // test all the values
        // washings = 5;

        // Trig to calc meter point

        // divide 180 by the number of visible sections
        // this is the # of degrees in the arc
        // divide this number by 2 - this is the midway point of the arc
        // multiple determine how each value correlates to the section 
        // for example, with 10 sections, 0-9, value of 0 is 1 greater than itself  * 18 - 9 subtracted from 180 (since this is all reversed)
        // var degrees = 180 - (((washings +1) *18)-9);
        // make it work for 9 sections
        if(washings==0){
            var degrees = 180
        }
        else{
            var degrees = 180 - ((washings *20)-10);
        }

        var startingPoint = 'M -.0 -0.025 L .0 0.025 L '
        if (washings == 5){
            degrees = 90.5
            startingPoint = 'M -.007 -0.025 L .007 0.025 L '
        }
        var radius = .5;
        var radians = degrees * Math.PI / 180;
        console.log("radians",radians);
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        console.log(x);
        console.log(y);

        // Path: may have to change to create a better triangle
        var mainPath = startingPoint,
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'scatter',
        x: [0], y:[0],
            marker: {size: 28, color:'850000'}, //the size and color of the dial "knob"
            showlegend: false,
            name: 'washings/week',
            text: washings,
            hoverinfo: 'name' //'text+name'having trouble changing the text, so taking it out!
        },
        // { values: [50/7, 50/7, 50/7, 50/7, 50/7, 50/7, 50/7, 50],
        // rotation: 90,
        // // direction: "clockwise",
        // text: ['6', '5', '4', '3', '2',
        // '1', '0', ''],
        // textinfo: 'text',
        // textposition:'inside',
        // marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
        //                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
        //                         'rgba(210, 206, 145, .5)', 'rgba(220, 220, 175, .5)',
        //                         'rgba(222, 224, 185, .5)',
        //                         'rgba(255, 255, 255, 0)']},
        // // labels: ['9', '8', '7', '6', '5', '4', '3','2','1','0', ''],
        // labels: ['6', '5', '4', '3','2','1','0', ''],
        // hoverinfo: 'label',
        // hole: .5,
        // type: 'pie',
        // showlegend: false
        // }
        { //values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
            // values: [50/9, 50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9, 50],
            // values: [5,5,5,5,5,5,5,5,5,5,50], //percentage of 100?
            // values: [50/10,50/10,50/10,50/10,50/10,50/10,50/10,50/10,50/10,50/10,50],
            // values: [5,5,5,5,5,5,5,5,5,5,50],
            // values: [50/7,50/7,50/7,50/7,50/7,50/7,50/7,50],
            // values: [50/8,50/8,50/8,50/8,50/8,50/8,50/8,50/8,50],
            values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
            // values: [50/11,50/11,50/11,50/11,50/11,50/11,50/11,50/11,50/11,50/11,50],
        // values: [5,5,5,5,5,5,5,5,5,5,50],
            rotation: 90,
            // text: ['9', '8','7', '6','5', '4','3', '2', '1', '0', ''], 
            // text: [ '6','5', '4','3', '2', '1', '0', ''],
            // text: [ '7','6','5', '4','3', '2', '1', '0', ''],
            // text: [ '8','7','6','5', '4','3', '2', '1', '0', ''],
            text: [ '9','8','7','6', '5','4', '3', '2', '1', ''],
            // text: [ '9', '8','7','6','5', '4','3', '2', '1', '0', ''],
            // text: ['10', '9', '8','7','6','5', '4','3', '2', '1', '0', ''],
            textinfo: 'text',
            textposition:'inside',
            marker: {colors:[ 'rgba(1, 33, 0, .5)','rgba(7, 66, 0, .5)',
            'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                               'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                               'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)', 'rgba(245, 240, 220, .5)',
                               'rgba(255, 255, 255, 0)']},
            // marker: {colors:[ 'rgba(1, 33, 0, .5)','rgba(7, 66, 0, .5)',
            //     'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
            //                        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
            //                        'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
            //                        'rgba(249, 240, 220, .5)', 'rgba(255, 0, 0, .5)',
            //                        'rgba(255, 255, 255, 0)']},
            // labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
            // labels: ['6', '5', '4', '3', '2', '1', '0', ''],
            // labels: ['7', '6', '5', '4', '3', '2', '1', '0', ''],
            labels: ['8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
            // labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', ''],
            // labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
            // labels: ['10','9', '8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
          }
    ];

        var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        title: 'Washings Per Week',
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };

        Plotly.newPlot('washGauge', data, layout);
    })
}

init();
