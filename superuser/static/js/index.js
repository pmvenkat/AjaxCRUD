$(document).ready(function(){
    $(document).keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            $("#Login").click();
        }
    });
    $("#Login").click(function(){  
        if ($("#Username").val() =="" && $("#Password").val() ==""){
            alert("Please Fill the mandatotry")
        }
        else{
            var url;
            next = window.location.href.split("=")[1];
            if (next){
                url = next
            }
            else{
                url = "None"
            }
            var obj={"username":$("#Username").val(),"password":$("#Password").val(),"next":url};
            $.ajax({
                type:'POST',
                url:"/superuser/login/",
                contentType:'application/json',
                data:JSON.stringify(obj),
                dataType:'json',
                success:function(results){
                    var result =JSON.parse(JSON.stringify(results))
                    if (result["result"]){
                        localStorage.setItem("display_name", result["display_name"]);
                        window.location.replace(result["url"])                            
                    }
                    else if (result["error"]){
                        $.iaoAlert({
                            msg:(result["error"]),
                            type: "notification",
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
                        type: "notification",
                        mode: "dark",
                    });
                }   
            });
        }

   });

});

