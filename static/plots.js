var sample = document.querySelector("#selDataset")
var metaList = document.querySelector("#metaList")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

        // 
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

            Plotly.restyle("piePlot", "values", sampleValues10)
            Plotly.restyle("piePlot", "labels", otuIDs10)
            Plotly.restyle("piePlot", "title", newValue)
            var layout = {
                height: 600,
                width: 800
                };
    
            //   pie chart
            // not working!
            // not supposed to use this method either - use restyle (above)
            // would need to clear first plot to do this
            // var pie = document.querySelector("#piePlot")
            // pie.innerHTML='';
            // Plotly.newPlot("piePlot",data,layout)
            // i'm not seeing this

        })

        // console.log("10");
        // console.log(otuDesc10);
        // console.log("Full")
        console.log("full list")
        console.log(otuDescFullkxa);
        console.log("end of full list")

        // var data = [{
        //     values: sampleValues10,
        //     labels: otuIDs10,
        //     text: otuDesc10,
        //     type: "pie"
        // }]
        // // var layout = {
        // //     height: 600,
        // //     width: 800
        // //     };

        // //   pie chart
        // // Plotly.newPlot("piePlot",data,layout)
        // await sleep(2000);
        // console.log("before pie plot restyling")
        // do {
        //     sleep(1000);
        //     console.log("sleeping");
        //  } while (typeof data === "undefined");

        //  console.log("did i sleep?")


        // console.log("typeof data ");
        // console.log(typeof data);
        // console.log("end typeof data")
        // // Plotly.restyle("piePlot",data)
        // Plotly.restyle("piePlot", "values", sampleValues10)
        // Plotly.restyle("piePlot", "labels", otuIDs10)
        // Plotly.restyle("piePlot", "text", otuDesc10)

        // console.log("Full" + otuDescFull);
        // console.log(sampleValuesFull)
        // console.log(otuDescFull)

        var trace1 = [{
            x: otuIDsFull,
            y: sampleValuesFull,
            text: otuDescFullkxa,
            hoverinfo: "x+y+text",
            mode: 'markers',
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
                domain:sampleValuesFull,
                range:[0,0],
                autorange:true
            },
            hovermode:"closest",
            };
            
        Plotly.newPlot('bubbleChart', trace1, layout2);

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
        var otuDescFullkxa = [];
        console.log("before push")
        console.log(otuDescFullkxa)
        console.log("how is the above NOT empty?")

        // get the descriptions
        d3.json("/otu",function(error2,dataset2){
            // get just the descriptions for the ids in the sample set of 10
            console.log("dataset2");
            console.log(dataset2[1167])
            for(var o = 0;o< otuIDs10.length;o++){
                // console.log("pushing this value")
                // console.log(dataset2[otuIDs10[o]])
                otuDesc10.push(dataset2[otuIDs10[o]]);
                // console.log("value of otuDesc10:")
                // console.log(otuDesc10)

            }
                    
            //order all of the otu descs so they match to the full data
            for(var o = 0;o< otuIDsFull.length;o++){
                // console.log(dataset2[otuIDsFull[o]});
                otuDescFullkxa.push(dataset2[otuIDsFull[o]]);
                // console.log("contents of otuDescFull");
                // console.log("length of otuDescFullkxa")
                // console.log(otuDescFullkxa.length);
            }
        })

        // console.log("10");
        // console.log(otuDesc10);
        // console.log("Full")
        console.log("full list")
        console.log(otuDescFullkxa);
        console.log("end of full list")

        var data = [{
            values: sampleValues10,
            labels: otuIDs10,
            text: otuDesc10,
            type: "pie",
        }]
        var layout = {
            title: defaultOptionName,
            height: 600,
            width: 800
          };

        //   pie chart
        Plotly.plot("piePlot",data,layout)

        // console.log("Full" + otuDescFull);
        // console.log(sampleValuesFull)
        // console.log(otuDescFull)

        //should we look at max count to see if marker size should be multiplied by a factor to appear more pronounced?

        var trace1 = [{
            x: otuIDsFull,
            y: sampleValuesFull,
            text: otuDescFullkxa,
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
              domain:sampleValuesFull,
            //   showgrid:false,
            //   showline:false,
            //   showticklabels:false,
            //   zeroline:true,
            //   type:"linear",
              range:[0,0],
              autorange:true
            },
            hovermode:"closest",
          };
          
        Plotly.newPlot('bubbleChart', trace1, layout2);


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

        // populte the metadata
        d3.json("/metadata/"+defaultOptionName,function(error2,dataset3){
            console.log(dataset3);
            datasetKeys = Object.keys(dataset3);
            for(var i = 0; i < datasetKeys.length; i++){
                var newP = document.createElement("p");
                newP.innerHTML = datasetKeys[i] + ": " + dataset3[datasetKeys[i]];
                metaList.appendChild(newP)
            }
        
    
        })


    })
}

init();
