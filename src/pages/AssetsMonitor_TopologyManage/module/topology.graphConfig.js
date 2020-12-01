/**
 * @fileOverview 此文件中包含GraphConfig对象，该对象用于操作拓扑配置（配色方案、拓扑背景、拓扑视野）
 * @author <a href="mailto:dingyf@suninfo.com">dingyf</a>
 * @version 1.0.0
 */

/**
 * 用于完成拓扑图的相关配置，包括拓扑图视野、拓扑图配色方案、拓扑图背景。\n
 * 这些信息都已json格式存于TopologyConfig.json文件中，配色方案和背景再页面一完成时载入，拓扑视野在载入数据后调用。\n
 * 获取拓扑实时信息的时候，需要从配置对象中取得配色方案数据。\n
 * @class 拓扑图配置对象
 */
let $ = window.$;

/**
 * 连线颜色
 * @default #EF715D（红） #7EAF08（绿） #FCC400（黄）
 */
var colors = ['#EF715D', '#7EAF08', '#FCC400'];

/**
 * 拓扑背景目录
 * @constant
 */
var _TOPOLOGYBG_PATH = '../../../static/images/topologybg/';

/**
 * 拓扑图标目录
 * @constant
 */
var _TOPOLOGYICO_PATH = '../../../static/images/topologyicon/';

/**
 * 节点浮动颜色
 * @default
 */
var hovercolor = 'f5001d';

/**
 * 拓扑布局类型常量
 * @constant
 */
var _LAYOUT_LIST = {
  'circle': 1,
  'organic': 2,
  'horizontalTree': 3,
  'verticalTree': 4,
  'radialTree': 5,
  'horizontalFlow': 6,
  'verticalFlow': 7
};
/**
 * 载入配置文件（包含配色方案与背景）
 * @public
 * @param {mxGraph} g 拓扑图实例
 */
function loadTopologyConfig () {
  // _setTopologyBgColor(window.TopologyGraph.getGraphVm().config.bgcolor);
  let theme = localStorage.getItem('theme');
  let labelColor = theme === 'dark' ? 'ffffff' : '667480';
  _setTopologyLabelColor(labelColor);
  _setTopologyLineColor(window.TopologyGraph.getGraphVm().config.linecolor);
  _setTopologyHoverColor(window.TopologyGraph.getGraphVm().config.hovercolor);
}

/**
 * 设置拓扑视野
 * @private
 * @param {Array} mvs 视野数组
 */
function _setTopologyMv (mvs) {
  if (mvs.length > 0) {
    var mvArray = mvs.split('|');
    _setTranslateAndScale(mvArray[0], mvArray[1], mvArray[2]);
    window.TopologyGraph.getGraphVm().currentScale = parseFloat(mvArray[2]);
  }
}

/**
 * 设置移动位置和缩放大小
 * @private
 * @param {Number} x 视野位置x
 * @param {Number} y 视野位置y
 * @param {Number} scale 缩放大小
 */
function _setTranslateAndScale (x, y, scale) {
  window.TopologyGraph.getGraph().view.scaleAndTranslate(parseFloat(scale), parseFloat(x), parseFloat(y));
}

/**
 * 设置拓扑背景
 * @public
 * @param {String} img 图片名
 * @param {Number} width 图片的宽
 * @param {Number} height 图片的高
 */
function setTopologyBgImg (imgStr) {
  if (imgStr === '' || imgStr == null) {
    imgStr = 'org_bg.png';
  }
  window.TopologyGraph.getGraphVm().background = imgStr;
  if (imgStr && imgStr !== 'org_bg.png') {
    $('#topology_graph').css('background-image', 'url(' + _TOPOLOGYBG_PATH + imgStr + ')');
    $('#topology_graph').css('background-size', '100% 100%');
  } else {
    $('#topology_graph').css('background-image', '');
    $('#topology_graph').css('background-size', '');
  }
}

/**
 * 修改配置的拓扑线的颜色
 * @private
 * @param {Array} linecolor 颜色数组
 */
function _setTopologyLineColor (linecolor) {
  colors = ['#' + linecolor[0], '#' + linecolor[1], '#' + linecolor[2]];
    // 设置默认节点和连线的颜色
  _setImgAndEdgeColor(colors[1]);
}

/**
 * 修改配置的节点浮动颜色
 * @param {String} hcolor
 */
function _setTopologyHoverColor (hcolor) {
  hovercolor = hcolor;
}

/**
 * 设置配置拓扑背景颜色
 * @private
 * @param {String} color 颜色
 */
/* function _setTopologyBgColor (color) {
  $('#containerGraph').css('background-color', '#' + color);
} */

/**
 * 设置拓扑标签颜色
 * @private
 * @param {String} labelcolor 标签颜色
 */
function _setTopologyLabelColor (labelcolor) {
  var sheet = window.TopologyGraph.getGraph().getStylesheet();
  sheet.styles.flowrate.fontColor = '#' + labelcolor;
  sheet.styles.image.fontColor = '#' + labelcolor;
}

/**
 * 设置连线颜色
 * @private
 * @param {String} color 连线颜色
 */
function _setImgAndEdgeColor (color) {
  var style = window.TopologyGraph.getGraph().getStylesheet();
  style.styles.defaultEdge.strokeColor = color;
    // style.styles.image.fillColor = color;
  window.TopologyGraph.getGraph().setStylesheet(style);
}

/**
 * 保存并设置配色方案
 * @public
 * @param {Object} obj 配置对象
 */
function setColorSchemes (obj) {
  /*
  var data = {
    'linecolor1': obj.linecolor[0],
    'linecolor2': obj.linecolor[1],
    'linecolor3': obj.linecolor[2],
    'labelcolor': obj.labelcolor,
    'hovercolor': obj.hovercolor
  };

  suninfo.post('../viewmanager/topoview/saveColorSchemes', JSON.stringify(data), {
    contentType: 'application/json',
    global: false
  }).done(function (data) {
    if (data.flag) {
      _setTopologyLabelColor(obj.labelcolor);
      _setTopologyLineColor(obj.linecolor);
      _setTopologyHoverColor(obj.hovercolor);
      TopologyGraph.getGraph().refresh();
      suninfo.alert(data.message);
    } else {
      suninfo.alert(data.message);
    }
    TopologyConfigDialog.close();
  });
  */
}

/**
 * 保存拓扑布局配置
 * @param {Object} data
 */
function saveTopologyLayout (ajaxData, json) {
  /*
  suninfo.post('../viewmanager/topoview/saveTopologyConfig', JSON.stringify(ajaxData), {
    contentType: 'application/json',
    global: false
  }).done(function (data) {
    if (data.flag) {
      window.topologyConfig.layout = json;
    }
    suninfo.alert(data.message);
  });
  */
}

/**
 * 获取配色颜色
 * @param {Number} index 颜色 index 0：宕机 1：正常 2：告警
 * @return {String} 某种状态颜色
 */
function getColor (index) {
  return colors[index];
}

/**
 * 获取拓扑图标路径
 */
function getTopologyIcoPath () {
  return _TOPOLOGYICO_PATH;
}

/**
 * 获取节点浮动颜色
 */
function getHoverColor () {
  return hovercolor;
}

/**
 * 根据字符串获得布局对应的值
 * @param {Object} str
 */
function getLayoutConfig (str) {
  var index = _LAYOUT_LIST[str];
  return window.TopologyGraph.getGraphVm().config.layout[index - 1][index];
}

var GraphConfig = {
  loadTopologyConfig: loadTopologyConfig,
  setColorSchemes: setColorSchemes,
  setTopologyBgImg: setTopologyBgImg,
  setTopologyMv: _setTopologyMv,
  getTopologyIcoPath: getTopologyIcoPath,
  getHoverColor: getHoverColor,
  saveTopologyLayout: saveTopologyLayout,
  getLayoutConfig: getLayoutConfig,
  getColor: getColor
};

export default GraphConfig;
