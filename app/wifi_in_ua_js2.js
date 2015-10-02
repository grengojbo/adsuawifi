var g_iCount = Number(16);
var can_go = false;
var go_on = false;
var duration = 15;
var mytimer;
var myedu;

if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
    $('html').addClass('ipad ios7');
}

window.onresize = function () {
    resize_buttons();
};

$('document').ready(function(){
    ChkinIframe();
});

function Myeduclass(advtype){

    this.advtype = advtype;
    var _userdata = {};
    var _advdata = {};
    var _self = this;

    this.eduview = function(){
        var postdata = parse_get();
        postdata.action = 'eduview';
        $.ajax({
            url: "/edu/edu_engine.php?r="+Math.round(Math.random()*100000),
            type: 'POST',
            async: false,
            cache: false,
            data: postdata,
            complete: function (edudata) {
                var resp = JSON.parse(edudata.responseText);
                parseADV(resp);
            }
        });
    };

    this.getFallBack = function(){
        _userdata.MAC = MAC;
        _userdata.USERNAME = USERNAME;
        _userdata.IDENTITY = IDENTITY;
        _userdata.SRV = SRV;
        _userdata.LOGGEDIN = LOGGEDIN;
        _userdata.BLOCKED = BLOCKED;
        _userdata.TIMELEFT = TIMELEFT;
        _userdata.path = 'fallback_globals';
    };

    this.getuserdata = function(){

        $.ajax({
            url: "http://8.8.8.8/user_json.html?r="+Math.round(Math.random()*100000),
            type: 'GET',
            cache: false,
            dataType: "json",
            async: false,
            complete: function (data) {
                if (data.responseText == undefined){
                    _self.getFallBack();
                }else{
                    _userdata = JSON.parse(data.responseText);
                    _userdata.path = 'all_Ok';
                }
                _userdata.advtype = advtype;
                _userdata.dst = dst;
            }
        });
    };

    this.checkauth = function(){
        _userdata.action = 'user_chk';
        if (_userdata.LOGGEDIN == undefined){
            _userdata.path = 'userauth_check';
            self.getFallBack();
        }
        $.ajax({
            url: "/ajax.php?r="+Math.round(Math.random()*100000),
            data: _userdata,
            type: 'POST',
            cache: false,
            async: false,
            timeout: 2000,
            complete: function(data){
                if (!data.responseText)
                    return false;
                try{
                    var response = JSON.parse(data.responseText);
                    _self.radius(response);
                }catch(e){
                    console.log('bedaaaa');
                }
                return true;
            }
        });
        return true;
    };

    this.usr = function(){
        var ret = false;
        _userdata.fallback = parse_get();
        $.ajax({
            url: "/edu/new_redirect.php?r="+Math.round(Math.random()*100000),
            type: "POST",
            data: _userdata,
            cache: false,
            async: false,
            complete: function (data){
                var response = JSON.parse(data.responseText);
                _self.radius(response);
                ret = (response.action == 'adv');
            }
        });
        return ret;
    };

    this.radius = function(response){
        var temp, a;
        if (response.action == 'auth'){
            temp = $.ajax({
                "url": 'http://8.8.8.8/login',
                "type": "GET",
                data: response.userdata,
                cache: false,
                async: false,
                crossDomain: true,
                complete: function(){
                    if (response.userdata.dst != 'none')
                        window.location = response.userdata.dst;
                }
            });

            if (temp.status == 0){
                a = new Image();
                a.src = 'http://8.8.8.8/login?username='+response.userdata.username+'&password='+response.userdata.password;
            }
        }
        if (response.action == 'reauth'){
            temp = $.ajax({
                "url": 'http://8.8.8.8/logout',
                "type": "GET",
                async: false,
                crossDomain: true,
                cache: false,
                complete: function(){
                    $.ajax({
                        "url": 'http://8.8.8.8/login',
                        crossDomain: true,
                        "type": "GET",
                        data: response.userdata,
                        async: false,
                        complete: function(){
                            if (response.userdata.dst != 'none')
                                window.location = response.userdata.dst;
                        }
                    });
                }
            });

            if (temp.status == 0){
                a = new Image();
                a.src = 'http://8.8.8.8/logout';
                response.action = 'auth';
                this.radius(response);
            }



        }
        if (response.action == 'unblock'){
            temp = $.ajax({
                url: 'http://8.8.8.8/advert',
                type: "GET",
                data: null,
                crossDomain: true,
                async: false,
                cache: false,
                complete: function(){
                    window.location = response.dst;
                }
            });
            if (temp.status == 0){
                a = new Image();
                a.src = 'http://8.8.8.8/advert';
            }
        }
        if (response.action == 'gonext'){
            window.location = response.dst;
        }
        if (response.action == 'logout'){
            temp = $.ajax({
                url: 'http://8.8.8.8/logout',
                type: "GET",
                crossDomain: true,
                data: null,
                cache: false,
                async: false
            });
            if (temp.status == 0){
                a = new Image();
                a.src = 'http://8.8.8.8/logout';
            }
        }
    };

    this.getmyadv = function(){
        _userdata.advtype = this.advtype;
        _userdata.action = 'getmyadv';
        _userdata.dst = dst;
        $.ajax({
            url: "/edu/edu_engine.php?r="+Math.round(Math.random()*100000),
            type: 'POST',
            async: false,
            cache: false,
            data: _userdata,
            complete: function (edudata) {
                var edu = JSON.parse(edudata.responseText);
                if (edu.cheater != undefined){
                    _self.radius(edu);
                    return;
                }
                _advdata = jQuery.extend({}, edu);
                parseADV(edu);
            }
        });
    };

    this.postmyadv = function(clicked){
        if (go_on == true){
            var mydata = {};
            jQuery.extend(mydata, _userdata);
            jQuery.extend(mydata, _advdata);
            mydata.action = 'postmyadv';
            mydata.clicked = clicked;
            mydata.dst = dst;
            $.ajax({
                url: "/edu/edu_engine.php?r="+Math.round(Math.random()*100000),
                data: mydata,
                type: 'POST',
                cache: false,
                async: false,
                complete: function(data){
//                    console.log(data.responseText);
                    var response = JSON.parse(data.responseText);
                    _self.radius(response);
                }
            })
        }
    };

}

function parseADV(edu){
    var advplace = $('#maintable').find('tr td');
    var body = $('body');
    var advimage;

    if (edu.page == 504 || edu.page == 515 || edu.page == 514 || edu.page == 529){
        $('#dollar_el').attr('src','/template/img/info.png');
    }

    if (edu.free_only && edu.type != 'logo'){
        $('#dollar_el').attr('src','/template/img/info.png').attr('onclick','adv_count_go()');
    }

    if (edu.type == 'logo'){
        if (edu.upperlogo){
            advplace.append('<img src="/edu/0/'+edu.upperlogo+'"><br>');
        }
        advplace.append('<img src="/template/img/logo_new.png"><br><span style="color:#1080a1;font-weight: bold">Мережа року відкритого WI-FI доступу в інтернет</span>');
        startCountdown();
    }

    if ((edu.type == 'video' && !chk_video()) || old_android){
        edu.type = 'image';
    }

    if (edu.type == 'image' || edu.type == 'page'){
        advplace.append('<img id="advimage" src="'+'http://wifi.in.ua'+edu.src+'">');
        advimage = $('#advimage');
        if (edu.href && edu.type != 'page'){
            advimage.attr('onclick','adv_count_go()').css('cursor','pointer');
        }
        if (edu.color)
            body.css('background','#'+edu.color);

        advimage.load(function(){

            resize_main(advimage);
            window.onresize = function () {
                resize_buttons();
                resize_main(advimage);
            };
        });

        if (edu.type == 'page'){
            advplace.append($("<div>").load( "http://wifi.in.ua"+edu.page_src ));
        }

        startCountdown();
    }

    if (edu.type == 'href'){
        go_on = true;
        myedu.postmyadv(false);
    }

    if (edu.type == 'video'){
        if (edu.color)
            body.css('background','#'+edu.color);
        $('#progressbar').show();

        var mybutton = '<div id="butt" onclick=\'go_from_adv()\' style=\'z-index: 2000\'><img src="/template/img/play.png"><br><span > Продолжить </span></div>';
        body.append(mybutton);

        advplace.append('<img id="advimage" src="'+'http://wifi.in.ua'+edu.src+'">');

        var myVideo = $('<video id = "advvideo" style="display: none;"></video>');
        myVideo.append('<source src="'+'http://wifi.in.ua'+edu.video.mp4+'" />');
        myVideo.append('<source src="'+'http://wifi.in.ua'+edu.video.ogv+'" type=\'video/ogg; codecs="theora, vorbis"\'  />');
        myVideo.append('<source src="'+'http://wifi.in.ua'+edu.video.webm+'" type=\'video/webm; codecs="vp8.0, vorbis"\' />');

        advplace.append(myVideo);

        var myVideoJS = document.getElementById('advvideo');
        advimage = $('#advimage');
        myVideoJS.addEventListener('loadedmetadata', function(e) {
            resize_video(myVideo);
        });
        resize_main(advimage);
        resize_video(myVideo);
        var mybutt = document.getElementById("butt");

        myVideoJS.addEventListener('loadeddata', function() {
            myVideoJS.play();
            g_iCount=parseInt(myVideoJS.duration+1);
            window.onresize = function () {
                resize_buttons();
                resize_main(advimage);
                resize_video(myVideo);
            };
            if(myVideoJS.paused==false){
                $('#advvideo').show();
                $('#advimage').hide();
                resize_main(advimage);
                resize_video(myVideo);
                mybutt.style.display='none';
            }
        }, false);

        myVideoJS.addEventListener('webkitendfullscreen', function(){
            if((duration-g_iCount)>=8){
                go_next();
            }
        }, false);

        myVideo.bind('timeupdate', function() {
            duration = myVideoJS.duration;
            $('#loader').hide();
            var cur_width = myVideoJS.currentTime / myVideoJS.duration*100;
            $('#progressbar_play').css('width',(parseInt(cur_width).toString()+'%'));
            g_iCount = Math.round(myVideoJS.duration - myVideoJS.currentTime);
            document.getElementById('numberCountdown').innerHTML = (g_iCount).toString();
            $('#numberCountdown').show();
            if(((duration-g_iCount)>=8) && can_go==false){
                var clock = document.getElementById('clock_el');
                clock.src = '/template/img/edu_free_but.png';
                clock.title = 'Пропустить';
                can_go = true;
            }
        if (Math.round(g_iCount) == 0){
            go_next();
        }

        }).bind('progress', function() {
            $('#loader').hide();
            var cur_load = myVideo.get(0).buffered.end(0) / myVideo.get(0).duration * 100;
            $('#progressbar_load').css('width',(parseInt(cur_load).toString()+'%'));
        }).bind('play',function(){
            $('#loader').show();
        }).bind('pause',function(){
            mybutt.style.display='block';
        });

        myVideoJS.onended = function() {
            go_next();
        };
        if(edu.href!=='undefined'){
            body.append('<div onclick="adv_count_go()" style="position: absolute; z-index: 1000; top: 0; left: 0; padding: 0; margin:0; width: 100%; height: 93%"></div>');
        };
    }


}

//Идем дальше, куда-то :-)
function go_next() {
    show_loader(function(){
        if (go_on == false) {
            adv_count();
        }
    });

}

function show_loader(callback){
    $('#loader_window').show(function(){
        $('#loader').show(function(){
            callback();
        });
    });
}

function go_cabinet(){
    show_loader(function(){
        if (go_on == false) {
            dst = '/index.php?action = cabinet';
            adv_count();
        }
    });
}

function go_from_adv(){
    $("#progressbar").show();
    $("#advvideo").show();
    $("#advimage").hide();
    document.getElementById("advvideo").play();
    document.getElementById("butt").style.display="none";
    document.getElementById("advvideo").onended = function() {go_next();}
}

//Засчитываем показ
function adv_count() {
    if (go_on == false) {
        go_on = true;
        myedu.postmyadv(false);
    }
}
//Засчитываем показ и переход
function adv_count_go() {
    show_loader(function(){
        if (go_on == false) {
            go_on = true;
            myedu.postmyadv(true);
        }
    });
}

//Запускаем счетчик
function startCountdown() {
    if ((g_iCount - 1) >= 1) {
        g_iCount = g_iCount - 1;
        document.getElementById('numberCountdown').innerHTML = g_iCount.toString();
        if (g_iCount < 11){

        }
        mytimer = setTimeout('startCountdown("thumbnail")', 1000);
    }else{
        if ((g_iCount - 1) >= 0){
            g_iCount = g_iCount - 1;
            document.getElementById('numberCountdown').innerHTML = g_iCount.toString();
            mytimer = setTimeout('startCountdown("thumbnail")', 1000);
        }
        if (go_on != true){
            go_next();
        }
    }

    if(((duration-g_iCount)>=8) && can_go==false){
        var clock = document.getElementById('clock_el');
        clock.src='/template/img/edu_free_but.png';
        clock.title='Пропустить';
        can_go = true;
    }
}
//Размер экрана для увеличения картинки
function GetScreenSize() {
    var x,y;
    if (window.innerHeight) {
        x = self.innerWidth;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        x = document.documentElement.clientWidth;
    } else if (document.body) {
        x = document.body.clientWidth;
    }

    if (window.innerHeight) {
        y = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        y = document.documentElement.clientHeight;
    } else if (document.body) {
        y = document.body.clientHeight;
    }
    return {'width':x,'height':y};
}
//Увеличние кнопок
function resize_buttons(){
    if (document.getElementById('footer') == undefined)
        return false;
    var footer_height = document.getElementById('footer').offsetHeight;
    var clock = document.getElementById('clock_el');
    var dollar = document.getElementById('dollar_el');

    clock.style.width = footer_height - 4 + 'px';//(clock.offsetHeight)+'px';
    dollar.style.width = footer_height - 4 + 'px';//(dollar.offsetHeight)+'px';
    clock.style.height = footer_height - 4 + 'px';//(dollar.offsetHeight)+'px';
    dollar.style.height = footer_height - 4 + 'px';//(dollar.offsetHeight)+'px';

    document.getElementById('numberCountdown').style.lineHeight=footer_height+'px';
    return true;
}

//Увеличение картинки
function resize_main(jquery_element){
    var screen = GetScreenSize();
    if (screen.width > screen.height){
        jquery_element.css('height','10000px');
        jquery_element.css('width','auto');
    }else{
        jquery_element.css('width','10000px');
        jquery_element.css('height','auto');
    }
    jquery_element.css('max-height',screen.height*0.93+'px').css('max-width',screen.width+'px')
}


//Увеличение видео
function resize_video(jquery_element){
    var screen = GetScreenSize();
    if (screen.width > screen.height){
        jquery_element.css('height','10000px');
        jquery_element.css('width','100%');
    }else{
        jquery_element.css('width','10000px');
        jquery_element.css('height',screen.height*0.93+'px');
    }
    jquery_element.css('max-height',screen.height*0.93+'px').css('max-width',screen.width+'px')
}

//Проверка, в ифрейме ли
function ChkinIframe() {
    if (window.top != window.self){
        console.log('location = '+window.top.location);
        if (window.top.location.search)
            window.top.location.href = document.location.href+'&dst=' + dst;
        else
            window.top.location.href = document.location.href+'?dst=' + dst;
    }
}
/*
 //В случае, если вместо ссылки какая-херня была, будем отправлять на гугл
 function fn_check(){
 //setTimeout('document.location.href="http://google.com";',5000);
 }
 */
function chk_video(){
    var testEl = document.createElement( "video" ),
        mpeg4, h264, ogg, webm;
    if ( testEl.canPlayType ) {
        // Check for MPEG-4 support
        mpeg4 = "" !== testEl.canPlayType( 'video/mp4; codecs="mp4v.20.8"' );

        // Check for h264 support
        h264 = "" !== ( testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E"' )
            || testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ) );

        // Check for Ogg support
        ogg = "" !== testEl.canPlayType( 'video/ogg; codecs="theora"' );

        // Check for Webm support
        webm = "" !== testEl.canPlayType( 'video/webm; codecs="vp8, vorbis"' );

        if (mpeg4 || h264 || ogg || webm){
            return [mpeg4, h264, ogg, webm];
        }
    }
    return false;
}

function parse_get(){
    var a = window.location.search.substr(1).split('&');
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}