<template>
  <div class="dbTab">
    <s-scrollbar wrap-class="auditScrollbar">
      <s-table-page
        :data="list"
        :header-actions="getHeaderActions()"
        :header-search="getHeaderSearch()" @selection-change="selectionChange">
        <s-table-column type="selection" width="45" align="center"></s-table-column>
        <s-table-column label="资产名称" prop="dbiName" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.dbiName }}</span>
          </template>
        </s-table-column>
        <s-table-column label="IP地址" prop="dbiIp" show-overflow-tooltip></s-table-column>
        <s-table-column label="端口" prop="dbiPort" show-overflow-tooltip></s-table-column>
        <s-table-column label="是否审计" prop="isAudit" show-overflow-tooltip>
          <template slot-scope="scope">
            <s-switch v-model="scope.row.isAudit" size="small" :active-value="1" :inactive-value="0" @change="audit(scope.row)"></s-switch>
          </template>
        </s-table-column>
        <s-table-column label="描述" prop="dbiDesc" show-overflow-tooltip></s-table-column>
        <s-table-column label="协议" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="protocol">{{scope.row.protocolName}}</span>
          </template>
        </s-table-column>
        <s-table-column label="字符集" prop="dbiCharset" show-overflow-tooltip></s-table-column>
        <s-table-column label="操作" width="120">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" @click="goDetail(scope.row)" title="查看资产详情"></i>
            <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑" v-show="hasEdit(scope.row)"></i>
          </template>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>

    <db-edit-dialog v-if="editDialogFlag" v-model="editDialogFlag" :cur-db="curDb" @reload="axiosList"></db-edit-dialog>
  </div>
</template>

<script>

import $axios from 'sunflower-ajax';
import dbEditDialog from './AuditDialog/DbEditDialog';

export default {
  data() {
    return {
      editDialogFlag: false,
      list: [],
      selections: [],
      curDb: {}
    }
  },
  created() {
    this.axiosList();
  },
  methods: {
    getHeaderActions() {
      let vm = this;
      return {
        width: 12,
        offset: 0,
        actions: [
          {
            name: '批量开启',
            icon: 'start',
            click: function() {
              vm.openBatch();
            }
          },
          {
            name: '批量停止',
            icon: 'pause',
            click: function() {
              vm.closeBatch();
            }
          }
        ]
      }
    },
    axiosList() {
      let param = {
        condition: {
          search: ''
        }
      };
      $axios.post(`/sysDbauditObject/getAll`, param).then(({data}) => {
        this.list = data;
      });
    },
    goDetail(row) {
      this.$router.push(`/AssetsAll/assets_setting/assetsDetail/${row.assetUuid}/DatabaseAsset`)
    },
    axiosAudit(rows, flag, callback = () => {}) {
      let url = '/sysDbauditObject/closeAuditByObj';
      let param = rows.map(item => {
        return {
          assetUuid: item.assetUuid,
          portUuid: item.portUuid
        }
      });
      let logParam = {
        data: rows,
        logTemplate: (flag === 'open' ? '启动' : '停止') + '审计|数据库配置(#dbiName#)'
      };
      if (flag === 'open') {
        url = '/sysDbauditObject/openAuditList';
        param = rows.map(item => {
          return {
            assetUuid: item.assetUuid,
            portUuid: item.portUuid,
            id: item.dbiId
          }
        });
      }
      $axios.post(url, param, logParam).then(({data}) => {
        if (typeof data === 'boolean') {
          if (data) {
            this.$message({message: '操作成功', type: 'success'});
          } else {
            this.$message({message: '操作失败，数据库审计数达到注册上限', type: 'error'});
          }
        } else {
          this.$message({message: data, type: 'error'});
        }
        callback(data);
      });
    },
    getHeaderSearch() {
      return {
        width: 10,
        placeholder: '请输入关键字',
        searchProps: ['dbiName', 'dbiIp', 'dbiPort', 'dbiDesc', 'protocolName', 'dbiCharset']
      }
    },
    hasEdit(row) {
      let arr = ['SQL SERVER', 'ORACLE', 'RAW'];
      return arr.indexOf(row.protocolName) > -1;
    },
    selectionChange(selections) {
      this.selections = selections;
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
      })
    },
    rowEdit(row) {
      this.curDb = Object.assign({}, row);
      this.editDialogFlag = true;
    }
  },
  components: {
    dbEditDialog
  }
}
</script>

<style lang="stylus">

</style>
