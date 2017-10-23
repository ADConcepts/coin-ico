
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

    /*require('sly-extended/dist/sly.js');*/
    //require('resources/assets/js/sly');


   //require('wowjs');
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

    /*timeline*/

    // -------------------------------------------------------------
    //   Smart Navigation
    // -------------------------------------------------------------

        var $frame  = $('#smart');
        var $slidee = $frame.children('ul').eq(0);
        var $wrap   = $frame.parent();

        // Call Sly on frame
        $frame.sly({
            itemNav: 'basic',
            smart: 1,
            activateOn: 'click',
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            startAt: 0,
            scrollBar: $wrap.find('.scrollbar'),
            scrollBy: 1,
            pagesBar: $wrap.find('.pages'),
            activatePageOn: 'click',
            speed: 300,
            elasticBounds: 1,
            easing: 'easeOutExpo',
            dragHandle: 1,
            dynamicHandle: 1,
            clickBar: 1,

            // Buttons
            forward: $wrap.find('.forward'),
            backward: $wrap.find('.backward'),
            prev: $wrap.find('.prev'),
            next: $wrap.find('.next'),
            prevPage: $wrap.find('.prevPage'),
            nextPage: $wrap.find('.nextPage')
        });


    });