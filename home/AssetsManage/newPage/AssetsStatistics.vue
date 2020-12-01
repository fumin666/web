<!--
 * @Author: 高建鹏
 * @Version: //Q4资产管理一级页面
 * @Description:资产管理
 * @Position:资产管理一级页面-》资产管理
 * @Date: 2019-10-18 09:26:21
 * @LastEditors: 高建鹏
 -->
<template>
  <s-card class="main-card-content box-card card-line assetstatistic" style="height:55%;">
    <div slot="header" class="clearfix">
      <span class="card-title">{{ cardConfig.title }}</span>
      <div class="card-enter more-info" @click="handleMore">{{ cardConfig.moreText }}</div>
    </div>
    <div class="assetstatistic_all">
      <div style="position:absolute;">
        <div class="assetstatistic_num" style="width:341px;min-width:341px;">
          <img style="margin-left:40px;" src="/static/images/assetview/assethome/assetall.svg">
          <span class="assetstatistic_name1">资产总数</span>
          <span class="assetstatistic_val1">{{assetnum}}</span>
        </div>
        <ul style="width:215px;min-width:215px;">
          <li class="assetstatistic_type" v-for="(item, key) in type" :key="key">
            <img style="margin-left:72px;position:relative;top:3px;width:18px;height:18px;" :src="'/static/images/assetview/assethome/'+item.img+'.svg'">
            <span class="assetstatistic_name">{{key}}</span>
            <span class="assetstatistic_val">{{item.value}}</span>
          </li>
        </ul>
      </div>
      <div style="width:100%">
        <s-charts :chart="chartdata"></s-charts>
      </div>
    </div>
    <div class="linearline"></div>
  </s-card>
</template>
<script type="text/babel">
  import nightingaleChartOption from '@/components/chart/nightingaleChartOption.js'
  import mixin from '@/common/mixins/portletUtil'
  import { merge } from 'lodash'
  import $axios from 'sunflower-ajax';

  export default {
    mixins: [mixin],
    name: 'assetsStatistics',
    props: {
      refresh: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        cardConfig: {
          title: '资产管理',
          moreText: '更多'
        },
        assetnum: 0,
        type: {
          '使用': { value: 0, name: '使用', img: 'shiyong' },
          '变更': { value: 0, name: '变更', img: 'biangeng' },
          '维修': { value: 0, name: '维修', img: 'weixiu' },
          '报废': { value: 0, name: '报废', img: 'baofei' },
          '折旧': { value: 0, name: '折旧', img: 'zhejiu' },
          '库存': { value: 0, name: '库存', img: 'kucun' },
          '退库': { value: 0, name: '退库', img: 'tuiku' }
        },
        chartdata: {
          el: 'assetsStatistics_Nightingale',
          type: 'baseChart',
          width: '100%',
          height: '100%',
          opt: {
            legend: {
              data: []
            },
            series: [{
              data: []
            }]
          }
        }
      }
    },
    components: {},
    created() {
      this.getInitData();
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
    },
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      },
      refresh(val) {
        if (val) {
          this.getInitData();
        }
      }
    },
    computed: {
    },
    methods: {
      getTheme(val) {
        if (val === 'dark') {
          this.chartdata.opt = merge({}, this.chartdata.opt, nightingaleChartOption.dark);
        } else {
          this.chartdata.opt = merge({}, this.chartdata.opt, nightingaleChartOption.light);
        }
      },
      handleMore() {
        this.goto('assets_list?name=服务器&all=1');
      },
      getInitData() {
        $axios.get('/resourcemanager/assetmanager/itasset/lifecycleStatusForAssetCount').then(({data}) => {
          this.assetnum = data['资产总数'] || 0;
          Object.keys(data || {}).map((key) => {
            if (this.type[key]) {
              this.type[key].value = data[key];
            }
          })
        })
        // 获取玫瑰图数据
        $axios.get('/resourcemanager/assetmanager/itasset/portionCmdbCitypeForAssetCount').then(({data}) => {
          let obj = data || {};
          this.chartdata.opt.legend.data = Object.keys(obj);
          this.chartdata.opt.series[0].data = Object.keys(obj).map((key) => {
            return {name: key, value: obj[key]};
          });
        })
      }
    },
    mounted() {
    }
  }
</script>
<style lang="stylus">
</style>
