/**
 * Created by dingyf on 2017/6/22.
 */
import { each } from 'lodash'

var alphaVal = 0;
var fadeInIntvl = null;

export function docid(id) {
  return document.getElementById(id);
}

// 根据flag显示或隐藏某个ele元素
export function showLayer(ele, flag) {
  if (flag === true) {
    ele.style.visibility = 'visible';
    ele.style.height = 40 + 'px';
  } else {
    ele.style.visibility = 'hidden';
    ele.style.height = 0 + 'px';
  }
}

export function fadeIn(id, time, callback) {
  alphaVal = 0;
  var ele = docid(id);
  ele.style.opacity = alphaVal;
  ele.style.filter = 'alpha(opacity=' + alphaVal + ')';
  ele.style.display = '';
  var functRef = doFadeIn(id, callback);
  fadeInIntvl = window.setInterval(functRef, time);
}

function doFadeIn(id, callback) {
  return function() {
    var ele = docid(id);
    if (!ele) {
      window.clearInterval(fadeInIntvl);
      if (typeof callback !== 'undefined') {
        callback();
      }
      return;
    }
    if (alphaVal < 10) {
      ele.style.filter = 'alpha(opacity=' + (alphaVal * 4) + ')';
      ele.style.opacity = alphaVal / 6;
      alphaVal++;
    } else {
      ele.style.filter = 'alpha(opacity=100)';
      ele.style.opacity = 0.99;
      window.clearInterval(fadeInIntvl);
      if (typeof callback !== 'undefined') {
        callback();
      }
    }
  };
}

/**
 * 根据传入的对象返回其在（窗口window或屏幕screen）中x轴的坐标
 */
export function findPosX(obj) {
  var curleft = 0;
  if (document.getElementById || document.all) {
    while (obj.offsetParent) {
      curleft += obj.offsetLeft;
      obj = obj.offsetParent;
    }
  } else if (document.layers) {
    curleft += obj.x;
  }
  return curleft;
}

/**
 * 根据传入的对象返回其在（窗口window或屏幕screen）中y轴的坐标
 */
export function findPosY(obj) {
  var curtop = 0;
  if (document.getElementById || document.all) {
    while (obj.offsetParent) {
      curtop += obj.offsetTop;
      obj = obj.offsetParent;
    }
  } else if (document.layers) {
    curtop += obj.y;
  }
  return curtop;
}

// 去除默认选中文字
export function disableDefaultAction(a) {
  if (document.all) {
    document.onselectstart = function() {
      return false;
    };
  } else {
    a.preventDefault();
  }
}

/**
 * 根据传入的元素id和doc对象返回对象
 */
export function getObj(id, doc) {
  var index, i, obj;
  if (!doc) {
    doc = document;
  }
  if ((index = id.indexOf('?')) > 0 && parent.frames.length) {
    doc = parent.frames[id.substring(index + 1)].document;
    id = id.substring(0, index);
  }

  if (!(obj = doc[id]) && doc.all) {
    obj = doc.all[id];
  }

  for (i = 0; !obj && i < doc.forms.length; i++) {
    obj = doc.forms[i][id];
  }

  for (i = 0; !obj && doc.layers && i < doc.layers.length; i++) {
    obj = getObj(id, doc.layers[i].document);
  }

  if (!obj && doc.getElementById) {
    obj = doc.getElementById(id);
  }
  return obj;
}

/**
 * 清除文字选中
 */
export function clearTextSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.getSelection) {
    var s = document.getSelection();
    if (s.collapse) s.collapse(true);
    if (s.removeAllRanges) s.removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

// 获取当前顺序
export function getCurrentOrder(orderStr) {
  orderStr = orderStr.split('|');
  var index = 1;
  var returnStr = '';
  var count = 1;
  for (var i = 1; i < orderStr.length; i++) {
    var item = orderStr[i];
    item = item.split('_');
    for (var j = 0; j < item.length; j++) {
      var c = item[j];
      if ((c == null) || (c === '_') || (c === '') || isNaN(c)) {
        continue;
      }
      returnStr = returnStr + c + ':' + (count) + ':' + (index++) + ','
    }
    count++;
  }
  return returnStr;
}

// 根据传入属性判断采用哪个类型
export function getEditIndex(attr) {
  var htmltype = attr.htmlType;
  if (htmltype === 'udf_char_single_line') {
    return '1';
  } else if (htmltype === 'udf_char_list') {
    return '2';
  } else if (htmltype === 'udf_long') {
    return '3';
  } else if (htmltype === 'udf_date') {
    return '4';
  }
}

// 根据已经有的数据返回需要的参数
export function getEditTemplateParam(attr) {
  var option = [];
  if (attr.listvalues.length > 0) {
    each(attr.listvalues, function(listoption) {
      option.push({label: listoption.listvalues, value: listoption.listvalues});
    });
  }
  return option;
}
let textTitles = {
  '1': '添加属性-文本',
  '3': '添加属性-数值',
  '4': '添加属性-日期'
};
export function getDialogTitle(index) {
  return textTitles[index];
}
