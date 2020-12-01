/**
* Created by liushupeng on 2019/2/26.
* 不同视角资产详情-右侧菜单//Q4资产详情
*/
<template>
  <div id="right-menu-x">
    <div style="margin-top:10px;">
      <s-menu :active-name="activeName" @on-select="goAssetDetail" style="font-size:14px;">
        <s-menu-item :name="item" v-for="(item, index) in menuData" :key="index">
          {{ item }}
        </s-menu-item>
      </s-menu>
    </div>
    <div v-if="menuData.length === 0" class="no-data">
      <span class="theme_color_default_font">无可选菜单</span>
    </div>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    name: 'RightMenu',
    props: ['threeTypeName'],
    data() {
      return {
        activeName: '',
        menuData: [],
        active: false,
        uuid: this.$route.params.assetUuid,
        citypeUuid: ''
      }
    },
    computed: {
    },
    mounted() {
    },
    created() {
      this.getMenuList();
      this.getAssetDetail();
    },
    methods: {
      judgeRouter() {
        let str = this.$route.path.toString();
        if (str.indexOf('assets_list/assetDetail') !== -1) {
          this.activeName = '资产基本信息';
        } else if (str.indexOf('assetsMonitor_list/assetDetail') !== -1) {
          this.activeName = '资产监控信息';
        } else if (str.indexOf('oper_assets') !== -1) {
          this.activeName = '运维审计信息';
        } else if (str.indexOf('assets_list/dataAssetInfo') !== -1) {
          this.activeName = '数据库资产信息';
        } else if (str.indexOf('assets_setting/assetsDetail') !== -1) {
          this.activeName = '数据库审计信息';
        } else if (str.indexOf('assets_setting/logInfo') !== -1) {
          this.activeName = '日志审计信息';
        } else if (str.indexOf('AutoOpsCenter/hostAssetDetail') !== -1) {
          this.activeName = '自动化运维信息';
        } else if (str.indexOf('assets_list/assetAccountInfo') !== -1) {
          this.activeName = '账号信息';
        } else if (str.indexOf('assets_list/configInfo') !== -1) {
          this.activeName = '配置项变更信息';
        } else if (str.indexOf('assets_list/eventInfo') !== -1) {
          this.activeName = '告警事件信息';
        }
      },
      getMenuList() {
        $axios.get('/assetsRelationPage/getAllViewItcompMenuByRole').then(res => {
          if (this.threeTypeName !== '数据库') { // 资产分类不是数据库不显示数据库资产信息导航
            if (res.data.includes('数据库资产信息')) {
              res.data.splice(res.data.indexOf('数据库资产信息'), 1)
            }
          }
          this.menuData = res.data;
          this.$nextTick().then(() => {
            this.judgeRouter();
          })
        })
      },
      goAssetDetail(name) {
        if (name === '资产基本信息') {
          this.$router.replace(`/AssetsAll/assets_list/assetDetail/${this.uuid}`)
        } else if (name === '资产监控信息') {
          this.$router.replace(`/AssetsMonitor/assetsMonitor_list/assetDetail/${this.uuid}`);
        } else if (name === '运维审计信息') {
          this.$router.replace(`/OperationCenter/oper_assets/${this.uuid}`)
        } else if (name === '数据库资产信息') {
          this.$router.replace(`/AssetsAll/assets_list/dataAssetInfo/${this.uuid}`)
        } else if (name === '数据库审计信息') {
          if (this.citypeUuid === '6af6cda15e21424992737a796a559b13' || this.citypeUuid === '848c1f7ebb63462f8fdfe37c296c6e5d') {
            // 跳转 中间件审计记录
            this.$router.replace(`/AssetsAll/assets_setting/assetsDetail/${this.uuid}/MiddleWareAsset`)
          } else {
            // 跳转 数据库审计记录
            this.$router.replace(`/AssetsAll/assets_setting/assetsDetail/${this.uuid}/DatabaseAsset`)
          }
        } else if (name === '日志审计信息') {
          this.$router.replace(`/AssetsAll/assets_setting/logInfo/${this.uuid}`)
        } else if (name === '自动化运维信息') {
          this.$router.replace(`/AutoOpsCenter/hostAssetDetail/${this.uuid}`)
        } else if (name === '账号信息') {
          this.$router.replace(`/AssetsAll/assets_list/assetAccountInfo/${this.uuid}`)
        } else if (name === '配置项变更信息') {
          this.$router.replace(`/AssetsAll/assets_list/configInfo/${this.uuid}`)
        } else if (name === '告警事件信息') {
          this.$router.replace(`/AssetsAll/assets_list/eventInfo/${this.uuid}`)
        }
      },
      getAssetDetail() {
        let assetUuid = this.$route.params.assetUuid;
        $axios.post(`/resourcemanager/assetmanager/itasset/getitAsset/${assetUuid}`).then(res => {
          this.citypeUuid = res.data.citypeUuid;
        })
      }
    }
  }
</script>

<style>
  .no-data{
    height: 100%;
    margin-top:30px;
    display: flex;
    justify-content:center;
    align-items:center;
  }
</style>
