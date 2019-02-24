$(document).ready(function(){
    // Dialog screen max width
    var dWidth = 800;
    if (screen.width < 800) dWidth = screen.width;

    $("#loading_cont").fadeOut();
    $("#footer-modal").hide();
    <?php if ($_SESSION['footer_message']) { ?>
    $.notify("<?=$_SESSION['footer_message'];?>", {position: "bottom left", className: "<?=$_SESSION['footer_message_class'];?>"});
    <?php $_SESSION['footer_message']=NULL; } ?>

    $(".email-btn").click(function(){
      $.getJSON("/api/cemail", function(data){
        if (data.status == 1){
          $(location).attr("href", data.eurl);
        }else{
          notify("An error occurred!", "error");
        }
      });
    });

    $("#popUpCloseBtn").click(function(){
      $("#popUp").fadeOut();
    });
    $("#popUpRefreshBtn").click(function(){
      popUpRefresh();
    });

    refreshSelAcct();

    bindButtons();
});

<?php require_once("js_func_global.js"); ?>

function loadingGif(ele, txt="Loading...")
{
  $(ele).html('<img class="auto-center" src="/images/loading-icon.gif" alt="Loading..." />
  <span class="auto-center">'+txt+'</span>');
}

function bindButtons()
{
  $(".btnLoad").unbind().click(function(){
    var mod = $(this).attr("data-mod");
    var txt = "Loading Module...";
    if ($(this).attr("data-txt") != undefined)
    {
      txt=$(this).attr("data-txt");
    }
    mainLoad(mod, 0, txt);
  });

  $(".popLoad").unbind().click(function(){
    var mod = $(this).attr("data-mod");
    popLoad(mod);
  });

  $(".mainRefresh").unbind().click(function(){
    mainRefresh();
  });

  $(".backBtn").unbind().click(function(){
    var mod = $("#modLoaded").val();
    mod = mod.split("/");
    mod.pop();
    mod = mod.join("/");
    mainLoad(mod);
  });

  $(".lastModBtn").unbind().click(function(){
    var mod = $("#lastModLoaded").val();
    mainLoad(mod);
  });

  $(".nextModBtn").unbind().click(function(){
    var mod = $("#nextMod").val();
    mainLoad(mod);
  });

  $(".forgetAcctBtn").unbind().click(function(){
    if ($("#selAcctLock").val() != 1)
    {
      $.get("/api/forget-sel-acct", function(data){
          $("#sel-acct-disp").text("");
          $("#selAcct").val(data);
          $("#selAcctID").val(0);
          $("#sel-acct-cont").fadeOut(function(){
            mainRefresh();
          });
      });
    }else{
      notify("Selected account is locked.", "info");
    }
  });

  $(".popHelp").click(function(){
    var topic = $(this).attr("data-topic");
    var mod="";
    if ($(this).attr("data-mod") != undefined) mod = $(this).attr("data-mod");
    doHelp(topic, mod);
  });
  $(".help-close-btn").click(function(){
    $("#helpCont").fadeOut(function(){
      $("#helpModal").fadeOut(100);
      $("#helpTitleTopic").text("");
      $("#helpDisp").text("");
    });
  });

  $("#selAcctLock").val(0);

  $(".pref-checkbox").unbind().change(function(){
    var pref=$(this).attr("data-pref");
    var val=$(this).val();
    if ($(this).is(':checked'))
    {
      val="1";
    }else{
      val="0";
    }
    $.getJSON("/user/api/set-pref/"+pref+"/"+val, function(data){
      if (data.status == 1)
      {
        notify("Preference saved!", "success");
      }else{
        notify(data.message, "error");
      }
    });
  });

  bindToolTips();
  refreshSelAcct();
}

function doHelp(topic, mod="", noCancel=false)
{
  $.getJSON("/help-api/"+topic, function(data){
    console.log(data);
    var icon;
    var color;
    var errorIcon = "exclamation-triangle";
    var errorColor = "#c50000";
    var warnIcon = "exclamation-circle";
    var warnColor = "#ff9800";
    var successIcon = "check-circle";
    var successColor = "#018401";
    var defaultIcon = "question-circle";
    var defaultColor = "#1c4f6bf2";
    switch (data.class)
    {
      case "error":
        icon = errorIcon;
        color = errorColor;
      break;
      case "warn":
        icon = warnIcon;
        color = warnColor;
      break;
      case "success":
        icon = successIcon;
        color = successColor;
      break;
      default:
        icon = defaultIcon;
        color = defaultColor;
    }
    if (data.title_color.length > 0) color = data.title_color;
    if (data.title_icon.length > 0) icon = data.title_icon;

    if (data.confirm == "1")
    {
      var confirmText = "Confirm";
      var cancelText = "Cancel";
      $("#helpDefaultBtn").hide();
      if (data.confirm_text.length > 0) confirmText = data.confirm_text;
      if (data.cancel_text.length > 0) cancelText = data.cancel_text;
      $("#helpConfirmBtn > a").text(confirmText);
      $("#helpCancelBtn > a").text(cancelText);
      $("#helpConfirmBtn").unbind().click(function(){
        $.getJSON(mod, function(res){
          console.log(res);
          if (res.status == 1)
          {
            mainLoad(res.next_mod);
            icon = successIcon;
            color = successColor;
            mess = res.message;
            updateHelp("Success!", mess, icon, color);
            $("#helpConfirmBtn").hide();
            $("#helpCancelBtn").hide();
            $("#helpDefaultBtn").show();
          }else{
            icon = errorIcon;
            color = errorColor;
            mess = res.message+'<?=$error_message_footer;?>';
            updateHelp("Error!", mess, icon, color);
            $("#helpConfirmBtn").hide();
            $("#helpCancelBtn").hide();
            $("#helpDefaultBtn").show();
          }
        });
      });
      $("#helpConfirmBtn").show();
      if (!noCancel) $("#helpCancelBtn").show();
    }else{
      $("#helpConfirmBtn").hide();
      $("#helpCancelBtn").hide();
      $("#helpDefaultBtn").show();
    }

    var text = Base64.decode(data.message);
    updateHelp(data.topic, text, icon, color);

    $("#helpModal").fadeIn(100, function(){
      $("#helpCont").fadeIn();
    });
  });
}

function updateHelp(topic, text, icon, color)
{
  $("#helpTitleIcon").removeClass().addClass("fas fa-"+icon);
  $("#helpTitleCont").css("background-color", color);
  $("#helpTitleTopic").text(topic);
  $("#helpDisp").html(text);
}

function bindToolTips()
{
  $("#toolTip").hide();
  <?php if (!$is_mobile) { ?>
  var eles = "i, a, input, button";
  $(eles).unbind("hover").hover(function(){
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

function setPopUpTitle(t)
{
	$("#popUpTitle").text(t);
}

function popUpClose()
{
  $("#popUp").fadeOut();
}

function setModLoaded(mod)
{
  var mod64 = Base64.encode(mod);
  $.get("/api/update-mod-loaded/"+mod64);
  $(".bread-crumb").text(mod);
  $("#modLoaded").val(mod);
}

function mainLoad(mod, noLastMod=0, txt="Loading Module...")
{
  popUpClose();
  setModLoaded(mod);
  console.log("Mod Loaded: "+mod);
  if (!noLastMod) $("#lastModLoaded").val($("#modLoaded").val());
  loadingGif("#user-main-cont", txt);
  $("#user-main-cont").load(mod);
}

function mainRefresh()
{
  var mod = $("#modLoaded").val();
  mainLoad(mod, 1);
}

function popLoad(mod)
{
  $("#popModLoaded").val(mod);
  loadingGif("#popUpVP");
  $("#popUp").fadeIn();
  switch(mod)
  {
    case "cancel":
      $("#popUp").fadeOut();
      refreshSelAcct();
    break;
    case "cancel-refresh":
      $("#popUp").fadeOut();
      mainLoad($("#modLoaded").val());
    break;
    default:
      $("#popUpVP").load(mod);
  }
}

function setPopUpRefresh(uri)
{
  $("#popUpRefreshBtn").unbind().click(function(){
    popLoad(uri);
  });
}