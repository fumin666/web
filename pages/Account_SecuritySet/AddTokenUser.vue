<template>
  <section id="addTokenUser">
    <s-scrollbar wrap-class="default-dialog-scroll">
      <s-form :inline="true">
        <s-form-item label="请输入用户名">
          <s-input v-model="searchKeyWord"></s-input>
          <s-input style="display:none"></s-input>
        </s-form-item>
        <s-form-item>
          <s-button @click="searchTokenUser">查询</s-button>
        </s-form-item>
      </s-form>
      <s-table-page
        id="addTokenUserTable"
        :data="allTokenUserList">
        <s-table-column
          label="单选"
          width="70"
          style="vertical-align: middle">
          <template slot-scope="scope">
            <s-radio
              v-model="addTokenUserPostData.userUuid"
              :label="scope.row.uuid"
              name="tokenUser">&nbsp;</s-radio>
          </template>
        </s-table-column>
        <s-table-column
          label="用户名"
          show-overflow-tooltip
          prop="userLoginName">
        </s-table-column>
        <s-table-column
          label="真实姓名"
          show-overflow-tooltip
          prop="userRealName">
        </s-table-column>
        <s-table-column
          label="Email"
          show-overflow-tooltip
          prop="userMail">
        </s-table-column>
        <s-table-column
          label="手机号"
          show-overflow-tooltip
          prop="userCellphone">
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
    <s-row class="footerRow dialog-footer" style="margin-top: 10px">
      <s-button @click="addTokenUser">确定</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'

  export default{
    data() {
      return {
        allTokenUserListOrigin: [],       // 令牌注册-用户列表(查询使用)
        allTokenUserList: [],             // 令牌注册-用户列表
        searchKeyWord: '',                // 令牌注册-表格查询关键字
        addTokenUserPostData: {           // 令牌注册上传数据
          dymanicUuid: '',
          userUuid: ''
        }
      }
    },
    props: {
      tokenUuid: {
        type: String,
        required: true
      }
    },
    methods: {
      // 令牌注册-获取所有未绑定的用户
      initDynAllTokenUser() {
        $axios.get('/systemmanager/sysInteriorTokenList/getAllUnbindedUserList').then(res => {
          let resData = res.data
          if (resData && resData instanceof Array) {
            this.allTokenUserList = resData
            this.allTokenUserListOrigin = resData
          }
        })
      },
      // 令牌注册-表格查询
      searchTokenUser() {
        let searchReg = new RegExp(this.searchKeyWord)
        let tokenUserArr = []
        this.allTokenUserListOrigin.forEach(item => {
          if (searchReg.test(item.userLoginName)) {
            tokenUserArr.push(item)
          }
        })
        this.allTokenUserList = tokenUserArr
      },
      // 令牌注册-注册人员
      addTokenUser() {
        if (this.addTokenUserPostData.userUuid) {
          $axios.post('/systemmanager/sysInteriorTokenList/processChoiceUser', this.addTokenUserPostData, {
            data: [{tokenUuid: this.tokenUuid}],
            logTemplate: '注册|登录认证配置>动态口令牌>令牌(#tokenUuid#)'
          }).then(res => {
            if (res.data === 'success') {
              this.$message({
                type: 'success',
                message: '令牌注册成功！'
              })
              Bus.$emit('addTokenUserSuccess')
            } else {
              this.$message({
                type: 'error',
                message: '令牌注册失败，请重试！'
              })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请选择用户！'
          })
        }
      }
    },
    created() {
      this.initDynAllTokenUser()
      this.addTokenUserPostData.dymanicUuid = this.tokenUuid
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #addTokenUser
    .footerRow
        text-align right
</style>
