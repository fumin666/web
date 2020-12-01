<template>
  <div id="loginPropSet" class="tabbox">
    <s-row class="title">
      <i class="iconfont icon-set"></i>
      <span>字符登录密码设置</span>
    </s-row>
    <s-form ref="loginPropSetForm"
            :model="loginPropSetForm"
            :rules="loginPropSetFormRules"
            label-width="120px">
      <s-form-item label="用户名：">
        <span>op</span>
      </s-form-item>
      <s-form-item label="当前密码：" prop="oldPassword">
        <s-input type="password" v-model="loginPropSetForm.oldPassword"></s-input>
      </s-form-item>
      <s-form-item label="新密码：" prop="newPassword">
        <s-input type="password" v-model="loginPropSetForm.newPassword"></s-input>
      </s-form-item>
      <s-form-item label="确认密码：" prop="cfmNewPassword">
        <s-input type="password" v-model="loginPropSetForm.cfmNewPassword"></s-input>
      </s-form-item>
    </s-form>
    <s-row class="footerRow">
      <s-button @click="submitForm">保存</s-button>
    </s-row>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  // import {base64} from 'sunflower-common-utils';
  // import {mapGetters} from 'vuex'

  export default {
    name: 'loginPropertySet',
    data() {
      let checkSame = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码'))
        } else {
          if (value !== this.loginPropSetForm.newPassword) {
            callback(new Error('两次密码不一致'))
          } else {
            callback()
          }
        }
      }
      return {
        loginPropSetForm: {
          oldPassword: '',
          newPassword: '',
          cfmNewPassword: ''
        },
        loginPropSetFormRules: {
          oldPassword: [
            {required: true, message: '请输入当前密码', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
          cfmNewPassword: [
            {required: true, validator: checkSame, trigger: 'blur'}
          ]
        }
      }
    },
    /* computed: {
      ...mapGetters(['userName'])
    }, */
    methods: {
      // 验证新旧密码是否相同
      validateNewOldPwd(oldPwd) {
        // let encrypt = new base64();
        let validData = {
          oldPwd: oldPwd
        }
        return new Promise((resolve, reject) => {
          $axios.post('/sysLoginType/loginPropertyValidate', validData).then(({data}) => {
            resolve(data);
          })
        })
      },
      // 提交保存表单数据
      submitForm() {
        this.$refs['loginPropSetForm'].validate((valid) => {
          if (valid) {
            let sendData = {
              oldPwd: this.loginPropSetForm.oldPassword,
              newPwd: this.loginPropSetForm.newPassword
            }
            this.validateNewOldPwd(sendData.oldPwd).then((data) => {
              if (data === true) {
                if (sendData.oldPwd === sendData.newPwd) {
                  this.$message.warning('新密码不能与当前密码相同！')
                } else {
                  $axios.post('/sysLoginType/setlLoginProperty', sendData, {
                    data: [],
                    logTemplate: '设置|登录属性设置>编辑密码'
                  }).then((res) => {
                    let resData = res.data
                    if (parseInt(resData) >= 0) {
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
                }
              } else {
                this.$message.warning('当前密码有误！')
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #loginPropSet
    .footerRow
      text-align right
</style>
