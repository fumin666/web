/**
 * Created by dingyf on 2017/6/19.
 */
import { saveOrUpdateTopoview, addCells, getDeviceInterface, deleteLineList } from '../api/topology_api'

/**
 * 调用保存/更新拓扑的接口
 * @param  param:给接口传递的参数，发生改变的数据
 * @param  callback:回调方法
 * @param  failCallback:操作失败回调函数
 * */
function ajaxSaveOrUpdateTopo(param, callback, failCallback) {
  var ajaxSave = saveOrUpdateTopoview(param).then(function(data) {
    if (!data) {
      window.TopologyGraph.getGraphVm().$message({
        message: '保存拓扑操作失败',
        type: 'error'
      });
    }
    if (callback) {
      callback(data);
    }
  });
  if (typeof failCallback !== 'undefined') {
    ajaxSave.catch(function() {
      failCallback();
    });
  }
}

/**
 * 调用增加节点的接口
 * @param param:向接口传递的参数
 * @param category
 *              单个节点为不需要此参数，单个节点包含：资产节点、虚节点、子拓扑
 *              批量节点为nodes
 *              区域和文字为other
 * @param callback:调用接口后的回调方法
 * */
function ajaxAddNode(param, category, callback) {
  var urlTail = 'addNode';
  if (category === 'nodes') {
    urlTail = 'addNodeList';
  } else if (category === 'other') {
    urlTail = 'addDomain';
  }
  addCells(urlTail, param).then(function(data) {
    if (!data) {
      window.TopologyGraph.getGraphVm().$message.error('操作失败');
    }
    if (callback) {
      callback(data);
    }
  });
}

/**
 * 获取资产uuid对应的端口
 * @param uuid:向接口传递的uuid
 * @param callback:调用接口后的回调方法
 * */
function ajaxGetDevicePort(uuid, callback) {
  getDeviceInterface(uuid).then(function(data) {
    if (callback) {
      callback(data);
    }
  });
}

/**
 * 批量删除连线的ajax方法
 * @param uuidArr  要删除的线路uuid数组
 * @param type   1:保存到所有拓扑，2:只保存到当前拓扑
 * @param callback  调用接口后的回调方法
 * */
function ajaxDelLineList(uuidArr, type, callback) {
  deleteLineList(type, uuidArr).then(function(data) {
    if (data) {
      window.TopologyGraph.getGraphVm().$message({
        message: '删除线路成功',
        type: 'success'
      });
    } else {
      window.TopologyGraph.getGraphVm().$message.error('删除线路失败');
    }
    if (callback) {
      callback(data);
    }
  });
}

export default {
  ajaxSaveOrUpdateTopo: ajaxSaveOrUpdateTopo,
  ajaxAddNode: ajaxAddNode,
  ajaxGetDevicePort: ajaxGetDevicePort,
  ajaxDelLineList: ajaxDelLineList
};
