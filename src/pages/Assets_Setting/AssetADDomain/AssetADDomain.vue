<template>
  <div class="assetAdDomain">
    <s-row class="topRow" style="float:left;">
      <s-button @click="add" icon="plus">添加</s-button>
    </s-row>
    <s-table-page :data="adList"  :header-search="searchDef()" >
      <s-table-column label="域名" prop="adName" show-overflow-tooltip></s-table-column>
      <s-table-column label="服务器地址" prop="ip" show-overflow-tooltip></s-table-column>
      <s-table-column label="端口" prop="port" show-overflow-tooltip></s-table-column>
      <s-table-column label="管理员账号" prop="adSelectAccount" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <ADDomainAddDialog v-if="addDialogFlag" v-model="addDialogFlag" :adList="adList" :adRow="curRow" @reload="axiosList"></ADDomainAddDialog>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';

import ADDomainAddDialog from './ADDomainAddDialog';

export default {
  data() {
    return {
      addDialogFlag: false,
      detailDialogFlag: false,
      adList: [],
      curRow: {}
    }
  },
  created() {
    this.axiosList();
  },
  methods: {
    searchDef() {
      return {
        width: 4,
        offset: 20,
        placeholder: '请输入关键字',
        searchProps: ['adName', 'ip', 'port', 'adSelectAccount']
      }
    },
    axiosList() {
      $axios.post(`/tdeviceAdInfo/getTDeviceAdInfoList`).then(({data}) => {
        this.adList = data;
      });
    },
    add() {
      this.curRow = {};
      this.addDialogFlag = true;
    },
    rowEdit(row) {
      this.curRow = Object.assign({}, row);
      this.addDialogFlag = true;
    },
    rowDel(row) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        // let logParam = {
        //   data: [Object.assign({}, row)],
        //   logTemplate: '删除' + '|协议(#protocolName#)'
        // };
        let arrParams = [];
        arrParams.push(row.uuid);
        let obj = {
          data: [],
          logTemplate: `删除|AD域管理>AD域(${row.adName})`
        }
        $axios.post(`/tdeviceAdInfo/delTDeviceAdinfo`, arrParams, obj).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '删除成功!', type: 'success'});
            this.axiosList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        });
      }).catch(() => {});
    }
  },
  components: {
    ADDomainAddDialog
  }
}
</script>

<style lang="stylus">
</style>
