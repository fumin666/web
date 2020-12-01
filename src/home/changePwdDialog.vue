/**
* Created by dgunzi on 2019/02/18.
*/
<template>
  <s-dialog
    title="密码已过期，请修改您的密码"
    width="650px"
    v-model="dialogFlag"
    v-if="dialogFlag">
    <s-form :label-position="labelPosition"
            :rules="rules"
            ref="updatePwd"
            label-width="110px"
            :model="map" id="login-changepwd-form">
      <s-form-item label="当前密码：" prop="oldPassword">
        <s-input type="password" v-model="map.oldPassword"></s-input>
      </s-form-item>
      <s-form-item label="新密码：" prop="newPassword">
        <s-input type="password" v-model="map.newPassword"></s-input>
      </s-form-item>
      <s-form-item label="确认密码：" prop="cfmNewPassword">
        <s-input type="password" v-model="map.cfmNewPassword"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer">
      <s-button @click="submitForm">确定</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    name: 'UpdatePwd',
    data() {
      let checkSame = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码！'))
        } else {
          if (value !== this.map.newPassword) {
            callback(new Error('两次密码不一致！'))
          } else {
            callback()
          }
        }
      }
      return {
        dialogFlag: false,
        labelPosition: 'left',
        map: {
          oldPassword: '',
          newPassword: ''
        },
        rules: {
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
    props: {
      value: {
        type: Boolean,
        default: false
      },
      tempObj: {
        type: Object,
        default: {}
      }
    },
    methods: {
      submitForm() {
        this.$refs['updatePwd'].validate((valid) => {
          if (valid) {
            $axios.post('/iamUserInfo/forceChangeUserPassword', this.map).then((res) => {
              let resData = res.data
              if (res.data.hasOwnProperty('success')) {
                this.$message({
                  type: 'success',
                  message: res.data.success
                })
                // 修改成功后，完成所有设置，并跳转
                localStorage.setItem('userName', this.tempObj.userName)
                localStorage.setItem('authorizationModel', this.tempObj.authorizationModel)
                this.$router.push('/');
              } else if (resData.errorReason) {
                this.$message({
                  type: 'error',
                  message: resData.errorReason
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '密码修改失败，请重试！'
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请按要求填写信息！'
            })
            return false;
          }
        });
      },
      resetForm() {
        this.$refs['updatePwd'].resetFields()
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

<style>
  #login-changepwd-form{
    margin-left: 70px;
  }
</style>
