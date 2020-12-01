<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:首页导航
 * @Date: 2019-12-30 11:20:41
 * @LastEditors: mybells
 -->

<template>
  <header id="headBar" class="noPrint">
    <s-row type="flex" justify="between" align="middle" class="header-bg">
      <s-col :span="8" class="left-info">
        <div class="logo-icon" :title="systemName" @click="goHome">
          <img src="static/images/logo/logo.svg"/>
        </div>
      </s-col>
      <s-col :span="8" class="right-info">
        <s-row type="flex" justify="center" align="middle" :gutter="16">
          <s-col class="user-info" v-if="showAction">
            <i class="iconfont icon-layout-custom"></i>
          </s-col>
          <s-col class="user-info" style="padding-left: 0" @click.native="goDiy" v-if="showAction">{{diyText}}</s-col>
          <s-col class="user-info">
            <s-popover
              ref="popover"
              placement="bottom"
              width="50">
              <s-row>
                <s-col @click.native="setTheme('fanta')" class="selectBlock top" style="background:#FF9023">
                  <i v-if="fantaShow" class="icon iconfont icon-correct-bold"></i>
                </s-col>
                <s-col @click.native="setTheme('chalk')" class="selectBlock top" style="background:#2296FF">
                  <i v-if="chalkShow" class="icon iconfont icon-correct-bold"></i>
                </s-col>
                <s-col @click.native="setTheme('tea')" class="selectBlock top" style="background:#0ABA80">
                  <i v-if="teaShow" class="icon iconfont icon-correct-bold"></i>
                </s-col>
                <s-col @click.native="setTheme('dark')" class="selectBlock top" style="background:#12171d">
                  <i v-if="darkShow" class="icon iconfont icon-correct-bold"></i>
                </s-col>
              </s-row>
            </s-popover>
            <s-col v-popover:popover>
              主题 <i class="icon iconfont icon-bottom icon-theme" :style="themeColor"></i>
            </s-col>
          </s-col>
          <s-col class="user-info" style="padding-left: 0" @click.native="goConfigGuide" v-if="showConfigGuide">配置向导 <div v-if="configNum>0" style="display:inline-block;margin-left: 5px;width:18px;height:18px;text-align:center;border-radius:18px;background:red;line-height:18px;"><span style="position:relative;left:-0.5px;">{{configNum}}</span></div></s-col>
          <s-col style="padding-left: 0">
            <div class="separate-line"></div>
          </s-col>
          <s-col class="user-info">
            <s-dropdown trigger="hover">
              <img :src="imageUrl" class="avatar">
              <div style="margin-left: 35px">
                {{userName}}
                <span class="down-img"></span>
              </div>
              <s-dropdown-menu slot="list">
                <s-dropdown-item @click.native="showDialog" v-if="showAction" class="per-item">
                  <i class="iconfont icon-user" title="个人信息"></i>
                  <span>个人信息</span>
                </s-dropdown-item>
                <s-dropdown-item @click.native="logoutAction" class="per-item">
                  <i class="iconfont icon-quit-s" title="退出登录"></i>
                  <span>退出登录</span>
                </s-dropdown-item>
              </s-dropdown-menu>
            </s-dropdown>
          </s-col>
        </s-row>
      </s-col>
    </s-row>
    <div class="head-line" :style="themeColor" v-if=" themeColor !== 'background-color: #12171d'"></div>
    <div class="head-line" v-else style="background-color: rgb(25,145,199)"></div>
    <s-dialog
      v-model="userInfoModal"
      v-if="userInfoModal"
      title="用户信息"
      top="55px"
      width="750px"
      ref="infoDialog">
      <s-scrollbar wrap-class="scrollheight">
        <s-tab v-model="activeTab" ref="infoTabs">
          <s-tab-pane label="个人信息" name="个人信息">
            <user-info :data="userInfoArr" v-if="activeTab === '个人信息'"></user-info>
          </s-tab-pane>
          <s-tab-pane :vif="isShow" label="修改密码" name="修改密码">
            <update-pwd ref="updatePwd" v-if="activeTab === '修改密码'" :Uuid="userInfoArr.uuid" @closeUpdate="closeUpdate"></update-pwd>
          </s-tab-pane>
          <s-tab-pane label="修改个人信息" name="修改个人信息">
            <update-info ref="updateInfo" v-if="activeTab === '修改个人信息'" :data="userInfoArr" @closeUpdate="closeUpdate"></update-info>
          </s-tab-pane>
        </s-tab>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer" v-if="isShowBtn">
        <s-button @click="changeUserInfo">确定</s-button>
        <s-button type="cancel" @click="closeUpdate">取消</s-button>
      </template>
    </s-dialog>
  </header>
</template>

<script type="text/babel">
  import UpdateInfo from '@/pages/UserManage/UpdateInfo'
  import UserInfo from '@/pages/UserManage/UserInfo'
  import UpdatePwd from '@/pages/UserManage/UpdatePwd'
  import $axios from 'sunflower-ajax'
  import {mapGetters} from 'vuex'
  import roleCheckMixin from '@/common/mixins/roleCheckMixin.js'
  import {sysAdminUserName, getConfig} from 'sunflower-common-utils'
  import Bus from '@/plugins/eventBus';
  const photoUrl = 'static/images/system/UserPhoto.png'

  export default {
    name: 'HeaderBar',
    components: {
      UpdateInfo,
      UserInfo,
      UpdatePwd
    },
    mixins: [roleCheckMixin],
    data () {
      return {
        showConfigGuide: false,
        imageUrl: photoUrl,
        activeTab: '个人信息',
        isShowBtn: false,
        userInfoArr: [],
        userInfoModal: false,
        isShow: false,
        darkShow: false,
        chalkShow: false,
        teaShow: false,
        fantaShow: false,
        showAction: true,
        systemName: getConfig('systemName'),
        themeColor: ''
      }
    },
    watch: {
      activeTab: {
        immediate: true,
        handler(val) {
          if (val === '修改个人信息') {
            this.isShowBtn = true
          } else {
            this.isShowBtn = false
          }
        }
      }
    },
    computed: {
      ...mapGetters(['userName', 'menu']),
      diyText() {
        return this.$route.path === '/diy' ? '返回默认首页' : '自定义首页'
      },
      configNum() {
        return this.menu.reduce((mon, val, i) => { return mon + val.sub }, 0)
      }
    },
    created() {
      // 系统管理员显示配置向导
      // 系统管理员显示配置向导未完成数量标记
      if (this.isSystemAdmin) {
        this.showConfigGuide = true;
        $axios.get(`/firstUsageWizard/getConfigurationWizardMarks`).then((res) => { // Q1UE问题优化
          this.$store.commit('SET_MENU', res.data);
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        let mainTheme = localStorage.getItem('theme') || 'fanta'
        this.getNowTheme(mainTheme)
      })
      // 判断是否为系统配置用户
      if (this.userName === sysAdminUserName) {
        this.showAction = false;
      } else {
        this.getInfoData();
      }
    },
    methods: {
      goConfigGuide() {
        this.$router.push('/ConfigPage')
      },
      getInfoData () { // 获取用户信息
        $axios.post(`/iamUserInfo/getUserInfoDetail`, {
          name: this.userName
        }).then((res) => {
          this.imageUrl = res.data.userPhotopath || photoUrl
        })
      },
      goDiy() {
        let path = this.$route.path;
        if (path === '/diy') {
          this.$router.push('/HomePage');
        } else {
          this.$router.push('/diy');
        }
      },
      closeUpdate() {
        this.activeTab = '个人信息'
        this.userInfoModal = false
      },
      showDialog () {
        // 判断是否为系统配置用户
        if (this.userName !== sysAdminUserName) {
          $axios.post(`/iamUserInfo/getUserInfoDetail`, {
            name: this.userName
          }).then((res) => {
            this.userInfoArr = res.data
            this.userInfoModal = true
            this.$nextTick(() => {

            })
          }).then(() => {
            $axios.get('/iamUserInfo/isPwdOrGoogleAuthLoginType').then(response => {
              this.isShow = response.data;
            });
          })
        }
      },
      logoutAction() {
        this.$confirm('确定退出当前用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.logout();
        }).catch(() => {});
      },
      logout () {
        let _self = this
        // 判断是否为系统配置用户
        if (this.userName !== sysAdminUserName) {
          this.$store.dispatch('logout').then(function (data) {
            if (data) {
              _self.$message('退出成功')
              _self.$nextTick(function () {
                location.reload(location.origin + '/#/login')
              })
            } else {
              _self.$message('退出失败')
            }
          })
        } else {
          this.$store.dispatch('sysLoginout').then(function (data) {
            if (data) {
              _self.$message('退出成功')
              _self.$nextTick(function () {
                location.reload(location.origin + '/#/login')
              })
            } else {
              _self.$message('退出失败')
            }
          })
        }
      },
      setTheme(mainTheme) {
        this.darkShow = false
        this.chalkShow = false
        this.teaShow = false
        this.fantaShow = false
        this.$store.commit('setTheme', mainTheme);
        this.getNowTheme(mainTheme)
        this.$nextTick(() => {
          localStorage.setItem('theme', mainTheme);
          if (typeof window.TopologyGraph !== 'undefined' && typeof window.TopologyGraph.getGraph !== 'undefined') {
            let labelColor = mainTheme === 'dark' ? 'ffffff' : '667480';
            var sheet = window.TopologyGraph.getGraph().getStylesheet();
            sheet.styles.flowrate.fontColor = '#' + labelColor;
            sheet.styles.image.fontColor = '#' + labelColor;
            window.TopologyGraph.getGraph().refresh();
          }
          this.$eventBus.$emit('rebuild')
          document.getElementById('sunflower-theme').href = `/static/css/sf-${mainTheme}.css`;
          document.getElementById('user-theme').href = `/static/style/sicap-${mainTheme}.css`;
          let noDataImgAry = document.getElementsByClassName('noDataImg');
          let mainThemeStr = 'chalk';
          if (mainTheme === 'dark') {
            mainThemeStr = 'dark';
          }
          let imgSrc = `/static/images/system/noData_${mainThemeStr}.png`;
          for (let i = 0, l = noDataImgAry.length; i < l; i++) {
            noDataImgAry[i].src = imgSrc;
          }
        })
      },
      getNowTheme(mainTheme) {
        if (mainTheme === 'dark') { this.darkShow = true; this.themeColor = 'background-color: #12171d' }
        if (mainTheme === 'chalk') { this.chalkShow = true; this.themeColor = 'background-color: #2296FF' }
        if (mainTheme === 'tea') { this.teaShow = true; this.themeColor = 'background-color: #0ABA80' }
        if (mainTheme === 'fanta') { this.fantaShow = true; this.themeColor = 'background-color: #FF9023' }
      },
      goHome() {
        location.reload(location.origin + '/#/HomePage')
      },
      changeUserInfo() {
        let vm = this;
        let form = vm.$refs.updateInfo
        let param = Object.assign({}, form.staffForm);
        form.$refs.staffForm1.validate(valid1 => {
          if (valid1) {
            if (form.showInductionMsg) {
              form.$refs.staffForm.validate(valid => {
                if (valid) {
                  vm.axiosOK(param)
                } else {
                  form.activeNames = '2';
                  vm.$message({
                    type: 'warning',
                    message: '请按要求填写'
                  })
                }
              });
            } else {
              vm.axiosOK(param)
            }
          } else {
            form.activeNames = '1';
            vm.$message({
              type: 'warning',
              message: '请按要求填写'
            })
          }
        })
      },
      axiosOK(param) {
        if (param.entryTime !== null) {
          param.entryTime = Date.parse(new Date(param.entryTime)) / 1000;
        }
        $axios.post('/iamUserInfo/updateUserInfo', param).then((res) => {
          if (res.data === 'true') {
            this.$message({
              type: 'success',
              message: '信息修改成功！'
            })
            Bus.$emit('refreshManList')
            this.getInfoData()
            this.closeUpdate()
          } else {
            this.$message({
              type: 'error',
              message: '修改失败，请重试！'
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
  #headBar
    .head-line
      height: 5px
    .icon-theme
      font-size 12px!important;
      margin-left 4px;
      padding 2px;
      border-radius 50%;
    .separate-line
      display inline-block
      vertical-align text-top
      width 2px
      height: 20px
      opacity .2
      background-color #000000
    .down-img
      display inline-block;
      vertical-align sub;
      width 0;
      height 0;
      border-width 4px;
      border-style solid;
      border-color #BCC1C7 transparent transparent transparent;
    .avatar
      width 24px
      height 24px
      border-radius 50%
      position absolute
      top 8px
    .user-info
      position relative
      .s-dropdown-rel
        /*width 120px*/
      .s-dropdown-item
        line-height 20px
        .iconfont
          font-size 16px
          vertical-align middle
          margin-right 5px

</style>
