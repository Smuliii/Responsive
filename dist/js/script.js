// If JavaScript is enabled, remove a class `no-js` and replace with a class `js`
jQuery('html').toggleClass('no-js js');

// Run the code after the DOM has been fully loaded
jQuery(document).ready(function( $ ) {

	/* ---------------------------------------------------------------------- */
	/*	Variables & Functions
	/* ---------------------------------------------------------------------- */

	var $window      = $(window),
		$html        = $('html'),
		$body        = $('body'),
		lang         = $html.attr('lang'),
		baseFontSize = parseFloat( $html.css('font-size') );

	/**
	 * Update `isMobileView` variable and trigger `mobileViewChange` event when a screen size change occurs
	 */
	var mobileBreakpoint = '(max-width: 47.99em)',
		isMobileView     = window.matchMedia( mobileBreakpoint ).matches,
		resizeTimer;

	$window.on('resize', function()  {
		clearTimeout(resizeTimer);

		resizeTimer = setTimeout(function() {
			if( isMobileView !== window.matchMedia( mobileBreakpoint ).matches ) {
				isMobileView = window.matchMedia( mobileBreakpoint ).matches;
				$body.trigger('mobileViewChange', isMobileView);
			}
		}, 250);
	}).trigger('resize');

	/**
	 * Convert pixels to ems
	 *
	 * @param {Number|String} value
	 * @param {Boolean} [withUnit]
	 * @return {Number|String}
	 */
	function convertPxToEm( value, withUnit ) {

		if( typeof value !== 'undefined' && value )
			return parseFloat( value ) / baseFontSize + (typeof withUnit === 'undefined' || withUnit ? 'em' : null);

	}

	/**
	 * Convert ems to pixels
	 *
	 * @param {Number|String} value
	 * @param {Boolean} [withUnit]
	 * @return {Number|String}
	 */
	function convertEmToPx( value, withUnit ) {

		if( typeof value !== 'undefined' && value )
			return parseFloat( value ) * baseFontSize + (typeof withUnit === 'undefined' || withUnit ? 'px' : null);

	}

	/* ---------------------------------------------------------------------- */
	/*  Custom Functions
	/* ---------------------------------------------------------------------- */

});
//# sourceMappingURL=/script.js.map