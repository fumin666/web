<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:系统首次登陆配置向导页面
 * @Date: 2020-01-16 16:23:37
 * @LastEditors: mybells
 -->
<template>
  <div class="configguide">
    <s-dialog v-model="dialogOpen" :title="title" width="750px" :show-close="false">
      <s-row class="body" style="height:400px;margin-bottom:0px;">
        <s-col span="6" class="left" style="padding:90px 0 30px 20px;">
          <img src="/static/images/login/icon.svg" alt="" style="position: absolute; top: -2px; z-index: 3; left: 40px;">
          <s-menu :active-name="activeStep" :active-key="activeStep">
            <s-menu-item :name="1">
              更改密码
              <img v-if="activeStep>1" src="/static/images/login/success.svg" alt="">
            </s-menu-item>
            <s-menu-item :name="2">
              产品注册
              <img v-if="activeStep>2" src="/static/images/login/success.svg" alt="">
            </s-menu-item>
            <s-menu-item :name="3">
              更新组织
              <img v-if="activeStep>3" src="/static/images/login/success.svg" alt="">
            </s-menu-item>
            <s-menu-item :name="4">
              授权管理员
              <img v-if="activeStep>4" src="/static/images/login/success.svg" alt="">
            </s-menu-item>
          </s-menu>
        </s-col>
        <s-col span="18" style="padding:20px 30px 20px 20px;" class="right">
          <component :is="componentId" ref="reference"></component>
        </s-col>
      </s-row>
      <template slot="footer" class="dialog-footer">
        <s-button type="cancel" @click="lastStep" v-if="activeStep==4">上一步</s-button>
        <s-button type="cancel" @click="nextStep" v-if="activeStep!=4">下一步</s-button>
        <s-button @click="nextStep" v-if="activeStep===4">完 成</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script type="text/babel">
import ChangePassword from './ConfigGuide/ChangePassword'
import UpdateOrganization from './ConfigGuide/UpdateOrganization'
import ProductRegister from './ConfigGuide/ProductRegister'
import AuthAdmin from './ConfigGuide/AuthAdmin'
  export default {
    name: 'ConfigGuide',
    components: {
      ChangePassword,
      UpdateOrganization,
      ProductRegister,
      AuthAdmin
    },
    data() {
      return {
        dialogOpen: true,
        title: '产品首次使用向导'
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
      componentId() {
        switch (this.activeStep) {
          case 1:
            return 'change-password';
          case 2:
            return 'product-register';
          case 3:
            return 'update-organization';
          case 4:
            return 'auth-admin';
          default:
            return 'change-password';
        }
      }
    },
    created() {
    },
    methods: {
      lastStep() {
        this.activeStep--;
      },
      nextStep() {
        this.$refs.reference.submitForm();
      }
    }
  }
</script>
<style lang="stylus">
.configguide{
  .s-dialog-body {
    padding: 0 !important;
  }
  .left{
    height:100%;
    // background:#f7f7f7;
    .s-menu{
      li{
        pointer-events:none;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        img{
          color:#12ec12;
          float:right;
          position relative;
          top:2px;
        }
      }
      // background:#f7f7f7;
    }
    .s-menu-vertical.s-menu-light:after {
      width 0;
    }
  }
}
</style>
