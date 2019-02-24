function doHelp(topic, mod, noCancel)
{
  if (mod == undefined) mod="";
  if (noCancel == undefined) noCancel=false;

  $.getJSON("/help-api/"+topic, function(data){
    console.log(data);
    var icon;
    var color;
    var sound;
    var errorIcon = "exclamation-triangle";
    var errorColor = "#c50000";
    var warnIcon = "exclamation-circle";
    var warnColor = "#ff9800";
    var successIcon = "check-circle";
    var successColor = "#018401";
    var defaultIcon = "question-circle";
    var defaultColor = "#1c4f6bf2";
    var defaultSound = sndDing;
    if (data.status == 1)
    {
        switch (data.class)
        {
        case "error":
            icon = errorIcon;
            color = errorColor;
            sound = sndError;
        break;
        case "warn":
            icon = warnIcon;
            color = warnColor;
            sound = sndDing;
        break;
        case "success":
            icon = successIcon;
            color = successColor;
            sound = sndSuccess;
        break;
        default:
            icon = defaultIcon;
            color = defaultColor;
            sound = defaultSound;
        }
        if (data.title_color.length > 0) color = data.title_color;
        if (data.title_icon.length > 0) icon = data.title_icon;

        playSound(sound);
        
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
                playSound(sndSuccess);
                mainLoad(res.next_mod);
                icon = successIcon;
                color = successColor;
                mess = res.message;
                updateHelp("Success!", mess, icon, color);
                $("#helpConfirmBtn").hide();
                $("#helpCancelBtn").hide();
                $("#helpDefaultBtn").show();
            }else{
                playSound(sndError);
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
    }else{
        playSound(sndError);
        updateHelp("Help Error!", data.message, errorIcon, errorColor);
    }

    $("#helpModal").fadeIn(100, function(){
      $("#helpCont").fadeIn(function(){
      });
    });
  });
}

function updateHelp(topic, text, icon, color)
{
  $("#helpTitleIcon").removeClass().addClass("fas fa-"+icon);
  $("#helpTitleCont").css("background-color", color);
  $("#helpTitleTopic").html(topic);
  $("#helpDisp").html(text);
}