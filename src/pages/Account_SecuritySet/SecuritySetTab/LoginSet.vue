<template>
  <section class="login-set">
    <div class="tabbox">
      <s-row class="title">
        <i class="iconfont icon-approve"></i>
        <span>认证方式设置</span>
      </s-row>
      <s-row>
        <s-col span="4">认证方式设置:</s-col>
        <s-col span="20">
          <s-select v-model="approveType">
            <s-option v-for="list in loginTypeList"
                      :value="list.uuid"
                      :key="list.uuid"
                      :label="list.loginType">
            </s-option>
          </s-select>
          <span class="tip" v-text="showTipTxt"></span>
        </s-col>
      </s-row>
      <s-row type="flex" style="margin-left: 16.5%;margin-bottom: 20px;">
        <s-button class="rightBtn" @click="saveLoginType">保存</s-button>
      </s-row>
    </div>
    <div class="tabbox">
      <s-row class="title">
        <i class="iconfont icon-approve"></i>
        <span>双因素认证属性</span>
      </s-row>
      <s-row>
        <s-col span="4">认证方式1:</s-col>
        <s-col span="20">
          <s-select v-model="approveType1">
            <s-option v-for="i in doubleLoginType1"
                      :value="i.uuid"
                      :key="i.uuid"
                      :label="i.loginType">
            </s-option>
          </s-select>
          <span class="tip" v-text="showTipTxt1"></span>
        </s-col>
      </s-row>
      <s-row>
        <s-col span="4">认证方式2:</s-col>
        <s-col span="20">
          <s-select v-model="approveType2">
            <s-option v-for="list in doubleLoginType2"
                      :value="list.uuid"
                      :key="list.uuid"
                      :label="list.loginType">
            </s-option>
          </s-select>
          <span class="tip" v-text="showTipTxt2"></span>
        </s-col>
      </s-row>
      <s-row type="flex" style="margin-left: 16.5%;">
        <s-button class="rightBtn" @click="saveDoubleLoginType">保存</s-button>
      </s-row>
    </div>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default{
    data () {
      return {
        approveType: '',
        approveType1: '',
        approveType2: '',
        phoneTokenUuid: '',
        certificateUuid: '',
        mixApproveUuid: '',
        loginTypeList: [],
        doubleLoginType: [],
        doubleLoginType1: [],
        doubleLoginType2: []
      }
    },
    props: [],
    watch: {
      approveType1(val) {
        this.doubleLoginType2 = [];
        this.doubleLoginType.forEach((item) => {
          if (item.uuid !== val) this.doubleLoginType2.push(item);
        });
      },
      approveType2(val) {
        this.doubleLoginType1 = [];
        this.doubleLoginType.forEach((item) => {
          if (item.uuid !== val) this.doubleLoginType1.push(item);
        })
      }
    },
    computed: {
      showTipTxt() {
        if (this.approveType === this.phoneTokenUuid) {
          return '请确保所有用户已绑定手机口令牌，否则将无法登录'
        } else if (this.approveType === this.certificateUuid) {
          return '请确保系统已配置CA证书，否则将无法登录'
        } else return ''
      },
      showTipTxt1() {
        if (this.approveType1 === this.phoneTokenUuid) {
          return '请确保所有用户已绑定手机口令牌，否则将无法登录'
        } else if (this.approveType1 === this.certificateUuid) {
          if (this.approveType === this.mixApproveUuid) {
            // this.postRequestFlag = false
            return '混合认证中，不允许使用数字证书'
          } else return '请确保系统已配置CA证书，否则将无法登录'
        } else return ''
      },
      showTipTxt2() {
        if (this.approveType2 === this.phoneTokenUuid) {
          return '请确保所有用户已绑定手机口令牌，否则将无法登录'
        } else if (this.approveType2 === this.certificateUuid) {
          if (this.approveType === this.mixApproveUuid) {
            // this.postRequestFlag = false
            return '混合认证中，不允许使用数字证书'
          } else return '请确保系统已配置CA证书，否则将无法登录'
        } else return ''
      },
      postRequestFlag() {
        return !(this.approveType === this.mixApproveUuid && (this.approveType1 === this.certificateUuid || this.approveType2 === this.certificateUuid));
      }
    },
    methods: {
      getDoubleLoginType() {
        // 获取双因素认证方式
        $axios.post('/sysLoginType/getDoubleLoginType').then((res) => {
          let resDoubleLoginType = res.data
          this.loginTypeList = resDoubleLoginType.SysLoginTypeList
          if (this.loginTypeList && this.loginTypeList instanceof Array) {
            this.loginTypeList.forEach(item => {
              if (item.status === 1) {
                this.approveType = item.uuid
              }
              if (item.loginType !== '双因素认证' && item.loginType !== '混合认证') {
                this.doubleLoginType.push(item)
                this.doubleLoginType1.push(item)
                this.doubleLoginType2.push(item)
              }
              // 获取'手机口令牌认证'uuid，显示tip时使用
              if (item.loginType === '手机口令牌认证') {
                this.phoneTokenUuid = item.uuid
              }
              if (item.loginType === '证书认证') {
                this.certificateUuid = item.uuid
              }
              if (item.loginType === '混合认证') {
                this.mixApproveUuid = item.uuid
              }
            })
          }
          if (resDoubleLoginType.SysDoubleType !== null) {
            this.approveType1 = resDoubleLoginType.SysDoubleType.firstUuid
            this.approveType2 = resDoubleLoginType.SysDoubleType.secondUuid
          }
        })
      },
      // 保存‘认证方式设置’
      saveLoginType() {
        if (this.postRequestFlag === true) {
          $axios.post('/sysLoginType/saveLoginType', {'uuid': this.approveType}, {
            data: [],
            logTemplate: '设置|登录认证设置>认证方式设置'
          }).then((res) => {
            let resData = res.data
            if (resData === 'success') {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
            } else {
              this.$message({
                type: 'error',
                message: '保存失败，请重试！'
              })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请按要求设置认证方式！'
          })
        }
      },
      // 保存‘双因素认证’设置
      saveDoubleLoginType() {
        if (this.postRequestFlag === true) {
          $axios.get('/sysLoginType/saveDoubleLoginType/' + this.approveType1 + '/' + this.approveType2, {
            data: [],
            logTemplate: '设置|登录认证设置>双因素认证属性'
          }).then((res) => {
            let resData = res.data
            if (resData === 'success') {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
            } else {
              this.$message({
                type: 'error',
                message: '保存失败，请重试！'
              })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请按要求设置认证方式！'
          })
        }
      }
    },
    mounted() {
      this.getDoubleLoginType()
    }
  }
</script>

