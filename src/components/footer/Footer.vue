<!--
 * @Description: In User Settings Edit
 * @Author: songyf
 * @Date: 2019-10-14
 * @LastEditTime: 2020-03-17 14:18:16
 * @LastEditors: mybells
 -->
/*
create by YOU
*/
<template>
  <footer class="s-footer noPrint">
    <div class="s-footer-wrapper">
      <div class="s-footer-nav">
        <ul>
          <li v-for="(item, index) in nav">
            <s-tooltip placement="top"  :content="item.title">
              <router-link :to="item.to">
                <i :class="`iconfont ${item.class}`"></i>
              </router-link>
            </s-tooltip>
          </li>
        </ul>
      </div>
      <div class="s-footer-time" style="display:none;">
      </div>
    </div>
<!--    <div class="copyright" v-copyright></div>-->
  </footer>
</template>

<script type="text/babel">
  export default {
    name: 'sFooter',
    computed: {
      nav: function () {
        return this.$store.getters.menu
      }
    },
    data() {
      return {
        configGuide: {
          '/ConfigPage/orgTopo': 'AccountManage',
          '/ConfigPage/assetStaff': 'AccountManage',
          '/ConfigPage/account_auth': 'AccountManage',
          '/ConfigPage/assets_list': 'AssetsAll',
          '/ConfigPage/db_setting': 'AssetsAll',
          '/ConfigPage/log_setting': 'AssetsAll',
          '/ConfigPage/assetsMonitor_list': 'AssetsMonitor',
          '/ConfigPage/config_collect': 'AutoOpsCenter',
          '/ConfigPage/Process_setup': 'ProcessCenter'
        }
      }
    },
    created() {
      // console.log(this.$store.getters.menu);
    },
    methods: {},
    watch: {
      '$route': {
        handler(newval, oldval) {
          if (newval.path && newval.path in this.configGuide) {
            this.$nextTick(() => {
              // eslint-disable-next-line no-undef
              $(`.s-footer .s-footer-nav>ul a[href="#/${this.configGuide[newval.path]}"]`).addClass('config active');
            })
          } else {
            // eslint-disable-next-line no-undef
            let str = $('.s-footer .s-footer-nav>ul a[class~="config"]').attr('class')
            if (str && str.indexOf('config') > -1) {
              // eslint-disable-next-line no-undef
              $('.s-footer .s-footer-nav>ul a').removeClass('config active');
            }
          }
        },
        immediate: true
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.s-footer
  z-inde 1
  .s-footer-wrapper
    width 1038px
    height 44px
    margin 0 auto
    .s-footer-nav
      margin -25px auto

</style>
