/**
 * $zload - version 3.2 - Copyright (c) 2012-2015 Infotoo International Limited - http://www.infotoo.com (MIT license)
 *
 * Required LazyLoad 2.0.3 - Copyright (c) 2011 Ryan Grove <ryan@wonko.com> - https://github.com/rgrove/lazyload/ (MIT license)
 * Last updated: 2015-04-23
 */
(function(){

	~import 'lazyload.js';

	var $m = {
		events: {},
		init: function( name, v ){},
		load: function( name ){},
		ready: function( a ){},
		register: function( name, fn ){},
		trigger: function( name ){}
	};

	var $z = function(){
			$m.ready( arguments );
		};
	$z.map = {};
	$z.version = '3.2';

	$m.init = function( name, v ){
			if( !$z.map[name] ){
				$z.map[name] = v;
			}else{
				for( var i in v ){
					$z.map[name][i] = v[i];
				}
			}
		};

	$m.load = function( name ){
			if( !$z.map[name] ){
				return;
			}
			if( $z.map[name].isReady ){
				$m.trigger( name );
				return;
			}
			if( $z.map[name].isLoad ){
				return;
			}
			if( $z.map[name].load && typeof($z.map[name].load)=='function' ){
				$z.map[name].load();
			}else{
				$z.map[name].isLoad = 1;

				var checkCount = ( ($z.map[name].js)? $z.map[name].js.length : 0 ) + ( ($z.map[name].css)? $z.map[name].css.length : 0 ) + ( ($z.map[name].uses)? $z.map[name].uses.length : 0 );
				var runCount = ($z.map[name].fn)? $z.map[name].fn.length : 0;
				var runIndex = 0;

				var checkReady = function(){
					checkCount -= 1;
					if( checkCount <= 0 ){
						if( runIndex < runCount ){
							runIndex += 1;
							(function( func ){
								if( typeof(func)=='function' ){
									setTimeout(function(){
										func( checkReady );
									}, 1 );
								}else{
									checkReady();
								}
							})( $z.map[name].fn[runIndex - 1] );
						}else{
							$z.map[name].isReady = 1;
							$m.trigger( name );
						}
					}
				};

				if( $z.map[name].uses ){
					for( var i = 0; i<$z.map[name].uses.length; i++ ){
						$zload( $z.map[name].uses[i], checkReady );
					}
				}
				//#Fix Bug in Chrome, so call one by one
				if( $z.map[name].css ){
					for( var i = 0; i<$z.map[name].css.length; i++ ){
						LazyLoad.css( $z.map[name].css[i], checkReady );
					}
				}
				//#Fix Bug in Chrome, so call one by one
				if( $z.map[name].js ){
					for( var i = 0; i<$z.map[name].js.length; i++ ){
						LazyLoad.js( $z.map[name].js[i], checkReady );
					}
				}

			}
		};

	$m.ready = function( a ){
			if( typeof(a[0])=='string' ){
				var name = a[0];
				if( a.length > 1 ){
					for( var i = 1; i < a.length; i++ ){
						var v = a[i];
						if( typeof(v)=='object' ){
							$m.init( name, v );
						}
						else if( typeof(v)=='function' ){
							$m.register( name, v );
						}
						else if( typeof(v)=='number' ){
							setTimeout( function(){ $m.load(name); }, v );
						}
					}
				}
				$m.load( name );
			}
		};

	$m.register = function( name, fn ){
			if( !$m.events[name] ){
				$m.events[name] = [];
			}
			$m.events[name].push( fn );
		};

	$m.trigger = function( name ){
			if( $m.events[name] && $m.events[name].length > 0 ){
				var fn = $m.events[name].shift();
				setTimeout(function(){ $m.trigger(name); }, 1 );
				fn();
			}
		};

	window.$zload = $z;

})();
