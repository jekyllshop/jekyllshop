/*!
 * Jekyllshop - The eCommerce Solution for Jekyll
 * Author      : 5ervant (Mark Anthony B. Dungo)
 * License     : Envato Market Standard Licenses
 * License URI : http://themeforest.net/licenses/standard?ref=5ervant
 */


$( '.window-open' ).click( function () {
	window.open( this.href, 'windowOpen', 'left=20,top=20,width=700,height=500' );
	return false;
} );



$( '.site-header' ).find( '.wrapper .active' ).css( {
	'box-shadow': '2px 1px 0 #000',
	'top': '2px'
} ).one( 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
		function () {
			$( this ).css( { 'text-decoration': 'underline' } );
		} );



/* 
 * To prevent default
 */
// Home Pagination Pager
if ( $( '.home' ) ) {
	$( '.pager' ).find( 'a[href="#"]' ).click( function () {
		return false;
	} );
}
// Mobile Menu Icon
$( '.menu-icon' ).click( function () {
	return false;
} );



/* 
 * Carousel Stable Height
 */
if ( $( '.carousel-stable-height' ).length ) {
	$( function () {
		var carouselStableHeight = $( '.carousel-stable-height' );
		var item = { };
		item.active = carouselStableHeight.find( '.carousel-inner > .item.active' );

		LoadCarouselHeight( item, carouselStableHeight );
	} );

	function LoadCarouselHeight( obj, elem ) {
		obj.height = obj.active.find( 'img' ).height();

		if ( obj.height < 15 ) {
			setTimeout( function () {
				LoadCarouselHeight( obj, elem );
			}, 500 );
		}
		else
			CarouselStableHeight( obj, elem );
	}
	function CarouselStableHeight( obj, elem ) {
		elem.find( '.carousel-inner > .item' ).css( 'height', obj.height );
		elem.find( '.carousel-inner img' ).css( 'max-height', obj.height );

		var width = $( window ).width();
		var isCompleted = true;
		$( window ).resize( function () {
			if ( $( this ).width() !== width && isCompleted ) {
				isCompleted = false;
				elem.find( '.carousel-inner' ).fadeOut( "slow", function () {

					elem.find( '.carousel-inner img' ).css( 'max-height', "" );
					elem.find( '.carousel-inner' ).fadeIn( "slow", function () {

						obj.active = elem.find( '.carousel-inner > .item.active' );
						obj.height = obj.active.find( 'img' ).height();

						elem.find( '.carousel-inner > .item' ).animate( {
							height: obj.height
						}, "slow", function () {
							elem.find( '.carousel-inner img' ).css( 'max-height', obj.height );
						} );

						width = $( window ).width();
						isCompleted = true;
					} );
				} );
			}
		} );
	}
}



// Global variables
var sitemap = $( 'head > link[rel="sitemap"]' )[0].getAttribute( 'href' );
var baseurl = sitemap.replace( '/sitemap.xml', '' );
var loc = window.location.pathname;
var permaname = loc.split( '/' ).reverse()[1];
var hash = window.location.hash.substr( 1 );

var paginate = 24;
var prevPager = $( '.pager > .previous' );
var nextPager = $( '.pager > .next' );



/* 
 * Products Vertical widget
 */
if ( $( '#productsVert' ).length ) {
	var productsVertList = $( '#productsVert > ul' );

	function productsVert( responseText ) {
		var randomElements = $( responseText ).find( 'url' ).sort( function () {
			return Math.round( Math.random() ) - 0.5;
		} ).slice( 0, 7 );

		randomElements.each( function () {
			var elem = $( this );
			addProductsVert( productsVertList, elem );
		} );
		productsVertList.fadeIn( 1000 );
	}

	function addProductsVert( parent, elem ) {
		var newElemHTML = '\
<li class="media">\n\
	<div class="media-body">\n\
		<h4 class="media-heading small">$TITLE</h4>\n\
		$IMAGE\n\
		<ul class="list-inline text-center">$LABELS</ul>\n\
		<p class="small">$DESCRIPTION</p>\n\
		$CATEGORIES $TAGS\n\
	</div>\n\
</li>';

		var url = $.trim( elem.find( 'loc:first' ).text() );
		var title = elem.find( 'product\\:title' ).text();
		newElemHTML = newElemHTML.replace( '$TITLE', '<a href="' + url + '">' + title + '</a>' );

		var desc = strip( elem.find( 'product\\:description' ).text() );
		var maxLength = 100; // maximum number of characters to extract
		// trim the string to the maximum length
		var trimmedDesc = desc.substr( 0, maxLength );
		// re-trim if we are in the middle of a word
		trimmedDesc = trimmedDesc.substr( 0, Math.min( trimmedDesc.length, trimmedDesc.lastIndexOf( " " ) ) );
		newElemHTML = newElemHTML.replace( '$DESCRIPTION', trimmedDesc + '...' );

		var image = elem.find( 'image\\:loc' );
		if ( image.length ) {
			var newImg = '\
<div class="pull-left">\n\
	<a href="' + url + '">\n\
		<img class="media-object" src="' + image.random().text().trim() + '" alt="' + title + '">\n\
	</a>\n\
</div>';
			newElemHTML = newElemHTML.replace( '$IMAGE', newImg );
		} else
			var imgNotFound = true;

		var newLabels = '';

		var sale = elem.find( 'product\\:sale' );
		var price = elem.find( 'product\\:price' );
		var salePrice;
		if ( sale.length ) {
			if ( imgNotFound ) {
				salePrice = '<div class="pull-left well well-sm text-center"><a href="' + url + '">';
				if ( price.length )
					salePrice += '<del class="small">' + price.text() + '</del>\n';
				salePrice += '<ins>' + sale.text() + '</ins>';
				salePrice += '</a></div>';
				newElemHTML = newElemHTML.replace( '$IMAGE', salePrice );
			} else {
				salePrice = '<li>';
				if ( price.length )
					salePrice += '<del class="small">' + price.text() + '</del>';
				salePrice += '<ins>' + sale.text() + '</ins>';
				salePrice += '</li>';
				newLabels = salePrice;
			}
		} else if ( price.length ) {
			if ( imgNotFound ) {
				salePrice = '\
<div class="pull-left well well-sm text-center">\n\
	<a href="' + url + '">\n\
		<del class="small">' + price.text() + '</del>\n\
	</a>\n\
</div>';
				newElemHTML = newElemHTML.replace( '$IMAGE', salePrice );
			} else {
				salePrice = '<li><b>' + price.text() + '</b></li>';
				newLabels = salePrice;
			}
		}

		var stock = elem.find( 'product\\:stock' );
		if ( stock.text() === '0' )
			newLabels += '<li class="label label-danger">Out of stock</li>';
		else if ( stock.length )
			newLabels += '<li class="label label-primary">' + stock.text() + ' in stock</li>';

		newElemHTML = newElemHTML.replace( '$LABELS', newLabels );

		var cats = elem.find( 'product\\:category' );
		if ( cats.length ) {
			var newCats = '<ul class="list-inline text-center">';
			cats.each( function () {
				newCats += '\
<li>\n\
	<a class="label label-default" href="' + baseurl + '/categories/' + encodeURIComponent( $( this ).text() ) + '/">' + $( this ).text() + '</a>\n\
</li>';
			} );
			newCats += '</ul>';
			newElemHTML = newElemHTML.replace( '$CATEGORIES', newCats );
		} else
			newElemHTML = newElemHTML.replace( '$CATEGORIES', '' );

		var tags = elem.find( 'product\\:tag' );
		if ( tags.length ) {
			var newTags = '<ul class="list-inline text-center small">';
			tags.each( function () {
				newTags += '\
<li>\n\
	<a class="label label-default" href="' + baseurl + '/tags/#' + encodeURIComponent( $( this ).text() ) + '">' + $( this ).text() + '</a>\n\
</li>';
			} );
			newTags += '</ul>';
			newElemHTML = newElemHTML.replace( '$TAGS', newTags );
		} else
			newElemHTML = newElemHTML.replace( '$TAGS', '' );

		parent.append( newElemHTML );
	}
}



/* 
 * Products Horizontal widget
 */
if ( $( '#productsHoriz' ).length ) {
	var productsHorizList = $( '#productsHoriz > ul' );

	function productsHoriz( responseText ) {
		var randomElements = $( responseText ).find( 'url' ).sort( function () {
			return Math.round( Math.random() ) - 0.5;
		} ).slice( 0, 5 );

		randomElements.each( function ( i ) {
			var elem = $( this );
			addProductsHoriz( productsHorizList, elem, 800, i );
		} );

		setTimeout( function () {
			window.setInterval( function () {
				updateProductsHoriz( productsHorizList, responseText, 1000 );
			}, 20000 );
		}, 5000 );
	}

	function addProductsHoriz( parent, elem, showDuration, secondsToWait ) {
		var newElemHTML = '\
<li class="media-left" style="display: none;">\n\
	<div class="media">\n\
		<div class="pull-left">$IMAGE $LABELS</div>\n\
		<div class="media-body">\n\
			<h4 class="media-heading">$TITLE</h4>\n\
			<p class="small">$DESCRIPTION</p>\n\
		</div>\n\
	</div>\n\
	$CATEGORIES $TAGS\n\
</li>';

		var url = $.trim( elem.find( 'loc:first' ).text() );
		var title = elem.find( 'product\\:title' ).text();
		newElemHTML = newElemHTML.replace( '$TITLE', '<a href="' + url + '">' + title + '</a>' );

		var desc = strip( elem.find( 'product\\:description' ).text() );
		var maxLength = 100; // maximum number of characters to extract
		// trim the string to the maximum length
		var trimmedDesc = desc.substr( 0, maxLength );
		// re-trim if we are in the middle of a word
		trimmedDesc = trimmedDesc.substr( 0, Math.min( trimmedDesc.length, trimmedDesc.lastIndexOf( " " ) ) );
		newElemHTML = newElemHTML.replace( '$DESCRIPTION', trimmedDesc + '...' );

		var image = elem.find( 'image\\:loc' );
		if ( image.length ) {
			var newImg = '\
<a href="' + url + '">\n\
	<img class="media-object" src="' + image.random().text().trim() + '" alt="' + title + '">\n\
</a>';
			newElemHTML = newElemHTML.replace( '$IMAGE', newImg );
		} else {
			newElemHTML = newElemHTML.replace( '$IMAGE', '' );
			var imgNotFound = true;
		}

		var newLabels = '<ul class="text-center">';

		var sale = elem.find( 'product\\:sale' );
		var price = elem.find( 'product\\:price' );
		if ( sale.length ) {
			var salePrice;
			if ( imgNotFound ) {
				salePrice = '<li class="well well-sm">';
				salePrice += '<a href="' + url + '">';
				if ( price.length )
					salePrice += '<del class="small">' + price.text() + '</del>';
				salePrice += '<ins>' + sale.text() + '</ins>';
				salePrice += '</a>';
			}
			else {
				salePrice = '<li>';
				if ( price.length )
					salePrice += '<del class="small">' + price.text() + '</del>';
				salePrice += '<ins>' + sale.text() + '</ins>';
			}
			salePrice += '</li>';
			newLabels += salePrice;
		} else if ( price.length ) {
			if ( imgNotFound )
				newLabels += '<li class="well well-sm"><a href="' + url + '"><b>' + price.text() + '</b></a></li>';
			else
				newLabels += '<li><b>' + price.text() + '</b></li>';
		}

		var stock = elem.find( 'product\\:stock' );
		if ( stock.text() === '0' )
			newLabels += '<li class="label label-danger">Out of stock</li>';
		else if ( stock.length )
			newLabels += '<li class="label label-primary">' + stock.text() + ' in stock</li>';

		newLabels += '</ul>';
		newElemHTML = newElemHTML.replace( '$LABELS', newLabels );

		var cats = elem.find( 'product\\:category' );
		if ( cats.length ) {
			var newCats = '<ul class="list-inline text-center">';
			cats.each( function () {
				newCats += '\
<li>\n\
	<a class="label label-default" href="' + baseurl + '/categories/' + encodeURIComponent( $( this ).text() ) + '/">' + $( this ).text() + '</a>\n\
</li>';
			} );
			newCats += '</ul>';
			newElemHTML = newElemHTML.replace( '$CATEGORIES', newCats );
		} else
			newElemHTML = newElemHTML.replace( '$CATEGORIES', '' );

		var tags = elem.find( 'product\\:tag' );
		if ( tags.length ) {
			var newTags = '<ul class="list-inline text-center small">';
			tags.each( function () {
				newTags += '\
<li>\n\
	<a class="label label-default" href="' + baseurl + '/tags/#' + encodeURIComponent( $( this ).text() ) + '">' + $( this ).text() + '</a>\n\
</li>';
			} );
			newTags += '</ul>';
			newElemHTML = newElemHTML.replace( '$TAGS', newTags );
		} else
			newElemHTML = newElemHTML.replace( '$TAGS', '' );

		setTimeout( function () {
			parent.prepend( newElemHTML );
			parent.find( 'li.media-left:first > .media' ).animate( { width: '300px' } );
			parent.find( 'li.media-left:first' ).show( showDuration );
		}, 1000 * secondsToWait );
	}

	function updateProductsHoriz( parent, responseText, hideDuration ) {
		parent.find( 'li.media-left:last > .media' ).animate( { width: '1px' } );
		parent.find( 'li.media-left:last' ).hide( hideDuration, function () {
			$( this ).remove();

			var randomElem = $( responseText ).find( 'url' ).random();
			addProductsHoriz( parent, randomElem, 1000, 5 );
		} );
	}
}



/* 
 * Data User Functions
 */
if ( $( '#shopProducts' ).length ) {
	var page = ( /^page\d+$/.test( hash ) ) ? parseInt( hash.match( /\d+/ )[0] ) : 1;
	var prodList = $( '#shopProducts' );
} else if ( $( '#categorizedProducts' ).length ) {
	var page = ( /^page\d+$/.test( hash ) ) ? parseInt( hash.match( /\d+/ )[0] ) : 1;
	var prodList = $( '#categorizedProducts' );
} else if ( $( '#taggedProducts' ).length ) {
	var page = 1;
	var prodList = $( '#taggedProducts' );
}
var start = ( page - 1 ) * paginate;
var end = start + paginate;
var prods;

$( function () {
	$.ajax( {
		method: 'GET',
		url: sitemap,
		complete: function ( xhr ) {
			var responseText = xhr.responseText;

			if ( $( '#productsVert' ).length )
				productsVert( responseText );
			if ( $( '#productsHoriz' ).length )
				productsHoriz( responseText );

			if ( $( '#shopProducts' ).length )
				prodHandler( responseText, 'shop' );
			else if ( $( '#categorizedProducts' ).length )
				prodHandler( responseText, 'category' );
			else if ( $( '#taggedProducts' ).length )
				prodHandler( responseText, 'tag' );

			if ( $( '#search' ).length ) {
				searchWidget( responseText );
			}
		}
	} );
} );

/* 
 * Product Handler
 */
function prodHandler( textData, type ) {
	switch ( type ) {
		case 'shop':
			prods = $( textData ).find( 'url' );
			break;
		case 'category':
			prods = $( textData ).find( 'product\\:category' ).filter( ':contains(' + permaname + ')' ).parents( 'url' );
			prods = $( prods.get().reverse() );
			break;
		case 'tag':
			if ( /\S/.test( hash ) ) {
				$( 'title' ).prepend( hash + ' - ' );
				$( '.post-title' ).append( ': <span class="label label-default">' + hash + '</span>' );
			}
			prods = $( textData ).find( 'product\\:tag' ).filter( ':contains(' + hash + ')' ).parents( 'url' );
			prods = $( prods.get().reverse() );
			break;
	}
	showProducts( prods, type );

	$( '#orderBy' ).change( function () {
		switch ( type ) {
			case 'shop':
				page = ( /^page\d+$/.test( hash ) ) ? parseInt( hash.match( /\d+/ )[0] ) : 1;
				break;
			case 'category':
				page = ( /^page\d+$/.test( hash ) ) ? parseInt( hash.match( /\d+/ )[0] ) : 1;
				break;
			case 'tag':
				page = 1;
				break;
		}
		start = ( page - 1 ) * paginate;
		end = start + paginate;
		prodList.empty();
		showProducts( prods, type );
	} );
}
function showProducts( products, type ) {
	switch ( $( '#orderBy' ).val() ) {
		case 'name':
			// do nothing
			break;
		case 'date':
			products = products.get().sort( function ( a, b ) {
				var a2 = $( a ).find( 'product\\:date' ).text();
				var b2 = $( b ).find( 'product\\:date' ).text();
				return Number( a2.replace( /[^0-9]+/g, "" ) ) - Number( b2.replace( /[^0-9]+/g, "" ) );
			} );
			products = $( products.reverse() );
			break;
		case 'price':
			products = products.get().sort( function ( a, b ) {
				var a2 = $( a ).find( 'product\\:price' ).text();
				var b2 = $( b ).find( 'product\\:price' ).text();
				return Number( a2.replace( /[^0-9\.]+/g, "" ) ) - Number( b2.replace( /[^0-9\.]+/g, "" ) );
			} );
			products = $( products );
			break;
		case 'price-desc':
			products = products.get().sort( function ( a, b ) {
				var a2 = $( a ).find( 'product\\:price' ).text();
				var b2 = $( b ).find( 'product\\:price' ).text();
				return Number( a2.replace( /[^0-9\.]+/g, "" ) ) - Number( b2.replace( /[^0-9\.]+/g, "" ) );
			} );
			products = $( products.reverse() );
			break;
	}
	var slicedProds = products.slice( start, end );

	prodList.empty();
	slicedProds.each( function ( i ) {
		var elem = $( this );
		addProduct( elem, i, type );
	} );

	if ( start <= 0 ) {
		prevPager.addClass( 'disabled' );
		if ( type === 'shop' || type === 'category' )
			prevPager.find( 'a' ).attr( 'href', '#page1' );
	} else {
		prevPager.removeClass( 'disabled' );
		if ( type === 'shop' || type === 'category' ) {
			setTimeout( function () {
				prevPager.find( 'a' ).attr( 'href', '#page' + ( page - 1 ) );
			}, 100 );
		}
	}

	if ( end >= products.length ) {
		nextPager.addClass( 'disabled' );
		if ( type === 'shop' || type === 'category' )
			nextPager.find( 'a' ).attr( 'href', '#page' + page );
	} else {
		nextPager.removeClass( 'disabled' );
		if ( type === 'shop' || type === 'category' ) {
			setTimeout( function () {
				nextPager.find( 'a' ).attr( 'href', '#page' + ( page + 1 ) );
			}, 100 );
		}
	}

	$( '#currentPage' ).text( page );
	$( '#totalPages' ).text( Math.ceil( products.length / paginate ) );
}
function addProduct( elem, decisecsToWait, type ) {
	var newElemHTML = '\
<li class="thumbnail" style="display: none;">\n\
	$IMAGE\n\
	<div class="caption">\n\
		$TITLE $LABELS\n\
		<p>$DESCRIPTION</p>\n\
		$CATEGORIES $TAGS\n\
		<p><a href="$URL" class="btn btn-default" role="button">Read More</a></p>\n\
	</div>\n\
</li>';

	var url = $.trim( elem.find( 'loc:first' ).text() );
	newElemHTML = newElemHTML.replace( '$URL', url );
	var title = elem.find( 'product\\:title' ).text();
	newElemHTML = newElemHTML.replace( '$TITLE', '<a href="' + url + '"><h4>' + title + '</h4></a>' );

	var desc = strip( elem.find( 'product\\:description' ).text() );
	var maxLength = 100; // maximum number of characters to extract
	// trim the string to the maximum length
	var trimmedDesc = desc.substr( 0, maxLength );
	// re-trim if we are in the middle of a word
	trimmedDesc = trimmedDesc.substr( 0, Math.min( trimmedDesc.length, trimmedDesc.lastIndexOf( " " ) ) );
	newElemHTML = newElemHTML.replace( '$DESCRIPTION', trimmedDesc + '...' );

	var image = elem.find( 'image\\:loc' );
	if ( image.length ) {
		var newImg = '\
<a href="' + url + '">\n\
	<img class="pull-left" src="' + image.random().text().trim() + '" alt="' + title + '">\n\
</a>';
		newElemHTML = newElemHTML.replace( '$IMAGE', newImg );
	} else
		newElemHTML = newElemHTML.replace( '$IMAGE', '' );

	var newLabels = '<ul class="list-inline text-center">';

	var sale = elem.find( 'product\\:sale' );
	var price = elem.find( 'product\\:price' );
	if ( sale.length ) {
		var salePrice = '<li>';
		if ( price.length )
			salePrice += '<del class="small">' + price.text() + '</del>';
		salePrice += '<ins>' + sale.text() + '</ins>';
		salePrice += '</li>';
		newLabels += salePrice;
	} else if ( price.length )
		newLabels += '<li><b>' + price.text() + '</b></li>';

	var stock = elem.find( 'product\\:stock' );
	if ( stock.text() === '0' )
		newLabels += '<li class="label label-danger">Out of stock</li>';
	else if ( stock.length )
		newLabels += '<li class="label label-primary">' + stock.text() + ' in stock</li>';

	newLabels += '</ul>';
	newElemHTML = newElemHTML.replace( '$LABELS', newLabels );

	var cats = elem.find( 'product\\:category' );
	var tags = elem.find( 'product\\:tag' );

	if ( type === 'shop' ) {
		if ( cats.length ) {
			var newCats = '<ul class="list-inline text-center">';
			cats.each( function () {
				newCats += '\
<li>\n\
	<a class="label label-default" href="' + baseurl + '/categories/' + encodeURIComponent( $( this ).text() ) + '/">' + $( this ).text() + '</a>\n\
</li>';
			} );
			newCats += '</ul>';
			newElemHTML = newElemHTML.replace( '$CATEGORIES', newCats );
		}

		if ( tags.length ) {
			var newTags = '<ul class="list-inline text-center small">';
			tags.each( function () {
				newTags += '\
<li>\n\
	<a class="label label-default" onclick="window.location.reload()" href="' + baseurl + '/tags/#' + encodeURIComponent( $( this ).text() ) + '">' + $( this ).text() + '</a>\n\
</li>';
			} );
			newTags += '</ul>';
			newElemHTML = newElemHTML.replace( '$TAGS', newTags );
		}
	}

	if ( type === 'category' && cats.length > 1 ) {
		if ( cats.length > 2 )
			var newCats = '<span class="small">Other categories:</span>';
		else
			var newCats = '<span class="small">Other category:</span>';

		newCats += '<ul class="list-inline text-center">';
		cats.each( function () {
			if ( $( this ).text() !== permaname ) {
				newCats += '\
<li>\n\
	<a class="label label-default" href="' + baseurl + '/categories/' + encodeURIComponent( $( this ).text() ) + '/">' + $( this ).text() + '</a>\n\
</li>';
			}
		} );
		newCats += '</ul>';
		newElemHTML = newElemHTML.replace( '$CATEGORIES', newCats );
	} else
		newElemHTML = newElemHTML.replace( '$CATEGORIES', '' );

	if ( type === 'tag' && tags.length > 1 ) {
		if ( tags.length > 2 )
			var newTags = '<span class="small">Other tags:</span>';
		else
			var newTags = '<span class="small">Other tag:</span>';

		newTags += '<ul class="list-inline text-center">';
		tags.each( function () {
			if ( $( this ).text() !== hash ) {
				newTags += '\
<li>\n\
	<a class="label label-default" onclick="window.location.reload()" href="' + baseurl + '/tags/#' + encodeURIComponent( $( this ).text() ) + '">' + $( this ).text() + '</a>\n\
</li>';
			}
		} );
		newTags += '</ul>';
		newElemHTML = newElemHTML.replace( '$TAGS', newTags );
	} else
		newElemHTML = newElemHTML.replace( '$TAGS', '' );

	prodList.append( newElemHTML );
	var index = prodList.find( '> .thumbnail' ).index( prodList.find( '> .thumbnail:last' ) );
	setTimeout(
			function () {
				prodList.find( '> .thumbnail:eq(' + index + ')' ).fadeIn();
			}, 100 * decisecsToWait );
}
function prevProducts( e ) {
	if ( start > 0 ) {
		if ( start - paginate >= 0 ) {
			start -= paginate;
			--page;
		}
		end = start + paginate;
		if ( $( '#shopProducts' ).length )
			showProducts( prods, 'shop' );
		else if ( $( '#categorizedProducts' ).length )
			showProducts( prods, 'category' );
		else if ( $( '#taggedProducts' ).length )
			showProducts( prods, 'tag' );
	}
	if ( $( '#taggedProducts' ).length ) {
		$( "html, body" ).animate( { scrollTop: 0 }, "slow" );
		e = e || window.event;
		e.preventDefault();
	}
}
function nextProducts( e ) {
	if ( end < prods.length ) {
		if ( start + paginate <= prods.length ) {
			start += paginate;
			++page;
		}
		end = start + paginate;
		if ( $( '#shopProducts' ).length )
			showProducts( prods, 'shop' );
		else if ( $( '#categorizedProducts' ).length )
			showProducts( prods, 'category' );
		else if ( $( '#taggedProducts' ).length )
			showProducts( prods, 'tag' );
	}
	if ( $( '#taggedProducts' ).length ) {
		$( "html, body" ).animate( { scrollTop: 0 }, "slow" );
		e = e || window.event;
		e.preventDefault();
	}
}



/* 
 * Search widget
 */
function searchWidget( responseText ) {
	var searchProductsName = $( responseText ).find( 'url' );
	var searchProducts = searchProductsName;
	var searchText = $( '#search > form > .form-control' );
	var searchButton = $( '#search > form .btn' );
	var searchList = $( '#search .media-list' );
	var searchResultsFound = $( '#resultsFound' );
	var searchCount, reg;

	searchButton.click( function () {
		searchList.empty();
		var searchFor = searchText.val();
		reg = new RegExp( searchFor, "i" );
		if ( searchFor ) {
			searchCount = 0;
			searchProducts.each( function () {
				var elem = $( this );
				var productSearch = elem.text().search( reg );
				if ( productSearch > -1 ) {
					addSearchedProduct( elem, searchList );
					searchCount++;
				}
			} );

			if ( searchCount ) {
				if ( searchCount > 1 )
					searchResultsFound.text( searchCount + ' results found' );
				else
					searchResultsFound.text( searchCount + ' result found' );
			} else {
				searchList.append( '<li class="well text-center">No Results</li>' );
				searchResultsFound.text( 'No result found' );
			}

			$( '#searchModal' ).modal( 'show' );
		}
	} );

	$( '#sortBy' ).change( function () {
		switch ( $( '#sortBy' ).val() ) {
			case 'name':
				searchProducts = searchProductsName;
				break;
			case 'date':
				searchProducts = searchProducts.get().sort( function ( a, b ) {
					var a2 = $( a ).find( 'product\\:date' ).text();
					var b2 = $( b ).find( 'product\\:date' ).text();
					return Number( a2.replace( /[^0-9]+/g, "" ) ) - Number( b2.replace( /[^0-9]+/g, "" ) );
				} );
				searchProducts = $( searchProducts.reverse() );
				break;
			case 'price':
				searchProducts = searchProducts.get().sort( function ( a, b ) {
					var a2 = $( a ).find( 'product\\:price' ).text();
					var b2 = $( b ).find( 'product\\:price' ).text();
					return Number( a2.replace( /[^0-9\.]+/g, "" ) ) - Number( b2.replace( /[^0-9\.]+/g, "" ) );
				} );
				searchProducts = $( searchProducts );
				break;
			case 'price-desc':
				searchProducts = searchProducts.get().sort( function ( a, b ) {
					var a2 = $( a ).find( 'product\\:price' ).text();
					var b2 = $( b ).find( 'product\\:price' ).text();
					return Number( a2.replace( /[^0-9\.]+/g, "" ) ) - Number( b2.replace( /[^0-9\.]+/g, "" ) );
				} );
				searchProducts = $( searchProducts.reverse() );
				break;
		}
		if ( searchCount ) {
			searchList.fadeOut( 400, function () {
				searchList.empty();
				searchProducts.each( function () {
					var elem = $( this );
					var productSearch = elem.text().search( reg );
					if ( productSearch > -1 ) {
						addSearchedProduct( elem, searchList );
					}
				} );
				searchList.fadeIn();
			} );
		}
	} );

	searchText.keypress( function ( e ) {
		if ( e.keyCode === 13 ) {
			searchButton.click();
			e.preventDefault();
		}
	} );
}
function addSearchedProduct( elem, parent ) {
	var newElemHTML = '\
<li class="media">\n\
	$IMAGE\n\
	<div class="media-body">\n\
		<a href="$URL"><h4 class="media-heading">$TITLE $LABELS</h4></a>\n\
		<div class="text-success">$URL</div>\n\
		<p>$DESCRIPTION</p>\n\
	</div>\n\
</li>';

	var url = $.trim( elem.find( 'loc:first' ).text() );
	newElemHTML = newElemHTML.replace( '$URL', url );
	newElemHTML = newElemHTML.replace( '$URL', url );
	var title = elem.find( 'product\\:title' ).text();
	newElemHTML = newElemHTML.replace( '$TITLE', title );

	var newLabels = '';
	var sale = elem.find( 'product\\:sale' );
	var price = elem.find( 'product\\:price' );
	if ( sale.length ) {
		if ( price.length )
			newLabels = '<del class="label label-success">' + price.text() + '</del>';
		newLabels += '<span class="label label-danger"><ins>' + sale.text() + '</ins> Sale!</span>';
	} else if ( price.length )
		newLabels = '<span class="label label-success">' + price.text() + '</span>';

	newElemHTML = newElemHTML.replace( '$LABELS', newLabels );

	var desc = strip( elem.find( 'product\\:description' ).text() );
	var maxLength = 310; // maximum number of characters to extract
	// trim the string to the maximum length
	var trimmedDesc = desc.substr( 0, maxLength );
	// re-trim if we are in the middle of a word
	trimmedDesc = trimmedDesc.substr( 0, Math.min( trimmedDesc.length, trimmedDesc.lastIndexOf( " " ) ) );
	newElemHTML = newElemHTML.replace( '$DESCRIPTION', trimmedDesc + '...' );

	var image = elem.find( 'image\\:loc' );
	if ( image.length ) {
		var newImg = '\
<div class="pull-left thumbnail">\n\
	<a href="' + url + '">\n\
		<img class="media-object" src="' + image.random().text().trim() + '" alt="' + title + '">\n\
	</a>\n\
</div>';
		newElemHTML = newElemHTML.replace( '$IMAGE', newImg );
	} else
		newElemHTML = newElemHTML.replace( '$IMAGE', '' );

	parent.append( newElemHTML );
}



/* 
 * Plugins
 */
// Random element selector
$.fn.random = function () {
	var randomIndex = Math.floor( Math.random() * this.length );
	return jQuery( this[randomIndex] );
};



/* 
 * Functions
 */
// Strip HTML
function strip( html ) {
	var tmp = document.createElement( "DIV" );
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}
// Is Scrolled Into View
function isScrolledIntoView( elem ) {
	var $elem = $( elem );
	var $window = $( window );

	var docViewTop = $window.scrollTop();
	var docViewBottom = docViewTop + $window.height();

	var elemTop = $elem.offset().top;
	var elemBottom = elemTop + $elem.height();

	return ( ( elemBottom <= docViewBottom ) && ( elemTop >= docViewTop ) );
}
