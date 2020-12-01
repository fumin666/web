<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:配置向导-授权管理员
 * @Date: 2020-01-19 10:09:14
 * @LastEditors: mybells
 -->
<template>
  <div class="auth_admin">
    <s-form :rules="rules" ref="authAdmin" label-width="110px" :model="map">
      <s-form-item class="admin" label="管理员账号：" prop="userLoginName">
        <s-input v-model="map.userLoginName" @blur="saveStore"></s-input>
      </s-form-item>
      <s-form-item label="密码：" prop="passwd">
        <s-input type="password" v-model="map.passwd" @blur="saveStore"></s-input>
      </s-form-item>
      <s-form-item label="确认密码：" prop="rePasswd">
        <s-input type="password" v-model="map.rePasswd" @blur="saveStore"></s-input>
      </s-form-item>
    </s-form>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      let checkSame = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码！'))
        } else {
          if (value !== this.map.passwd) {
            callback(new Error('两次密码不一致！'))
          } else {
            callback()
          }
        }
      }
      return {
        map: {
          userLoginName: '',
          rePasswd: '',
          passwd: ''
        },
        rules: {
          userLoginName: [
            Validaters.NotNull,
            Validaters.Max(30),
            {
              pattern: /^[a-zA-Z0-9_\-\.$][a-zA-Z0-9_\-\.@\\$]{0,29}$/,
              message: '只能由字母、数字、符号[_-.@\\$]构成,不能以[@,\\]开头',
              trigger: 'blur'
            }
          ],
          passwd: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
          rePasswd: [
            {required: true, validator: checkSame, trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      if (this.step4) {
        this.map = Object.assign({}, this.step4);
      }
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
      step4: {
        get() {
          return this.$store.state.configGuide.step4;
        },
        set(val) {
          this.$store.commit('configGuide/SET_STEP4', val);
        }
      }
    },
    methods: {
      saveStore() {
        this.step4 = this.map;
      },
      submitForm() {
        this.$refs['authAdmin'].validate((valid) => {
          if (valid) {
            $axios.post('/firstUsageWizard/addAuthorizedAdmin', this.map).then((res) => {
              if (res.data.state) {
                this.$store.commit('configGuide/SET_ISCOMPLETE', true);
                this.step4 = this.map;
                let timer = setInterval(() => {
                  let n = document.querySelector('#authadmin_time').innerHTML - 1;
                  document.querySelector('#authadmin_time').innerHTML = n;
                  if (n === 0) {
                    clearInterval(timer);
                    this.logout()
                  }
                }, 1000);
                this.$msgbox({
                  title: '',
                  customClass: 'authadmin_msgbox',
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  dangerouslyUseHTMLString: true,
                  message: `<div style="text-align:center;"><img src="/static/images/login/complete.svg""><p>恭喜您！您已完成配置，现在可以去使用产品了。</p><p><span id="authadmin_time" class="theme_color_default_font">5</span>秒后跳转</p></div>`,
                  showCancelButton: false,
                  confirmButtonText: '立即体验'
                }).then(action => {
                  this.logout()
                });
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
      },
      logout () {
        let theme = localStorage.getItem('theme')
        localStorage.clear()
        if (theme !== null) {
          localStorage.setItem('theme', theme)
        }
        location.reload(location.origin + '/#/login')
      }
    }
  }
</script>

<style lang="stylus">
.auth_admin{
  .word{
    margin:20px 0 30px 0;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
  padding-right:40px;
}
.authadmin_msgbox{
  .s-message-box-header{
    height:0;
  }
  .s-message-box-content{
    padding:30px 45px 15px 45px;
  }
  .s-message-box-btns {
    border-top: 0;
    background:none;
    padding: 0 30px 20px 30px;
  }
}
</style>
