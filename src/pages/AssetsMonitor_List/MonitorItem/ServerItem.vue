<template>
  <div>
    <s-row class="graphArea" :gutter="10">
      <s-col span="12" class="model">
        <s-card class="box-card" style="height: 300px;" v-if="chartData.chartCpuArr.length !== 0">
          <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-panel"></i>
                  CPU使用率
                </span>
          </div>
          <switch-box :max="2" :switch-arr="chartData.chartCpuArr" v-if="loadFinish">
            <template slot-scope="scope">
              <s-chart :chart="dealChartData(scope.item,'cpu')"></s-chart>
              <s-row class="chartName cpuName" @click.native="showInfoDetail(scope.item)">
                <i class="chartStatus"
                   :class="{'normal': scope.item.itemState==0,'wrong': scope.item.itemState!=0}"></i>{{scope.item.cpuName}}
              </s-row>
            </template>
          </switch-box>
        </s-card>
      </s-col>
      <s-col span="12" class="model">
        <s-card class="box-card" style="height: 300px;" v-if="chartData.chartCpuArr.length !== 0">
          <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-panel"></i>
                  内存使用率
                </span>
          </div>
          <s-row class="chartContainer">
            <s-col v-for="(chartItem,index) in chartData.chartMemoryArr" :key="index" span="24" v-if="loadFinish">
              <s-chart :chart="dealChartData(chartItem,'memory')"></s-chart>
              <s-row class="memoryName">
                <s-col class="chartName" v-for="(memoryItem,childIndex) in chartItem.chartNames"
                       :key="'item'+childIndex"
                       @click.native="showInfoDetail(memoryItem)" :span="24 / chartItem.chartNames.length">
                  <i class="chartStatus"
                     :class="{'normal': memoryItem.itemState==0,'wrong': memoryItem.itemState!=0}"></i>{{memoryItem.memoryName}}
                </s-col>
              </s-row>
            </s-col>
            <div class="clearfix"></div>
          </s-row>
        </s-card>
      </s-col>
    </s-row>
    <s-row class="graphArea" :gutter="10">
      <s-col :span="temperSpan" class="model">
        <s-card class="box-card" style="height: 300px;" v-if="chartData.chartCpuArr.length !== 0">
          <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-panel"></i>
                  存储空间
                </span>
          </div>
          <switch-box :max="4" :switch-arr="chartData.chartDiskArr" class="diskChart" v-if="loadFinish">
            <template slot-scope="scope">
              <s-chart :chart="dealChartData(scope.item,'disk')"></s-chart>
              <div class="otherChartInfo">
                <s-row class="chartName" @click.native="showInfoDetail(scope.item)">
                  <i class="chartStatus"
                     :class="{'normal': scope.item.itemState==0,'wrong': scope.item.itemState!=0}"></i>{{scope.item.diskName}}
                </s-row>
                <s-row>全部: {{scope.item.total}}</s-row>
                <s-row>可用: {{scope.item.free}}</s-row>
              </div>
            </template>
          </switch-box>
        </s-card>
      </s-col>
      <s-col :span="24 - temperSpan" v-if="chartData.chartCountArr.length !== 0" class="model">
        <s-card class="box-card" style="height: 300px;">
          <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-panel"></i>
                  计数器
                </span>
          </div>
          <s-row class="chartContainer">
            <s-col v-for="(chartItem,index) in chartData.chartCountArr" :key="index" span="24" v-if="loadFinish">
              <s-chart :chart="dealChartData(chartItem,'count')"></s-chart>
            </s-col>
            <div class="clearfix"></div>
          </s-row>
        </s-card>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import switchBox from '@/components/switchBox/SwitchBox';
  export default {
    data() {
      return {
        loadFinish: false
      }
    },
    props: {
      chartData: {
        type: Object,
        require: true
      }
    },
    mounted() {
      console.log(this.chartData)
      this.$nextTick(() => {
        this.loadFinish = true; // 为了防止echart重新渲染
      })
    },
    computed: {
      temperSpan() {
        if (this.chartData.chartCountArr.length === 0) {
          return 24;
        } else {
          return 12;
        }
      }
    },
    methods: {
      dealChartData(chartItem, chartType) {
        let chartItemData = chartItem.chartDatas;
        if (chartType === 'cpu') {
          return {
            name: chartItem.cpuName,
            itemName: '使用率',
            type: 'gaugeChart',
            width: '100%',
            height: '260px',
            data: chartItem.cpuUse
          }
        } else if (chartType === 'disk') {
          return {
            name: chartItem.diskName,
            type: 'ringChart',
            width: '160px',
            height: '160px',
            data: chartItem.diskUse,
            option: {
              series: [{
                itemStyle: {
                  normal: {
                    label: {
                      formatter: function (params) {
                        return (100 - parseFloat(params.value)).toFixed(2) + '%'
                      }
                    }
                  }
                }
              }]
            }
          }
        } else if (chartType === 'memory') {
          return {
            name: 'chartMemory',
            type: 'stackChart',
            width: '100%',
            height: '240px',
            unit: chartItem.unit,
            data: chartItem.chartDatas,
            option: {
              series: [{
                itemStyle: {
                  normal: {
                    label: {
                      formatter: function (params, s, y) {
                        for (let i = 0, l = chartItemData.length; i < l; i++) {
                          // eslint-disable-next-line eqeqeq
                          if (chartItemData[i].use == params.name) {
                            return ((params.value / chartItemData[i].sum) * 100).toFixed(2) + '%'
                          }
                        }
                      }
                    }
                  }
                }
              }]
            }
          };
        } else if (chartType === 'count') {
          let chartData = [];
          chartItem.data.forEach(item => {
            chartData.push({
              name: item.date,
              value: item.counter1
            })
//            chartData[item.date] = item.counter1;
          });
          return {
            name: 'chartCount',
            type: 'lineChart',
            width: '100%',
            height: '280px',
            data: chartData,
            itemName: chartItem.cn,
            option: {
              yAxis: [{
                type: 'value',
                axisLabel: {
                  show: true,
                  interval: 'auto',
                  formatter: function (params) {
                    let yAry = {}
                    new Array(1000).join(',').split(',').map(function (value, index) {
                      yAry[index] = index
                    })
                    return yAry[params];
                  }
                }
              }]
            }
          };
        }
      },
      showInfoDetail(item) {
        this.$emit('show-detail-dialog', item);
      }
    },
    components: {
      switchBox
    }
  }
</script>
<style lang="stylus">
  .graphArea{
     .model{
       .box-card{
          margin: 5px;
          padding: 0px 5px;
          border: 1px solid #DCDEE2;
          box-sizing: border-box;
          border-radius: 2px;
       }
     }
  }
</style>
