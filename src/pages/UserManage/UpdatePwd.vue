<template>
  <s-form :label-position="labelPosition"
          :rules="rules"
          ref="updatePwd"
          label-width="110px"
          :model="map">
    <s-form-item label="当前密码：" prop="oldPassword">
      <s-input type="password" v-model="map.oldPassword"></s-input>
    </s-form-item>
    <s-form-item label="新密码：" prop="newPassword">
      <s-input type="password" v-model="map.newPassword"></s-input>
    </s-form-item>
    <s-form-item label="确认密码：" prop="cfmNewPassword">
      <s-input type="password" v-model="map.cfmNewPassword"></s-input>
    </s-form-item>
    <s-form-item>
      <s-button @click="submitForm">保存</s-button>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
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
        labelPosition: 'left',
        map: {
          oldPassword: '',
          newPassword: '',
          userUuid: this.Uuid
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
      Uuid: {
        type: String,
        default: ''
      }
    },
    methods: {
      submitForm() {
        this.$refs['updatePwd'].validate((valid) => {
          if (valid) {
            $axios.post('iamUserInfo/updateUserPassword', this.map).then((res) => {
              let resData = res.data
              if (res.data.hasOwnProperty('success')) {
                this.$message({
                  type: 'success',
                  message: res.data.success
                })
                this.$emit('closeUpdate')
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
    created () {
      this.$on('submitForm', this.submitForm)
    }
  }
</script>
