
// used for all dialogs and pop-up screens
window.last_dialog_zindex = 15000;

function custom_dialog(title, content, width, buttons, close_function){
    // display a dialog with arbitrary content and few different button options
    // title: dialog title, text only
    // content: text or jQuery object
    // width: width of dialog in pixels, if null, 500 is default
    // buttons is an object that can contain the following:
    //     yes: <yes button text>
    //     yes_action: <function that is executed when yes is clicked>
    //     no: <no button text>
    //     no_action: <function that is executed when no button is clicked>
    //     ok: <ok button text>
    //     ok_action: if null, only close the dialog
    //     auto_close: if false, do not bind close_dialog on buttons

    // this function binds escape and enter keys for close/no and enter for yes

    var container = $("<div>", {'class': 'custom-dialog-container'});
    var title_container = $("<div>", {'class': 'custom-dialog-title'});
    var dialog = $("<div>", {'class': 'custom-dialog-content'});
    var shadow = $("<div>", {'class': 'fullscreen-shadow'});
    var close_button = $("<div>", {'class': 'custom-dialog-close-button hoverable'});

    var body = $("body");

    if(!width) width = 500; // a 'reasonable' default

    title_container.text(title);
    title_container.append(close_button);
    container.append(title_container);
    container.append(dialog);

    // content can be a jquery object or just some text
    var content_parent = null;
    if(content instanceof jQuery){
        content_parent = content.parent();
    }
    else{
        content = $("<div>").text(content);
    }

    content.show();
    dialog.append(content);

    // the new pop-up is above everything older
    window.last_dialog_zindex += 1;

    dialog.width(width);
    container.css("z-index", window.last_dialog_zindex+1);

    shadow
        .css("z-index", window.last_dialog_zindex)
        .hide()
        .appendTo(body)
        .fadeIn(function(){ container.appendTo(body); });

    // add a function to the dialog for use outside this function
    var unique_id = Math.random().toString();
    var ok_message = "custom-dialog-ok-" + unique_id;
    var cancel_message = "custom-dialog-cancel-" + unique_id;
    var esc_message = "custom-dialog-esc-" + unique_id;

    close = function() {
        content.close_dialog();
    };

    content.close_dialog = function(){
        shadow.fadeOut("fast", function(){
            shadow.remove();
        });

        content.hide().detach();

        if(content_parent) content.appendTo(content_parent);

        container.remove();

        window.keyboard.remove(ok_message);
        window.keyboard.remove(cancel_message);
        window.keyboard.remove(esc_message);
    };

    close_button.unbind().click(content.close_dialog);

    window.keyboard.add(esc_message, 'escape', content.close_dialog);

    // clicks, keys and document events
    function bind_key(button, action, auto_close, message_code, key_code){
        function on_click(){
            if(action) action();
            if(auto_close != false) content.close_dialog();
        }

        button.unbind();
        button.click(on_click);

        window.keyboard.add(ok_message, key_code, on_click);
    }

    function bind_ok_key(button, action, auto_close){
        bind_key(button, action, auto_close, ok_message, 'enter');
    }

    function bind_cancel_key(button, action, auto_close){
        bind_key(button, action, auto_close, cancel_message, 'escape');
    }

    // buttons is an object that can contain the following:
    // yes: <yes button text>
    // yes_action: <function that is executed when yes is clicked>
    // no: <no button text>
    // no_action: <function that is executed when no button is clicked>
    // ok: <ok button text>
    // ok_action: if null, only close the dialog
    // auto_close: if false, do not bind close_dialog on buttons
    if(buttons){
        var footer = $("<div>", {'class': 'custom-dialog-footer'});
        var button_attrs = {type: 'button', 'class': 'hoverable'};

        container.append(footer);

        if(buttons.ok){
            var ok_button = $("<input>", button_attrs);
            ok_button.addClass("ok");
            ok_button.attr('value', buttons.ok);
            footer.append(ok_button);

            // ok buttons closes the dialog and executes ok_action, if it's there
            bind_ok_key(ok_button, buttons.ok_action, buttons.auto_close);
        }
        else if(buttons.yes && buttons.no){
            var yes_button = $("<input>", button_attrs);
            yes_button.addClass("ok");
            yes_button.attr("value", buttons.yes);

            bind_ok_key(yes_button, buttons.yes_action, buttons.auto_close);

            var no_button = $("<input>", button_attrs);
            no_button.addClass("cancel");
            no_button.attr("value", buttons.no);

            bind_cancel_key(no_button, buttons.no_action, buttons.auto_close);

            footer.append(no_button);
            footer.append(yes_button);
        }
    }
    else{
        // if buttons is null, hide all buttons on this dialog, even the close button
        close_button.hide();
    }
}

function error_message(title, message){
    return custom_dialog(title, message, 300, {ok: gettext("OK") });
}

function confirmation_dialog(title, text, yes_action, no_action){
    return custom_dialog(title, text, 500,
        {yes: gettext("Yes"), yes_action: yes_action,
         no: gettext("No"), no_action: no_action});
}


function escape(text){
    if(!text) return ""; // avoid writing "undefined"

    // kudos:
    // http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    return String(text).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

function email_valid(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function get_size(element){ // get computed element size before it's inserted into document
    element.hide();
    $("body").append(element); // add to DOM, in order to read the CSS property
    try {
        return [element.outerWidth(true), element.outerHeight(true)];
    } finally {
        element.remove(); // and remove from DOM
    }
}

function get_url_hash() {
    return window.location.hash.replace(/^#/,'');
}

function removeHash () {
    history.pushState("", document.title, window.location.pathname + window.location.search);
}

//
// manipulation of arrays of objects:
// data is an array of objects, each object has the 'id' property
// (and other properties as well)
//
function remove_from_array(array, index){
    // kudos: http://stackoverflow.com/questions/5767325/remove-specific-element-from-an-array
    if(index > -1) {
        array.splice(index, 1); // original array is modified
        return true;
    }
    else return false;
}


// numbers, date and time formatting
function get_number(string, separator){
    // receives a string with number with decimal separator <separator> and returns BigNumber
    // bignumber: https://github.com/MikeMcl/bignumber.js/
    try{
        return Big(string.replace(separator, "."));
    }
    catch(error){
        return null;
    }
}


function display_number(number, separator, decimal_places){
    // receives a BigNumber as a parameter and returns a string with user specified decimal separator
    if(number) return number.toFixed(decimal_places).replace('.', separator);
    else return '';
}

// a few number shortcuts
function dn(number, g){
    return display_number(number, g.config.separator, g.config.decimal_places);
}


function check_date(d, m, y){
    if(isNaN(d)) return false;
    if(isNaN(m)) return false;
    if(isNaN(y)) return false;

    // check all numbers (achtung, months are 0-based)
    // number of months in a year
    if((m < 0) || (m > 11)) return false;
     // number of days in a month
    else if((d < 1) || (d > 31)) return false;
    // months with 30 days
    else if(((m == 3) || (m == 5) || (m == 8) || (m == 10)) && (d > 30)) return false;
    // leap years & Februarys
    else if((m == 1) && (((y % 400) == 0) || ((y % 4) == 0)) && ((y % 100) != 0) && (d > 29)) return false;
    else if((m == 1) && ((y % 100) == 0) && (d > 29)) return false;
    else return true;
}

function check_time(hours, minutes, seconds, any_value){
    if(isNaN(hours) || isNaN(minutes)) return false;

    if(!any_value && (hours < 0 || hours > 23)) return false;
    if(minutes < 0 || minutes > 59) return false;
    if(seconds < 0 || seconds > 59) return false;
    else return true;
}

function format_date(date, date_format){
    var dd = "00" + date.getDate();
    var mm = "00" + String(date.getMonth()+1);
    var yyyy = date.getFullYear();

    dd = dd.substring(dd.length-2);
    mm = mm.substring(mm.length-2);

    switch(date_format){
        default:
        case 'dd.mm.yyyy':
        case 'dd.mm.yy':
            return dd + "." + mm + "." + yyyy;
        case 'mm/dd/yyyy':
        case 'mm/dd/yy':
            return mm + '/' + dd + '/' + yyyy;
        case 'yyyy-mm-dd':
        case 'yy-mm-dd':
            return yyyy + '-' + mm + '-' + dd;
    }
}

function parse_date(date, date_format){
    if(!date) return null;

    var d, m, y;

    switch(date_format){
        default:
        case 'yy-mm-dd':
        case 'yyyy-mm-dd':
            y = date.substring(0, 4);
            m = date.substring(5, 7);
            d = date.substring(8);
            break;
        case 'dd.mm.yy':
        case 'dd.mm.yyyy':
            d = date.substring(0, 2);
            m = date.substring(3, 5);
            y = date.substring(6);
            break;
        case 'mm/dd/yy':
        case 'mm/dd/yyyy':
            m = date.substring(0, 2);
            d = date.substring(3, 5);
            y = date.substring(6);
            break;
    }

    d = parseInt(d, 10);
    m = parseInt(m, 10) - 1; // months are zero-based
    y = parseInt(y, 10);

    if(check_date(d, m, y)) return new Date(y, m, d);
    else return null;
}

function today(date_format){
    var date = new Date();
    return format_date(date, date_format);
}

function now(time_format){
    var now = new Date();
    return format_time(time_format, now.getHours(), now.getMinutes(), now.getSeconds());
}

function parse_time(format, time, any_value){
    var h24, ampm, seconds;

    // see what's to be read
    switch(format){
        case "hh:mm":
            h24 = true;
            ampm = false;
            seconds = false;
            break;
        case "hh:mm:ss":
            h24 = true;
            ampm = false;
            seconds = true;
            break;
        case "hh:mm AMPM":
            h24 = false;
            ampm = true;
            seconds = false;
            break;
        case "hh:mm:ss AMPM":
            h24 = false;
            ampm = true;
            seconds = true;
            break;
    }

    // split string at the space (if there's no space, it simply won't be split)
    var time_ap = time.split(" ");
    var t, ap, h, m, s;

    // if time format is am/pm, we need two elements in array
    if(ampm){
        if(time_ap.length != 2) return null;
        else ap = time_ap[1];
    }

    t = time_ap[0].split(":");

    if(seconds){
        if(t.length != 3) return null;
        else{
            h = t[0];
            m = t[1];
            s = t[2];
        }
    }
    else{
        if(t.length != 2) return null;
        else{
            h = t[0];
            m = t[1];
            s = "0";  // will be parsed to int later
        }
    }

    h = parseInt(h, 10);  // explicitly set decimal value or it will convert 07 to octal
    m = parseInt(m, 10);
    s = parseInt(s, 10);

    if(ap == "AM" && h > 12){
        h -= 12; // 12:xx am is actually 00:xx (whatever)
    }

    // if any_value is true, any hour is allowed, otherwise only up to 24:00
    if(!check_time(h, m, s, any_value)) return null;

    return {h:h, m:m, s:s};
}

function format_time(format, hours, minutes, seconds){
    // nothing to be done with negative numbers
    if(hours < 0 || minutes < 0 || seconds < 0) return "--:--";

    function str(n){
        if(n < 10) return "0" + n.toString();
        else return n.toString();
    }

    if(format == "hh:mm"){
        return str(hours) + ":" + str(minutes);
    }
    else if(format == "hh:mm:ss"){
        return str(hours) + ":" + str(minutes) + ":" + str(seconds);
    }
    else{
        // it's a format with AM/PM: if hours > 12, subtract and write PM, otherwise AM
        var ampm = "AM";

        if(hours > 12){
            ampm = "PM";
            hours -= 12;
        }

        if(format == "hh:mm:ss AMPM"){
            return str(hours) + ":" + str(minutes) + ":" + str(minutes) + " " + ampm;
        }
        else{
            return str(hours) + ":" + str(minutes) + " " + ampm;
        }
    }
}

function parse_datetime(date_format, time_format, date, time){
    var d = parse_date(date, date_format);
    if(!d) return null;

    var t = parse_time(time_format, time, false);
    if(!t) return null;

    d.setHours(t.h, t.m, t.s, 0);

    return d;
}

Keyboard = function(){
    // handles keyboard actions;
    // window.keyboard.add(event-id, key, handler)
    //   event-id: arbitrary unique id of event, (string)
    //   key: pre-defined keys (must be added in event under init section of this object
    //   handler: function that will be called when key is pressed

    var p = this;

    // stores custom event identifiers (like 'close-search' etc)
    p.stack = {};

    //
    // methods
    //
    p.add = function(eid, key, handler){
        // add an event id to escape stack
        if (key in p.stack) {
            p.stack[key].push(eid)
        } else {
            p.stack[key] = [eid];
        }

        // register the event
        $(document).on(eid, handler);
    };

    p.remove = function(eid, key){
        // removes event id from stack
        if (key in p.stack && p.stack[key].length > 0) {
            var i = p.stack[key].indexOf(eid);
            if(i > -1){
                remove_from_array(p.stack[key], i);
            }
        }
        // remove event binding
        $(document).unbind(eid);
    };

    //
    // init
    //
    // capture key
    $(document).keydown(function(e){
        if (e.keyCode == 27) { // escape
            if('escape' in p.stack && p.stack['escape'].length > 0){
                e.stopImmediatePropagation();
                $(document).trigger(p.stack['escape'].pop());
            }
        }
        else if(e.keyCode == 13) { // enter
            if('enter' in p.stack && p.stack['enter'].length > 0){
                e.stopImmediatePropagation();
                $(document).trigger(p.stack['enter'].pop());
            }
        }
    });
};

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }

    return "";
}

function valid(value, type, password_length) {
    var re;

    if (type == "email") {
        if (email_valid(value)) {
            return true;
        }
    }

    if (type == "not_empty") {
        if (value != "") {
            return true;
        }
    }

    // only letters and digits plus space
    if (type == "only_lds") {
        re = /^[\u00C0-\u1FFF\u2C00-\uD7FF\w0-9 ]+$/;
        return re.test(value);
    }

    // only letters, digits, dashes, commas and spaces
    if (type == "only_ldscd") {
        re = /^[\u00C0-\u1FFF\u2C00-\uD7FF\w0-9-, ]+$/;
        return re.test(value);
    }

    if (type == "only_digits") {
        re = /^[0-9]+$/;
        return re.test(value);
    }

    if (type == "only_letters") {
        re = /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]+$/;
        return re.test(value);
    }

    // only letters plus space
    if (type == "only_ls") {
        re = /^[\u00C0-\u1FFF\u2C00-\uD7FF\w ]+$/;
        return re.test(value);
    }

    if (type == "password") {
        re = /^.*(?=.{4,})(?=.*[a-zA-Z-_!#$%&? "]).*$/;
        return re.test(value);

    }

    if (type == "url") {
        // re = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
        re = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

        return re.test(value);
    }

    if (type == "decimal") {
        re = /^\d+\.?\d*$/;
        return re.test(value);
    }

    return false;
};

function click(key) {
    if (key == "esc") {
        var esc = $.Event("keydown", { keyCode: 27 });
        $("body").trigger(esc);
    }
}