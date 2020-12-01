<template>
  <section id="login-page">
    <div class="all_bg" id="can-bg-output">
      <div class="login_wrapper">
        <div class="left_con">
          <div class="logo">
            <img src="/static/images/logo/login-logoname.svg" class="login_logo left_logo"/>
          </div>
          <div class="notice_con">
            <div class="page">
              <div>
                <img src="/static/images/login/login-noticeicon.svg">
                <span class="login-name">公告</span>
              </div>
              <div>
                <div class="page_turn">
                  <a class="page_left" @click.prevent="noticePrev"></a>
                  <a class="page_right" @click.prevent="noticeNext"></a>
                  <span class="page_leftpage">{{ currentNotice }}</span>
                  <span class="page_rightpage">/{{ notices.length }}</span>
                </div>
              </div>
            </div>
            <s-carousel ref="noticeCarousel" class="notice_con_inner" :initial-index="0" :autoplay="false" arrow="never"
                        indicator-position="none" @change="carouselChange">
              <template v-if="notices&&notices.length">
                <s-carousel-item v-for="(notice,index) in notices" :key="index">
                  <s-scrollbar wrap-class="dialogScrollHeight">
                    <p v-if="notice.content">{{ notice.content }}</p>
                    <p v-else style="text-align: center; margin-top: 90px;">暂无公告</p>
                  </s-scrollbar>
                </s-carousel-item>
              </template>
              <template v-else>
                <div class="dialogScrollHeight">
                  <p style="text-align: center; margin-top: 90px;">暂无公告</p>
                </div>
              </template>
            </s-carousel>
          </div>
        </div>
        <div class="right_con">
          <div style="text-align:right;">
            <img src="/static/images/logo/login-logo.svg" class="login_logo right_logo"/>
          </div>
          <s-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" labs-position="left" labs-width="0px"
                  class="demo-ruleForm login-container light-login-form">
            <div style="font-family: PingFang SC;font-size: 22px;">登录</div>
            <input type="password" hidden autocomplete="new-password"/>
            <s-form-item prop="userLoginName" class="inp_group username" style="margin-top: 32px;">
              <label></label>
              <s-input @keyup.enter.native="handleSubmit" id="username" type="text" v-model="ruleForm2.userLoginName"
                       @blur="getLoginType" auto-complete="off" placeholder="账号" autofocus></s-input>
            </s-form-item>
            <s-form-item v-if="securityCode" prop="userPasswd" class="inp_group password">
              <label></label>
              <s-input style="width:45%;" @keyup.enter.native="handleSubmit" id="password" type="password"
                       v-model="ruleForm2.userPasswd" auto-complete="off" :placeholder="pwdName"
                       :readonly="pwdNameReadonly"></s-input>
              <div :style="btnStyle" class="qdcode theme_color_default_font" @click.prevent="sendMsg">
                {{sendMsgBtnContent}}
              </div>
            </s-form-item>
            <s-form-item v-else prop="userPasswd" class="inp_group password">
              <label></label>
              <s-input @keyup.enter.native="handleSubmit" id="password" type="password" v-model="ruleForm2.userPasswd"
                       auto-complete="off" :placeholder="pwdName" :readonly="pwdNameReadonly"></s-input>
            </s-form-item>

            <s-form-item v-if="pwdNameTwoShow" prop="userPasswdTwo" class="inp_group password">
              <label></label>
              <s-input @keyup.enter.native="handleSubmit" id="password" type="password"
                       v-model="ruleForm2.userPasswdTwo" auto-complete="off" :placeholder="pwdNameTwo"
                       :readonly="pwdNameTwoReadonly"></s-input>
            </s-form-item>
            <s-row id="auth-type" style="font-family: PingFang SC;font-size: 14px;line-height: 20px;">
              <img src="/static/images/login/auth.svg" style="position:relative;top:3px;">
              <span style="color:#000;">认证方式：</span>
              <span class="theme_color_default_font">{{loginTypeName}}</span>
            </s-row>
            <s-form-item>
              <s-button class="login_btn" :style="{marginTop:pwdNameTwoShow?'15px':'50px'}"
                        @click.native.prevent="handleSubmit" :disabled="submitBtnFlag" :loading="logining">登 录
              </s-button>
            </s-form-item>
          </s-form>
        </div>
        <div class="clr"></div>
      </div>
      <footer>
        <p v-copyright></p>
        <!-- <p v-copyright="{lang: 'en'}"></p> -->
      </footer>

      <s-dialog title="手机口令牌设置" width="850px" v-model="phoneTokenSetDialog" v-if="phoneTokenSetDialog">
        <phone-token-set :userData="userData" @closePhoneTokenSet="_closePhoneTokenSet">
        </phone-token-set>
      </s-dialog>
      <!--密码过期修改对话框-->
      <change-pwd-dialg v-if="changePwdDialog" v-model="changePwdDialog" :tempObj="tempObj"
                        append-to-body></change-pwd-dialg> <!--密码过期修改对话框-->
    </div>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import phoneTokenSet from './PhoneTokenSet.vue'
  import {base64, sysAdminUserName, loadScript} from 'sunflower-common-utils'
  import {cloneDeep} from 'lodash'
  import changePwdDialg from './changePwdDialog.vue'

  export default {
    name: 'OauthLogin',
    data() {
      let checkUserPasswd = (rule, value, callback) => {
        if (!this.pwdNameReadonly) {
          if (!value) callback(new Error('请输入口令'))
          else callback()
        } else {
          callback()
        }
      }

      let checkUserPasswdTwo = (rule, value, callback) => {
        if (!this.pwdNameTwoReadonly) {
          if (!value) callback(new Error('请输入口令'))
          else callback()
        } else {
          callback()
        }
      }
      return {
        logining: false,
        ruleForm2: {
          userLoginName: '',
          userPasswd: '',
          userPasswdTwo: '',
          loginTypeUuid: '',
          firstLoginTypeUuid: '',
          secondLoginTypeUuid: ''
        },
        loginTypeName: '--',
        rules2: {
          userLoginName: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          userPasswd: [
            {validator: checkUserPasswd, trigger: 'blur'}
          ],
          userPasswdTwo: [
            {validator: checkUserPasswdTwo, trigger: 'blur'}
          ]
        },
        checked: true,
        pwdNameTwoShow: false,
        pwdName: '口令',
        pwdNameTwo: '',
        pwdNameReadonly: false,
        pwdNameTwoReadonly: false,
        notices: [],
        currentNotice: 0,
        phoneTokenSetDialog: false, // 手机口令牌设置弹框
        userData: {},
        securityCode: false,
        cellPhone: '',
        sendDisable: false,
        sendMsgBtnContent: '获取验证码',
        changePwdDialog: false, // 密码过期，修改密码对话框
        tempObj: null,
        submitBtnFlag: false
      };
    },
    components: {
      phoneTokenSet,
      changePwdDialg
    },
    computed: {
      btnStyle() {
        if (this.sendDisable) {
          return 'color:#ff4949;cursor: unset;'
        }
      }
    },
    created() {
      let _self = this
      /* 公告数据 */
      $axios.post('/systemmanager/otherConfig/sysAnnouncement/getOutAnnounce').then(function ({data}) {
        _self.notices = data;
      })
    },
    mounted() {
      /* 加载动态背景 */
      loadScript('../../static/js/login-bg.js', function () {
      })
    },
    methods: {
      sendContent() {
        let vm = this
        for (let i = 0; i <= 60; i++) {
          window.setTimeout(function () {
            vm.sendMsgBtnContent = (60 - i) + '秒后重新发送'
            if (i === 60) {
              vm.sendDisable = false
              vm.sendMsgBtnContent = '再次发送'
            }
          }, i * 1000);
        }
      },
      sendMsg() {
        if (this.sendDisable) {
          return false;
        }
        $axios.get(`/login/sendMessageAuthCode/${this.cellPhone}`).then(res => {
          this.$message({
            message: res.data.error_reason || res.data.success
          })
          this.sendDisable = true
          this.sendContent()
        })
      },
      applyPasswd() {
        $axios.get(`/iamUserInfo/getUserPwdApplicationCode`).then(res => {
          if (res.data) {
            this.$alert(res.data, '申请码', {
              confirmButtonText: '确定'
            });
          } else {
            this.$message({
              message: '获取失败',
              type: 'warning'
            });
          }
        })
      },
      getLoginType() {
        this.ruleForm2.userPasswd = ''
        this.ruleForm2.userPasswdTwo = ''
        if (this.ruleForm2.userLoginName === '') {
          return false
        }
        let params = {'userLoginName': this.ruleForm2.userLoginName};
        if (this.$route.query['app_id']) {
          params['app_id'] = this.$route.query['app_id'];
        }
        // 如果为系统配置管理员，则将默认改为口令认证
        if (this.ruleForm2.userLoginName === sysAdminUserName) {
          this.pwdName = '口令'
          this.pwdNameTwoShow = false
          this.securityCode = false
          this.loginTypeName = '口令认证'
        } else {
          $axios.post('/oauth/getLoginType', params).then(res => {
            if (res.data.status) {
              // 口令input框内提示
              this.pwdName = res.data.input_text;
              this.pwdNameTwoShow = false
              this.securityCode = false
              this.loginTypeName = res.data.loginType;
              this.ruleForm2.loginTypeUuid = res.data.loginTypeUuid;

              // 判断双因素认证
              if (res.data.hasOwnProperty('firstLoginType')) {
                this.pwdNameTwoShow = true
                this.pwdName = res.data.firstLoginType;
                this.pwdNameTwo = res.data.secondLoginType;
                // 双因素认证 禁用设置
                if (res.data.firstLoginTypeUuid === 'tsyslogininit0000000000000000012') {
                  this.pwdNameReadonly = true
                }
                if (res.data.secondLoginTypeUuid === 'tsyslogininit0000000000000000012') {
                  this.pwdNameTwoReadonly = true
                }
                this.ruleForm2.firstLoginTypeUuid = res.data.firstLoginTypeUuid;
                this.ruleForm2.secondLoginTypeUuid = res.data.secondLoginTypeUuid;
              }
              if (res.data.loginTypeUuid === 'tsyslogininit0000000000000000008') {
                this.securityCode = true
                this.cellPhone = res.data.userCellphone
              } else if (res.data.loginTypeUuid === 'tsyslogininit0000000000000000012') {
                // 证书认证 禁用设置
                this.pwdName = res.data.certResult
                this.pwdNameReadonly = true
              } else {
                this.pwdNameReadonly = false
              }
            }
          })
        }
      },
      handleSubmit(ev) {
        let _self = this;
        // 判断是否为系统管理员用户
        if (_self.ruleForm2.userLoginName !== sysAdminUserName) {
          let encrypt = new base64()
          this.$refs.ruleForm2.validate((valid) => {
            if (valid) {
              _self.submitBtnFlag = true;
              const ruleForm2 = _self.ruleForm2
              let loginForm = cloneDeep(ruleForm2)
              if (loginForm.loginTypeUuid === '') {
                _self.$message({
                  type: 'error',
                  message: '认证方式错误，请检查！'
                })
                return
              }
              loginForm.app_id = this.$route.query['app_id'] || '';
              loginForm.target_url = this.$route.query['target_url'] || '';
              loginForm.userPasswd === '' ? loginForm.userPasswd = '' : loginForm.userPasswd = encrypt.encode(loginForm.userPasswd)
              loginForm.userPasswdTwo === '' ? loginForm.userPasswdTwo = '' : loginForm.userPasswdTwo = encrypt.encode(loginForm.userPasswdTwo)
              _self.logining = true
              _self.$store.commit('SET_USERNAME', {userName: loginForm.userLoginName});
              new Promise((resolve, reject) => {
                $axios.post('/oauth/login', loginForm).then(({data}) => {
                  if (data.status === 'false') {
                    reject(data)
                  } else {
                    if (data.picPath) {
                      // 显示手机口令牌设置弹框
                      _self.$store.commit('SET_PHONETOKEN', {phoneTokenData: data});
                      resolve(data)
                    } else {
                      // 重置手机口令牌设置弹框(不显示)
                      _self.$store.commit('SET_PHONETOKEN', {phoneTokenData: null});

                      // 如果用户需要改密
                      if (data.changePwd) {
                        _self.$store.commit('SET_CHANGEPWDFLAG', {changePwdFlag: true});
                        let tempObj = {
                          userName: loginForm.userLoginName,
                          uuid: _self.$store.state.uuid,
                          sessionId: data.roleUuid,
                          authorizationModel: JSON.stringify(data.authorizationModel)
                        };
                        _self.$store.commit('SET_TEMPOBJ', {tempObj: tempObj});
                      }
                      resolve(data)
                    }
                  }
                })
              }).then(function (data) {
                _self.submitBtnFlag = false;
                if (_self.$store.state.phoneTokenData) {
                  _self.userData = data
                  _self.phoneTokenSetDialog = true
                } else {
                  // 需要修改密码
                  if (_self.$store.state.changePwdFlag) {
                    _self.changePwdDialog = true;
                    _self.tempObj = _self.$store.state.tempObj;
                  } else {
                    if (data.redirect && data.redirect !== '') {
                      window.location.href = data.redirect;
                    }
                  }
                }
              }).catch(function (data) {
                _self.submitBtnFlag = false;
                if (data.hasOwnProperty('jinproxy')) {
                  $axios.post('/login/restartJniproxy').then(res => {
                    console.log(res)
                  })
                }
                _self.$message({
                  message: data.error_reason,
                  type: 'error'
                });
              })
            } else {
              _self.$message({
                type: 'warning',
                message: '请完善登录信息！'
              })
              return false;
            }
          });
        } else {
          this.handleSysSubmit();
        }
      },
      handleSysSubmit() {
        let _self = this
        let encrypt = new base64()
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            _self.submitBtnFlag = true;
            const ruleForm2 = _self.ruleForm2
            let loginForm = cloneDeep(ruleForm2)
            loginForm.userPasswd === '' ? loginForm.userPasswd = '' : loginForm.userPasswd = encrypt.encode(loginForm.userPasswd)
            loginForm.userPasswdTwo === '' ? loginForm.userPasswdTwo = '' : loginForm.userPasswdTwo = encrypt.encode(loginForm.userPasswdTwo)
            _self.logining = true;
            _self.$store.dispatch('sysLogin', loginForm).then(function (data) {
              _self.submitBtnFlag = false;
              if (data.result) {
                _self.$router.push('/');
              } else {
                _self.$message({
                  message: data.errormsg,
                  type: 'error'
                });
              }
            }).catch(function (data) {
              _self.submitBtnFlag = false;
              _self.$message({
                message: data.errormsg,
                type: 'error'
              });
            })
          } else {
            _self.$message({
              type: 'warning',
              message: '请完善登录信息！'
            })
            return false;
          }
        });
      },
      noticePrev() {
        this.$refs.noticeCarousel.prev()
      },
      noticeNext() {
        this.$refs.noticeCarousel.next()
      },
      carouselChange(index) {
        if (this.notices.length > 0) {
          this.currentNotice = index + 1
        }
      },
      // 手机口令牌设置成功
      _closePhoneTokenSet(data) {
        if (data.reGet) {
          this.getLoginType()
        } else {
          this.pwdName = '手机口令'
          this.ruleForm2.userPasswd = ''
          this.phoneTokenSetDialog = false
        }
      }
    }
  }
</script>
