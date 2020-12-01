/**
* Created by dgunzi on 2019/01/18.
*/
<template>
  <div id="deviceTableTab">
    <s-table-page
      ref="deviceTable"
      height="210"
      :data="tableData"
      :header-actions="getHeaderActions()"
      :header-search="getHeaderSearch()"
      :row-actions="getRowActions()"
      actions-col-width="150"
    >
      <s-table-column
        type="selection"
        width="60">
      </s-table-column>
      <s-table-column label="状态" prop="pingStatus" width="70" align="center">
        <template slot-scope="scope">
          <img :src="stateImg[scope.row.pingStatus]" :title="titles[scope.row.pingStatus]" class="stateImg">
        </template>
      </s-table-column>
      <s-table-column
        prop="controlAdderss"
        label="IP地址"
        width="230"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="citypeName"
        label="资产类型"
        width="230"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="itcompName"
        label="资产名称"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="date"
        label="是否在拓扑"
        width="130" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isInTopo">是</span><span v-else>否</span>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog v-model="addDeviceDialog" v-if="addDeviceDialog" width="880px" title="选择资产">
      <add-device-form ref="addDeviceForm" :tableData="addTableData"></add-device-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addDeviceSubmit">确定</s-button>
        <s-button @click="addDeviceCancel" type="cancel">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>
<script>
  import { getMonitorItcompList, deleteTopviewItcomp } from './api/topology_api'
  import addDeviceForm from './AddDeviceForm'
  let imgBaseUrl = '../../../static/images/resourcemanage/';
  export default {
    data () {
      return {
        addDeviceDialog: false,
        addTableData: [],
        titles: ['宕机', '在线', '告警'],
        stateImg: [imgBaseUrl + 'deviceOffline.png', imgBaseUrl + 'deviceOnline.png', imgBaseUrl + 'deviceWarn.png']
      }
    },
    methods: {
      viewDevice(row) {
        window.TopologyGraph.getGraphVm().secondTabContent = 'detail';
        window.TopologyGraph.getGraphVm().deviceDetailItem = row;
      },
      init () {
        getMonitorItcompList({
          subTopoId: window.paramSubTopo,
          showapp: this.config.showapp
        }, '1').then((data) => {
          window.TopologyGraph.getGraphVm().deviceData = data;
        });
      },
      showAddDevice () {
        this.addDeviceDialog = true;
        getMonitorItcompList({
          subTopoId: window.paramSubTopo,
          showapp: this.config.showapp
        }, '0').then((data) => {
          this.addTableData = data;
        });
      },
      addDeviceSubmit () {
        this.$refs.addDeviceForm.submit(() => {
          this.init();
          this.$refs.addDeviceForm.keyword = '';
          this.addDeviceDialog = false;
        });
      },
      addDeviceCancel () {
        this.$refs.addDeviceForm.keyword = '';
        this.addDeviceDialog = false;
      },
      deleteByCheck () {
        let delList = this.$refs['deviceTable'].getAllSelectedData();
        if (delList.length === 0) {
          this.$message({message: '请选择需要删除的资产', type: 'warning'});
          return;
        } else {
          let uuidArr = [];
          for (let i = 0, l = delList.length; i < l; i++) {
            uuidArr.push(delList[i].uuid);
          }
          this.ajaxDelDeviceList(uuidArr);
        }
      },
      deleteOneRecord (row) {
        this.ajaxDelDeviceList([row.uuid]);
      },
      ajaxDelDeviceList (uuidArr) {
        this.$confirm('确定删除所选资产？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTopviewItcomp(window.paramSubTopo, uuidArr).then((response) => {
            if (response) {
              this.$message({message: '删除成功', type: 'success'});
              this.delFromTopo(uuidArr);
              this.init();
            } else {
              this.$message.error('删除失败');
            }
          });
        }).catch(() => {});
      },
      delFromTopo(uuidArr) {
        var graph = window.TopologyGraph.getGraph();
        var cells = [];
        for (var i = 0; i < uuidArr.length; i++) {
          var cell = graph.getModel().getCell(uuidArr[i] + '_icon');
          if (cell) {
            cells.push(cell);
            if (cell.underCell) {
              cells.push(cell.underCell);
            }
          }
        }
        graph.removeCells(cells);
      },
      moveToCell(row) {
        var graph = window.TopologyGraph.getGraph();
        var model = graph.getModel();
        // 找到节点位置
        var cell = model.getCell(row.uuid + '_icon');
        if (typeof cell === 'undefined') {
          this.$message({message: '资产不在图中！', type: 'warning'});
        } else {
          graph.scrollCellToVisible(cell, true);
          if (graph.getSelectionCount() > 0) {
            var cells = graph.getSelectionCells();
            graph.removeSelectionCells(cells);
          }
          graph.addSelectionCell(cell);
        }
      },
      getHeaderActions() {
        let vm = this;
        return {
          width: 12,
          offset: 0,
          actions: [
            {
              name: '添加',
              icon: 'add',
              click: function click() {
                vm.showAddDevice();
              }
            }, {
            name: '删除',
            icon: 'delete',
            click: function click() {
              vm.deleteByCheck();
            }
          }]
        }
      },
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入资产名称、IP地址',
          searchProps: ['itcompName', 'controlAdderss']
        }
      },
      getRowActions() {  // 表格操作
        let vm = this;
        return [
          {
            name: '查看',
            icon: 'eye',
            click: (row) => {
              vm.viewDevice(row);
            }
          }, {
            name: '定位',
            icon: 'position',
            click: (row) => {
              vm.moveToCell(row);
            }
          }, {
            name: '删除',
            icon: 'delete',
            click: (row) => {
              vm.deleteOneRecord(row);
            }
          }
        ]
      }
    },
    props: {
      config: {
        type: Object,
        required: true
      },
      tableData: {
        type: Array,
        required: true
      }
    },
    components: {
      addDeviceForm
    }
  }
</script>
<style>
  #deviceTableTab .stateImg {
    vertical-align: middle;
  }
</style>
