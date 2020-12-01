define(function(require, exports, module) {
    var suninfo = require('../../../js/ajax.interface.js');
    var _ = require('../../../js/underscore');
    var chart = require('../../../chart/chart.interface');

    var latestView = _.template($('#latest-template').html());
    var incidentCfgTemplate = _.template($('#incidentCfg-template').html());

    var appEl4 = $('#incidentChart4');
    // 缩放倍数
    var xbei = 1, ybei = 1;
    // 实时信息请求周期
    var listPeriod = '180';
    var dataTimer;

    function render() {
        ssinfo();
        view();
        auto();
    }
    function ssinfo() {
        var tvwallid = suninfo.getParameter('tvwallid');
        var location = suninfo.getParameter('location');
        // 实时信息请求周期
        suninfo.post('systemManager/staticTvWall/assetListPortlet/' + tvwallid + '/' + location).done(function(res) {
            listPeriod = res.period;
        });
    }
    function view() {
        var tvwallid = suninfo.getParameter('tvwallid');
        var cycleTime = 14,
            incidentType = 1;
        isTop();
        // 1A3 事件总数 & 事件恢复状况
        suninfo.get('/systemManager/staticTvWall/tvIncidentCount/' + cycleTime + '/' + incidentType).done(function(res) {
            showChart1(res);
            showChart3(res.isRecoveryList);
            showBase(res.sum);
        });
        // 2. 各级别事件
        suninfo.post('/incidentCount/getIncidentCountByDayAndLevel/7').done(function(res) {
            showChart2(res);
        });
        // 4. 最新事件-查询
        condition = {'start': 0, 'end': 6};
        suninfo.post('/incidentCount/incidentGroupList', JSON.stringify(condition),
            {contentType: 'application/json', global: false}).done(function(res) {
            for (let i = 0; i < res.length; i++) {
              var pp = res[i].createTime;
              var qq = new Date(pp * 1000);
              res[i].createTime = qq.toLocaleDateString();
            }
            showLatest(res);
        });
        dataTimer = setTimeout(view, listPeriod * 1000);
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
            $('.staticTvwallInci').css('marginLeft', 0);
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
            $('.staticTvwallInci').css('transform', 'scale(' + xbei + ',' + ybei + ')');
            // 水平居中
            var resx = Math.round(_width - 1920 * xbei);
            if (resx > 0) {
                $('.staticTvwallInci').css('marginLeft', resx / 2);
            }
        }
    }

    function showBase(res) {
      if (res.length > 0) {
        $('#infoAll').text(res[2].count);
        $('#infoMonitor').text(res[0].count);
        // $('#infoSyslog').text(res[1].count);
        $('#infoPing').text(res[1].count);
      }
    }
    // 事件总数图
    function showChart1(data) {
        var xData = getX(data.aLLList);
        var yData = {
          aLLList: [],
          miList: [],
          // syslogList: [],
          pingList: []
        };
        getY(data, yData, xData.length);
        var areaStyle = {
          normal: {
            areaStyle: {
              color: 'rgba(100,219,226,0.3)'
            },
            lineStyle: {
              width: 2,
              color: '#64dbe2'
            }
          }
        };
        var option = {
          color: ['#70859e', '#70859e', '#70859e'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            x: '650',
            data: ['总数', '监视器', 'PING'],
            selectedMode: 'single',
            selected: {
              '总数': true,
              '监视器': false,
              'PING': false
            },
            textStyle: {
              color: '#5bc9d3'
            }
          },
          xAxis: {
            type: 'category',
            name: 'x',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#2257b3'
              }
            },
            data: xData,
            axisLine: {
              lineStyle: {
                color: '#4a79bd'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#5580b8'
              }
            }
          },
          grid: {
            x: 50,
            y: 50,
            x2: 70,
            y2: 60,
            borderWidth: 0
          },
          yAxis: {
            type: 'value',
            name: 'y',
            axisLine: {
              lineStyle: {
                color: '#4a79bd'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#5580b8'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#2257b3'
              }
            }
          },
          series: [
            {
              name: '总数',
              type: 'line',
              smooth: true,
              data: yData.aLLList,
              itemStyle: areaStyle
            },
            {
              name: '监视器',
              type: 'line',
              smooth: true,
              data: yData.miList,
              itemStyle: areaStyle
            },
            {
              name: 'PING',
              type: 'line',
              smooth: true,
              data: yData.pingList,
              itemStyle: areaStyle
            }
          ]
        };
        chart.createChart('incidentChart1', option);
        if (data.aLLList.length === 0) {
          $('#incidentChart1').html('').append('<div id="incidentChart1"></div>');
        }
    }
    // 各级别事件数-绘图
    function showChart2(data) {
      if (data.length > 0) {
        var xData = [];
        var series = {
          seven: [],
          six: [],
          five: [],
          four: [],
          three: [],
          two: [],
          one: []
        };
        for (var i = 0; i < data.length; i++) {
          var res = i % 7;
          switch (res) {
            case 0:
              xData.push(data[i].name);
              series.one.push(data[i].value);
              break;
            case 1:
              series.two.push(data[i].value);
              break;
            case 2:
              series.three.push(data[i].value);
              break;
            case 3:
              series.four.push(data[i].value);
              break;
            case 4:
              series.five.push(data[i].value);
              break;
            case 5:
              series.six.push(data[i].value);
              break;
            case 6:
              series.seven.push(data[i].value);
              break;
            case 7:
              xData.push(data[i].name);
              series.one.push(data[i].value);
              break;
          }
        }
        var option = {
          color: ['#d7504b', '#f0805a', '#e39f4f', '#fad860', '#60c0dd', '#26c076', '#8e9391'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            x: 500,
            y: 20,
            data: ['严重', '主要', '次要', '警告', '提示', '正常', '未知'],
            textStyle: {
              color: '#5580b8'
            },
            selectedMode: false
          },
          grid: {
            borderWidth: 0,
            x: 50,
            y: 60,
            x2: 50,
            y2: 60
          },
          xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
              lineStyle: {
                color: '#4a79bd',
                width: '2'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#185199',
                fontWeight: 'bold'
              }
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#4a79bd',
                width: '2'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#185199',
                fontWeight: 'bold'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#185199'
              },
              interval: 1
            }
          },
          series: [
            {
              name: '严重',
              type: 'bar',
              stack: 'a',
              data: series.seven
            },
            {
              name: '主要',
              type: 'bar',
              stack: 'a',
              data: series.six
            },
            {
              name: '次要',
              type: 'bar',
              stack: 'a',
              data: series.five
            },
            {
              name: '警告',
              type: 'bar',
              stack: 'a',
              data: series.four
            },
            {
              name: '提示',
              type: 'bar',
              stack: 'a',
              data: series.three
            },
            {
              name: '正常',
              type: 'bar',
              stack: 'a',
              data: series.two
            },
            {
              name: '未知',
              type: 'bar',
              stack: 'a',
              data: series.one
            }
          ]
        };
        chart.createChart('incidentChart2', option);
      }
    }
    // 事件恢复状况-绘图
    function showChart3(data) {
      if (data.length > 0) {
        var xData = [],
          all = [],
          normal = [];
        for (var i = 0; i < data.length; i++) {
          xData.push(data[i].createTimeStr);
          all.push(data[i].count - data[i].isRecoverycount);
          normal.push(data[i].isRecoverycount);
        }
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params[0].name + '<br/>' +
                params[1].seriesName + ' : ' + params[1].value + '<br/>' +
                params[0].seriesName + ' : ' + (params[0].value + params[1].value);
            }
          },
          grid: {
            borderWidth: 0,
            x: 50,
            y: 60,
            x2: 50,
            y2: 60
          },
          legend: {
            x: '780',
            data: ['已恢复', '总数'],
            textStyle: {
              color: '#97b8e7'
            }

          },
          toolbox: {
            show: false
          },
          xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#5580d8'
              }
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#185199'
              }
            }
          },
          series: [
            {
              name: '已恢复',
              type: 'bar',
              stack: 'sum',
              barCategoryGap: '50%',
              itemStyle: {
                normal: {
                  color: '#3fc7f3',
                  label: {
                    show: true,
                    position: 'insideTop',
                    formatter: function(params) {
                      if (params.value == 0) {
                        return false;
                      }
                    },
                    textStyle: {
                      color: '#ffffff'
                    }
                  }
                }
              },
              data: normal
            },
            {
              name: '总数',
              type: 'bar',
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#0f72ae',
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (params) {
                      for (var i = 0, l = option.xAxis.data.length; i < l; i++) {
                        if (option.xAxis.data[i] == params.name) {
                          var all = option.series[0].data[i] + params.value;
                          if (all == 0) {
                            return false;
                          } else {
                            return all;
                          }
                        }
                      }
                    },
                    textStyle: {
                      color: '#ffffff'
                    }
                  }
                }
              },
              data: all
            }
          ]
        };
        chart.createChart('incidentChart3', option);
      }
    }
    // 最新事件-显示
    function showLatest(data) {
        var level = ['unknow', 'normal', 'hint', 'warn', 'minor', 'main', 'serious'];
        var _html = latestView({data: data, level: level});
        appEl4.html(_html);
    }
    // 事件数辅助函数
    function getX(data) {
        var arr = [];
        for (var i = 0; i < data.length; i++) {
            arr.push(data[i].createTimeStr);
        }
        return arr;
    }
    function getY(data, yData, len) {
        var aname = ['aLLList', 'miList', 'pingList'];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < len; j++) {
              if (data[aname[i]] && data[aname[i]][j]) {
                yData[aname[i]].push(data[aname[i]][j].count);
              }
            }
        }
    }
    // 根据是否在iframe中 改变背景
    function isTop() {
        if (window.top == window.self) {
            $('.staticTvwallAss').css('background', 'url(../../../img/bg.jpg)');
        }
    }
    window.onbeforeunload = function() {
        if (dataTimer) clearTimeout(dataTimer)
    };

    window.setIncident = setIncident;
    // 缩放倍数
    var xbei = 1, ybei = 1;
    // 缩放方式: 0-铺满屏幕   1-保持比例   2-自定义设置
    var scaleType = 0;
    function setIncident(tvwallId, location) {
        var _html = '<div class="incidentCfg">' + incidentCfgTemplate({
                scaletype: scaleType,
                xbei: xbei,
                ybei: ybei
            }) + '</div>';
        suninfo.dialog(_html, 'incidentCfg', '页面设置', {width: 560});
        suninfo.addButton('incidentCfg', '确定', cfgOk, '取消');
        if (scaleType == 2) {
            $('.incidentCfg .zdy').show();
        } else {
            $('.incidentCfg .zdy').hide();
        }
        suninfo.formValid('#incidentCfg');
        $('.incidentCfg').undelegate().delegate('#scaleType', 'change', function() {
            scaleType = $(this).val();
            if (scaleType == 2) {
                $('.incidentCfg .zdy').show();
            } else {
                $('.incidentCfg .zdy').hide();
            }
        });
    }
    function cfgOk() {
        if (suninfo.formBeforeSubmitCheck('#incidentCfg')) {
            if (scaleType == 2) {
                xbei = $('#xBei').val();
                ybei = $('#yBei').val();
            }
            auto();
        } else {
            return false;
        }
    }
    var incidentInfoView = {
        render: render
    };
    window.refresh = render;
    window.getSet = function() {
      return {
        scaleType: scaleType,
        xbei: xbei,
        ybei: ybei
      }
    };
    window.setSet = function(obj) {
      scaleType = obj.scaleType;
      xbei = obj.xbei;
      ybei = obj.ybei;
      auto();
    };
    $(window).resize(auto);
    module.exports = incidentInfoView;
});
