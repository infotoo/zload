# zload
$zload is a jquery-based, JavaScript and CSS Loader with callback function

## Important Notice
Because the source has used "[Line Macro](https://github.com/infotoo/line-macro)" syntax to import external file, only the minified **"zload.min.js"** will work on the browser. If you want to build the minified file yourself, you may use our utility "[minify](https://github.com/infotoo/minify)" which will auto-handle "Line Macro" syntax.
```
# /home/bin/minify zload.js
```

## Example
```html
<script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script type="text/javascript">

$zload('lib_name',{
  css: ['https://example.com/css/lib.css'],
  js: ['https://example.com/js/lib.js']
},function(){
  //callback function
});

$zload('lib_name',function(){
  //another callback function 
});

</script>
```
