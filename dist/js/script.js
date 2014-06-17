// If JavaScript is enabled, remove a class 'no-js' and replace with a class 'js'
jQuery('html').removeClass('no-js').addClass('js');

// Run the code after the DOM has been fully loaded
jQuery(document).ready(function( $ ) {

	/* ---------------------------------------------------------------------- */
	/*	Variables & Functions
	/* ---------------------------------------------------------------------- */

	var $window = $(window),
		$html   = $('html'),
		$body   = $('body'),
		lang    = $html.attr('lang');

	/**
	 * Convert pixels to ems
	 *
	 * @param {Number|String} value
	 * @param {Boolean} [withUnit]
	 * @return {String}
	 */
	function convertPxToEm( value, withUnit ) {

		var baseFontSize = parseFloat( $html.css('font-size') );

		if( typeof value !== 'undefined' && value )
			return parseFloat( value ) / baseFontSize + (typeof withUnit === 'undefined' || withUnit ? 'em' : '');

	}

	/**
	 * Visually inform user that browser is doing something (e.g. an AJAX call)
	 *
	 * @param {jQuery} $elem
	 * @param {Boolean} [status]
	 */
	function setLoader( $elem, status ) {

		if( typeof $elem === 'undefined' )
			return;

		if( typeof status === 'undefined' || status )
			$elem.addClass('loading');
		else
			$elem.removeClass('loading');

	}

	/* end Variables & Functions */

});