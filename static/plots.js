var sample = document.querySelector("#selDataset")
var metaList = document.querySelector("#metaList")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

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
        console.log("sampleValues10")
        console.log(sampleValues10)
        console.log("otuIDs10")
        console.log(otuIDs10);

        // all of the records
        var sampleValuesFull = dataset[0].sample_values;
        var otuIDsFull = dataset[0].otu_ids;

        var otuDesc10 = [];
        var otuDescFullkxa = [];
        console.log("The option has changed");
        console.log(newValue);
        console.log("before push");
        console.log(otuDescFullkxa);
        console.log("how is the above NOT empty?");

        // get the descriptions
        d3.json("/otu",function(error2,dataset2){

            // get just the descriptions for the ids in the sample set of 10
            console.log(newValue);
            console.log("before push");
            console.log(otuDescFullkxa);
            console.log("how is the above NOT empty?");
            for(var o = 0;o< otuIDs10.length;o++){
                // console.log("pushing this value")
                // console.log(dataset2[otuIDs10[o]])
                otuDesc10.push(dataset2[otuIDs10[o]]);
                // console.log("value of otuDesc10:")
                // console.log(otuDesc10)
                
                // wait 5 seconds so we might have data
                // sleep(5000) // this doen't seem to help at all!

            }
                    
            //order all of the otu descs so they match to the full data
            for(var o = 0;o< otuIDsFull.length;o++){
                // console.log(dataset2[otuIDsFull[o]});
                otuDescFullkxa.push(dataset2[otuIDsFull[o]]);
                // console.log("contents of otuDescFull");
                // console.log("length of otuDescFullkxa")
                // console.log(otuDescFullkxa.length);
            }

            // var data = [{
            //     values: sampleValues10,
            //     labels: otuIDs10,
            //     text: otuDesc10,
            //     type: "pie"
            // }]

            // Plotly.restyle("piePlot", "values", [sampleValues10])
            // Plotly.restyle("piePlot", "labels", [otuIDs10])

            var newTitle = {
                title: newValue + " Top 10 Samples"// updates the title
            };
            Plotly.relayout("piePlot", newTitle)
            console.log("whats in sampleValues10")
            console.log(sampleValues10)
            Plotly.restyle("piePlot","values", [sampleValues10])
            Plotly.restyle("piePlot", "labels", [otuIDs10])
            //clear the text and then use hovertext so descs are only seen in hover
            Plotly.restyle("piePlot","text",[""])
            Plotly.restyle("piePlot","hovertext",[otuDesc10])

        })

        // console.log("10");
        // console.log(otuDesc10);
        // console.log("Full")
        console.log("full list - these should be the labels on the bubbles")
        console.log(otuDescFullkxa);
        console.log("end of full list")     

        var trace1 = [{
            x: otuIDsFull,
            y: sampleValuesFull,
            // hoverinfo: "x+y+text",
            mode: 'markers',
            text: [otuDescFullkxa],
            marker: {
                size: sampleValuesFull,
                color: otuIDsFull,
                colorscale: 'Earth'
            }
            }];
            
            var layout2 = {
            title: newValue + " Sample Counts per Sample ID",
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
                // domain:sampleValuesFull,
                // range:[0,0],
                autorange:true
            },
            hovermode:"closest",
            };
            
        Plotly.newPlot('bubbleChart', trace1, layout2);

    })
}

var otuDescFull = [];

// function getDesc(dataset2){
//     console.log("in getdesc")
//     console.log(dataset2)


// }

function crazyTown(error, descriptions){
    if (typeof descriptions === "undefined"){
        // call myself?
        // wait?
        console.log("i got nothing")
    }
    else{
        console.log("got it!")
        console.log(descriptions)
        // return descriptions
        orderedDescriptions = descriptions
    }



}

function init() {

    // this takes a while to run so get it first?
    var orderedDescriptions;
    d3.json("/otu",function(error2,dataset2){
        orderedDescriptions = dataset2;

    })

    // var orderedDescriptions;
    // d3.json("/otu",crazyTown)
 
    // console.log("Did i get the desc api output?")
    // console.log(orderedDescriptions);

// function getData(id, someKindOfFunction){
    
// }

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

    // do the rest of my logic here
    // have a function that is passed the sfirst ample id returned from /names call
    // buildCharts is a fuction
    // getData(dataset[0],buildCharts)

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
        console.log("before push")
        // console.log(otuDescFullkxa)
        console.log("how is the above NOT empty?")


        // function hs(data){

        //     console.log("data: ")
        //     console.log(data)
        //     for(var o = 0;o< otuIDs10.length;o++){
        //         otuDesc10.push(data[otuIDs10[o]]);
        //     }
                    
        //     //order all of the otu descs so they match to the full data
        //     for(var o = 0;o< otuIDsFull.length;o++){
        //         otuDescFull.push(data[otuIDsFull[o]]);

        //     }
        //     return "victorious!"
        // }

        // try this: (call otu to get descriptions earlier)
        // console.log("orderedDescriptions")
        // if(orderedDescriptions.length===0){
        //     console.log("i got nothin")
        // }
        // else{
        //     console.log("not length = 0")
        // }
        // for(var o = 0;o< otuIDs10.length;o++){
        //     otuDesc10.push(orderedDescriptions[otuIDs10[o]]);
        // }
                
        // //order all of the otu descs so they match to the full data
        // for(var o = 0;o< otuIDsFull.length;o++){
        //     otuDescFull.push(orderedDescriptions[otuIDsFull[o]]);
        // }

        // //try putting this in a function
        // var otuDescFull = getDescriptions(otuIDsFull);
        // console.log("out of the function");
        // var otuDesc10 = otuDescFull.slice(0,10);
        // console.log(utoDesc10)
        // console.log(otuDdescFull)

        // try this from stackoverflow
        // if (saved_data.length > 0) {
        //     callback(null, parse(variable, saved_data)); 
        //   }
        //   else {
        //   // -------------- Begin Request New Data ------------------
        //     d3.json(" ... ", 
        //         function(data) {
        //           if (!data) return callback(new Error("unable to load data"));   
        //           saved_data = data; 
        //           // Put it here.
        //           callback(null, parse(variable, saved_data));
        //         });
        //   } 
        // var x = 0;

        // function callback(a,b){
        //     x= x + 100;
        //     console.log("x = " + x)
        //     // b is a function - but which function?
        //     // how is b called?
        // }

        // var saved_data = []

        // function orderDescriptions(saved_data){
        //     //get the top 10 otu descs in order required to match data
        //     for(var o = 0;o< otuIDs10.length;o++){
        //         otuDesc10.push(saved_data[otuIDs10[o]]);    
        //     }
                    
        //     //order all of the otu descs so they match to the full data
        //     for(var o = 0;o< otuIDsFull.length;o++){
        //         otuDescFull.push(saved_data[otuIDsFull[o]]);
        //     }   

        // }

        //   if (saved_data.length > 0) {
        //     callback(null, orderDescriptions(saved_data)); 
        //   }
        //   else {
        //   // -------------- Begin Request New Data ------------------
        //     d3.json("/otu", 
        //         function(error2,dataset2) {
        //           if (!dataset2) return callback(new Error("unable to load data"));
        //           saved_data = dataset2; 
        //           // Put it here.
        //           callback(null, orderDescriptions(saved_data));
        //         });
        //   } 


        // get the descriptions
        d3.json("/otu",function(error2,dataset2){
            // get just the descriptions for the ids in the sample set of 10
            // console.log("dataset2");
            // console.log(dataset2[1167])
            // what if i have to pass the dataset to another function?
            //i need to wait until i have dataset2!!!
            // var done = hs(dataset2);
            // console.log("if done i should have filled arrays")
            // console.log(done);

            // instead of doing somthing here, call a function to do it
            // //call back is a place holder for another function
            // buildCharts(dataset[0], dataset2)
            // callback(dataset[0],dataset2)

            for(var o = 0;o< otuIDs10.length;o++){
                // console.log("pushing this value")
                // console.log(dataset2[otuIDs10[o]])
                otuDesc10.push(dataset2[otuIDs10[o]]);
                // console.log("value of otuDesc10:")
                // console.log(otuDesc10)

            }
            // console.log(otuDesc10)
                    
            //order all of the otu descs so they match to the full data
            for(var o = 0;o< otuIDsFull.length;o++){
                // console.log(dataset2[otuIDsFull[o]});
                otuDescFull.push(dataset2[otuIDsFull[o]]);
            //     console.log(otuDescFullkxa)
            //     console.log("contents of otuDescFull");
            //     console.log("length of otuDescFullkxa")
            //     console.log(otuDescFullkxa.length);
            }

            // try doing the pie chart in here - NOPE - then i get funny pie results!
            console.log("for ahmend");
            console.log(sampleValues10);
            console.log(otuIDs10);
            console.log(otuDesc10);
            var data = [{
                values: sampleValues10,
                labels: otuIDs10,
                text: otuDesc10,
                type: "pie",
            }]
            var layout = {
                 title: defaultOptionName + " Top 10 Samples",
                height: 600,
                // width: 800 //without gauge
                width: 500
              };
    
            // //   pie chart
            Plotly.plot("piePlot",data,layout)

            var trace1 = [{
                x: otuIDsFull,
                y: sampleValuesFull,
                text: otuDescFull,
                // hoverinfo: "x+y+text",
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
                //   range:[0,0],
                  autorange:true
                },
                hovermode:"closest",
              };
             
            // console.log("waiting again")
            // wait(5000);
            // console.log(otuDescFullkxa.length)  
            // console.log("don't do this until we've waited")  
    
            Plotly.newPlot('bubbleChart', trace1, layout2);
    

        })




        // // try this promise business
        // let myFirstPromise = new Promise((resolve, reject) => {

        //     d3.json("/otu",function(error2,dataset2){
        //         // get just the descriptions for the ids in the sample set of 10
        //         // console.log("dataset2");
        //         // console.log(dataset2[1167])
        //         for(var o = 0;o< otuIDs10.length;o++){
        //             // console.log("pushing this value")
        //             // console.log(dataset2[otuIDs10[o]])
        //             otuDesc10.push(dataset2[otuIDs10[o]]);
        //             // console.log("value of otuDesc10:")
        //             // console.log(otuDesc10)
    
        //         }
        //         // console.log(otuDesc10)
                        
        //         //order all of the otu descs so they match to the full data
        //         for(var o = 0;o< otuIDsFull.length;o++){
        //             // console.log(dataset2[otuIDsFull[o]});
        //             otuDescFull.push(dataset2[otuIDsFull[o]]);
        //             // console.log(otuDescFullkxa)
        //             // console.log("contents of otuDescFull");
        //             // console.log("length of otuDescFullkxa")
        //             // console.log(otuDescFullkxa.length);
        //         }
        //         //this makes it wait?
        //         resolve("Succcess!");
        //     })
        //     // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
        //     // In this example, we use setTimeout(...) to simulate async code. 
        //     // In reality, you will probably be using something like XHR or an HTML5 API.
        //     // setTimeout(function(){
        //     //   resolve("Success!"); // Yay! Everything went well!
        //     // }, 250);
        //   });

// console.log("ahmed2");
//         console.log(sampleValues10);
//         console.log(otuIDs10);
//         console.log("do i have a value for the 10?")
//         console.log(otuDesc10);

//         var data = [{
//             values: sampleValues10,
//             labels: otuIDs10,
//             text: otuDesc10,
//             type: "pie",
//         }]
//         var layout = {
//              title: defaultOptionName + " Top 10 Samples",
//             height: 600,
//             width: 800 //without gauge
//             // width: 500 //with gauge
//           };

//         //   pie chart
//         Plotly.plot("piePlot",data,layout)

        // console.log("Full" + otuDescFull);
        // console.log("here's the sample values list and then its type")
        // console.log(sampleValuesFull)
        // console.log(typeof sampleValuesFull)
        // console.log("and the id list")
        // console.log(otuIDsFull)
        // console.log(otuDescFullkxa.length)
        // console.log("waiting")
        // wait(5000);
        // console.log(otuDescFullkxa.length)

        //should we look at max count to see if marker size should be multiplied by a factor to appear more pronounced?

        // var trace1 = [{
        //     x: otuIDsFull,
        //     y: sampleValuesFull,
        //     text: otuDescFull,
        //     // hoverinfo: "x+y+text",
        //     mode: 'markers',
        //     marker: {
        //       size: sampleValuesFull,
        //       color: otuIDsFull,
        //       colorscale: 'Earth'
        //     }
        //   }];
          
        //   var layout2 = {
        //     title: defaultOptionName + " Sample Counts per Sample ID",
        //     showlegend: false,
        //     height: 600,
        //     width: 1180, 
        //     yaxis:
        //     {

        //       titlefont:
        //       {
        //         size:12,
        //         color:"#800000"
        //       },
        //       domain:sampleValuesFull, //i have no idea how this is used or why this makes the y appear in the hover
        //     //   showgrid:false,
        //     //   showline:false,
        //     //   showticklabels:false,
        //     //   zeroline:true,
        //     //   type:"linear",
        //     //   range:[0,0],
        //       autorange:true
        //     },
        //     hovermode:"closest",
        //   };
         
        // // console.log("waiting again")
        // // wait(5000);
        // // console.log(otuDescFullkxa.length)  
        // // console.log("don't do this until we've waited")  

        // Plotly.newPlot('bubbleChart', trace1, layout2);

        // var hooray;

        // while (hooray != 'yes'){
        //     if(otuDescFull.length === 0){
        //         console.log("gotta wait")
        //         wait(1000);
        //     }
        //     else{
        //         console.log("length not zerp")
        //         Plotly.newPlot('bubbleChart', trace1, layout2);
        //         hooray = "yes";
        //     }
        // }


        // this doesn't work
        // var myPlot = document.getElementById('bubbleChart')
        // var hoverInfo = document.getElementById("hoverInfo")
        // myPlot.on('plotly_hover', function(trace1){
        //     console.log("in hover function")  
        //     var infotext = trace1.points.map(function(d){
        //         console.log("inner function")
        //         console.log(d.text+'nonesense nonsense: x= '+d.x+', y= '+d.y.toPrecision(3))
        //         return (d.text+'nonesense nonsense: x= '+d.x+', y= '+d.y.toPrecision(3)); // why is this d.data?
        //     });
        //     console.log ("infotext start")
        //     console.log(infotext.join(' '))
        //     console.log("infortext end")
        //     hoverInfo.innerHTML = infotext.join('<br>');
        // })

        // // why do we have to pass anything?!
        //  .on('plotly_unhover', function(data){
        //      console.log("out of hoverf")
        //     hoverInfo.innerHTML = '';
        // });

        // populate the metadata
        d3.json("/metadata/"+defaultOptionName,function(error2,dataset3){
            console.log(dataset3);
            datasetKeys = Object.keys(dataset3);
            for(var i = 0; i < datasetKeys.length; i++){
                var newP = document.createElement("p");
                newP.innerHTML = datasetKeys[i] + ": " + dataset3[datasetKeys[i]];
                metaList.appendChild(newP)
            }
        
    
        })

        // may as well try the gauge chart!
        // Enter a speed between 0 and 180
        //this will be the # of washings
        var level = 2 * 10; //increase it?

        // how does this work?

        // Trig to calc meter point
        var degrees = (180 - level) ,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
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
            text: level,
            hoverinfo: 'text+name'},
        { values: [50/7, 50/7, 50/7, 50/7, 50/7, 50/7, 50/7, 50],
        rotation: 90,
        // direction: "clockwise",
        text: ['6', '5', '4', '3', '2',
        '1', '0', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                'rgba(210, 206, 145, .5)', 'rgba(220, 220, 175, .5)',
                                'rgba(222, 224, 185, .5)',
                                'rgba(255, 255, 255, 0)']},
        // labels: ['9', '8', '7', '6', '5', '4', '3','2','1','0', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
        }];

        var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        // title: 'Gauge Speed 0-100',
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };

        // Plotly.newPlot('washGauge', data, layout);


    })
}

init();
