/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 45);
/******/ })
/************************************************************************/
/******/ ({

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(46);


/***/ }),

/***/ 46:
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * sly 1.6.1 - 8th Aug 2015
 * https://github.com/darsain/sly
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 */

;(function ($, w, undefined) {
	'use strict';

	var pluginName = 'sly';
	var className = 'Sly';
	var namespace = pluginName;

	// Local WindowAnimationTiming interface
	var cAF = w.cancelAnimationFrame || w.cancelRequestAnimationFrame;
	var rAF = w.requestAnimationFrame;

	// Support indicators
	var transform, gpuAcceleration;

	// Other global values
	var $doc = $(document);
	var dragInitEvents = 'touchstart.' + namespace + ' mousedown.' + namespace;
	var dragMouseEvents = 'mousemove.' + namespace + ' mouseup.' + namespace;
	var dragTouchEvents = 'touchmove.' + namespace + ' touchend.' + namespace;
	var wheelEvent = (document.implementation.hasFeature('Event.wheel', '3.0') ? 'wheel.' : 'mousewheel.') + namespace;
	var clickEvent = 'click.' + namespace;
	var mouseDownEvent = 'mousedown.' + namespace;
	var interactiveElements = ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'];
	var tmpArray = [];
	var time;

	// Math shorthands
	var abs = Math.abs;
	var sqrt = Math.sqrt;
	var pow = Math.pow;
	var round = Math.round;
	var max = Math.max;
	var min = Math.min;

	// Keep track of last fired global wheel event
	var lastGlobalWheel = 0;
	$doc.on(wheelEvent, function (event) {
		var sly = event.originalEvent[namespace];
		var time = +new Date();
		// Update last global wheel time, but only when event didn't originate
		// in Sly frame, or the origin was less than scrollHijack time ago
		if (!sly || sly.options.scrollHijack < time - lastGlobalWheel) lastGlobalWheel = time;
	});

	/**
  * Sly.
  *
  * @class
  *
  * @param {Element} frame       DOM element of sly container.
  * @param {Object}  options     Object with options.
  * @param {Object}  callbackMap Callbacks map.
  */
	function Sly(frame, options, callbackMap) {
		if (!(this instanceof Sly)) return new Sly(frame, options, callbackMap);

		// Extend options
		var o = $.extend({}, Sly.defaults, options);

		// Private variables
		var self = this;
		var parallax = isNumber(frame);

		// Frame
		var $frame = $(frame);
		var $slidee = o.slidee ? $(o.slidee).eq(0) : $frame.children().eq(0);
		var frameSize = 0;
		var slideeSize = 0;
		var pos = {
			start: 0,
			center: 0,
			end: 0,
			cur: 0,
			dest: 0
		};

		// Scrollbar
		var $sb = $(o.scrollBar).eq(0);
		var $handle = $sb.children().eq(0);
		var sbSize = 0;
		var handleSize = 0;
		var hPos = {
			start: 0,
			end: 0,
			cur: 0
		};

		// Pagesbar
		var $pb = $(o.pagesBar);
		var $pages = 0;
		var pages = [];

		// Items
		var $items = 0;
		var items = [];
		var rel = {
			firstItem: 0,
			lastItem: 0,
			centerItem: 0,
			activeItem: null,
			activePage: 0
		};

		// Styles
		var frameStyles = new StyleRestorer($frame[0]);
		var slideeStyles = new StyleRestorer($slidee[0]);
		var sbStyles = new StyleRestorer($sb[0]);
		var handleStyles = new StyleRestorer($handle[0]);

		// Navigation type booleans
		var basicNav = o.itemNav === 'basic';
		var forceCenteredNav = o.itemNav === 'forceCentered';
		var centeredNav = o.itemNav === 'centered' || forceCenteredNav;
		var itemNav = !parallax && (basicNav || centeredNav || forceCenteredNav);

		// Miscellaneous
		var $scrollSource = o.scrollSource ? $(o.scrollSource) : $frame;
		var $dragSource = o.dragSource ? $(o.dragSource) : $frame;
		var $forwardButton = $(o.forward);
		var $backwardButton = $(o.backward);
		var $prevButton = $(o.prev);
		var $nextButton = $(o.next);
		var $prevPageButton = $(o.prevPage);
		var $nextPageButton = $(o.nextPage);
		var callbacks = {};
		var last = {};
		var animation = {};
		var move = {};
		var dragging = {
			released: 1
		};
		var scrolling = {
			last: 0,
			delta: 0,
			resetTime: 200
		};
		var renderID = 0;
		var historyID = 0;
		var cycleID = 0;
		var continuousID = 0;
		var i, l;

		// Normalizing frame
		if (!parallax) {
			frame = $frame[0];
		}

		// Expose properties
		self.initialized = 0;
		self.frame = frame;
		self.slidee = $slidee[0];
		self.pos = pos;
		self.rel = rel;
		self.items = items;
		self.pages = pages;
		self.isPaused = 0;
		self.options = o;
		self.dragging = dragging;

		/**
   * Loading function.
   *
   * Populate arrays, set sizes, bind events, ...
   *
   * @param {Boolean} [isInit] Whether load is called from within self.init().
   * @return {Void}
   */
		function load(isInit) {
			// Local variables
			var lastItemsCount = 0;
			var lastPagesCount = pages.length;

			// Save old position
			pos.old = $.extend({}, pos);

			// Reset global variables
			frameSize = parallax ? 0 : $frame[o.horizontal ? 'width' : 'height']();
			sbSize = $sb[o.horizontal ? 'width' : 'height']();
			slideeSize = parallax ? frame : $slidee[o.horizontal ? 'outerWidth' : 'outerHeight']();
			pages.length = 0;

			// Set position limits & relatives
			pos.start = 0;
			pos.end = max(slideeSize - frameSize, 0);

			// Sizes & offsets for item based navigations
			if (itemNav) {
				// Save the number of current items
				lastItemsCount = items.length;

				// Reset itemNav related variables
				$items = $slidee.children(o.itemSelector);
				items.length = 0;

				// Needed variables
				var paddingStart = getPx($slidee, o.horizontal ? 'paddingLeft' : 'paddingTop');
				var paddingEnd = getPx($slidee, o.horizontal ? 'paddingRight' : 'paddingBottom');
				var borderBox = $($items).css('boxSizing') === 'border-box';
				var areFloated = $items.css('float') !== 'none';
				var ignoredMargin = 0;
				var lastItemIndex = $items.length - 1;
				var lastItem;

				// Reset slideeSize
				slideeSize = 0;

				// Iterate through items
				$items.each(function (i, element) {
					// Item
					var $item = $(element);
					var rect = element.getBoundingClientRect();
					var itemSize = round(o.horizontal ? rect.width || rect.right - rect.left : rect.height || rect.bottom - rect.top);
					var itemMarginStart = getPx($item, o.horizontal ? 'marginLeft' : 'marginTop');
					var itemMarginEnd = getPx($item, o.horizontal ? 'marginRight' : 'marginBottom');
					var itemSizeFull = itemSize + itemMarginStart + itemMarginEnd;
					var singleSpaced = !itemMarginStart || !itemMarginEnd;
					var item = {};
					item.el = element;
					item.size = singleSpaced ? itemSize : itemSizeFull;
					item.half = item.size / 2;
					item.start = slideeSize + (singleSpaced ? itemMarginStart : 0);
					item.center = item.start - round(frameSize / 2 - item.size / 2);
					item.end = item.start - frameSize + item.size;

					// Account for slidee padding
					if (!i) {
						slideeSize += paddingStart;
					}

					// Increment slidee size for size of the active element
					slideeSize += itemSizeFull;

					// Try to account for vertical margin collapsing in vertical mode
					// It's not bulletproof, but should work in 99% of cases
					if (!o.horizontal && !areFloated) {
						// Subtract smaller margin, but only when top margin is not 0, and this is not the first element
						if (itemMarginEnd && itemMarginStart && i > 0) {
							slideeSize -= min(itemMarginStart, itemMarginEnd);
						}
					}

					// Things to be done on last item
					if (i === lastItemIndex) {
						item.end += paddingEnd;
						slideeSize += paddingEnd;
						ignoredMargin = singleSpaced ? itemMarginEnd : 0;
					}

					// Add item object to items array
					items.push(item);
					lastItem = item;
				});

				// Resize SLIDEE to fit all items
				$slidee[0].style[o.horizontal ? 'width' : 'height'] = (borderBox ? slideeSize : slideeSize - paddingStart - paddingEnd) + 'px';

				// Adjust internal SLIDEE size for last margin
				slideeSize -= ignoredMargin;

				// Set limits
				if (items.length) {
					pos.start = items[0][forceCenteredNav ? 'center' : 'start'];
					pos.end = forceCenteredNav ? lastItem.center : frameSize < slideeSize ? lastItem.end : pos.start;
				} else {
					pos.start = pos.end = 0;
				}
			}

			// Calculate SLIDEE center position
			pos.center = round(pos.end / 2 + pos.start / 2);

			// Update relative positions
			updateRelatives();

			// Scrollbar
			if ($handle.length && sbSize > 0) {
				// Stretch scrollbar handle to represent the visible area
				if (o.dynamicHandle) {
					handleSize = pos.start === pos.end ? sbSize : round(sbSize * frameSize / slideeSize);
					handleSize = within(handleSize, o.minHandleSize, sbSize);
					$handle[0].style[o.horizontal ? 'width' : 'height'] = handleSize + 'px';
				} else {
					handleSize = $handle[o.horizontal ? 'outerWidth' : 'outerHeight']();
				}

				hPos.end = sbSize - handleSize;

				if (!renderID) {
					syncScrollbar();
				}
			}

			// Pages
			if (!parallax && frameSize > 0) {
				var tempPagePos = pos.start;
				var pagesHtml = '';

				// Populate pages array
				if (itemNav) {
					$.each(items, function (i, item) {
						if (forceCenteredNav) {
							pages.push(item.center);
						} else if (item.start + item.size > tempPagePos && tempPagePos <= pos.end) {
							tempPagePos = item.start;
							pages.push(tempPagePos);
							tempPagePos += frameSize;
							if (tempPagePos > pos.end && tempPagePos < pos.end + frameSize) {
								pages.push(pos.end);
							}
						}
					});
				} else {
					while (tempPagePos - frameSize < pos.end) {
						pages.push(tempPagePos);
						tempPagePos += frameSize;
					}
				}

				// Pages bar
				if ($pb[0] && lastPagesCount !== pages.length) {
					for (var i = 0; i < pages.length; i++) {
						pagesHtml += o.pageBuilder.call(self, i);
					}
					$pages = $pb.html(pagesHtml).children();
					$pages.eq(rel.activePage).addClass(o.activeClass);
				}
			}

			// Extend relative variables object with some useful info
			rel.slideeSize = slideeSize;
			rel.frameSize = frameSize;
			rel.sbSize = sbSize;
			rel.handleSize = handleSize;

			// Activate requested position
			if (itemNav) {
				if (isInit && o.startAt != null) {
					activate(o.startAt);
					self[centeredNav ? 'toCenter' : 'toStart'](o.startAt);
				}
				// Fix possible overflowing
				var activeItem = items[rel.activeItem];
				slideTo(centeredNav && activeItem ? activeItem.center : within(pos.dest, pos.start, pos.end));
			} else {
				if (isInit) {
					if (o.startAt != null) slideTo(o.startAt, 1);
				} else {
					// Fix possible overflowing
					slideTo(within(pos.dest, pos.start, pos.end));
				}
			}

			// Trigger load event
			trigger('load');
		}
		self.reload = function () {
			load();
		};

		/**
   * Animate to a position.
   *
   * @param {Int}  newPos    New position.
   * @param {Bool} immediate Reposition immediately without an animation.
   * @param {Bool} dontAlign Do not align items, use the raw position passed in first argument.
   *
   * @return {Void}
   */
		function slideTo(newPos, immediate, dontAlign) {
			// Align items
			if (itemNav && dragging.released && !dontAlign) {
				var tempRel = getRelatives(newPos);
				var isNotBordering = newPos > pos.start && newPos < pos.end;

				if (centeredNav) {
					if (isNotBordering) {
						newPos = items[tempRel.centerItem].center;
					}
					if (forceCenteredNav && o.activateMiddle) {
						activate(tempRel.centerItem);
					}
				} else if (isNotBordering) {
					newPos = items[tempRel.firstItem].start;
				}
			}

			// Handle overflowing position limits
			if (dragging.init && dragging.slidee && o.elasticBounds) {
				if (newPos > pos.end) {
					newPos = pos.end + (newPos - pos.end) / 6;
				} else if (newPos < pos.start) {
					newPos = pos.start + (newPos - pos.start) / 6;
				}
			} else {
				newPos = within(newPos, pos.start, pos.end);
			}

			// Update the animation object
			animation.start = +new Date();
			animation.time = 0;
			animation.from = pos.cur;
			animation.to = newPos;
			animation.delta = newPos - pos.cur;
			animation.tweesing = dragging.tweese || dragging.init && !dragging.slidee;
			animation.immediate = !animation.tweesing && (immediate || dragging.init && dragging.slidee || !o.speed);

			// Reset dragging tweesing request
			dragging.tweese = 0;

			// Start animation rendering
			if (newPos !== pos.dest) {
				pos.dest = newPos;
				trigger('change');
				if (!renderID) {
					render();
				}
			}

			// Reset next cycle timeout
			resetCycle();

			// Synchronize states
			updateRelatives();
			updateButtonsState();
			syncPagesbar();
		}

		/**
   * Render animation frame.
   *
   * @return {Void}
   */
		function render() {
			if (!self.initialized) {
				return;
			}

			// If first render call, wait for next animationFrame
			if (!renderID) {
				renderID = rAF(render);
				if (dragging.released) {
					trigger('moveStart');
				}
				return;
			}

			// If immediate repositioning is requested, don't animate.
			if (animation.immediate) {
				pos.cur = animation.to;
			}
			// Use tweesing for animations without known end point
			else if (animation.tweesing) {
					animation.tweeseDelta = animation.to - pos.cur;
					// Fuck Zeno's paradox
					if (abs(animation.tweeseDelta) < 0.1) {
						pos.cur = animation.to;
					} else {
						pos.cur += animation.tweeseDelta * (dragging.released ? o.swingSpeed : o.syncSpeed);
					}
				}
				// Use tweening for basic animations with known end point
				else {
						animation.time = min(+new Date() - animation.start, o.speed);
						pos.cur = animation.from + animation.delta * $.easing[o.easing](animation.time / o.speed, animation.time, 0, 1, o.speed);
					}

			// If there is nothing more to render break the rendering loop, otherwise request new animation frame.
			if (animation.to === pos.cur) {
				pos.cur = animation.to;
				dragging.tweese = renderID = 0;
			} else {
				renderID = rAF(render);
			}

			trigger('move');

			// Update SLIDEE position
			if (!parallax) {
				if (transform) {
					$slidee[0].style[transform] = gpuAcceleration + (o.horizontal ? 'translateX' : 'translateY') + '(' + -pos.cur + 'px)';
				} else {
					$slidee[0].style[o.horizontal ? 'left' : 'top'] = -round(pos.cur) + 'px';
				}
			}

			// When animation reached the end, and dragging is not active, trigger moveEnd
			if (!renderID && dragging.released) {
				trigger('moveEnd');
			}

			syncScrollbar();
		}

		/**
   * Synchronizes scrollbar with the SLIDEE.
   *
   * @return {Void}
   */
		function syncScrollbar() {
			if ($handle.length) {
				hPos.cur = pos.start === pos.end ? 0 : ((dragging.init && !dragging.slidee ? pos.dest : pos.cur) - pos.start) / (pos.end - pos.start) * hPos.end;
				hPos.cur = within(round(hPos.cur), hPos.start, hPos.end);
				if (last.hPos !== hPos.cur) {
					last.hPos = hPos.cur;
					if (transform) {
						$handle[0].style[transform] = gpuAcceleration + (o.horizontal ? 'translateX' : 'translateY') + '(' + hPos.cur + 'px)';
					} else {
						$handle[0].style[o.horizontal ? 'left' : 'top'] = hPos.cur + 'px';
					}
				}
			}
		}

		/**
   * Synchronizes pagesbar with SLIDEE.
   *
   * @return {Void}
   */
		function syncPagesbar() {
			if ($pages[0] && last.page !== rel.activePage) {
				last.page = rel.activePage;
				$pages.removeClass(o.activeClass).eq(rel.activePage).addClass(o.activeClass);
				trigger('activePage', last.page);
			}
		}

		/**
   * Returns the position object.
   *
   * @param {Mixed} item
   *
   * @return {Object}
   */
		self.getPos = function (item) {
			if (itemNav) {
				var index = getIndex(item);
				return index !== -1 ? items[index] : false;
			} else {
				var $item = $slidee.find(item).eq(0);

				if ($item[0]) {
					var offset = o.horizontal ? $item.offset().left - $slidee.offset().left : $item.offset().top - $slidee.offset().top;
					var size = $item[o.horizontal ? 'outerWidth' : 'outerHeight']();

					return {
						start: offset,
						center: offset - frameSize / 2 + size / 2,
						end: offset - frameSize + size,
						size: size
					};
				} else {
					return false;
				}
			}
		};

		/**
   * Continuous move in a specified direction.
   *
   * @param  {Bool} forward True for forward movement, otherwise it'll go backwards.
   * @param  {Int}  speed   Movement speed in pixels per frame. Overrides options.moveBy value.
   *
   * @return {Void}
   */
		self.moveBy = function (speed) {
			move.speed = speed;
			// If already initiated, or there is nowhere to move, abort
			if (dragging.init || !move.speed || pos.cur === (move.speed > 0 ? pos.end : pos.start)) {
				return;
			}
			// Initiate move object
			move.lastTime = +new Date();
			move.startPos = pos.cur;
			// Set dragging as initiated
			continuousInit('button');
			dragging.init = 1;
			// Start movement
			trigger('moveStart');
			cAF(continuousID);
			moveLoop();
		};

		/**
   * Continuous movement loop.
   *
   * @return {Void}
   */
		function moveLoop() {
			// If there is nowhere to move anymore, stop
			if (!move.speed || pos.cur === (move.speed > 0 ? pos.end : pos.start)) {
				self.stop();
			}
			// Request new move loop if it hasn't been stopped
			continuousID = dragging.init ? rAF(moveLoop) : 0;
			// Update move object
			move.now = +new Date();
			move.pos = pos.cur + (move.now - move.lastTime) / 1000 * move.speed;
			// Slide
			slideTo(dragging.init ? move.pos : round(move.pos));
			// Normally, this is triggered in render(), but if there
			// is nothing to render, we have to do it manually here.
			if (!dragging.init && pos.cur === pos.dest) {
				trigger('moveEnd');
			}
			// Update times for future iteration
			move.lastTime = move.now;
		}

		/**
   * Stops continuous movement.
   *
   * @return {Void}
   */
		self.stop = function () {
			if (dragging.source === 'button') {
				dragging.init = 0;
				dragging.released = 1;
			}
		};

		/**
   * Activate previous item.
   *
   * @return {Void}
   */
		self.prev = function () {
			self.activate(rel.activeItem == null ? 0 : rel.activeItem - 1);
		};

		/**
   * Activate next item.
   *
   * @return {Void}
   */
		self.next = function () {
			self.activate(rel.activeItem == null ? 0 : rel.activeItem + 1);
		};

		/**
   * Activate previous page.
   *
   * @return {Void}
   */
		self.prevPage = function () {
			self.activatePage(rel.activePage - 1);
		};

		/**
   * Activate next page.
   *
   * @return {Void}
   */
		self.nextPage = function () {
			self.activatePage(rel.activePage + 1);
		};

		/**
   * Slide SLIDEE by amount of pixels.
   *
   * @param {Int}  delta     Pixels/Items. Positive means forward, negative means backward.
   * @param {Bool} immediate Reposition immediately without an animation.
   *
   * @return {Void}
   */
		self.slideBy = function (delta, immediate) {
			if (!delta) {
				return;
			}
			if (itemNav) {
				self[centeredNav ? 'toCenter' : 'toStart'](within((centeredNav ? rel.centerItem : rel.firstItem) + o.scrollBy * delta, 0, items.length));
			} else {
				slideTo(pos.dest + delta, immediate);
			}
		};

		/**
   * Animate SLIDEE to a specific position.
   *
   * @param {Int}  pos       New position.
   * @param {Bool} immediate Reposition immediately without an animation.
   *
   * @return {Void}
   */
		self.slideTo = function (pos, immediate) {
			slideTo(pos, immediate);
		};

		/**
   * Core method for handling `toLocation` methods.
   *
   * @param  {String} location
   * @param  {Mixed}  item
   * @param  {Bool}   immediate
   *
   * @return {Void}
   */
		function to(location, item, immediate) {
			// Optional arguments logic
			if (type(item) === 'boolean') {
				immediate = item;
				item = undefined;
			}

			if (item === undefined) {
				slideTo(pos[location], immediate);
			} else {
				// You can't align items to sides of the frame
				// when centered navigation type is enabled
				if (centeredNav && location !== 'center') {
					return;
				}

				var itemPos = self.getPos(item);
				if (itemPos) {
					slideTo(itemPos[location], immediate, !centeredNav);
				}
			}
		}

		/**
   * Animate element or the whole SLIDEE to the start of the frame.
   *
   * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
   * @param {Bool}  immediate Reposition immediately without an animation.
   *
   * @return {Void}
   */
		self.toStart = function (item, immediate) {
			to('start', item, immediate);
		};

		/**
   * Animate element or the whole SLIDEE to the end of the frame.
   *
   * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
   * @param {Bool}  immediate Reposition immediately without an animation.
   *
   * @return {Void}
   */
		self.toEnd = function (item, immediate) {
			to('end', item, immediate);
		};

		/**
   * Animate element or the whole SLIDEE to the center of the frame.
   *
   * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
   * @param {Bool}  immediate Reposition immediately without an animation.
   *
   * @return {Void}
   */
		self.toCenter = function (item, immediate) {
			to('center', item, immediate);
		};

		/**
   * Get the index of an item in SLIDEE.
   *
   * @param {Mixed} item     Item DOM element.
   *
   * @return {Int}  Item index, or -1 if not found.
   */
		function getIndex(item) {
			return item != null ? isNumber(item) ? item >= 0 && item < items.length ? item : -1 : $items.index(item) : -1;
		}
		// Expose getIndex without lowering the compressibility of it,
		// as it is used quite often throughout Sly.
		self.getIndex = getIndex;

		/**
   * Get index of an item in SLIDEE based on a variety of input types.
   *
   * @param  {Mixed} item DOM element, positive or negative integer.
   *
   * @return {Int}   Item index, or -1 if not found.
   */
		function getRelativeIndex(item) {
			return getIndex(isNumber(item) && item < 0 ? item + items.length : item);
		}

		/**
   * Activates an item.
   *
   * @param  {Mixed} item Item DOM element, or index starting at 0.
   *
   * @return {Mixed} Activated item index or false on fail.
   */
		function activate(item, force) {
			var index = getIndex(item);

			if (!itemNav || index < 0) {
				return false;
			}

			// Update classes, last active index, and trigger active event only when there
			// has been a change. Otherwise just return the current active index.
			if (last.active !== index || force) {
				// Update classes
				$items.eq(rel.activeItem).removeClass(o.activeClass);
				$items.eq(index).addClass(o.activeClass);

				last.active = rel.activeItem = index;

				updateButtonsState();
				trigger('active', index);
			}

			return index;
		}

		/**
   * Activates an item and helps with further navigation when o.smart is enabled.
   *
   * @param {Mixed} item      Item DOM element, or index starting at 0.
   * @param {Bool}  immediate Whether to reposition immediately in smart navigation.
   *
   * @return {Void}
   */
		self.activate = function (item, immediate) {
			var index = activate(item);

			// Smart navigation
			if (o.smart && index !== false) {
				// When centeredNav is enabled, center the element.
				// Otherwise, determine where to position the element based on its current position.
				// If the element is currently on the far end side of the frame, assume that user is
				// moving forward and animate it to the start of the visible frame, and vice versa.
				if (centeredNav) {
					self.toCenter(index, immediate);
				} else if (index >= rel.lastItem) {
					self.toStart(index, immediate);
				} else if (index <= rel.firstItem) {
					self.toEnd(index, immediate);
				} else {
					resetCycle();
				}
			}
		};

		/**
   * Activates a page.
   *
   * @param {Int}  index     Page index, starting from 0.
   * @param {Bool} immediate Whether to reposition immediately without animation.
   *
   * @return {Void}
   */
		self.activatePage = function (index, immediate) {
			if (isNumber(index)) {
				slideTo(pages[within(index, 0, pages.length - 1)], immediate);
			}
		};

		/**
   * Return relative positions of items based on their visibility within FRAME.
   *
   * @param {Int} slideePos Position of SLIDEE.
   *
   * @return {Void}
   */
		function getRelatives(slideePos) {
			slideePos = within(isNumber(slideePos) ? slideePos : pos.dest, pos.start, pos.end);

			var relatives = {};
			var centerOffset = forceCenteredNav ? 0 : frameSize / 2;

			// Determine active page
			if (!parallax) {
				for (var p = 0, pl = pages.length; p < pl; p++) {
					if (slideePos >= pos.end || p === pages.length - 1) {
						relatives.activePage = pages.length - 1;
						break;
					}

					if (slideePos <= pages[p] + centerOffset) {
						relatives.activePage = p;
						break;
					}
				}
			}

			// Relative item indexes
			if (itemNav) {
				var first = false;
				var last = false;
				var center = false;

				// From start
				for (var i = 0, il = items.length; i < il; i++) {
					// First item
					if (first === false && slideePos <= items[i].start + items[i].half) {
						first = i;
					}

					// Center item
					if (center === false && slideePos <= items[i].center + items[i].half) {
						center = i;
					}

					// Last item
					if (i === il - 1 || slideePos <= items[i].end + items[i].half) {
						last = i;
						break;
					}
				}

				// Safe assignment, just to be sure the false won't be returned
				relatives.firstItem = isNumber(first) ? first : 0;
				relatives.centerItem = isNumber(center) ? center : relatives.firstItem;
				relatives.lastItem = isNumber(last) ? last : relatives.centerItem;
			}

			return relatives;
		}

		/**
   * Update object with relative positions.
   *
   * @param {Int} newPos
   *
   * @return {Void}
   */
		function updateRelatives(newPos) {
			$.extend(rel, getRelatives(newPos));
		}

		/**
   * Disable navigation buttons when needed.
   *
   * Adds disabledClass, and when the button is <button> or <input>, activates :disabled state.
   *
   * @return {Void}
   */
		function updateButtonsState() {
			var isStart = pos.dest <= pos.start;
			var isEnd = pos.dest >= pos.end;
			var slideePosState = (isStart ? 1 : 0) | (isEnd ? 2 : 0);

			// Update paging buttons only if there has been a change in SLIDEE position
			if (last.slideePosState !== slideePosState) {
				last.slideePosState = slideePosState;

				if ($prevPageButton.is('button,input')) {
					$prevPageButton.prop('disabled', isStart);
				}

				if ($nextPageButton.is('button,input')) {
					$nextPageButton.prop('disabled', isEnd);
				}

				$prevPageButton.add($backwardButton)[isStart ? 'addClass' : 'removeClass'](o.disabledClass);
				$nextPageButton.add($forwardButton)[isEnd ? 'addClass' : 'removeClass'](o.disabledClass);
			}

			// Forward & Backward buttons need a separate state caching because we cannot "property disable"
			// them while they are being used, as disabled buttons stop emitting mouse events.
			if (last.fwdbwdState !== slideePosState && dragging.released) {
				last.fwdbwdState = slideePosState;

				if ($backwardButton.is('button,input')) {
					$backwardButton.prop('disabled', isStart);
				}

				if ($forwardButton.is('button,input')) {
					$forwardButton.prop('disabled', isEnd);
				}
			}

			// Item navigation
			if (itemNav && rel.activeItem != null) {
				var isFirst = rel.activeItem === 0;
				var isLast = rel.activeItem >= items.length - 1;
				var itemsButtonState = (isFirst ? 1 : 0) | (isLast ? 2 : 0);

				if (last.itemsButtonState !== itemsButtonState) {
					last.itemsButtonState = itemsButtonState;

					if ($prevButton.is('button,input')) {
						$prevButton.prop('disabled', isFirst);
					}

					if ($nextButton.is('button,input')) {
						$nextButton.prop('disabled', isLast);
					}

					$prevButton[isFirst ? 'addClass' : 'removeClass'](o.disabledClass);
					$nextButton[isLast ? 'addClass' : 'removeClass'](o.disabledClass);
				}
			}
		}

		/**
   * Resume cycling.
   *
   * @param {Int} priority Resume pause with priority lower or equal than this. Used internally for pauseOnHover.
   *
   * @return {Void}
   */
		self.resume = function (priority) {
			if (!o.cycleBy || !o.cycleInterval || o.cycleBy === 'items' && (!items[0] || rel.activeItem == null) || priority < self.isPaused) {
				return;
			}

			self.isPaused = 0;

			if (cycleID) {
				cycleID = clearTimeout(cycleID);
			} else {
				trigger('resume');
			}

			cycleID = setTimeout(function () {
				trigger('cycle');
				switch (o.cycleBy) {
					case 'items':
						self.activate(rel.activeItem >= items.length - 1 ? 0 : rel.activeItem + 1);
						break;

					case 'pages':
						self.activatePage(rel.activePage >= pages.length - 1 ? 0 : rel.activePage + 1);
						break;
				}
			}, o.cycleInterval);
		};

		/**
   * Pause cycling.
   *
   * @param {Int} priority Pause priority. 100 is default. Used internally for pauseOnHover.
   *
   * @return {Void}
   */
		self.pause = function (priority) {
			if (priority < self.isPaused) {
				return;
			}

			self.isPaused = priority || 100;

			if (cycleID) {
				cycleID = clearTimeout(cycleID);
				trigger('pause');
			}
		};

		/**
   * Toggle cycling.
   *
   * @return {Void}
   */
		self.toggle = function () {
			self[cycleID ? 'pause' : 'resume']();
		};

		/**
   * Updates a signle or multiple option values.
   *
   * @param {Mixed} name  Name of the option that should be updated, or object that will extend the options.
   * @param {Mixed} value New option value.
   *
   * @return {Void}
   */
		self.set = function (name, value) {
			if ($.isPlainObject(name)) {
				$.extend(o, name);
			} else if (o.hasOwnProperty(name)) {
				o[name] = value;
			}
		};

		/**
   * Add one or multiple items to the SLIDEE end, or a specified position index.
   *
   * @param {Mixed} element Node element, or HTML string.
   * @param {Int}   index   Index of a new item position. By default item is appended at the end.
   *
   * @return {Void}
   */
		self.add = function (element, index) {
			var $element = $(element);

			if (itemNav) {
				// Insert the element(s)
				if (index == null || !items[0] || index >= items.length) {
					$element.appendTo($slidee);
				} else if (items.length) {
					$element.insertBefore(items[index].el);
				}

				// Adjust the activeItem index
				if (rel.activeItem != null && index <= rel.activeItem) {
					last.active = rel.activeItem += $element.length;
				}
			} else {
				$slidee.append($element);
			}

			// Reload
			load();
		};

		/**
   * Remove an item from SLIDEE.
   *
   * @param {Mixed} element Item index, or DOM element.
   * @param {Int}   index   Index of a new item position. By default item is appended at the end.
   *
   * @return {Void}
   */
		self.remove = function (element) {
			if (itemNav) {
				var index = getRelativeIndex(element);

				if (index > -1) {
					// Remove the element
					$items.eq(index).remove();

					// If the current item is being removed, activate new one after reload
					var reactivate = index === rel.activeItem;

					// Adjust the activeItem index
					if (rel.activeItem != null && index < rel.activeItem) {
						last.active = --rel.activeItem;
					}

					// Reload
					load();

					// Activate new item at the removed position
					if (reactivate) {
						last.active = null;
						self.activate(rel.activeItem);
					}
				}
			} else {
				$(element).remove();
				load();
			}
		};

		/**
   * Helps re-arranging items.
   *
   * @param  {Mixed} item     Item DOM element, or index starting at 0. Use negative numbers to select items from the end.
   * @param  {Mixed} position Item insertion anchor. Accepts same input types as item argument.
   * @param  {Bool}  after    Insert after instead of before the anchor.
   *
   * @return {Void}
   */
		function moveItem(item, position, after) {
			item = getRelativeIndex(item);
			position = getRelativeIndex(position);

			// Move only if there is an actual change requested
			if (item > -1 && position > -1 && item !== position && (!after || position !== item - 1) && (after || position !== item + 1)) {
				$items.eq(item)[after ? 'insertAfter' : 'insertBefore'](items[position].el);

				var shiftStart = item < position ? item : after ? position : position - 1;
				var shiftEnd = item > position ? item : after ? position + 1 : position;
				var shiftsUp = item > position;

				// Update activeItem index
				if (rel.activeItem != null) {
					if (item === rel.activeItem) {
						last.active = rel.activeItem = after ? shiftsUp ? position + 1 : position : shiftsUp ? position : position - 1;
					} else if (rel.activeItem > shiftStart && rel.activeItem < shiftEnd) {
						last.active = rel.activeItem += shiftsUp ? 1 : -1;
					}
				}

				// Reload
				load();
			}
		}

		/**
   * Move item after the target anchor.
   *
   * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
   * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
   *
   * @return {Void}
   */
		self.moveAfter = function (item, position) {
			moveItem(item, position, 1);
		};

		/**
   * Move item before the target anchor.
   *
   * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
   * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
   *
   * @return {Void}
   */
		self.moveBefore = function (item, position) {
			moveItem(item, position);
		};

		/**
   * Registers callbacks.
   *
   * @param  {Mixed} name  Event name, or callbacks map.
   * @param  {Mixed} fn    Callback, or an array of callback functions.
   *
   * @return {Void}
   */
		self.on = function (name, fn) {
			// Callbacks map
			if (type(name) === 'object') {
				for (var key in name) {
					if (name.hasOwnProperty(key)) {
						self.on(key, name[key]);
					}
				}
				// Callback
			} else if (type(fn) === 'function') {
				var names = name.split(' ');
				for (var n = 0, nl = names.length; n < nl; n++) {
					callbacks[names[n]] = callbacks[names[n]] || [];
					if (callbackIndex(names[n], fn) === -1) {
						callbacks[names[n]].push(fn);
					}
				}
				// Callbacks array
			} else if (type(fn) === 'array') {
				for (var f = 0, fl = fn.length; f < fl; f++) {
					self.on(name, fn[f]);
				}
			}
		};

		/**
   * Registers callbacks to be executed only once.
   *
   * @param  {Mixed} name  Event name, or callbacks map.
   * @param  {Mixed} fn    Callback, or an array of callback functions.
   *
   * @return {Void}
   */
		self.one = function (name, fn) {
			function proxy() {
				fn.apply(self, arguments);
				self.off(name, proxy);
			}
			self.on(name, proxy);
		};

		/**
   * Remove one or all callbacks.
   *
   * @param  {String} name Event name.
   * @param  {Mixed}  fn   Callback, or an array of callback functions. Omit to remove all callbacks.
   *
   * @return {Void}
   */
		self.off = function (name, fn) {
			if (fn instanceof Array) {
				for (var f = 0, fl = fn.length; f < fl; f++) {
					self.off(name, fn[f]);
				}
			} else {
				var names = name.split(' ');
				for (var n = 0, nl = names.length; n < nl; n++) {
					callbacks[names[n]] = callbacks[names[n]] || [];
					if (fn == null) {
						callbacks[names[n]].length = 0;
					} else {
						var index = callbackIndex(names[n], fn);
						if (index !== -1) {
							callbacks[names[n]].splice(index, 1);
						}
					}
				}
			}
		};

		/**
   * Returns callback array index.
   *
   * @param  {String}   name Event name.
   * @param  {Function} fn   Function
   *
   * @return {Int} Callback array index, or -1 if isn't registered.
   */
		function callbackIndex(name, fn) {
			for (var i = 0, l = callbacks[name].length; i < l; i++) {
				if (callbacks[name][i] === fn) {
					return i;
				}
			}
			return -1;
		}

		/**
   * Reset next cycle timeout.
   *
   * @return {Void}
   */
		function resetCycle() {
			if (dragging.released && !self.isPaused) {
				self.resume();
			}
		}

		/**
   * Calculate SLIDEE representation of handle position.
   *
   * @param  {Int} handlePos
   *
   * @return {Int}
   */
		function handleToSlidee(handlePos) {
			return round(within(handlePos, hPos.start, hPos.end) / hPos.end * (pos.end - pos.start)) + pos.start;
		}

		/**
   * Keeps track of a dragging delta history.
   *
   * @return {Void}
   */
		function draggingHistoryTick() {
			// Looking at this, I know what you're thinking :) But as we need only 4 history states, doing it this way
			// as opposed to a proper loop is ~25 bytes smaller (when minified with GCC), a lot faster, and doesn't
			// generate garbage. The loop version would create 2 new variables on every tick. Unexaptable!
			dragging.history[0] = dragging.history[1];
			dragging.history[1] = dragging.history[2];
			dragging.history[2] = dragging.history[3];
			dragging.history[3] = dragging.delta;
		}

		/**
   * Initialize continuous movement.
   *
   * @return {Void}
   */
		function continuousInit(source) {
			dragging.released = 0;
			dragging.source = source;
			dragging.slidee = source === 'slidee';
		}

		/**
   * Dragging initiator.
   *
   * @param  {Event} event
   *
   * @return {Void}
   */
		function dragInit(event) {
			var isTouch = event.type === 'touchstart';
			var source = event.data.source;
			var isSlidee = source === 'slidee';

			// Ignore when already in progress, or interactive element in non-touch navivagion
			if (dragging.init || !isTouch && isInteractive(event.target)) {
				return;
			}

			// Handle dragging conditions
			if (source === 'handle' && (!o.dragHandle || hPos.start === hPos.end)) {
				return;
			}

			// SLIDEE dragging conditions
			if (isSlidee && !(isTouch ? o.touchDragging : o.mouseDragging && event.which < 2)) {
				return;
			}

			if (!isTouch) {
				// prevents native image dragging in Firefox
				stopDefault(event);
			}

			// Reset dragging object
			continuousInit(source);

			// Properties used in dragHandler
			dragging.init = 0;
			dragging.$source = $(event.target);
			dragging.touch = isTouch;
			dragging.pointer = isTouch ? event.originalEvent.touches[0] : event;
			dragging.initX = dragging.pointer.pageX;
			dragging.initY = dragging.pointer.pageY;
			dragging.initPos = isSlidee ? pos.cur : hPos.cur;
			dragging.start = +new Date();
			dragging.time = 0;
			dragging.path = 0;
			dragging.delta = 0;
			dragging.locked = 0;
			dragging.history = [0, 0, 0, 0];
			dragging.pathToLock = isSlidee ? isTouch ? 30 : 10 : 0;

			// Bind dragging events
			$doc.on(isTouch ? dragTouchEvents : dragMouseEvents, dragHandler);

			// Pause ongoing cycle
			self.pause(1);

			// Add dragging class
			(isSlidee ? $slidee : $handle).addClass(o.draggedClass);

			// Trigger moveStart event
			trigger('moveStart');

			// Keep track of a dragging path history. This is later used in the
			// dragging release swing calculation when dragging SLIDEE.
			if (isSlidee) {
				historyID = setInterval(draggingHistoryTick, 10);
			}
		}

		/**
   * Handler for dragging scrollbar handle or SLIDEE.
   *
   * @param  {Event} event
   *
   * @return {Void}
   */
		function dragHandler(event) {
			dragging.released = event.type === 'mouseup' || event.type === 'touchend';
			dragging.pointer = dragging.touch ? event.originalEvent[dragging.released ? 'changedTouches' : 'touches'][0] : event;
			dragging.pathX = dragging.pointer.pageX - dragging.initX;
			dragging.pathY = dragging.pointer.pageY - dragging.initY;
			dragging.path = sqrt(pow(dragging.pathX, 2) + pow(dragging.pathY, 2));
			dragging.delta = o.horizontal ? dragging.pathX : dragging.pathY;

			if (!dragging.released && dragging.path < 1) return;

			// We haven't decided whether this is a drag or not...
			if (!dragging.init) {
				// If the drag path was very short, maybe it's not a drag?
				if (dragging.path < o.dragThreshold) {
					// If the pointer was released, the path will not become longer and it's
					// definitely not a drag. If not released yet, decide on next iteration
					return dragging.released ? dragEnd() : undefined;
				} else {
					// If dragging path is sufficiently long we can confidently start a drag
					// if drag is in different direction than scroll, ignore it
					if (o.horizontal ? abs(dragging.pathX) > abs(dragging.pathY) : abs(dragging.pathX) < abs(dragging.pathY)) {
						dragging.init = 1;
					} else {
						return dragEnd();
					}
				}
			}

			stopDefault(event);

			// Disable click on a source element, as it is unwelcome when dragging
			if (!dragging.locked && dragging.path > dragging.pathToLock && dragging.slidee) {
				dragging.locked = 1;
				dragging.$source.on(clickEvent, disableOneEvent);
			}

			// Cancel dragging on release
			if (dragging.released) {
				dragEnd();

				// Adjust path with a swing on mouse release
				if (o.releaseSwing && dragging.slidee) {
					dragging.swing = (dragging.delta - dragging.history[0]) / 40 * 300;
					dragging.delta += dragging.swing;
					dragging.tweese = abs(dragging.swing) > 10;
				}
			}

			slideTo(dragging.slidee ? round(dragging.initPos - dragging.delta) : handleToSlidee(dragging.initPos + dragging.delta));
		}

		/**
   * Stops dragging and cleans up after it.
   *
   * @return {Void}
   */
		function dragEnd() {
			clearInterval(historyID);
			dragging.released = true;
			$doc.off(dragging.touch ? dragTouchEvents : dragMouseEvents, dragHandler);
			(dragging.slidee ? $slidee : $handle).removeClass(o.draggedClass);

			// Make sure that disableOneEvent is not active in next tick.
			setTimeout(function () {
				dragging.$source.off(clickEvent, disableOneEvent);
			});

			// Normally, this is triggered in render(), but if there
			// is nothing to render, we have to do it manually here.
			if (pos.cur === pos.dest && dragging.init) {
				trigger('moveEnd');
			}

			// Resume ongoing cycle
			self.resume(1);

			dragging.init = 0;
		}

		/**
   * Check whether element is interactive.
   *
   * @return {Boolean}
   */
		function isInteractive(element) {
			return ~$.inArray(element.nodeName, interactiveElements) || $(element).is(o.interactive);
		}

		/**
   * Continuous movement cleanup on mouseup.
   *
   * @return {Void}
   */
		function movementReleaseHandler() {
			self.stop();
			$doc.off('mouseup', movementReleaseHandler);
		}

		/**
   * Buttons navigation handler.
   *
   * @param  {Event} event
   *
   * @return {Void}
   */
		function buttonsHandler(event) {
			/*jshint validthis:true */
			stopDefault(event);
			switch (this) {
				case $forwardButton[0]:
				case $backwardButton[0]:
					self.moveBy($forwardButton.is(this) ? o.moveBy : -o.moveBy);
					$doc.on('mouseup', movementReleaseHandler);
					break;

				case $prevButton[0]:
					self.prev();
					break;

				case $nextButton[0]:
					self.next();
					break;

				case $prevPageButton[0]:
					self.prevPage();
					break;

				case $nextPageButton[0]:
					self.nextPage();
					break;
			}
		}

		/**
   * Mouse wheel delta normalization.
   *
   * @param  {Event} event
   *
   * @return {Int}
   */
		function normalizeWheelDelta(event) {
			// wheelDelta needed only for IE8-
			scrolling.curDelta = (o.horizontal ? event.deltaY || event.deltaX : event.deltaY) || -event.wheelDelta;
			scrolling.curDelta /= event.deltaMode === 1 ? 3 : 100;
			if (!itemNav) {
				return scrolling.curDelta;
			}
			time = +new Date();
			if (scrolling.last < time - scrolling.resetTime) {
				scrolling.delta = 0;
			}
			scrolling.last = time;
			scrolling.delta += scrolling.curDelta;
			if (abs(scrolling.delta) < 1) {
				scrolling.finalDelta = 0;
			} else {
				scrolling.finalDelta = round(scrolling.delta / 1);
				scrolling.delta %= 1;
			}
			return scrolling.finalDelta;
		}

		/**
   * Mouse scrolling handler.
   *
   * @param  {Event} event
   *
   * @return {Void}
   */
		function scrollHandler(event) {
			// Mark event as originating in a Sly instance
			event.originalEvent[namespace] = self;
			// Don't hijack global scrolling
			var time = +new Date();
			if (lastGlobalWheel + o.scrollHijack > time && $scrollSource[0] !== document && $scrollSource[0] !== window) {
				lastGlobalWheel = time;
				return;
			}
			// Ignore if there is no scrolling to be done
			if (!o.scrollBy || pos.start === pos.end) {
				return;
			}
			var delta = normalizeWheelDelta(event.originalEvent);
			// Trap scrolling only when necessary and/or requested
			if (o.scrollTrap || delta > 0 && pos.dest < pos.end || delta < 0 && pos.dest > pos.start) {
				stopDefault(event, 1);
			}
			self.slideBy(o.scrollBy * delta);
		}

		/**
   * Scrollbar click handler.
   *
   * @param  {Event} event
   *
   * @return {Void}
   */
		function scrollbarHandler(event) {
			// Only clicks on scroll bar. Ignore the handle.
			if (o.clickBar && event.target === $sb[0]) {
				stopDefault(event);
				// Calculate new handle position and sync SLIDEE to it
				slideTo(handleToSlidee((o.horizontal ? event.pageX - $sb.offset().left : event.pageY - $sb.offset().top) - handleSize / 2));
			}
		}

		/**
   * Keyboard input handler.
   *
   * @param  {Event} event
   *
   * @return {Void}
   */
		function keyboardHandler(event) {
			if (!o.keyboardNavBy) {
				return;
			}

			switch (event.which) {
				// Left or Up
				case o.horizontal ? 37 : 38:
					stopDefault(event);
					self[o.keyboardNavBy === 'pages' ? 'prevPage' : 'prev']();
					break;

				// Right or Down
				case o.horizontal ? 39 : 40:
					stopDefault(event);
					self[o.keyboardNavBy === 'pages' ? 'nextPage' : 'next']();
					break;
			}
		}

		/**
   * Click on item activation handler.
   *
   * @param  {Event} event
   *
   * @return {Void}
   */
		function activateHandler(event) {
			/*jshint validthis:true */

			// Ignore clicks on interactive elements.
			if (isInteractive(this)) {
				event.originalEvent[namespace + 'ignore'] = true;
				return;
			}

			// Ignore events that:
			// - are not originating from direct SLIDEE children
			// - originated from interactive elements
			if (this.parentNode !== $slidee[0] || event.originalEvent[namespace + 'ignore']) return;

			self.activate(this);
		}

		/**
   * Click on page button handler.
   *
   * @param {Event} event
   *
   * @return {Void}
   */
		function activatePageHandler() {
			/*jshint validthis:true */
			// Accept only events from direct pages bar children.
			if (this.parentNode === $pb[0]) {
				self.activatePage($pages.index(this));
			}
		}

		/**
   * Pause on hover handler.
   *
   * @param  {Event} event
   *
   * @return {Void}
   */
		function pauseOnHoverHandler(event) {
			if (o.pauseOnHover) {
				self[event.type === 'mouseenter' ? 'pause' : 'resume'](2);
			}
		}

		/**
   * Trigger callbacks for event.
   *
   * @param  {String} name Event name.
   * @param  {Mixed}  argX Arguments passed to callbacks.
   *
   * @return {Void}
   */
		function trigger(name, arg1) {
			if (callbacks[name]) {
				l = callbacks[name].length;
				// Callbacks will be stored and executed from a temporary array to not
				// break the execution queue when one of the callbacks unbinds itself.
				tmpArray.length = 0;
				for (i = 0; i < l; i++) {
					tmpArray.push(callbacks[name][i]);
				}
				// Execute the callbacks
				for (i = 0; i < l; i++) {
					tmpArray[i].call(self, name, arg1);
				}
			}
		}

		/**
   * Destroys instance and everything it created.
   *
   * @return {Void}
   */
		self.destroy = function () {
			// Remove the reference to itself
			Sly.removeInstance(frame);

			// Unbind all events
			$scrollSource.add($handle).add($sb).add($pb).add($forwardButton).add($backwardButton).add($prevButton).add($nextButton).add($prevPageButton).add($nextPageButton).off('.' + namespace);

			// Unbinding specifically as to not nuke out other instances
			$doc.off('keydown', keyboardHandler);

			// Remove classes
			$prevButton.add($nextButton).add($prevPageButton).add($nextPageButton).removeClass(o.disabledClass);

			if ($items && rel.activeItem != null) {
				$items.eq(rel.activeItem).removeClass(o.activeClass);
			}

			// Remove page items
			$pb.empty();

			if (!parallax) {
				// Unbind events from frame
				$frame.off('.' + namespace);
				// Restore original styles
				frameStyles.restore();
				slideeStyles.restore();
				sbStyles.restore();
				handleStyles.restore();
				// Remove the instance from element data storage
				$.removeData(frame, namespace);
			}

			// Clean up collections
			items.length = pages.length = 0;
			last = {};

			// Reset initialized status and return the instance
			self.initialized = 0;
			return self;
		};

		/**
   * Initialize.
   *
   * @return {Object}
   */
		self.init = function () {
			if (self.initialized) {
				return;
			}

			// Disallow multiple instances on the same element
			if (Sly.getInstance(frame)) throw new Error('There is already a Sly instance on this element');

			// Store the reference to itself
			Sly.storeInstance(frame, self);

			// Register callbacks map
			self.on(callbackMap);

			// Save styles
			var holderProps = ['overflow', 'position'];
			var movableProps = ['position', 'webkitTransform', 'msTransform', 'transform', 'left', 'top', 'width', 'height'];
			frameStyles.save.apply(frameStyles, holderProps);
			sbStyles.save.apply(sbStyles, holderProps);
			slideeStyles.save.apply(slideeStyles, movableProps);
			handleStyles.save.apply(handleStyles, movableProps);

			// Set required styles
			var $movables = $handle;
			if (!parallax) {
				$movables = $movables.add($slidee);
				$frame.css('overflow', 'hidden');
				if (!transform && $frame.css('position') === 'static') {
					$frame.css('position', 'relative');
				}
			}
			if (transform) {
				if (gpuAcceleration) {
					$movables.css(transform, gpuAcceleration);
				}
			} else {
				if ($sb.css('position') === 'static') {
					$sb.css('position', 'relative');
				}
				$movables.css({ position: 'absolute' });
			}

			// Navigation buttons
			if (o.forward) {
				$forwardButton.on(mouseDownEvent, buttonsHandler);
			}
			if (o.backward) {
				$backwardButton.on(mouseDownEvent, buttonsHandler);
			}
			if (o.prev) {
				$prevButton.on(clickEvent, buttonsHandler);
			}
			if (o.next) {
				$nextButton.on(clickEvent, buttonsHandler);
			}
			if (o.prevPage) {
				$prevPageButton.on(clickEvent, buttonsHandler);
			}
			if (o.nextPage) {
				$nextPageButton.on(clickEvent, buttonsHandler);
			}

			// Scrolling navigation
			$scrollSource.on(wheelEvent, scrollHandler);

			// Clicking on scrollbar navigation
			if ($sb[0]) {
				$sb.on(clickEvent, scrollbarHandler);
			}

			// Click on items navigation
			if (itemNav && o.activateOn) {
				$frame.on(o.activateOn + '.' + namespace, '*', activateHandler);
			}

			// Pages navigation
			if ($pb[0] && o.activatePageOn) {
				$pb.on(o.activatePageOn + '.' + namespace, '*', activatePageHandler);
			}

			// Dragging navigation
			$dragSource.on(dragInitEvents, { source: 'slidee' }, dragInit);

			// Scrollbar dragging navigation
			if ($handle) {
				$handle.on(dragInitEvents, { source: 'handle' }, dragInit);
			}

			// Keyboard navigation
			$doc.on('keydown', keyboardHandler);

			if (!parallax) {
				// Pause on hover
				$frame.on('mouseenter.' + namespace + ' mouseleave.' + namespace, pauseOnHoverHandler);
				// Reset native FRAME element scroll
				$frame.on('scroll.' + namespace, resetScroll);
			}

			// Mark instance as initialized
			self.initialized = 1;

			// Load
			load(true);

			// Initiate automatic cycling
			if (o.cycleBy && !parallax) {
				self[o.startPaused ? 'pause' : 'resume']();
			}

			// Return instance
			return self;
		};
	}

	Sly.getInstance = function (element) {
		return $.data(element, namespace);
	};

	Sly.storeInstance = function (element, sly) {
		return $.data(element, namespace, sly);
	};

	Sly.removeInstance = function (element) {
		return $.removeData(element, namespace);
	};

	/**
  * Return type of the value.
  *
  * @param  {Mixed} value
  *
  * @return {String}
  */
	function type(value) {
		if (value == null) {
			return String(value);
		}

		if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function') {
			return Object.prototype.toString.call(value).match(/\s([a-z]+)/i)[1].toLowerCase() || 'object';
		}

		return typeof value === 'undefined' ? 'undefined' : _typeof(value);
	}

	/**
  * Event preventDefault & stopPropagation helper.
  *
  * @param {Event} event     Event object.
  * @param {Bool}  noBubbles Cancel event bubbling.
  *
  * @return {Void}
  */
	function stopDefault(event, noBubbles) {
		event.preventDefault();
		if (noBubbles) {
			event.stopPropagation();
		}
	}

	/**
  * Disables an event it was triggered on and unbinds itself.
  *
  * @param  {Event} event
  *
  * @return {Void}
  */
	function disableOneEvent(event) {
		/*jshint validthis:true */
		stopDefault(event, 1);
		$(this).off(event.type, disableOneEvent);
	}

	/**
  * Resets native element scroll values to 0.
  *
  * @return {Void}
  */
	function resetScroll() {
		/*jshint validthis:true */
		this.scrollLeft = 0;
		this.scrollTop = 0;
	}

	/**
  * Check if variable is a number.
  *
  * @param {Mixed} value
  *
  * @return {Boolean}
  */
	function isNumber(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	}

	/**
  * Parse style to pixels.
  *
  * @param {Object}   $item    jQuery object with element.
  * @param {Property} property CSS property to get the pixels from.
  *
  * @return {Int}
  */
	function getPx($item, property) {
		return 0 | round(String($item.css(property)).replace(/[^\-0-9.]/g, ''));
	}

	/**
  * Make sure that number is within the limits.
  *
  * @param {Number} number
  * @param {Number} min
  * @param {Number} max
  *
  * @return {Number}
  */
	function within(number, min, max) {
		return number < min ? min : number > max ? max : number;
	}

	/**
  * Saves element styles for later restoration.
  *
  * Example:
  *   var styles = new StyleRestorer(frame);
  *   styles.save('position');
  *   element.style.position = 'absolute';
  *   styles.restore(); // restores to state before the assignment above
  *
  * @param {Element} element
  */
	function StyleRestorer(element) {
		var self = {};
		self.style = {};
		self.save = function () {
			if (!element || !element.nodeType) return;
			for (var i = 0; i < arguments.length; i++) {
				self.style[arguments[i]] = element.style[arguments[i]];
			}
			return self;
		};
		self.restore = function () {
			if (!element || !element.nodeType) return;
			for (var prop in self.style) {
				if (self.style.hasOwnProperty(prop)) element.style[prop] = self.style[prop];
			}
			return self;
		};
		return self;
	}

	// Local WindowAnimationTiming interface polyfill
	(function (w) {
		rAF = w.requestAnimationFrame || w.webkitRequestAnimationFrame || fallback;

		/**
  * Fallback implementation.
  */
		var prev = new Date().getTime();
		function fallback(fn) {
			var curr = new Date().getTime();
			var ms = Math.max(0, 16 - (curr - prev));
			var req = setTimeout(fn, ms);
			prev = curr;
			return req;
		}

		/**
  * Cancel.
  */
		var cancel = w.cancelAnimationFrame || w.webkitCancelAnimationFrame || w.clearTimeout;

		cAF = function cAF(id) {
			cancel.call(w, id);
		};
	})(window);

	// Feature detects
	(function () {
		var prefixes = ['', 'Webkit', 'Moz', 'ms', 'O'];
		var el = document.createElement('div');

		function testProp(prop) {
			for (var p = 0, pl = prefixes.length; p < pl; p++) {
				var prefixedProp = prefixes[p] ? prefixes[p] + prop.charAt(0).toUpperCase() + prop.slice(1) : prop;
				if (el.style[prefixedProp] != null) {
					return prefixedProp;
				}
			}
		}

		// Global support indicators
		transform = testProp('transform');
		gpuAcceleration = testProp('perspective') ? 'translateZ(0) ' : '';
	})();

	// Expose class globally
	w[className] = Sly;

	// jQuery proxy
	$.fn[pluginName] = function (options, callbackMap) {
		var method, methodArgs;

		// Attributes logic
		if (!$.isPlainObject(options)) {
			if (type(options) === 'string' || options === false) {
				method = options === false ? 'destroy' : options;
				methodArgs = Array.prototype.slice.call(arguments, 1);
			}
			options = {};
		}

		// Apply to all elements
		return this.each(function (i, element) {
			// Call with prevention against multiple instantiations
			var plugin = Sly.getInstance(element);

			if (!plugin && !method) {
				// Create a new object if it doesn't exist yet
				plugin = new Sly(element, options, callbackMap).init();
			} else if (plugin && method) {
				// Call method
				if (plugin[method]) {
					plugin[method].apply(plugin, methodArgs);
				}
			}
		});
	};

	// Default options
	Sly.defaults = {
		slidee: null, // Selector, DOM element, or jQuery object with DOM element representing SLIDEE.
		horizontal: false, // Switch to horizontal mode.

		// Item based navigation
		itemNav: null, // Item navigation type. Can be: 'basic', 'centered', 'forceCentered'.
		itemSelector: null, // Select only items that match this selector.
		smart: false, // Repositions the activated item to help with further navigation.
		activateOn: null, // Activate an item on this event. Can be: 'click', 'mouseenter', ...
		activateMiddle: false, // Always activate the item in the middle of the FRAME. forceCentered only.

		// Scrolling
		scrollSource: null, // Element for catching the mouse wheel scrolling. Default is FRAME.
		scrollBy: 0, // Pixels or items to move per one mouse scroll. 0 to disable scrolling.
		scrollHijack: 300, // Milliseconds since last wheel event after which it is acceptable to hijack global scroll.
		scrollTrap: false, // Don't bubble scrolling when hitting scrolling limits.

		// Dragging
		dragSource: null, // Selector or DOM element for catching dragging events. Default is FRAME.
		mouseDragging: false, // Enable navigation by dragging the SLIDEE with mouse cursor.
		touchDragging: false, // Enable navigation by dragging the SLIDEE with touch events.
		releaseSwing: false, // Ease out on dragging swing release.
		swingSpeed: 0.2, // Swing synchronization speed, where: 1 = instant, 0 = infinite.
		elasticBounds: false, // Stretch SLIDEE position limits when dragging past FRAME boundaries.
		dragThreshold: 3, // Distance in pixels before Sly recognizes dragging.
		interactive: null, // Selector for special interactive elements.

		// Scrollbar
		scrollBar: null, // Selector or DOM element for scrollbar container.
		dragHandle: false, // Whether the scrollbar handle should be draggable.
		dynamicHandle: false, // Scrollbar handle represents the ratio between hidden and visible content.
		minHandleSize: 50, // Minimal height or width (depends on sly direction) of a handle in pixels.
		clickBar: false, // Enable navigation by clicking on scrollbar.
		syncSpeed: 0.5, // Handle => SLIDEE synchronization speed, where: 1 = instant, 0 = infinite.

		// Pagesbar
		pagesBar: null, // Selector or DOM element for pages bar container.
		activatePageOn: null, // Event used to activate page. Can be: click, mouseenter, ...
		pageBuilder: // Page item generator.
		function pageBuilder(index) {
			return '<li>' + (index + 1) + '</li>';
		},

		// Navigation buttons
		forward: null, // Selector or DOM element for "forward movement" button.
		backward: null, // Selector or DOM element for "backward movement" button.
		prev: null, // Selector or DOM element for "previous item" button.
		next: null, // Selector or DOM element for "next item" button.
		prevPage: null, // Selector or DOM element for "previous page" button.
		nextPage: null, // Selector or DOM element for "next page" button.

		// Automated cycling
		cycleBy: null, // Enable automatic cycling by 'items' or 'pages'.
		cycleInterval: 5000, // Delay between cycles in milliseconds.
		pauseOnHover: false, // Pause cycling when mouse hovers over the FRAME.
		startPaused: false, // Whether to start in paused sate.

		// Mixed options
		moveBy: 300, // Speed in pixels per second used by forward and backward buttons.
		speed: 0, // Animations speed in milliseconds. 0 to disable animations.
		easing: 'swing', // Easing for duration based (tweening) animations.
		startAt: null, // Starting offset in pixels or items.
		keyboardNavBy: null, // Enable keyboard navigation by 'items' or 'pages'.

		// Classes
		draggedClass: 'dragged', // Class for dragged elements (like SLIDEE or scrollbar handle).
		activeClass: 'active', // Class for active items and pages.
		disabledClass: 'disabled' // Class for disabled navigation elements.
	};
})(jQuery, window);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODZkMjUyYzgzNGUyZmM3ZDIyMjAiLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL2Fzc2V0cy9qcy9zbHkuanMiXSwibmFtZXMiOlsiJCIsInciLCJ1bmRlZmluZWQiLCJwbHVnaW5OYW1lIiwiY2xhc3NOYW1lIiwibmFtZXNwYWNlIiwiY0FGIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyQUYiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ0cmFuc2Zvcm0iLCJncHVBY2NlbGVyYXRpb24iLCIkZG9jIiwiZG9jdW1lbnQiLCJkcmFnSW5pdEV2ZW50cyIsImRyYWdNb3VzZUV2ZW50cyIsImRyYWdUb3VjaEV2ZW50cyIsIndoZWVsRXZlbnQiLCJpbXBsZW1lbnRhdGlvbiIsImhhc0ZlYXR1cmUiLCJjbGlja0V2ZW50IiwibW91c2VEb3duRXZlbnQiLCJpbnRlcmFjdGl2ZUVsZW1lbnRzIiwidG1wQXJyYXkiLCJ0aW1lIiwiYWJzIiwiTWF0aCIsInNxcnQiLCJwb3ciLCJyb3VuZCIsIm1heCIsIm1pbiIsImxhc3RHbG9iYWxXaGVlbCIsIm9uIiwiZXZlbnQiLCJzbHkiLCJvcmlnaW5hbEV2ZW50IiwiRGF0ZSIsIm9wdGlvbnMiLCJzY3JvbGxIaWphY2siLCJTbHkiLCJmcmFtZSIsImNhbGxiYWNrTWFwIiwibyIsImV4dGVuZCIsImRlZmF1bHRzIiwic2VsZiIsInBhcmFsbGF4IiwiaXNOdW1iZXIiLCIkZnJhbWUiLCIkc2xpZGVlIiwic2xpZGVlIiwiZXEiLCJjaGlsZHJlbiIsImZyYW1lU2l6ZSIsInNsaWRlZVNpemUiLCJwb3MiLCJzdGFydCIsImNlbnRlciIsImVuZCIsImN1ciIsImRlc3QiLCIkc2IiLCJzY3JvbGxCYXIiLCIkaGFuZGxlIiwic2JTaXplIiwiaGFuZGxlU2l6ZSIsImhQb3MiLCIkcGIiLCJwYWdlc0JhciIsIiRwYWdlcyIsInBhZ2VzIiwiJGl0ZW1zIiwiaXRlbXMiLCJyZWwiLCJmaXJzdEl0ZW0iLCJsYXN0SXRlbSIsImNlbnRlckl0ZW0iLCJhY3RpdmVJdGVtIiwiYWN0aXZlUGFnZSIsImZyYW1lU3R5bGVzIiwiU3R5bGVSZXN0b3JlciIsInNsaWRlZVN0eWxlcyIsInNiU3R5bGVzIiwiaGFuZGxlU3R5bGVzIiwiYmFzaWNOYXYiLCJpdGVtTmF2IiwiZm9yY2VDZW50ZXJlZE5hdiIsImNlbnRlcmVkTmF2IiwiJHNjcm9sbFNvdXJjZSIsInNjcm9sbFNvdXJjZSIsIiRkcmFnU291cmNlIiwiZHJhZ1NvdXJjZSIsIiRmb3J3YXJkQnV0dG9uIiwiZm9yd2FyZCIsIiRiYWNrd2FyZEJ1dHRvbiIsImJhY2t3YXJkIiwiJHByZXZCdXR0b24iLCJwcmV2IiwiJG5leHRCdXR0b24iLCJuZXh0IiwiJHByZXZQYWdlQnV0dG9uIiwicHJldlBhZ2UiLCIkbmV4dFBhZ2VCdXR0b24iLCJuZXh0UGFnZSIsImNhbGxiYWNrcyIsImxhc3QiLCJhbmltYXRpb24iLCJtb3ZlIiwiZHJhZ2dpbmciLCJyZWxlYXNlZCIsInNjcm9sbGluZyIsImRlbHRhIiwicmVzZXRUaW1lIiwicmVuZGVySUQiLCJoaXN0b3J5SUQiLCJjeWNsZUlEIiwiY29udGludW91c0lEIiwiaSIsImwiLCJpbml0aWFsaXplZCIsImlzUGF1c2VkIiwibG9hZCIsImlzSW5pdCIsImxhc3RJdGVtc0NvdW50IiwibGFzdFBhZ2VzQ291bnQiLCJsZW5ndGgiLCJvbGQiLCJob3Jpem9udGFsIiwiaXRlbVNlbGVjdG9yIiwicGFkZGluZ1N0YXJ0IiwiZ2V0UHgiLCJwYWRkaW5nRW5kIiwiYm9yZGVyQm94IiwiY3NzIiwiYXJlRmxvYXRlZCIsImlnbm9yZWRNYXJnaW4iLCJsYXN0SXRlbUluZGV4IiwiZWFjaCIsImVsZW1lbnQiLCIkaXRlbSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJpdGVtU2l6ZSIsIndpZHRoIiwicmlnaHQiLCJsZWZ0IiwiaGVpZ2h0IiwiYm90dG9tIiwidG9wIiwiaXRlbU1hcmdpblN0YXJ0IiwiaXRlbU1hcmdpbkVuZCIsIml0ZW1TaXplRnVsbCIsInNpbmdsZVNwYWNlZCIsIml0ZW0iLCJlbCIsInNpemUiLCJoYWxmIiwicHVzaCIsInN0eWxlIiwidXBkYXRlUmVsYXRpdmVzIiwiZHluYW1pY0hhbmRsZSIsIndpdGhpbiIsIm1pbkhhbmRsZVNpemUiLCJzeW5jU2Nyb2xsYmFyIiwidGVtcFBhZ2VQb3MiLCJwYWdlc0h0bWwiLCJwYWdlQnVpbGRlciIsImNhbGwiLCJodG1sIiwiYWRkQ2xhc3MiLCJhY3RpdmVDbGFzcyIsInN0YXJ0QXQiLCJhY3RpdmF0ZSIsInNsaWRlVG8iLCJ0cmlnZ2VyIiwicmVsb2FkIiwibmV3UG9zIiwiaW1tZWRpYXRlIiwiZG9udEFsaWduIiwidGVtcFJlbCIsImdldFJlbGF0aXZlcyIsImlzTm90Qm9yZGVyaW5nIiwiYWN0aXZhdGVNaWRkbGUiLCJpbml0IiwiZWxhc3RpY0JvdW5kcyIsImZyb20iLCJ0byIsInR3ZWVzaW5nIiwidHdlZXNlIiwic3BlZWQiLCJyZW5kZXIiLCJyZXNldEN5Y2xlIiwidXBkYXRlQnV0dG9uc1N0YXRlIiwic3luY1BhZ2VzYmFyIiwidHdlZXNlRGVsdGEiLCJzd2luZ1NwZWVkIiwic3luY1NwZWVkIiwiZWFzaW5nIiwicGFnZSIsInJlbW92ZUNsYXNzIiwiZ2V0UG9zIiwiaW5kZXgiLCJnZXRJbmRleCIsImZpbmQiLCJvZmZzZXQiLCJtb3ZlQnkiLCJsYXN0VGltZSIsInN0YXJ0UG9zIiwiY29udGludW91c0luaXQiLCJtb3ZlTG9vcCIsInN0b3AiLCJub3ciLCJzb3VyY2UiLCJhY3RpdmF0ZVBhZ2UiLCJzbGlkZUJ5Iiwic2Nyb2xsQnkiLCJsb2NhdGlvbiIsInR5cGUiLCJpdGVtUG9zIiwidG9TdGFydCIsInRvRW5kIiwidG9DZW50ZXIiLCJnZXRSZWxhdGl2ZUluZGV4IiwiZm9yY2UiLCJhY3RpdmUiLCJzbWFydCIsInNsaWRlZVBvcyIsInJlbGF0aXZlcyIsImNlbnRlck9mZnNldCIsInAiLCJwbCIsImZpcnN0IiwiaWwiLCJpc1N0YXJ0IiwiaXNFbmQiLCJzbGlkZWVQb3NTdGF0ZSIsImlzIiwicHJvcCIsImFkZCIsImRpc2FibGVkQ2xhc3MiLCJmd2Rid2RTdGF0ZSIsImlzRmlyc3QiLCJpc0xhc3QiLCJpdGVtc0J1dHRvblN0YXRlIiwicmVzdW1lIiwicHJpb3JpdHkiLCJjeWNsZUJ5IiwiY3ljbGVJbnRlcnZhbCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJwYXVzZSIsInRvZ2dsZSIsInNldCIsIm5hbWUiLCJ2YWx1ZSIsImlzUGxhaW5PYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsIiRlbGVtZW50IiwiYXBwZW5kVG8iLCJpbnNlcnRCZWZvcmUiLCJhcHBlbmQiLCJyZW1vdmUiLCJyZWFjdGl2YXRlIiwibW92ZUl0ZW0iLCJwb3NpdGlvbiIsImFmdGVyIiwic2hpZnRTdGFydCIsInNoaWZ0RW5kIiwic2hpZnRzVXAiLCJtb3ZlQWZ0ZXIiLCJtb3ZlQmVmb3JlIiwiZm4iLCJrZXkiLCJuYW1lcyIsInNwbGl0IiwibiIsIm5sIiwiY2FsbGJhY2tJbmRleCIsImYiLCJmbCIsIm9uZSIsInByb3h5IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJvZmYiLCJBcnJheSIsInNwbGljZSIsImhhbmRsZVRvU2xpZGVlIiwiaGFuZGxlUG9zIiwiZHJhZ2dpbmdIaXN0b3J5VGljayIsImhpc3RvcnkiLCJkcmFnSW5pdCIsImlzVG91Y2giLCJkYXRhIiwiaXNTbGlkZWUiLCJpc0ludGVyYWN0aXZlIiwidGFyZ2V0IiwiZHJhZ0hhbmRsZSIsInRvdWNoRHJhZ2dpbmciLCJtb3VzZURyYWdnaW5nIiwid2hpY2giLCJzdG9wRGVmYXVsdCIsIiRzb3VyY2UiLCJ0b3VjaCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiaW5pdFgiLCJwYWdlWCIsImluaXRZIiwicGFnZVkiLCJpbml0UG9zIiwicGF0aCIsImxvY2tlZCIsInBhdGhUb0xvY2siLCJkcmFnSGFuZGxlciIsImRyYWdnZWRDbGFzcyIsInNldEludGVydmFsIiwicGF0aFgiLCJwYXRoWSIsImRyYWdUaHJlc2hvbGQiLCJkcmFnRW5kIiwiZGlzYWJsZU9uZUV2ZW50IiwicmVsZWFzZVN3aW5nIiwic3dpbmciLCJjbGVhckludGVydmFsIiwiaW5BcnJheSIsIm5vZGVOYW1lIiwiaW50ZXJhY3RpdmUiLCJtb3ZlbWVudFJlbGVhc2VIYW5kbGVyIiwiYnV0dG9uc0hhbmRsZXIiLCJub3JtYWxpemVXaGVlbERlbHRhIiwiY3VyRGVsdGEiLCJkZWx0YVkiLCJkZWx0YVgiLCJ3aGVlbERlbHRhIiwiZGVsdGFNb2RlIiwiZmluYWxEZWx0YSIsInNjcm9sbEhhbmRsZXIiLCJ3aW5kb3ciLCJzY3JvbGxUcmFwIiwic2Nyb2xsYmFySGFuZGxlciIsImNsaWNrQmFyIiwia2V5Ym9hcmRIYW5kbGVyIiwia2V5Ym9hcmROYXZCeSIsImFjdGl2YXRlSGFuZGxlciIsInBhcmVudE5vZGUiLCJhY3RpdmF0ZVBhZ2VIYW5kbGVyIiwicGF1c2VPbkhvdmVySGFuZGxlciIsInBhdXNlT25Ib3ZlciIsImFyZzEiLCJkZXN0cm95IiwicmVtb3ZlSW5zdGFuY2UiLCJlbXB0eSIsInJlc3RvcmUiLCJyZW1vdmVEYXRhIiwiZ2V0SW5zdGFuY2UiLCJFcnJvciIsInN0b3JlSW5zdGFuY2UiLCJob2xkZXJQcm9wcyIsIm1vdmFibGVQcm9wcyIsInNhdmUiLCIkbW92YWJsZXMiLCJhY3RpdmF0ZU9uIiwiYWN0aXZhdGVQYWdlT24iLCJyZXNldFNjcm9sbCIsInN0YXJ0UGF1c2VkIiwiU3RyaW5nIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwibm9CdWJibGVzIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJzY3JvbGxMZWZ0Iiwic2Nyb2xsVG9wIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJwcm9wZXJ0eSIsInJlcGxhY2UiLCJudW1iZXIiLCJub2RlVHlwZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZhbGxiYWNrIiwiZ2V0VGltZSIsImN1cnIiLCJtcyIsInJlcSIsImNhbmNlbCIsIndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIiwiaWQiLCJwcmVmaXhlcyIsImNyZWF0ZUVsZW1lbnQiLCJ0ZXN0UHJvcCIsInByZWZpeGVkUHJvcCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJtZXRob2QiLCJtZXRob2RBcmdzIiwicGx1Z2luIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdEQTs7Ozs7Ozs7QUFRQSxDQUFFLFdBQVVBLENBQVYsRUFBYUMsQ0FBYixFQUFnQkMsU0FBaEIsRUFBMkI7QUFDNUI7O0FBRUEsS0FBSUMsYUFBYSxLQUFqQjtBQUNBLEtBQUlDLFlBQWEsS0FBakI7QUFDQSxLQUFJQyxZQUFhRixVQUFqQjs7QUFFQTtBQUNBLEtBQUlHLE1BQU1MLEVBQUVNLG9CQUFGLElBQTBCTixFQUFFTywyQkFBdEM7QUFDQSxLQUFJQyxNQUFNUixFQUFFUyxxQkFBWjs7QUFFQTtBQUNBLEtBQUlDLFNBQUosRUFBZUMsZUFBZjs7QUFFQTtBQUNBLEtBQUlDLE9BQU9iLEVBQUVjLFFBQUYsQ0FBWDtBQUNBLEtBQUlDLGlCQUFpQixnQkFBZ0JWLFNBQWhCLEdBQTRCLGFBQTVCLEdBQTRD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aEssVUFBZSxHQTFERCxFQTBEVTtBQUN4QmhCLFNBQWUsQ0EzREQsRUEyRFU7QUFDeEJRLFVBQWUsT0E1REQsRUE0RFU7QUFDeEIxQixXQUFlLElBN0RELEVBNkRVO0FBQ3hCNEssaUJBQWUsSUE5REQsRUE4RFU7O0FBRXhCO0FBQ0E1QixnQkFBZSxTQWpFRCxFQWlFWTtBQUMxQmpKLGVBQWUsUUFsRUQsRUFrRVk7QUFDMUJxRSxpQkFBZSxVQW5FRCxDQW1FWTtBQW5FWixFQUFmO0FBcUVBLENBenBFQyxFQXlwRUFvSyxNQXpwRUEsRUF5cEVRakUsTUF6cEVSLENBQUQsQyIsImZpbGUiOiIvanMvc2x5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDg2ZDI1MmM4MzRlMmZjN2QyMjIwIiwiLyohXG4gKiBzbHkgMS42LjEgLSA4dGggQXVnIDIwMTVcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJzYWluL3NseVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqL1xuXG47KGZ1bmN0aW9uICgkLCB3LCB1bmRlZmluZWQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBwbHVnaW5OYW1lID0gJ3NseSc7XG5cdHZhciBjbGFzc05hbWUgID0gJ1NseSc7XG5cdHZhciBuYW1lc3BhY2UgID0gcGx1Z2luTmFtZTtcblxuXHQvLyBMb2NhbCBXaW5kb3dBbmltYXRpb25UaW1pbmcgaW50ZXJmYWNlXG5cdHZhciBjQUYgPSB3LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHcuY2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHR2YXIgckFGID0gdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cblx0Ly8gU3VwcG9ydCBpbmRpY2F0b3JzXG5cdHZhciB0cmFuc2Zvcm0sIGdwdUFjY2VsZXJhdGlvbjtcblxuXHQvLyBPdGhlciBnbG9iYWwgdmFsdWVzXG5cdHZhciAkZG9jID0gJChkb2N1bWVudCk7XG5cdHZhciBkcmFnSW5pdEV2ZW50cyA9ICd0b3VjaHN0YXJ0LicgKyBuYW1lc3BhY2UgKyAnIG1vdXNlZG93bi4nICsgbmFtZXNwYWNlO1xuXHR2YXIgZHJhZ01vdXNlRXZlbnRzID0gJ21vdXNlbW92ZS4nICsgbmFtZXNwYWNlICsgJyBtb3VzZXVwLicgKyBuYW1lc3BhY2U7XG5cdHZhciBkcmFnVG91Y2hFdmVudHMgPSAndG91Y2htb3ZlLicgKyBuYW1lc3BhY2UgKyAnIHRvdWNoZW5kLicgKyBuYW1lc3BhY2U7XG5cdHZhciB3aGVlbEV2ZW50ID0gKGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoJ0V2ZW50LndoZWVsJywgJzMuMCcpID8gJ3doZWVsLicgOiAnbW91c2V3aGVlbC4nKSArIG5hbWVzcGFjZTtcblx0dmFyIGNsaWNrRXZlbnQgPSAnY2xpY2suJyArIG5hbWVzcGFjZTtcblx0dmFyIG1vdXNlRG93bkV2ZW50ID0gJ21vdXNlZG93bi4nICsgbmFtZXNwYWNlO1xuXHR2YXIgaW50ZXJhY3RpdmVFbGVtZW50cyA9IFsnSU5QVVQnLCAnU0VMRUNUJywgJ0JVVFRPTicsICdURVhUQVJFQSddO1xuXHR2YXIgdG1wQXJyYXkgPSBbXTtcblx0dmFyIHRpbWU7XG5cblx0Ly8gTWF0aCBzaG9ydGhhbmRzXG5cdHZhciBhYnMgPSBNYXRoLmFicztcblx0dmFyIHNxcnQgPSBNYXRoLnNxcnQ7XG5cdHZhciBwb3cgPSBNYXRoLnBvdztcblx0dmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcblx0dmFyIG1heCA9IE1hdGgubWF4O1xuXHR2YXIgbWluID0gTWF0aC5taW47XG5cblx0Ly8gS2VlcCB0cmFjayBvZiBsYXN0IGZpcmVkIGdsb2JhbCB3aGVlbCBldmVudFxuXHR2YXIgbGFzdEdsb2JhbFdoZWVsID0gMDtcblx0JGRvYy5vbih3aGVlbEV2ZW50LCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHR2YXIgc2x5ID0gZXZlbnQub3JpZ2luYWxFdmVudFtuYW1lc3BhY2VdO1xuXHRcdHZhciB0aW1lID0gK25ldyBEYXRlKCk7XG5cdFx0Ly8gVXBkYXRlIGxhc3QgZ2xvYmFsIHdoZWVsIHRpbWUsIGJ1dCBvbmx5IHdoZW4gZXZlbnQgZGlkbid0IG9yaWdpbmF0ZVxuXHRcdC8vIGluIFNseSBmcmFtZSwgb3IgdGhlIG9yaWdpbiB3YXMgbGVzcyB0aGFuIHNjcm9sbEhpamFjayB0aW1lIGFnb1xuXHRcdGlmICghc2x5IHx8IHNseS5vcHRpb25zLnNjcm9sbEhpamFjayA8IHRpbWUgLSBsYXN0R2xvYmFsV2hlZWwpIGxhc3RHbG9iYWxXaGVlbCA9IHRpbWU7XG5cdH0pO1xuXG5cdC8qKlxuXHQgKiBTbHkuXG5cdCAqXG5cdCAqIEBjbGFzc1xuXHQgKlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGZyYW1lICAgICAgIERPTSBlbGVtZW50IG9mIHNseSBjb250YWluZXIuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSAgb3B0aW9ucyAgICAgT2JqZWN0IHdpdGggb3B0aW9ucy5cblx0ICogQHBhcmFtIHtPYmplY3R9ICBjYWxsYmFja01hcCBDYWxsYmFja3MgbWFwLlxuXHQgKi9cblx0ZnVuY3Rpb24gU2x5KGZyYW1lLCBvcHRpb25zLCBjYWxsYmFja01hcCkge1xuXHRcdGlmICghKHRoaXMgaW5zdGFuY2VvZiBTbHkpKSByZXR1cm4gbmV3IFNseShmcmFtZSwgb3B0aW9ucywgY2FsbGJhY2tNYXApO1xuXG5cdFx0Ly8gRXh0ZW5kIG9wdGlvbnNcblx0XHR2YXIgbyA9ICQuZXh0ZW5kKHt9LCBTbHkuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG5cdFx0Ly8gUHJpdmF0ZSB2YXJpYWJsZXNcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIHBhcmFsbGF4ID0gaXNOdW1iZXIoZnJhbWUpO1xuXG5cdFx0Ly8gRnJhbWVcblx0XHR2YXIgJGZyYW1lID0gJChmcmFtZSk7XG5cdFx0dmFyICRzbGlkZWUgPSBvLnNsaWRlZSA/ICQoby5zbGlkZWUpLmVxKDApIDogJGZyYW1lLmNoaWxkcmVuKCkuZXEoMCk7XG5cdFx0dmFyIGZyYW1lU2l6ZSA9IDA7XG5cdFx0dmFyIHNsaWRlZVNpemUgPSAwO1xuXHRcdHZhciBwb3MgPSB7XG5cdFx0XHRzdGFydDogMCxcblx0XHRcdGNlbnRlcjogMCxcblx0XHRcdGVuZDogMCxcblx0XHRcdGN1cjogMCxcblx0XHRcdGRlc3Q6IDBcblx0XHR9O1xuXG5cdFx0Ly8gU2Nyb2xsYmFyXG5cdFx0dmFyICRzYiA9ICQoby5zY3JvbGxCYXIpLmVxKDApO1xuXHRcdHZhciAkaGFuZGxlID0gJHNiLmNoaWxkcmVuKCkuZXEoMCk7XG5cdFx0dmFyIHNiU2l6ZSA9IDA7XG5cdFx0dmFyIGhhbmRsZVNpemUgPSAwO1xuXHRcdHZhciBoUG9zID0ge1xuXHRcdFx0c3RhcnQ6IDAsXG5cdFx0XHRlbmQ6IDAsXG5cdFx0XHRjdXI6IDBcblx0XHR9O1xuXG5cdFx0Ly8gUGFnZXNiYXJcblx0XHR2YXIgJHBiID0gJChvLnBhZ2VzQmFyKTtcblx0XHR2YXIgJHBhZ2VzID0gMDtcblx0XHR2YXIgcGFnZXMgPSBbXTtcblxuXHRcdC8vIEl0ZW1zXG5cdFx0dmFyICRpdGVtcyA9IDA7XG5cdFx0dmFyIGl0ZW1zID0gW107XG5cdFx0dmFyIHJlbCA9IHtcblx0XHRcdGZpcnN0SXRlbTogMCxcblx0XHRcdGxhc3RJdGVtOiAwLFxuXHRcdFx0Y2VudGVySXRlbTogMCxcblx0XHRcdGFjdGl2ZUl0ZW06IG51bGwsXG5cdFx0XHRhY3RpdmVQYWdlOiAwXG5cdFx0fTtcblxuXHRcdC8vIFN0eWxlc1xuXHRcdHZhciBmcmFtZVN0eWxlcyA9IG5ldyBTdHlsZVJlc3RvcmVyKCRmcmFtZVswXSk7XG5cdFx0dmFyIHNsaWRlZVN0eWxlcyA9IG5ldyBTdHlsZVJlc3RvcmVyKCRzbGlkZWVbMF0pO1xuXHRcdHZhciBzYlN0eWxlcyA9IG5ldyBTdHlsZVJlc3RvcmVyKCRzYlswXSk7XG5cdFx0dmFyIGhhbmRsZVN0eWxlcyA9IG5ldyBTdHlsZVJlc3RvcmVyKCRoYW5kbGVbMF0pO1xuXG5cdFx0Ly8gTmF2aWdhdGlvbiB0eXBlIGJvb2xlYW5zXG5cdFx0dmFyIGJhc2ljTmF2ID0gby5pdGVtTmF2ID09PSAnYmFzaWMnO1xuXHRcdHZhciBmb3JjZUNlbnRlcmVkTmF2ID0gby5pdGVtTmF2ID09PSAnZm9yY2VDZW50ZXJlZCc7XG5cdFx0dmFyIGNlbnRlcmVkTmF2ID0gby5pdGVtTmF2ID09PSAnY2VudGVyZWQnIHx8IGZvcmNlQ2VudGVyZWROYXY7XG5cdFx0dmFyIGl0ZW1OYXYgPSAhcGFyYWxsYXggJiYgKGJhc2ljTmF2IHx8IGNlbnRlcmVkTmF2IHx8IGZvcmNlQ2VudGVyZWROYXYpO1xuXG5cdFx0Ly8gTWlzY2VsbGFuZW91c1xuXHRcdHZhciAkc2Nyb2xsU291cmNlID0gby5zY3JvbGxTb3VyY2UgPyAkKG8uc2Nyb2xsU291cmNlKSA6ICRmcmFtZTtcblx0XHR2YXIgJGRyYWdTb3VyY2UgPSBvLmRyYWdTb3VyY2UgPyAkKG8uZHJhZ1NvdXJjZSkgOiAkZnJhbWU7XG5cdFx0dmFyICRmb3J3YXJkQnV0dG9uID0gJChvLmZvcndhcmQpO1xuXHRcdHZhciAkYmFja3dhcmRCdXR0b24gPSAkKG8uYmFja3dhcmQpO1xuXHRcdHZhciAkcHJldkJ1dHRvbiA9ICQoby5wcmV2KTtcblx0XHR2YXIgJG5leHRCdXR0b24gPSAkKG8ubmV4dCk7XG5cdFx0dmFyICRwcmV2UGFnZUJ1dHRvbiA9ICQoby5wcmV2UGFnZSk7XG5cdFx0dmFyICRuZXh0UGFnZUJ1dHRvbiA9ICQoby5uZXh0UGFnZSk7XG5cdFx0dmFyIGNhbGxiYWNrcyA9IHt9O1xuXHRcdHZhciBsYXN0ID0ge307XG5cdFx0dmFyIGFuaW1hdGlvbiA9IHt9O1xuXHRcdHZhciBtb3ZlID0ge307XG5cdFx0dmFyIGRyYWdnaW5nID0ge1xuXHRcdFx0cmVsZWFzZWQ6IDFcblx0XHR9O1xuXHRcdHZhciBzY3JvbGxpbmcgPSB7XG5cdFx0XHRsYXN0OiAwLFxuXHRcdFx0ZGVsdGE6IDAsXG5cdFx0XHRyZXNldFRpbWU6IDIwMFxuXHRcdH07XG5cdFx0dmFyIHJlbmRlcklEID0gMDtcblx0XHR2YXIgaGlzdG9yeUlEID0gMDtcblx0XHR2YXIgY3ljbGVJRCA9IDA7XG5cdFx0dmFyIGNvbnRpbnVvdXNJRCA9IDA7XG5cdFx0dmFyIGksIGw7XG5cblx0XHQvLyBOb3JtYWxpemluZyBmcmFtZVxuXHRcdGlmICghcGFyYWxsYXgpIHtcblx0XHRcdGZyYW1lID0gJGZyYW1lWzBdO1xuXHRcdH1cblxuXHRcdC8vIEV4cG9zZSBwcm9wZXJ0aWVzXG5cdFx0c2VsZi5pbml0aWFsaXplZCA9IDA7XG5cdFx0c2VsZi5mcmFtZSA9IGZyYW1lO1xuXHRcdHNlbGYuc2xpZGVlID0gJHNsaWRlZVswXTtcblx0XHRzZWxmLnBvcyA9IHBvcztcblx0XHRzZWxmLnJlbCA9IHJlbDtcblx0XHRzZWxmLml0ZW1zID0gaXRlbXM7XG5cdFx0c2VsZi5wYWdlcyA9IHBhZ2VzO1xuXHRcdHNlbGYuaXNQYXVzZWQgPSAwO1xuXHRcdHNlbGYub3B0aW9ucyA9IG87XG5cdFx0c2VsZi5kcmFnZ2luZyA9IGRyYWdnaW5nO1xuXG5cdFx0LyoqXG5cdFx0ICogTG9hZGluZyBmdW5jdGlvbi5cblx0XHQgKlxuXHRcdCAqIFBvcHVsYXRlIGFycmF5cywgc2V0IHNpemVzLCBiaW5kIGV2ZW50cywgLi4uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtpc0luaXRdIFdoZXRoZXIgbG9hZCBpcyBjYWxsZWQgZnJvbSB3aXRoaW4gc2VsZi5pbml0KCkuXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBsb2FkKGlzSW5pdCkge1xuXHRcdFx0Ly8gTG9jYWwgdmFyaWFibGVzXG5cdFx0XHR2YXIgbGFzdEl0ZW1zQ291bnQgPSAwO1xuXHRcdFx0dmFyIGxhc3RQYWdlc0NvdW50ID0gcGFnZXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBTYXZlIG9sZCBwb3NpdGlvblxuXHRcdFx0cG9zLm9sZCA9ICQuZXh0ZW5kKHt9LCBwb3MpO1xuXG5cdFx0XHQvLyBSZXNldCBnbG9iYWwgdmFyaWFibGVzXG5cdFx0XHRmcmFtZVNpemUgPSBwYXJhbGxheCA/IDAgOiAkZnJhbWVbby5ob3Jpem9udGFsID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSgpO1xuXHRcdFx0c2JTaXplID0gJHNiW28uaG9yaXpvbnRhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0J10oKTtcblx0XHRcdHNsaWRlZVNpemUgPSBwYXJhbGxheCA/IGZyYW1lIDogJHNsaWRlZVtvLmhvcml6b250YWwgPyAnb3V0ZXJXaWR0aCcgOiAnb3V0ZXJIZWlnaHQnXSgpO1xuXHRcdFx0cGFnZXMubGVuZ3RoID0gMDtcblxuXHRcdFx0Ly8gU2V0IHBvc2l0aW9uIGxpbWl0cyAmIHJlbGF0aXZlc1xuXHRcdFx0cG9zLnN0YXJ0ID0gMDtcblx0XHRcdHBvcy5lbmQgPSBtYXgoc2xpZGVlU2l6ZSAtIGZyYW1lU2l6ZSwgMCk7XG5cblx0XHRcdC8vIFNpemVzICYgb2Zmc2V0cyBmb3IgaXRlbSBiYXNlZCBuYXZpZ2F0aW9uc1xuXHRcdFx0aWYgKGl0ZW1OYXYpIHtcblx0XHRcdFx0Ly8gU2F2ZSB0aGUgbnVtYmVyIG9mIGN1cnJlbnQgaXRlbXNcblx0XHRcdFx0bGFzdEl0ZW1zQ291bnQgPSBpdGVtcy5sZW5ndGg7XG5cblx0XHRcdFx0Ly8gUmVzZXQgaXRlbU5hdiByZWxhdGVkIHZhcmlhYmxlc1xuXHRcdFx0XHQkaXRlbXMgPSAkc2xpZGVlLmNoaWxkcmVuKG8uaXRlbVNlbGVjdG9yKTtcblx0XHRcdFx0aXRlbXMubGVuZ3RoID0gMDtcblxuXHRcdFx0XHQvLyBOZWVkZWQgdmFyaWFibGVzXG5cdFx0XHRcdHZhciBwYWRkaW5nU3RhcnQgPSBnZXRQeCgkc2xpZGVlLCBvLmhvcml6b250YWwgPyAncGFkZGluZ0xlZnQnIDogJ3BhZGRpbmdUb3AnKTtcblx0XHRcdFx0dmFyIHBhZGRpbmdFbmQgPSBnZXRQeCgkc2xpZGVlLCBvLmhvcml6b250YWwgPyAncGFkZGluZ1JpZ2h0JyA6ICdwYWRkaW5nQm90dG9tJyk7XG5cdFx0XHRcdHZhciBib3JkZXJCb3ggPSAkKCRpdGVtcykuY3NzKCdib3hTaXppbmcnKSA9PT0gJ2JvcmRlci1ib3gnO1xuXHRcdFx0XHR2YXIgYXJlRmxvYXRlZCA9ICRpdGVtcy5jc3MoJ2Zsb2F0JykgIT09ICdub25lJztcblx0XHRcdFx0dmFyIGlnbm9yZWRNYXJnaW4gPSAwO1xuXHRcdFx0XHR2YXIgbGFzdEl0ZW1JbmRleCA9ICRpdGVtcy5sZW5ndGggLSAxO1xuXHRcdFx0XHR2YXIgbGFzdEl0ZW07XG5cblx0XHRcdFx0Ly8gUmVzZXQgc2xpZGVlU2l6ZVxuXHRcdFx0XHRzbGlkZWVTaXplID0gMDtcblxuXHRcdFx0XHQvLyBJdGVyYXRlIHRocm91Z2ggaXRlbXNcblx0XHRcdFx0JGl0ZW1zLmVhY2goZnVuY3Rpb24gKGksIGVsZW1lbnQpIHtcblx0XHRcdFx0XHQvLyBJdGVtXG5cdFx0XHRcdFx0dmFyICRpdGVtID0gJChlbGVtZW50KTtcblx0XHRcdFx0XHR2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdFx0dmFyIGl0ZW1TaXplID0gcm91bmQoby5ob3Jpem9udGFsID8gcmVjdC53aWR0aCB8fCByZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0IDogcmVjdC5oZWlnaHQgfHwgcmVjdC5ib3R0b20gLSByZWN0LnRvcCk7XG5cdFx0XHRcdFx0dmFyIGl0ZW1NYXJnaW5TdGFydCA9IGdldFB4KCRpdGVtLCBvLmhvcml6b250YWwgPyAnbWFyZ2luTGVmdCcgOiAnbWFyZ2luVG9wJyk7XG5cdFx0XHRcdFx0dmFyIGl0ZW1NYXJnaW5FbmQgPSBnZXRQeCgkaXRlbSwgby5ob3Jpem9udGFsID8gJ21hcmdpblJpZ2h0JyA6ICdtYXJnaW5Cb3R0b20nKTtcblx0XHRcdFx0XHR2YXIgaXRlbVNpemVGdWxsID0gaXRlbVNpemUgKyBpdGVtTWFyZ2luU3RhcnQgKyBpdGVtTWFyZ2luRW5kO1xuXHRcdFx0XHRcdHZhciBzaW5nbGVTcGFjZWQgPSAhaXRlbU1hcmdpblN0YXJ0IHx8ICFpdGVtTWFyZ2luRW5kO1xuXHRcdFx0XHRcdHZhciBpdGVtID0ge307XG5cdFx0XHRcdFx0aXRlbS5lbCA9IGVsZW1lbnQ7XG5cdFx0XHRcdFx0aXRlbS5zaXplID0gc2luZ2xlU3BhY2VkID8gaXRlbVNpemUgOiBpdGVtU2l6ZUZ1bGw7XG5cdFx0XHRcdFx0aXRlbS5oYWxmID0gaXRlbS5zaXplIC8gMjtcblx0XHRcdFx0XHRpdGVtLnN0YXJ0ID0gc2xpZGVlU2l6ZSArIChzaW5nbGVTcGFjZWQgPyBpdGVtTWFyZ2luU3RhcnQgOiAwKTtcblx0XHRcdFx0XHRpdGVtLmNlbnRlciA9IGl0ZW0uc3RhcnQgLSByb3VuZChmcmFtZVNpemUgLyAyIC0gaXRlbS5zaXplIC8gMik7XG5cdFx0XHRcdFx0aXRlbS5lbmQgPSBpdGVtLnN0YXJ0IC0gZnJhbWVTaXplICsgaXRlbS5zaXplO1xuXG5cdFx0XHRcdFx0Ly8gQWNjb3VudCBmb3Igc2xpZGVlIHBhZGRpbmdcblx0XHRcdFx0XHRpZiAoIWkpIHtcblx0XHRcdFx0XHRcdHNsaWRlZVNpemUgKz0gcGFkZGluZ1N0YXJ0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEluY3JlbWVudCBzbGlkZWUgc2l6ZSBmb3Igc2l6ZSBvZiB0aGUgYWN0aXZlIGVsZW1lbnRcblx0XHRcdFx0XHRzbGlkZWVTaXplICs9IGl0ZW1TaXplRnVsbDtcblxuXHRcdFx0XHRcdC8vIFRyeSB0byBhY2NvdW50IGZvciB2ZXJ0aWNhbCBtYXJnaW4gY29sbGFwc2luZyBpbiB2ZXJ0aWNhbCBtb2RlXG5cdFx0XHRcdFx0Ly8gSXQncyBub3QgYnVsbGV0cHJvb2YsIGJ1dCBzaG91bGQgd29yayBpbiA5OSUgb2YgY2FzZXNcblx0XHRcdFx0XHRpZiAoIW8uaG9yaXpvbnRhbCAmJiAhYXJlRmxvYXRlZCkge1xuXHRcdFx0XHRcdFx0Ly8gU3VidHJhY3Qgc21hbGxlciBtYXJnaW4sIGJ1dCBvbmx5IHdoZW4gdG9wIG1hcmdpbiBpcyBub3QgMCwgYW5kIHRoaXMgaXMgbm90IHRoZSBmaXJzdCBlbGVtZW50XG5cdFx0XHRcdFx0XHRpZiAoaXRlbU1hcmdpbkVuZCAmJiBpdGVtTWFyZ2luU3RhcnQgJiYgaSA+IDApIHtcblx0XHRcdFx0XHRcdFx0c2xpZGVlU2l6ZSAtPSBtaW4oaXRlbU1hcmdpblN0YXJ0LCBpdGVtTWFyZ2luRW5kKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBUaGluZ3MgdG8gYmUgZG9uZSBvbiBsYXN0IGl0ZW1cblx0XHRcdFx0XHRpZiAoaSA9PT0gbGFzdEl0ZW1JbmRleCkge1xuXHRcdFx0XHRcdFx0aXRlbS5lbmQgKz0gcGFkZGluZ0VuZDtcblx0XHRcdFx0XHRcdHNsaWRlZVNpemUgKz0gcGFkZGluZ0VuZDtcblx0XHRcdFx0XHRcdGlnbm9yZWRNYXJnaW4gPSBzaW5nbGVTcGFjZWQgPyBpdGVtTWFyZ2luRW5kIDogMDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBBZGQgaXRlbSBvYmplY3QgdG8gaXRlbXMgYXJyYXlcblx0XHRcdFx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdGxhc3RJdGVtID0gaXRlbTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gUmVzaXplIFNMSURFRSB0byBmaXQgYWxsIGl0ZW1zXG5cdFx0XHRcdCRzbGlkZWVbMF0uc3R5bGVbby5ob3Jpem9udGFsID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSA9IChib3JkZXJCb3ggPyBzbGlkZWVTaXplOiBzbGlkZWVTaXplIC0gcGFkZGluZ1N0YXJ0IC0gcGFkZGluZ0VuZCkgKyAncHgnO1xuXG5cdFx0XHRcdC8vIEFkanVzdCBpbnRlcm5hbCBTTElERUUgc2l6ZSBmb3IgbGFzdCBtYXJnaW5cblx0XHRcdFx0c2xpZGVlU2l6ZSAtPSBpZ25vcmVkTWFyZ2luO1xuXG5cdFx0XHRcdC8vIFNldCBsaW1pdHNcblx0XHRcdFx0aWYgKGl0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRcdHBvcy5zdGFydCA9ICBpdGVtc1swXVtmb3JjZUNlbnRlcmVkTmF2ID8gJ2NlbnRlcicgOiAnc3RhcnQnXTtcblx0XHRcdFx0XHRwb3MuZW5kID0gZm9yY2VDZW50ZXJlZE5hdiA/IGxhc3RJdGVtLmNlbnRlciA6IGZyYW1lU2l6ZSA8IHNsaWRlZVNpemUgPyBsYXN0SXRlbS5lbmQgOiBwb3Muc3RhcnQ7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cG9zLnN0YXJ0ID0gcG9zLmVuZCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2FsY3VsYXRlIFNMSURFRSBjZW50ZXIgcG9zaXRpb25cblx0XHRcdHBvcy5jZW50ZXIgPSByb3VuZChwb3MuZW5kIC8gMiArIHBvcy5zdGFydCAvIDIpO1xuXG5cdFx0XHQvLyBVcGRhdGUgcmVsYXRpdmUgcG9zaXRpb25zXG5cdFx0XHR1cGRhdGVSZWxhdGl2ZXMoKTtcblxuXHRcdFx0Ly8gU2Nyb2xsYmFyXG5cdFx0XHRpZiAoJGhhbmRsZS5sZW5ndGggJiYgc2JTaXplID4gMCkge1xuXHRcdFx0XHQvLyBTdHJldGNoIHNjcm9sbGJhciBoYW5kbGUgdG8gcmVwcmVzZW50IHRoZSB2aXNpYmxlIGFyZWFcblx0XHRcdFx0aWYgKG8uZHluYW1pY0hhbmRsZSkge1xuXHRcdFx0XHRcdGhhbmRsZVNpemUgPSBwb3Muc3RhcnQgPT09IHBvcy5lbmQgPyBzYlNpemUgOiByb3VuZChzYlNpemUgKiBmcmFtZVNpemUgLyBzbGlkZWVTaXplKTtcblx0XHRcdFx0XHRoYW5kbGVTaXplID0gd2l0aGluKGhhbmRsZVNpemUsIG8ubWluSGFuZGxlU2l6ZSwgc2JTaXplKTtcblx0XHRcdFx0XHQkaGFuZGxlWzBdLnN0eWxlW28uaG9yaXpvbnRhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0J10gPSBoYW5kbGVTaXplICsgJ3B4Jztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRoYW5kbGVTaXplID0gJGhhbmRsZVtvLmhvcml6b250YWwgPyAnb3V0ZXJXaWR0aCcgOiAnb3V0ZXJIZWlnaHQnXSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aFBvcy5lbmQgPSBzYlNpemUgLSBoYW5kbGVTaXplO1xuXG5cdFx0XHRcdGlmICghcmVuZGVySUQpIHtcblx0XHRcdFx0XHRzeW5jU2Nyb2xsYmFyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUGFnZXNcblx0XHRcdGlmICghcGFyYWxsYXggJiYgZnJhbWVTaXplID4gMCkge1xuXHRcdFx0XHR2YXIgdGVtcFBhZ2VQb3MgPSBwb3Muc3RhcnQ7XG5cdFx0XHRcdHZhciBwYWdlc0h0bWwgPSAnJztcblxuXHRcdFx0XHQvLyBQb3B1bGF0ZSBwYWdlcyBhcnJheVxuXHRcdFx0XHRpZiAoaXRlbU5hdikge1xuXHRcdFx0XHRcdCQuZWFjaChpdGVtcywgZnVuY3Rpb24gKGksIGl0ZW0pIHtcblx0XHRcdFx0XHRcdGlmIChmb3JjZUNlbnRlcmVkTmF2KSB7XG5cdFx0XHRcdFx0XHRcdHBhZ2VzLnB1c2goaXRlbS5jZW50ZXIpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChpdGVtLnN0YXJ0ICsgaXRlbS5zaXplID4gdGVtcFBhZ2VQb3MgJiYgdGVtcFBhZ2VQb3MgPD0gcG9zLmVuZCkge1xuXHRcdFx0XHRcdFx0XHR0ZW1wUGFnZVBvcyA9IGl0ZW0uc3RhcnQ7XG5cdFx0XHRcdFx0XHRcdHBhZ2VzLnB1c2godGVtcFBhZ2VQb3MpO1xuXHRcdFx0XHRcdFx0XHR0ZW1wUGFnZVBvcyArPSBmcmFtZVNpemU7XG5cdFx0XHRcdFx0XHRcdGlmICh0ZW1wUGFnZVBvcyA+IHBvcy5lbmQgJiYgdGVtcFBhZ2VQb3MgPCBwb3MuZW5kICsgZnJhbWVTaXplKSB7XG5cdFx0XHRcdFx0XHRcdFx0cGFnZXMucHVzaChwb3MuZW5kKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdoaWxlICh0ZW1wUGFnZVBvcyAtIGZyYW1lU2l6ZSA8IHBvcy5lbmQpIHtcblx0XHRcdFx0XHRcdHBhZ2VzLnB1c2godGVtcFBhZ2VQb3MpO1xuXHRcdFx0XHRcdFx0dGVtcFBhZ2VQb3MgKz0gZnJhbWVTaXplO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFBhZ2VzIGJhclxuXHRcdFx0XHRpZiAoJHBiWzBdICYmIGxhc3RQYWdlc0NvdW50ICE9PSBwYWdlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRwYWdlc0h0bWwgKz0gby5wYWdlQnVpbGRlci5jYWxsKHNlbGYsIGkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkcGFnZXMgPSAkcGIuaHRtbChwYWdlc0h0bWwpLmNoaWxkcmVuKCk7XG5cdFx0XHRcdFx0JHBhZ2VzLmVxKHJlbC5hY3RpdmVQYWdlKS5hZGRDbGFzcyhvLmFjdGl2ZUNsYXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBFeHRlbmQgcmVsYXRpdmUgdmFyaWFibGVzIG9iamVjdCB3aXRoIHNvbWUgdXNlZnVsIGluZm9cblx0XHRcdHJlbC5zbGlkZWVTaXplID0gc2xpZGVlU2l6ZTtcblx0XHRcdHJlbC5mcmFtZVNpemUgPSBmcmFtZVNpemU7XG5cdFx0XHRyZWwuc2JTaXplID0gc2JTaXplO1xuXHRcdFx0cmVsLmhhbmRsZVNpemUgPSBoYW5kbGVTaXplO1xuXG5cdFx0XHQvLyBBY3RpdmF0ZSByZXF1ZXN0ZWQgcG9zaXRpb25cblx0XHRcdGlmIChpdGVtTmF2KSB7XG5cdFx0XHRcdGlmIChpc0luaXQgJiYgby5zdGFydEF0ICE9IG51bGwpIHtcblx0XHRcdFx0XHRhY3RpdmF0ZShvLnN0YXJ0QXQpO1xuXHRcdFx0XHRcdHNlbGZbY2VudGVyZWROYXYgPyAndG9DZW50ZXInIDogJ3RvU3RhcnQnXShvLnN0YXJ0QXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEZpeCBwb3NzaWJsZSBvdmVyZmxvd2luZ1xuXHRcdFx0XHR2YXIgYWN0aXZlSXRlbSA9IGl0ZW1zW3JlbC5hY3RpdmVJdGVtXTtcblx0XHRcdFx0c2xpZGVUbyhjZW50ZXJlZE5hdiAmJiBhY3RpdmVJdGVtID8gYWN0aXZlSXRlbS5jZW50ZXIgOiB3aXRoaW4ocG9zLmRlc3QsIHBvcy5zdGFydCwgcG9zLmVuZCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKGlzSW5pdCkge1xuXHRcdFx0XHRcdGlmIChvLnN0YXJ0QXQgIT0gbnVsbCkgc2xpZGVUbyhvLnN0YXJ0QXQsIDEpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEZpeCBwb3NzaWJsZSBvdmVyZmxvd2luZ1xuXHRcdFx0XHRcdHNsaWRlVG8od2l0aGluKHBvcy5kZXN0LCBwb3Muc3RhcnQsIHBvcy5lbmQpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmlnZ2VyIGxvYWQgZXZlbnRcblx0XHRcdHRyaWdnZXIoJ2xvYWQnKTtcblx0XHR9XG5cdFx0c2VsZi5yZWxvYWQgPSBmdW5jdGlvbiAoKSB7IGxvYWQoKTsgfTtcblxuXHRcdC8qKlxuXHRcdCAqIEFuaW1hdGUgdG8gYSBwb3NpdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7SW50fSAgbmV3UG9zICAgIE5ldyBwb3NpdGlvbi5cblx0XHQgKiBAcGFyYW0ge0Jvb2x9IGltbWVkaWF0ZSBSZXBvc2l0aW9uIGltbWVkaWF0ZWx5IHdpdGhvdXQgYW4gYW5pbWF0aW9uLlxuXHRcdCAqIEBwYXJhbSB7Qm9vbH0gZG9udEFsaWduIERvIG5vdCBhbGlnbiBpdGVtcywgdXNlIHRoZSByYXcgcG9zaXRpb24gcGFzc2VkIGluIGZpcnN0IGFyZ3VtZW50LlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBzbGlkZVRvKG5ld1BvcywgaW1tZWRpYXRlLCBkb250QWxpZ24pIHtcblx0XHRcdC8vIEFsaWduIGl0ZW1zXG5cdFx0XHRpZiAoaXRlbU5hdiAmJiBkcmFnZ2luZy5yZWxlYXNlZCAmJiAhZG9udEFsaWduKSB7XG5cdFx0XHRcdHZhciB0ZW1wUmVsID0gZ2V0UmVsYXRpdmVzKG5ld1Bvcyk7XG5cdFx0XHRcdHZhciBpc05vdEJvcmRlcmluZyA9IG5ld1BvcyA+IHBvcy5zdGFydCAmJiBuZXdQb3MgPCBwb3MuZW5kO1xuXG5cdFx0XHRcdGlmIChjZW50ZXJlZE5hdikge1xuXHRcdFx0XHRcdGlmIChpc05vdEJvcmRlcmluZykge1xuXHRcdFx0XHRcdFx0bmV3UG9zID0gaXRlbXNbdGVtcFJlbC5jZW50ZXJJdGVtXS5jZW50ZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChmb3JjZUNlbnRlcmVkTmF2ICYmIG8uYWN0aXZhdGVNaWRkbGUpIHtcblx0XHRcdFx0XHRcdGFjdGl2YXRlKHRlbXBSZWwuY2VudGVySXRlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKGlzTm90Qm9yZGVyaW5nKSB7XG5cdFx0XHRcdFx0bmV3UG9zID0gaXRlbXNbdGVtcFJlbC5maXJzdEl0ZW1dLnN0YXJ0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEhhbmRsZSBvdmVyZmxvd2luZyBwb3NpdGlvbiBsaW1pdHNcblx0XHRcdGlmIChkcmFnZ2luZy5pbml0ICYmIGRyYWdnaW5nLnNsaWRlZSAmJiBvLmVsYXN0aWNCb3VuZHMpIHtcblx0XHRcdFx0aWYgKG5ld1BvcyA+IHBvcy5lbmQpIHtcblx0XHRcdFx0XHRuZXdQb3MgPSBwb3MuZW5kICsgKG5ld1BvcyAtIHBvcy5lbmQpIC8gNjtcblx0XHRcdFx0fSBlbHNlIGlmIChuZXdQb3MgPCBwb3Muc3RhcnQpIHtcblx0XHRcdFx0XHRuZXdQb3MgPSBwb3Muc3RhcnQgKyAobmV3UG9zIC0gcG9zLnN0YXJ0KSAvIDY7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5ld1BvcyA9IHdpdGhpbihuZXdQb3MsIHBvcy5zdGFydCwgcG9zLmVuZCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFVwZGF0ZSB0aGUgYW5pbWF0aW9uIG9iamVjdFxuXHRcdFx0YW5pbWF0aW9uLnN0YXJ0ID0gK25ldyBEYXRlKCk7XG5cdFx0XHRhbmltYXRpb24udGltZSA9IDA7XG5cdFx0XHRhbmltYXRpb24uZnJvbSA9IHBvcy5jdXI7XG5cdFx0XHRhbmltYXRpb24udG8gPSBuZXdQb3M7XG5cdFx0XHRhbmltYXRpb24uZGVsdGEgPSBuZXdQb3MgLSBwb3MuY3VyO1xuXHRcdFx0YW5pbWF0aW9uLnR3ZWVzaW5nID0gZHJhZ2dpbmcudHdlZXNlIHx8IGRyYWdnaW5nLmluaXQgJiYgIWRyYWdnaW5nLnNsaWRlZTtcblx0XHRcdGFuaW1hdGlvbi5pbW1lZGlhdGUgPSAhYW5pbWF0aW9uLnR3ZWVzaW5nICYmIChpbW1lZGlhdGUgfHwgZHJhZ2dpbmcuaW5pdCAmJiBkcmFnZ2luZy5zbGlkZWUgfHwgIW8uc3BlZWQpO1xuXG5cdFx0XHQvLyBSZXNldCBkcmFnZ2luZyB0d2Vlc2luZyByZXF1ZXN0XG5cdFx0XHRkcmFnZ2luZy50d2Vlc2UgPSAwO1xuXG5cdFx0XHQvLyBTdGFydCBhbmltYXRpb24gcmVuZGVyaW5nXG5cdFx0XHRpZiAobmV3UG9zICE9PSBwb3MuZGVzdCkge1xuXHRcdFx0XHRwb3MuZGVzdCA9IG5ld1Bvcztcblx0XHRcdFx0dHJpZ2dlcignY2hhbmdlJyk7XG5cdFx0XHRcdGlmICghcmVuZGVySUQpIHtcblx0XHRcdFx0XHRyZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXNldCBuZXh0IGN5Y2xlIHRpbWVvdXRcblx0XHRcdHJlc2V0Q3ljbGUoKTtcblxuXHRcdFx0Ly8gU3luY2hyb25pemUgc3RhdGVzXG5cdFx0XHR1cGRhdGVSZWxhdGl2ZXMoKTtcblx0XHRcdHVwZGF0ZUJ1dHRvbnNTdGF0ZSgpO1xuXHRcdFx0c3luY1BhZ2VzYmFyKCk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogUmVuZGVyIGFuaW1hdGlvbiBmcmFtZS5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdFx0aWYgKCFzZWxmLmluaXRpYWxpemVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgZmlyc3QgcmVuZGVyIGNhbGwsIHdhaXQgZm9yIG5leHQgYW5pbWF0aW9uRnJhbWVcblx0XHRcdGlmICghcmVuZGVySUQpIHtcblx0XHRcdFx0cmVuZGVySUQgPSByQUYocmVuZGVyKTtcblx0XHRcdFx0aWYgKGRyYWdnaW5nLnJlbGVhc2VkKSB7XG5cdFx0XHRcdFx0dHJpZ2dlcignbW92ZVN0YXJ0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBpbW1lZGlhdGUgcmVwb3NpdGlvbmluZyBpcyByZXF1ZXN0ZWQsIGRvbid0IGFuaW1hdGUuXG5cdFx0XHRpZiAoYW5pbWF0aW9uLmltbWVkaWF0ZSkge1xuXHRcdFx0XHRwb3MuY3VyID0gYW5pbWF0aW9uLnRvO1xuXHRcdFx0fVxuXHRcdFx0Ly8gVXNlIHR3ZWVzaW5nIGZvciBhbmltYXRpb25zIHdpdGhvdXQga25vd24gZW5kIHBvaW50XG5cdFx0XHRlbHNlIGlmIChhbmltYXRpb24udHdlZXNpbmcpIHtcblx0XHRcdFx0YW5pbWF0aW9uLnR3ZWVzZURlbHRhID0gYW5pbWF0aW9uLnRvIC0gcG9zLmN1cjtcblx0XHRcdFx0Ly8gRnVjayBaZW5vJ3MgcGFyYWRveFxuXHRcdFx0XHRpZiAoYWJzKGFuaW1hdGlvbi50d2Vlc2VEZWx0YSkgPCAwLjEpIHtcblx0XHRcdFx0XHRwb3MuY3VyID0gYW5pbWF0aW9uLnRvO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBvcy5jdXIgKz0gYW5pbWF0aW9uLnR3ZWVzZURlbHRhICogKGRyYWdnaW5nLnJlbGVhc2VkID8gby5zd2luZ1NwZWVkIDogby5zeW5jU3BlZWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBVc2UgdHdlZW5pbmcgZm9yIGJhc2ljIGFuaW1hdGlvbnMgd2l0aCBrbm93biBlbmQgcG9pbnRcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRhbmltYXRpb24udGltZSA9IG1pbigrbmV3IERhdGUoKSAtIGFuaW1hdGlvbi5zdGFydCwgby5zcGVlZCk7XG5cdFx0XHRcdHBvcy5jdXIgPSBhbmltYXRpb24uZnJvbSArIGFuaW1hdGlvbi5kZWx0YSAqICQuZWFzaW5nW28uZWFzaW5nXShhbmltYXRpb24udGltZS9vLnNwZWVkLCBhbmltYXRpb24udGltZSwgMCwgMSwgby5zcGVlZCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRoZXJlIGlzIG5vdGhpbmcgbW9yZSB0byByZW5kZXIgYnJlYWsgdGhlIHJlbmRlcmluZyBsb29wLCBvdGhlcndpc2UgcmVxdWVzdCBuZXcgYW5pbWF0aW9uIGZyYW1lLlxuXHRcdFx0aWYgKGFuaW1hdGlvbi50byA9PT0gcG9zLmN1cikge1xuXHRcdFx0XHRwb3MuY3VyID0gYW5pbWF0aW9uLnRvO1xuXHRcdFx0XHRkcmFnZ2luZy50d2Vlc2UgPSByZW5kZXJJRCA9IDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZW5kZXJJRCA9IHJBRihyZW5kZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHR0cmlnZ2VyKCdtb3ZlJyk7XG5cblx0XHRcdC8vIFVwZGF0ZSBTTElERUUgcG9zaXRpb25cblx0XHRcdGlmICghcGFyYWxsYXgpIHtcblx0XHRcdFx0aWYgKHRyYW5zZm9ybSkge1xuXHRcdFx0XHRcdCRzbGlkZWVbMF0uc3R5bGVbdHJhbnNmb3JtXSA9IGdwdUFjY2VsZXJhdGlvbiArIChvLmhvcml6b250YWwgPyAndHJhbnNsYXRlWCcgOiAndHJhbnNsYXRlWScpICsgJygnICsgKC1wb3MuY3VyKSArICdweCknO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzbGlkZWVbMF0uc3R5bGVbby5ob3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCddID0gLXJvdW5kKHBvcy5jdXIpICsgJ3B4Jztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBXaGVuIGFuaW1hdGlvbiByZWFjaGVkIHRoZSBlbmQsIGFuZCBkcmFnZ2luZyBpcyBub3QgYWN0aXZlLCB0cmlnZ2VyIG1vdmVFbmRcblx0XHRcdGlmICghcmVuZGVySUQgJiYgZHJhZ2dpbmcucmVsZWFzZWQpIHtcblx0XHRcdFx0dHJpZ2dlcignbW92ZUVuZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRzeW5jU2Nyb2xsYmFyKCk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogU3luY2hyb25pemVzIHNjcm9sbGJhciB3aXRoIHRoZSBTTElERUUuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHN5bmNTY3JvbGxiYXIoKSB7XG5cdFx0XHRpZiAoJGhhbmRsZS5sZW5ndGgpIHtcblx0XHRcdFx0aFBvcy5jdXIgPSBwb3Muc3RhcnQgPT09IHBvcy5lbmQgPyAwIDogKCgoZHJhZ2dpbmcuaW5pdCAmJiAhZHJhZ2dpbmcuc2xpZGVlKSA/IHBvcy5kZXN0IDogcG9zLmN1cikgLSBwb3Muc3RhcnQpIC8gKHBvcy5lbmQgLSBwb3Muc3RhcnQpICogaFBvcy5lbmQ7XG5cdFx0XHRcdGhQb3MuY3VyID0gd2l0aGluKHJvdW5kKGhQb3MuY3VyKSwgaFBvcy5zdGFydCwgaFBvcy5lbmQpO1xuXHRcdFx0XHRpZiAobGFzdC5oUG9zICE9PSBoUG9zLmN1cikge1xuXHRcdFx0XHRcdGxhc3QuaFBvcyA9IGhQb3MuY3VyO1xuXHRcdFx0XHRcdGlmICh0cmFuc2Zvcm0pIHtcblx0XHRcdFx0XHRcdCRoYW5kbGVbMF0uc3R5bGVbdHJhbnNmb3JtXSA9IGdwdUFjY2VsZXJhdGlvbiArIChvLmhvcml6b250YWwgPyAndHJhbnNsYXRlWCcgOiAndHJhbnNsYXRlWScpICsgJygnICsgaFBvcy5jdXIgKyAncHgpJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JGhhbmRsZVswXS5zdHlsZVtvLmhvcml6b250YWwgPyAnbGVmdCcgOiAndG9wJ10gPSBoUG9zLmN1ciArICdweCc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogU3luY2hyb25pemVzIHBhZ2VzYmFyIHdpdGggU0xJREVFLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBzeW5jUGFnZXNiYXIoKSB7XG5cdFx0XHRpZiAoJHBhZ2VzWzBdICYmIGxhc3QucGFnZSAhPT0gcmVsLmFjdGl2ZVBhZ2UpIHtcblx0XHRcdFx0bGFzdC5wYWdlID0gcmVsLmFjdGl2ZVBhZ2U7XG5cdFx0XHRcdCRwYWdlcy5yZW1vdmVDbGFzcyhvLmFjdGl2ZUNsYXNzKS5lcShyZWwuYWN0aXZlUGFnZSkuYWRkQ2xhc3Moby5hY3RpdmVDbGFzcyk7XG5cdFx0XHRcdHRyaWdnZXIoJ2FjdGl2ZVBhZ2UnLCBsYXN0LnBhZ2UpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgdGhlIHBvc2l0aW9uIG9iamVjdC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGl0ZW1cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdH1cblx0XHQgKi9cblx0XHRzZWxmLmdldFBvcyA9IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRpZiAoaXRlbU5hdikge1xuXHRcdFx0XHR2YXIgaW5kZXggPSBnZXRJbmRleChpdGVtKTtcblx0XHRcdFx0cmV0dXJuIGluZGV4ICE9PSAtMSA/IGl0ZW1zW2luZGV4XSA6IGZhbHNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyICRpdGVtID0gJHNsaWRlZS5maW5kKGl0ZW0pLmVxKDApO1xuXG5cdFx0XHRcdGlmICgkaXRlbVswXSkge1xuXHRcdFx0XHRcdHZhciBvZmZzZXQgPSBvLmhvcml6b250YWwgPyAkaXRlbS5vZmZzZXQoKS5sZWZ0IC0gJHNsaWRlZS5vZmZzZXQoKS5sZWZ0IDogJGl0ZW0ub2Zmc2V0KCkudG9wIC0gJHNsaWRlZS5vZmZzZXQoKS50b3A7XG5cdFx0XHRcdFx0dmFyIHNpemUgPSAkaXRlbVtvLmhvcml6b250YWwgPyAnb3V0ZXJXaWR0aCcgOiAnb3V0ZXJIZWlnaHQnXSgpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHN0YXJ0OiBvZmZzZXQsXG5cdFx0XHRcdFx0XHRjZW50ZXI6IG9mZnNldCAtIGZyYW1lU2l6ZSAvIDIgKyBzaXplIC8gMixcblx0XHRcdFx0XHRcdGVuZDogb2Zmc2V0IC0gZnJhbWVTaXplICsgc2l6ZSxcblx0XHRcdFx0XHRcdHNpemU6IHNpemVcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBDb250aW51b3VzIG1vdmUgaW4gYSBzcGVjaWZpZWQgZGlyZWN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7Qm9vbH0gZm9yd2FyZCBUcnVlIGZvciBmb3J3YXJkIG1vdmVtZW50LCBvdGhlcndpc2UgaXQnbGwgZ28gYmFja3dhcmRzLlxuXHRcdCAqIEBwYXJhbSAge0ludH0gIHNwZWVkICAgTW92ZW1lbnQgc3BlZWQgaW4gcGl4ZWxzIHBlciBmcmFtZS4gT3ZlcnJpZGVzIG9wdGlvbnMubW92ZUJ5IHZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLm1vdmVCeSA9IGZ1bmN0aW9uIChzcGVlZCkge1xuXHRcdFx0bW92ZS5zcGVlZCA9IHNwZWVkO1xuXHRcdFx0Ly8gSWYgYWxyZWFkeSBpbml0aWF0ZWQsIG9yIHRoZXJlIGlzIG5vd2hlcmUgdG8gbW92ZSwgYWJvcnRcblx0XHRcdGlmIChkcmFnZ2luZy5pbml0IHx8ICFtb3ZlLnNwZWVkIHx8IHBvcy5jdXIgPT09IChtb3ZlLnNwZWVkID4gMCA/IHBvcy5lbmQgOiBwb3Muc3RhcnQpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8vIEluaXRpYXRlIG1vdmUgb2JqZWN0XG5cdFx0XHRtb3ZlLmxhc3RUaW1lID0gK25ldyBEYXRlKCk7XG5cdFx0XHRtb3ZlLnN0YXJ0UG9zID0gcG9zLmN1cjtcblx0XHRcdC8vIFNldCBkcmFnZ2luZyBhcyBpbml0aWF0ZWRcblx0XHRcdGNvbnRpbnVvdXNJbml0KCdidXR0b24nKTtcblx0XHRcdGRyYWdnaW5nLmluaXQgPSAxO1xuXHRcdFx0Ly8gU3RhcnQgbW92ZW1lbnRcblx0XHRcdHRyaWdnZXIoJ21vdmVTdGFydCcpO1xuXHRcdFx0Y0FGKGNvbnRpbnVvdXNJRCk7XG5cdFx0XHRtb3ZlTG9vcCgpO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBDb250aW51b3VzIG1vdmVtZW50IGxvb3AuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG1vdmVMb29wKCkge1xuXHRcdFx0Ly8gSWYgdGhlcmUgaXMgbm93aGVyZSB0byBtb3ZlIGFueW1vcmUsIHN0b3Bcblx0XHRcdGlmICghbW92ZS5zcGVlZCB8fCBwb3MuY3VyID09PSAobW92ZS5zcGVlZCA+IDAgPyBwb3MuZW5kIDogcG9zLnN0YXJ0KSkge1xuXHRcdFx0XHRzZWxmLnN0b3AoKTtcblx0XHRcdH1cblx0XHRcdC8vIFJlcXVlc3QgbmV3IG1vdmUgbG9vcCBpZiBpdCBoYXNuJ3QgYmVlbiBzdG9wcGVkXG5cdFx0XHRjb250aW51b3VzSUQgPSBkcmFnZ2luZy5pbml0ID8gckFGKG1vdmVMb29wKSA6IDA7XG5cdFx0XHQvLyBVcGRhdGUgbW92ZSBvYmplY3Rcblx0XHRcdG1vdmUubm93ID0gK25ldyBEYXRlKCk7XG5cdFx0XHRtb3ZlLnBvcyA9IHBvcy5jdXIgKyAobW92ZS5ub3cgLSBtb3ZlLmxhc3RUaW1lKSAvIDEwMDAgKiBtb3ZlLnNwZWVkO1xuXHRcdFx0Ly8gU2xpZGVcblx0XHRcdHNsaWRlVG8oZHJhZ2dpbmcuaW5pdCA/IG1vdmUucG9zIDogcm91bmQobW92ZS5wb3MpKTtcblx0XHRcdC8vIE5vcm1hbGx5LCB0aGlzIGlzIHRyaWdnZXJlZCBpbiByZW5kZXIoKSwgYnV0IGlmIHRoZXJlXG5cdFx0XHQvLyBpcyBub3RoaW5nIHRvIHJlbmRlciwgd2UgaGF2ZSB0byBkbyBpdCBtYW51YWxseSBoZXJlLlxuXHRcdFx0aWYgKCFkcmFnZ2luZy5pbml0ICYmIHBvcy5jdXIgPT09IHBvcy5kZXN0KSB7XG5cdFx0XHRcdHRyaWdnZXIoJ21vdmVFbmQnKTtcblx0XHRcdH1cblx0XHRcdC8vIFVwZGF0ZSB0aW1lcyBmb3IgZnV0dXJlIGl0ZXJhdGlvblxuXHRcdFx0bW92ZS5sYXN0VGltZSA9IG1vdmUubm93O1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFN0b3BzIGNvbnRpbnVvdXMgbW92ZW1lbnQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYuc3RvcCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChkcmFnZ2luZy5zb3VyY2UgPT09ICdidXR0b24nKSB7XG5cdFx0XHRcdGRyYWdnaW5nLmluaXQgPSAwO1xuXHRcdFx0XHRkcmFnZ2luZy5yZWxlYXNlZCA9IDE7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEFjdGl2YXRlIHByZXZpb3VzIGl0ZW0uXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYucHJldiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGYuYWN0aXZhdGUocmVsLmFjdGl2ZUl0ZW0gPT0gbnVsbCA/IDAgOiByZWwuYWN0aXZlSXRlbSAtIDEpO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBBY3RpdmF0ZSBuZXh0IGl0ZW0uXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYubmV4dCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGYuYWN0aXZhdGUocmVsLmFjdGl2ZUl0ZW0gPT0gbnVsbCA/IDAgOiByZWwuYWN0aXZlSXRlbSArIDEpO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBBY3RpdmF0ZSBwcmV2aW91cyBwYWdlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLnByZXZQYWdlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0c2VsZi5hY3RpdmF0ZVBhZ2UocmVsLmFjdGl2ZVBhZ2UgLSAxKTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQWN0aXZhdGUgbmV4dCBwYWdlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLm5leHRQYWdlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0c2VsZi5hY3RpdmF0ZVBhZ2UocmVsLmFjdGl2ZVBhZ2UgKyAxKTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogU2xpZGUgU0xJREVFIGJ5IGFtb3VudCBvZiBwaXhlbHMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0ludH0gIGRlbHRhICAgICBQaXhlbHMvSXRlbXMuIFBvc2l0aXZlIG1lYW5zIGZvcndhcmQsIG5lZ2F0aXZlIG1lYW5zIGJhY2t3YXJkLlxuXHRcdCAqIEBwYXJhbSB7Qm9vbH0gaW1tZWRpYXRlIFJlcG9zaXRpb24gaW1tZWRpYXRlbHkgd2l0aG91dCBhbiBhbmltYXRpb24uXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYuc2xpZGVCeSA9IGZ1bmN0aW9uIChkZWx0YSwgaW1tZWRpYXRlKSB7XG5cdFx0XHRpZiAoIWRlbHRhKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChpdGVtTmF2KSB7XG5cdFx0XHRcdHNlbGZbY2VudGVyZWROYXYgPyAndG9DZW50ZXInIDogJ3RvU3RhcnQnXShcblx0XHRcdFx0XHR3aXRoaW4oKGNlbnRlcmVkTmF2ID8gcmVsLmNlbnRlckl0ZW0gOiByZWwuZmlyc3RJdGVtKSArIG8uc2Nyb2xsQnkgKiBkZWx0YSwgMCwgaXRlbXMubGVuZ3RoKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2xpZGVUbyhwb3MuZGVzdCArIGRlbHRhLCBpbW1lZGlhdGUpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBBbmltYXRlIFNMSURFRSB0byBhIHNwZWNpZmljIHBvc2l0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtJbnR9ICBwb3MgICAgICAgTmV3IHBvc2l0aW9uLlxuXHRcdCAqIEBwYXJhbSB7Qm9vbH0gaW1tZWRpYXRlIFJlcG9zaXRpb24gaW1tZWRpYXRlbHkgd2l0aG91dCBhbiBhbmltYXRpb24uXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYuc2xpZGVUbyA9IGZ1bmN0aW9uIChwb3MsIGltbWVkaWF0ZSkge1xuXHRcdFx0c2xpZGVUbyhwb3MsIGltbWVkaWF0ZSk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIENvcmUgbWV0aG9kIGZvciBoYW5kbGluZyBgdG9Mb2NhdGlvbmAgbWV0aG9kcy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gbG9jYXRpb25cblx0XHQgKiBAcGFyYW0gIHtNaXhlZH0gIGl0ZW1cblx0XHQgKiBAcGFyYW0gIHtCb29sfSAgIGltbWVkaWF0ZVxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiB0byhsb2NhdGlvbiwgaXRlbSwgaW1tZWRpYXRlKSB7XG5cdFx0XHQvLyBPcHRpb25hbCBhcmd1bWVudHMgbG9naWNcblx0XHRcdGlmICh0eXBlKGl0ZW0pID09PSAnYm9vbGVhbicpIHtcblx0XHRcdFx0aW1tZWRpYXRlID0gaXRlbTtcblx0XHRcdFx0aXRlbSA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRzbGlkZVRvKHBvc1tsb2NhdGlvbl0sIGltbWVkaWF0ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBZb3UgY2FuJ3QgYWxpZ24gaXRlbXMgdG8gc2lkZXMgb2YgdGhlIGZyYW1lXG5cdFx0XHRcdC8vIHdoZW4gY2VudGVyZWQgbmF2aWdhdGlvbiB0eXBlIGlzIGVuYWJsZWRcblx0XHRcdFx0aWYgKGNlbnRlcmVkTmF2ICYmIGxvY2F0aW9uICE9PSAnY2VudGVyJykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBpdGVtUG9zID0gc2VsZi5nZXRQb3MoaXRlbSk7XG5cdFx0XHRcdGlmIChpdGVtUG9zKSB7XG5cdFx0XHRcdFx0c2xpZGVUbyhpdGVtUG9zW2xvY2F0aW9uXSwgaW1tZWRpYXRlLCAhY2VudGVyZWROYXYpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQW5pbWF0ZSBlbGVtZW50IG9yIHRoZSB3aG9sZSBTTElERUUgdG8gdGhlIHN0YXJ0IG9mIHRoZSBmcmFtZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGl0ZW0gICAgICBJdGVtIERPTSBlbGVtZW50LCBvciBpbmRleCBzdGFydGluZyBhdCAwLiBPbWl0dGluZyB3aWxsIGFuaW1hdGUgU0xJREVFLlxuXHRcdCAqIEBwYXJhbSB7Qm9vbH0gIGltbWVkaWF0ZSBSZXBvc2l0aW9uIGltbWVkaWF0ZWx5IHdpdGhvdXQgYW4gYW5pbWF0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLnRvU3RhcnQgPSBmdW5jdGlvbiAoaXRlbSwgaW1tZWRpYXRlKSB7XG5cdFx0XHR0bygnc3RhcnQnLCBpdGVtLCBpbW1lZGlhdGUpO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBBbmltYXRlIGVsZW1lbnQgb3IgdGhlIHdob2xlIFNMSURFRSB0byB0aGUgZW5kIG9mIHRoZSBmcmFtZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGl0ZW0gICAgICBJdGVtIERPTSBlbGVtZW50LCBvciBpbmRleCBzdGFydGluZyBhdCAwLiBPbWl0dGluZyB3aWxsIGFuaW1hdGUgU0xJREVFLlxuXHRcdCAqIEBwYXJhbSB7Qm9vbH0gIGltbWVkaWF0ZSBSZXBvc2l0aW9uIGltbWVkaWF0ZWx5IHdpdGhvdXQgYW4gYW5pbWF0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLnRvRW5kID0gZnVuY3Rpb24gKGl0ZW0sIGltbWVkaWF0ZSkge1xuXHRcdFx0dG8oJ2VuZCcsIGl0ZW0sIGltbWVkaWF0ZSk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEFuaW1hdGUgZWxlbWVudCBvciB0aGUgd2hvbGUgU0xJREVFIHRvIHRoZSBjZW50ZXIgb2YgdGhlIGZyYW1lLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtNaXhlZH0gaXRlbSAgICAgIEl0ZW0gRE9NIGVsZW1lbnQsIG9yIGluZGV4IHN0YXJ0aW5nIGF0IDAuIE9taXR0aW5nIHdpbGwgYW5pbWF0ZSBTTElERUUuXG5cdFx0ICogQHBhcmFtIHtCb29sfSAgaW1tZWRpYXRlIFJlcG9zaXRpb24gaW1tZWRpYXRlbHkgd2l0aG91dCBhbiBhbmltYXRpb24uXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYudG9DZW50ZXIgPSBmdW5jdGlvbiAoaXRlbSwgaW1tZWRpYXRlKSB7XG5cdFx0XHR0bygnY2VudGVyJywgaXRlbSwgaW1tZWRpYXRlKTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogR2V0IHRoZSBpbmRleCBvZiBhbiBpdGVtIGluIFNMSURFRS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGl0ZW0gICAgIEl0ZW0gRE9NIGVsZW1lbnQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtJbnR9ICBJdGVtIGluZGV4LCBvciAtMSBpZiBub3QgZm91bmQuXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0SW5kZXgoaXRlbSkge1xuXHRcdFx0cmV0dXJuIGl0ZW0gIT0gbnVsbCA/XG5cdFx0XHRcdFx0aXNOdW1iZXIoaXRlbSkgP1xuXHRcdFx0XHRcdFx0aXRlbSA+PSAwICYmIGl0ZW0gPCBpdGVtcy5sZW5ndGggPyBpdGVtIDogLTEgOlxuXHRcdFx0XHRcdFx0JGl0ZW1zLmluZGV4KGl0ZW0pIDpcblx0XHRcdFx0XHQtMTtcblx0XHR9XG5cdFx0Ly8gRXhwb3NlIGdldEluZGV4IHdpdGhvdXQgbG93ZXJpbmcgdGhlIGNvbXByZXNzaWJpbGl0eSBvZiBpdCxcblx0XHQvLyBhcyBpdCBpcyB1c2VkIHF1aXRlIG9mdGVuIHRocm91Z2hvdXQgU2x5LlxuXHRcdHNlbGYuZ2V0SW5kZXggPSBnZXRJbmRleDtcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBpbmRleCBvZiBhbiBpdGVtIGluIFNMSURFRSBiYXNlZCBvbiBhIHZhcmlldHkgb2YgaW5wdXQgdHlwZXMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIHtNaXhlZH0gaXRlbSBET00gZWxlbWVudCwgcG9zaXRpdmUgb3IgbmVnYXRpdmUgaW50ZWdlci5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge0ludH0gICBJdGVtIGluZGV4LCBvciAtMSBpZiBub3QgZm91bmQuXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0UmVsYXRpdmVJbmRleChpdGVtKSB7XG5cdFx0XHRyZXR1cm4gZ2V0SW5kZXgoaXNOdW1iZXIoaXRlbSkgJiYgaXRlbSA8IDAgPyBpdGVtICsgaXRlbXMubGVuZ3RoIDogaXRlbSk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQWN0aXZhdGVzIGFuIGl0ZW0uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIHtNaXhlZH0gaXRlbSBJdGVtIERPTSBlbGVtZW50LCBvciBpbmRleCBzdGFydGluZyBhdCAwLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7TWl4ZWR9IEFjdGl2YXRlZCBpdGVtIGluZGV4IG9yIGZhbHNlIG9uIGZhaWwuXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gYWN0aXZhdGUoaXRlbSwgZm9yY2UpIHtcblx0XHRcdHZhciBpbmRleCA9IGdldEluZGV4KGl0ZW0pO1xuXG5cdFx0XHRpZiAoIWl0ZW1OYXYgfHwgaW5kZXggPCAwKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVXBkYXRlIGNsYXNzZXMsIGxhc3QgYWN0aXZlIGluZGV4LCBhbmQgdHJpZ2dlciBhY3RpdmUgZXZlbnQgb25seSB3aGVuIHRoZXJlXG5cdFx0XHQvLyBoYXMgYmVlbiBhIGNoYW5nZS4gT3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHRoZSBjdXJyZW50IGFjdGl2ZSBpbmRleC5cblx0XHRcdGlmIChsYXN0LmFjdGl2ZSAhPT0gaW5kZXggfHwgZm9yY2UpIHtcblx0XHRcdFx0Ly8gVXBkYXRlIGNsYXNzZXNcblx0XHRcdFx0JGl0ZW1zLmVxKHJlbC5hY3RpdmVJdGVtKS5yZW1vdmVDbGFzcyhvLmFjdGl2ZUNsYXNzKTtcblx0XHRcdFx0JGl0ZW1zLmVxKGluZGV4KS5hZGRDbGFzcyhvLmFjdGl2ZUNsYXNzKTtcblxuXHRcdFx0XHRsYXN0LmFjdGl2ZSA9IHJlbC5hY3RpdmVJdGVtID0gaW5kZXg7XG5cblx0XHRcdFx0dXBkYXRlQnV0dG9uc1N0YXRlKCk7XG5cdFx0XHRcdHRyaWdnZXIoJ2FjdGl2ZScsIGluZGV4KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGluZGV4O1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEFjdGl2YXRlcyBhbiBpdGVtIGFuZCBoZWxwcyB3aXRoIGZ1cnRoZXIgbmF2aWdhdGlvbiB3aGVuIG8uc21hcnQgaXMgZW5hYmxlZC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGl0ZW0gICAgICBJdGVtIERPTSBlbGVtZW50LCBvciBpbmRleCBzdGFydGluZyBhdCAwLlxuXHRcdCAqIEBwYXJhbSB7Qm9vbH0gIGltbWVkaWF0ZSBXaGV0aGVyIHRvIHJlcG9zaXRpb24gaW1tZWRpYXRlbHkgaW4gc21hcnQgbmF2aWdhdGlvbi5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0c2VsZi5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChpdGVtLCBpbW1lZGlhdGUpIHtcblx0XHRcdHZhciBpbmRleCA9IGFjdGl2YXRlKGl0ZW0pO1xuXG5cdFx0XHQvLyBTbWFydCBuYXZpZ2F0aW9uXG5cdFx0XHRpZiAoby5zbWFydCAmJiBpbmRleCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0Ly8gV2hlbiBjZW50ZXJlZE5hdiBpcyBlbmFibGVkLCBjZW50ZXIgdGhlIGVsZW1lbnQuXG5cdFx0XHRcdC8vIE90aGVyd2lzZSwgZGV0ZXJtaW5lIHdoZXJlIHRvIHBvc2l0aW9uIHRoZSBlbGVtZW50IGJhc2VkIG9uIGl0cyBjdXJyZW50IHBvc2l0aW9uLlxuXHRcdFx0XHQvLyBJZiB0aGUgZWxlbWVudCBpcyBjdXJyZW50bHkgb24gdGhlIGZhciBlbmQgc2lkZSBvZiB0aGUgZnJhbWUsIGFzc3VtZSB0aGF0IHVzZXIgaXNcblx0XHRcdFx0Ly8gbW92aW5nIGZvcndhcmQgYW5kIGFuaW1hdGUgaXQgdG8gdGhlIHN0YXJ0IG9mIHRoZSB2aXNpYmxlIGZyYW1lLCBhbmQgdmljZSB2ZXJzYS5cblx0XHRcdFx0aWYgKGNlbnRlcmVkTmF2KSB7XG5cdFx0XHRcdFx0c2VsZi50b0NlbnRlcihpbmRleCwgaW1tZWRpYXRlKTtcblx0XHRcdFx0fSBlbHNlIGlmIChpbmRleCA+PSByZWwubGFzdEl0ZW0pIHtcblx0XHRcdFx0XHRzZWxmLnRvU3RhcnQoaW5kZXgsIGltbWVkaWF0ZSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaW5kZXggPD0gcmVsLmZpcnN0SXRlbSkge1xuXHRcdFx0XHRcdHNlbGYudG9FbmQoaW5kZXgsIGltbWVkaWF0ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzZXRDeWNsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEFjdGl2YXRlcyBhIHBhZ2UuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0ludH0gIGluZGV4ICAgICBQYWdlIGluZGV4LCBzdGFydGluZyBmcm9tIDAuXG5cdFx0ICogQHBhcmFtIHtCb29sfSBpbW1lZGlhdGUgV2hldGhlciB0byByZXBvc2l0aW9uIGltbWVkaWF0ZWx5IHdpdGhvdXQgYW5pbWF0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLmFjdGl2YXRlUGFnZSA9IGZ1bmN0aW9uIChpbmRleCwgaW1tZWRpYXRlKSB7XG5cdFx0XHRpZiAoaXNOdW1iZXIoaW5kZXgpKSB7XG5cdFx0XHRcdHNsaWRlVG8ocGFnZXNbd2l0aGluKGluZGV4LCAwLCBwYWdlcy5sZW5ndGggLSAxKV0sIGltbWVkaWF0ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFJldHVybiByZWxhdGl2ZSBwb3NpdGlvbnMgb2YgaXRlbXMgYmFzZWQgb24gdGhlaXIgdmlzaWJpbGl0eSB3aXRoaW4gRlJBTUUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0ludH0gc2xpZGVlUG9zIFBvc2l0aW9uIG9mIFNMSURFRS5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0UmVsYXRpdmVzKHNsaWRlZVBvcykge1xuXHRcdFx0c2xpZGVlUG9zID0gd2l0aGluKGlzTnVtYmVyKHNsaWRlZVBvcykgPyBzbGlkZWVQb3MgOiBwb3MuZGVzdCwgcG9zLnN0YXJ0LCBwb3MuZW5kKTtcblxuXHRcdFx0dmFyIHJlbGF0aXZlcyA9IHt9O1xuXHRcdFx0dmFyIGNlbnRlck9mZnNldCA9IGZvcmNlQ2VudGVyZWROYXYgPyAwIDogZnJhbWVTaXplIC8gMjtcblxuXHRcdFx0Ly8gRGV0ZXJtaW5lIGFjdGl2ZSBwYWdlXG5cdFx0XHRpZiAoIXBhcmFsbGF4KSB7XG5cdFx0XHRcdGZvciAodmFyIHAgPSAwLCBwbCA9IHBhZ2VzLmxlbmd0aDsgcCA8IHBsOyBwKyspIHtcblx0XHRcdFx0XHRpZiAoc2xpZGVlUG9zID49IHBvcy5lbmQgfHwgcCA9PT0gcGFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdFx0cmVsYXRpdmVzLmFjdGl2ZVBhZ2UgPSBwYWdlcy5sZW5ndGggLSAxO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHNsaWRlZVBvcyA8PSBwYWdlc1twXSArIGNlbnRlck9mZnNldCkge1xuXHRcdFx0XHRcdFx0cmVsYXRpdmVzLmFjdGl2ZVBhZ2UgPSBwO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlbGF0aXZlIGl0ZW0gaW5kZXhlc1xuXHRcdFx0aWYgKGl0ZW1OYXYpIHtcblx0XHRcdFx0dmFyIGZpcnN0ID0gZmFsc2U7XG5cdFx0XHRcdHZhciBsYXN0ID0gZmFsc2U7XG5cdFx0XHRcdHZhciBjZW50ZXIgPSBmYWxzZTtcblxuXHRcdFx0XHQvLyBGcm9tIHN0YXJ0XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBpbCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0XHQvLyBGaXJzdCBpdGVtXG5cdFx0XHRcdFx0aWYgKGZpcnN0ID09PSBmYWxzZSAmJiBzbGlkZWVQb3MgPD0gaXRlbXNbaV0uc3RhcnQgKyBpdGVtc1tpXS5oYWxmKSB7XG5cdFx0XHRcdFx0XHRmaXJzdCA9IGk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gQ2VudGVyIGl0ZW1cblx0XHRcdFx0XHRpZiAoY2VudGVyID09PSBmYWxzZSAmJiBzbGlkZWVQb3MgPD0gaXRlbXNbaV0uY2VudGVyICsgaXRlbXNbaV0uaGFsZikge1xuXHRcdFx0XHRcdFx0Y2VudGVyID0gaTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBMYXN0IGl0ZW1cblx0XHRcdFx0XHRpZiAoaSA9PT0gaWwgLSAxIHx8IHNsaWRlZVBvcyA8PSBpdGVtc1tpXS5lbmQgKyBpdGVtc1tpXS5oYWxmKSB7XG5cdFx0XHRcdFx0XHRsYXN0ID0gaTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFNhZmUgYXNzaWdubWVudCwganVzdCB0byBiZSBzdXJlIHRoZSBmYWxzZSB3b24ndCBiZSByZXR1cm5lZFxuXHRcdFx0XHRyZWxhdGl2ZXMuZmlyc3RJdGVtID0gaXNOdW1iZXIoZmlyc3QpID8gZmlyc3QgOiAwO1xuXHRcdFx0XHRyZWxhdGl2ZXMuY2VudGVySXRlbSA9IGlzTnVtYmVyKGNlbnRlcikgPyBjZW50ZXIgOiByZWxhdGl2ZXMuZmlyc3RJdGVtO1xuXHRcdFx0XHRyZWxhdGl2ZXMubGFzdEl0ZW0gPSBpc051bWJlcihsYXN0KSA/IGxhc3QgOiByZWxhdGl2ZXMuY2VudGVySXRlbTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlbGF0aXZlcztcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBVcGRhdGUgb2JqZWN0IHdpdGggcmVsYXRpdmUgcG9zaXRpb25zLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtJbnR9IG5ld1Bvc1xuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiB1cGRhdGVSZWxhdGl2ZXMobmV3UG9zKSB7XG5cdFx0XHQkLmV4dGVuZChyZWwsIGdldFJlbGF0aXZlcyhuZXdQb3MpKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBEaXNhYmxlIG5hdmlnYXRpb24gYnV0dG9ucyB3aGVuIG5lZWRlZC5cblx0XHQgKlxuXHRcdCAqIEFkZHMgZGlzYWJsZWRDbGFzcywgYW5kIHdoZW4gdGhlIGJ1dHRvbiBpcyA8YnV0dG9uPiBvciA8aW5wdXQ+LCBhY3RpdmF0ZXMgOmRpc2FibGVkIHN0YXRlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiB1cGRhdGVCdXR0b25zU3RhdGUoKSB7XG5cdFx0XHR2YXIgaXNTdGFydCA9IHBvcy5kZXN0IDw9IHBvcy5zdGFydDtcblx0XHRcdHZhciBpc0VuZCA9IHBvcy5kZXN0ID49IHBvcy5lbmQ7XG5cdFx0XHR2YXIgc2xpZGVlUG9zU3RhdGUgPSAoaXNTdGFydCA/IDEgOiAwKSB8IChpc0VuZCA/IDIgOiAwKTtcblxuXHRcdFx0Ly8gVXBkYXRlIHBhZ2luZyBidXR0b25zIG9ubHkgaWYgdGhlcmUgaGFzIGJlZW4gYSBjaGFuZ2UgaW4gU0xJREVFIHBvc2l0aW9uXG5cdFx0XHRpZiAobGFzdC5zbGlkZWVQb3NTdGF0ZSAhPT0gc2xpZGVlUG9zU3RhdGUpIHtcblx0XHRcdFx0bGFzdC5zbGlkZWVQb3NTdGF0ZSA9IHNsaWRlZVBvc1N0YXRlO1xuXG5cdFx0XHRcdGlmICgkcHJldlBhZ2VCdXR0b24uaXMoJ2J1dHRvbixpbnB1dCcpKSB7XG5cdFx0XHRcdFx0JHByZXZQYWdlQnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgaXNTdGFydCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoJG5leHRQYWdlQnV0dG9uLmlzKCdidXR0b24saW5wdXQnKSkge1xuXHRcdFx0XHRcdCRuZXh0UGFnZUJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIGlzRW5kKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRwcmV2UGFnZUJ1dHRvbi5hZGQoJGJhY2t3YXJkQnV0dG9uKVtpc1N0YXJ0ID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKG8uZGlzYWJsZWRDbGFzcyk7XG5cdFx0XHRcdCRuZXh0UGFnZUJ1dHRvbi5hZGQoJGZvcndhcmRCdXR0b24pW2lzRW5kID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKG8uZGlzYWJsZWRDbGFzcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcndhcmQgJiBCYWNrd2FyZCBidXR0b25zIG5lZWQgYSBzZXBhcmF0ZSBzdGF0ZSBjYWNoaW5nIGJlY2F1c2Ugd2UgY2Fubm90IFwicHJvcGVydHkgZGlzYWJsZVwiXG5cdFx0XHQvLyB0aGVtIHdoaWxlIHRoZXkgYXJlIGJlaW5nIHVzZWQsIGFzIGRpc2FibGVkIGJ1dHRvbnMgc3RvcCBlbWl0dGluZyBtb3VzZSBldmVudHMuXG5cdFx0XHRpZiAobGFzdC5md2Rid2RTdGF0ZSAhPT0gc2xpZGVlUG9zU3RhdGUgJiYgZHJhZ2dpbmcucmVsZWFzZWQpIHtcblx0XHRcdFx0bGFzdC5md2Rid2RTdGF0ZSA9IHNsaWRlZVBvc1N0YXRlO1xuXG5cdFx0XHRcdGlmICgkYmFja3dhcmRCdXR0b24uaXMoJ2J1dHRvbixpbnB1dCcpKSB7XG5cdFx0XHRcdFx0JGJhY2t3YXJkQnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgaXNTdGFydCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoJGZvcndhcmRCdXR0b24uaXMoJ2J1dHRvbixpbnB1dCcpKSB7XG5cdFx0XHRcdFx0JGZvcndhcmRCdXR0b24ucHJvcCgnZGlzYWJsZWQnLCBpc0VuZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSXRlbSBuYXZpZ2F0aW9uXG5cdFx0XHRpZiAoaXRlbU5hdiAmJiByZWwuYWN0aXZlSXRlbSAhPSBudWxsKSB7XG5cdFx0XHRcdHZhciBpc0ZpcnN0ID0gcmVsLmFjdGl2ZUl0ZW0gPT09IDA7XG5cdFx0XHRcdHZhciBpc0xhc3QgPSByZWwuYWN0aXZlSXRlbSA+PSBpdGVtcy5sZW5ndGggLSAxO1xuXHRcdFx0XHR2YXIgaXRlbXNCdXR0b25TdGF0ZSA9IChpc0ZpcnN0ID8gMSA6IDApIHwgKGlzTGFzdCA/IDIgOiAwKTtcblxuXHRcdFx0XHRpZiAobGFzdC5pdGVtc0J1dHRvblN0YXRlICE9PSBpdGVtc0J1dHRvblN0YXRlKSB7XG5cdFx0XHRcdFx0bGFzdC5pdGVtc0J1dHRvblN0YXRlID0gaXRlbXNCdXR0b25TdGF0ZTtcblxuXHRcdFx0XHRcdGlmICgkcHJldkJ1dHRvbi5pcygnYnV0dG9uLGlucHV0JykpIHtcblx0XHRcdFx0XHRcdCRwcmV2QnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgaXNGaXJzdCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCRuZXh0QnV0dG9uLmlzKCdidXR0b24saW5wdXQnKSkge1xuXHRcdFx0XHRcdFx0JG5leHRCdXR0b24ucHJvcCgnZGlzYWJsZWQnLCBpc0xhc3QpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCRwcmV2QnV0dG9uW2lzRmlyc3QgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJ10oby5kaXNhYmxlZENsYXNzKTtcblx0XHRcdFx0XHQkbmV4dEJ1dHRvbltpc0xhc3QgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJ10oby5kaXNhYmxlZENsYXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFJlc3VtZSBjeWNsaW5nLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtJbnR9IHByaW9yaXR5IFJlc3VtZSBwYXVzZSB3aXRoIHByaW9yaXR5IGxvd2VyIG9yIGVxdWFsIHRoYW4gdGhpcy4gVXNlZCBpbnRlcm5hbGx5IGZvciBwYXVzZU9uSG92ZXIuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYucmVzdW1lID0gZnVuY3Rpb24gKHByaW9yaXR5KSB7XG5cdFx0XHRpZiAoIW8uY3ljbGVCeSB8fCAhby5jeWNsZUludGVydmFsIHx8IG8uY3ljbGVCeSA9PT0gJ2l0ZW1zJyAmJiAoIWl0ZW1zWzBdIHx8IHJlbC5hY3RpdmVJdGVtID09IG51bGwpIHx8IHByaW9yaXR5IDwgc2VsZi5pc1BhdXNlZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYuaXNQYXVzZWQgPSAwO1xuXG5cdFx0XHRpZiAoY3ljbGVJRCkge1xuXHRcdFx0XHRjeWNsZUlEID0gY2xlYXJUaW1lb3V0KGN5Y2xlSUQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHJpZ2dlcigncmVzdW1lJyk7XG5cdFx0XHR9XG5cblx0XHRcdGN5Y2xlSUQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dHJpZ2dlcignY3ljbGUnKTtcblx0XHRcdFx0c3dpdGNoIChvLmN5Y2xlQnkpIHtcblx0XHRcdFx0XHRjYXNlICdpdGVtcyc6XG5cdFx0XHRcdFx0XHRzZWxmLmFjdGl2YXRlKHJlbC5hY3RpdmVJdGVtID49IGl0ZW1zLmxlbmd0aCAtIDEgPyAwIDogcmVsLmFjdGl2ZUl0ZW0gKyAxKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAncGFnZXMnOlxuXHRcdFx0XHRcdFx0c2VsZi5hY3RpdmF0ZVBhZ2UocmVsLmFjdGl2ZVBhZ2UgPj0gcGFnZXMubGVuZ3RoIC0gMSA/IDAgOiByZWwuYWN0aXZlUGFnZSArIDEpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0sIG8uY3ljbGVJbnRlcnZhbCk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFBhdXNlIGN5Y2xpbmcuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0ludH0gcHJpb3JpdHkgUGF1c2UgcHJpb3JpdHkuIDEwMCBpcyBkZWZhdWx0LiBVc2VkIGludGVybmFsbHkgZm9yIHBhdXNlT25Ib3Zlci5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0c2VsZi5wYXVzZSA9IGZ1bmN0aW9uIChwcmlvcml0eSkge1xuXHRcdFx0aWYgKHByaW9yaXR5IDwgc2VsZi5pc1BhdXNlZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYuaXNQYXVzZWQgPSBwcmlvcml0eSB8fCAxMDA7XG5cblx0XHRcdGlmIChjeWNsZUlEKSB7XG5cdFx0XHRcdGN5Y2xlSUQgPSBjbGVhclRpbWVvdXQoY3ljbGVJRCk7XG5cdFx0XHRcdHRyaWdnZXIoJ3BhdXNlJyk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFRvZ2dsZSBjeWNsaW5nLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGZbY3ljbGVJRCA/ICdwYXVzZScgOiAncmVzdW1lJ10oKTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogVXBkYXRlcyBhIHNpZ25sZSBvciBtdWx0aXBsZSBvcHRpb24gdmFsdWVzLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtNaXhlZH0gbmFtZSAgTmFtZSBvZiB0aGUgb3B0aW9uIHRoYXQgc2hvdWxkIGJlIHVwZGF0ZWQsIG9yIG9iamVjdCB0aGF0IHdpbGwgZXh0ZW5kIHRoZSBvcHRpb25zLlxuXHRcdCAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIE5ldyBvcHRpb24gdmFsdWUuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYuc2V0ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG5cdFx0XHRpZiAoJC5pc1BsYWluT2JqZWN0KG5hbWUpKSB7XG5cdFx0XHRcdCQuZXh0ZW5kKG8sIG5hbWUpO1xuXHRcdFx0fSBlbHNlIGlmIChvLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cdFx0XHRcdG9bbmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQWRkIG9uZSBvciBtdWx0aXBsZSBpdGVtcyB0byB0aGUgU0xJREVFIGVuZCwgb3IgYSBzcGVjaWZpZWQgcG9zaXRpb24gaW5kZXguXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge01peGVkfSBlbGVtZW50IE5vZGUgZWxlbWVudCwgb3IgSFRNTCBzdHJpbmcuXG5cdFx0ICogQHBhcmFtIHtJbnR9ICAgaW5kZXggICBJbmRleCBvZiBhIG5ldyBpdGVtIHBvc2l0aW9uLiBCeSBkZWZhdWx0IGl0ZW0gaXMgYXBwZW5kZWQgYXQgdGhlIGVuZC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0c2VsZi5hZGQgPSBmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcblx0XHRcdHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cblx0XHRcdGlmIChpdGVtTmF2KSB7XG5cdFx0XHRcdC8vIEluc2VydCB0aGUgZWxlbWVudChzKVxuXHRcdFx0XHRpZiAoaW5kZXggPT0gbnVsbCB8fCAhaXRlbXNbMF0gfHwgaW5kZXggPj0gaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0JGVsZW1lbnQuYXBwZW5kVG8oJHNsaWRlZSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0JGVsZW1lbnQuaW5zZXJ0QmVmb3JlKGl0ZW1zW2luZGV4XS5lbCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBZGp1c3QgdGhlIGFjdGl2ZUl0ZW0gaW5kZXhcblx0XHRcdFx0aWYgKHJlbC5hY3RpdmVJdGVtICE9IG51bGwgJiYgaW5kZXggPD0gcmVsLmFjdGl2ZUl0ZW0pIHtcblx0XHRcdFx0XHRsYXN0LmFjdGl2ZSA9IHJlbC5hY3RpdmVJdGVtICs9ICRlbGVtZW50Lmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNsaWRlZS5hcHBlbmQoJGVsZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWxvYWRcblx0XHRcdGxvYWQoKTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBTTElERUUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge01peGVkfSBlbGVtZW50IEl0ZW0gaW5kZXgsIG9yIERPTSBlbGVtZW50LlxuXHRcdCAqIEBwYXJhbSB7SW50fSAgIGluZGV4ICAgSW5kZXggb2YgYSBuZXcgaXRlbSBwb3NpdGlvbi4gQnkgZGVmYXVsdCBpdGVtIGlzIGFwcGVuZGVkIGF0IHRoZSBlbmQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYucmVtb3ZlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdGlmIChpdGVtTmF2KSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IGdldFJlbGF0aXZlSW5kZXgoZWxlbWVudCk7XG5cblx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgdGhlIGVsZW1lbnRcblx0XHRcdFx0XHQkaXRlbXMuZXEoaW5kZXgpLnJlbW92ZSgpO1xuXG5cdFx0XHRcdFx0Ly8gSWYgdGhlIGN1cnJlbnQgaXRlbSBpcyBiZWluZyByZW1vdmVkLCBhY3RpdmF0ZSBuZXcgb25lIGFmdGVyIHJlbG9hZFxuXHRcdFx0XHRcdHZhciByZWFjdGl2YXRlID0gaW5kZXggPT09IHJlbC5hY3RpdmVJdGVtO1xuXG5cdFx0XHRcdFx0Ly8gQWRqdXN0IHRoZSBhY3RpdmVJdGVtIGluZGV4XG5cdFx0XHRcdFx0aWYgKHJlbC5hY3RpdmVJdGVtICE9IG51bGwgJiYgaW5kZXggPCByZWwuYWN0aXZlSXRlbSkge1xuXHRcdFx0XHRcdFx0bGFzdC5hY3RpdmUgPSAtLXJlbC5hY3RpdmVJdGVtO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFJlbG9hZFxuXHRcdFx0XHRcdGxvYWQoKTtcblxuXHRcdFx0XHRcdC8vIEFjdGl2YXRlIG5ldyBpdGVtIGF0IHRoZSByZW1vdmVkIHBvc2l0aW9uXG5cdFx0XHRcdFx0aWYgKHJlYWN0aXZhdGUpIHtcblx0XHRcdFx0XHRcdGxhc3QuYWN0aXZlID0gbnVsbDtcblx0XHRcdFx0XHRcdHNlbGYuYWN0aXZhdGUocmVsLmFjdGl2ZUl0ZW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JChlbGVtZW50KS5yZW1vdmUoKTtcblx0XHRcdFx0bG9hZCgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBIZWxwcyByZS1hcnJhbmdpbmcgaXRlbXMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIHtNaXhlZH0gaXRlbSAgICAgSXRlbSBET00gZWxlbWVudCwgb3IgaW5kZXggc3RhcnRpbmcgYXQgMC4gVXNlIG5lZ2F0aXZlIG51bWJlcnMgdG8gc2VsZWN0IGl0ZW1zIGZyb20gdGhlIGVuZC5cblx0XHQgKiBAcGFyYW0gIHtNaXhlZH0gcG9zaXRpb24gSXRlbSBpbnNlcnRpb24gYW5jaG9yLiBBY2NlcHRzIHNhbWUgaW5wdXQgdHlwZXMgYXMgaXRlbSBhcmd1bWVudC5cblx0XHQgKiBAcGFyYW0gIHtCb29sfSAgYWZ0ZXIgICAgSW5zZXJ0IGFmdGVyIGluc3RlYWQgb2YgYmVmb3JlIHRoZSBhbmNob3IuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG1vdmVJdGVtKGl0ZW0sIHBvc2l0aW9uLCBhZnRlcikge1xuXHRcdFx0aXRlbSA9IGdldFJlbGF0aXZlSW5kZXgoaXRlbSk7XG5cdFx0XHRwb3NpdGlvbiA9IGdldFJlbGF0aXZlSW5kZXgocG9zaXRpb24pO1xuXG5cdFx0XHQvLyBNb3ZlIG9ubHkgaWYgdGhlcmUgaXMgYW4gYWN0dWFsIGNoYW5nZSByZXF1ZXN0ZWRcblx0XHRcdGlmIChpdGVtID4gLTEgJiYgcG9zaXRpb24gPiAtMSAmJiBpdGVtICE9PSBwb3NpdGlvbiAmJiAoIWFmdGVyIHx8IHBvc2l0aW9uICE9PSBpdGVtIC0gMSkgJiYgKGFmdGVyIHx8IHBvc2l0aW9uICE9PSBpdGVtICsgMSkpIHtcblx0XHRcdFx0JGl0ZW1zLmVxKGl0ZW0pW2FmdGVyID8gJ2luc2VydEFmdGVyJyA6ICdpbnNlcnRCZWZvcmUnXShpdGVtc1twb3NpdGlvbl0uZWwpO1xuXG5cdFx0XHRcdHZhciBzaGlmdFN0YXJ0ID0gaXRlbSA8IHBvc2l0aW9uID8gaXRlbSA6IChhZnRlciA/IHBvc2l0aW9uIDogcG9zaXRpb24gLSAxKTtcblx0XHRcdFx0dmFyIHNoaWZ0RW5kID0gaXRlbSA+IHBvc2l0aW9uID8gaXRlbSA6IChhZnRlciA/IHBvc2l0aW9uICsgMSA6IHBvc2l0aW9uKTtcblx0XHRcdFx0dmFyIHNoaWZ0c1VwID0gaXRlbSA+IHBvc2l0aW9uO1xuXG5cdFx0XHRcdC8vIFVwZGF0ZSBhY3RpdmVJdGVtIGluZGV4XG5cdFx0XHRcdGlmIChyZWwuYWN0aXZlSXRlbSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0gPT09IHJlbC5hY3RpdmVJdGVtKSB7XG5cdFx0XHRcdFx0XHRsYXN0LmFjdGl2ZSA9IHJlbC5hY3RpdmVJdGVtID0gYWZ0ZXIgPyAoc2hpZnRzVXAgPyBwb3NpdGlvbiArIDEgOiBwb3NpdGlvbikgOiAoc2hpZnRzVXAgPyBwb3NpdGlvbiA6IHBvc2l0aW9uIC0gMSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZWwuYWN0aXZlSXRlbSA+IHNoaWZ0U3RhcnQgJiYgcmVsLmFjdGl2ZUl0ZW0gPCBzaGlmdEVuZCkge1xuXHRcdFx0XHRcdFx0bGFzdC5hY3RpdmUgPSByZWwuYWN0aXZlSXRlbSArPSBzaGlmdHNVcCA/IDEgOiAtMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWxvYWRcblx0XHRcdFx0bG9hZCgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIE1vdmUgaXRlbSBhZnRlciB0aGUgdGFyZ2V0IGFuY2hvci5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAge01peGVkfSBpdGVtICAgICBJdGVtIHRvIGJlIG1vdmVkLiBDYW4gYmUgRE9NIGVsZW1lbnQgb3IgaXRlbSBpbmRleC5cblx0XHQgKiBAcGFyYW0gIHtNaXhlZH0gcG9zaXRpb24gVGFyZ2V0IHBvc2l0aW9uIGFuY2hvci4gQ2FuIGJlIERPTSBlbGVtZW50IG9yIGl0ZW0gaW5kZXguXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYubW92ZUFmdGVyID0gZnVuY3Rpb24gKGl0ZW0sIHBvc2l0aW9uKSB7XG5cdFx0XHRtb3ZlSXRlbShpdGVtLCBwb3NpdGlvbiwgMSk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIE1vdmUgaXRlbSBiZWZvcmUgdGhlIHRhcmdldCBhbmNob3IuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIHtNaXhlZH0gaXRlbSAgICAgSXRlbSB0byBiZSBtb3ZlZC4gQ2FuIGJlIERPTSBlbGVtZW50IG9yIGl0ZW0gaW5kZXguXG5cdFx0ICogQHBhcmFtICB7TWl4ZWR9IHBvc2l0aW9uIFRhcmdldCBwb3NpdGlvbiBhbmNob3IuIENhbiBiZSBET00gZWxlbWVudCBvciBpdGVtIGluZGV4LlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLm1vdmVCZWZvcmUgPSBmdW5jdGlvbiAoaXRlbSwgcG9zaXRpb24pIHtcblx0XHRcdG1vdmVJdGVtKGl0ZW0sIHBvc2l0aW9uKTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogUmVnaXN0ZXJzIGNhbGxiYWNrcy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAge01peGVkfSBuYW1lICBFdmVudCBuYW1lLCBvciBjYWxsYmFja3MgbWFwLlxuXHRcdCAqIEBwYXJhbSAge01peGVkfSBmbiAgICBDYWxsYmFjaywgb3IgYW4gYXJyYXkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLm9uID0gZnVuY3Rpb24gKG5hbWUsIGZuKSB7XG5cdFx0XHQvLyBDYWxsYmFja3MgbWFwXG5cdFx0XHRpZiAodHlwZShuYW1lKSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIG5hbWUpIHtcblx0XHRcdFx0XHRpZiAobmFtZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdFx0XHRzZWxmLm9uKGtleSwgbmFtZVtrZXldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdC8vIENhbGxiYWNrXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUoZm4pID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHZhciBuYW1lcyA9IG5hbWUuc3BsaXQoJyAnKTtcblx0XHRcdFx0Zm9yICh2YXIgbiA9IDAsIG5sID0gbmFtZXMubGVuZ3RoOyBuIDwgbmw7IG4rKykge1xuXHRcdFx0XHRcdGNhbGxiYWNrc1tuYW1lc1tuXV0gPSBjYWxsYmFja3NbbmFtZXNbbl1dIHx8IFtdO1xuXHRcdFx0XHRcdGlmIChjYWxsYmFja0luZGV4KG5hbWVzW25dLCBmbikgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFja3NbbmFtZXNbbl1dLnB1c2goZm4pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0Ly8gQ2FsbGJhY2tzIGFycmF5XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUoZm4pID09PSAnYXJyYXknKSB7XG5cdFx0XHRcdGZvciAodmFyIGYgPSAwLCBmbCA9IGZuLmxlbmd0aDsgZiA8IGZsOyBmKyspIHtcblx0XHRcdFx0XHRzZWxmLm9uKG5hbWUsIGZuW2ZdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIHRvIGJlIGV4ZWN1dGVkIG9ubHkgb25jZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAge01peGVkfSBuYW1lICBFdmVudCBuYW1lLCBvciBjYWxsYmFja3MgbWFwLlxuXHRcdCAqIEBwYXJhbSAge01peGVkfSBmbiAgICBDYWxsYmFjaywgb3IgYW4gYXJyYXkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRzZWxmLm9uZSA9IGZ1bmN0aW9uIChuYW1lLCBmbikge1xuXHRcdFx0ZnVuY3Rpb24gcHJveHkoKSB7XG5cdFx0XHRcdGZuLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdHNlbGYub2ZmKG5hbWUsIHByb3h5KTtcblx0XHRcdH1cblx0XHRcdHNlbGYub24obmFtZSwgcHJveHkpO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBSZW1vdmUgb25lIG9yIGFsbCBjYWxsYmFja3MuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IG5hbWUgRXZlbnQgbmFtZS5cblx0XHQgKiBAcGFyYW0gIHtNaXhlZH0gIGZuICAgQ2FsbGJhY2ssIG9yIGFuIGFycmF5IG9mIGNhbGxiYWNrIGZ1bmN0aW9ucy4gT21pdCB0byByZW1vdmUgYWxsIGNhbGxiYWNrcy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0c2VsZi5vZmYgPSBmdW5jdGlvbiAobmFtZSwgZm4pIHtcblx0XHRcdGlmIChmbiBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRcdGZvciAodmFyIGYgPSAwLCBmbCA9IGZuLmxlbmd0aDsgZiA8IGZsOyBmKyspIHtcblx0XHRcdFx0XHRzZWxmLm9mZihuYW1lLCBmbltmXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBuYW1lcyA9IG5hbWUuc3BsaXQoJyAnKTtcblx0XHRcdFx0Zm9yICh2YXIgbiA9IDAsIG5sID0gbmFtZXMubGVuZ3RoOyBuIDwgbmw7IG4rKykge1xuXHRcdFx0XHRcdGNhbGxiYWNrc1tuYW1lc1tuXV0gPSBjYWxsYmFja3NbbmFtZXNbbl1dIHx8IFtdO1xuXHRcdFx0XHRcdGlmIChmbiA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFja3NbbmFtZXNbbl1dLmxlbmd0aCA9IDA7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHZhciBpbmRleCA9IGNhbGxiYWNrSW5kZXgobmFtZXNbbl0sIGZuKTtcblx0XHRcdFx0XHRcdGlmIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzW25hbWVzW25dXS5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIGNhbGxiYWNrIGFycmF5IGluZGV4LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSAgIG5hbWUgRXZlbnQgbmFtZS5cblx0XHQgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICBGdW5jdGlvblxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7SW50fSBDYWxsYmFjayBhcnJheSBpbmRleCwgb3IgLTEgaWYgaXNuJ3QgcmVnaXN0ZXJlZC5cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBjYWxsYmFja0luZGV4KG5hbWUsIGZuKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbCA9IGNhbGxiYWNrc1tuYW1lXS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0aWYgKGNhbGxiYWNrc1tuYW1lXVtpXSA9PT0gZm4pIHtcblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFJlc2V0IG5leHQgY3ljbGUgdGltZW91dC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gcmVzZXRDeWNsZSgpIHtcblx0XHRcdGlmIChkcmFnZ2luZy5yZWxlYXNlZCAmJiAhc2VsZi5pc1BhdXNlZCkge1xuXHRcdFx0XHRzZWxmLnJlc3VtZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENhbGN1bGF0ZSBTTElERUUgcmVwcmVzZW50YXRpb24gb2YgaGFuZGxlIHBvc2l0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7SW50fSBoYW5kbGVQb3Ncblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge0ludH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBoYW5kbGVUb1NsaWRlZShoYW5kbGVQb3MpIHtcblx0XHRcdHJldHVybiByb3VuZCh3aXRoaW4oaGFuZGxlUG9zLCBoUG9zLnN0YXJ0LCBoUG9zLmVuZCkgLyBoUG9zLmVuZCAqIChwb3MuZW5kIC0gcG9zLnN0YXJ0KSkgKyBwb3Muc3RhcnQ7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogS2VlcHMgdHJhY2sgb2YgYSBkcmFnZ2luZyBkZWx0YSBoaXN0b3J5LlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBkcmFnZ2luZ0hpc3RvcnlUaWNrKCkge1xuXHRcdFx0Ly8gTG9va2luZyBhdCB0aGlzLCBJIGtub3cgd2hhdCB5b3UncmUgdGhpbmtpbmcgOikgQnV0IGFzIHdlIG5lZWQgb25seSA0IGhpc3Rvcnkgc3RhdGVzLCBkb2luZyBpdCB0aGlzIHdheVxuXHRcdFx0Ly8gYXMgb3Bwb3NlZCB0byBhIHByb3BlciBsb29wIGlzIH4yNSBieXRlcyBzbWFsbGVyICh3aGVuIG1pbmlmaWVkIHdpdGggR0NDKSwgYSBsb3QgZmFzdGVyLCBhbmQgZG9lc24ndFxuXHRcdFx0Ly8gZ2VuZXJhdGUgZ2FyYmFnZS4gVGhlIGxvb3AgdmVyc2lvbiB3b3VsZCBjcmVhdGUgMiBuZXcgdmFyaWFibGVzIG9uIGV2ZXJ5IHRpY2suIFVuZXhhcHRhYmxlIVxuXHRcdFx0ZHJhZ2dpbmcuaGlzdG9yeVswXSA9IGRyYWdnaW5nLmhpc3RvcnlbMV07XG5cdFx0XHRkcmFnZ2luZy5oaXN0b3J5WzFdID0gZHJhZ2dpbmcuaGlzdG9yeVsyXTtcblx0XHRcdGRyYWdnaW5nLmhpc3RvcnlbMl0gPSBkcmFnZ2luZy5oaXN0b3J5WzNdO1xuXHRcdFx0ZHJhZ2dpbmcuaGlzdG9yeVszXSA9IGRyYWdnaW5nLmRlbHRhO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEluaXRpYWxpemUgY29udGludW91cyBtb3ZlbWVudC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gY29udGludW91c0luaXQoc291cmNlKSB7XG5cdFx0XHRkcmFnZ2luZy5yZWxlYXNlZCA9IDA7XG5cdFx0XHRkcmFnZ2luZy5zb3VyY2UgPSBzb3VyY2U7XG5cdFx0XHRkcmFnZ2luZy5zbGlkZWUgPSBzb3VyY2UgPT09ICdzbGlkZWUnO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIERyYWdnaW5nIGluaXRpYXRvci5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAge0V2ZW50fSBldmVudFxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBkcmFnSW5pdChldmVudCkge1xuXHRcdFx0dmFyIGlzVG91Y2ggPSBldmVudC50eXBlID09PSAndG91Y2hzdGFydCc7XG5cdFx0XHR2YXIgc291cmNlID0gZXZlbnQuZGF0YS5zb3VyY2U7XG5cdFx0XHR2YXIgaXNTbGlkZWUgPSBzb3VyY2UgPT09ICdzbGlkZWUnO1xuXG5cdFx0XHQvLyBJZ25vcmUgd2hlbiBhbHJlYWR5IGluIHByb2dyZXNzLCBvciBpbnRlcmFjdGl2ZSBlbGVtZW50IGluIG5vbi10b3VjaCBuYXZpdmFnaW9uXG5cdFx0XHRpZiAoZHJhZ2dpbmcuaW5pdCB8fCAhaXNUb3VjaCAmJiBpc0ludGVyYWN0aXZlKGV2ZW50LnRhcmdldCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBIYW5kbGUgZHJhZ2dpbmcgY29uZGl0aW9uc1xuXHRcdFx0aWYgKHNvdXJjZSA9PT0gJ2hhbmRsZScgJiYgKCFvLmRyYWdIYW5kbGUgfHwgaFBvcy5zdGFydCA9PT0gaFBvcy5lbmQpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU0xJREVFIGRyYWdnaW5nIGNvbmRpdGlvbnNcblx0XHRcdGlmIChpc1NsaWRlZSAmJiAhKGlzVG91Y2ggPyBvLnRvdWNoRHJhZ2dpbmcgOiBvLm1vdXNlRHJhZ2dpbmcgJiYgZXZlbnQud2hpY2ggPCAyKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICghaXNUb3VjaCkge1xuXHRcdFx0XHQvLyBwcmV2ZW50cyBuYXRpdmUgaW1hZ2UgZHJhZ2dpbmcgaW4gRmlyZWZveFxuXHRcdFx0XHRzdG9wRGVmYXVsdChldmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlc2V0IGRyYWdnaW5nIG9iamVjdFxuXHRcdFx0Y29udGludW91c0luaXQoc291cmNlKTtcblxuXHRcdFx0Ly8gUHJvcGVydGllcyB1c2VkIGluIGRyYWdIYW5kbGVyXG5cdFx0XHRkcmFnZ2luZy5pbml0ID0gMDtcblx0XHRcdGRyYWdnaW5nLiRzb3VyY2UgPSAkKGV2ZW50LnRhcmdldCk7XG5cdFx0XHRkcmFnZ2luZy50b3VjaCA9IGlzVG91Y2g7XG5cdFx0XHRkcmFnZ2luZy5wb2ludGVyID0gaXNUb3VjaCA/IGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXSA6IGV2ZW50O1xuXHRcdFx0ZHJhZ2dpbmcuaW5pdFggPSBkcmFnZ2luZy5wb2ludGVyLnBhZ2VYO1xuXHRcdFx0ZHJhZ2dpbmcuaW5pdFkgPSBkcmFnZ2luZy5wb2ludGVyLnBhZ2VZO1xuXHRcdFx0ZHJhZ2dpbmcuaW5pdFBvcyA9IGlzU2xpZGVlID8gcG9zLmN1ciA6IGhQb3MuY3VyO1xuXHRcdFx0ZHJhZ2dpbmcuc3RhcnQgPSArbmV3IERhdGUoKTtcblx0XHRcdGRyYWdnaW5nLnRpbWUgPSAwO1xuXHRcdFx0ZHJhZ2dpbmcucGF0aCA9IDA7XG5cdFx0XHRkcmFnZ2luZy5kZWx0YSA9IDA7XG5cdFx0XHRkcmFnZ2luZy5sb2NrZWQgPSAwO1xuXHRcdFx0ZHJhZ2dpbmcuaGlzdG9yeSA9IFswLCAwLCAwLCAwXTtcblx0XHRcdGRyYWdnaW5nLnBhdGhUb0xvY2sgPSBpc1NsaWRlZSA/IGlzVG91Y2ggPyAzMCA6IDEwIDogMDtcblxuXHRcdFx0Ly8gQmluZCBkcmFnZ2luZyBldmVudHNcblx0XHRcdCRkb2Mub24oaXNUb3VjaCA/IGRyYWdUb3VjaEV2ZW50cyA6IGRyYWdNb3VzZUV2ZW50cywgZHJhZ0hhbmRsZXIpO1xuXG5cdFx0XHQvLyBQYXVzZSBvbmdvaW5nIGN5Y2xlXG5cdFx0XHRzZWxmLnBhdXNlKDEpO1xuXG5cdFx0XHQvLyBBZGQgZHJhZ2dpbmcgY2xhc3Ncblx0XHRcdChpc1NsaWRlZSA/ICRzbGlkZWUgOiAkaGFuZGxlKS5hZGRDbGFzcyhvLmRyYWdnZWRDbGFzcyk7XG5cblx0XHRcdC8vIFRyaWdnZXIgbW92ZVN0YXJ0IGV2ZW50XG5cdFx0XHR0cmlnZ2VyKCdtb3ZlU3RhcnQnKTtcblxuXHRcdFx0Ly8gS2VlcCB0cmFjayBvZiBhIGRyYWdnaW5nIHBhdGggaGlzdG9yeS4gVGhpcyBpcyBsYXRlciB1c2VkIGluIHRoZVxuXHRcdFx0Ly8gZHJhZ2dpbmcgcmVsZWFzZSBzd2luZyBjYWxjdWxhdGlvbiB3aGVuIGRyYWdnaW5nIFNMSURFRS5cblx0XHRcdGlmIChpc1NsaWRlZSkge1xuXHRcdFx0XHRoaXN0b3J5SUQgPSBzZXRJbnRlcnZhbChkcmFnZ2luZ0hpc3RvcnlUaWNrLCAxMCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogSGFuZGxlciBmb3IgZHJhZ2dpbmcgc2Nyb2xsYmFyIGhhbmRsZSBvciBTTElERUUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIHtFdmVudH0gZXZlbnRcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZHJhZ0hhbmRsZXIoZXZlbnQpIHtcblx0XHRcdGRyYWdnaW5nLnJlbGVhc2VkID0gZXZlbnQudHlwZSA9PT0gJ21vdXNldXAnIHx8IGV2ZW50LnR5cGUgPT09ICd0b3VjaGVuZCc7XG5cdFx0XHRkcmFnZ2luZy5wb2ludGVyID0gZHJhZ2dpbmcudG91Y2ggPyBldmVudC5vcmlnaW5hbEV2ZW50W2RyYWdnaW5nLnJlbGVhc2VkID8gJ2NoYW5nZWRUb3VjaGVzJyA6ICd0b3VjaGVzJ11bMF0gOiBldmVudDtcblx0XHRcdGRyYWdnaW5nLnBhdGhYID0gZHJhZ2dpbmcucG9pbnRlci5wYWdlWCAtIGRyYWdnaW5nLmluaXRYO1xuXHRcdFx0ZHJhZ2dpbmcucGF0aFkgPSBkcmFnZ2luZy5wb2ludGVyLnBhZ2VZIC0gZHJhZ2dpbmcuaW5pdFk7XG5cdFx0XHRkcmFnZ2luZy5wYXRoID0gc3FydChwb3coZHJhZ2dpbmcucGF0aFgsIDIpICsgcG93KGRyYWdnaW5nLnBhdGhZLCAyKSk7XG5cdFx0XHRkcmFnZ2luZy5kZWx0YSA9IG8uaG9yaXpvbnRhbCA/IGRyYWdnaW5nLnBhdGhYIDogZHJhZ2dpbmcucGF0aFk7XG5cblx0XHRcdGlmICghZHJhZ2dpbmcucmVsZWFzZWQgJiYgZHJhZ2dpbmcucGF0aCA8IDEpIHJldHVybjtcblxuXHRcdFx0Ly8gV2UgaGF2ZW4ndCBkZWNpZGVkIHdoZXRoZXIgdGhpcyBpcyBhIGRyYWcgb3Igbm90Li4uXG5cdFx0XHRpZiAoIWRyYWdnaW5nLmluaXQpIHtcblx0XHRcdFx0Ly8gSWYgdGhlIGRyYWcgcGF0aCB3YXMgdmVyeSBzaG9ydCwgbWF5YmUgaXQncyBub3QgYSBkcmFnP1xuXHRcdFx0XHRpZiAoZHJhZ2dpbmcucGF0aCA8IG8uZHJhZ1RocmVzaG9sZCkge1xuXHRcdFx0XHRcdC8vIElmIHRoZSBwb2ludGVyIHdhcyByZWxlYXNlZCwgdGhlIHBhdGggd2lsbCBub3QgYmVjb21lIGxvbmdlciBhbmQgaXQnc1xuXHRcdFx0XHRcdC8vIGRlZmluaXRlbHkgbm90IGEgZHJhZy4gSWYgbm90IHJlbGVhc2VkIHlldCwgZGVjaWRlIG9uIG5leHQgaXRlcmF0aW9uXG5cdFx0XHRcdFx0cmV0dXJuIGRyYWdnaW5nLnJlbGVhc2VkID8gZHJhZ0VuZCgpIDogdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8vIElmIGRyYWdnaW5nIHBhdGggaXMgc3VmZmljaWVudGx5IGxvbmcgd2UgY2FuIGNvbmZpZGVudGx5IHN0YXJ0IGEgZHJhZ1xuXHRcdFx0XHRcdC8vIGlmIGRyYWcgaXMgaW4gZGlmZmVyZW50IGRpcmVjdGlvbiB0aGFuIHNjcm9sbCwgaWdub3JlIGl0XG5cdFx0XHRcdFx0aWYgKG8uaG9yaXpvbnRhbCA/IGFicyhkcmFnZ2luZy5wYXRoWCkgPiBhYnMoZHJhZ2dpbmcucGF0aFkpIDogYWJzKGRyYWdnaW5nLnBhdGhYKSA8IGFicyhkcmFnZ2luZy5wYXRoWSkpIHtcblx0XHRcdFx0XHRcdGRyYWdnaW5nLmluaXQgPSAxO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZHJhZ0VuZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzdG9wRGVmYXVsdChldmVudCk7XG5cblx0XHRcdC8vIERpc2FibGUgY2xpY2sgb24gYSBzb3VyY2UgZWxlbWVudCwgYXMgaXQgaXMgdW53ZWxjb21lIHdoZW4gZHJhZ2dpbmdcblx0XHRcdGlmICghZHJhZ2dpbmcubG9ja2VkICYmIGRyYWdnaW5nLnBhdGggPiBkcmFnZ2luZy5wYXRoVG9Mb2NrICYmIGRyYWdnaW5nLnNsaWRlZSkge1xuXHRcdFx0XHRkcmFnZ2luZy5sb2NrZWQgPSAxO1xuXHRcdFx0XHRkcmFnZ2luZy4kc291cmNlLm9uKGNsaWNrRXZlbnQsIGRpc2FibGVPbmVFdmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENhbmNlbCBkcmFnZ2luZyBvbiByZWxlYXNlXG5cdFx0XHRpZiAoZHJhZ2dpbmcucmVsZWFzZWQpIHtcblx0XHRcdFx0ZHJhZ0VuZCgpO1xuXG5cdFx0XHRcdC8vIEFkanVzdCBwYXRoIHdpdGggYSBzd2luZyBvbiBtb3VzZSByZWxlYXNlXG5cdFx0XHRcdGlmIChvLnJlbGVhc2VTd2luZyAmJiBkcmFnZ2luZy5zbGlkZWUpIHtcblx0XHRcdFx0XHRkcmFnZ2luZy5zd2luZyA9IChkcmFnZ2luZy5kZWx0YSAtIGRyYWdnaW5nLmhpc3RvcnlbMF0pIC8gNDAgKiAzMDA7XG5cdFx0XHRcdFx0ZHJhZ2dpbmcuZGVsdGEgKz0gZHJhZ2dpbmcuc3dpbmc7XG5cdFx0XHRcdFx0ZHJhZ2dpbmcudHdlZXNlID0gYWJzKGRyYWdnaW5nLnN3aW5nKSA+IDEwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNsaWRlVG8oZHJhZ2dpbmcuc2xpZGVlID8gcm91bmQoZHJhZ2dpbmcuaW5pdFBvcyAtIGRyYWdnaW5nLmRlbHRhKSA6IGhhbmRsZVRvU2xpZGVlKGRyYWdnaW5nLmluaXRQb3MgKyBkcmFnZ2luZy5kZWx0YSkpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFN0b3BzIGRyYWdnaW5nIGFuZCBjbGVhbnMgdXAgYWZ0ZXIgaXQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGRyYWdFbmQoKSB7XG5cdFx0XHRjbGVhckludGVydmFsKGhpc3RvcnlJRCk7XG5cdFx0XHRkcmFnZ2luZy5yZWxlYXNlZCA9IHRydWU7XG5cdFx0XHQkZG9jLm9mZihkcmFnZ2luZy50b3VjaCA/IGRyYWdUb3VjaEV2ZW50cyA6IGRyYWdNb3VzZUV2ZW50cywgZHJhZ0hhbmRsZXIpO1xuXHRcdFx0KGRyYWdnaW5nLnNsaWRlZSA/ICRzbGlkZWUgOiAkaGFuZGxlKS5yZW1vdmVDbGFzcyhvLmRyYWdnZWRDbGFzcyk7XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGRpc2FibGVPbmVFdmVudCBpcyBub3QgYWN0aXZlIGluIG5leHQgdGljay5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkcmFnZ2luZy4kc291cmNlLm9mZihjbGlja0V2ZW50LCBkaXNhYmxlT25lRXZlbnQpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIE5vcm1hbGx5LCB0aGlzIGlzIHRyaWdnZXJlZCBpbiByZW5kZXIoKSwgYnV0IGlmIHRoZXJlXG5cdFx0XHQvLyBpcyBub3RoaW5nIHRvIHJlbmRlciwgd2UgaGF2ZSB0byBkbyBpdCBtYW51YWxseSBoZXJlLlxuXHRcdFx0aWYgKHBvcy5jdXIgPT09IHBvcy5kZXN0ICYmIGRyYWdnaW5nLmluaXQpIHtcblx0XHRcdFx0dHJpZ2dlcignbW92ZUVuZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXN1bWUgb25nb2luZyBjeWNsZVxuXHRcdFx0c2VsZi5yZXN1bWUoMSk7XG5cblx0XHRcdGRyYWdnaW5nLmluaXQgPSAwO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENoZWNrIHdoZXRoZXIgZWxlbWVudCBpcyBpbnRlcmFjdGl2ZS5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gaXNJbnRlcmFjdGl2ZShlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gfiQuaW5BcnJheShlbGVtZW50Lm5vZGVOYW1lLCBpbnRlcmFjdGl2ZUVsZW1lbnRzKSB8fCAkKGVsZW1lbnQpLmlzKG8uaW50ZXJhY3RpdmUpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENvbnRpbnVvdXMgbW92ZW1lbnQgY2xlYW51cCBvbiBtb3VzZXVwLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBtb3ZlbWVudFJlbGVhc2VIYW5kbGVyKCkge1xuXHRcdFx0c2VsZi5zdG9wKCk7XG5cdFx0XHQkZG9jLm9mZignbW91c2V1cCcsIG1vdmVtZW50UmVsZWFzZUhhbmRsZXIpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEJ1dHRvbnMgbmF2aWdhdGlvbiBoYW5kbGVyLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7RXZlbnR9IGV2ZW50XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGJ1dHRvbnNIYW5kbGVyKGV2ZW50KSB7XG5cdFx0XHQvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuXHRcdFx0c3RvcERlZmF1bHQoZXZlbnQpO1xuXHRcdFx0c3dpdGNoICh0aGlzKSB7XG5cdFx0XHRcdGNhc2UgJGZvcndhcmRCdXR0b25bMF06XG5cdFx0XHRcdGNhc2UgJGJhY2t3YXJkQnV0dG9uWzBdOlxuXHRcdFx0XHRcdHNlbGYubW92ZUJ5KCRmb3J3YXJkQnV0dG9uLmlzKHRoaXMpID8gby5tb3ZlQnkgOiAtby5tb3ZlQnkpO1xuXHRcdFx0XHRcdCRkb2Mub24oJ21vdXNldXAnLCBtb3ZlbWVudFJlbGVhc2VIYW5kbGVyKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICRwcmV2QnV0dG9uWzBdOlxuXHRcdFx0XHRcdHNlbGYucHJldigpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJG5leHRCdXR0b25bMF06XG5cdFx0XHRcdFx0c2VsZi5uZXh0KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAkcHJldlBhZ2VCdXR0b25bMF06XG5cdFx0XHRcdFx0c2VsZi5wcmV2UGFnZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJG5leHRQYWdlQnV0dG9uWzBdOlxuXHRcdFx0XHRcdHNlbGYubmV4dFBhZ2UoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBNb3VzZSB3aGVlbCBkZWx0YSBub3JtYWxpemF0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7RXZlbnR9IGV2ZW50XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtJbnR9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gbm9ybWFsaXplV2hlZWxEZWx0YShldmVudCkge1xuXHRcdFx0Ly8gd2hlZWxEZWx0YSBuZWVkZWQgb25seSBmb3IgSUU4LVxuXHRcdFx0c2Nyb2xsaW5nLmN1ckRlbHRhID0gKChvLmhvcml6b250YWwgPyBldmVudC5kZWx0YVkgfHwgZXZlbnQuZGVsdGFYIDogZXZlbnQuZGVsdGFZKSB8fCAtZXZlbnQud2hlZWxEZWx0YSk7XG5cdFx0XHRzY3JvbGxpbmcuY3VyRGVsdGEgLz0gZXZlbnQuZGVsdGFNb2RlID09PSAxID8gMyA6IDEwMDtcblx0XHRcdGlmICghaXRlbU5hdikge1xuXHRcdFx0XHRyZXR1cm4gc2Nyb2xsaW5nLmN1ckRlbHRhO1xuXHRcdFx0fVxuXHRcdFx0dGltZSA9ICtuZXcgRGF0ZSgpO1xuXHRcdFx0aWYgKHNjcm9sbGluZy5sYXN0IDwgdGltZSAtIHNjcm9sbGluZy5yZXNldFRpbWUpIHtcblx0XHRcdFx0c2Nyb2xsaW5nLmRlbHRhID0gMDtcblx0XHRcdH1cblx0XHRcdHNjcm9sbGluZy5sYXN0ID0gdGltZTtcblx0XHRcdHNjcm9sbGluZy5kZWx0YSArPSBzY3JvbGxpbmcuY3VyRGVsdGE7XG5cdFx0XHRpZiAoYWJzKHNjcm9sbGluZy5kZWx0YSkgPCAxKSB7XG5cdFx0XHRcdHNjcm9sbGluZy5maW5hbERlbHRhID0gMDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNjcm9sbGluZy5maW5hbERlbHRhID0gcm91bmQoc2Nyb2xsaW5nLmRlbHRhIC8gMSk7XG5cdFx0XHRcdHNjcm9sbGluZy5kZWx0YSAlPSAxO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNjcm9sbGluZy5maW5hbERlbHRhO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIE1vdXNlIHNjcm9sbGluZyBoYW5kbGVyLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7RXZlbnR9IGV2ZW50XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHNjcm9sbEhhbmRsZXIoZXZlbnQpIHtcblx0XHRcdC8vIE1hcmsgZXZlbnQgYXMgb3JpZ2luYXRpbmcgaW4gYSBTbHkgaW5zdGFuY2Vcblx0XHRcdGV2ZW50Lm9yaWdpbmFsRXZlbnRbbmFtZXNwYWNlXSA9IHNlbGY7XG5cdFx0XHQvLyBEb24ndCBoaWphY2sgZ2xvYmFsIHNjcm9sbGluZ1xuXHRcdFx0dmFyIHRpbWUgPSArbmV3IERhdGUoKTtcblx0XHRcdGlmIChsYXN0R2xvYmFsV2hlZWwgKyBvLnNjcm9sbEhpamFjayA+IHRpbWUgJiYgJHNjcm9sbFNvdXJjZVswXSAhPT0gZG9jdW1lbnQgJiYgJHNjcm9sbFNvdXJjZVswXSAhPT0gd2luZG93KSB7XG5cdFx0XHRcdGxhc3RHbG9iYWxXaGVlbCA9IHRpbWU7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8vIElnbm9yZSBpZiB0aGVyZSBpcyBubyBzY3JvbGxpbmcgdG8gYmUgZG9uZVxuXHRcdFx0aWYgKCFvLnNjcm9sbEJ5IHx8IHBvcy5zdGFydCA9PT0gcG9zLmVuZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgZGVsdGEgPSBub3JtYWxpemVXaGVlbERlbHRhKGV2ZW50Lm9yaWdpbmFsRXZlbnQpO1xuXHRcdFx0Ly8gVHJhcCBzY3JvbGxpbmcgb25seSB3aGVuIG5lY2Vzc2FyeSBhbmQvb3IgcmVxdWVzdGVkXG5cdFx0XHRpZiAoby5zY3JvbGxUcmFwIHx8IGRlbHRhID4gMCAmJiBwb3MuZGVzdCA8IHBvcy5lbmQgfHwgZGVsdGEgPCAwICYmIHBvcy5kZXN0ID4gcG9zLnN0YXJ0KSB7XG5cdFx0XHRcdHN0b3BEZWZhdWx0KGV2ZW50LCAxKTtcblx0XHRcdH1cblx0XHRcdHNlbGYuc2xpZGVCeShvLnNjcm9sbEJ5ICogZGVsdGEpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFNjcm9sbGJhciBjbGljayBoYW5kbGVyLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7RXZlbnR9IGV2ZW50XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHNjcm9sbGJhckhhbmRsZXIoZXZlbnQpIHtcblx0XHRcdC8vIE9ubHkgY2xpY2tzIG9uIHNjcm9sbCBiYXIuIElnbm9yZSB0aGUgaGFuZGxlLlxuXHRcdFx0aWYgKG8uY2xpY2tCYXIgJiYgZXZlbnQudGFyZ2V0ID09PSAkc2JbMF0pIHtcblx0XHRcdFx0c3RvcERlZmF1bHQoZXZlbnQpO1xuXHRcdFx0XHQvLyBDYWxjdWxhdGUgbmV3IGhhbmRsZSBwb3NpdGlvbiBhbmQgc3luYyBTTElERUUgdG8gaXRcblx0XHRcdFx0c2xpZGVUbyhoYW5kbGVUb1NsaWRlZSgoby5ob3Jpem9udGFsID8gZXZlbnQucGFnZVggLSAkc2Iub2Zmc2V0KCkubGVmdCA6IGV2ZW50LnBhZ2VZIC0gJHNiLm9mZnNldCgpLnRvcCkgLSBoYW5kbGVTaXplIC8gMikpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEtleWJvYXJkIGlucHV0IGhhbmRsZXIuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIHtFdmVudH0gZXZlbnRcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge1ZvaWR9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24ga2V5Ym9hcmRIYW5kbGVyKGV2ZW50KSB7XG5cdFx0XHRpZiAoIW8ua2V5Ym9hcmROYXZCeSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcblx0XHRcdFx0Ly8gTGVmdCBvciBVcFxuXHRcdFx0XHRjYXNlIG8uaG9yaXpvbnRhbCA/IDM3IDogMzg6XG5cdFx0XHRcdFx0c3RvcERlZmF1bHQoZXZlbnQpO1xuXHRcdFx0XHRcdHNlbGZbby5rZXlib2FyZE5hdkJ5ID09PSAncGFnZXMnID8gJ3ByZXZQYWdlJyA6ICdwcmV2J10oKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHQvLyBSaWdodCBvciBEb3duXG5cdFx0XHRcdGNhc2Ugby5ob3Jpem9udGFsID8gMzkgOiA0MDpcblx0XHRcdFx0XHRzdG9wRGVmYXVsdChldmVudCk7XG5cdFx0XHRcdFx0c2VsZltvLmtleWJvYXJkTmF2QnkgPT09ICdwYWdlcycgPyAnbmV4dFBhZ2UnIDogJ25leHQnXSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENsaWNrIG9uIGl0ZW0gYWN0aXZhdGlvbiBoYW5kbGVyLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7RXZlbnR9IGV2ZW50XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlSGFuZGxlcihldmVudCkge1xuXHRcdFx0Lypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cblxuXHRcdFx0Ly8gSWdub3JlIGNsaWNrcyBvbiBpbnRlcmFjdGl2ZSBlbGVtZW50cy5cblx0XHRcdGlmIChpc0ludGVyYWN0aXZlKHRoaXMpKSB7XG5cdFx0XHRcdGV2ZW50Lm9yaWdpbmFsRXZlbnRbbmFtZXNwYWNlICsgJ2lnbm9yZSddID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZ25vcmUgZXZlbnRzIHRoYXQ6XG5cdFx0XHQvLyAtIGFyZSBub3Qgb3JpZ2luYXRpbmcgZnJvbSBkaXJlY3QgU0xJREVFIGNoaWxkcmVuXG5cdFx0XHQvLyAtIG9yaWdpbmF0ZWQgZnJvbSBpbnRlcmFjdGl2ZSBlbGVtZW50c1xuXHRcdFx0aWYgKHRoaXMucGFyZW50Tm9kZSAhPT0gJHNsaWRlZVswXSB8fCBldmVudC5vcmlnaW5hbEV2ZW50W25hbWVzcGFjZSArICdpZ25vcmUnXSkgcmV0dXJuO1xuXG5cdFx0XHRzZWxmLmFjdGl2YXRlKHRoaXMpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENsaWNrIG9uIHBhZ2UgYnV0dG9uIGhhbmRsZXIuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBhY3RpdmF0ZVBhZ2VIYW5kbGVyKCkge1xuXHRcdFx0Lypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cblx0XHRcdC8vIEFjY2VwdCBvbmx5IGV2ZW50cyBmcm9tIGRpcmVjdCBwYWdlcyBiYXIgY2hpbGRyZW4uXG5cdFx0XHRpZiAodGhpcy5wYXJlbnROb2RlID09PSAkcGJbMF0pIHtcblx0XHRcdFx0c2VsZi5hY3RpdmF0ZVBhZ2UoJHBhZ2VzLmluZGV4KHRoaXMpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBQYXVzZSBvbiBob3ZlciBoYW5kbGVyLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7RXZlbnR9IGV2ZW50XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHBhdXNlT25Ib3ZlckhhbmRsZXIoZXZlbnQpIHtcblx0XHRcdGlmIChvLnBhdXNlT25Ib3Zlcikge1xuXHRcdFx0XHRzZWxmW2V2ZW50LnR5cGUgPT09ICdtb3VzZWVudGVyJyA/ICdwYXVzZScgOiAncmVzdW1lJ10oMik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlciBjYWxsYmFja3MgZm9yIGV2ZW50LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBuYW1lIEV2ZW50IG5hbWUuXG5cdFx0ICogQHBhcmFtICB7TWl4ZWR9ICBhcmdYIEFyZ3VtZW50cyBwYXNzZWQgdG8gY2FsbGJhY2tzLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Vm9pZH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiB0cmlnZ2VyKG5hbWUsIGFyZzEpIHtcblx0XHRcdGlmIChjYWxsYmFja3NbbmFtZV0pIHtcblx0XHRcdFx0bCA9IGNhbGxiYWNrc1tuYW1lXS5sZW5ndGg7XG5cdFx0XHRcdC8vIENhbGxiYWNrcyB3aWxsIGJlIHN0b3JlZCBhbmQgZXhlY3V0ZWQgZnJvbSBhIHRlbXBvcmFyeSBhcnJheSB0byBub3Rcblx0XHRcdFx0Ly8gYnJlYWsgdGhlIGV4ZWN1dGlvbiBxdWV1ZSB3aGVuIG9uZSBvZiB0aGUgY2FsbGJhY2tzIHVuYmluZHMgaXRzZWxmLlxuXHRcdFx0XHR0bXBBcnJheS5sZW5ndGggPSAwO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0dG1wQXJyYXkucHVzaChjYWxsYmFja3NbbmFtZV1baV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEV4ZWN1dGUgdGhlIGNhbGxiYWNrc1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0dG1wQXJyYXlbaV0uY2FsbChzZWxmLCBuYW1lLCBhcmcxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIERlc3Ryb3lzIGluc3RhbmNlIGFuZCBldmVyeXRoaW5nIGl0IGNyZWF0ZWQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtWb2lkfVxuXHRcdCAqL1xuXHRcdHNlbGYuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vIFJlbW92ZSB0aGUgcmVmZXJlbmNlIHRvIGl0c2VsZlxuXHRcdFx0U2x5LnJlbW92ZUluc3RhbmNlKGZyYW1lKTtcblxuXHRcdFx0Ly8gVW5iaW5kIGFsbCBldmVudHNcblx0XHRcdCRzY3JvbGxTb3VyY2Vcblx0XHRcdFx0LmFkZCgkaGFuZGxlKVxuXHRcdFx0XHQuYWRkKCRzYilcblx0XHRcdFx0LmFkZCgkcGIpXG5cdFx0XHRcdC5hZGQoJGZvcndhcmRCdXR0b24pXG5cdFx0XHRcdC5hZGQoJGJhY2t3YXJkQnV0dG9uKVxuXHRcdFx0XHQuYWRkKCRwcmV2QnV0dG9uKVxuXHRcdFx0XHQuYWRkKCRuZXh0QnV0dG9uKVxuXHRcdFx0XHQuYWRkKCRwcmV2UGFnZUJ1dHRvbilcblx0XHRcdFx0LmFkZCgkbmV4dFBhZ2VCdXR0b24pXG5cdFx0XHRcdC5vZmYoJy4nICsgbmFtZXNwYWNlKTtcblxuXHRcdFx0Ly8gVW5iaW5kaW5nIHNwZWNpZmljYWxseSBhcyB0byBub3QgbnVrZSBvdXQgb3RoZXIgaW5zdGFuY2VzXG5cdFx0XHQkZG9jLm9mZigna2V5ZG93bicsIGtleWJvYXJkSGFuZGxlcik7XG5cblx0XHRcdC8vIFJlbW92ZSBjbGFzc2VzXG5cdFx0XHQkcHJldkJ1dHRvblxuXHRcdFx0XHQuYWRkKCRuZXh0QnV0dG9uKVxuXHRcdFx0XHQuYWRkKCRwcmV2UGFnZUJ1dHRvbilcblx0XHRcdFx0LmFkZCgkbmV4dFBhZ2VCdXR0b24pXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyhvLmRpc2FibGVkQ2xhc3MpO1xuXG5cdFx0XHRpZiAoJGl0ZW1zICYmIHJlbC5hY3RpdmVJdGVtICE9IG51bGwpIHtcblx0XHRcdFx0JGl0ZW1zLmVxKHJlbC5hY3RpdmVJdGVtKS5yZW1vdmVDbGFzcyhvLmFjdGl2ZUNsYXNzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVtb3ZlIHBhZ2UgaXRlbXNcblx0XHRcdCRwYi5lbXB0eSgpO1xuXG5cdFx0XHRpZiAoIXBhcmFsbGF4KSB7XG5cdFx0XHRcdC8vIFVuYmluZCBldmVudHMgZnJvbSBmcmFtZVxuXHRcdFx0XHQkZnJhbWUub2ZmKCcuJyArIG5hbWVzcGFjZSk7XG5cdFx0XHRcdC8vIFJlc3RvcmUgb3JpZ2luYWwgc3R5bGVzXG5cdFx0XHRcdGZyYW1lU3R5bGVzLnJlc3RvcmUoKTtcblx0XHRcdFx0c2xpZGVlU3R5bGVzLnJlc3RvcmUoKTtcblx0XHRcdFx0c2JTdHlsZXMucmVzdG9yZSgpO1xuXHRcdFx0XHRoYW5kbGVTdHlsZXMucmVzdG9yZSgpO1xuXHRcdFx0XHQvLyBSZW1vdmUgdGhlIGluc3RhbmNlIGZyb20gZWxlbWVudCBkYXRhIHN0b3JhZ2Vcblx0XHRcdFx0JC5yZW1vdmVEYXRhKGZyYW1lLCBuYW1lc3BhY2UpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDbGVhbiB1cCBjb2xsZWN0aW9uc1xuXHRcdFx0aXRlbXMubGVuZ3RoID0gcGFnZXMubGVuZ3RoID0gMDtcblx0XHRcdGxhc3QgPSB7fTtcblxuXHRcdFx0Ly8gUmVzZXQgaW5pdGlhbGl6ZWQgc3RhdHVzIGFuZCByZXR1cm4gdGhlIGluc3RhbmNlXG5cdFx0XHRzZWxmLmluaXRpYWxpemVkID0gMDtcblx0XHRcdHJldHVybiBzZWxmO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBJbml0aWFsaXplLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdHNlbGYuaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChzZWxmLmluaXRpYWxpemVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRGlzYWxsb3cgbXVsdGlwbGUgaW5zdGFuY2VzIG9uIHRoZSBzYW1lIGVsZW1lbnRcblx0XHRcdGlmIChTbHkuZ2V0SW5zdGFuY2UoZnJhbWUpKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIGFscmVhZHkgYSBTbHkgaW5zdGFuY2Ugb24gdGhpcyBlbGVtZW50Jyk7XG5cblx0XHRcdC8vIFN0b3JlIHRoZSByZWZlcmVuY2UgdG8gaXRzZWxmXG5cdFx0XHRTbHkuc3RvcmVJbnN0YW5jZShmcmFtZSwgc2VsZik7XG5cblx0XHRcdC8vIFJlZ2lzdGVyIGNhbGxiYWNrcyBtYXBcblx0XHRcdHNlbGYub24oY2FsbGJhY2tNYXApO1xuXG5cdFx0XHQvLyBTYXZlIHN0eWxlc1xuXHRcdFx0dmFyIGhvbGRlclByb3BzID0gWydvdmVyZmxvdycsICdwb3NpdGlvbiddO1xuXHRcdFx0dmFyIG1vdmFibGVQcm9wcyA9IFsncG9zaXRpb24nLCAnd2Via2l0VHJhbnNmb3JtJywgJ21zVHJhbnNmb3JtJywgJ3RyYW5zZm9ybScsICdsZWZ0JywgJ3RvcCcsICd3aWR0aCcsICdoZWlnaHQnXTtcblx0XHRcdGZyYW1lU3R5bGVzLnNhdmUuYXBwbHkoZnJhbWVTdHlsZXMsIGhvbGRlclByb3BzKTtcblx0XHRcdHNiU3R5bGVzLnNhdmUuYXBwbHkoc2JTdHlsZXMsIGhvbGRlclByb3BzKTtcblx0XHRcdHNsaWRlZVN0eWxlcy5zYXZlLmFwcGx5KHNsaWRlZVN0eWxlcywgbW92YWJsZVByb3BzKTtcblx0XHRcdGhhbmRsZVN0eWxlcy5zYXZlLmFwcGx5KGhhbmRsZVN0eWxlcywgbW92YWJsZVByb3BzKTtcblxuXHRcdFx0Ly8gU2V0IHJlcXVpcmVkIHN0eWxlc1xuXHRcdFx0dmFyICRtb3ZhYmxlcyA9ICRoYW5kbGU7XG5cdFx0XHRpZiAoIXBhcmFsbGF4KSB7XG5cdFx0XHRcdCRtb3ZhYmxlcyA9ICRtb3ZhYmxlcy5hZGQoJHNsaWRlZSk7XG5cdFx0XHRcdCRmcmFtZS5jc3MoJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuXHRcdFx0XHRpZiAoIXRyYW5zZm9ybSAmJiAkZnJhbWUuY3NzKCdwb3NpdGlvbicpID09PSAnc3RhdGljJykge1xuXHRcdFx0XHRcdCRmcmFtZS5jc3MoJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0cmFuc2Zvcm0pIHtcblx0XHRcdFx0aWYgKGdwdUFjY2VsZXJhdGlvbikge1xuXHRcdFx0XHRcdCRtb3ZhYmxlcy5jc3ModHJhbnNmb3JtLCBncHVBY2NlbGVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoJHNiLmNzcygncG9zaXRpb24nKSA9PT0gJ3N0YXRpYycpIHtcblx0XHRcdFx0XHQkc2IuY3NzKCdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRtb3ZhYmxlcy5jc3MoeyBwb3NpdGlvbjogJ2Fic29sdXRlJyB9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTmF2aWdhdGlvbiBidXR0b25zXG5cdFx0XHRpZiAoby5mb3J3YXJkKSB7XG5cdFx0XHRcdCRmb3J3YXJkQnV0dG9uLm9uKG1vdXNlRG93bkV2ZW50LCBidXR0b25zSGFuZGxlcik7XG5cdFx0XHR9XG5cdFx0XHRpZiAoby5iYWNrd2FyZCkge1xuXHRcdFx0XHQkYmFja3dhcmRCdXR0b24ub24obW91c2VEb3duRXZlbnQsIGJ1dHRvbnNIYW5kbGVyKTtcblx0XHRcdH1cblx0XHRcdGlmIChvLnByZXYpIHtcblx0XHRcdFx0JHByZXZCdXR0b24ub24oY2xpY2tFdmVudCwgYnV0dG9uc0hhbmRsZXIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG8ubmV4dCkge1xuXHRcdFx0XHQkbmV4dEJ1dHRvbi5vbihjbGlja0V2ZW50LCBidXR0b25zSGFuZGxlcik7XG5cdFx0XHR9XG5cdFx0XHRpZiAoby5wcmV2UGFnZSkge1xuXHRcdFx0XHQkcHJldlBhZ2VCdXR0b24ub24oY2xpY2tFdmVudCwgYnV0dG9uc0hhbmRsZXIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG8ubmV4dFBhZ2UpIHtcblx0XHRcdFx0JG5leHRQYWdlQnV0dG9uLm9uKGNsaWNrRXZlbnQsIGJ1dHRvbnNIYW5kbGVyKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2Nyb2xsaW5nIG5hdmlnYXRpb25cblx0XHRcdCRzY3JvbGxTb3VyY2Uub24od2hlZWxFdmVudCwgc2Nyb2xsSGFuZGxlcik7XG5cblx0XHRcdC8vIENsaWNraW5nIG9uIHNjcm9sbGJhciBuYXZpZ2F0aW9uXG5cdFx0XHRpZiAoJHNiWzBdKSB7XG5cdFx0XHRcdCRzYi5vbihjbGlja0V2ZW50LCBzY3JvbGxiYXJIYW5kbGVyKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2xpY2sgb24gaXRlbXMgbmF2aWdhdGlvblxuXHRcdFx0aWYgKGl0ZW1OYXYgJiYgby5hY3RpdmF0ZU9uKSB7XG5cdFx0XHRcdCRmcmFtZS5vbihvLmFjdGl2YXRlT24gKyAnLicgKyBuYW1lc3BhY2UsICcqJywgYWN0aXZhdGVIYW5kbGVyKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUGFnZXMgbmF2aWdhdGlvblxuXHRcdFx0aWYgKCRwYlswXSAmJiBvLmFjdGl2YXRlUGFnZU9uKSB7XG5cdFx0XHRcdCRwYi5vbihvLmFjdGl2YXRlUGFnZU9uICsgJy4nICsgbmFtZXNwYWNlLCAnKicsIGFjdGl2YXRlUGFnZUhhbmRsZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEcmFnZ2luZyBuYXZpZ2F0aW9uXG5cdFx0XHQkZHJhZ1NvdXJjZS5vbihkcmFnSW5pdEV2ZW50cywgeyBzb3VyY2U6ICdzbGlkZWUnIH0sIGRyYWdJbml0KTtcblxuXHRcdFx0Ly8gU2Nyb2xsYmFyIGRyYWdnaW5nIG5hdmlnYXRpb25cblx0XHRcdGlmICgkaGFuZGxlKSB7XG5cdFx0XHRcdCRoYW5kbGUub24oZHJhZ0luaXRFdmVudHMsIHsgc291cmNlOiAnaGFuZGxlJyB9LCBkcmFnSW5pdCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEtleWJvYXJkIG5hdmlnYXRpb25cblx0XHRcdCRkb2Mub24oJ2tleWRvd24nLCBrZXlib2FyZEhhbmRsZXIpO1xuXG5cdFx0XHRpZiAoIXBhcmFsbGF4KSB7XG5cdFx0XHRcdC8vIFBhdXNlIG9uIGhvdmVyXG5cdFx0XHRcdCRmcmFtZS5vbignbW91c2VlbnRlci4nICsgbmFtZXNwYWNlICsgJyBtb3VzZWxlYXZlLicgKyBuYW1lc3BhY2UsIHBhdXNlT25Ib3ZlckhhbmRsZXIpO1xuXHRcdFx0XHQvLyBSZXNldCBuYXRpdmUgRlJBTUUgZWxlbWVudCBzY3JvbGxcblx0XHRcdFx0JGZyYW1lLm9uKCdzY3JvbGwuJyArIG5hbWVzcGFjZSwgcmVzZXRTY3JvbGwpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYXJrIGluc3RhbmNlIGFzIGluaXRpYWxpemVkXG5cdFx0XHRzZWxmLmluaXRpYWxpemVkID0gMTtcblxuXHRcdFx0Ly8gTG9hZFxuXHRcdFx0bG9hZCh0cnVlKTtcblxuXHRcdFx0Ly8gSW5pdGlhdGUgYXV0b21hdGljIGN5Y2xpbmdcblx0XHRcdGlmIChvLmN5Y2xlQnkgJiYgIXBhcmFsbGF4KSB7XG5cdFx0XHRcdHNlbGZbby5zdGFydFBhdXNlZCA/ICdwYXVzZScgOiAncmVzdW1lJ10oKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV0dXJuIGluc3RhbmNlXG5cdFx0XHRyZXR1cm4gc2VsZjtcblx0XHR9O1xuXHR9XG5cblx0U2x5LmdldEluc3RhbmNlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gJC5kYXRhKGVsZW1lbnQsIG5hbWVzcGFjZSk7XG5cdH07XG5cblx0U2x5LnN0b3JlSW5zdGFuY2UgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2x5KSB7XG5cdFx0cmV0dXJuICQuZGF0YShlbGVtZW50LCBuYW1lc3BhY2UsIHNseSk7XG5cdH07XG5cblx0U2x5LnJlbW92ZUluc3RhbmNlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gJC5yZW1vdmVEYXRhKGVsZW1lbnQsIG5hbWVzcGFjZSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJldHVybiB0eXBlIG9mIHRoZSB2YWx1ZS5cblx0ICpcblx0ICogQHBhcmFtICB7TWl4ZWR9IHZhbHVlXG5cdCAqXG5cdCAqIEByZXR1cm4ge1N0cmluZ31cblx0ICovXG5cdGZ1bmN0aW9uIHR5cGUodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKS5tYXRjaCgvXFxzKFthLXpdKykvaSlbMV0udG9Mb3dlckNhc2UoKSB8fCAnb2JqZWN0Jztcblx0XHR9XG5cblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV2ZW50IHByZXZlbnREZWZhdWx0ICYgc3RvcFByb3BhZ2F0aW9uIGhlbHBlci5cblx0ICpcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnQgICAgIEV2ZW50IG9iamVjdC5cblx0ICogQHBhcmFtIHtCb29sfSAgbm9CdWJibGVzIENhbmNlbCBldmVudCBidWJibGluZy5cblx0ICpcblx0ICogQHJldHVybiB7Vm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHN0b3BEZWZhdWx0KGV2ZW50LCBub0J1YmJsZXMpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGlmIChub0J1YmJsZXMpIHtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBEaXNhYmxlcyBhbiBldmVudCBpdCB3YXMgdHJpZ2dlcmVkIG9uIGFuZCB1bmJpbmRzIGl0c2VsZi5cblx0ICpcblx0ICogQHBhcmFtICB7RXZlbnR9IGV2ZW50XG5cdCAqXG5cdCAqIEByZXR1cm4ge1ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBkaXNhYmxlT25lRXZlbnQoZXZlbnQpIHtcblx0XHQvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuXHRcdHN0b3BEZWZhdWx0KGV2ZW50LCAxKTtcblx0XHQkKHRoaXMpLm9mZihldmVudC50eXBlLCBkaXNhYmxlT25lRXZlbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlc2V0cyBuYXRpdmUgZWxlbWVudCBzY3JvbGwgdmFsdWVzIHRvIDAuXG5cdCAqXG5cdCAqIEByZXR1cm4ge1ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiByZXNldFNjcm9sbCgpIHtcblx0XHQvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuXHRcdHRoaXMuc2Nyb2xsTGVmdCA9IDA7XG5cdFx0dGhpcy5zY3JvbGxUb3AgPSAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIHZhcmlhYmxlIGlzIGEgbnVtYmVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge01peGVkfSB2YWx1ZVxuXHQgKlxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcblx0XHRyZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSAmJiBpc0Zpbml0ZSh2YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2Ugc3R5bGUgdG8gcGl4ZWxzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gICAkaXRlbSAgICBqUXVlcnkgb2JqZWN0IHdpdGggZWxlbWVudC5cblx0ICogQHBhcmFtIHtQcm9wZXJ0eX0gcHJvcGVydHkgQ1NTIHByb3BlcnR5IHRvIGdldCB0aGUgcGl4ZWxzIGZyb20uXG5cdCAqXG5cdCAqIEByZXR1cm4ge0ludH1cblx0ICovXG5cdGZ1bmN0aW9uIGdldFB4KCRpdGVtLCBwcm9wZXJ0eSkge1xuXHRcdHJldHVybiAwIHwgcm91bmQoU3RyaW5nKCRpdGVtLmNzcyhwcm9wZXJ0eSkpLnJlcGxhY2UoL1teXFwtMC05Ll0vZywgJycpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYWtlIHN1cmUgdGhhdCBudW1iZXIgaXMgd2l0aGluIHRoZSBsaW1pdHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBudW1iZXJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IG1pblxuXHQgKiBAcGFyYW0ge051bWJlcn0gbWF4XG5cdCAqXG5cdCAqIEByZXR1cm4ge051bWJlcn1cblx0ICovXG5cdGZ1bmN0aW9uIHdpdGhpbihudW1iZXIsIG1pbiwgbWF4KSB7XG5cdFx0cmV0dXJuIG51bWJlciA8IG1pbiA/IG1pbiA6IG51bWJlciA+IG1heCA/IG1heCA6IG51bWJlcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBTYXZlcyBlbGVtZW50IHN0eWxlcyBmb3IgbGF0ZXIgcmVzdG9yYXRpb24uXG5cdCAqXG5cdCAqIEV4YW1wbGU6XG5cdCAqICAgdmFyIHN0eWxlcyA9IG5ldyBTdHlsZVJlc3RvcmVyKGZyYW1lKTtcblx0ICogICBzdHlsZXMuc2F2ZSgncG9zaXRpb24nKTtcblx0ICogICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0ICogICBzdHlsZXMucmVzdG9yZSgpOyAvLyByZXN0b3JlcyB0byBzdGF0ZSBiZWZvcmUgdGhlIGFzc2lnbm1lbnQgYWJvdmVcblx0ICpcblx0ICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBTdHlsZVJlc3RvcmVyKGVsZW1lbnQpIHtcblx0XHR2YXIgc2VsZiA9IHt9O1xuXHRcdHNlbGYuc3R5bGUgPSB7fTtcblx0XHRzZWxmLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQubm9kZVR5cGUpIHJldHVybjtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHNlbGYuc3R5bGVbYXJndW1lbnRzW2ldXSA9IGVsZW1lbnQuc3R5bGVbYXJndW1lbnRzW2ldXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzZWxmO1xuXHRcdH07XG5cdFx0c2VsZi5yZXN0b3JlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCFlbGVtZW50IHx8ICFlbGVtZW50Lm5vZGVUeXBlKSByZXR1cm47XG5cdFx0XHRmb3IgKHZhciBwcm9wIGluIHNlbGYuc3R5bGUpIHtcblx0XHRcdFx0aWYgKHNlbGYuc3R5bGUuaGFzT3duUHJvcGVydHkocHJvcCkpIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBzZWxmLnN0eWxlW3Byb3BdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNlbGY7XG5cdFx0fTtcblx0XHRyZXR1cm4gc2VsZjtcblx0fVxuXG5cdC8vIExvY2FsIFdpbmRvd0FuaW1hdGlvblRpbWluZyBpbnRlcmZhY2UgcG9seWZpbGxcblx0KGZ1bmN0aW9uICh3KSB7XG5cdFx0ckFGID0gdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcblx0XHRcdHx8IHcud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG5cdFx0XHR8fCBmYWxsYmFjaztcblxuXHRcdC8qKlxuXHRcdCogRmFsbGJhY2sgaW1wbGVtZW50YXRpb24uXG5cdFx0Ki9cblx0XHR2YXIgcHJldiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdGZ1bmN0aW9uIGZhbGxiYWNrKGZuKSB7XG5cdFx0XHR2YXIgY3VyciA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0dmFyIG1zID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyciAtIHByZXYpKTtcblx0XHRcdHZhciByZXEgPSBzZXRUaW1lb3V0KGZuLCBtcyk7XG5cdFx0XHRwcmV2ID0gY3Vycjtcblx0XHRcdHJldHVybiByZXE7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0KiBDYW5jZWwuXG5cdFx0Ki9cblx0XHR2YXIgY2FuY2VsID0gdy5jYW5jZWxBbmltYXRpb25GcmFtZVxuXHRcdFx0fHwgdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZVxuXHRcdFx0fHwgdy5jbGVhclRpbWVvdXQ7XG5cblx0XHRjQUYgPSBmdW5jdGlvbihpZCl7XG5cdFx0XHRjYW5jZWwuY2FsbCh3LCBpZCk7XG5cdFx0fTtcblx0fSh3aW5kb3cpKTtcblxuXHQvLyBGZWF0dXJlIGRldGVjdHNcblx0KGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgcHJlZml4ZXMgPSBbJycsICdXZWJraXQnLCAnTW96JywgJ21zJywgJ08nXTtcblx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuXHRcdGZ1bmN0aW9uIHRlc3RQcm9wKHByb3ApIHtcblx0XHRcdGZvciAodmFyIHAgPSAwLCBwbCA9IHByZWZpeGVzLmxlbmd0aDsgcCA8IHBsOyBwKyspIHtcblx0XHRcdFx0dmFyIHByZWZpeGVkUHJvcCA9IHByZWZpeGVzW3BdID8gcHJlZml4ZXNbcF0gKyBwcm9wLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zbGljZSgxKSA6IHByb3A7XG5cdFx0XHRcdGlmIChlbC5zdHlsZVtwcmVmaXhlZFByb3BdICE9IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gcHJlZml4ZWRQcm9wO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gR2xvYmFsIHN1cHBvcnQgaW5kaWNhdG9yc1xuXHRcdHRyYW5zZm9ybSA9IHRlc3RQcm9wKCd0cmFuc2Zvcm0nKTtcblx0XHRncHVBY2NlbGVyYXRpb24gPSB0ZXN0UHJvcCgncGVyc3BlY3RpdmUnKSA/ICd0cmFuc2xhdGVaKDApICcgOiAnJztcblx0fSgpKTtcblxuXHQvLyBFeHBvc2UgY2xhc3MgZ2xvYmFsbHlcblx0d1tjbGFzc05hbWVdID0gU2x5O1xuXG5cdC8vIGpRdWVyeSBwcm94eVxuXHQkLmZuW3BsdWdpbk5hbWVdID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrTWFwKSB7XG5cdFx0dmFyIG1ldGhvZCwgbWV0aG9kQXJncztcblxuXHRcdC8vIEF0dHJpYnV0ZXMgbG9naWNcblx0XHRpZiAoISQuaXNQbGFpbk9iamVjdChvcHRpb25zKSkge1xuXHRcdFx0aWYgKHR5cGUob3B0aW9ucykgPT09ICdzdHJpbmcnIHx8IG9wdGlvbnMgPT09IGZhbHNlKSB7XG5cdFx0XHRcdG1ldGhvZCA9IG9wdGlvbnMgPT09IGZhbHNlID8gJ2Rlc3Ryb3knIDogb3B0aW9ucztcblx0XHRcdFx0bWV0aG9kQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cdFx0XHR9XG5cdFx0XHRvcHRpb25zID0ge307XG5cdFx0fVxuXG5cdFx0Ly8gQXBwbHkgdG8gYWxsIGVsZW1lbnRzXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuXHRcdFx0Ly8gQ2FsbCB3aXRoIHByZXZlbnRpb24gYWdhaW5zdCBtdWx0aXBsZSBpbnN0YW50aWF0aW9uc1xuXHRcdFx0dmFyIHBsdWdpbiA9IFNseS5nZXRJbnN0YW5jZShlbGVtZW50KTtcblxuXHRcdFx0aWYgKCFwbHVnaW4gJiYgIW1ldGhvZCkge1xuXHRcdFx0XHQvLyBDcmVhdGUgYSBuZXcgb2JqZWN0IGlmIGl0IGRvZXNuJ3QgZXhpc3QgeWV0XG5cdFx0XHRcdHBsdWdpbiA9IG5ldyBTbHkoZWxlbWVudCwgb3B0aW9ucywgY2FsbGJhY2tNYXApLmluaXQoKTtcblx0XHRcdH0gZWxzZSBpZiAocGx1Z2luICYmIG1ldGhvZCkge1xuXHRcdFx0XHQvLyBDYWxsIG1ldGhvZFxuXHRcdFx0XHRpZiAocGx1Z2luW21ldGhvZF0pIHtcblx0XHRcdFx0XHRwbHVnaW5bbWV0aG9kXS5hcHBseShwbHVnaW4sIG1ldGhvZEFyZ3MpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0Ly8gRGVmYXVsdCBvcHRpb25zXG5cdFNseS5kZWZhdWx0cyA9IHtcblx0XHRzbGlkZWU6ICAgICBudWxsLCAgLy8gU2VsZWN0b3IsIERPTSBlbGVtZW50LCBvciBqUXVlcnkgb2JqZWN0IHdpdGggRE9NIGVsZW1lbnQgcmVwcmVzZW50aW5nIFNMSURFRS5cblx0XHRob3Jpem9udGFsOiBmYWxzZSwgLy8gU3dpdGNoIHRvIGhvcml6b250YWwgbW9kZS5cblxuXHRcdC8vIEl0ZW0gYmFzZWQgbmF2aWdhdGlvblxuXHRcdGl0ZW1OYXY6ICAgICAgICBudWxsLCAgLy8gSXRlbSBuYXZpZ2F0aW9uIHR5cGUuIENhbiBiZTogJ2Jhc2ljJywgJ2NlbnRlcmVkJywgJ2ZvcmNlQ2VudGVyZWQnLlxuXHRcdGl0ZW1TZWxlY3RvcjogICBudWxsLCAgLy8gU2VsZWN0IG9ubHkgaXRlbXMgdGhhdCBtYXRjaCB0aGlzIHNlbGVjdG9yLlxuXHRcdHNtYXJ0OiAgICAgICAgICBmYWxzZSwgLy8gUmVwb3NpdGlvbnMgdGhlIGFjdGl2YXRlZCBpdGVtIHRvIGhlbHAgd2l0aCBmdXJ0aGVyIG5hdmlnYXRpb24uXG5cdFx0YWN0aXZhdGVPbjogICAgIG51bGwsICAvLyBBY3RpdmF0ZSBhbiBpdGVtIG9uIHRoaXMgZXZlbnQuIENhbiBiZTogJ2NsaWNrJywgJ21vdXNlZW50ZXInLCAuLi5cblx0XHRhY3RpdmF0ZU1pZGRsZTogZmFsc2UsIC8vIEFsd2F5cyBhY3RpdmF0ZSB0aGUgaXRlbSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBGUkFNRS4gZm9yY2VDZW50ZXJlZCBvbmx5LlxuXG5cdFx0Ly8gU2Nyb2xsaW5nXG5cdFx0c2Nyb2xsU291cmNlOiBudWxsLCAgLy8gRWxlbWVudCBmb3IgY2F0Y2hpbmcgdGhlIG1vdXNlIHdoZWVsIHNjcm9sbGluZy4gRGVmYXVsdCBpcyBGUkFNRS5cblx0XHRzY3JvbGxCeTogICAgIDAsICAgICAvLyBQaXhlbHMgb3IgaXRlbXMgdG8gbW92ZSBwZXIgb25lIG1vdXNlIHNjcm9sbC4gMCB0byBkaXNhYmxlIHNjcm9sbGluZy5cblx0XHRzY3JvbGxIaWphY2s6IDMwMCwgICAvLyBNaWxsaXNlY29uZHMgc2luY2UgbGFzdCB3aGVlbCBldmVudCBhZnRlciB3aGljaCBpdCBpcyBhY2NlcHRhYmxlIHRvIGhpamFjayBnbG9iYWwgc2Nyb2xsLlxuXHRcdHNjcm9sbFRyYXA6ICAgZmFsc2UsIC8vIERvbid0IGJ1YmJsZSBzY3JvbGxpbmcgd2hlbiBoaXR0aW5nIHNjcm9sbGluZyBsaW1pdHMuXG5cblx0XHQvLyBEcmFnZ2luZ1xuXHRcdGRyYWdTb3VyY2U6ICAgIG51bGwsICAvLyBTZWxlY3RvciBvciBET00gZWxlbWVudCBmb3IgY2F0Y2hpbmcgZHJhZ2dpbmcgZXZlbnRzLiBEZWZhdWx0IGlzIEZSQU1FLlxuXHRcdG1vdXNlRHJhZ2dpbmc6IGZhbHNlLCAvLyBFbmFibGUgbmF2aWdhdGlvbiBieSBkcmFnZ2luZyB0aGUgU0xJREVFIHdpdGggbW91c2UgY3Vyc29yLlxuXHRcdHRvdWNoRHJhZ2dpbmc6IGZhbHNlLCAvLyBFbmFibGUgbmF2aWdhdGlvbiBieSBkcmFnZ2luZyB0aGUgU0xJREVFIHdpdGggdG91Y2ggZXZlbnRzLlxuXHRcdHJlbGVhc2VTd2luZzogIGZhbHNlLCAvLyBFYXNlIG91dCBvbiBkcmFnZ2luZyBzd2luZyByZWxlYXNlLlxuXHRcdHN3aW5nU3BlZWQ6ICAgIDAuMiwgICAvLyBTd2luZyBzeW5jaHJvbml6YXRpb24gc3BlZWQsIHdoZXJlOiAxID0gaW5zdGFudCwgMCA9IGluZmluaXRlLlxuXHRcdGVsYXN0aWNCb3VuZHM6IGZhbHNlLCAvLyBTdHJldGNoIFNMSURFRSBwb3NpdGlvbiBsaW1pdHMgd2hlbiBkcmFnZ2luZyBwYXN0IEZSQU1FIGJvdW5kYXJpZXMuXG5cdFx0ZHJhZ1RocmVzaG9sZDogMywgICAgIC8vIERpc3RhbmNlIGluIHBpeGVscyBiZWZvcmUgU2x5IHJlY29nbml6ZXMgZHJhZ2dpbmcuXG5cdFx0aW50ZXJhY3RpdmU6ICAgbnVsbCwgIC8vIFNlbGVjdG9yIGZvciBzcGVjaWFsIGludGVyYWN0aXZlIGVsZW1lbnRzLlxuXG5cdFx0Ly8gU2Nyb2xsYmFyXG5cdFx0c2Nyb2xsQmFyOiAgICAgbnVsbCwgIC8vIFNlbGVjdG9yIG9yIERPTSBlbGVtZW50IGZvciBzY3JvbGxiYXIgY29udGFpbmVyLlxuXHRcdGRyYWdIYW5kbGU6ICAgIGZhbHNlLCAvLyBXaGV0aGVyIHRoZSBzY3JvbGxiYXIgaGFuZGxlIHNob3VsZCBiZSBkcmFnZ2FibGUuXG5cdFx0ZHluYW1pY0hhbmRsZTogZmFsc2UsIC8vIFNjcm9sbGJhciBoYW5kbGUgcmVwcmVzZW50cyB0aGUgcmF0aW8gYmV0d2VlbiBoaWRkZW4gYW5kIHZpc2libGUgY29udGVudC5cblx0XHRtaW5IYW5kbGVTaXplOiA1MCwgICAgLy8gTWluaW1hbCBoZWlnaHQgb3Igd2lkdGggKGRlcGVuZHMgb24gc2x5IGRpcmVjdGlvbikgb2YgYSBoYW5kbGUgaW4gcGl4ZWxzLlxuXHRcdGNsaWNrQmFyOiAgICAgIGZhbHNlLCAvLyBFbmFibGUgbmF2aWdhdGlvbiBieSBjbGlja2luZyBvbiBzY3JvbGxiYXIuXG5cdFx0c3luY1NwZWVkOiAgICAgMC41LCAgIC8vIEhhbmRsZSA9PiBTTElERUUgc3luY2hyb25pemF0aW9uIHNwZWVkLCB3aGVyZTogMSA9IGluc3RhbnQsIDAgPSBpbmZpbml0ZS5cblxuXHRcdC8vIFBhZ2VzYmFyXG5cdFx0cGFnZXNCYXI6ICAgICAgIG51bGwsIC8vIFNlbGVjdG9yIG9yIERPTSBlbGVtZW50IGZvciBwYWdlcyBiYXIgY29udGFpbmVyLlxuXHRcdGFjdGl2YXRlUGFnZU9uOiBudWxsLCAvLyBFdmVudCB1c2VkIHRvIGFjdGl2YXRlIHBhZ2UuIENhbiBiZTogY2xpY2ssIG1vdXNlZW50ZXIsIC4uLlxuXHRcdHBhZ2VCdWlsZGVyOiAgICAgICAgICAvLyBQYWdlIGl0ZW0gZ2VuZXJhdG9yLlxuXHRcdFx0ZnVuY3Rpb24gKGluZGV4KSB7XG5cdFx0XHRcdHJldHVybiAnPGxpPicgKyAoaW5kZXggKyAxKSArICc8L2xpPic7XG5cdFx0XHR9LFxuXG5cdFx0Ly8gTmF2aWdhdGlvbiBidXR0b25zXG5cdFx0Zm9yd2FyZDogIG51bGwsIC8vIFNlbGVjdG9yIG9yIERPTSBlbGVtZW50IGZvciBcImZvcndhcmQgbW92ZW1lbnRcIiBidXR0b24uXG5cdFx0YmFja3dhcmQ6IG51bGwsIC8vIFNlbGVjdG9yIG9yIERPTSBlbGVtZW50IGZvciBcImJhY2t3YXJkIG1vdmVtZW50XCIgYnV0dG9uLlxuXHRcdHByZXY6ICAgICBudWxsLCAvLyBTZWxlY3RvciBvciBET00gZWxlbWVudCBmb3IgXCJwcmV2aW91cyBpdGVtXCIgYnV0dG9uLlxuXHRcdG5leHQ6ICAgICBudWxsLCAvLyBTZWxlY3RvciBvciBET00gZWxlbWVudCBmb3IgXCJuZXh0IGl0ZW1cIiBidXR0b24uXG5cdFx0cHJldlBhZ2U6IG51bGwsIC8vIFNlbGVjdG9yIG9yIERPTSBlbGVtZW50IGZvciBcInByZXZpb3VzIHBhZ2VcIiBidXR0b24uXG5cdFx0bmV4dFBhZ2U6IG51bGwsIC8vIFNlbGVjdG9yIG9yIERPTSBlbGVtZW50IGZvciBcIm5leHQgcGFnZVwiIGJ1dHRvbi5cblxuXHRcdC8vIEF1dG9tYXRlZCBjeWNsaW5nXG5cdFx0Y3ljbGVCeTogICAgICAgbnVsbCwgIC8vIEVuYWJsZSBhdXRvbWF0aWMgY3ljbGluZyBieSAnaXRlbXMnIG9yICdwYWdlcycuXG5cdFx0Y3ljbGVJbnRlcnZhbDogNTAwMCwgIC8vIERlbGF5IGJldHdlZW4gY3ljbGVzIGluIG1pbGxpc2Vjb25kcy5cblx0XHRwYXVzZU9uSG92ZXI6ICBmYWxzZSwgLy8gUGF1c2UgY3ljbGluZyB3aGVuIG1vdXNlIGhvdmVycyBvdmVyIHRoZSBGUkFNRS5cblx0XHRzdGFydFBhdXNlZDogICBmYWxzZSwgLy8gV2hldGhlciB0byBzdGFydCBpbiBwYXVzZWQgc2F0ZS5cblxuXHRcdC8vIE1peGVkIG9wdGlvbnNcblx0XHRtb3ZlQnk6ICAgICAgICAzMDAsICAgICAvLyBTcGVlZCBpbiBwaXhlbHMgcGVyIHNlY29uZCB1c2VkIGJ5IGZvcndhcmQgYW5kIGJhY2t3YXJkIGJ1dHRvbnMuXG5cdFx0c3BlZWQ6ICAgICAgICAgMCwgICAgICAgLy8gQW5pbWF0aW9ucyBzcGVlZCBpbiBtaWxsaXNlY29uZHMuIDAgdG8gZGlzYWJsZSBhbmltYXRpb25zLlxuXHRcdGVhc2luZzogICAgICAgICdzd2luZycsIC8vIEVhc2luZyBmb3IgZHVyYXRpb24gYmFzZWQgKHR3ZWVuaW5nKSBhbmltYXRpb25zLlxuXHRcdHN0YXJ0QXQ6ICAgICAgIG51bGwsICAgIC8vIFN0YXJ0aW5nIG9mZnNldCBpbiBwaXhlbHMgb3IgaXRlbXMuXG5cdFx0a2V5Ym9hcmROYXZCeTogbnVsbCwgICAgLy8gRW5hYmxlIGtleWJvYXJkIG5hdmlnYXRpb24gYnkgJ2l0ZW1zJyBvciAncGFnZXMnLlxuXG5cdFx0Ly8gQ2xhc3Nlc1xuXHRcdGRyYWdnZWRDbGFzczogICdkcmFnZ2VkJywgLy8gQ2xhc3MgZm9yIGRyYWdnZWQgZWxlbWVudHMgKGxpa2UgU0xJREVFIG9yIHNjcm9sbGJhciBoYW5kbGUpLlxuXHRcdGFjdGl2ZUNsYXNzOiAgICdhY3RpdmUnLCAgLy8gQ2xhc3MgZm9yIGFjdGl2ZSBpdGVtcyBhbmQgcGFnZXMuXG5cdFx0ZGlzYWJsZWRDbGFzczogJ2Rpc2FibGVkJyAvLyBDbGFzcyBmb3IgZGlzYWJsZWQgbmF2aWdhdGlvbiBlbGVtZW50cy5cblx0fTtcbn0oalF1ZXJ5LCB3aW5kb3cpKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3Jlc291cmNlcy9hc3NldHMvanMvc2x5LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==