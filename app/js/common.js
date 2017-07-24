$(document).ready(function() {

	initSlider(); //Инициализируем все слайдеры

	initPopup(); // инициализация попапа

	svg4everybody(); //Инициализация поддержки свг

	headerAnimated(); //Анимция для хедера

	iosScroll(); // Включаем скролл в попапах для IOS

	initAgPopup();  // Инициализация кастомного попапа

	inputFileStyled(); // Обработка инпут файла

	// placeholder(); // Имитация placeholder-а

	tabs(); // Табы


	smoothScroll.init({
		selector: '[data-scroll]', 
		selectorHeader: '', 
		speed: 500, 
		easing: 'easeOutCubic',
		offset: 0
	});  // Плавный якорный-скролл 

	if($(window).innerWidth() >= 760) {
		disableHover();  // Отключаем ховеры при скролле
	}


});




// Версии браузеров

    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;




var rellax = new Rellax('.rellax'); //инициализируем параллаксa

var html = document.getElementsByTagName( 'html' )[0]; 

var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

if (iOS) {
	html.classList.add('ios');
}

var myMap;

if ($('#map').length) {
	ymaps.ready(initYandexMap);
}

function initYandexMap () {
    myMap = new ymaps.Map('map', {
        center: [55.635650, 49.211499], // Москва
        zoom: 16,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });

    myMap.behaviors.disable('scrollZoom'); 

}



function initPopup() {

	$('.zoom-gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom mfp-img-mobile',
		image: {
			verticalFit: true
		},
		gallery: {
			enabled: true,
			tCounter: '%curr% из %total%' 
		},
		zoom: {
			enabled: false,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) {
				return element.find('img');
			}
		}
		
	});

	$('.popup-youtube').magnificPopup({
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false
	});

	$('.js-popup-animate').magnificPopup({
		type: 'inline',
		midClick: true,
		fixedContentPos: true,
		removalDelay: 500, //delay removal by X to allow out-animation
		callbacks: {
			beforeOpen: function() {
				this.st.mainClass = this.st.el.attr('data-effect');
			}
		}
	});
}


function initSlider() {
	var modificSlider = new Swiper('.product__mod__slider', {
	    slidesPerView: 'auto',
	    freeMode: true,
	    grabCursor: true,
	    breakpoints: {
			760: {
				freeMode: false,
				grabCursor: false,
				onlyExternal: true
			}
		}
	});


	// Галерея

	var galleryTop = new Swiper('.gallery-top', {
		speed: 600,
		spaceBetween: 10,
        loop: true,
        loopedSlides: 10,
		breakpoints: {
			768: {
				
			}
		}
	});

	var galleryThumbs = new Swiper('.gallery-thumbs', {
		spaceBetween: 0,
		speed: 600,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
        loop: true,
        loopedSlides: 10,
		breakpoints: {
			480: {
				
			}
		}
	});

	galleryTop.params.control = galleryThumbs;
	galleryThumbs.params.control = galleryTop;




	$('.js-line-slider').each(function() {
		new Swiper(this, {
			slidesPerView: 6,
			spaceBetween: 10,
			speed: 600,
			nextButton: $(this).parents('.product-line-slider__wrap').find('.product-line-slider__next'),
			prevButton: $(this).parents('.product-line-slider__wrap').find('.product-line-slider__prev'),
			slidesOffsetBefore: 0,
			breakpoints: {
				1700: {
					slidesPerView: 5,
				},
				1440: {
					slidesPerView: 4,
				},
				1024: {
					slidesPerView: 3,
				},
				760: {
					slidesPerView: 2,
				},
				600: {
					slidesPerView: 2,
					nextButton: '',
					prevButton: '',
					initialSlide: 1,
					centeredSlides: true
				}
			}
		});
	});

}

function findScrollbarWidth() {
	var scrollDiv = document.createElement("div");
	scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
	document.body.appendChild(scrollDiv);
	var scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);
	return scrollbarSize;
}

var scrollWidth = findScrollbarWidth(); // Определение ширины скроллбара


function disableHover() {
	var body = document.body,
		timer;
	window.addEventListener('scroll', function() {
		clearTimeout(timer);
		if(!body.classList.contains('disable-hover')) {
			body.classList.add('disable-hover')
		}
		timer = setTimeout(function() {
			body.classList.remove('disable-hover')
		}, 300);
	}, false);
}


function headerAnimated() {
	
	var mainHeader = $('.header'),
		secondaryNavigation = $('.secondary-nav'),
		//this applies only if secondary nav is below intro section
		belowNavHeroContent = $('.sub-nav-hero'),
		headerHeight = mainHeader.height();
	
	//set scrolling variables
	var scrolling = false,
		previousTop = 0,
		currentTop = 0,
		scrollDelta = 10,
		scrollOffset = 0;


	$(window).on('scroll', function(){
		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame)
				? setTimeout(autoHideHeader, 250)
				: requestAnimationFrame(autoHideHeader);
		}
	});

	$(window).on('resize', function(){
		headerHeight = mainHeader.height();
	});

	function autoHideHeader() {
		var currentTop = $(window).scrollTop();

		( belowNavHeroContent.length > 0 ) 
			? checkStickyNavigation(currentTop) // secondary navigation below intro
			: checkSimpleNavigation(currentTop);

	   	previousTop = currentTop;
		scrolling = false;
	}

	function checkSimpleNavigation(currentTop) {
		//there's no secondary nav or secondary nav is below primary nav
	    if (previousTop - currentTop > scrollDelta) {
	    	//if scrolling up...
	    	mainHeader.removeClass('is-hidden');
	    } else if( currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
	    	//if scrolling down...
	    	mainHeader.addClass('is-hidden');
	    }
	}

	function checkStickyNavigation(currentTop) {
		//secondary nav below intro section - sticky secondary nav
		var secondaryNavOffsetTop = belowNavHeroContent.offset().top - secondaryNavigation.height() - mainHeader.height();
		
		if (previousTop >= currentTop ) {
	    	//if scrolling up... 
	    	if( currentTop < secondaryNavOffsetTop ) {
	    		//secondary nav is not fixed
	    		mainHeader.removeClass('is-hidden');
	    		secondaryNavigation.removeClass('fixed slide-up');
	    		belowNavHeroContent.removeClass('secondary-nav-fixed');
	    	} else if( previousTop - currentTop > scrollDelta ) {
	    		//secondary nav is fixed
	    		mainHeader.removeClass('is-hidden');
	    		secondaryNavigation.removeClass('slide-up').addClass('fixed'); 
	    		belowNavHeroContent.addClass('secondary-nav-fixed');
	    	}
	    	
	    } else {
	    	//if scrolling down...	
	 	  	if( currentTop > secondaryNavOffsetTop + scrollOffset ) {
	 	  		//hide primary nav
	    		mainHeader.addClass('is-hidden');
	    		secondaryNavigation.addClass('fixed slide-up');
	    		belowNavHeroContent.addClass('secondary-nav-fixed');
	    	} else if( currentTop > secondaryNavOffsetTop ) {
	    		//once the secondary nav is fixed, do not hide primary nav if you haven't scrolled more than scrollOffset 
	    		mainHeader.removeClass('is-hidden');
	    		secondaryNavigation.addClass('fixed').removeClass('slide-up');
	    		belowNavHeroContent.addClass('secondary-nav-fixed');
	    	}

	    }
	}
}


function inputFileStyled() {
	var wrapper = $(".input-file-style"),
		inp = wrapper.find("input"),
		btn = wrapper.find("button"),
		lbl = wrapper.find("div");
	// Crutches for the :focus style:
	btn.focus(function() {
		wrapper.addClass("focus");
	}).blur(function() {
		wrapper.removeClass("focus");
	});
	// Yep, it works!
	btn.add(lbl).click(function() {
		inp.click();
	});
	var file_api = (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;
	inp.change(function() {
		var file_name;
		if(file_api && inp[0].files[0]) file_name = inp[0].files[0].name;
		else file_name = inp.val().replace("C:\\fakepath\\", '');
		if(!file_name.length) return;
		if(lbl.is(":visible")) {
			lbl.text(file_name);
		} else btn.text(file_name);
	}).change();
}


function initAgPopup() {
	$(document).on('click', '.js-open-review-popup', function(event) {
		event.preventDefault();
		$('html').addClass('review-popup--open');
		$('html').css({
			'margin-right': scrollWidth + 'px',
			'overflow': 'hidden'
		});
		$('.ag-popup.review-popup__wrap').addClass('ag-popup--active');
		setTimeout(function() {
			$('.overlay').addClass('overlay--active');
		}, 200);
		if (iOS) {
			document.ontouchmove = function(e){ e.preventDefault(); }
		}
	});
	$(document).on('click touchstart', '.review-popup--open .overlay', function(event) {
		event.preventDefault();
		$('.ag-popup').removeClass('ag-popup--active');
		setTimeout(function() {
			$('.overlay').removeClass('overlay--active');
			$('html').removeClass('review-popup--open');
		}, 200);
		setTimeout(function() {
			$('html').css({
				'margin-right': '',
				'overflow': ''
			});
		}, 700);
		if (iOS) {
			document.ontouchmove = function(e){ return true; }
		}
	});
}

function iosScroll() {
	// Check if we should allow scrolling up or down
	$(document.body).on("touchstart", ".scroll-y", function(e) {
		// If the element is scrollable (content overflows), then...
		if(this.scrollHeight !== this.clientHeight) {
			// If we're at the top, scroll down one pixel to allow scrolling up
			if(this.scrollTop === 0) {
				this.scrollTop = 1;
			}
			// If we're at the bottom, scroll up one pixel to allow scrolling down
			if(this.scrollTop === this.scrollHeight - this.clientHeight) {
				this.scrollTop = this.scrollHeight - this.clientHeight - 1;
			}
		}
		// Check if we can scroll
		this.allowUp = this.scrollTop > 0;
		this.allowDown = this.scrollTop < (this.scrollHeight - this.clientHeight);
		this.lastY = e.originalEvent.pageY;
	});
	$(document.body).on('touchmove', ".scroll-y", function(e) {
		var event = e.originalEvent;
		var up = event.pageY > this.lastY;
		var down = !up;
		this.lastY = event.pageY;
		if((up && this.allowUp) || (down && this.allowDown)) {
			event.stopPropagation();
		} else {
			event.preventDefault();
		}
	});
}

function iosMinHeight() {
	if (iOS) {
		if ($(window).innerHeight() <= 480) {
			$('.mobile-menu').addClass('scroll-y');
			iosScroll();

		}else{
			$('.mobile-menu').removeClass('scroll-y');
		}
	}
	if ($(window).innerHeight() <= 480) {
		$('.mobile-menu').css('overflow-y', 'auto');
	}else{
		$('.mobile-menu').css('overflow-y', '');
	}
}


function tabs() {
	$(document).on('click' , '.tab__buttons .tab__button', function() {
		$(this).parents('.tabs').find(".tab__button").removeClass("active").eq($(this).index()).addClass("active");
		$(this).parents('.tabs').find(".tab__item").removeClass("show").eq($(this).index()).addClass('show');
	});

	var hash = location.hash;
	if (hash !== '') $('a.tab__button[href$="'+hash+'"]').trigger('click');

}


// фиксим баги с анимированием выезжающих блоков при ресайзе

function deleteAnimatePopup() {
	$('.ag-popup').addClass('ag-popup--hide');
	setTimeout(function() {
		$('.ag-popup').removeClass('ag-popup--hide');
	}, 600);
}

deleteAnimatePopup(); //Удаляем анимацию попапа для избежания бага при ресайзе

if (isEdge) { 
	setTimeout(function() {}, 600);
	$('.ag-popup').css('display', 'block');
}

//Инициализация функций при ресайзе

$(window).on('resize', function(){

	iosMinHeight();

	deleteAnimatePopup();

});

// Медиазапросы 

(function($) {
	
	function mediaSize() { 
		
		// Для разрешений 760

		if (window.matchMedia('(min-width: 760px)').matches) {
			rellax.reinit();
		} else {
			rellax.destroy();
		}

	};

	mediaSize();
	
	window.addEventListener('resize', mediaSize, false);  
	
})(jQuery);














