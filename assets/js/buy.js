/*!
 * Jekyllshop - The eCommerce Solution for Jekyll
 * Author      : 5ervant (Mark Anthony B. Dungo)
 * License     : Envato Market Standard Licenses
 * License URI : http://themeforest.net/licenses/standard?ref=5ervant
 */


$( '#buyTabs a' ).click( function ( e ) {
	e.preventDefault();
	$( this ).tab( 'show' );
} );

if ( $( '.product' ).length ) {
	setBuyDetails();

	previewQuantity.change( function () {
		setBuyDetails();
	} );
}

if ( $( '#paymentMethodBacsCod' ).length ) {
	$( '#buyButton' ).click( function () {
		localStorage.setItem( 'orderOrderDetails', Math.floor( Math.random() * 90000 ) + 10000 );
		orderDraftWriter( 'buy' );
	} );

	var orderDraft = $( '#orderDraft' )[0];
	var billingFirstName = $( '#billingFirstName' )[0];
	var billingLastName = $( '#billingLastName' )[0];
	var billingCompany = $( '#billingCompany' )[0];
	var billingEmail = $( '#billingEmail' )[0];
	var billingPhone = $( '#billingPhone' )[0];
	var billingCountry = $( '#billingCountry' )[0];
	var billingAddress = $( '#billingAddress' )[0];
	var billingAddress2 = $( '#billingAddress2' )[0];
	var billingCity = $( '#billingCity' )[0];
	var billingState = $( '#billingState' )[0];
	var billingPostcode = $( '#billingPostcode' )[0];
	var billingNote = $( '#billingNote' )[0];

	$( '#paymentMethodBacsCod' ).find( '.form-control' ).each( function () {
		$( this ).change( function () {
			orderDraftWriter( 'buy' );
		} );
	} );
	$( '#orderPlaced' ).click( function () {
		localStorage.setItem( 'dateOrderDetails', landingDate() );
		localStorage.setItem( 'methodOrderDetails', $( '#buyTabs' ).find( '.active > a' )[0].getAttribute( 'aria-controls' ) );
		localStorage.setItem( 'methodPaymentType', 'buy' );
	} );
}
if ( $( '#paymentMethodPaypal' ).length ) {
	var paymentMethodPaypal = $( '#paymentMethodPaypal' );

	$( '#buyButton' ).click( function () {
		paymentMethodPaypal.find( 'input[name="quantity"]' ).val( previewQuantity.val() );
	} );

	paymentMethodPaypal.find( 'form' ).submit( function () {
		setOrderDetails( 'PayPal', 'buy' );
	} );
}
if ( $( '#paymentMethodSkrill' ).length ) {
	var paymentMethodSkrill = $( '#paymentMethodSkrill' );

	$( '#buyButton' ).click( function () {
		var totalInner = $( '#reviewTotal' )[0].innerHTML;
		var amount = Number( totalInner.replace( /([\D]+)/, '' ) );
		paymentMethodSkrill.find( 'input[name="amount"]' )[0].value = amount;
		paymentMethodSkrill.find( 'input[name="detail2_text"]' )[0].value = $( '#reviewQuantity' )[0].innerHTML;
	} );

	$( '#skrillNote' ).change( function () {
		paymentMethodSkrill.find( 'input[name="detail3_text"]' )[0].value = $( this )[0].value;
	} );

	paymentMethodSkrill.find( 'form' ).submit( function () {
		setOrderDetails( 'Skrill', 'buy' );
	} );
}

var orderContactsPlaced = $( '#orderContacts, #orderPlaced' );
$( 'a[aria-controls="paymentMethodBacs"], a[aria-controls="paymentMethodCod"]' ).on( 'hide.bs.tab', function ( e ) {
	var relatedTargetAttr = e.relatedTarget.getAttribute( 'aria-controls' );
	var targetAttr = e.target.getAttribute( 'aria-controls' );
	if ( relatedTargetAttr === 'paymentMethodPaypal' || relatedTargetAttr === 'paymentMethodSkrill' ) {
		orderContactsPlaced.fadeOut( 150 );
		if ( targetAttr === 'paymentMethodBacs' )
			$( '#bacsDescription, #bacsInstructions' ).fadeOut( 150 );
		else if ( targetAttr === 'paymentMethodCod' )
			$( '#codDescription, #codInstructions' ).fadeOut( 150 );
	}
} );
$( 'a[aria-controls="paymentMethodPaypal"], a[aria-controls="paymentMethodSkrill"]' ).on( 'hidden.bs.tab', function ( e ) {
	var relatedTargetAttr = e.relatedTarget.getAttribute( 'aria-controls' );
	if ( relatedTargetAttr === 'paymentMethodBacs' || relatedTargetAttr === 'paymentMethodCod' )
		orderContactsPlaced.fadeIn( 150 );
	if ( relatedTargetAttr === 'paymentMethodBacs' )
		$( '#bacsDescription, #bacsInstructions' ).fadeIn( 150 );
	else if ( relatedTargetAttr === 'paymentMethodCod' )
		$( '#codDescription, #codInstructions' ).fadeIn( 150 );
} );
$( 'a[href="#paymentMethodBacsCod"]' ).on( 'hide.bs.tab', function ( e ) {
	var targetAttr = e.target.getAttribute( 'aria-controls' );
	var relatedTargetAttr = e.relatedTarget.getAttribute( 'aria-controls' );
	if ( relatedTargetAttr === 'paymentMethodBacs' || relatedTargetAttr === 'paymentMethodCod' ) {
		if ( targetAttr === 'paymentMethodBacs' ) {
			$( '#bacsDescription, #bacsInstructions' ).fadeOut( 150, function () {
				$( '#codDescription, #codInstructions' ).fadeIn( 150 );
			} );
		} else if ( targetAttr === 'paymentMethodCod' ) {
			$( '#codDescription, #codInstructions' ).fadeOut( 150, function () {
				$( '#bacsDescription, #bacsInstructions' ).fadeIn( 150 );
			} );
		}
	}
} );


// Landing layout
if ( $( '.landing' ).length && localStorage.getItem( 'methodPaymentType' ) === 'buy' ) {
	var landingMethod = $( '#landingMethod' );
	if ( permaname === 'order-details' ) {
		$( '.for-order-details' ).show();
		$( '#landingDate' ).text( localStorage.getItem( 'dateOrderDetails' ) );
		$( '#landingOrder' ).text( localStorage.getItem( 'orderOrderDetails' ) );

		if ( localStorage.getItem( 'methodOrderDetails' ) === 'paymentMethodBacs' ) {
			landingMethod.text( 'Direct Bank Transfer' );
			$( '#bacsDescription, #bankDetails' ).show();
		} else if ( localStorage.getItem( 'methodOrderDetails' ) === 'paymentMethodCod' ) {
			landingMethod.text( 'Cash on Delivery' );
			$( '#codDescription' ).show();
		}
	} else if ( permaname === 'payment-made' ) {
		$( '.for-payment-made, #orderDetailsBuy' ).show();
		$( '#landingDate' )[0].innerHTML = localStorage.getItem( 'datePaymentMade' );

		var getMethod = localStorage.getItem( 'methodPaymentMade' );
		landingMethod.text( getMethod );

		if ( getMethod === 'PayPal' )
			$( '#paypalDescription' ).show();
		else if ( getMethod === 'Skrill' )
			$( '#skrillDescription' ).show();

		$( '#productPaymentMade' )[0].innerHTML = localStorage.getItem( 'productPaymentMade' );
		$( '#quantityPaymentMade' )[0].innerHTML = localStorage.getItem( 'quantityPaymentMade' );
		$( '#totalPaymentMade' )[0].innerHTML = localStorage.getItem( 'totalPaymentMade' );
	}
}



// Functions

function setBuyDetails() {
	$( '#reviewQuantity' ).text( '× ' + previewQuantity.val() );
	$( '#reviewTotal' ).text( $( '#previewTotal' ).text() );
}
