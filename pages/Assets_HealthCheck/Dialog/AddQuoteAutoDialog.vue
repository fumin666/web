<template>
  <s-dialog
    v-model="dialogFlag"
    title="账号"
    top="5vh"
    width="800px"
    class=""
    append-to-body>
    <s-scrollbar wrap-style="max-height:550px;">
      <s-table-page
        ref="myUserList"
        :data="userList"
        :header-search="getSearchDef()"
        @selection-change="handleUserSelectChange">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column label="用户名" prop="userLoginName" show-overflow-tooltip></s-table-column>
        <s-table-column label="真实姓名" prop="accountName" show-overflow-tooltip></s-table-column>
        <s-table-column label="Email" prop="email" show-overflow-tooltip></s-table-column>
        <s-table-column label="手机号" prop="userCellphone"></s-table-column>
        <s-table-column label="微信号" prop="userWechat" show-overflow-tooltip></s-table-column>
      </s-table-page>
      <s-row class="rightFooter">
        <s-button @click="dialogOk">确定</s-button>
        <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
      </s-row>
    </s-scrollbar>
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
      getSearchDef() {
        return {
          width: 12,
          offset: 12,
          placeholder: '请输入查询条件',
          searchProps: ['userLoginName', 'accountName', 'email', 'userCellphone', 'userWechat']
        }
      },
      handleUserSelectChange(val) {
        this.selectUser = val;
      },
      dialogOk() {
        if (this.selectUser.find(item => !item.email)) {
          this.$message({message: '不可引用无email信息的用户！', type: 'warning'});
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
.rightFooter
  margin 10px 12px 0 0
  text-align right
  button + button
    margin-left 12px
</style>
