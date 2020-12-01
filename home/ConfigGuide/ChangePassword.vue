<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:配置向导-更改密码
 * @Date: 2020-01-19 10:09:14
 * @LastEditors: mybells
 -->
<template>
  <div class="change_password">
    <p class="font_color word">为安全起见，首次使用请更改密码</p>
    <s-form :rules="rules" ref="changePwd" label-width="110px" :model="map">
      <s-form-item class="admin" label="当前账号：" prop="admin">
        <s-input type="text" v-model="admin" :disabled="true"></s-input>
      </s-form-item>
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
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import { superAdminName } from 'sunflower-common-utils'
  export default {
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
        admin: 'superadmin',
        map: {
          oldPassword: '',
          newPassword: '',
          cfmNewPassword: ''
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
    created() {
      this.admin = superAdminName
    },
    computed: {
      activeStep: {
        get() {
          return this.$store.state.configGuide.activeStep;
        },
        set(val) {
          this.$store.commit('configGuide/SET_ACTIVESTEP', val);
        }
      },
      step1: {
        get() {
          return this.$store.state.configGuide.step1;
        },
        set(val) {
          this.$store.commit('configGuide/SET_STEP1', val);
        }
      }
    },
    methods: {
      submitForm() {
        this.$refs['changePwd'].validate((valid) => {
          if (valid) {
            $axios.post('/firstUsageWizard/changeUserPasswd', this.map).then((res) => {
              if (res.data.state) {
                this.step1 = this.map;
                this.activeStep++;
              } else {
                 this.$message({
                    type: 'warning',
                    message: res.data.errormsg
                  })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请按要求填写信息！'
            })
          }
        });
      }
    }
  }
</script>

<style lang="stylus">
.change_password{
  .word{
    margin:20px 0 30px 0;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
  padding-right:40px;
  .admin{
    .s-form-item-label{
      padding-left: 10px;
    }
  }
}
</style>
