webpackJsonp([18],{

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(166)(_jquery2.default);
	var dependArr = [__webpack_require__(174).default.name, __webpack_require__(175).name];
	exports.default = {
	  module: angular.module('organicListCtrl', dependArr).controller('organicListController', ['$scope', 'organicListService', '$state', '$timeout', 'FileUploader', 'util', controller]),
	  template: __webpack_require__(176)
	};

	function controller(_, service, $state, $timeout, FileUploader, util) {
	  'use strict';

	  var o,
	      cfg = {},
	      timer,
	      isAllProList = 1;

	  var queryParam = function queryParam() {
	    return {
	      order: 'desc',
	      orderBy: 'modify_time',
	      partnerType: '',
	      partnerCode: '',
	      apiCode: '',
	      pageNo: 1,
	      pageSize: 10
	    };
	  };

	  //查询参数
	  _.query = queryParam();

	  _.selectOption = {
	    "type": "select",
	    "name": "Service",
	    "value": "10条",
	    "values": ["10条", "20条", "30条", "40条", "50条"]
	  };

	  /**
	   * 选择每页显示条数
	   * @param {JSON} data
	   */
	  _.selectChange = function (data) {
	    var num = parseInt(data.replace(/(\d+)\D/, '$1'));
	    _.query.pageSize = num;
	    _.selectOption.value = num + '条';
	    _.query.pageNo = 1;
	    o.laterQueryList();
	  };

	  //查询
	  _.searchStart = function () {
	    o.laterQueryList();
	  };

	  _.clearSearch = function () {
	    _.query = queryParam();
	    _.selectOption.value = _.query.pageSize + '\u6761';
	    o.laterQueryList();
	  };

	  //查看详情
	  _.viewDetail = function (item) {
	    var param = {
	      "id": item.id,
	      "isView": true
	    };
	    $state.go('configuration.newOrganic', { "object": encodeURI(JSON.stringify(param)) });
	  };

	  //编辑
	  _.edit = function (item) {
	    var param = {
	      "id": item.id,
	      "upDate": true
	    };
	    $state.go('configuration.newOrganic', { "object": encodeURI(JSON.stringify(param)) });
	  };

	  _.dialog = { show: false };
	  _.closeDialog = function () {
	    _.dialog.show = false;
	  };

	  _.upload = function (item) {
	    _.upLoadParam = item;
	    _.dialog.show = true;
	  };

	  /**
	   * 上传
	   */
	  var uploader = _.uploader = service.upService(FileUploader, _.item);
	  uploader.filters.push({
	    name: 'customFilter',
	    fn: function fn(item /*{File|FileLikeObject}*/, options) {
	      return this.queue.length < 10;
	    }
	  });
	  // CALLBACKS
	  uploader.onProgressAll = function (progress) {
	    progress = 100;
	    console.info('onProgressAll', progress);
	  };
	  uploader.onSuccessItem = function (fileItem, response, status, headers) {
	    $timeout(function () {
	      alert(response.responseMsg);
	      uploader.clearQueue(_.dialog);
	      location.reload();
	    }, 500);
	  };

	  /**
	   * 下载
	   * @param {Object} item
	   */
	  _.downLoad = function (item) {
	    service.downLoadFile(item);
	  };

	  /**
	          * 时间排序
	          */
	  _.sortTime = function (sorts) {
	    _.query.order = sorts.order;
	    _.query.orderBy = sorts.sortKey;
	  };
	  /**
	   * 启用/停用
	   * @param {Object} item
	   */
	  _.isFreeze = function (item) {
	    var cfg = {
	      isCooperation: '',
	      id: item.id
	    };
	    if (item.isCooperation == '1') {
	      cfg.isCooperation = '0';
	    } else {
	      cfg.isCooperation = '1';
	    }

	    service.freezeCtrl(cfg).then(function (data) {
	      o.getUserInfoList();
	    }, function (reason) {
	      alert(reason.responseMsg);
	    });
	  };

	  //过滤列表添加默认选项
	  function unshiftOption(arrList, shiftOption) {
	    if (Array.isArray(arrList)) {
	      arrList.unshift(shiftOption);
	    }
	    return arrList;
	  }

	  function paddingData(data) {
	    var partnerTypeList = [{ typeCode: '0', typeName: '资金方' }, { typeCode: '1', typeName: '资金资产方' }];

	    return {
	      partnerTypeList: unshiftOption(partnerTypeList, {
	        typeCode: '',
	        typeName: '请选择'
	      }),
	      partnerList: unshiftOption(data.partnerList, {
	        partnerCode: '',
	        partnerName: '请选择'
	      })
	    };
	  }

	  //获取列表
	  o = {
	    laterQueryList: function laterQueryList() {
	      var that = this;
	      if (timer) {
	        clearTimeout(timer);
	      }
	      timer = setTimeout(function () {
	        that.getUserInfoList();
	      }, 200);
	    },
	    getUserInfoList: function getUserInfoList(config) {
	      var param = JSON.parse(JSON.stringify(_.query));
	      for (var item in param) {
	        if (item == 'isFirst') continue;
	        if (!param[item]) delete param[item];
	      }
	      service.getLoanMenInfoList(param).then(function (data) {
	        _.baseSelectData = paddingData(data);
	        _.loanMenInfo = data.page.result || [];
	        //获取过滤产品
	        _.proArr = {
	          proList: data.partnerList
	        };
	        _.creatProList = true;

	        //页码问题
	        if (data.page.result.length == 0 && _.query.pageNo !== 1) {
	          _.query.pageNo = _.query.pageNo - 1;
	          o.getUserInfoList();
	        }

	        _.count = data.page.totalCount;
	        _.showPage = 'visible';
	        _.currentPage = data.page.pageNo;
	        //多余3000条或等于0条不能导出
	        _.allExportFlag = data.page.totalCount && data.page.totalCount;
	        _.$broadcast('EVT_PAGE_CHANGE', { 'total': data.page.totalPages, 'current': _.currentPage });
	      }, function (data) {
	        alert(data.responseMsg);
	      });
	    },
	    init: function init() {
	      this.getUserInfoList();
	      _.lodingMask = true;
	    }
	  };
	  o.init();
	  //监听page发回的事件
	  _.$on('EVT_PAGE_SELECTED', function (evt, data) {
	    _.query.pageNo = data.pageSelectedNum;
	    o.getUserInfoList();
	    _.query.pageNo = 1; //默认值
	  });
	}

/***/ },

/***/ 166:
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Bootstrap v3.3.6 (http://getbootstrap.com)
	 * Copyright 2011-2015 Twitter, Inc.
	 * Licensed under the MIT license
	 */
	__webpack_require__(167);
	__webpack_require__(169);
	__webpack_require__(173);
	__webpack_require__(172);
	__webpack_require__(171);
	__webpack_require__(170);

	function bootstrapM(jQuery){
		if (typeof jQuery === 'undefined') {
		  throw new Error('Bootstrap\'s JavaScript requires jQuery')
		}

		+function ($) {
		  'use strict';
		  var version = $.fn.jquery.split(' ')[0].split('.')
		  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
		    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
		  }
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: transition.js v3.3.6
		 * http://getbootstrap.com/javascript/#transitions
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
		  // ============================================================
		
		  function transitionEnd() {
		    var el = document.createElement('bootstrap')
		
		    var transEndEventNames = {
		      WebkitTransition : 'webkitTransitionEnd',
		      MozTransition    : 'transitionend',
		      OTransition      : 'oTransitionEnd otransitionend',
		      transition       : 'transitionend'
		    }
		
		    for (var name in transEndEventNames) {
		      if (el.style[name] !== undefined) {
		        return { end: transEndEventNames[name] }
		      }
		    }
		
		    return false // explicit for ie8 (  ._.)
		  }
		
		  // http://blog.alexmaccaw.com/css-transitions
		  $.fn.emulateTransitionEnd = function (duration) {
		    var called = false
		    var $el = this
		    $(this).one('bsTransitionEnd', function () { called = true })
		    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
		    setTimeout(callback, duration)
		    return this
		  }
		
		  $(function () {
		    $.support.transition = transitionEnd()
		
		    if (!$.support.transition) return
		
		    $.event.special.bsTransitionEnd = {
		      bindType: $.support.transition.end,
		      delegateType: $.support.transition.end,
		      handle: function (e) {
		        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
		      }
		    }
		  })
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: alert.js v3.3.6
		 * http://getbootstrap.com/javascript/#alerts
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // ALERT CLASS DEFINITION
		  // ======================
		
		  var dismiss = '[data-dismiss="alert"]'
		  var Alert   = function (el) {
		    $(el).on('click', dismiss, this.close)
		  }
		
		  Alert.VERSION = '3.3.6'
		
		  Alert.TRANSITION_DURATION = 150
		
		  Alert.prototype.close = function (e) {
		    var $this    = $(this)
		    var selector = $this.attr('data-target')
		
		    if (!selector) {
		      selector = $this.attr('href')
		      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
		    }
		
		    var $parent = $(selector)
		
		    if (e) e.preventDefault()
		
		    if (!$parent.length) {
		      $parent = $this.closest('.alert')
		    }
		
		    $parent.trigger(e = $.Event('close.bs.alert'))
		
		    if (e.isDefaultPrevented()) return
		
		    $parent.removeClass('in')
		
		    function removeElement() {
		      // detach from parent, fire event then clean up data
		      $parent.detach().trigger('closed.bs.alert').remove()
		    }
		
		    $.support.transition && $parent.hasClass('fade') ?
		      $parent
		        .one('bsTransitionEnd', removeElement)
		        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
		      removeElement()
		  }
		
		
		  // ALERT PLUGIN DEFINITION
		  // =======================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this = $(this)
		      var data  = $this.data('bs.alert')
		
		      if (!data) $this.data('bs.alert', (data = new Alert(this)))
		      if (typeof option == 'string') data[option].call($this)
		    })
		  }
		
		  var old = $.fn.alert
		
		  $.fn.alert             = Plugin
		  $.fn.alert.Constructor = Alert
		
		
		  // ALERT NO CONFLICT
		  // =================
		
		  $.fn.alert.noConflict = function () {
		    $.fn.alert = old
		    return this
		  }
		
		
		  // ALERT DATA-API
		  // ==============
		
		  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: button.js v3.3.6
		 * http://getbootstrap.com/javascript/#buttons
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // BUTTON PUBLIC CLASS DEFINITION
		  // ==============================
		
		  var Button = function (element, options) {
		    this.$element  = $(element)
		    this.options   = $.extend({}, Button.DEFAULTS, options)
		    this.isLoading = false
		  }
		
		  Button.VERSION  = '3.3.6'
		
		  Button.DEFAULTS = {
		    loadingText: 'loading...'
		  }
		
		  Button.prototype.setState = function (state) {
		    var d    = 'disabled'
		    var $el  = this.$element
		    var val  = $el.is('input') ? 'val' : 'html'
		    var data = $el.data()
		
		    state += 'Text'
		
		    if (data.resetText == null) $el.data('resetText', $el[val]())
		
		    // push to event loop to allow forms to submit
		    setTimeout($.proxy(function () {
		      $el[val](data[state] == null ? this.options[state] : data[state])
		
		      if (state == 'loadingText') {
		        this.isLoading = true
		        $el.addClass(d).attr(d, d)
		      } else if (this.isLoading) {
		        this.isLoading = false
		        $el.removeClass(d).removeAttr(d)
		      }
		    }, this), 0)
		  }
		
		  Button.prototype.toggle = function () {
		    var changed = true
		    var $parent = this.$element.closest('[data-toggle="buttons"]')
		
		    if ($parent.length) {
		      var $input = this.$element.find('input')
		      if ($input.prop('type') == 'radio') {
		        if ($input.prop('checked')) changed = false
		        $parent.find('.active').removeClass('active')
		        this.$element.addClass('active')
		      } else if ($input.prop('type') == 'checkbox') {
		        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
		        this.$element.toggleClass('active')
		      }
		      $input.prop('checked', this.$element.hasClass('active'))
		      if (changed) $input.trigger('change')
		    } else {
		      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
		      this.$element.toggleClass('active')
		    }
		  }
		
		
		  // BUTTON PLUGIN DEFINITION
		  // ========================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this   = $(this)
		      var data    = $this.data('bs.button')
		      var options = typeof option == 'object' && option
		
		      if (!data) $this.data('bs.button', (data = new Button(this, options)))
		
		      if (option == 'toggle') data.toggle()
		      else if (option) data.setState(option)
		    })
		  }
		
		  var old = $.fn.button
		
		  $.fn.button             = Plugin
		  $.fn.button.Constructor = Button
		
		
		  // BUTTON NO CONFLICT
		  // ==================
		
		  $.fn.button.noConflict = function () {
		    $.fn.button = old
		    return this
		  }
		
		
		  // BUTTON DATA-API
		  // ===============
		
		  $(document)
		    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
		      var $btn = $(e.target)
		      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
		      Plugin.call($btn, 'toggle')
		      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
		    })
		    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
		      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
		    })
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: carousel.js v3.3.6
		 * http://getbootstrap.com/javascript/#carousel
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // CAROUSEL CLASS DEFINITION
		  // =========================
		
		  var Carousel = function (element, options) {
		    this.$element    = $(element)
		    this.$indicators = this.$element.find('.carousel-indicators')
		    this.options     = options
		    this.paused      = null
		    this.sliding     = null
		    this.interval    = null
		    this.$active     = null
		    this.$items      = null
		
		    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))
		
		    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
		      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
		      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
		  }
		
		  Carousel.VERSION  = '3.3.6'
		
		  Carousel.TRANSITION_DURATION = 600
		
		  Carousel.DEFAULTS = {
		    interval: 5000,
		    pause: 'hover',
		    wrap: true,
		    keyboard: true
		  }
		
		  Carousel.prototype.keydown = function (e) {
		    if (/input|textarea/i.test(e.target.tagName)) return
		    switch (e.which) {
		      case 37: this.prev(); break
		      case 39: this.next(); break
		      default: return
		    }
		
		    e.preventDefault()
		  }
		
		  Carousel.prototype.cycle = function (e) {
		    e || (this.paused = false)
		
		    this.interval && clearInterval(this.interval)
		
		    this.options.interval
		      && !this.paused
		      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
		
		    return this
		  }
		
		  Carousel.prototype.getItemIndex = function (item) {
		    this.$items = item.parent().children('.item')
		    return this.$items.index(item || this.$active)
		  }
		
		  Carousel.prototype.getItemForDirection = function (direction, active) {
		    var activeIndex = this.getItemIndex(active)
		    var willWrap = (direction == 'prev' && activeIndex === 0)
		                || (direction == 'next' && activeIndex == (this.$items.length - 1))
		    if (willWrap && !this.options.wrap) return active
		    var delta = direction == 'prev' ? -1 : 1
		    var itemIndex = (activeIndex + delta) % this.$items.length
		    return this.$items.eq(itemIndex)
		  }
		
		  Carousel.prototype.to = function (pos) {
		    var that        = this
		    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))
		
		    if (pos > (this.$items.length - 1) || pos < 0) return
		
		    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
		    if (activeIndex == pos) return this.pause().cycle()
		
		    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
		  }
		
		  Carousel.prototype.pause = function (e) {
		    e || (this.paused = true)
		
		    if (this.$element.find('.next, .prev').length && $.support.transition) {
		      this.$element.trigger($.support.transition.end)
		      this.cycle(true)
		    }
		
		    this.interval = clearInterval(this.interval)
		
		    return this
		  }
		
		  Carousel.prototype.next = function () {
		    if (this.sliding) return
		    return this.slide('next')
		  }
		
		  Carousel.prototype.prev = function () {
		    if (this.sliding) return
		    return this.slide('prev')
		  }
		
		  Carousel.prototype.slide = function (type, next) {
		    var $active   = this.$element.find('.item.active')
		    var $next     = next || this.getItemForDirection(type, $active)
		    var isCycling = this.interval
		    var direction = type == 'next' ? 'left' : 'right'
		    var that      = this
		
		    if ($next.hasClass('active')) return (this.sliding = false)
		
		    var relatedTarget = $next[0]
		    var slideEvent = $.Event('slide.bs.carousel', {
		      relatedTarget: relatedTarget,
		      direction: direction
		    })
		    this.$element.trigger(slideEvent)
		    if (slideEvent.isDefaultPrevented()) return
		
		    this.sliding = true
		
		    isCycling && this.pause()
		
		    if (this.$indicators.length) {
		      this.$indicators.find('.active').removeClass('active')
		      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
		      $nextIndicator && $nextIndicator.addClass('active')
		    }
		
		    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
		    if ($.support.transition && this.$element.hasClass('slide')) {
		      $next.addClass(type)
		      $next[0].offsetWidth // force reflow
		      $active.addClass(direction)
		      $next.addClass(direction)
		      $active
		        .one('bsTransitionEnd', function () {
		          $next.removeClass([type, direction].join(' ')).addClass('active')
		          $active.removeClass(['active', direction].join(' '))
		          that.sliding = false
		          setTimeout(function () {
		            that.$element.trigger(slidEvent)
		          }, 0)
		        })
		        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
		    } else {
		      $active.removeClass('active')
		      $next.addClass('active')
		      this.sliding = false
		      this.$element.trigger(slidEvent)
		    }
		
		    isCycling && this.cycle()
		
		    return this
		  }
		
		
		  // CAROUSEL PLUGIN DEFINITION
		  // ==========================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this   = $(this)
		      var data    = $this.data('bs.carousel')
		      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
		      var action  = typeof option == 'string' ? option : options.slide
		
		      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
		      if (typeof option == 'number') data.to(option)
		      else if (action) data[action]()
		      else if (options.interval) data.pause().cycle()
		    })
		  }
		
		  var old = $.fn.carousel
		
		  $.fn.carousel             = Plugin
		  $.fn.carousel.Constructor = Carousel
		
		
		  // CAROUSEL NO CONFLICT
		  // ====================
		
		  $.fn.carousel.noConflict = function () {
		    $.fn.carousel = old
		    return this
		  }
		
		
		  // CAROUSEL DATA-API
		  // =================
		
		  var clickHandler = function (e) {
		    var href
		    var $this   = $(this)
		    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
		    if (!$target.hasClass('carousel')) return
		    var options = $.extend({}, $target.data(), $this.data())
		    var slideIndex = $this.attr('data-slide-to')
		    if (slideIndex) options.interval = false
		
		    Plugin.call($target, options)
		
		    if (slideIndex) {
		      $target.data('bs.carousel').to(slideIndex)
		    }
		
		    e.preventDefault()
		  }
		
		  $(document)
		    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
		    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)
		
		  $(window).on('load', function () {
		    $('[data-ride="carousel"]').each(function () {
		      var $carousel = $(this)
		      Plugin.call($carousel, $carousel.data())
		    })
		  })
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: collapse.js v3.3.6
		 * http://getbootstrap.com/javascript/#collapse
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // COLLAPSE PUBLIC CLASS DEFINITION
		  // ================================
		
		  var Collapse = function (element, options) {
		    this.$element      = $(element)
		    this.options       = $.extend({}, Collapse.DEFAULTS, options)
		    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
		                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
		    this.transitioning = null
		
		    if (this.options.parent) {
		      this.$parent = this.getParent()
		    } else {
		      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
		    }
		
		    if (this.options.toggle) this.toggle()
		  }
		
		  Collapse.VERSION  = '3.3.6'
		
		  Collapse.TRANSITION_DURATION = 350
		
		  Collapse.DEFAULTS = {
		    toggle: true
		  }
		
		  Collapse.prototype.dimension = function () {
		    var hasWidth = this.$element.hasClass('width')
		    return hasWidth ? 'width' : 'height'
		  }
		
		  Collapse.prototype.show = function () {
		    if (this.transitioning || this.$element.hasClass('in')) return
		
		    var activesData
		    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')
		
		    if (actives && actives.length) {
		      activesData = actives.data('bs.collapse')
		      if (activesData && activesData.transitioning) return
		    }
		
		    var startEvent = $.Event('show.bs.collapse')
		    this.$element.trigger(startEvent)
		    if (startEvent.isDefaultPrevented()) return
		
		    if (actives && actives.length) {
		      Plugin.call(actives, 'hide')
		      activesData || actives.data('bs.collapse', null)
		    }
		
		    var dimension = this.dimension()
		
		    this.$element
		      .removeClass('collapse')
		      .addClass('collapsing')[dimension](0)
		      .attr('aria-expanded', true)
		
		    this.$trigger
		      .removeClass('collapsed')
		      .attr('aria-expanded', true)
		
		    this.transitioning = 1
		
		    var complete = function () {
		      this.$element
		        .removeClass('collapsing')
		        .addClass('collapse in')[dimension]('')
		      this.transitioning = 0
		      this.$element
		        .trigger('shown.bs.collapse')
		    }
		
		    if (!$.support.transition) return complete.call(this)
		
		    var scrollSize = $.camelCase(['scroll', dimension].join('-'))
		
		    this.$element
		      .one('bsTransitionEnd', $.proxy(complete, this))
		      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
		  }
		
		  Collapse.prototype.hide = function () {
		    if (this.transitioning || !this.$element.hasClass('in')) return
		
		    var startEvent = $.Event('hide.bs.collapse')
		    this.$element.trigger(startEvent)
		    if (startEvent.isDefaultPrevented()) return
		
		    var dimension = this.dimension()
		
		    this.$element[dimension](this.$element[dimension]())[0].offsetHeight
		
		    this.$element
		      .addClass('collapsing')
		      .removeClass('collapse in')
		      .attr('aria-expanded', false)
		
		    this.$trigger
		      .addClass('collapsed')
		      .attr('aria-expanded', false)
		
		    this.transitioning = 1
		
		    var complete = function () {
		      this.transitioning = 0
		      this.$element
		        .removeClass('collapsing')
		        .addClass('collapse')
		        .trigger('hidden.bs.collapse')
		    }
		
		    if (!$.support.transition) return complete.call(this)
		
		    this.$element
		      [dimension](0)
		      .one('bsTransitionEnd', $.proxy(complete, this))
		      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
		  }
		
		  Collapse.prototype.toggle = function () {
		    this[this.$element.hasClass('in') ? 'hide' : 'show']()
		  }
		
		  Collapse.prototype.getParent = function () {
		    return $(this.options.parent)
		      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
		      .each($.proxy(function (i, element) {
		        var $element = $(element)
		        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
		      }, this))
		      .end()
		  }
		
		  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
		    var isOpen = $element.hasClass('in')
		
		    $element.attr('aria-expanded', isOpen)
		    $trigger
		      .toggleClass('collapsed', !isOpen)
		      .attr('aria-expanded', isOpen)
		  }
		
		  function getTargetFromTrigger($trigger) {
		    var href
		    var target = $trigger.attr('data-target')
		      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
		
		    return $(target)
		  }
		
		
		  // COLLAPSE PLUGIN DEFINITION
		  // ==========================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this   = $(this)
		      var data    = $this.data('bs.collapse')
		      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)
		
		      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
		      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
		      if (typeof option == 'string') data[option]()
		    })
		  }
		
		  var old = $.fn.collapse
		
		  $.fn.collapse             = Plugin
		  $.fn.collapse.Constructor = Collapse
		
		
		  // COLLAPSE NO CONFLICT
		  // ====================
		
		  $.fn.collapse.noConflict = function () {
		    $.fn.collapse = old
		    return this
		  }
		
		
		  // COLLAPSE DATA-API
		  // =================
		
		  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
		    var $this   = $(this)
		
		    if (!$this.attr('data-target')) e.preventDefault()
		
		    var $target = getTargetFromTrigger($this)
		    var data    = $target.data('bs.collapse')
		    var option  = data ? 'toggle' : $this.data()
		
		    Plugin.call($target, option)
		  })
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: dropdown.js v3.3.6
		 * http://getbootstrap.com/javascript/#dropdowns
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // DROPDOWN CLASS DEFINITION
		  // =========================
		
		  var backdrop = '.dropdown-backdrop'
		  var toggle   = '[data-toggle="dropdown"]'
		  var Dropdown = function (element) {
		    $(element).on('click.bs.dropdown', this.toggle)
		  }
		
		  Dropdown.VERSION = '3.3.6'
		
		  function getParent($this) {
		    var selector = $this.attr('data-target')
		
		    if (!selector) {
		      selector = $this.attr('href')
		      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
		    }
		
		    var $parent = selector && $(selector)
		
		    return $parent && $parent.length ? $parent : $this.parent()
		  }
		
		  function clearMenus(e) {
		    if (e && e.which === 3) return
		    $(backdrop).remove()
		    $(toggle).each(function () {
		      var $this         = $(this)
		      var $parent       = getParent($this)
		      var relatedTarget = { relatedTarget: this }
		
		      if (!$parent.hasClass('open')) return
		
		      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return
		
		      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
		
		      if (e.isDefaultPrevented()) return
		
		      $this.attr('aria-expanded', 'false')
		      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
		    })
		  }
		
		  Dropdown.prototype.toggle = function (e) {
		    var $this = $(this)
		
		    if ($this.is('.disabled, :disabled')) return
		
		    var $parent  = getParent($this)
		    var isActive = $parent.hasClass('open')
		
		    clearMenus()
		
		    if (!isActive) {
		      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
		        // if mobile we use a backdrop because click events don't delegate
		        $(document.createElement('div'))
		          .addClass('dropdown-backdrop')
		          .insertAfter($(this))
		          .on('click', clearMenus)
		      }
		
		      var relatedTarget = { relatedTarget: this }
		      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))
		
		      if (e.isDefaultPrevented()) return
		
		      $this
		        .trigger('focus')
		        .attr('aria-expanded', 'true')
		
		      $parent
		        .toggleClass('open')
		        .trigger($.Event('shown.bs.dropdown', relatedTarget))
		    }
		
		    return false
		  }
		
		  Dropdown.prototype.keydown = function (e) {
		    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return
		
		    var $this = $(this)
		
		    e.preventDefault()
		    e.stopPropagation()
		
		    if ($this.is('.disabled, :disabled')) return
		
		    var $parent  = getParent($this)
		    var isActive = $parent.hasClass('open')
		
		    if (!isActive && e.which != 27 || isActive && e.which == 27) {
		      if (e.which == 27) $parent.find(toggle).trigger('focus')
		      return $this.trigger('click')
		    }
		
		    var desc = ' li:not(.disabled):visible a'
		    var $items = $parent.find('.dropdown-menu' + desc)
		
		    if (!$items.length) return
		
		    var index = $items.index(e.target)
		
		    if (e.which == 38 && index > 0)                 index--         // up
		    if (e.which == 40 && index < $items.length - 1) index++         // down
		    if (!~index)                                    index = 0
		
		    $items.eq(index).trigger('focus')
		  }
		
		
		  // DROPDOWN PLUGIN DEFINITION
		  // ==========================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this = $(this)
		      var data  = $this.data('bs.dropdown')
		
		      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
		      if (typeof option == 'string') data[option].call($this)
		    })
		  }
		
		  var old = $.fn.dropdown
		
		  $.fn.dropdown             = Plugin
		  $.fn.dropdown.Constructor = Dropdown
		
		
		  // DROPDOWN NO CONFLICT
		  // ====================
		
		  $.fn.dropdown.noConflict = function () {
		    $.fn.dropdown = old
		    return this
		  }
		
		
		  // APPLY TO STANDARD DROPDOWN ELEMENTS
		  // ===================================
		
		  $(document)
		    .on('click.bs.dropdown.data-api', clearMenus)
		    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
		    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
		    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
		    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: modal.js v3.3.6
		 * http://getbootstrap.com/javascript/#modals
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // MODAL CLASS DEFINITION
		  // ======================
		
		  var Modal = function (element, options) {
		    this.options             = options
		    this.$body               = $(document.body)
		    this.$element            = $(element)
		    this.$dialog             = this.$element.find('.modal-dialog')
		    this.$backdrop           = null
		    this.isShown             = null
		    this.originalBodyPad     = null
		    this.scrollbarWidth      = 0
		    this.ignoreBackdropClick = false
		
		    if (this.options.remote) {
		      this.$element
		        .find('.modal-content')
		        .load(this.options.remote, $.proxy(function () {
		          this.$element.trigger('loaded.bs.modal')
		        }, this))
		    }
		  }
		
		  Modal.VERSION  = '3.3.6'
		
		  Modal.TRANSITION_DURATION = 300
		  Modal.BACKDROP_TRANSITION_DURATION = 150
		
		  Modal.DEFAULTS = {
		    backdrop: true,
		    keyboard: true,
		    show: true
		  }
		
		  Modal.prototype.toggle = function (_relatedTarget) {
		    return this.isShown ? this.hide() : this.show(_relatedTarget)
		  }
		
		  Modal.prototype.show = function (_relatedTarget) {
		    var that = this
		    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })
		
		    this.$element.trigger(e)
		
		    if (this.isShown || e.isDefaultPrevented()) return
		
		    this.isShown = true
		
		    this.checkScrollbar()
		    this.setScrollbar()
		    this.$body.addClass('modal-open')
		
		    this.escape()
		    this.resize()
		
		    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
		
		    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
		      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
		        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
		      })
		    })
		
		    this.backdrop(function () {
		      var transition = $.support.transition && that.$element.hasClass('fade')
		
		      if (!that.$element.parent().length) {
		        that.$element.appendTo(that.$body) // don't move modals dom position
		      }
		
		      that.$element
		        .show()
		        .scrollTop(0)
		
		      that.adjustDialog()
		
		      if (transition) {
		        that.$element[0].offsetWidth // force reflow
		      }
		
		      that.$element.addClass('in')
		
		      that.enforceFocus()
		
		      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })
		
		      transition ?
		        that.$dialog // wait for modal to slide in
		          .one('bsTransitionEnd', function () {
		            that.$element.trigger('focus').trigger(e)
		          })
		          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
		        that.$element.trigger('focus').trigger(e)
		    })
		  }
		
		  Modal.prototype.hide = function (e) {
		    if (e) e.preventDefault()
		
		    e = $.Event('hide.bs.modal')
		
		    this.$element.trigger(e)
		
		    if (!this.isShown || e.isDefaultPrevented()) return
		
		    this.isShown = false
		
		    this.escape()
		    this.resize()
		
		    $(document).off('focusin.bs.modal')
		
		    this.$element
		      .removeClass('in')
		      .off('click.dismiss.bs.modal')
		      .off('mouseup.dismiss.bs.modal')
		
		    this.$dialog.off('mousedown.dismiss.bs.modal')
		
		    $.support.transition && this.$element.hasClass('fade') ?
		      this.$element
		        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
		        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
		      this.hideModal()
		  }
		
		  Modal.prototype.enforceFocus = function () {
		    $(document)
		      .off('focusin.bs.modal') // guard against infinite focus loop
		      .on('focusin.bs.modal', $.proxy(function (e) {
		        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
		          this.$element.trigger('focus')
		        }
		      }, this))
		  }
		
		  Modal.prototype.escape = function () {
		    if (this.isShown && this.options.keyboard) {
		      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
		        e.which == 27 && this.hide()
		      }, this))
		    } else if (!this.isShown) {
		      this.$element.off('keydown.dismiss.bs.modal')
		    }
		  }
		
		  Modal.prototype.resize = function () {
		    if (this.isShown) {
		      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
		    } else {
		      $(window).off('resize.bs.modal')
		    }
		  }
		
		  Modal.prototype.hideModal = function () {
		    var that = this
		    this.$element.hide()
		    this.backdrop(function () {
		      that.$body.removeClass('modal-open')
		      that.resetAdjustments()
		      that.resetScrollbar()
		      that.$element.trigger('hidden.bs.modal')
		    })
		  }
		
		  Modal.prototype.removeBackdrop = function () {
		    this.$backdrop && this.$backdrop.remove()
		    this.$backdrop = null
		  }
		
		  Modal.prototype.backdrop = function (callback) {
		    var that = this
		    var animate = this.$element.hasClass('fade') ? 'fade' : ''
		
		    if (this.isShown && this.options.backdrop) {
		      var doAnimate = $.support.transition && animate
		
		      this.$backdrop = $(document.createElement('div'))
		        .addClass('modal-backdrop ' + animate)
		        .appendTo(this.$body)
		
		      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
		        if (this.ignoreBackdropClick) {
		          this.ignoreBackdropClick = false
		          return
		        }
		        if (e.target !== e.currentTarget) return
		        this.options.backdrop == 'static'
		          ? this.$element[0].focus()
		          : this.hide()
		      }, this))
		
		      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
		
		      this.$backdrop.addClass('in')
		
		      if (!callback) return
		
		      doAnimate ?
		        this.$backdrop
		          .one('bsTransitionEnd', callback)
		          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
		        callback()
		
		    } else if (!this.isShown && this.$backdrop) {
		      this.$backdrop.removeClass('in')
		
		      var callbackRemove = function () {
		        that.removeBackdrop()
		        callback && callback()
		      }
		      $.support.transition && this.$element.hasClass('fade') ?
		        this.$backdrop
		          .one('bsTransitionEnd', callbackRemove)
		          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
		        callbackRemove()
		
		    } else if (callback) {
		      callback()
		    }
		  }
		
		  // these following methods are used to handle overflowing modals
		
		  Modal.prototype.handleUpdate = function () {
		    this.adjustDialog()
		  }
		
		  Modal.prototype.adjustDialog = function () {
		    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight
		
		    this.$element.css({
		      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
		      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
		    })
		  }
		
		  Modal.prototype.resetAdjustments = function () {
		    this.$element.css({
		      paddingLeft: '',
		      paddingRight: ''
		    })
		  }
		
		  Modal.prototype.checkScrollbar = function () {
		    var fullWindowWidth = window.innerWidth
		    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
		      var documentElementRect = document.documentElement.getBoundingClientRect()
		      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
		    }
		    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
		    this.scrollbarWidth = this.measureScrollbar()
		  }
		
		  Modal.prototype.setScrollbar = function () {
		    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
		    this.originalBodyPad = document.body.style.paddingRight || ''
		    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
		  }
		
		  Modal.prototype.resetScrollbar = function () {
		    this.$body.css('padding-right', this.originalBodyPad)
		  }
		
		  Modal.prototype.measureScrollbar = function () { // thx walsh
		    var scrollDiv = document.createElement('div')
		    scrollDiv.className = 'modal-scrollbar-measure'
		    this.$body.append(scrollDiv)
		    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
		    this.$body[0].removeChild(scrollDiv)
		    return scrollbarWidth
		  }
		
		
		  // MODAL PLUGIN DEFINITION
		  // =======================
		
		  function Plugin(option, _relatedTarget) {
		    return this.each(function () {
		      var $this   = $(this)
		      var data    = $this.data('bs.modal')
		      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)
		
		      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
		      if (typeof option == 'string') data[option](_relatedTarget)
		      else if (options.show) data.show(_relatedTarget)
		    })
		  }
		
		  var old = $.fn.modal
		
		  $.fn.modal             = Plugin
		  $.fn.modal.Constructor = Modal
		
		
		  // MODAL NO CONFLICT
		  // =================
		
		  $.fn.modal.noConflict = function () {
		    $.fn.modal = old
		    return this
		  }
		
		
		  // MODAL DATA-API
		  // ==============
		
		  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
		    var $this   = $(this)
		    var href    = $this.attr('href')
		    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
		    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())
		
		    if ($this.is('a')) e.preventDefault()
		
		    $target.one('show.bs.modal', function (showEvent) {
		      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
		      $target.one('hidden.bs.modal', function () {
		        $this.is(':visible') && $this.trigger('focus')
		      })
		    })
		    Plugin.call($target, option, this)
		  })
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: tooltip.js v3.3.6
		 * http://getbootstrap.com/javascript/#tooltip
		 * Inspired by the original jQuery.tipsy by Jason Frame
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // TOOLTIP PUBLIC CLASS DEFINITION
		  // ===============================
		
		  var Tooltip = function (element, options) {
		    this.type       = null
		    this.options    = null
		    this.enabled    = null
		    this.timeout    = null
		    this.hoverState = null
		    this.$element   = null
		    this.inState    = null
		
		    this.init('tooltip', element, options)
		  }
		
		  Tooltip.VERSION  = '3.3.6'
		
		  Tooltip.TRANSITION_DURATION = 150
		
		  Tooltip.DEFAULTS = {
		    animation: true,
		    placement: 'top',
		    selector: false,
		    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		    trigger: 'hover focus',
		    title: '',
		    delay: 0,
		    html: false,
		    container: false,
		    viewport: {
		      selector: 'body',
		      padding: 0
		    }
		  }
		
		  Tooltip.prototype.init = function (type, element, options) {
		    this.enabled   = true
		    this.type      = type
		    this.$element  = $(element)
		    this.options   = this.getOptions(options)
		    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
		    this.inState   = { click: false, hover: false, focus: false }
		
		    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
		      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
		    }
		
		    var triggers = this.options.trigger.split(' ')
		
		    for (var i = triggers.length; i--;) {
		      var trigger = triggers[i]
		
		      if (trigger == 'click') {
		        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
		      } else if (trigger != 'manual') {
		        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
		        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'
		
		        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
		        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
		      }
		    }
		
		    this.options.selector ?
		      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
		      this.fixTitle()
		  }
		
		  Tooltip.prototype.getDefaults = function () {
		    return Tooltip.DEFAULTS
		  }
		
		  Tooltip.prototype.getOptions = function (options) {
		    options = $.extend({}, this.getDefaults(), this.$element.data(), options)
		
		    if (options.delay && typeof options.delay == 'number') {
		      options.delay = {
		        show: options.delay,
		        hide: options.delay
		      }
		    }
		
		    return options
		  }
		
		  Tooltip.prototype.getDelegateOptions = function () {
		    var options  = {}
		    var defaults = this.getDefaults()
		
		    this._options && $.each(this._options, function (key, value) {
		      if (defaults[key] != value) options[key] = value
		    })
		
		    return options
		  }
		
		  Tooltip.prototype.enter = function (obj) {
		    var self = obj instanceof this.constructor ?
		      obj : $(obj.currentTarget).data('bs.' + this.type)
		
		    if (!self) {
		      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
		      $(obj.currentTarget).data('bs.' + this.type, self)
		    }
		
		    if (obj instanceof $.Event) {
		      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
		    }
		
		    if (self.tip().hasClass('in') || self.hoverState == 'in') {
		      self.hoverState = 'in'
		      return
		    }
		
		    clearTimeout(self.timeout)
		
		    self.hoverState = 'in'
		
		    if (!self.options.delay || !self.options.delay.show) return self.show()
		
		    self.timeout = setTimeout(function () {
		      if (self.hoverState == 'in') self.show()
		    }, self.options.delay.show)
		  }
		
		  Tooltip.prototype.isInStateTrue = function () {
		    for (var key in this.inState) {
		      if (this.inState[key]) return true
		    }
		
		    return false
		  }
		
		  Tooltip.prototype.leave = function (obj) {
		    var self = obj instanceof this.constructor ?
		      obj : $(obj.currentTarget).data('bs.' + this.type)
		
		    if (!self) {
		      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
		      $(obj.currentTarget).data('bs.' + this.type, self)
		    }
		
		    if (obj instanceof $.Event) {
		      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
		    }
		
		    if (self.isInStateTrue()) return
		
		    clearTimeout(self.timeout)
		
		    self.hoverState = 'out'
		
		    if (!self.options.delay || !self.options.delay.hide) return self.hide()
		
		    self.timeout = setTimeout(function () {
		      if (self.hoverState == 'out') self.hide()
		    }, self.options.delay.hide)
		  }
		
		  Tooltip.prototype.show = function () {
		    var e = $.Event('show.bs.' + this.type)
		
		    if (this.hasContent() && this.enabled) {
		      this.$element.trigger(e)
		
		      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
		      if (e.isDefaultPrevented() || !inDom) return
		      var that = this
		
		      var $tip = this.tip()
		
		      var tipId = this.getUID(this.type)
		
		      this.setContent()
		      $tip.attr('id', tipId)
		      this.$element.attr('aria-describedby', tipId)
		
		      if (this.options.animation) $tip.addClass('fade')
		
		      var placement = typeof this.options.placement == 'function' ?
		        this.options.placement.call(this, $tip[0], this.$element[0]) :
		        this.options.placement
		
		      var autoToken = /\s?auto?\s?/i
		      var autoPlace = autoToken.test(placement)
		      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'
		
		      $tip
		        .detach()
		        .css({ top: 0, left: 0, display: 'block' })
		        .addClass(placement)
		        .data('bs.' + this.type, this)
		
		      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
		      this.$element.trigger('inserted.bs.' + this.type)
		
		      var pos          = this.getPosition()
		      var actualWidth  = $tip[0].offsetWidth
		      var actualHeight = $tip[0].offsetHeight
		
		      if (autoPlace) {
		        var orgPlacement = placement
		        var viewportDim = this.getPosition(this.$viewport)
		
		        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
		                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
		                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
		                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
		                    placement
		
		        $tip
		          .removeClass(orgPlacement)
		          .addClass(placement)
		      }
		
		      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)
		
		      this.applyPlacement(calculatedOffset, placement)
		
		      var complete = function () {
		        var prevHoverState = that.hoverState
		        that.$element.trigger('shown.bs.' + that.type)
		        that.hoverState = null
		
		        if (prevHoverState == 'out') that.leave(that)
		      }
		
		      $.support.transition && this.$tip.hasClass('fade') ?
		        $tip
		          .one('bsTransitionEnd', complete)
		          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
		        complete()
		    }
		  }
		
		  Tooltip.prototype.applyPlacement = function (offset, placement) {
		    var $tip   = this.tip()
		    var width  = $tip[0].offsetWidth
		    var height = $tip[0].offsetHeight
		
		    // manually read margins because getBoundingClientRect includes difference
		    var marginTop = parseInt($tip.css('margin-top'), 10)
		    var marginLeft = parseInt($tip.css('margin-left'), 10)
		
		    // we must check for NaN for ie 8/9
		    if (isNaN(marginTop))  marginTop  = 0
		    if (isNaN(marginLeft)) marginLeft = 0
		
		    offset.top  += marginTop
		    offset.left += marginLeft
		
		    // $.fn.offset doesn't round pixel values
		    // so we use setOffset directly with our own function B-0
		    $.offset.setOffset($tip[0], $.extend({
		      using: function (props) {
		        $tip.css({
		          top: Math.round(props.top),
		          left: Math.round(props.left)
		        })
		      }
		    }, offset), 0)
		
		    $tip.addClass('in')
		
		    // check to see if placing tip in new offset caused the tip to resize itself
		    var actualWidth  = $tip[0].offsetWidth
		    var actualHeight = $tip[0].offsetHeight
		
		    if (placement == 'top' && actualHeight != height) {
		      offset.top = offset.top + height - actualHeight
		    }
		
		    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)
		
		    if (delta.left) offset.left += delta.left
		    else offset.top += delta.top
		
		    var isVertical          = /top|bottom/.test(placement)
		    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
		    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'
		
		    $tip.offset(offset)
		    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
		  }
		
		  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
		    this.arrow()
		      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
		      .css(isVertical ? 'top' : 'left', '')
		  }
		
		  Tooltip.prototype.setContent = function () {
		    var $tip  = this.tip()
		    var title = this.getTitle()
		
		    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
		    $tip.removeClass('fade in top bottom left right')
		  }
		
		  Tooltip.prototype.hide = function (callback) {
		    var that = this
		    var $tip = $(this.$tip)
		    var e    = $.Event('hide.bs.' + this.type)
		
		    function complete() {
		      if (that.hoverState != 'in') $tip.detach()
		      that.$element
		        .removeAttr('aria-describedby')
		        .trigger('hidden.bs.' + that.type)
		      callback && callback()
		    }
		
		    this.$element.trigger(e)
		
		    if (e.isDefaultPrevented()) return
		
		    $tip.removeClass('in')
		
		    $.support.transition && $tip.hasClass('fade') ?
		      $tip
		        .one('bsTransitionEnd', complete)
		        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
		      complete()
		
		    this.hoverState = null
		
		    return this
		  }
		
		  Tooltip.prototype.fixTitle = function () {
		    var $e = this.$element
		    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
		      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
		    }
		  }
		
		  Tooltip.prototype.hasContent = function () {
		    return this.getTitle()
		  }
		
		  Tooltip.prototype.getPosition = function ($element) {
		    $element   = $element || this.$element
		
		    var el     = $element[0]
		    var isBody = el.tagName == 'BODY'
		
		    var elRect    = el.getBoundingClientRect()
		    if (elRect.width == null) {
		      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
		      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
		    }
		    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
		    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
		    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null
		
		    return $.extend({}, elRect, scroll, outerDims, elOffset)
		  }
		
		  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
		    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
		           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
		           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
		        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }
		
		  }
		
		  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
		    var delta = { top: 0, left: 0 }
		    if (!this.$viewport) return delta
		
		    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
		    var viewportDimensions = this.getPosition(this.$viewport)
		
		    if (/right|left/.test(placement)) {
		      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
		      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
		      if (topEdgeOffset < viewportDimensions.top) { // top overflow
		        delta.top = viewportDimensions.top - topEdgeOffset
		      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
		        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
		      }
		    } else {
		      var leftEdgeOffset  = pos.left - viewportPadding
		      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
		      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
		        delta.left = viewportDimensions.left - leftEdgeOffset
		      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
		        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
		      }
		    }
		
		    return delta
		  }
		
		  Tooltip.prototype.getTitle = function () {
		    var title
		    var $e = this.$element
		    var o  = this.options
		
		    title = $e.attr('data-original-title')
		      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)
		
		    return title
		  }
		
		  Tooltip.prototype.getUID = function (prefix) {
		    do prefix += ~~(Math.random() * 1000000)
		    while (document.getElementById(prefix))
		    return prefix
		  }
		
		  Tooltip.prototype.tip = function () {
		    if (!this.$tip) {
		      this.$tip = $(this.options.template)
		      if (this.$tip.length != 1) {
		        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
		      }
		    }
		    return this.$tip
		  }
		
		  Tooltip.prototype.arrow = function () {
		    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
		  }
		
		  Tooltip.prototype.enable = function () {
		    this.enabled = true
		  }
		
		  Tooltip.prototype.disable = function () {
		    this.enabled = false
		  }
		
		  Tooltip.prototype.toggleEnabled = function () {
		    this.enabled = !this.enabled
		  }
		
		  Tooltip.prototype.toggle = function (e) {
		    var self = this
		    if (e) {
		      self = $(e.currentTarget).data('bs.' + this.type)
		      if (!self) {
		        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
		        $(e.currentTarget).data('bs.' + this.type, self)
		      }
		    }
		
		    if (e) {
		      self.inState.click = !self.inState.click
		      if (self.isInStateTrue()) self.enter(self)
		      else self.leave(self)
		    } else {
		      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
		    }
		  }
		
		  Tooltip.prototype.destroy = function () {
		    var that = this
		    clearTimeout(this.timeout)
		    this.hide(function () {
		      that.$element.off('.' + that.type).removeData('bs.' + that.type)
		      if (that.$tip) {
		        that.$tip.detach()
		      }
		      that.$tip = null
		      that.$arrow = null
		      that.$viewport = null
		    })
		  }
		
		
		  // TOOLTIP PLUGIN DEFINITION
		  // =========================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this   = $(this)
		      var data    = $this.data('bs.tooltip')
		      var options = typeof option == 'object' && option
		
		      if (!data && /destroy|hide/.test(option)) return
		      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
		      if (typeof option == 'string') data[option]()
		    })
		  }
		
		  var old = $.fn.tooltip
		
		  $.fn.tooltip             = Plugin
		  $.fn.tooltip.Constructor = Tooltip
		
		
		  // TOOLTIP NO CONFLICT
		  // ===================
		
		  $.fn.tooltip.noConflict = function () {
		    $.fn.tooltip = old
		    return this
		  }
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: popover.js v3.3.6
		 * http://getbootstrap.com/javascript/#popovers
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // POPOVER PUBLIC CLASS DEFINITION
		  // ===============================
		
		  var Popover = function (element, options) {
		    this.init('popover', element, options)
		  }
		
		  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')
		
		  Popover.VERSION  = '3.3.6'
		
		  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
		    placement: 'right',
		    trigger: 'click',
		    content: '',
		    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
		  })
		
		
		  // NOTE: POPOVER EXTENDS tooltip.js
		  // ================================
		
		  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)
		
		  Popover.prototype.constructor = Popover
		
		  Popover.prototype.getDefaults = function () {
		    return Popover.DEFAULTS
		  }
		
		  Popover.prototype.setContent = function () {
		    var $tip    = this.tip()
		    var title   = this.getTitle()
		    var content = this.getContent()
		
		    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
		    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
		      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
		    ](content)
		
		    $tip.removeClass('fade top bottom left right in')
		
		    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
		    // this manually by checking the contents.
		    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
		  }
		
		  Popover.prototype.hasContent = function () {
		    return this.getTitle() || this.getContent()
		  }
		
		  Popover.prototype.getContent = function () {
		    var $e = this.$element
		    var o  = this.options
		
		    return $e.attr('data-content')
		      || (typeof o.content == 'function' ?
		            o.content.call($e[0]) :
		            o.content)
		  }
		
		  Popover.prototype.arrow = function () {
		    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
		  }
		
		
		  // POPOVER PLUGIN DEFINITION
		  // =========================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this   = $(this)
		      var data    = $this.data('bs.popover')
		      var options = typeof option == 'object' && option
		
		      if (!data && /destroy|hide/.test(option)) return
		      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
		      if (typeof option == 'string') data[option]()
		    })
		  }
		
		  var old = $.fn.popover
		
		  $.fn.popover             = Plugin
		  $.fn.popover.Constructor = Popover
		
		
		  // POPOVER NO CONFLICT
		  // ===================
		
		  $.fn.popover.noConflict = function () {
		    $.fn.popover = old
		    return this
		  }
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: scrollspy.js v3.3.6
		 * http://getbootstrap.com/javascript/#scrollspy
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // SCROLLSPY CLASS DEFINITION
		  // ==========================
		
		  function ScrollSpy(element, options) {
		    this.$body          = $(document.body)
		    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
		    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
		    this.selector       = (this.options.target || '') + ' .nav li > a'
		    this.offsets        = []
		    this.targets        = []
		    this.activeTarget   = null
		    this.scrollHeight   = 0
		
		    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
		    this.refresh()
		    this.process()
		  }
		
		  ScrollSpy.VERSION  = '3.3.6'
		
		  ScrollSpy.DEFAULTS = {
		    offset: 10
		  }
		
		  ScrollSpy.prototype.getScrollHeight = function () {
		    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
		  }
		
		  ScrollSpy.prototype.refresh = function () {
		    var that          = this
		    var offsetMethod  = 'offset'
		    var offsetBase    = 0
		
		    this.offsets      = []
		    this.targets      = []
		    this.scrollHeight = this.getScrollHeight()
		
		    if (!$.isWindow(this.$scrollElement[0])) {
		      offsetMethod = 'position'
		      offsetBase   = this.$scrollElement.scrollTop()
		    }
		
		    this.$body
		      .find(this.selector)
		      .map(function () {
		        var $el   = $(this)
		        var href  = $el.data('target') || $el.attr('href')
		        var $href = /^#./.test(href) && $(href)
		
		        return ($href
		          && $href.length
		          && $href.is(':visible')
		          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
		      })
		      .sort(function (a, b) { return a[0] - b[0] })
		      .each(function () {
		        that.offsets.push(this[0])
		        that.targets.push(this[1])
		      })
		  }
		
		  ScrollSpy.prototype.process = function () {
		    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
		    var scrollHeight = this.getScrollHeight()
		    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
		    var offsets      = this.offsets
		    var targets      = this.targets
		    var activeTarget = this.activeTarget
		    var i
		
		    if (this.scrollHeight != scrollHeight) {
		      this.refresh()
		    }
		
		    if (scrollTop >= maxScroll) {
		      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
		    }
		
		    if (activeTarget && scrollTop < offsets[0]) {
		      this.activeTarget = null
		      return this.clear()
		    }
		
		    for (i = offsets.length; i--;) {
		      activeTarget != targets[i]
		        && scrollTop >= offsets[i]
		        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
		        && this.activate(targets[i])
		    }
		  }
		
		  ScrollSpy.prototype.activate = function (target) {
		    this.activeTarget = target
		
		    this.clear()
		
		    var selector = this.selector +
		      '[data-target="' + target + '"],' +
		      this.selector + '[href="' + target + '"]'
		
		    var active = $(selector)
		      .parents('li')
		      .addClass('active')
		
		    if (active.parent('.dropdown-menu').length) {
		      active = active
		        .closest('li.dropdown')
		        .addClass('active')
		    }
		
		    active.trigger('activate.bs.scrollspy')
		  }
		
		  ScrollSpy.prototype.clear = function () {
		    $(this.selector)
		      .parentsUntil(this.options.target, '.active')
		      .removeClass('active')
		  }
		
		
		  // SCROLLSPY PLUGIN DEFINITION
		  // ===========================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this   = $(this)
		      var data    = $this.data('bs.scrollspy')
		      var options = typeof option == 'object' && option
		
		      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
		      if (typeof option == 'string') data[option]()
		    })
		  }
		
		  var old = $.fn.scrollspy
		
		  $.fn.scrollspy             = Plugin
		  $.fn.scrollspy.Constructor = ScrollSpy
		
		
		  // SCROLLSPY NO CONFLICT
		  // =====================
		
		  $.fn.scrollspy.noConflict = function () {
		    $.fn.scrollspy = old
		    return this
		  }
		
		
		  // SCROLLSPY DATA-API
		  // ==================
		
		  $(window).on('load.bs.scrollspy.data-api', function () {
		    $('[data-spy="scroll"]').each(function () {
		      var $spy = $(this)
		      Plugin.call($spy, $spy.data())
		    })
		  })
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: tab.js v3.3.6
		 * http://getbootstrap.com/javascript/#tabs
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // TAB CLASS DEFINITION
		  // ====================
		
		  var Tab = function (element) {
		    // jscs:disable requireDollarBeforejQueryAssignment
		    this.element = $(element)
		    // jscs:enable requireDollarBeforejQueryAssignment
		  }
		
		  Tab.VERSION = '3.3.6'
		
		  Tab.TRANSITION_DURATION = 150
		
		  Tab.prototype.show = function () {
		    var $this    = this.element
		    var $ul      = $this.closest('ul:not(.dropdown-menu)')
		    var selector = $this.data('target')
		
		    if (!selector) {
		      selector = $this.attr('href')
		      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
		    }
		
		    if ($this.parent('li').hasClass('active')) return
		
		    var $previous = $ul.find('.active:last a')
		    var hideEvent = $.Event('hide.bs.tab', {
		      relatedTarget: $this[0]
		    })
		    var showEvent = $.Event('show.bs.tab', {
		      relatedTarget: $previous[0]
		    })
		
		    $previous.trigger(hideEvent)
		    $this.trigger(showEvent)
		
		    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return
		
		    var $target = $(selector)
		
		    this.activate($this.closest('li'), $ul)
		    this.activate($target, $target.parent(), function () {
		      $previous.trigger({
		        type: 'hidden.bs.tab',
		        relatedTarget: $this[0]
		      })
		      $this.trigger({
		        type: 'shown.bs.tab',
		        relatedTarget: $previous[0]
		      })
		    })
		  }
		
		  Tab.prototype.activate = function (element, container, callback) {
		    var $active    = container.find('> .active')
		    var transition = callback
		      && $.support.transition
		      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)
		
		    function next() {
		      $active
		        .removeClass('active')
		        .find('> .dropdown-menu > .active')
		          .removeClass('active')
		        .end()
		        .find('[data-toggle="tab"]')
		          .attr('aria-expanded', false)
		
		      element
		        .addClass('active')
		        .find('[data-toggle="tab"]')
		          .attr('aria-expanded', true)
		
		      if (transition) {
		        element[0].offsetWidth // reflow for transition
		        element.addClass('in')
		      } else {
		        element.removeClass('fade')
		      }
		
		      if (element.parent('.dropdown-menu').length) {
		        element
		          .closest('li.dropdown')
		            .addClass('active')
		          .end()
		          .find('[data-toggle="tab"]')
		            .attr('aria-expanded', true)
		      }
		
		      callback && callback()
		    }
		
		    $active.length && transition ?
		      $active
		        .one('bsTransitionEnd', next)
		        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
		      next()
		
		    $active.removeClass('in')
		  }
		
		
		  // TAB PLUGIN DEFINITION
		  // =====================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this = $(this)
		      var data  = $this.data('bs.tab')
		
		      if (!data) $this.data('bs.tab', (data = new Tab(this)))
		      if (typeof option == 'string') data[option]()
		    })
		  }
		
		  var old = $.fn.tab
		
		  $.fn.tab             = Plugin
		  $.fn.tab.Constructor = Tab
		
		
		  // TAB NO CONFLICT
		  // ===============
		
		  $.fn.tab.noConflict = function () {
		    $.fn.tab = old
		    return this
		  }
		
		
		  // TAB DATA-API
		  // ============
		
		  var clickHandler = function (e) {
		    e.preventDefault()
		    Plugin.call($(this), 'show')
		  }
		
		  $(document)
		    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
		    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)
		
		}(jQuery);
		
		/* ========================================================================
		 * Bootstrap: affix.js v3.3.6
		 * http://getbootstrap.com/javascript/#affix
		 * ========================================================================
		 * Copyright 2011-2015 Twitter, Inc.
		 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
		 * ======================================================================== */
		
		
		+function ($) {
		  'use strict';
		
		  // AFFIX CLASS DEFINITION
		  // ======================
		
		  var Affix = function (element, options) {
		    this.options = $.extend({}, Affix.DEFAULTS, options)
		
		    this.$target = $(this.options.target)
		      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
		      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))
		
		    this.$element     = $(element)
		    this.affixed      = null
		    this.unpin        = null
		    this.pinnedOffset = null
		
		    this.checkPosition()
		  }
		
		  Affix.VERSION  = '3.3.6'
		
		  Affix.RESET    = 'affix affix-top affix-bottom'
		
		  Affix.DEFAULTS = {
		    offset: 0,
		    target: window
		  }
		
		  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
		    var scrollTop    = this.$target.scrollTop()
		    var position     = this.$element.offset()
		    var targetHeight = this.$target.height()
		
		    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false
		
		    if (this.affixed == 'bottom') {
		      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
		      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
		    }
		
		    var initializing   = this.affixed == null
		    var colliderTop    = initializing ? scrollTop : position.top
		    var colliderHeight = initializing ? targetHeight : height
		
		    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
		    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'
		
		    return false
		  }
		
		  Affix.prototype.getPinnedOffset = function () {
		    if (this.pinnedOffset) return this.pinnedOffset
		    this.$element.removeClass(Affix.RESET).addClass('affix')
		    var scrollTop = this.$target.scrollTop()
		    var position  = this.$element.offset()
		    return (this.pinnedOffset = position.top - scrollTop)
		  }
		
		  Affix.prototype.checkPositionWithEventLoop = function () {
		    setTimeout($.proxy(this.checkPosition, this), 1)
		  }
		
		  Affix.prototype.checkPosition = function () {
		    if (!this.$element.is(':visible')) return
		
		    var height       = this.$element.height()
		    var offset       = this.options.offset
		    var offsetTop    = offset.top
		    var offsetBottom = offset.bottom
		    var scrollHeight = Math.max($(document).height(), $(document.body).height())
		
		    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
		    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
		    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)
		
		    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)
		
		    if (this.affixed != affix) {
		      if (this.unpin != null) this.$element.css('top', '')
		
		      var affixType = 'affix' + (affix ? '-' + affix : '')
		      var e         = $.Event(affixType + '.bs.affix')
		
		      this.$element.trigger(e)
		
		      if (e.isDefaultPrevented()) return
		
		      this.affixed = affix
		      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null
		
		      this.$element
		        .removeClass(Affix.RESET)
		        .addClass(affixType)
		        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
		    }
		
		    if (affix == 'bottom') {
		      this.$element.offset({
		        top: scrollHeight - height - offsetBottom
		      })
		    }
		  }
		
		
		  // AFFIX PLUGIN DEFINITION
		  // =======================
		
		  function Plugin(option) {
		    return this.each(function () {
		      var $this   = $(this)
		      var data    = $this.data('bs.affix')
		      var options = typeof option == 'object' && option
		
		      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
		      if (typeof option == 'string') data[option]()
		    })
		  }
		
		  var old = $.fn.affix
		
		  $.fn.affix             = Plugin
		  $.fn.affix.Constructor = Affix
		
		
		  // AFFIX NO CONFLICT
		  // =================
		
		  $.fn.affix.noConflict = function () {
		    $.fn.affix = old
		    return this
		  }
		
		
		  // AFFIX DATA-API
		  // ==============
		
		  $(window).on('load', function () {
		    $('[data-spy="affix"]').each(function () {
		      var $spy = $(this)
		      var data = $spy.data()
		
		      data.offset = data.offset || {}
		
		      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
		      if (data.offsetTop    != null) data.offset.top    = data.offsetTop
		
		      Plugin.call($spy, data)
		    })
		  })
		
		}(jQuery);
	}

	module.exports = bootstrapM


/***/ },

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(168);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(168, function() {
				var newContent = __webpack_require__(168);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/*!\n * Bootstrap v3.3.6 (http://getbootstrap.com)\n * Copyright 2011-2015 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -webkit-text-size-adjust: 100%;\n      -ms-text-size-adjust: 100%;\n}\nbody {\n  margin: 0;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline;\n}\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n[hidden],\ntemplate {\n  display: none;\n}\na {\n  background-color: transparent;\n}\na:active,\na:hover {\n  outline: 0;\n}\nabbr[title] {\n  border-bottom: 1px dotted;\n}\nb,\nstrong {\n  font-weight: bold;\n}\ndfn {\n  font-style: italic;\n}\nh1 {\n  margin: .67em 0;\n  font-size: 2em;\n}\nmark {\n  color: #000;\n  background: #ff0;\n}\nsmall {\n  font-size: 80%;\n}\nsub,\nsup {\n  position: relative;\n  font-size: 75%;\n  line-height: 0;\n  vertical-align: baseline;\n}\nsup {\n  top: -.5em;\n}\nsub {\n  bottom: -.25em;\n}\nimg {\n  border: 0;\n}\nsvg:not(:root) {\n  overflow: hidden;\n}\nfigure {\n  margin: 1em 40px;\n}\npre {\n  overflow: auto;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n  font: inherit;\n  color: inherit;\n}\nbutton {\n  overflow: visible;\n}\nbutton,\nselect {\n  text-transform: none;\n}\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer;\n}\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\ninput {\n  line-height: normal;\n}\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n     -moz-box-sizing: border-box;\n          box-sizing: border-box;\n  padding: 0;\n}\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\ninput[type=\"search\"] {\n  -webkit-box-sizing: content-box;\n     -moz-box-sizing: content-box;\n          box-sizing: content-box;\n  -webkit-appearance: textfield;\n}\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\nfieldset {\n  padding: .35em .625em .75em;\n  margin: 0 2px;\n  border: 1px solid #c0c0c0;\n}\nlegend {\n  padding: 0;\n  border: 0;\n}\ntextarea {\n  overflow: auto;\n}\noptgroup {\n  font-weight: bold;\n}\ntable {\n  border-spacing: 0;\n  border-collapse: collapse;\n}\ntd,\nth {\n  padding: 0;\n}\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\n@media print {\n  *,\n  *:before,\n  *:after {\n    color: #000 !important;\n    text-shadow: none !important;\n    background: transparent !important;\n    -webkit-box-shadow: none !important;\n            box-shadow: none !important;\n  }\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n  a[href]:after {\n    content: \" (\" attr(href) \")\";\n  }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\";\n  }\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: \"\";\n  }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n\n    page-break-inside: avoid;\n  }\n  thead {\n    display: table-header-group;\n  }\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n  img {\n    max-width: 100% !important;\n  }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n  .navbar {\n    display: none;\n  }\n  .btn > .caret,\n  .dropup > .btn > .caret {\n    border-top-color: #000 !important;\n  }\n  .label {\n    border: 1px solid #000;\n  }\n  .table {\n    border-collapse: collapse !important;\n  }\n  .table td,\n  .table th {\n    background-color: #fff !important;\n  }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important;\n  }\n}\n@font-face {\n  font-family: 'Glyphicons Halflings';\n\n  src: url(" + __webpack_require__(169) + ");\n  src: url(" + __webpack_require__(169) + "?#iefix) format('embedded-opentype'), url(" + __webpack_require__(170) + ") format('woff2'), url(" + __webpack_require__(171) + ") format('woff'), url(" + __webpack_require__(172) + ") format('truetype'), url(" + __webpack_require__(173) + "#glyphicons_halflingsregular) format('svg');\n}\n.glyphicon {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-family: 'Glyphicons Halflings';\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.glyphicon-asterisk:before {\n  content: \"*\";\n}\n.glyphicon-plus:before {\n  content: \"+\";\n}\n.glyphicon-euro:before,\n.glyphicon-eur:before {\n  content: \"\\20AC\";\n}\n.glyphicon-minus:before {\n  content: \"\\2212\";\n}\n.glyphicon-cloud:before {\n  content: \"\\2601\";\n}\n.glyphicon-envelope:before {\n  content: \"\\2709\";\n}\n.glyphicon-pencil:before {\n  content: \"\\270F\";\n}\n.glyphicon-glass:before {\n  content: \"\\E001\";\n}\n.glyphicon-music:before {\n  content: \"\\E002\";\n}\n.glyphicon-search:before {\n  content: \"\\E003\";\n}\n.glyphicon-heart:before {\n  content: \"\\E005\";\n}\n.glyphicon-star:before {\n  content: \"\\E006\";\n}\n.glyphicon-star-empty:before {\n  content: \"\\E007\";\n}\n.glyphicon-user:before {\n  content: \"\\E008\";\n}\n.glyphicon-film:before {\n  content: \"\\E009\";\n}\n.glyphicon-th-large:before {\n  content: \"\\E010\";\n}\n.glyphicon-th:before {\n  content: \"\\E011\";\n}\n.glyphicon-th-list:before {\n  content: \"\\E012\";\n}\n.glyphicon-ok:before {\n  content: \"\\E013\";\n}\n.glyphicon-remove:before {\n  content: \"\\E014\";\n}\n.glyphicon-zoom-in:before {\n  content: \"\\E015\";\n}\n.glyphicon-zoom-out:before {\n  content: \"\\E016\";\n}\n.glyphicon-off:before {\n  content: \"\\E017\";\n}\n.glyphicon-signal:before {\n  content: \"\\E018\";\n}\n.glyphicon-cog:before {\n  content: \"\\E019\";\n}\n.glyphicon-trash:before {\n  content: \"\\E020\";\n}\n.glyphicon-home:before {\n  content: \"\\E021\";\n}\n.glyphicon-file:before {\n  content: \"\\E022\";\n}\n.glyphicon-time:before {\n  content: \"\\E023\";\n}\n.glyphicon-road:before {\n  content: \"\\E024\";\n}\n.glyphicon-download-alt:before {\n  content: \"\\E025\";\n}\n.glyphicon-download:before {\n  content: \"\\E026\";\n}\n.glyphicon-upload:before {\n  content: \"\\E027\";\n}\n.glyphicon-inbox:before {\n  content: \"\\E028\";\n}\n.glyphicon-play-circle:before {\n  content: \"\\E029\";\n}\n.glyphicon-repeat:before {\n  content: \"\\E030\";\n}\n.glyphicon-refresh:before {\n  content: \"\\E031\";\n}\n.glyphicon-list-alt:before {\n  content: \"\\E032\";\n}\n.glyphicon-lock:before {\n  content: \"\\E033\";\n}\n.glyphicon-flag:before {\n  content: \"\\E034\";\n}\n.glyphicon-headphones:before {\n  content: \"\\E035\";\n}\n.glyphicon-volume-off:before {\n  content: \"\\E036\";\n}\n.glyphicon-volume-down:before {\n  content: \"\\E037\";\n}\n.glyphicon-volume-up:before {\n  content: \"\\E038\";\n}\n.glyphicon-qrcode:before {\n  content: \"\\E039\";\n}\n.glyphicon-barcode:before {\n  content: \"\\E040\";\n}\n.glyphicon-tag:before {\n  content: \"\\E041\";\n}\n.glyphicon-tags:before {\n  content: \"\\E042\";\n}\n.glyphicon-book:before {\n  content: \"\\E043\";\n}\n.glyphicon-bookmark:before {\n  content: \"\\E044\";\n}\n.glyphicon-print:before {\n  content: \"\\E045\";\n}\n.glyphicon-camera:before {\n  content: \"\\E046\";\n}\n.glyphicon-font:before {\n  content: \"\\E047\";\n}\n.glyphicon-bold:before {\n  content: \"\\E048\";\n}\n.glyphicon-italic:before {\n  content: \"\\E049\";\n}\n.glyphicon-text-height:before {\n  content: \"\\E050\";\n}\n.glyphicon-text-width:before {\n  content: \"\\E051\";\n}\n.glyphicon-align-left:before {\n  content: \"\\E052\";\n}\n.glyphicon-align-center:before {\n  content: \"\\E053\";\n}\n.glyphicon-align-right:before {\n  content: \"\\E054\";\n}\n.glyphicon-align-justify:before {\n  content: \"\\E055\";\n}\n.glyphicon-list:before {\n  content: \"\\E056\";\n}\n.glyphicon-indent-left:before {\n  content: \"\\E057\";\n}\n.glyphicon-indent-right:before {\n  content: \"\\E058\";\n}\n.glyphicon-facetime-video:before {\n  content: \"\\E059\";\n}\n.glyphicon-picture:before {\n  content: \"\\E060\";\n}\n.glyphicon-map-marker:before {\n  content: \"\\E062\";\n}\n.glyphicon-adjust:before {\n  content: \"\\E063\";\n}\n.glyphicon-tint:before {\n  content: \"\\E064\";\n}\n.glyphicon-edit:before {\n  content: \"\\E065\";\n}\n.glyphicon-share:before {\n  content: \"\\E066\";\n}\n.glyphicon-check:before {\n  content: \"\\E067\";\n}\n.glyphicon-move:before {\n  content: \"\\E068\";\n}\n.glyphicon-step-backward:before {\n  content: \"\\E069\";\n}\n.glyphicon-fast-backward:before {\n  content: \"\\E070\";\n}\n.glyphicon-backward:before {\n  content: \"\\E071\";\n}\n.glyphicon-play:before {\n  content: \"\\E072\";\n}\n.glyphicon-pause:before {\n  content: \"\\E073\";\n}\n.glyphicon-stop:before {\n  content: \"\\E074\";\n}\n.glyphicon-forward:before {\n  content: \"\\E075\";\n}\n.glyphicon-fast-forward:before {\n  content: \"\\E076\";\n}\n.glyphicon-step-forward:before {\n  content: \"\\E077\";\n}\n.glyphicon-eject:before {\n  content: \"\\E078\";\n}\n.glyphicon-chevron-left:before {\n  content: \"\\E079\";\n}\n.glyphicon-chevron-right:before {\n  content: \"\\E080\";\n}\n.glyphicon-plus-sign:before {\n  content: \"\\E081\";\n}\n.glyphicon-minus-sign:before {\n  content: \"\\E082\";\n}\n.glyphicon-remove-sign:before {\n  content: \"\\E083\";\n}\n.glyphicon-ok-sign:before {\n  content: \"\\E084\";\n}\n.glyphicon-question-sign:before {\n  content: \"\\E085\";\n}\n.glyphicon-info-sign:before {\n  content: \"\\E086\";\n}\n.glyphicon-screenshot:before {\n  content: \"\\E087\";\n}\n.glyphicon-remove-circle:before {\n  content: \"\\E088\";\n}\n.glyphicon-ok-circle:before {\n  content: \"\\E089\";\n}\n.glyphicon-ban-circle:before {\n  content: \"\\E090\";\n}\n.glyphicon-arrow-left:before {\n  content: \"\\E091\";\n}\n.glyphicon-arrow-right:before {\n  content: \"\\E092\";\n}\n.glyphicon-arrow-up:before {\n  content: \"\\E093\";\n}\n.glyphicon-arrow-down:before {\n  content: \"\\E094\";\n}\n.glyphicon-share-alt:before {\n  content: \"\\E095\";\n}\n.glyphicon-resize-full:before {\n  content: \"\\E096\";\n}\n.glyphicon-resize-small:before {\n  content: \"\\E097\";\n}\n.glyphicon-exclamation-sign:before {\n  content: \"\\E101\";\n}\n.glyphicon-gift:before {\n  content: \"\\E102\";\n}\n.glyphicon-leaf:before {\n  content: \"\\E103\";\n}\n.glyphicon-fire:before {\n  content: \"\\E104\";\n}\n.glyphicon-eye-open:before {\n  content: \"\\E105\";\n}\n.glyphicon-eye-close:before {\n  content: \"\\E106\";\n}\n.glyphicon-warning-sign:before {\n  content: \"\\E107\";\n}\n.glyphicon-plane:before {\n  content: \"\\E108\";\n}\n.glyphicon-calendar:before {\n  content: \"\\E109\";\n}\n.glyphicon-random:before {\n  content: \"\\E110\";\n}\n.glyphicon-comment:before {\n  content: \"\\E111\";\n}\n.glyphicon-magnet:before {\n  content: \"\\E112\";\n}\n.glyphicon-chevron-up:before {\n  content: \"\\E113\";\n}\n.glyphicon-chevron-down:before {\n  content: \"\\E114\";\n}\n.glyphicon-retweet:before {\n  content: \"\\E115\";\n}\n.glyphicon-shopping-cart:before {\n  content: \"\\E116\";\n}\n.glyphicon-folder-close:before {\n  content: \"\\E117\";\n}\n.glyphicon-folder-open:before {\n  content: \"\\E118\";\n}\n.glyphicon-resize-vertical:before {\n  content: \"\\E119\";\n}\n.glyphicon-resize-horizontal:before {\n  content: \"\\E120\";\n}\n.glyphicon-hdd:before {\n  content: \"\\E121\";\n}\n.glyphicon-bullhorn:before {\n  content: \"\\E122\";\n}\n.glyphicon-bell:before {\n  content: \"\\E123\";\n}\n.glyphicon-certificate:before {\n  content: \"\\E124\";\n}\n.glyphicon-thumbs-up:before {\n  content: \"\\E125\";\n}\n.glyphicon-thumbs-down:before {\n  content: \"\\E126\";\n}\n.glyphicon-hand-right:before {\n  content: \"\\E127\";\n}\n.glyphicon-hand-left:before {\n  content: \"\\E128\";\n}\n.glyphicon-hand-up:before {\n  content: \"\\E129\";\n}\n.glyphicon-hand-down:before {\n  content: \"\\E130\";\n}\n.glyphicon-circle-arrow-right:before {\n  content: \"\\E131\";\n}\n.glyphicon-circle-arrow-left:before {\n  content: \"\\E132\";\n}\n.glyphicon-circle-arrow-up:before {\n  content: \"\\E133\";\n}\n.glyphicon-circle-arrow-down:before {\n  content: \"\\E134\";\n}\n.glyphicon-globe:before {\n  content: \"\\E135\";\n}\n.glyphicon-wrench:before {\n  content: \"\\E136\";\n}\n.glyphicon-tasks:before {\n  content: \"\\E137\";\n}\n.glyphicon-filter:before {\n  content: \"\\E138\";\n}\n.glyphicon-briefcase:before {\n  content: \"\\E139\";\n}\n.glyphicon-fullscreen:before {\n  content: \"\\E140\";\n}\n.glyphicon-dashboard:before {\n  content: \"\\E141\";\n}\n.glyphicon-paperclip:before {\n  content: \"\\E142\";\n}\n.glyphicon-heart-empty:before {\n  content: \"\\E143\";\n}\n.glyphicon-link:before {\n  content: \"\\E144\";\n}\n.glyphicon-phone:before {\n  content: \"\\E145\";\n}\n.glyphicon-pushpin:before {\n  content: \"\\E146\";\n}\n.glyphicon-usd:before {\n  content: \"\\E148\";\n}\n.glyphicon-gbp:before {\n  content: \"\\E149\";\n}\n.glyphicon-sort:before {\n  content: \"\\E150\";\n}\n.glyphicon-sort-by-alphabet:before {\n  content: \"\\E151\";\n}\n.glyphicon-sort-by-alphabet-alt:before {\n  content: \"\\E152\";\n}\n.glyphicon-sort-by-order:before {\n  content: \"\\E153\";\n}\n.glyphicon-sort-by-order-alt:before {\n  content: \"\\E154\";\n}\n.glyphicon-sort-by-attributes:before {\n  content: \"\\E155\";\n}\n.glyphicon-sort-by-attributes-alt:before {\n  content: \"\\E156\";\n}\n.glyphicon-unchecked:before {\n  content: \"\\E157\";\n}\n.glyphicon-expand:before {\n  content: \"\\E158\";\n}\n.glyphicon-collapse-down:before {\n  content: \"\\E159\";\n}\n.glyphicon-collapse-up:before {\n  content: \"\\E160\";\n}\n.glyphicon-log-in:before {\n  content: \"\\E161\";\n}\n.glyphicon-flash:before {\n  content: \"\\E162\";\n}\n.glyphicon-log-out:before {\n  content: \"\\E163\";\n}\n.glyphicon-new-window:before {\n  content: \"\\E164\";\n}\n.glyphicon-record:before {\n  content: \"\\E165\";\n}\n.glyphicon-save:before {\n  content: \"\\E166\";\n}\n.glyphicon-open:before {\n  content: \"\\E167\";\n}\n.glyphicon-saved:before {\n  content: \"\\E168\";\n}\n.glyphicon-import:before {\n  content: \"\\E169\";\n}\n.glyphicon-export:before {\n  content: \"\\E170\";\n}\n.glyphicon-send:before {\n  content: \"\\E171\";\n}\n.glyphicon-floppy-disk:before {\n  content: \"\\E172\";\n}\n.glyphicon-floppy-saved:before {\n  content: \"\\E173\";\n}\n.glyphicon-floppy-remove:before {\n  content: \"\\E174\";\n}\n.glyphicon-floppy-save:before {\n  content: \"\\E175\";\n}\n.glyphicon-floppy-open:before {\n  content: \"\\E176\";\n}\n.glyphicon-credit-card:before {\n  content: \"\\E177\";\n}\n.glyphicon-transfer:before {\n  content: \"\\E178\";\n}\n.glyphicon-cutlery:before {\n  content: \"\\E179\";\n}\n.glyphicon-header:before {\n  content: \"\\E180\";\n}\n.glyphicon-compressed:before {\n  content: \"\\E181\";\n}\n.glyphicon-earphone:before {\n  content: \"\\E182\";\n}\n.glyphicon-phone-alt:before {\n  content: \"\\E183\";\n}\n.glyphicon-tower:before {\n  content: \"\\E184\";\n}\n.glyphicon-stats:before {\n  content: \"\\E185\";\n}\n.glyphicon-sd-video:before {\n  content: \"\\E186\";\n}\n.glyphicon-hd-video:before {\n  content: \"\\E187\";\n}\n.glyphicon-subtitles:before {\n  content: \"\\E188\";\n}\n.glyphicon-sound-stereo:before {\n  content: \"\\E189\";\n}\n.glyphicon-sound-dolby:before {\n  content: \"\\E190\";\n}\n.glyphicon-sound-5-1:before {\n  content: \"\\E191\";\n}\n.glyphicon-sound-6-1:before {\n  content: \"\\E192\";\n}\n.glyphicon-sound-7-1:before {\n  content: \"\\E193\";\n}\n.glyphicon-copyright-mark:before {\n  content: \"\\E194\";\n}\n.glyphicon-registration-mark:before {\n  content: \"\\E195\";\n}\n.glyphicon-cloud-download:before {\n  content: \"\\E197\";\n}\n.glyphicon-cloud-upload:before {\n  content: \"\\E198\";\n}\n.glyphicon-tree-conifer:before {\n  content: \"\\E199\";\n}\n.glyphicon-tree-deciduous:before {\n  content: \"\\E200\";\n}\n.glyphicon-cd:before {\n  content: \"\\E201\";\n}\n.glyphicon-save-file:before {\n  content: \"\\E202\";\n}\n.glyphicon-open-file:before {\n  content: \"\\E203\";\n}\n.glyphicon-level-up:before {\n  content: \"\\E204\";\n}\n.glyphicon-copy:before {\n  content: \"\\E205\";\n}\n.glyphicon-paste:before {\n  content: \"\\E206\";\n}\n.glyphicon-alert:before {\n  content: \"\\E209\";\n}\n.glyphicon-equalizer:before {\n  content: \"\\E210\";\n}\n.glyphicon-king:before {\n  content: \"\\E211\";\n}\n.glyphicon-queen:before {\n  content: \"\\E212\";\n}\n.glyphicon-pawn:before {\n  content: \"\\E213\";\n}\n.glyphicon-bishop:before {\n  content: \"\\E214\";\n}\n.glyphicon-knight:before {\n  content: \"\\E215\";\n}\n.glyphicon-baby-formula:before {\n  content: \"\\E216\";\n}\n.glyphicon-tent:before {\n  content: \"\\26FA\";\n}\n.glyphicon-blackboard:before {\n  content: \"\\E218\";\n}\n.glyphicon-bed:before {\n  content: \"\\E219\";\n}\n.glyphicon-apple:before {\n  content: \"\\F8FF\";\n}\n.glyphicon-erase:before {\n  content: \"\\E221\";\n}\n.glyphicon-hourglass:before {\n  content: \"\\231B\";\n}\n.glyphicon-lamp:before {\n  content: \"\\E223\";\n}\n.glyphicon-duplicate:before {\n  content: \"\\E224\";\n}\n.glyphicon-piggy-bank:before {\n  content: \"\\E225\";\n}\n.glyphicon-scissors:before {\n  content: \"\\E226\";\n}\n.glyphicon-bitcoin:before {\n  content: \"\\E227\";\n}\n.glyphicon-btc:before {\n  content: \"\\E227\";\n}\n.glyphicon-xbt:before {\n  content: \"\\E227\";\n}\n.glyphicon-yen:before {\n  content: \"\\A5\";\n}\n.glyphicon-jpy:before {\n  content: \"\\A5\";\n}\n.glyphicon-ruble:before {\n  content: \"\\20BD\";\n}\n.glyphicon-rub:before {\n  content: \"\\20BD\";\n}\n.glyphicon-scale:before {\n  content: \"\\E230\";\n}\n.glyphicon-ice-lolly:before {\n  content: \"\\E231\";\n}\n.glyphicon-ice-lolly-tasted:before {\n  content: \"\\E232\";\n}\n.glyphicon-education:before {\n  content: \"\\E233\";\n}\n.glyphicon-option-horizontal:before {\n  content: \"\\E234\";\n}\n.glyphicon-option-vertical:before {\n  content: \"\\E235\";\n}\n.glyphicon-menu-hamburger:before {\n  content: \"\\E236\";\n}\n.glyphicon-modal-window:before {\n  content: \"\\E237\";\n}\n.glyphicon-oil:before {\n  content: \"\\E238\";\n}\n.glyphicon-grain:before {\n  content: \"\\E239\";\n}\n.glyphicon-sunglasses:before {\n  content: \"\\E240\";\n}\n.glyphicon-text-size:before {\n  content: \"\\E241\";\n}\n.glyphicon-text-color:before {\n  content: \"\\E242\";\n}\n.glyphicon-text-background:before {\n  content: \"\\E243\";\n}\n.glyphicon-object-align-top:before {\n  content: \"\\E244\";\n}\n.glyphicon-object-align-bottom:before {\n  content: \"\\E245\";\n}\n.glyphicon-object-align-horizontal:before {\n  content: \"\\E246\";\n}\n.glyphicon-object-align-left:before {\n  content: \"\\E247\";\n}\n.glyphicon-object-align-vertical:before {\n  content: \"\\E248\";\n}\n.glyphicon-object-align-right:before {\n  content: \"\\E249\";\n}\n.glyphicon-triangle-right:before {\n  content: \"\\E250\";\n}\n.glyphicon-triangle-left:before {\n  content: \"\\E251\";\n}\n.glyphicon-triangle-bottom:before {\n  content: \"\\E252\";\n}\n.glyphicon-triangle-top:before {\n  content: \"\\E253\";\n}\n.glyphicon-console:before {\n  content: \"\\E254\";\n}\n.glyphicon-superscript:before {\n  content: \"\\E255\";\n}\n.glyphicon-subscript:before {\n  content: \"\\E256\";\n}\n.glyphicon-menu-left:before {\n  content: \"\\E257\";\n}\n.glyphicon-menu-right:before {\n  content: \"\\E258\";\n}\n.glyphicon-menu-down:before {\n  content: \"\\E259\";\n}\n.glyphicon-menu-up:before {\n  content: \"\\E260\";\n}\nhtml {\n  font-size: 10px;\n\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\nbody {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #333;\n  background-color: #fff;\n}\ninput,\nbutton,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\na {\n  color: #337ab7;\n  text-decoration: none;\n}\na:hover,\na:focus {\n  color: #23527c;\n  text-decoration: underline;\n}\na:focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\nfigure {\n  margin: 0;\n}\nimg {\n  vertical-align: middle;\n}\n.img-responsive,\n.thumbnail > img,\n.thumbnail a > img,\n.carousel-inner > .item > img,\n.carousel-inner > .item > a > img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n.img-rounded {\n  border-radius: 6px;\n}\n.img-thumbnail {\n  display: inline-block;\n  max-width: 100%;\n  height: auto;\n  padding: 4px;\n  line-height: 1.42857143;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: all .2s ease-in-out;\n       -o-transition: all .2s ease-in-out;\n          transition: all .2s ease-in-out;\n}\n.img-circle {\n  border-radius: 50%;\n}\nhr {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  border: 0;\n  border-top: 1px solid #eee;\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n.sr-only-focusable:active,\n.sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n}\n[role=\"button\"] {\n  cursor: pointer;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit;\n}\nh1 small,\nh2 small,\nh3 small,\nh4 small,\nh5 small,\nh6 small,\n.h1 small,\n.h2 small,\n.h3 small,\n.h4 small,\n.h5 small,\n.h6 small,\nh1 .small,\nh2 .small,\nh3 .small,\nh4 .small,\nh5 .small,\nh6 .small,\n.h1 .small,\n.h2 .small,\n.h3 .small,\n.h4 .small,\n.h5 .small,\n.h6 .small {\n  font-weight: normal;\n  line-height: 1;\n  color: #777;\n}\nh1,\n.h1,\nh2,\n.h2,\nh3,\n.h3 {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\nh1 small,\n.h1 small,\nh2 small,\n.h2 small,\nh3 small,\n.h3 small,\nh1 .small,\n.h1 .small,\nh2 .small,\n.h2 .small,\nh3 .small,\n.h3 .small {\n  font-size: 65%;\n}\nh4,\n.h4,\nh5,\n.h5,\nh6,\n.h6 {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\nh4 small,\n.h4 small,\nh5 small,\n.h5 small,\nh6 small,\n.h6 small,\nh4 .small,\n.h4 .small,\nh5 .small,\n.h5 .small,\nh6 .small,\n.h6 .small {\n  font-size: 75%;\n}\nh1,\n.h1 {\n  font-size: 36px;\n}\nh2,\n.h2 {\n  font-size: 30px;\n}\nh3,\n.h3 {\n  font-size: 24px;\n}\nh4,\n.h4 {\n  font-size: 18px;\n}\nh5,\n.h5 {\n  font-size: 14px;\n}\nh6,\n.h6 {\n  font-size: 12px;\n}\np {\n  margin: 0 0 10px;\n}\n.lead {\n  margin-bottom: 20px;\n  font-size: 16px;\n  font-weight: 300;\n  line-height: 1.4;\n}\n@media (min-width: 768px) {\n  .lead {\n    font-size: 21px;\n  }\n}\nsmall,\n.small {\n  font-size: 85%;\n}\nmark,\n.mark {\n  padding: .2em;\n  background-color: #fcf8e3;\n}\n.text-left {\n  text-align: left;\n}\n.text-right {\n  text-align: right;\n}\n.text-center {\n  text-align: center;\n}\n.text-justify {\n  text-align: justify;\n}\n.text-nowrap {\n  white-space: nowrap;\n}\n.text-lowercase {\n  text-transform: lowercase;\n}\n.text-uppercase {\n  text-transform: uppercase;\n}\n.text-capitalize {\n  text-transform: capitalize;\n}\n.text-muted {\n  color: #777;\n}\n.text-primary {\n  color: #337ab7;\n}\na.text-primary:hover,\na.text-primary:focus {\n  color: #286090;\n}\n.text-success {\n  color: #3c763d;\n}\na.text-success:hover,\na.text-success:focus {\n  color: #2b542c;\n}\n.text-info {\n  color: #31708f;\n}\na.text-info:hover,\na.text-info:focus {\n  color: #245269;\n}\n.text-warning {\n  color: #8a6d3b;\n}\na.text-warning:hover,\na.text-warning:focus {\n  color: #66512c;\n}\n.text-danger {\n  color: #a94442;\n}\na.text-danger:hover,\na.text-danger:focus {\n  color: #843534;\n}\n.bg-primary {\n  color: #fff;\n  background-color: #337ab7;\n}\na.bg-primary:hover,\na.bg-primary:focus {\n  background-color: #286090;\n}\n.bg-success {\n  background-color: #dff0d8;\n}\na.bg-success:hover,\na.bg-success:focus {\n  background-color: #c1e2b3;\n}\n.bg-info {\n  background-color: #d9edf7;\n}\na.bg-info:hover,\na.bg-info:focus {\n  background-color: #afd9ee;\n}\n.bg-warning {\n  background-color: #fcf8e3;\n}\na.bg-warning:hover,\na.bg-warning:focus {\n  background-color: #f7ecb5;\n}\n.bg-danger {\n  background-color: #f2dede;\n}\na.bg-danger:hover,\na.bg-danger:focus {\n  background-color: #e4b9b9;\n}\n.page-header {\n  padding-bottom: 9px;\n  margin: 40px 0 20px;\n  border-bottom: 1px solid #eee;\n}\nul,\nol {\n  margin-top: 0;\n  margin-bottom: 10px;\n}\nul ul,\nol ul,\nul ol,\nol ol {\n  margin-bottom: 0;\n}\n.list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n.list-inline {\n  padding-left: 0;\n  margin-left: -5px;\n  list-style: none;\n}\n.list-inline > li {\n  display: inline-block;\n  padding-right: 5px;\n  padding-left: 5px;\n}\ndl {\n  margin-top: 0;\n  margin-bottom: 20px;\n}\ndt,\ndd {\n  line-height: 1.42857143;\n}\ndt {\n  font-weight: bold;\n}\ndd {\n  margin-left: 0;\n}\n@media (min-width: 768px) {\n  .dl-horizontal dt {\n    float: left;\n    width: 160px;\n    overflow: hidden;\n    clear: left;\n    text-align: right;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  .dl-horizontal dd {\n    margin-left: 180px;\n  }\n}\nabbr[title],\nabbr[data-original-title] {\n  cursor: help;\n  border-bottom: 1px dotted #777;\n}\n.initialism {\n  font-size: 90%;\n  text-transform: uppercase;\n}\nblockquote {\n  padding: 10px 20px;\n  margin: 0 0 20px;\n  font-size: 17.5px;\n  border-left: 5px solid #eee;\n}\nblockquote p:last-child,\nblockquote ul:last-child,\nblockquote ol:last-child {\n  margin-bottom: 0;\n}\nblockquote footer,\nblockquote small,\nblockquote .small {\n  display: block;\n  font-size: 80%;\n  line-height: 1.42857143;\n  color: #777;\n}\nblockquote footer:before,\nblockquote small:before,\nblockquote .small:before {\n  content: '\\2014   \\A0';\n}\n.blockquote-reverse,\nblockquote.pull-right {\n  padding-right: 15px;\n  padding-left: 0;\n  text-align: right;\n  border-right: 5px solid #eee;\n  border-left: 0;\n}\n.blockquote-reverse footer:before,\nblockquote.pull-right footer:before,\n.blockquote-reverse small:before,\nblockquote.pull-right small:before,\n.blockquote-reverse .small:before,\nblockquote.pull-right .small:before {\n  content: '';\n}\n.blockquote-reverse footer:after,\nblockquote.pull-right footer:after,\n.blockquote-reverse small:after,\nblockquote.pull-right small:after,\n.blockquote-reverse .small:after,\nblockquote.pull-right .small:after {\n  content: '\\A0   \\2014';\n}\naddress {\n  margin-bottom: 20px;\n  font-style: normal;\n  line-height: 1.42857143;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace;\n}\ncode {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #c7254e;\n  background-color: #f9f2f4;\n  border-radius: 4px;\n}\nkbd {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #fff;\n  background-color: #333;\n  border-radius: 3px;\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .25);\n          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .25);\n}\nkbd kbd {\n  padding: 0;\n  font-size: 100%;\n  font-weight: bold;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\npre {\n  display: block;\n  padding: 9.5px;\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.42857143;\n  color: #333;\n  word-break: break-all;\n  word-wrap: break-word;\n  background-color: #f5f5f5;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\npre code {\n  padding: 0;\n  font-size: inherit;\n  color: inherit;\n  white-space: pre-wrap;\n  background-color: transparent;\n  border-radius: 0;\n}\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll;\n}\n.container {\n  padding-right: 15px;\n  padding-left: 15px;\n  margin-right: auto;\n  margin-left: auto;\n}\n@media (min-width: 768px) {\n  .container {\n    width: 750px;\n  }\n}\n@media (min-width: 992px) {\n  .container {\n    width: 970px;\n  }\n}\n@media (min-width: 1200px) {\n  .container {\n    width: 1170px;\n  }\n}\n.container-fluid {\n  padding-right: 15px;\n  padding-left: 15px;\n  margin-right: auto;\n  margin-left: auto;\n}\n.row {\n  margin-right: -15px;\n  margin-left: -15px;\n}\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\n  position: relative;\n  min-height: 1px;\n  padding-right: 15px;\n  padding-left: 15px;\n}\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\n  float: left;\n}\n.col-xs-12 {\n  width: 100%;\n}\n.col-xs-11 {\n  width: 91.66666667%;\n}\n.col-xs-10 {\n  width: 83.33333333%;\n}\n.col-xs-9 {\n  width: 75%;\n}\n.col-xs-8 {\n  width: 66.66666667%;\n}\n.col-xs-7 {\n  width: 58.33333333%;\n}\n.col-xs-6 {\n  width: 50%;\n}\n.col-xs-5 {\n  width: 41.66666667%;\n}\n.col-xs-4 {\n  width: 33.33333333%;\n}\n.col-xs-3 {\n  width: 25%;\n}\n.col-xs-2 {\n  width: 16.66666667%;\n}\n.col-xs-1 {\n  width: 8.33333333%;\n}\n.col-xs-pull-12 {\n  right: 100%;\n}\n.col-xs-pull-11 {\n  right: 91.66666667%;\n}\n.col-xs-pull-10 {\n  right: 83.33333333%;\n}\n.col-xs-pull-9 {\n  right: 75%;\n}\n.col-xs-pull-8 {\n  right: 66.66666667%;\n}\n.col-xs-pull-7 {\n  right: 58.33333333%;\n}\n.col-xs-pull-6 {\n  right: 50%;\n}\n.col-xs-pull-5 {\n  right: 41.66666667%;\n}\n.col-xs-pull-4 {\n  right: 33.33333333%;\n}\n.col-xs-pull-3 {\n  right: 25%;\n}\n.col-xs-pull-2 {\n  right: 16.66666667%;\n}\n.col-xs-pull-1 {\n  right: 8.33333333%;\n}\n.col-xs-pull-0 {\n  right: auto;\n}\n.col-xs-push-12 {\n  left: 100%;\n}\n.col-xs-push-11 {\n  left: 91.66666667%;\n}\n.col-xs-push-10 {\n  left: 83.33333333%;\n}\n.col-xs-push-9 {\n  left: 75%;\n}\n.col-xs-push-8 {\n  left: 66.66666667%;\n}\n.col-xs-push-7 {\n  left: 58.33333333%;\n}\n.col-xs-push-6 {\n  left: 50%;\n}\n.col-xs-push-5 {\n  left: 41.66666667%;\n}\n.col-xs-push-4 {\n  left: 33.33333333%;\n}\n.col-xs-push-3 {\n  left: 25%;\n}\n.col-xs-push-2 {\n  left: 16.66666667%;\n}\n.col-xs-push-1 {\n  left: 8.33333333%;\n}\n.col-xs-push-0 {\n  left: auto;\n}\n.col-xs-offset-12 {\n  margin-left: 100%;\n}\n.col-xs-offset-11 {\n  margin-left: 91.66666667%;\n}\n.col-xs-offset-10 {\n  margin-left: 83.33333333%;\n}\n.col-xs-offset-9 {\n  margin-left: 75%;\n}\n.col-xs-offset-8 {\n  margin-left: 66.66666667%;\n}\n.col-xs-offset-7 {\n  margin-left: 58.33333333%;\n}\n.col-xs-offset-6 {\n  margin-left: 50%;\n}\n.col-xs-offset-5 {\n  margin-left: 41.66666667%;\n}\n.col-xs-offset-4 {\n  margin-left: 33.33333333%;\n}\n.col-xs-offset-3 {\n  margin-left: 25%;\n}\n.col-xs-offset-2 {\n  margin-left: 16.66666667%;\n}\n.col-xs-offset-1 {\n  margin-left: 8.33333333%;\n}\n.col-xs-offset-0 {\n  margin-left: 0;\n}\n@media (min-width: 768px) {\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\n    float: left;\n  }\n  .col-sm-12 {\n    width: 100%;\n  }\n  .col-sm-11 {\n    width: 91.66666667%;\n  }\n  .col-sm-10 {\n    width: 83.33333333%;\n  }\n  .col-sm-9 {\n    width: 75%;\n  }\n  .col-sm-8 {\n    width: 66.66666667%;\n  }\n  .col-sm-7 {\n    width: 58.33333333%;\n  }\n  .col-sm-6 {\n    width: 50%;\n  }\n  .col-sm-5 {\n    width: 41.66666667%;\n  }\n  .col-sm-4 {\n    width: 33.33333333%;\n  }\n  .col-sm-3 {\n    width: 25%;\n  }\n  .col-sm-2 {\n    width: 16.66666667%;\n  }\n  .col-sm-1 {\n    width: 8.33333333%;\n  }\n  .col-sm-pull-12 {\n    right: 100%;\n  }\n  .col-sm-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-sm-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-sm-pull-9 {\n    right: 75%;\n  }\n  .col-sm-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-sm-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-sm-pull-6 {\n    right: 50%;\n  }\n  .col-sm-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-sm-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-sm-pull-3 {\n    right: 25%;\n  }\n  .col-sm-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-sm-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-sm-pull-0 {\n    right: auto;\n  }\n  .col-sm-push-12 {\n    left: 100%;\n  }\n  .col-sm-push-11 {\n    left: 91.66666667%;\n  }\n  .col-sm-push-10 {\n    left: 83.33333333%;\n  }\n  .col-sm-push-9 {\n    left: 75%;\n  }\n  .col-sm-push-8 {\n    left: 66.66666667%;\n  }\n  .col-sm-push-7 {\n    left: 58.33333333%;\n  }\n  .col-sm-push-6 {\n    left: 50%;\n  }\n  .col-sm-push-5 {\n    left: 41.66666667%;\n  }\n  .col-sm-push-4 {\n    left: 33.33333333%;\n  }\n  .col-sm-push-3 {\n    left: 25%;\n  }\n  .col-sm-push-2 {\n    left: 16.66666667%;\n  }\n  .col-sm-push-1 {\n    left: 8.33333333%;\n  }\n  .col-sm-push-0 {\n    left: auto;\n  }\n  .col-sm-offset-12 {\n    margin-left: 100%;\n  }\n  .col-sm-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-sm-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-sm-offset-9 {\n    margin-left: 75%;\n  }\n  .col-sm-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-sm-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-sm-offset-6 {\n    margin-left: 50%;\n  }\n  .col-sm-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-sm-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-sm-offset-3 {\n    margin-left: 25%;\n  }\n  .col-sm-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-sm-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-sm-offset-0 {\n    margin-left: 0;\n  }\n}\n@media (min-width: 992px) {\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\n    float: left;\n  }\n  .col-md-12 {\n    width: 100%;\n  }\n  .col-md-11 {\n    width: 91.66666667%;\n  }\n  .col-md-10 {\n    width: 83.33333333%;\n  }\n  .col-md-9 {\n    width: 75%;\n  }\n  .col-md-8 {\n    width: 66.66666667%;\n  }\n  .col-md-7 {\n    width: 58.33333333%;\n  }\n  .col-md-6 {\n    width: 50%;\n  }\n  .col-md-5 {\n    width: 41.66666667%;\n  }\n  .col-md-4 {\n    width: 33.33333333%;\n  }\n  .col-md-3 {\n    width: 25%;\n  }\n  .col-md-2 {\n    width: 16.66666667%;\n  }\n  .col-md-1 {\n    width: 8.33333333%;\n  }\n  .col-md-pull-12 {\n    right: 100%;\n  }\n  .col-md-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-md-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-md-pull-9 {\n    right: 75%;\n  }\n  .col-md-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-md-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-md-pull-6 {\n    right: 50%;\n  }\n  .col-md-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-md-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-md-pull-3 {\n    right: 25%;\n  }\n  .col-md-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-md-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-md-pull-0 {\n    right: auto;\n  }\n  .col-md-push-12 {\n    left: 100%;\n  }\n  .col-md-push-11 {\n    left: 91.66666667%;\n  }\n  .col-md-push-10 {\n    left: 83.33333333%;\n  }\n  .col-md-push-9 {\n    left: 75%;\n  }\n  .col-md-push-8 {\n    left: 66.66666667%;\n  }\n  .col-md-push-7 {\n    left: 58.33333333%;\n  }\n  .col-md-push-6 {\n    left: 50%;\n  }\n  .col-md-push-5 {\n    left: 41.66666667%;\n  }\n  .col-md-push-4 {\n    left: 33.33333333%;\n  }\n  .col-md-push-3 {\n    left: 25%;\n  }\n  .col-md-push-2 {\n    left: 16.66666667%;\n  }\n  .col-md-push-1 {\n    left: 8.33333333%;\n  }\n  .col-md-push-0 {\n    left: auto;\n  }\n  .col-md-offset-12 {\n    margin-left: 100%;\n  }\n  .col-md-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-md-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-md-offset-9 {\n    margin-left: 75%;\n  }\n  .col-md-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-md-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-md-offset-6 {\n    margin-left: 50%;\n  }\n  .col-md-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-md-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-md-offset-3 {\n    margin-left: 25%;\n  }\n  .col-md-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-md-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-md-offset-0 {\n    margin-left: 0;\n  }\n}\n@media (min-width: 1200px) {\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n    float: left;\n  }\n  .col-lg-12 {\n    width: 100%;\n  }\n  .col-lg-11 {\n    width: 91.66666667%;\n  }\n  .col-lg-10 {\n    width: 83.33333333%;\n  }\n  .col-lg-9 {\n    width: 75%;\n  }\n  .col-lg-8 {\n    width: 66.66666667%;\n  }\n  .col-lg-7 {\n    width: 58.33333333%;\n  }\n  .col-lg-6 {\n    width: 50%;\n  }\n  .col-lg-5 {\n    width: 41.66666667%;\n  }\n  .col-lg-4 {\n    width: 33.33333333%;\n  }\n  .col-lg-3 {\n    width: 25%;\n  }\n  .col-lg-2 {\n    width: 16.66666667%;\n  }\n  .col-lg-1 {\n    width: 8.33333333%;\n  }\n  .col-lg-pull-12 {\n    right: 100%;\n  }\n  .col-lg-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-lg-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-lg-pull-9 {\n    right: 75%;\n  }\n  .col-lg-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-lg-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-lg-pull-6 {\n    right: 50%;\n  }\n  .col-lg-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-lg-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-lg-pull-3 {\n    right: 25%;\n  }\n  .col-lg-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-lg-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-lg-pull-0 {\n    right: auto;\n  }\n  .col-lg-push-12 {\n    left: 100%;\n  }\n  .col-lg-push-11 {\n    left: 91.66666667%;\n  }\n  .col-lg-push-10 {\n    left: 83.33333333%;\n  }\n  .col-lg-push-9 {\n    left: 75%;\n  }\n  .col-lg-push-8 {\n    left: 66.66666667%;\n  }\n  .col-lg-push-7 {\n    left: 58.33333333%;\n  }\n  .col-lg-push-6 {\n    left: 50%;\n  }\n  .col-lg-push-5 {\n    left: 41.66666667%;\n  }\n  .col-lg-push-4 {\n    left: 33.33333333%;\n  }\n  .col-lg-push-3 {\n    left: 25%;\n  }\n  .col-lg-push-2 {\n    left: 16.66666667%;\n  }\n  .col-lg-push-1 {\n    left: 8.33333333%;\n  }\n  .col-lg-push-0 {\n    left: auto;\n  }\n  .col-lg-offset-12 {\n    margin-left: 100%;\n  }\n  .col-lg-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-lg-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-lg-offset-9 {\n    margin-left: 75%;\n  }\n  .col-lg-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-lg-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-lg-offset-6 {\n    margin-left: 50%;\n  }\n  .col-lg-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-lg-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-lg-offset-3 {\n    margin-left: 25%;\n  }\n  .col-lg-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-lg-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-lg-offset-0 {\n    margin-left: 0;\n  }\n}\ntable {\n  background-color: transparent;\n}\ncaption {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  color: #777;\n  text-align: left;\n}\nth {\n  text-align: left;\n}\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 20px;\n}\n.table > thead > tr > th,\n.table > tbody > tr > th,\n.table > tfoot > tr > th,\n.table > thead > tr > td,\n.table > tbody > tr > td,\n.table > tfoot > tr > td {\n  padding: 8px;\n  line-height: 1.42857143;\n  vertical-align: top;\n  border-top: 1px solid #ddd;\n}\n.table > thead > tr > th {\n  vertical-align: bottom;\n  border-bottom: 2px solid #ddd;\n}\n.table > caption + thead > tr:first-child > th,\n.table > colgroup + thead > tr:first-child > th,\n.table > thead:first-child > tr:first-child > th,\n.table > caption + thead > tr:first-child > td,\n.table > colgroup + thead > tr:first-child > td,\n.table > thead:first-child > tr:first-child > td {\n  border-top: 0;\n}\n.table > tbody + tbody {\n  border-top: 2px solid #ddd;\n}\n.table .table {\n  background-color: #fff;\n}\n.table-condensed > thead > tr > th,\n.table-condensed > tbody > tr > th,\n.table-condensed > tfoot > tr > th,\n.table-condensed > thead > tr > td,\n.table-condensed > tbody > tr > td,\n.table-condensed > tfoot > tr > td {\n  padding: 5px;\n}\n.table-bordered {\n  border: 1px solid #ddd;\n}\n.table-bordered > thead > tr > th,\n.table-bordered > tbody > tr > th,\n.table-bordered > tfoot > tr > th,\n.table-bordered > thead > tr > td,\n.table-bordered > tbody > tr > td,\n.table-bordered > tfoot > tr > td {\n  border: 1px solid #ddd;\n}\n.table-bordered > thead > tr > th,\n.table-bordered > thead > tr > td {\n  border-bottom-width: 2px;\n}\n.table-striped > tbody > tr:nth-of-type(odd) {\n  background-color: #f9f9f9;\n}\n.table-hover > tbody > tr:hover {\n  background-color: #f5f5f5;\n}\ntable col[class*=\"col-\"] {\n  position: static;\n  display: table-column;\n  float: none;\n}\ntable td[class*=\"col-\"],\ntable th[class*=\"col-\"] {\n  position: static;\n  display: table-cell;\n  float: none;\n}\n.table > thead > tr > td.active,\n.table > tbody > tr > td.active,\n.table > tfoot > tr > td.active,\n.table > thead > tr > th.active,\n.table > tbody > tr > th.active,\n.table > tfoot > tr > th.active,\n.table > thead > tr.active > td,\n.table > tbody > tr.active > td,\n.table > tfoot > tr.active > td,\n.table > thead > tr.active > th,\n.table > tbody > tr.active > th,\n.table > tfoot > tr.active > th {\n  background-color: #f5f5f5;\n}\n.table-hover > tbody > tr > td.active:hover,\n.table-hover > tbody > tr > th.active:hover,\n.table-hover > tbody > tr.active:hover > td,\n.table-hover > tbody > tr:hover > .active,\n.table-hover > tbody > tr.active:hover > th {\n  background-color: #e8e8e8;\n}\n.table > thead > tr > td.success,\n.table > tbody > tr > td.success,\n.table > tfoot > tr > td.success,\n.table > thead > tr > th.success,\n.table > tbody > tr > th.success,\n.table > tfoot > tr > th.success,\n.table > thead > tr.success > td,\n.table > tbody > tr.success > td,\n.table > tfoot > tr.success > td,\n.table > thead > tr.success > th,\n.table > tbody > tr.success > th,\n.table > tfoot > tr.success > th {\n  background-color: #dff0d8;\n}\n.table-hover > tbody > tr > td.success:hover,\n.table-hover > tbody > tr > th.success:hover,\n.table-hover > tbody > tr.success:hover > td,\n.table-hover > tbody > tr:hover > .success,\n.table-hover > tbody > tr.success:hover > th {\n  background-color: #d0e9c6;\n}\n.table > thead > tr > td.info,\n.table > tbody > tr > td.info,\n.table > tfoot > tr > td.info,\n.table > thead > tr > th.info,\n.table > tbody > tr > th.info,\n.table > tfoot > tr > th.info,\n.table > thead > tr.info > td,\n.table > tbody > tr.info > td,\n.table > tfoot > tr.info > td,\n.table > thead > tr.info > th,\n.table > tbody > tr.info > th,\n.table > tfoot > tr.info > th {\n  background-color: #d9edf7;\n}\n.table-hover > tbody > tr > td.info:hover,\n.table-hover > tbody > tr > th.info:hover,\n.table-hover > tbody > tr.info:hover > td,\n.table-hover > tbody > tr:hover > .info,\n.table-hover > tbody > tr.info:hover > th {\n  background-color: #c4e3f3;\n}\n.table > thead > tr > td.warning,\n.table > tbody > tr > td.warning,\n.table > tfoot > tr > td.warning,\n.table > thead > tr > th.warning,\n.table > tbody > tr > th.warning,\n.table > tfoot > tr > th.warning,\n.table > thead > tr.warning > td,\n.table > tbody > tr.warning > td,\n.table > tfoot > tr.warning > td,\n.table > thead > tr.warning > th,\n.table > tbody > tr.warning > th,\n.table > tfoot > tr.warning > th {\n  background-color: #fcf8e3;\n}\n.table-hover > tbody > tr > td.warning:hover,\n.table-hover > tbody > tr > th.warning:hover,\n.table-hover > tbody > tr.warning:hover > td,\n.table-hover > tbody > tr:hover > .warning,\n.table-hover > tbody > tr.warning:hover > th {\n  background-color: #faf2cc;\n}\n.table > thead > tr > td.danger,\n.table > tbody > tr > td.danger,\n.table > tfoot > tr > td.danger,\n.table > thead > tr > th.danger,\n.table > tbody > tr > th.danger,\n.table > tfoot > tr > th.danger,\n.table > thead > tr.danger > td,\n.table > tbody > tr.danger > td,\n.table > tfoot > tr.danger > td,\n.table > thead > tr.danger > th,\n.table > tbody > tr.danger > th,\n.table > tfoot > tr.danger > th {\n  background-color: #f2dede;\n}\n.table-hover > tbody > tr > td.danger:hover,\n.table-hover > tbody > tr > th.danger:hover,\n.table-hover > tbody > tr.danger:hover > td,\n.table-hover > tbody > tr:hover > .danger,\n.table-hover > tbody > tr.danger:hover > th {\n  background-color: #ebcccc;\n}\n.table-responsive {\n  min-height: .01%;\n  overflow-x: auto;\n}\n@media screen and (max-width: 767px) {\n  .table-responsive {\n    width: 100%;\n    margin-bottom: 15px;\n    overflow-y: hidden;\n    -ms-overflow-style: -ms-autohiding-scrollbar;\n    border: 1px solid #ddd;\n  }\n  .table-responsive > .table {\n    margin-bottom: 0;\n  }\n  .table-responsive > .table > thead > tr > th,\n  .table-responsive > .table > tbody > tr > th,\n  .table-responsive > .table > tfoot > tr > th,\n  .table-responsive > .table > thead > tr > td,\n  .table-responsive > .table > tbody > tr > td,\n  .table-responsive > .table > tfoot > tr > td {\n    white-space: nowrap;\n  }\n  .table-responsive > .table-bordered {\n    border: 0;\n  }\n  .table-responsive > .table-bordered > thead > tr > th:first-child,\n  .table-responsive > .table-bordered > tbody > tr > th:first-child,\n  .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n  .table-responsive > .table-bordered > thead > tr > td:first-child,\n  .table-responsive > .table-bordered > tbody > tr > td:first-child,\n  .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n    border-left: 0;\n  }\n  .table-responsive > .table-bordered > thead > tr > th:last-child,\n  .table-responsive > .table-bordered > tbody > tr > th:last-child,\n  .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n  .table-responsive > .table-bordered > thead > tr > td:last-child,\n  .table-responsive > .table-bordered > tbody > tr > td:last-child,\n  .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n    border-right: 0;\n  }\n  .table-responsive > .table-bordered > tbody > tr:last-child > th,\n  .table-responsive > .table-bordered > tfoot > tr:last-child > th,\n  .table-responsive > .table-bordered > tbody > tr:last-child > td,\n  .table-responsive > .table-bordered > tfoot > tr:last-child > td {\n    border-bottom: 0;\n  }\n}\nfieldset {\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: 0;\n}\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: 20px;\n  font-size: 21px;\n  line-height: inherit;\n  color: #333;\n  border: 0;\n  border-bottom: 1px solid #e5e5e5;\n}\nlabel {\n  display: inline-block;\n  /*max-width: 100%;\r\n  margin-bottom: 5px;\r\n  font-weight: bold;*/\n}\ninput[type=\"search\"] {\n  -webkit-box-sizing: border-box;\n     -moz-box-sizing: border-box;\n          box-sizing: border-box;\n}\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  margin: 4px 0 0;\n  margin-top: 1px \\9;\n  line-height: normal;\n}\ninput[type=\"file\"] {\n  display: block;\n}\ninput[type=\"range\"] {\n  display: block;\n  width: 100%;\n}\nselect[multiple],\nselect[size] {\n  height: auto;\n}\ninput[type=\"file\"]:focus,\ninput[type=\"radio\"]:focus,\ninput[type=\"checkbox\"]:focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\noutput {\n  display: block;\n  padding-top: 7px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #555;\n}\n.form-control {\n  display: block;\n  width: 100%;\n  height: 34px;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  color: #555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\n  -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;\n       -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n          transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\n}\n.form-control:focus {\n  border-color: #66afe9;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);\n          box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);\n}\n.form-control::-moz-placeholder {\n  color: #999;\n  opacity: 1;\n}\n.form-control:-ms-input-placeholder {\n  color: #999;\n}\n.form-control::-webkit-input-placeholder {\n  color: #999;\n}\n.form-control::-ms-expand {\n  background-color: transparent;\n  border: 0;\n}\n.form-control[disabled],\n.form-control[readonly],\nfieldset[disabled] .form-control {\n  background-color: #eee;\n  opacity: 1;\n}\n.form-control[disabled],\nfieldset[disabled] .form-control {\n  cursor: not-allowed;\n}\ntextarea.form-control {\n  height: auto;\n}\ninput[type=\"search\"] {\n  -webkit-appearance: none;\n}\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  input[type=\"date\"].form-control,\n  input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].form-control {\n    line-height: 34px;\n  }\n  input[type=\"date\"].input-sm,\n  input[type=\"time\"].input-sm,\n  input[type=\"datetime-local\"].input-sm,\n  input[type=\"month\"].input-sm,\n  .input-group-sm input[type=\"date\"],\n  .input-group-sm input[type=\"time\"],\n  .input-group-sm input[type=\"datetime-local\"],\n  .input-group-sm input[type=\"month\"] {\n    line-height: 30px;\n  }\n  input[type=\"date\"].input-lg,\n  input[type=\"time\"].input-lg,\n  input[type=\"datetime-local\"].input-lg,\n  input[type=\"month\"].input-lg,\n  .input-group-lg input[type=\"date\"],\n  .input-group-lg input[type=\"time\"],\n  .input-group-lg input[type=\"datetime-local\"],\n  .input-group-lg input[type=\"month\"] {\n    line-height: 46px;\n  }\n}\n.form-group {\n  margin-bottom: 15px;\n}\n.radio,\n.checkbox {\n  position: relative;\n  display: block;\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.radio label,\n.checkbox label {\n  min-height: 20px;\n  padding-left: 20px;\n  margin-bottom: 0;\n  font-weight: normal;\n  cursor: pointer;\n}\n.radio input[type=\"radio\"],\n.radio-inline input[type=\"radio\"],\n.checkbox input[type=\"checkbox\"],\n.checkbox-inline input[type=\"checkbox\"] {\n  position: absolute;\n  margin-top: 4px \\9;\n  margin-left: -20px;\n}\n.radio + .radio,\n.checkbox + .checkbox {\n  margin-top: -5px;\n}\n.radio-inline,\n.checkbox-inline {\n  position: relative;\n  display: inline-block;\n  padding-left: 20px;\n  margin-bottom: 0;\n  font-weight: normal;\n  vertical-align: middle;\n  cursor: pointer;\n}\n.radio-inline + .radio-inline,\n.checkbox-inline + .checkbox-inline {\n  margin-top: 0;\n  margin-left: 10px;\n}\ninput[type=\"radio\"][disabled],\ninput[type=\"checkbox\"][disabled],\ninput[type=\"radio\"].disabled,\ninput[type=\"checkbox\"].disabled,\nfieldset[disabled] input[type=\"radio\"],\nfieldset[disabled] input[type=\"checkbox\"] {\n  cursor: not-allowed;\n}\n.radio-inline.disabled,\n.checkbox-inline.disabled,\nfieldset[disabled] .radio-inline,\nfieldset[disabled] .checkbox-inline {\n  cursor: not-allowed;\n}\n.radio.disabled label,\n.checkbox.disabled label,\nfieldset[disabled] .radio label,\nfieldset[disabled] .checkbox label {\n  cursor: not-allowed;\n}\n.form-control-static {\n  min-height: 34px;\n  padding-top: 7px;\n  padding-bottom: 7px;\n  margin-bottom: 0;\n}\n.form-control-static.input-lg,\n.form-control-static.input-sm {\n  padding-right: 0;\n  padding-left: 0;\n}\n.input-sm {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\nselect.input-sm {\n  height: 30px;\n  line-height: 30px;\n}\ntextarea.input-sm,\nselect[multiple].input-sm {\n  height: auto;\n}\n.form-group-sm .form-control {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.form-group-sm select.form-control {\n  height: 30px;\n  line-height: 30px;\n}\n.form-group-sm textarea.form-control,\n.form-group-sm select[multiple].form-control {\n  height: auto;\n}\n.form-group-sm .form-control-static {\n  height: 30px;\n  min-height: 32px;\n  padding: 6px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.input-lg {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\nselect.input-lg {\n  height: 46px;\n  line-height: 46px;\n}\ntextarea.input-lg,\nselect[multiple].input-lg {\n  height: auto;\n}\n.form-group-lg .form-control {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n.form-group-lg select.form-control {\n  height: 46px;\n  line-height: 46px;\n}\n.form-group-lg textarea.form-control,\n.form-group-lg select[multiple].form-control {\n  height: auto;\n}\n.form-group-lg .form-control-static {\n  height: 46px;\n  min-height: 38px;\n  padding: 11px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n}\n.has-feedback {\n  position: relative;\n}\n.has-feedback .form-control {\n  padding-right: 42.5px;\n}\n.form-control-feedback {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: block;\n  width: 34px;\n  height: 34px;\n  line-height: 34px;\n  text-align: center;\n  pointer-events: none;\n}\n.input-lg + .form-control-feedback,\n.input-group-lg + .form-control-feedback,\n.form-group-lg .form-control + .form-control-feedback {\n  width: 46px;\n  height: 46px;\n  line-height: 46px;\n}\n.input-sm + .form-control-feedback,\n.input-group-sm + .form-control-feedback,\n.form-group-sm .form-control + .form-control-feedback {\n  width: 30px;\n  height: 30px;\n  line-height: 30px;\n}\n.has-success .help-block,\n.has-success .control-label,\n.has-success .radio,\n.has-success .checkbox,\n.has-success .radio-inline,\n.has-success .checkbox-inline,\n.has-success.radio label,\n.has-success.checkbox label,\n.has-success.radio-inline label,\n.has-success.checkbox-inline label {\n  color: #3c763d;\n}\n.has-success .form-control {\n  border-color: #3c763d;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\n}\n.has-success .form-control:focus {\n  border-color: #2b542c;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168;\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168;\n}\n.has-success .input-group-addon {\n  color: #3c763d;\n  background-color: #dff0d8;\n  border-color: #3c763d;\n}\n.has-success .form-control-feedback {\n  color: #3c763d;\n}\n.has-warning .help-block,\n.has-warning .control-label,\n.has-warning .radio,\n.has-warning .checkbox,\n.has-warning .radio-inline,\n.has-warning .checkbox-inline,\n.has-warning.radio label,\n.has-warning.checkbox label,\n.has-warning.radio-inline label,\n.has-warning.checkbox-inline label {\n  color: #8a6d3b;\n}\n.has-warning .form-control {\n  border-color: #8a6d3b;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\n}\n.has-warning .form-control:focus {\n  border-color: #66512c;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #c0a16b;\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #c0a16b;\n}\n.has-warning .input-group-addon {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n  border-color: #8a6d3b;\n}\n.has-warning .form-control-feedback {\n  color: #8a6d3b;\n}\n.has-error .help-block,\n.has-error .control-label,\n.has-error .radio,\n.has-error .checkbox,\n.has-error .radio-inline,\n.has-error .checkbox-inline,\n.has-error.radio label,\n.has-error.checkbox label,\n.has-error.radio-inline label,\n.has-error.checkbox-inline label {\n  color: #a94442;\n}\n.has-error .form-control {\n  border-color: #a94442;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\n}\n.has-error .form-control:focus {\n  border-color: #843534;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;\n}\n.has-error .input-group-addon {\n  color: #a94442;\n  background-color: #f2dede;\n  border-color: #a94442;\n}\n.has-error .form-control-feedback {\n  color: #a94442;\n}\n.has-feedback label ~ .form-control-feedback {\n  top: 25px;\n}\n.has-feedback label.sr-only ~ .form-control-feedback {\n  top: 0;\n}\n.help-block {\n  display: block;\n  margin-top: 5px;\n  margin-bottom: 10px;\n  color: #737373;\n}\n@media (min-width: 768px) {\n  .form-inline .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle;\n  }\n  .form-inline .form-control-static {\n    display: inline-block;\n  }\n  .form-inline .input-group {\n    display: inline-table;\n    vertical-align: middle;\n  }\n  .form-inline .input-group .input-group-addon,\n  .form-inline .input-group .input-group-btn,\n  .form-inline .input-group .form-control {\n    width: auto;\n  }\n  .form-inline .input-group > .form-control {\n    width: 100%;\n  }\n  .form-inline .control-label {\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio,\n  .form-inline .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio label,\n  .form-inline .checkbox label {\n    padding-left: 0;\n  }\n  .form-inline .radio input[type=\"radio\"],\n  .form-inline .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0;\n  }\n  .form-inline .has-feedback .form-control-feedback {\n    top: 0;\n  }\n}\n.form-horizontal .radio,\n.form-horizontal .checkbox,\n.form-horizontal .radio-inline,\n.form-horizontal .checkbox-inline {\n  padding-top: 7px;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n.form-horizontal .radio,\n.form-horizontal .checkbox {\n  min-height: 27px;\n}\n.form-horizontal .form-group {\n  margin-right: -15px;\n  margin-left: -15px;\n}\n@media (min-width: 768px) {\n  .form-horizontal .control-label {\n    padding-top: 7px;\n    margin-bottom: 0;\n    text-align: right;\n  }\n}\n.form-horizontal .has-feedback .form-control-feedback {\n  right: 15px;\n}\n@media (min-width: 768px) {\n  .form-horizontal .form-group-lg .control-label {\n    padding-top: 11px;\n    font-size: 18px;\n  }\n}\n@media (min-width: 768px) {\n  .form-horizontal .form-group-sm .control-label {\n    padding-top: 6px;\n    font-size: 12px;\n  }\n}\n.btn {\n  display: inline-block;\n  padding: 6px 12px;\n  margin-bottom: 0;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: 1.42857143;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  -ms-touch-action: manipulation;\n      touch-action: manipulation;\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  background-image: none;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n.btn:focus,\n.btn:active:focus,\n.btn.active:focus,\n.btn.focus,\n.btn:active.focus,\n.btn.active.focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n.btn:hover,\n.btn:focus,\n.btn.focus {\n  color: #333;\n  text-decoration: none;\n}\n.btn:active,\n.btn.active {\n  background-image: none;\n  outline: 0;\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\n          box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\n}\n.btn.disabled,\n.btn[disabled],\nfieldset[disabled] .btn {\n  cursor: not-allowed;\n  filter: alpha(opacity=65);\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  opacity: .65;\n}\na.btn.disabled,\nfieldset[disabled] a.btn {\n  pointer-events: none;\n}\n.btn-default {\n  color: #333;\n  background-color: #fff;\n  border-color: #ccc;\n}\n.btn-default:focus,\n.btn-default.focus {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #8c8c8c;\n}\n.btn-default:hover {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n.btn-default:active,\n.btn-default.active,\n.open > .dropdown-toggle.btn-default {\n  color: #333;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n.btn-default:active:hover,\n.btn-default.active:hover,\n.open > .dropdown-toggle.btn-default:hover,\n.btn-default:active:focus,\n.btn-default.active:focus,\n.open > .dropdown-toggle.btn-default:focus,\n.btn-default:active.focus,\n.btn-default.active.focus,\n.open > .dropdown-toggle.btn-default.focus {\n  color: #333;\n  background-color: #d4d4d4;\n  border-color: #8c8c8c;\n}\n.btn-default:active,\n.btn-default.active,\n.open > .dropdown-toggle.btn-default {\n  background-image: none;\n}\n.btn-default.disabled:hover,\n.btn-default[disabled]:hover,\nfieldset[disabled] .btn-default:hover,\n.btn-default.disabled:focus,\n.btn-default[disabled]:focus,\nfieldset[disabled] .btn-default:focus,\n.btn-default.disabled.focus,\n.btn-default[disabled].focus,\nfieldset[disabled] .btn-default.focus {\n  background-color: #fff;\n  border-color: #ccc;\n}\n.btn-default .badge {\n  color: #fff;\n  background-color: #333;\n}\n.btn-primary {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #2e6da4;\n}\n.btn-primary:focus,\n.btn-primary.focus {\n  color: #fff;\n  background-color: #286090;\n  border-color: #122b40;\n}\n.btn-primary:hover {\n  color: #fff;\n  background-color: #286090;\n  border-color: #204d74;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open > .dropdown-toggle.btn-primary {\n  color: #fff;\n  background-color: #286090;\n  border-color: #204d74;\n}\n.btn-primary:active:hover,\n.btn-primary.active:hover,\n.open > .dropdown-toggle.btn-primary:hover,\n.btn-primary:active:focus,\n.btn-primary.active:focus,\n.open > .dropdown-toggle.btn-primary:focus,\n.btn-primary:active.focus,\n.btn-primary.active.focus,\n.open > .dropdown-toggle.btn-primary.focus {\n  color: #fff;\n  background-color: #204d74;\n  border-color: #122b40;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open > .dropdown-toggle.btn-primary {\n  background-image: none;\n}\n.btn-primary.disabled:hover,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary:hover,\n.btn-primary.disabled:focus,\n.btn-primary[disabled]:focus,\nfieldset[disabled] .btn-primary:focus,\n.btn-primary.disabled.focus,\n.btn-primary[disabled].focus,\nfieldset[disabled] .btn-primary.focus {\n  background-color: #337ab7;\n  border-color: #2e6da4;\n}\n.btn-primary .badge {\n  color: #337ab7;\n  background-color: #fff;\n}\n.btn-success {\n  color: #fff;\n  background-color: #5cb85c;\n  border-color: #4cae4c;\n}\n.btn-success:focus,\n.btn-success.focus {\n  color: #fff;\n  background-color: #449d44;\n  border-color: #255625;\n}\n.btn-success:hover {\n  color: #fff;\n  background-color: #449d44;\n  border-color: #398439;\n}\n.btn-success:active,\n.btn-success.active,\n.open > .dropdown-toggle.btn-success {\n  color: #fff;\n  background-color: #449d44;\n  border-color: #398439;\n}\n.btn-success:active:hover,\n.btn-success.active:hover,\n.open > .dropdown-toggle.btn-success:hover,\n.btn-success:active:focus,\n.btn-success.active:focus,\n.open > .dropdown-toggle.btn-success:focus,\n.btn-success:active.focus,\n.btn-success.active.focus,\n.open > .dropdown-toggle.btn-success.focus {\n  color: #fff;\n  background-color: #398439;\n  border-color: #255625;\n}\n.btn-success:active,\n.btn-success.active,\n.open > .dropdown-toggle.btn-success {\n  background-image: none;\n}\n.btn-success.disabled:hover,\n.btn-success[disabled]:hover,\nfieldset[disabled] .btn-success:hover,\n.btn-success.disabled:focus,\n.btn-success[disabled]:focus,\nfieldset[disabled] .btn-success:focus,\n.btn-success.disabled.focus,\n.btn-success[disabled].focus,\nfieldset[disabled] .btn-success.focus {\n  background-color: #5cb85c;\n  border-color: #4cae4c;\n}\n.btn-success .badge {\n  color: #5cb85c;\n  background-color: #fff;\n}\n.btn-info {\n  color: #fff;\n  background-color: #5bc0de;\n  border-color: #46b8da;\n}\n.btn-info:focus,\n.btn-info.focus {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #1b6d85;\n}\n.btn-info:hover {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #269abc;\n}\n.btn-info:active,\n.btn-info.active,\n.open > .dropdown-toggle.btn-info {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #269abc;\n}\n.btn-info:active:hover,\n.btn-info.active:hover,\n.open > .dropdown-toggle.btn-info:hover,\n.btn-info:active:focus,\n.btn-info.active:focus,\n.open > .dropdown-toggle.btn-info:focus,\n.btn-info:active.focus,\n.btn-info.active.focus,\n.open > .dropdown-toggle.btn-info.focus {\n  color: #fff;\n  background-color: #269abc;\n  border-color: #1b6d85;\n}\n.btn-info:active,\n.btn-info.active,\n.open > .dropdown-toggle.btn-info {\n  background-image: none;\n}\n.btn-info.disabled:hover,\n.btn-info[disabled]:hover,\nfieldset[disabled] .btn-info:hover,\n.btn-info.disabled:focus,\n.btn-info[disabled]:focus,\nfieldset[disabled] .btn-info:focus,\n.btn-info.disabled.focus,\n.btn-info[disabled].focus,\nfieldset[disabled] .btn-info.focus {\n  background-color: #5bc0de;\n  border-color: #46b8da;\n}\n.btn-info .badge {\n  color: #5bc0de;\n  background-color: #fff;\n}\n.btn-warning {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #eea236;\n}\n.btn-warning:focus,\n.btn-warning.focus {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #985f0d;\n}\n.btn-warning:hover {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #d58512;\n}\n.btn-warning:active,\n.btn-warning.active,\n.open > .dropdown-toggle.btn-warning {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #d58512;\n}\n.btn-warning:active:hover,\n.btn-warning.active:hover,\n.open > .dropdown-toggle.btn-warning:hover,\n.btn-warning:active:focus,\n.btn-warning.active:focus,\n.open > .dropdown-toggle.btn-warning:focus,\n.btn-warning:active.focus,\n.btn-warning.active.focus,\n.open > .dropdown-toggle.btn-warning.focus {\n  color: #fff;\n  background-color: #d58512;\n  border-color: #985f0d;\n}\n.btn-warning:active,\n.btn-warning.active,\n.open > .dropdown-toggle.btn-warning {\n  background-image: none;\n}\n.btn-warning.disabled:hover,\n.btn-warning[disabled]:hover,\nfieldset[disabled] .btn-warning:hover,\n.btn-warning.disabled:focus,\n.btn-warning[disabled]:focus,\nfieldset[disabled] .btn-warning:focus,\n.btn-warning.disabled.focus,\n.btn-warning[disabled].focus,\nfieldset[disabled] .btn-warning.focus {\n  background-color: #f0ad4e;\n  border-color: #eea236;\n}\n.btn-warning .badge {\n  color: #f0ad4e;\n  background-color: #fff;\n}\n.btn-danger {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d43f3a;\n}\n.btn-danger:focus,\n.btn-danger.focus {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #761c19;\n}\n.btn-danger:hover {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #ac2925;\n}\n.btn-danger:active,\n.btn-danger.active,\n.open > .dropdown-toggle.btn-danger {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #ac2925;\n}\n.btn-danger:active:hover,\n.btn-danger.active:hover,\n.open > .dropdown-toggle.btn-danger:hover,\n.btn-danger:active:focus,\n.btn-danger.active:focus,\n.open > .dropdown-toggle.btn-danger:focus,\n.btn-danger:active.focus,\n.btn-danger.active.focus,\n.open > .dropdown-toggle.btn-danger.focus {\n  color: #fff;\n  background-color: #ac2925;\n  border-color: #761c19;\n}\n.btn-danger:active,\n.btn-danger.active,\n.open > .dropdown-toggle.btn-danger {\n  background-image: none;\n}\n.btn-danger.disabled:hover,\n.btn-danger[disabled]:hover,\nfieldset[disabled] .btn-danger:hover,\n.btn-danger.disabled:focus,\n.btn-danger[disabled]:focus,\nfieldset[disabled] .btn-danger:focus,\n.btn-danger.disabled.focus,\n.btn-danger[disabled].focus,\nfieldset[disabled] .btn-danger.focus {\n  background-color: #d9534f;\n  border-color: #d43f3a;\n}\n.btn-danger .badge {\n  color: #d9534f;\n  background-color: #fff;\n}\n.btn-link {\n  font-weight: normal;\n  color: #337ab7;\n  border-radius: 0;\n}\n.btn-link,\n.btn-link:active,\n.btn-link.active,\n.btn-link[disabled],\nfieldset[disabled] .btn-link {\n  background-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n.btn-link,\n.btn-link:hover,\n.btn-link:focus,\n.btn-link:active {\n  border-color: transparent;\n}\n.btn-link:hover,\n.btn-link:focus {\n  color: #23527c;\n  text-decoration: underline;\n  background-color: transparent;\n}\n.btn-link[disabled]:hover,\nfieldset[disabled] .btn-link:hover,\n.btn-link[disabled]:focus,\nfieldset[disabled] .btn-link:focus {\n  color: #777;\n  text-decoration: none;\n}\n.btn-lg,\n.btn-group-lg > .btn {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\n.btn-sm,\n.btn-group-sm > .btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.btn-xs,\n.btn-group-xs > .btn {\n  padding: 1px 5px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.btn-block {\n  display: block;\n  width: 100%;\n}\n.btn-block + .btn-block {\n  margin-top: 5px;\n}\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%;\n}\n.fade {\n  opacity: 0;\n  -webkit-transition: opacity .15s linear;\n       -o-transition: opacity .15s linear;\n          transition: opacity .15s linear;\n}\n.fade.in {\n  opacity: 1;\n}\n.collapse {\n  display: none;\n}\n.collapse.in {\n  display: block;\n}\ntr.collapse.in {\n  display: table-row;\n}\ntbody.collapse.in {\n  display: table-row-group;\n}\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  -webkit-transition-timing-function: ease;\n       -o-transition-timing-function: ease;\n          transition-timing-function: ease;\n  -webkit-transition-duration: .35s;\n       -o-transition-duration: .35s;\n          transition-duration: .35s;\n  -webkit-transition-property: height, visibility;\n       -o-transition-property: height, visibility;\n          transition-property: height, visibility;\n}\n.caret {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 2px;\n  vertical-align: middle;\n  border-top: 4px dashed;\n  border-top: 4px solid \\9;\n  border-right: 4px solid transparent;\n  border-left: 4px solid transparent;\n}\n.dropup,\n.dropdown {\n  position: relative;\n}\n.dropdown-toggle:focus {\n  outline: 0;\n}\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 160px;\n  padding: 5px 0;\n  margin: 2px 0 0;\n  font-size: 14px;\n  text-align: left;\n  list-style: none;\n  background-color: #fff;\n  -webkit-background-clip: padding-box;\n          background-clip: padding-box;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, .15);\n  border-radius: 4px;\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);\n          box-shadow: 0 6px 12px rgba(0, 0, 0, .175);\n}\n.dropdown-menu.pull-right {\n  right: 0;\n  left: auto;\n}\n.dropdown-menu .divider {\n  height: 1px;\n  margin: 9px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n.dropdown-menu > li > a {\n  display: block;\n  padding: 3px 20px;\n  clear: both;\n  font-weight: normal;\n  line-height: 1.42857143;\n  color: #333;\n  white-space: nowrap;\n}\n.dropdown-menu > li > a:hover,\n.dropdown-menu > li > a:focus {\n  color: #262626;\n  text-decoration: none;\n  background-color: #f5f5f5;\n}\n.dropdown-menu > .active > a,\n.dropdown-menu > .active > a:hover,\n.dropdown-menu > .active > a:focus {\n  color: #fff;\n  text-decoration: none;\n  background-color: #337ab7;\n  outline: 0;\n}\n.dropdown-menu > .disabled > a,\n.dropdown-menu > .disabled > a:hover,\n.dropdown-menu > .disabled > a:focus {\n  color: #777;\n}\n.dropdown-menu > .disabled > a:hover,\n.dropdown-menu > .disabled > a:focus {\n  text-decoration: none;\n  cursor: not-allowed;\n  background-color: transparent;\n  background-image: none;\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n}\n.open > .dropdown-menu {\n  display: block;\n}\n.open > a {\n  outline: 0;\n}\n.dropdown-menu-right {\n  right: 0;\n  left: auto;\n}\n.dropdown-menu-left {\n  right: auto;\n  left: 0;\n}\n.dropdown-header {\n  display: block;\n  padding: 3px 20px;\n  font-size: 12px;\n  line-height: 1.42857143;\n  color: #777;\n  white-space: nowrap;\n}\n.dropdown-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 990;\n}\n.pull-right > .dropdown-menu {\n  right: 0;\n  left: auto;\n}\n.dropup .caret,\n.navbar-fixed-bottom .dropdown .caret {\n  content: \"\";\n  border-top: 0;\n  border-bottom: 4px dashed;\n  border-bottom: 4px solid \\9;\n}\n.dropup .dropdown-menu,\n.navbar-fixed-bottom .dropdown .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-bottom: 2px;\n}\n@media (min-width: 768px) {\n  .navbar-right .dropdown-menu {\n    right: 0;\n    left: auto;\n  }\n  .navbar-right .dropdown-menu-left {\n    right: auto;\n    left: 0;\n  }\n}\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n}\n.btn-group > .btn,\n.btn-group-vertical > .btn {\n  position: relative;\n  float: left;\n}\n.btn-group > .btn:hover,\n.btn-group-vertical > .btn:hover,\n.btn-group > .btn:focus,\n.btn-group-vertical > .btn:focus,\n.btn-group > .btn:active,\n.btn-group-vertical > .btn:active,\n.btn-group > .btn.active,\n.btn-group-vertical > .btn.active {\n  z-index: 2;\n}\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px;\n}\n.btn-toolbar {\n  margin-left: -5px;\n}\n.btn-toolbar .btn,\n.btn-toolbar .btn-group,\n.btn-toolbar .input-group {\n  float: left;\n}\n.btn-toolbar > .btn,\n.btn-toolbar > .btn-group,\n.btn-toolbar > .input-group {\n  margin-left: 5px;\n}\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n  border-radius: 0;\n}\n.btn-group > .btn:first-child {\n  margin-left: 0;\n}\n.btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.btn-group > .btn:last-child:not(:first-child),\n.btn-group > .dropdown-toggle:not(:first-child) {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.btn-group > .btn-group {\n  float: left;\n}\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.btn-group .dropdown-toggle:active,\n.btn-group.open .dropdown-toggle {\n  outline: 0;\n}\n.btn-group > .btn + .dropdown-toggle {\n  padding-right: 8px;\n  padding-left: 8px;\n}\n.btn-group > .btn-lg + .dropdown-toggle {\n  padding-right: 12px;\n  padding-left: 12px;\n}\n.btn-group.open .dropdown-toggle {\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\n          box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\n}\n.btn-group.open .dropdown-toggle.btn-link {\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n.btn .caret {\n  margin-left: 0;\n}\n.btn-lg .caret {\n  border-width: 5px 5px 0;\n  border-bottom-width: 0;\n}\n.dropup .btn-lg .caret {\n  border-width: 0 5px 5px;\n}\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group,\n.btn-group-vertical > .btn-group > .btn {\n  display: block;\n  float: none;\n  width: 100%;\n  max-width: 100%;\n}\n.btn-group-vertical > .btn-group > .btn {\n  float: none;\n}\n.btn-group-vertical > .btn + .btn,\n.btn-group-vertical > .btn + .btn-group,\n.btn-group-vertical > .btn-group + .btn,\n.btn-group-vertical > .btn-group + .btn-group {\n  margin-top: -1px;\n  margin-left: 0;\n}\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n.btn-group-justified {\n  display: table;\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: separate;\n}\n.btn-group-justified > .btn,\n.btn-group-justified > .btn-group {\n  display: table-cell;\n  float: none;\n  width: 1%;\n}\n.btn-group-justified > .btn-group .btn {\n  width: 100%;\n}\n.btn-group-justified > .btn-group .dropdown-menu {\n  left: auto;\n}\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none;\n}\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n.input-group[class*=\"col-\"] {\n  float: none;\n  padding-right: 0;\n  padding-left: 0;\n}\n.input-group .form-control {\n  position: relative;\n  z-index: 2;\n  float: left;\n  width: 100%;\n  margin-bottom: 0;\n}\n.input-group .form-control:focus {\n  z-index: 3;\n}\n.input-group-lg > .form-control,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .btn {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n  border-radius: 6px;\n}\nselect.input-group-lg > .form-control,\nselect.input-group-lg > .input-group-addon,\nselect.input-group-lg > .input-group-btn > .btn {\n  height: 46px;\n  line-height: 46px;\n}\ntextarea.input-group-lg > .form-control,\ntextarea.input-group-lg > .input-group-addon,\ntextarea.input-group-lg > .input-group-btn > .btn,\nselect[multiple].input-group-lg > .form-control,\nselect[multiple].input-group-lg > .input-group-addon,\nselect[multiple].input-group-lg > .input-group-btn > .btn {\n  height: auto;\n}\n.input-group-sm > .form-control,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\nselect.input-group-sm > .form-control,\nselect.input-group-sm > .input-group-addon,\nselect.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  line-height: 30px;\n}\ntextarea.input-group-sm > .form-control,\ntextarea.input-group-sm > .input-group-addon,\ntextarea.input-group-sm > .input-group-btn > .btn,\nselect[multiple].input-group-sm > .form-control,\nselect[multiple].input-group-sm > .input-group-addon,\nselect[multiple].input-group-sm > .input-group-btn > .btn {\n  height: auto;\n}\n.input-group-addon,\n.input-group-btn,\n.input-group .form-control {\n  display: table-cell;\n}\n.input-group-addon:not(:first-child):not(:last-child),\n.input-group-btn:not(:first-child):not(:last-child),\n.input-group .form-control:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.input-group-addon,\n.input-group-btn {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle;\n}\n.input-group-addon {\n  padding: 6px 12px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: 1;\n  color: #555;\n  text-align: center;\n  background-color: #eee;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\n.input-group-addon.input-sm {\n  padding: 5px 10px;\n  font-size: 12px;\n  border-radius: 3px;\n}\n.input-group-addon.input-lg {\n  padding: 10px 16px;\n  font-size: 18px;\n  border-radius: 6px;\n}\n.input-group-addon input[type=\"radio\"],\n.input-group-addon input[type=\"checkbox\"] {\n  margin-top: 0;\n}\n.input-group .form-control:first-child,\n.input-group-addon:first-child,\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group > .btn,\n.input-group-btn:first-child > .dropdown-toggle,\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.input-group-addon:first-child {\n  border-right: 0;\n}\n.input-group .form-control:last-child,\n.input-group-addon:last-child,\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group > .btn,\n.input-group-btn:last-child > .dropdown-toggle,\n.input-group-btn:first-child > .btn:not(:first-child),\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.input-group-addon:last-child {\n  border-left: 0;\n}\n.input-group-btn {\n  position: relative;\n  font-size: 0;\n  white-space: nowrap;\n}\n.input-group-btn > .btn {\n  position: relative;\n}\n.input-group-btn > .btn + .btn {\n  margin-left: -1px;\n}\n.input-group-btn > .btn:hover,\n.input-group-btn > .btn:focus,\n.input-group-btn > .btn:active {\n  z-index: 2;\n}\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group {\n  margin-right: -1px;\n}\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group {\n  z-index: 2;\n  margin-left: -1px;\n}\n.nav {\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none;\n}\n.nav > li {\n  position: relative;\n  display: block;\n}\n.nav > li > a {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n}\n.nav > li > a:hover,\n.nav > li > a:focus {\n  text-decoration: none;\n  background-color: #eee;\n}\n.nav > li.disabled > a {\n  color: #777;\n}\n.nav > li.disabled > a:hover,\n.nav > li.disabled > a:focus {\n  color: #777;\n  text-decoration: none;\n  cursor: not-allowed;\n  background-color: transparent;\n}\n.nav .open > a,\n.nav .open > a:hover,\n.nav .open > a:focus {\n  background-color: #eee;\n  border-color: #337ab7;\n}\n.nav .nav-divider {\n  height: 1px;\n  margin: 9px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n.nav > li > a > img {\n  max-width: none;\n}\n.nav-tabs {\n  border-bottom: 1px solid #ddd;\n}\n.nav-tabs > li {\n  float: left;\n  margin-bottom: -1px;\n}\n.nav-tabs > li > a {\n  margin-right: 2px;\n  line-height: 1.42857143;\n  border: 1px solid transparent;\n  border-radius: 4px 4px 0 0;\n}\n.nav-tabs > li > a:hover {\n  border-color: #eee #eee #ddd;\n}\n.nav-tabs > li.active > a,\n.nav-tabs > li.active > a:hover,\n.nav-tabs > li.active > a:focus {\n  color: #555;\n  cursor: default;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-bottom-color: transparent;\n}\n.nav-tabs.nav-justified {\n  width: 100%;\n  border-bottom: 0;\n}\n.nav-tabs.nav-justified > li {\n  float: none;\n}\n.nav-tabs.nav-justified > li > a {\n  margin-bottom: 5px;\n  text-align: center;\n}\n.nav-tabs.nav-justified > .dropdown .dropdown-menu {\n  top: auto;\n  left: auto;\n}\n@media (min-width: 768px) {\n  .nav-tabs.nav-justified > li {\n    display: table-cell;\n    width: 1%;\n  }\n  .nav-tabs.nav-justified > li > a {\n    margin-bottom: 0;\n  }\n}\n.nav-tabs.nav-justified > li > a {\n  margin-right: 0;\n  border-radius: 4px;\n}\n.nav-tabs.nav-justified > .active > a,\n.nav-tabs.nav-justified > .active > a:hover,\n.nav-tabs.nav-justified > .active > a:focus {\n  border: 1px solid #ddd;\n}\n@media (min-width: 768px) {\n  .nav-tabs.nav-justified > li > a {\n    border-bottom: 1px solid #ddd;\n    border-radius: 4px 4px 0 0;\n  }\n  .nav-tabs.nav-justified > .active > a,\n  .nav-tabs.nav-justified > .active > a:hover,\n  .nav-tabs.nav-justified > .active > a:focus {\n    border-bottom-color: #fff;\n  }\n}\n.nav-pills > li {\n  float: left;\n}\n.nav-pills > li > a {\n  border-radius: 4px;\n}\n.nav-pills > li + li {\n  margin-left: 2px;\n}\n.nav-pills > li.active > a,\n.nav-pills > li.active > a:hover,\n.nav-pills > li.active > a:focus {\n  color: #fff;\n  background-color: #337ab7;\n}\n.nav-stacked > li {\n  float: none;\n}\n.nav-stacked > li + li {\n  margin-top: 2px;\n  margin-left: 0;\n}\n.nav-justified {\n  width: 100%;\n}\n.nav-justified > li {\n  float: none;\n}\n.nav-justified > li > a {\n  margin-bottom: 5px;\n  text-align: center;\n}\n.nav-justified > .dropdown .dropdown-menu {\n  top: auto;\n  left: auto;\n}\n@media (min-width: 768px) {\n  .nav-justified > li {\n    display: table-cell;\n    width: 1%;\n  }\n  .nav-justified > li > a {\n    margin-bottom: 0;\n  }\n}\n.nav-tabs-justified {\n  border-bottom: 0;\n}\n.nav-tabs-justified > li > a {\n  margin-right: 0;\n  border-radius: 4px;\n}\n.nav-tabs-justified > .active > a,\n.nav-tabs-justified > .active > a:hover,\n.nav-tabs-justified > .active > a:focus {\n  border: 1px solid #ddd;\n}\n@media (min-width: 768px) {\n  .nav-tabs-justified > li > a {\n    border-bottom: 1px solid #ddd;\n    border-radius: 4px 4px 0 0;\n  }\n  .nav-tabs-justified > .active > a,\n  .nav-tabs-justified > .active > a:hover,\n  .nav-tabs-justified > .active > a:focus {\n    border-bottom-color: #fff;\n  }\n}\n.tab-content > .tab-pane {\n  display: none;\n}\n.tab-content > .active {\n  display: block;\n}\n.nav-tabs .dropdown-menu {\n  margin-top: -1px;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n.navbar {\n  position: relative;\n  min-height: 50px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n}\n@media (min-width: 768px) {\n  .navbar {\n    border-radius: 4px;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-header {\n    float: left;\n  }\n}\n.navbar-collapse {\n  padding-right: 15px;\n  padding-left: 15px;\n  overflow-x: visible;\n  -webkit-overflow-scrolling: touch;\n  border-top: 1px solid transparent;\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1);\n          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1);\n}\n.navbar-collapse.in {\n  overflow-y: auto;\n}\n@media (min-width: 768px) {\n  .navbar-collapse {\n    width: auto;\n    border-top: 0;\n    -webkit-box-shadow: none;\n            box-shadow: none;\n  }\n  .navbar-collapse.collapse {\n    display: block !important;\n    height: auto !important;\n    padding-bottom: 0;\n    overflow: visible !important;\n  }\n  .navbar-collapse.in {\n    overflow-y: visible;\n  }\n  .navbar-fixed-top .navbar-collapse,\n  .navbar-static-top .navbar-collapse,\n  .navbar-fixed-bottom .navbar-collapse {\n    padding-right: 0;\n    padding-left: 0;\n  }\n}\n.navbar-fixed-top .navbar-collapse,\n.navbar-fixed-bottom .navbar-collapse {\n  max-height: 340px;\n}\n@media (max-device-width: 480px) and (orientation: landscape) {\n  .navbar-fixed-top .navbar-collapse,\n  .navbar-fixed-bottom .navbar-collapse {\n    max-height: 200px;\n  }\n}\n.container > .navbar-header,\n.container-fluid > .navbar-header,\n.container > .navbar-collapse,\n.container-fluid > .navbar-collapse {\n  margin-right: -15px;\n  margin-left: -15px;\n}\n@media (min-width: 768px) {\n  .container > .navbar-header,\n  .container-fluid > .navbar-header,\n  .container > .navbar-collapse,\n  .container-fluid > .navbar-collapse {\n    margin-right: 0;\n    margin-left: 0;\n  }\n}\n.navbar-static-top {\n  z-index: 1000;\n  border-width: 0 0 1px;\n}\n@media (min-width: 768px) {\n  .navbar-static-top {\n    border-radius: 0;\n  }\n}\n.navbar-fixed-top,\n.navbar-fixed-bottom {\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 1030;\n}\n@media (min-width: 768px) {\n  .navbar-fixed-top,\n  .navbar-fixed-bottom {\n    border-radius: 0;\n  }\n}\n.navbar-fixed-top {\n  top: 0;\n  border-width: 0 0 1px;\n}\n.navbar-fixed-bottom {\n  bottom: 0;\n  margin-bottom: 0;\n  border-width: 1px 0 0;\n}\n.navbar-brand {\n  float: left;\n  height: 50px;\n  padding: 15px 15px;\n  font-size: 18px;\n  line-height: 20px;\n}\n.navbar-brand:hover,\n.navbar-brand:focus {\n  text-decoration: none;\n}\n.navbar-brand > img {\n  display: block;\n}\n@media (min-width: 768px) {\n  .navbar > .container .navbar-brand,\n  .navbar > .container-fluid .navbar-brand {\n    margin-left: -15px;\n  }\n}\n.navbar-toggle {\n  position: relative;\n  float: right;\n  padding: 9px 10px;\n  margin-top: 8px;\n  margin-right: 15px;\n  margin-bottom: 8px;\n  background-color: transparent;\n  background-image: none;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n.navbar-toggle:focus {\n  outline: 0;\n}\n.navbar-toggle .icon-bar {\n  display: block;\n  width: 22px;\n  height: 2px;\n  border-radius: 1px;\n}\n.navbar-toggle .icon-bar + .icon-bar {\n  margin-top: 4px;\n}\n@media (min-width: 768px) {\n  .navbar-toggle {\n    display: none;\n  }\n}\n.navbar-nav {\n  margin: 7.5px -15px;\n}\n.navbar-nav > li > a {\n  padding-top: 10px;\n  padding-bottom: 10px;\n  line-height: 20px;\n}\n@media (max-width: 767px) {\n  .navbar-nav .open .dropdown-menu {\n    position: static;\n    float: none;\n    width: auto;\n    margin-top: 0;\n    background-color: transparent;\n    border: 0;\n    -webkit-box-shadow: none;\n            box-shadow: none;\n  }\n  .navbar-nav .open .dropdown-menu > li > a,\n  .navbar-nav .open .dropdown-menu .dropdown-header {\n    padding: 5px 15px 5px 25px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a {\n    line-height: 20px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-nav .open .dropdown-menu > li > a:focus {\n    background-image: none;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-nav {\n    float: left;\n    margin: 0;\n  }\n  .navbar-nav > li {\n    float: left;\n  }\n  .navbar-nav > li > a {\n    padding-top: 15px;\n    padding-bottom: 15px;\n  }\n}\n.navbar-form {\n  padding: 10px 15px;\n  margin-top: 8px;\n  margin-right: -15px;\n  margin-bottom: 8px;\n  margin-left: -15px;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1), 0 1px 0 rgba(255, 255, 255, .1);\n          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1), 0 1px 0 rgba(255, 255, 255, .1);\n}\n@media (min-width: 768px) {\n  .navbar-form .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle;\n  }\n  .navbar-form .form-control-static {\n    display: inline-block;\n  }\n  .navbar-form .input-group {\n    display: inline-table;\n    vertical-align: middle;\n  }\n  .navbar-form .input-group .input-group-addon,\n  .navbar-form .input-group .input-group-btn,\n  .navbar-form .input-group .form-control {\n    width: auto;\n  }\n  .navbar-form .input-group > .form-control {\n    width: 100%;\n  }\n  .navbar-form .control-label {\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .radio,\n  .navbar-form .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .navbar-form .radio label,\n  .navbar-form .checkbox label {\n    padding-left: 0;\n  }\n  .navbar-form .radio input[type=\"radio\"],\n  .navbar-form .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0;\n  }\n  .navbar-form .has-feedback .form-control-feedback {\n    top: 0;\n  }\n}\n@media (max-width: 767px) {\n  .navbar-form .form-group {\n    margin-bottom: 5px;\n  }\n  .navbar-form .form-group:last-child {\n    margin-bottom: 0;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-form {\n    width: auto;\n    padding-top: 0;\n    padding-bottom: 0;\n    margin-right: 0;\n    margin-left: 0;\n    border: 0;\n    -webkit-box-shadow: none;\n            box-shadow: none;\n  }\n}\n.navbar-nav > li > .dropdown-menu {\n  margin-top: 0;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\n  margin-bottom: 0;\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.navbar-btn {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n.navbar-btn.btn-sm {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.navbar-btn.btn-xs {\n  margin-top: 14px;\n  margin-bottom: 14px;\n}\n.navbar-text {\n  margin-top: 15px;\n  margin-bottom: 15px;\n}\n@media (min-width: 768px) {\n  .navbar-text {\n    float: left;\n    margin-right: 15px;\n    margin-left: 15px;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-left {\n    float: left !important;\n  }\n  .navbar-right {\n    float: right !important;\n    margin-right: -15px;\n  }\n  .navbar-right ~ .navbar-right {\n    margin-right: 0;\n  }\n}\n.navbar-default {\n  background-color: #f8f8f8;\n  border-color: #e7e7e7;\n}\n.navbar-default .navbar-brand {\n  color: #777;\n}\n.navbar-default .navbar-brand:hover,\n.navbar-default .navbar-brand:focus {\n  color: #5e5e5e;\n  background-color: transparent;\n}\n.navbar-default .navbar-text {\n  color: #777;\n}\n.navbar-default .navbar-nav > li > a {\n  color: #777;\n}\n.navbar-default .navbar-nav > li > a:hover,\n.navbar-default .navbar-nav > li > a:focus {\n  color: #333;\n  background-color: transparent;\n}\n.navbar-default .navbar-nav > .active > a,\n.navbar-default .navbar-nav > .active > a:hover,\n.navbar-default .navbar-nav > .active > a:focus {\n  color: #555;\n  background-color: #e7e7e7;\n}\n.navbar-default .navbar-nav > .disabled > a,\n.navbar-default .navbar-nav > .disabled > a:hover,\n.navbar-default .navbar-nav > .disabled > a:focus {\n  color: #ccc;\n  background-color: transparent;\n}\n.navbar-default .navbar-toggle {\n  border-color: #ddd;\n}\n.navbar-default .navbar-toggle:hover,\n.navbar-default .navbar-toggle:focus {\n  background-color: #ddd;\n}\n.navbar-default .navbar-toggle .icon-bar {\n  background-color: #888;\n}\n.navbar-default .navbar-collapse,\n.navbar-default .navbar-form {\n  border-color: #e7e7e7;\n}\n.navbar-default .navbar-nav > .open > a,\n.navbar-default .navbar-nav > .open > a:hover,\n.navbar-default .navbar-nav > .open > a:focus {\n  color: #555;\n  background-color: #e7e7e7;\n}\n@media (max-width: 767px) {\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a {\n    color: #777;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\n    color: #333;\n    background-color: transparent;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a,\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\n    color: #555;\n    background-color: #e7e7e7;\n  }\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a,\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover,\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n    color: #ccc;\n    background-color: transparent;\n  }\n}\n.navbar-default .navbar-link {\n  color: #777;\n}\n.navbar-default .navbar-link:hover {\n  color: #333;\n}\n.navbar-default .btn-link {\n  color: #777;\n}\n.navbar-default .btn-link:hover,\n.navbar-default .btn-link:focus {\n  color: #333;\n}\n.navbar-default .btn-link[disabled]:hover,\nfieldset[disabled] .navbar-default .btn-link:hover,\n.navbar-default .btn-link[disabled]:focus,\nfieldset[disabled] .navbar-default .btn-link:focus {\n  color: #ccc;\n}\n.navbar-inverse {\n  background-color: #222;\n  border-color: #080808;\n}\n.navbar-inverse .navbar-brand {\n  color: #9d9d9d;\n}\n.navbar-inverse .navbar-brand:hover,\n.navbar-inverse .navbar-brand:focus {\n  color: #fff;\n  background-color: transparent;\n}\n.navbar-inverse .navbar-text {\n  color: #9d9d9d;\n}\n.navbar-inverse .navbar-nav > li > a {\n  color: #9d9d9d;\n}\n.navbar-inverse .navbar-nav > li > a:hover,\n.navbar-inverse .navbar-nav > li > a:focus {\n  color: #fff;\n  background-color: transparent;\n}\n.navbar-inverse .navbar-nav > .active > a,\n.navbar-inverse .navbar-nav > .active > a:hover,\n.navbar-inverse .navbar-nav > .active > a:focus {\n  color: #fff;\n  background-color: #080808;\n}\n.navbar-inverse .navbar-nav > .disabled > a,\n.navbar-inverse .navbar-nav > .disabled > a:hover,\n.navbar-inverse .navbar-nav > .disabled > a:focus {\n  color: #444;\n  background-color: transparent;\n}\n.navbar-inverse .navbar-toggle {\n  border-color: #333;\n}\n.navbar-inverse .navbar-toggle:hover,\n.navbar-inverse .navbar-toggle:focus {\n  background-color: #333;\n}\n.navbar-inverse .navbar-toggle .icon-bar {\n  background-color: #fff;\n}\n.navbar-inverse .navbar-collapse,\n.navbar-inverse .navbar-form {\n  border-color: #101010;\n}\n.navbar-inverse .navbar-nav > .open > a,\n.navbar-inverse .navbar-nav > .open > a:hover,\n.navbar-inverse .navbar-nav > .open > a:focus {\n  color: #fff;\n  background-color: #080808;\n}\n@media (max-width: 767px) {\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\n    border-color: #080808;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\n    background-color: #080808;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\n    color: #9d9d9d;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\n    color: #fff;\n    background-color: transparent;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {\n    color: #fff;\n    background-color: #080808;\n  }\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover,\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n    color: #444;\n    background-color: transparent;\n  }\n}\n.navbar-inverse .navbar-link {\n  color: #9d9d9d;\n}\n.navbar-inverse .navbar-link:hover {\n  color: #fff;\n}\n.navbar-inverse .btn-link {\n  color: #9d9d9d;\n}\n.navbar-inverse .btn-link:hover,\n.navbar-inverse .btn-link:focus {\n  color: #fff;\n}\n.navbar-inverse .btn-link[disabled]:hover,\nfieldset[disabled] .navbar-inverse .btn-link:hover,\n.navbar-inverse .btn-link[disabled]:focus,\nfieldset[disabled] .navbar-inverse .btn-link:focus {\n  color: #444;\n}\n.breadcrumb {\n  padding: 8px 15px;\n  margin-bottom: 20px;\n  list-style: none;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n}\n.breadcrumb > li {\n  display: inline-block;\n}\n.breadcrumb > li + li:before {\n  padding: 0 5px;\n  color: #ccc;\n  content: \"/\\A0\";\n}\n.breadcrumb > .active {\n  color: #777;\n}\n.pagination {\n  display: inline-block;\n  padding-left: 0;\n  margin: 20px 0;\n  border-radius: 4px;\n}\n.pagination > li {\n  display: inline;\n}\n.pagination > li > a,\n.pagination > li > span {\n  position: relative;\n  float: left;\n  padding: 6px 12px;\n  margin-left: -1px;\n  line-height: 1.42857143;\n  color: #337ab7;\n  text-decoration: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n}\n.pagination > li:first-child > a,\n.pagination > li:first-child > span {\n  margin-left: 0;\n  border-top-left-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.pagination > li:last-child > a,\n.pagination > li:last-child > span {\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\n.pagination > li > a:hover,\n.pagination > li > span:hover,\n.pagination > li > a:focus,\n.pagination > li > span:focus {\n  z-index: 2;\n  color: #23527c;\n  background-color: #eee;\n  border-color: #ddd;\n}\n.pagination > .active > a,\n.pagination > .active > span,\n.pagination > .active > a:hover,\n.pagination > .active > span:hover,\n.pagination > .active > a:focus,\n.pagination > .active > span:focus {\n  z-index: 3;\n  color: #fff;\n  cursor: default;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\n.pagination > .disabled > span,\n.pagination > .disabled > span:hover,\n.pagination > .disabled > span:focus,\n.pagination > .disabled > a,\n.pagination > .disabled > a:hover,\n.pagination > .disabled > a:focus {\n  color: #777;\n  cursor: not-allowed;\n  background-color: #fff;\n  border-color: #ddd;\n}\n.pagination-lg > li > a,\n.pagination-lg > li > span {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.3333333;\n}\n.pagination-lg > li:first-child > a,\n.pagination-lg > li:first-child > span {\n  border-top-left-radius: 6px;\n  border-bottom-left-radius: 6px;\n}\n.pagination-lg > li:last-child > a,\n.pagination-lg > li:last-child > span {\n  border-top-right-radius: 6px;\n  border-bottom-right-radius: 6px;\n}\n.pagination-sm > li > a,\n.pagination-sm > li > span {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n}\n.pagination-sm > li:first-child > a,\n.pagination-sm > li:first-child > span {\n  border-top-left-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.pagination-sm > li:last-child > a,\n.pagination-sm > li:last-child > span {\n  border-top-right-radius: 3px;\n  border-bottom-right-radius: 3px;\n}\n.pager {\n  padding-left: 0;\n  margin: 20px 0;\n  text-align: center;\n  list-style: none;\n}\n.pager li {\n  display: inline;\n}\n.pager li > a,\n.pager li > span {\n  display: inline-block;\n  padding: 5px 14px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 15px;\n}\n.pager li > a:hover,\n.pager li > a:focus {\n  text-decoration: none;\n  background-color: #eee;\n}\n.pager .next > a,\n.pager .next > span {\n  float: right;\n}\n.pager .previous > a,\n.pager .previous > span {\n  float: left;\n}\n.pager .disabled > a,\n.pager .disabled > a:hover,\n.pager .disabled > a:focus,\n.pager .disabled > span {\n  color: #777;\n  cursor: not-allowed;\n  background-color: #fff;\n}\n.label {\n  display: inline;\n  padding: .2em .6em .3em;\n  font-size: 75%;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: .25em;\n}\na.label:hover,\na.label:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer;\n}\n.label:empty {\n  display: none;\n}\n.btn .label {\n  position: relative;\n  top: -1px;\n}\n.label-default {\n  background-color: #777;\n}\n.label-default[href]:hover,\n.label-default[href]:focus {\n  background-color: #5e5e5e;\n}\n.label-primary {\n  background-color: #337ab7;\n}\n.label-primary[href]:hover,\n.label-primary[href]:focus {\n  background-color: #286090;\n}\n.label-success {\n  background-color: #5cb85c;\n}\n.label-success[href]:hover,\n.label-success[href]:focus {\n  background-color: #449d44;\n}\n.label-info {\n  background-color: #5bc0de;\n}\n.label-info[href]:hover,\n.label-info[href]:focus {\n  background-color: #31b0d5;\n}\n.label-warning {\n  background-color: #f0ad4e;\n}\n.label-warning[href]:hover,\n.label-warning[href]:focus {\n  background-color: #ec971f;\n}\n.label-danger {\n  background-color: #d9534f;\n}\n.label-danger[href]:hover,\n.label-danger[href]:focus {\n  background-color: #c9302c;\n}\n.badge {\n  display: inline-block;\n  min-width: 10px;\n  padding: 3px 7px;\n  font-size: 12px;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  background-color: #777;\n  border-radius: 10px;\n}\n.badge:empty {\n  display: none;\n}\n.btn .badge {\n  position: relative;\n  top: -1px;\n}\n.btn-xs .badge,\n.btn-group-xs > .btn .badge {\n  top: 0;\n  padding: 1px 5px;\n}\na.badge:hover,\na.badge:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer;\n}\n.list-group-item.active > .badge,\n.nav-pills > .active > a > .badge {\n  color: #337ab7;\n  background-color: #fff;\n}\n.list-group-item > .badge {\n  float: right;\n}\n.list-group-item > .badge + .badge {\n  margin-right: 5px;\n}\n.nav-pills > li > a > .badge {\n  margin-left: 3px;\n}\n.jumbotron {\n  padding-top: 30px;\n  padding-bottom: 30px;\n  margin-bottom: 30px;\n  color: inherit;\n  background-color: #eee;\n}\n.jumbotron h1,\n.jumbotron .h1 {\n  color: inherit;\n}\n.jumbotron p {\n  margin-bottom: 15px;\n  font-size: 21px;\n  font-weight: 200;\n}\n.jumbotron > hr {\n  border-top-color: #d5d5d5;\n}\n.container .jumbotron,\n.container-fluid .jumbotron {\n  padding-right: 15px;\n  padding-left: 15px;\n  border-radius: 6px;\n}\n.jumbotron .container {\n  max-width: 100%;\n}\n@media screen and (min-width: 768px) {\n  .jumbotron {\n    padding-top: 48px;\n    padding-bottom: 48px;\n  }\n  .container .jumbotron,\n  .container-fluid .jumbotron {\n    padding-right: 60px;\n    padding-left: 60px;\n  }\n  .jumbotron h1,\n  .jumbotron .h1 {\n    font-size: 63px;\n  }\n}\n.thumbnail {\n  display: block;\n  padding: 4px;\n  margin-bottom: 20px;\n  line-height: 1.42857143;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: border .2s ease-in-out;\n       -o-transition: border .2s ease-in-out;\n          transition: border .2s ease-in-out;\n}\n.thumbnail > img,\n.thumbnail a > img {\n  margin-right: auto;\n  margin-left: auto;\n}\na.thumbnail:hover,\na.thumbnail:focus,\na.thumbnail.active {\n  border-color: #337ab7;\n}\n.thumbnail .caption {\n  padding: 9px;\n  color: #333;\n}\n.alert {\n  padding: 15px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n.alert h4 {\n  margin-top: 0;\n  color: inherit;\n}\n.alert .alert-link {\n  font-weight: bold;\n}\n.alert > p,\n.alert > ul {\n  margin-bottom: 0;\n}\n.alert > p + p {\n  margin-top: 5px;\n}\n.alert-dismissable,\n.alert-dismissible {\n  padding-right: 35px;\n}\n.alert-dismissable .close,\n.alert-dismissible .close {\n  position: relative;\n  top: -2px;\n  right: -21px;\n  color: inherit;\n}\n.alert-success {\n  color: #3c763d;\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n}\n.alert-success hr {\n  border-top-color: #c9e2b3;\n}\n.alert-success .alert-link {\n  color: #2b542c;\n}\n.alert-info {\n  color: #31708f;\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n}\n.alert-info hr {\n  border-top-color: #a6e1ec;\n}\n.alert-info .alert-link {\n  color: #245269;\n}\n.alert-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n}\n.alert-warning hr {\n  border-top-color: #f7e1b5;\n}\n.alert-warning .alert-link {\n  color: #66512c;\n}\n.alert-danger {\n  color: #a94442;\n  background-color: #f2dede;\n  border-color: #ebccd1;\n}\n.alert-danger hr {\n  border-top-color: #e4b9c0;\n}\n.alert-danger .alert-link {\n  color: #843534;\n}\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n@-o-keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n.progress {\n  height: 20px;\n  margin-bottom: 20px;\n  overflow: hidden;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);\n          box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);\n}\n.progress-bar {\n  float: left;\n  width: 0;\n  height: 100%;\n  font-size: 12px;\n  line-height: 20px;\n  color: #fff;\n  text-align: center;\n  background-color: #337ab7;\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);\n          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);\n  -webkit-transition: width .6s ease;\n       -o-transition: width .6s ease;\n          transition: width .6s ease;\n}\n.progress-striped .progress-bar,\n.progress-bar-striped {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  -webkit-background-size: 40px 40px;\n          background-size: 40px 40px;\n}\n.progress.active .progress-bar,\n.progress-bar.active {\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\n       -o-animation: progress-bar-stripes 2s linear infinite;\n          animation: progress-bar-stripes 2s linear infinite;\n}\n.progress-bar-success {\n  background-color: #5cb85c;\n}\n.progress-striped .progress-bar-success {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n}\n.progress-bar-info {\n  background-color: #5bc0de;\n}\n.progress-striped .progress-bar-info {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n}\n.progress-bar-warning {\n  background-color: #f0ad4e;\n}\n.progress-striped .progress-bar-warning {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n}\n.progress-bar-danger {\n  background-color: #d9534f;\n}\n.progress-striped .progress-bar-danger {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n}\n.media {\n  margin-top: 15px;\n}\n.media:first-child {\n  margin-top: 0;\n}\n.media,\n.media-body {\n  overflow: hidden;\n  zoom: 1;\n}\n.media-body {\n  width: 10000px;\n}\n.media-object {\n  display: block;\n}\n.media-object.img-thumbnail {\n  max-width: none;\n}\n.media-right,\n.media > .pull-right {\n  padding-left: 10px;\n}\n.media-left,\n.media > .pull-left {\n  padding-right: 10px;\n}\n.media-left,\n.media-right,\n.media-body {\n  display: table-cell;\n  vertical-align: top;\n}\n.media-middle {\n  vertical-align: middle;\n}\n.media-bottom {\n  vertical-align: bottom;\n}\n.media-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n.media-list {\n  padding-left: 0;\n  list-style: none;\n}\n.list-group {\n  padding-left: 0;\n  margin-bottom: 20px;\n}\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n}\n.list-group-item:first-child {\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n}\n.list-group-item:last-child {\n  margin-bottom: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\na.list-group-item,\nbutton.list-group-item {\n  color: #555;\n}\na.list-group-item .list-group-item-heading,\nbutton.list-group-item .list-group-item-heading {\n  color: #333;\n}\na.list-group-item:hover,\nbutton.list-group-item:hover,\na.list-group-item:focus,\nbutton.list-group-item:focus {\n  color: #555;\n  text-decoration: none;\n  background-color: #f5f5f5;\n}\nbutton.list-group-item {\n  width: 100%;\n  text-align: left;\n}\n.list-group-item.disabled,\n.list-group-item.disabled:hover,\n.list-group-item.disabled:focus {\n  color: #777;\n  cursor: not-allowed;\n  background-color: #eee;\n}\n.list-group-item.disabled .list-group-item-heading,\n.list-group-item.disabled:hover .list-group-item-heading,\n.list-group-item.disabled:focus .list-group-item-heading {\n  color: inherit;\n}\n.list-group-item.disabled .list-group-item-text,\n.list-group-item.disabled:hover .list-group-item-text,\n.list-group-item.disabled:focus .list-group-item-text {\n  color: #777;\n}\n.list-group-item.active,\n.list-group-item.active:hover,\n.list-group-item.active:focus {\n  z-index: 2;\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\n.list-group-item.active .list-group-item-heading,\n.list-group-item.active:hover .list-group-item-heading,\n.list-group-item.active:focus .list-group-item-heading,\n.list-group-item.active .list-group-item-heading > small,\n.list-group-item.active:hover .list-group-item-heading > small,\n.list-group-item.active:focus .list-group-item-heading > small,\n.list-group-item.active .list-group-item-heading > .small,\n.list-group-item.active:hover .list-group-item-heading > .small,\n.list-group-item.active:focus .list-group-item-heading > .small {\n  color: inherit;\n}\n.list-group-item.active .list-group-item-text,\n.list-group-item.active:hover .list-group-item-text,\n.list-group-item.active:focus .list-group-item-text {\n  color: #c7ddef;\n}\n.list-group-item-success {\n  color: #3c763d;\n  background-color: #dff0d8;\n}\na.list-group-item-success,\nbutton.list-group-item-success {\n  color: #3c763d;\n}\na.list-group-item-success .list-group-item-heading,\nbutton.list-group-item-success .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-success:hover,\nbutton.list-group-item-success:hover,\na.list-group-item-success:focus,\nbutton.list-group-item-success:focus {\n  color: #3c763d;\n  background-color: #d0e9c6;\n}\na.list-group-item-success.active,\nbutton.list-group-item-success.active,\na.list-group-item-success.active:hover,\nbutton.list-group-item-success.active:hover,\na.list-group-item-success.active:focus,\nbutton.list-group-item-success.active:focus {\n  color: #fff;\n  background-color: #3c763d;\n  border-color: #3c763d;\n}\n.list-group-item-info {\n  color: #31708f;\n  background-color: #d9edf7;\n}\na.list-group-item-info,\nbutton.list-group-item-info {\n  color: #31708f;\n}\na.list-group-item-info .list-group-item-heading,\nbutton.list-group-item-info .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-info:hover,\nbutton.list-group-item-info:hover,\na.list-group-item-info:focus,\nbutton.list-group-item-info:focus {\n  color: #31708f;\n  background-color: #c4e3f3;\n}\na.list-group-item-info.active,\nbutton.list-group-item-info.active,\na.list-group-item-info.active:hover,\nbutton.list-group-item-info.active:hover,\na.list-group-item-info.active:focus,\nbutton.list-group-item-info.active:focus {\n  color: #fff;\n  background-color: #31708f;\n  border-color: #31708f;\n}\n.list-group-item-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n}\na.list-group-item-warning,\nbutton.list-group-item-warning {\n  color: #8a6d3b;\n}\na.list-group-item-warning .list-group-item-heading,\nbutton.list-group-item-warning .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-warning:hover,\nbutton.list-group-item-warning:hover,\na.list-group-item-warning:focus,\nbutton.list-group-item-warning:focus {\n  color: #8a6d3b;\n  background-color: #faf2cc;\n}\na.list-group-item-warning.active,\nbutton.list-group-item-warning.active,\na.list-group-item-warning.active:hover,\nbutton.list-group-item-warning.active:hover,\na.list-group-item-warning.active:focus,\nbutton.list-group-item-warning.active:focus {\n  color: #fff;\n  background-color: #8a6d3b;\n  border-color: #8a6d3b;\n}\n.list-group-item-danger {\n  color: #a94442;\n  background-color: #f2dede;\n}\na.list-group-item-danger,\nbutton.list-group-item-danger {\n  color: #a94442;\n}\na.list-group-item-danger .list-group-item-heading,\nbutton.list-group-item-danger .list-group-item-heading {\n  color: inherit;\n}\na.list-group-item-danger:hover,\nbutton.list-group-item-danger:hover,\na.list-group-item-danger:focus,\nbutton.list-group-item-danger:focus {\n  color: #a94442;\n  background-color: #ebcccc;\n}\na.list-group-item-danger.active,\nbutton.list-group-item-danger.active,\na.list-group-item-danger.active:hover,\nbutton.list-group-item-danger.active:hover,\na.list-group-item-danger.active:focus,\nbutton.list-group-item-danger.active:focus {\n  color: #fff;\n  background-color: #a94442;\n  border-color: #a94442;\n}\n.list-group-item-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n.list-group-item-text {\n  margin-bottom: 0;\n  line-height: 1.3;\n}\n.panel {\n  margin-bottom: 20px;\n  background-color: #fff;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\n          box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\n}\n.panel-body {\n  padding: 15px;\n}\n.panel-heading {\n  padding: 10px 15px;\n  border-bottom: 1px solid transparent;\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n}\n.panel-heading > .dropdown .dropdown-toggle {\n  color: inherit;\n}\n.panel-title {\n  margin-top: 0;\n  margin-bottom: 0;\n  font-size: 16px;\n  color: inherit;\n}\n.panel-title > a,\n.panel-title > small,\n.panel-title > .small,\n.panel-title > small > a,\n.panel-title > .small > a {\n  color: inherit;\n}\n.panel-footer {\n  padding: 10px 15px;\n  background-color: #f5f5f5;\n  border-top: 1px solid #ddd;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .list-group,\n.panel > .panel-collapse > .list-group {\n  margin-bottom: 0;\n}\n.panel > .list-group .list-group-item,\n.panel > .panel-collapse > .list-group .list-group-item {\n  border-width: 1px 0;\n  border-radius: 0;\n}\n.panel > .list-group:first-child .list-group-item:first-child,\n.panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\n  border-top: 0;\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n}\n.panel > .list-group:last-child .list-group-item:last-child,\n.panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\n  border-bottom: 0;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n.panel-heading + .list-group .list-group-item:first-child {\n  border-top-width: 0;\n}\n.list-group + .panel-footer {\n  border-top-width: 0;\n}\n.panel > .table,\n.panel > .table-responsive > .table,\n.panel > .panel-collapse > .table {\n  margin-bottom: 0;\n}\n.panel > .table caption,\n.panel > .table-responsive > .table caption,\n.panel > .panel-collapse > .table caption {\n  padding-right: 15px;\n  padding-left: 15px;\n}\n.panel > .table:first-child,\n.panel > .table-responsive:first-child > .table:first-child {\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n}\n.panel > .table:first-child > thead:first-child > tr:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n}\n.panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n.panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\n  border-top-left-radius: 3px;\n}\n.panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n.panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\n.panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\n  border-top-right-radius: 3px;\n}\n.panel > .table:last-child,\n.panel > .table-responsive:last-child > .table:last-child {\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .table:last-child > tbody:last-child > tr:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n.panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\n  border-bottom-left-radius: 3px;\n}\n.panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n.panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\n  border-bottom-right-radius: 3px;\n}\n.panel > .panel-body + .table,\n.panel > .panel-body + .table-responsive,\n.panel > .table + .panel-body,\n.panel > .table-responsive + .panel-body {\n  border-top: 1px solid #ddd;\n}\n.panel > .table > tbody:first-child > tr:first-child th,\n.panel > .table > tbody:first-child > tr:first-child td {\n  border-top: 0;\n}\n.panel > .table-bordered,\n.panel > .table-responsive > .table-bordered {\n  border: 0;\n}\n.panel > .table-bordered > thead > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\n.panel > .table-bordered > tbody > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\n.panel > .table-bordered > tfoot > tr > th:first-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n.panel > .table-bordered > thead > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\n.panel > .table-bordered > tbody > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\n.panel > .table-bordered > tfoot > tr > td:first-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n  border-left: 0;\n}\n.panel > .table-bordered > thead > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\n.panel > .table-bordered > tbody > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\n.panel > .table-bordered > tfoot > tr > th:last-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n.panel > .table-bordered > thead > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\n.panel > .table-bordered > tbody > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\n.panel > .table-bordered > tfoot > tr > td:last-child,\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n  border-right: 0;\n}\n.panel > .table-bordered > thead > tr:first-child > td,\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\n.panel > .table-bordered > tbody > tr:first-child > td,\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\n.panel > .table-bordered > thead > tr:first-child > th,\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\n.panel > .table-bordered > tbody > tr:first-child > th,\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\n  border-bottom: 0;\n}\n.panel > .table-bordered > tbody > tr:last-child > td,\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\n.panel > .table-bordered > tfoot > tr:last-child > td,\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\n.panel > .table-bordered > tbody > tr:last-child > th,\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\n.panel > .table-bordered > tfoot > tr:last-child > th,\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\n  border-bottom: 0;\n}\n.panel > .table-responsive {\n  margin-bottom: 0;\n  border: 0;\n}\n.panel-group {\n  margin-bottom: 20px;\n}\n.panel-group .panel {\n  margin-bottom: 0;\n  border-radius: 4px;\n}\n.panel-group .panel + .panel {\n  margin-top: 5px;\n}\n.panel-group .panel-heading {\n  border-bottom: 0;\n}\n.panel-group .panel-heading + .panel-collapse > .panel-body,\n.panel-group .panel-heading + .panel-collapse > .list-group {\n  border-top: 1px solid #ddd;\n}\n.panel-group .panel-footer {\n  border-top: 0;\n}\n.panel-group .panel-footer + .panel-collapse .panel-body {\n  border-bottom: 1px solid #ddd;\n}\n.panel-default {\n  border-color: #ddd;\n}\n.panel-default > .panel-heading {\n  color: #333;\n  background-color: #f5f5f5;\n  border-color: #ddd;\n}\n.panel-default > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #ddd;\n}\n.panel-default > .panel-heading .badge {\n  color: #f5f5f5;\n  background-color: #333;\n}\n.panel-default > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #ddd;\n}\n.panel-primary {\n  border-color: #337ab7;\n}\n.panel-primary > .panel-heading {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\n.panel-primary > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #337ab7;\n}\n.panel-primary > .panel-heading .badge {\n  color: #337ab7;\n  background-color: #fff;\n}\n.panel-primary > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #337ab7;\n}\n.panel-success {\n  border-color: #d6e9c6;\n}\n.panel-success > .panel-heading {\n  color: #3c763d;\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n}\n.panel-success > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #d6e9c6;\n}\n.panel-success > .panel-heading .badge {\n  color: #dff0d8;\n  background-color: #3c763d;\n}\n.panel-success > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #d6e9c6;\n}\n.panel-info {\n  border-color: #bce8f1;\n}\n.panel-info > .panel-heading {\n  color: #31708f;\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n}\n.panel-info > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #bce8f1;\n}\n.panel-info > .panel-heading .badge {\n  color: #d9edf7;\n  background-color: #31708f;\n}\n.panel-info > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #bce8f1;\n}\n.panel-warning {\n  border-color: #faebcc;\n}\n.panel-warning > .panel-heading {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n}\n.panel-warning > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #faebcc;\n}\n.panel-warning > .panel-heading .badge {\n  color: #fcf8e3;\n  background-color: #8a6d3b;\n}\n.panel-warning > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #faebcc;\n}\n.panel-danger {\n  border-color: #ebccd1;\n}\n.panel-danger > .panel-heading {\n  color: #a94442;\n  background-color: #f2dede;\n  border-color: #ebccd1;\n}\n.panel-danger > .panel-heading + .panel-collapse > .panel-body {\n  border-top-color: #ebccd1;\n}\n.panel-danger > .panel-heading .badge {\n  color: #f2dede;\n  background-color: #a94442;\n}\n.panel-danger > .panel-footer + .panel-collapse > .panel-body {\n  border-bottom-color: #ebccd1;\n}\n.embed-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n}\n.embed-responsive .embed-responsive-item,\n.embed-responsive iframe,\n.embed-responsive embed,\n.embed-responsive object,\n.embed-responsive video {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: 0;\n}\n.embed-responsive-16by9 {\n  padding-bottom: 56.25%;\n}\n.embed-responsive-4by3 {\n  padding-bottom: 75%;\n}\n.well {\n  min-height: 20px;\n  padding: 19px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border: 1px solid #e3e3e3;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);\n}\n.well blockquote {\n  border-color: #ddd;\n  border-color: rgba(0, 0, 0, .15);\n}\n.well-lg {\n  padding: 24px;\n  border-radius: 6px;\n}\n.well-sm {\n  padding: 9px;\n  border-radius: 3px;\n}\n.close {\n  float: right;\n  font-size: 21px;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  filter: alpha(opacity=20);\n  opacity: .2;\n}\n.close:hover,\n.close:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n  filter: alpha(opacity=50);\n  opacity: .5;\n}\nbutton.close {\n  -webkit-appearance: none;\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n}\n.modal-open {\n  overflow: hidden;\n}\n.modal {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  display: none;\n  overflow: hidden;\n  -webkit-overflow-scrolling: touch;\n  outline: 0;\n}\n.modal.fade .modal-dialog {\n  -webkit-transition: -webkit-transform .3s ease-out;\n       -o-transition:      -o-transform .3s ease-out;\n          transition:         transform .3s ease-out;\n  -webkit-transform: translate(0, -25%);\n      -ms-transform: translate(0, -25%);\n       -o-transform: translate(0, -25%);\n          transform: translate(0, -25%);\n}\n.modal.in .modal-dialog {\n  -webkit-transform: translate(0, 0);\n      -ms-transform: translate(0, 0);\n       -o-transform: translate(0, 0);\n          transform: translate(0, 0);\n}\n.modal-open .modal {\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 10px;\n}\n.modal-content {\n  position: relative;\n  background-color: #fff;\n  -webkit-background-clip: padding-box;\n          background-clip: padding-box;\n  border: 1px solid #999;\n  border: 1px solid rgba(0, 0, 0, .2);\n  border-radius: 6px;\n  outline: 0;\n  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, .5);\n          box-shadow: 0 3px 9px rgba(0, 0, 0, .5);\n}\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000;\n}\n.modal-backdrop.fade {\n  filter: alpha(opacity=0);\n  opacity: 0;\n}\n.modal-backdrop.in {\n  filter: alpha(opacity=50);\n  opacity: .5;\n}\n.modal-header {\n  padding: 15px;\n  border-bottom: 1px solid #e5e5e5;\n}\n.modal-header .close {\n  margin-top: -2px;\n}\n.modal-title {\n  margin: 0;\n  line-height: 1.42857143;\n}\n.modal-body {\n  position: relative;\n  padding: 15px;\n}\n.modal-footer {\n  padding: 15px;\n  text-align: right;\n  border-top: 1px solid #e5e5e5;\n}\n.modal-footer .btn + .btn {\n  margin-bottom: 0;\n  margin-left: 5px;\n}\n.modal-footer .btn-group .btn + .btn {\n  margin-left: -1px;\n}\n.modal-footer .btn-block + .btn-block {\n  margin-left: 0;\n}\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll;\n}\n@media (min-width: 768px) {\n  .modal-dialog {\n    width: 600px;\n    margin: 30px auto;\n  }\n  .modal-content {\n    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, .5);\n            box-shadow: 0 5px 15px rgba(0, 0, 0, .5);\n  }\n  .modal-sm {\n    width: 300px;\n  }\n}\n@media (min-width: 992px) {\n  .modal-lg {\n    width: 900px;\n  }\n}\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 12px;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1.42857143;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  white-space: normal;\n  filter: alpha(opacity=0);\n  opacity: 0;\n\n  line-break: auto;\n}\n.tooltip.in {\n  filter: alpha(opacity=90);\n  opacity: .9;\n}\n.tooltip.top {\n  padding: 5px 0;\n  margin-top: -3px;\n}\n.tooltip.right {\n  padding: 0 5px;\n  margin-left: 3px;\n}\n.tooltip.bottom {\n  padding: 5px 0;\n  margin-top: 3px;\n}\n.tooltip.left {\n  padding: 0 5px;\n  margin-left: -3px;\n}\n.tooltip-inner {\n  max-width: 200px;\n  padding: 3px 8px;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: 4px;\n}\n.tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n.tooltip.top .tooltip-arrow {\n  bottom: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000;\n}\n.tooltip.top-left .tooltip-arrow {\n  right: 5px;\n  bottom: 0;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000;\n}\n.tooltip.top-right .tooltip-arrow {\n  bottom: 0;\n  left: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000;\n}\n.tooltip.right .tooltip-arrow {\n  top: 50%;\n  left: 0;\n  margin-top: -5px;\n  border-width: 5px 5px 5px 0;\n  border-right-color: #000;\n}\n.tooltip.left .tooltip-arrow {\n  top: 50%;\n  right: 0;\n  margin-top: -5px;\n  border-width: 5px 0 5px 5px;\n  border-left-color: #000;\n}\n.tooltip.bottom .tooltip-arrow {\n  top: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000;\n}\n.tooltip.bottom-left .tooltip-arrow {\n  top: 0;\n  right: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000;\n}\n.tooltip.bottom-right .tooltip-arrow {\n  top: 0;\n  left: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000;\n}\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: none;\n  max-width: 276px;\n  padding: 1px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1.42857143;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  white-space: normal;\n  background-color: #fff;\n  -webkit-background-clip: padding-box;\n          background-clip: padding-box;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, .2);\n  border-radius: 6px;\n  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .2);\n          box-shadow: 0 5px 10px rgba(0, 0, 0, .2);\n\n  line-break: auto;\n}\n.popover.top {\n  margin-top: -10px;\n}\n.popover.right {\n  margin-left: 10px;\n}\n.popover.bottom {\n  margin-top: 10px;\n}\n.popover.left {\n  margin-left: -10px;\n}\n.popover-title {\n  padding: 8px 14px;\n  margin: 0;\n  font-size: 14px;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-radius: 5px 5px 0 0;\n}\n.popover-content {\n  padding: 9px 14px;\n}\n.popover > .arrow,\n.popover > .arrow:after {\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n.popover > .arrow {\n  border-width: 11px;\n}\n.popover > .arrow:after {\n  content: \"\";\n  border-width: 10px;\n}\n.popover.top > .arrow {\n  bottom: -11px;\n  left: 50%;\n  margin-left: -11px;\n  border-top-color: #999;\n  border-top-color: rgba(0, 0, 0, .25);\n  border-bottom-width: 0;\n}\n.popover.top > .arrow:after {\n  bottom: 1px;\n  margin-left: -10px;\n  content: \" \";\n  border-top-color: #fff;\n  border-bottom-width: 0;\n}\n.popover.right > .arrow {\n  top: 50%;\n  left: -11px;\n  margin-top: -11px;\n  border-right-color: #999;\n  border-right-color: rgba(0, 0, 0, .25);\n  border-left-width: 0;\n}\n.popover.right > .arrow:after {\n  bottom: -10px;\n  left: 1px;\n  content: \" \";\n  border-right-color: #fff;\n  border-left-width: 0;\n}\n.popover.bottom > .arrow {\n  top: -11px;\n  left: 50%;\n  margin-left: -11px;\n  border-top-width: 0;\n  border-bottom-color: #999;\n  border-bottom-color: rgba(0, 0, 0, .25);\n}\n.popover.bottom > .arrow:after {\n  top: 1px;\n  margin-left: -10px;\n  content: \" \";\n  border-top-width: 0;\n  border-bottom-color: #fff;\n}\n.popover.left > .arrow {\n  top: 50%;\n  right: -11px;\n  margin-top: -11px;\n  border-right-width: 0;\n  border-left-color: #999;\n  border-left-color: rgba(0, 0, 0, .25);\n}\n.popover.left > .arrow:after {\n  right: 1px;\n  bottom: -10px;\n  content: \" \";\n  border-right-width: 0;\n  border-left-color: #fff;\n}\n.carousel {\n  position: relative;\n}\n.carousel-inner {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n}\n.carousel-inner > .item {\n  position: relative;\n  display: none;\n  -webkit-transition: .6s ease-in-out left;\n       -o-transition: .6s ease-in-out left;\n          transition: .6s ease-in-out left;\n}\n.carousel-inner > .item > img,\n.carousel-inner > .item > a > img {\n  line-height: 1;\n}\n@media all and (transform-3d), (-webkit-transform-3d) {\n  .carousel-inner > .item {\n    -webkit-transition: -webkit-transform .6s ease-in-out;\n         -o-transition:      -o-transform .6s ease-in-out;\n            transition:         transform .6s ease-in-out;\n\n    -webkit-backface-visibility: hidden;\n            backface-visibility: hidden;\n    -webkit-perspective: 1000px;\n            perspective: 1000px;\n  }\n  .carousel-inner > .item.next,\n  .carousel-inner > .item.active.right {\n    left: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n            transform: translate3d(100%, 0, 0);\n  }\n  .carousel-inner > .item.prev,\n  .carousel-inner > .item.active.left {\n    left: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n            transform: translate3d(-100%, 0, 0);\n  }\n  .carousel-inner > .item.next.left,\n  .carousel-inner > .item.prev.right,\n  .carousel-inner > .item.active {\n    left: 0;\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n.carousel-inner > .active,\n.carousel-inner > .next,\n.carousel-inner > .prev {\n  display: block;\n}\n.carousel-inner > .active {\n  left: 0;\n}\n.carousel-inner > .next,\n.carousel-inner > .prev {\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n.carousel-inner > .next {\n  left: 100%;\n}\n.carousel-inner > .prev {\n  left: -100%;\n}\n.carousel-inner > .next.left,\n.carousel-inner > .prev.right {\n  left: 0;\n}\n.carousel-inner > .active.left {\n  left: -100%;\n}\n.carousel-inner > .active.right {\n  left: 100%;\n}\n.carousel-control {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 15%;\n  font-size: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);\n  background-color: rgba(0, 0, 0, 0);\n  filter: alpha(opacity=50);\n  opacity: .5;\n}\n.carousel-control.left {\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\n  background-image:      -o-linear-gradient(left, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, .5)), to(rgba(0, 0, 0, .0001)));\n  background-image:         linear-gradient(to right, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1);\n  background-repeat: repeat-x;\n}\n.carousel-control.right {\n  right: 0;\n  left: auto;\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\n  background-image:      -o-linear-gradient(left, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, .0001)), to(rgba(0, 0, 0, .5)));\n  background-image:         linear-gradient(to right, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1);\n  background-repeat: repeat-x;\n}\n.carousel-control:hover,\n.carousel-control:focus {\n  color: #fff;\n  text-decoration: none;\n  filter: alpha(opacity=90);\n  outline: 0;\n  opacity: .9;\n}\n.carousel-control .icon-prev,\n.carousel-control .icon-next,\n.carousel-control .glyphicon-chevron-left,\n.carousel-control .glyphicon-chevron-right {\n  position: absolute;\n  top: 50%;\n  z-index: 5;\n  display: inline-block;\n  margin-top: -10px;\n}\n.carousel-control .icon-prev,\n.carousel-control .glyphicon-chevron-left {\n  left: 50%;\n  margin-left: -10px;\n}\n.carousel-control .icon-next,\n.carousel-control .glyphicon-chevron-right {\n  right: 50%;\n  margin-right: -10px;\n}\n.carousel-control .icon-prev,\n.carousel-control .icon-next {\n  width: 20px;\n  height: 20px;\n  font-family: serif;\n  line-height: 1;\n}\n.carousel-control .icon-prev:before {\n  content: '\\2039';\n}\n.carousel-control .icon-next:before {\n  content: '\\203A';\n}\n.carousel-indicators {\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  z-index: 15;\n  width: 60%;\n  padding-left: 0;\n  margin-left: -30%;\n  text-align: center;\n  list-style: none;\n}\n.carousel-indicators li {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  margin: 1px;\n  text-indent: -999px;\n  cursor: pointer;\n  background-color: #000 \\9;\n  background-color: rgba(0, 0, 0, 0);\n  border: 1px solid #fff;\n  border-radius: 10px;\n}\n.carousel-indicators .active {\n  width: 12px;\n  height: 12px;\n  margin: 0;\n  background-color: #fff;\n}\n.carousel-caption {\n  position: absolute;\n  right: 15%;\n  bottom: 20px;\n  left: 15%;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);\n}\n.carousel-caption .btn {\n  text-shadow: none;\n}\n@media screen and (min-width: 768px) {\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 30px;\n    height: 30px;\n    margin-top: -10px;\n    font-size: 30px;\n  }\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .icon-prev {\n    margin-left: -10px;\n  }\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-next {\n    margin-right: -10px;\n  }\n  .carousel-caption {\n    right: 20%;\n    left: 20%;\n    padding-bottom: 30px;\n  }\n  .carousel-indicators {\n    bottom: 20px;\n  }\n}\n/*.clearfix:before,*/\n/*.clearfix:after,*/\n.dl-horizontal dd:before,\n.dl-horizontal dd:after,\n.container:before,\n.container:after,\n.container-fluid:before,\n.container-fluid:after,\n.row:before,\n.row:after,\n.form-horizontal .form-group:before,\n.form-horizontal .form-group:after,\n.btn-toolbar:before,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:before,\n.btn-group-vertical > .btn-group:after,\n.nav:before,\n.nav:after,\n.navbar:before,\n.navbar:after,\n.navbar-header:before,\n.navbar-header:after,\n.navbar-collapse:before,\n.navbar-collapse:after,\n.pager:before,\n.pager:after,\n.panel-body:before,\n.panel-body:after,\n.modal-header:before,\n.modal-header:after,\n.modal-footer:before,\n.modal-footer:after {\n  display: table;\n  content: \" \";\n}\n/*.clearfix:after,*/\n.dl-horizontal dd:after,\n.container:after,\n.container-fluid:after,\n.row:after,\n.form-horizontal .form-group:after,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:after,\n.nav:after,\n.navbar:after,\n.navbar-header:after,\n.navbar-collapse:after,\n.pager:after,\n.panel-body:after,\n.modal-header:after,\n.modal-footer:after {\n  clear: both;\n}\n.center-block {\n  display: block;\n  margin-right: auto;\n  margin-left: auto;\n}\n.pull-right {\n  float: right !important;\n}\n.pull-left {\n  float: left !important;\n}\n.hide {\n  display: none !important;\n}\n.show {\n  display: block !important;\n}\n.invisible {\n  visibility: hidden;\n}\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n.hidden {\n  display: none !important;\n}\n.affix {\n  position: fixed;\n}\n@-ms-viewport {\n  width: device-width;\n}\n.visible-xs,\n.visible-sm,\n.visible-md,\n.visible-lg {\n  display: none !important;\n}\n.visible-xs-block,\n.visible-xs-inline,\n.visible-xs-inline-block,\n.visible-sm-block,\n.visible-sm-inline,\n.visible-sm-inline-block,\n.visible-md-block,\n.visible-md-inline,\n.visible-md-inline-block,\n.visible-lg-block,\n.visible-lg-inline,\n.visible-lg-inline-block {\n  display: none !important;\n}\n@media (max-width: 767px) {\n  .visible-xs {\n    display: block !important;\n  }\n  table.visible-xs {\n    display: table !important;\n  }\n  tr.visible-xs {\n    display: table-row !important;\n  }\n  th.visible-xs,\n  td.visible-xs {\n    display: table-cell !important;\n  }\n}\n@media (max-width: 767px) {\n  .visible-xs-block {\n    display: block !important;\n  }\n}\n@media (max-width: 767px) {\n  .visible-xs-inline {\n    display: inline !important;\n  }\n}\n@media (max-width: 767px) {\n  .visible-xs-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm {\n    display: block !important;\n  }\n  table.visible-sm {\n    display: table !important;\n  }\n  tr.visible-sm {\n    display: table-row !important;\n  }\n  th.visible-sm,\n  td.visible-sm {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-block {\n    display: block !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline {\n    display: inline !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md {\n    display: block !important;\n  }\n  table.visible-md {\n    display: table !important;\n  }\n  tr.visible-md {\n    display: table-row !important;\n  }\n  th.visible-md,\n  td.visible-md {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-block {\n    display: block !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline {\n    display: inline !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg {\n    display: block !important;\n  }\n  table.visible-lg {\n    display: table !important;\n  }\n  tr.visible-lg {\n    display: table-row !important;\n  }\n  th.visible-lg,\n  td.visible-lg {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg-block {\n    display: block !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg-inline {\n    display: inline !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (max-width: 767px) {\n  .hidden-xs {\n    display: none !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .hidden-sm {\n    display: none !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .hidden-md {\n    display: none !important;\n  }\n}\n@media (min-width: 1200px) {\n  .hidden-lg {\n    display: none !important;\n  }\n}\n.visible-print {\n  display: none !important;\n}\n@media print {\n  .visible-print {\n    display: block !important;\n  }\n  table.visible-print {\n    display: table !important;\n  }\n  tr.visible-print {\n    display: table-row !important;\n  }\n  th.visible-print,\n  td.visible-print {\n    display: table-cell !important;\n  }\n}\n.visible-print-block {\n  display: none !important;\n}\n@media print {\n  .visible-print-block {\n    display: block !important;\n  }\n}\n.visible-print-inline {\n  display: none !important;\n}\n@media print {\n  .visible-print-inline {\n    display: inline !important;\n  }\n}\n.visible-print-inline-block {\n  display: none !important;\n}\n@media print {\n  .visible-print-inline-block {\n    display: inline-block !important;\n  }\n}\n@media print {\n  .hidden-print {\n    display: none !important;\n  }\n}\n/*# sourceMappingURL=bootstrap.css.map */\n", ""]);

	// exports


/***/ },

/***/ 169:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f4769f9bdb7466be65088239c12046d1.eot";

/***/ },

/***/ 170:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "448c34a56d699c29117adc64c43affeb.woff2";

/***/ },

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "fa2772327f55d8198301fdb8bcfc8158.woff";

/***/ },

/***/ 172:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "e18bbf611f2a2e43afc071aa2f4e1512.ttf";

/***/ },

/***/ 173:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "89889688147bd7575d6327160d64e760.svg";

/***/ },

/***/ 174:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = angular.module('organicListSer', []).factory('organicListService', ['util', 'ajax', service]);


	function service(util, ajax) {
		return {
			setSelectedLi: function setSelectedLi(current) {
				var parent = util.parent(current, 'ul');
				angular.element(parent).find('li').removeClass('selected');
				angular.element(current).parent().addClass('selected');
			},
			getDate: function getDate(val, fn) {
				fn && fn(val);
			},
			getLoanMenInfoList: function getLoanMenInfoList(cfg) {
				return ajax.post("/acc/accountpartner/getList.do", cfg);
			},
			/**
	  * 获取待审列表
	  * @param {JSON} cfg
	  */
			freezeCtrl: function freezeCtrl(cfg) {
				return ajax.post("/acc/accountpartner/delPartner.do", cfg);
			},
			/**
	  * 通用 查询
	  * @param {JSON} cfg
	  */
			downLoadFile: function downLoadFile(cfg) {
				location.href = "/acc/accountpartner/downloadCertificate.do?id=" + cfg.id;
			},
			/*
	  * 合计上传文件大小
	  *param [file1Size,file2Size]
	  */
			upLoadFileSize: function upLoadFileSize(FileSize) {
				var sumSize = 0;
				for (var i = 0; i < FileSize.length; i++) {
					sumSize += Math.ceil(FileSize[i] / 1024);
				}
				return sumSize;
			},
			/**
	   * instanceUpLoadObj
	   */
			upService: function upService(FileUploader) {
				return new FileUploader({
					url: '/acc/accountpartner/uploadCertificate.do'
				});
			},
			/*
	     * 上传文件校验
	     * 1.是否填全     2.上传格式校验       3.文件大小校验
	     * param input[type='file']
	     * cfg.testInp2 为 zip 包
	     */
			checkUpLoadFile: function checkUpLoadFile(cfg) {
				var checkFormatLen = [],
				    result = {
					text: '',
					isPass: true
				};

				//1是否填全
				if (!cfg.testInp2) {
					result.text = '请选择要上传文件';
					result.isPass = false;
					return result;
				}

				//zip框特殊校验
				var zipFileName = cfg.testInp2.toLowerCase().substr(cfg.testInp2.lastIndexOf("."));
				if (!/\.zip/.test(zipFileName)) {
					result.text = '文件类型出错！';
					result.isPass = false;
					return result;
				}

				//2excel文件格式校验 testFormat[]允许的格式     //暂时，需修改---------------------
				//		    	var testFormat = ['.xls','.xlsx'];
				//		    	var excelFileName = cfg.testInp1.toLowerCase().substr(cfg.testInp1.lastIndexOf("."));
				//		    	for(var k = 0; k < testFormat.length; k++){
				//		    		var reg = new RegExp(testFormat[k]);
				//		    		if(!reg.test(excelFileName)){
				//		    			checkFormatLen.push(testFormat[k]);
				//		    		}
				//		    	}
				//		    	if(checkFormatLen.length == testFormat.length){
				//		    		result.text = "文件类型出错！";
				//		    		result.isPass = false;
				//		    		return result;
				//		    	}

				//3文件大小校验             100M
				//		    	var checkSumSize = this.upLoadFileSize(cfg.upLoadFileSumSize)
				//		    	if(checkSumSize > 100*1024){
				//		    		result.text = '附件上传不能大于100M';
				//		    		result.isPass = false;
				//		    		return result;
				//		    	}
				return result;
			}
		};
	}

/***/ },

/***/ 175:
/***/ function(module, exports, __webpack_require__) {

	/*
	 angular-file-upload v2.3.4
	 https://github.com/nervgh/angular-file-upload
	*/

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true){
			factory();
			module.exports = {
				"name": "angularFileUpload"
			}
		}
		else if(typeof define === 'function' && define.amd){
			define(['angular'], factory);
		}
		else if(typeof exports === 'object'){
			exports["angular-file-upload"] = factory();
		}
		else{
			root["angular-file-upload"] = factory();
		}
	})(this, function(ng) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
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
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		var _options = __webpack_require__(2);
		
		var _options2 = _interopRequireDefault(_options);
		
		var _FileUploader = __webpack_require__(3);
		
		var _FileUploader2 = _interopRequireDefault(_FileUploader);
		
		var _FileLikeObject = __webpack_require__(4);
		
		var _FileLikeObject2 = _interopRequireDefault(_FileLikeObject);
		
		var _FileItem = __webpack_require__(5);
		
		var _FileItem2 = _interopRequireDefault(_FileItem);
		
		var _FileDirective = __webpack_require__(6);
		
		var _FileDirective2 = _interopRequireDefault(_FileDirective);
		
		var _FileSelect = __webpack_require__(7);
		
		var _FileSelect2 = _interopRequireDefault(_FileSelect);
		
		var _FileDrop = __webpack_require__(8);
		
		var _FileDrop2 = _interopRequireDefault(_FileDrop);
		
		var _FileOver = __webpack_require__(9);
		
		var _FileOver2 = _interopRequireDefault(_FileOver);
		
		var _FileSelect3 = __webpack_require__(10);
		
		var _FileSelect4 = _interopRequireDefault(_FileSelect3);
		
		var _FileDrop3 = __webpack_require__(11);
		
		var _FileDrop4 = _interopRequireDefault(_FileDrop3);
		
		var _FileOver3 = __webpack_require__(12);
		
		var _FileOver4 = _interopRequireDefault(_FileOver3);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		angular.module(_config2.default.name, []).value('fileUploaderOptions', _options2.default).factory('FileUploader', _FileUploader2.default).factory('FileLikeObject', _FileLikeObject2.default).factory('FileItem', _FileItem2.default).factory('FileDirective', _FileDirective2.default).factory('FileSelect', _FileSelect2.default).factory('FileDrop', _FileDrop2.default).factory('FileOver', _FileOver2.default).directive('nvFileSelect', _FileSelect4.default).directive('nvFileDrop', _FileDrop4.default).directive('nvFileOver', _FileOver4.default).run(['FileUploader', 'FileLikeObject', 'FileItem', 'FileDirective', 'FileSelect', 'FileDrop', 'FileOver', function (FileUploader, FileLikeObject, FileItem, FileDirective, FileSelect, FileDrop, FileOver) {
		    // only for compatibility
		    FileUploader.FileLikeObject = FileLikeObject;
		    FileUploader.FileItem = FileItem;
		    FileUploader.FileDirective = FileDirective;
		    FileUploader.FileSelect = FileSelect;
		    FileUploader.FileDrop = FileDrop;
		    FileUploader.FileOver = FileOver;
		}]);

	/***/ },
	/* 1 */
	/***/ function(module, exports) {

		module.exports = {
			"name": "angularFileUpload"
		};

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = {
		    url: '/',
		    alias: 'file',
	//		headers: {'Content-Type': 'application/x-zip-compressed'},
		    queue: [],
		    progress: 0,
		    autoUpload: false,
		    removeAfterUpload: false,
		    method: 'POST',
		    filters: [],
		    formData: [],
		    queueLimit: Number.MAX_VALUE,
		    withCredentials: true,
		    disableMultipart: false
		};

	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		var _angular = angular;
		var copy = _angular.copy;
		var extend = _angular.extend;
		var forEach = _angular.forEach;
		var isObject = _angular.isObject;
		var isNumber = _angular.isNumber;
		var isDefined = _angular.isDefined;
		var isArray = _angular.isArray;
		var element = _angular.element;
		function __identity(fileUploaderOptions, $rootScope, $http, $window, $timeout, FileLikeObject, FileItem) {
		    var File = $window.File;
		    var FormData = $window.FormData;
		
		    var FileUploader = function () {
		        /**********************
		         * PUBLIC
		         **********************/
		        /**
		         * Creates an instance of FileUploader
		         * @param {Object} [options]
		         * @constructor
		         */
		
		        function FileUploader(options) {
		            _classCallCheck(this, FileUploader);
		
		            var settings = copy(fileUploaderOptions);
		
		            extend(this, settings, options, {
		                isUploading: false,
		                _nextIndex: 0,
		                _failFilterIndex: -1,
		                _directives: { select: [], drop: [], over: [] }
		            });
		
		            // add default filters
		            this.filters.unshift({ name: 'queueLimit', fn: this._queueLimitFilter });
		            this.filters.unshift({ name: 'folder', fn: this._folderFilter });
		        }
		        /**
		         * Adds items to the queue
		         * @param {File|HTMLInputElement|Object|FileList|Array<Object>} files
		         * @param {Object} [options]
		         * @param {Array<Function>|String} filters
		         */
		
		
		        FileUploader.prototype.addToQueue = function addToQueue(files, options, filters) {
		            var _this = this;
		
		            var list = this.isArrayLikeObject(files) ? files : [files];
		            var arrayOfFilters = this._getFilters(filters);
		            var count = this.queue.length;
		            var addedFileItems;
		            forEach(list, function (some /*{File|HTMLInputElement|Object}*/) {
		            	addedFileItems = [];
		                var temp = new FileLikeObject(some);
		                if (_this._isValidFile(temp, arrayOfFilters, options)) {
		                    var fileItem = new FileItem(_this, some, options);
		                    
		                    var currentFileType = fileItem.file.name;
		                    if(currentFileType.slice(currentFileType.lastIndexOf('.')) !== '.zip'){
		                    	alert('文件格式错误，请重新上传！');
		                    	return;
		                    }
		                    
		                    addedFileItems.push(fileItem);
		                    _this.queue = addedFileItems;
	//	                    _this._onAfterAddingFile(fileItem);
		                } else {
		                    var filter = arrayOfFilters[_this._failFilterIndex];
		                    _this._onWhenAddingFileFailed(temp, filter, options);
		                }
		            });
		            console.log(253,_this.queue)
		            if (this.queue.length !== count) {
		                this._onAfterAddingAll(addedFileItems);
		                this.progress = this._getTotalProgress();
		            }
		            this._render();
		            if (this.autoUpload) this.uploadAll();
		        };
		        /**
		         * Remove items from the queue. Remove last: index = -1
		         * @param {FileItem|Number} value
		         */
		
		
		        FileUploader.prototype.removeFromQueue = function removeFromQueue(value) {
		            var index = this.getIndexOfItem(value);
		            var item = this.queue[index];
		            if (item.isUploading) item.cancel();
		            this.queue.splice(index, 1);
		            item._destroy();
		            this.progress = this._getTotalProgress();
		        };
		        /**
		         * Clears the queue
		         */
		
		
		        FileUploader.prototype.clearQueue = function clearQueue(dialog) {
		            while (this.queue.length) {
		                this.queue[0].remove();
		            }
		            this.progress = 0;
		            dialog.show = false;
		            window.location.reload();
					console.warn(287)
		        };
		        /**
		         * Uploads a item from the queue
		         * @param {FileItem|Number} value
		         */
		
		
		        FileUploader.prototype.uploadItem = function uploadItem(value) {
		            var index = this.getIndexOfItem(value);
		            var item = this.queue[index];
		            var transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';
		
		            item._prepareToUploading();
		            if (this.isUploading) return;
		
		            this._onBeforeUploadItem(item);
		            if (item.isCancel) return;
		
		            item.isUploading = true;
		            this.isUploading = true;
		            this[transport](item);
		            this._render();
		        };
		        /**
		         * Cancels uploading of item from the queue
		         * @param {FileItem|Number} value
		         */
		
		
		        FileUploader.prototype.cancelItem = function cancelItem(value) {
		            var _this2 = this;
		
		            var index = this.getIndexOfItem(value);
		            var item = this.queue[index];
		            var prop = this.isHTML5 ? '_xhr' : '_form';
		            if (!item) return;
		            item.isCancel = true;
		            if (item.isUploading) {
		                // It will call this._onCancelItem() & this._onCompleteItem() asynchronously
		                item[prop].abort();
		            } else {
		                (function () {
		                    var dummy = [undefined, 0, {}];
		                    var onNextTick = function onNextTick() {
		                        _this2._onCancelItem.apply(_this2, [item].concat(dummy));
		                        _this2._onCompleteItem.apply(_this2, [item].concat(dummy));
		                    };
		                    $timeout(onNextTick); // Trigger callbacks asynchronously (setImmediate emulation)
		                })();
		            }
		        };
		        /**
		         * Uploads all not uploaded items of queue
		         */
		
		
		        FileUploader.prototype.uploadAll = function uploadAll(param) {
		            var items = this.getNotUploadedItems().filter(function (item) {
		                return !item.isUploading;
		            });
		            if (!items.length) return;
					
		            forEach(items, function (item) {
		                return item._prepareToUploading();
		            });
		            
		            items[0].url = items[0].url + '?id=' + param.id + '&partnerName=' + param.partnerName + '&apiCode=' + param.apiCode;
		            
		            items[0].upload();
		        };
		        /**
		         * Cancels all uploads
		         */
		
		
		        FileUploader.prototype.cancelAll = function cancelAll() {
		            var items = this.getNotUploadedItems();
		            forEach(items, function (item) {
		                return item.cancel();
		            });
		        };
		        /**
		         * Returns "true" if value an instance of File
		         * @param {*} value
		         * @returns {Boolean}
		         * @private
		         */
		
		
		        FileUploader.prototype.isFile = function isFile(value) {
		            return this.constructor.isFile(value);
		        };
		        /**
		         * Returns "true" if value an instance of FileLikeObject
		         * @param {*} value
		         * @returns {Boolean}
		         * @private
		         */
		
		
		        FileUploader.prototype.isFileLikeObject = function isFileLikeObject(value) {
		            return this.constructor.isFileLikeObject(value);
		        };
		        /**
		         * Returns "true" if value is array like object
		         * @param {*} value
		         * @returns {Boolean}
		         */
		
		
		        FileUploader.prototype.isArrayLikeObject = function isArrayLikeObject(value) {
		            return this.constructor.isArrayLikeObject(value);
		        };
		        /**
		         * Returns a index of item from the queue
		         * @param {Item|Number} value
		         * @returns {Number}
		         */
		
		
		        FileUploader.prototype.getIndexOfItem = function getIndexOfItem(value) {
		            return isNumber(value) ? value : this.queue.indexOf(value);
		        };
		        /**
		         * Returns not uploaded items
		         * @returns {Array}
		         */
		
		
		        FileUploader.prototype.getNotUploadedItems = function getNotUploadedItems() {
		            return this.queue.filter(function (item) {
		                return !item.isUploaded;
		            });
		        };
		        /**
		         * Returns items ready for upload
		         * @returns {Array}
		         */
		
		
		        FileUploader.prototype.getReadyItems = function getReadyItems() {
		            return this.queue.filter(function (item) {
		                return item.isReady && !item.isUploading;
		            }).sort(function (item1, item2) {
		                return item1.index - item2.index;
		            });
		        };
		        /**
		         * Destroys instance of FileUploader
		         */
		
		
		        FileUploader.prototype.destroy = function destroy() {
		            var _this3 = this;
		
		            forEach(this._directives, function (key) {
		                forEach(_this3._directives[key], function (object) {
		                    object.destroy();
		                });
		            });
		        };
		        /**
		         * Callback
		         * @param {Array} fileItems
		         */
		
		
		        FileUploader.prototype.onAfterAddingAll = function onAfterAddingAll(fileItems) {};
		        /**
		         * Callback
		         * @param {FileItem} fileItem
		         */
		
		
		        FileUploader.prototype.onAfterAddingFile = function onAfterAddingFile(fileItem) {};
		        /**
		         * Callback
		         * @param {File|Object} item
		         * @param {Object} filter
		         * @param {Object} options
		         */
		
		
		        FileUploader.prototype.onWhenAddingFileFailed = function onWhenAddingFileFailed(item, filter, options) {};
		        /**
		         * Callback
		         * @param {FileItem} fileItem
		         */
		
		
		        FileUploader.prototype.onBeforeUploadItem = function onBeforeUploadItem(fileItem) {};
		        /**
		         * Callback
		         * @param {FileItem} fileItem
		         * @param {Number} progress
		         */
		
		
		        FileUploader.prototype.onProgressItem = function onProgressItem(fileItem, progress) {};
		        /**
		         * Callback
		         * @param {Number} progress
		         */
		
		
		        FileUploader.prototype.onProgressAll = function onProgressAll(progress) {};
		        /**
		         * Callback
		         * @param {FileItem} item
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         */
		
		
		        FileUploader.prototype.onSuccessItem = function onSuccessItem(item, response, status, headers) {};
		        /**
		         * Callback
		         * @param {FileItem} item
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         */
		
		
		        FileUploader.prototype.onErrorItem = function onErrorItem(item, response, status, headers) {};
		        /**
		         * Callback
		         * @param {FileItem} item
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         */
		
		
		        FileUploader.prototype.onCancelItem = function onCancelItem(item, response, status, headers) {};
		        /**
		         * Callback
		         * @param {FileItem} item
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         */
		
		
		        FileUploader.prototype.onCompleteItem = function onCompleteItem(item, response, status, headers) {};
		        /**
		         * Callback
		         */
		
		
		        FileUploader.prototype.onCompleteAll = function onCompleteAll() {};
		        /**********************
		         * PRIVATE
		         **********************/
		        /**
		         * Returns the total progress
		         * @param {Number} [value]
		         * @returns {Number}
		         * @private
		         */
		
		
		        FileUploader.prototype._getTotalProgress = function _getTotalProgress(value) {
		            if (this.removeAfterUpload) return value || 0;
		
		            var notUploaded = this.getNotUploadedItems().length;
		            var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
		            var ratio = 100 / this.queue.length;
		            var current = (value || 0) * ratio / 100;
		
		            return Math.round(uploaded * ratio + current);
		        };
		        /**
		         * Returns array of filters
		         * @param {Array<Function>|String} filters
		         * @returns {Array<Function>}
		         * @private
		         */
		
		
		        FileUploader.prototype._getFilters = function _getFilters(filters) {
		            if (!filters) return this.filters;
		            if (isArray(filters)) return filters;
		            var names = filters.match(/[^\s,]+/g);
		            return this.filters.filter(function (filter) {
		                return names.indexOf(filter.name) !== -1;
		            });
		        };
		        /**
		         * Updates html
		         * @private
		         */
		
		
		        FileUploader.prototype._render = function _render() {
		            if (!$rootScope.$$phase) $rootScope.$apply();
		        };
		        /**
		         * Returns "true" if item is a file (not folder)
		         * @param {File|FileLikeObject} item
		         * @returns {Boolean}
		         * @private
		         */
		
		
		        FileUploader.prototype._folderFilter = function _folderFilter(item) {
		            return !!(item.size || item.type);
		        };
		        /**
		         * Returns "true" if the limit has not been reached
		         * @returns {Boolean}
		         * @private
		         */
		
		
		        FileUploader.prototype._queueLimitFilter = function _queueLimitFilter() {
		            return this.queue.length < this.queueLimit;
		        };
		        /**
		         * Returns "true" if file pass all filters
		         * @param {File|Object} file
		         * @param {Array<Function>} filters
		         * @param {Object} options
		         * @returns {Boolean}
		         * @private
		         */
		
		
		        FileUploader.prototype._isValidFile = function _isValidFile(file, filters, options) {
		            var _this4 = this;
		
		            this._failFilterIndex = -1;
		            return !filters.length ? true : filters.every(function (filter) {
		                _this4._failFilterIndex++;
		                return filter.fn.call(_this4, file, options);
		            });
		        };
		        /**
		         * Checks whether upload successful
		         * @param {Number} status
		         * @returns {Boolean}
		         * @private
		         */
		
		
		        FileUploader.prototype._isSuccessCode = function _isSuccessCode(status) {
		            return status >= 200 && status < 300 || status === 304;
		        };
		        /**
		         * Transforms the server response
		         * @param {*} response
		         * @param {Object} headers
		         * @returns {*}
		         * @private
		         */
		
		
		        FileUploader.prototype._transformResponse = function _transformResponse(response, headers) {
		            var headersGetter = this._headersGetter(headers);
		            forEach($http.defaults.transformResponse, function (transformFn) {
		                response = transformFn(response, headersGetter);
		            });
		            return response;
		        };
		        /**
		         * Parsed response headers
		         * @param headers
		         * @returns {Object}
		         * @see https://github.com/angular/angular.js/blob/master/src/ng/http.js
		         * @private
		         */
		
		
		        FileUploader.prototype._parseHeaders = function _parseHeaders(headers) {
		            var parsed = {},
		                key,
		                val,
		                i;
		
		            if (!headers) return parsed;
		
		            forEach(headers.split('\n'), function (line) {
		                i = line.indexOf(':');
		                key = line.slice(0, i).trim().toLowerCase();
		                val = line.slice(i + 1).trim();
		
		                if (key) {
		                    parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
		                }
		            });
		
		            return parsed;
		        };
		        /**
		         * Returns function that returns headers
		         * @param {Object} parsedHeaders
		         * @returns {Function}
		         * @private
		         */
		
		
		        FileUploader.prototype._headersGetter = function _headersGetter(parsedHeaders) {
		            return function (name) {
		                if (name) {
		                    return parsedHeaders[name.toLowerCase()] || null;
		                }
		                return parsedHeaders;
		            };
		        };
		        /**
		         * The XMLHttpRequest transport
		         * @param {FileItem} item
		         * @private
		         */
		
		
		        FileUploader.prototype._xhrTransport = function _xhrTransport(item) {
		            var _this5 = this;
		
		            var xhr = item._xhr = new XMLHttpRequest();
		            var sendable;
		
		            if (!item.disableMultipart) {
		                sendable = new FormData();
		                forEach(item.formData, function (obj) {
		                    forEach(obj, function (value, key) {
		                        sendable.append(key, value);
		                    });
		                });
						console.warn(20)
		                sendable.append(item.alias, item._file, item.file.name);
		            } else {
		                sendable = item._file;
		            }
		
		            if (typeof item._file.size != 'number') {
		                throw new TypeError('The file specified is no longer valid');
		            }
		
		            xhr.upload.onprogress = function (event) {
		                var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
		                _this5._onProgressItem(item, progress);
		            };
		
		            xhr.onload = function () {
		                var headers = _this5._parseHeaders(xhr.getAllResponseHeaders());
		                var response = _this5._transformResponse(xhr.response, headers);
		                var gist = _this5._isSuccessCode(xhr.status) ? 'Success' : 'Error';
		                var method = '_on' + gist + 'Item';
		                _this5[method](item, response, xhr.status, headers);
		                _this5._onCompleteItem(item, response, xhr.status, headers);
		            };
		
		            xhr.onerror = function () {
		                var headers = _this5._parseHeaders(xhr.getAllResponseHeaders());
		                var response = _this5._transformResponse(xhr.response, headers);
		                _this5._onErrorItem(item, response, xhr.status, headers);
		                _this5._onCompleteItem(item, response, xhr.status, headers);
		            };
		
		            xhr.onabort = function () {
		                var headers = _this5._parseHeaders(xhr.getAllResponseHeaders());
		                var response = _this5._transformResponse(xhr.response, headers);
		                _this5._onCancelItem(item, response, xhr.status, headers);
		                _this5._onCompleteItem(item, response, xhr.status, headers);
		            };
		
		            xhr.open(item.method, item.url, true);
		
		            xhr.withCredentials = item.withCredentials;
		
		            forEach(item.headers, function (value, name) {
		                xhr.setRequestHeader(name, value);
		            });
		
		            xhr.send(sendable);
		        };
		        /**
		         * The IFrame transport
		         * @param {FileItem} item
		         * @private
		         */
		
		
		        FileUploader.prototype._iframeTransport = function _iframeTransport(item) {
		            var _this6 = this;
		
		            var form = element('<form style="display: none;" />');
		            var iframe = element('<iframe name="iframeTransport' + Date.now() + '">');
		            var input = item._input;
		
		            if (item._form) item._form.replaceWith(input); // remove old form
		            item._form = form; // save link to new form
		
		            input.prop('name', item.alias);
		
		            forEach(item.formData, function (obj) {
		                forEach(obj, function (value, key) {
		                    var element_ = element('<input type="hidden" name="' + key + '" />');
		                    element_.val(value);
		                    form.append(element_);
		                });
		            });
		
		            form.prop({
		                action: item.url,
		                method: 'POST',
		                target: iframe.prop('name'),
		                enctype: 'multipart/form-data',
		                encoding: 'multipart/form-data' // old IE
		            });
		
		            iframe.bind('load', function () {
		                var html = '';
		                var status = 200;
		
		                try {
		                    // Fix for legacy IE browsers that loads internal error page
		                    // when failed WS response received. In consequence iframe
		                    // content access denied error is thrown becouse trying to
		                    // access cross domain page. When such thing occurs notifying
		                    // with empty response object. See more info at:
		                    // http://stackoverflow.com/questions/151362/access-is-denied-error-on-accessing-iframe-document-object
		                    // Note that if non standard 4xx or 5xx error code returned
		                    // from WS then response content can be accessed without error
		                    // but 'XHR' status becomes 200. In order to avoid confusion
		                    // returning response via same 'success' event handler.
		
		                    // fixed angular.contents() for iframes
		                    html = iframe[0].contentDocument.body.innerHTML;
		                } catch (e) {
		                    // in case we run into the access-is-denied error or we have another error on the server side
		                    // (intentional 500,40... errors), we at least say 'something went wrong' -> 500
		                    status = 500;
		                }
		
		                var xhr = { response: html, status: status, dummy: true };
		                var headers = {};
		                var response = _this6._transformResponse(xhr.response, headers);
		
		                _this6._onSuccessItem(item, response, xhr.status, headers);
		                _this6._onCompleteItem(item, response, xhr.status, headers);
		            });
		
		            form.abort = function () {
		                var xhr = { status: 0, dummy: true };
		                var headers = {};
		                var response;
		
		                iframe.unbind('load').prop('src', 'javascript:false;');
		                form.replaceWith(input);
		
		                _this6._onCancelItem(item, response, xhr.status, headers);
		                _this6._onCompleteItem(item, response, xhr.status, headers);
		            };
		
		            input.after(form);
		            form.append(input).append(iframe);
		
		            form[0].submit();
		        };
		        /**
		         * Inner callback
		         * @param {File|Object} item
		         * @param {Object} filter
		         * @param {Object} options
		         * @private
		         */
		
		
		        FileUploader.prototype._onWhenAddingFileFailed = function _onWhenAddingFileFailed(item, filter, options) {
		            this.onWhenAddingFileFailed(item, filter, options);
		        };
		        /**
		         * Inner callback
		         * @param {FileItem} item
		         */
		
		
		        FileUploader.prototype._onAfterAddingFile = function _onAfterAddingFile(item) {
		            this.onAfterAddingFile(item);
		        };
		        /**
		         * Inner callback
		         * @param {Array<FileItem>} items
		         */
		
		
		        FileUploader.prototype._onAfterAddingAll = function _onAfterAddingAll(items) {
		            this.onAfterAddingAll(items);
		        };
		        /**
		         *  Inner callback
		         * @param {FileItem} item
		         * @private
		         */
		
		
		        FileUploader.prototype._onBeforeUploadItem = function _onBeforeUploadItem(item) {
		            item._onBeforeUpload();
		            this.onBeforeUploadItem(item);
		        };
		        /**
		         * Inner callback
		         * @param {FileItem} item
		         * @param {Number} progress
		         * @private
		         */
		
		
		        FileUploader.prototype._onProgressItem = function _onProgressItem(item, progress) {
		            var total = this._getTotalProgress(progress);
		            this.progress = total;
		            item._onProgress(progress);
		            this.onProgressItem(item, progress);
		            this.onProgressAll(total);
		            this._render();
		        };
		        /**
		         * Inner callback
		         * @param {FileItem} item
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         * @private
		         */
		
		
		        FileUploader.prototype._onSuccessItem = function _onSuccessItem(item, response, status, headers) {
		            item._onSuccess(response, status, headers);
		            this.onSuccessItem(item, response, status, headers);
		        };
		        /**
		         * Inner callback
		         * @param {FileItem} item
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         * @private
		         */
		
		
		        FileUploader.prototype._onErrorItem = function _onErrorItem(item, response, status, headers) {
		            item._onError(response, status, headers);
		            this.onErrorItem(item, response, status, headers);
		        };
		        /**
		         * Inner callback
		         * @param {FileItem} item
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         * @private
		         */
		
		
		        FileUploader.prototype._onCancelItem = function _onCancelItem(item, response, status, headers) {
		            item._onCancel(response, status, headers);
		            this.onCancelItem(item, response, status, headers);
		        };
		        /**
		         * Inner callback
		         * @param {FileItem} item
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         * @private
		         */
		
		
		        FileUploader.prototype._onCompleteItem = function _onCompleteItem(item, response, status, headers) {
		            item._onComplete(response, status, headers);
		            this.onCompleteItem(item, response, status, headers);
		
		            var nextItem = this.getReadyItems()[0];
		            this.isUploading = false;
		
		            if (isDefined(nextItem)) {
		                nextItem.upload();
		                return;
		            }
		
		            this.onCompleteAll();
		            this.progress = this._getTotalProgress();
		            this._render();
		        };
		        /**********************
		         * STATIC
		         **********************/
		        /**
		         * Returns "true" if value an instance of File
		         * @param {*} value
		         * @returns {Boolean}
		         * @private
		         */
		
		
		        FileUploader.isFile = function isFile(value) {
		            return File && value instanceof File;
		        };
		        /**
		         * Returns "true" if value an instance of FileLikeObject
		         * @param {*} value
		         * @returns {Boolean}
		         * @private
		         */
		
		
		        FileUploader.isFileLikeObject = function isFileLikeObject(value) {
		            return value instanceof FileLikeObject;
		        };
		        /**
		         * Returns "true" if value is array like object
		         * @param {*} value
		         * @returns {Boolean}
		         */
		
		
		        FileUploader.isArrayLikeObject = function isArrayLikeObject(value) {
		            return isObject(value) && 'length' in value;
		        };
		        /**
		         * Inherits a target (Class_1) by a source (Class_2)
		         * @param {Function} target
		         * @param {Function} source
		         */
		
		
		        FileUploader.inherit = function inherit(target, source) {
		            target.prototype = Object.create(source.prototype);
		            target.prototype.constructor = target;
		            target.super_ = source;
		        };
		
		        return FileUploader;
		    }();
		
		    /**********************
		     * PUBLIC
		     **********************/
		    /**
		     * Checks a support the html5 uploader
		     * @returns {Boolean}
		     * @readonly
		     */
		
		
		    FileUploader.prototype.isHTML5 = !!(File && FormData);
		    /**********************
		     * STATIC
		     **********************/
		    /**
		     * @borrows FileUploader.prototype.isHTML5
		     */
		    FileUploader.isHTML5 = FileUploader.prototype.isHTML5;
		
		    return FileUploader;
		}
		
		__identity.$inject = ['fileUploaderOptions', '$rootScope', '$http', '$window', '$timeout', 'FileLikeObject', 'FileItem'];

	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		var _angular = angular;
		var copy = _angular.copy;
		var isElement = _angular.isElement;
		var isString = _angular.isString;
		function __identity() {
		
		    return function () {
		        /**
		         * Creates an instance of FileLikeObject
		         * @param {File|HTMLInputElement|Object} fileOrInput
		         * @constructor
		         */
		
		        function FileLikeObject(fileOrInput) {
		            _classCallCheck(this, FileLikeObject);
		
		            var isInput = isElement(fileOrInput);
		            var fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
		            var postfix = isString(fakePathOrObject) ? 'FakePath' : 'Object';
		            var method = '_createFrom' + postfix;
		            this[method](fakePathOrObject);
		        }
		        /**
		         * Creates file like object from fake path string
		         * @param {String} path
		         * @private
		         */
		
		
		        FileLikeObject.prototype._createFromFakePath = function _createFromFakePath(path) {
		            this.lastModifiedDate = null;
		            this.size = null;
		            this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
		            this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
		        };
		        /**
		         * Creates file like object from object
		         * @param {File|FileLikeObject} object
		         * @private
		         */
		
		
		        FileLikeObject.prototype._createFromObject = function _createFromObject(object) {
		            this.lastModifiedDate = copy(object.lastModifiedDate);
		            this.size = object.size;
		            this.type = object.type;
		            this.name = object.name;
		        };
		
		        return FileLikeObject;
		    }();
		}

	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		var _angular = angular;
		var copy = _angular.copy;
		var extend = _angular.extend;
		var element = _angular.element;
		var isElement = _angular.isElement;
		function __identity($compile, FileLikeObject) {
		
		    return function () {
		        /**
		         * Creates an instance of FileItem
		         * @param {FileUploader} uploader
		         * @param {File|HTMLInputElement|Object} some
		         * @param {Object} options
		         * @constructor
		         */
		
		        function FileItem(uploader, some, options) {
		            _classCallCheck(this, FileItem);
		
		            var isInput = isElement(some);
		            var input = isInput ? element(some) : null;
		            var file = !isInput ? some : null;
		
		            extend(this, {
		                url: uploader.url,
		                alias: uploader.alias,
		                headers: copy(uploader.headers),
		                formData: copy(uploader.formData),
		                removeAfterUpload: uploader.removeAfterUpload,
		                withCredentials: uploader.withCredentials,
		                disableMultipart: uploader.disableMultipart,
		                method: uploader.method
		            }, options, {
		                uploader: uploader,
		                file: new FileLikeObject(some),
		                isReady: false,
		                isUploading: false,
		                isUploaded: false,
		                isSuccess: false,
		                isCancel: false,
		                isError: false,
		                progress: 0,
		                index: null,
		                _file: file,
		                _input: input
		            });
		
		            if (input) this._replaceNode(input);
		        }
		        /**********************
		         * PUBLIC
		         **********************/
		        /**
		         * Uploads a FileItem
		         */
		
		
		        FileItem.prototype.upload = function upload() {
		            try {
		                this.uploader.uploadItem(this);
		            } catch (e) {
		                this.uploader._onCompleteItem(this, '', 0, []);
		                this.uploader._onErrorItem(this, '', 0, []);
		            }
		        };
		        /**
		         * Cancels uploading of FileItem
		         */
		
		
		        FileItem.prototype.cancel = function cancel() {
		            this.uploader.cancelItem(this);
		        };
		        /**
		         * Removes a FileItem
		         */
		
		
		        FileItem.prototype.remove = function remove() {
		            this.uploader.removeFromQueue(this);
		        };
		        /**
		         * Callback
		         * @private
		         */
		
		
		        FileItem.prototype.onBeforeUpload = function onBeforeUpload() {};
		        /**
		         * Callback
		         * @param {Number} progress
		         * @private
		         */
		
		
		        FileItem.prototype.onProgress = function onProgress(progress) {};
		        /**
		         * Callback
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         */
		
		
		        FileItem.prototype.onSuccess = function onSuccess(response, status, headers) {};
		        /**
		         * Callback
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         */
		
		
		        FileItem.prototype.onError = function onError(response, status, headers) {};
		        /**
		         * Callback
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         */
		
		
		        FileItem.prototype.onCancel = function onCancel(response, status, headers) {};
		        /**
		         * Callback
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         */
		
		
		        FileItem.prototype.onComplete = function onComplete(response, status, headers) {};
		        /**********************
		         * PRIVATE
		         **********************/
		        /**
		         * Inner callback
		         */
		
		
		        FileItem.prototype._onBeforeUpload = function _onBeforeUpload() {
		            this.isReady = true;
		            this.isUploading = false;
		            this.isUploaded = false;
		            this.isSuccess = false;
		            this.isCancel = false;
		            this.isError = false;
		            this.progress = 0;
		            this.onBeforeUpload();
		        };
		        /**
		         * Inner callback
		         * @param {Number} progress
		         * @private
		         */
		
		
		        FileItem.prototype._onProgress = function _onProgress(progress) {
		            this.progress = progress;
		            this.onProgress(progress);
		        };
		        /**
		         * Inner callback
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         * @private
		         */
		
		
		        FileItem.prototype._onSuccess = function _onSuccess(response, status, headers) {
		            this.isReady = false;
		            this.isUploading = false;
		            this.isUploaded = true;
		            this.isSuccess = true;
		            this.isCancel = false;
		            this.isError = false;
		            this.progress = 100;
		            this.index = null;
		            this.onSuccess(response, status, headers);
		        };
		        /**
		         * Inner callback
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         * @private
		         */
		
		
		        FileItem.prototype._onError = function _onError(response, status, headers) {
		            this.isReady = false;
		            this.isUploading = false;
		            this.isUploaded = true;
		            this.isSuccess = false;
		            this.isCancel = false;
		            this.isError = true;
		            this.progress = 0;
		            this.index = null;
		            this.onError(response, status, headers);
		        };
		        /**
		         * Inner callback
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         * @private
		         */
		
		
		        FileItem.prototype._onCancel = function _onCancel(response, status, headers) {
		            this.isReady = false;
		            this.isUploading = false;
		            this.isUploaded = false;
		            this.isSuccess = false;
		            this.isCancel = true;
		            this.isError = false;
		            this.progress = 0;
		            this.index = null;
		            this.onCancel(response, status, headers);
		        };
		        /**
		         * Inner callback
		         * @param {*} response
		         * @param {Number} status
		         * @param {Object} headers
		         * @private
		         */
		
		
		        FileItem.prototype._onComplete = function _onComplete(response, status, headers) {
		            this.onComplete(response, status, headers);
		            if (this.removeAfterUpload) this.remove();
		        };
		        /**
		         * Destroys a FileItem
		         */
		
		
		        FileItem.prototype._destroy = function _destroy() {
		            if (this._input) this._input.remove();
		            if (this._form) this._form.remove();
		            delete this._form;
		            delete this._input;
		        };
		        /**
		         * Prepares to uploading
		         * @private
		         */
		
		
		        FileItem.prototype._prepareToUploading = function _prepareToUploading() {
		            this.index = this.index || ++this.uploader._nextIndex;
		            this.isReady = true;
		        };
		        /**
		         * Replaces input element on his clone
		         * @param {JQLite|jQuery} input
		         * @private
		         */
		
		
		        FileItem.prototype._replaceNode = function _replaceNode(input) {
		            var clone = $compile(input.clone())(input.scope());
		            clone.prop('value', null); // FF fix
		            input.css('display', 'none');
		            input.after(clone); // remove jquery dependency
		        };
		
		        return FileItem;
		    }();
		}
		
		__identity.$inject = ['$compile', 'FileLikeObject'];

	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		var _angular = angular;
		var extend = _angular.extend;
		function __identity() {
		    var FileDirective = function () {
		        /**
		         * Creates instance of {FileDirective} object
		         * @param {Object} options
		         * @param {Object} options.uploader
		         * @param {HTMLElement} options.element
		         * @param {Object} options.events
		         * @param {String} options.prop
		         * @constructor
		         */
		
		        function FileDirective(options) {
		            _classCallCheck(this, FileDirective);
		
		            extend(this, options);
		            this.uploader._directives[this.prop].push(this);
		            this._saveLinks();
		            this.bind();
		        }
		        /**
		         * Binds events handles
		         */
		
		
		        FileDirective.prototype.bind = function bind() {
		            for (var key in this.events) {
		                var prop = this.events[key];
		                this.element.bind(key, this[prop]);
		            }
		        };
		        /**
		         * Unbinds events handles
		         */
		
		
		        FileDirective.prototype.unbind = function unbind() {
		            for (var key in this.events) {
		                this.element.unbind(key, this.events[key]);
		            }
		        };
		        /**
		         * Destroys directive
		         */
		
		
		        FileDirective.prototype.destroy = function destroy() {
		            var index = this.uploader._directives[this.prop].indexOf(this);
		            this.uploader._directives[this.prop].splice(index, 1);
		            this.unbind();
		            // this.element = null;
		        };
		        /**
		         * Saves links to functions
		         * @private
		         */
		
		
		        FileDirective.prototype._saveLinks = function _saveLinks() {
		            for (var key in this.events) {
		                var prop = this.events[key];
		                this[prop] = this[prop].bind(this);
		            }
		        };
		
		        return FileDirective;
		    }();
		
		    /**
		     * Map of events
		     * @type {Object}
		     */
		
		
		    FileDirective.prototype.events = {};
		
		    return FileDirective;
		}

	/***/ },
	/* 7 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
		
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
		
		var _angular = angular;
		var extend = _angular.extend;
		function __identity($compile, FileDirective) {
		
		    return function (_FileDirective) {
		        _inherits(FileSelect, _FileDirective);
		
		        /**
		         * Creates instance of {FileSelect} object
		         * @param {Object} options
		         * @constructor
		         */
		
		        function FileSelect(options) {
		            _classCallCheck(this, FileSelect);
		
		            var extendedOptions = extend(options, {
		                // Map of events
		                events: {
		                    $destroy: 'destroy',
		                    change: 'onChange'
		                },
		                // Name of property inside uploader._directive object
		                prop: 'select'
		            });
		
		            var _this = _possibleConstructorReturn(this, _FileDirective.call(this, extendedOptions));
		
		            if (!_this.uploader.isHTML5) {
		                _this.element.removeAttr('multiple');
		            }
		            _this.element.prop('value', null); // FF fix
		            return _this;
		        }
		        /**
		         * Returns options
		         * @return {Object|undefined}
		         */
		
		
		        FileSelect.prototype.getOptions = function getOptions() {};
		        /**
		         * Returns filters
		         * @return {Array<Function>|String|undefined}
		         */
		
		
		        FileSelect.prototype.getFilters = function getFilters() {};
		        /**
		         * If returns "true" then HTMLInputElement will be cleared
		         * @returns {Boolean}
		         */
		
		
		        FileSelect.prototype.isEmptyAfterSelection = function isEmptyAfterSelection() {
		            return !!this.element.attr('multiple');
		        };
		        /**
		         * Event handler
		         */
		
		
		        FileSelect.prototype.onChange = function onChange() {
		            var files = this.uploader.isHTML5 ? this.element[0].files : this.element[0];
		            var options = this.getOptions();
		            var filters = this.getFilters();
		
		            if (!this.uploader.isHTML5) this.destroy();
		            this.uploader.addToQueue(files, options, filters);
		            if (this.isEmptyAfterSelection()) {
		                this.element.prop('value', null);
		                this.element.replaceWith($compile(this.element.clone())(this.scope)); // IE fix
		            }
		        };
		
		        return FileSelect;
		    }(FileDirective);
		}
		
		__identity.$inject = ['$compile', 'FileDirective'];

	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
		
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
		
		var _angular = angular;
		var extend = _angular.extend;
		var forEach = _angular.forEach;
		function __identity(FileDirective) {
		
		    return function (_FileDirective) {
		        _inherits(FileDrop, _FileDirective);
		
		        /**
		         * Creates instance of {FileDrop} object
		         * @param {Object} options
		         * @constructor
		         */
		
		        function FileDrop(options) {
		            _classCallCheck(this, FileDrop);
		
		            var extendedOptions = extend(options, {
		                // Map of events
		                events: {
		                    $destroy: 'destroy',
		                    drop: 'onDrop',
		                    dragover: 'onDragOver',
		                    dragleave: 'onDragLeave'
		                },
		                // Name of property inside uploader._directive object
		                prop: 'drop'
		            });
		
		            return _possibleConstructorReturn(this, _FileDirective.call(this, extendedOptions));
		        }
		        /**
		         * Returns options
		         * @return {Object|undefined}
		         */
		
		
		        FileDrop.prototype.getOptions = function getOptions() {};
		        /**
		         * Returns filters
		         * @return {Array<Function>|String|undefined}
		         */
		
		
		        FileDrop.prototype.getFilters = function getFilters() {};
		        /**
		         * Event handler
		         */
		
		
		        FileDrop.prototype.onDrop = function onDrop(event) {
		            var transfer = this._getTransfer(event);
		            if (!transfer) return;
		            var options = this.getOptions();
		            var filters = this.getFilters();
		            this._preventAndStop(event);
		            forEach(this.uploader._directives.over, this._removeOverClass, this);
		            this.uploader.addToQueue(transfer.files, options, filters);
		        };
		        /**
		         * Event handler
		         */
		
		
		        FileDrop.prototype.onDragOver = function onDragOver(event) {
		            var transfer = this._getTransfer(event);
		            if (!this._haveFiles(transfer.types)) return;
		            transfer.dropEffect = 'copy';
		            this._preventAndStop(event);
		            forEach(this.uploader._directives.over, this._addOverClass, this);
		        };
		        /**
		         * Event handler
		         */
		
		
		        FileDrop.prototype.onDragLeave = function onDragLeave(event) {
		            if (event.currentTarget === this.element[0]) return;
		            this._preventAndStop(event);
		            forEach(this.uploader._directives.over, this._removeOverClass, this);
		        };
		        /**
		         * Helper
		         */
		
		
		        FileDrop.prototype._getTransfer = function _getTransfer(event) {
		            return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
		        };
		        /**
		         * Helper
		         */
		
		
		        FileDrop.prototype._preventAndStop = function _preventAndStop(event) {
		            event.preventDefault();
		            event.stopPropagation();
		        };
		        /**
		         * Returns "true" if types contains files
		         * @param {Object} types
		         */
		
		
		        FileDrop.prototype._haveFiles = function _haveFiles(types) {
		            if (!types) return false;
		            if (types.indexOf) {
		                return types.indexOf('Files') !== -1;
		            } else if (types.contains) {
		                return types.contains('Files');
		            } else {
		                return false;
		            }
		        };
		        /**
		         * Callback
		         */
		
		
		        FileDrop.prototype._addOverClass = function _addOverClass(item) {
		            item.addOverClass();
		        };
		        /**
		         * Callback
		         */
		
		
		        FileDrop.prototype._removeOverClass = function _removeOverClass(item) {
		            item.removeOverClass();
		        };
		
		        return FileDrop;
		    }(FileDirective);
		}
		
		__identity.$inject = ['FileDirective'];

	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
		
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
		
		var _angular = angular;
		var extend = _angular.extend;
		function __identity(FileDirective) {
		
		    return function (_FileDirective) {
		        _inherits(FileOver, _FileDirective);
		
		        /**
		         * Creates instance of {FileDrop} object
		         * @param {Object} options
		         * @constructor
		         */
		
		        function FileOver(options) {
		            _classCallCheck(this, FileOver);
		
		            var extendedOptions = extend(options, {
		                // Map of events
		                events: {
		                    $destroy: 'destroy'
		                },
		                // Name of property inside uploader._directive object
		                prop: 'over',
		                // Over class
		                overClass: 'nv-file-over'
		            });
		
		            return _possibleConstructorReturn(this, _FileDirective.call(this, extendedOptions));
		        }
		        /**
		         * Adds over class
		         */
		
		
		        FileOver.prototype.addOverClass = function addOverClass() {
		            this.element.addClass(this.getOverClass());
		        };
		        /**
		         * Removes over class
		         */
		
		
		        FileOver.prototype.removeOverClass = function removeOverClass() {
		            this.element.removeClass(this.getOverClass());
		        };
		        /**
		         * Returns over class
		         * @returns {String}
		         */
		
		
		        FileOver.prototype.getOverClass = function getOverClass() {
		            return this.overClass;
		        };
		
		        return FileOver;
		    }(FileDirective);
		}
		
		__identity.$inject = ['FileDirective'];

	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function __identity($parse, FileUploader, FileSelect) {
		
		    return {
		        link: function link(scope, element, attributes) {
		            var uploader = scope.$eval(attributes.uploader);
		
		            if (!(uploader instanceof FileUploader)) {
		                throw new TypeError('"Uploader" must be an instance of FileUploader');
		            }
		
		            var object = new FileSelect({
		                uploader: uploader,
		                element: element,
		                scope: scope
		            });
		
		            object.getOptions = $parse(attributes.options).bind(object, scope);
		            object.getFilters = function () {
		                return attributes.filters;
		            };
		        }
		    };
		}
		
		__identity.$inject = ['$parse', 'FileUploader', 'FileSelect'];

	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function __identity($parse, FileUploader, FileDrop) {
		
		    return {
		        link: function link(scope, element, attributes) {
		            var uploader = scope.$eval(attributes.uploader);
		
		            if (!(uploader instanceof FileUploader)) {
		                throw new TypeError('"Uploader" must be an instance of FileUploader');
		            }
		
		            if (!uploader.isHTML5) return;
		
		            var object = new FileDrop({
		                uploader: uploader,
		                element: element
		            });
		
		            object.getOptions = $parse(attributes.options).bind(object, scope);
		            object.getFilters = function () {
		                return attributes.filters;
		            };
		        }
		    };
		}
		
		__identity.$inject = ['$parse', 'FileUploader', 'FileDrop'];

	/***/ },
	/* 12 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		    value: true
		});
		exports.default = __identity;
		
		var _config = __webpack_require__(1);
		
		var _config2 = _interopRequireDefault(_config);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function __identity(FileUploader, FileOver) {
		
		    return {
		        link: function link(scope, element, attributes) {
		            var uploader = scope.$eval(attributes.uploader);
		
		            if (!(uploader instanceof FileUploader)) {
		                throw new TypeError('"Uploader" must be an instance of FileUploader');
		            }
		
		            var object = new FileOver({
		                uploader: uploader,
		                element: element
		            });
		
		            object.getOverClass = function () {
		                return attributes.overClass || object.overClass;
		            };
		        }
		    };
		}
		
		__identity.$inject = ['FileUploader', 'FileOver'];

	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=angular-file-upload.js.map

/***/ },

/***/ 176:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">机构配置</div>\r\n\t        <div class=\"inner-header-rt fr\" style=\"min-width:220px\">\r\n\t            <a  ui-sref =\"configuration.newOrganic\" class=\"btn1 fr importA\">新建机构</a>\r\n\t        </div>\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t                <!--<tr>\r\n\t                    <td class=\"tl-r\">数据统计日期范围：<input type=\"hidden\" id=\"timeDefaut\"></td>\r\n\t                    <td>\r\n\t                    \t<input id=\"inpstart\" class=\"datainp inp1 fl calendar\" ng-model = 'query.presentDateStart' type=\"text\" placeholder=\"开始日期\" value=\"\"  readonly>\r\n\t                        <span class=\"fl\" style=\"line-height:27px;padding:0 6px;\">至</span>\r\n\t\t\t\t\t\t    <input id=\"inpend\" class=\"datainp inp1 fl calendar\" ng-model = 'query.presentDateEnd' type=\"text\" placeholder=\"结束日期\" readonly>\r\n\t                    </td>\r\n\t                </tr>-->\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">机构类型：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.partnerType\" ng-options = \"option.typeCode as option.typeName for option in baseSelectData.partnerTypeList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">机构名称：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.partnerCode\" ng-options = \"option.partnerCode as option.partnerName for option in baseSelectData.partnerList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\"> 关键字：</td>\r\n\t                    <td class=\"fl search\">\r\n\t                        <input type=\"text\"  placeholder=\"apiCode\" ng-model=\"query.apiCode\" id=\"search\"/>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t\t\t\t\t\t<td class=\"tl-r\"></td>\r\n\t\t\t\t\t\t<td class=\"fl search\">\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"searchStart()\">查 询</div>\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"clearSearch()\">清 空</div>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t            </table>\r\n\t            <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                        <table class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\">\r\n\t                            <tr>\r\n\t                                <th>\r\n\t                                \t创建日期\r\n\t                                \t<div class=\"sortWrap\">\r\n\t                                \t\t<div class=\"sortTimeTop\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"asc\"})'></div>\r\n\t                                \t\t<div class=\"sortTimeBottom\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"desc\"})'></div>\r\n\t                                \t</div>\r\n\t                                </th>\r\n\t                                <th>机构名称</th>\r\n\t                                <th>机构类型</th>\r\n\t                            \t<th>放款总额（万）</th>\r\n\t                                <th>保证金额度（万）</th>\r\n\t                                <th>机构管理员</th>\r\n\t                                <th>apiCode</th>\r\n\t                                <th>操作</th>\r\n\t                            </tr>\r\n\t                            <tr ng-repeat=\"item in loanMenInfo\">\r\n\t                                <td ng-bind=\"item.modifyTime.time|timeDateFilter\"></td>\r\n\t                                <td ng-bind=\"item.partnerName\"></td>\r\n\t                                <td ng-bind=\"item.partnerType|partnerType\"></td>\r\n\t                                <td ng-bind=\"item.totalLoans\"></td>\r\n\t                                <td ng-bind=\"item.fineMoney\"></td>\r\n\t                                <td ng-bind=\"item.partnerAdminName\"></td>\r\n\t                                <td ng-bind=\"item.apiCode\"></td>\r\n\t                                <td>\r\n\t                                \t<a href=\"javascript:void(0)\" class=\"mlr5\" ng-click = \"upload(item)\">上传</a>\r\n\t                                \t<a href=\"javascript:void(0)\" class=\"mlr5\" ng-click = \"downLoad(item)\">下载</a>\r\n\t                                \t<a href=\"javascript:void(0)\" class=\"mlr5\" ng-click = \"edit(item)\">编辑</a>\r\n\t                                \t<a href=\"javascript:void(0)\" ng-click = \"viewDetail(item)\">查看</a>\r\n\t                                \t<!--<a href=\"javascript:void(0)\" class=\"mlr5\" ng-click = \"isFreeze(item)\" ng-bind = \"item.isCooperation|isFreeze\"></a>-->\r\n\t                                </td>\r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class=\"ft clearfix yeshu\" ng-style=\"{visibility:showPage}\">\r\n\t\t\t            <div class=\"fl ft-lf\">\r\n\t\t\t                                共 <span ng-bind=\"count\"></span>条 每页显示\r\n\t\t\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\">\r\n\t\t\t                </select>\r\n\t\t\t                </div>\r\n\t\t\t                <div class=\"fr ft-rt\">\r\n\t\t\t                    <div class=\"page clearfix\">\r\n\t\t\t                        <span page></span>\r\n\t\t\t                    </div>\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t    <div>\r\n\t   \t    <div id=\"report-template-mask\" ng-style=\"{display:dialog.show ? 'block' : 'none'}\"></div>\r\n\t    \t<div class=\"successList2\" ng-style = \"{display:dialog.show ? 'block' : 'none'}\">\r\n\t\t        <div class=\"col-md-11\" style=\"padding-top: 80px\">\r\n\t\t\t\t\t<div>\r\n\t\t\t\t\t\t<input class=\"upLoadInfo\" name=\"file\" readonly=\"readonly\" ng-model = \"uploader.queue[0].file.name\" type=\"text\" placeholder=\"上传附件格式（.zip）\"/>\r\n\t\t\t\t\t\t<div class=\"upLoadWrapper\">\r\n\t\t\t\t\t\t\t<span style=\"position: absolute; left: 36px; top: -27px;\">选择文件</span>\r\n\t\t\t\t\t\t\t<input type=\"file\" class=\"upLoadInp\" nv-file-select=\"\" uploader=\"uploader\" />\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t            <div>\r\n\t\t                <div class=\"progress\" ng-show = \"uploader.queue[0].file.name\" style=\"margin-bottom: 48px;\">\r\n\t\t                    <div class=\"progress-bar\" role=\"progressbar\" ng-style=\"{ 'width': uploader.progress + '%' }\">{{uploader.progress}}%</div>\r\n\t\t                </div>\r\n\t\t                <button type=\"button\" class=\"btn btn-success btn-s mlr30\" ng-click=\"uploader.uploadAll(upLoadParam)\" ng-disabled=\"!uploader.getNotUploadedItems().length\">\r\n\t\t                   \t 上传       \t  \r\n\t\t                </button>\r\n\t\t                <button type=\"button\" class=\"btn btn-danger btn-s mlr30\" ng-click=\"uploader.clearQueue(dialog)\">\r\n\t\t             \t\t关闭\r\n\t\t                </button>\r\n\t\t            </div>\r\n\t\t        </div>\r\n\t    \t</div>\r\n\t    </div>\r\n\t</div>\r\n</div>\r\n\t\r\n\t\t"

/***/ }

});