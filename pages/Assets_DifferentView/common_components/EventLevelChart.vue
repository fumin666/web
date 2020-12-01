/**
* Created by dgunzi on 2019/02/25.
* 事件级别统计
*/
<template>
    <div id="eventLevelChart">
      <s-card class="box-card" style="height: 350px;">
        <div slot="header" class="clearfix">
        <span class="card-title">
          事件级别统计
        </span>
        <div class="rightOpLink"><span :class="{'currentChart' : currentChart == 'total'}" @click="changType('total')">总数{{allnumber}}</span> <span :class="{'currentChart' : currentChart == 'alarm'}"  @click="changType('alarm')">已告警{{number}}</span></div>
        </div>
        <div style="margin-left: -10px">
          <s-charts :chart="chart4_1"></s-charts>
        </div>
      </s-card>
    </div>
</template>

<script>
    import $axios from 'sunflower-ajax'
    export default {
        name: 'EventLevelChart',
        data() {
            return {
              assetUuid: this.$route.params.assetUuid,
              currentChart: 'total',
              allnumber: 0,
              number: 0,
              chart4_1: {
                el: 'chart4_1',
                type: 'barChart',
                width: '50%',
                height: '310px',
                data: {},
                opt: {
                  label: {
                    show: false
                  },
                  barWidth: 30,
                  yAxis: [{
                    type: 'value',
                    show: false
                  }]
                }
              }
            }
        },
        created() {
          let assetUuid = this.assetUuid;
          // 初始化总数
          $axios.get(`/assetsRelationPage/getEventTotalByItcomp/${assetUuid}/1`).then(res => {
              if (res.data instanceof Object) {
                let levelArray = res.data
                let attr = {}
                let allnumber = 0
                for (let i in levelArray) {
                  attr[levelArray[i].name] = parseInt(levelArray[i].value);
                  allnumber += parseInt(levelArray[i].value);
                }
                this.chart4_1.data = attr
                this.allnumber = allnumber
              }
          })
          // 初始化告警数量
          $axios.get(`/assetsRelationPage/getEventTotalByItcomp/${assetUuid}/2`).then(res => {
              if (res.data instanceof Object) {
                let levelArray = res.data
                let number = 0
                for (let i in levelArray) {
                  number += parseInt(levelArray[i].value);
                }
                this.number = number
              }
          })
        },
        methods: {
          getDetailData() {
            let assetUuid = this.assetUuid;
            // 1-所有事件总数，2-已告警事件总数
            let type = this.currentChart === 'total' ? 1 : 2;
            $axios.get(`/assetsRelationPage/getEventTotalByItcomp/${assetUuid}/${type}`).then(res => {
              if (res.data instanceof Object) {
                let levelArray = res.data
                let attr = {}
                let allnumber = 0
                for (let i in levelArray) {
                  attr[levelArray[i].name] = parseInt(levelArray[i].value);
                  allnumber += parseInt(levelArray[i].value);
                }
                this.chart4_1.data = attr
                if (type === 1) {
                  this.allnumber = allnumber
                } else if (type === 2) {
                  this.number = allnumber
                }
              }
            })
          },
          changType(type) {
            this.currentChart = type;
            this.getDetailData();
          }
        }
    }
</script>

<style scoped>

</style>
