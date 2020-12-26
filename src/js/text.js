(function ($) {
    $.alerts = {
        verticalOffset: -75,
        horizontalOffset: 0,
        repositionOnResize: true,
        overlayOpacity: .6,
        overlayColor: '#000',
        draggable: true,
        okButton: '확인',
        cancelButton: '취소',
        dialogClass: null,
        alert: function (message, title, callback) {
            if (title == null) title = 'Alert';
            $.alerts._show(title, message, null, 'alert', function (result) {
                if (callback) callback(result);
            });
        },
        confirm: function (message, title, callback) {
            if (title == null) title = 'Confirm';
            $.alerts._show(title, message, null, 'confirm', function (result) {
                if (callback) callback(result);
            });
        },
        prompt: function (message, value, title, callback) {
            if (title == null) title = 'Prompt';
            $.alerts._show(title, message, value, 'prompt', function (result) {
                if (callback) callback(result);
            });
        },
        load: function (message, title, callback) {
            if (title == null) title = 'Load';
            $.alerts._show(title, message, null, 'load', function (result) {
                if (callback) callback(result);
            });
        },
        _show: function (title, msg, value, type, callback) {
            $.alerts._hide();
            $.alerts._overlay('show');
            $("BODY").append(
                '<div id="popup_container">' +
                //'<h1 id="popup_title"></h1>' +
                '<p class="layerClose"><a href="#none"></a></p>' +
                '<div id="popup_content">' +
                '<div id="popup_message"></div>' +
                '</div>' +
                '</div>');

            if ($.alerts.dialogClass) $("#popup_container").addClass($.alerts.dialogClass);
            var pos = 'fixed';
            $("#popup_container").css({
                position: pos,
                zIndex: 99999,
                padding: 0,
                margin: 0
            });
            $("#popup_title").text(title);
            $("#popup_content").addClass(type);
            $("#popup_message").text(msg);
            $("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />'));
            $("#popup_container").css({
                minWidth: $("#popup_container").outerWidth(),
                maxWidth: $("#popup_container").outerWidth()
            });
            $.alerts._reposition();
            $.alerts._maintainPosition(true);
            switch (type) {
                case 'alert':
                    $("#popup_message").after('<div id="popup_panel"><a href="#none" class="popup_ok">' + $.alerts.okButton + '</a></div>');
                    $(".popup_ok").click(function () {
                        $.alerts._hide();
                        callback(true);
                    });
                    $(".popup_ok").focus().keypress(function (e) {
                        if (e.keyCode == 13 || e.keyCode == 27) $(".popup_ok").trigger('click');
                    });
                    $('.layerClose a').on('click', function () {
                        $(".popup_ok").trigger('click');
                    })
                    break;
                case 'confirm':
                    $("#popup_message").after('<div id="popup_panel"><a href="#none" class="popup_ok">' + $.alerts.okButton + '</a> <a href="#none" class="popup_cancel">' + $.alerts.cancelButton + '</a></div>');
                    $(".popup_ok").click(function () {
                        $.alerts._hide();
                        if (callback) callback(true);
                    });
                    $(".popup_cancel, .layerClose").click(function () {
                        $.alerts._hide();
                        if (callback) callback(false);
                    });
                    $(".popup_ok").focus();
                    $(".popup_ok, .popup_cancel").keypress(function (e) {
                        if (e.keyCode == 13) $(".popup_ok").trigger('click');
                        if (e.keyCode == 27) $(".popup_cancel").trigger('click');
                    });
                    $('.layerClose a').on('click', function () {
                        $(".popup_cancel").trigger('click');
                    })
                    break;
                case 'prompt':
                    $("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" class="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" class="popup_cancel" /></div>');
                    $("#popup_prompt").width($("#popup_message").width());
                    $(".popup_ok").click(function () {
                        var val = $("#popup_prompt").val();
                        $.alerts._hide();
                        if (callback) callback(val);
                    });
                    $(".popup_cancel").click(function () {
                        $.alerts._hide();
                        if (callback) callback(null);
                    });
                    $("#popup_prompt, .popup_ok, .popup_cancel").keypress(function (e) {
                        if (e.keyCode == 13) $(".popup_ok").trigger('click');
                        if (e.keyCode == 27) $(".popup_cancel").trigger('click');
                    });
                    if (value) $("#popup_prompt").val(value);
                    $("#popup_prompt").focus().select();
                    break;
                case 'load':
                    $("#popup_message").after('<div id="popup_panel"></div>');
                    $(".popup_ok").click(function () {
                        $.alerts._hide();
                        callback(true);
                    });
                    $(".popup_ok").focus().keypress(function (e) {
                        if (e.keyCode == 13 || e.keyCode == 27) $(".popup_ok").trigger('click');
                    });
                    break;
            }
        },
        _hide: function () {
            $("#popup_container").remove();
            $.alerts._overlay('hide');
            $.alerts._maintainPosition(false);
        },
        _overlay: function (status) {
            switch (status) {
                case 'show':
                    $.alerts._overlay('hide');
                    $("BODY").append('<div id="popup_overlay"></div>');
                    $("#popup_overlay").css({
                        position: 'absolute',
                        zIndex: 99998,
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: $(document).height(),
                        background: $.alerts.overlayColor,
                        opacity: $.alerts.overlayOpacity
                    });
                    break;
                case 'hide':
                    $("#popup_overlay").remove();
                    break;
            }
        },
        _reposition: function () {
            var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
            var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;
            $("#popup_container").css({
                top: top + 'px',
                left: left + 'px'
            });
            $("#popup_overlay").height($(document).height());
        },
        _maintainPosition: function (status) {
            if ($.alerts.repositionOnResize) {
                switch (status) {
                    case true:
                        $(window).bind('resize', $.alerts._reposition);
                        break;
                    case false:
                        $(window).unbind('resize', $.alerts._reposition);
                        break;
                }
            }
        }
    }
    jAlert = function (message, title, callback) {
        $.alerts.alert(message, title, callback);
    }
    jConfirm = function (message, title, callback) {
        $.alerts.confirm(message, title, callback);
    };

    jPrompt = function (message, value, title, callback) {
        $.alerts.prompt(message, value, title, callback);
    };
    jLoad = function (message, title, callback) {
        $.alerts.load(message, title, callback);
    }
})(jQuery);
var HideAlert = function () {
    $.alerts._hide();
}

function closeAllSelect(elmnt) {
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

$(document).ready(function () {
    var x, i, j, l, ll, selElmnt, a, b, c ;
    x = document.getElementsByClassName("custom-select");
    
    l = x.length;

    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        a = document.createElement("DIV");
        input1 = document.createElement("input");
        a.setAttribute("class", "select-selected");       
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");


        for (j = 1; j < ll; j++) {
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {                
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            try { y[k].removeAttribute("class"); } catch (e) { }
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        
        a.addEventListener("click", function (e) {
            // disabled 속성이 있다면 이벤트 무시
            if ($(this).parent().attr("disabled") != undefined) return;
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
  
  
    document.addEventListener("click", closeAllSelect);
    //  20-11-03 ** 차트 쪽 일간, 주간, 월간 
    $('.chart_tab  ul li').click(function () {
        var tab_id = $(this).attr('data-tab');
        $('.chart_tab  ul li').removeClass('active');
        $('.conBox').removeClass('active');

        $(this).addClass('active');
        $("#" + tab_id).addClass('active');
    });
    $('.select-items > div ,.pay_phone .select-items > div').each(function () {
        if ($(this).hasClass('same-as-selected')) {
            $(this).parents('.custom-select2').children('.select-selected').addClass('on');
            $(this).parents('.custom-select2').find('.value_del').css({ 'display': 'inline-block' });
        } else {
            $(this).parents('.custom-select2').find('.value_del').css({ 'display': 'none' });
            $(this).parents('.custom-select2').children('.select-selected').removeClass('on');
        }
    });
    $('.menuBt').on('click', function () {
        $('.layerDim').fadeIn();
        $('.mobGnb .inner').animate({
            'right': '0'
        }, $(window).width());
        $('body').addClass('fix_pos');
        return false;
    });
    $('.menuClose').on('click', function () {
        $('.layerDim').fadeOut(function () {
            $('.mGnbSub').hide();
        });
        $('.mobGnb .inner').animate({
            'right': '-100%'
        }, $(window).width());
        $('body').removeClass('fix_pos');
        return false;
    });
    $('.mGnb>li>a').on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active').next().slideUp();
        }
        else {
            $(this).addClass('active').next().slideDown();
        }
        return false;
    })

    $('.mypageMenu a').on('mouseover', function () {
        $('.mypageMenu .line').stop().animate({
            'width': $(this).find('span').width() + 'px',
            'left': $(this).find('span').offset().left + 'px'
        }, 150, 'swing');
    });
    $('.mypageMenu').on('mouseleave', function () {
        out();
    });

    $('.img_area').on('click', function () {
        $('.tooltip').fadeIn();
        return false;
    });

    $('.switch').on('click', function () {
        $(this).toggleClass('on');
        return false;
    });
    function textaChk() {
        $('textarea').each(function () {
            if ($(this).val() != '') {
                $(this).addClass('on');
            }
            else {
                $(this).removeClass('on');
            }
        });
    }
    function inputChk() {
        $('input').each(function () {
            if ($(this).attr('type') == 'text' || $(this).attr('type') == 'password' || $(this).attr('type') == 'tel') {
                if ($(this).val() != '') {
                    $(this).addClass('on');
                    $(this).next('.value_del').css({ 'display': 'inline-block' });
                } else {
                    $(this).removeClass('on');
                    $(this).next('.value_del').css({ 'display': 'none' });
                }
            }
        })
    };
    inputChk();
    textaChk();
    $(document).on('change ', 'textarea', function () {
        textaChk();
    });
    $(document).on('change', 'input', function () {
        inputChk();
    });

    $('.email .select-selected ,.pay_phone .select-selected,.phone1 .select-selected').on('click', function () {
        if ($(this).next().hasClass('same-as-selected')) {
            $(this).addClass('on');
        }
        else {
            $(this).addClass('on');
            $(this).next().children('div').eq(0).addClass('same-as-selected');
        }
    });
    $('.select-items > div').each(function () {
        if ($(this).hasClass('same-as-selected')) {
            $(this).parents('.custom-select2').find('.select-selected').addClass('on');
            //  $(this).parents('.custom-select2').find('.value_del').css({ 'display': 'inline-block' });
        } else {
            //  $(this).parents('.custom-select2').find('.value_del').css({ 'display': 'none' });
            $(this).parents('.custom-select2').find('.select-selected').removeClass('on');

        }
    });
    $('.designInner ul li a, .skin li>a').on('click', function () {
        var data = $(this).attr("data-skin");
        if (data == null || data == undefined) {
            // check skin
            var skin = $("ul.skin a.active").attr("data-skin");
            if (skin > 1) { return; }
        }
        $(this).addClass('active').parent().siblings().find('a').removeClass('active');
        return false;
    });

    $(document).on('click', function (e) {
        if (!$('.tooltip, .tooltip *').is(e.target)) {
            $('.tooltip').fadeOut();
        }
    });
    $('.email .select-items').each(function () {
        $(this).find('> div').on('click', function () {
            //$(this).parents('.custom-select').find('select option').eq($(this).parents('.custom-select').find('.same-as-selected').index() + 1).prop('selected', true);
            if ($(this).parents('.custom-select').find('select').val() == 'it') {
                if ($(".addEmail").length > 0) return;
                $(this).parents('.inWrap').after('<input type="text" class="addEmail" style="margin-top:10px;"/>');

            } else {
                $(this).parents('.inWrap').next('.addEmail').remove();

            }
        })
    });

    if ($('.datepicker').length >= 0) {
        $(".datepicker").each(function () {
            $(this).datepicker({
                dateFormat: 'yy-mm-dd',
                showMonthAfterYear: true,
                yearSuffix: '년',
                monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                autoSize: true,
                buttonImage: "/contents/img/cal.png",
                onSelect: function () {
                    if ($(this).val() != '') {
                        $(this).addClass('on');
                        $(this).next('.value_del').css({ 'display': 'inline-block' });
                    } else {
                        $(this).removeClass('on');
                        $(this).next('.value_del').css({ 'display': 'none' });
                    }
                }
            });
        });
    };
    if ($('.datepicker2').length >= 0) {
        $(".datepicker2").each(function () {
            $(this).datepicker({
                showMonthAfterYear: true,
                yearSuffix: '년',
                monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                buttonImage: "/contents/img/cal.png",
                //  showOn: "button",
                buttonImageOnly: true,

            });
        });
    };

    $('.icoFile').each(function () {
        var fileTarget = $(this);
        fileTarget.on('change', function () {
            if (window.FileReader) {
                var filename = $(this)[0].files[0].name;
            } else {
                var filename = $(this).val().split('/').pop().split('\\').pop();
            }
            fileTarget.parents('.clear').find('.icoFileName').text(filename).addClass('on');
            fileTarget.parent().addClass('fileOn');
        });

        $(this).parent().find('.delete_file').on('click', function () {
            fileTarget.parents('.clear').find('.icoFileName').text('선택된 파일이 없습니다').removeClass('on');
            fileTarget.parent().removeClass('fileOn');
            fileTarget.val('');
        });
    });
    var sc = false;
    function scrollBt() {
        if ($(window).scrollTop() > 30 && sc == true) {
            $('.scrollTop').fadeIn('fast');
            $('.wrap').eq(0).prepend('<div class="slide_up" style="height:60px; width:100%;display:block;"></div>').slideDown('fast');
            $('.header_wrap').addClass('fix_had').slideDown('200');
            sc = false;
        } else if ($(window).scrollTop() <= 30 && sc == false) {
            $('.scrollTop').fadeOut('fast');
            $('.wrap > .slide_up').remove();
            $('.header_wrap').removeClass('fix_had').slideDown('200');
            sc = true;
        }
    };
    scrollBt();
    $(window).on('scroll', function () {
        scrollBt();
    })
    $('.scrollTop').on('click', function () {
        $('html, body').animate({
            scrollTop: 0
        }, $(window).height());
        return false;
    });

    $('.wrapInner').eq(0).append('<div class="layerDim"></div>');
    $('.bg_pic_color li a').click(function () {
        colorSel();
    });

    $('.sp-choose').click(function () {
        var pic_bgcolor = $('.sp-thumb-active').attr('title');
        $(".previewPop2 #frame_2").contents().find(".wrap").css({ 'background-color': pic_bgcolor });
        fontCol();
    });
});
function inputTimeColon(time) {
    var replaceTime = time.value = time.value.replace(/\D/g, '');
    
    if (replaceTime.length >= 4 && replaceTime.length < 5) {
        var hours = replaceTime.substring(0, 2);
        var minute = replaceTime.substring(2, 4);
        //// 시간은 24:00를 넘길 수 없게 세팅
        //if (hours + minute > 2359) {
        //    alert("시간 입력이 올바르지 않습니다.");
        //    time.value = "";
        //    return false;
        //}
        //// 분은 60분을 넘길 수 없게 세팅
        //if (minute > 60) {
        //    alert("시간 입력이 올바르지 않습니다.");
        //    time.value = hours + "";
        //    return false;
        //}
        // 시간은 24:00를 넘길 수 없게 세팅
        if (hours + minute > 2359 || minute > 60) {
            alert("시간 입력이 올바르지 않습니다.");
            time.value = "";
            return false;
        }
        time.value = hours + ":" + minute;
    } else if (replaceTime.length < 4) {
      //  alert("시간을 입력해 주세요.");
    }
}
function skin_height() {
    var bodyH = $('.skin_allrap').parent().outerHeight();
    var allH = $('.skin_allrap').outerHeight();
    var bgH = $('.bg_area').outerHeight();
    var contentsH = $('.contents').outerHeight();
    var linkH = $('.link_item').outerHeight();
    //var linkcount = $('.link_item').children();     
    if (linkH != 0) {
        $('.bg_area').css({ 'height': (contentsH) + 'px' });
        $('.skin_autumn').css({ 'height': bodyH + 'px' });
        //console.log('111높이높이' + bodyH );        
    }  
    else {
        $('.bg_area').css({ 'height': (allH - 100) + 'px' });        
        //console.log('222높이' + allH);
    }
}

$(window).on('load', function () {
    out();
    colorSel();
  skin_height();
});

$(window).resize(function () {
   skin_height();  
});
function showLoading() {
    /// lockView();
    $(".loading_pop").css("display", "block");
};
// 로딩레이어 닫기
function hideLoading() {
    $(".loading_pop").css("display", "none");
    // unlockView();
};

function out() {
    if ($('.line').length > 0) {
        try {
            $('.mypageMenu .line').stop().delay(300).animate({
                'width': $('.mypageMenu a.active').find('span').width() + 'px',
                'left': $('.mypageMenu a.active').find('span').offset().left + 'px'
            }, 150);
        } catch (e) { }
    };
};
function colorSel() {
    var bgcolor = $('.bg_pic_color li a.active').css('background-color');
    var bfont_colo = $('.font_pic_color li a.active').css('background-color');
    $(".previewPop2 #frame_2").contents().find(".wrap").css({ 'background-color': bgcolor });

    fontCol();
}
function fontSelW() {
    $(".previewPop2 #frame_2").contents().find(".wrap").removeClass('black_font');
    $(".previewPop2 #frame_2").contents().find(".wrap").addClass('white_font');
}
function fontSelB() {
    $(".previewPop2 #frame_2").contents().find(".wrap").removeClass('white_font');
    $(".previewPop2 #frame_2").contents().find(".wrap").addClass('black_font');
}
function fontCol() {
    if ($('.font_pic_color li a.active').hasClass('chkBlack')) {
        $(".previewPop2 #frame_2").contents().find(".wrap").addClass('white_font');
    } else {
        $(".previewPop2 #frame_2").contents().find(".wrap").addClass('black_font');
    }
}



function layerOpen(obj, obj2) {
  
    var layer = $('.' + obj);
    setTimeout(function () {
        $('.mobGnb .inner').animate({
            'right': '-100%'
        }, $(window).width(), function () {
            $('.mGnbSub').hide();
        });
    }, 1000)
    fontCol();
    skin_height();
    layer.fadeIn();

    $('.layerDim').fadeIn();

    return false;
};

function layerClose(obj, obj2) {
    $(".previewPop2 #frame_2").contents().find(".wrap").removeClass('white_font');
    $(".previewPop2 #frame_2").contents().find(".wrap").removeClass('black_font');
    $('.' + obj).fadeOut();
    $('.layerDim').fadeOut();

    return false;
};

//var tag = document.createElement('script');
//tag.src = "https://www.youtube.com/iframe_api";
//var firstScriptTag = document.getElementsByTagName('script')[0];
//firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//var player;
//function onYouTubeIframeAPIReady() {
//    player = new YT.Player('player', {
//        width: 1280,
//        height: 720,
//        host: 'https://www.youtube.com',
//        videoId: 'p4TLvQG8OCo',
//        playerVars: {
//            'autoplay': 0,                    // 자동재생	
//            'cc_load_policy': 0,           // 자막 0 : on, 1 : off	
//            'controls': 0,                 // 동영상 플레이어 컨트롤 표기	
//            'disablekb': 0,           // 키보드 컨트롤 사용 중지	
//            'rel': 0

//        },
//        events: {
//            'onReady': onPlayerReady,
//            // 'onPlaybackQualityChange': onPlayerPlaybackQualityChange,	
//            'onStateChange': onPlayerStateChange
//            //  'onError': onPlayerError  // https://youtu.be/ijydBMZdX8k	
//        }
//    });

//}
//function onPlayerReady(event) {
//    event.target.setVolume(50);
//    event.target.playVideo();
//}
//var done = false;
//function onPlayerStateChange(event) {
//    if (event.data == YT.PlayerState.PLAYING && !done) {
//        setTimeout(stopVideo, 6000);
//        done = true;
//    }
//}
//function stopVideo() {
//    player.stopVideo();
//}

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function getURLParameter(url, name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || "";
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

$(document).ready(function () {

    $("input:text[number]").on("keyup", function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ""));
    });
    //유튜브 링크 시간 설정 시,
    $("input:text[time]").keyup(function () {
        var input = $(this).val();

        if (event.keyCode != 46 && event.keyCode != 8) {
            var values = input.split(':').map(function (v) {
                return v.replace(/\D/g, '')
            });
            var output = values.map(function (v, i) {
                return ((i == 0 && v.length == 2) ? (v + ':') : v);
            });
            this.value = output.join('').substr(0, 5);

            if ((input.indexOf(":") > 0 && input.length == 5) ||
                (input.indexOf(":") < 0 && input.length >= 3)
            ) {
                var datetimePattern = /^([0-5][0-9]):([0-5][0-9])$/;
                if (!datetimePattern.test($(this).val()) && $(this).val()) {
                    //alert('시간 입력이 올바르지 않습니다. 시간을 형식에 맞게 입력해주세요.\n예) 08:00, 14:35');
                    alert("시간 입력이 올바르지 않습니다. 60분 이내의 시간까지 입력 가능합니다.");
                    $(this).val('');
                }
            }
        }
    });

    $("input:text[timex]").keyup(function () {
        var input = $(this).val();

        if (event.keyCode != 46 && event.keyCode != 8) {
            var values = input.split(':').map(function (v) {
                return v.replace(/\D/g, '')
            });
            var output = values.map(function (v, i) {
                return ((i == 0 && v.length == 2) ? (v + ':') : v);
            });
            this.value = output.join('').substr(0, 5);

            if ((input.indexOf(":") > 0 && input.length == 5) ||
                (input.indexOf(":") < 0 && input.length >= 3)
            ) {
                var datetimePattern = /^([0-9][0-9]):([0-9][0-9])$/;
                if (!datetimePattern.test($(this).val()) && $(this).val()) {
                    $(this).val('00:00');
                }

                inputTimeColon(this);
            }            
        }
    });

});