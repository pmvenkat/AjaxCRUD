$(document).ready(function(){

    var id;
    var name;
    var start = 1;
    var x=1;
    initiate(1);
    
    function initiate(start){
        $('.scroll-table').scrollTop(0);
        $.ajax({
            type:'GET',
            url:"/superuser/customer-details-show/?page="+start,
            success:function(results){
                var result =JSON.parse(JSON.stringify(results))
                if (result["result"]){
                    len=result['result'][0].length
                    $('#customer_details_tbody').empty()
                    if (len>0){
                        a=result["result"]
                       
                        for (i=0;i<len;i++){                 
                            var _tr='<tr> <td style="display:none">'+a[0][i]['customer_id']+'</td>\
                                        <td >'+a[0][i]['customer_name']+'</td>\
                                        <td>'+a[1][i]['contact_person']+'</td>\
                                        <td>'+a[1][i]['mobile_number']+'</td>\
                                        <td>'+a[1][i]['email']+'</td>\
                                        <td>'+a[1][i]['customer_remarks']+'</td>\
                                    </tr>'
                            $('#customer_details_tbody').append(_tr);
                        }
                    }
                    else{
                        $.iaoAlert({
                            msg:("Customer Details Data is Empty"),
                            type: "notification",
                            mode: "dark",
                        });
    
                    }
                }
                else if(result["error"]){
                    $.iaoAlert({
                        msg:(result["error"]),
                        type: "error",
                        mode: "dark",
                    });
                }
                else if (result["redirect"]){
                    window.location.replace(result["redirect"])
                }
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
                $.iaoAlert({
                    msg:(msg),
                    type: "error",
                    mode: "dark",
                });
            }
    
        });
    }
   

    $("#customer_add").on("click",function(){
        $("#add_user").modal({action:'show', backdrop: 'static', keyboard: false});
        $(".content-wrapper").addClass("after_modal_appended");
        $('.modal-backdrop').appendTo('.content-wrapper');   
        $('body').removeClass("modal-open");
        $('body').css("padding-right","");  
    });


    $("#submit").click(function(){
        
        customer_name = $("#customer_name").val();
        address_type = $('#address_type').val();
        street = $("#street").val();
        city=$("#city").val();
        zipcode=$("#zipcode").val();
        state  =$("#state").val();
        country =$("#country").val();
        contact_person=$("#contact_person").val();
        mobile_number=$("#mobile_number").val();
        office_landline_number=$("#office_landline_number").val();
        email =$("#email").val();
        website =$("#website").val();
        gst_no =   $("#gst_no").val();
        tinpan_no  =  $("#tinpan_no").val();
        shipping =$("#shipping").val();
        remarks=  $("#remarks").val();
        count = 0;

        if (customer_name == "") {
            $("#customer_name").css("border", "1px solid rgba(248, 0, 0, 0.6)");
            $("#customer_name").on("click", function () {
                $("#customer_name").css("border", "1px solid #dddddd");
            })
        }
        else {
            count++;
        }

        if (address_type == "") {
            $("#address_type").css("border", "1px solid rgba(248, 0, 0, 0.6)");
            $("#address_type").on("click", function () {
                $("#address_type").css("border", "1px solid #dddddd");
            })
        }
        else {
            count++;
        }

            if (street == "") {
                $("#street").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#street").on("click", function () {
                    $("#street").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }

            if (city == "") {
                $("#city").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#city").on("click", function () {
                    $("#city").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }

            if (zipcode == "") {
                $("#zipcode").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#zipcode").on("click", function () {
                    $("#zipcode").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }

            if (state == "") {
                $("#state").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#state").on("click", function () {
                    $("#state").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }

            if (country == "") {
                $("#country").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#country").on("click", function () {
                    $("#country").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }

            if (contact_person == "") {
                $("#contact_person").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#contact_person").on("click", function () {
                    $("#contact_person").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }

            // var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

            if (mobile_number != "") {
                if (mobile_number.length == 10) {
                    count++
                }
                else if (mobile_number.length != 10) {
                    $("#mobile_number").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                    $("#mobile_number").on("click", function () {
                        $("#mobile_number").css("border", "1px solid #dddddd");
                    })
                }
            }
            else {
                $("#mobile_number").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#mobile_number").on("click", function () {
                    $("#mobile_number").css("border", "1px solid #dddddd");
                })
            }

            if (office_landline_number != "") {
                if (office_landline_number.length != 10) {
                    count++
                }
                else if (office_landline_number.length != 10) {
                    $("#office_landline_number").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                    $("#office_landline_number").on("click", function () {
                        $("#office_landline_number").css("border", "1px solid #dddddd");
                    })
                }
            }
            else {
                $("#office_landline_number").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#office_landline_number").on("click", function () {
                    $("#office_landline_number").css("border", "1px solid #dddddd");
                })
            }

            if (email == "") {
                $("#email").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#email").on("click", function () {
                    $("#email").css("border", "1px solid #dddddd");
                })
            }
            else {
                var regex_mail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (regex_mail.test(email)) {
                    count++;
                }
                else {
                    $("#email").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                    $("#email").on("click", function () {
                        $("#email").css("border", "1px solid #dddddd");
                    })
                }
            }


            if (website == "") {
                $("#website").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#website").on("click", function () {
                    $("#website").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }
 

            if (shipping == "") {
                $("#shipping").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#shipping").on("click", function () {
                    $("#shipping").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }

            if (gst_no != "") {
                if (gst_no.length == 15) {
                    count++
                }
                else if (gst_no.length != 15) {
                    $("#gst_no").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                    $("#gst_no").on("click", function () {
                        $("#gst_no").css("border", "1px solid #dddddd");
                    })
                }
            }
            else {
                $("#gst_no").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#gst_no").on("click", function () {
                    $("#gst_no").css("border", "1px solid #dddddd");
                })
            }

            if (tinpan_no == "") {
                $("#tinpan_no").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#tinpan_no").on("click", function () {
                    $("#tinpan_no").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }

            if (remarks == "") {
                $("#remarks").css("border", "1px solid rgba(248, 0, 0, 0.6)");
                $("#remarks").on("click", function () {
                    $("#remarks").css("border", "1px solid #dddddd");
                })
            }
            else {
                count++;
            }
if(count==16){
        var obj={"customer_name":$("#customer_name").val(),
                "address_type":$("#address_type").val(),
                "street":$("#street").val(),
                "city":$("#city").val(),
                "zipcode":$("#zipcode").val(), 
                "state":$("#state").val(),
                "country":$("#country").val(),
                "contact_person":$("#contact_person").val(),
                "mobile_number":"+91"+$("#mobile_number").val(),
                "land_line_number":$("#office_landline_number").val(),
                "email":$("#email").val(),
                "website":$("#website").val(),
                "shipping":$("#shipping").val(),
                "gst_no":$("#gst_no").val(),
                "gst_prcntg":$("#gst_prcntg").val(),
                "tinpan_number":$("#tinpan_no").val(),
                "customer_remarks":$("#remarks").val(),
                };
                
        $.ajax({
            type:'POST',
            url:"/superuser/customer-details-insert/",
            contentType:'application/json',
            data:JSON.stringify(obj),
            dataType:'json',
            success:function(results){
                var result =JSON.parse(JSON.stringify(results))
                if (result["result"]){                       
                    $.iaoAlert({
                        msg:("Customer Details Inserted Successfully..!"),
                        type: "success",
                        mode: "dark",
                    });   
                    $("#cancel").click();
                    $('#add_user').modal('toggle');  
                    initiate(1)
                    x=1
                    start =1
                }
                else if (result["error"]){
                    $.iaoAlert({
                        msg:(result["error"]),
                        type: "error",
                        mode: "dark",
                    });
                }
                else if(result["redirect"]){
                    window.location.replace(result["redirect"])
                }
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
                $.iaoAlert({
                    msg:(msg),
                    type: "error",
                    mode: "dark",
                })
            }
        });
    }
    else{
        $.iaoAlert({
            msg:("please fill the all mandatory fields!"),
            type: "error",
            mode: "dark",
        });
    }
    });


    $("#customer_details_tbody").on('click',"tr", function () {
        $('.selected').removeClass('selected');
        $(this).addClass("selected");
        id  = $('td:eq(0)',this).html();
        name = $('td:eq(1)',this).html();
    });


    $("#customer_edit").click(function(){
        var customer_id=id;
        if (customer_id == undefined){
            $.iaoAlert({
                msg:("Please Select the Customer.."),
                type: "warning",
                mode: "dark",
            });     
        }
        else{
            editUserModelOpen()
        }
    });

    function editUserModelOpen(){
        var customer_id=id;
        var obj={"customer_id":customer_id};
        $.ajax({
            type:'POST',
            url:"/superuser/customer-details-get-for-edit/",
            contentType:'application/json',
            data:JSON.stringify(obj),
            dataType:'json',
            success:function(results){
                var result =JSON.parse(JSON.stringify(results))
                if (result["result"]){
                    $("#edit_user").modal({action:'show', backdrop: 'static', keyboard: false});
                    $(".content-wrapper").addClass("after_modal_appended");
                    $('.modal-backdrop').appendTo('.content-wrapper');   
                    $('body').removeClass("modal-open");
                    $('body').css("padding-right","");
                    
                    data=result["result"]
                    $("#edit_customer_no").val(data[0]["customer_id"]);
                    $("#edit_customer_name").val(data[0]["customer_name"]);
                    $("#edit_address_type option").each(function() {
                        if($(this).val() == data[1][0]["address_type"]) {
                            $(this).attr('selected', 'selected');            
                        }                        
                    });
                    $("#edit_street").val(data[1][0]["street"]);
                    $("#edit_city").val(data[1][0]["city"]);
                    $("#edit_zipcode").val(data[1][0]["zipcode"]);
                    $("#edit_state").val(data[1][0]["state"]);
                    $("#edit_country").val(data[1][0]["country"]);
                    $("#edit_contact_person").val(data[1][0]["contact_person"]);
                    $("#edit_mobile_number").val(data[1][0]["mobile_number"].slice(3));
                    $("#edit_office_landline_number").val(data[1][0]["landline_number"]);
                    $("#edit_email").val(data[1][0]["email"]);
                    $("#edit_website").val(data[1][0]["website"]);
                    $("#edit_shipping").val(data[1][0]["shipping"]);
                    $("#edit_gst_no").val(data[0]["gst_no"]);
                    $("#edit_tinpan_no").val(data[0]["tinpan_number"]);
                    $("#edit_remarks").val(data[1][0]["customer_remarks"]);

                }
                else if (result["error"]) {
                    $.iaoAlert({
                        msg:(result["error"]),
                        type: "error",
                        mode: "dark",
                    });
                }
                else if(result["redirect"]) {
                    window.location.replace(result["redirect"])
                }                    
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
                $.iaoAlert({
                    msg:(msg),
                    type: "error",
                    mode: "dark",
                });
            }
        });
    }

    
    $("#update").click(function(){
        var obj={"customer_name":$("#edit_customer_name").val(),
                    "customer_id":$("#edit_customer_no").val(),
                    "address_type":$("#edit_address_type").val(),
                    "street":$("#edit_street").val(),
                    "city":$("#edit_city").val(),
                    "zipcode":$("#edit_zipcode").val(), 
                    "state":$("#edit_state").val(),
                    "country":$("#edit_country").val(),
                    "contact_person":$("#edit_contact_person").val(),
                    "mobile_number":"+91"+$("#edit_mobile_number").val(),
                    "land_line_number":$("#edit_office_landline_number").val(),
                    "email":$("#edit_email").val(),
                    "website":$("#edit_website").val(),
                    "shipping":$("#edit_shipping").val(),
                    "gst_no":$("#edit_gst_no").val(),
                    "gst_prcntg":$("#edit_gst_prcntg").val(),
                    "tinpan_number":$("#edit_tinpan_no").val(),
                    "customer_remarks":$("#edit_remarks").val(),
                };
        
        $.ajax({
            type:'PUT',
            url:"/superuser/customers-details-update/",
            contentType:'application/json',
            data:JSON.stringify(obj),
            dataType:'json',
            success:function(results){
                var result =JSON.parse(JSON.stringify(results))
                if (result["result"]){
                    $.iaoAlert({
                        msg:("Customer Details Updated Successfully..!"),
                        type: "success",
                        mode: "dark",
                    }); 
                    $('#edit_user').modal('toggle');
                    id = undefined 
                    x=1
                    start =1
                    initiate(1)

                }else if(result["redirect"]){
                    window.location.replace(result["redirect"])
                }
                else if(result["error"]){
                    $.iaoAlert({
                        msg:(result["error"]),
                        type: "error",
                        mode: "dark",
                    });
                }
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
                $.iaoAlert({
                    msg:(msg),
                    type: "error",
                    mode: "dark",
                });
            }
        });
    });


    $("#customer_delete").click(function(){
        var delete_id=id;
        if (delete_id == undefined){
            $.iaoAlert({
                msg:("Please Select the Customer.."),
                type: "warning",
                mode: "dark",
            });     
        }
        else{
            deleteUserModelOpen()
        }
    });


    function deleteUserModelOpen(){
        var delete_name = name;
        $("#delete_user").modal({action:'show', backdrop: 'static', keyboard: false});
        $(".content-wrapper").addClass("after_modal_appended");
        $('.modal-backdrop').appendTo('.content-wrapper');   
        $('body').removeClass("modal-open");
        $('body').css("padding-right","");  
        $("#delete_customer_name").html(delete_name.toUpperCase())
    }


    $("#yesDelete").click(function(){
        var delete_id=id;
        var obj={"customer_id":delete_id}
        $.ajax({
            type:'DELETE',
            url:"/superuser/customer-details-delete/",
            contentType:'application/json',
            data:JSON.stringify(obj),
            dataType:'json',
            success:function(results){
                var result =JSON.parse(JSON.stringify(results))
                if (result["result"]){
                    $.iaoAlert({
                        msg:("Customer deleted Successfully..!"),
                        type: "success",
                        mode: "dark",
                    });    
                    $('#delete_user').modal('toggle');
                    id = undefined
                    x=1
                    start =1
                    initiate(1)

                }
                else if(result["error"]){
                    $.iaoAlert({
                        msg:(result["error"]),
                        type: "error",
                        mode: "dark",
                    });
                }
                else if(result["redirect"]){
                    window.location.replace(result["redirect"])
                }
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
                $.iaoAlert({
                    msg:(msg),
                    type: "error",
                    mode: "dark",
                });
            }
        });  
    });
    

    $("#refresh").on('click',function(){
        x=1
        start =1
        initiate(1);
        $("#search").val("");
    });


    $("#search").on("keyup", function() {
        if ($(this).val() != ""){
            start = 1
            x=1
            $('.scroll-table').scrollTop(0);
            var obj = {"searching_word":$(this).val()}
            $.ajax({
                type:'POST',
                url:"/superuser/customer-details-search/?page="+start,
                contentType:'application/json',
                data:JSON.stringify(obj),
                dataType:'json',
                success:function(results){
                    var result =JSON.parse(JSON.stringify(results))
                    if (result["result"]){
                        len=result['result'].length
                        a=result["result"]
                        $('#customer_details_tbody').empty();
                        for (i=0;i<len;i++){                 
                            var _tr='<tr> <td style="display:none">'+a[i]['customer_id']+'</td>\
                                        <td >'+a[i]['customer_name']+'</td>\
                                        <td>'+a[i]['cust_id__contact_person']+'</td>\
                                        <td>'+a[i]['cust_id__mobile_number']+'</td>\
                                        <td>'+a[i]['cust_id__email']+'</td>\
                                        <td>'+a[i]['cust_id__customer_remarks']+'</td>\
                                    </tr>'
                            $('#customer_details_tbody').append(_tr);
                        }
                    }
                    else if(result["error"]){
                        $.iaoAlert({
                            msg:(result["error"]),
                            type: "error",
                            mode: "dark",
                        });
                    }
                    else if (result["redirect"]){
                        window.location.replace(result["redirect"])
                    }
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
                    $.iaoAlert({
                        msg:(msg),
                        type: "error",
                        mode: "dark",
                    });
                }
            });
        }
        else{
            initiate(1)
            x=1
            start =1
        }
    });


    $("#cancel").click(function(){
        $("#customer_name").val(" ")
        $('#address_type').prop('selectedIndex',0);
        $("#street").val(" ")
        $("#city").val(" ")
        $("#zipcode").val(" ")
        $("#state").val(" ")
        $("#country").val(" ")
        $("#contact_person").val(" ")
        $("#mobile_number").val(" ")
        $("#office_landline_number").val(" ")
        $("#email").val(" ")
        $("#website").val(" ")
        $("#shipping").val(" ")
        $("#gst_no").val(" ")
        $("#gst_prcntg").val(" ")
        $("#tinpan_no").val(" ")
        $("#remarks").val(" ")        
    });

    
    $('.scroll-table').scroll(function() {
        if ($("#search").val() == ""){
            if ($(this).scrollTop() >= x*27){
                x+=11
                start +=1;
                $.ajax({
                    type:'GET',
                    url:"/superuser/customer-details-show/?page="+start,
                    success:function(results){
                        var result =JSON.parse(JSON.stringify(results))
                        if (result["result"]){
                            len=result['result'][0].length
                            a=result["result"]
                            for (i=0;i<len;i++){                 
                                var _tr='<tr> <td style="display:none">'+a[0][i]['customer_id']+'</td>\
                                            <td >'+a[0][i]['customer_name']+'</td>\
                                            <td>'+a[1][i]['contact_person']+'</td>\
                                            <td>'+a[1][i]['mobile_number']+'</td>\
                                            <td>'+a[1][i]['email']+'</td>\
                                            <td>'+a[1][i]['customer_remarks']+'</td>\
                                        </tr>'
                                $('#customer_details_tbody').append(_tr);
                            }
                        }
                        else if(result["error"]){
                            $.iaoAlert({
                                msg:(result["error"]),
                                type: "error",
                                mode: "dark",
                            });
                        }
                        else if (result["redirect"]){
                            window.location.replace(result["redirect"])
                        }
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
                        $.iaoAlert({
                            msg:(msg),
                            type: "error",
                            mode: "dark",
                        });
                    }
            
                });
            }
        }
        else{
            if ($(this).scrollTop() >= x*27){
                
                x+=11
                start +=1;
                var obj = {"searching_word":$("#search").val()}
                $.ajax({
                    type:'POST',
                    url:"/superuser/customer-details-search/?page="+start,
                    contentType:'application/json',
                    data:JSON.stringify(obj),
                    dataType:'json',
                    success:function(results){
                        var result =JSON.parse(JSON.stringify(results))
                        if (result["result"]){
                            len=result['result'].length
                            a=result["result"]
                            for (i=0;i<len;i++){                 
                                var _tr='<tr> <td style="display:none">'+a[i]['customer_id']+'</td>\
                                            <td >'+a[i]['customer_name']+'</td>\
                                            <td>'+a[i]['cust_id__contact_person']+'</td>\
                                            <td>'+a[i]['cust_id__mobile_number']+'</td>\
                                            <td>'+a[i]['cust_id__email']+'</td>\
                                            <td>'+a[i]['cust_id__customer_remarks']+'</td>\
                                        </tr>'
                                $('#customer_details_tbody').append(_tr);
                            }
                        }
                        else if(result["error"]){
                            $.iaoAlert({
                                msg:(result["error"]),
                                type: "error",
                                mode: "dark",
                            });
                        }
                        else if (result["redirect"]){
                            window.location.replace(result["redirect"])
                        }
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
                        $.iaoAlert({
                            msg:(msg),
                            type: "error",
                            mode: "dark",
                        });
                    }
                });

            }

        }
    });


});
