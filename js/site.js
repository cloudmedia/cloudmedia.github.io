<?php require_once(LROOT."/js/sounds.js");?>

$(document).ready(function(){
    $("#loading_cont").fadeOut();
    initMain();

    $(".signup-btn").click(function(){
        $('html, body').animate({
            scrollTop: ($("#signup-email").offset().top-120)
        },1000);
        $("#signup-email").select();
    });

    $(".git-btn").click(function(){
        var notify = new Notify2("Launch GitHub Site?", "info");
        notify.doConfirm("goGit()");
        notify.notify();
    });
});

function goGit()
{
    window.open("https://github.com/cloudmedia");
}

function initMain()
{
    bindToolTips();
}

function bindToolTips()
{
  $("#toolTip").hide();
  <?php if (!$is_mobile) { ?>
  $(".tooltip").unbind("hover").hover(function(){
    var t = $(this).attr("title");
    if (t != undefined)
    {
      $("#toolTip").hide().text(t).fadeIn(100);
    }
  }, function(){
      $("#toolTip").fadeOut(100);
  });
  <?php } ?>
}

<?php require_once(LROOT."/js/js_func_global.js");?>
<?php require_once(LROOT."/js/notify2.js");?>