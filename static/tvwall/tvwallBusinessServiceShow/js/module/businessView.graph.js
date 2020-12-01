/**
 * @class 业务服务定义流程图
 */
define(function(require, exports, module) {
    var _ = require('../../../js/underscore');
    var suninfo = require('../../../js/ajax.interface.js');
    var editor = new mxEditor();
    var graph = null;
    var rootUrl = "/businessservice/";
    //创建Graph
    function createGraph(id) {
        editor = new mxEditor();
        var container = document.getElementById(id);
        editor.setGraphContainer(container);
        var graph = editor.graph;
        undoManager = editor.undoManager;
        model = graph.getModel();
        graph.border = 80;
        graph.getView().translate = new mxPoint(graph.border / 2, graph.border / 2);
        graph.setResizeContainer(false);
        graph.graphHandler.setRemoveCellsFromParent(false);
        return graph;
    };
    function showOutline(graph,id) {
        var div = document.getElementById(id);
        var gr =graph
        mxOutline.prototype.showViewport = false;
        var outline = new mxOutline(gr, div);
        outline.setEnabled(false);
        outline.setZoomEnabled(false);
        if (mxClient.IS_QUIRKS) {
            new mxDivResizer(outline);
        }
    }
    function loadGraph(uuid,lId,sId) {
        _interval=null;
        graph = createGraph(lId);
        _overwriteFun();
        _loadXMLData(uuid,graph,lId);
        addGraphFilter(graph,lId);
        graph.setEnabled(false);
        showOutline(graph,sId);
        cssHandler();
    };
    function cssHandler() {
        var style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
        style[mxConstants.STYLE_FONTSIZE] = 20;
        style[mxConstants.STYLE_HORIZONTAL] = true;
        style[mxConstants.STYLE_FONTCOLOR] = '#fff';
        style[mxConstants.STYLE_STROKECOLOR] = '#0d4b7d';
        style[mxConstants.STYLE_FOLDABLE] = 0;
        //设置标题区域大小
        style[mxConstants.STYLE_SWIMLANE_LINE] = 0;
        delete style[mxConstants.STYLE_FILLCOLOR];
        //连接线的样式
        style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_ENDARROW] = 'none';
        style[mxConstants.STYLE_STROKECOLOR] = '#1C89E5';
        style[mxConstants.STYLE_STROKEWIDTH] = 2;
        style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_ENDARROW] = 'none';
    }
    function _overwriteFun() {
        mxUndoManager.prototype.backOneStep = function() {
            this.history = this.history.slice(0,this.history.length-2);
            this.indexOfNextAdd = this.indexOfNextAdd-2;
            return this
        };
        mxSwimlane.prototype.paintSwimlane = function(c, x, y, w, h, start, fill, swimlaneLine)
        {
            if (fill != mxConstants.NONE)
            {
                c.save();
                c.setFillColor(fill);
                c.rect(0, 0, w, h);
                c.fillAndStroke();
                c.restore();
                c.setShadow(false);
            }

            c.begin();

            if (this.isHorizontal())
            {
                if (swimlaneLine || start >= h)
                {
                    c.close();
                }

                c.fillAndStroke();

                // Transparent content area
                if (start < h && fill == mxConstants.NONE)
                {
                    c.pointerEvents = false;

                    c.begin();
                    //c.moveTo(0, start);
                    c.moveTo(0, h);
                    c.lineTo(w, h);
                    //c.lineTo(w, start);
                    c.stroke();
                }
            }
            else
            {
                if (swimlaneLine || start >= w)
                {
                    c.close();
                }

                c.fillAndStroke();

                // Transparent content area
                if (start < w && fill == mxConstants.NONE)
                {
                    c.pointerEvents = false;

                    c.begin();
                    // c.moveTo(start, 0);
                    c.moveTo(w, 0);
                    c.lineTo(w, h);
                    //c.lineTo(start, h);
                    c.stroke();
                }
            }
        };
        mxShape.prototype.createSvgCanvas = function()
        {
            var canvas = new mxSvgCanvas2D(this.node, false);
            canvas.strokeTolerance = (this.pointerEvents) ? this.svgStrokeTolerance : 0;
            canvas.pointerEventsValue = this.svgPointerEvents;
            canvas.blockImagePointerEvents = mxClient.IS_FF;
            var off = this.getSvgScreenOffset();

            if (off != 0)
            {
                this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
            }
            else
            {
                this.node.removeAttribute('transform');
            }
            if(this.state != null && this.state.cell.isVertex()){
                canvas.state.cellId = this.state.cell.id;
            }
            if(this.state != null && this.state.cell.isEdge()){
                canvas.state.cellId = this.state.cell.id;
            }
            return canvas;
        };
        mxImageShape.prototype.paintVertexShape = function(c, x, y, w, h)
        {
            if (this.image != null)
            {
                var fill = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_BACKGROUND, null);
                var stroke = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_BORDER, null);

                if (fill != null || stroke != null)
                {
                    c.setFillColor(fill);
                    c.setStrokeColor(stroke);
                    c.rect(x, y, w, h);
                    c.fillAndStroke();
                }

                // FlipH/V are implicit via mxShape.updateTransform
                c.image(x, y, w, h, this.image, this.preserveImageAspect, false, false);
                c.root.setAttribute('id', c.state.cellId);
            }
            else
            {
                mxRectangleShape.prototype.paintBackground.apply(this, arguments);
            }
        };
        mxPolyline.prototype.paintEdgeShape = function(c, pts) {
            if (this.style == null || this.style[mxConstants.STYLE_CURVED] != 1) {
                this.paintLine(c, pts, this.isRounded);
            } else {
                this.paintCurvedLine(c, pts);
            }
            this.node.setAttribute('id', c.state.cellId);
        };
    };
    function addGraphFilter(graph,id){
        var view = graph.getView();
        view.defs =  document.createElementNS(mxConstants.NS_SVG, 'defs');
        //view.defs.innerHTML = '<filter id="error_filter_'+id+'" x="-100%" y="-100%" width="300%" height="300%"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values=".4 .8 .3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="warning_filter_'+id+'" x="-100%" y="-100%" width="300%" height="300%"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="2 1.2 0 0 0 2 .6 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="edge_error_filter" filterUnits="userSpaceOnUse"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="0.3 1.1 0 0 0 0 0 1.6 0 0 0 0 2.4 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="edge_warning_filter" filterUnits="userSpaceOnUse"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="6 1.2 0 0 0 3 .6 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter>';
        view.defs.innerHTML = '<filter id="error_filter_'+id+'" x="-100%" y="-100%" width="300%" height="300%"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="3 0 .3 .4 0 .1 0 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="warning_filter_'+id+'" x="-100%" y="-100%" width="300%" height="300%"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values=".7 .4 0 .8 0 .8 0 .6 0 .1 .6 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="edge_error_filter" filterUnits="userSpaceOnUse"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="2 1.1 0 0 0 0 0 1.6 0 0 0 0 2.4 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="edge_warning_filter" filterUnits="userSpaceOnUse"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="6 1.2 0 0 0 3 .6 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter>';
        view.canvas.appendChild(view.defs);
    }
    function _loadXMLData(uuid,graph,lId) {
        var g = graph
        var businessServiceuuid = uuid
        suninfo.post(rootUrl+'getBusinessServiceView/'+businessServiceuuid,{global:false}).done(function(response) {
            if (response) {
                g.getModel().beginUpdate();
                try {
                    xml = response;
                    var doc = mxUtils.parseXml(xml);
                    var codec = new mxCodec(doc);
                    codec.decode(doc.documentElement, g.getModel());
                    _loadEquipmentInfo(graph,lId,businessServiceuuid);
                }catch(err){
                    console.log(err);
                }finally {
                    g.getModel().endUpdate();
                }
                g.refresh();
                var scale = g.fit();
                setInCenter(g,lId,scale);
                var parent = g.getDefaultParent();
                var titles=[];
                for(var i=0;i<4;i++){
                    if(parent.children[i].children[0]!=null){
                        titles.push(parent.children[i].children[0]);
                    }
                }
                g.setCellStyles(mxConstants.STYLE_FONTCOLOR, '#FFF', titles);
            } else {
                suninfo.alert(bussinessConfig.get('loadError'));
            }
        });
    };
    function setInCenter(g,lId,scale){
        var gr = g;
        var w = $('#'+lId).width();
        var cell = gr.getModel().getChildAt(gr.getDefaultParent(),0);
        var panX = (w - cell.getGeometry().width*scale)/2;
        $('#'+lId).css('margin-left',panX);
    };
    function fit(lId) {
        var graph = createGraph(lId);
        graph.fit();
    }
    function _loadEquipmentInfo(graph,lId,uuid) {
        var gr = graph;
        suninfo.post(rootUrl+'getBusinessRelItcomplist/'+uuid).done(function(data){
            if (data!=null&&data.length > 0) {
                _realtimeInfoCallback(gr,data,lId);
            }
        });
    }
    function _realtimeInfoCallback(g,data,id) {
        var graph = g;
        var model = graph.getModel();
        var cells = model.cells;
        var _errorVertexAry=[];
        var _warningVertexAry=[];
        for(var i=0,l=data.length; i<l;i++) {
            for (var j in cells) {
                if (cells[j].cellType == 0 && cells[j].resourceuuid == data[i].uuid && data[i].pingStatus == 0) {
                    _errorVertexAry.push(cells[j].id);
                    var color='#E4280B';
                    var cell =cells[j];
                } else if (cells[j].cellType == 0 && cells[j].resourceuuid == data[i].uuid && data[i].pingStatus == 1 && data[i].unrecoveryIncidentNum != 0) {
                    _warningVertexAry.push(cells[j].id);
                    var color='#FFDA00'
                    var cell =cells[j];
                }
                if (typeof(cell) != 'undefined'&&cell!=null) {
                    var edges =[];
                    if(cell.edges!=null){
                        for(var k = 0; k<cell.edges.length;k++){
                            edges.push(cell.edges[k])
                        };
                        graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, color , edges);
                    }
                    cell=null;
                }
            };
        }
        _blinkAction(id,_errorVertexAry,_warningVertexAry);
        graph.refresh();
    }
    var _interval=null
    function _blinkAction(id,_errorVertexAry,_warningVertexAry){
        var name = "interval_"+id;
        var flag = true;
        if( name != null){
            clearInterval(name);
        }
        name = setInterval(function() {
            if (flag) {
                if(_errorVertexAry.length > 0){
                    $(_getIdStrForVertex(_errorVertexAry,id)).find('image').css('filter', 'url(#error_filter_'+id+')');
                }
                if(_warningVertexAry.length > 0){
                    $(_getIdStrForVertex(_warningVertexAry,id)).find('image').css('filter', 'url(#warning_filter_'+id+')');
                }
                flag = false;
            } else {
                $('#'+id+' image').css('filter', '');
                $('#'+id+' path').css('filter', '');
                flag = true;
            }
        }, 1000);
    }
    function _getIdStrForVertex(ary,id){
        var aryStr = _.map(ary, function(vertex){ return '#'+id+' #'+vertex; }).join(',');
        if(ary.length == 1){
            aryStr = aryStr + ',#_XXXXXXXXXXXXXXXXXXXXXX_icons';
        }
        return aryStr;
    }
    var businessViewGraph = {
        loadGraph:loadGraph
    };
    module.exports = businessViewGraph;
});
