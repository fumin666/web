define(function(require, exports, module) {
	require('./pagination');

	var pagination = {};
	pagination._template = '<ul><li class="j-first"><a class="first" href="javascript:;"><i class="iconfont icon-most-left"></i></a><span class="first"><i class="iconfont icon-most-left"></i></span></li><li class="j-prev"><a class="previous" href="javascript:;"><i class="iconfont icon-left"></i></a><span class="previous"><i class="iconfont icon-left"></i></span></li>#pageNumFrag#<li class="j-next"><a class="next" href="javascript:;"><i class="iconfont icon-right"></i></a><span class="next"><i class="iconfont icon-right"></i></span></li><li class="j-last"><a class="last" href="javascript:;"><i class="iconfont icon-most-right"></i></a><span class="last"><i class="iconfont icon-most-right"></i></span></li><li class="jumpto"><input class="textInput" type="text" size="4" value="#currentPage#" /><button class="goto" type="button" class="s-button s-button-default"><i class="iconfont icon-youxia"></i></button></li></ul>';

	// 显示的页码个数
  var PAGE_NUM_SHOW = 6;

	pagination.pager = function(_box, data, pageCallback) {
		var _self = this;
		if (typeof pageCallback === 'undefined' || typeof data === 'undefined') {
			throw new Error('data or pageCallback is undefined!');
		} else {
			var $p = $(_box || document);
			var $el = $('div.pagination', $p);
			var $select = $('.combox', $p);
			var pageInfo = {
					totalCount: $el.attr('totalCount'),
					numPerPage: $el.attr('numPerPage'),
					pageNumShown: $el.attr('pageNumShown'),
					currentPage: $el.attr('currentPage')
				};
			$select.change(function() {
				var newPageInfo = $.extend({}, pageInfo, {numPerPage: $(this).val()});
				var dataAndInfo = _self._getPageDataAndPageInfoForSelect(data, newPageInfo);
				pageCallback(dataAndInfo.pageData, dataAndInfo.pageInfo);
			});
			$el.each(function() {
					// 调用自定义分页控件计算分页
					var $this = $(this);
					$this.pagination({
					     targetType: $this.attr('targetType'), // 目标类型
					     totalCount: $this.attr('totalCount'), // 记录总数
					     numPerPage: $this.attr('numPerPage'), // 每页多少条
					     pageNumShown: $this.attr('pageNumShown'), // 显示页的个数
					     currentPage: $this.attr('currentPage'), // 当前页
					     rel: _box,
					     customFun: function(pageConfig) {
					     	pageCallback(_self.getPageData(data, pageConfig), pageConfig);
					     }
					}, pagination._template);
			});
		}
	};

	pagination._getPageDataAndPageInfoForSelect = function(data, pageInfo) {
		var _self = this;
		var pageData = _self.getPageData(data, pageInfo);
		if (pageData.length == 0 && data.length != 0) {
			var currentPage = parseInt(pageInfo.currentPage) - 1;
			var newPageInfo = $.extend({}, pageInfo, {currentPage: currentPage});
			return _self._getPageDataAndPageInfoForSelect(data, newPageInfo);
		}
		return {pageData: pageData, pageInfo: pageInfo};
	};

	// 是否为Criteria对象
    function isCriteriaObj(obj) {
        return obj.hasOwnProperty('pageList') && obj.hasOwnProperty('currentPage') && obj.hasOwnProperty('totalCount') && obj.hasOwnProperty('pageSize') && obj.hasOwnProperty('orderByClause');
    }

    // 是否为pageinfo对象
    function isPageInfoObj(obj) {
        return obj.hasOwnProperty('totalCount') && obj.hasOwnProperty('numPerPage') && obj.hasOwnProperty('pageNumShown') && obj.hasOwnProperty('currentPage');
    }

	/**
	 * 根据传入参数过滤分页数据,flag为true时表示进行大数据分页，false时表示为前台分页
	 */
	pagination.getPageData = function(data, pageInfo, flag) {
		  var dataIndex = (parseInt(pageInfo.currentPage) - 1) * parseInt(pageInfo.numPerPage);
	    var lastIndex = dataIndex + parseInt(pageInfo.numPerPage) > parseInt(pageInfo.totalCount) ? parseInt(pageInfo.totalCount) : dataIndex + parseInt(pageInfo.numPerPage);
      if (flag) {
	    	var currentPage = parseInt(pageInfo.currentPage);
	    	var index = currentPage - 1;
	    	if (currentPage > PAGE_NUM_SHOW) {
	    	    index = (currentPage % PAGE_NUM_SHOW == 0) ? (PAGE_NUM_SHOW - 1) : (currentPage % PAGE_NUM_SHOW - 1);
        }
	    	dataIndex = index * parseInt(pageInfo.numPerPage);
	    	lastIndex = dataIndex + parseInt(pageInfo.numPerPage) > parseInt(pageInfo.totalCount) ? parseInt(pageInfo.totalCount) : dataIndex + parseInt(pageInfo.numPerPage);
      }
      if (parseInt(pageInfo.currentPage) > Math.ceil(data.length / parseInt(pageInfo.numPerPage))) {
        var indexNum = (parseInt(data.length / parseInt(pageInfo.numPerPage)))
        dataIndex = indexNum * parseInt(pageInfo.numPerPage)
      }
		  return data.slice(dataIndex, lastIndex);
	};

	pagination.pageBreak = function(args, rel, customFun) {
		var $p = $(rel || document);
		var $el = $('div.pagination', $p);
		var pageInfo = {
				totalCount: $el.attr('totalCount'),
				numPerPage: $el.attr('numPerPage'),
				pageNumShown: $el.attr('pageNumShown'),
				currentPage: $el.attr('currentPage')
			};
    // 将页数设置到pageInfo中
    var pageIndex = Math.ceil(parseInt(pageInfo.totalCount) / parseInt(pageInfo.numPerPage))
    var numIndex = args.pageNum
    if (args.pageNum > pageIndex) {
        numIndex = pageIndex
    }
		var newPageInfo = $.extend({}, pageInfo, {currentPage: numIndex});
		customFun(newPageInfo);
   };

   // 从数据中获得pageInfo信息
   pagination.getPageInfo = function(data) {
	   return {
		    totalCount: data.totalCount,
		    numPerPage: data.pageSize,
		    pageNumShown: furnace.getDefaultPageInfo().pageNumShown,
		    currentPage: data.currentPage
		};
   };

	/**
	 * 获取默认的分页条件信息
	 */
   	pagination.getCriteria = function(pageInfo) {
		if (typeof pageInfo === 'undefined') {
			var pageInfo = furnace.getDefaultPageInfo();
		}
		return {
			condition: {},
			currentPage: pageInfo.currentPage,
			totalCount: -1,
			pageSize: pageInfo.numPerPage,
			pageList: [],
			distinct: false,
			orderByClause: ''
		};
	};

	module.exports = pagination;

	if (typeof (furnace) !== 'undefined') {
		furnace.clone(pagination);
	}
});
