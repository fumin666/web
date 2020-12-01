/**
* Created by dgunzi on 2019/01/18.
*/
<template>
  <div id="linkTab">
    <s-table-page
      ref="linkTable"
      height="210"
      :data="tableData"
      :header-actions="getHeaderActions()"
      :header-search="getHeaderSearch()"
      :row-actions="getRowActions()"
      actions-col-width="150"
    >
      <s-table-column
        type="selection"
        width="70">
      </s-table-column>
      <s-table-column
        prop="isOnlineStatus"
        label="状态"
        align="center" width="70">
        <template slot-scope="scope">
          <img :src="stateImg[scope.row.isOnlineStatus]" :title="titles[scope.row.isOnlineStatus]" class="stateImg">
        </template>
      </s-table-column>
      <s-table-column
        label="线路名称"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span :title="filterLinkName(scope.row)"> {{ filterLinkName(scope.row) }} </span>
        </template>
      </s-table-column>
      <s-table-column
        prop="sourceHostName"
        label="源资产名称"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="sourceIp"
        label="源资产IP"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        label="源端口名称"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="scope.row.sourceInterfaceName"></span>
        </template>
      </s-table-column>
      <s-table-column
        prop="targetHostName"
        label="目标资产名称"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="targetIp"
        label="目标资产IP"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        label="目标端口名称"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="scope.row.targetInterfaceName"></span>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog
      v-model="confirmDialog"
      v-if="confirmDialog"
      title="提示" width="400px">
      <div class="s-message-box-status s-icon-warning"></div>
      <div class="s-message-box-message" style="margin-left: 50px;">
        <div><s-radio class="radio" v-model="isBatchDel" label="1">删除所有拓扑连线</s-radio></div>
        <div><s-radio class="radio" v-model="isBatchDel" label="2">删除当前拓扑连线</s-radio></div>
      </div>
      <template slot="footer" class="dialog-footer">
        <s-button @click="confirmSubmit">确定</s-button>
        <s-button @click="customCancel" type="cancel">取消</s-button>
      </template>
    </s-dialog>

    <link-add-dialog v-if="addDialogFlag" v-model="addDialogFlag"
                     from="lineTab" @reload="init">
    </link-add-dialog>
  </div>
</template>
<script>
  let imgBaseUrl = '../../../static/images/resourcemanage/';
  import { getTopoviewLinkList, getTopoviewLineDetail } from './api/topology_api'
  import TopoAjax from './module/topology.ajax'
  import linkAddDialog from './dialog/LinkAddDialog.vue';
  export default {
    data () {
      return {
        addDialogFlag: false,
        keyword: '',
        curLink: {},
        titles: ['宕机', '正常', '告警'],
        confirmDialog: false,
        tempList: [],
        isBatchDel: '1',
        stateImg: [imgBaseUrl + 'deviceOffline.png', imgBaseUrl + 'deviceOnline.png', imgBaseUrl + 'deviceWarn.png']
      }
    },
    methods: {
      addLink() {
        this.addDialogFlag = true;
      },
      init () {
        getTopoviewLinkList({
          subTopoId: window.paramSubTopo,
          showapp: this.config.showapp
        }).then((data) => {
          window.TopologyGraph.getGraphVm().linkData = data;
        });
      },
      confirmSubmit() {
        this.confirmDialog = false;
        this.ajaxDelLinkList(this.tempList);
      },
      customCancel() {
        this.confirmDialog = false;
        this.tempList = [];
        this.isBatchDel = '1';
      },
      viewLink(row) {
        getTopoviewLineDetail(row.uuid).then(function(response) {
          response.sourceData = JSON.parse(response.sourceData) || {};
          response.targetData = JSON.parse(response.targetData) || {};
          response.sourceHostName = row.sourceHostName || response.sourceHostName;
          response.targetHostName = row.targetHostName || response.targetHostName;
          window.TopologyGraph.getGraphVm().linkDetailItem = response;
          window.TopologyGraph.getGraphVm().thirdTabContent = 'detail';
        });
      },
      deleteByCheck () {
        let delList = this.$refs['linkTable'].getAllSelectedData();
        if (delList.length === 0) {
          this.$message({message: '请选择需要删除的线路', type: 'warning'});
          return;
        } else {
          let uuidArr = [];
          for (let i = 0, l = delList.length; i < l; i++) {
            uuidArr.push(delList[i].uuid);
          }
          this.confirmDialog = true;
          this.tempList = uuidArr;
        }
      },
      deleteOneRecord (row) {
        this.confirmDialog = true;
        this.tempList = [row.uuid];
      },
      ajaxDelLinkList(uuidArr) {
        TopoAjax.ajaxDelLineList(uuidArr, this.isBatchDel, (response) => {
          if (response) {
            let edgeArr = [];
            let graph = window.TopologyGraph.getGraph();
            let model = graph.getModel();
            for (let i = 0, l = uuidArr.length; i < l; i++) {
              if (model.getCell(uuidArr[i])) {
                edgeArr.push(model.getCell(uuidArr[i]));
              }
            }
            graph.removeCells(edgeArr);
            this.tempList = [];
            this.init();
          }
        });
      },
      filterLinkName (row) {
        if (row.name) {
          return row.name;
        } else if (row.linkName) {
          return row.linkName;
        } else {
          return row.sourceIp + '—' + row.targetIp;
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
                vm.addLink();
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
          placeholder: '请输入源资产名称、目标资产名称、源资产IP、目标资产IP',
          searchProps: ['sourceIp', 'targetIp', 'sourceHostName', 'targetHostName']
        }
      },
      getRowActions() {  // 表格操作
        let vm = this;
        return [
          {
            name: '查看',
            icon: 'eye',
            click: (row) => {
              vm.viewLink(row);
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
      linkAddDialog
    }
  }
</script>
<style>
#linkTab .s-message-box-status{
  top: 35px;
}
</style>
