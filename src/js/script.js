// If JavaScript is enabled, remove a class 'no-js' and replace with a class 'js'
jQuery('html').removeClass('no-js').addClass('js');

// Run the code after the DOM has been fully loaded
jQuery(document).ready(function( $ ) {

	/* ---------------------------------------------------------------------- */
	/*	"Global" Varibles & Functions
	/* ---------------------------------------------------------------------- */

	var $window = $(window),
		$html   = $('html'),
		$body   = $('body'),
		lang    = $html.attr('lang');

	 // Convert pixels to ems
	function convertPxToEm( value, withUnit ) {

		var baseFontSize = parseFloat( $html.css('font-size') );

		if( typeof value !== 'undefined' && value )
			return parseFloat( value ) / baseFontSize + (typeof withUnit === 'undefined' || withUnit ? 'em' : '');

	}

	// Visually inform user that browser is doing something (e.g. an AJAX call)
	function setLoader( $elem, on ) {

		if( typeof $elem === 'undefined' )
			return;

		if( typeof on === 'undefined' || on )
			$elem.addClass('loading');
		else
			$elem.removeClass('loading');

	}

	/* end "Global" Varibles & Functions */

});