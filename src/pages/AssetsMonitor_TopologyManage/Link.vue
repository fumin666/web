<template>
  <div class="linkListContent">
    <div style="margin:20px 20px 0 20px">
      <s-table-page :data='tableData'
                    ref="multipleTable"
                    :header-actions='getListActionsDef()'
                    :header-search='getSearchDef()'
                    @selection-change="handleSelectChange">
        <s-table-column
          type="selection"
          width="45">
        </s-table-column>
        <s-table-column
          prop="isOnlineStatus"
          label="状态"
          width="100" align="center">
          <template slot-scope="scope">
            <img :src="stateImg[scope.row.isOnlineStatus]" :title="titles[scope.row.isOnlineStatus]" class="stateImg">
          </template>
        </s-table-column>
        <s-table-column
          prop="name"
          label="线路名称"
          show-overflow-tooltip>
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
          prop="sourceInterfaceName"
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
        <s-table-column
          label="所在拓扑"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-html="scope.row.location"></span>
          </template>
        </s-table-column>
        <s-table-column label="操作" align="left" width="150">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" title="查看" @click="viewLink(scope.row)"></i>
            <i class="iconfont icon-edit" title="编辑" @click="editLink(scope.row)"></i>
            <i class="iconfont icon-delete" title="删除" @click="deleteLink(scope.row)"></i>
          </template>
        </s-table-column>
      </s-table-page>
    </div>
    <s-dialog v-model="viewLinkDialog" title="线路详情" width="800px">
      <table class="itemTable">
        <tr>
          <td class="title bg-purple">线路名称</td>
          <td class="item bg-purple-light">
            {{ linkDetail.name }}
          </td>
          <td class="title bg-purple">线路状态</td>
          <td class="item bg-purple-light">{{ getState(linkDetail.isOnline) }}</td>
        </tr>
        <tr>
          <td class="title bg-purple">源资产</td>
          <td class="item bg-purple-light">
            {{ linkDetail.sourceHostName }}
          </td>
          <td class="title bg-purple">目的资产</td>
          <td class="item bg-purple-light">
            {{ linkDetail.targetHostName }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口</td>
          <td class="item bg-purple-light">
            {{ linkDetail.sourceInterfaceName }}
          </td>
          <td class="title bg-purple">目的端口</td>
          <td class="item bg-purple-light">
            {{ linkDetail.targetInterfaceName }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口发送速率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'outSpeed', 'kbps') }}
          </td>
          <td class="title bg-purple">目的端口发送速率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'outSpeed', 'kbps') }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口接收速率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'inSpeed', 'kbps') }}
          </td>
          <td class="title bg-purple">目的端口接收速率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'inSpeed', 'kbps') }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口发送丢包率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'outPacket', '%') }}
          </td>
          <td class="title bg-purple">目的端口发送丢包率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'outPacket', '%') }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口接收丢包率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'inPacket', '%') }}
          </td>
          <td class="title bg-purple">目的端口接收丢包率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'inPacket', '%') }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口带宽利用率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'utilization', '%') }}
          </td>
          <td class="title bg-purple">目的端口带宽利用率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'utilization', '%') }}
          </td>
        </tr>
      </table>
    </s-dialog>

    <link-add-dialog v-if="addDialogFlag" v-model="addDialogFlag"
                     @reload="init">
    </link-add-dialog>
    <link-edit-dialog v-if="editDialogFlag" v-model="editDialogFlag"
                     :curObj="curLink" @reload="init">
    </link-edit-dialog>
    <!--导入-->
    <import-dialog v-if="importDialogFlag" v-model="importDialogFlag" :save-log="true"
                   :upload-obj="uploadObj" :down-obj="downObj" @reload="init"
                   :file-types="['xls', 'xlsx']"
    ></import-dialog>
    <!--划归拓扑-->
    <put-under-topo-dialog v-if="putUnderTopoDialogFlag" v-model="putUnderTopoDialogFlag" :underUuid="underUuid" @reload="init">
    </put-under-topo-dialog>
  </div>
</template>
<script>

import { getAllTopoviewLink, delTopoviewLink, getTopoviewLineDetailShowByLinkUuid } from './api/topology_api'
let imgBaseUrl = '../../../static/images/resourcemanage/';
import linkAddDialog from './dialog/LinkAddDialog.vue';
import linkEditDialog from './dialog/LinkEditDialog.vue';
import importDialog from '@/components/importDialog/ImportDialog';
import putUnderTopoDialog from './dialog/PutUnderTopoDialog'
import {Download} from 'sunflower-common-utils';

export default {
  data() {
    return {
      addDialogFlag: false,
      editDialogFlag: false,
      tableData: [],
      curLink: {},
      delList: [],
      linkDetail: {},
      viewLinkDialog: false,
      boxCardHeight: 500,
      titles: ['宕机', '正常', '告警'],
      stateImg: [imgBaseUrl + 'deviceOffline.png', imgBaseUrl + 'deviceOnline.png', imgBaseUrl + 'deviceWarn.png'],
      importDialogFlag: false,
      uploadObj: {},
      downObj: {},
      putUnderTopoDialogFlag: false,
      underUuid: []
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    deleteByCheck () {
      if (this.delList.length === 0) {
        this.$message({message: '请选择需要删除的线路', type: 'warning'});
        return;
      } else {
        let uuidArr = [];
        for (let i = 0, l = this.delList.length; i < l; i++) {
          uuidArr.push(this.delList[i].uuid);
        }
        this.ajaxDelLinkList(uuidArr);
      }
    },
    closeDetailDialog () {
      this.viewLinkDialog = false;
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
    getState (isOnline) {
      return this.titles[isOnline];
    },
    getData (data, item, unit) {
      if (typeof data !== 'undefined') {
        return (data[item] || '0') + unit;
      } else {
        return '0' + unit;
      }
    },
    handleSelectChange(rows) {
      this.delList = rows;
    },
    init () {
      // this.$refs.multipleTable.clearSearch()
      getAllTopoviewLink().then((data) => {
        this.tableData = data.map(item => {
          item.name = this.filterLinkName(item);
          return item;
        })
      });
    },
    initDivHeight () {
      var footerHeight = document.querySelector('.s-footer').offsetHeight;
      var headerHeight = document.getElementById('headBar').offsetHeight;
      this.boxCardHeight = window.innerHeight - footerHeight - headerHeight - 10;
    },
    getListActionsDef() {
      let self = this
      return {
        width: 12,
        actions: [{
          name: '添加',
          click() {
            self.addDialogFlag = true;
          },
          icon: 'plus'
        }, {
          name: '批量删除',
          click() {
            self.deleteByCheck();
          },
          icon: 'batch-del'
        }, {
          name: '划归拓扑',
          click() {
            self.putUnderTopo();
          },
          icon: 'app'
        }, {
          name: '批量导入',
          click() {
            self.importBatch();
          },
          icon: 'import'
        }, {
          name: '批量导出',
          click() {
            self.exportBatch();
          },
          icon: 'export'
        }]
      }
    },
    ajaxDelLinkList(uuidArr) {
      this.$confirm('确定删除所选线路？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTopoviewLink(uuidArr).then((response) => {
          if (response) {
            this.init();
          }
        });
      }).catch(() => {});
    },
    viewLink(row) {
      this.viewLinkDialog = true;
      getTopoviewLineDetailShowByLinkUuid(row.uuid).then((response) => {
        response.sourceData = JSON.parse(response.sourceData) || {};
        response.targetData = JSON.parse(response.targetData) || {};
        response.isOnlineStatus = row.isOnlineStatus;
        response.name = this.filterLinkName(response);
        this.linkDetail = response;
      });
    },
    editLink(row) {
      this.editDialogFlag = true;
      this.curLink = Object.assign({}, row);
    },
    deleteLink(row) {
      this.ajaxDelLinkList([row.uuid]);
    },
    getSearchDef() {
      return {
        width: 4,
        offset: 8,
        placeholder: '请输入查询条件',
        searchProps: ['name', 'sourceHostName', 'sourceIp', 'sourceInterfaceName', 'targetHostName', 'targetIp', 'targetInterfaceName'] // can be string or Array
      }
    },
    // 批量导入
    importBatch() {
      this.uploadObj = {
        type: 'post',
        url: '/viewmanager/topoLink/importTopoviewLink'
      };
      this.downObj = {
        text: '线路导入模板',
        url: '/viewmanager/topoLink/exportTopoviewLinkTemplate'
      };
      this.importDialogFlag = true;
    },
    // 批量导出
    exportBatch() {
      if (this.delList.length === 0) {
        this.$message({showClose: true, message: '请先选择线路', type: 'info'});
        return;
      }
      let uuidStr = this.delList.map(item => {
        return item.uuid;
      }).join(',');
      Download(`/viewmanager/topoLink/exportTopoviewLink/${uuidStr}`, {
        logTemplate: '导出|线路(link)'
      });
    },
    // 划归拓扑
    putUnderTopo() {
      if (this.delList.length === 0) {
        this.$message({message: '请选择要划归的线路', type: 'warning'});
        return;
      } else {
        let uuidArr = [];
        for (let i = 0, l = this.delList.length; i < l; i++) {
          uuidArr.push(this.delList[i].uuid);
        }
        this.underUuid = uuidArr;
        this.putUnderTopoDialogFlag = true;
      }
    }
  },
  components: {

    linkAddDialog,
    linkEditDialog,
    importDialog,
    putUnderTopoDialog
  }
}
</script>

