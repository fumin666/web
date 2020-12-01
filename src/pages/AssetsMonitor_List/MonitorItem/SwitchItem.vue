<template>
  <div id="switchChartContainer">
    <s-row class="graphArea" :gutter="10">
      <s-col :span="firstRowSpan" v-if="chartData.chartCpuArr.length !== 0">
        <s-card class="cpu-card" style="height: 300px;">
          <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-panel"></i>
                  CPU使用率
                </span>
          </div>
          <switch-box :max="chartData.chartCpuArr[0] && (chartData.chartCpuArr[0].cpuData.length==1 ? 2 : 1)"
                      :switch-arr="chartData.chartCpuArr" v-if="loadFinish">
            <template slot-scope="scope">
              <s-chart :chart="dealChartData(scope.item,'cpu')" class="cpuChart"></s-chart>
              <s-row class="chartName cpuName" @click.native="showInfoDetail(scope.item)">
                <i @click="click(scope.item)" class="chartStatus"
                   :class="{'normal': scope.item.itemState==0,'wrong': scope.item.itemState!=0}"></i>{{scope.item.cpuName}}
              </s-row>
            </template>
          </switch-box>
        </s-card>
      </s-col>
      <s-col :span="firstRowSpan" v-if="chartData.chartMemoryArr.length !== 0">
        <s-card class="box-card" style="height: 300px;">
          <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-panel"></i>
                  内存使用率
                </span>
          </div>
          <s-row class="chartContainer">
            <s-col v-for="(chartItem,index) in chartData.chartMemoryArr" :key="index" span="24" v-if="loadFinish">
              <s-chart :chart="dealChartData(chartItem,'memory')"></s-chart>
              <s-row class="memoryName" :style="isPercent(chartItem) ? 'margin-left: 0;' : '' ">
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
      <s-col :span="firstRowSpan" v-if="chartData.chartPowerArr.length !== 0">
        <s-card class="box-card" style="height: 300px;">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-panel"></i>
              电源
            </span>
          </div>
          <s-row class="chartContainer powerContainer">
            <s-row v-for="(chartItem,index) in chartData.chartPowerArr" class="powerRow" :key="index">
              <s-col span="12" class="left-icon">
                <i class="iconfont icon-shut-down"
                   :class="{'font-normal': chartItem.itemState==0,'font-wrong': chartItem.itemState!=0}"></i>
              </s-col>
              <s-col span="12" class="right-text">
                <s-row class="chartName" @click.native="showInfoDetail(chartItem)">
                  <i class="chartStatus"
                     :class="{'normal': chartItem.itemState==0,'wrong': chartItem.itemState!=0}"></i>{{chartItem.name}}
                </s-row>
                <s-row>电源状态： {{chartItem.state | filterState}} </s-row>
              </s-col>
            </s-row>
          </s-row>
        </s-card>
      </s-col>
    </s-row>
    <s-row class="graphArea" :gutter="10">
      <s-col :span="24 - temperSpan">
        <s-row class="graphArea" v-if="chartData.chartFanArr.length !== 0">
          <s-card class="fan-card" style="height: 300px;">
            <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-panel"></i>
                  风扇
                </span>
            </div>
            <ul class="fanState">
              <li><span class="fanNormal"></span>正常</li>
              <li><span class="fanAbnormal"></span>异常</li>
              <li><span class="fanUnknow"></span>未知</li>
            </ul>
            <switch-box :max="4" :switch-arr="chartData.chartFanArr" class="fanBox">
              <template slot-scope="scope">
                <div class="fanPic">
                  <img :src="getFanPic(scope.item)" alt="">
                </div>
                <s-row class="chartName fanName" @click.native="showInfoDetail(scope.item)">
                  <i class="chartStatus"
                     :class="{'normal': scope.item.itemState==0,'wrong': scope.item.itemState!=0}"></i>
                  {{scope.item.name}}
                </s-row>
              </template>
            </switch-box>
          </s-card>
        </s-row>
        <s-row v-if="chartData.chartDiskArr.length !== 0">
          <s-card class="box-card" style="height: 300px;">
            <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-panel"></i>
                  存储空间
                </span>
            </div>
            <switch-box :max="5" :switch-arr="chartData.chartDiskArr" class="diskChart" v-if="loadFinish">
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
        </s-row>
      </s-col>
      <s-col :span="temperSpan" v-if="chartData.chartTemperArr.length !== 0">
        <s-card class="box-card" style="height: 610px;">
          <div slot="header" class="clearfix">
          <span class="card-title">
            <i class="iconfont icon-panel"></i>
            温度
          </span>
          </div>
          <s-row class="chartContainer">
            <s-col v-for="(chartItem,index) in chartData.chartTemperArr" :key="index" span="24" v-if="loadFinish">
              <s-charts :chart="dealChartData(chartItem,'count')"></s-charts>
            </s-col>
            <div class="clearfix"></div>
          </s-row>
        </s-card>
      </s-col>
    </s-row>
    <s-row class="graphArea" :gutter="10" v-if="chartData.chartCountArr.length !== 0">
      <s-card class="box-card" style="height: 300px;">
        <div slot="header" class="clearfix">
          <span class="card-title">
            <i class="iconfont icon-panel"></i>
            计数器
          </span>
        </div>
        <s-row class="chartContainer">
          <s-col v-for="(chartItem,index) in chartData.chartCountArr" :key="index" span="24" v-if="loadFinish">
            <s-charts :chart="dealChartData(chartItem,'count')"></s-charts>
          </s-col>
          <div class="clearfix"></div>
        </s-row>
      </s-card>
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
    computed: {
      firstRowSpan() {
        let arr = [
          this.chartData.chartCpuArr,
          this.chartData.chartMemoryArr,
          this.chartData.chartPowerArr
        ];
        let validLength = arr.filter(item => {
          return item.length > 0;
        }).length;
        return 24 / validLength;
      },
      temperSpan() {
        if (this.chartData.chartTemperArr.length > 0) {
          return 8;
        }
        return 0;
      }
    },
    mounted() {
      console.log(this.chartData)
      this.$nextTick(() => {
        this.loadFinish = true; // 为了防止echart重新渲染
      })
    },
    methods: {
       // 后台查不到内存数据，只能查到百分比，判断使用环形图
      isPercent(chartItem) {
        return chartItem.chartDatas && chartItem.chartDatas[0] && chartItem.chartDatas[0].utilization
      },
      dealChartData(chartItem, chartType) {
        let chartItemData = chartItem.chartDatas;
        if (chartType === 'cpu') {
          if (chartItem.cpuData.length === 1) {
            return {
              name: chartItem.cpuName,
              itemName: '使用率',
              type: 'gaugeChart',
              width: '100%',
              height: '260px',
              data: chartItem.cpuData[0].value
            }
          } else {
            return {
              name: chartItem.cpuName,
              type: 'ringCharts',
              width: '450px',
              height: '160px',
              data: chartItem.cpuData
            }
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
          if (this.isPercent(chartItem)) {
            return {
              name: 'chartMemory',
              type: 'ringChart',
              width: '100%',
              height: '240px',
              data: chartItem.chartDatas[0].utilization
            }
          }
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
          let chartData = {};
          chartItem.data.forEach(item => {
            chartData[item.date] = item.counter1;
          });
          return {
            el: 'chartCount',
            type: 'lineChart',
            width: '100%',
            height: '260px',
            data: chartData
          };
        }
      },
      showInfoDetail(item) {
        this.$emit('show-detail-dialog', item);
      },
      getFanPic(item) {
        switch (item.state) {
          case '0':
            return '../../../../static/images/itResource/fan_unknow.png';
          case '1':
            return '../../../../static/images/itResource/fan_normal.png';
          case '2':
            return '../../../../static/images/itResource/fan_abnormal.png';
        }
      }
    },
    filters: {
      filterState(val) {
        switch (val) {
          case '0':
            return '未知';
          case '1':
            return '正常';
          case '2':
            return '异常';
        }
      }
    },
    components: {
      switchBox
    }
  }
</script>
