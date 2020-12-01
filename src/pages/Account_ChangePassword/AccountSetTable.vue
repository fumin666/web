<template>
  <section>
    <s-scrollbar wrap-class="scrollMaxH">
      <s-table-page :data='accountLists'
                :header-search='getListSearchDef()'
                @selection-change="handleSelectionChange"
                ref="accountTable">
        <s-table-column
          type="selection"
          :selectable="isSelectable"
          width="50">
        </s-table-column>
        <s-table-column
          prop="accountName"
          label="账号名" sortable>
        </s-table-column>
        <s-table-column
          prop="assetName"
          label="资产名称" sortable>
        </s-table-column>
        <s-table-column
          prop="accountTypeStr"
          label="账号类型" sortable>
        </s-table-column>
        <s-table-column
          prop="assetIp"
          label="IP地址" sortable>
        </s-table-column>
      </s-table-page>
      <s-row class="footerRow">
        <s-button style="margin-right: 15px;" type="cancel" @click="cancelAccountSet">取消</s-button>
        <s-button
          id="saveAccountSet"
          :disabled="saveAccountSetDisabled"
          @click="saveAccountSet">保存</s-button>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  // import {intersectObj} from 'sunflower-common-utils'

  export default{
    data() {
      return {
        multipleSelection: [],            // 账号设置列表多选数据
        saveAccountSetDisabled: false     // 账号设置保存按钮是否禁灰
      }
    },
    props: {
      accountLists: {
        type: Array,
        default() {
          return []
        }
      },
      accountListSelected: {
        type: Array,
        default() {
          return []
        }
      },
      pwdUuid: {
        type: String,
        default: ''
      },
      twoResultAccount: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      //  改密任务列表 表格搜索
      getListSearchDef() {
        return {
          width: 10,
          offset: 14,
          placeholder: '请输入查询条件',
          searchProps: ['accountName', 'assetName', 'accountTypeStr', 'assetIp'] // can be string or Array
        }
      },
      isSelectable(row, index) {
        let twoResultUuid = this.twoResultAccount.map(item => {
          return item.uuid
        })
        if (twoResultUuid.indexOf(row.uuid) === -1) {
          return true
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = []
        this.multipleSelection = val;
      },
      saveAccountSet() {
        this.saveAccountSetDisabled = true
        let sendData = []     // 接口上传数据
        let multipleSelectionTemp = []      // 去重后的表格多选数据
        this.multipleSelection.forEach(item => {
          if (!multipleSelectionTemp.find(sel => item.uuid === sel.uuid)) {
            // 去重
            multipleSelectionTemp.push(item)
            // 构造上传数据
            sendData.push({
              accountUuid: item.uuid,
              deviceUuid: item.assetsUuid,
              taskUuid: this.pwdUuid
            })
          }
        })
        $axios.post('/tPasswdChangeTask/saveAccountTask', sendData).then((res) => {
          this.saveAccountSetDisabled = false
          let resData = res.data
          if (resData.result === 'true') {
            this.$emit('closeDialog', multipleSelectionTemp)
            this.$message({
              type: 'success',
              message: '设置成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '设置失败，请重试！'
            })
          }
        })
      },
      cancelAccountSet() {
        this.$emit('closeDialog')
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.accountListSelected.forEach(item => {
          this.$refs['accountTable'].$refs['sTable'].toggleRowSelection(item, true)
        })
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .footerRow
    margin-top 15px
    text-align right
  .scrollMaxH
    max-height 550px;
</style>
