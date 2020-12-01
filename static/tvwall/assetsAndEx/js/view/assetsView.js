define(function(require, exports, module) {
    require('../../../js/ajax.interface.js');
    var _ = require('../../../js/underscore');
    require('../module/switchover');
    var pagination = require('../module/pagination/pagination.interface');
    pagination.getDefaultPageInfo = function(tCount) {
      return {
        totalCount: (typeof tCount !== 'undefined') ? tCount : 0,
        numPerPage: 8,
        pageNumShown: 10,
        currentPage: 1
      };
    };

    var deviceTemplate = _.template($('#device-template').html());
    var assetErrorListTemplate = _.template($('#assetErrorList-template').html());
    var assetItemTemplate = _.template($('#assetItem-template').html());
    // 所有事件分类的颜色
    var colors = ['#7a7e89', '#16b79b', '#5ab1ef', '#ffbd64', '#724c7c', '#724c7c', '#cd6895', '#eb7c7e'];
    // 实时信息请求周期
    var listPeriod = '180';
    var dataTimer;
    // 缩放倍数
    var xbei = 1, ybei = 1;
    // 缩放方式: 0-铺满屏幕   1-保持比例   2-自定义设置
    var scaleType = 0;
    var _interval = null;
    var incidentCountList = [];
    var allIncidentData = [];
    var deviceData = [];
    var _topInterval = null;
    function render() {
       // isTop();
        $('.half-bottom').html(assetErrorListTemplate());
        ssinfo();
        auto();
        $('.i_list').undelegate().delegate('.num', 'click', function() {
            var uuid = $(this).data('uuid');
            var deviceData = getDeviceData(uuid);
            if (deviceData) {
              if (_topInterval) {
                clearInterval(_topInterval);
              }
              if (dataTimer) {
                clearTimeout(dataTimer);
              }
              parent.window.showList(deviceData);
            }
        });
        // 中间统计事件委托
        $('.itemStat').undelegate().delegate('li', 'click', function() {
          var level = $(this).data('level');
          $('#assetPanels').html('');
          dataFilter(parseInt(level));
        });
        $('#assetPanels').undelegate().delegate('.assetItem', 'click', function() {
            var uuid = $(this).data('uuid');
            var eventDetail = getEventDataByUUID(uuid);
            if (eventDetail) {
              if (_interval) {
                clearInterval(_interval);
              }
              if (dataTimer) {
                clearTimeout(dataTimer);
              }
              parent.window.showDetail(eventDetail);
            }
        });
    }
    function auto() {
        var _width = 0,
            _height = 0;
        if (window.top != window.self) {
            var doc = window.top.document;
            var ifm = doc.querySelector('iframe');
            if (doc.querySelector('#fullBoxIframe')) {
                ifm = doc.querySelector('#fullBoxIframe');
            }
            _width = ifm.clientWidth;
            _height = ifm.clientHeight;
            $('.staticTvwallAssEx').css('marginLeft', 0);
            if (scaleType == 0) {
                xbei = (_width / 1920).toFixed(4);
                ybei = (_height / 1009).toFixed(4);
            } else if (scaleType == 1) {
                if (_width / _height > 1.902874) {
                    xbei = (_height / 1009).toFixed(4);
                } else {
                    xbei = (_width / 1920).toFixed(4);
                }
                ybei = xbei;
            }
            $('.staticTvwallAssEx').css('transform', 'scale(' + xbei + ',' + ybei + ')');
            // 水平居中
            var resx = Math.round(_width - 1920 * xbei);
            if (resx > 0) {
                $('.staticTvwallAssEx').css('marginLeft', resx / 2);
            }
        }
    }
    function ssinfo() {
      var tvwallid = suninfo.getParameter('tvwallid');
      var location = suninfo.getParameter('location');
      // 实时信息请求周期
      suninfo.post('/systemManager/staticTvWall/assetListPortlet/' + tvwallid + '/' + location).done(function(res) {
        listPeriod = res.period;
        view();
      });
    }
    function view() {
      // 资产信息
      suninfo.get('indexControl/newDeviceMonitor', {contentType: 'application/json'}).done(function(res) {
        deviceData = res;
        deviceMonitorRander(deviceData);
      });
      levelCount();
      incidentGroup();
      dataTimer = setTimeout(view, listPeriod * 1000);
    }

    function getEventDataByUUID(uuid) {
      var result = null;
      for (var i = 0; i < allIncidentData.length; i++) {
        if (allIncidentData[i].uuid === uuid) {
          result = allIncidentData[i];
          break;
        }
      }
      return result;
    }

    function getDeviceData(uuid) {
      var result = null;
      for (var i = 0; i < deviceData.length; i++) {
        if (deviceData[i].uuid === uuid) {
          result = deviceData[i];
          break;
        }
      }
      return result;
    }

    function dataFilter(level) {
      var tempData = [];
      if (level != -1) {
        for (var i = 0; i < allIncidentData.length; i++) {
          if (allIncidentData[i].level == level) {
            tempData.push(allIncidentData[i]);
          }
        }
        incidentCountList = tempData;
      } else {
        incidentCountList = allIncidentData.slice(0);
      }
      insertPageData();
    }

  /**
   * 上半部分处理
   */
  function deviceMonitorRander(data) {
    var listElement = $('.i_list').html('');
    for (var i = 1; i < data.length; i++) {
      listElement.append(deviceTemplate({item: data[i]}));
    }
    $('#imgscoll').switchover({num: 5});
    battary(data);
    topInterval();
  }

    function incidentGroup() {
        var condition = {isRecoveryIncident: 0};
        suninfo.post('incidentCount/getIncidentList', JSON.stringify(condition), {contentType: 'application/json'}).done(function(res) {
            allIncidentData = res;
            incidentCountList = allIncidentData.slice(0);
            insertPageData();
        });
    }

  /**
   * 中间统计部分
   */
  function levelCount() {
        suninfo.get('incidentCount/getIncidentCountByLevel').done(function(res) {
            var total = 0;
            var htmlStr = '<ul>#totalLi##liList#</ul>';
            var liStr = '';
            for (var i = 0; i < res.length; i++) {
                total = total + res[i].value;
                liStr += '<li data-level="' + res[i].level + '">' + res[i].name + ' &nbsp;<span style="font-size:16px;color: ' + colors[res[i].level] + '">' + res[i].value + '</span></li>\n';
            }
            var html = htmlStr.replace(/#totalLi#/g, '<li data-level="-1">总数  &nbsp;' + total + '</li>\n').replace(/#liList#/g, liStr);
            $('.itemStat').html(html);
          }
        );
    }

    function battary(data) {
        for (var i = 1; i < data.length; i++) {
            !data[i].die && (data[i].die = 0);
            !data[i].alarm && (data[i].alarm = 0);
            !data[i].norm && (data[i].norm = 0);
            var sum = data[i].count;
            var $singleBattary = $('.' + data[i].name);
            var norm = data[i].norm;
            var alarm = data[i].alarm;
            var die = data[i].die;
            $singleBattary.each(function () {
                var title = $(this).find('.battery-title').text();
                var oLi = $(this).find('li');
                var oLiWidth = oLi.width();
                oLi.removeClass('yes');
                var num = $(this).find('.battery-num');
                var percent;
                var int;
                var res;
                switch (title) {
                    case '异常':
                        num.text(die);
                        percent = (die / sum * 100).toFixed(2);
                        int = parseInt(percent / 10);
                        res = percent % 10;
                        for (var i = 0; i < int; i++) {
                            oLi.eq(i).addClass('down');
                        }
                        if (res > 0) {
                            oLi.eq(int).addClass('down');
                            var _width = (res * 0.1 * oLiWidth) + 'px';
                            oLi.eq(int).find('span').width(_width);
                        }
                        break;
                    case '告警':
                        num.text(alarm);
                        percent = (alarm / sum * 100).toFixed(2);
                        int = parseInt(percent / 10);
                        res = percent % 10;
                        for (var i = 0; i < int; i++) {
                            oLi.eq(i).addClass('warn');
                        }
                        if (res > 0) {
                            oLi.eq(int).addClass('warn');
                            var _width = (res * 0.1 * oLiWidth) + 'px';
                            oLi.eq(int).find('span').width(_width);
                        }
                        break;
                    case '正常':
                        num.text(norm);
                        percent = (norm / sum * 100).toFixed(2);
                        int = parseInt(percent / 10);
                        res = percent % 10;
                        for (var i = 0; i < int; i++) {
                            oLi.eq(i).addClass('normal');
                        }
                        if (res > 0) {
                            oLi.eq(int).addClass('normal');
                            var _width = (res * 0.1 * oLiWidth) + 'px';
                            oLi.eq(int).find('span').width(_width);
                        }
                        break;
                }
            })
        }
    }
    // 第一次请求
    function getPageData(callback) {
      var pageInfo = pagination.getDefaultPageInfo(incidentCountList.length);
      var pageData = pagination.getPageData(incidentCountList, pageInfo);
      callback(pageData, pageInfo);
    }
    var pageFlag = true;
    function pageCallback(pageData, pageInfo) {
      if (pageFlag) {
        pageFlag = false;
        var line1 = [null, null, null, null];
        var line2 = [null, null, null, null];
        for (var i = 0, l = pageData.length; i < l; i++) {
          if (i < 4) {
            line1[i] = pageData[i];
          } else {
            line2[i - 4] = pageData[i];
          }
        }
        var showTablePage = assetItemTemplate({colors: colors, line1: line1, line2: line2, page: pageInfo});
        $('#assetPanels').find('.panelBar').remove();
        $('#assetItemPanel1').css('z-index', '2').animate({
          left: '+=2000'
        }, 1000, function() {
          $(this).remove();
          pageFlag = true;
        });
        $('#assetPanels').append(showTablePage);
        $('#assetItemPanel2').css('z-index', '1').show().attr('id', 'assetItemPanel1')
        pagination.pager('#assetPanels', incidentCountList, pageCallback);
        interval();
      }
    }

  function insertPageData() {
        if (incidentCountList.length > 0) {
            $('#assetItemPanel1').css('z-index', '2').animate({
                left: '+=2000'
            }, 1000, function() {
                $(this).remove();
            });
            getPageData(function (data, pageInfo) {
                var line1 = [null, null, null, null];
                var line2 = [null, null, null, null];
                for (var i = 0, l = data.length; i < l; i++) {
                    if (i < 4) {
                        line1[i] = data[i];
                    } else {
                        line2[i - 4] = data[i];
                    }
                }
                $('#assetPanels').html('').append(assetItemTemplate({colors: colors, line1: line1, line2: line2, page: pageInfo}));
                pagination.pager('#assetPanels', incidentCountList, pageCallback);
                $('#assetItemPanel2').css('z-index', '1').show().attr('id', 'assetItemPanel1');
                interval();
            });
        } else {
          $('#assetPanels').html('').append('<div class="emptyTip">暂无数据</div>');
        }
    }

    function interval() {
       if (_interval) {
            clearInterval(_interval);
        }
        _interval = setInterval(function() {
          var flag = $('.j-next').hasClass('disabled');
          if (flag) {
            $('.j-first').click();
          } else {
            $('.j-next').click();
          }
        }, sliderVTime * 1000);
    }

    function topInterval() {
      if (_topInterval) {
        clearInterval(_topInterval);
      }
      _topInterval = setInterval(function() {
        var flag = $('.half-top .next').hasClass('last');
        if (flag) {
          deviceMonitorRander(deviceData);
        } else {
          $('.half-top .next').click();
        }
      }, sliderVTime * 1000);
    }
    // 设置
    var sliderVTime = 10;
    var assetsView = {
        render: render
    };
    window.refresh = render;
    window.onbeforeunload = function() {
        if (dataTimer) clearTimeout(dataTimer)
    }
    // 根据是否在iframe中 改变背景
    function isTop() {
        if (window.top == window.self) {
            $('.staticTvwallAssExEx').css('background', 'url(../sass/img/bg.jpg)');
        }
    }
    window.getSet = function() {
      return {
        booleanVTime: true,
        sliderVTime: sliderVTime,
        scaleType: scaleType,
        xbei: xbei,
        ybei: ybei
      }
    };
    window.setSet = function(obj) {
      sliderVTime = obj.sliderVTime;
      scaleType = obj.scaleType;
      xbei = obj.xbei;
      ybei = obj.ybei;
      interval();
      topInterval();
      auto();
    };
    // 关闭详情信息
    window.closeMonitorDetail = function() {
      interval();
      dataTimer = setTimeout(view, listPeriod * 1000);
    };
    // 关闭设备列表
    window.closeDeviceList = function() {
      topInterval();
      dataTimer = setTimeout(view, listPeriod * 1000);
    };

    $(window).resize(auto);
    module.exports = assetsView;
});
