/**
 * Created by dgunzi on 2019/04/04.
 * 系统全局设置变量
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (factory((global.SunflowerConfig = global.SunflowerConfig || {})));
}(this, (function (exports) { 'use strict';
  // 系统名称
  exports.systemName = 'InforCube智能运维安全管理平台';
  // 系统关键字
  exports.systemKeyword = 'SiCAP';
  // 中文版权信息
  exports.copyrightCn = '上海上讯信息技术股份有限公司';
  // 英文版权信息
  exports.copyrightEn = 'Shanghai Suninfo Information Technology Co., Ltd. All rights reserved';
  // 热线电话
  exports.hotline = '400-682-1599';
  // 支持邮箱
  exports.supporting = 'Support@suninfo.com';

  var componentsPath = '';

  exports.setComponentsPath = function (path) {
    componentsPath = path;
  };

  exports.getComponentsPath = function () {
    return componentsPath;
  };

  Object.defineProperty(exports, '__esModule', { value: true });

})));
