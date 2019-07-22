$(document).ready(function(){
    $("#login").click(function(){  
        username = $("#username").val();
        password = $("#password").val();
        count = 0;
        if(username == "")
        {
            $("#username_error").text("Please Enter Email ID");
        }
        else
        {
            var regex_mail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(regex_mail.test(username))
            {
                $("#username_error").text("");
                count++;
            }
            else
            {
                $("#username_error").text("Email ID is Invalid Format");
            }

        }

        if(password == "")
        {
            $("#password_error").text("Please Enter Password");
        }
        else
        {
            $("#password_error").text("");
            count++;
        }

        if(count == 2)
        {
           $.cookie("email",username);

           $.ajax({ 
              type:"POST",
              url:"/login_valid",
              data:{Email:username,Password:password},
              success:function(result){
                if(result=="admin")
                {
                  window.location.replace("/admin_dashboard");
                }
                if(result=="staff")
                {
                   window.location.replace("/user_dashboard");
                }
              },
              error:function(){
                  alert("Please check Email and Password..")
              }
           });
        }

    });

    $("#create").click(function(){ 
        name = $("#name").val();
        email = $("#email").val();
        reg_pwd = $("#reg_pwd").val();
        confirm_pwd = $("#confirm_pwd").val();
        count = 0;
        if(name == "")
        {
            $("#name_error").text("Please Enter User Name");
        }
        else
        {
            $("#name_error").text("");
            count++;
        }
        if(email == "")
        {
            $("#email_error").text("Please Enter Email ID");
        }
        else
        {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(regex.test(email))
            {
                $("#email_error").text("");
                count++;
            } 
            else
            {
                $("#email_error").text("Email ID is Invalid Format");
            }
        }
        if(reg_pwd == "")
        {
            $("#reg_pwd_error").text("Please Enter Password");
        }
        else
        {
            $("#reg_pwd_error").text("");
            count++;
        }
        if(confirm_pwd == "")
        {
            $("#confirm_pwd_error").text("Please Enter Password");
        }
        else
        {
            if(reg_pwd != confirm_pwd)
            {
                $("#confirm_pwd_error").text("Password is Not Match");
            }
            else
            {
                $("#confirm_pwd_error").text("");
                count++;
            }
        }
        
        if(count == 4)
        {
           $.ajax({
              type:"POST",
              url:"/login_registation",
              data:$(".register-form").serialize(),
              success:function(result){
                   alert(result);
              }
           });
        }
      
    });
    
});