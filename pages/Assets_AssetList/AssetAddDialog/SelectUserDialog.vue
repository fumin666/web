<template>
  <s-dialog v-model="dialogFlag" title="添加资产账号" id="selectUserDialog" width="560px">
    <div>
      <s-row class="titleRow">
        <s-col class="left-float title">资产账号列表</s-col>
        <s-col class="right-float">
          <s-input v-model="filterValue" placeholder="请输入关键字" icon="magnifier" class="search"></s-input>
        </s-col>
      </s-row>
      <s-radio-group style="width: 100%;" v-model="currentRow">
        <s-table :data="filterTableData" style="width: 100%" show-overflow-tooltip height="200" border @current-change="handleCurrentChange" ref="table">
          <s-table-column width="90px" align="center" label="单选">
            <template slot-scope="scope">
              <s-radio :label="scope.row">&nbsp;</s-radio>
            </template>
          </s-table-column>
          <s-table-column prop="accountName" label="账号名称"></s-table-column>
          <s-table-column prop="accountTypeStr" label="账号角色"></s-table-column>
          <s-table-column label="账号类型">
            <template slot-scope="scope">
              {{scope.row.attribute | filterAttr}}
            </template>
          </s-table-column>
        </s-table>
      </s-radio-group>
    </div>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogCancel">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    data() {
      return {
        dialogFlag: false,
        tableData: [],
        filterValue: '',
        selections: [],
        currentRow: null
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      selectedUserUuids: {
        type: String,
        default: ''
      },
      userType: String,
      assetUuid: String
    },
    computed: {
      filterTableData() {
        return this.tableData.filter(item => {
          let itemStr = item.accountName + ',' + item.accountTypeStr + ',' + item.accountType;
          return itemStr.indexOf(this.filterValue) !== -1;
        });
      }
    },
    created() {
      $axios.get(`/assetsAccountInfo/viewAssetsAccountInfo/${this.assetUuid}`).then(({data}) => {
        // this.tableData = data.filter(item => {
        //   return (item.accountTypeStr === this.userType && item.snmpCWordOr === null && item.snmpCWordRw === null)
        // });
        this.tableData = data.filter(item => {
          return (item.snmpCWordOr === null && item.snmpCWordRw === null)
        });
//        this.tableData = data;
        if (this.selectedUserUuids) {
          this.$nextTick(() => {
            let tableVM = this.$refs['table'];
            this.tableData.forEach(item => {
              if (this.selectedUserUuids.split(',').some(uuid => { return item.uuid === uuid; })) {
                tableVM.toggleRowSelection(item, true);
              }
            });
          });
        }
      });
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      dialogOk() {
//        if (this.selections.length === 0) {
//          this.$message({showClose: true, message: '请先选择账号列表', type: 'error'});
//          return;
//        }
//        if (this.selections.length > 1 && this.userType === '超级用户') {
//          this.$message({showClose: true, message: '一个协议只能关联一个超级用户', type: 'error'});
//          return;
//        }
        this.$emit('select-user', this.currentRow);
        this.dialogFlag = false;
      },
      dialogCancel() {
        this.dialogFlag = false;
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    filters: {
      filterAttr(val) {
        return val === 1 ? '托管账号' : '收集账号';
      }
    }
  }
</script>

<style lang="stylus">
  #selectUserDialog
    .titleRow
      margin-bottom 10px
      .title
        line-height 30px
        padding-left 10px
        font-weight: bold
</style>
