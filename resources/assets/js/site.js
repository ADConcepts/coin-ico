
/*window._ = require('lodash');*/

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap-sass');
    require('jquery-countdown');
    // require('wowjs');
    const WOW = require('wowjs');

    window.wow = new WOW.WOW({
        live: false
    });
} catch (e) {}


/* Custom JS */
$(document).ready(function(){

    /*wowjs initialization*/
    window.wow.init();

    /*clock js*/

    $('.getting-started').countdown('2017/11/01', function(event) {
        /*$(this).html(event.strftime('%w weeks %d days %H:%M:%S'));*/
        $(this).html(event.strftime('%d : %H : %M'));
    });

    /* clock js end */

});