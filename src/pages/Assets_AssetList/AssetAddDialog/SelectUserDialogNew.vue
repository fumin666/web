<template>
  <s-dialog v-model="dialogFlag" title="添加资产账号" id="selectUserDialog" width="700px" append-to-body>
    <div>
      <s-table-page
        ref="table8"
        :data="tableData"
        :header-search="getHeaderSearch()"
        :show-header-checkbox="true"
        @selection-change="handleSelectionChange"
        height = 240
        >
        <s-table-column width="45" type="selection"/>
        <s-table-column prop="accountName" label="账号名称"></s-table-column>
        <s-table-column prop="accountTypeStr" label="账号角色"></s-table-column>
        <s-table-column label="账号类型">
          <template slot-scope="scope">
            {{scope.row.attribute | filterAttr}}
          </template>
        </s-table-column>
      </s-table-page>
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
        selectionList: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      userType: String,
      assetUuid: String,
      portUuid: String,
      ConfigUuid: String
    },
    created() {
      $axios.get(`/assetsAccountInfo/getAssociatedAccountList/${this.assetUuid}/${this.portUuid}`).then(({data}) => {
        this.tableData = data.filter(item => {
          return (item.snmpCWordOr === null && item.snmpCWordRw === null)
        });
        // 默认选中
        this.$nextTick(() => {
          let tableVM = this.$refs['table8'];
          this.tableData.forEach(item => {
            if (item.associated) {
              tableVM.toggleRowSelection(item);
            }
          });
        });
      });
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入账号名称、账号角色',
          searchProps: ['accountName', 'accountTypeStr']
        }
      },
      handleSelectionChange(selection) {
        this.selectionList = selection
      },
      dialogOk() {
        this.$emit('select-user', this.selectionList, this.ConfigUuid);
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
