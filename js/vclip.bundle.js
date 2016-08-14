(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VClip"] = factory();
	else
		root["VClip"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"!!vue-style-loader!css-loader!./../../../node_modules/vue-loader/lib/style-rewriter.js!./../../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./vclip.vue\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	__vue_script__ = __webpack_require__(1)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] vue/vclip.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(2)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-619ef8c8/vclip.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    props: {
	        class: {
	            type: String,
	            default: ''
	        },
	        play: {
	            type: Boolean,
	            default: true
	        },
	        speed: {
	            type: Number,
	            default: 300
	        },
	        loop: {
	            type: Boolean,
	            default: true
	        },
	        resize: {
	            type: Boolean,
	            default: false
	        },
	        playSection: {
	            type: Array,
	            default: function _default() {
	                return [];
	            }
	        },

	        api: {
	            type: Object,
	            default: function _default() {
	                return {};
	            }
	        }

	    },
	    data: function data() {
	        return {
	            eles: [],
	            frameWidth: 0,
	            frameHeight: 0,
	            totalFrames: 0,
	            currentFrame: 0,
	            lastFrame: 0,
	            frames: [],
	            playFrames: [],
	            playIndex: 0,
	            translateX: 0
	        };
	    },
	    methods: {
	        initData: function initData() {
	            this.eles = this.$els.wrapper.children;
	            this.totalFrames = this.eles.length;

	            this.frameWidth = this.$els.container.clientWidth;
	            this.frameHeight = this.$els.container.clientHeight;

	            if (this.playSection.length == 0) {
	                this.playSection = [1, this.totalFrames];
	            }
	            this.setPlayFrames(this.playSection);
	        },
	        setPlayFrames: function setPlayFrames(playSection) {
	            if (playSection.length == 1) {
	                this.playFrames[0] = playSection[0];
	            }
	            if (playSection.length == 2) {
	                for (var i = playSection[0]; i <= playSection[1]; i++) {
	                    this.playFrames.push(i);
	                }
	            }
	            if (playSection.length > 2) {
	                this.playFrames = playSection;
	            }
	        },
	        goFrame: function goFrame(framePage) {
	            if (framePage >= 1 && framePage <= this.totalFrames) {
	                this.currentFrame = framePage;
	                this.translateX = -(framePage - 1) * this.frameWidth;
	                this.$emit('on-frame-changed', this.currentFrame);
	            } else {
	                throw new Error('out of range!');
	            }
	        },
	        nextFrame: function nextFrame() {
	            if (this.currentFrame >= this.totalFrames) {
	                this.goFrame(1);
	            } else {
	                this.goFrame(this.currentFrame + 1);
	            }
	        },
	        prevFrame: function prevFrame() {
	            if (this.currentFrame <= 1) {
	                this.goFrame(this.totalFrames);
	            } else {
	                this.goFrame(this.currentFrame - 1);
	            }
	        },
	        startPlay: function startPlay() {
	            var me = this;
	            if (me.loop) {
	                me.intervalId = setInterval(function () {
	                    if (me.playIndex >= me.playFrames.length) {
	                        me.playIndex = 0;
	                    }
	                    me.goFrame(me.playFrames[me.playIndex]);
	                    me.playIndex++;
	                }, me.speed);
	            } else {
	                me.intervalId = setInterval(function () {
	                    if (me.playIndex >= me.playFrames.length) {
	                        clearInterval(me.intervalId);
	                        me.play = false;
	                        return;
	                    }
	                    me.goFrame(me.playFrames[me.playIndex]);
	                    me.playIndex++;
	                }, me.speed);
	            }
	            this.$emit('on-play-start', this.currentFrame);
	            console.log('on-play-start');
	            return true;
	        },
	        stopPlay: function stopPlay() {
	            if (this.intervalId) {
	                clearInterval(this.intervalId);
	            }
	            this.$emit('on-play-stop', this.currentFrame);
	            console.log('on-play-stop');
	            return true;
	        },
	        resizeContent: function resizeContent() {
	            var frameEles = null;
	            var maxWidth = 0,
	                maxHeight = 0,
	                ratio = 0;
	            var frameRatio = this.frameHeight / this.frameWidth;
	            var scale = 0,
	                newWidth = 0,
	                newHeight = 0;
	            for (var i = 0; i < this.totalFrames; i++) {
	                frameEles = this.eles[i].children;
	                maxWidth = 0;
	                maxHeight = 0;
	                ratio = 0;
	                for (var j = 0; j < frameEles.length; j++) {
	                    if (frameEles[j].clientWidth > maxWidth) {
	                        maxWidth = frameEles[j].clientWidth;
	                    }
	                    if (frameEles[j].clientHeight > maxHeight) {
	                        maxHeight = frameEles[j].clientHeight;
	                    }
	                }
	                ratio = maxHeight / maxWidth;
	                newWidth = this.frameWidth;
	                if (ratio > frameRatio) {
	                    newHeight = this.frameHeight;
	                    newWidth = newHeight / ratio;
	                } else {
	                    newWidth = this.frameWidth;
	                    newHeight = newWidth * ratio;
	                }
	                scale = newWidth / maxWidth;
	                this.eles[i].style.transform = 'scale(' + scale + ')';
	            }
	            this.$emit('on-resized');
	        },
	        exposeAPI: function exposeAPI() {
	            this.api.goFrame = this.goFrame;
	            this.api.nextFrame = this.nextFrame;
	            this.api.prevFrame = this.prevFrame;
	        }

	    },
	    ready: function ready() {
	        this.initData();
	        this.exposeAPI();
	        if (this.resize) {
	            this.resizeContent();
	        }
	        if (this.play) {
	            this.startPlay();
	        }
	    },
	    watch: {
	        'play': function play(val) {
	            if (val) {
	                this.startPlay();
	            } else {
	                this.stopPlay();
	            }
	            this.$emit('on-play-changed', this.play);
	        },
	        'speed': function speed(val) {
	            if (this.play) {
	                this.stopPlay();
	                this.startPlay();
	            }
	            this.$emit('on-speed-changed', this.speed);
	        }
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<div :class=\"['vclip-container',class == ''? 'vclip-container-size': class]\" v-el:container>\n    <div class=\"vclip-wrapper\"\n         v-el:wrapper\n         :style=\"{transform: 'translate3d(' + translateX + 'px, 0, 0)'}\"\n         >\n        <slot></slot>\n    </div>\n</div>\n";

/***/ }
/******/ ])
});
;