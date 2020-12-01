<template>
  <section id="AccountChangePwd">
    <s-row class="title">
      <i class="iconfont icon-set"></i>
      <span>账号改密</span>
    </s-row>
    <s-form
      ref="changePwdForm"
      :model="changePwdForm"
      :rules="changePwdFormRules"
      label-width="100px">
      <s-form-item label="口令：" prop="accountPasswd">
        <s-input type="password" v-model="changePwdForm.accountPasswd" :minlength="8"></s-input>
      </s-form-item>
      <s-form-item label="口令确认：" prop="oldPassword">
        <s-input type="password" v-model="changePwdForm.oldPassword" :minlength="8"></s-input>
      </s-form-item>
      <!--<s-form-item label="模式：">
        <s-select v-model="changePwdForm.accountType">
          <s-option label="普通改密" value="1"></s-option>
          <s-option label="重设改密" value="2"></s-option>
        </s-select>
      </s-form-item>-->
      <s-form-item label="辅助账号：">
        <s-select v-model="changePwdForm.additionalAccountUuid">
          <s-option
            v-for="item in assistList"
            :label="item.name"
            :key="item.value"
            :value="item.value">
          </s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="提示：">
        <p>1.Window资产需检查RPC协议是否开通；</p>
        <p>2.Linux/Unix资产需检查SSH协议或Telnet协议是否开通；</p>
        <p>3.网络资产改密时需要添加提权账号和普通账号，才能对普通账号进行改密；</p>
        <p>4.所有资产需检查账号是否有登录和改密权限；</p>
        <p>5.辅助账号:Linux/Unix/Aix类型，用于辅助登录，其他类型用于提权操作；</p>
        <!--<p>5.重设改密不支持Windows资产；</p>-->
      </s-form-item>
    </s-form>

    <s-row class="footerRow" style="width:100%;">
      <s-button @click="saveAccountChangePwd">保存</s-button>
      <s-button type="cancel" @click="cancelAccountChangePwd">取消</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import { encryptPwd } from 'sunflower-common-utils'

  export default{
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        } else {
          if (this.changePwdForm.oldPassword !== '') {
            this.$refs.changePwdForm.validateField('oldPassword');
          }
          callback();
        }
      }
      let validatePassCom = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入口令'));
        } else if (value !== this.changePwdForm.accountPasswd) {
          callback(new Error('两次输入口令不一致'));
        } else {
          callback();
        }
      }
      return {
        changePwdForm: {
          accountPasswd: '',
          oldPassword: '',
          accountType: '1',
          uuid: this.account.uuid,
          additionalAccountUuid: ''
        },
        changePwdFormRules: {
          accountPasswd: [{
            validator: validatePass, trigger: 'blur'}, {
            min: 8, message: '长度不能少于8个字符', trigger: 'blur'
          }],
          oldPassword: [{
            validator: validatePassCom, trigger: 'blur'}, {
            min: 8, message: '长度不能少于8个字符', trigger: 'blur'
          }]
        },
        assistList: []
      }
    },
    props: {
      account: {
        type: Object,
        required: true
      }
    },
    methods: {
      // 改密请求
      changePwdPost() {
        let waitingMsg = this.$message({
          type: 'info',
          duration: 0,
          showClose: true,
          message: '执行中，请稍候...'
        })
        // 改密密码 base64 加密
        let base64Pwd = {
          accountPasswd: encryptPwd(this.changePwdForm.accountPasswd),
          oldPassword: encryptPwd(this.changePwdForm.oldPassword)
        }
        let postData = Object.assign({}, this.changePwdForm, base64Pwd)
        $axios.post('tPasswdChangeTask/handleChgPassword', postData).then(({data}) => {
          if (data && data.state) {
            waitingMsg.close()
            this.$emit('closeActChgPwdDialog')
            this.$nextTick(() => {
              this.$message({
                type: 'success',
                message: data.errormsg
              })
            })
          } else {
            waitingMsg.close()
            this.$nextTick(() => {
              this.$message({
                type: 'error',
                message: data.errormsg
              })
            })
          }
        })
      },
      // 保存
      saveAccountChangePwd() {
        this.$refs['changePwdForm'].validate(valid => {
          if (valid) {
            if (this.changePwdForm.accountType === '2') {
              $axios.get(`/tPasswdChangeTask/checkSuperAccount/${this.account.assetsUuid}`, {
                data: [{'资产名称': this.account.assetName, '账号名称': this.account.accountName}],
                logTemplate: '账号改密|资产账号改密>资产(#资产名称#)>账号(#账号名称#)'
              }).then(res => {
                if (res.data === true) {
                  this.changePwdPost()
                } else {
                  this.$nextTick(() => {
                    this.$message({
                      type: 'warning',
                      message: '不能进行重设改密！'
                    })
                  })
                }
              })
            } else {
              this.changePwdPost()
            }
          } else {
            return false
          }
        })
      },
      // 取消
      cancelAccountChangePwd() {
        this.$emit('closeActChgPwdDialog')
      }
    },
    created() {
      $axios.get(`assetsAccountInfo/getAdditionalAccountList/${this.account.assetsUuid}`).then(res => {
        this.assistList = res.data || []
      })
    }
  }
</script>
