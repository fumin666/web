/**
 * Created by dgunzi on 2017/1/12.
 */
define(function(require, exports, module) {
    var suninfo = require('../../../js/ajax.interface');
    require('../module/carousel');
    var topologyGraph = require('../module/tvwallTopo.graph');
    var graphConfig = require('../module/tvwallTopo.graphConfig');

    var graphs = [];
    var _currentGraph = null;
    var _oldScale = 0;
    var _oldX = 0;
    var _oldY = 0;

    var _thumbImgInterval = null;

    var _imgIntervalTime = 8000;
    /**
     * 是否在设置进行中
     * @type {boolean}
     * @private
     */
    var _setting = false;

    /**
     * 根据数据新建展示div，包括图的和鹰眼的
     */
    function createGraphPage(){
        var dataStr = '';
        var outLineStr = '';
        var titleStr = '';
        for(var i=0,l=graphs.length;i<l;i++){
            dataStr += '<div class="graphItem" id="graph_'+graphs[i]+'"></div>';
            outLineStr += '<li><div class="outline" data-id="'+graphs[i]+'" id="outline_'+graphs[i]+'"></div></li>';;
            titleStr += '<span class="titleItem" id="title_'+graphs[i]+'"></span>';
        }
        $('#graphList').html(dataStr);
        $('#small_list').html(outLineStr);
        $('#graphTitle').html(titleStr);
    }

    /**
     * 初始化缩略图
     */
    function initThumbnailImg(){
        var vis = 0;
        if(graphs.length <= 5){
            vis = graphs.length;
        }else{
            vis = 5;
        }
        var boxWidth = 90+vis*120;
        $('#topologyBody .small_box').width(boxWidth).css('margin-left','-'+boxWidth/2+'px');
        $('#topologyBody .small_list').width(vis*120);
        $(".banner").thumbnailImg({
            large_elem: ".large_box",
            small_elem: ".small_list",
            left_btn: ".left_btn",
            right_btn: ".right_btn",
            vis:vis
        });
        $('#small_list li').click(function(){
            var graphId = $(this).find('.outline').data('id');
            if(_setting){
                var translate = _currentGraph.view.getTranslate();
                var scale = _currentGraph.view.getScale();
                if(translate.x !=_oldX || translate.y != _oldY || scale != _oldScale){
                    var flag = window.confirm("当前图的视野信息已经改变，是否保存？")
                    if (flag){
                      $('#saveSettingBtn').click();
                    }else {
                      _currentGraph.view.scaleAndTranslate(_oldScale, _oldX, _oldY);
                      $('#graph_' + graphId).css('left', '0px').siblings().css('left', '9999999px');
                      $('#title_' + graphId).show().siblings().hide();
                      _getCurrentGraph();
                    }
                }else{
                    $(this).addClass("on").siblings().removeClass("on");
                    $('#graph_'+graphId).css('left','0px').siblings().css('left','9999999px');
                    $('#title_'+graphId).show().siblings().hide();
                    _getCurrentGraph();
                }
            }else{
                $(this).addClass("on").siblings().removeClass("on");
                $('#graph_'+graphId).css('left','0px').siblings().css('left','9999999px');
                $('#title_'+graphId).show().siblings().hide();
            }
        });

        var l = $('#small_list').find("li").length;
        setThumbImgInterval();
    }

    function setThumbImgInterval(){
        _thumbImgInterval = setInterval(function(){
            $('.right_btn').click();
        },_imgIntervalTime);
    }

    function clearThumbImgInterval(){
        clearInterval(_thumbImgInterval);
    }

    function createGraph(tvwallid, locationStr){
        suninfo.post('viewmanager/topoview/getTopoviewConfig').done(function(result){
            data = JSON.parse(result);
            topology_config = data;
            topology_period = data.period;
            for(var i = 0, l = graphs.length; i < l; i++){
                topologyGraph.init(tvwallid, graphs[i], locationStr);
            }
            graphConfig.initAllGraph(graphs);
            $('#graph_' + graphs[0]).css('left','0px');
            $('#title_' + graphs[0]).show();
        });
    }

    /**
     * 获取当前拓扑图
     * @private
     */
    function _getCurrentGraph(){
        var currentId = $('#small_list li.on').find('.outline').data('id');
        _currentGraph = graphConfig.getGraph(currentId);
        var translate = _currentGraph.view.getTranslate();
        _oldX = translate.x;
        _oldY = translate.y;
        _oldScale = _currentGraph.view.getScale();
    }

    /**
     * 设置操作
     * @param tvwallId
     * @param location
     */
    function settingCurrnetPage(tvwallId,location){
        clearThumbImgInterval();
        _getCurrentGraph();
        _setting = true;
        if($('#settingBtns').length == 0){
            var template = $('#setting_template').html();
            $("body").append(template);

            $('#saveSettingBtn').click(function(){
                var translate = _currentGraph.view.getTranslate();
                var scale = _currentGraph.view.getScale();
                var mapviewStr = translate.x + "|" + translate.y + "|" + scale;

                var param = {};
                param.tvwallid = tvwallId;
                param.location = location;
                param['eyeView.id'] = _currentGraph.container.id.substr(6);
                param['eyeView.setparams'] = mapviewStr;
                suninfo.post('systemManager/staticTvWall/savePortletParam',JSON.stringify(param),{contentType: 'application/json'}).done(function(data){
                    if (data !== 'failed') {
                        _removeSetting();
                        setThumbImgInterval();
                        _setting = false;
                    } else {
                        alert('保存视野信息失败');
                    }
                });
            });

            $('#cancelSettingBtn').click(function(){
                _currentGraph.view.scaleAndTranslate(_oldScale,_oldX,_oldY);
                _removeSetting();
                setThumbImgInterval();
                _currentGraph = null;
                _setting = false;
            });

            _setNewPanning(true);
            _addZoomBtns();
        }
    }

    /**
     * 移除所有设置
     * @private
     */
    function _removeSetting(){
        $('#settingBtns').remove();
        _removeZoomBtns();
        _setNewPanning(false);
    }

    /**
     * 切换拖动
     * @param flag
     * @private
     */
    function _setNewPanning(flag){
        graphConfig.setNewPanning(flag);
        if(flag){
            $('.graphContainer').css('cursor','url(../js/mxgraph/images/openhand.cur) 8 8, default');
        }else{
            $('.graphContainer').css('cursor','default');
        }
    }

    /**
     * 添加缩放按钮
     * @private
     */
    function _addZoomBtns(){
        var template = $('#zoomBtns_template').html();
        $(document.body).append(template);
        $('#zoomInBtn').click(function(){
            _currentGraph.zoomIn();
        });
        $('#zoomOutBtn').click(function(){
            _currentGraph.zoomOut();
        });
    }

    /**
     * 移除缩放按钮
     * @public
     */
    function _removeZoomBtns(){
        $('#zoomBtns').remove();
    }

    window.settingCurrnetPage = settingCurrnetPage;

    $(function() {
        var tvwallid = suninfo.getParameter('tvwallid');
        var locationStr = suninfo.getParameter('location');
        var ids = suninfo.getParameter('id');
        //var data = ['topoviewinfodefaultuuid000000000','c17c62b185d14d7ba60ee152c37472c2','5a45714320d4411294de058931f289d3','3f05d89bdd2c44d29ed08997eee75de3'];
        graphs = ids.split(',');
        createGraphPage();
        initThumbnailImg();
        createGraph(tvwallid, locationStr);
        window.graphConfig = graphConfig;
    });
    window.refresh = function() {
      var tvwallid = suninfo.getParameter('tvwallid');
      var locationStr = suninfo.getParameter('location');
      var ids = suninfo.getParameter('id');
      //var data = ['topoviewinfodefaultuuid000000000','c17c62b185d14d7ba60ee152c37472c2','5a45714320d4411294de058931f289d3','3f05d89bdd2c44d29ed08997eee75de3'];
      graphs = ids.split(',');
      createGraphPage();
      initThumbnailImg();
      createGraph(tvwallid, locationStr);
      window.graphConfig = graphConfig;
    };
    module.exports = {};
});
