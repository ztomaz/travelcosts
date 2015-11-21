/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

$(".login").click(function () {

    var $content = $(".login_content");
    //getting the next element
    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    var docElem = document.documentElement,
		header = document.querySelector( '.navbar-fixed-top' );
	
	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

    if ($content.is(':hidden')){
        classie.add( header, 'navbar-shrink' );
	    $("html, body").animate({ scrollTop: 0 }, "slow");}
    $content.slideToggle(500, function () {
       if (!($content.is(':visible'))){
           var sy = scrollY();
		if ( sy <= 300 ) {
            classie.remove( header, 'navbar-shrink' );}
		}
        
    });
    
		


});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});
