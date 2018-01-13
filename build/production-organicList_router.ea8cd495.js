webpackJsonp([17],{

/***/ 159:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(160)(_jquery2.default);
	var dependArr = [__webpack_require__(168).default.name, __webpack_require__(169).name];
	exports.default = {
	  module: angular.module('organicListCtrl', dependArr).controller('organicListController', ['$scope', 'organicListService', '$state', '$timeout', 'FileUploader', 'util', controller]),
	  template: __webpack_require__(170)
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

/***/ 160:
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Bootstrap v3.3.6 (http://getbootstrap.com)
	 * Copyright 2011-2015 Twitter, Inc.
	 * Licensed under the MIT license
	 */
	__webpack_require__(161);
	__webpack_require__(163);
	__webpack_require__(167);
	__webpack_require__(166);
	__webpack_require__(165);
	__webpack_require__(164);

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

/***/ 161:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(162);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(162, function() {
				var newContent = __webpack_require__(162);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 162:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/*!\r\n * Bootstrap v3.3.6 (http://getbootstrap.com)\r\n * Copyright 2011-2015 Twitter, Inc.\r\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\r\n */\r\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\r\nhtml {\r\n  font-family: sans-serif;\r\n  -webkit-text-size-adjust: 100%;\r\n      -ms-text-size-adjust: 100%;\r\n}\r\nbody {\r\n  margin: 0;\r\n}\r\narticle,\r\naside,\r\ndetails,\r\nfigcaption,\r\nfigure,\r\nfooter,\r\nheader,\r\nhgroup,\r\nmain,\r\nmenu,\r\nnav,\r\nsection,\r\nsummary {\r\n  display: block;\r\n}\r\naudio,\r\ncanvas,\r\nprogress,\r\nvideo {\r\n  display: inline-block;\r\n  vertical-align: baseline;\r\n}\r\naudio:not([controls]) {\r\n  display: none;\r\n  height: 0;\r\n}\r\n[hidden],\r\ntemplate {\r\n  display: none;\r\n}\r\na {\r\n  background-color: transparent;\r\n}\r\na:active,\r\na:hover {\r\n  outline: 0;\r\n}\r\nabbr[title] {\r\n  border-bottom: 1px dotted;\r\n}\r\nb,\r\nstrong {\r\n  font-weight: bold;\r\n}\r\ndfn {\r\n  font-style: italic;\r\n}\r\nh1 {\r\n  margin: .67em 0;\r\n  font-size: 2em;\r\n}\r\nmark {\r\n  color: #000;\r\n  background: #ff0;\r\n}\r\nsmall {\r\n  font-size: 80%;\r\n}\r\nsub,\r\nsup {\r\n  position: relative;\r\n  font-size: 75%;\r\n  line-height: 0;\r\n  vertical-align: baseline;\r\n}\r\nsup {\r\n  top: -.5em;\r\n}\r\nsub {\r\n  bottom: -.25em;\r\n}\r\nimg {\r\n  border: 0;\r\n}\r\nsvg:not(:root) {\r\n  overflow: hidden;\r\n}\r\nfigure {\r\n  margin: 1em 40px;\r\n}\r\npre {\r\n  overflow: auto;\r\n}\r\ncode,\r\nkbd,\r\npre,\r\nsamp {\r\n  font-family: monospace, monospace;\r\n  font-size: 1em;\r\n}\r\nbutton,\r\ninput,\r\noptgroup,\r\nselect,\r\ntextarea {\r\n  margin: 0;\r\n  font: inherit;\r\n  color: inherit;\r\n}\r\nbutton {\r\n  overflow: visible;\r\n}\r\nbutton,\r\nselect {\r\n  text-transform: none;\r\n}\r\nbutton,\r\nhtml input[type=\"button\"],\r\ninput[type=\"reset\"],\r\ninput[type=\"submit\"] {\r\n  -webkit-appearance: button;\r\n  cursor: pointer;\r\n}\r\nbutton[disabled],\r\nhtml input[disabled] {\r\n  cursor: default;\r\n}\r\nbutton::-moz-focus-inner,\r\ninput::-moz-focus-inner {\r\n  padding: 0;\r\n  border: 0;\r\n}\r\ninput {\r\n  line-height: normal;\r\n}\r\ninput[type=\"checkbox\"],\r\ninput[type=\"radio\"] {\r\n  -webkit-box-sizing: border-box;\r\n     -moz-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n  padding: 0;\r\n}\r\ninput[type=\"number\"]::-webkit-inner-spin-button,\r\ninput[type=\"number\"]::-webkit-outer-spin-button {\r\n  height: auto;\r\n}\r\ninput[type=\"search\"] {\r\n  -webkit-box-sizing: content-box;\r\n     -moz-box-sizing: content-box;\r\n          box-sizing: content-box;\r\n  -webkit-appearance: textfield;\r\n}\r\ninput[type=\"search\"]::-webkit-search-cancel-button,\r\ninput[type=\"search\"]::-webkit-search-decoration {\r\n  -webkit-appearance: none;\r\n}\r\nfieldset {\r\n  padding: .35em .625em .75em;\r\n  margin: 0 2px;\r\n  border: 1px solid #c0c0c0;\r\n}\r\nlegend {\r\n  padding: 0;\r\n  border: 0;\r\n}\r\ntextarea {\r\n  overflow: auto;\r\n}\r\noptgroup {\r\n  font-weight: bold;\r\n}\r\ntable {\r\n  border-spacing: 0;\r\n  border-collapse: collapse;\r\n}\r\ntd,\r\nth {\r\n  padding: 0;\r\n}\r\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\r\n@media print {\r\n  *,\r\n  *:before,\r\n  *:after {\r\n    color: #000 !important;\r\n    text-shadow: none !important;\r\n    background: transparent !important;\r\n    -webkit-box-shadow: none !important;\r\n            box-shadow: none !important;\r\n  }\r\n  a,\r\n  a:visited {\r\n    text-decoration: underline;\r\n  }\r\n  a[href]:after {\r\n    content: \" (\" attr(href) \")\";\r\n  }\r\n  abbr[title]:after {\r\n    content: \" (\" attr(title) \")\";\r\n  }\r\n  a[href^=\"#\"]:after,\r\n  a[href^=\"javascript:\"]:after {\r\n    content: \"\";\r\n  }\r\n  pre,\r\n  blockquote {\r\n    border: 1px solid #999;\r\n\r\n    page-break-inside: avoid;\r\n  }\r\n  thead {\r\n    display: table-header-group;\r\n  }\r\n  tr,\r\n  img {\r\n    page-break-inside: avoid;\r\n  }\r\n  img {\r\n    max-width: 100% !important;\r\n  }\r\n  p,\r\n  h2,\r\n  h3 {\r\n    orphans: 3;\r\n    widows: 3;\r\n  }\r\n  h2,\r\n  h3 {\r\n    page-break-after: avoid;\r\n  }\r\n  .navbar {\r\n    display: none;\r\n  }\r\n  .btn > .caret,\r\n  .dropup > .btn > .caret {\r\n    border-top-color: #000 !important;\r\n  }\r\n  .label {\r\n    border: 1px solid #000;\r\n  }\r\n  .table {\r\n    border-collapse: collapse !important;\r\n  }\r\n  .table td,\r\n  .table th {\r\n    background-color: #fff !important;\r\n  }\r\n  .table-bordered th,\r\n  .table-bordered td {\r\n    border: 1px solid #ddd !important;\r\n  }\r\n}\r\n@font-face {\r\n  font-family: 'Glyphicons Halflings';\r\n\r\n  src: url(" + __webpack_require__(163) + ");\r\n  src: url(" + __webpack_require__(163) + "?#iefix) format('embedded-opentype'), url(" + __webpack_require__(164) + ") format('woff2'), url(" + __webpack_require__(165) + ") format('woff'), url(" + __webpack_require__(166) + ") format('truetype'), url(" + __webpack_require__(167) + "#glyphicons_halflingsregular) format('svg');\r\n}\r\n.glyphicon {\r\n  position: relative;\r\n  top: 1px;\r\n  display: inline-block;\r\n  font-family: 'Glyphicons Halflings';\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  line-height: 1;\r\n\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n.glyphicon-asterisk:before {\r\n  content: \"*\";\r\n}\r\n.glyphicon-plus:before {\r\n  content: \"+\";\r\n}\r\n.glyphicon-euro:before,\r\n.glyphicon-eur:before {\r\n  content: \"\\20AC\";\r\n}\r\n.glyphicon-minus:before {\r\n  content: \"\\2212\";\r\n}\r\n.glyphicon-cloud:before {\r\n  content: \"\\2601\";\r\n}\r\n.glyphicon-envelope:before {\r\n  content: \"\\2709\";\r\n}\r\n.glyphicon-pencil:before {\r\n  content: \"\\270F\";\r\n}\r\n.glyphicon-glass:before {\r\n  content: \"\\E001\";\r\n}\r\n.glyphicon-music:before {\r\n  content: \"\\E002\";\r\n}\r\n.glyphicon-search:before {\r\n  content: \"\\E003\";\r\n}\r\n.glyphicon-heart:before {\r\n  content: \"\\E005\";\r\n}\r\n.glyphicon-star:before {\r\n  content: \"\\E006\";\r\n}\r\n.glyphicon-star-empty:before {\r\n  content: \"\\E007\";\r\n}\r\n.glyphicon-user:before {\r\n  content: \"\\E008\";\r\n}\r\n.glyphicon-film:before {\r\n  content: \"\\E009\";\r\n}\r\n.glyphicon-th-large:before {\r\n  content: \"\\E010\";\r\n}\r\n.glyphicon-th:before {\r\n  content: \"\\E011\";\r\n}\r\n.glyphicon-th-list:before {\r\n  content: \"\\E012\";\r\n}\r\n.glyphicon-ok:before {\r\n  content: \"\\E013\";\r\n}\r\n.glyphicon-remove:before {\r\n  content: \"\\E014\";\r\n}\r\n.glyphicon-zoom-in:before {\r\n  content: \"\\E015\";\r\n}\r\n.glyphicon-zoom-out:before {\r\n  content: \"\\E016\";\r\n}\r\n.glyphicon-off:before {\r\n  content: \"\\E017\";\r\n}\r\n.glyphicon-signal:before {\r\n  content: \"\\E018\";\r\n}\r\n.glyphicon-cog:before {\r\n  content: \"\\E019\";\r\n}\r\n.glyphicon-trash:before {\r\n  content: \"\\E020\";\r\n}\r\n.glyphicon-home:before {\r\n  content: \"\\E021\";\r\n}\r\n.glyphicon-file:before {\r\n  content: \"\\E022\";\r\n}\r\n.glyphicon-time:before {\r\n  content: \"\\E023\";\r\n}\r\n.glyphicon-road:before {\r\n  content: \"\\E024\";\r\n}\r\n.glyphicon-download-alt:before {\r\n  content: \"\\E025\";\r\n}\r\n.glyphicon-download:before {\r\n  content: \"\\E026\";\r\n}\r\n.glyphicon-upload:before {\r\n  content: \"\\E027\";\r\n}\r\n.glyphicon-inbox:before {\r\n  content: \"\\E028\";\r\n}\r\n.glyphicon-play-circle:before {\r\n  content: \"\\E029\";\r\n}\r\n.glyphicon-repeat:before {\r\n  content: \"\\E030\";\r\n}\r\n.glyphicon-refresh:before {\r\n  content: \"\\E031\";\r\n}\r\n.glyphicon-list-alt:before {\r\n  content: \"\\E032\";\r\n}\r\n.glyphicon-lock:before {\r\n  content: \"\\E033\";\r\n}\r\n.glyphicon-flag:before {\r\n  content: \"\\E034\";\r\n}\r\n.glyphicon-headphones:before {\r\n  content: \"\\E035\";\r\n}\r\n.glyphicon-volume-off:before {\r\n  content: \"\\E036\";\r\n}\r\n.glyphicon-volume-down:before {\r\n  content: \"\\E037\";\r\n}\r\n.glyphicon-volume-up:before {\r\n  content: \"\\E038\";\r\n}\r\n.glyphicon-qrcode:before {\r\n  content: \"\\E039\";\r\n}\r\n.glyphicon-barcode:before {\r\n  content: \"\\E040\";\r\n}\r\n.glyphicon-tag:before {\r\n  content: \"\\E041\";\r\n}\r\n.glyphicon-tags:before {\r\n  content: \"\\E042\";\r\n}\r\n.glyphicon-book:before {\r\n  content: \"\\E043\";\r\n}\r\n.glyphicon-bookmark:before {\r\n  content: \"\\E044\";\r\n}\r\n.glyphicon-print:before {\r\n  content: \"\\E045\";\r\n}\r\n.glyphicon-camera:before {\r\n  content: \"\\E046\";\r\n}\r\n.glyphicon-font:before {\r\n  content: \"\\E047\";\r\n}\r\n.glyphicon-bold:before {\r\n  content: \"\\E048\";\r\n}\r\n.glyphicon-italic:before {\r\n  content: \"\\E049\";\r\n}\r\n.glyphicon-text-height:before {\r\n  content: \"\\E050\";\r\n}\r\n.glyphicon-text-width:before {\r\n  content: \"\\E051\";\r\n}\r\n.glyphicon-align-left:before {\r\n  content: \"\\E052\";\r\n}\r\n.glyphicon-align-center:before {\r\n  content: \"\\E053\";\r\n}\r\n.glyphicon-align-right:before {\r\n  content: \"\\E054\";\r\n}\r\n.glyphicon-align-justify:before {\r\n  content: \"\\E055\";\r\n}\r\n.glyphicon-list:before {\r\n  content: \"\\E056\";\r\n}\r\n.glyphicon-indent-left:before {\r\n  content: \"\\E057\";\r\n}\r\n.glyphicon-indent-right:before {\r\n  content: \"\\E058\";\r\n}\r\n.glyphicon-facetime-video:before {\r\n  content: \"\\E059\";\r\n}\r\n.glyphicon-picture:before {\r\n  content: \"\\E060\";\r\n}\r\n.glyphicon-map-marker:before {\r\n  content: \"\\E062\";\r\n}\r\n.glyphicon-adjust:before {\r\n  content: \"\\E063\";\r\n}\r\n.glyphicon-tint:before {\r\n  content: \"\\E064\";\r\n}\r\n.glyphicon-edit:before {\r\n  content: \"\\E065\";\r\n}\r\n.glyphicon-share:before {\r\n  content: \"\\E066\";\r\n}\r\n.glyphicon-check:before {\r\n  content: \"\\E067\";\r\n}\r\n.glyphicon-move:before {\r\n  content: \"\\E068\";\r\n}\r\n.glyphicon-step-backward:before {\r\n  content: \"\\E069\";\r\n}\r\n.glyphicon-fast-backward:before {\r\n  content: \"\\E070\";\r\n}\r\n.glyphicon-backward:before {\r\n  content: \"\\E071\";\r\n}\r\n.glyphicon-play:before {\r\n  content: \"\\E072\";\r\n}\r\n.glyphicon-pause:before {\r\n  content: \"\\E073\";\r\n}\r\n.glyphicon-stop:before {\r\n  content: \"\\E074\";\r\n}\r\n.glyphicon-forward:before {\r\n  content: \"\\E075\";\r\n}\r\n.glyphicon-fast-forward:before {\r\n  content: \"\\E076\";\r\n}\r\n.glyphicon-step-forward:before {\r\n  content: \"\\E077\";\r\n}\r\n.glyphicon-eject:before {\r\n  content: \"\\E078\";\r\n}\r\n.glyphicon-chevron-left:before {\r\n  content: \"\\E079\";\r\n}\r\n.glyphicon-chevron-right:before {\r\n  content: \"\\E080\";\r\n}\r\n.glyphicon-plus-sign:before {\r\n  content: \"\\E081\";\r\n}\r\n.glyphicon-minus-sign:before {\r\n  content: \"\\E082\";\r\n}\r\n.glyphicon-remove-sign:before {\r\n  content: \"\\E083\";\r\n}\r\n.glyphicon-ok-sign:before {\r\n  content: \"\\E084\";\r\n}\r\n.glyphicon-question-sign:before {\r\n  content: \"\\E085\";\r\n}\r\n.glyphicon-info-sign:before {\r\n  content: \"\\E086\";\r\n}\r\n.glyphicon-screenshot:before {\r\n  content: \"\\E087\";\r\n}\r\n.glyphicon-remove-circle:before {\r\n  content: \"\\E088\";\r\n}\r\n.glyphicon-ok-circle:before {\r\n  content: \"\\E089\";\r\n}\r\n.glyphicon-ban-circle:before {\r\n  content: \"\\E090\";\r\n}\r\n.glyphicon-arrow-left:before {\r\n  content: \"\\E091\";\r\n}\r\n.glyphicon-arrow-right:before {\r\n  content: \"\\E092\";\r\n}\r\n.glyphicon-arrow-up:before {\r\n  content: \"\\E093\";\r\n}\r\n.glyphicon-arrow-down:before {\r\n  content: \"\\E094\";\r\n}\r\n.glyphicon-share-alt:before {\r\n  content: \"\\E095\";\r\n}\r\n.glyphicon-resize-full:before {\r\n  content: \"\\E096\";\r\n}\r\n.glyphicon-resize-small:before {\r\n  content: \"\\E097\";\r\n}\r\n.glyphicon-exclamation-sign:before {\r\n  content: \"\\E101\";\r\n}\r\n.glyphicon-gift:before {\r\n  content: \"\\E102\";\r\n}\r\n.glyphicon-leaf:before {\r\n  content: \"\\E103\";\r\n}\r\n.glyphicon-fire:before {\r\n  content: \"\\E104\";\r\n}\r\n.glyphicon-eye-open:before {\r\n  content: \"\\E105\";\r\n}\r\n.glyphicon-eye-close:before {\r\n  content: \"\\E106\";\r\n}\r\n.glyphicon-warning-sign:before {\r\n  content: \"\\E107\";\r\n}\r\n.glyphicon-plane:before {\r\n  content: \"\\E108\";\r\n}\r\n.glyphicon-calendar:before {\r\n  content: \"\\E109\";\r\n}\r\n.glyphicon-random:before {\r\n  content: \"\\E110\";\r\n}\r\n.glyphicon-comment:before {\r\n  content: \"\\E111\";\r\n}\r\n.glyphicon-magnet:before {\r\n  content: \"\\E112\";\r\n}\r\n.glyphicon-chevron-up:before {\r\n  content: \"\\E113\";\r\n}\r\n.glyphicon-chevron-down:before {\r\n  content: \"\\E114\";\r\n}\r\n.glyphicon-retweet:before {\r\n  content: \"\\E115\";\r\n}\r\n.glyphicon-shopping-cart:before {\r\n  content: \"\\E116\";\r\n}\r\n.glyphicon-folder-close:before {\r\n  content: \"\\E117\";\r\n}\r\n.glyphicon-folder-open:before {\r\n  content: \"\\E118\";\r\n}\r\n.glyphicon-resize-vertical:before {\r\n  content: \"\\E119\";\r\n}\r\n.glyphicon-resize-horizontal:before {\r\n  content: \"\\E120\";\r\n}\r\n.glyphicon-hdd:before {\r\n  content: \"\\E121\";\r\n}\r\n.glyphicon-bullhorn:before {\r\n  content: \"\\E122\";\r\n}\r\n.glyphicon-bell:before {\r\n  content: \"\\E123\";\r\n}\r\n.glyphicon-certificate:before {\r\n  content: \"\\E124\";\r\n}\r\n.glyphicon-thumbs-up:before {\r\n  content: \"\\E125\";\r\n}\r\n.glyphicon-thumbs-down:before {\r\n  content: \"\\E126\";\r\n}\r\n.glyphicon-hand-right:before {\r\n  content: \"\\E127\";\r\n}\r\n.glyphicon-hand-left:before {\r\n  content: \"\\E128\";\r\n}\r\n.glyphicon-hand-up:before {\r\n  content: \"\\E129\";\r\n}\r\n.glyphicon-hand-down:before {\r\n  content: \"\\E130\";\r\n}\r\n.glyphicon-circle-arrow-right:before {\r\n  content: \"\\E131\";\r\n}\r\n.glyphicon-circle-arrow-left:before {\r\n  content: \"\\E132\";\r\n}\r\n.glyphicon-circle-arrow-up:before {\r\n  content: \"\\E133\";\r\n}\r\n.glyphicon-circle-arrow-down:before {\r\n  content: \"\\E134\";\r\n}\r\n.glyphicon-globe:before {\r\n  content: \"\\E135\";\r\n}\r\n.glyphicon-wrench:before {\r\n  content: \"\\E136\";\r\n}\r\n.glyphicon-tasks:before {\r\n  content: \"\\E137\";\r\n}\r\n.glyphicon-filter:before {\r\n  content: \"\\E138\";\r\n}\r\n.glyphicon-briefcase:before {\r\n  content: \"\\E139\";\r\n}\r\n.glyphicon-fullscreen:before {\r\n  content: \"\\E140\";\r\n}\r\n.glyphicon-dashboard:before {\r\n  content: \"\\E141\";\r\n}\r\n.glyphicon-paperclip:before {\r\n  content: \"\\E142\";\r\n}\r\n.glyphicon-heart-empty:before {\r\n  content: \"\\E143\";\r\n}\r\n.glyphicon-link:before {\r\n  content: \"\\E144\";\r\n}\r\n.glyphicon-phone:before {\r\n  content: \"\\E145\";\r\n}\r\n.glyphicon-pushpin:before {\r\n  content: \"\\E146\";\r\n}\r\n.glyphicon-usd:before {\r\n  content: \"\\E148\";\r\n}\r\n.glyphicon-gbp:before {\r\n  content: \"\\E149\";\r\n}\r\n.glyphicon-sort:before {\r\n  content: \"\\E150\";\r\n}\r\n.glyphicon-sort-by-alphabet:before {\r\n  content: \"\\E151\";\r\n}\r\n.glyphicon-sort-by-alphabet-alt:before {\r\n  content: \"\\E152\";\r\n}\r\n.glyphicon-sort-by-order:before {\r\n  content: \"\\E153\";\r\n}\r\n.glyphicon-sort-by-order-alt:before {\r\n  content: \"\\E154\";\r\n}\r\n.glyphicon-sort-by-attributes:before {\r\n  content: \"\\E155\";\r\n}\r\n.glyphicon-sort-by-attributes-alt:before {\r\n  content: \"\\E156\";\r\n}\r\n.glyphicon-unchecked:before {\r\n  content: \"\\E157\";\r\n}\r\n.glyphicon-expand:before {\r\n  content: \"\\E158\";\r\n}\r\n.glyphicon-collapse-down:before {\r\n  content: \"\\E159\";\r\n}\r\n.glyphicon-collapse-up:before {\r\n  content: \"\\E160\";\r\n}\r\n.glyphicon-log-in:before {\r\n  content: \"\\E161\";\r\n}\r\n.glyphicon-flash:before {\r\n  content: \"\\E162\";\r\n}\r\n.glyphicon-log-out:before {\r\n  content: \"\\E163\";\r\n}\r\n.glyphicon-new-window:before {\r\n  content: \"\\E164\";\r\n}\r\n.glyphicon-record:before {\r\n  content: \"\\E165\";\r\n}\r\n.glyphicon-save:before {\r\n  content: \"\\E166\";\r\n}\r\n.glyphicon-open:before {\r\n  content: \"\\E167\";\r\n}\r\n.glyphicon-saved:before {\r\n  content: \"\\E168\";\r\n}\r\n.glyphicon-import:before {\r\n  content: \"\\E169\";\r\n}\r\n.glyphicon-export:before {\r\n  content: \"\\E170\";\r\n}\r\n.glyphicon-send:before {\r\n  content: \"\\E171\";\r\n}\r\n.glyphicon-floppy-disk:before {\r\n  content: \"\\E172\";\r\n}\r\n.glyphicon-floppy-saved:before {\r\n  content: \"\\E173\";\r\n}\r\n.glyphicon-floppy-remove:before {\r\n  content: \"\\E174\";\r\n}\r\n.glyphicon-floppy-save:before {\r\n  content: \"\\E175\";\r\n}\r\n.glyphicon-floppy-open:before {\r\n  content: \"\\E176\";\r\n}\r\n.glyphicon-credit-card:before {\r\n  content: \"\\E177\";\r\n}\r\n.glyphicon-transfer:before {\r\n  content: \"\\E178\";\r\n}\r\n.glyphicon-cutlery:before {\r\n  content: \"\\E179\";\r\n}\r\n.glyphicon-header:before {\r\n  content: \"\\E180\";\r\n}\r\n.glyphicon-compressed:before {\r\n  content: \"\\E181\";\r\n}\r\n.glyphicon-earphone:before {\r\n  content: \"\\E182\";\r\n}\r\n.glyphicon-phone-alt:before {\r\n  content: \"\\E183\";\r\n}\r\n.glyphicon-tower:before {\r\n  content: \"\\E184\";\r\n}\r\n.glyphicon-stats:before {\r\n  content: \"\\E185\";\r\n}\r\n.glyphicon-sd-video:before {\r\n  content: \"\\E186\";\r\n}\r\n.glyphicon-hd-video:before {\r\n  content: \"\\E187\";\r\n}\r\n.glyphicon-subtitles:before {\r\n  content: \"\\E188\";\r\n}\r\n.glyphicon-sound-stereo:before {\r\n  content: \"\\E189\";\r\n}\r\n.glyphicon-sound-dolby:before {\r\n  content: \"\\E190\";\r\n}\r\n.glyphicon-sound-5-1:before {\r\n  content: \"\\E191\";\r\n}\r\n.glyphicon-sound-6-1:before {\r\n  content: \"\\E192\";\r\n}\r\n.glyphicon-sound-7-1:before {\r\n  content: \"\\E193\";\r\n}\r\n.glyphicon-copyright-mark:before {\r\n  content: \"\\E194\";\r\n}\r\n.glyphicon-registration-mark:before {\r\n  content: \"\\E195\";\r\n}\r\n.glyphicon-cloud-download:before {\r\n  content: \"\\E197\";\r\n}\r\n.glyphicon-cloud-upload:before {\r\n  content: \"\\E198\";\r\n}\r\n.glyphicon-tree-conifer:before {\r\n  content: \"\\E199\";\r\n}\r\n.glyphicon-tree-deciduous:before {\r\n  content: \"\\E200\";\r\n}\r\n.glyphicon-cd:before {\r\n  content: \"\\E201\";\r\n}\r\n.glyphicon-save-file:before {\r\n  content: \"\\E202\";\r\n}\r\n.glyphicon-open-file:before {\r\n  content: \"\\E203\";\r\n}\r\n.glyphicon-level-up:before {\r\n  content: \"\\E204\";\r\n}\r\n.glyphicon-copy:before {\r\n  content: \"\\E205\";\r\n}\r\n.glyphicon-paste:before {\r\n  content: \"\\E206\";\r\n}\r\n.glyphicon-alert:before {\r\n  content: \"\\E209\";\r\n}\r\n.glyphicon-equalizer:before {\r\n  content: \"\\E210\";\r\n}\r\n.glyphicon-king:before {\r\n  content: \"\\E211\";\r\n}\r\n.glyphicon-queen:before {\r\n  content: \"\\E212\";\r\n}\r\n.glyphicon-pawn:before {\r\n  content: \"\\E213\";\r\n}\r\n.glyphicon-bishop:before {\r\n  content: \"\\E214\";\r\n}\r\n.glyphicon-knight:before {\r\n  content: \"\\E215\";\r\n}\r\n.glyphicon-baby-formula:before {\r\n  content: \"\\E216\";\r\n}\r\n.glyphicon-tent:before {\r\n  content: \"\\26FA\";\r\n}\r\n.glyphicon-blackboard:before {\r\n  content: \"\\E218\";\r\n}\r\n.glyphicon-bed:before {\r\n  content: \"\\E219\";\r\n}\r\n.glyphicon-apple:before {\r\n  content: \"\\F8FF\";\r\n}\r\n.glyphicon-erase:before {\r\n  content: \"\\E221\";\r\n}\r\n.glyphicon-hourglass:before {\r\n  content: \"\\231B\";\r\n}\r\n.glyphicon-lamp:before {\r\n  content: \"\\E223\";\r\n}\r\n.glyphicon-duplicate:before {\r\n  content: \"\\E224\";\r\n}\r\n.glyphicon-piggy-bank:before {\r\n  content: \"\\E225\";\r\n}\r\n.glyphicon-scissors:before {\r\n  content: \"\\E226\";\r\n}\r\n.glyphicon-bitcoin:before {\r\n  content: \"\\E227\";\r\n}\r\n.glyphicon-btc:before {\r\n  content: \"\\E227\";\r\n}\r\n.glyphicon-xbt:before {\r\n  content: \"\\E227\";\r\n}\r\n.glyphicon-yen:before {\r\n  content: \"\\A5\";\r\n}\r\n.glyphicon-jpy:before {\r\n  content: \"\\A5\";\r\n}\r\n.glyphicon-ruble:before {\r\n  content: \"\\20BD\";\r\n}\r\n.glyphicon-rub:before {\r\n  content: \"\\20BD\";\r\n}\r\n.glyphicon-scale:before {\r\n  content: \"\\E230\";\r\n}\r\n.glyphicon-ice-lolly:before {\r\n  content: \"\\E231\";\r\n}\r\n.glyphicon-ice-lolly-tasted:before {\r\n  content: \"\\E232\";\r\n}\r\n.glyphicon-education:before {\r\n  content: \"\\E233\";\r\n}\r\n.glyphicon-option-horizontal:before {\r\n  content: \"\\E234\";\r\n}\r\n.glyphicon-option-vertical:before {\r\n  content: \"\\E235\";\r\n}\r\n.glyphicon-menu-hamburger:before {\r\n  content: \"\\E236\";\r\n}\r\n.glyphicon-modal-window:before {\r\n  content: \"\\E237\";\r\n}\r\n.glyphicon-oil:before {\r\n  content: \"\\E238\";\r\n}\r\n.glyphicon-grain:before {\r\n  content: \"\\E239\";\r\n}\r\n.glyphicon-sunglasses:before {\r\n  content: \"\\E240\";\r\n}\r\n.glyphicon-text-size:before {\r\n  content: \"\\E241\";\r\n}\r\n.glyphicon-text-color:before {\r\n  content: \"\\E242\";\r\n}\r\n.glyphicon-text-background:before {\r\n  content: \"\\E243\";\r\n}\r\n.glyphicon-object-align-top:before {\r\n  content: \"\\E244\";\r\n}\r\n.glyphicon-object-align-bottom:before {\r\n  content: \"\\E245\";\r\n}\r\n.glyphicon-object-align-horizontal:before {\r\n  content: \"\\E246\";\r\n}\r\n.glyphicon-object-align-left:before {\r\n  content: \"\\E247\";\r\n}\r\n.glyphicon-object-align-vertical:before {\r\n  content: \"\\E248\";\r\n}\r\n.glyphicon-object-align-right:before {\r\n  content: \"\\E249\";\r\n}\r\n.glyphicon-triangle-right:before {\r\n  content: \"\\E250\";\r\n}\r\n.glyphicon-triangle-left:before {\r\n  content: \"\\E251\";\r\n}\r\n.glyphicon-triangle-bottom:before {\r\n  content: \"\\E252\";\r\n}\r\n.glyphicon-triangle-top:before {\r\n  content: \"\\E253\";\r\n}\r\n.glyphicon-console:before {\r\n  content: \"\\E254\";\r\n}\r\n.glyphicon-superscript:before {\r\n  content: \"\\E255\";\r\n}\r\n.glyphicon-subscript:before {\r\n  content: \"\\E256\";\r\n}\r\n.glyphicon-menu-left:before {\r\n  content: \"\\E257\";\r\n}\r\n.glyphicon-menu-right:before {\r\n  content: \"\\E258\";\r\n}\r\n.glyphicon-menu-down:before {\r\n  content: \"\\E259\";\r\n}\r\n.glyphicon-menu-up:before {\r\n  content: \"\\E260\";\r\n}\r\nhtml {\r\n  font-size: 10px;\r\n\r\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n}\r\nbody {\r\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n  font-size: 14px;\r\n  line-height: 1.42857143;\r\n  color: #333;\r\n  background-color: #fff;\r\n}\r\ninput,\r\nbutton,\r\nselect,\r\ntextarea {\r\n  font-family: inherit;\r\n  font-size: inherit;\r\n  line-height: inherit;\r\n}\r\na {\r\n  color: #337ab7;\r\n  text-decoration: none;\r\n}\r\na:hover,\r\na:focus {\r\n  color: #23527c;\r\n  text-decoration: underline;\r\n}\r\na:focus {\r\n  outline: thin dotted;\r\n  outline: 5px auto -webkit-focus-ring-color;\r\n  outline-offset: -2px;\r\n}\r\nfigure {\r\n  margin: 0;\r\n}\r\nimg {\r\n  vertical-align: middle;\r\n}\r\n.img-responsive,\r\n.thumbnail > img,\r\n.thumbnail a > img,\r\n.carousel-inner > .item > img,\r\n.carousel-inner > .item > a > img {\r\n  display: block;\r\n  max-width: 100%;\r\n  height: auto;\r\n}\r\n.img-rounded {\r\n  border-radius: 6px;\r\n}\r\n.img-thumbnail {\r\n  display: inline-block;\r\n  max-width: 100%;\r\n  height: auto;\r\n  padding: 4px;\r\n  line-height: 1.42857143;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n  border-radius: 4px;\r\n  -webkit-transition: all .2s ease-in-out;\r\n       -o-transition: all .2s ease-in-out;\r\n          transition: all .2s ease-in-out;\r\n}\r\n.img-circle {\r\n  border-radius: 50%;\r\n}\r\nhr {\r\n  margin-top: 20px;\r\n  margin-bottom: 20px;\r\n  border: 0;\r\n  border-top: 1px solid #eee;\r\n}\r\n.sr-only {\r\n  position: absolute;\r\n  width: 1px;\r\n  height: 1px;\r\n  padding: 0;\r\n  margin: -1px;\r\n  overflow: hidden;\r\n  clip: rect(0, 0, 0, 0);\r\n  border: 0;\r\n}\r\n.sr-only-focusable:active,\r\n.sr-only-focusable:focus {\r\n  position: static;\r\n  width: auto;\r\n  height: auto;\r\n  margin: 0;\r\n  overflow: visible;\r\n  clip: auto;\r\n}\r\n[role=\"button\"] {\r\n  cursor: pointer;\r\n}\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\n.h1,\r\n.h2,\r\n.h3,\r\n.h4,\r\n.h5,\r\n.h6 {\r\n  font-family: inherit;\r\n  font-weight: 500;\r\n  line-height: 1.1;\r\n  color: inherit;\r\n}\r\nh1 small,\r\nh2 small,\r\nh3 small,\r\nh4 small,\r\nh5 small,\r\nh6 small,\r\n.h1 small,\r\n.h2 small,\r\n.h3 small,\r\n.h4 small,\r\n.h5 small,\r\n.h6 small,\r\nh1 .small,\r\nh2 .small,\r\nh3 .small,\r\nh4 .small,\r\nh5 .small,\r\nh6 .small,\r\n.h1 .small,\r\n.h2 .small,\r\n.h3 .small,\r\n.h4 .small,\r\n.h5 .small,\r\n.h6 .small {\r\n  font-weight: normal;\r\n  line-height: 1;\r\n  color: #777;\r\n}\r\nh1,\r\n.h1,\r\nh2,\r\n.h2,\r\nh3,\r\n.h3 {\r\n  margin-top: 20px;\r\n  margin-bottom: 10px;\r\n}\r\nh1 small,\r\n.h1 small,\r\nh2 small,\r\n.h2 small,\r\nh3 small,\r\n.h3 small,\r\nh1 .small,\r\n.h1 .small,\r\nh2 .small,\r\n.h2 .small,\r\nh3 .small,\r\n.h3 .small {\r\n  font-size: 65%;\r\n}\r\nh4,\r\n.h4,\r\nh5,\r\n.h5,\r\nh6,\r\n.h6 {\r\n  margin-top: 10px;\r\n  margin-bottom: 10px;\r\n}\r\nh4 small,\r\n.h4 small,\r\nh5 small,\r\n.h5 small,\r\nh6 small,\r\n.h6 small,\r\nh4 .small,\r\n.h4 .small,\r\nh5 .small,\r\n.h5 .small,\r\nh6 .small,\r\n.h6 .small {\r\n  font-size: 75%;\r\n}\r\nh1,\r\n.h1 {\r\n  font-size: 36px;\r\n}\r\nh2,\r\n.h2 {\r\n  font-size: 30px;\r\n}\r\nh3,\r\n.h3 {\r\n  font-size: 24px;\r\n}\r\nh4,\r\n.h4 {\r\n  font-size: 18px;\r\n}\r\nh5,\r\n.h5 {\r\n  font-size: 14px;\r\n}\r\nh6,\r\n.h6 {\r\n  font-size: 12px;\r\n}\r\np {\r\n  margin: 0 0 10px;\r\n}\r\n.lead {\r\n  margin-bottom: 20px;\r\n  font-size: 16px;\r\n  font-weight: 300;\r\n  line-height: 1.4;\r\n}\r\n@media (min-width: 768px) {\r\n  .lead {\r\n    font-size: 21px;\r\n  }\r\n}\r\nsmall,\r\n.small {\r\n  font-size: 85%;\r\n}\r\nmark,\r\n.mark {\r\n  padding: .2em;\r\n  background-color: #fcf8e3;\r\n}\r\n.text-left {\r\n  text-align: left;\r\n}\r\n.text-right {\r\n  text-align: right;\r\n}\r\n.text-center {\r\n  text-align: center;\r\n}\r\n.text-justify {\r\n  text-align: justify;\r\n}\r\n.text-nowrap {\r\n  white-space: nowrap;\r\n}\r\n.text-lowercase {\r\n  text-transform: lowercase;\r\n}\r\n.text-uppercase {\r\n  text-transform: uppercase;\r\n}\r\n.text-capitalize {\r\n  text-transform: capitalize;\r\n}\r\n.text-muted {\r\n  color: #777;\r\n}\r\n.text-primary {\r\n  color: #337ab7;\r\n}\r\na.text-primary:hover,\r\na.text-primary:focus {\r\n  color: #286090;\r\n}\r\n.text-success {\r\n  color: #3c763d;\r\n}\r\na.text-success:hover,\r\na.text-success:focus {\r\n  color: #2b542c;\r\n}\r\n.text-info {\r\n  color: #31708f;\r\n}\r\na.text-info:hover,\r\na.text-info:focus {\r\n  color: #245269;\r\n}\r\n.text-warning {\r\n  color: #8a6d3b;\r\n}\r\na.text-warning:hover,\r\na.text-warning:focus {\r\n  color: #66512c;\r\n}\r\n.text-danger {\r\n  color: #a94442;\r\n}\r\na.text-danger:hover,\r\na.text-danger:focus {\r\n  color: #843534;\r\n}\r\n.bg-primary {\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n}\r\na.bg-primary:hover,\r\na.bg-primary:focus {\r\n  background-color: #286090;\r\n}\r\n.bg-success {\r\n  background-color: #dff0d8;\r\n}\r\na.bg-success:hover,\r\na.bg-success:focus {\r\n  background-color: #c1e2b3;\r\n}\r\n.bg-info {\r\n  background-color: #d9edf7;\r\n}\r\na.bg-info:hover,\r\na.bg-info:focus {\r\n  background-color: #afd9ee;\r\n}\r\n.bg-warning {\r\n  background-color: #fcf8e3;\r\n}\r\na.bg-warning:hover,\r\na.bg-warning:focus {\r\n  background-color: #f7ecb5;\r\n}\r\n.bg-danger {\r\n  background-color: #f2dede;\r\n}\r\na.bg-danger:hover,\r\na.bg-danger:focus {\r\n  background-color: #e4b9b9;\r\n}\r\n.page-header {\r\n  padding-bottom: 9px;\r\n  margin: 40px 0 20px;\r\n  border-bottom: 1px solid #eee;\r\n}\r\nul,\r\nol {\r\n  margin-top: 0;\r\n  margin-bottom: 10px;\r\n}\r\nul ul,\r\nol ul,\r\nul ol,\r\nol ol {\r\n  margin-bottom: 0;\r\n}\r\n.list-unstyled {\r\n  padding-left: 0;\r\n  list-style: none;\r\n}\r\n.list-inline {\r\n  padding-left: 0;\r\n  margin-left: -5px;\r\n  list-style: none;\r\n}\r\n.list-inline > li {\r\n  display: inline-block;\r\n  padding-right: 5px;\r\n  padding-left: 5px;\r\n}\r\ndl {\r\n  margin-top: 0;\r\n  margin-bottom: 20px;\r\n}\r\ndt,\r\ndd {\r\n  line-height: 1.42857143;\r\n}\r\ndt {\r\n  font-weight: bold;\r\n}\r\ndd {\r\n  margin-left: 0;\r\n}\r\n@media (min-width: 768px) {\r\n  .dl-horizontal dt {\r\n    float: left;\r\n    width: 160px;\r\n    overflow: hidden;\r\n    clear: left;\r\n    text-align: right;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n  }\r\n  .dl-horizontal dd {\r\n    margin-left: 180px;\r\n  }\r\n}\r\nabbr[title],\r\nabbr[data-original-title] {\r\n  cursor: help;\r\n  border-bottom: 1px dotted #777;\r\n}\r\n.initialism {\r\n  font-size: 90%;\r\n  text-transform: uppercase;\r\n}\r\nblockquote {\r\n  padding: 10px 20px;\r\n  margin: 0 0 20px;\r\n  font-size: 17.5px;\r\n  border-left: 5px solid #eee;\r\n}\r\nblockquote p:last-child,\r\nblockquote ul:last-child,\r\nblockquote ol:last-child {\r\n  margin-bottom: 0;\r\n}\r\nblockquote footer,\r\nblockquote small,\r\nblockquote .small {\r\n  display: block;\r\n  font-size: 80%;\r\n  line-height: 1.42857143;\r\n  color: #777;\r\n}\r\nblockquote footer:before,\r\nblockquote small:before,\r\nblockquote .small:before {\r\n  content: '\\2014   \\A0';\r\n}\r\n.blockquote-reverse,\r\nblockquote.pull-right {\r\n  padding-right: 15px;\r\n  padding-left: 0;\r\n  text-align: right;\r\n  border-right: 5px solid #eee;\r\n  border-left: 0;\r\n}\r\n.blockquote-reverse footer:before,\r\nblockquote.pull-right footer:before,\r\n.blockquote-reverse small:before,\r\nblockquote.pull-right small:before,\r\n.blockquote-reverse .small:before,\r\nblockquote.pull-right .small:before {\r\n  content: '';\r\n}\r\n.blockquote-reverse footer:after,\r\nblockquote.pull-right footer:after,\r\n.blockquote-reverse small:after,\r\nblockquote.pull-right small:after,\r\n.blockquote-reverse .small:after,\r\nblockquote.pull-right .small:after {\r\n  content: '\\A0   \\2014';\r\n}\r\naddress {\r\n  margin-bottom: 20px;\r\n  font-style: normal;\r\n  line-height: 1.42857143;\r\n}\r\ncode,\r\nkbd,\r\npre,\r\nsamp {\r\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace;\r\n}\r\ncode {\r\n  padding: 2px 4px;\r\n  font-size: 90%;\r\n  color: #c7254e;\r\n  background-color: #f9f2f4;\r\n  border-radius: 4px;\r\n}\r\nkbd {\r\n  padding: 2px 4px;\r\n  font-size: 90%;\r\n  color: #fff;\r\n  background-color: #333;\r\n  border-radius: 3px;\r\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .25);\r\n          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .25);\r\n}\r\nkbd kbd {\r\n  padding: 0;\r\n  font-size: 100%;\r\n  font-weight: bold;\r\n  -webkit-box-shadow: none;\r\n          box-shadow: none;\r\n}\r\npre {\r\n  display: block;\r\n  padding: 9.5px;\r\n  margin: 0 0 10px;\r\n  font-size: 13px;\r\n  line-height: 1.42857143;\r\n  color: #333;\r\n  word-break: break-all;\r\n  word-wrap: break-word;\r\n  background-color: #f5f5f5;\r\n  border: 1px solid #ccc;\r\n  border-radius: 4px;\r\n}\r\npre code {\r\n  padding: 0;\r\n  font-size: inherit;\r\n  color: inherit;\r\n  white-space: pre-wrap;\r\n  background-color: transparent;\r\n  border-radius: 0;\r\n}\r\n.pre-scrollable {\r\n  max-height: 340px;\r\n  overflow-y: scroll;\r\n}\r\n.container {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n}\r\n@media (min-width: 768px) {\r\n  .container {\r\n    width: 750px;\r\n  }\r\n}\r\n@media (min-width: 992px) {\r\n  .container {\r\n    width: 970px;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .container {\r\n    width: 1170px;\r\n  }\r\n}\r\n.container-fluid {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n}\r\n.row {\r\n  margin-right: -15px;\r\n  margin-left: -15px;\r\n}\r\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\r\n  position: relative;\r\n  min-height: 1px;\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n}\r\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\r\n  float: left;\r\n}\r\n.col-xs-12 {\r\n  width: 100%;\r\n}\r\n.col-xs-11 {\r\n  width: 91.66666667%;\r\n}\r\n.col-xs-10 {\r\n  width: 83.33333333%;\r\n}\r\n.col-xs-9 {\r\n  width: 75%;\r\n}\r\n.col-xs-8 {\r\n  width: 66.66666667%;\r\n}\r\n.col-xs-7 {\r\n  width: 58.33333333%;\r\n}\r\n.col-xs-6 {\r\n  width: 50%;\r\n}\r\n.col-xs-5 {\r\n  width: 41.66666667%;\r\n}\r\n.col-xs-4 {\r\n  width: 33.33333333%;\r\n}\r\n.col-xs-3 {\r\n  width: 25%;\r\n}\r\n.col-xs-2 {\r\n  width: 16.66666667%;\r\n}\r\n.col-xs-1 {\r\n  width: 8.33333333%;\r\n}\r\n.col-xs-pull-12 {\r\n  right: 100%;\r\n}\r\n.col-xs-pull-11 {\r\n  right: 91.66666667%;\r\n}\r\n.col-xs-pull-10 {\r\n  right: 83.33333333%;\r\n}\r\n.col-xs-pull-9 {\r\n  right: 75%;\r\n}\r\n.col-xs-pull-8 {\r\n  right: 66.66666667%;\r\n}\r\n.col-xs-pull-7 {\r\n  right: 58.33333333%;\r\n}\r\n.col-xs-pull-6 {\r\n  right: 50%;\r\n}\r\n.col-xs-pull-5 {\r\n  right: 41.66666667%;\r\n}\r\n.col-xs-pull-4 {\r\n  right: 33.33333333%;\r\n}\r\n.col-xs-pull-3 {\r\n  right: 25%;\r\n}\r\n.col-xs-pull-2 {\r\n  right: 16.66666667%;\r\n}\r\n.col-xs-pull-1 {\r\n  right: 8.33333333%;\r\n}\r\n.col-xs-pull-0 {\r\n  right: auto;\r\n}\r\n.col-xs-push-12 {\r\n  left: 100%;\r\n}\r\n.col-xs-push-11 {\r\n  left: 91.66666667%;\r\n}\r\n.col-xs-push-10 {\r\n  left: 83.33333333%;\r\n}\r\n.col-xs-push-9 {\r\n  left: 75%;\r\n}\r\n.col-xs-push-8 {\r\n  left: 66.66666667%;\r\n}\r\n.col-xs-push-7 {\r\n  left: 58.33333333%;\r\n}\r\n.col-xs-push-6 {\r\n  left: 50%;\r\n}\r\n.col-xs-push-5 {\r\n  left: 41.66666667%;\r\n}\r\n.col-xs-push-4 {\r\n  left: 33.33333333%;\r\n}\r\n.col-xs-push-3 {\r\n  left: 25%;\r\n}\r\n.col-xs-push-2 {\r\n  left: 16.66666667%;\r\n}\r\n.col-xs-push-1 {\r\n  left: 8.33333333%;\r\n}\r\n.col-xs-push-0 {\r\n  left: auto;\r\n}\r\n.col-xs-offset-12 {\r\n  margin-left: 100%;\r\n}\r\n.col-xs-offset-11 {\r\n  margin-left: 91.66666667%;\r\n}\r\n.col-xs-offset-10 {\r\n  margin-left: 83.33333333%;\r\n}\r\n.col-xs-offset-9 {\r\n  margin-left: 75%;\r\n}\r\n.col-xs-offset-8 {\r\n  margin-left: 66.66666667%;\r\n}\r\n.col-xs-offset-7 {\r\n  margin-left: 58.33333333%;\r\n}\r\n.col-xs-offset-6 {\r\n  margin-left: 50%;\r\n}\r\n.col-xs-offset-5 {\r\n  margin-left: 41.66666667%;\r\n}\r\n.col-xs-offset-4 {\r\n  margin-left: 33.33333333%;\r\n}\r\n.col-xs-offset-3 {\r\n  margin-left: 25%;\r\n}\r\n.col-xs-offset-2 {\r\n  margin-left: 16.66666667%;\r\n}\r\n.col-xs-offset-1 {\r\n  margin-left: 8.33333333%;\r\n}\r\n.col-xs-offset-0 {\r\n  margin-left: 0;\r\n}\r\n@media (min-width: 768px) {\r\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\r\n    float: left;\r\n  }\r\n  .col-sm-12 {\r\n    width: 100%;\r\n  }\r\n  .col-sm-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  .col-sm-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  .col-sm-9 {\r\n    width: 75%;\r\n  }\r\n  .col-sm-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  .col-sm-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  .col-sm-6 {\r\n    width: 50%;\r\n  }\r\n  .col-sm-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  .col-sm-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  .col-sm-3 {\r\n    width: 25%;\r\n  }\r\n  .col-sm-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  .col-sm-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  .col-sm-pull-12 {\r\n    right: 100%;\r\n  }\r\n  .col-sm-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  .col-sm-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  .col-sm-pull-9 {\r\n    right: 75%;\r\n  }\r\n  .col-sm-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  .col-sm-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  .col-sm-pull-6 {\r\n    right: 50%;\r\n  }\r\n  .col-sm-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  .col-sm-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  .col-sm-pull-3 {\r\n    right: 25%;\r\n  }\r\n  .col-sm-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  .col-sm-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  .col-sm-pull-0 {\r\n    right: auto;\r\n  }\r\n  .col-sm-push-12 {\r\n    left: 100%;\r\n  }\r\n  .col-sm-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  .col-sm-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  .col-sm-push-9 {\r\n    left: 75%;\r\n  }\r\n  .col-sm-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  .col-sm-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  .col-sm-push-6 {\r\n    left: 50%;\r\n  }\r\n  .col-sm-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  .col-sm-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  .col-sm-push-3 {\r\n    left: 25%;\r\n  }\r\n  .col-sm-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  .col-sm-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  .col-sm-push-0 {\r\n    left: auto;\r\n  }\r\n  .col-sm-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  .col-sm-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  .col-sm-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  .col-sm-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  .col-sm-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  .col-sm-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  .col-sm-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  .col-sm-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  .col-sm-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  .col-sm-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  .col-sm-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  .col-sm-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  .col-sm-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n}\r\n@media (min-width: 992px) {\r\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\r\n    float: left;\r\n  }\r\n  .col-md-12 {\r\n    width: 100%;\r\n  }\r\n  .col-md-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  .col-md-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  .col-md-9 {\r\n    width: 75%;\r\n  }\r\n  .col-md-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  .col-md-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  .col-md-6 {\r\n    width: 50%;\r\n  }\r\n  .col-md-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  .col-md-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  .col-md-3 {\r\n    width: 25%;\r\n  }\r\n  .col-md-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  .col-md-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  .col-md-pull-12 {\r\n    right: 100%;\r\n  }\r\n  .col-md-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  .col-md-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  .col-md-pull-9 {\r\n    right: 75%;\r\n  }\r\n  .col-md-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  .col-md-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  .col-md-pull-6 {\r\n    right: 50%;\r\n  }\r\n  .col-md-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  .col-md-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  .col-md-pull-3 {\r\n    right: 25%;\r\n  }\r\n  .col-md-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  .col-md-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  .col-md-pull-0 {\r\n    right: auto;\r\n  }\r\n  .col-md-push-12 {\r\n    left: 100%;\r\n  }\r\n  .col-md-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  .col-md-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  .col-md-push-9 {\r\n    left: 75%;\r\n  }\r\n  .col-md-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  .col-md-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  .col-md-push-6 {\r\n    left: 50%;\r\n  }\r\n  .col-md-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  .col-md-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  .col-md-push-3 {\r\n    left: 25%;\r\n  }\r\n  .col-md-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  .col-md-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  .col-md-push-0 {\r\n    left: auto;\r\n  }\r\n  .col-md-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  .col-md-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  .col-md-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  .col-md-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  .col-md-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  .col-md-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  .col-md-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  .col-md-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  .col-md-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  .col-md-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  .col-md-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  .col-md-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  .col-md-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\r\n    float: left;\r\n  }\r\n  .col-lg-12 {\r\n    width: 100%;\r\n  }\r\n  .col-lg-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  .col-lg-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  .col-lg-9 {\r\n    width: 75%;\r\n  }\r\n  .col-lg-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  .col-lg-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  .col-lg-6 {\r\n    width: 50%;\r\n  }\r\n  .col-lg-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  .col-lg-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  .col-lg-3 {\r\n    width: 25%;\r\n  }\r\n  .col-lg-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  .col-lg-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  .col-lg-pull-12 {\r\n    right: 100%;\r\n  }\r\n  .col-lg-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  .col-lg-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  .col-lg-pull-9 {\r\n    right: 75%;\r\n  }\r\n  .col-lg-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  .col-lg-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  .col-lg-pull-6 {\r\n    right: 50%;\r\n  }\r\n  .col-lg-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  .col-lg-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  .col-lg-pull-3 {\r\n    right: 25%;\r\n  }\r\n  .col-lg-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  .col-lg-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  .col-lg-pull-0 {\r\n    right: auto;\r\n  }\r\n  .col-lg-push-12 {\r\n    left: 100%;\r\n  }\r\n  .col-lg-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  .col-lg-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  .col-lg-push-9 {\r\n    left: 75%;\r\n  }\r\n  .col-lg-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  .col-lg-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  .col-lg-push-6 {\r\n    left: 50%;\r\n  }\r\n  .col-lg-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  .col-lg-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  .col-lg-push-3 {\r\n    left: 25%;\r\n  }\r\n  .col-lg-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  .col-lg-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  .col-lg-push-0 {\r\n    left: auto;\r\n  }\r\n  .col-lg-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  .col-lg-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  .col-lg-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  .col-lg-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  .col-lg-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  .col-lg-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  .col-lg-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  .col-lg-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  .col-lg-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  .col-lg-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  .col-lg-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  .col-lg-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  .col-lg-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n}\r\ntable {\r\n  background-color: transparent;\r\n}\r\ncaption {\r\n  padding-top: 8px;\r\n  padding-bottom: 8px;\r\n  color: #777;\r\n  text-align: left;\r\n}\r\nth {\r\n  text-align: left;\r\n}\r\n.table {\r\n  width: 100%;\r\n  max-width: 100%;\r\n  margin-bottom: 20px;\r\n}\r\n.table > thead > tr > th,\r\n.table > tbody > tr > th,\r\n.table > tfoot > tr > th,\r\n.table > thead > tr > td,\r\n.table > tbody > tr > td,\r\n.table > tfoot > tr > td {\r\n  padding: 8px;\r\n  line-height: 1.42857143;\r\n  vertical-align: top;\r\n  border-top: 1px solid #ddd;\r\n}\r\n.table > thead > tr > th {\r\n  vertical-align: bottom;\r\n  border-bottom: 2px solid #ddd;\r\n}\r\n.table > caption + thead > tr:first-child > th,\r\n.table > colgroup + thead > tr:first-child > th,\r\n.table > thead:first-child > tr:first-child > th,\r\n.table > caption + thead > tr:first-child > td,\r\n.table > colgroup + thead > tr:first-child > td,\r\n.table > thead:first-child > tr:first-child > td {\r\n  border-top: 0;\r\n}\r\n.table > tbody + tbody {\r\n  border-top: 2px solid #ddd;\r\n}\r\n.table .table {\r\n  background-color: #fff;\r\n}\r\n.table-condensed > thead > tr > th,\r\n.table-condensed > tbody > tr > th,\r\n.table-condensed > tfoot > tr > th,\r\n.table-condensed > thead > tr > td,\r\n.table-condensed > tbody > tr > td,\r\n.table-condensed > tfoot > tr > td {\r\n  padding: 5px;\r\n}\r\n.table-bordered {\r\n  border: 1px solid #ddd;\r\n}\r\n.table-bordered > thead > tr > th,\r\n.table-bordered > tbody > tr > th,\r\n.table-bordered > tfoot > tr > th,\r\n.table-bordered > thead > tr > td,\r\n.table-bordered > tbody > tr > td,\r\n.table-bordered > tfoot > tr > td {\r\n  border: 1px solid #ddd;\r\n}\r\n.table-bordered > thead > tr > th,\r\n.table-bordered > thead > tr > td {\r\n  border-bottom-width: 2px;\r\n}\r\n.table-striped > tbody > tr:nth-of-type(odd) {\r\n  background-color: #f9f9f9;\r\n}\r\n.table-hover > tbody > tr:hover {\r\n  background-color: #f5f5f5;\r\n}\r\ntable col[class*=\"col-\"] {\r\n  position: static;\r\n  display: table-column;\r\n  float: none;\r\n}\r\ntable td[class*=\"col-\"],\r\ntable th[class*=\"col-\"] {\r\n  position: static;\r\n  display: table-cell;\r\n  float: none;\r\n}\r\n.table > thead > tr > td.active,\r\n.table > tbody > tr > td.active,\r\n.table > tfoot > tr > td.active,\r\n.table > thead > tr > th.active,\r\n.table > tbody > tr > th.active,\r\n.table > tfoot > tr > th.active,\r\n.table > thead > tr.active > td,\r\n.table > tbody > tr.active > td,\r\n.table > tfoot > tr.active > td,\r\n.table > thead > tr.active > th,\r\n.table > tbody > tr.active > th,\r\n.table > tfoot > tr.active > th {\r\n  background-color: #f5f5f5;\r\n}\r\n.table-hover > tbody > tr > td.active:hover,\r\n.table-hover > tbody > tr > th.active:hover,\r\n.table-hover > tbody > tr.active:hover > td,\r\n.table-hover > tbody > tr:hover > .active,\r\n.table-hover > tbody > tr.active:hover > th {\r\n  background-color: #e8e8e8;\r\n}\r\n.table > thead > tr > td.success,\r\n.table > tbody > tr > td.success,\r\n.table > tfoot > tr > td.success,\r\n.table > thead > tr > th.success,\r\n.table > tbody > tr > th.success,\r\n.table > tfoot > tr > th.success,\r\n.table > thead > tr.success > td,\r\n.table > tbody > tr.success > td,\r\n.table > tfoot > tr.success > td,\r\n.table > thead > tr.success > th,\r\n.table > tbody > tr.success > th,\r\n.table > tfoot > tr.success > th {\r\n  background-color: #dff0d8;\r\n}\r\n.table-hover > tbody > tr > td.success:hover,\r\n.table-hover > tbody > tr > th.success:hover,\r\n.table-hover > tbody > tr.success:hover > td,\r\n.table-hover > tbody > tr:hover > .success,\r\n.table-hover > tbody > tr.success:hover > th {\r\n  background-color: #d0e9c6;\r\n}\r\n.table > thead > tr > td.info,\r\n.table > tbody > tr > td.info,\r\n.table > tfoot > tr > td.info,\r\n.table > thead > tr > th.info,\r\n.table > tbody > tr > th.info,\r\n.table > tfoot > tr > th.info,\r\n.table > thead > tr.info > td,\r\n.table > tbody > tr.info > td,\r\n.table > tfoot > tr.info > td,\r\n.table > thead > tr.info > th,\r\n.table > tbody > tr.info > th,\r\n.table > tfoot > tr.info > th {\r\n  background-color: #d9edf7;\r\n}\r\n.table-hover > tbody > tr > td.info:hover,\r\n.table-hover > tbody > tr > th.info:hover,\r\n.table-hover > tbody > tr.info:hover > td,\r\n.table-hover > tbody > tr:hover > .info,\r\n.table-hover > tbody > tr.info:hover > th {\r\n  background-color: #c4e3f3;\r\n}\r\n.table > thead > tr > td.warning,\r\n.table > tbody > tr > td.warning,\r\n.table > tfoot > tr > td.warning,\r\n.table > thead > tr > th.warning,\r\n.table > tbody > tr > th.warning,\r\n.table > tfoot > tr > th.warning,\r\n.table > thead > tr.warning > td,\r\n.table > tbody > tr.warning > td,\r\n.table > tfoot > tr.warning > td,\r\n.table > thead > tr.warning > th,\r\n.table > tbody > tr.warning > th,\r\n.table > tfoot > tr.warning > th {\r\n  background-color: #fcf8e3;\r\n}\r\n.table-hover > tbody > tr > td.warning:hover,\r\n.table-hover > tbody > tr > th.warning:hover,\r\n.table-hover > tbody > tr.warning:hover > td,\r\n.table-hover > tbody > tr:hover > .warning,\r\n.table-hover > tbody > tr.warning:hover > th {\r\n  background-color: #faf2cc;\r\n}\r\n.table > thead > tr > td.danger,\r\n.table > tbody > tr > td.danger,\r\n.table > tfoot > tr > td.danger,\r\n.table > thead > tr > th.danger,\r\n.table > tbody > tr > th.danger,\r\n.table > tfoot > tr > th.danger,\r\n.table > thead > tr.danger > td,\r\n.table > tbody > tr.danger > td,\r\n.table > tfoot > tr.danger > td,\r\n.table > thead > tr.danger > th,\r\n.table > tbody > tr.danger > th,\r\n.table > tfoot > tr.danger > th {\r\n  background-color: #f2dede;\r\n}\r\n.table-hover > tbody > tr > td.danger:hover,\r\n.table-hover > tbody > tr > th.danger:hover,\r\n.table-hover > tbody > tr.danger:hover > td,\r\n.table-hover > tbody > tr:hover > .danger,\r\n.table-hover > tbody > tr.danger:hover > th {\r\n  background-color: #ebcccc;\r\n}\r\n.table-responsive {\r\n  min-height: .01%;\r\n  overflow-x: auto;\r\n}\r\n@media screen and (max-width: 767px) {\r\n  .table-responsive {\r\n    width: 100%;\r\n    margin-bottom: 15px;\r\n    overflow-y: hidden;\r\n    -ms-overflow-style: -ms-autohiding-scrollbar;\r\n    border: 1px solid #ddd;\r\n  }\r\n  .table-responsive > .table {\r\n    margin-bottom: 0;\r\n  }\r\n  .table-responsive > .table > thead > tr > th,\r\n  .table-responsive > .table > tbody > tr > th,\r\n  .table-responsive > .table > tfoot > tr > th,\r\n  .table-responsive > .table > thead > tr > td,\r\n  .table-responsive > .table > tbody > tr > td,\r\n  .table-responsive > .table > tfoot > tr > td {\r\n    white-space: nowrap;\r\n  }\r\n  .table-responsive > .table-bordered {\r\n    border: 0;\r\n  }\r\n  .table-responsive > .table-bordered > thead > tr > th:first-child,\r\n  .table-responsive > .table-bordered > tbody > tr > th:first-child,\r\n  .table-responsive > .table-bordered > tfoot > tr > th:first-child,\r\n  .table-responsive > .table-bordered > thead > tr > td:first-child,\r\n  .table-responsive > .table-bordered > tbody > tr > td:first-child,\r\n  .table-responsive > .table-bordered > tfoot > tr > td:first-child {\r\n    border-left: 0;\r\n  }\r\n  .table-responsive > .table-bordered > thead > tr > th:last-child,\r\n  .table-responsive > .table-bordered > tbody > tr > th:last-child,\r\n  .table-responsive > .table-bordered > tfoot > tr > th:last-child,\r\n  .table-responsive > .table-bordered > thead > tr > td:last-child,\r\n  .table-responsive > .table-bordered > tbody > tr > td:last-child,\r\n  .table-responsive > .table-bordered > tfoot > tr > td:last-child {\r\n    border-right: 0;\r\n  }\r\n  .table-responsive > .table-bordered > tbody > tr:last-child > th,\r\n  .table-responsive > .table-bordered > tfoot > tr:last-child > th,\r\n  .table-responsive > .table-bordered > tbody > tr:last-child > td,\r\n  .table-responsive > .table-bordered > tfoot > tr:last-child > td {\r\n    border-bottom: 0;\r\n  }\r\n}\r\nfieldset {\r\n  min-width: 0;\r\n  padding: 0;\r\n  margin: 0;\r\n  border: 0;\r\n}\r\nlegend {\r\n  display: block;\r\n  width: 100%;\r\n  padding: 0;\r\n  margin-bottom: 20px;\r\n  font-size: 21px;\r\n  line-height: inherit;\r\n  color: #333;\r\n  border: 0;\r\n  border-bottom: 1px solid #e5e5e5;\r\n}\r\nlabel {\r\n  display: inline-block;\r\n  /*max-width: 100%;\r\n  margin-bottom: 5px;\r\n  font-weight: bold;*/\r\n}\r\ninput[type=\"search\"] {\r\n  -webkit-box-sizing: border-box;\r\n     -moz-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}\r\ninput[type=\"radio\"],\r\ninput[type=\"checkbox\"] {\r\n  margin: 4px 0 0;\r\n  margin-top: 1px \\9;\r\n  line-height: normal;\r\n}\r\ninput[type=\"file\"] {\r\n  display: block;\r\n}\r\ninput[type=\"range\"] {\r\n  display: block;\r\n  width: 100%;\r\n}\r\nselect[multiple],\r\nselect[size] {\r\n  height: auto;\r\n}\r\ninput[type=\"file\"]:focus,\r\ninput[type=\"radio\"]:focus,\r\ninput[type=\"checkbox\"]:focus {\r\n  outline: thin dotted;\r\n  outline: 5px auto -webkit-focus-ring-color;\r\n  outline-offset: -2px;\r\n}\r\noutput {\r\n  display: block;\r\n  padding-top: 7px;\r\n  font-size: 14px;\r\n  line-height: 1.42857143;\r\n  color: #555;\r\n}\r\n.form-control {\r\n  display: block;\r\n  width: 100%;\r\n  height: 34px;\r\n  padding: 6px 12px;\r\n  font-size: 14px;\r\n  line-height: 1.42857143;\r\n  color: #555;\r\n  background-color: #fff;\r\n  background-image: none;\r\n  border: 1px solid #ccc;\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n  -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;\r\n       -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\r\n          transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\r\n}\r\n.form-control:focus {\r\n  border-color: #66afe9;\r\n  outline: 0;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);\r\n          box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);\r\n}\r\n.form-control::-moz-placeholder {\r\n  color: #999;\r\n  opacity: 1;\r\n}\r\n.form-control:-ms-input-placeholder {\r\n  color: #999;\r\n}\r\n.form-control::-webkit-input-placeholder {\r\n  color: #999;\r\n}\r\n.form-control::-ms-expand {\r\n  background-color: transparent;\r\n  border: 0;\r\n}\r\n.form-control[disabled],\r\n.form-control[readonly],\r\nfieldset[disabled] .form-control {\r\n  background-color: #eee;\r\n  opacity: 1;\r\n}\r\n.form-control[disabled],\r\nfieldset[disabled] .form-control {\r\n  cursor: not-allowed;\r\n}\r\ntextarea.form-control {\r\n  height: auto;\r\n}\r\ninput[type=\"search\"] {\r\n  -webkit-appearance: none;\r\n}\r\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\r\n  input[type=\"date\"].form-control,\r\n  input[type=\"time\"].form-control,\r\n  input[type=\"datetime-local\"].form-control,\r\n  input[type=\"month\"].form-control {\r\n    line-height: 34px;\r\n  }\r\n  input[type=\"date\"].input-sm,\r\n  input[type=\"time\"].input-sm,\r\n  input[type=\"datetime-local\"].input-sm,\r\n  input[type=\"month\"].input-sm,\r\n  .input-group-sm input[type=\"date\"],\r\n  .input-group-sm input[type=\"time\"],\r\n  .input-group-sm input[type=\"datetime-local\"],\r\n  .input-group-sm input[type=\"month\"] {\r\n    line-height: 30px;\r\n  }\r\n  input[type=\"date\"].input-lg,\r\n  input[type=\"time\"].input-lg,\r\n  input[type=\"datetime-local\"].input-lg,\r\n  input[type=\"month\"].input-lg,\r\n  .input-group-lg input[type=\"date\"],\r\n  .input-group-lg input[type=\"time\"],\r\n  .input-group-lg input[type=\"datetime-local\"],\r\n  .input-group-lg input[type=\"month\"] {\r\n    line-height: 46px;\r\n  }\r\n}\r\n.form-group {\r\n  margin-bottom: 15px;\r\n}\r\n.radio,\r\n.checkbox {\r\n  position: relative;\r\n  display: block;\r\n  margin-top: 10px;\r\n  margin-bottom: 10px;\r\n}\r\n.radio label,\r\n.checkbox label {\r\n  min-height: 20px;\r\n  padding-left: 20px;\r\n  margin-bottom: 0;\r\n  font-weight: normal;\r\n  cursor: pointer;\r\n}\r\n.radio input[type=\"radio\"],\r\n.radio-inline input[type=\"radio\"],\r\n.checkbox input[type=\"checkbox\"],\r\n.checkbox-inline input[type=\"checkbox\"] {\r\n  position: absolute;\r\n  margin-top: 4px \\9;\r\n  margin-left: -20px;\r\n}\r\n.radio + .radio,\r\n.checkbox + .checkbox {\r\n  margin-top: -5px;\r\n}\r\n.radio-inline,\r\n.checkbox-inline {\r\n  position: relative;\r\n  display: inline-block;\r\n  padding-left: 20px;\r\n  margin-bottom: 0;\r\n  font-weight: normal;\r\n  vertical-align: middle;\r\n  cursor: pointer;\r\n}\r\n.radio-inline + .radio-inline,\r\n.checkbox-inline + .checkbox-inline {\r\n  margin-top: 0;\r\n  margin-left: 10px;\r\n}\r\ninput[type=\"radio\"][disabled],\r\ninput[type=\"checkbox\"][disabled],\r\ninput[type=\"radio\"].disabled,\r\ninput[type=\"checkbox\"].disabled,\r\nfieldset[disabled] input[type=\"radio\"],\r\nfieldset[disabled] input[type=\"checkbox\"] {\r\n  cursor: not-allowed;\r\n}\r\n.radio-inline.disabled,\r\n.checkbox-inline.disabled,\r\nfieldset[disabled] .radio-inline,\r\nfieldset[disabled] .checkbox-inline {\r\n  cursor: not-allowed;\r\n}\r\n.radio.disabled label,\r\n.checkbox.disabled label,\r\nfieldset[disabled] .radio label,\r\nfieldset[disabled] .checkbox label {\r\n  cursor: not-allowed;\r\n}\r\n.form-control-static {\r\n  min-height: 34px;\r\n  padding-top: 7px;\r\n  padding-bottom: 7px;\r\n  margin-bottom: 0;\r\n}\r\n.form-control-static.input-lg,\r\n.form-control-static.input-sm {\r\n  padding-right: 0;\r\n  padding-left: 0;\r\n}\r\n.input-sm {\r\n  height: 30px;\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\nselect.input-sm {\r\n  height: 30px;\r\n  line-height: 30px;\r\n}\r\ntextarea.input-sm,\r\nselect[multiple].input-sm {\r\n  height: auto;\r\n}\r\n.form-group-sm .form-control {\r\n  height: 30px;\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\n.form-group-sm select.form-control {\r\n  height: 30px;\r\n  line-height: 30px;\r\n}\r\n.form-group-sm textarea.form-control,\r\n.form-group-sm select[multiple].form-control {\r\n  height: auto;\r\n}\r\n.form-group-sm .form-control-static {\r\n  height: 30px;\r\n  min-height: 32px;\r\n  padding: 6px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n}\r\n.input-lg {\r\n  height: 46px;\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n  border-radius: 6px;\r\n}\r\nselect.input-lg {\r\n  height: 46px;\r\n  line-height: 46px;\r\n}\r\ntextarea.input-lg,\r\nselect[multiple].input-lg {\r\n  height: auto;\r\n}\r\n.form-group-lg .form-control {\r\n  height: 46px;\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n  border-radius: 6px;\r\n}\r\n.form-group-lg select.form-control {\r\n  height: 46px;\r\n  line-height: 46px;\r\n}\r\n.form-group-lg textarea.form-control,\r\n.form-group-lg select[multiple].form-control {\r\n  height: auto;\r\n}\r\n.form-group-lg .form-control-static {\r\n  height: 46px;\r\n  min-height: 38px;\r\n  padding: 11px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n}\r\n.has-feedback {\r\n  position: relative;\r\n}\r\n.has-feedback .form-control {\r\n  padding-right: 42.5px;\r\n}\r\n.form-control-feedback {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  z-index: 2;\r\n  display: block;\r\n  width: 34px;\r\n  height: 34px;\r\n  line-height: 34px;\r\n  text-align: center;\r\n  pointer-events: none;\r\n}\r\n.input-lg + .form-control-feedback,\r\n.input-group-lg + .form-control-feedback,\r\n.form-group-lg .form-control + .form-control-feedback {\r\n  width: 46px;\r\n  height: 46px;\r\n  line-height: 46px;\r\n}\r\n.input-sm + .form-control-feedback,\r\n.input-group-sm + .form-control-feedback,\r\n.form-group-sm .form-control + .form-control-feedback {\r\n  width: 30px;\r\n  height: 30px;\r\n  line-height: 30px;\r\n}\r\n.has-success .help-block,\r\n.has-success .control-label,\r\n.has-success .radio,\r\n.has-success .checkbox,\r\n.has-success .radio-inline,\r\n.has-success .checkbox-inline,\r\n.has-success.radio label,\r\n.has-success.checkbox label,\r\n.has-success.radio-inline label,\r\n.has-success.checkbox-inline label {\r\n  color: #3c763d;\r\n}\r\n.has-success .form-control {\r\n  border-color: #3c763d;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n}\r\n.has-success .form-control:focus {\r\n  border-color: #2b542c;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168;\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168;\r\n}\r\n.has-success .input-group-addon {\r\n  color: #3c763d;\r\n  background-color: #dff0d8;\r\n  border-color: #3c763d;\r\n}\r\n.has-success .form-control-feedback {\r\n  color: #3c763d;\r\n}\r\n.has-warning .help-block,\r\n.has-warning .control-label,\r\n.has-warning .radio,\r\n.has-warning .checkbox,\r\n.has-warning .radio-inline,\r\n.has-warning .checkbox-inline,\r\n.has-warning.radio label,\r\n.has-warning.checkbox label,\r\n.has-warning.radio-inline label,\r\n.has-warning.checkbox-inline label {\r\n  color: #8a6d3b;\r\n}\r\n.has-warning .form-control {\r\n  border-color: #8a6d3b;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n}\r\n.has-warning .form-control:focus {\r\n  border-color: #66512c;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #c0a16b;\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #c0a16b;\r\n}\r\n.has-warning .input-group-addon {\r\n  color: #8a6d3b;\r\n  background-color: #fcf8e3;\r\n  border-color: #8a6d3b;\r\n}\r\n.has-warning .form-control-feedback {\r\n  color: #8a6d3b;\r\n}\r\n.has-error .help-block,\r\n.has-error .control-label,\r\n.has-error .radio,\r\n.has-error .checkbox,\r\n.has-error .radio-inline,\r\n.has-error .checkbox-inline,\r\n.has-error.radio label,\r\n.has-error.checkbox label,\r\n.has-error.radio-inline label,\r\n.has-error.checkbox-inline label {\r\n  color: #a94442;\r\n}\r\n.has-error .form-control {\r\n  border-color: #a94442;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n}\r\n.has-error .form-control:focus {\r\n  border-color: #843534;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;\r\n}\r\n.has-error .input-group-addon {\r\n  color: #a94442;\r\n  background-color: #f2dede;\r\n  border-color: #a94442;\r\n}\r\n.has-error .form-control-feedback {\r\n  color: #a94442;\r\n}\r\n.has-feedback label ~ .form-control-feedback {\r\n  top: 25px;\r\n}\r\n.has-feedback label.sr-only ~ .form-control-feedback {\r\n  top: 0;\r\n}\r\n.help-block {\r\n  display: block;\r\n  margin-top: 5px;\r\n  margin-bottom: 10px;\r\n  color: #737373;\r\n}\r\n@media (min-width: 768px) {\r\n  .form-inline .form-group {\r\n    display: inline-block;\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .form-control {\r\n    display: inline-block;\r\n    width: auto;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .form-control-static {\r\n    display: inline-block;\r\n  }\r\n  .form-inline .input-group {\r\n    display: inline-table;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .input-group .input-group-addon,\r\n  .form-inline .input-group .input-group-btn,\r\n  .form-inline .input-group .form-control {\r\n    width: auto;\r\n  }\r\n  .form-inline .input-group > .form-control {\r\n    width: 100%;\r\n  }\r\n  .form-inline .control-label {\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .radio,\r\n  .form-inline .checkbox {\r\n    display: inline-block;\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .radio label,\r\n  .form-inline .checkbox label {\r\n    padding-left: 0;\r\n  }\r\n  .form-inline .radio input[type=\"radio\"],\r\n  .form-inline .checkbox input[type=\"checkbox\"] {\r\n    position: relative;\r\n    margin-left: 0;\r\n  }\r\n  .form-inline .has-feedback .form-control-feedback {\r\n    top: 0;\r\n  }\r\n}\r\n.form-horizontal .radio,\r\n.form-horizontal .checkbox,\r\n.form-horizontal .radio-inline,\r\n.form-horizontal .checkbox-inline {\r\n  padding-top: 7px;\r\n  margin-top: 0;\r\n  margin-bottom: 0;\r\n}\r\n.form-horizontal .radio,\r\n.form-horizontal .checkbox {\r\n  min-height: 27px;\r\n}\r\n.form-horizontal .form-group {\r\n  margin-right: -15px;\r\n  margin-left: -15px;\r\n}\r\n@media (min-width: 768px) {\r\n  .form-horizontal .control-label {\r\n    padding-top: 7px;\r\n    margin-bottom: 0;\r\n    text-align: right;\r\n  }\r\n}\r\n.form-horizontal .has-feedback .form-control-feedback {\r\n  right: 15px;\r\n}\r\n@media (min-width: 768px) {\r\n  .form-horizontal .form-group-lg .control-label {\r\n    padding-top: 11px;\r\n    font-size: 18px;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .form-horizontal .form-group-sm .control-label {\r\n    padding-top: 6px;\r\n    font-size: 12px;\r\n  }\r\n}\r\n.btn {\r\n  display: inline-block;\r\n  padding: 6px 12px;\r\n  margin-bottom: 0;\r\n  font-size: 14px;\r\n  font-weight: normal;\r\n  line-height: 1.42857143;\r\n  text-align: center;\r\n  white-space: nowrap;\r\n  vertical-align: middle;\r\n  -ms-touch-action: manipulation;\r\n      touch-action: manipulation;\r\n  cursor: pointer;\r\n  -webkit-user-select: none;\r\n     -moz-user-select: none;\r\n      -ms-user-select: none;\r\n          user-select: none;\r\n  background-image: none;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px;\r\n}\r\n.btn:focus,\r\n.btn:active:focus,\r\n.btn.active:focus,\r\n.btn.focus,\r\n.btn:active.focus,\r\n.btn.active.focus {\r\n  outline: thin dotted;\r\n  outline: 5px auto -webkit-focus-ring-color;\r\n  outline-offset: -2px;\r\n}\r\n.btn:hover,\r\n.btn:focus,\r\n.btn.focus {\r\n  color: #333;\r\n  text-decoration: none;\r\n}\r\n.btn:active,\r\n.btn.active {\r\n  background-image: none;\r\n  outline: 0;\r\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\r\n          box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\r\n}\r\n.btn.disabled,\r\n.btn[disabled],\r\nfieldset[disabled] .btn {\r\n  cursor: not-allowed;\r\n  filter: alpha(opacity=65);\r\n  -webkit-box-shadow: none;\r\n          box-shadow: none;\r\n  opacity: .65;\r\n}\r\na.btn.disabled,\r\nfieldset[disabled] a.btn {\r\n  pointer-events: none;\r\n}\r\n.btn-default {\r\n  color: #333;\r\n  background-color: #fff;\r\n  border-color: #ccc;\r\n}\r\n.btn-default:focus,\r\n.btn-default.focus {\r\n  color: #333;\r\n  background-color: #e6e6e6;\r\n  border-color: #8c8c8c;\r\n}\r\n.btn-default:hover {\r\n  color: #333;\r\n  background-color: #e6e6e6;\r\n  border-color: #adadad;\r\n}\r\n.btn-default:active,\r\n.btn-default.active,\r\n.open > .dropdown-toggle.btn-default {\r\n  color: #333;\r\n  background-color: #e6e6e6;\r\n  border-color: #adadad;\r\n}\r\n.btn-default:active:hover,\r\n.btn-default.active:hover,\r\n.open > .dropdown-toggle.btn-default:hover,\r\n.btn-default:active:focus,\r\n.btn-default.active:focus,\r\n.open > .dropdown-toggle.btn-default:focus,\r\n.btn-default:active.focus,\r\n.btn-default.active.focus,\r\n.open > .dropdown-toggle.btn-default.focus {\r\n  color: #333;\r\n  background-color: #d4d4d4;\r\n  border-color: #8c8c8c;\r\n}\r\n.btn-default:active,\r\n.btn-default.active,\r\n.open > .dropdown-toggle.btn-default {\r\n  background-image: none;\r\n}\r\n.btn-default.disabled:hover,\r\n.btn-default[disabled]:hover,\r\nfieldset[disabled] .btn-default:hover,\r\n.btn-default.disabled:focus,\r\n.btn-default[disabled]:focus,\r\nfieldset[disabled] .btn-default:focus,\r\n.btn-default.disabled.focus,\r\n.btn-default[disabled].focus,\r\nfieldset[disabled] .btn-default.focus {\r\n  background-color: #fff;\r\n  border-color: #ccc;\r\n}\r\n.btn-default .badge {\r\n  color: #fff;\r\n  background-color: #333;\r\n}\r\n.btn-primary {\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n  border-color: #2e6da4;\r\n}\r\n.btn-primary:focus,\r\n.btn-primary.focus {\r\n  color: #fff;\r\n  background-color: #286090;\r\n  border-color: #122b40;\r\n}\r\n.btn-primary:hover {\r\n  color: #fff;\r\n  background-color: #286090;\r\n  border-color: #204d74;\r\n}\r\n.btn-primary:active,\r\n.btn-primary.active,\r\n.open > .dropdown-toggle.btn-primary {\r\n  color: #fff;\r\n  background-color: #286090;\r\n  border-color: #204d74;\r\n}\r\n.btn-primary:active:hover,\r\n.btn-primary.active:hover,\r\n.open > .dropdown-toggle.btn-primary:hover,\r\n.btn-primary:active:focus,\r\n.btn-primary.active:focus,\r\n.open > .dropdown-toggle.btn-primary:focus,\r\n.btn-primary:active.focus,\r\n.btn-primary.active.focus,\r\n.open > .dropdown-toggle.btn-primary.focus {\r\n  color: #fff;\r\n  background-color: #204d74;\r\n  border-color: #122b40;\r\n}\r\n.btn-primary:active,\r\n.btn-primary.active,\r\n.open > .dropdown-toggle.btn-primary {\r\n  background-image: none;\r\n}\r\n.btn-primary.disabled:hover,\r\n.btn-primary[disabled]:hover,\r\nfieldset[disabled] .btn-primary:hover,\r\n.btn-primary.disabled:focus,\r\n.btn-primary[disabled]:focus,\r\nfieldset[disabled] .btn-primary:focus,\r\n.btn-primary.disabled.focus,\r\n.btn-primary[disabled].focus,\r\nfieldset[disabled] .btn-primary.focus {\r\n  background-color: #337ab7;\r\n  border-color: #2e6da4;\r\n}\r\n.btn-primary .badge {\r\n  color: #337ab7;\r\n  background-color: #fff;\r\n}\r\n.btn-success {\r\n  color: #fff;\r\n  background-color: #5cb85c;\r\n  border-color: #4cae4c;\r\n}\r\n.btn-success:focus,\r\n.btn-success.focus {\r\n  color: #fff;\r\n  background-color: #449d44;\r\n  border-color: #255625;\r\n}\r\n.btn-success:hover {\r\n  color: #fff;\r\n  background-color: #449d44;\r\n  border-color: #398439;\r\n}\r\n.btn-success:active,\r\n.btn-success.active,\r\n.open > .dropdown-toggle.btn-success {\r\n  color: #fff;\r\n  background-color: #449d44;\r\n  border-color: #398439;\r\n}\r\n.btn-success:active:hover,\r\n.btn-success.active:hover,\r\n.open > .dropdown-toggle.btn-success:hover,\r\n.btn-success:active:focus,\r\n.btn-success.active:focus,\r\n.open > .dropdown-toggle.btn-success:focus,\r\n.btn-success:active.focus,\r\n.btn-success.active.focus,\r\n.open > .dropdown-toggle.btn-success.focus {\r\n  color: #fff;\r\n  background-color: #398439;\r\n  border-color: #255625;\r\n}\r\n.btn-success:active,\r\n.btn-success.active,\r\n.open > .dropdown-toggle.btn-success {\r\n  background-image: none;\r\n}\r\n.btn-success.disabled:hover,\r\n.btn-success[disabled]:hover,\r\nfieldset[disabled] .btn-success:hover,\r\n.btn-success.disabled:focus,\r\n.btn-success[disabled]:focus,\r\nfieldset[disabled] .btn-success:focus,\r\n.btn-success.disabled.focus,\r\n.btn-success[disabled].focus,\r\nfieldset[disabled] .btn-success.focus {\r\n  background-color: #5cb85c;\r\n  border-color: #4cae4c;\r\n}\r\n.btn-success .badge {\r\n  color: #5cb85c;\r\n  background-color: #fff;\r\n}\r\n.btn-info {\r\n  color: #fff;\r\n  background-color: #5bc0de;\r\n  border-color: #46b8da;\r\n}\r\n.btn-info:focus,\r\n.btn-info.focus {\r\n  color: #fff;\r\n  background-color: #31b0d5;\r\n  border-color: #1b6d85;\r\n}\r\n.btn-info:hover {\r\n  color: #fff;\r\n  background-color: #31b0d5;\r\n  border-color: #269abc;\r\n}\r\n.btn-info:active,\r\n.btn-info.active,\r\n.open > .dropdown-toggle.btn-info {\r\n  color: #fff;\r\n  background-color: #31b0d5;\r\n  border-color: #269abc;\r\n}\r\n.btn-info:active:hover,\r\n.btn-info.active:hover,\r\n.open > .dropdown-toggle.btn-info:hover,\r\n.btn-info:active:focus,\r\n.btn-info.active:focus,\r\n.open > .dropdown-toggle.btn-info:focus,\r\n.btn-info:active.focus,\r\n.btn-info.active.focus,\r\n.open > .dropdown-toggle.btn-info.focus {\r\n  color: #fff;\r\n  background-color: #269abc;\r\n  border-color: #1b6d85;\r\n}\r\n.btn-info:active,\r\n.btn-info.active,\r\n.open > .dropdown-toggle.btn-info {\r\n  background-image: none;\r\n}\r\n.btn-info.disabled:hover,\r\n.btn-info[disabled]:hover,\r\nfieldset[disabled] .btn-info:hover,\r\n.btn-info.disabled:focus,\r\n.btn-info[disabled]:focus,\r\nfieldset[disabled] .btn-info:focus,\r\n.btn-info.disabled.focus,\r\n.btn-info[disabled].focus,\r\nfieldset[disabled] .btn-info.focus {\r\n  background-color: #5bc0de;\r\n  border-color: #46b8da;\r\n}\r\n.btn-info .badge {\r\n  color: #5bc0de;\r\n  background-color: #fff;\r\n}\r\n.btn-warning {\r\n  color: #fff;\r\n  background-color: #f0ad4e;\r\n  border-color: #eea236;\r\n}\r\n.btn-warning:focus,\r\n.btn-warning.focus {\r\n  color: #fff;\r\n  background-color: #ec971f;\r\n  border-color: #985f0d;\r\n}\r\n.btn-warning:hover {\r\n  color: #fff;\r\n  background-color: #ec971f;\r\n  border-color: #d58512;\r\n}\r\n.btn-warning:active,\r\n.btn-warning.active,\r\n.open > .dropdown-toggle.btn-warning {\r\n  color: #fff;\r\n  background-color: #ec971f;\r\n  border-color: #d58512;\r\n}\r\n.btn-warning:active:hover,\r\n.btn-warning.active:hover,\r\n.open > .dropdown-toggle.btn-warning:hover,\r\n.btn-warning:active:focus,\r\n.btn-warning.active:focus,\r\n.open > .dropdown-toggle.btn-warning:focus,\r\n.btn-warning:active.focus,\r\n.btn-warning.active.focus,\r\n.open > .dropdown-toggle.btn-warning.focus {\r\n  color: #fff;\r\n  background-color: #d58512;\r\n  border-color: #985f0d;\r\n}\r\n.btn-warning:active,\r\n.btn-warning.active,\r\n.open > .dropdown-toggle.btn-warning {\r\n  background-image: none;\r\n}\r\n.btn-warning.disabled:hover,\r\n.btn-warning[disabled]:hover,\r\nfieldset[disabled] .btn-warning:hover,\r\n.btn-warning.disabled:focus,\r\n.btn-warning[disabled]:focus,\r\nfieldset[disabled] .btn-warning:focus,\r\n.btn-warning.disabled.focus,\r\n.btn-warning[disabled].focus,\r\nfieldset[disabled] .btn-warning.focus {\r\n  background-color: #f0ad4e;\r\n  border-color: #eea236;\r\n}\r\n.btn-warning .badge {\r\n  color: #f0ad4e;\r\n  background-color: #fff;\r\n}\r\n.btn-danger {\r\n  color: #fff;\r\n  background-color: #d9534f;\r\n  border-color: #d43f3a;\r\n}\r\n.btn-danger:focus,\r\n.btn-danger.focus {\r\n  color: #fff;\r\n  background-color: #c9302c;\r\n  border-color: #761c19;\r\n}\r\n.btn-danger:hover {\r\n  color: #fff;\r\n  background-color: #c9302c;\r\n  border-color: #ac2925;\r\n}\r\n.btn-danger:active,\r\n.btn-danger.active,\r\n.open > .dropdown-toggle.btn-danger {\r\n  color: #fff;\r\n  background-color: #c9302c;\r\n  border-color: #ac2925;\r\n}\r\n.btn-danger:active:hover,\r\n.btn-danger.active:hover,\r\n.open > .dropdown-toggle.btn-danger:hover,\r\n.btn-danger:active:focus,\r\n.btn-danger.active:focus,\r\n.open > .dropdown-toggle.btn-danger:focus,\r\n.btn-danger:active.focus,\r\n.btn-danger.active.focus,\r\n.open > .dropdown-toggle.btn-danger.focus {\r\n  color: #fff;\r\n  background-color: #ac2925;\r\n  border-color: #761c19;\r\n}\r\n.btn-danger:active,\r\n.btn-danger.active,\r\n.open > .dropdown-toggle.btn-danger {\r\n  background-image: none;\r\n}\r\n.btn-danger.disabled:hover,\r\n.btn-danger[disabled]:hover,\r\nfieldset[disabled] .btn-danger:hover,\r\n.btn-danger.disabled:focus,\r\n.btn-danger[disabled]:focus,\r\nfieldset[disabled] .btn-danger:focus,\r\n.btn-danger.disabled.focus,\r\n.btn-danger[disabled].focus,\r\nfieldset[disabled] .btn-danger.focus {\r\n  background-color: #d9534f;\r\n  border-color: #d43f3a;\r\n}\r\n.btn-danger .badge {\r\n  color: #d9534f;\r\n  background-color: #fff;\r\n}\r\n.btn-link {\r\n  font-weight: normal;\r\n  color: #337ab7;\r\n  border-radius: 0;\r\n}\r\n.btn-link,\r\n.btn-link:active,\r\n.btn-link.active,\r\n.btn-link[disabled],\r\nfieldset[disabled] .btn-link {\r\n  background-color: transparent;\r\n  -webkit-box-shadow: none;\r\n          box-shadow: none;\r\n}\r\n.btn-link,\r\n.btn-link:hover,\r\n.btn-link:focus,\r\n.btn-link:active {\r\n  border-color: transparent;\r\n}\r\n.btn-link:hover,\r\n.btn-link:focus {\r\n  color: #23527c;\r\n  text-decoration: underline;\r\n  background-color: transparent;\r\n}\r\n.btn-link[disabled]:hover,\r\nfieldset[disabled] .btn-link:hover,\r\n.btn-link[disabled]:focus,\r\nfieldset[disabled] .btn-link:focus {\r\n  color: #777;\r\n  text-decoration: none;\r\n}\r\n.btn-lg,\r\n.btn-group-lg > .btn {\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n  border-radius: 6px;\r\n}\r\n.btn-sm,\r\n.btn-group-sm > .btn {\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\n.btn-xs,\r\n.btn-group-xs > .btn {\r\n  padding: 1px 5px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\n.btn-block {\r\n  display: block;\r\n  width: 100%;\r\n}\r\n.btn-block + .btn-block {\r\n  margin-top: 5px;\r\n}\r\ninput[type=\"submit\"].btn-block,\r\ninput[type=\"reset\"].btn-block,\r\ninput[type=\"button\"].btn-block {\r\n  width: 100%;\r\n}\r\n.fade {\r\n  opacity: 0;\r\n  -webkit-transition: opacity .15s linear;\r\n       -o-transition: opacity .15s linear;\r\n          transition: opacity .15s linear;\r\n}\r\n.fade.in {\r\n  opacity: 1;\r\n}\r\n.collapse {\r\n  display: none;\r\n}\r\n.collapse.in {\r\n  display: block;\r\n}\r\ntr.collapse.in {\r\n  display: table-row;\r\n}\r\ntbody.collapse.in {\r\n  display: table-row-group;\r\n}\r\n.collapsing {\r\n  position: relative;\r\n  height: 0;\r\n  overflow: hidden;\r\n  -webkit-transition-timing-function: ease;\r\n       -o-transition-timing-function: ease;\r\n          transition-timing-function: ease;\r\n  -webkit-transition-duration: .35s;\r\n       -o-transition-duration: .35s;\r\n          transition-duration: .35s;\r\n  -webkit-transition-property: height, visibility;\r\n       -o-transition-property: height, visibility;\r\n          transition-property: height, visibility;\r\n}\r\n.caret {\r\n  display: inline-block;\r\n  width: 0;\r\n  height: 0;\r\n  margin-left: 2px;\r\n  vertical-align: middle;\r\n  border-top: 4px dashed;\r\n  border-top: 4px solid \\9;\r\n  border-right: 4px solid transparent;\r\n  border-left: 4px solid transparent;\r\n}\r\n.dropup,\r\n.dropdown {\r\n  position: relative;\r\n}\r\n.dropdown-toggle:focus {\r\n  outline: 0;\r\n}\r\n.dropdown-menu {\r\n  position: absolute;\r\n  top: 100%;\r\n  left: 0;\r\n  z-index: 1000;\r\n  display: none;\r\n  float: left;\r\n  min-width: 160px;\r\n  padding: 5px 0;\r\n  margin: 2px 0 0;\r\n  font-size: 14px;\r\n  text-align: left;\r\n  list-style: none;\r\n  background-color: #fff;\r\n  -webkit-background-clip: padding-box;\r\n          background-clip: padding-box;\r\n  border: 1px solid #ccc;\r\n  border: 1px solid rgba(0, 0, 0, .15);\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);\r\n          box-shadow: 0 6px 12px rgba(0, 0, 0, .175);\r\n}\r\n.dropdown-menu.pull-right {\r\n  right: 0;\r\n  left: auto;\r\n}\r\n.dropdown-menu .divider {\r\n  height: 1px;\r\n  margin: 9px 0;\r\n  overflow: hidden;\r\n  background-color: #e5e5e5;\r\n}\r\n.dropdown-menu > li > a {\r\n  display: block;\r\n  padding: 3px 20px;\r\n  clear: both;\r\n  font-weight: normal;\r\n  line-height: 1.42857143;\r\n  color: #333;\r\n  white-space: nowrap;\r\n}\r\n.dropdown-menu > li > a:hover,\r\n.dropdown-menu > li > a:focus {\r\n  color: #262626;\r\n  text-decoration: none;\r\n  background-color: #f5f5f5;\r\n}\r\n.dropdown-menu > .active > a,\r\n.dropdown-menu > .active > a:hover,\r\n.dropdown-menu > .active > a:focus {\r\n  color: #fff;\r\n  text-decoration: none;\r\n  background-color: #337ab7;\r\n  outline: 0;\r\n}\r\n.dropdown-menu > .disabled > a,\r\n.dropdown-menu > .disabled > a:hover,\r\n.dropdown-menu > .disabled > a:focus {\r\n  color: #777;\r\n}\r\n.dropdown-menu > .disabled > a:hover,\r\n.dropdown-menu > .disabled > a:focus {\r\n  text-decoration: none;\r\n  cursor: not-allowed;\r\n  background-color: transparent;\r\n  background-image: none;\r\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\r\n}\r\n.open > .dropdown-menu {\r\n  display: block;\r\n}\r\n.open > a {\r\n  outline: 0;\r\n}\r\n.dropdown-menu-right {\r\n  right: 0;\r\n  left: auto;\r\n}\r\n.dropdown-menu-left {\r\n  right: auto;\r\n  left: 0;\r\n}\r\n.dropdown-header {\r\n  display: block;\r\n  padding: 3px 20px;\r\n  font-size: 12px;\r\n  line-height: 1.42857143;\r\n  color: #777;\r\n  white-space: nowrap;\r\n}\r\n.dropdown-backdrop {\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index: 990;\r\n}\r\n.pull-right > .dropdown-menu {\r\n  right: 0;\r\n  left: auto;\r\n}\r\n.dropup .caret,\r\n.navbar-fixed-bottom .dropdown .caret {\r\n  content: \"\";\r\n  border-top: 0;\r\n  border-bottom: 4px dashed;\r\n  border-bottom: 4px solid \\9;\r\n}\r\n.dropup .dropdown-menu,\r\n.navbar-fixed-bottom .dropdown .dropdown-menu {\r\n  top: auto;\r\n  bottom: 100%;\r\n  margin-bottom: 2px;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-right .dropdown-menu {\r\n    right: 0;\r\n    left: auto;\r\n  }\r\n  .navbar-right .dropdown-menu-left {\r\n    right: auto;\r\n    left: 0;\r\n  }\r\n}\r\n.btn-group,\r\n.btn-group-vertical {\r\n  position: relative;\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n}\r\n.btn-group > .btn,\r\n.btn-group-vertical > .btn {\r\n  position: relative;\r\n  float: left;\r\n}\r\n.btn-group > .btn:hover,\r\n.btn-group-vertical > .btn:hover,\r\n.btn-group > .btn:focus,\r\n.btn-group-vertical > .btn:focus,\r\n.btn-group > .btn:active,\r\n.btn-group-vertical > .btn:active,\r\n.btn-group > .btn.active,\r\n.btn-group-vertical > .btn.active {\r\n  z-index: 2;\r\n}\r\n.btn-group .btn + .btn,\r\n.btn-group .btn + .btn-group,\r\n.btn-group .btn-group + .btn,\r\n.btn-group .btn-group + .btn-group {\r\n  margin-left: -1px;\r\n}\r\n.btn-toolbar {\r\n  margin-left: -5px;\r\n}\r\n.btn-toolbar .btn,\r\n.btn-toolbar .btn-group,\r\n.btn-toolbar .input-group {\r\n  float: left;\r\n}\r\n.btn-toolbar > .btn,\r\n.btn-toolbar > .btn-group,\r\n.btn-toolbar > .input-group {\r\n  margin-left: 5px;\r\n}\r\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\r\n  border-radius: 0;\r\n}\r\n.btn-group > .btn:first-child {\r\n  margin-left: 0;\r\n}\r\n.btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\r\n  border-top-right-radius: 0;\r\n  border-bottom-right-radius: 0;\r\n}\r\n.btn-group > .btn:last-child:not(:first-child),\r\n.btn-group > .dropdown-toggle:not(:first-child) {\r\n  border-top-left-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.btn-group > .btn-group {\r\n  float: left;\r\n}\r\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\r\n  border-radius: 0;\r\n}\r\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\r\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\r\n  border-top-right-radius: 0;\r\n  border-bottom-right-radius: 0;\r\n}\r\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\r\n  border-top-left-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.btn-group .dropdown-toggle:active,\r\n.btn-group.open .dropdown-toggle {\r\n  outline: 0;\r\n}\r\n.btn-group > .btn + .dropdown-toggle {\r\n  padding-right: 8px;\r\n  padding-left: 8px;\r\n}\r\n.btn-group > .btn-lg + .dropdown-toggle {\r\n  padding-right: 12px;\r\n  padding-left: 12px;\r\n}\r\n.btn-group.open .dropdown-toggle {\r\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\r\n          box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\r\n}\r\n.btn-group.open .dropdown-toggle.btn-link {\r\n  -webkit-box-shadow: none;\r\n          box-shadow: none;\r\n}\r\n.btn .caret {\r\n  margin-left: 0;\r\n}\r\n.btn-lg .caret {\r\n  border-width: 5px 5px 0;\r\n  border-bottom-width: 0;\r\n}\r\n.dropup .btn-lg .caret {\r\n  border-width: 0 5px 5px;\r\n}\r\n.btn-group-vertical > .btn,\r\n.btn-group-vertical > .btn-group,\r\n.btn-group-vertical > .btn-group > .btn {\r\n  display: block;\r\n  float: none;\r\n  width: 100%;\r\n  max-width: 100%;\r\n}\r\n.btn-group-vertical > .btn-group > .btn {\r\n  float: none;\r\n}\r\n.btn-group-vertical > .btn + .btn,\r\n.btn-group-vertical > .btn + .btn-group,\r\n.btn-group-vertical > .btn-group + .btn,\r\n.btn-group-vertical > .btn-group + .btn-group {\r\n  margin-top: -1px;\r\n  margin-left: 0;\r\n}\r\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\r\n  border-radius: 0;\r\n}\r\n.btn-group-vertical > .btn:first-child:not(:last-child) {\r\n  border-top-left-radius: 4px;\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.btn-group-vertical > .btn:last-child:not(:first-child) {\r\n  border-top-left-radius: 0;\r\n  border-top-right-radius: 0;\r\n  border-bottom-right-radius: 4px;\r\n  border-bottom-left-radius: 4px;\r\n}\r\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\r\n  border-radius: 0;\r\n}\r\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\r\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\r\n  border-bottom-right-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\r\n  border-top-left-radius: 0;\r\n  border-top-right-radius: 0;\r\n}\r\n.btn-group-justified {\r\n  display: table;\r\n  width: 100%;\r\n  table-layout: fixed;\r\n  border-collapse: separate;\r\n}\r\n.btn-group-justified > .btn,\r\n.btn-group-justified > .btn-group {\r\n  display: table-cell;\r\n  float: none;\r\n  width: 1%;\r\n}\r\n.btn-group-justified > .btn-group .btn {\r\n  width: 100%;\r\n}\r\n.btn-group-justified > .btn-group .dropdown-menu {\r\n  left: auto;\r\n}\r\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\r\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\r\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\r\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\r\n  position: absolute;\r\n  clip: rect(0, 0, 0, 0);\r\n  pointer-events: none;\r\n}\r\n.input-group {\r\n  position: relative;\r\n  display: table;\r\n  border-collapse: separate;\r\n}\r\n.input-group[class*=\"col-\"] {\r\n  float: none;\r\n  padding-right: 0;\r\n  padding-left: 0;\r\n}\r\n.input-group .form-control {\r\n  position: relative;\r\n  z-index: 2;\r\n  float: left;\r\n  width: 100%;\r\n  margin-bottom: 0;\r\n}\r\n.input-group .form-control:focus {\r\n  z-index: 3;\r\n}\r\n.input-group-lg > .form-control,\r\n.input-group-lg > .input-group-addon,\r\n.input-group-lg > .input-group-btn > .btn {\r\n  height: 46px;\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n  border-radius: 6px;\r\n}\r\nselect.input-group-lg > .form-control,\r\nselect.input-group-lg > .input-group-addon,\r\nselect.input-group-lg > .input-group-btn > .btn {\r\n  height: 46px;\r\n  line-height: 46px;\r\n}\r\ntextarea.input-group-lg > .form-control,\r\ntextarea.input-group-lg > .input-group-addon,\r\ntextarea.input-group-lg > .input-group-btn > .btn,\r\nselect[multiple].input-group-lg > .form-control,\r\nselect[multiple].input-group-lg > .input-group-addon,\r\nselect[multiple].input-group-lg > .input-group-btn > .btn {\r\n  height: auto;\r\n}\r\n.input-group-sm > .form-control,\r\n.input-group-sm > .input-group-addon,\r\n.input-group-sm > .input-group-btn > .btn {\r\n  height: 30px;\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\nselect.input-group-sm > .form-control,\r\nselect.input-group-sm > .input-group-addon,\r\nselect.input-group-sm > .input-group-btn > .btn {\r\n  height: 30px;\r\n  line-height: 30px;\r\n}\r\ntextarea.input-group-sm > .form-control,\r\ntextarea.input-group-sm > .input-group-addon,\r\ntextarea.input-group-sm > .input-group-btn > .btn,\r\nselect[multiple].input-group-sm > .form-control,\r\nselect[multiple].input-group-sm > .input-group-addon,\r\nselect[multiple].input-group-sm > .input-group-btn > .btn {\r\n  height: auto;\r\n}\r\n.input-group-addon,\r\n.input-group-btn,\r\n.input-group .form-control {\r\n  display: table-cell;\r\n}\r\n.input-group-addon:not(:first-child):not(:last-child),\r\n.input-group-btn:not(:first-child):not(:last-child),\r\n.input-group .form-control:not(:first-child):not(:last-child) {\r\n  border-radius: 0;\r\n}\r\n.input-group-addon,\r\n.input-group-btn {\r\n  width: 1%;\r\n  white-space: nowrap;\r\n  vertical-align: middle;\r\n}\r\n.input-group-addon {\r\n  padding: 6px 12px;\r\n  font-size: 14px;\r\n  font-weight: normal;\r\n  line-height: 1;\r\n  color: #555;\r\n  text-align: center;\r\n  background-color: #eee;\r\n  border: 1px solid #ccc;\r\n  border-radius: 4px;\r\n}\r\n.input-group-addon.input-sm {\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  border-radius: 3px;\r\n}\r\n.input-group-addon.input-lg {\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  border-radius: 6px;\r\n}\r\n.input-group-addon input[type=\"radio\"],\r\n.input-group-addon input[type=\"checkbox\"] {\r\n  margin-top: 0;\r\n}\r\n.input-group .form-control:first-child,\r\n.input-group-addon:first-child,\r\n.input-group-btn:first-child > .btn,\r\n.input-group-btn:first-child > .btn-group > .btn,\r\n.input-group-btn:first-child > .dropdown-toggle,\r\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\r\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\r\n  border-top-right-radius: 0;\r\n  border-bottom-right-radius: 0;\r\n}\r\n.input-group-addon:first-child {\r\n  border-right: 0;\r\n}\r\n.input-group .form-control:last-child,\r\n.input-group-addon:last-child,\r\n.input-group-btn:last-child > .btn,\r\n.input-group-btn:last-child > .btn-group > .btn,\r\n.input-group-btn:last-child > .dropdown-toggle,\r\n.input-group-btn:first-child > .btn:not(:first-child),\r\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\r\n  border-top-left-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.input-group-addon:last-child {\r\n  border-left: 0;\r\n}\r\n.input-group-btn {\r\n  position: relative;\r\n  font-size: 0;\r\n  white-space: nowrap;\r\n}\r\n.input-group-btn > .btn {\r\n  position: relative;\r\n}\r\n.input-group-btn > .btn + .btn {\r\n  margin-left: -1px;\r\n}\r\n.input-group-btn > .btn:hover,\r\n.input-group-btn > .btn:focus,\r\n.input-group-btn > .btn:active {\r\n  z-index: 2;\r\n}\r\n.input-group-btn:first-child > .btn,\r\n.input-group-btn:first-child > .btn-group {\r\n  margin-right: -1px;\r\n}\r\n.input-group-btn:last-child > .btn,\r\n.input-group-btn:last-child > .btn-group {\r\n  z-index: 2;\r\n  margin-left: -1px;\r\n}\r\n.nav {\r\n  padding-left: 0;\r\n  margin-bottom: 0;\r\n  list-style: none;\r\n}\r\n.nav > li {\r\n  position: relative;\r\n  display: block;\r\n}\r\n.nav > li > a {\r\n  position: relative;\r\n  display: block;\r\n  padding: 10px 15px;\r\n}\r\n.nav > li > a:hover,\r\n.nav > li > a:focus {\r\n  text-decoration: none;\r\n  background-color: #eee;\r\n}\r\n.nav > li.disabled > a {\r\n  color: #777;\r\n}\r\n.nav > li.disabled > a:hover,\r\n.nav > li.disabled > a:focus {\r\n  color: #777;\r\n  text-decoration: none;\r\n  cursor: not-allowed;\r\n  background-color: transparent;\r\n}\r\n.nav .open > a,\r\n.nav .open > a:hover,\r\n.nav .open > a:focus {\r\n  background-color: #eee;\r\n  border-color: #337ab7;\r\n}\r\n.nav .nav-divider {\r\n  height: 1px;\r\n  margin: 9px 0;\r\n  overflow: hidden;\r\n  background-color: #e5e5e5;\r\n}\r\n.nav > li > a > img {\r\n  max-width: none;\r\n}\r\n.nav-tabs {\r\n  border-bottom: 1px solid #ddd;\r\n}\r\n.nav-tabs > li {\r\n  float: left;\r\n  margin-bottom: -1px;\r\n}\r\n.nav-tabs > li > a {\r\n  margin-right: 2px;\r\n  line-height: 1.42857143;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px 4px 0 0;\r\n}\r\n.nav-tabs > li > a:hover {\r\n  border-color: #eee #eee #ddd;\r\n}\r\n.nav-tabs > li.active > a,\r\n.nav-tabs > li.active > a:hover,\r\n.nav-tabs > li.active > a:focus {\r\n  color: #555;\r\n  cursor: default;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n  border-bottom-color: transparent;\r\n}\r\n.nav-tabs.nav-justified {\r\n  width: 100%;\r\n  border-bottom: 0;\r\n}\r\n.nav-tabs.nav-justified > li {\r\n  float: none;\r\n}\r\n.nav-tabs.nav-justified > li > a {\r\n  margin-bottom: 5px;\r\n  text-align: center;\r\n}\r\n.nav-tabs.nav-justified > .dropdown .dropdown-menu {\r\n  top: auto;\r\n  left: auto;\r\n}\r\n@media (min-width: 768px) {\r\n  .nav-tabs.nav-justified > li {\r\n    display: table-cell;\r\n    width: 1%;\r\n  }\r\n  .nav-tabs.nav-justified > li > a {\r\n    margin-bottom: 0;\r\n  }\r\n}\r\n.nav-tabs.nav-justified > li > a {\r\n  margin-right: 0;\r\n  border-radius: 4px;\r\n}\r\n.nav-tabs.nav-justified > .active > a,\r\n.nav-tabs.nav-justified > .active > a:hover,\r\n.nav-tabs.nav-justified > .active > a:focus {\r\n  border: 1px solid #ddd;\r\n}\r\n@media (min-width: 768px) {\r\n  .nav-tabs.nav-justified > li > a {\r\n    border-bottom: 1px solid #ddd;\r\n    border-radius: 4px 4px 0 0;\r\n  }\r\n  .nav-tabs.nav-justified > .active > a,\r\n  .nav-tabs.nav-justified > .active > a:hover,\r\n  .nav-tabs.nav-justified > .active > a:focus {\r\n    border-bottom-color: #fff;\r\n  }\r\n}\r\n.nav-pills > li {\r\n  float: left;\r\n}\r\n.nav-pills > li > a {\r\n  border-radius: 4px;\r\n}\r\n.nav-pills > li + li {\r\n  margin-left: 2px;\r\n}\r\n.nav-pills > li.active > a,\r\n.nav-pills > li.active > a:hover,\r\n.nav-pills > li.active > a:focus {\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n}\r\n.nav-stacked > li {\r\n  float: none;\r\n}\r\n.nav-stacked > li + li {\r\n  margin-top: 2px;\r\n  margin-left: 0;\r\n}\r\n.nav-justified {\r\n  width: 100%;\r\n}\r\n.nav-justified > li {\r\n  float: none;\r\n}\r\n.nav-justified > li > a {\r\n  margin-bottom: 5px;\r\n  text-align: center;\r\n}\r\n.nav-justified > .dropdown .dropdown-menu {\r\n  top: auto;\r\n  left: auto;\r\n}\r\n@media (min-width: 768px) {\r\n  .nav-justified > li {\r\n    display: table-cell;\r\n    width: 1%;\r\n  }\r\n  .nav-justified > li > a {\r\n    margin-bottom: 0;\r\n  }\r\n}\r\n.nav-tabs-justified {\r\n  border-bottom: 0;\r\n}\r\n.nav-tabs-justified > li > a {\r\n  margin-right: 0;\r\n  border-radius: 4px;\r\n}\r\n.nav-tabs-justified > .active > a,\r\n.nav-tabs-justified > .active > a:hover,\r\n.nav-tabs-justified > .active > a:focus {\r\n  border: 1px solid #ddd;\r\n}\r\n@media (min-width: 768px) {\r\n  .nav-tabs-justified > li > a {\r\n    border-bottom: 1px solid #ddd;\r\n    border-radius: 4px 4px 0 0;\r\n  }\r\n  .nav-tabs-justified > .active > a,\r\n  .nav-tabs-justified > .active > a:hover,\r\n  .nav-tabs-justified > .active > a:focus {\r\n    border-bottom-color: #fff;\r\n  }\r\n}\r\n.tab-content > .tab-pane {\r\n  display: none;\r\n}\r\n.tab-content > .active {\r\n  display: block;\r\n}\r\n.nav-tabs .dropdown-menu {\r\n  margin-top: -1px;\r\n  border-top-left-radius: 0;\r\n  border-top-right-radius: 0;\r\n}\r\n.navbar {\r\n  position: relative;\r\n  min-height: 50px;\r\n  margin-bottom: 20px;\r\n  border: 1px solid transparent;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar {\r\n    border-radius: 4px;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-header {\r\n    float: left;\r\n  }\r\n}\r\n.navbar-collapse {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  overflow-x: visible;\r\n  -webkit-overflow-scrolling: touch;\r\n  border-top: 1px solid transparent;\r\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1);\r\n          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1);\r\n}\r\n.navbar-collapse.in {\r\n  overflow-y: auto;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-collapse {\r\n    width: auto;\r\n    border-top: 0;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n  }\r\n  .navbar-collapse.collapse {\r\n    display: block !important;\r\n    height: auto !important;\r\n    padding-bottom: 0;\r\n    overflow: visible !important;\r\n  }\r\n  .navbar-collapse.in {\r\n    overflow-y: visible;\r\n  }\r\n  .navbar-fixed-top .navbar-collapse,\r\n  .navbar-static-top .navbar-collapse,\r\n  .navbar-fixed-bottom .navbar-collapse {\r\n    padding-right: 0;\r\n    padding-left: 0;\r\n  }\r\n}\r\n.navbar-fixed-top .navbar-collapse,\r\n.navbar-fixed-bottom .navbar-collapse {\r\n  max-height: 340px;\r\n}\r\n@media (max-device-width: 480px) and (orientation: landscape) {\r\n  .navbar-fixed-top .navbar-collapse,\r\n  .navbar-fixed-bottom .navbar-collapse {\r\n    max-height: 200px;\r\n  }\r\n}\r\n.container > .navbar-header,\r\n.container-fluid > .navbar-header,\r\n.container > .navbar-collapse,\r\n.container-fluid > .navbar-collapse {\r\n  margin-right: -15px;\r\n  margin-left: -15px;\r\n}\r\n@media (min-width: 768px) {\r\n  .container > .navbar-header,\r\n  .container-fluid > .navbar-header,\r\n  .container > .navbar-collapse,\r\n  .container-fluid > .navbar-collapse {\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n  }\r\n}\r\n.navbar-static-top {\r\n  z-index: 1000;\r\n  border-width: 0 0 1px;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-static-top {\r\n    border-radius: 0;\r\n  }\r\n}\r\n.navbar-fixed-top,\r\n.navbar-fixed-bottom {\r\n  position: fixed;\r\n  right: 0;\r\n  left: 0;\r\n  z-index: 1030;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-top,\r\n  .navbar-fixed-bottom {\r\n    border-radius: 0;\r\n  }\r\n}\r\n.navbar-fixed-top {\r\n  top: 0;\r\n  border-width: 0 0 1px;\r\n}\r\n.navbar-fixed-bottom {\r\n  bottom: 0;\r\n  margin-bottom: 0;\r\n  border-width: 1px 0 0;\r\n}\r\n.navbar-brand {\r\n  float: left;\r\n  height: 50px;\r\n  padding: 15px 15px;\r\n  font-size: 18px;\r\n  line-height: 20px;\r\n}\r\n.navbar-brand:hover,\r\n.navbar-brand:focus {\r\n  text-decoration: none;\r\n}\r\n.navbar-brand > img {\r\n  display: block;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar > .container .navbar-brand,\r\n  .navbar > .container-fluid .navbar-brand {\r\n    margin-left: -15px;\r\n  }\r\n}\r\n.navbar-toggle {\r\n  position: relative;\r\n  float: right;\r\n  padding: 9px 10px;\r\n  margin-top: 8px;\r\n  margin-right: 15px;\r\n  margin-bottom: 8px;\r\n  background-color: transparent;\r\n  background-image: none;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px;\r\n}\r\n.navbar-toggle:focus {\r\n  outline: 0;\r\n}\r\n.navbar-toggle .icon-bar {\r\n  display: block;\r\n  width: 22px;\r\n  height: 2px;\r\n  border-radius: 1px;\r\n}\r\n.navbar-toggle .icon-bar + .icon-bar {\r\n  margin-top: 4px;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-toggle {\r\n    display: none;\r\n  }\r\n}\r\n.navbar-nav {\r\n  margin: 7.5px -15px;\r\n}\r\n.navbar-nav > li > a {\r\n  padding-top: 10px;\r\n  padding-bottom: 10px;\r\n  line-height: 20px;\r\n}\r\n@media (max-width: 767px) {\r\n  .navbar-nav .open .dropdown-menu {\r\n    position: static;\r\n    float: none;\r\n    width: auto;\r\n    margin-top: 0;\r\n    background-color: transparent;\r\n    border: 0;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n  }\r\n  .navbar-nav .open .dropdown-menu > li > a,\r\n  .navbar-nav .open .dropdown-menu .dropdown-header {\r\n    padding: 5px 15px 5px 25px;\r\n  }\r\n  .navbar-nav .open .dropdown-menu > li > a {\r\n    line-height: 20px;\r\n  }\r\n  .navbar-nav .open .dropdown-menu > li > a:hover,\r\n  .navbar-nav .open .dropdown-menu > li > a:focus {\r\n    background-image: none;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-nav {\r\n    float: left;\r\n    margin: 0;\r\n  }\r\n  .navbar-nav > li {\r\n    float: left;\r\n  }\r\n  .navbar-nav > li > a {\r\n    padding-top: 15px;\r\n    padding-bottom: 15px;\r\n  }\r\n}\r\n.navbar-form {\r\n  padding: 10px 15px;\r\n  margin-top: 8px;\r\n  margin-right: -15px;\r\n  margin-bottom: 8px;\r\n  margin-left: -15px;\r\n  border-top: 1px solid transparent;\r\n  border-bottom: 1px solid transparent;\r\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1), 0 1px 0 rgba(255, 255, 255, .1);\r\n          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1), 0 1px 0 rgba(255, 255, 255, .1);\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-form .form-group {\r\n    display: inline-block;\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .form-control {\r\n    display: inline-block;\r\n    width: auto;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .form-control-static {\r\n    display: inline-block;\r\n  }\r\n  .navbar-form .input-group {\r\n    display: inline-table;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .input-group .input-group-addon,\r\n  .navbar-form .input-group .input-group-btn,\r\n  .navbar-form .input-group .form-control {\r\n    width: auto;\r\n  }\r\n  .navbar-form .input-group > .form-control {\r\n    width: 100%;\r\n  }\r\n  .navbar-form .control-label {\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .radio,\r\n  .navbar-form .checkbox {\r\n    display: inline-block;\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .radio label,\r\n  .navbar-form .checkbox label {\r\n    padding-left: 0;\r\n  }\r\n  .navbar-form .radio input[type=\"radio\"],\r\n  .navbar-form .checkbox input[type=\"checkbox\"] {\r\n    position: relative;\r\n    margin-left: 0;\r\n  }\r\n  .navbar-form .has-feedback .form-control-feedback {\r\n    top: 0;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .navbar-form .form-group {\r\n    margin-bottom: 5px;\r\n  }\r\n  .navbar-form .form-group:last-child {\r\n    margin-bottom: 0;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-form {\r\n    width: auto;\r\n    padding-top: 0;\r\n    padding-bottom: 0;\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n    border: 0;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n  }\r\n}\r\n.navbar-nav > li > .dropdown-menu {\r\n  margin-top: 0;\r\n  border-top-left-radius: 0;\r\n  border-top-right-radius: 0;\r\n}\r\n.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\r\n  margin-bottom: 0;\r\n  border-top-left-radius: 4px;\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.navbar-btn {\r\n  margin-top: 8px;\r\n  margin-bottom: 8px;\r\n}\r\n.navbar-btn.btn-sm {\r\n  margin-top: 10px;\r\n  margin-bottom: 10px;\r\n}\r\n.navbar-btn.btn-xs {\r\n  margin-top: 14px;\r\n  margin-bottom: 14px;\r\n}\r\n.navbar-text {\r\n  margin-top: 15px;\r\n  margin-bottom: 15px;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-text {\r\n    float: left;\r\n    margin-right: 15px;\r\n    margin-left: 15px;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-left {\r\n    float: left !important;\r\n  }\r\n  .navbar-right {\r\n    float: right !important;\r\n    margin-right: -15px;\r\n  }\r\n  .navbar-right ~ .navbar-right {\r\n    margin-right: 0;\r\n  }\r\n}\r\n.navbar-default {\r\n  background-color: #f8f8f8;\r\n  border-color: #e7e7e7;\r\n}\r\n.navbar-default .navbar-brand {\r\n  color: #777;\r\n}\r\n.navbar-default .navbar-brand:hover,\r\n.navbar-default .navbar-brand:focus {\r\n  color: #5e5e5e;\r\n  background-color: transparent;\r\n}\r\n.navbar-default .navbar-text {\r\n  color: #777;\r\n}\r\n.navbar-default .navbar-nav > li > a {\r\n  color: #777;\r\n}\r\n.navbar-default .navbar-nav > li > a:hover,\r\n.navbar-default .navbar-nav > li > a:focus {\r\n  color: #333;\r\n  background-color: transparent;\r\n}\r\n.navbar-default .navbar-nav > .active > a,\r\n.navbar-default .navbar-nav > .active > a:hover,\r\n.navbar-default .navbar-nav > .active > a:focus {\r\n  color: #555;\r\n  background-color: #e7e7e7;\r\n}\r\n.navbar-default .navbar-nav > .disabled > a,\r\n.navbar-default .navbar-nav > .disabled > a:hover,\r\n.navbar-default .navbar-nav > .disabled > a:focus {\r\n  color: #ccc;\r\n  background-color: transparent;\r\n}\r\n.navbar-default .navbar-toggle {\r\n  border-color: #ddd;\r\n}\r\n.navbar-default .navbar-toggle:hover,\r\n.navbar-default .navbar-toggle:focus {\r\n  background-color: #ddd;\r\n}\r\n.navbar-default .navbar-toggle .icon-bar {\r\n  background-color: #888;\r\n}\r\n.navbar-default .navbar-collapse,\r\n.navbar-default .navbar-form {\r\n  border-color: #e7e7e7;\r\n}\r\n.navbar-default .navbar-nav > .open > a,\r\n.navbar-default .navbar-nav > .open > a:hover,\r\n.navbar-default .navbar-nav > .open > a:focus {\r\n  color: #555;\r\n  background-color: #e7e7e7;\r\n}\r\n@media (max-width: 767px) {\r\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a {\r\n    color: #777;\r\n  }\r\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\r\n    color: #333;\r\n    background-color: transparent;\r\n  }\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\r\n    color: #555;\r\n    background-color: #e7e7e7;\r\n  }\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\r\n    color: #ccc;\r\n    background-color: transparent;\r\n  }\r\n}\r\n.navbar-default .navbar-link {\r\n  color: #777;\r\n}\r\n.navbar-default .navbar-link:hover {\r\n  color: #333;\r\n}\r\n.navbar-default .btn-link {\r\n  color: #777;\r\n}\r\n.navbar-default .btn-link:hover,\r\n.navbar-default .btn-link:focus {\r\n  color: #333;\r\n}\r\n.navbar-default .btn-link[disabled]:hover,\r\nfieldset[disabled] .navbar-default .btn-link:hover,\r\n.navbar-default .btn-link[disabled]:focus,\r\nfieldset[disabled] .navbar-default .btn-link:focus {\r\n  color: #ccc;\r\n}\r\n.navbar-inverse {\r\n  background-color: #222;\r\n  border-color: #080808;\r\n}\r\n.navbar-inverse .navbar-brand {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .navbar-brand:hover,\r\n.navbar-inverse .navbar-brand:focus {\r\n  color: #fff;\r\n  background-color: transparent;\r\n}\r\n.navbar-inverse .navbar-text {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .navbar-nav > li > a {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .navbar-nav > li > a:hover,\r\n.navbar-inverse .navbar-nav > li > a:focus {\r\n  color: #fff;\r\n  background-color: transparent;\r\n}\r\n.navbar-inverse .navbar-nav > .active > a,\r\n.navbar-inverse .navbar-nav > .active > a:hover,\r\n.navbar-inverse .navbar-nav > .active > a:focus {\r\n  color: #fff;\r\n  background-color: #080808;\r\n}\r\n.navbar-inverse .navbar-nav > .disabled > a,\r\n.navbar-inverse .navbar-nav > .disabled > a:hover,\r\n.navbar-inverse .navbar-nav > .disabled > a:focus {\r\n  color: #444;\r\n  background-color: transparent;\r\n}\r\n.navbar-inverse .navbar-toggle {\r\n  border-color: #333;\r\n}\r\n.navbar-inverse .navbar-toggle:hover,\r\n.navbar-inverse .navbar-toggle:focus {\r\n  background-color: #333;\r\n}\r\n.navbar-inverse .navbar-toggle .icon-bar {\r\n  background-color: #fff;\r\n}\r\n.navbar-inverse .navbar-collapse,\r\n.navbar-inverse .navbar-form {\r\n  border-color: #101010;\r\n}\r\n.navbar-inverse .navbar-nav > .open > a,\r\n.navbar-inverse .navbar-nav > .open > a:hover,\r\n.navbar-inverse .navbar-nav > .open > a:focus {\r\n  color: #fff;\r\n  background-color: #080808;\r\n}\r\n@media (max-width: 767px) {\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\r\n    border-color: #080808;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\r\n    background-color: #080808;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\r\n    color: #9d9d9d;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\r\n    color: #fff;\r\n    background-color: transparent;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {\r\n    color: #fff;\r\n    background-color: #080808;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {\r\n    color: #444;\r\n    background-color: transparent;\r\n  }\r\n}\r\n.navbar-inverse .navbar-link {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .navbar-link:hover {\r\n  color: #fff;\r\n}\r\n.navbar-inverse .btn-link {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .btn-link:hover,\r\n.navbar-inverse .btn-link:focus {\r\n  color: #fff;\r\n}\r\n.navbar-inverse .btn-link[disabled]:hover,\r\nfieldset[disabled] .navbar-inverse .btn-link:hover,\r\n.navbar-inverse .btn-link[disabled]:focus,\r\nfieldset[disabled] .navbar-inverse .btn-link:focus {\r\n  color: #444;\r\n}\r\n.breadcrumb {\r\n  padding: 8px 15px;\r\n  margin-bottom: 20px;\r\n  list-style: none;\r\n  background-color: #f5f5f5;\r\n  border-radius: 4px;\r\n}\r\n.breadcrumb > li {\r\n  display: inline-block;\r\n}\r\n.breadcrumb > li + li:before {\r\n  padding: 0 5px;\r\n  color: #ccc;\r\n  content: \"/\\A0\";\r\n}\r\n.breadcrumb > .active {\r\n  color: #777;\r\n}\r\n.pagination {\r\n  display: inline-block;\r\n  padding-left: 0;\r\n  margin: 20px 0;\r\n  border-radius: 4px;\r\n}\r\n.pagination > li {\r\n  display: inline;\r\n}\r\n.pagination > li > a,\r\n.pagination > li > span {\r\n  position: relative;\r\n  float: left;\r\n  padding: 6px 12px;\r\n  margin-left: -1px;\r\n  line-height: 1.42857143;\r\n  color: #337ab7;\r\n  text-decoration: none;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n}\r\n.pagination > li:first-child > a,\r\n.pagination > li:first-child > span {\r\n  margin-left: 0;\r\n  border-top-left-radius: 4px;\r\n  border-bottom-left-radius: 4px;\r\n}\r\n.pagination > li:last-child > a,\r\n.pagination > li:last-child > span {\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 4px;\r\n}\r\n.pagination > li > a:hover,\r\n.pagination > li > span:hover,\r\n.pagination > li > a:focus,\r\n.pagination > li > span:focus {\r\n  z-index: 2;\r\n  color: #23527c;\r\n  background-color: #eee;\r\n  border-color: #ddd;\r\n}\r\n.pagination > .active > a,\r\n.pagination > .active > span,\r\n.pagination > .active > a:hover,\r\n.pagination > .active > span:hover,\r\n.pagination > .active > a:focus,\r\n.pagination > .active > span:focus {\r\n  z-index: 3;\r\n  color: #fff;\r\n  cursor: default;\r\n  background-color: #337ab7;\r\n  border-color: #337ab7;\r\n}\r\n.pagination > .disabled > span,\r\n.pagination > .disabled > span:hover,\r\n.pagination > .disabled > span:focus,\r\n.pagination > .disabled > a,\r\n.pagination > .disabled > a:hover,\r\n.pagination > .disabled > a:focus {\r\n  color: #777;\r\n  cursor: not-allowed;\r\n  background-color: #fff;\r\n  border-color: #ddd;\r\n}\r\n.pagination-lg > li > a,\r\n.pagination-lg > li > span {\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n}\r\n.pagination-lg > li:first-child > a,\r\n.pagination-lg > li:first-child > span {\r\n  border-top-left-radius: 6px;\r\n  border-bottom-left-radius: 6px;\r\n}\r\n.pagination-lg > li:last-child > a,\r\n.pagination-lg > li:last-child > span {\r\n  border-top-right-radius: 6px;\r\n  border-bottom-right-radius: 6px;\r\n}\r\n.pagination-sm > li > a,\r\n.pagination-sm > li > span {\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n}\r\n.pagination-sm > li:first-child > a,\r\n.pagination-sm > li:first-child > span {\r\n  border-top-left-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.pagination-sm > li:last-child > a,\r\n.pagination-sm > li:last-child > span {\r\n  border-top-right-radius: 3px;\r\n  border-bottom-right-radius: 3px;\r\n}\r\n.pager {\r\n  padding-left: 0;\r\n  margin: 20px 0;\r\n  text-align: center;\r\n  list-style: none;\r\n}\r\n.pager li {\r\n  display: inline;\r\n}\r\n.pager li > a,\r\n.pager li > span {\r\n  display: inline-block;\r\n  padding: 5px 14px;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n  border-radius: 15px;\r\n}\r\n.pager li > a:hover,\r\n.pager li > a:focus {\r\n  text-decoration: none;\r\n  background-color: #eee;\r\n}\r\n.pager .next > a,\r\n.pager .next > span {\r\n  float: right;\r\n}\r\n.pager .previous > a,\r\n.pager .previous > span {\r\n  float: left;\r\n}\r\n.pager .disabled > a,\r\n.pager .disabled > a:hover,\r\n.pager .disabled > a:focus,\r\n.pager .disabled > span {\r\n  color: #777;\r\n  cursor: not-allowed;\r\n  background-color: #fff;\r\n}\r\n.label {\r\n  display: inline;\r\n  padding: .2em .6em .3em;\r\n  font-size: 75%;\r\n  font-weight: bold;\r\n  line-height: 1;\r\n  color: #fff;\r\n  text-align: center;\r\n  white-space: nowrap;\r\n  vertical-align: baseline;\r\n  border-radius: .25em;\r\n}\r\na.label:hover,\r\na.label:focus {\r\n  color: #fff;\r\n  text-decoration: none;\r\n  cursor: pointer;\r\n}\r\n.label:empty {\r\n  display: none;\r\n}\r\n.btn .label {\r\n  position: relative;\r\n  top: -1px;\r\n}\r\n.label-default {\r\n  background-color: #777;\r\n}\r\n.label-default[href]:hover,\r\n.label-default[href]:focus {\r\n  background-color: #5e5e5e;\r\n}\r\n.label-primary {\r\n  background-color: #337ab7;\r\n}\r\n.label-primary[href]:hover,\r\n.label-primary[href]:focus {\r\n  background-color: #286090;\r\n}\r\n.label-success {\r\n  background-color: #5cb85c;\r\n}\r\n.label-success[href]:hover,\r\n.label-success[href]:focus {\r\n  background-color: #449d44;\r\n}\r\n.label-info {\r\n  background-color: #5bc0de;\r\n}\r\n.label-info[href]:hover,\r\n.label-info[href]:focus {\r\n  background-color: #31b0d5;\r\n}\r\n.label-warning {\r\n  background-color: #f0ad4e;\r\n}\r\n.label-warning[href]:hover,\r\n.label-warning[href]:focus {\r\n  background-color: #ec971f;\r\n}\r\n.label-danger {\r\n  background-color: #d9534f;\r\n}\r\n.label-danger[href]:hover,\r\n.label-danger[href]:focus {\r\n  background-color: #c9302c;\r\n}\r\n.badge {\r\n  display: inline-block;\r\n  min-width: 10px;\r\n  padding: 3px 7px;\r\n  font-size: 12px;\r\n  font-weight: bold;\r\n  line-height: 1;\r\n  color: #fff;\r\n  text-align: center;\r\n  white-space: nowrap;\r\n  vertical-align: middle;\r\n  background-color: #777;\r\n  border-radius: 10px;\r\n}\r\n.badge:empty {\r\n  display: none;\r\n}\r\n.btn .badge {\r\n  position: relative;\r\n  top: -1px;\r\n}\r\n.btn-xs .badge,\r\n.btn-group-xs > .btn .badge {\r\n  top: 0;\r\n  padding: 1px 5px;\r\n}\r\na.badge:hover,\r\na.badge:focus {\r\n  color: #fff;\r\n  text-decoration: none;\r\n  cursor: pointer;\r\n}\r\n.list-group-item.active > .badge,\r\n.nav-pills > .active > a > .badge {\r\n  color: #337ab7;\r\n  background-color: #fff;\r\n}\r\n.list-group-item > .badge {\r\n  float: right;\r\n}\r\n.list-group-item > .badge + .badge {\r\n  margin-right: 5px;\r\n}\r\n.nav-pills > li > a > .badge {\r\n  margin-left: 3px;\r\n}\r\n.jumbotron {\r\n  padding-top: 30px;\r\n  padding-bottom: 30px;\r\n  margin-bottom: 30px;\r\n  color: inherit;\r\n  background-color: #eee;\r\n}\r\n.jumbotron h1,\r\n.jumbotron .h1 {\r\n  color: inherit;\r\n}\r\n.jumbotron p {\r\n  margin-bottom: 15px;\r\n  font-size: 21px;\r\n  font-weight: 200;\r\n}\r\n.jumbotron > hr {\r\n  border-top-color: #d5d5d5;\r\n}\r\n.container .jumbotron,\r\n.container-fluid .jumbotron {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  border-radius: 6px;\r\n}\r\n.jumbotron .container {\r\n  max-width: 100%;\r\n}\r\n@media screen and (min-width: 768px) {\r\n  .jumbotron {\r\n    padding-top: 48px;\r\n    padding-bottom: 48px;\r\n  }\r\n  .container .jumbotron,\r\n  .container-fluid .jumbotron {\r\n    padding-right: 60px;\r\n    padding-left: 60px;\r\n  }\r\n  .jumbotron h1,\r\n  .jumbotron .h1 {\r\n    font-size: 63px;\r\n  }\r\n}\r\n.thumbnail {\r\n  display: block;\r\n  padding: 4px;\r\n  margin-bottom: 20px;\r\n  line-height: 1.42857143;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n  border-radius: 4px;\r\n  -webkit-transition: border .2s ease-in-out;\r\n       -o-transition: border .2s ease-in-out;\r\n          transition: border .2s ease-in-out;\r\n}\r\n.thumbnail > img,\r\n.thumbnail a > img {\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n}\r\na.thumbnail:hover,\r\na.thumbnail:focus,\r\na.thumbnail.active {\r\n  border-color: #337ab7;\r\n}\r\n.thumbnail .caption {\r\n  padding: 9px;\r\n  color: #333;\r\n}\r\n.alert {\r\n  padding: 15px;\r\n  margin-bottom: 20px;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px;\r\n}\r\n.alert h4 {\r\n  margin-top: 0;\r\n  color: inherit;\r\n}\r\n.alert .alert-link {\r\n  font-weight: bold;\r\n}\r\n.alert > p,\r\n.alert > ul {\r\n  margin-bottom: 0;\r\n}\r\n.alert > p + p {\r\n  margin-top: 5px;\r\n}\r\n.alert-dismissable,\r\n.alert-dismissible {\r\n  padding-right: 35px;\r\n}\r\n.alert-dismissable .close,\r\n.alert-dismissible .close {\r\n  position: relative;\r\n  top: -2px;\r\n  right: -21px;\r\n  color: inherit;\r\n}\r\n.alert-success {\r\n  color: #3c763d;\r\n  background-color: #dff0d8;\r\n  border-color: #d6e9c6;\r\n}\r\n.alert-success hr {\r\n  border-top-color: #c9e2b3;\r\n}\r\n.alert-success .alert-link {\r\n  color: #2b542c;\r\n}\r\n.alert-info {\r\n  color: #31708f;\r\n  background-color: #d9edf7;\r\n  border-color: #bce8f1;\r\n}\r\n.alert-info hr {\r\n  border-top-color: #a6e1ec;\r\n}\r\n.alert-info .alert-link {\r\n  color: #245269;\r\n}\r\n.alert-warning {\r\n  color: #8a6d3b;\r\n  background-color: #fcf8e3;\r\n  border-color: #faebcc;\r\n}\r\n.alert-warning hr {\r\n  border-top-color: #f7e1b5;\r\n}\r\n.alert-warning .alert-link {\r\n  color: #66512c;\r\n}\r\n.alert-danger {\r\n  color: #a94442;\r\n  background-color: #f2dede;\r\n  border-color: #ebccd1;\r\n}\r\n.alert-danger hr {\r\n  border-top-color: #e4b9c0;\r\n}\r\n.alert-danger .alert-link {\r\n  color: #843534;\r\n}\r\n@-webkit-keyframes progress-bar-stripes {\r\n  from {\r\n    background-position: 40px 0;\r\n  }\r\n  to {\r\n    background-position: 0 0;\r\n  }\r\n}\r\n@-o-keyframes progress-bar-stripes {\r\n  from {\r\n    background-position: 40px 0;\r\n  }\r\n  to {\r\n    background-position: 0 0;\r\n  }\r\n}\r\n@keyframes progress-bar-stripes {\r\n  from {\r\n    background-position: 40px 0;\r\n  }\r\n  to {\r\n    background-position: 0 0;\r\n  }\r\n}\r\n.progress {\r\n  height: 20px;\r\n  margin-bottom: 20px;\r\n  overflow: hidden;\r\n  background-color: #f5f5f5;\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);\r\n          box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);\r\n}\r\n.progress-bar {\r\n  float: left;\r\n  width: 0;\r\n  height: 100%;\r\n  font-size: 12px;\r\n  line-height: 20px;\r\n  color: #fff;\r\n  text-align: center;\r\n  background-color: #337ab7;\r\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);\r\n          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);\r\n  -webkit-transition: width .6s ease;\r\n       -o-transition: width .6s ease;\r\n          transition: width .6s ease;\r\n}\r\n.progress-striped .progress-bar,\r\n.progress-bar-striped {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  -webkit-background-size: 40px 40px;\r\n          background-size: 40px 40px;\r\n}\r\n.progress.active .progress-bar,\r\n.progress-bar.active {\r\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\r\n       -o-animation: progress-bar-stripes 2s linear infinite;\r\n          animation: progress-bar-stripes 2s linear infinite;\r\n}\r\n.progress-bar-success {\r\n  background-color: #5cb85c;\r\n}\r\n.progress-striped .progress-bar-success {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n}\r\n.progress-bar-info {\r\n  background-color: #5bc0de;\r\n}\r\n.progress-striped .progress-bar-info {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n}\r\n.progress-bar-warning {\r\n  background-color: #f0ad4e;\r\n}\r\n.progress-striped .progress-bar-warning {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n}\r\n.progress-bar-danger {\r\n  background-color: #d9534f;\r\n}\r\n.progress-striped .progress-bar-danger {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n}\r\n.media {\r\n  margin-top: 15px;\r\n}\r\n.media:first-child {\r\n  margin-top: 0;\r\n}\r\n.media,\r\n.media-body {\r\n  overflow: hidden;\r\n  zoom: 1;\r\n}\r\n.media-body {\r\n  width: 10000px;\r\n}\r\n.media-object {\r\n  display: block;\r\n}\r\n.media-object.img-thumbnail {\r\n  max-width: none;\r\n}\r\n.media-right,\r\n.media > .pull-right {\r\n  padding-left: 10px;\r\n}\r\n.media-left,\r\n.media > .pull-left {\r\n  padding-right: 10px;\r\n}\r\n.media-left,\r\n.media-right,\r\n.media-body {\r\n  display: table-cell;\r\n  vertical-align: top;\r\n}\r\n.media-middle {\r\n  vertical-align: middle;\r\n}\r\n.media-bottom {\r\n  vertical-align: bottom;\r\n}\r\n.media-heading {\r\n  margin-top: 0;\r\n  margin-bottom: 5px;\r\n}\r\n.media-list {\r\n  padding-left: 0;\r\n  list-style: none;\r\n}\r\n.list-group {\r\n  padding-left: 0;\r\n  margin-bottom: 20px;\r\n}\r\n.list-group-item {\r\n  position: relative;\r\n  display: block;\r\n  padding: 10px 15px;\r\n  margin-bottom: -1px;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n}\r\n.list-group-item:first-child {\r\n  border-top-left-radius: 4px;\r\n  border-top-right-radius: 4px;\r\n}\r\n.list-group-item:last-child {\r\n  margin-bottom: 0;\r\n  border-bottom-right-radius: 4px;\r\n  border-bottom-left-radius: 4px;\r\n}\r\na.list-group-item,\r\nbutton.list-group-item {\r\n  color: #555;\r\n}\r\na.list-group-item .list-group-item-heading,\r\nbutton.list-group-item .list-group-item-heading {\r\n  color: #333;\r\n}\r\na.list-group-item:hover,\r\nbutton.list-group-item:hover,\r\na.list-group-item:focus,\r\nbutton.list-group-item:focus {\r\n  color: #555;\r\n  text-decoration: none;\r\n  background-color: #f5f5f5;\r\n}\r\nbutton.list-group-item {\r\n  width: 100%;\r\n  text-align: left;\r\n}\r\n.list-group-item.disabled,\r\n.list-group-item.disabled:hover,\r\n.list-group-item.disabled:focus {\r\n  color: #777;\r\n  cursor: not-allowed;\r\n  background-color: #eee;\r\n}\r\n.list-group-item.disabled .list-group-item-heading,\r\n.list-group-item.disabled:hover .list-group-item-heading,\r\n.list-group-item.disabled:focus .list-group-item-heading {\r\n  color: inherit;\r\n}\r\n.list-group-item.disabled .list-group-item-text,\r\n.list-group-item.disabled:hover .list-group-item-text,\r\n.list-group-item.disabled:focus .list-group-item-text {\r\n  color: #777;\r\n}\r\n.list-group-item.active,\r\n.list-group-item.active:hover,\r\n.list-group-item.active:focus {\r\n  z-index: 2;\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n  border-color: #337ab7;\r\n}\r\n.list-group-item.active .list-group-item-heading,\r\n.list-group-item.active:hover .list-group-item-heading,\r\n.list-group-item.active:focus .list-group-item-heading,\r\n.list-group-item.active .list-group-item-heading > small,\r\n.list-group-item.active:hover .list-group-item-heading > small,\r\n.list-group-item.active:focus .list-group-item-heading > small,\r\n.list-group-item.active .list-group-item-heading > .small,\r\n.list-group-item.active:hover .list-group-item-heading > .small,\r\n.list-group-item.active:focus .list-group-item-heading > .small {\r\n  color: inherit;\r\n}\r\n.list-group-item.active .list-group-item-text,\r\n.list-group-item.active:hover .list-group-item-text,\r\n.list-group-item.active:focus .list-group-item-text {\r\n  color: #c7ddef;\r\n}\r\n.list-group-item-success {\r\n  color: #3c763d;\r\n  background-color: #dff0d8;\r\n}\r\na.list-group-item-success,\r\nbutton.list-group-item-success {\r\n  color: #3c763d;\r\n}\r\na.list-group-item-success .list-group-item-heading,\r\nbutton.list-group-item-success .list-group-item-heading {\r\n  color: inherit;\r\n}\r\na.list-group-item-success:hover,\r\nbutton.list-group-item-success:hover,\r\na.list-group-item-success:focus,\r\nbutton.list-group-item-success:focus {\r\n  color: #3c763d;\r\n  background-color: #d0e9c6;\r\n}\r\na.list-group-item-success.active,\r\nbutton.list-group-item-success.active,\r\na.list-group-item-success.active:hover,\r\nbutton.list-group-item-success.active:hover,\r\na.list-group-item-success.active:focus,\r\nbutton.list-group-item-success.active:focus {\r\n  color: #fff;\r\n  background-color: #3c763d;\r\n  border-color: #3c763d;\r\n}\r\n.list-group-item-info {\r\n  color: #31708f;\r\n  background-color: #d9edf7;\r\n}\r\na.list-group-item-info,\r\nbutton.list-group-item-info {\r\n  color: #31708f;\r\n}\r\na.list-group-item-info .list-group-item-heading,\r\nbutton.list-group-item-info .list-group-item-heading {\r\n  color: inherit;\r\n}\r\na.list-group-item-info:hover,\r\nbutton.list-group-item-info:hover,\r\na.list-group-item-info:focus,\r\nbutton.list-group-item-info:focus {\r\n  color: #31708f;\r\n  background-color: #c4e3f3;\r\n}\r\na.list-group-item-info.active,\r\nbutton.list-group-item-info.active,\r\na.list-group-item-info.active:hover,\r\nbutton.list-group-item-info.active:hover,\r\na.list-group-item-info.active:focus,\r\nbutton.list-group-item-info.active:focus {\r\n  color: #fff;\r\n  background-color: #31708f;\r\n  border-color: #31708f;\r\n}\r\n.list-group-item-warning {\r\n  color: #8a6d3b;\r\n  background-color: #fcf8e3;\r\n}\r\na.list-group-item-warning,\r\nbutton.list-group-item-warning {\r\n  color: #8a6d3b;\r\n}\r\na.list-group-item-warning .list-group-item-heading,\r\nbutton.list-group-item-warning .list-group-item-heading {\r\n  color: inherit;\r\n}\r\na.list-group-item-warning:hover,\r\nbutton.list-group-item-warning:hover,\r\na.list-group-item-warning:focus,\r\nbutton.list-group-item-warning:focus {\r\n  color: #8a6d3b;\r\n  background-color: #faf2cc;\r\n}\r\na.list-group-item-warning.active,\r\nbutton.list-group-item-warning.active,\r\na.list-group-item-warning.active:hover,\r\nbutton.list-group-item-warning.active:hover,\r\na.list-group-item-warning.active:focus,\r\nbutton.list-group-item-warning.active:focus {\r\n  color: #fff;\r\n  background-color: #8a6d3b;\r\n  border-color: #8a6d3b;\r\n}\r\n.list-group-item-danger {\r\n  color: #a94442;\r\n  background-color: #f2dede;\r\n}\r\na.list-group-item-danger,\r\nbutton.list-group-item-danger {\r\n  color: #a94442;\r\n}\r\na.list-group-item-danger .list-group-item-heading,\r\nbutton.list-group-item-danger .list-group-item-heading {\r\n  color: inherit;\r\n}\r\na.list-group-item-danger:hover,\r\nbutton.list-group-item-danger:hover,\r\na.list-group-item-danger:focus,\r\nbutton.list-group-item-danger:focus {\r\n  color: #a94442;\r\n  background-color: #ebcccc;\r\n}\r\na.list-group-item-danger.active,\r\nbutton.list-group-item-danger.active,\r\na.list-group-item-danger.active:hover,\r\nbutton.list-group-item-danger.active:hover,\r\na.list-group-item-danger.active:focus,\r\nbutton.list-group-item-danger.active:focus {\r\n  color: #fff;\r\n  background-color: #a94442;\r\n  border-color: #a94442;\r\n}\r\n.list-group-item-heading {\r\n  margin-top: 0;\r\n  margin-bottom: 5px;\r\n}\r\n.list-group-item-text {\r\n  margin-bottom: 0;\r\n  line-height: 1.3;\r\n}\r\n.panel {\r\n  margin-bottom: 20px;\r\n  background-color: #fff;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\r\n          box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\r\n}\r\n.panel-body {\r\n  padding: 15px;\r\n}\r\n.panel-heading {\r\n  padding: 10px 15px;\r\n  border-bottom: 1px solid transparent;\r\n  border-top-left-radius: 3px;\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel-heading > .dropdown .dropdown-toggle {\r\n  color: inherit;\r\n}\r\n.panel-title {\r\n  margin-top: 0;\r\n  margin-bottom: 0;\r\n  font-size: 16px;\r\n  color: inherit;\r\n}\r\n.panel-title > a,\r\n.panel-title > small,\r\n.panel-title > .small,\r\n.panel-title > small > a,\r\n.panel-title > .small > a {\r\n  color: inherit;\r\n}\r\n.panel-footer {\r\n  padding: 10px 15px;\r\n  background-color: #f5f5f5;\r\n  border-top: 1px solid #ddd;\r\n  border-bottom-right-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel > .list-group,\r\n.panel > .panel-collapse > .list-group {\r\n  margin-bottom: 0;\r\n}\r\n.panel > .list-group .list-group-item,\r\n.panel > .panel-collapse > .list-group .list-group-item {\r\n  border-width: 1px 0;\r\n  border-radius: 0;\r\n}\r\n.panel > .list-group:first-child .list-group-item:first-child,\r\n.panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\r\n  border-top: 0;\r\n  border-top-left-radius: 3px;\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel > .list-group:last-child .list-group-item:last-child,\r\n.panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\r\n  border-bottom: 0;\r\n  border-bottom-right-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {\r\n  border-top-left-radius: 0;\r\n  border-top-right-radius: 0;\r\n}\r\n.panel-heading + .list-group .list-group-item:first-child {\r\n  border-top-width: 0;\r\n}\r\n.list-group + .panel-footer {\r\n  border-top-width: 0;\r\n}\r\n.panel > .table,\r\n.panel > .table-responsive > .table,\r\n.panel > .panel-collapse > .table {\r\n  margin-bottom: 0;\r\n}\r\n.panel > .table caption,\r\n.panel > .table-responsive > .table caption,\r\n.panel > .panel-collapse > .table caption {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n}\r\n.panel > .table:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child {\r\n  border-top-left-radius: 3px;\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel > .table:first-child > thead:first-child > tr:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\r\n  border-top-left-radius: 3px;\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\r\n.panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\r\n  border-top-left-radius: 3px;\r\n}\r\n.panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\r\n.panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel > .table:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child {\r\n  border-bottom-right-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel > .table:last-child > tbody:last-child > tr:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\r\n  border-bottom-right-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\r\n.panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\r\n.panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\r\n  border-bottom-right-radius: 3px;\r\n}\r\n.panel > .panel-body + .table,\r\n.panel > .panel-body + .table-responsive,\r\n.panel > .table + .panel-body,\r\n.panel > .table-responsive + .panel-body {\r\n  border-top: 1px solid #ddd;\r\n}\r\n.panel > .table > tbody:first-child > tr:first-child th,\r\n.panel > .table > tbody:first-child > tr:first-child td {\r\n  border-top: 0;\r\n}\r\n.panel > .table-bordered,\r\n.panel > .table-responsive > .table-bordered {\r\n  border: 0;\r\n}\r\n.panel > .table-bordered > thead > tr > th:first-child,\r\n.panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\r\n.panel > .table-bordered > tbody > tr > th:first-child,\r\n.panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\r\n.panel > .table-bordered > tfoot > tr > th:first-child,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\r\n.panel > .table-bordered > thead > tr > td:first-child,\r\n.panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\r\n.panel > .table-bordered > tbody > tr > td:first-child,\r\n.panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\r\n.panel > .table-bordered > tfoot > tr > td:first-child,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\r\n  border-left: 0;\r\n}\r\n.panel > .table-bordered > thead > tr > th:last-child,\r\n.panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\r\n.panel > .table-bordered > tbody > tr > th:last-child,\r\n.panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\r\n.panel > .table-bordered > tfoot > tr > th:last-child,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\r\n.panel > .table-bordered > thead > tr > td:last-child,\r\n.panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\r\n.panel > .table-bordered > tbody > tr > td:last-child,\r\n.panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\r\n.panel > .table-bordered > tfoot > tr > td:last-child,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\r\n  border-right: 0;\r\n}\r\n.panel > .table-bordered > thead > tr:first-child > td,\r\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\r\n.panel > .table-bordered > tbody > tr:first-child > td,\r\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\r\n.panel > .table-bordered > thead > tr:first-child > th,\r\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\r\n.panel > .table-bordered > tbody > tr:first-child > th,\r\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\r\n  border-bottom: 0;\r\n}\r\n.panel > .table-bordered > tbody > tr:last-child > td,\r\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\r\n.panel > .table-bordered > tfoot > tr:last-child > td,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\r\n.panel > .table-bordered > tbody > tr:last-child > th,\r\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\r\n.panel > .table-bordered > tfoot > tr:last-child > th,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\r\n  border-bottom: 0;\r\n}\r\n.panel > .table-responsive {\r\n  margin-bottom: 0;\r\n  border: 0;\r\n}\r\n.panel-group {\r\n  margin-bottom: 20px;\r\n}\r\n.panel-group .panel {\r\n  margin-bottom: 0;\r\n  border-radius: 4px;\r\n}\r\n.panel-group .panel + .panel {\r\n  margin-top: 5px;\r\n}\r\n.panel-group .panel-heading {\r\n  border-bottom: 0;\r\n}\r\n.panel-group .panel-heading + .panel-collapse > .panel-body,\r\n.panel-group .panel-heading + .panel-collapse > .list-group {\r\n  border-top: 1px solid #ddd;\r\n}\r\n.panel-group .panel-footer {\r\n  border-top: 0;\r\n}\r\n.panel-group .panel-footer + .panel-collapse .panel-body {\r\n  border-bottom: 1px solid #ddd;\r\n}\r\n.panel-default {\r\n  border-color: #ddd;\r\n}\r\n.panel-default > .panel-heading {\r\n  color: #333;\r\n  background-color: #f5f5f5;\r\n  border-color: #ddd;\r\n}\r\n.panel-default > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #ddd;\r\n}\r\n.panel-default > .panel-heading .badge {\r\n  color: #f5f5f5;\r\n  background-color: #333;\r\n}\r\n.panel-default > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #ddd;\r\n}\r\n.panel-primary {\r\n  border-color: #337ab7;\r\n}\r\n.panel-primary > .panel-heading {\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n  border-color: #337ab7;\r\n}\r\n.panel-primary > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #337ab7;\r\n}\r\n.panel-primary > .panel-heading .badge {\r\n  color: #337ab7;\r\n  background-color: #fff;\r\n}\r\n.panel-primary > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #337ab7;\r\n}\r\n.panel-success {\r\n  border-color: #d6e9c6;\r\n}\r\n.panel-success > .panel-heading {\r\n  color: #3c763d;\r\n  background-color: #dff0d8;\r\n  border-color: #d6e9c6;\r\n}\r\n.panel-success > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #d6e9c6;\r\n}\r\n.panel-success > .panel-heading .badge {\r\n  color: #dff0d8;\r\n  background-color: #3c763d;\r\n}\r\n.panel-success > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #d6e9c6;\r\n}\r\n.panel-info {\r\n  border-color: #bce8f1;\r\n}\r\n.panel-info > .panel-heading {\r\n  color: #31708f;\r\n  background-color: #d9edf7;\r\n  border-color: #bce8f1;\r\n}\r\n.panel-info > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #bce8f1;\r\n}\r\n.panel-info > .panel-heading .badge {\r\n  color: #d9edf7;\r\n  background-color: #31708f;\r\n}\r\n.panel-info > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #bce8f1;\r\n}\r\n.panel-warning {\r\n  border-color: #faebcc;\r\n}\r\n.panel-warning > .panel-heading {\r\n  color: #8a6d3b;\r\n  background-color: #fcf8e3;\r\n  border-color: #faebcc;\r\n}\r\n.panel-warning > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #faebcc;\r\n}\r\n.panel-warning > .panel-heading .badge {\r\n  color: #fcf8e3;\r\n  background-color: #8a6d3b;\r\n}\r\n.panel-warning > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #faebcc;\r\n}\r\n.panel-danger {\r\n  border-color: #ebccd1;\r\n}\r\n.panel-danger > .panel-heading {\r\n  color: #a94442;\r\n  background-color: #f2dede;\r\n  border-color: #ebccd1;\r\n}\r\n.panel-danger > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #ebccd1;\r\n}\r\n.panel-danger > .panel-heading .badge {\r\n  color: #f2dede;\r\n  background-color: #a94442;\r\n}\r\n.panel-danger > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #ebccd1;\r\n}\r\n.embed-responsive {\r\n  position: relative;\r\n  display: block;\r\n  height: 0;\r\n  padding: 0;\r\n  overflow: hidden;\r\n}\r\n.embed-responsive .embed-responsive-item,\r\n.embed-responsive iframe,\r\n.embed-responsive embed,\r\n.embed-responsive object,\r\n.embed-responsive video {\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  border: 0;\r\n}\r\n.embed-responsive-16by9 {\r\n  padding-bottom: 56.25%;\r\n}\r\n.embed-responsive-4by3 {\r\n  padding-bottom: 75%;\r\n}\r\n.well {\r\n  min-height: 20px;\r\n  padding: 19px;\r\n  margin-bottom: 20px;\r\n  background-color: #f5f5f5;\r\n  border: 1px solid #e3e3e3;\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);\r\n}\r\n.well blockquote {\r\n  border-color: #ddd;\r\n  border-color: rgba(0, 0, 0, .15);\r\n}\r\n.well-lg {\r\n  padding: 24px;\r\n  border-radius: 6px;\r\n}\r\n.well-sm {\r\n  padding: 9px;\r\n  border-radius: 3px;\r\n}\r\n.close {\r\n  float: right;\r\n  font-size: 21px;\r\n  font-weight: bold;\r\n  line-height: 1;\r\n  color: #000;\r\n  text-shadow: 0 1px 0 #fff;\r\n  filter: alpha(opacity=20);\r\n  opacity: .2;\r\n}\r\n.close:hover,\r\n.close:focus {\r\n  color: #000;\r\n  text-decoration: none;\r\n  cursor: pointer;\r\n  filter: alpha(opacity=50);\r\n  opacity: .5;\r\n}\r\nbutton.close {\r\n  -webkit-appearance: none;\r\n  padding: 0;\r\n  cursor: pointer;\r\n  background: transparent;\r\n  border: 0;\r\n}\r\n.modal-open {\r\n  overflow: hidden;\r\n}\r\n.modal {\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index: 1050;\r\n  display: none;\r\n  overflow: hidden;\r\n  -webkit-overflow-scrolling: touch;\r\n  outline: 0;\r\n}\r\n.modal.fade .modal-dialog {\r\n  -webkit-transition: -webkit-transform .3s ease-out;\r\n       -o-transition:      -o-transform .3s ease-out;\r\n          transition:         transform .3s ease-out;\r\n  -webkit-transform: translate(0, -25%);\r\n      -ms-transform: translate(0, -25%);\r\n       -o-transform: translate(0, -25%);\r\n          transform: translate(0, -25%);\r\n}\r\n.modal.in .modal-dialog {\r\n  -webkit-transform: translate(0, 0);\r\n      -ms-transform: translate(0, 0);\r\n       -o-transform: translate(0, 0);\r\n          transform: translate(0, 0);\r\n}\r\n.modal-open .modal {\r\n  overflow-x: hidden;\r\n  overflow-y: auto;\r\n}\r\n.modal-dialog {\r\n  position: relative;\r\n  width: auto;\r\n  margin: 10px;\r\n}\r\n.modal-content {\r\n  position: relative;\r\n  background-color: #fff;\r\n  -webkit-background-clip: padding-box;\r\n          background-clip: padding-box;\r\n  border: 1px solid #999;\r\n  border: 1px solid rgba(0, 0, 0, .2);\r\n  border-radius: 6px;\r\n  outline: 0;\r\n  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, .5);\r\n          box-shadow: 0 3px 9px rgba(0, 0, 0, .5);\r\n}\r\n.modal-backdrop {\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index: 1040;\r\n  background-color: #000;\r\n}\r\n.modal-backdrop.fade {\r\n  filter: alpha(opacity=0);\r\n  opacity: 0;\r\n}\r\n.modal-backdrop.in {\r\n  filter: alpha(opacity=50);\r\n  opacity: .5;\r\n}\r\n.modal-header {\r\n  padding: 15px;\r\n  border-bottom: 1px solid #e5e5e5;\r\n}\r\n.modal-header .close {\r\n  margin-top: -2px;\r\n}\r\n.modal-title {\r\n  margin: 0;\r\n  line-height: 1.42857143;\r\n}\r\n.modal-body {\r\n  position: relative;\r\n  padding: 15px;\r\n}\r\n.modal-footer {\r\n  padding: 15px;\r\n  text-align: right;\r\n  border-top: 1px solid #e5e5e5;\r\n}\r\n.modal-footer .btn + .btn {\r\n  margin-bottom: 0;\r\n  margin-left: 5px;\r\n}\r\n.modal-footer .btn-group .btn + .btn {\r\n  margin-left: -1px;\r\n}\r\n.modal-footer .btn-block + .btn-block {\r\n  margin-left: 0;\r\n}\r\n.modal-scrollbar-measure {\r\n  position: absolute;\r\n  top: -9999px;\r\n  width: 50px;\r\n  height: 50px;\r\n  overflow: scroll;\r\n}\r\n@media (min-width: 768px) {\r\n  .modal-dialog {\r\n    width: 600px;\r\n    margin: 30px auto;\r\n  }\r\n  .modal-content {\r\n    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, .5);\r\n            box-shadow: 0 5px 15px rgba(0, 0, 0, .5);\r\n  }\r\n  .modal-sm {\r\n    width: 300px;\r\n  }\r\n}\r\n@media (min-width: 992px) {\r\n  .modal-lg {\r\n    width: 900px;\r\n  }\r\n}\r\n.tooltip {\r\n  position: absolute;\r\n  z-index: 1070;\r\n  display: block;\r\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n  font-size: 12px;\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  line-height: 1.42857143;\r\n  text-align: left;\r\n  text-align: start;\r\n  text-decoration: none;\r\n  text-shadow: none;\r\n  text-transform: none;\r\n  letter-spacing: normal;\r\n  word-break: normal;\r\n  word-spacing: normal;\r\n  word-wrap: normal;\r\n  white-space: normal;\r\n  filter: alpha(opacity=0);\r\n  opacity: 0;\r\n\r\n  line-break: auto;\r\n}\r\n.tooltip.in {\r\n  filter: alpha(opacity=90);\r\n  opacity: .9;\r\n}\r\n.tooltip.top {\r\n  padding: 5px 0;\r\n  margin-top: -3px;\r\n}\r\n.tooltip.right {\r\n  padding: 0 5px;\r\n  margin-left: 3px;\r\n}\r\n.tooltip.bottom {\r\n  padding: 5px 0;\r\n  margin-top: 3px;\r\n}\r\n.tooltip.left {\r\n  padding: 0 5px;\r\n  margin-left: -3px;\r\n}\r\n.tooltip-inner {\r\n  max-width: 200px;\r\n  padding: 3px 8px;\r\n  color: #fff;\r\n  text-align: center;\r\n  background-color: #000;\r\n  border-radius: 4px;\r\n}\r\n.tooltip-arrow {\r\n  position: absolute;\r\n  width: 0;\r\n  height: 0;\r\n  border-color: transparent;\r\n  border-style: solid;\r\n}\r\n.tooltip.top .tooltip-arrow {\r\n  bottom: 0;\r\n  left: 50%;\r\n  margin-left: -5px;\r\n  border-width: 5px 5px 0;\r\n  border-top-color: #000;\r\n}\r\n.tooltip.top-left .tooltip-arrow {\r\n  right: 5px;\r\n  bottom: 0;\r\n  margin-bottom: -5px;\r\n  border-width: 5px 5px 0;\r\n  border-top-color: #000;\r\n}\r\n.tooltip.top-right .tooltip-arrow {\r\n  bottom: 0;\r\n  left: 5px;\r\n  margin-bottom: -5px;\r\n  border-width: 5px 5px 0;\r\n  border-top-color: #000;\r\n}\r\n.tooltip.right .tooltip-arrow {\r\n  top: 50%;\r\n  left: 0;\r\n  margin-top: -5px;\r\n  border-width: 5px 5px 5px 0;\r\n  border-right-color: #000;\r\n}\r\n.tooltip.left .tooltip-arrow {\r\n  top: 50%;\r\n  right: 0;\r\n  margin-top: -5px;\r\n  border-width: 5px 0 5px 5px;\r\n  border-left-color: #000;\r\n}\r\n.tooltip.bottom .tooltip-arrow {\r\n  top: 0;\r\n  left: 50%;\r\n  margin-left: -5px;\r\n  border-width: 0 5px 5px;\r\n  border-bottom-color: #000;\r\n}\r\n.tooltip.bottom-left .tooltip-arrow {\r\n  top: 0;\r\n  right: 5px;\r\n  margin-top: -5px;\r\n  border-width: 0 5px 5px;\r\n  border-bottom-color: #000;\r\n}\r\n.tooltip.bottom-right .tooltip-arrow {\r\n  top: 0;\r\n  left: 5px;\r\n  margin-top: -5px;\r\n  border-width: 0 5px 5px;\r\n  border-bottom-color: #000;\r\n}\r\n.popover {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: 1060;\r\n  display: none;\r\n  max-width: 276px;\r\n  padding: 1px;\r\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n  font-size: 14px;\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  line-height: 1.42857143;\r\n  text-align: left;\r\n  text-align: start;\r\n  text-decoration: none;\r\n  text-shadow: none;\r\n  text-transform: none;\r\n  letter-spacing: normal;\r\n  word-break: normal;\r\n  word-spacing: normal;\r\n  word-wrap: normal;\r\n  white-space: normal;\r\n  background-color: #fff;\r\n  -webkit-background-clip: padding-box;\r\n          background-clip: padding-box;\r\n  border: 1px solid #ccc;\r\n  border: 1px solid rgba(0, 0, 0, .2);\r\n  border-radius: 6px;\r\n  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .2);\r\n          box-shadow: 0 5px 10px rgba(0, 0, 0, .2);\r\n\r\n  line-break: auto;\r\n}\r\n.popover.top {\r\n  margin-top: -10px;\r\n}\r\n.popover.right {\r\n  margin-left: 10px;\r\n}\r\n.popover.bottom {\r\n  margin-top: 10px;\r\n}\r\n.popover.left {\r\n  margin-left: -10px;\r\n}\r\n.popover-title {\r\n  padding: 8px 14px;\r\n  margin: 0;\r\n  font-size: 14px;\r\n  background-color: #f7f7f7;\r\n  border-bottom: 1px solid #ebebeb;\r\n  border-radius: 5px 5px 0 0;\r\n}\r\n.popover-content {\r\n  padding: 9px 14px;\r\n}\r\n.popover > .arrow,\r\n.popover > .arrow:after {\r\n  position: absolute;\r\n  display: block;\r\n  width: 0;\r\n  height: 0;\r\n  border-color: transparent;\r\n  border-style: solid;\r\n}\r\n.popover > .arrow {\r\n  border-width: 11px;\r\n}\r\n.popover > .arrow:after {\r\n  content: \"\";\r\n  border-width: 10px;\r\n}\r\n.popover.top > .arrow {\r\n  bottom: -11px;\r\n  left: 50%;\r\n  margin-left: -11px;\r\n  border-top-color: #999;\r\n  border-top-color: rgba(0, 0, 0, .25);\r\n  border-bottom-width: 0;\r\n}\r\n.popover.top > .arrow:after {\r\n  bottom: 1px;\r\n  margin-left: -10px;\r\n  content: \" \";\r\n  border-top-color: #fff;\r\n  border-bottom-width: 0;\r\n}\r\n.popover.right > .arrow {\r\n  top: 50%;\r\n  left: -11px;\r\n  margin-top: -11px;\r\n  border-right-color: #999;\r\n  border-right-color: rgba(0, 0, 0, .25);\r\n  border-left-width: 0;\r\n}\r\n.popover.right > .arrow:after {\r\n  bottom: -10px;\r\n  left: 1px;\r\n  content: \" \";\r\n  border-right-color: #fff;\r\n  border-left-width: 0;\r\n}\r\n.popover.bottom > .arrow {\r\n  top: -11px;\r\n  left: 50%;\r\n  margin-left: -11px;\r\n  border-top-width: 0;\r\n  border-bottom-color: #999;\r\n  border-bottom-color: rgba(0, 0, 0, .25);\r\n}\r\n.popover.bottom > .arrow:after {\r\n  top: 1px;\r\n  margin-left: -10px;\r\n  content: \" \";\r\n  border-top-width: 0;\r\n  border-bottom-color: #fff;\r\n}\r\n.popover.left > .arrow {\r\n  top: 50%;\r\n  right: -11px;\r\n  margin-top: -11px;\r\n  border-right-width: 0;\r\n  border-left-color: #999;\r\n  border-left-color: rgba(0, 0, 0, .25);\r\n}\r\n.popover.left > .arrow:after {\r\n  right: 1px;\r\n  bottom: -10px;\r\n  content: \" \";\r\n  border-right-width: 0;\r\n  border-left-color: #fff;\r\n}\r\n.carousel {\r\n  position: relative;\r\n}\r\n.carousel-inner {\r\n  position: relative;\r\n  width: 100%;\r\n  overflow: hidden;\r\n}\r\n.carousel-inner > .item {\r\n  position: relative;\r\n  display: none;\r\n  -webkit-transition: .6s ease-in-out left;\r\n       -o-transition: .6s ease-in-out left;\r\n          transition: .6s ease-in-out left;\r\n}\r\n.carousel-inner > .item > img,\r\n.carousel-inner > .item > a > img {\r\n  line-height: 1;\r\n}\r\n@media all and (transform-3d), (-webkit-transform-3d) {\r\n  .carousel-inner > .item {\r\n    -webkit-transition: -webkit-transform .6s ease-in-out;\r\n         -o-transition:      -o-transform .6s ease-in-out;\r\n            transition:         transform .6s ease-in-out;\r\n\r\n    -webkit-backface-visibility: hidden;\r\n            backface-visibility: hidden;\r\n    -webkit-perspective: 1000px;\r\n            perspective: 1000px;\r\n  }\r\n  .carousel-inner > .item.next,\r\n  .carousel-inner > .item.active.right {\r\n    left: 0;\r\n    -webkit-transform: translate3d(100%, 0, 0);\r\n            transform: translate3d(100%, 0, 0);\r\n  }\r\n  .carousel-inner > .item.prev,\r\n  .carousel-inner > .item.active.left {\r\n    left: 0;\r\n    -webkit-transform: translate3d(-100%, 0, 0);\r\n            transform: translate3d(-100%, 0, 0);\r\n  }\r\n  .carousel-inner > .item.next.left,\r\n  .carousel-inner > .item.prev.right,\r\n  .carousel-inner > .item.active {\r\n    left: 0;\r\n    -webkit-transform: translate3d(0, 0, 0);\r\n            transform: translate3d(0, 0, 0);\r\n  }\r\n}\r\n.carousel-inner > .active,\r\n.carousel-inner > .next,\r\n.carousel-inner > .prev {\r\n  display: block;\r\n}\r\n.carousel-inner > .active {\r\n  left: 0;\r\n}\r\n.carousel-inner > .next,\r\n.carousel-inner > .prev {\r\n  position: absolute;\r\n  top: 0;\r\n  width: 100%;\r\n}\r\n.carousel-inner > .next {\r\n  left: 100%;\r\n}\r\n.carousel-inner > .prev {\r\n  left: -100%;\r\n}\r\n.carousel-inner > .next.left,\r\n.carousel-inner > .prev.right {\r\n  left: 0;\r\n}\r\n.carousel-inner > .active.left {\r\n  left: -100%;\r\n}\r\n.carousel-inner > .active.right {\r\n  left: 100%;\r\n}\r\n.carousel-control {\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  width: 15%;\r\n  font-size: 20px;\r\n  color: #fff;\r\n  text-align: center;\r\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);\r\n  background-color: rgba(0, 0, 0, 0);\r\n  filter: alpha(opacity=50);\r\n  opacity: .5;\r\n}\r\n.carousel-control.left {\r\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\r\n  background-image:      -o-linear-gradient(left, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\r\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, .5)), to(rgba(0, 0, 0, .0001)));\r\n  background-image:         linear-gradient(to right, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1);\r\n  background-repeat: repeat-x;\r\n}\r\n.carousel-control.right {\r\n  right: 0;\r\n  left: auto;\r\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\r\n  background-image:      -o-linear-gradient(left, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\r\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, .0001)), to(rgba(0, 0, 0, .5)));\r\n  background-image:         linear-gradient(to right, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1);\r\n  background-repeat: repeat-x;\r\n}\r\n.carousel-control:hover,\r\n.carousel-control:focus {\r\n  color: #fff;\r\n  text-decoration: none;\r\n  filter: alpha(opacity=90);\r\n  outline: 0;\r\n  opacity: .9;\r\n}\r\n.carousel-control .icon-prev,\r\n.carousel-control .icon-next,\r\n.carousel-control .glyphicon-chevron-left,\r\n.carousel-control .glyphicon-chevron-right {\r\n  position: absolute;\r\n  top: 50%;\r\n  z-index: 5;\r\n  display: inline-block;\r\n  margin-top: -10px;\r\n}\r\n.carousel-control .icon-prev,\r\n.carousel-control .glyphicon-chevron-left {\r\n  left: 50%;\r\n  margin-left: -10px;\r\n}\r\n.carousel-control .icon-next,\r\n.carousel-control .glyphicon-chevron-right {\r\n  right: 50%;\r\n  margin-right: -10px;\r\n}\r\n.carousel-control .icon-prev,\r\n.carousel-control .icon-next {\r\n  width: 20px;\r\n  height: 20px;\r\n  font-family: serif;\r\n  line-height: 1;\r\n}\r\n.carousel-control .icon-prev:before {\r\n  content: '\\2039';\r\n}\r\n.carousel-control .icon-next:before {\r\n  content: '\\203A';\r\n}\r\n.carousel-indicators {\r\n  position: absolute;\r\n  bottom: 10px;\r\n  left: 50%;\r\n  z-index: 15;\r\n  width: 60%;\r\n  padding-left: 0;\r\n  margin-left: -30%;\r\n  text-align: center;\r\n  list-style: none;\r\n}\r\n.carousel-indicators li {\r\n  display: inline-block;\r\n  width: 10px;\r\n  height: 10px;\r\n  margin: 1px;\r\n  text-indent: -999px;\r\n  cursor: pointer;\r\n  background-color: #000 \\9;\r\n  background-color: rgba(0, 0, 0, 0);\r\n  border: 1px solid #fff;\r\n  border-radius: 10px;\r\n}\r\n.carousel-indicators .active {\r\n  width: 12px;\r\n  height: 12px;\r\n  margin: 0;\r\n  background-color: #fff;\r\n}\r\n.carousel-caption {\r\n  position: absolute;\r\n  right: 15%;\r\n  bottom: 20px;\r\n  left: 15%;\r\n  z-index: 10;\r\n  padding-top: 20px;\r\n  padding-bottom: 20px;\r\n  color: #fff;\r\n  text-align: center;\r\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);\r\n}\r\n.carousel-caption .btn {\r\n  text-shadow: none;\r\n}\r\n@media screen and (min-width: 768px) {\r\n  .carousel-control .glyphicon-chevron-left,\r\n  .carousel-control .glyphicon-chevron-right,\r\n  .carousel-control .icon-prev,\r\n  .carousel-control .icon-next {\r\n    width: 30px;\r\n    height: 30px;\r\n    margin-top: -10px;\r\n    font-size: 30px;\r\n  }\r\n  .carousel-control .glyphicon-chevron-left,\r\n  .carousel-control .icon-prev {\r\n    margin-left: -10px;\r\n  }\r\n  .carousel-control .glyphicon-chevron-right,\r\n  .carousel-control .icon-next {\r\n    margin-right: -10px;\r\n  }\r\n  .carousel-caption {\r\n    right: 20%;\r\n    left: 20%;\r\n    padding-bottom: 30px;\r\n  }\r\n  .carousel-indicators {\r\n    bottom: 20px;\r\n  }\r\n}\r\n/*.clearfix:before,*/\r\n/*.clearfix:after,*/\r\n.dl-horizontal dd:before,\r\n.dl-horizontal dd:after,\r\n.container:before,\r\n.container:after,\r\n.container-fluid:before,\r\n.container-fluid:after,\r\n.row:before,\r\n.row:after,\r\n.form-horizontal .form-group:before,\r\n.form-horizontal .form-group:after,\r\n.btn-toolbar:before,\r\n.btn-toolbar:after,\r\n.btn-group-vertical > .btn-group:before,\r\n.btn-group-vertical > .btn-group:after,\r\n.nav:before,\r\n.nav:after,\r\n.navbar:before,\r\n.navbar:after,\r\n.navbar-header:before,\r\n.navbar-header:after,\r\n.navbar-collapse:before,\r\n.navbar-collapse:after,\r\n.pager:before,\r\n.pager:after,\r\n.panel-body:before,\r\n.panel-body:after,\r\n.modal-header:before,\r\n.modal-header:after,\r\n.modal-footer:before,\r\n.modal-footer:after {\r\n  display: table;\r\n  content: \" \";\r\n}\r\n/*.clearfix:after,*/\r\n.dl-horizontal dd:after,\r\n.container:after,\r\n.container-fluid:after,\r\n.row:after,\r\n.form-horizontal .form-group:after,\r\n.btn-toolbar:after,\r\n.btn-group-vertical > .btn-group:after,\r\n.nav:after,\r\n.navbar:after,\r\n.navbar-header:after,\r\n.navbar-collapse:after,\r\n.pager:after,\r\n.panel-body:after,\r\n.modal-header:after,\r\n.modal-footer:after {\r\n  clear: both;\r\n}\r\n.center-block {\r\n  display: block;\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n}\r\n.pull-right {\r\n  float: right !important;\r\n}\r\n.pull-left {\r\n  float: left !important;\r\n}\r\n.hide {\r\n  display: none !important;\r\n}\r\n.show {\r\n  display: block !important;\r\n}\r\n.invisible {\r\n  visibility: hidden;\r\n}\r\n.text-hide {\r\n  font: 0/0 a;\r\n  color: transparent;\r\n  text-shadow: none;\r\n  background-color: transparent;\r\n  border: 0;\r\n}\r\n.hidden {\r\n  display: none !important;\r\n}\r\n.affix {\r\n  position: fixed;\r\n}\r\n@-ms-viewport {\r\n  width: device-width;\r\n}\r\n.visible-xs,\r\n.visible-sm,\r\n.visible-md,\r\n.visible-lg {\r\n  display: none !important;\r\n}\r\n.visible-xs-block,\r\n.visible-xs-inline,\r\n.visible-xs-inline-block,\r\n.visible-sm-block,\r\n.visible-sm-inline,\r\n.visible-sm-inline-block,\r\n.visible-md-block,\r\n.visible-md-inline,\r\n.visible-md-inline-block,\r\n.visible-lg-block,\r\n.visible-lg-inline,\r\n.visible-lg-inline-block {\r\n  display: none !important;\r\n}\r\n@media (max-width: 767px) {\r\n  .visible-xs {\r\n    display: block !important;\r\n  }\r\n  table.visible-xs {\r\n    display: table !important;\r\n  }\r\n  tr.visible-xs {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-xs,\r\n  td.visible-xs {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .visible-xs-block {\r\n    display: block !important;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .visible-xs-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .visible-xs-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .visible-sm {\r\n    display: block !important;\r\n  }\r\n  table.visible-sm {\r\n    display: table !important;\r\n  }\r\n  tr.visible-sm {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-sm,\r\n  td.visible-sm {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .visible-sm-block {\r\n    display: block !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .visible-sm-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .visible-sm-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .visible-md {\r\n    display: block !important;\r\n  }\r\n  table.visible-md {\r\n    display: table !important;\r\n  }\r\n  tr.visible-md {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-md,\r\n  td.visible-md {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .visible-md-block {\r\n    display: block !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .visible-md-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .visible-md-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .visible-lg {\r\n    display: block !important;\r\n  }\r\n  table.visible-lg {\r\n    display: table !important;\r\n  }\r\n  tr.visible-lg {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-lg,\r\n  td.visible-lg {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .visible-lg-block {\r\n    display: block !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .visible-lg-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .visible-lg-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .hidden-xs {\r\n    display: none !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .hidden-sm {\r\n    display: none !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .hidden-md {\r\n    display: none !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .hidden-lg {\r\n    display: none !important;\r\n  }\r\n}\r\n.visible-print {\r\n  display: none !important;\r\n}\r\n@media print {\r\n  .visible-print {\r\n    display: block !important;\r\n  }\r\n  table.visible-print {\r\n    display: table !important;\r\n  }\r\n  tr.visible-print {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-print,\r\n  td.visible-print {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n.visible-print-block {\r\n  display: none !important;\r\n}\r\n@media print {\r\n  .visible-print-block {\r\n    display: block !important;\r\n  }\r\n}\r\n.visible-print-inline {\r\n  display: none !important;\r\n}\r\n@media print {\r\n  .visible-print-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n.visible-print-inline-block {\r\n  display: none !important;\r\n}\r\n@media print {\r\n  .visible-print-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media print {\r\n  .hidden-print {\r\n    display: none !important;\r\n  }\r\n}\r\n/*# sourceMappingURL=bootstrap.css.map */\r\n", ""]);

	// exports


/***/ },

/***/ 163:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f4769f9bdb7466be65088239c12046d1.eot";

/***/ },

/***/ 164:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "448c34a56d699c29117adc64c43affeb.woff2";

/***/ },

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "fa2772327f55d8198301fdb8bcfc8158.woff";

/***/ },

/***/ 166:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "e18bbf611f2a2e43afc071aa2f4e1512.ttf";

/***/ },

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f721466883998665b87923b92dea655b.svg";

/***/ },

/***/ 168:
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

/***/ 169:
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

/***/ 170:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">机构配置</div>\r\n\t        <div class=\"inner-header-rt fr\" style=\"min-width:220px\">\r\n\t            <a  ui-sref =\"configuration.newOrganic\" class=\"btn1 fr importA\">新建资金方</a>\r\n\t        </div>\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t                <!--<tr>\r\n\t                    <td class=\"tl-r\">数据统计日期范围：<input type=\"hidden\" id=\"timeDefaut\"></td>\r\n\t                    <td>\r\n\t                    \t<input id=\"inpstart\" class=\"datainp inp1 fl calendar\" ng-model = 'query.presentDateStart' type=\"text\" placeholder=\"开始日期\" value=\"\"  readonly>\r\n\t                        <span class=\"fl\" style=\"line-height:27px;padding:0 6px;\">至</span>\r\n\t\t\t\t\t\t    <input id=\"inpend\" class=\"datainp inp1 fl calendar\" ng-model = 'query.presentDateEnd' type=\"text\" placeholder=\"结束日期\" readonly>\r\n\t                    </td>\r\n\t                </tr>-->\r\n\t              <!--   <tr>\r\n\t                    <td class=\"tl-r\">机构类型：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.partnerType\" ng-options = \"option.typeCode as option.typeName for option in baseSelectData.partnerTypeList\"></select>\r\n\t                    </td>\r\n\t                </tr> -->\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\">合作资金方名称：</td>\r\n\t                    <td>\r\n\t                    \t<select class=\"select-global\" ng-model = \"query.partnerCode\" ng-options = \"option.partnerCode as option.partnerName for option in baseSelectData.partnerList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t             <!--    <tr>\r\n\t                    <td class=\"tl-r\"> 关键字：</td>\r\n\t                    <td class=\"fl search\">\r\n\t                        <input type=\"text\"  placeholder=\"apiCode\" ng-model=\"query.apiCode\" id=\"search\"/>\r\n\t                    </td>\r\n\t                </tr> -->\r\n\t                <tr>\r\n\t\t\t\t\t\t<td class=\"tl-r\"></td>\r\n\t\t\t\t\t\t<td class=\"fl search\">\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"searchStart()\">查 询</div>\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"clearSearch()\">清 空</div>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t            </table>\r\n\t            <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                        <table class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\">\r\n\t                            <tr>\r\n\t                                <th>\r\n\t                                \t创建日期\r\n\t                                \t<div class=\"sortWrap\">\r\n\t                                \t\t<div class=\"sortTimeTop\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"asc\"})'></div>\r\n\t                                \t\t<div class=\"sortTimeBottom\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"desc\"})'></div>\r\n\t                                \t</div>\r\n\t                                </th>\r\n\t                                <th>合作资金方名称</th>\r\n\t                                <th>保证金额度（万）</th>\r\n\t                                <th>机构管理员</th>\r\n\t                                <th>apiCode</th>\r\n\t                                <th>操作</th>\r\n\t                            </tr>\r\n\t                            <tr ng-repeat=\"item in loanMenInfo\">\r\n\t                                <td ng-bind=\"item.modifyTime.time|timeDateFilter\"></td>\r\n\t                                <td ng-bind=\"item.partnerName\"></td>\r\n\t                                <td ng-bind=\"item.fineMoney\"></td>\r\n\t                                <td ng-bind=\"item.partnerAdminName\"></td>\r\n\t                                <td ng-bind=\"item.apiCode\"></td>\r\n\t                                <td>\r\n\t                                \t<a href=\"javascript:void(0)\" class=\"mlr5\" ng-click = \"upload(item)\">上传</a>\r\n\t                                \t<a href=\"javascript:void(0)\" class=\"mlr5\" ng-click = \"downLoad(item)\">下载</a>\r\n\t                                \t<a href=\"javascript:void(0)\" class=\"mlr5\" ng-click = \"edit(item)\">编辑</a>\r\n\t                                \t<a href=\"javascript:void(0)\" ng-click = \"viewDetail(item)\">查看</a>\r\n\t                                \t<!--<a href=\"javascript:void(0)\" class=\"mlr5\" ng-click = \"isFreeze(item)\" ng-bind = \"item.isCooperation|isFreeze\"></a>-->\r\n\t                                </td>\r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class=\"ft clearfix yeshu\" ng-style=\"{visibility:showPage}\">\r\n\t\t\t            <div class=\"fl ft-lf\">\r\n\t\t\t                                共 <span ng-bind=\"count\"></span>条 每页显示\r\n\t\t\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\">\r\n\t\t\t                </select>\r\n\t\t\t                </div>\r\n\t\t\t                <div class=\"fr ft-rt\">\r\n\t\t\t                    <div class=\"page clearfix\">\r\n\t\t\t                        <span page></span>\r\n\t\t\t                    </div>\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t    <div>\r\n\t   \t    <div id=\"report-template-mask\" ng-style=\"{display:dialog.show ? 'block' : 'none'}\"></div>\r\n\t    \t<div class=\"successList2\" ng-style = \"{display:dialog.show ? 'block' : 'none'}\">\r\n\t\t        <div class=\"col-md-11\" style=\"padding-top: 80px\">\r\n\t\t\t\t\t<div>\r\n\t\t\t\t\t\t<input class=\"upLoadInfo\" name=\"file\" readonly=\"readonly\" ng-model = \"uploader.queue[0].file.name\" type=\"text\" placeholder=\"上传附件格式（.zip）\"/>\r\n\t\t\t\t\t\t<div class=\"upLoadWrapper\">\r\n\t\t\t\t\t\t\t<span style=\"position: absolute; left: 36px; top: -27px;\">选择文件</span>\r\n\t\t\t\t\t\t\t<input type=\"file\" class=\"upLoadInp\" nv-file-select=\"\" uploader=\"uploader\" />\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t            <div>\r\n\t\t                <div class=\"progress\" ng-show = \"uploader.queue[0].file.name\" style=\"margin-bottom: 48px;\">\r\n\t\t                    <div class=\"progress-bar\" role=\"progressbar\" ng-style=\"{ 'width': uploader.progress + '%' }\">{{uploader.progress}}%</div>\r\n\t\t                </div>\r\n\t\t                <button type=\"button\" class=\"btn btn-success btn-s mlr30\" ng-click=\"uploader.uploadAll(upLoadParam)\" ng-disabled=\"!uploader.getNotUploadedItems().length\">\r\n\t\t                   \t 上传       \t  \r\n\t\t                </button>\r\n\t\t                <button type=\"button\" class=\"btn btn-danger btn-s mlr30\" ng-click=\"uploader.clearQueue(dialog)\">\r\n\t\t             \t\t关闭\r\n\t\t                </button>\r\n\t\t            </div>\r\n\t\t        </div>\r\n\t    \t</div>\r\n\t    </div>\r\n\t</div>\r\n</div>\r\n\t\r\n\t\t\r\n"

/***/ }

});