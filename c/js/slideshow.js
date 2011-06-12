/**
 * slideshow.js
 * Author:              Tyler Gaw www.tylergaw.com - me@tylergaw.com
 *
 * Description:         Slideshow control with hash checking and arrow key functionality
 *
 */

var slideshow = {
	
	currentSlide: 0,
	totalSlides: 0,
	
	// Init hash checking, load first slide, enabled keyboard
	init: function ()
	{	
		// Check for a #section sent through the URL
		var slide = window.location.hash.split('#')[1];
		
		// Store the total number of slides
		this.totalSlides = $('.slide').length;

		// If there is a hash, check that it is a number that is not
		// greater than the total number of slides
		if (slide !== undefined)
		{
			if (slide > (this.totalSlides - 1) || isNaN(slide))
			{
				this.currentSlide = 0;
			}
			else
			{
				this.currentSlide = parseFloat(slide, 10);
			}
		}
		
		// Initialize our hash checking
		slideshow.utils.hashCheck.init(
			function (hash)
			{
				var slide = hash.split('#')[1];
				slideshow.goto(slide);
			}
		);
		
		this.navigation.init();
		window.location.hash = this.currentSlide;
		this.goto(this.currentSlide);
		this.utils.externalLinks();
	},
	
	// Go to a slide
	// @param INT slideNumber
	goto: function (slideNumber)
	{
		var activeSlide = $('.slide:eq(' + slideNumber + ')'),
			sectionName = '';
		
		$('.slide').removeClass('active');
		activeSlide.addClass('active');
		
		// This is a bit of a hack since the section class name
		// has to be second in the stack.
		// Grabbing it so I can apply the right bg image to the body
		sectionName = activeSlide.attr('class').split(' ')[1];
		
		$('body').css({
			'background-color': activeSlide.css('background-color'),
			'background-image': 'url(c/images/' + sectionName + '_bg.jpg)',
			'background-repeat': 'repeat'
		});
	},
	
	navigation: {
		
		init: function ()
		{
			this.keyboard();
			this.mouse();
		},
		
		keyboard: function ()
		{
			var $this = this;

			$(document).keydown(function (e)
			{
				switch(e.which)
				{

				// left arrow
				case 37:
					$this.prev();
					break;

				// up arrow
				case 38:
					$this.first();
					break;

				// right arrow
				case 39:
					$this.next();
					break;

				// down arrow
				case 40:
					$this.last();
				}
			});
		},
		
		mouse: function ()
		{
			var $this = this;
			$('#prev').click($this.prev);
			$('#next').click($this.next);
		},
		
		next: function ()
		{
			var $this = slideshow;
			if ($this.currentSlide === $this.totalSlides - 1)
			{
				$this.currentSlide = 0;
			}
			else
			{
				$this.currentSlide = $this.currentSlide + 1;
			}
			
			window.location.hash = $this.currentSlide;
		},
		
		prev: function ()
		{
			var $this = slideshow;
			if ($this.currentSlide === 0)
			{
				$this.currentSlide = $this.totalSlides - 1;
			}
			else
			{
				$this.currentSlide = $this.currentSlide - 1;
			}
			
			window.location.hash = $this.currentSlide;
		},
		
		first: function ()
		{
			var $this = slideshow;
			$this.currentSlide = 0;
			window.location.hash = $this.currentSlide;
		},
		
		last: function ()
		{
			var $this = slideshow;
			$this.currentSlide = $this.totalSlides - 1;
			window.location.hash = $this.currentSlide;
		}
		
	}
	
};

slideshow.utils = {
	
	// Checking for a hash in the URL to fix the 
	// back/forward buttons on Ajax calls
	hashCheck: {
		
		// Storage for the hash
		hash: null,
		
		// Function to call when the hash is updated
		changeHandler: null,
		
		// Function that runs at an interval to check
		// for an updated hash. If changed it calls the
		// provided onChange event and passes it the hash
		check: function ()
		{
			if (window.location.hash !== this.hash)
			{
				this.hash = window.location.hash;
				this.changeHandler(this.hash);
			}
		},
		
		// Initiate the check by starting up the setInterval
		// @param FUNC change - A function to run if the hash is updated
		//                      stored as this.changeHandler
		init: function (change)
		{
			var $this = this;
			
			this.changeHandler = change;
			this.hash = window.location.hash;				
			setInterval(function ()
			{
				$this.check();
			}, 100);
		}
	},
	
	externalLinks: function ()
	{
		$('a[rel="external"]').click(
			function ()
			{
				window.open($(this).attr('href'));
				return false;
			}
		);
	}
}

$(document).ready(function ()
{
	slideshow.init();
});