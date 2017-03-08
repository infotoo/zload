# zload
$zload is a jquery-based, JavaScript and CSS Loader with callback function

## Important Notice
Because the source has used "[Line Macro](https://github.com/infotoo/line-macro)" syntax to import external file, only the minified **"zload.min.js"** will work on the browser.

## Example
```html
<script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="zload.min.js"></script>
<script type="text/javascript">

$zload('lib1',{
  css: ['https://example.com/css/lib1.css','https://example.com/css/lib1-theme.css'],
  js: ['https://example.com/js/lib1.js']
},function(){
  //callback function
});

$zload('lib1',function(){
  //another callback function 
});

/* lib2 depends on lib1 */
$zload('lib2',{
  js: ['https://example.com/js/lib2.js','https://example.com/js/lib2-addon.js'],
  use: ['lib1']
},function(){
  //callback function 
});

</script>
```

## Hint
If you want to build the minified file yourself, you may use our utility "[minify](https://github.com/infotoo/minify)" which will auto-handle "Line Macro" syntax.
```
# /home/bin/minify zload.js
```
