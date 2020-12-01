<template>
  <section class="content" style="margin: 20px 0 20px 5px">
    <s-form :inline="true" class="search_form">
          <div class="form_item">
            <select-time ref="selecttime"></select-time>
          </div>
          <div class="search_btn">
            <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
          </div>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
    </s-row>
    <div style="height:300px">
      <s-row>
        <s-col span='8'>
          <div style="margin:20px 0;font-weight:bold;font-size:14px">通报数量趋势图</div>
            <s-chart :chart="chart1" v-if="chart1.data.length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px"></div>
        </s-col>
        <s-col span='8'>
          <div style="margin:20px 0;font-weight:bold;font-size:14px">通报下发人员排行TOP5</div>
          <s-charts :chart="chart2" v-if="Object.keys(chart2.data).length"></s-charts>
          <div v-nodata="true" v-else style="height: 250px"></div>
        </s-col>
        <s-col span='8'>
          <div style="margin:20px 0;font-weight:bold;font-size:14px">通报完成状况</div>
          <s-chart :chart="chart3" v-if="chart3.data.length"></s-chart>
          <div v-nodata="true" v-else style="height: 250px"></div>
        </s-col>
      </s-row>
    </div>
    <s-table-page :data="topLists">
      <s-table-column label="通报主题" prop="taskTitle"></s-table-column>
      <s-table-column label="通报类型" prop="taskType"></s-table-column>
      <s-table-column label="通报状态" prop="taskStatus"></s-table-column>
      <s-table-column label="提交人" prop="createUser"></s-table-column>
      <s-table-column label="提交时间" prop="createTime"></s-table-column>
    </s-table-page>
  </section>
</template>
<script>

  // import barChartOption from '@/components/chart/barChartOptionY.js'
  // import ringChartOption from '@/components/chart/pieChartOption.js'
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  // import SelectTime from '@/components/selectTime/SelectTime.vue'
  import SelectTime from '@/pages/Log_DbAudits/components/DBSelectTime'
  export default {
    components: {
      SelectTime
    },
    props: {
      safeTaskUuid: String
    },
    data() {
      return {
        topLists: [],
        period: {},
        chart1: {
            name: 'chart1',
            type: 'lineChart',
            width: '100%',
            height: '250px',
            data: [],
            option: {
              color: ['#60ACFC'],
              grid: {
                top: '10%',
                left: '12%',
                right: '10%',
                bottom: '18%'
              },
              xAxis: [{
                axisLabel: {
                  show: true,
                  interval: 0,
                  textStyle: {
                  }
                }
              }],
              yAxis: [{
                axisLine: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: 'dashed',
                    color: '#D6D6D6'
                  }
                }
              }]
            }
        },
        chart2: {
          el: 'chart2',
          type: 'yBarChart',
          width: '100%',
          height: '250px',
          data: {},
          opt: {
            xAxis: {
              axisLine: {
                show: false // 坐标轴轴线不显示
              },
              axisLabel: {
                show: false // 坐标轴刻度不显示
              },
              splitLine: {
                show: true, // 坐标轴在区域中的分隔线
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            yAxis: {
              axisLine: {
                lineStyle: {
                  color: '#000',
                  opacity: 0.2
                }
              },
              axisLabel: {
                show: true,
                formatter: function (value) {
                  return (value.length > 7 ? (value.slice(0, 7) + '...') : value)
                }
              },
              triggerEvent: true
            },
            color: ['#60ACFC'],
            series: [{
              type: 'bar',
              data: [],
              barWidth: 12,
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              }
            }]
          }
        },
        chart3: {
          name: 'chart3',
          type: 'pieChart',
          width: '100%',
          height: '250px',
          data: [
          ],
          option: {
            color: ['#60ACFC', '#9ADD7E', '#BEC2C1']
          }
        }
      }
    },
    methods: {
      getList() {
        this.period = this.formData()
        this.period.timeType = parseInt(this.period.timeType)
        this.period.typeUuid = this.safeTaskUuid
        this.getMap1()
        this.getMap2()
        this.getMap3()
        this.getMap4()
      },
      formData() {
        let start = this.$refs.selecttime.formatBegin
        let end = this.$refs.selecttime.formatEnd
        let type = this.$refs.selecttime.period
        let startTime = ''
        let endTime = ''
        typeof start === 'number' ? startTime = start / 1000 : startTime = (start.getTime()) / 1000
        typeof end === 'number' ? endTime = end / 1000 : endTime = (end.getTime()) / 1000
        let data = {
          startTime: startTime,
          endTime: endTime,
          timeType: type
        }
        return data
      },
      DownloadHandle(type) {
        let vm = this;
        $axios.post('/safetyPlatform/report/createSingleTypeTaskInfoFile', Object.assign({}, vm.period, {exportType: type})).then((res) => {
          if (res.data === true) {
            Download(`/safetyPlatform/report/exportSingleTypeTaskInfoFile/${this.safeTaskUuid}/${type}`);
          }
        });
      },
      getMap1() {
        $axios.post('/safetyPlatform/report/allTypeTaskTrend', this.period).then(res => {
          let Arr = []
          for (let i in res.data) {
            Arr.push({
              name: i,
              value: res.data[i]
            })
          }
          this.chart1.data = Arr
        })
      },
      getMap4() {
        $axios.post(`/safetyPlatform/report/getSingleTypeTaskInfo`, Object.assign({}, this.period)).then((res) => {
          this.topLists = res.data;
        });
      },
      getMap2() {
        $axios.post('/safetyPlatform/report/singleTypeTaskCreateUserTop', this.period).then(res => {
            let data = []
            this.chart2.opt.series[0].data = []
            if (Object.keys(res.data).length > 0) {
              for (let key in res.data) {
                var param = {
                  value: 0,
                  name: ''
                };
                param.name = key;
                param.value = res.data[key];
                this.chart2.opt.series[0].data.push(param.value)
                data.push(param)
              }
              data = data.splice(0, 5)
              let msg = {}
              for (let item in data) {
                msg[data[item].name] = parseInt(data[item].value);
              }
              this.chart2.data = msg;
            } else {
              this.chart2.data = {};
            }
          })
      },
      getMap3() {
        $axios.post('/safetyPlatform/report/singleTypeTaskCompleteInfo', this.period).then(res => {
          let Arr = []
          for (let i in res.data) {
            Arr.push({
              name: i,
              value: res.data[i]
            })
          }
          this.chart3.data = Arr
        })
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>

