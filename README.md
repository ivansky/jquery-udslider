jQuery flacky slider plugin
===============
1. [Load requirements](#load-requirements)
2. [Initialize slider](#initialize-slider)
3. [Example usage](#example-usage)

##Load requirements
```html
<!--jQuery-->
<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>

<!--UdSlider-->
<script src="./../source/udslider.js"></script>
<link href="./../source/udslider.css" rel="stylesheet">
```
##Initialize slider
```js
$(function(){
	$('#udslider').udslider({
		angle: 72, 		// Skew angle, default 75
		count: 5, 		// Limit visible sliders join main
		timer: 3500 	// Time to autoslide, 0 - disable
	});
});
```

##Example usage
```html
	<ul class="udslider" id="udslider" style="height:340px;opacity:0;">
		<li>
			<img src="slider-pics/01-slider-picture.jpg" alt="">
			<img src="logo-slider/01-logo-slider.png" class="logo" alt="">
			<p>description first</p>
			<a href="http://domain.com"></a>
		</li>
		<li>
			<img src="slider-pics/02-slider-picture.jpg" alt="">
			<img src="logo-slider/02-logo-slider.png" class="logo" alt="">
			<p>description second</p>
		</li>
	</ul>
```