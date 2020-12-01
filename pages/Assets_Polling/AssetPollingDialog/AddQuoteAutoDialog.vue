<template>
  <s-dialog v-model="dialogFlag" title="账号" width="800px" append-to-body class="">
    <s-table-page
      :data="userList"
      :header-search="getHeaderSearch()"
      @selection-change="handleUserSelectChange"
      :show-header-checkbox="true"
      ref="myUserList"
      height="450">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="用户名" prop="userLoginName" show-overflow-tooltip></s-table-column>
      <s-table-column label="真实姓名" prop="accountName" show-overflow-tooltip></s-table-column>
      <s-table-column label="Email" prop="email" show-overflow-tooltip></s-table-column>
      <s-table-column label="手机号" prop="userCellphone"></s-table-column>
      <s-table-column label="微信号" prop="userWechat" show-overflow-tooltip></s-table-column>
    </s-table-page>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogFlag: false,
        selectUser: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      userList: Array,
      hasSelect: Array
    },
    created() {
      if (this.hasSelect.length > 0) {
        this.$nextTick(() => {
          this.userList.forEach(item => {
            this.hasSelect.forEach(selItem => {
              if (selItem.accountUuid === item.accountUuid) {
                this.$refs.myUserList.toggleRowSelection(item);
              }
            })
          });
        })
      }
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入关键字进行查询',
          searchProps: ['userLoginName', 'accountName', 'email', 'userCellphone', 'userWechat']
        }
      },
      handleUserSelectChange(val) {
        this.selectUser = val;
      },
      dialogOk() {
        if (this.selectUser.find(item => !item.email)) {
          this.$message({message: '没有email的用户不允许引用！', type: 'warning'});
          return;
        }
        this.$emit('add-quote', this.selectUser);
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
    }
  }
</script>

<style lang="stylus">

</style>
