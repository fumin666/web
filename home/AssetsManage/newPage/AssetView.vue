<!--
 * @Author: 高建鹏
 * @Version: //Q4资产管理一级页面
 * @Description:资产概览
 * @Position:资产管理一级页面-》资产概览
 * @Date: 2019-10-18 09:26:21
 * @LastEditors: mybells
 -->

<template>
<section class="assetView" style="height:45%;">
  <s-card class="box-card recentChange card-line" style="height:100%;  padding-bottom: 70px; box-sizing: border-box;">
    <div slot="header" class="clearfix">
      <span class="card-title">
        {{ cardConfig.title }}
      </span>
    </div>
    <div class="asset-category-list">
      <s-carousel arrow="never" :autoplay="false">
        <s-carousel-item v-for="(item,index) in dataLength" :key="index" class="assetcarousel" style="height:calc(100% - 28px);">
          <s-row type="flex" style="padding:0 20px;height:100%;">
            <s-col v-for="(obj,key) in item" :key="key" :span="8" class="cardcol" style="height:100%;">
              <s-card-diy class="cardview" :title="obj.title" :more-click="handleMore(obj.title)" style="height:100%;">
                  <s-chart v-if="obj.data.data.length" :chart="obj.data"></s-chart>
                  <div v-nodata="!obj.data.data.length"></div>
              </s-card-diy>
            </s-col>
          </s-row>
        </s-carousel-item>
      </s-carousel>
    </div>
    <div class="clr"></div>
  </s-card>
</section>
</template>

<script>
import mixin from '@/common/mixins/portletUtil'
import ringChartOption from '@/components/chart/ringChartOption.js'
import { merge, chunk, cloneDeep } from 'lodash'
import $axios from 'sunflower-ajax';

export default {
  mixins: [mixin],
  name: 'configItemManage',
  props: {
    refresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cardConfig: {
        title: '资产概览'
      },
      template: {
        title: '',
        data: {
          name: 'chart1',
          type: 'statRingChart',
          width: '100%',
          height: '100%',
          data: [],
          option: {
            title: {
              text: '',
              subtext: ''
            }
          }
        }
      },
      dataLength: []
    }
  },
  components: {},
  created() {
    this.initData();
  },
  methods: {
    initData() {
      $axios.get(`/resourcemanager/assetmanager/itasset/overviewOfAssets`).then(({data}) => {
        let obj = data || {};
        this.getdata(obj);
      })
    },
    handleMore(title) {
      let vm = this;
      return function() {
        vm.goto('assets_list?name=' + title)
      }
    },
    getdata(data) {
      let arr = [];
      for (let name in data) {
        let temp = cloneDeep(this.template);
        temp.title = name.split('/')[0];
        temp.data.name = temp.title;
        temp.data.option.title.text = temp.title;
        temp.data.option.title.subtext = name.split('/')[1];
        temp.data.data = Object.keys(data[name]).map(key => {
          return {name: key, value: data[name][key]};
        })
        temp.data.option = merge({}, temp.data.option, ringChartOption.dark)
        arr.push(temp);
      }
      this.dataLength = chunk(arr, 3)
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
    },
    getTheme(val) {
      this.dataLength.map((arr, index) => {
        arr.map(obj => {
          if (val === 'dark') {
            obj.data.option = merge({}, obj.data.option, ringChartOption.dark)
          } else {
            obj.data.option = merge({}, obj.data.option, ringChartOption.light)
          }
        })
      })
    }
  },
  watch: {
    '$store.state.theme': function(val) {
      this.getTheme(val)
    },
    refresh(val) {
      if (val) {
        this.initData();
      }
    }
  }
}
</script>
<style lang="stylus">
  .asset-category-list{
    .s-carousel-indicator{
      padding: 5px 4px;
    }
  }
</style>
