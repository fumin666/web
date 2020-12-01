<template>
  <s-dialog
    append-to-body
    v-model="dialogFlag"
    v-if="dialogFlag"
    title="查看详情"
    width="800px"
    class="addAccountDialog"
  >
    <s-scrollbar wrap-class="addAccountScrollbar">
      <s-table-page :data="repeatInfo"
                    :header-search="getSearchDef()">
        <s-table-column prop="accountName" label="账号名称" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="roleName" label="账号角色" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="classify" label="账号分类" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="isAdDomain" label="是否是AD域账号类型" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="noUseDays" label="未使用天数" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="lastUseTime" label="最近一次使用时间" show-overflow-tooltip>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button type="cancel" @click="dialogFlag=false">确定</s-button>
    </template>
  </s-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogFlag: false
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      repeatInfo: Array
    },
    created() {
    },
    methods: {
      getSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['realName', 'orgName', 'position', 'classify', 'isAdDomain', 'noUseDays', 'lastUseTime']
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val
        }
      },
      dialogFlag(val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="stylus">
  .addAccountDialog
    .s-form-item .s-form-item-content
      .s-checkbox + .s-checkbox
        margin-right 0
</style>
