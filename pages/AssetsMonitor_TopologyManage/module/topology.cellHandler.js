import { getTopoviewLineDetail, getTopoviewNodeDetail } from '../api/topology_api'

/**
 * 鼠标单机事件
 * @private
 * @param {mxGraph} graph 拓扑图实例
 */
function _addClickEx(graph) {
  graph.addListener(window.mxEvent.CLICK, function(sender, evt) {
    var cell = evt.getProperty('cell');
    var editMode = (window.TopologyGraph.getMode() === 2);
    if (typeof cell !== 'undefined') {
      if (cell && cell.isVertex() && !cell.isGroupCell() && !cell.isTextCell() && !cell.isSubTopoCell() && !cell.isHub() && cell.style !== 'flowrate') {
        /* let dataObj = {
          uuid: cell.underCell.id
        }; */// 需要vertex的typeuuid
        window.TopologyGraph.getGraphVm().activeTabName = 'second';
        window.TopologyGraph.getGraphVm().secondTabContent = 'detail';
        if (!cell.isAppCell()) {
          getTopoviewNodeDetail(cell.uuid).then(function(data) {
            let deviceDetail = {};
            let totalData = window.TopologyGraph.getGraphVm().deviceData;
            for (let i = 0, l = totalData.length; i < l; i++) {
              if (totalData[i].uuid === cell.underCell.id) {
                deviceDetail = totalData[i];
                break;
              }
            }
            deviceDetail.pingStatus = data.status;
            deviceDetail.memoryUse = data.memRate;
            deviceDetail.cpuUse = data.cpuRate;
            deviceDetail.runTimeStr = data.runTime;
            window.TopologyGraph.getGraphVm().deviceDetailItem = deviceDetail;
          });
        } else {
          getTopoviewNodeDetail(cell.uuid).then(function(data) {
            let deviceDetail = {
              'controlAdderss': data.ip,
              'pingStatus': data.status,
              'itcompName': data.hostName,
              'runTimeStr': data.runTime,
              'citypeName': data.catalogy,
              'manufactKeyName': data.manufacturer
            }
            window.TopologyGraph.getGraphVm().deviceDetailItem = deviceDetail;
          });
        }
      } else if (cell && cell.isVertex() && cell.isTextCell() && editMode) {
        window.TopologyGraph.getGraphVm().activeTabName = 'fourth';
        window.TopologyGraph.getGraphVm().fourthTabTitle = '文本样式';
        window.TopologyGraph.getGraphVm().fourthTabContent = 'textDetail';
        window.TopologyGraph.getGraphVm().textCell = cell;
      } else if (cell && cell.isVertex() && cell.isTextCell() && !editMode) {
        return;
      } else if (cell && cell.isVertex() && cell.isGroupCell() && editMode) {
        window.TopologyGraph.getGraphVm().activeTabName = 'fourth';
        window.TopologyGraph.getGraphVm().fourthTabTitle = '区域样式';
        window.TopologyGraph.getGraphVm().fourthTabContent = 'groupDetail';
        window.TopologyGraph.getGraphVm().groupCell = cell;
      } else if (cell && cell.isVertex() && cell.isGroupCell() && !editMode) {
        return;
      } else if (cell && cell.isEdge()) {
        let dataObj = {
          uuid: cell.id
        };
        if (cell.source.upperCell.isSubTopoCell() || cell.source.upperCell.isHub()) {
          dataObj.sourceHostName = cell.source.upperCell.busnessName;
        }
        if (cell.target.upperCell.isSubTopoCell() || cell.target.upperCell.isHub()) {
          dataObj.targetHostName = cell.target.upperCell.busnessName;
        }
        getTopoviewLineDetail(dataObj.uuid).then(function(response) {
          response.sourceData = JSON.parse(response.sourceData) || {};
          response.targetData = JSON.parse(response.targetData) || {};
          response.sourceHostName = dataObj.sourceHostName || response.sourceHostName;
          response.targetHostName = dataObj.targetHostName || response.targetHostName;
          window.TopologyGraph.getGraphVm().linkDetailItem = response;
          window.TopologyGraph.getGraphVm().activeTabName = 'third';
          window.TopologyGraph.getGraphVm().thirdTabContent = 'detail';
        });
      } else if (editMode) {
        window.TopologyGraph.getGraphVm().activeTabName = 'fourth';
        window.TopologyGraph.getGraphVm().fourthTabTitle = '拖拽面板';
        window.TopologyGraph.getGraphVm().fourthTabContent = 'dragPanel';
      }
    } else if (editMode) {
      window.TopologyGraph.getGraphVm().activeTabName = 'fourth';
      window.TopologyGraph.getGraphVm().fourthTabTitle = '拖拽面板';
      window.TopologyGraph.getGraphVm().fourthTabContent = 'dragPanel';
    }
  });
}

function init(graph) {
  _addClickEx(graph);
}

export default {
  init: init
};
