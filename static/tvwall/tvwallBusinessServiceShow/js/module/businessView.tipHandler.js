/**
 * @class 浮动信息提示
 */
define(function(require, exports, module){

    var rootUrl = "/businessservice/"
    /**
     * 设备提示信息模板
     * @private
     */
    var htmlStr = '<div class="row frow"><div class="title">基本信息</div></div><table class="list listWrap"><tbody>';
    htmlStr += '<tr class="firstrow odd-row"><td class="rightrow" style="color:#666;">名称</td><td>#name#</td><td class="rightrow businessServiceEffectBorder">服务状态</td><td>#statusName#</td></tr>';
    htmlStr += '<tr class="even-row"><td class="rightrow businessServiceEffectBorder" style="color:#666;">提供方</td><td class="businessServiceEffectBorder">#provider#</td><td class="rightrow businessServiceEffectBorder">维护人</td><td>#username#</td></tr>';
    htmlStr += '<tr class="odd-row"><td  class="rightrow businessServiceEffectBorder" style="color:#666;">影响度</td><td class="businessServiceEffectBorder">#createTime#</td><td class="rightrow businessServiceEffectBorder">关键程度</td><td>#modifyTime#</td></tr>';
    htmlStr += '<tr class="even-row"><td class="rightrow businessServiceEffectBorder">描述</td><td colspan="3">#decription#</td></tr>';
    htmlStr += '<tr class="even-row"><td class="rightrow businessServiceEffectBorder">根本原因</td><td colspan="3">#reason#</td></tr>';
    htmlStr += '</tbody></table>';

    /**
     * tooltip(提示)
     * @public
     */
    function extendsTooltip() {
        var graph = businessEffectViewGraph.getGraph();
        /**
         * @ignore
         */
        graph.tooltipHandler.init = function() {
            if (document.body !== null) {
                this.div = document.createElement('div');
                this.div.className = 'floatTooltip';
                this.div.style.width='680px';
                this.div.innerHTML = htmlStr;
                this.div.style.visibility = 'hidden';
                this.div.style.zIndex = this.zIndex;
                document.body.appendChild(this.div);

                mxEvent.addListener(this.div, 'mousedown', mxUtils.bind(this,
                    function(evt) {
                        this.hideTooltip();
                    }));
            }
        };
        graph.getTooltip = function(state, node, x, y) {
            var tip = null;
                if (state.cell.businessUuid !== null && state.cell.businessUuid !== undefined) {
                    tip = {};
                    tip.isCompent = true;
                    tip.businessId =state.cell.businessUuid;
                }
            return tip;
        };
        graph.tooltipHandler.show = function(tip, x, y) {
            if (tip !== null) {
                if (typeof this.div === 'undefined') {
                    this.init();
                }
                var origin = mxUtils.getScrollOrigin();
                if(tip.isCompent) {
                    _getCompentInfo(tip.businessId, x, y,origin);
                }
            }
        };
    }

    /**
     * 通过组件id获取设备节点信息
     * @private
     * @param {Object} itCompentId IT组件id
     * @param {Object} x x轴坐标
     * @param {Object} y y轴坐标
     * @param {Object} origin 原点信息
     */
    function _getCompentInfo(uuid, x, y,origin) {
        suninfo.post(rootUrl + "getBusinessServicesInfo/"+uuid,{global:false}).done(function(data) {
            if (data !== null && data !== undefined) {
                var newStr = htmlStr;
                newStr = newStr.replace(/#name#/g, data.name).replace(/#provider#/g, (data.providerView!=null)?data.providerView.orgName:'无')
                    .replace(/#username#/g,(data.maintenanceView!=null)?data.maintenanceView.userName:'无')
                    .replace(/#createTime#/g,data.effectName).replace(/#modifyTime#/g,data.criticalityName).replace(/#decription#/g,(data.decription!=null)?data.decription:'无')
                    .replace(/#statusName#/g,(data.statusName!=null)?data.statusName:'未监控').replace(/#reason#/g,(data.reason!=null)?data.reason:'无');
                var tipDiv = businessEffectViewGraph.getGraph().tooltipHandler.div;
                tipDiv.innerHTML = newStr;
                tipDiv.style.left = (x + origin.x) + 'px';
                tipDiv.style.top = (y + mxConstants.TOOLTIP_VERTICAL_OFFSET + origin.y) + 'px';
                tipDiv.style.visibility = '';
                mxUtils.fit(tipDiv);
            }

        })
    }

    var floatToolTip = {
        extendsTooltip: extendsTooltip
    };

    module.exports = floatToolTip;
});
