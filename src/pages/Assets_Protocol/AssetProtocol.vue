<template>
  <div class="assetProtocol">
    <s-row style="position:absolute;">
      <s-button @click="add" icon="plus" v-noBtn="'assetsManage_sysAddProtocol'">添加</s-button>
    </s-row>
    <s-table-page
      :data="protocolList"
      :header-search="searchDef()"
    >
      <s-table-column label="协议名称" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.protocolName}}</span>
        </template>
      </s-table-column>
      <s-table-column label="默认端口" prop="protocolPort" width="150"></s-table-column>
      <s-table-column label="协议类型" prop="protocolTypeNme" width="150"></s-table-column>
      <s-table-column label="备注" prop="remark" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" align="left" width="150" v-if="judgeRoleBtn('assetsManage_sysEditProtocol') && judgeRoleBtn('assetsManage_sysDelProtocol')">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="showDetail(scope.row)" title="查看"></i>
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑" v-noBtn="'assetsManage_sysEditProtocol'" v-show="auth(scope.row)||scope.row.defaultStatus === 2"></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除" v-noBtn="'assetsManage_sysDelProtocol'" v-show="scope.row.defaultStatus === 2 && !scope.row.connect"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <protocol-add-dialog v-if="addDialogFlag" v-model="addDialogFlag" :protocolList="protocolList"
                         :protocol="curRow" @reload="axiosList"></protocol-add-dialog>
    <protocol-detail-dialog  v-if="detailDialogFlag" v-model="detailDialogFlag" :protocol="curRow"></protocol-detail-dialog>

  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import protocolAddDialog from './ProtocolAddDialog';
  import protocolDetailDialog from './ProtocolDetailDialog';

  export default {
    data() {
      return {
        addDialogFlag: false,
        detailDialogFlag: false,
        protocolList: [],
        curRow: {}
      }
    },
    created() {
      this.axiosList();
    },
    methods: {
      /* 现统一调整如下：
          内置协议：
          1、所有都允许查看；
          2、应用类的协议，DBA，IMP用的协议允许编辑；
          3、所有内置协议不允许删除；
          4、凡是用户自定义的协议，查看、编辑、删除操作都有，一旦协议被任何一个资产关联了，协议就不可以删除；
      */
      auth(row) {
        var DBAIMPName = ['SSH', 'ORACLE', 'DB2', 'INFORMIX', 'MySQL', 'SQL SERVER', 'Sybase', 'Cache', 'DAMENG(达梦)', 'Kingbase(金仓)', 'PostgreSQL', '其他数据库协议', '其他中间件协议', 'OSCAR', 'Greenplum'];
        return row.protocolType === 1 || DBAIMPName.includes(row.protocolName);
      },
      searchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入关键字',
          searchProps: ['protocolName', 'protocolPort', 'protocolTypeNme', 'remark']
        }
      },
      axiosList() {
        $axios.post(`/protocolInfo/getProtocolInfo`).then(({data}) => {
          this.protocolList = data;
          this.protocolList.forEach(item => {
            if (item.remark === '') {
              item.remark = '----'
            }
          })
        });
      },
      add() {
        this.curRow = {};
        this.addDialogFlag = true;
      },
      showDetail(row) {
        if (!this.judgeRoleBtn('assetsManage_sysViewProtocol')) {
          this.$message({showClose: true, message: '很抱歉，您没有权限！', type: 'warning'});
          return
        }
        this.curRow = row;
        this.detailDialogFlag = true;
      },
      rowEdit(row) {
        this.curRow = Object.assign({}, row);
        this.addDialogFlag = true;
      },
      rowDel(row) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          let logParam = {
            data: [Object.assign({}, row)],
            logTemplate: '删除' + '|协议设置>协议(#protocolName#)'
          };
          $axios.get(`/protocolInfo/deleteProtocolInfo/${row.uuid}`, logParam).then(({data}) => {
            if (data === '1') {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.axiosList();
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    components: {
      protocolAddDialog,
      protocolDetailDialog
    }
  }
</script>

<style lang="stylus">
/* .assetProtocol
    padding 15px
    .topRow
      margin-bottom -36px
    .protocolName
      color: #34c3f2
      cursor default
      &:hover
        text-decoration underline */
</style>
