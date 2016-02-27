/*!
 * Jekyllshop - The eCommerce Solution for Jekyll
 * Author      : 5ervant (Mark Anthony B. Dungo)
 * License     : Envato Market Standard Licenses
 * License URI : http://themeforest.net/licenses/standard?ref=5ervant
 */


var loc = window.location.pathname;
var permaname = loc.split( '/' ).reverse()[1];


$( '#cartButton' ).click( function () {
	var title = $( '.post-title' )[0].innerHTML;
	var signedPrice = $( '#previewPrice' )[0].innerHTML;
	var price = Number( signedPrice.replace( /([\D]+)/, '' ) );
	var quantity = parseInt( previewQuantity.val() );
	var image = $( '#productCarousel img' ).attr( 'src' );

	var productStock = $( '#productStock' );
	var stock = ( productStock.length ) ? parseInt( productStock.text() ) : 99;

	if ( localStorage.getItem( 'addedProducts' ) === null ) {
		var addedProducts = [ ];
		addedProducts.push( { permaname: permaname, title: title, price: signedPrice, quantity: quantity, image: image, stock: stock } );
		localStorage.setItem( 'addedProducts', JSON.stringify( addedProducts ) );
	} else {
		var addedProducts = JSON.parse( localStorage.getItem( 'addedProducts' ) );
		var isProductAdded = false;
		for ( var prod in addedProducts ) {
			if ( addedProducts[prod].permaname === permaname ) {
				addedProducts[prod].quantity = addedProducts[prod].quantity + quantity;
				isProductAdded = true;
				break;
			}
		}
		if ( !isProductAdded ) {
			addedProducts.push( { permaname: permaname, title: title, price: signedPrice, quantity: quantity, image: image, stock: stock } );
		}
		localStorage.setItem( 'addedProducts', JSON.stringify( addedProducts ) );
	}
	updateCount();
	console.log( JSON.stringify( addedProducts ) );

	updateModal( permaname, price );

	// For currency code configuration changes.
	if ( localStorage.getItem( 'addedProductsCurrency' ) === null )
		localStorage.setItem( 'addedProductsCurrency', $( '#currencyCode' ).text() );
} );

$( '#cartModal' ).on( 'hidden.bs.modal', function () {
	location.reload();
} );



var getAddedProducts = localStorage.getItem( 'addedProducts' );
if ( getAddedProducts !== null && getAddedProducts !== '[]' ) {
	updateCount();

	// Shopping Cart
	if ( $( '.cart' ).length ) {
		$( '#cartNotEmpty' ).fadeIn();
		$( '#checkoutButton' ).removeClass( 'disabled' );

		var addedProducts = JSON.parse( localStorage.getItem( 'addedProducts' ) );
		var cartProductsList = $( '#cartProducts' );
		var product = 0;
		for ( var prod in addedProducts ) {
			var elem = addedProducts[prod];
			addCartProduct( cartProductsList, elem, prod );
			product += Number( addedProducts[prod].price.replace( /([\D]+)/, '' ) ) * addedProducts[prod].quantity;
			console.log( elem );
		}
		$( '#cartTotal' ).text( parseFloat( Math.round( product * 100 ) / 100 ) );

		$( '.remove-item' ).click( function () {
			if ( confirm( 'Are you sure you want to remove this item?' ) ) {
				var removeId = $( this ).attr( 'id' );
				addedProducts = jQuery.grep( addedProducts, function ( value ) {
					return value.permaname !== removeId;
				} );
				localStorage.setItem( 'addedProducts', JSON.stringify( addedProducts ) );
				document.location.reload();
			}
			return false;
		} );

		$( function () {
			$( '.form-control' ).change( function () {
				var input = $( this );
				var inputQuantity = Number( input.val() );
				var inputMax = Number( input.attr( 'max' ) );
				var prodIndex = Number( input.attr( 'id' ).replace( /([\D]+)/, '' ) );
				if ( inputQuantity < 1 )
					addedProducts[prodIndex].quantity = 1;
				else if ( inputQuantity > inputMax )
					addedProducts[prodIndex].quantity = inputMax;
				else
					addedProducts[prodIndex].quantity = inputQuantity;

				localStorage.setItem( 'addedProducts', JSON.stringify( addedProducts ) );
				document.location.reload();
			} );
		} );
	}
} else if ( $( '#cartEmpty' ).length ) {
	$( '#cartEmpty' ).fadeIn();
}

$( '#emptyCart' ).click( function () {
	if ( confirm( 'Are you sure you want to remove all items from your cart?' ) ) {
		localStorage.removeItem( 'addedProducts' );
		document.location.reload();
	}
} );



// Checkout layout

if ( $( '.checkout' ).length ) {
	var queuedRemoveProducts = localStorage.getItem( 'queuedRemoveProducts' );
	if ( queuedRemoveProducts !== null ) {
		localStorage.setItem( 'addedProducts', queuedRemoveProducts );
		localStorage.removeItem( 'queuedRemoveProducts' );
		updateCount();
	}

	var addedProducts = JSON.parse( localStorage.getItem( 'addedProducts' ) );
	var orderSummaryList = $( '#orderSummary' );
	var summaryTotal = 0;
	var quantityTotal = 0;
	for ( var prod in addedProducts ) {
		var elem = addedProducts[prod];
		addCheckoutItem( orderSummaryList, elem, Number( prod ) + 1 );
		summaryTotal += Number( elem.price.replace( /([\D]+)/, '' ) ) * elem.quantity;
		quantityTotal += elem.quantity;
		console.log( elem );
	}
	var currency = addedProducts[0].price.replace( /([\d\.]+)/, '' );
	summaryTotal = parseFloat( Math.round( summaryTotal * 100 ) / 100 );
	var summaryTotalHTML = '\
<tr>\n\
	<th class="h4 text-right">Total:</th>\n\
	<td colspan="2" class="h3"><small>' + currency + '</small>' + summaryTotal + '</td>\n\
</tr>';
	orderSummaryList.append( summaryTotalHTML );

	// For #bacsCodModal
	$( '#bacsCodOrder' ).append( summaryTotalHTML );

	// If #bacsCheckoutButton or #codCheckoutButton exist!
	if ( $( '.billing-note-message' ).length ) {
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
	}

	var bacsInstructions = $( '#bacsInstructions' );
	var codInstructions = $( '#codInstructions' );
	$( '#bacsCheckoutButton' ).click( function () {
		bacsInstructions.show();
		codInstructions.hide();
		localStorage.setItem( 'orderOrderDetails', Math.floor( Math.random() * 90000 ) + 10000 );
		orderDraftWriter( 'checkout' );
		localStorage.setItem( 'methodOrderDetails', 'paymentMethodBacs' );
	} );
	$( '#codCheckoutButton' ).click( function () {
		codInstructions.show();
		bacsInstructions.hide();
		localStorage.setItem( 'orderOrderDetails', Math.floor( Math.random() * 90000 ) + 10000 );
		orderDraftWriter( 'checkout' );
		localStorage.setItem( 'methodOrderDetails', 'paymentMethodCod' );
	} );
	$( '#bacsCodModal' ).find( '.form-control' ).each( function () {
		$( this ).change( function () {
			orderDraftWriter( 'checkout' );
		} );
	} );
	$( '#orderPlaced' ).click( function () {
		localStorage.setItem( 'dateOrderDetails', landingDate() );
		localStorage.setItem( 'methodPaymentType', 'cart' );
		localStorage.removeItem( 'addedProducts' );
	} );

	if ( $( '#checkoutSkrill' ).length ) {
		$( '#skrillQuantities' ).val( quantityTotal );
		$( '#skrillAmount' ).val( summaryTotal );

		$( '#skrillNote' ).change( function () {
			$( '#skrillNoteToSeller' ).val( $( this )[0].value );
		} );
	}

	$( '#checkoutPaypal' ).click( function () {
		setOrderDetails( 'PayPal', 'cart' );
		localStorage.setItem( 'queuedRemoveProducts', localStorage.getItem( 'addedProducts' ) );
		localStorage.removeItem( 'addedProducts' );
	} );
	$( '#checkoutSkrill' ).click( function () {
		setOrderDetails( 'Skrill', 'cart' );
		localStorage.setItem( 'queuedRemoveProducts', localStorage.getItem( 'addedProducts' ) );
		localStorage.removeItem( 'addedProducts' );
	} );
}



// Landing layout
if ( $( '.landing' ).length && localStorage.getItem( 'methodPaymentType' ) === 'cart' ) {
	if ( localStorage.getItem( 'queuedRemoveProducts' ) !== null )
		localStorage.removeItem( 'queuedRemoveProducts' );

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
		$( '.for-payment-made, #orderDetailsCart' ).show();
		$( '#landingDate' )[0].innerHTML = localStorage.getItem( 'datePaymentMade' );

		var getMethod = localStorage.getItem( 'methodPaymentMade' );
		landingMethod.text( getMethod );

		if ( getMethod === 'PayPal' )
			$( '#paypalDescription' ).show();
		else if ( getMethod === 'Skrill' )
			$( '#skrillDescription' ).show();

		var paidProducts = JSON.parse( localStorage.getItem( 'productsPaymentMade' ) );
		var orderDetailsCart = $( '#orderDetailsCart' );
		var totalPrice = 0;
		for ( var prod in paidProducts ) {
			var elem = paidProducts[prod];
			var signedPrice = elem.price;
			var currency = signedPrice.replace( /([\d\.]+)/, '' );
			var priceNumber = Number( signedPrice.replace( /([\D]+)/, '' ) );
			var product = priceNumber * elem.quantity;
			var newElemHTML = '\
<tr>\n\
	<th>' + elem.title + '</th>\n\
	<th>&times; ' + elem.quantity + '</th>\n\
	<th>' + currency + product + '</th>\n\
</tr>';
			orderDetailsCart.append( newElemHTML );
			totalPrice += priceNumber * elem.quantity;
		}
		var totalPriceHTML = '\
<tr>\n\
	<th class="h4 text-right">Total:</th>\n\
	<td colspan="2" class="h3 text-center"><small>' + currency + '</small>' + totalPrice + '</td>\n\
</tr>';
		orderDetailsCart.append( totalPriceHTML );
	}
}



// Functions

function addCartProduct( parent, elem, index ) {
	var signedPrice = elem.price;
	var currency = signedPrice.replace( /([\d\.]+)/, '' );
	var priceNumber = Number( signedPrice.replace( /([\D]+)/, '' ) );
	var product = priceNumber * elem.quantity;
	var url = '../products/' + elem.permaname + '/';
	var newElemHTML = '\
<li class="media well well-sm">\n\
	<div class="pull-right">\n\
		<a class="remove-item" id="' + elem.permaname + '" href="#"><span class="hidden-remove">remove</span> <span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>\n\
	</div>\n\
	<div class="media-body">\n\
		$IMAGE\n\
		<h4 class="media-heading"><a href="' + url + '">' + elem.title + '</a></h4>\n\
		<ul class="list-inline text-center">\n\
			<li><small>price:</small> ' + elem.price + '</li>\n\
			<li class="form-inline">\n\
				<div class="form-group">\n\
					<label for="cartInputQuantity' + index + '" class="small">quantity:</label>\n\
					&times; <input type="number" class="form-control" id="cartInputQuantity' + index + '" value="' + elem.quantity + '" min="1" max="' + elem.stock + '" />\n\
				<div>\n\
			</li>\n\
			<li>=</li>\n\
			<li><small>subtotal:</small> <span class="h2"><small>' + currency + '</small>' + product + '</span></li>\n\
		</ul>\n\
	</div>\n\
</li>';
	if ( elem.image ) {
		var newImg = '\
<div class="pull-left">\n\
	<a href="' + url + '"><img class="media-object" src="' + elem.image + '" alt="' + elem.title + '"></a>\n\
</div>';
		newElemHTML = newElemHTML.replace( '$IMAGE', newImg );
	} else
		newElemHTML = newElemHTML.replace( '$IMAGE', '' );

	parent.append( newElemHTML );
}

function addCheckoutItem( parent, elem, count ) {
	var signedPrice = elem.price;
	var currency = signedPrice.replace( /([\d\.]+)/, '' );
	var priceNumber = Number( signedPrice.replace( /([\D]+)/, '' ) );
	var product = priceNumber * elem.quantity;
	var newItemHTML = '\
<tr>\n\
	<td>' + elem.title + '</td>\n\
	<th>× ' + elem.quantity + '</th>\n\
	<td><small>' + currency + '</small>' + product + '</td>\n\
</tr>';
	parent.append( newItemHTML );

	$( '#bacsCodOrder' ).append( newItemHTML );

	if ( $( '#checkoutPaypal' ).length ) {
		var newItemHTML = '\
<input type="hidden" name="item_name_' + count + '" value="' + elem.title + '">\n\
<input type="hidden" name="amount_' + count + '" value="' + priceNumber + '">\n\
<input type="hidden" name="quantity_' + count + '" value="' + elem.quantity + '">';
		$( '#checkoutPaypal' ).prepend( newItemHTML );
	}
	if ( $( '#checkoutSkrill' ).length ) {
		var skrillItemProducts = $( '#skrillItemProducts' );
		var newItemProductsVal;
		if ( skrillItemProducts.val() )
			newItemProductsVal = skrillItemProducts.val() + '; ' + elem.title + ' x' + elem.quantity;
		else
			newItemProductsVal = elem.title + ' x' + elem.quantity;
		skrillItemProducts.val( newItemProductsVal );
	}
}

function updateCount() {
	var addedProducts = JSON.parse( localStorage.getItem( 'addedProducts' ) );
	var count = 0;

	for ( var prod in addedProducts )
		count += addedProducts[prod].quantity;

	var cartCount = $( '#cartCount' );
	cartCount[0].innerHTML = count;
	cartCount.fadeIn().css( 'display', 'inline-block' );

	// For Cart layout
	if ( $( '#countItems' ).length ) {
		if ( count < 2 )
			$( '#countItems' ).text( count + ' item' );
		else
			$( '#countItems' ).text( count + ' items' );
	}
}

function updateModal( permaname, price ) {
	var addedProducts = JSON.parse( localStorage.getItem( 'addedProducts' ) );
	for ( var prod in addedProducts ) {
		if ( addedProducts[prod].permaname === permaname ) {
			var addedQuantity = addedProducts[prod].quantity;
			$( '#addedQuantity' )[0].innerHTML = addedQuantity;

			var nextTotal = price * addedQuantity;
			nextTotal = parseFloat( Math.round( nextTotal * 100 ) / 100 );
			$( '#addedTotal' )[0].innerHTML = nextTotal;
			break;
		}
	}
}
