<template>
  <section class="Assetscontent content assetcontentfix">
    <s-row :gutter="10">
      <s-col span="19" id="assetleft" style="height:calc(100vh - 50px)">
        <assets-statistics :refresh="refresh"></assets-statistics>
        <asset-view :refresh="refresh"></asset-view>
      </s-col>
      <s-col class="tableList" span="5" style="height:calc(100vh - 50px)">
        <assets-navs @buttonCount="buttonCount"></assets-navs>
        <div style="padding-left: 10px; padding-right: 10px;" :style="{height:this.maxheight-15+'px'}">
          <s-scrollbar :wrap-style="wrapstyle">
            <asset-difference :refresh="refresh" @isTop5="changeHeight"></asset-difference>
            <asset-server :refresh="refresh" :key="key" :style="{height:serverHeight}"></asset-server>
          </s-scrollbar>
        </div>
      </s-col>
    </s-row>
  </section>
</template>
<script type="text/babel">
  import AssetsStatistics from './newPage/AssetsStatistics'
  import AssetView from './newPage/AssetView.vue'
  import AssetsNavs from './AssetsNavs'
  import AssetDifference from './newPage/AssetDifference'
  import AssetServer from './newPage/AssetServer'
  import Bus from '@/plugins/eventBus';
  export default {
    data() {
      return {
        refresh: false,
        key: 1,
        btncount: 6,
        maxheight: 172,
        serverHeight: '350px'
      }
    },
    computed: {
      wrapstyle() {
        return 'max-height:' + this.maxheight + 'px;';
      }
    },
    created() {
      Bus.$on('refreshAssetAll', (val) => { // 是否是特殊的一级页面
        this.refresh = true;
      });
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.computeAssetHeight);
      });
    },
    components: {
      AssetsStatistics,
      AssetView,
      AssetsNavs,
      AssetDifference,
      AssetServer
    },
    methods: {
      computeAssetHeight() {
        let navbuttonheight = Math.ceil(this.btncount / 2) * 40;
        // eslint-disable-next-line no-undef
        let sreenheight = $('#app').height();
        this.maxheight = sreenheight - navbuttonheight - 70;
        this.changeHeight();
      },
      buttonCount(count) {
        this.btncount = count;
        this.computeAssetHeight();
      },
      changeHeight(val) {
        this.$nextTick(() => {
          // eslint-disable-next-line no-undef
          let height = this.maxheight - $('.assetDifference').height() - 30;
          this.serverHeight = (height > 350 ? height : 350) + 'px';
          // this.key++;
          this.$nextTick(() => {
            // eslint-disable-next-line no-undef
            let chart = echarts.getInstanceByDom(document.getElementById('assetServerChartData'));
            chart.resize();
          })
      })
      }
    },
    beforeDestroy() {
      Bus.$off('refreshAssetAll');
    },
    destroyed() {
      window.removeEventListener('resize', this.computeAssetHeight);
    }
  }
</script>
<style lang="stylus">

</style>
