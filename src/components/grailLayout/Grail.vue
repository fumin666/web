/**
* Created by alex on 2017/5/6.
 */

<template>
  <div>
    <s-header></s-header>
    <s-bread v-show="!homePageScroll || isSpecialPage"></s-bread>
    <div class="index-body" id="index-body">
      <main v-if="homePageScroll">
        <slot></slot>
      </main>
      <main v-else style="margin:0 0 0 20px">
        <s-scrollbar :wrap-class="{sysScrollHeight:footerPage,sysConfigPageHeight:!footerPage}">
          <slot></slot>
        </s-scrollbar>
      </main>
    </div>
    <s-footer v-if="footerPage"></s-footer>
  </div>
</template>

<script type="text/babel">
  import Header from '../header/Header'
  import BreadCrumb from '../breadCrumb/BreadCrumb'
  import Footer from '../footer/Footer'
  import {homePageRouterNameList} from 'sunflower-common-utils';
  import Bus from '@/plugins/eventBus';
  export default {
    name: 'sGrail',
    data() {
      return {
        originHeight: 0,
        footerPage: true,
        homePageScroll: true,
        isSpecialPage: false // 是否是特殊处理页面
      }
    },
    components: {
      's-header': Header,
      's-bread': BreadCrumb,
      's-footer': Footer
    },
    created() {
      this.openSelfScrollBar(this.$route.name)
    },
    beforeMount() {
      Bus.$on('specialPage', (val) => { // 是否是特殊的一级页面
        if (val) {
          this.isSpecialPage = true
        } else {
          this.isSpecialPage = false
        }
      });
    },
    methods: {
      openSelfScrollBar(name) {
        if (homePageRouterNameList.toString().indexOf(name) > -1) {
          this.homePageScroll = true
        } else {
          this.homePageScroll = false
        }
        /* 配置向导页面不显示footer */// Q1UE问题优化
        if (name === 'ConfigurationWizard') {
          this.footerPage = false;
        } else {
          this.footerPage = true;
        }
      }
    },
    watch: {
      '$route' (to, from) {
        this.openSelfScrollBar(to.name)
      }
    },
    beforeDestroy() {
      Bus.$off('isSpecialPage');
    }
  }
</script>
<style lang="stylus">
.sysConfigPageHeight
  height:calc(100vh - 85px);
.sysScrollHeight
  padding-right 20px
</style>
