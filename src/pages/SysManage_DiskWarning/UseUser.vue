<template>
    <s-table-page
      :data="userList"
      :header-search="defSearch()"
      @selection-change="handleSelectionChange">
    <s-table-column
      type="selection"
      width="45">
    </s-table-column>
    <s-table-column
      property="userLoginName"
      label="用户名">
    </s-table-column>
    <s-table-column
      property="userRealName"
      label="真实姓名">
    </s-table-column>
    <s-table-column
      property="userMail"
      label="邮箱"
      v-if="mailShow">
    </s-table-column>
    <s-table-column
      property="userCellphone"
      label="手机号码"
      v-if="cellPhoneShow">
      <template slot-scope="scope">
        <span>{{scope.row.userCellphone | capitalize()}}</span>
      </template>
    </s-table-column>
    <s-table-column
      property="userWechat"
      label="微信号"
      v-if="weChatShow">
      <template slot-scope="scope">
        <span>{{scope.row.userWechat | capitalizeWechat()}}</span>
      </template>
    </s-table-column>
  </s-table-page>
</template>

<script type="text/babel">
  import {batchUuid} from 'sunflower-common-utils'
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        userList: [],
        mailShow: false,
        cellPhoneShow: false,
        weChatShow: false,
        multipleSelection: [],
        checkUser: []
      }
    },
    props: {
      showType: {
        type: Number
      }
    },
    filters: {
      capitalize: (value) => {
        if (!value) return ''
        if (value.length > 3) {
          return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
        } else {
          return value
        }
      },
      capitalizeWechat: (value) => {
        if (!value) return ''
        if (value.length > 0) {
          return value.substring(0, 1) + '******'
        } else {
          return value
        }
      }
    },
    methods: {
      // 表头查询
      defSearch() {
        return {
          width: 10,
          placeholder: '请输入用户名、真实姓名查询',
          searchProps: ['userLoginName', 'userRealName']
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        switch (this.showType) {
          case 1: this.checkUser = batchUuid('userMail', this.multipleSelection); break;
          case 2: this.checkUser = batchUuid('userCellphone', this.multipleSelection); break;
          case 3: this.checkUser = batchUuid('userWechat', this.multipleSelection); break;
        }
      },
      getUserList() {
        $axios.post('/iamUserInfo/list', {}).then((res) => {
          if (res.data) {
            this.userList = res.data;
          }
        });
      },
      userShow() {
        switch (this.showType) {
          case 1: this.mailShow = true; break;
          case 2: this.cellPhoneShow = true; break;
          case 3: this.weChatShow = true; break;
        }
      }
    },
    created() {
      this.getUserList()
      this.userShow()
    }
  }
</script>
