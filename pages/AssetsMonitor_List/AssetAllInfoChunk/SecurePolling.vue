<template>
  <div class="securePolling clearfix">
    <div class="ballSummary">
      <div class="ball normal-ball"></div>
      <span class="ball-detail">
        <span class="left-float">本月巡检次数：{{data.countHistory}}</span>
        <span class="right-float">本月违规次数：{{data.monCount}}</span>
      </span>
    </div>
    <div v-for="(item, index) in data.hisByParams" :key="index"
         class="ballContainer"
         :class="[index > 4 ? 'right-float' : 'left-float', 'ballContainer' + index,
            (index !== 10 && item.isSecurity !== -1) || (index === 10 && data.hisByParams[9].isSecurity !== -1 ) ? 'progress' : '']"
         :style="{width: getBollContainerWidth(index), height: ballContainerHeight}">
      <div v-if="index !== 10"
        class="ball"
        :class="getBallState(item.isSecurity)">
        <span class="ball-info" v-if="item.isSecurity !== -1">{{item.excutetime}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        data: {
          hisByParams: [] // 巡检结果
        },
        totalWidth: 0,
        ballContainerHeight: '130px'
      }
    },
    props: {
      compId: {
        type: String,
        required: true
      }
    },
    created() {
      this.axiosData();
    },
    mounted() {
      this.doLayout();
      window.addEventListener('resize', this.doLayout)
    },
    destroyed() {
      window.removeEventListener('resize', this.doLayout);
    },
    methods: {
      getBollContainerWidth(index) {
        switch (index) {
          case 0: return '10%';
          case 5: return '10%';
          default: return '20%';
        }
      },
      doLayout() {
        this.$nextTick(() => {
          let cardHeight = document.querySelector('.securePollingCard').offsetHeight;
          this.ballContainerHeight = (cardHeight - 100) / 2 - 20 + 'px';
        });
      },
      axiosData() {
        let param = {
          condition: {assetuuid: this.compId},
          currentPage: 1,
          totalCount: -1,
          pageSize: 10,
          pageList: [],
          distinct: false,
          orderByClause: ''
        };
        $axios.post('assetInspectHistory/InspectAssetHistoryList', param).then(({data}) => {
          while (data.hisByParams.length < 10) {
            data.hisByParams.push({isSecurity: -1})
          }
          data.hisByParams.push({isSecurity: -1}); // 为了尾部补充下划线
//          data.hisByParams = [ // 测试数据
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 0},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 1},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 0},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 1},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 0},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 1},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 0},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 1},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 0},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: 0},
//            {excutetime: '2017-10-20 08:37:13', isSecurity: -1}
//          ]
          this.data = data;
        });
      },
      getBallState(isSecurity) {
        switch (isSecurity) {
          case 0: return 'wrong-ball';
          case 1: return 'right-ball';
          default: return 'normal-ball';
        }
      }
    }
  }
</script>

<style lang="stylus">

</style>
