/**
 * @fileOverview 此文件中包含GraphToolTip对象，该对象用于处理鼠标浮动于拓扑中资产节点以及资产间连线上获取相关信息提示
 * @author <a href="mailto:dingyf@suninfo.com">dingyf</a>
 * @version 1.0.0
 */
/**
 * 用于处理鼠标浮动于拓扑中资产节点以及资产间连线上获取相关信息提示
 * @class 拓扑资产信息提示
 */
/**
 * 资产节点提示信息模板
 * @private
 */
import { getTopoviewLineDetail, getTopoviewNodeDetail } from '../api/topology_api'
let $ = window.$;

var htmlStr = '<div class="cellNodeTips">' +
  '<div class="line">' +
  '<span class="title">资产名称</span><span class="info">#hostName#</span>' +
  '</div>' +
  '<div class="line">' +
  '<span class="title">资产IP</span><span class="info">#ip#</span>' +
  '</div>' +
  '<div class="line">' +
  '<span class="title">状态</span><span class="info">#status#</span>' +
  '</div>' +
  '<div class="line">' +
  '<span class="title">CPU使用率</span><span class="info">#cpuRate#</span>' +
  '</div>' +
  '<div class="line">' +
  '<span class="title">内存使用率</span><span class="info">#memRate#</span>' +
  '</div>' +
  '<div class="line">' +
  '<span class="title">运行时长</span><span class="info">#runTime#</span>' +
  '</div>' +
  '</div>';
/**
 * 资产间连线提示信息模板
 * @private
 */
var htmlStr2 = '<div class="cellEdgeTips">' +
  '<div class="item"><i class="icon iconfont icon-source"></i><span>源端</span></div>' +
  '<div class="line"><span class="title">资产名称</span><span class="info">#sHostName#</span></div>' +
  '<div class="line"><span class="title">资产IP</span><span class="info">#sIp#</span></div>' +
  '#sVlan#' +
  '<div class="line"><span class="title">端口名称</span><span class="info">#sIName#</span></div>' +
  '<div class="clr"></div>' +
  '<div class="item"><i class="icon iconfont icon-aim"></i><span>目标端</span></div>' +
  '<div class="line"><span class="title">资产名称</span><span class="info">#tHostName#</span></div>' +
  '<div class="line"><span class="title">资产IP</span><span class="info">#tIp#</span></div>' +
  '#tVlan#' +
  '<div class="line"><span class="title">端口名称</span><span class="info">#tIName#</span></div>' +
  '</div>';

var vlanStr = '<div class="line"><span class="title">vlan</span><span class="info">#vlanStr#</span></div>';

/**
 * 图组件实例
 * @private
 */
var graph = null;

/**
 * 扩展拓扑图中tooltip(提示)
 * @public
 * @param {mxGraph} g 图实例
 */
function extendsTooltip(g) {
  graph = g;
  graph.tooltipHandler.init = function() {
    if (document.body !== null) {
      this.div = document.createElement('div');
      this.div.className = 'cellTips';
      this.div.style.visibility = 'hidden';
      this.div.style.zIndex = this.zIndex;

      document.body.appendChild(this.div);

      window.mxEvent.addListener(this.div, 'mousedown', window.mxUtils.bind(this,
        function(evt) {
          this.hideTooltip();
      }));
    }
  };
  graph.getTooltip = function(state, node, x, y) {
    var tip = null;
    if (state !== null) {
      if (state.cell !== null) {
        tip = {};
        if (state.cell.isEdge()) {
          tip.isEdge = true;
        } else {
          tip.isEdge = false;
        }
        tip.cell = state.cell;
      }
    }
    return tip;
  };
  graph.tooltipHandler.show = function(tip, x, y) {
    if (tip !== null && window.TopologyGraph.getMode() === 1) {
      if (typeof this.div === 'undefined') {
        this.init();
      }
      var origin = window.mxUtils.getScrollOrigin();
      if (tip.isEdge) {
        _getEdgeTipInfo(tip.cell.id, x, y, origin);
      } else {
        var itCompentId = tip.cell.uuid;
        if (tip.cell.style !== 'flowrate' && !tip.cell.isGroupCell() && !tip.cell.isTextCell() && !tip.cell.isSubTopoCell() && !tip.cell.isHub()) {
          _getVerticesInfo(itCompentId, x, y, origin);
        }
      }
    }
  };
}

/**
 * 通过uuid获取连线信息
 * @prviate
 * @param {String} uuid 线的uuid
 * @param {Object} x x轴坐标
 * @param {Object} y y轴坐标
 * @param {Object} origin 原点信息
 */
function _getEdgeTipInfo(uuid, x, y, origin) {
  getTopoviewLineDetail(uuid).then(function(res) {
    if (res !== null && res !== undefined) {
      var newStr = htmlStr2;
      var data = $.extend({
        utilization: '',
        sourceHostName: '',
        sourceIp: '',
        sourceInterfaceName: '',
        sourceSpeed: '',
        sourceUtilization: '',
        targetHostName: '',
        targetIp: '',
        targetInterfaceName: '',
        targetSpeed: '',
        targetUtilization: ''
      }, res);

      newStr = newStr.replace(/#utilization#/g, data.utilization);
      newStr = newStr.replace(/#sHostName#/g, data.sourceHostName).replace(/#sIp#/g, data.sourceIp).replace(/#sIName#/g, data.sourceInterfaceName).replace(/#sSpeed#/g, data.sourceSpeed).replace(/#sUtilization#/g, data.sourceUtilization);
      newStr = newStr.replace(/#tHostName#/g, data.targetHostName).replace(/#tIp#/g, data.targetIp).replace(/#tIName#/g, data.targetInterfaceName).replace(/#tSpeed#/g, data.targetSpeed).replace(/#tUtilization#/g, data.targetUtilization);

      var sVlan = '';
      var tVlan = '';
      if (typeof data.sourceVlan !== 'undefined' && data.sourceVlan !== 'null') {
        sVlan = vlanStr;
        sVlan = sVlan.replace(/#vlanStr#/g, data.sourceVlan);
      }
      if (typeof data.targetVlan !== 'undefined' && data.targetVlan !== 'null') {
        tVlan = vlanStr;
        tVlan = tVlan.replace(/#vlanStr#/g, data.targetVlan);
      }
      newStr = newStr.replace(/#sVlan#/g, sVlan).replace(/#tVlan#/g, tVlan);

      var tipDiv = graph.tooltipHandler.div;
      tipDiv.innerHTML = newStr;
      tipDiv.style.left = (x + origin.x) + 'px';
      tipDiv.style.top = (y + window.mxConstants.TOOLTIP_VERTICAL_OFFSET + origin.y) + 'px';
      tipDiv.style.visibility = '';
      window.mxUtils.fit(tipDiv);
    }
  });
}

/**
 * 通过组件id获取资产节点信息
 * @private
 * @param {Object} itCompentId IT组件id
 * @param {Object} x x轴坐标
 * @param {Object} y y轴坐标
 * @param {Object} origin 原点信息
 */
function _getVerticesInfo(itCompentId, x, y, origin) {
  getTopoviewNodeDetail(itCompentId).then(function(data) {
    if (data !== null && data !== undefined) {
      // 基本信息部分
      var newStr = htmlStr;
      newStr = newStr.replace(/#ip#/g, data.ip).replace(/#hostName#/g, data.hostName).replace(/#catalogy#/g, data.catalogy).replace(/#status#/g, data.status).replace(/#runTime#/g, data.runTime);
      var cpuRate = data.cpuRate;
      if (cpuRate == null || typeof cpuRate === 'undefined') {
        cpuRate = '0.0%';
      } else {
        cpuRate += '%';
      }
      var memRate = data.memRate;
      if (memRate == null || typeof memRate === 'undefined') {
        memRate = '0.0%';
      } else {
        memRate += '%';
      }

      var cpuFrequ = data.cpuFrequ;
      if (cpuFrequ == null || typeof cpuFrequ === 'undefined') {
        cpuFrequ = '0.0%';
      } else {
        cpuFrequ += 'MHZ';
      }

      if (cpuFrequ !== '0.0%' && cpuRate === '0.0%') {
        newStr = newStr.replace(/CPU使用率/g, 'CPU频率').replace(/#cpuRate#/g, cpuFrequ).replace(/#memRate#/g, memRate);
      } else {
        newStr = newStr.replace(/#cpuRate#/g, cpuRate).replace(/#memRate#/g, memRate);
      }
      var tipDiv = graph.tooltipHandler.div;
      tipDiv.innerHTML = newStr;
      tipDiv.style.left = (x + origin.x) + 'px';
      tipDiv.style.top = (y + window.mxConstants.TOOLTIP_VERTICAL_OFFSET + origin.y) + 'px';
      tipDiv.style.visibility = '';
      window.mxUtils.fit(tipDiv);
    }
  });
}

export default {
  extendsTooltip: extendsTooltip
};
