define(function(require, exports, module) {
    //var graphConfig = require('./tvwallTopo.graphConfig');
    /**
     * 第二个标签是否显示
     * @private
     */
    var secondLabelVisible = false;

    /**
     * 所有第二个标签要显示的数据
     * @private
     */
    var secondLabelData = null;

    /**
     * 覆写缩略图update方法
     * 为提高精度，将100变为10000
     * @private
     */
    function _expandOutline(){
        /**
         * Updates the outline.
         */
        mxOutline.prototype.update = function(revalidate)
        {
            if (this.source != null && this.outline != null)
            {
                var sourceScale = this.source.view.scale;
                var scaledGraphBounds = this.getSourceGraphBounds();
                var unscaledGraphBounds = new mxRectangle(scaledGraphBounds.x / sourceScale + this.source.panDx,
                    scaledGraphBounds.y / sourceScale + this.source.panDy, scaledGraphBounds.width / sourceScale,
                    scaledGraphBounds.height / sourceScale);

                var unscaledFinderBounds = new mxRectangle(0, 0,
                    this.source.container.clientWidth / sourceScale,
                    this.source.container.clientHeight / sourceScale);

                var union = unscaledGraphBounds.clone();
                union.add(unscaledFinderBounds);

                // Zooms to the scrollable area if that is bigger than the graph
                var size = this.getSourceContainerSize();
                var completeWidth = Math.max(size.width / sourceScale, union.width);
                var completeHeight = Math.max(size.height / sourceScale, union.height);

                var availableWidth = Math.max(0, this.outline.container.clientWidth - this.border);
                var availableHeight = Math.max(0, this.outline.container.clientHeight - this.border);

                var outlineScale = Math.min(availableWidth / completeWidth, availableHeight / completeHeight);
                var scale = Math.floor(outlineScale * 10000) / 10000;
                if (scale > 0)
                {
                    if (this.outline.getView().scale != scale)
                    {
                        this.outline.getView().scale = scale;
                        revalidate = true;
                    }

                    var navView = this.outline.getView();

                    if (navView.currentRoot != this.source.getView().currentRoot)
                    {
                        navView.setCurrentRoot(this.source.getView().currentRoot);
                    }

                    var t = this.source.view.translate;
                    var tx = t.x + this.source.panDx;
                    var ty = t.y + this.source.panDy;

                    var off = this.getOutlineOffset(scale);

                    if (off != null)
                    {
                        tx += off.x;
                        ty += off.y;
                    }

                    if (unscaledGraphBounds.x < 0)
                    {
                        tx = tx - unscaledGraphBounds.x;
                    }
                    if (unscaledGraphBounds.y < 0)
                    {
                        ty = ty - unscaledGraphBounds.y;
                    }

                    if (navView.translate.x != tx || navView.translate.y != ty)
                    {
                        navView.translate.x = tx;
                        navView.translate.y = ty;
                        revalidate = true;
                    }

                    // Prepares local variables for computations
                    var t2 = navView.translate;
                    scale = this.source.getView().scale;
                    var scale2 = scale / navView.scale;
                    var scale3 = 1.0 / navView.scale;
                    var container = this.source.container;

                    // Updates the bounds of the viewrect in the navigation
                    this.bounds = new mxRectangle(
                        (t2.x - t.x - this.source.panDx) / scale3,
                        (t2.y - t.y - this.source.panDy) / scale3,
                        (container.clientWidth / scale2),
                        (container.clientHeight / scale2));

                    // Adds the scrollbar offset to the finder
                    this.bounds.x += this.source.container.scrollLeft * navView.scale / scale;
                    this.bounds.y += this.source.container.scrollTop * navView.scale / scale;

                    var b = this.selectionBorder.bounds;

                    if (b.x != this.bounds.x || b.y != this.bounds.y || b.width != this.bounds.width || b.height != this.bounds.height)
                    {
                        this.selectionBorder.bounds = this.bounds;
                        this.selectionBorder.redraw();
                    }

                    // Updates the bounds of the zoom handle at the bottom right
                    var b = this.sizer.bounds;
                    var b2 = new mxRectangle(this.bounds.x + this.bounds.width - b.width / 2,
                        this.bounds.y + this.bounds.height - b.height / 2, b.width, b.height);

                    if (b.x != b2.x || b.y != b2.y || b.width != b2.width || b.height != b2.height)
                    {
                        this.sizer.bounds = b2;

                        // Avoids update of visibility in redraw for VML
                        if (this.sizer.node.style.visibility != 'hidden')
                        {
                            this.sizer.redraw();
                        }
                    }

                    if (revalidate)
                    {
                        this.outline.view.revalidate();
                    }
                }
            }
        };
    }

    /**
     * 设置第二个标签
     * @private
     * @param {mxGraph} graph 拓扑图实例
     */
    function _setSecondLabel(graph) {
        secondLabelVisible = false;

        // 返回第二个标签字符串
        graph.getSecondLabel = function(cell) {
            var rValue = null;
            if (secondLabelData != null && !this.model.isEdge(cell)) {
                $.each(secondLabelData,function(key, value) {
                    if (cell.id == key + "_icon") {
                        rValue = value;
                    }
                });
            }
            return rValue;
        };

        var relativeChildVerticesVisible = true;

        // Overrides method to hide relative child vertices
        graph.isCellVisible = function(cell) {
            return ! this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative || cell.geometry.relative == relativeChildVerticesVisible;
        };

        // 在图形的边上添加数字标签
        var createShape = graph.cellRenderer.createShape;
        graph.cellRenderer.createShape = function(state) {
            createShape.apply(this, arguments);
            if (secondLabelVisible && !state.cell.geometry.relative) {
                var secondLabel = graph.getSecondLabel(state.cell);
                if (secondLabel != null && state.shape != null && state.secondLabel == null && !graph.isSwimlane(state.cell)) {
                    state.secondLabel = new mxText('<div>'+secondLabel+'</div>', new mxRectangle(), mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM,'#ffffff','Arial',12,null,null,null,null,null,null,null,'#ff0000','#cc0000',null,null,null,4);
                    state.secondLabel.init(state.view.getDrawPane());
                }
            }
        };

        // 当一个节点移动或改变大小后，重绘图形边上添加的数字标签
        var redraw = graph.cellRenderer.redraw;
        graph.cellRenderer.redraw = function(state) {
            redraw.apply(this, arguments);

            if (state.shape != null && typeof state.secondLabel != 'undefined') {
                var scale = graph.getView().getScale();
                var bounds = new mxRectangle(state.x + state.width - 8 * scale, state.y + 8 * scale, 0, 0);
                state.secondLabel.value = graph.getSecondLabel(state.cell);
                state.secondLabel.scale = scale;
                state.secondLabel.bounds = bounds;
                state.secondLabel.redraw();
            }
        };

        // 销毁图形边上的数字标签
        var destroy = graph.cellRenderer.destroy;
        graph.cellRenderer.destroy = function(state) {
            destroy.apply(this, arguments);

            if (typeof state.secondLabel != 'undefined' && state.secondLabel != null) {
                state.secondLabel.destroy();
                state.secondLabel = null;
            }
        };
    }

    /**
     * 添加过滤器（red_shadow_bottom表示告警、yellow_shadow_bottom表示异常）
     * @param graph
     */
    function addGraphFilter(graphId){
        var graph = graphConfig.getGraph(graphId);
        var view = graph.getView();
        view.defs =  document.createElementNS(mxConstants.NS_SVG, 'defs');
        view.defs.innerHTML = '<filter id="error_filter" x="-100%" y="-100%" width="300%" height="300%"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="3 0 .3 .4 0 .1 0 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="warning_filter" x="-100%" y="-100%" width="300%" height="300%"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values=".7 .4 0 .8 0 .8 0 .6 0 .1 .6 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="edge_error_filter" filterUnits="userSpaceOnUse"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="2 1.1 0 0 0 0 0 1.6 0 0 0 0 2.4 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="edge_warning_filter" filterUnits="userSpaceOnUse"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="6 1.2 0 0 0 3 .6 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter>';
        view.canvas.appendChild(view.defs);
    }

    /**
     * 节点扩展函数（是否为子拓扑、是否为Hub）
     * @private
     */
    function mxCellEx(){
        /**
         * 子拓扑扩展（是否为子拓扑）
         * @global
         */
        mxCell.prototype.isSubTopoCell = function()
        {
            if(this.style && this.style.indexOf('subtopology') != -1){
                return true;
            }
            return false;
        };
        /**
         * Hub扩展（是否为虚节点）
         * @global
         */
        mxCell.prototype.isHub = function()
        {
            var flag = false;
            if(this.funcType &&　this.funcType == hubType){
                flag = true;
            }
            return flag;
        };

        /**
         * 是否为pointCell
         * @global
         */
        mxCell.prototype.isPointCell = function(){
            var flag = false;
            if(typeof this.style != 'undefined' && this.style.indexOf('pointCell') !== -1){
                flag = true;
            }
            return flag;
        };

        /**
         * 是否为iconCell
         * @global
         */
        mxCell.prototype.isIconVertex = function(){
            return typeof this.style != 'undefined' && typeof this.underCell != 'undefined' && this.style.indexOf('image;image') != -1;
        };

        /**
         * 是否为区域
         * @global
         */
        mxCell.prototype.isGroupCell = function(){
            var flag = false;
            if(typeof this.style != 'undefined' && this.style.indexOf('group') !== -1){
                flag = true;
            }
            return flag;
        };

        /**
         * 根节点扩展（是否为图的根节点）
         * @global
         */
        mxCell.prototype.isRootCell = function()
        {
            var flag = false;
            if(this.isRootNode &&　this.isRootNode == '1'){
                flag = true;
            }
            return flag;
        };

        /**
         * 是否为文字
         * @global
         */
        mxCell.prototype.isTextCell = function()
        {
            var flag = false;
            if(typeof this.style != 'undefined' && this.style.indexOf('stext') !== -1){
                flag = true;
            }
            return flag;
        };

        /**
         * 是否为可连接的cell
         * @global
         */
        mxCell.prototype.isConnectable = function(){
            if(this.isGroupCell() || this.isTextCell()){
                return false;
            }else{
                return this.connectable;
            }
        };

        /**
         * 简化cell.geometry为只包含width、height、x、y的对象
         * @global
         */
        mxCell.prototype.parseGeo = function(){
            return {
                width : this.geometry.width,
                height :this.geometry.height,
                x : this.geometry.x,
                y : this.geometry.y
            }
        };
    }

    /**
     * 设置第二个标签是否可见
     * @public
     * @param {Boolean} flag 是否可见
     */
    function setSecondVisible(flag) {
        secondLabelVisible = flag;
    }

    /**
     * 获得第二个标签是否可见
     * @public
     * @return {Boolean} 返回是否可见
     */
    function getSecondVisible() {
        return secondLabelVisible;
    }

    /**
     * 设置第二个标签的数据
     * @public
     * @param {Object} data 来自实时数据对象中未处理告警数量的数据
     */
    function setSecondLabelData(data) {
        if(secondLabelData === null){
            secondLabelData = {};
        }
        $.extend(secondLabelData, data);
    }

    /**
     * 扩展mxgraph的mxImageShape.prototype.paintVertexShape与mxPolyline.paintEdgeShape方法用以增加节点id
     * @private
     */
    function _expandPaintShape(){
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
    }

    /**
     * 为提供的图实例做扩展
     * @public
     * @param {mxGraph} graphId 拓扑图uuid
     */
    function extend(graphId){
        var graph = graphConfig.getGraph(graphId);
        _setSecondLabel(graph);
        _expandOutline();
        _expandPaintShape();
    }

    module.exports = {
        extend : extend,
        mxCellEx: mxCellEx,
        getSecondVisible: getSecondVisible,
        setSecondVisible: setSecondVisible,
        setSecondLabelData: setSecondLabelData,
        addGraphFilter : addGraphFilter
    };
});