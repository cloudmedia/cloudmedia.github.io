$(document).ready(function(){
    initMain();
    $("#signup-submit-btn").click(function(){
        var cap = grecaptcha.getResponse();
        if (cap.length < 10)
        {
            notify2("Please verify that you are indeed not an evil robot!", "error");
        }else{
            $("#loading_cont").show();
            var email = Base64.encode($("#signup-email").val());
            $.getJSON("/account/signup?data="+email+"&cap="+cap, function(data){
                $("#loading_cont").fadeOut();
                grecaptcha.reset();
                console.log(data);
                if (data.status == 1)
                {
                    notify2("Account creation success! Please check you email for instructions on how to activate your account.", "success", false);
                    $("#signup-email").val("");
                }else{
                    notify2(data.message, "error");
                    $("#signup-email").select();
                }
            });
        }
    });

    <?php if (isset($_SESSION['init_login'])) { unset($_SESSION['init_login']);?>
    notify("Welcome back, <?=$acct->username;?>!", "success");
    <?php } ?>
});