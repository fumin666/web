define(function (require, exports, module) {

  var _ = require('../../js/underscore');
  var suninfo = require('../../js/ajax.interface.js');
  var manageLevel = require('../../js/manageLevel/manageLevel.interface.js');
  var initGraph = require('./graph.js');
  var healthTemplate = _.template($('#health-template').html());
  var infoTemplate = _.template($('#totalInfo-template').html());
  var incidentCfgTemplate = _.template($("#businessSet-template").html());
  require('./module/carousel');

  function render() {
    loadInfo();
    auto();
  };
  function auto() {
    var _width = 0,
      _height = 0;
    if (window.top != window.self) {
      var doc = window.top.document;
      var ifm = doc.querySelector("iframe");
      if (doc.querySelector("#fullBoxIframe")) {
        ifm = doc.querySelector("#fullBoxIframe");
      }
      _width = ifm.clientWidth;
      _height = ifm.clientHeight;
      $(".staticTvwallInci").css("marginLeft", 0);
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
      $(".staticTvwallInci").css("transform", "scale(" + xbei + "," + ybei + ")");
      // 水平居中
      var resx = Math.round(_width - 1920 * xbei);
      if (resx > 0) {
        $(".staticTvwallInci").css("marginLeft", resx / 2);
      }
    }
  }

  function loadInfo() {
    var data = '';
    var largeLiStr='';
    var smallLiStr='';
    suninfo.post('/businessservice/businessServiceinfoViewList').done(function(response){
      data = response;
      if (data.length > 0) {
        //生成若干个结构
        for (var i = 0; i < data.length; i++) {
          largeLiStr += '<li>' +
            '<div class="business-title"></div>' +
            '<div id="graphContainer' + (i + 1) + '" class="graphContain"></div>' +
            '</li>';
          smallLiStr += '<li data-uuid = "' + data[i].uuid + '">' +
            '<div id="outlineContainer' + (i + 1) + '" class="outline"></div>' +
            '<div class="bun_bg"></div>' +
            '</li>';
        }
        ;
        $('#large_list').append(largeLiStr);
        $('#small_list').append(smallLiStr);
        //生成图
        graphContain = $('.graphContain');
        graphContain.each(function (index, el) {
          $(this).prev().text(response[index].name);
          var $lagreId = el.id;
          var num = index + 1;
          smallId = 'outlineContainer' + num;
          var uuid = response[index].uuid;
          console.log('this is uuid', uuid);
          initGraph(uuid, $lagreId, smallId)
        });
        moreLoad(data[0].uuid, data);
        /*轮播初始*/
        $(".banner").thumbnailImg({
          large_elem: ".large_box",
          small_elem: ".small_list",
          left_btn: ".left_btn",
          right_btn: ".right_btn"
        });
        /*监听事件*/
        var btn = $('.small_box .btn');
        var li = $('.small_box li');
        btn.bind('click', function () {
          var uuid = $('.small_box .on').data('uuid');
          moreLoad(uuid, data)
        });
        li.bind('click', function () {
          var uuid = $(this).data('uuid');
          moreLoad(uuid, data);
        });
      }
    });
  }

  function moreLoad(id, data) {
    var uuid = id;
    for (var i = 0; i < data.length; i++) {
      if (uuid == data[i].uuid) {
        $('#totalInfo').html(infoTemplate({'resp': data[i]}));
        var num = data[i].status || 4;
        $('#manageCon').empty();
        manageLevel.manageLevel('#manageCon', {level: num, nameList: ['严重', '告警', '正常', '未知']});
        loadBattay(data[i].todayAvailable);
        $('#battery-word').text(data[i].todayAvailable + '%');
      }
    }
    suninfo.post('businessservice/getBusinessServicesItcompRelStatusListByBusinessServicesInfoUuid/' + uuid + '/1', {global: false}).done(function (response) {
      $('#compHealth').html(healthTemplate({'resp': response}))
    });
  }

  function loadBattay(data) {
    $(".battery-item li span").width('100%');
    var oLi = $(".battery-item li");
    oLi.removeClass('yes');
    var percent = data;
    var int = parseInt(percent / 10);
    var res = percent % 10;
    for (var i = 0; i < int; i++) {
      oLi.eq(i).addClass("yes");
    }
    if (res > 0) {
      oLi.eq(int).addClass('yes');
      var _width = (res * 0.1 * 8) + 'px';
      oLi.eq(int).find("span").width(_width);
    }
  }

  window.setBussiness = setBussiness;
  // 缩放倍数
  var xbei = 1, ybei = 1;
  // 缩放方式: 0-铺满屏幕   1-保持比例   2-自定义设置
  var scaleType = 0;

  function setBussiness(tvwallId, location) {
    var _html = '<div class="incidentCfg">' + incidentCfgTemplate({
        scaletype: scaleType,
        xbei: xbei,
        ybei: ybei
      }) + '</div>';
    suninfo.dialog(_html, 'incidentCfg', "页面设置", {width: 560});
    suninfo.addButton('incidentCfg', '确定', cfgOk, '取消');
    if (scaleType == 2) {
      $(".incidentCfg .zdy").show();
    } else {
      $(".incidentCfg .zdy").hide();
    }
    suninfo.formValid('#incidentCfg');
    $(".incidentCfg").undelegate().delegate("#scaleType", "change", function () {
      scaleType = $(this).val();
      if (scaleType == 2) {
        $(".incidentCfg .zdy").show();
      } else {
        $(".incidentCfg .zdy").hide();
      }
    });
  }

  function cfgOk() {
    if (suninfo.formBeforeSubmitCheck("#incidentCfg")) {
      if (scaleType == 2) {
        xbei = $("#xBei").val();
        ybei = $("#yBei").val();
      }
      auto();
    } else {
      return false;
    }
  }

  window.getSet = function () {
    return {
      scaleType: scaleType,
      xbei: xbei,
      ybei: ybei
    }
  };
  window.setSet = function (obj) {
    scaleType = obj.scaleType;
    xbei = obj.xbei;
    ybei = obj.ybei;
    auto();
  };
  window.refresh = function () {
    window.location.reload(true);
  };
  $(function () {
    render();
    $(window).resize(function () {
      auto();
    })
  })
});
