$(document).mousedown(function(e) 
{
    checkKBStatus(e);
});
$(document).ready(function(){
    $(".keyboard-key").click(function(){
        playSound(sndType);
        var key = $(this).text();
        if ($(this).attr("id") == "numpad-enter-key") key = "ENTER";
        switch (key)
        {
            case "SHIFT":
                keyboardShift(this);
            break;
            default:
                var fld = $("#keyboard-input-field").val();
                var fldType = $(fld).prop('nodeName');
                var txt = $(fld).val();
                var sel = $("#keyboard-sel-text").val();
                var caretPos = parseInt($("#keyboard-caret-pos").val());
                switch (key)
                {
                    case "BKSP":
                        var selEnd = parseInt($("#keyboard-sel-end").val());
                        if (selEnd > 0 && selEnd != caretPos)
                        {
                            txt = txt.substr(0, caretPos) + txt.substr(selEnd);
                            $("#keyboard-sel-end").val(0);
                        }else{
                            txt = txt.slice(0,-1);
                            caretPos--;
                            if (caretPos < 0) caretPos = 0;
                            $("#keyboard-caret-pos").val(caretPos);
                        }
                    break;
                    case "ENTER":
                        if (fldType == "TEXTAREA")
                        {
                            txt += "\n";
                            $("#keyboard-caret-pos").val(caretPos+1);
                        }else{
                            toggleKeyboard();
                        }
                    break;
                    case "SPACE":
                        txt += " ";
                        $("#keyboard-caret-pos").val(caretPos+1);
                    break;
                    default:
                        if (sel.length > 0)
                        {
                            txt = txt.replace(sel, key);
                        }else{
                            txt = [txt.slice(0, caretPos), key, txt.slice(caretPos)].join('');
                        }
                        $("#keyboard-caret-pos").val(caretPos+1);
                }
                $("#keyboard-sel-text").val("");
                $(fld).val(txt).trigger("input").keydown().keyup().focus().caretTo($("#keyboard-caret-pos").val());
                var getFld = document.getElementById($(fld).attr("id"));
                $("#keyboard-caret-pos").val(getFld.selectionStart);

                if ($("#keyboard-shift-key").hasClass("active") && !$("#keyboard-caps-key").hasClass("active"))
                {
                    keyboardShift($("#keyboard-shift-key"));
                }
        }
    });

    $("#keyboard-caps-key").click(function(){
        $(this).toggleClass("active");
        keyboardShift($("#keyboard-shift-key"));
    });

    $("#keyboard-toggle-btn").click(function(){
        toggleKeyboard();
    });

    $("#numpad-toggle-btn").click(function(){
        toggleNumpad();
    });

    $("#keyboard-copy-btn").click(function(){
        var fld = $("#keyboard-input-field").val();
        var caretPos = parseInt($("#keyboard-caret-pos").val());
        var selEnd = parseInt($("#keyboard-sel-end").val());
        $("#keyboard-caret-pos").val(0);
        $("#keyboard-sel-end").val(0);
        $("#keyboard-input-field").val("");
        if (selEnd > 0 && selEnd != caretPos)
        {
            var sel = $("#keyboard-sel-text").val();
            $("#keyboard-clipboard").val(sel);
            notify("Text copied!", "success");
        }
    });

    $("#keyboard-paste-btn").click(function(){

    });

    $("#keyboard-next-btn").click(function(){
        var ele = $("#keyboard-input-field").val();
        var index = parseInt($(ele).attr("tabindex"));
        alert(index);
    });
});

function toggleKeyboard()
{
    if ($("#keyboard-on").val() == "1" || $("#keyboard-active").val() == "1")
    {
        var slider = "#keyboard-cont";
        var sliderHeight = $(slider).height();
        if($(slider).css("margin-bottom") == -sliderHeight+"px" && !$(slider).is(':animated'))
        {
            $(slider).animate({"margin-bottom": '+='+sliderHeight});
            $("#keyboard-active").val("1");
        }
        else
        {
            if(!$(slider).is(':animated'))
            {
                $(slider).animate({"margin-bottom": '-='+sliderHeight});
                $("#keyboard-active").val("0");
            }
        }
    }
}

function toggleNumpad()
{
    if ($("#keyboard-on").val() == "1" || $("#numpad-active").val() == "1")
    {
        var slider = "#numpad-cont";
        var sliderWidth = $(slider).width();
        if($(slider).css("margin-right") == -sliderWidth+"px" && !$(slider).is(':animated'))
        {
            $(slider).animate({"margin-right": '+='+sliderWidth});
            $("#numpad-active").val("1");
        }
        else
        {
            if(!$(slider).is(':animated'))
            {
                $(slider).animate({"margin-right": '-='+sliderWidth});
                $("#numpad-active").val("0");
            }
        }
    }
}

function keyboardsOff()
{
    var kbActive = parseInt($("#keyboard-active").val());
    var npActive = parseInt($("#numpad-active").val());
    if (kbActive) toggleKeyboard();
    if (npActive) toggleNumpad();
}

function keyboardShift(fld)
{
    $(".keyboard-key").each(function(){
        var shiftKey = $(this).attr("data-shift");
        var eKey = $(this).text();
        $(this).text(shiftKey);
        $(this).attr("data-shift", eKey);
    });
    $(fld).toggleClass("active");
    if (!$(fld).hasClass("active") && $("#keyboard-caps-key").hasClass("active"))
    {
        $("#keyboard-caps-key").removeClass("active");
    }
}

function toggleKeyboardOn()
{
    playSound(sndSuccess);
    var kbOn = parseInt($("#keyboard-on").val());
    if (kbOn)
    {
        $("#keyboard-on").val(0);
        $(".keyboard-on-btn").removeClass("active").attr("title", "Turn Keyboard On");
        $("#toolTip").text("Turn Keyboard On");
        notify("Soft keyboard is now off!", "success");
    }else{
        $("#keyboard-on").val(1);
        $(".keyboard-on-btn").addClass("active").attr("title", "Turn Keyboard Off");
        $("#toolTip").text("Turn Keyboard Off");
        notify("Soft keyboard is now on!", "success");
    }
}

function checkKBStatus(e)
{
    var eClass = $(e.target).attr("class");
    if (eClass != "keyboard-key")
    {
        var keyBoard = $("#keyboard-cont");
        var keyBoardActive = parseInt($("#keyboard-active").val());
        var numpadActive = parseInt($("#numpad-active").val());
        if (!keyBoard.is(e.target) && keyBoard.has(e.target).length === 0 && keyBoardActive && e.target.tagName != "INPUT" && e.target.tagName != "TEXTAREA")
        {
            toggleKeyboard();
        }
        if (!keyBoard.is(e.target) && keyBoard.has(e.target).length === 0 && numpadActive && e.target.tagName != "INPUT" && e.target.tagName != "TEXTAREA")
        {
            toggleNumpad();
        }
    }
}