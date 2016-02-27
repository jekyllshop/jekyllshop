/*!
 * Jekyllshop - The eCommerce Solution for Jekyll
 * Author      : 5ervant (Mark Anthony B. Dungo)
 * License     : Envato Market Standard Licenses
 * License URI : http://themeforest.net/licenses/standard?ref=5ervant
 */


// Global variables
var loc = window.location.pathname;
var permaname = loc.split( '/' ).reverse()[1];
var previewQuantity = $( '#previewQuantity' );
var previewQuantityMax = parseInt( previewQuantity.attr( 'max' ) );



if ( previewQuantity.length ) {
	if ( localStorage.getItem( 'addedProducts' ) !== null ) {
		var addedProducts = JSON.parse( localStorage.getItem( 'addedProducts' ) );
		for ( var prod in addedProducts ) {
			if ( addedProducts[prod].permaname === permaname ) {
				var nextQuantity = previewQuantity.attr( 'max' ) - addedProducts[prod].quantity;
				if ( nextQuantity <= 0 ) {
					previewQuantity.attr( 'value', 0 );
					previewQuantity.attr( 'min', 0 );
					previewQuantity.attr( 'max', 0 );
					$( '#buyButton, #cartButton' ).attr( 'disabled', 'disabled' );
					previewQuantityMax = 0;
				} else {
					previewQuantity.attr( 'max', nextQuantity );
					previewQuantityMax = nextQuantity;
				}
				break;
			}
		}
	}
}

if ( $( '.product' ).length ) {
	setProductTotal();

	previewQuantity.change( function () {
		if ( parseInt( previewQuantity.val() ) <= previewQuantityMax
				&& parseInt( previewQuantity.val() ) > 0 ) {
			$( '#buyButton, #cartButton' ).removeAttr( 'disabled' );
			setProductTotal();
		} else
			$( '#buyButton, #cartButton' ).attr( 'disabled', 'disabled' );
	} );
}

// Checkout layout
var getAddedProducts = localStorage.getItem( 'addedProducts' );
if ( $( '.checkout' ).length && ( getAddedProducts === null || getAddedProducts === '[]' ) ) {
	if ( localStorage.getItem( 'queuedRemoveProducts' ) === null )
		window.location = '../cart/';
}

// If the currency code configuration changed.
var addedProductsCurrency = localStorage.getItem( 'addedProductsCurrency' );
if ( addedProductsCurrency !== null ) {
	if ( addedProductsCurrency !== $( '#currencyCode' ).text() ) {
		localStorage.removeItem( 'addedProducts' );
		localStorage.removeItem( 'addedProductsCurrency' );
		window.location.reload();
	}
}





/* 
 * Functions
 */


// For setting item product
function setProductTotal() {
	var priceInner = $( '#previewPrice' )[0].innerHTML;
	var previewTotal = $( '#previewTotal' )[0];

	var priceNumber = Number( priceInner.replace( /([\D]+)/, '' ) );
	var nextTotal = priceNumber * parseInt( previewQuantity.val() );
	nextTotal = parseFloat( Math.round( nextTotal * 100 ) / 100 );

	previewTotal.innerHTML = previewTotal.innerHTML.replace( /([\d\.]+)/, nextTotal );
}


function landingDate() {
	var monthNames = [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];
	var d = new Date();
	var month = monthNames[d.getMonth()];
	var day = d.getDate();
	var output = month + ' ' + ( day < 10 ? '0' : '' ) + day + ', ' + d.getFullYear();
	return output;
}


// For Payment Made
function setOrderDetails( method, type ) {
	localStorage.setItem( 'datePaymentMade', landingDate() );
	localStorage.setItem( 'methodPaymentMade', method );
	localStorage.setItem( 'methodPaymentType', type );

	switch ( type ) {
		case 'buy':
			localStorage.setItem( 'productPaymentMade', $( '#reviewProduct' ).text() );
			localStorage.setItem( 'quantityPaymentMade', $( '#reviewQuantity' ).text() );
			localStorage.setItem( 'totalPaymentMade', $( '#reviewTotal' ).text() );
			break
		case 'cart':
			localStorage.setItem( 'productsPaymentMade', localStorage.getItem( 'addedProducts' ) );
			break
	}
}


// For BACS and COD messaging
function orderDraftWriter( type ) {
	orderDraft.innerHTML = 'BILLING DETAILS\n';
	orderDraft.innerHTML += 'Order Number: ' + localStorage.getItem( 'orderOrderDetails' ) + '\n';
	orderDraft.innerHTML += 'First Name: ' + billingFirstName.value + '\n';
	orderDraft.innerHTML += 'Last Name: ' + billingLastName.value + '\n';
	orderDraft.innerHTML += 'Company: ' + billingCompany.value + '\n';
	orderDraft.innerHTML += 'Email: ' + billingEmail.value + '\n';
	orderDraft.innerHTML += 'Phone: ' + billingPhone.value + '\n';
	orderDraft.innerHTML += 'Country: ' + billingCountry.value + '\n';
	orderDraft.innerHTML += 'Address: ' + billingAddress.value + '\n';
	orderDraft.innerHTML += 'Address 2: ' + billingAddress2.value + '\n';
	orderDraft.innerHTML += 'City: ' + billingCity.value + '\n';
	orderDraft.innerHTML += 'State: ' + billingState.value + '\n';
	orderDraft.innerHTML += 'Postcode: ' + billingPostcode.value + '\n\n';
	switch ( type ) {
		case 'buy':
			orderDraft.innerHTML += 'ORDER SUMMARY\n';
			orderDraft.innerHTML += 'Product: ' + $( '#reviewProduct' )[0].innerHTML + '\n';
			orderDraft.innerHTML += 'Price: ' + $( '#reviewPrice' )[0].innerHTML + '\n';
			orderDraft.innerHTML += 'Quantity: ' + $( '#reviewQuantity' )[0].innerHTML + '\n';
			orderDraft.innerHTML += 'Total: ' + $( '#reviewTotal' )[0].innerHTML + '\n';
			break;
		case 'checkout':
			orderDraft.innerHTML += '\nYOUR ORDER\n';
			orderDraft.innerHTML += $( '#bacsCodOrder' ).text() + '\n';
			break;
	}
	orderDraft.innerHTML += '\n';
	orderDraft.innerHTML += 'NOTE TO SELLER\n';
	orderDraft.innerHTML += $( '#billingNote' )[0].value + '\n';
}
