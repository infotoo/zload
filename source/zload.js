/**
 * $zload - version 3.3 - Copyright (c) 2012-2017 Infotoo International Limited - http://www.infotoo.com (MIT license)
 *
 * Required LazyLoad 2.0.3 - Copyright (c) 2011 Ryan Grove <ryan@wonko.com> - https://github.com/rgrove/lazyload/ (MIT license)
 * Last updated: 2017-05-04
 */
(function(doc){

	/* $zload object */

	var $z = function(){
			$zload_ready( arguments );
		};
	$z.map = {};
	$z.version = '3.3';

	/* private variable */

	var $zload_events = {},						// store callback
		env,									// User agent and feature test information.
		head,									// Reference to the <head> element (populated lazily).
		styleSheets = doc.styleSheets,			// Reference to the browser's list of stylesheets.
		LazyLoad_pending = {},					// Requests currently in progress, if any.
		LazyLoad_pollCount = 0,					// Number of times we've polled to check whether a pending stylesheet has finished loading. If this gets too high, we're probably stalled.
		LazyLoad_queue = {css: [], js: []};		// Queued requests.

	//**************************************************************************************************//
	//	Implementation of methods of $zload
	//**************************************************************************************************//

		var $zload_init = function( name, v ){
				if ( !$z.map[name] )
				{
					$z.map[name] = v;
				}
				else
				{
					for ( var i in v )
					{
						$z.map[name][i] = v[i];
					}
				}
			};

		var $zload_load = function( name ){
				if ( !$z.map[name] )
				{
					return;
				}
				if ( $z.map[name].isReady )
				{
					$zload_trigger( name );
					return;
				}
				if ( $z.map[name].isLoad )
				{
					return;
				}
				if ( $z.map[name].load && typeof($z.map[name].load)=='function' )
				{
					$z.map[name].load();
				}
				else
				{
					$z.map[name].isLoad = 1;

					var checkCount = ( ($z.map[name].js)? $z.map[name].js.length : 0 ) + ( ($z.map[name].css)? $z.map[name].css.length : 0 ) + ( ($z.map[name].uses)? $z.map[name].uses.length : 0 );
					var runCount = ($z.map[name].fn)? $z.map[name].fn.length : 0;
					var runIndex = 0;

					var checkReady = function(){
						checkCount -= 1;
						if ( checkCount <= 0 )
						{
							if ( runIndex < runCount )
							{
								runIndex += 1;
								(function( func ){
									if ( typeof(func)=='function' )
									{
										setTimeout(function(){
											func( checkReady );
										}, 1 );
									}
									else
									{
										checkReady();
									}
								})( $z.map[name].fn[runIndex - 1] );
							}
							else
							{
								$z.map[name].isReady = 1;
								$zload_trigger( name );
							}
						}
					};

					if ( $z.map[name].uses )
					{
						for ( var i = 0; i<$z.map[name].uses.length; i++ )
						{
							$zload( $z.map[name].uses[i], checkReady );
						}
					}
					/* Fix Bug in Chrome, so call one by one */
					if ( $z.map[name].css )
					{
						for ( var i = 0; i<$z.map[name].css.length; i++ )
						{
							LazyLoad_load('css', $z.map[name].css[i], checkReady );
						}
					}
					/* Fix Bug in Chrome, so call one by one */
					if ( $z.map[name].js )
					{
						for ( var i = 0; i<$z.map[name].js.length; i++ )
						{
							LazyLoad_load('js', $z.map[name].js[i], checkReady );
						}
					}

				}
			};

		var $zload_ready = function( a ){
				if ( typeof(a[0])=='string' )
				{
					var name = a[0];
					if ( a.length > 1 )
					{
						for ( var i = 1; i < a.length; i++ )
						{
							var v = a[i];
							if ( typeof(v)=='object' )
							{
								$zload_init( name, v );
							}
							else if ( typeof(v)=='function' )
							{
								$zload_register( name, v );
							}
							else if ( typeof(v)=='number' )
							{
								setTimeout( function(){ $zload_load(name); }, v );
							}
						}
					}
					$zload_load( name );
				}
			};

		var $zload_register = function( name, fn ){
				if ( !$zload_events[name] )
				{
					$zload_events[name] = [];
				}
				$zload_events[name].push( fn );
			};

		var $zload_trigger = function( name ){
				if ( $zload_events[name] && $zload_events[name].length > 0 )
				{
					var fn = $zload_events[name].shift();
					setTimeout(function(){ $zload_trigger(name); }, 1 );
					fn();
				}
			};

	//**************************************************************************************************//
	//	Implementation of methods imported form Lazyload version 2.0.3 (with modifications)
	//
	// 	original source code: https://github.com/rgrove/lazyload/
	//**************************************************************************************************//

		/**
		Creates and returns an HTML element with the specified name and attributes.

		@method LazyLoad_createNode
		@param {String} name element name
		@param {Object} attrs name/value mapping of element attributes
		@return {HTMLElement}
		@private
		*/
		var LazyLoad_createNode = function( name, attrs ) {
				var node = doc.createElement(name), attr;
				for ( attr in attrs )
				{
					if ( attrs.hasOwnProperty(attr) )
					{
						node.setAttribute(attr, attrs[attr]);
					}
				}
				return node;
			};

		/**
		Called when the current pending resource of the specified type has finished loading. Executes the associated callback (if any) and loads the next resource in the queue.

		@method LazyLoad_finish
		@param {String} type resource type ('css' or 'js')
		@private
		*/
		var LazyLoad_finish = function( type ) {
				var p = LazyLoad_pending[type],
				callback,
				urls;
				if ( p )
				{
					callback = p.callback;
					urls = p.urls;

					urls.shift();
					LazyLoad_pollCount = 0;

					// If this is the last of the pending URLs, execute the callback and start the next request in the queue (if any).
					if ( !urls.length )
					{
						callback && callback.call();
						LazyLoad_pending[type] = null;
						LazyLoad_queue[type].length && LazyLoad_load(type);
					}
				}
			};

		/**
		Populates the <code>env</code> variable with user agent and feature test information.

		@method LazyLoad_getEnv
		@private
		*/
		var LazyLoad_getEnv = function() {
				var ua = navigator.userAgent;

				env = {
					// True if this browser supports disabling async mode on dynamically created script nodes. See http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
					async: doc.createElement('script').async === true
				};
				(env.webkit = /AppleWebKit\//.test(ua))
					|| (env.ie = /MSIE/.test(ua))
						|| (env.opera = /Opera/.test(ua))
							|| (env.gecko = /Gecko\//.test(ua))
								|| (env.unknown = true);
			};

		//========== HOTFIX ==========
		//Simple browser version sniffing - Could easily be incorporated into the LazyLoad_getEnv function to save a few bytes.

		var Browser = {
			Version: function() {
				var version = 999; // we assume a sane browser

				if ( navigator.appVersion.indexOf("MSIE") != -1 )
				{
					// bah, IE again, lets downgrade version number
					version = parseFloat(navigator.appVersion.split("MSIE")[1]);
				}
				return version;
			}
		}

		/**
		Loads the specified resources, or the next resource of the specified type in the queue if no resources are specified.
		If a resource of the specified type is already being loaded, the new request will be queued until the first request has been finished.

		When an array of resource URLs is specified, those URLs will be loaded in parallel if it is possible to do so while preserving execution order.
		All browsers support parallel loading of CSS, but only Firefox and Opera support parallel loading of scripts.
		In other browsers, scripts will be queued and loaded one at a time to ensure correct execution order.

		Note: The param "obj" and "context" are removed since they are not used here.

		@method LazyLoad_load
		@param {String} type resource type ('css' or 'js')
		@param {String|Array} urls (optional) URL or array of URLs to load
		@param {Function} callback (optional) callback function to execute when the	resource is loaded
		@private
		*/
		var LazyLoad_load = function( type, urls, callback ) {
				var _finish = function () { LazyLoad_finish(type); },
					isCSS = type === 'css',
					nodes = [],
					i, len, node, p, pendingUrls, url;

				env || LazyLoad_getEnv();
				if ( urls )
				{
					// If urls is a string, wrap it in an array. Otherwise assume it's an array and create a copy of it so modifications won't be made to the original.
					urls = typeof urls === 'string' ? [urls] : urls.concat();

					// Create a request object for each URL. If multiple URLs are specified, the callback will only be executed after all URLs have been loaded.
					//
					// Sadly, Firefox and Opera are the only browsers capable of loading scripts in parallel while preserving execution order.
					// In all other browsers, scripts must be loaded sequentially.
					//
					// All browsers respect CSS specificity based on the order of the link elements in the DOM, regardless of the order in which the stylesheets are actually downloaded.
					if ( isCSS || env.async || env.gecko || env.opera )
					{
						// Load in parallel.
						LazyLoad_queue[type].push({
							urls : urls,
							callback: callback
						});
					}
					else
					{
						// Load sequentially.
						for ( i = 0, len = urls.length; i < len; ++i )
						{
							LazyLoad_queue[type].push({
								urls : [urls[i]],
								callback: i === len - 1 ? callback : null // callback is only added to the last URL
							});
						}
					}
				}

				// If a previous load request of this type is currently in progress, we'll wait our turn. Otherwise, grab the next item in the queue.
				if ( LazyLoad_pending[type] || !(p = LazyLoad_pending[type] = LazyLoad_queue[type].shift()) )
				{
					return;
				}

				head || (head = doc.head || doc.getElementsByTagName('head')[0]);
				pendingUrls = p.urls;

				for ( i = 0, len = pendingUrls.length; i < len; ++i )
				{
					url = pendingUrls[i];

					if ( isCSS )
					{
						node = env.gecko ? LazyLoad_createNode('style') : LazyLoad_createNode('link', {
							href: url,
							rel : 'stylesheet'
						});
					}
					else
					{
						node = LazyLoad_createNode('script', {src: url});
						node.async = false;
					}

					node.className = 'lazyload';
					node.setAttribute('charset', 'utf-8');

					//========== HOTFIX ==========
					//	  if ( env.ie && !isCSS ) {

					if ( env.ie && !isCSS && Browser.Version() < 10 )
					{
						node.onreadystatechange = function () {
							if ( /loaded|complete/.test(node.readyState) )
							{
								node.onreadystatechange = null;
								_finish();
							}
						};
					}
					else if ( isCSS && (env.gecko || env.webkit) )
					{
						// Gecko and WebKit don't support the onload event on link nodes.
						if ( env.webkit )
						{
							// In WebKit, we can poll for changes to document.styleSheets to
							// figure out when stylesheets have loaded.
							p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
							LazyLoad_pollWebKit();
						}
						else
						{
							// In Gecko, we can import the requested URL into a <style> node and
							// poll for the existence of node.sheet.cssRules. Props to Zach
							// Leatherman for calling my attention to this technique.
							node.innerHTML = '@import "' + url + '";';
							LazyLoad_pollGecko(node);
						}
					}
					else
					{
						node.onload = node.onerror = _finish;
					}

					nodes.push(node);
				}

				for ( i = 0, len = nodes.length; i < len; ++i )
				{
					head.appendChild(nodes[i]);
				}
			};

		/**
		Begins polling to determine when the specified stylesheet has finished loading in Gecko. Polling stops when all pending stylesheets have loaded or after 10 seconds (to prevent stalls).

		Thanks to Zach Leatherman for calling my attention to the @import-based cross-domain technique used here, and to Oleg Slobodskoi for an earlier same-domain implementation. See Zach's blog for more details: http://www.zachleat.com/web/2010/07/29/load-css-dynamically/

		@method LazyLoad_pollGecko
		@param {HTMLElement} node Style node to poll.
		@private
		*/
		var LazyLoad_pollGecko = function( node ) {
				var hasRules;

				try {
					// We don't really need to store this value or ever refer to it again, but if we don't store it, Closure Compiler assumes the code is useless and removes it.
					hasRules = !!node.sheet.cssRules;
				} catch (ex) {
					// An exception means the stylesheet is still loading.
					LazyLoad_pollCount += 1;

					if ( LazyLoad_pollCount < 200 )
					{
						setTimeout(function () { LazyLoad_pollGecko(node); }, 50);
					}
					else
					{
						// We've been polling for 10 seconds and nothing's happened. Stop polling and finish the pending requests to avoid blocking further requests.
						hasRules && LazyLoad_finish('css');
					}
					return;
				}

				// If we get here, the stylesheet has loaded.
				LazyLoad_finish('css');
			};

		/**
		Begins polling to determine when pending stylesheets have finished loading in WebKit. Polling stops when all pending stylesheets have loaded or after 10 seconds (to prevent stalls).

		@method LazyLoad_pollWebKit
		@private
		*/
		var LazyLoad_pollWebKit = function() {
				var css = LazyLoad_pending.css, i;

				if ( css )
				{
					i = styleSheets.length;

					// Look for a stylesheet matching the pending URL.
					while ( --i >= 0 )
					{
						if ( styleSheets[i].href === css.urls[0] )
						{
							LazyLoad_finish('css');
							break;
						}
					}

					LazyLoad_pollCount += 1;

					if ( css )
					{
						if ( LazyLoad_pollCount < 200 )
						{
							setTimeout(LazyLoad_pollWebKit, 50);
						}
						else
						{
							// We've been polling for 10 seconds and nothing's happened, which may indicate that the stylesheet has been removed from the document before it had a chance to load.
							// Stop polling and finish the pending request to prevent blocking further requests.
							LazyLoad_finish('css');
						}
					}
				}
			};

	//**************************************************************************************************//
	//	publish object
	//**************************************************************************************************//

	window.$zload = $z;

})(this.document);
