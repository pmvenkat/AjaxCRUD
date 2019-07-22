$(document).ready(function(){
    jsreport()
    topproduct()
    productionsales()
    proddetails()
    matdetails()
$("#go").on("click",function(){
    d1=new Date($("#fromDate").val())
    d2=new Date($("#toDate").val())
    // var timeDiff = Math.abs(d1.getTime() - d2.getTime());
    // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    topproduct()
    productionsales()
})

$("#fromDate, #toDate").change(function() { 
    if(($("#fromDate").val()!="")|($("#toDate").val()!="")){
        $("#quarter").prop("disabled", "disabled");
    }else{
        $("#quarter").prop("disabled", false);
    }
});
$("#quarter").change(function() { 
    if($("#quarter").val()!="Select"){
        $("#fromDate").prop("disabled","disabled");
        $("#toDate").prop("disabled","disabled");
    }else{
        $("#fromDate").prop("disabled",false);
        $("#toDate").prop("disabled",false);
    }
});


function jsreport(){
    $.ajax({
        type:'GET',
        url:"/superuser/jc-status-chart/",
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"]){
                data=result["result"]
            }
            else if(result["error"]){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }
            
            var svg = d3.select("#svg2");
            
            var padding={top:35,right:50,bottom:50,left:50};
            var width = parseInt(svg.style("width"))-padding.left-padding.right
            var height = parseInt(svg.style("height"))-padding.top-padding.bottom
            var chartarea={
                "width":parseInt(svg.style("width"))-padding.left-padding.right,
                "height":parseInt(svg.style("height"))-padding.top-padding.bottom
            };
        for(var i=0;i<data.length;i++){
            var yScale = d3.scaleLinear()
                .domain([0,d3.max(data,function(d,i){return d.qty})])
                .range([chartarea.height,0]).nice();
            }               
            var xScale = d3.scaleBand()
                .domain(data.map(function(d){return d.status}))
                .range([0,chartarea.width])
                .padding(.2);

            var xAxis = svg.append("g")
                .classed("xAxis",true)
                .attr('transform','translate('+padding.left+','+(chartarea.height+padding.top)+')')
                .call(d3.axisBottom(xScale))
                .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-25)")
            var yAxis=svg.append("g")
                .call(d3.axisLeft(yScale).ticks(4))
                .classed("yAxis",true)
                .attr('transform','translate('+padding.left+','+padding.top+')');
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", ((padding.left)/2)-20)
                .attr("x",-120)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-family","Arial")
                .text("JobCard Count");

            var rect=svg.append("g").attr(
                'transform','translate('+ padding.left +','+ padding.top +')'
            );
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Count:</strong> <span style='color:white'>" + d.qty + "</span>";
                })
            svg.call(tip);
            var colors =  d3.schemeCategory20
            var dot=rect.selectAll("rect").data(data).enter()
                .append("rect")
                .attr("width",width)
                .attr("height",height)
            dot.transition()
                .duration(1000)
                .attr("width",xScale.bandwidth())
                .attr("height",function(d,i){
                    return chartarea.height-yScale(d.qty);
                })
                .attr("x",function (d,i){
                    return xScale(d.status);
                })
                .attr("y",function (d,i){
                    return yScale(d.qty);
                })
                dot.attr("fill",function(d,i){
                    return colors[i];
                })
                svg.append("text")
                    .attr("x", (width / 2)+50)             
                    .attr("y", (50 / 2))
                    .attr("text-anchor", "middle")  
                    .style("font-size", "14px") 
                    .style("text-decoration", "underline")  
                    .text("JobCard Status Report");
                dot.on('mouseover', tip.show)
                dot.on('mouseout', tip.hide);

                d3.selectAll("rect").on("click",function(d){
                    var a=d.status
                    var obj={
                        "rect":a
                    }
                    $.ajax({
                        type:'POST',
                        url:"/superuser/jc-excel-print/",
                        contenttype:"application/json",
                        data:JSON.stringify(obj),
                        datatype:"json",
                        success:function(results){
                            var result =JSON.parse(JSON.stringify(results))
                            if (result["result"]){
                                data=result["result"]
                                JSONToCSVConvertor(data, "JobCard Report", true);
                                function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
                                    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                                    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                                    
                                    var CSV = '';    
                                    //Set Report title in first row or line
                                    
                                    CSV += ReportTitle + '\r\n\n';
                        
                                    //This condition will generate the Label/Header
                                    if (ShowLabel) {
                                        var row = "";
                                        
                                        //This loop will extract the label from 1st index of on array
                                        for (var index in arrData[0]) {
                                            
                                            //Now convert each value to string and comma-seprated
                                            row += index + ',';
                                        }
                        
                                        row = row.slice(0, -1);
                                        
                                        //append Label row with line break
                                        CSV += row + '\r\n';
                                    }
                                    
                                    //1st loop is to extract each row
                                    for (var i = 0; i < arrData.length; i++) {
                                        var row = "";
                                        
                                        //2nd loop will extract each column and convert it in string comma-seprated
                                        for (var index in arrData[i]) {
                                            row += '"' + arrData[i][index] + '",';
                                        }
                        
                                        row.slice(0, row.length - 1);
                                        
                                        //add a line break after each row
                                        CSV += row + '\r\n';
                                    }
                        
                                    if (CSV == '') {        
                                        $.iaoAlert({
                                            msg:("Invalid data"),
                                            type: "notification",
                                            mode: "dark",
                                        });
                                        return;
                                    }   
                                    
                                    //Generate a file name
                                    var fileName = "MyReport_";
                                    //this will remove the blank-spaces from the title and replace it with an underscore
                                    fileName += ReportTitle.replace(/ /g,"_");   
                                    
                                    //Initialize file format you want csv or xls
                                    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
                                    
                                    // Now the little tricky part.
                                    // you can use either>> window.open(uri);
                                    // but this will not work in some browsers
                                    // or you will not get the correct file extension    
                                    
                                    //this trick will generate a temp <a /> tag
                                    var link = document.createElement("a");    
                                    link.href = uri;
                                    
                                    //set the visibility hidden so it will not effect on your web-layout
                                    link.style = "visibility:hidden";
                                    link.download = fileName + ".csv";
                                    
                                    //this part will append the anchor tag and remove it after automatic click
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }
                            }
                            else if(result["result"] == "empty"){
                                $.iaoAlert({
                                    msg:("JC table is empty"),
                                    type: "notification",
                                    mode: "dark",
                                });
                            }
                            else if (result["redirect"]){
                                window.location.replace(result["redirect"])
                            }

                        // JSONToCSVConvertor(data, "JobCard Report", true);
                
                        
                        }
                    });
                });
                
        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        }
    });
}

function topproduct(){
    if (($("#fromDate").val()=="") && ($("#toDate").val()=="") && ($("#quarter").val()=="Select") && ($("#products").val()=="Select")){
    $.ajax({
        type:'GET',
        url:"/superuser/top-product-list/",
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"].length > 0){
                topdata=result["result"]
            }
            else if(result["result"].length == 0){
                $.iaoAlert({
                    msg:("Table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }

            var width = 500,
                height = 240,
                radius = 80;
                colors=d3.schemeCategory10
            var arc = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);
            var arcover=d3.arc()
                .outerRadius(radius+20)
                .innerRadius(0);
            var pie = d3.pie()
                .sort(null)
                .value(function(d) {
                    return d.qty;
                });
            var svg = d3.select('#svg1').append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + ((width / 2)-100) + "," + height / 2 + ")");
            var g = svg.selectAll(".arc")
                .data(pie(topdata))
                .enter().append("g")
                .on("mouseover", function () {
                    d3.select(this).select("path").transition().attr("d", arcover).duration(200);
                    tooltip.style("display", null);
                })
                .on("mousemove", function (d) {
                    tooltip.transition().duration(200)
                        .style("opacity", 0.9);
                    tooltip.select("div").html(d.data.percentage +"%"+" <br><strong>" + d.data.productcode + "</strong>")
                        .style("position", "fixed")
                        .style("text-align", "center")
                        .style("width", "120px")
                        .style("height", "45px")
                        .style("padding", "2px")
                        .style("font", "12px sans-serif")
                        .style("background", "lightsteelblue")
                        .style("border", "0px")
                        .style("border-radius", "8px")
                        .style("left", (d3.event.pageX + 15) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none")
                    d3.select(this).select("path").transition()
                        .attr("d", arc)
                        .duration(500);
                })
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0.5);

            tooltip.append("rect")
                .attr("width", 30)
                .attr("height", 20)
                .attr("fill", "#ffffff")
                .style("opacity", 0.5);

            tooltip.append("div")
                .attr("x", 15)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "1.5em")
                .attr("font-weight", "bold");
            var legend3 = svg.selectAll('.legend3')
                .data(topdata.slice())
                .enter().append('g')
                .attr("class", "legends3")
                .attr("transform", function (d, i) {
                    {
                        return "translate(0," + i * 20 + ")"
                    }
                })
            legend3.append('rect')
                .attr("x", 180)
                .attr("y", -80)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", function (d, i) {
                    return colors[i];
                })
            legend3.append('text')
                .attr("x", 200)
                .attr("y", -70)
                .text(function (d, i) {
                    return d.percentage + '%' + '-' + d.productcode;
                })
                .attr("class", "textselected")
                .style("text-anchor", "start")
                .style("font-size", 15)
            var path=g.append("path")
                .attr("d", arc)
                .style("fill", function(d,i) {
                return colors[i];
              });
            svg.append("text")
                .attr("x", 100)             
                .attr("y", -100)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Trending Products");
            },
            
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        }

    });
}else if(($("#fromDate").val()!="") && ($("#toDate").val()!="") && ($("#quarter").val()=="Select") && ($("#products").val()=="Select")){
    d1=$("#fromDate").val()
    d2=$("#toDate").val()
    // var timeDiff = Math.abs(d1.getTime() - d2.getTime());
    // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var obj={
        "from_date":d1,
        "to_date":d2
    }
    $.ajax({
        type:'POST',
        url:"/superuser/top-product-list-post-by-days/",
        contenttype:"application/json",
        data:JSON.stringify(obj),
        datatype:'json',
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"].length > 0){
                topdata=result["result"]
            }
            else if(result["result"].length == 0){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }else if (result["error"]){
                $.iaoAlert({
                    msg:(result["error"]),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }

            d3.selectAll("#svg1 > *").remove();

            var width = 500,
                height = 240,
                radius = 80;
                colors=d3.schemeCategory20
            var arc = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);
            var arcover=d3.arc()
                .outerRadius(radius+20)
                .innerRadius(0);
            var pie = d3.pie()
                .sort(null)
                .value(function(d) {
                    return d.qty;
                });
            var svg = d3.select('#svg1').append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + ((width / 2) - 100) + "," + height / 2 + ")");
            var g = svg.selectAll(".arc")
                .data(pie(topdata))
                .enter().append("g") 
                .on("mouseover", function () {
                    d3.select(this).select("path").transition().attr("d", arcover).duration(200);
                    tooltip.style("display", null);
                })
                .on("mousemove", function (d) {
                    tooltip.transition().duration(200)
                        .style("opacity", 0.9);
                    tooltip.select("div").html(d.data.percentage + "%" + " <br><strong>" + d.data.productcode + "</strong>")
                        .style("position", "fixed")
                        .style("text-align", "center")
                        .style("width", "120px")
                        .style("height", "45px")
                        .style("padding", "2px")
                        .style("font", "12px sans-serif")
                        .style("background", "lightsteelblue")
                        .style("border", "0px")
                        .style("border-radius", "8px")
                        .style("left", (d3.event.pageX + 15) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none")
                    d3.select(this).select("path").transition()
                        .attr("d", arc)
                        .duration(500);
                })
                var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0.5);

                tooltip.append("rect")
                    .attr("width", 30)
                    .attr("height", 20)
                    .attr("fill", "#ffffff")
                    .style("opacity", 0.5);

                tooltip.append("div")
                    .attr("x", 15)
                    .attr("dy", "1.2em")
                    .style("text-anchor", "middle")
                    .attr("font-size", "1.5em")
                    .attr("font-weight", "bold");
                var legend3 = svg.selectAll('.legend3')
                    .data(topdata.slice())
                    .enter().append('g')
                    .attr("class", "legends3")
                    .attr("transform", function (d, i) {
                        {
                            return "translate(0," + i * 20 + ")"
                        }
                    })
                    legend3.append('rect')
                    .attr("x", 180)
                    .attr("y", -80)
                    .attr("width", 10)
                    .attr("height", 10)
                    .style("fill", function (d, i) {
                        return colors[i];
                    })
                    legend3.append('text')
                    .attr("x", 200)
                    .attr("y", -70)
                    .text(function (d, i) {
                        return d.percentage + '%' + '-' + d.productcode;
                    })
                    .attr("class", "textselected")
                    .style("text-anchor", "start")
                    .style("font-size", 15)
                    var path=g.append("path")
                        .attr("d", arc)
                        .style("fill", function(d,i) {
                        return colors[i];
                    });
                    
            svg.append("text")
                .attr("x", 0)             
                .attr("y", -100)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Trending Products");
        }
    });
}else if(($("#fromDate").val()=="") && ($("#toDate").val()=="") && ($("#quarter").val()!="Select") && ($("#products").val()=="Select")){
    
    var quarter=$("#quarter").val()
    var check = new Date().getMonth()
    if (quarter == "Quarter 1"){
        if ([3,4,5].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":1}
        }
    }else if(quarter=="Quarter 2"){
        if([3,4,5,6,7,8].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":2}
        }
    }else if(quarter=="Quarter 3"){
        if([3,4,5,6,7,8].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":3}
        }
    }else if(quarter=="Quarter 4"){
        if([0,3,4,5,6,7,8,9,10,11].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":4}
        }
    }
    $.ajax({
        type:'POST',
        url:"/superuser/top-product-list-post-by-quarter/",
        contenttype:"application/json",
        data:JSON.stringify(obj),
        datatype:'json',
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"] != "error"){
                topdata=result["result"]
            }
            else if(result["result"] == "error"){
                $.iaoAlert({
                    msg:("No Data in Trend Products"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }
            d3.selectAll("#svg1 > *").remove();
            var width = 500,
                height = 240,
                radius = 80;
                colors=d3.schemeCategory20
            var arc = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);
            var arcover=d3.arc()
                .outerRadius(radius+20)
                .innerRadius(0);
            var pie = d3.pie()
                .sort(null)
                .value(function(d) {
                    return d.qty;
                });
            var svg = d3.select('#svg1').append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + ((width / 2) - 100) + "," + height / 2 + ")");
            var g = svg.selectAll(".arc")
                .data(pie(topdata))
                .enter().append("g")
                .on("mouseover", function () {
                    d3.select(this).select("path").transition().attr("d", arcover).duration(200);
                    tooltip.style("display", null);
                })
                .on("mousemove", function (d) {
                    tooltip.transition().duration(200)
                        .style("opacity", 0.9);
                    tooltip.select("div").html(d.data.percentage + "%" + " <br><strong>" + d.data.productcode + "</strong>")
                        .style("position", "fixed")
                        .style("text-align", "center")
                        .style("width", "120px")
                        .style("height", "45px")
                        .style("padding", "2px")
                        .style("font", "12px sans-serif")
                        .style("background", "lightsteelblue")
                        .style("border", "0px")
                        .style("border-radius", "8px")
                        .style("left", (d3.event.pageX + 15) + "px")
                        .style("top", (d3.event.pageY - 8) + "px");
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none")
                    d3.select(this).select("path").transition()
                        .attr("d", arc)
                        .duration(500);
                })
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0.5);

            tooltip.append("rect")
                .attr("width", 30)
                .attr("height", 20)
                .attr("fill", "#ffffff")
                .style("opacity", 0.5);

            tooltip.append("div")
                .attr("x", 15)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "1.5em")
                .attr("font-weight", "bold");
            var legend3 = svg.selectAll('.legend3')
                .data(topdata.slice())
                .enter().append('g')
                .attr("class", "legends3")
                .attr("transform", function (d, i) {
                    {
                        return "translate(0," + i * 20 + ")"
                    }
                })
            legend3.append('rect')
                .attr("x", 180)
                .attr("y", -80)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", function (d, i) {
                    return colors[i];
                })
            legend3.append('text')
                .attr("x", 200)
                .attr("y", -70)
                .text(function (d, i) {
                    return d.percentage + '%' + '-' + d.productcode;
                })
                .attr("class", "textselected")
                .style("text-anchor", "start")
                .style("font-size", 15)  
            var path=g.append("path")
                .attr("d", arc)
                .style("fill", function(d,i) {
                return colors[i];
              });
            
            svg.append("text")
                .attr("x", 0)             
                .attr("y", -100)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Trending Products");
        }
    });
}else{
}
$("#svg1").on("click",function(){
    JSONToCSVConvertor(topdata, "Top Product Report", true);

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
})
}

function productionsales(){
    if (($("#fromDate").val()=="") && ($("#toDate").val()=="") && ($("#quarter").val()=="Select") && ($("#products").val()=="Select")){
    $.ajax({
        type:'GET',
        url:"/superuser/sales-production-status/",
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"].length>0){
                proddata=result["result"]
            }
            else if(result["result"].length == 0){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["error"]){
                $.iaoAlert({
                    msg:(result["error"]),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }

            var margin = {top: 23, right: 30, bottom: 60, left: 40}
            width = 565 - margin.left - margin.right
            height = 240 - margin.top - margin.bottom;
            var parseDate = d3.timeParse("%Y-%m-%d");
            var xScale = d3.scaleTime()
                .domain(d3.extent(proddata, function(d) {
                    return parseDate(d.date)
                }))
                .range([0, width]);
            var yScale = d3.scaleLinear()
                .domain([0, d3.max(proddata,function(d){return d.production})]) 
                .range([height, 0]); 
            proddata.forEach(function(d) {
                d.date = parseDate(d.date);
                d.price = +d.production;
            });
            var svg = d3.select("#svg").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var colors =  d3.schemeCategory20
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale))
                .call(transition)
            var valueline1 = d3.line()
                .x(function(d,i) { return  xScale(d.date); })
                .y(function(d) { return yScale(d.production); })
            line=svg.append("path")
                .datum(proddata)  
                .attr("class", "line")  
                .attr("d",valueline1(proddata) )
                .style("stroke","green")
                .call(transition)
                
            function transition(path) {
                path.transition()
                    .duration(3000)
                    .attrTween("stroke-dasharray", tweenDash);
            }
            function tweenDash() {
                var l = this.getTotalLength(),
                    i = d3.interpolateString("0," + l, l + "," + l);
                    return function (t) { return i(t); };
            }
            var n = 2;
                var itemWidth = 30;
                var itemHeight = 30;
                var legend = svg.selectAll(".legend")
                    .data(proddata.slice())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i)  { 
                       return "translate(" + 4%n * itemWidth + ","+Math.floor(2/n)* itemHeight+")";})
                // legend.append("rect")
                //     .attr("x", 300)
                //     .attr("y",-50)
                //     .attr("width", 10)
                //     .attr("height", 10)
                //     .attr("fill",function(d,i){
                //         return "green";
                //     });
                // legend.append("text")
                //     .attr("x", 351)
                //     .attr("y", -45)
                //     .attr("dy", ".35em")
                //     .style("text-anchor", "start")
                //     .text(function(d) { return "Production" });
            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", (50 / 2)-30)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Production Report");
            svg.selectAll("circle").data(proddata).enter()
                .append("circle")
                 .attr("cx", function(d) { return xScale(d.date); })
                 .attr("cy", function(d) { return yScale(d.production); })
                 .attr("r", function(d, i) { return 2.5; })
                 .attr("id", function(d) { return d.id; })
                 .style("fill", "black")
                 .on("mouseover", function(d){
         
            d3.select(this).transition().duration(200).style("fill", "#d30715");
         
            svg.selectAll("#tooltip").data([d]).enter().append("text")
                .attr("id", "tooltip")
                .text(function(d, i) { return d.production; })
                .attr("y", function(d) {return yScale(d.production) - 12})
                .attr("x", function(d) { return xScale(d.date); })
    
            svg.selectAll("#tooltip_path").data([d]).enter().append("line")
                .attr("id", "tooltip_path")
                .attr("class", "line")
                .attr("d", line)
                .attr("x1", function(d) {return xScale(d.date)})
                .attr("x2", function(d) {return xScale(d.date)})
                .attr("y1", height)
                .attr("y2", function(d) {return yScale(d.production)})
                .attr("stroke", "black")
                .style("stroke-dasharray", ("3, 3"));
            })
            .on("mouseout", function(d) {
            d3.select(this).transition().duration(500).style("fill", "black");
    
            svg.selectAll("#tooltip").remove();
            svg.selectAll("#tooltip_path").remove();
            });
        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        }
        });
}else if(($("#fromDate").val()!="") && ($("#toDate").val()!="") && ($("#quarter").val()=="Select") && ($("#products").val()=="Select")){
    d1=$("#fromDate").val()
    d2=$("#toDate").val()
    d1s=new Date($("#fromDate").val())
    d2s=new Date($("#toDate").val())
    var timeDiff = Math.abs(d1s.getTime() - d2s.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var obj={
        "from_date":d1,
        "to_date":d2,
        "gap":diffDays
    }
    $.ajax({
        type:'POST',
        url:"/superuser/sales-production-status-based-dates/",
        contenttype:"application/json",
        data:JSON.stringify(obj),
        datatype:"json",
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"].length > 0){
                proddata=result["result"]
            }
            else if(result["result"].length == 0){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["error"]){
                $.iaoAlert({
                    msg:(result["error"]),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }

            d3.selectAll("#svg > *").remove();
            var margin = {top: 23, right: 50, bottom: 60, left: 40}
            width = 565 - margin.left - margin.right
            height = 240 - margin.top - margin.bottom;
            var parseDate = d3.timeParse("%Y-%m-%d");
            var xScale = d3.scaleTime()
                .domain(d3.extent(proddata, function(d) {
                    return parseDate(d.date)
                }))
                .range([0, width]);
            var yScale = d3.scaleLinear()
                .domain([0, d3.max(proddata,function(d){return d.production})]) 
                .range([height, 0]); 
            proddata.forEach(function(d) {
                d.date = parseDate(d.date);
                d.price = +d.production;
            });
            var svg = d3.select("#svg").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var colors =  d3.schemeCategory20
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale))
                .call(transition)
            var valueline1 = d3.line()
                .x(function(d,i) { return  xScale(d.date); })
                .y(function(d) { return yScale(d.production); })
            line=svg.append("path")
                .datum(proddata)  
                .attr("class", "line")  
                .attr("d",valueline1(proddata) )
                .style("stroke","green")
                .call(transition)
                
            function transition(path) {
                path.transition()
                    .duration(5000)
                    .attrTween("stroke-dasharray", tweenDash);
            }
            function tweenDash() {
                var l = this.getTotalLength(),
                    i = d3.interpolateString("0," + l, l + "," + l);
                    return function (t) { return i(t); };
            }
            var n = 2;
                var itemWidth = 30;
                var itemHeight = 30;
                var legend = svg.selectAll(".legend")
                    .data(proddata.slice())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i)  { 
                       return "translate(" + 4%n * itemWidth + ","+Math.floor(2/n)* itemHeight+")";})
                // legend.append("rect")
                //     .attr("x", 320)
                //     .attr("y",-40)
                //     .attr("width", 10)
                //     .attr("height", 10)
                //     .attr("fill",function(d,i){
                //         return "green";
                //     });
                // legend.append("text")
                //     .attr("x", 331)
                //     .attr("y", -35)
                //     .attr("dy", ".35em")
                //     .style("text-anchor", "start")
                //     .text(function(d) { return "Production" });
            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", (50 / 2)-30)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Production Report");
                svg.selectAll("circle").data(proddata).enter()
                .append("circle")
                 .attr("cx", function(d) { return xScale(d.date); })
                 .attr("cy", function(d) { return yScale(d.production); })
                 .attr("r", function(d, i) { return 2.5; })
                 .attr("id", function(d) { return d.id; })
                 .style("fill", "black")
                 .on("mouseover", function(d){
         
            d3.select(this).transition().duration(200).style("fill", "#d30715");
         
            svg.selectAll("#tooltip").data([d]).enter().append("text")
                .attr("id", "tooltip")
                .text(function(d, i) { return d.production; })
                .attr("y", function(d) {return yScale(d.production) - 12})
                .attr("x", function(d) { return xScale(d.date); })
    
            svg.selectAll("#tooltip_path").data([d]).enter().append("line")
                .attr("id", "tooltip_path")
                .attr("class", "line")
                .attr("d", line)
                .attr("x1", function(d) {return xScale(d.date)})
                .attr("x2", function(d) {return xScale(d.date)})
                .attr("y1", height)
                .attr("y2", function(d) {return yScale(d.production)})
                .attr("stroke", "black")
                .style("stroke-dasharray", ("3, 3"));
            })
            .on("mouseout", function(d) {
            d3.select(this).transition().duration(500).style("fill", "black");
    
            svg.selectAll("#tooltip").remove();
            svg.selectAll("#tooltip_path").remove();
            });
        }
    });
}else if(($("#fromDate").val()=="") && ($("#toDate").val()=="") && ($("#quarter").val()!="Select") && ($("#products").val()=="Select")){
    var quarter=$("#quarter").val()
    var check = new Date().getMonth()
    if (quarter == "Quarter 1"){
        if ([3,4,5].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":1}
        }
    }else if(quarter=="Quarter 2"){
        if([3,4,5,6,7,8].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":2}
        }
    }else if(quarter=="Quarter 3"){
        if([3,4,5,6,7,8].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":3}
        }
    }else if(quarter=="Quarter 4"){
        if([0,3,4,5,6,7,8,9,10,11].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":4}
        }
    }
    $.ajax({
        type:'POST',
        url:"/superuser/sales-production-status-based-quarter/",
        contenttype:"application/json",
        data:JSON.stringify(obj),
        datatype:'json',
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"].length > 0){
                proddata=result["result"]
            }
            else if(result["result"].length == 0){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["error"]){
                $.iaoAlert({
                    msg:(result["error"]),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }
            d3.selectAll("#svg > *").remove();
            var margin = {top: 23, right: 50, bottom: 60, left: 40}
            width = 565 - margin.left - margin.right
            height = 240 - margin.top - margin.bottom;
            var parseDate = d3.timeParse("%Y-%m-%d");
            var xScale = d3.scaleTime()
                .domain(d3.extent(proddata, function(d) {
                    return parseDate(d.date)
                }))
                .range([0, width]);
            var yScale = d3.scaleLinear()
                .domain([0, d3.max(proddata,function(d){return d.production})]) 
                .range([height, 0]); 
            proddata.forEach(function(d) {
                d.date = parseDate(d.date);
                d.price = +d.production;
            });
            var svg = d3.select("#svg").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var colors =  d3.schemeCategory20
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale))
                .call(transition)
            var valueline1 = d3.line()
                .x(function(d,i) { return  xScale(d.date); })
                .y(function(d) { return yScale(d.production); })
            line=svg.append("path")
                .datum(proddata)  
                .attr("class", "line")  
                .attr("d",valueline1(proddata) )
                .style("stroke","green")
                .call(transition)
                
            function transition(path) {
                path.transition()
                    .duration(5000)
                    .attrTween("stroke-dasharray", tweenDash);
            }
            function tweenDash() {
                var l = this.getTotalLength(),
                    i = d3.interpolateString("0," + l, l + "," + l);
                    return function (t) { return i(t); };
            }
            var n = 2;
                var itemWidth = 30;
                var itemHeight = 30;
                var legend = svg.selectAll(".legend")
                    .data(proddata.slice())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i)  { 
                       return "translate(" + 4%n * itemWidth + ","+Math.floor(2/n)* itemHeight+")";})
                // legend.append("rect")
                //     .attr("x", 320)
                //     .attr("y",-40)
                //     .attr("width", 10)
                //     .attr("height", 10)
                //     .attr("fill",function(d,i){
                //         return "green";
                //     });
                // legend.append("text")
                //     .attr("x", 331)
                //     .attr("y", -35)
                //     .attr("dy", ".35em")
                //     .style("text-anchor", "start")
                //     .text(function(d) { return "Production" });
            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", (50 / 2)-30)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Production Report");
                svg.selectAll("circle").data(proddata).enter()
                .append("circle")
                 .attr("cx", function(d) { return xScale(d.date); })
                 .attr("cy", function(d) { return yScale(d.production); })
                 .attr("r", function(d, i) { return 2.5; })
                 .attr("id", function(d) { return d.id; })
                 .style("fill", "black")
                 .on("mouseover", function(d){
         
            d3.select(this).transition().duration(200).style("fill", "#d30715");
         
            svg.selectAll("#tooltip").data([d]).enter().append("text")
                .attr("id", "tooltip")
                .text(function(d, i) { return d.production; })
                .attr("y", function(d) {return yScale(d.production) - 12})
                .attr("x", function(d) { return xScale(d.date); })
    
            svg.selectAll("#tooltip_path").data([d]).enter().append("line")
                .attr("id", "tooltip_path")
                .attr("class", "line")
                .attr("d", line)
                .attr("x1", function(d) {return xScale(d.date)})
                .attr("x2", function(d) {return xScale(d.date)})
                .attr("y1", height)
                .attr("y2", function(d) {return yScale(d.production)})
                .attr("stroke", "black")
                .style("stroke-dasharray", ("3, 3"));
            })
            .on("mouseout", function(d) {
            d3.select(this).transition().duration(500).style("fill", "black");
    
            svg.selectAll("#tooltip").remove();
            svg.selectAll("#tooltip_path").remove();
            });
        }
    });
}else if(($("#fromDate").val() !="") && ($("#toDate").val()!="") && ($("#quarter").val()=="Select") && ($("#products").val()!="Select")){
    d1=$("#fromDate").val()
    d2=$("#toDate").val()
    product=$("#products").val()
    d1s=new Date($("#fromDate").val())
    d2s=new Date($("#toDate").val())
    var timeDiff = Math.abs(d1s.getTime() - d2s.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var obj={
        "from_date":d1,
        "to_date":d2,
        "gap":diffDays,
        "products":product
    }
    $.ajax({
        type:'POST',
        url:"/superuser/production-status-based-dates-and-product/",
        contenttype:"application/json",
        data:JSON.stringify(obj),
        datatype:"json",
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"].length > 0){
                data=result["result"]
            }
            else if(result["result"].length == 0){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["error"]){
                $.iaoAlert({
                    msg:(result["error"]),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }
        
            d3.selectAll("#svg > *").remove();
            var margin = {top: 23, right: 50, bottom: 60, left: 40}
            width = 565 - margin.left - margin.right
            height = 240 - margin.top - margin.bottom;
            var parseDate = d3.timeParse("%Y-%m-%d");
            var xScale = d3.scaleTime()
                .domain(d3.extent(data, function(d) {
                    return parseDate(d.date)
                }))
                .range([0, width]);
            var yScale = d3.scaleLinear()
                .domain([0, d3.max(data,function(d){return d.production})]) 
                .range([height, 0]); 
            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.price = +d.production;
            });
            var svg = d3.select("#svg").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var colors =  d3.schemeCategory20
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale))
                .call(transition)
            var valueline1 = d3.line()
                .x(function(d,i) { return  xScale(d.date); })
                .y(function(d) { return yScale(d.production); })
            line=svg.append("path")
                .datum(data)  
                .attr("class", "line")  
                .attr("d",valueline1(data) )
                .style("stroke","green")
                .call(transition)
                
            function transition(path) {
                path.transition()
                    .duration(5000)
                    .attrTween("stroke-dasharray", tweenDash);
            }
            function tweenDash() {
                var l = this.getTotalLength(),
                    i = d3.interpolateString("0," + l, l + "," + l);
                    return function (t) { return i(t); };
            }
            var n = 2;
                var itemWidth = 30;
                var itemHeight = 30;
                var legend = svg.selectAll(".legend")
                    .data(data.slice())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i)  { 
                       return "translate(" + 4%n * itemWidth + ","+Math.floor(2/n)* itemHeight+")";})
                // legend.append("rect")
                //     .attr("x", 320)
                //     .attr("y",-40)
                //     .attr("width", 10)
                //     .attr("height", 10)
                //     .attr("fill",function(d,i){
                //         return "green";
                //     });
                // legend.append("text")
                //     .attr("x", 331)
                //     .attr("y", -35)
                //     .attr("dy", ".35em")
                //     .style("text-anchor", "start")
                //     .text(function(d) { return "Production" });
            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", (50 / 2)-30)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Production Report");
                svg.selectAll("circle").data(proddata).enter()
                .append("circle")
                 .attr("cx", function(d) { return xScale(d.date); })
                 .attr("cy", function(d) { return yScale(d.production); })
                 .attr("r", function(d, i) { return 2.5; })
                 .attr("id", function(d) { return d.id; })
                 .style("fill", "black")
                 .on("mouseover", function(d){
         
            d3.select(this).transition().duration(200).style("fill", "#d30715");
         
            svg.selectAll("#tooltip").data([d]).enter().append("text")
                .attr("id", "tooltip")
                .text(function(d, i) { return d.production; })
                .attr("y", function(d) {return yScale(d.production) - 12})
                .attr("x", function(d) { return xScale(d.date); })
    
            svg.selectAll("#tooltip_path").data([d]).enter().append("line")
                .attr("id", "tooltip_path")
                .attr("class", "line")
                .attr("d", line)
                .attr("x1", function(d) {return xScale(d.date)})
                .attr("x2", function(d) {return xScale(d.date)})
                .attr("y1", height)
                .attr("y2", function(d) {return yScale(d.production)})
                .attr("stroke", "black")
                .style("stroke-dasharray", ("3, 3"));
            })
            .on("mouseout", function(d) {
            d3.select(this).transition().duration(500).style("fill", "black");
    
            svg.selectAll("#tooltip").remove();
            svg.selectAll("#tooltip_path").remove();
            });
        }
    });
}else if(($("#fromDate").val() =="") && ($("#toDate").val()=="") && ($("#quarter").val()!="Select") && ($("#products").val()!="Select")){
    var quarter=$("#quarter").val()
    var prod=$("#products").val()
    var check = new Date().getMonth()
    if (quarter == "Quarter 1"){
        if ([3,4,5].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":1,"product":prod}
        }
    }else if(quarter=="Quarter 2"){
        if([3,4,5,6,7,8].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":2,"product":prod}
        }
    }else if(quarter=="Quarter 3"){
        if([3,4,5,6,7,8].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":3,"product":prod}
        }
    }else if(quarter=="Quarter 4"){
        if([0,3,4,5,6,7,8,9,10,11].includes(check) == true){
            $.iaoAlert({
                msg:("This Quarter is NOT FINISHED YET.."),
                type: "notification",
                mode: "dark",
            });
        }else{
            var obj={"q":4,"product":prod}
        }
    }
    $.ajax({
        type:'POST',
        url:"/superuser/production-status-based-quarter-and-product/",
        contenttype:"application/json",
        data:JSON.stringify(obj),
        datatype:'json',
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"].length > 0){
                proddata=result["result"]
            }
            else if(result["result"].length == 0){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["error"]){
                $.iaoAlert({
                    msg:(result["error"]),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }
            d3.selectAll("#svg > *").remove();
            var margin = {top: 23, right: 50, bottom: 60, left: 40}
            width = 565 - margin.left - margin.right
            height = 240 - margin.top - margin.bottom;
            var parseDate = d3.timeParse("%Y-%m-%d");
            var xScale = d3.scaleTime()
                .domain(d3.extent(proddata, function(d) {
                    return parseDate(d.date)
                }))
                .range([0, width]);
            var yScale = d3.scaleLinear()
                .domain([0, d3.max(proddata,function(d){return d.production})]) 
                .range([height, 0]); 
            proddata.forEach(function(d) {
                d.date = parseDate(d.date);
                d.price = +d.production;
            });
            var svg = d3.select("#svg").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var colors =  d3.schemeCategory20
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale))
                .call(transition)
            var valueline1 = d3.line()
                .x(function(d,i) { return  xScale(d.date); })
                .y(function(d) { return yScale(d.production); })
            line=svg.append("path")
                .datum(proddata)  
                .attr("class", "line")  
                .attr("d",valueline1(proddata) )
                .style("stroke","green")
                .call(transition)
                
            function transition(path) {
                path.transition()
                    .duration(5000)
                    .attrTween("stroke-dasharray", tweenDash);
            }
            function tweenDash() {
                var l = this.getTotalLength(),
                    i = d3.interpolateString("0," + l, l + "," + l);
                    return function (t) { return i(t); };
            }
            var n = 2;
                var itemWidth = 30;
                var itemHeight = 30;
                var legend = svg.selectAll(".legend")
                    .data(proddata.slice())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i)  { 
                       return "translate(" + 4%n * itemWidth + ","+Math.floor(2/n)* itemHeight+")";})
                // legend.append("rect")
                //     .attr("x", 320)
                //     .attr("y",-40)
                //     .attr("width", 10)
                //     .attr("height", 10)
                //     .attr("fill",function(d,i){
                //         return "green";
                //     });
                // legend.append("text")
                //     .attr("x", 331)
                //     .attr("y", -35)
                //     .attr("dy", ".35em")
                //     .style("text-anchor", "start")
                //     .text(function(d) { return "Production" });
            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", (50 / 2)-30)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Production Report");
                svg.selectAll("circle").data(proddata).enter()
                .append("circle")
                 .attr("cx", function(d) { return xScale(d.date); })
                 .attr("cy", function(d) { return yScale(d.production); })
                 .attr("r", function(d, i) { return 2.5; })
                 .attr("id", function(d) { return d.id; })
                 .style("fill", "black")
                 .on("mouseover", function(d){
         
            d3.select(this).transition().duration(200).style("fill", "#d30715");
         
            svg.selectAll("#tooltip").data([d]).enter().append("text")
                .attr("id", "tooltip")
                .text(function(d, i) { return d.production; })
                .attr("y", function(d) {return yScale(d.production) - 12})
                .attr("x", function(d) { return xScale(d.date); })
    
            svg.selectAll("#tooltip_path").data([d]).enter().append("line")
                .attr("id", "tooltip_path")
                .attr("class", "line")
                .attr("d", line)
                .attr("x1", function(d) {return xScale(d.date)})
                .attr("x2", function(d) {return xScale(d.date)})
                .attr("y1", height)
                .attr("y2", function(d) {return yScale(d.production)})
                .attr("stroke", "black")
                .style("stroke-dasharray", ("3, 3"));
            })
            .on("mouseout", function(d) {
            d3.select(this).transition().duration(500).style("fill", "black");
    
            svg.selectAll("#tooltip").remove();
            svg.selectAll("#tooltip_path").remove();
            });
        }
    });
}
$("#svg").on("click",function(){
    JSONToCSVConvertor(proddata, "Production Report", true);

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
})
}

function proddetails(){
    $.ajax({
        type:'GET',
        url:"/superuser/product-status/",
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"] != "empty"){
                var data=result["result"]
            }
            else if(result["result"] == "empty"){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }
            
            var width = 325,
                height = 300;
                colors=d3.schemeCategory10
            var svg = d3.select("#svg3").append("svg")
                .attr("width", width)
                .attr("height", height)
            svg.append("text")
                .attr("x", 165)             
                .attr("y", 15)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Product Details");
            var elem = svg.selectAll("g")
                .data(data)
            var elemEnter1 = elem.enter()
                .append("g")
                .attr("transform", function(d){return "translate("+d.x1+","+d.y1+")"})
            elemEnter1.append("rect")
                .attr("width",140)
                .attr("height",80)
                .attr("stroke",function(d,i){
                    return colors[i];
                })
                .attr("stroke-width",.5 )
                .attr("fill", "white")
            var elemEnter = elem.enter()
                .append("g")
                .attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
            elemEnter.append("text")
                .attr("dx", function(d){return 50})
                .style("font-size", "21px")
                .style("font-family","Ariel")
                .attr("dx", "-.30em")
                .attr("dy", ".30em")
                .style('fill', function(d,i){
                    return colors[i];
                })
                .text(function(d){return d.value})
            var elemEnter2 = elem.enter()
                .append("g")
                .attr("transform", function(d){return "translate("+d.x2+","+d.y2+")"})
            elemEnter2.append("text")
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .text(function(d){return d.text})
            svg.selectAll("rect").on("click",function(d){
                var a=d.text
                var obj={
                    "rect":a
                }
                $.ajax({
                    type:'POST',
                    url:"/superuser/product-excel-print/",
                    contenttype:"application/json",
                    data:JSON.stringify(obj),
                    datatype:"json",
                    success:function(results){
                        var result =JSON.parse(JSON.stringify(results))
                        if (result["result"]){
                            data=result["result"]
                            JSONToCSVConvertor(data, "Products Report", true);
                            function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
                                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                                
                                var CSV = '';    
                                //Set Report title in first row or line
                                
                                CSV += ReportTitle + '\r\n\n';
                    
                                //This condition will generate the Label/Header
                                if (ShowLabel) {
                                    var row = "";
                                    
                                    //This loop will extract the label from 1st index of on array
                                    for (var index in arrData[0]) {
                                        
                                        //Now convert each value to string and comma-seprated
                                        row += index + ',';
                                    }
                    
                                    row = row.slice(0, -1);
                                    
                                    //append Label row with line break
                                    CSV += row + '\r\n';
                                }
                                
                                //1st loop is to extract each row
                                for (var i = 0; i < arrData.length; i++) {
                                    var row = "";
                                    
                                    //2nd loop will extract each column and convert it in string comma-seprated
                                    for (var index in arrData[i]) {
                                        row += '"' + arrData[i][index] + '",';
                                    }
                    
                                    row.slice(0, row.length - 1);
                                    
                                    //add a line break after each row
                                    CSV += row + '\r\n';
                                }
                    
                                if (CSV == '') {        
                                    alert("Invalid data");
                                    return;
                                }   
                                
                                //Generate a file name
                                var fileName = "MyReport_";
                                //this will remove the blank-spaces from the title and replace it with an underscore
                                fileName += ReportTitle.replace(/ /g,"_");   
                                
                                //Initialize file format you want csv or xls
                                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
                                
                                // Now the little tricky part.
                                // you can use either>> window.open(uri);
                                // but this will not work in some browsers
                                // or you will not get the correct file extension    
                                
                                //this trick will generate a temp <a /> tag
                                var link = document.createElement("a");    
                                link.href = uri;
                                
                                //set the visibility hidden so it will not effect on your web-layout
                                link.style = "visibility:hidden";
                                link.download = fileName + ".csv";
                                
                                //this part will append the anchor tag and remove it after automatic click
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        }
                        else if(result["result"] == "empty"){
                            $.iaoAlert({
                                msg:("JC table is empty"),
                                type: "notification",
                                mode: "dark",
                            });
                        }
                        else if (result["redirect"]){
                            window.location.replace(result["redirect"])
                        }
                    }
                });   
            })
        }
    });
}

function matdetails(){
    $.ajax({
        type:'GET',
        url:"/superuser/material-status/",
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"] != "empty"){
                data=result["result"]
            }
            else if(result["result"] == "empty"){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }
            
            var width = 300,
                height = 300;
                colors=d3.schemeDark2
            var svg = d3.select("#svg4").append("svg")
                .attr("width", width)
                .attr("height", height)
            svg.append("text")
                .attr("x", 80)             
                .attr("y", 15)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .style("text-decoration", "underline")  
                .text("Material Details");
            var elem = svg.selectAll("g")
                .data(data)
            var elemEnter1 = elem.enter()
                .append("g")
                .attr("transform", function(d){return "translate("+d.x1+","+d.y1+")"})
            elemEnter1.append("rect")
                .attr("width",130)
                .attr("height",55)
                .attr("stroke",function(d,i){
                    return colors[i];
                })
                .attr("stroke-width",.5 )
                .attr("fill", "white")
            var elemEnter = elem.enter()
                .append("g")
                .attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
            elemEnter.append("text")
                .attr("dx", function(d){return -20})
                .style("font-size", "21px")
                .style("font-family", "Ariel")
                .attr("dx", "-.30em")
                .attr("dy", ".30em")
                .style('fill', function(d,i){
                    return colors[i];
                })
                .text(function(d){return d.value})
            var elemEnter2 = elem.enter()
                .append("g")
                .attr("transform", function(d){return "translate("+d.x2+","+d.y2+")"})
            elemEnter2.append("text")
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .text(function(d){return d.text})
            svg.selectAll("rect").on("click",function(d){
                var a=d.text
                var obj={
                    "rect":a
                }
                $.ajax({
                    type:'POST',
                    url:"/superuser/material-excel-print/",
                    contenttype:"application/json",
                    data:JSON.stringify(obj),
                    datatype:"json",
                    success:function(results){
                        var result =JSON.parse(JSON.stringify(results))
                        if (result["result"]){
                            data=result["result"]
                            JSONToCSVConvertor(data, "Materials Report", true);
                            function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
                                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                                
                                var CSV = '';    
                                //Set Report title in first row or line
                                
                                CSV += ReportTitle + '\r\n\n';
                    
                                //This condition will generate the Label/Header
                                if (ShowLabel) {
                                    var row = "";
                                    
                                    //This loop will extract the label from 1st index of on array
                                    for (var index in arrData[0]) {
                                        
                                        //Now convert each value to string and comma-seprated
                                        row += index + ',';
                                    }
                    
                                    row = row.slice(0, -1);
                                    
                                    //append Label row with line break
                                    CSV += row + '\r\n';
                                }
                                
                                //1st loop is to extract each row
                                for (var i = 0; i < arrData.length; i++) {
                                    var row = "";
                                    
                                    //2nd loop will extract each column and convert it in string comma-seprated
                                    for (var index in arrData[i]) {
                                        row += '"' + arrData[i][index] + '",';
                                    }
                    
                                    row.slice(0, row.length - 1);
                                    
                                    //add a line break after each row
                                    CSV += row + '\r\n';
                                }
                    
                                if (CSV == '') {        
                                    alert("Invalid data");
                                    return;
                                }   
                                
                                //Generate a file name
                                var fileName = "MyReport_";
                                //this will remove the blank-spaces from the title and replace it with an underscore
                                fileName += ReportTitle.replace(/ /g,"_");   
                                
                                //Initialize file format you want csv or xls
                                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
                                
                                // Now the little tricky part.
                                // you can use either>> window.open(uri);
                                // but this will not work in some browsers
                                // or you will not get the correct file extension    
                                
                                //this trick will generate a temp <a /> tag
                                var link = document.createElement("a");    
                                link.href = uri;
                                
                                //set the visibility hidden so it will not effect on your web-layout
                                link.style = "visibility:hidden";
                                link.download = fileName + ".csv";
                                
                                //this part will append the anchor tag and remove it after automatic click
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        }
                        else if(result["result"] == "empty"){
                            $.iaoAlert({
                                msg:("JC table is empty"),
                                type: "notification",
                                mode: "dark",
                            });
                        }
                        else if (result["redirect"]){
                            window.location.replace(result["redirect"])
                        }
                    }
                });   
            })
        }
    });
}

function jsreports(){
    $.ajax({
        type:'GET',
        url:"/superuser/jc-status-chart/",
        success:function(results){
            var result =JSON.parse(JSON.stringify(results))
            if (result["result"] != "empty"){
                data=result["result"]
            }
            else if(result["result"] == "empty"){
                $.iaoAlert({
                    msg:("JC table is empty"),
                    type: "notification",
                    mode: "dark",
                });
            }
            else if (result["redirect"]){
                window.location.replace(result["redirect"])
            }

            var width = 500,
                height = 300;
                colors=d3.schemeCategory10
            var svg = d3.select("#svg2").append("svg")
                .attr("width", width)
                .attr("height", height)
            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", (50 / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                .text("JobCard Status Report");
            var elem = svg.selectAll("g")
                .data(data)
            var elemEnter2 = elem.enter()
                .append("g")
                .attr("transform", function(d){return "translate("+d.x2+","+d.y2+")"})
            elemEnter2.append("rect")
                .attr("width",140)
                .attr("height",70)
                .attr("stroke",function(d,i){
                    return colors[i];
                })
                .attr("fill", "white")
            var elemEnter = elem.enter()
                .append("g")
                .attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
            elemEnter.append("text")
                .attr("dx", function(d){return 50})
                .style("font-size", "21px")
                .style("font-family","Ariel")
                .attr("dx", "-.30em")
                .attr("dy", ".30em")
                .style('fill', function(d,i){
                    return colors[i];
                })
                .text(function(d){return d.qty})
            var elemEnter1 = elem.enter()
                .append("g")
                .attr("transform", function(d){return "translate("+d.x1+","+d.y1+")"})
            elemEnter1.append("text")
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .text(function(d){ return d.status+" :"});
            svg.selectAll("rect").on("click",function(d){
                    var a=d.status
                    var obj={
                        "rect":a
                    }
                    $.ajax({
                        type:'POST',
                        url:"/superuser/jc-excel-print/",
                        contenttype:"application/json",
                        data:JSON.stringify(obj),
                        datatype:"json",
                        success:function(results){
                            var result =JSON.parse(JSON.stringify(results))
                            if (result["result"]){
                                data=result["result"]
                                JSONToCSVConvertor(data, "JobCard Report", true);
                                function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
                                    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                                    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                                    
                                    var CSV = '';    
                                    //Set Report title in first row or line
                                    
                                    CSV += ReportTitle + '\r\n\n';
                        
                                    //This condition will generate the Label/Header
                                    if (ShowLabel) {
                                        var row = "";
                                        
                                        //This loop will extract the label from 1st index of on array
                                        for (var index in arrData[0]) {
                                            
                                            //Now convert each value to string and comma-seprated
                                            row += index + ',';
                                        }
                        
                                        row = row.slice(0, -1);
                                        
                                        //append Label row with line break
                                        CSV += row + '\r\n';
                                    }
                                    
                                    //1st loop is to extract each row
                                    for (var i = 0; i < arrData.length; i++) {
                                        var row = "";
                                        
                                        //2nd loop will extract each column and convert it in string comma-seprated
                                        for (var index in arrData[i]) {
                                            row += '"' + arrData[i][index] + '",';
                                        }
                        
                                        row.slice(0, row.length - 1);
                                        
                                        //add a line break after each row
                                        CSV += row + '\r\n';
                                    }
                        
                                    if (CSV == '') {        
                                        alert("Invalid data");
                                        return;
                                    }   
                                    
                                    //Generate a file name
                                    var fileName = "MyReport_";
                                    //this will remove the blank-spaces from the title and replace it with an underscore
                                    fileName += ReportTitle.replace(/ /g,"_");   
                                    
                                    //Initialize file format you want csv or xls
                                    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
                                    
                                    // Now the little tricky part.
                                    // you can use either>> window.open(uri);
                                    // but this will not work in some browsers
                                    // or you will not get the correct file extension    
                                    
                                    //this trick will generate a temp <a /> tag
                                    var link = document.createElement("a");    
                                    link.href = uri;
                                    
                                    //set the visibility hidden so it will not effect on your web-layout
                                    link.style = "visibility:hidden";
                                    link.download = fileName + ".csv";
                                    
                                    //this part will append the anchor tag and remove it after automatic click
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }
                            }
                            else if(result["result"] == "empty"){
                                $.iaoAlert({
                                    msg:("JC table is empty"),
                                    type: "notification",
                                    mode: "dark",
                                });
                            }
                            else if (result["redirect"]){
                                window.location.replace(result["redirect"])
                            }
                        }
                    });            
            })    
        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        }
    });
}

$.ajax({
    type:'GET',
    url:"/superuser/get-products/",
    success:function(results){
        var result =JSON.parse(JSON.stringify(results))
        var $ddl = $("select[id=products]");
        var len = result["result"].length
        for(i=0;i<len;i++){
            $ddl.append("<option >"+result["result"][i]['itemcode']+ "</option>");
        }  
    }
});

});