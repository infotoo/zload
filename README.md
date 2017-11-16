# zload
$zload is a tiny JavaScript and CSS Loader with callback function 

## Example
### Example 1
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
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
</head>
<body>
</body>
</html>
```

### Example 2
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

### Example 3
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<script src="zload.min.js"></script>
<script>
/* define resource without loading */
$zload.map['jquery'] = {
    js: ['https://code.jquery.com/jquery-3.2.1.min.js']
};
</script>
</head>
<body>
<script>
/* load on the fly */
$zload('jquery',function(){
      $('body').append('we need jQuery now');
});
</script>
</body>
</html>
```

## Version Remark
### Version 3.3
Since version 3.3, $zload is no longer to used "[Line Macro](https://github.com/infotoo/line-macro)" for import external library. The external library is bundle inside.

### Version 3.0

Since version 3.0, $zload is no longer jquery-based. You can use $zload to load jQuery instead.

Because the source has used "[Line Macro](https://github.com/infotoo/line-macro)" syntax to import external file, only the minified **"zload.min.js"** will work on the browser.

#### Hint
If you want to build the minified file yourself, you may use our utility "[minify](https://github.com/infotoo/minify)" which will auto-handle "Line Macro" syntax.
```
# /home/bin/minify zload.js
```
