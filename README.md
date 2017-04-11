# zload
$zload is a tiny JavaScript and CSS Loader with callback function 

## Important Notice
Because the source has used "[Line Macro](https://github.com/infotoo/line-macro)" syntax to import external file, only the minified **"zload.min.js"** will work on the browser.

## Example 1
```html
<script src="zload.min.js"></script>
<script>

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
## Example 2
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<script src="zload.min.js"></script>
<script>
$zload('jquery',{
    js: ['https://code.jquery.com/jquery-3.2.1.min.js']
},function(){
    $('body').append('jQuery can be loaded by $zload');
});
</script>
</head>
<body>
</body>
</html>

```

## Version Remark
Since version 3.0, $zload is no longer jquery-based. You can use $zload to load jQuery instead.

## Hint
If you want to build the minified file yourself, you may use our utility "[minify](https://github.com/infotoo/minify)" which will auto-handle "Line Macro" syntax.
```
# /home/bin/minify zload.js
```
