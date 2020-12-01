/**
 * Created by dingyf on 2017/6/22.
 */
import {
  getObj,
  findPosX,
  findPosY,
  clearTextSelection,
  getEditIndex,
  getEditTemplateParam,
  getDialogTitle
} from './util'
import {cloneDeep} from 'lodash'

let $ = window.$;

if (document.all) {
  var browserIe = true;
} else if (document.layers) {
  var browserNn4 = true;
} else if (document.layers || (!document.all && document.getElementById)) {
  var browserNn6 = true;
}

// addtionScrollbar是s-scrollbar，它的滚动不计入window.scroll里，所以需要传过来
var GridCustomize = function (layoutAreaId, saveFunc, addtionScrollbar) {
  this.layoutArea = getObj(layoutAreaId).rows[0];
  this.addtionScrollbar = addtionScrollbar;

  this.oMoveLayer = document.createElement('div');
  this.oMoveLayer.style.cursor = 'move';
  this.oMoveLayer.style.zIndex = '9999';

  this.oHiliteLayer = document.createElement('div');
  this.oHiliteLayer.style.border = '1px dashed #ff0000';
  this.oHiliteLayer.style.zIndex = '9990';

  this.oMoveLayer.style.position = this.oHiliteLayer.style.position = 'absolute';
  this.oMoveLayer.style.left = this.oHiliteLayer.style.left = '-1000px';
  this.oMoveLayer.style.top = this.oHiliteLayer.style.top = '-1000px';
  document.documentElement.appendChild(this.oMoveLayer);
  document.documentElement.appendChild(this.oHiliteLayer);

  this.oColumns = [];
  this.vm = null;
  this.oColumns = this.findChild(this.layoutArea, 'TD'); // No I18N
  for (var i = 0; i < this.oColumns.length; i++) {
    this.oColumns[i].width = (100 / this.oColumns.length) + '%';
    this.oColumns[i].className += ' gridColumn'; // No I18N
    var oDIV = this.findChild(this.oColumns[i], 'DIV'); // No I18N
    for (var j = 0; j < oDIV.length; j++) {
      oDIV[j].className += ' gridItem'; // No I18N
    }
  }
}

GridCustomize.prototype.regEventByAttrib = function (elType, customAttrib) {
  var oTD = this.layoutArea.getElementsByTagName(elType);
  for (var orderStr = 0; orderStr < oTD.length; orderStr++) {
    if (oTD[orderStr].getAttribute(customAttrib) != null || oTD[orderStr].getAttribute(customAttrib) !== '') {
      this.registerEventForEl(oTD[orderStr]);
    }
  }
};

GridCustomize.prototype.regEventByClass = function (elType, className) {
  var oTD = this.layoutArea.getElementsByTagName(elType);
  for (var orderStr = 0; orderStr < oTD.length; orderStr++) {
    if (oTD[orderStr].className != null && (oTD[orderStr].className.indexOf(className) > -1)) {
      this.registerEventForEl(oTD[orderStr]);
    }
  }
};

GridCustomize.prototype.registerEventForEl = function (elToReg) {
  elToReg['dragLis'] = this; // No I18N
  elToReg.onmousedown = function (ev) {
    this['dragLis'].captureLayer(ev); // No I18N
  };
  elToReg.style.cursor = 'move';
};

GridCustomize.prototype.captureLayer = function (ev) {
  var srcElement = null;
  if (browserIe) {
    srcElement = window.event.srcElement;
  } else if (browserNn4 || browserNn6) srcElement = ev.target;
  if (typeof srcElement !== 'undefined' && srcElement != null) {
    var prevEl = srcElement; // .parentNode;
    var pathEl = [];
    var cnt = 0;
    while (prevEl) {
      if (prevEl === this.layoutArea) {
        this.oCurrLayer = pathEl[cnt - 2];
        break;
      }
      pathEl[cnt] = prevEl;
      prevEl = prevEl.parentNode;
      cnt++;
    }
    var action = srcElement.getAttribute('alt');
    var attrid = $(srcElement).data('attrid');
    // 编辑操作
    if (action === 'edit') {
      let obj = cloneDeep(this.vm.attrMap);
      delete obj[attrid];
      this.vm.attrVal = obj;
      // editDialog.init(attID);
      var attr = this.vm.attrMap[attrid];
      var index = getEditIndex(attr);
      if (index === '0') { // 系统参数
        this.vm.addSysAttrDialogModel = true;
        this.vm.$nextTick(() => {
          this.vm.$refs.systemAttrDialog.uid = attrid;
          this.vm.$refs.systemAttrDialog.attr = attr;
          this.vm.$refs.systemAttrDialog.attrTag = attr.colnumName;
          this.vm.$refs.systemAttrDialog.sysAttrSelect = attr.sysAttrSelect
          this.vm.$refs.systemAttrDialog.desc = attr.attributeDesc;
          this.vm.editOrAdd = 1; // 表示为编辑
        });
      }
      if (index === '1' || index === '3' || index === '4') { // 文本 数值 日期
        this.vm.addTextAttrDialogTitle = getDialogTitle(index);
        this.vm.addTextAttrDialogModel = true;
        this.vm.$nextTick(() => {
          this.vm.$refs.textAttrDialog.uid = attrid;
          this.vm.$refs.textAttrDialog.attr = attr;
          this.vm.$refs.textAttrDialog.attrForm.dataType = index;
          this.vm.$refs.textAttrDialog.attrForm.attrTag = attr.colnumName;
          this.vm.$refs.textAttrDialog.attrForm.desc = attr.attributeDesc;
          this.vm.$refs.textAttrDialog.attrForm.defaultValue = attr.defaultValue;
          this.vm.$refs.textAttrDialog.attrForm.defaultValueNum = attr.defaultValue;
          this.vm.$refs.textAttrDialog.attrForm.defaultValueDate = attr.defaultValue;
          this.vm.$refs.textAttrDialog.attrForm.isRequired = attr.isRequired;
          this.vm.editOrAdd = 1; // 表示为编辑
        });
      }
      if (index === '2') { // 列表
        this.vm.addSelectAttrDialogModel = true;
        this.vm.$nextTick(() => {
          this.vm.$refs.selectAttrDialog.uid = attrid;
          this.vm.$refs.selectAttrDialog.attr = attr;
          this.vm.$refs.selectAttrDialog.attrForm.dataType = index;
          this.vm.$refs.selectAttrDialog.attrForm.attrTag = attr.colnumName;
          this.vm.$refs.selectAttrDialog.attrForm.desc = attr.attributeDesc;
          this.vm.$refs.selectAttrDialog.attrForm.options = getEditTemplateParam(attr);
          this.vm.$refs.selectAttrDialog.attrForm.defaultValue = [attr.defaultValue];
          this.vm.$refs.selectAttrDialog.attrForm.isRequired = attr.isRequired;
          this.vm.editOrAdd = 1; // 表示为编辑
        });
      }
      return;
    } else if (action === 'close') { // 删除操作
      $('#Attribute_' + attrid).remove();
      this.vm.$delete(this.vm.attrMap, attrid);
      return;
    }
    this.oMoveLayer.className = 'field-outer-container-drag';
    this.oMoveLayer.style.width = this.oCurrLayer.offsetWidth + 'px';
    this.oMoveLayer.style.height = this.oCurrLayer.offsetHeight + 'px';
    this.oMoveLayer.style.height = 'auto';
    // 为适应弹框的位置计算，新加的代码
    let offsetPos = getOffsetPos(ev)
    this.moveLayerOffsetX = offsetPos.x
    this.moveLayerOffsetY = offsetPos.y
    this.oMoveLayer.style.left = ev.clientX - offsetPos.x - 1 + 'px';
    this.oMoveLayer.style.top = ev.clientY - offsetPos.y - 2 + 'px';
    // this.oMoveLayer.style.left = findPosX(this.oCurrLayer) + 'px';
    // this.oMoveLayer.style.top = findPosY(this.oCurrLayer) - this.addtionScrollbar.scrollTop + 'px';
    this.oMoveLayer.innerHTML = this.oCurrLayer.innerHTML;
    this.showHiliteLayer(this.oCurrLayer);
    this.oCurrLayer.className = 'field-outer-container';
    this.oCurrLayer.style.visibility = 'hidden';
    if (browserIe) {
      this.diffLeft = window.event.clientX + $(window).scrollLeft() - parseInt(this.oMoveLayer.style.left);
      this.diffTop = window.event.clientY - parseInt(this.oMoveLayer.style.top);
    } else if (browserNn4 || browserNn6) {
      this.diffLeft = ev.pageX - parseInt(this.oMoveLayer.style.left);
      this.diffTop = ev.pageY - parseInt(this.oMoveLayer.style.top);
    }
    // var currLayout = this.layoutAreaId;
    document['dragLis'] = this; // No I18N
    document.onmousemove = function (ev) {
      document['dragLis'].moveLayer(ev); // No I18N
    };
    document.onmouseup = function (ev) {
      document['dragLis'].releaseLayer(ev); // No I18N
    };
  }
};

function getOffsetPos(e) {
  let x = e.offsetX
  let y = e.offsetY
  let cTarget = e.target
  while (cTarget.parentNode && cTarget.className.indexOf('field-outer-container') === -1) {
    cTarget = cTarget.parentNode
  }
  if (cTarget.className.indexOf('field-outer-container') !== -1 && e.target.tagName.toUpperCase() !== 'LABEL') {
    x -= (findPosX(cTarget) - findPosX(e.target))
    y -= (findPosY(cTarget) - findPosY(e.target))
  }
  return {x, y}
}

GridCustomize.prototype.moveLayer = function (ev) {
  window.dragging = true;
  clearTextSelection();
  let currLeft = 0;
  let currTop = 0;
  if (browserIe) {
    currLeft = (window.event.clientX - this.diffLeft) + $(window).scrollLeft();
    currTop = (window.event.clientY - this.diffTop);
  } else if (browserNn4 || browserNn6) {
    currLeft = (ev.pageX - this.diffLeft);
    currTop = (ev.pageY - this.diffTop);
  }
  // ^为适应弹框的位置计算，新加的代码
  let DialogEl = document.querySelector('.special-status-dialog .s-dialog')
  let dialogHalfOffsetWidth = DialogEl.offsetWidth / 2 - 150 // 150幻数，不知道哪里计算错误了
  currLeft = ev.clientX
  currTop = ev.clientY
  // $为适应弹框的位置计算
  this.oMoveLayer.style.left = currLeft - this.moveLayerOffsetX - 1 + 'px';
  this.oMoveLayer.style.top = currTop - this.moveLayerOffsetY - 2 + 'px';
  var layerMidX = currLeft + (parseInt(this.oMoveLayer.style.width) / 2);
  // var layerMidY = currTop + (parseInt(this.oMoveLayer.style.height) / 2);
  for (var i = 0; i < this.oColumns.length; i++) {
    if (layerMidX >= (findPosX(this.oColumns[i]) - dialogHalfOffsetWidth) && layerMidX <= ((findPosX(this.oColumns[i]) + this.oColumns[i].offsetWidth) - dialogHalfOffsetWidth)) {
      var oHoverColumn = this.oColumns[i];
      break;
    }
  }
  if (oHoverColumn != null && typeof oHoverColumn !== 'undefined') {
    var oLayers = this.findChild(oHoverColumn, 'DIV'); // No I18N
    for (var j = 0; j < oLayers.length; j++) {
      if (currTop <= findPosY(oLayers[j])) {
        var oHoverLayer = oLayers[j];
        break;
      }
    }

    var oNewLayer = this.oCurrLayer;
    if (oHoverLayer) oHoverLayer.parentNode.insertBefore(this.oCurrLayer, oHoverLayer);
    else oHoverColumn.appendChild(this.oCurrLayer);

    this.oCurrLayer = oNewLayer;
    this.showHiliteLayer(oNewLayer);
  }
};

GridCustomize.prototype.releaseLayer = function () {
  document.onmousemove = null;
  document.onmouseup = null;

  this.transXPoints = [];
  this.transYPoints = [];
  // 为适应弹框，计算新的动画路径
  let DialogEl = document.querySelector('.special-status-dialog .s-dialog')
  let cacheLeft = findPosX(this.oCurrLayer) - DialogEl.offsetWidth / 2;
  this.drawPath(parseInt(this.oMoveLayer.style.left), parseInt(this.oMoveLayer.style.top), cacheLeft, findPosY(this.oCurrLayer));

  // this.drawPath(parseInt(this.oMoveLayer.style.left), parseInt(this.oMoveLayer.style.top), findPosX(this.oCurrLayer), findPosY(this.oCurrLayer) - this.addtionScrollbar.scrollTop);
  this.transPitStops = (this.transXPoints.length > 10) ? (this.transXPoints.length - 1) / 10 : 1;
  this.transPosCnt = 0;

  var positionLayer = 'document["dragLis"].positionLayer();' // No I18N
  this.transIntervalId = window.setInterval(positionLayer, 15);
  window.dragging = false;
}

GridCustomize.prototype.positionLayer = function () {
  if (this.transPosCnt < this.transXPoints.length - 1) {
    this.oMoveLayer.style.left = this.transXPoints[this.transPosCnt] + 'px';
    this.oMoveLayer.style.top = this.transYPoints[this.transPosCnt] + 'px';
    this.transPosCnt = this.transPosCnt + Math.round(this.transPitStops);
  } else {
    this.transPosCnt = 0;
    this.transXPoints = this.transYPoints = null;
    window.clearInterval(this.transIntervalId);

    this.oMoveLayer.style.left = this.oMoveLayer.style.top = '-1000px';
    this.oHiliteLayer.style.left = this.oHiliteLayer.style.top = '-1000px';
    this.oCurrLayer.style.visibility = '';
    this.oMoveLayer.innerHTML = '';
    this.resetPosition();
    // callsaveIndex('updateIndex'); //No I18N
    // parent[this["saveFunc"]](this);
  }
};

// 处理拖拽已有列表项到第一位引起的再从左侧拖入无法到第一位的bug
GridCustomize.prototype.resetPosition = function () {
  var oneDiv = $('#dummy1');
  var $divs = $('#formcontainer div');
  var index = $divs.index(oneDiv);
  if (index !== 0) {
    let htmlStr = oneDiv.clone();
    $('#dummy1').remove();
    $(htmlStr).insertBefore($divs.get(0));
  }
  var oneDiv1 = $('#dummy2');
  var $divs1 = $('#formcontainer1 div');
  var index1 = $divs1.index(oneDiv1);
  if (index1 !== 0) {
    let htmlStr = oneDiv1.clone();
    $('#dummy2').remove();
    $(htmlStr).insertBefore($divs1.get(0));
  }
};

GridCustomize.prototype.showHiliteLayer = function (oLayer) {
  this.oHiliteLayer.style.width = oLayer.offsetWidth + 'px';
  this.oHiliteLayer.style.height = oLayer.offsetHeight + 'px';
  // 下面2行,为适应弹框的位置计算，新加的代码
  let DialogEl = document.querySelector('.special-status-dialog .s-dialog')
  // this.oHiliteLayer.style.left = (findPosX(oLayer) - (DialogEl.offsetLeft - DialogEl.offsetWidth / 2) - oLayer.offsetWidth / 2 - 7) + 'px';
  this.oHiliteLayer.style.left = findPosX(oLayer) - DialogEl.offsetWidth / 2 + 'px';
  this.oHiliteLayer.style.top = findPosY(oLayer) + 'px';
};

GridCustomize.prototype.drawPath = function (x1, y1, x2, y2) {
  var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  var dx = (x2 - x1) / dist;
  var dy = (y2 - y1) / dist;

  for (var i = 0; i < dist; i++) {
    this.transXPoints[i] = x1 += dx;
    this.transYPoints[i] = y1 += dy;
  }
};

GridCustomize.prototype.findChild = function (oParent, tagName) {
  if (oParent != null && typeof oParent.childNodes !== 'undefined') {
    var oChild = [];
    for (var i = 0, orderStr = 0; i < oParent.childNodes.length; i++) {
      if (browserIe) {
        if (oParent.childNodes[i].tagName === tagName) {
          oChild[orderStr] = oParent.childNodes[i];
          orderStr++;
        }
      } else if (browserNn4 || browserNn6) {
        if (oParent.childNodes.item(i).tagName === tagName) {
          oChild[orderStr] = oParent.childNodes[i];
          orderStr++;
        }
      }
    }
    return oChild;
  }
};

// 获取当前顺序作为一个字符串返回
GridCustomize.prototype.getCurrentOrderAsString = function () {
  var result = '';
  for (var i = 0; i < this.oColumns.length; i++) {
    var oDIV = this.findChild(this.oColumns[i], 'DIV'); // No I18N
    result += '|'; // No I18N
    for (var j = 0; j < oDIV.length; j++) {
      result += oDIV[j].id;
      if (j !== oDIV.length - 1) result += '_'
    }
  }
  return result;
}

// 获取当前顺序作为一个矩阵返回
GridCustomize.prototype.getCurrentOrderAsMatrix = function (attrib) {
  var result = [];
  for (var i = 0; i < this.oColumns.length; i++) {
    result[i] = [];
    var oDIV = this.findChild(this.oColumns[i], 'DIV'); // No I18N
    for (var j = 0; j < oDIV.length; j++) {
      result[i][j] = oDIV[j].getAttribute(attrib);
    }
  }
  return result;
}

GridCustomize.prototype.setVM = function (vm) {
  this.vm = vm;
}

export default GridCustomize;
