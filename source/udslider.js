;(function($){
	$.fn.udslider = function(options){
		this.each(function(i, el){
			if(typeof el.Slider === 'object'){
				return el.Slider;
			}
			
			// settings
			var settings = $.extend({
				angle: 75,
				count: 5,
				speed: 600,
				timer: 5000
			}, options);
			
			// typized
			settings.count = parseInt(settings.count);
			settings.angle = parseFloat(settings.angle);
			settings.speed = parseFloat(settings.speed);
			settings.timer = parseFloat(settings.timer);
			
			// slider object
			var Slider = new (function(ul, options){
				var t = this; 
				
				// Elements
				t.ul = $(ul).fadeTo(1, 'slow');
				t.panel = t.ul.append($('<div class="panel"></div>')).find('.panel');
				t.panelText = t.panel.append($('<div class="text"></div>')).find('.text');
				t.children = t.ul.children('li');
				
				// Initial parameters
				t.options = options;
				t.currentIndex = 0;
				t.animateCount = 0;
				t.inAction = false;
				t.count = t.children.length;
				t.skewAngle = t.options.angle;
				t.calcAngle = 90 - t.skewAngle;
				t.skewWidth = 0;
				t.imageWidth = 0;
				t.stepPercent = 50 / (t.options.count - 1);
				t.sliding = false;
				
				t.getChildren = function(__reverse){
					var reverse = (typeof __reverse === 'undefined')? false : __reverse;
					var list = $(t.ul[0]).children('li').get();
					return (reverse)? $(list.reverse()) : $(list);
				};
				
				// Calculate sizes
				calculateSizes.call(t);
				
				t.slideTo = function(index, __important){
					if(index == t.currentIndex) return false;
					
					if(t.inAction) return false;
					
					t.inAction = true;
					
					if(index > t.count - 1) index = index - t.count;
					if(index < 0) index = t.count + index;
					
					var current = t.currentIndex;
					
					t.currentIndex = index;
					
					t.panelText.fadeOut(90, function(){
						$(this).empty();
					});
					
					var calcSide = (index - current <= (t.count - 1) + current - index)? 'left' : 'right';
						important = __important || calcSide;
					
					if(important == 'left'){
						t.slideLeft(index, current);
					}else{
						t.slideRight(index, current);
					}
					
				};
				
				t.slideLeft = function(index, __prev){
					var rightPosition = 95,
						zIndex = 100 + t.count,
						currentListIndex;
					
					var to = index,
						displace = Math.abs((to < __prev)? t.count - Math.abs(to - __prev) : __prev - to);
					
					t.getChildren().each(function(__i, el){
						if($(el).data('index') == to){
							currentListIndex = __i;
						}
					}).each(function(__i, el){
						var __li = $(el),
							__relocate = (__i < currentListIndex);
						
						(function(t, i, prev, relocate, displace){
							var li = this,
								fade = li.find('.fade'),
								logo = li.find('.logo'),
								p = li.find('p'),
								index = parseInt(li.data('index')),
								currentRight = parseInt(li.css('right')),
								isCurrent = (to == index),
								limit = t.options.count;
							
							var rightDisplace = (t.options.count - 1) - i + displace,
								right = rightDisplace * t.stepPercent;
							
							t.animateCount++;
							
							setTimeout(activateSlide, 120);
							
							if(relocate){
								
								var steps = Math.abs(rightDisplace),
									stepSpeed = t.options.speed / Math.abs(rightDisplace);
								
								var li = $(el).clone(true).css({
									zIndex: 99 - steps,
									right: '0%'
								}).appendTo(t.ul).animate({
									right: ((currentListIndex - i - 1) * t.stepPercent) + '%'
								}, t.options.speed, function(){
									
									t.animateCount--;
									
									if(t.animateCount == 0){
										t.inAction = false;
										//activateSlide();
									}
								});
								
								$(el).addClass('deleting').animate({
									right: 120 + '%'
								}, t.options.speed - 100, function(){
									$(this).remove();
								});
								
							}else{
								var li = $(el).css({
									//zIndex: 100 + t.count - i
								}).animate({
									right: right + '%'
								},function(){
									t.animateCount--;
										
									if(t.animateCount == 0){
										t.inAction = false;
										//activateSlide();
									}
								});
							}
							
						}).call(__li, t, __i, __prev, __relocate, displace);
						
						//zIndex--;
						rightPosition -= t.stepPercent;
					});
					
					t.getChildren().each(function(i, el){
						$(el).css({
							zIndex: 100 + t.count - i
						});
					});
				};
				
				t.slideRight = function(index, __prev){
					var rightPosition = t.stepPercent * (t.count - t.options.count) + 100,
						zIndex = 100 + t.count,
						currentListIndex;
					
					var to = index,
						displace = (to > __prev)? t.count - (to - __prev) : __prev - to;
					
					// Reversed children
					t.getChildren(true).each(function(__i, el){
						if($(el).data('index') == to){
							currentListIndex = __i;
						}
					}).each(function(__i, el){
						var __li = $(el),
							__relocate = (__i <= currentListIndex);
						
						(function(t, i, prev, relocate, displace){
							var li = this,
								el = li[0],
								fade = li.find('.fade'),
								logo = li.find('.logo'),
								p = li.find('p'),
								index = parseInt(li.data('index')),
								currentRight = parseInt(li.css('right')),
								
								isCurrent = (to == index),
									
								// лимит элементов в блоке
								limit = t.options.count;
							
							var rightDisplace = (i - (t.count - t.options.count) - displace),
								right = rightDisplace * t.stepPercent;
									
							t.animateCount++;
							
							setTimeout(activateSlide, 120);
									
							if(relocate){
								
								var steps = Math.abs(rightDisplace),
									stepSpeed = t.options.speed / Math.abs(rightDisplace),
									right = (isCurrent)? 50 : 50 - (currentListIndex - i) * t.stepPercent;
								
								$(el).clone(true).css({
									zIndex: 150 - steps,
									right: 120+'%'
								}).prependTo(t.ul).animate({
									right: right + '%',
									opacity: 1
								}, t.options.speed - 100, function(){
										
									t.animateCount--;
										
									if(t.animateCount == 0){
										t.inAction = false;
										//activateSlide();
									}	
								});
								
								$(el).addClass('deleting').animate({
									right: (-1 * t.stepPercent) + '%',
									opacity: 0
								}, t.options.speed - 100, function(){
									$(this).remove();
								});
							}else{
								$(el).css({zIndex: 100 + i}).animate({
									right: right + '%'
								},function(){
									t.animateCount--;
										
									if(t.animateCount == 0){
										t.inAction = false;
										//activateSlide();
									}
								});
							}
							
						}).call(__li, t, __i, __prev, __relocate, displace);
					});
					
					t.getChildren().each(function(i, el){
						$(el).css({
							zIndex: 100 + t.count - i
						});
					});
				};
				
				
				var rightPosition = 50,
					zIndex = 100 + t.count;
				
				t.getChildren().each(function(i, el){
					var li = $(el),
						img = li.children('img').first(),
						src =  img.attr('src'),
						logo = li.find('.logo'),
						p = li.find('p');
					
					li
						.css({
							'width'				: t.imageWidth + t.skewWidth,
							'-ms-transform' 	: 'skewX(-' + t.calcAngle + 'deg)',
							'transform' 		: 'skewX(-' + t.calcAngle + 'deg)',
							'zIndex' 			: zIndex,
							'right'				: rightPosition + '%',
							'marginRight' 		: '-' + (t.skewWidth / 2) + 'px'
						})
						.data('index', i)
						.append($('<span class="fade"></span>'))
						.click(function(){
							t.slideTo(i);
						});
					if(typeof $.browser.msie !== 'undefined' && parseInt($.browser.version) < 9){
						li.hover(function(){
							$(this).addClass('hover');
						},function(){
							$(this).removeClass('hover');
						});
					}
					
					if(i == t.currentIndex){
						li.removeClass('clickable');
						
						li.find('.fade').fadeIn();
						
						if(logo.length) t.panelText.append(logo.hide().clone().show());
						
						if(p.length) t.panelText.append(p.clone());
						
						t.panelText.fadeIn();
					}else{
						li.addClass('clickable');
					}
					
					li.hover(function(){
						if($(this).data('index') == t.currentIndex) return false;
						$(this).children('.fade').fadeIn();
					},function(){
						if($(this).data('index') == t.currentIndex) return false;
						$(this).children('.fade').fadeOut();
					});
					
					img.css({
						'-ms-transform' 	: 'skewX(' + t.calcAngle + 'deg)',
						'transform' 		: 'skewX(' + t.calcAngle + 'deg)',
						'right' 			: '-' + (t.skewWidth / 2) + 'px',
						//'width' 			: t.imageWidth
					});
					
					zIndex--;
					rightPosition -= t.stepPercent;
				});
				
				t.panel.append(
					$('<i class="arrow left"></i>').click(function(){
						t.slideTo(t.currentIndex - 1, 'right');
					})
				).append(
					$('<i class="arrow right"></i>').click(function(){
						t.slideTo(t.currentIndex + 1, 'left');
					}).css({right: ((-1 * ( this.skewWidth / 2 )) + 20)})
				);
				
				if(t.options.timer){
					t.ul.hover(function(){
						clearInterval(t.sliding);
					},function(){
						t.sliding = setInterval(autoSlide, t.options.timer);
					});
					t.sliding = setInterval(autoSlide, t.options.timer);
				}
				
				$(window).resize(onWindowResize);
				
				function autoSlide(){
					t.slideTo(t.currentIndex + 1, 'left');
				}
				
				function calculateSizes(){
					this.width = this.ul.width();
					this.height = this.ul.height();
					this.skewWidth = Math.round(this.height/Math.tan(this.skewAngle/180*Math.PI)*1000)/1000;
					this.imageWidth = this.width / 2 + this.skewWidth;
				}
				
				function onWindowResize(e){
					calculateSizes.call(t);
				}
				
				function activateSlide(){
					t.panelText.hide().empty();
					
					t.panelText.unbind('click');
					
					t.getChildren().not('.deleting').each(function(i, el){
						var li = $(el),
							a = li.find('a').first(),
							fade = li.find('.fade'),
							logo = li.find('.logo'),
							p = li.find('p'),
							index = parseInt(li.data('index'));
						
						if(t.currentIndex == index){
							li.removeClass('clickable');
							fade.fadeIn(200);
							if(logo.length) t.panelText.append(logo.hide().clone().show());
							if(p.length) t.panelText.append(p.clone());
							
							t.panelText.fadeIn(300).bind('click', function(){
								location.href = a[0].href;
							});
						}else{
							fade.fadeOut();
							li.addClass('clickable');
						}
					});
				}
				
				window.t = t;
				
			})(this, settings);
			
			this.Slider = Slider;
		});
		
		return this;
	};
})(jQuery);
