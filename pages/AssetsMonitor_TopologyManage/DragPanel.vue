<template>
  <div class="content" id="panelTabContent">
    <div id="dragDiv" class="dragElement"></div>
    <div class="leftBox">
      <s-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="card-title">
            <i class="iconfont icon-event"></i>
            非资产元素
          </span>
        </div>
        <div class="item" id="item00">
          <div class="icon"><img id="subtopology_ico" src="/static/images/topologyicon/default/subtopology.svg" alt=""></div>
          <div class="title">子拓扑</div>
        </div>
        <div class="item" id="item01">
          <div class="icon"><img id="Hub_ico" src="/static/images/topologyicon/default/Hub.svg" alt=""></div>
          <div class="title">虚节点</div>
        </div>
        <div class="item" id="item02">
          <div class="icon"><img id="group_ico" src="/static/images/topologyicon/default/group.svg" alt=""></div>
          <div class="title">区域</div>
        </div>
        <div class="item" id="item03">
          <div class="icon"><img id="text_ico" src="/static/images/topologyicon/default/text.svg" alt=""></div>
          <div class="title">文字</div>
        </div>
      </s-card>
    </div>
    <div class="rightBox" id="dragDivContent">
      <s-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="card-title">
            <i class="iconfont icon-event"></i>
            未在拓扑中资产
          </span>
          <form class="s-form demo-form-inline s-form-label-left s-form-inline" style="float:right;margin-top: -5px;height: 30px">
            <div class="s-form-item-content" style="margin-right:5px;">
              <s-checkbox v-model="switchDrag">批量拖拽</s-checkbox>
            </div>
            <div class="s-form-item-content" style="margin-right:5px;">
              <s-radio-group v-model="showTextType" size="mini" style="margin-bottom: 5px">
                <s-radio-button :label="0">IP地址</s-radio-button>
                <s-radio-button :label="1">资产名称</s-radio-button>
              </s-radio-group>
            </div>
            <div class="s-form-item-content" style="margin-bottom: 15px">
              <s-input
                placeholder="请输入资产名称、IP地址"
                icon="magnifier"
                v-model.trim="keyword" style="width: 250px;"/>
            </div>
          </form>
        </div>
        <div id="dragDivContentBatch" title="拖拽" v-if="filterData.length > 0 && switchDrag">
          <div class="item itemClick itemSelect" v-for="device in filterData" title="点击取消选中" :key="device.uuid" :id="'item' + device.uuid" :data-id="device.uuid">
            <div class="icon itemClick"><img class="itemClick" :src="filterIcon(device.ciTypeKeyName)" alt=""></div>
            <div class="title itemClick" v-if="showTextType == 0" :title="device.controlAdderss + '-' + device.itcompName">{{ device.controlAdderss }}</div>
            <div class="title itemClick" v-if="showTextType == 1" :title="device.controlAdderss + '-' + device.itcompName">{{ device.itcompName }}</div>
          </div>
        </div>
        <div id="dragDivContentList" v-if="filterData.length > 0 && !switchDrag">
          <div class="item itemClick" v-for="device in filterData" :id="'item' + device.uuid" :data-id="device.uuid">
            <div class="icon itemClick"><img class="itemClick" :src="filterIcon(device.ciTypeKeyName)" alt=""></div>
            <div class="title itemClick" v-if="showTextType == 0" :title="device.controlAdderss + '-' + device.itcompName">{{ device.controlAdderss }}</div>
            <div class="title itemClick" v-if="showTextType == 1" :title="device.controlAdderss + '-' + device.itcompName">{{ device.itcompName }}</div>
          </div>
        </div>
        <div v-nodata="filterData.length <= 0"></div>
      </s-card>
    </div>
  </div>
</template>
<script>
  import GraphConfig from './module/topology.graphConfig'
  import { getMonitorItcompList } from './api/topology_api'
  import TopologyAjax from './module/topology.ajax'
  import TopoIcon from './module/topology.icon'
  let $ = window.$;
  let dsTitle = ['子拓扑', '虚节点', null, '文字'];
  let basePath = GraphConfig.getTopologyIcoPath() + 'default/';
  let hubType = 'hub';
  let dragsourceData = ['subtopology', 'Hub', 'group', 'text'];
  let newItemPositions = [];
  export default {
    data () {
      return {
        switchDrag: false,
        deviceData: [],
        keyword: '',
        showTextType: 0
      }
    },
    props: {
      graph: {
        type: Object,
        required: true
      }
    },
    watch: {
      graph: function (val, oldVal) {
        this.init();
      },
      switchDrag: function (val, oldVal) {
        if (val) { // 批量拖拽
          this.$nextTick(() => {
            this.addItemClickAction();
            this.addDeviceDraggable();
          });
        } else {  // 单一拖拽
          this.$nextTick(() => {
            this.removeItemClickAciton();
            this.addItemDraggable();
          });
        }
      }
    },
    computed: {
      filterData() {
        if (this.keyword !== '') {
          let data = [];
          for (var i = 0, l = this.deviceData.length; i < l; i++) {
            if (this.deviceData[i].controlAdderss.startsWith(this.keyword)) {
              data.push(this.deviceData[i]);
            }
            if (this.deviceData[i].itcompName.startsWith(this.keyword)) {
              data.push(this.deviceData[i]);
            }
          }
          return data;
        } else {
          return this.deviceData;
        }
      }
    },
    mounted () {
      this.init();
    },
    methods: {
      removeData (data, callback) {
        var index = -1;
        for (var i = 0, l = this.deviceData.length; i < l; i++) {
          if (this.deviceData[i].uuid === data.uuid) {
            index = i;
            break;
          }
        }
        if (index !== -1) {
          this.deviceData.splice(index, 1);
          if (callback) {
            callback();
          }
        }
      },
      init (flag) {
        if (typeof flag === 'undefined') {
          // 非资产
          for (let i = 0, length = dragsourceData.length; i < length; i++) {
            this.createDragSource(dragsourceData[i], i);
          }
        }
        getMonitorItcompList({
          subTopoId: window.paramSubTopo,
          showapp: window.TopologyGraph.getGraphVm().config.showapp
        }, '2').then((data) => {
          this.deviceData = data;
          if (!this.switchDrag) {
            this.$nextTick(() => {
              this.addItemDraggable();
            });
          }
        });
      },
      addItemClickAction () {
        $('#dragDivContent').undelegate().delegate('.item', 'click', function(event) {
          event.stopPropagation();
          var $this = $(event.target);
          if (!$this.hasClass('item')) {
            $this = $this.parents('.item');
          }
          if ($this.hasClass('itemSelect')) {
            $this.removeClass('itemSelect');
            $this.prop('title', '点击选中');
          } else {
            $this.addClass('itemSelect');
            $this.prop('title', '点击取消选中');
          }
        });
      },
      removeItemClickAciton () {
        $('#dragDivContent').undelegate();
      },
      addDeviceDraggable () { // 批量拖拽
        var _self = this;
        var graph = window.TopologyGraph.getGraph();
        var content = document.getElementById('dragDivContentBatch');
        function deviceDropHandler(graph, evt, target, x, y) {
          if (!_self.switchDrag) return; // 为了防止多次取消选中批量操作后拖拽调用批量保存接口
          var paramArr = [];
          var parent = -1;
          var data = null;
          var dataArr = [];
          if (target != null && target.isGroupCell()) {
            parent = target.uuid;
          }
          for (let i = 0, l = newItemPositions.length; i < l; i++) {
            data = _self.getDataByUUId(newItemPositions[i].uuid);
            dataArr.push(data);
            newItemPositions[i].geo = {
              width: 64,
              height: 64,
              x: x + newItemPositions[i].left + 30,
              y: y + newItemPositions[i].top + 30
            };
            var param = {
              type: '1',
              typeUuid: newItemPositions[i].uuid,
              parent: parent, // 不在区域时为-1,在区域时为区域的id
              style: 'image;image=' + _self.filterIcon(data.ciTypeKeyName),
              geo: JSON.stringify(newItemPositions[i].geo),
              topoviewInfoUuid: window.paramSubTopo
            };
            paramArr.push(param);
            if (_self.ipIsRepeat(data, graph)) {
              _self.$message({message: '图中已有相同ip资产，不能重复拖拽', type: 'warning'});
              return;
            }
          }
          if (dataArr.length > 0) {
            _self.addBeachAjax(paramArr, dataArr);
            newItemPositions = [];
          }
        }
        var dragSource = window.mxUtils.makeDraggable(content, graph, deviceDropHandler, this.getSelectDeviceItem());
        dragSource.startDrag = function (evt) {
          var source = window.mxEvent.getSource(evt);
          var flag = $(source).hasClass('itemClick');
          if (!flag) {
            this.dragElement = this.createDragElement(evt);
            this.dragElement.style.position = 'absolute';
            this.dragElement.style.zIndex = this.dragElementZIndex;
            var scale = graph.view.scale;
            var size = _self.getDivSize();
            var w = parseInt(size.width);
            var h = parseInt(size.height);
            var items = newItemPositions;
            this.dragElement.style.width = Math.round(w * scale) + 'px';
            this.dragElement.style.height = Math.round(h * scale) + 'px';
            for (let i = 0, l = items.length; i < l; i++) {
              let div = document.createElement('div');
              div.className = 'item';
              div.style.top = items[i].top * scale + 'px';
              div.style.left = items[i].left * scale + 'px';
              div.style.width = Math.round(120 * scale) + 'px';
              div.style.height = Math.round(95 * scale) + 'px';
              $(this.dragElement).append(div);
            }
            window.mxUtils.setOpacity(this.dragElement, this.dragElementOpacity);
          }
        };
      },
      getSelectDeviceItem () {
        return document.getElementById('dragDiv');
      },
      addBeachAjax (paramArr, dataArr) {
        TopologyAjax.ajaxAddNode(paramArr, 'nodes', (response) => {
          if (response) {
            for (let j = 0, l = dataArr.length; j < l; j++) { // 调用接口成功后筛减deviceList
              this.removeData(dataArr[j]);
            }
            var scaleParam = {
              'topoviewInfo': this.getTopoInfo()
            };
            TopologyAjax.ajaxSaveOrUpdateTopo(scaleParam, function (result) { // 保存视野信息后再重新加载
              if (result) {
                window.TopologyGraph.loadJsonData(false);
                window.TopologyGraph.getGraphVm().initDeviceTabData();
              }
            });
          }
        });
      },
      getTopoInfo () {
        var graph = window.TopologyGraph.getGraph();
        var translate = graph.view.getTranslate();
        var scale = graph.view.getScale();
        var mapviewStr = translate.x + '|' + translate.y + '|' + scale;
        return JSON.stringify({
          uuid: window.paramSubTopo,
          mapview: mapviewStr,
          label: window.TopologyGraph.getLabel()
        });
      },
      getDivSize () {
        var items = $('#panelTabContent .itemSelect');
        var position;
        var minLeft = 9999999;
        var maxLeft = -1;
        var minTop = 9999999;
        var maxTop = -1;
        newItemPositions = [];
        for (let i = 0; i < items.length; i++) {
          position = $(items[i]).position();
          if (position.left < minLeft) minLeft = position.left;
          if (position.left > maxLeft) maxLeft = position.left;
          if (position.top < minTop) minTop = position.top;
          if (position.top > maxTop) maxTop = position.top;
        }
        // 存储所有选择的节点信息
        for (let j = 0, k = items.length; j < k; j++) {
          var $item = $(items[j]);
          position = $item.position();
          newItemPositions.push({left: position.left - minLeft, top: position.top - minTop, uuid: $item.data('id')});
        }
        return {width: maxLeft - minLeft + 120, height: maxTop - minTop + 95}
      },
      addItemDraggable () {
        var _self = this;
        $('#dragDivContentList .item').each(function () {
          var $this = $(this);
          var img = $this.find('img')[0];
          var uuid = $this.attr('data-id');
          _self.createItemDragSource(img, uuid);
        });
      },
      createItemDragSource (ele, uuid) {
        var graph = window.TopologyGraph.getGraph();
        var data = this.getDataByUUId(uuid);
        var cell = new window.mxCell(data.ip, new window.mxGeometry(0, 0, 64, 64), 'image;image=' + this.filterIcon(data.ciTypeKeyName));
        cell.vertex = true;
        var dragImage = ele.cloneNode(true);
        dragImage.style.width = '64px';
        dragImage.style.height = '64px';
        window.mxUtils.makeDraggable(ele, graph, (graph, evt, target, x, y) => {
          let curUuid = $(ele.parentElement.parentElement).attr('data-id');
          let curData = this.getDataByUUId(curUuid);
          if (target === null || (target !== null && target.style.indexOf('group') !== -1)) {
            var cells = graph.importCells([cell], x, y, target);
            if (cells !== null && cells > 0) {
              graph.scrollCellToVisible(cells[0]);
              graph.setSelectionCells(cells);
            }
            if (this.ipIsRepeat(curData, graph)) {
              graph.removeCells(cells);
              this.$message({message: '当前拓扑图中已存在相同ip资产', type: 'warning'});
              return false;
            };
            var param = {
              type: '1',
              typeUuid: curData.uuid,
              parent: window.TopologyGraph.getParent(cells[0]), // 不在区域时为-1,在区域时为区域的id
              style: cells[0].style,
              geo: JSON.stringify(cells[0].parseGeo()),
              topoviewInfoUuid: window.paramSubTopo
            };
            TopologyAjax.ajaxAddNode(param, null, (response) => {
              graph.removeCells(cells);// 删除默认拖拽的节点,使用下面的方法生成
              if (response.uuid === 0 || !response.uuid) {
                this.$message.error('添加资产节点失败!');
              } else {
                if (response.uuid === '1') { // 如果uuid为1，说明此节点已经有连线，需重新加载
                  window.TopologyGraph.loadJsonData();
                } else {
                  this.insertCell(response);
                }
                this.removeData(curData);
              }
            });
          }
        }, dragImage, 0, 0, true, true);
      },
      insertCell(response) {
        var graph = window.TopologyGraph.getGraph();
        graph.getModel().beginUpdate();
        window.TopologyGraph.addVertex(response, false);
        graph.getModel().endUpdate();
      },
      ipIsRepeat (data, graph) {
        var cells = graph.getChildVertices();
        var flag = false;
        $.each(cells, function (index, item) {
          if (item.isIconVertex()) {
            if (item.hostIp === data.controlAdderss) {
              flag = true;
            }
          }
        });
        return flag;
      },
      getDataByUUId (uuid) {
        var deviceAry = this.filterData.filter(item => {
          return item.uuid === uuid;
        });
        return (deviceAry.length > 0) ? deviceAry[0] : null;
      },
      filterIcon (name) {
        if (TopoIcon.getIcon()[name]) {
          return basePath + TopoIcon.getIcon()[name];
        } else {
          return basePath + 'unknown.svg';
        }
      },
      createDragSource (type, index) {
        var value = dsTitle[index];
        var cell = new window.mxCell((value !== null) ? value : '', new window.mxGeometry(0, 0, 64, 64), 'image;image=' + basePath + type + '.svg');
        cell.vertex = true;
        // 虚节点
        if (index === 1) {
          cell.funcType = hubType;
          cell.hostIp = '虚节点';
          cell.canOperate = 1;
        }
        // 区域
        if (index === 2) {
          cell = new window.mxCell((value !== null) ? value : '', new window.mxGeometry(0, 0, 64, 64), 'group;strokeColor=#667480;');
          cell.vertex = true;
          cell.canOperate = 1;
        }
        // 文字
        if (index === 3) {
          cell = new window.mxCell((value !== null) ? value : '', new window.mxGeometry(0, 0, 64, 64), 'stext;fontColor=#667480;');
          cell.vertex = true;
          cell.canOperate = 1;
        }
        var img = document.getElementById(type + '_ico');
        var dragImage = img.cloneNode(true);
        dragImage.style.width = '64px';
        dragImage.style.height = '64px';
        window.mxUtils.makeDraggable(img, this.graph, this.createDropHandler(cell, index), dragImage, 0, 0, true, true);
      },
      createDropHandler(cell, index) {
        var _self = this;
        return function(graph, evt, target, x, y) {
          if (target === null || (target !== null && target.style.indexOf('group') !== -1)) {
            var cells = graph.importCells([cell], x, y, target);
            _self.choseChildToplogy(cells, index);
            if (cells !== null && cells > 0) {
              graph.scrollCellToVisible(cells[0]);
              graph.setSelectionCells(cells);
            }
          }
        };
      },
      choseChildToplogy(cells, index) {
        var geo = cells[0].parseGeo();
        this.tempCells = cells;
        if (index === 0) {
          // 子拓扑对话框
          window.TopologyGraph.getGraphVm().customCells = cells;
          window.TopologyGraph.getGraphVm().childTopologyDialog = true;
        } else if (index === 1) {
          // 虚节点
          window.TopologyGraph.getGraphVm().customNodeDialog = true;
          window.TopologyGraph.getGraphVm().customCells = cells;
          window.TopologyGraph.getGraphVm().customEdit = false;
          window.TopologyGraph.getGraphVm().editData = { hostIp: '', busnessName: '' };
        } else {
          // 区域和文字
          var param = {
            style: cells[0].style,
            geo: JSON.stringify(geo),
            parent: window.TopologyGraph.getParent(cells[0]),
            topoviewInfoUuid: window.paramSubTopo
          };
          if (index === 3) {
            param.value = cells[0].value;
          }
          TopologyAjax.ajaxAddNode(param, 'other', function (response) {
            if (response) {
              cells[0].uuid = response;
              cells[0].id = response;
            }
          });
        }
      }
    }
  }
</script>

