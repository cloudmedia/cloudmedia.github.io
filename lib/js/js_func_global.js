// Wrap every letter in a span
var noOp = function(){}

$('.ml9 .letters').each(function(){
    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
});

anime.timeline({loop: true})
.add({
    targets: '.ml9 .letter',
    scale: [0, 1],
    duration: 1500,
    elasticity: 600,
    delay: function(el, i) {
    return 45 * (i+1)
    }
}).add({
    targets: '.ml9',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
});

$(".spinner").click(function(){
    $("#loading_cont").fadeOut();
});

function scrollTop()
{
    $('html, body').animate({
        scrollTop: $("#page-top").offset().top
    }, 2000);
}

function loadingGif(ele, txt)
{
    if (txt == undefined) txt="Loading...";
    $(ele).hide().html('<img class="auto-center" src="/images/loading-icon.gif" alt="Loading..."><span class="auto-center">'+txt+'</span>').fadeIn();
}

function notify(txt, type, aHide)
{
    if (txt == undefined) txt = "UNDEFINED";
    if (type == undefined) type="error";
    if (aHide == undefined) aHide=true;
    if (aHide == "false" || aHide == "0") aHide=false;
    $.notify(txt, { position:"bottom left", className: type, autoHide: aHide });
}

function errorFieldNotify(f,m)
{
    $('html, body').animate({
        scrollTop: ($(f).offset().top-60)
    },1000);
    $(f).notify(m, {position: "bottom left", className: "error"}).addClass("error-field")
        .change(function(){
            $(this).removeClass("error-field");
        }).select();
}

function footer_modal(txt, color, icon)
{
    $("#footer-modal-icon").removeClass().addClass("fa").addClass(icon).css("color", color);
    $("#footer-modal-text").text(txt).css("color", color);
    $("#footer-modal").show();
    setTimeout(function(){
        $("#footer-modal").fadeOut();
    }, 10000);
}

function zip2Addr(zip, callBack)
{
	$.getJSON("/usps/zip2addr/"+zip, function(data, status){
		$("#loading_cont").hide();
		console.log(data);
		callBack(data);
	});
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

Date.getFormattedDateDiff = function(date1, date2) {
  var b = moment(date1),
      a = moment(date2),
      intervals = ['years','months','weeks','days', 'hours', 'minutes', 'seconds'],
      out = [];

  for(var i=0; i<intervals.length; i++){
      var diff = a.diff(b, intervals[i]);
      b.add(diff, intervals[i]);
      out.push(diff + ' ' + intervals[i]);
  }
  return out.join(', ');
};

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateEmail2(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

function validateFQDN(domain) { 
    var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/); 
    return domain.match(re);
}

function validateIP(ip) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip))
    {
        return true;
    }else{
        return false;
    }
}

function pad(num, size)
{
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

function errorField(fld, status)
{
    if (status)
    {
        $(fld).css("border-color", "");
    }else{
        $(fld).css("border-color", "rgba(228, 23, 23, 0.77)").select();
    }
}

function fieldStatus(fld, status, message)
{
    if (message == undefined) message="";
    if (fld.search("#") < 0) fld = "#"+fld;
    if (status)
    {
        $(fld).css("border-color", "rgba(15, 177, 30, 0.77)");
    }else{
        $('html, body').animate({
            scrollTop: ($(fld).offset().top-60)
        },1000);
        $(fld).css("border-color", "rgba(228, 23, 23, 0.77)").select();
        if (message.length > 0) $(fld).notify(message, {position: "bottom left", className: "error"}).select();
    }
}

function fieldStatusClear(fld)
{
    $(fld).css("border-color", "inherit");
}

function delLastLine(x)
{
    return x.substring(0, x.lastIndexOf("\n"));
}

jQuery.loadScript = function (url, callback)
{
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}

function formatNum(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}