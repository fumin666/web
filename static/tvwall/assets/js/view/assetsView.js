define(function(require, exports, module) {
    var suninfo = require('../../../js/ajax.interface.js');
    var _ = require('../../../js/underscore');
    require('../../../assetsAndEx/js/module/switchover');
    var deviceTemplate = _.template($('#device-template').html());
    var stateTemplate = _.template($('#state-template').html());
    var ipDeviceTemplate = _.template($('#ipDevice-template').html());
    var ipDeviceInfoTemplate = _.template($('#ipDeviceInfo-template').html());
    var assetsCfgTemplate = _.template($('#assetsCfg-template').html());
    // 实时信息请求周期
    var listPeriod = '180';
    var dataTimer;
    // 已关注资源
    var resourceArr = [];
    // 已关注资源列表长度
    var len = 0;
    // 已关注资源列表滚动序号
    var tt = 0;
    var _interval = null;
    // 缩放倍数
    var xbei = 1, ybei = 1;
    // 缩放方式: 0-铺满屏幕   1-保持比例   2-自定义设置
    var scaleType = 0;
    var deviceData = [];
    var _topInterval = null;

    function render() {
        ssinfo();
        isTop();
        view();
        $('.half-top').html(deviceTemplate());
        auto();
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
            $('.staticTvwallAss').css('marginLeft', 0);
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
            $('.staticTvwallAss').css('transform', 'scale(' + xbei + ',' + ybei + ')');
            // 水平居中
            var resx = Math.round(_width - 1920 * xbei);
            if (resx > 0) {
                $('.staticTvwallAss').css('marginLeft', resx / 2);
            }
        }
    }
    function ssinfo() {
        var tvwallid = suninfo.getParameter('tvwallid');
        var location = suninfo.getParameter('location');
        // 实时信息请求周期
        suninfo.post('/systemManager/staticTvWall/assetListPortlet/' + tvwallid + '/' + location).done(function(res) {
            listPeriod = res.period;
        });
    }
    function view() {
        tt = 0;
        // 资产监控
        suninfo.get('/indexControl/newDeviceMonitorForTvWall').done(function(res) {
            var normal = 0;
            var allRes = 0;
            for (let i = 1; i < 8; i++) {
              if (res[i].norm !== undefined) {
                normal += res[i].norm;
              }
            }
            for (let i = 1; i < 8; i++) {
              if (res[i].norm !== undefined) {
                allRes += res[i].total;
              }
            }
            deviceData = res;
            deviceMonitorRander(deviceData);
            if (allRes > 0) {
                var score = 100 * (normal / allRes);
                $('#score').countUp({
                    to: Math.round(score)
                });
                rotation(Math.round(score));
                // $('#numHost').text(res[8].hostCount + '个');
                // $('#numNet').text(res[8].networkCount + '个');
                // $('#numApp').text(res[8].appCount + '个');
                // $('#numHardware').text(res[8].hardCount + '个');
            }
        });
        // 已关注资源
        suninfo.post('indexControl/getConcernItcomp', {contentType: 'application/json'}).done(function(res) {
            resourceArr = [];
            if (res.length > 0) {
                repack(res);
            } else {
                $('.half-bottom').html('<div class="no-text"><div>你还没有关注的资产...</div><div>请设置您关注的资产信息</div></div>');
                $('.half-bottom').addClass('no-notice');
            }
        });
        dataTimer = setTimeout(view, listPeriod * 1000);
        if (_interval) {
          clearInterval(_interval);
        }
    }
    function deviceMonitorRander(data) {
      var listElement = $('.i_list').html('');
      for (var i = 1; i < data.length; i++) {
        if (!data[i].total) {
          data[i].total = 0
        }
        listElement.append(stateTemplate({item: data[i]}));
      }
      $('#imgscoll').switchover({num: 4});
      battary(data);
      topInterval();
    }
    function topInterval() {
      if (_topInterval) {
        clearInterval(_topInterval);
      }
      _topInterval = setInterval(function() {
        var flag = $('.next').hasClass('last');
        if (flag) {
          deviceMonitorRander(deviceData);
        } else {
          $('.next').click();
        }
      }, sliderVTime * 1000);
    }
    function rotation(ang) {
        /* 优雅降级解决IE9不支持CSS3动画问题 */
        var browser = navigator.appName;
        if (browser == 'Microsoft Internet Explorer') {
        var b_version = navigator.appVersion;
        var version = b_version.split(';');
        var trim_Version = version[1].replace(/[ ]/g, '');
        if (trim_Version == 'MSIE9.0') {
            var angle = 0;
            setInterval(function () {
                angle += 3;
                $('.score-mod .scan_browse').rotate(angle);
            }, 80);
            setInterval(function () {
                angle += 3;
                $('.score-mod .scan_load').rotate(angle);
            }, 30);
        }
    }
        /* 传递系统健康度 */
        var rorateAngle = Math.round(ang / 100 * 360) + 15;
        $('.score-mod .scan_arrows').rotate({
            animateTo: rorateAngle,
            duration: 2000,
            easing: function (x, t, b, c, d) {
                return c * (t / d) + b;
            }
        });
    }
    function battary(data) {
        for (var i = 1; i < 8; i++) {
            !data[i].die && (data[i].die = 0);
            !data[i].alarm && (data[i].alarm = 0);
            !data[i].norm && (data[i].norm = 0);
            var sum = data[i].die + data[i].norm + data[i].alarm;
            var $singleBattary = $('.' + data[i].name);
            var norm = data[i].norm;
            var alarm = data[i].alarm;
            var die = data[i].die;
            $singleBattary.each(function () {
                var title = $(this).find('.battery-title').text();
                var oLi = $(this).find('li');
                $(oLi).removeClass('down');
                $(oLi).removeClass('warn');
                $(oLi).removeClass('normal');
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

    function repack(res) {
        for (var i = 0; i < res.length; i++) {
            var orgName = res[i].operationOrgName ? res[i].operationOrgName : '无';
            var location = res[i].cmdbLocation ? res[i].cmdbLocation.name : '无';
            var userName = res[i].maintenanceUser ? res[i].maintenanceUser.userRealName : '无';
            var businessName = res[i].businessName ? res[i].businessName : '无';
            var unrecoveryIncidentNum = res[i].unrecoveryIncidentNum ? res[i].unrecoveryIncidentNum : '0';
            var status = res[i].monitorStatusView;
            var className = '';
            if (status == '未监控') {
                className = 'state-out';
            } else if (status == '告警') {
                className = 'state-warning';
            } else if (status == '正常') {
                className = 'state-normal';
            } else {
                status = '异常';
                className = 'state-die';
            }
            resourceArr.push({
                'deviceIp': res[i].controlAdderss,
                'deviceName': res[i].itcompName,
                'status': status,
                'className': className,
                'deviceType': res[i].citypeName,
                'businessName': res[i].itcompName,
                'location': location,
                'orgName': orgName,
                'maintenanceUser': userName,
                'runTime': res[i].runTimeStr,
                'unrecoveryIncidentNum': unrecoveryIncidentNum,
                'cpuUse': res[i].cpuUse,
                'memoryUse': res[i].memoryUse
            });
        }
        $('.half-bottom').html(ipDeviceTemplate({list: resourceArr}));
        $('#ipDeviceRight').html(ipDeviceInfoTemplate({item: resourceArr[0]}));
        cpuMem(resourceArr[0].cpuUse, resourceArr[0].memoryUse);
        pmd();

        len = resourceArr.length;
        if (len > 1) {
            interval();
        }
    }

    function cpuMem(cpuUse, memoryUse) {
        cpuUse = Math.round(cpuUse *= 3.6);
        memoryUse = Math.round(memoryUse *= 3.6);
        if (cpuUse > 0) {
            if (cpuUse <= 180) {
                $('.cpu .left div').css('transform', 'rotate(' + (180 - cpuUse) + 'deg)');
            } else {
                $('.cpu .left div').css('transform', 'rotate(0deg)');
                $('.cpu .right div').css('transform', 'rotate(' + (360 - cpuUse) + 'deg)');
            }
        }
        if (memoryUse > 0) {
            if (memoryUse <= 180) {
                $('.mem .left div').css('transform', 'rotate(' + (180 - memoryUse) + 'deg)');
            } else {
                $('.mem .left div').css('transform', 'rotate(0deg)');
                $('.mem .right div').css('transform', 'rotate(' + (360 - memoryUse) + 'deg)');
            }
        }
    }
    // 跑马灯
    function pmd() {
        $('#ipDeviceRight .pmd').each(function () {
            var pWidth = $(this).parent().width();
            var cWidth = $(this).width();
            if (cWidth <= pWidth) {
                $(this).css('left', '50%');
                $(this).css('marginLeft', -(cWidth / 2) + 'px');
            } else {
                var _that = $(this);
                setInterval(function () {
                    _that.animate({
                        left: -cWidth
                    }, 4000, function () {
                        _that.css('left', '0');
                    });
                }, 4500);
            }
        });
    }
    // 已关注资源竖向滚动
    function sliderV(tt) {
        var img = $('#ipDeviceList > div');
        img.animate({'margin-top': '-5rem'}, 1000, function() {
            img.find('.item:first').appendTo(img);
            img.css('marginTop', '0');
            img.find('.item').removeClass('active');
            img.find('.item:first').addClass('active');
        });
        $('#ipDeviceRight').html(ipDeviceInfoTemplate({item: resourceArr[tt]}));
        cpuMem(resourceArr[tt].cpuUse, resourceArr[tt].memoryUse);
        pmd();
    }
    //
    function interval() {
        if (_interval) {
            clearInterval(_interval);
        }
        _interval = setInterval(function() {
            tt++;
            (tt >= len) && (tt -= len);
            sliderV(tt);
        }, sliderVTime * 1000);
    }
    // 设置
    var sliderVTime = 10;
    function setAssets(tvwallId, location) {
        var _html = '<div class="assetsCfg">' + assetsCfgTemplate({
                time: sliderVTime,
                scaletype: scaleType,
                xbei: xbei,
                ybei: ybei
        }) + '</div>';
        suninfo.dialog(_html, 'assetsCfg', '页面设置', {width: 560});
        suninfo.addButton('assetsCfg', '确定', cfgOk, '取消');
        if (scaleType == 2) {
            $('.assetsCfg .zdy').show();
        } else {
            $('.assetsCfg .zdy').hide();
        }
        suninfo.formValid('#assetsCfg');
        $('.assetsCfg').undelegate().delegate('#scaleType', 'change', function() {
            scaleType = $(this).val();
            if (scaleType == 2) {
                $('.assetsCfg .zdy').show();
            } else {
                $('.assetsCfg .zdy').hide();
            }
        });
    }
    function cfgOk() {
        if (suninfo.formBeforeSubmitCheck('#assetsCfg')) {
            sliderVTime = $('#sliderVTime').val();
            if (scaleType == 2) {
                xbei = $('#xBei').val();
                ybei = $('#yBei').val();
            }
            interval();
            auto();
        } else {
            return false;
        }
    }
    window.setAssets = setAssets;
    var assetsView = {
        render: render
    };
    window.refresh = render;
    window.onbeforeunload = function() {
        if (_interval) {
            clearTimeout(_interval);
            _interval = null;
        }
        if (dataTimer) clearTimeout(dataTimer)
    }
    // 根据是否在iframe中 改变背景
    function isTop() {
        if (window.top == window.self) {
            $('.staticTvwallAss').css('background', 'url(./img/bg.jpg)');
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
    $(window).resize(auto);
    module.exports = assetsView;
});
