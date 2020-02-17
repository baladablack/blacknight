/* Carrd Site JS | carrd.co | License: MIT */

(function() {

	var	on = addEventListener,
		$ = function(q) { return document.querySelector(q) },
		$$ = function(q) { return document.querySelectorAll(q) },
		$body = document.body,
		$inner = $('.inner'),
		client = (function() {
	
			var o = {
					browser: 'other',
					browserVersion: 0,
					os: 'other',
					osVersion: 0,
					canUse: null
				},
				ua = navigator.userAgent,
				a, i;
	
			// browser, browserVersion.
				a = [
					['firefox',		/Firefox\/([0-9\.]+)/],
					['edge',		/Edge\/([0-9\.]+)/],
					['safari',		/Version\/([0-9\.]+).+Safari/],
					['chrome',		/Chrome\/([0-9\.]+)/],
					['ie',			/Trident\/.+rv:([0-9]+)/]
				];
	
				for (i=0; i < a.length; i++) {
	
					if (ua.match(a[i][1])) {
	
						o.browser = a[i][0];
						o.browserVersion = parseFloat(RegExp.$1);
	
						break;
	
					}
	
				}
	
			// os, osVersion.
				a = [
					['ios',			/([0-9_]+) like Mac OS X/,			function(v) { return v.replace('_', '.').replace('_', ''); }],
					['ios',			/CPU like Mac OS X/,				function(v) { return 0 }],
					['ios',			/iPad; CPU/,						function(v) { return 0 }],
					['android',		/Android ([0-9\.]+)/,				null],
					['mac',			/Macintosh.+Mac OS X ([0-9_]+)/,	function(v) { return v.replace('_', '.').replace('_', ''); }],
					['windows',		/Windows NT ([0-9\.]+)/,			null],
					['undefined',	/Undefined/,						null],
				];
	
				for (i=0; i < a.length; i++) {
	
					if (ua.match(a[i][1])) {
	
						o.os = a[i][0];
						o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
	
						break;
	
					}
	
				}
	
				// Hack: Detect iPads running iPadOS.
					if (o.os == 'mac'
					&&	('ontouchstart' in window)
					&&	(
	
						// 12.9"
							(screen.width == 1024 && screen.height == 1366)
						// 10.2"
							||	(screen.width == 834 && screen.height == 1112)
						// 9.7"
							||	(screen.width == 810 && screen.height == 1080)
						// Legacy
							||	(screen.width == 768 && screen.height == 1024)
	
					))
						o.os = 'ios';
	
			// canUse.
				var _canUse = document.createElement('div');
	
				o.canUse = function(p) {
	
					var e = _canUse.style,
						up = p.charAt(0).toUpperCase() + p.slice(1);
	
					return	(
								p in e
							||	('Moz' + up) in e
							||	('Webkit' + up) in e
							||	('O' + up) in e
							||	('ms' + up) in e
					);
	
				};
	
			return o;
	
		}()),
		trigger = function(t) {
	
			if (client.browser == 'ie') {
	
				var e = document.createEvent('Event');
				e.initEvent(t, false, true);
				dispatchEvent(e);
	
			}
			else
				dispatchEvent(new Event(t));
	
		},
		cssRules = function(selectorText) {
	
			var ss = document.styleSheets,
				a = [],
				f = function(s) {
	
					var r = s.cssRules,
						i;
	
					for (i=0; i < r.length; i++) {
	
						if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
							(f)(r[i]);
						else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)
							a.push(r[i]);
	
					}
	
				},
				x, i;
	
			for (i=0; i < ss.length; i++)
				f(ss[i]);
	
			return a;
	
		},
		thisHash = function() {
	
			var h = location.hash ? location.hash.substring(1) : null,
				a;
	
			// Null? Bail.
				if (!h)
					return null;
	
			// Query string? Move before hash.
				if (h.match(/\?/)) {
	
					// Split from hash.
						a = h.split('?');
						h = a[0];
	
					// Update hash.
						history.replaceState(undefined, undefined, '#' + h);
	
					// Update search.
						window.location.search = a[1];
	
				}
	
			// Prefix with "x" if not a letter.
				if (h.length > 0
				&&	!h.match(/^[a-zA-Z]/))
					h = 'x' + h;
	
			return h;
	
		};
	
	// Animation.
		on('load', function() {
			setTimeout(function() {
				$body.className = $body.className.replace(/\bis-loading\b/, 'is-playing');
	
				setTimeout(function() {
					$body.className = $body.className.replace(/\bis-playing\b/, 'is-ready');
				}, 12625);
			}, 100);
		});
	
	// Sections.
		(function() {
	
			var initialSection, initialScrollPoint, initialId,
				header, footer, name, hideHeader, hideFooter,
				h, e, ee, k,
				locked = false,
				doNext = function() {
	
					var section;
	
					section = $('#main > .inner > section.active').nextElementSibling;
	
					if (!section || section.tagName != 'SECTION')
						return;
	
					location.href = '#' + section.id.replace(/-section$/, '');
	
				},
				doPrevious = function() {
	
					var section;
	
					section = $('#main > .inner > section.active').previousElementSibling;
	
					if (!section || section.tagName != 'SECTION')
						return;
	
					location.href = '#' + (section.matches(':first-child') ? '' : section.id.replace(/-section$/, ''));
	
				},
				doScroll = function(e, style, duration) {
	
					var y, cy, dy,
						start, easing, f;
	
					// Element.
	
						// No element? Assume top of page.
							if (!e)
								y = 0;
	
						// Otherwise ...
							else
								switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
	
									case 'default':
									default:
	
										y = e.offsetTop;
	
										break;
	
									case 'center':
	
										if (e.offsetHeight < window.innerHeight)
											y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2);
										else
											y = e.offsetTop;
	
										break;
	
									case 'previous':
	
										if (e.previousElementSibling)
											y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight;
										else
											y = e.offsetTop;
	
										break;
	
								}
	
					// Style.
						if (!style)
							style = 'smooth';
	
					// Duration.
						if (!duration)
							duration = 750;
	
					// Instant? Just scroll.
						if (style == 'instant') {
	
							window.scrollTo(0, y);
							return;
	
						}
	
					// Get start, current Y.
						start = Date.now();
						cy = window.scrollY;
						dy = y - cy;
	
					// Set easing.
						switch (style) {
	
							case 'linear':
								easing = function (t) { return t };
								break;
	
							case 'smooth':
								easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
								break;
	
						}
	
					// Scroll.
						f = function() {
	
							var t = Date.now() - start;
	
							// Hit duration? Scroll to y and finish.
								if (t >= duration)
									window.scroll(0, y);
	
							// Otherwise ...
								else {
	
									// Scroll.
										window.scroll(0, cy + (dy * easing(t / duration)));
	
									// Repeat.
										requestAnimationFrame(f);
	
								}
	
						};
	
						f();
	
				},
				loadElements = function(parent) {
	
					var a, i;
	
					// IFRAMEs.
	
						// Get list of unloaded IFRAMEs.
							a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
	
						// Step through list.
							for (i=0; i < a.length; i++) {
	
								// Load.
									a[i].src = a[i].dataset.src;
	
								// Mark as loaded.
									a[i].dataset.src = "";
	
							}
	
				},
				unloadElements = function(parent) {
	
					var a, i;
	
					// IFRAMEs.
	
						// Get list of loaded IFRAMEs.
							a = parent.querySelectorAll('iframe[data-src=""]');
	
						// Step through list.
							for (i=0; i < a.length; i++) {
	
								// Mark as unloaded.
									a[i].dataset.src = a[i].src;
	
								// Unload.
									a[i].src = '';
	
							}
	
					// Video.
	
						// Get list of videos.
							a = parent.querySelectorAll('video');
	
						// Step through list.
							for (i=0; i < a.length; i++) {
	
								// Pause.
									a[i].pause();
	
							}
	
				},
				doEvent = function(id, type) {
	
					var name = id.split(/-[a-z]+$/)[0], i;
	
					if (name in sections
					&&	'events' in sections[name]
					&&	type in sections[name].events)
						for (i in sections[name].events[type])
							(sections[name].events[type][i])();
	
				},
				sections = {
					'sobre': {
						events: {
							onopen: [
								function() { 
									gtag('config', 'UA-22743837-1', { 'page_path': '/#sobre' });
								},
							],
						},
					},
					'contact': {
						events: {
							onopen: [
								function() { 
									gtag('config', 'UA-22743837-1', { 'page_path': '/#contact' });
								},
							],
						},
					},
					'desconto': {
						events: {
							onopen: [
								function() { 
									gtag('config', 'UA-22743837-1', { 'page_path': '/#desconto' });
								},
							],
						},
					},
					'descontook': {
						events: {
							onopen: [
								function() { 
									gtag('config', 'UA-22743837-1', { 'page_path': '/#descontook' });
								},
							],
						},
					},
					'bonus': {
						events: {
							onopen: [
								function() { 
									gtag('config', 'UA-22743837-1', { 'page_path': '/#bonus' });
								},
							],
						},
					},
					'home': {
						events: {
							onopen: [
								function() { 
									gtag('config', 'UA-22743837-1', { 'page_path': '/' });
								},
							],
						},
					},
				};
	
			// Expose doNext, doPrevious.
				window._next = doNext;
				window._previous = doPrevious;
	
			// Initialize.
	
				// Set scroll restoration to manual.
					if ('scrollRestoration' in history)
						history.scrollRestoration = 'manual';
	
				// Header, footer.
					header = $('#header');
					footer = $('#footer');
	
				// Show initial section.
	
					// Determine target.
						h = thisHash();
	
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								h = null;
	
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
	
								initialScrollPoint = e;
								initialSection = initialScrollPoint.parentElement;
								initialId = initialSection.id;
	
							}
	
						// Section.
							else if (e = $('#' + (h ? h : 'home') + '-section')) {
	
								initialScrollPoint = null;
								initialSection = e;
								initialId = initialSection.id;
	
							}
	
						// Missing initial section?
							if (!initialSection) {
	
								// Default to index.
									initialScrollPoint = null;
									initialSection = $('#' + 'home' + '-section');
									initialId = initialSection.id;
	
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
	
							}
	
					// Deactivate all sections (except initial).
	
						// Initially hide header and/or footer (if necessary).
							name = (h ? h : 'home');
							hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
							hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
	
							// Header.
								if (header && hideHeader) {
	
									header.classList.add('hidden');
									header.style.display = 'none';
	
								}
	
							// Footer.
								if (footer && hideFooter) {
	
									footer.classList.add('hidden');
									footer.style.display = 'none';
	
								}
	
						// Deactivate.
							ee = $$('#main > .inner > section:not([id="' + initialId + '"])');
	
							for (k = 0; k < ee.length; k++) {
	
								ee[k].className = 'inactive';
								ee[k].style.display = 'none';
	
							}
	
					// Activate initial section.
						initialSection.classList.add('active');
	
						// Event: On Open.
							doEvent(initialId, 'onopen');
	
					// Load elements.
						loadElements(initialSection);
	
				 	// Scroll to top.
						doScroll(null, 'instant');
	
				// Load event.
					on('load', function() {
	
						// Scroll to initial scroll point (if applicable).
					 		if (initialScrollPoint)
								doScroll(initialScrollPoint, 'instant');
	
					});
	
			// Hashchange event.
				on('hashchange', function(event) {
	
					var section, scrollPoint, id, sectionHeight, currentSection, currentSectionHeight,
						name, hideHeader, hideFooter,
						h, e, ee, k;
	
					// Lock.
						if (locked)
							return false;
	
					// Determine target.
						h = thisHash();
	
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								return false;
	
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
	
								scrollPoint = e;
								section = scrollPoint.parentElement;
								id = section.id;
	
							}
	
						// Section.
							else if (e = $('#' + (h ? h : 'home') + '-section')) {
	
								scrollPoint = null;
								section = e;
								id = section.id;
	
							}
	
						// Anything else.
							else {
	
								// Default to index.
									scrollPoint = null;
									section = $('#' + 'home' + '-section');
									id = section.id;
	
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
	
							}
	
					// No section? Bail.
						if (!section)
							return false;
	
					// Section already active?
						if (!section.classList.contains('inactive')) {
	
						 	// Scroll to scroll point (if applicable).
						 		if (scrollPoint)
									doScroll(scrollPoint);
	
							// Otherwise, just scroll to top.
								else
									doScroll(null);
	
							// Bail.
								return false;
	
						}
	
					// Otherwise, activate it.
						else {
	
							// Lock.
								locked = true;
	
							// Clear index URL hash.
								if (location.hash == '#home')
									history.replaceState(null, null, '#');
	
							// Deactivate current section.
	
								// Hide header and/or footer (if necessary).
									name = (section ? section.id.replace(/-section$/, '') : null);
									hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
									hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
	
									// Header.
										if (header && hideHeader) {
	
											header.classList.add('hidden');
											header.style.display = 'none';
	
										}
	
									// Footer.
										if (footer && hideFooter) {
	
											footer.classList.add('hidden');
											footer.style.display = 'none';
	
										}
	
								// Deactivate.
									currentSection = $('#main > .inner > section:not(.inactive)');
									currentSection.classList.add('inactive');
									currentSection.classList.remove('active');
									currentSection.style.display = 'none';
	
								// Unload elements.
									unloadElements(currentSection);
	
								// Event: On Close.
									doEvent(currentSection.id, 'onclose');
	
							// Activate target section.
	
								// Show header and/or footer (if necessary).
	
									// Header.
										if (header && !hideHeader) {
	
											header.style.display = '';
											header.classList.remove('hidden');
	
										}
	
									// Footer.
										if (footer && !hideFooter) {
	
											footer.style.display = '';
											footer.classList.remove('hidden');
	
										}
	
								// Activate.
									section.classList.remove('inactive');
									section.classList.add('active');
									section.style.display = '';
	
								// Event: On Open.
									doEvent(section.id, 'onopen');
	
							// Trigger 'resize' event.
								trigger('resize');
	
							// Load elements.
								loadElements(section);
	
							// Scroll to scroll point (if applicable).
								if (scrollPoint)
									doScroll(scrollPoint, 'instant');
	
							// Otherwise, just scroll to top.
								else
									doScroll(null, 'instant');
	
							// Unlock.
								locked = false;
	
						}
	
					return false;
	
				});
	
				// Hack: Allow hashchange to trigger on click even if the target's href matches the current hash.
					on('click', function(event) {
	
						var t = event.target;
	
						// Target is an image and its parent is a link? Switch target to parent.
							if (t.tagName == 'IMG'
							&&	t.parentElement
							&&	t.parentElement.tagName == 'A')
								t = t.parentElement;
	
						// Target is an anchor *and* its href is a hash that matches the current hash?
							if (t.tagName == 'A'
							&&	t.getAttribute('href').substr(0, 1) == '#'
							&&	t.hash == window.location.hash) {
	
								// Prevent default.
									event.preventDefault();
	
								// Replace state with '#'.
									history.replaceState(undefined, undefined, '#');
	
								// Replace location with target hash.
									location.replace(t.hash);
	
							}
	
					});
	
		})();
	
	// Browser hacks.
	
		// Init.
			var style, sheet, rule;
	
			// Create <style> element.
				style = document.createElement('style');
				style.appendChild(document.createTextNode(''));
				document.head.appendChild(style);
	
			// Get sheet.
				sheet = style.sheet;
	
		// Android.
			if (client.os == 'android') {
	
				// Prevent background "jump" when address bar shrinks.
				// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
				// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
					(function() {
	
						// Insert and get rule.
							sheet.insertRule('body::after { }', 0);
							rule = sheet.cssRules[0];
	
						// Event.
							var f = function() {
								rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
							};
	
							on('load', f);
							on('orientationchange', f);
							on('touchmove', f);
	
					})();
	
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
	
			}
	
		// iOS.
			else if (client.os == 'ios') {
	
				// <=11: Prevent white bar below background when address bar shrinks.
				// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
					if (client.osVersion <= 11)
						(function() {
	
							// Insert and get rule.
								sheet.insertRule('body::after { }', 0);
								rule = sheet.cssRules[0];
	
							// Set rule.
								rule.style.cssText = '-webkit-transform: scale(1.0)';
	
						})();
	
				// <=11: Prevent white bar below background when form inputs are focused.
				// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
				// because our backgrounds fall into this category.
					if (client.osVersion <= 11)
						(function() {
	
							// Insert and get rule.
								sheet.insertRule('body.ios-focus-fix::before { }', 0);
								rule = sheet.cssRules[0];
	
							// Set rule.
								rule.style.cssText = 'height: calc(100% + 60px)';
	
							// Add event listeners.
								on('focus', function(event) {
									$body.classList.add('ios-focus-fix');
								}, true);
	
								on('blur', function(event) {
									$body.classList.remove('ios-focus-fix');
								}, true);
	
						})();
	
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
	
			}
	
		// IE.
			else if (client.browser == 'ie') {
	
				// Element.matches polyfill.
					if (!('matches' in Element.prototype))
						Element.prototype.matches = (Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
	
				// Background fix.
				// IE doesn't consistently render background images applied to body:before so as a workaround
				// we can simply apply it directly to the body tag.
					(function() {
	
						var a = cssRules('body::before'),
							r;
	
						// Has a background?
							if (a.length > 0) {
	
								r = a[0];
	
								if (r.style.width.match('calc')) {
	
									// Force repaint.
										r.style.opacity = 0.9999;
	
										setTimeout(function() {
											r.style.opacity = 1;
										}, 100);
	
								}
								else {
	
									// Override body:before rule.
										document.styleSheets[0].addRule('body::before', 'content: none !important;');
	
									// Copy over background styles.
										$body.style.backgroundImage = r.style.backgroundImage.replace('url("images/', 'url("assets/images/');
										$body.style.backgroundPosition = r.style.backgroundPosition;
										$body.style.backgroundRepeat = r.style.backgroundRepeat;
										$body.style.backgroundColor = r.style.backgroundColor;
										$body.style.backgroundAttachment = 'fixed';
										$body.style.backgroundSize = r.style.backgroundSize;
	
								}
	
							}
	
					})();
	
				// Flexbox workaround.
				// IE's flexbox implementation doesn't work when 'min-height' is used, so we can work around this
				// by switching to 'height' but simulating the behavior of 'min-height' via JS.
					(function() {
						var t, f;
	
						// Handler function.
							f = function() {
	
								var mh, h, s, xx, x, i;
	
								// Wrapper.
									x = $('#wrapper');
	
									x.style.height = 'auto';
	
									if (x.scrollHeight <= innerHeight)
										x.style.height = '100vh';
	
								// Containers with full modifier.
									xx = $$('.container.full');
	
									for (i=0; i < xx.length; i++) {
	
										x = xx[i];
										s = getComputedStyle(x);
	
										// Get min-height.
											x.style.minHeight = '';
											x.style.height = '';
	
											mh = s.minHeight;
	
										// Get height.
											x.style.minHeight = 0;
											x.style.height = '';
	
											h = s.height;
	
										// Zero min-height? Do nothing.
											if (mh == 0)
												continue;
	
										// Set height.
											x.style.height = (h > mh ? 'auto' : mh);
	
									}
	
							};
	
						// Do an initial call of the handler.
							(f)();
	
						// Add event listeners.
							on('resize', function() {
	
								clearTimeout(t);
	
								t = setTimeout(f, 250);
	
							});
	
							on('load', f);
	
					})();
	
			}
	
		// Edge.
			else if (client.browser == 'edge') {
	
				// Columned container fix.
				// Edge seems to miscalculate column widths in some instances resulting in a nasty wrapping bug.
				// Workaround = left-offset the last column in each columned container by -1px.
					(function() {
	
						var xx = $$('.container > .inner > div:last-child'),
							x, y, i;
	
						// Step through last columns.
							for(i=0; i < xx.length; i++) {
	
								x = xx[i];
								y = getComputedStyle(x.parentNode);
	
								// Parent container not columned? Skip.
									if (y.display != 'flex'
									&&	y.display != 'inline-flex')
										continue;
	
								// Offset by -1px.
									x.style.marginLeft = '-1px';
	
							}
	
					})();
	
			}
	
		// Object-fit polyfill.
			if (!client.canUse('object-fit')) {
	
				// Image.
					(function() {
	
						var xx = $$('.image[data-position]'),
							x, w, c, i, src;
	
						for (i=0; i < xx.length; i++) {
	
							// Element, img.
								x = xx[i];
								c = x.firstElementChild;
	
								// Not an IMG? Strip off wrapper.
									if (c.tagName != 'IMG') {
	
										w = c;
										c = c.firstElementChild;
	
									}
	
							// Get src.
								if (c.parentNode.classList.contains('deferred')) {
	
									c.parentNode.classList.remove('deferred');
									src = c.getAttribute('data-src');
									c.removeAttribute('data-src');
	
								}
								else
									src = c.getAttribute('src');
	
							// Set src as element background.
								c.style['backgroundImage'] = 'url(\'' + src + '\')';
								c.style['backgroundSize'] = 'cover';
								c.style['backgroundPosition'] = x.dataset.position;
								c.style['backgroundRepeat'] = 'no-repeat';
	
							// Clear src.
								c.src = 'data:image/svg+xml;charset=utf8,' + escape('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"></svg>');
	
							// Hack: Fix "full column" elements (columned containers only).
								if (x.classList.contains('full')
								&&	(x.parentNode && x.parentNode.classList.contains('full'))
								&&	(x.parentNode.parentNode && x.parentNode.parentNode.parentNode && x.parentNode.parentNode.parentNode.classList.contains('container'))
								&&	x.parentNode.children.length == 1) {
	
									(function(x, w) {
	
										var	p = x.parentNode.parentNode,
											f = function() {
	
												// Set height to zero.
													x.style['height'] = '0px';
	
												// Clear timeout.
													clearTimeout(t);
	
												// Update after a short delay.
													t = setTimeout(function() {
	
														// Container inner is in "row" mode? Set fixed height.
															if (getComputedStyle(p).flexDirection == 'row') {
	
																// Wrapper (if it exists).
																	if (w)
																		w.style['height'] = '100%';
	
																// Element.
																	x.style['height'] = (p.scrollHeight + 1) + 'px';
	
															}
	
														// Otherwise, revert to auto height ...
															else {
	
																// Wrapper (if it exists).
																	if (w)
																		w.style['height'] = 'auto';
	
																// Element.
																	x.style['height'] = 'auto';
	
															}
	
													}, 125);
	
											},
											t;
	
										// Call handler on resize, load.
											on('resize', f);
											on('load', f);
	
										// Initial call.
											(f)();
	
									})(x, w);
	
								}
	
						}
	
					})();
	
				// Gallery.
					(function() {
	
						var xx = $$('.gallery img'),
							x, p, i, src;
	
						for (i=0;i < xx.length; i++) {
	
							// Img, parent.
								x = xx[i];
								p = x.parentNode;
	
							// Get src.
								if (p.classList.contains('deferred')) {
	
									p.classList.remove('deferred');
									src = x.getAttribute('data-src');
	
								}
								else
									src = x.getAttribute('src');
	
							// Set src as parent background.
								p.style['backgroundImage'] = 'url(\'' + src + '\')';
								p.style['backgroundSize'] = 'cover';
								p.style['backgroundPosition'] = 'center';
								p.style['backgroundRepeat'] = 'no-repeat';
	
							// Hide img.
								x.style['opacity'] = '0';
	
						}
	
					})();
	
			}
	
	// Timer.
		/**
		 * Timer.
		 * @param {string} id ID.
		 */
		function timer(id, timestamp, options) {
		
			var _this = this,
				f;
		
			/**
			 * ID.
			 * @var {string}
			 */
			this.id = id;
		
			/**
			 * Timestamp.
			 * @var {integer}
			 */
			this.timestamp = timestamp;
		
			/**
			 * Mode.
			 * @var {string}
			 */
			this.mode = options.mode;
		
			/**
			 * Precision.
			 * @var {integer}
			 */
			this.precision = options.precision;
		
			/**
			 * Complete URL.
			 * @var {string}
			 */
			this.completeUrl = options.completeUrl;
		
			/**
			 * Label style.
			 * @var {integer}
			 */
			this.labelStyle = options.labelStyle;
		
			/**
			 * Completed.
			 * @var {bool}
			 */
			this.completed = false;
		
			/**
			 * Status.
			 * @var {string}
			 */
			this.status = null;
		
			/**
			 * Timer.
			 * @var {HTMLElement}
			 */
			this.$timer = document.getElementById(this.id);
		
			/**
			 * Parent.
			 * @var {HTMLElement}
			 */
			this.$parent = document.querySelector('#' + _this.$timer.id + ' ul');
		
			/**
			 * Days.
			 * @var {HTMLElement}
			 */
			this.days = {
				$li: null,
				$digit: null,
				$components: null
			};
		
			/**
			 * Hours.
			 * @var {HTMLElement}
			 */
			this.hours = {
				$li: null,
				$digit: null,
				$components: null
			};
		
			/**
			 * Minutes.
			 * @var {HTMLElement}
			 */
			this.minutes = {
				$li: null,
				$digit: null,
				$components: null
			};
		
			/**
			 * Seconds.
			 * @var {HTMLElement}
			 */
			this.seconds = {
				$li: null,
				$digit: null,
				$components: null
			};
		
			// Initialize.
				this.init();
		
		};
		
			/**
			 * Initialize.
			 */
			timer.prototype.init = function() {
		
				var _this = this;
		
				// Digits.
		
					// Interval.
						window.setInterval(function() {
		
							// Update digits.
								_this.updateDigits();
		
							// Update size.
								_this.updateSize();
		
						}, 250);
		
					// Initial call.
						this.updateDigits();
		
				// Size.
		
					// Event.
						on('resize', function() {
							_this.updateSize();
						});
		
					// Initial call.
						this.updateSize();
		
			};
		
			/**
			 * Updates size.
			 */
			timer.prototype.updateSize = function() {
		
				var $items, $item, $digit, $components, $component, $label, $sublabel, $symbols,
					w, iw, h, f, i, j, found;
		
				$items = document.querySelectorAll('#' + this.$timer.id + ' ul li .item');
				$symbols = document.querySelectorAll('#' + this.$timer.id + ' .symbol');
				$components = document.querySelectorAll('#' + this.$timer.id + ' .component');
				h = 0;
				f = 0;
		
				// Reset component heights.
					for (j = 0; j < $components.length; j++) {
		
						$components[j].style.lineHeight = '';
						$components[j].style.height = '';
		
					}
		
				// Reset symbol heights, font sizes.
					for (j = 0; j < $symbols.length; j++) {
		
						$symbols[j].style.fontSize = '';
						$symbols[j].style.lineHeight = '';
						$symbols[j].style.height = '';
		
					}
		
				// Step through items.
					for (i = 0; i < $items.length; i++) {
		
						$item = $items[i];
						$component = $item.children[0].children[0];
		
						w = $component.offsetWidth;
						iw = $item.offsetWidth;
		
						// Set digit font size.
							$digit = $item.children[0];
		
							// Reset font size.
								$digit.style.fontSize = '';
		
							// Set font size.
								$digit.style.fontSize = (w * 1.65) + 'px';
		
							// Update component height.
								h = Math.max(h, $digit.offsetHeight);
		
							// Update font size.
								f = Math.max(f, (w * 1.65));
		
						// Set label visibility (if it exists).
							if ($item.children.length > 1) {
		
								$label = $item.children[1];
								found = false;
		
								// Step through sub-labels.
									for (j = 0; j < $label.children.length; j++) {
		
										$sublabel = $label.children[j];
		
										// Reset sub-label visibility.
											$sublabel.style.display = '';
		
										// Able to fit *and* haven't found a match already? Show sub-label.
											if (!found && $sublabel.offsetWidth < iw) {
		
												found = true;
												$sublabel.style.display = '';
		
											}
		
										// Otherwise, hide it.
											else
												$sublabel.style.display = 'none';
		
									}
		
							}
		
					}
		
				// Hack: Single component *and* uses a solid/outline background? Force height to that of background to
				// ensure longer digits (>=3) render correctly.
					if ($items.length == 1) {
		
						var x = $items[0].children[0],
							xs = getComputedStyle(x),
							xsa = getComputedStyle(x, ':after');
		
						if (xsa.content != 'none')
							h = parseInt(xsa.height) - parseInt(xs.marginTop) - parseInt(xs.marginBottom) + 24;
		
					}
		
				// Set component heights.
					for (j = 0; j < $components.length; j++) {
		
						$components[j].style.lineHeight = h + 'px';
						$components[j].style.height = h + 'px';
		
					}
		
				// Set symbol heights, font sizes.
					for (j = 0; j < $symbols.length; j++) {
		
						$symbols[j].style.fontSize = (f * 0.5) + 'px';
						$symbols[j].style.lineHeight = h + 'px';
						$symbols[j].style.height = h + 'px';
		
					}
		
				// Set parent height.
					this.$parent.style.height = '';
					this.$parent.style.height = this.$parent.offsetHeight + 'px';
		
			};
		
			/**
			 * Updates digits.
			 */
			timer.prototype.updateDigits = function() {
		
				var _this = this,
					x = [
						{
							class: 'days',
							digit: 0,
							label: {
								full: 'Dias',
								abbreviated: 'Dias',
								initialed: 'D'
							}
						},
						{
							class: 'hours',
							digit: 0,
							label: {
								full: 'Horas',
								abbreviated: 'H',
								initialed: 'H'
							}
						},
						{
							class: 'minutes',
							digit: 0,
							label: {
								full: 'Minutos',
								abbreviated: 'Min',
								initialed: 'M'
							}
						},
						{
							class: 'seconds',
							digit: 0,
							label: {
								full: 'Segundos',
								abbreviated: 'S',
								initialed: 'S'
							}
						},
					],
					now, diff,
					zeros, status, i, j, x, z, t, s;
		
				// Mode.
					now = parseInt(Date.now() / 1000);
		
					switch (this.mode) {
		
						case 'countdown':
							if (this.timestamp > now)
								diff = this.timestamp - now;
							else
								diff = 0;
		
							// Hit zero *and* a complete URL was provided? Redirect to it.
								if (diff == 0
								&&	this.completeUrl
								&&	!this.completed) {
		
									// Mark as completed.
										this.completed = true;
		
									// Redirect.
										window.setTimeout(function() {
											window.location.href = _this.completeUrl;
										}, 1000);
		
								}
		
							break;
		
						default:
						case 'default':
							if (this.timestamp > now)
								diff = this.timestamp - now;
							else
								diff = now - this.timestamp;
		
							break;
		
					}
		
				// Update counts.
		
					// Days.
						x[0].digit = Math.floor(diff / 86400);
						diff -= x[0].digit * 86400;
		
					// Hours.
						x[1].digit = Math.floor(diff / 3600);
						diff -= x[1].digit * 3600;
		
					// Minutes.
						x[2].digit = Math.floor(diff / 60);
						diff -= x[2].digit * 60;
		
					// Seconds.
						x[3].digit = diff;
		
				// Count zeros.
					zeros = 0;
		
					for (i = 0; i < x.length; i++)
						if (x[i].digit == 0)
							zeros++;
						else
							break;
		
				// Delete zeros if they exceed precision.
					while (zeros > 0 && x.length > this.precision) {
		
						x.shift();
						zeros--;
		
					}
		
				// Determine status.
					z = [];
		
					for (i = 0; i < x.length; i++)
						z.push(x[i].class);
		
					status = z.join('-');
		
				// Output.
		
					// Same status as before? Do a quick update.
						if (status == this.status) {
		
							var $digit, $components;
		
							for (i = 0; i < x.length; i++) {
		
								$digit = document.querySelector('#' + this.id + ' .' + x[i].class + ' .digit');
								$components = document.querySelectorAll('#' + this.id + ' .' + x[i].class + ' .digit .component');
		
								// No digit? Skip.
									if (!$digit)
										continue;
		
								// Get components.
									z = [];
									t = String(x[i].digit);
		
									if (x[i].digit < 10) {
		
										z.push('0');
										z.push(t);
		
									}
									else
										for (j = 0; j < t.length; j++)
											z.push(t.substr(j, 1));
		
								// Update count class.
									$digit.classList.remove('count1', 'count2', 'count3', 'count4');
									$digit.classList.add('count' + z.length);
		
								// Same number of components? Just update values.
									if ($components.length == z.length) {
		
										for (j = 0; j < $components.length && j < z.length; j++)
											$components[j].innerHTML = z[j];
		
									}
		
								// Otherwise, create new components.
									else {
		
										s = '';
		
										for (j = 0; j < $components.length && j < z.length; j++)
											s += '<span class="component x' + Math.random() + '">' + z[j] + '</span>';
		
										$digit.innerHTML = s;
		
									}
		
							}
		
						}
		
					// Otherwise, do a full one.
						else {
		
							s = '';
		
							for (i = 0; i < x.length && i < this.precision; i++) {
		
								// Get components.
									z = [];
									t = String(x[i].digit);
		
									if (x[i].digit < 10) {
		
										z.push('0');
										z.push(t);
		
									}
									else
										for (j = 0; j < t.length; j++)
											z.push(t.substr(j, 1));
		
								// Delimiter.
									if (i > 0)
										s +=	'<li class="delimiter">' +
													'<span class="symbol">:</span>' +
												'</li>';
		
								// Number.
									s +=		'<li class="number ' + x[i].class + '">' +
													'<div class="item">';
		
									// Digit.
										s +=			'<span class="digit count' + t.length + '">';
		
										for (j = 0; j < z.length; j++)
											s +=			'<span class="component">' + z[j] + '</span>';
		
										s +=			'</span>';
		
									// Label.
										switch (this.labelStyle) {
		
											default:
											case 'full':
												s +=					'<span class="label">' +
																			'<span class="full">' + x[i].label.full + '</span>' +
																			'<span class="abbreviated">' + x[i].label.abbreviated + '</span>' +
																			'<span class="initialed">' + x[i].label.initialed + '</span>' +
																		'</span>';
		
												break;
		
											case 'abbreviated':
												s +=					'<span class="label">' +
																			'<span class="abbreviated">' + x[i].label.abbreviated + '</span>' +
																			'<span class="initialed">' + x[i].label.initialed + '</span>' +
																		'</span>';
		
												break;
		
											case 'initialed':
												s +=					'<span class="label">' +
																			'<span class="initialed">' + x[i].label.initialed + '</span>' +
																		'</span>';
		
												break;
		
											case 'none':
												break;
		
										}
		
									s +=			'</div>' +
												'</li>';
		
							}
		
							// Replace HTML.
								_this.$parent.innerHTML = s;
		
							// Update status.
								this.status = status;
		
						}
		
			};
	
	// Timer: timer01.
		new timer(
			'timer01',
			1583546400,
			{
				mode: 'countdown',
				precision: 4,
				completeUrl: '',
				labelStyle: 'initialed'
			}
		);
	
	// Timer: timer02.
		new timer(
			'timer02',
			1581631200,
			{
				mode: 'countdown',
				precision: 4,
				completeUrl: '',
				labelStyle: 'initialed'
			}
		);

})();