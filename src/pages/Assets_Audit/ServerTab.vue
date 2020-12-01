<template>
  <div class="serverTab">
    <s-scrollbar wrap-class="auditScrollbar">
      <s-row>
        <s-button icon="plus" @click="add">添加</s-button>
        <s-button icon="start" @click="openBatch">批量开启</s-button>
        <s-button icon="pause" @click="closeBatch">批量停止</s-button>
      </s-row>
      <s-table-page :data="list"
                   @selection-change="selectionChange">
        <s-table-column type="selection" width="45" align="center"></s-table-column>
        <s-table-column label="名称" prop="appName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.appName }}
          </template>
        </s-table-column>
      <!--  <s-table-column label="协议/端口" prop="serverPort" show-overflow-tooltip></s-table-column>-->
        <s-table-column label="协议/端口" show-overflow-tooltip>
          <template slot-scope="scope" >
            {{scope.row.remarks}}{{scope.row.sel}}{{scope.row.serverPort}}
        </template>
        </s-table-column>
        <s-table-column label="IP地址" prop="serverIp" show-overflow-tooltip></s-table-column>
        <s-table-column label="绑定数据库" prop="dbiNames" show-overflow-tooltip></s-table-column>
        <s-table-column label="描述" prop="appDesc" show-overflow-tooltip></s-table-column>
        <s-table-column label="是否审计" prop="isAudit" show-overflow-tooltip>
          <template slot-scope="scope">
            <s-switch v-model="scope.row.isAudit" size="small" :active-value="1" :inactive-value="0" @change="audit(scope.row)"></s-switch>
          </template>
        </s-table-column>
        <s-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
            <i class="iconfont icon-config-link-audit" @click="rowRelate(scope.row)" title="关联审计配置"></i>
            <i class="iconfont icon-business-translate" @click="rowTranslate(scope.row)" title="业务翻译"></i>
          </template>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>

    <server-add-dialog v-if="addDialogFlag" v-model="addDialogFlag"
                       :cur-server="curServer" @reload="axiosList"></server-add-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import serverAddDialog from './AuditDialog/ServerAddDialog';

  export default {
    data() {
      return {
        addDialogFlag: false,
        list: [],
        selections: [],
        curServer: {}
      }
    },
    created() {
      this.axiosList();
    },
    methods: {
      axiosList() {
        $axios.post(`/sysDbauditObject/getDbauditAppList`).then(({data}) => {
          this.list = data;
          this.list.forEach(item => {
          this.$set(item, 'sel', '/')
          if (item.serverPort === null || item.remarks === null) {
          item.sel = null
          }
          })
        });
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      add() {
        this.curServer = {};
        this.addDialogFlag = true;
      },
      axiosAudit(rows, flag, callback = () => {}) {
        let url = '/sysDbauditObject/closeAudit';
        let param = rows.map(item => {
          return item.appId;
        });
        if (flag === 'open') {
          url = '/sysDbauditObject/appOpenAuditList';
         /* param = rows.map(item => {
            return {
           assetUuid: item.assetUuid,
              portUuid: item.portUuid,
              id: item.appUuid
            }
          }); */
           param = rows.map(item => {
            return item.appUuid;
          });
        }
        $axios.post(url, param).then(({data}) => {
          if (data) {
            this.$message({message: '操作成功', type: 'success'});
          } else {
            this.$message({message: '操作失败', type: 'error'});
          }
          callback(data);
        });
      },
      openBatch() {
        if (this.selections.length === 0) {
          this.$message({message: '请先选择资产!', type: 'info'});
          return;
        }
        this.axiosAudit(this.selections, 'open', data => {
          if (data) {
            this.axiosList();
          }
        });
      },
      closeBatch() {
        if (this.selections.length === 0) {
          this.$message({message: '请先选择资产!', type: 'info'});
          return;
        }
        this.axiosAudit(this.selections, 'close', data => {
          if (data) {
            this.axiosList();
          }
        });
      },
      audit(row) {
        this.$nextTick(() => {
          let flag = row.isAudit ? 'open' : 'close';
          this.axiosAudit([row], flag, data => {
            if (!data) { // 行内如果审计失败刷新列表
              this.axiosList();
            }
          });
        });
      },
      rowEdit(row) {
        this.curServer = Object.assign({}, row);
        this.addDialogFlag = true;
      },
      rowRelate(row) {
        this.$router.push({name: 'AssetsAll_assets_audit_serverDeploy', params: {appId: row.appId}});
      },
      rowTranslate(row) {
        this.$router.push({name: 'AssetsAll_assets_audit_serverTranslate', params: {appId: row.appId}});
      }
    },
    components: {
      serverAddDialog
    }
  }
</script>

<style lang="stylus">
 /* .serverTab
    .protocol
      padding: 5px 15px
      border-radius: 8px
      border: 1px solid #053b66
      background: #053b66  */
</style>
