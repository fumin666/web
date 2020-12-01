<template>
  <s-table-page
    :show-header-checkbox="true"
    ref="addLinkDialog"
    :data="userList"
    :header-search="defSearch()"
    @selection-change="handleUserListChange"
    height="450">
    <s-table-column type="selection" width="45"></s-table-column>
    <s-table-column label="用户名" prop="userLoginName"></s-table-column>
    <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
    <s-table-column label="Email" prop="userMail"></s-table-column>
    <s-table-column label="手机号" prop="userPhone"></s-table-column>
    <s-table-column label="微信号" prop="userWechat"></s-table-column>
  </s-table-page>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {

    props: {
      data: Array
    },
    data() {
      return {
        autoUser: this.data,
        userList: [],
        selectedUser: []
      }
    },
    methods: {
      // 定义表头查询
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['userLoginName', 'userRealName', 'userMail', 'userPhone', 'userWechat']
        }
      },
      getList() {
        $axios.post('/iamUserInfo/list', {}).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.userList = res.data;
            if (this.autoUser.length > 0) {
              this.autoSelect();
            }
          }
        });
      },
      autoSelect() {
        this.$nextTick(() => {
          for (let i = 0; i < this.autoUser.length; i++) {
            if (this.autoUser[i].tmp) {
              continue;
            } else {
              for (let j = 0; j < this.userList.length; j++) {
                if (this.autoUser[i].userUuid === this.userList[j].uuid) {
                  this.$refs.addLinkDialog.toggleRowSelection(this.userList[j], true);
                  break;
                }
              }
            }
          }
        });
      },
      handleUserListChange(val) {
        this.selectedUser = val;
      }
    },
    created() {
      this.getList();
    }
  }
</script>
