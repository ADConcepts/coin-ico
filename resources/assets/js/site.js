
/*window._ = require('lodash');*/

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.$ = window.jQuery = require('jquery');

    /*require('bootstrap-sass');*/
    require('jquery-countdown');
    var moment = require('moment-timezone');

    /*require('sly-extended/dist/sly.js');*/
    //require('resources/assets/js/sly');


   //require('wowjs');
    const WOW = require('wowjs');

    window.wow = new WOW.WOW({
        live: false,
        boxClass:     'wow',      // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset:       0,          // distance to the element when triggering the animation (default is 0)
        mobile:       false        // trigger animations on mobile devices (true is default)
    });

    window.bigdecimal = require("bigdecimal");
} catch (e) {}


/* Custom JS */
$(document).ready(function(){

    /*wowjs initialization*/
    window.wow.init();

    /*clock js*/
    var finalDate = new Date(window.counterEndDate);
    console.log(finalDate);

    $('.getting-started').countdown(finalDate) .on('update.countdown', function(event) {
        $(this).html(event.strftime('%n : %H : %M : %S'));
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

         /*------------------*/
        /*-- register form--*/


    $(document).ready(function () {

        var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn');

        allWells.hide();

        navListItems.click(function (e) {
            e.preventDefault();
            var $target = $($(this).attr('href')),
                $item = $(this);

            if (!$item.hasClass('disabled')) {
                navListItems.removeClass('btn-success').addClass('btn-default');
                $item.addClass('btn-success');
                allWells.hide();
                $target.show();
                $target.find('input:eq(0)').focus();
            }
        });

        allNextBtn.click(function () {
            var curStep = $(this).closest(".setup-content"),
                curStepBtn = curStep.attr("id"),
                nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
                curInputs = curStep.find("input[type='text'], input[type='email'], input[type='password']"),
                isValid = true;

            /*$(".form-group").removeClass("has-error");*/
            for (var i = 0; i < curInputs.length; i++) {
                if (!curInputs[i].validity.valid) {
                    isValid = false;
                    $(curInputs[i]).closest(".form-group").addClass("has-error");
                }
            }

            if (isValid) nextStepWizard.removeAttr('disabled').removeClass('disabled').trigger('click');
        });

        $('div.setup-panel div a.btn-success').trigger('click');

        $('#terms').on('click', function(){
            if($(this). prop("checked") == true){
                $('#submit').attr("disabled", false);;
            } else {
                $('#submit').attr("disabled", true);
            }
        });
    });
    
});