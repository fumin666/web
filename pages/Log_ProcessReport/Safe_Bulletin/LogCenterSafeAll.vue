<template>
  <section class="content" style="margin: 20px 0 20px 5px">
    <s-form :inline="true" class="search_form">
      <div class="form_item">
        <select-time ref="selecttime"></select-time>
      </div>
      <div class="search_btn">
        <s-button title="查询" icon="magnifier" @click="getList">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
    </s-row>
    <div style="margin:20px 0;font-weight:bold;font-size:14px">安全通报趋势图</div>
    <div>
      <s-chart :chart="chart1" v-if="chart1.data.length"></s-chart>
      <div v-nodata="true" v-else style="height: 250px"></div>
    </div>
    <div style="margin:20px 0;font-weight:bold;font-size:14px">安全通报数量统计</div>
    <div>
      <s-chart v-if="chart2.data.length" :chart="chart2"></s-chart>
      <div v-nodata="true" v-else style="height: 250px"></div>
    </div>
    <div style="margin:20px 0;font-weight:bold;font-size:14px">安全通报数量分析</div>
    <s-table-page :data="topLists">
      <s-table-column label="通报类型名称" prop="safeTypeName"></s-table-column>
      <s-table-column label="通报数量" prop="safeTaskAmount"></s-table-column>
      <s-table-column label="通报类型占比" prop="safeTypeProportion"></s-table-column>
      <s-table-column label="已完成通报数量" prop="safeTaskCompleteAmount"></s-table-column>
      <s-table-column label="已完成通报占比" prop="safeTaskCompleteProportion"></s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  import SelectTime from '@/pages/Log_DbAudits/components/DBSelectTime'
  export default {
    components: {
      SelectTime
    },
    data() {
      return {
        params: {
          dbName: '',
          cmd: '',
          accountName: '',
          type: 'ddl'
        },
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
          name: 'chart2',
          type: 'rainbowBarChart',
          width: '100%',
          height: '450px',
          data: {},
          option: {
            grid: {
              left: '4%',
              right: '4%',
              bottom: '20%'
            },
            // series: [{
            //   barWidth: 30
            // }],
            xAxis: [{
                // axisLabel: {

                //   showMinLabel: 2,
                //   rotate: 0
                // }
                axisLabel: {
                  show: true,
                  interval: 0,
                  formatter: function(params) {
                    var newParamsName = '';// 最终拼接成的字符串
                    var paramsNameNumber = params.length;// 实际标签的个数
                    var provideNumber = 6;// 每行能显示的字的个数
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                    /**
                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                     */
                    // 条件等同于rowNumber>1
                    if (paramsNameNumber > provideNumber) {
                        /** 循环每一行,p表示行 */
                        for (var p = 0; p < rowNumber; p++) {
                            var tempStr = '';// 表示每一次截取的字符串
                            var start = p * provideNumber;// 开始截取的位置
                            var end = start + provideNumber;// 结束截取的位置
                            // 此处特殊处理最后一行的索引值
                            if (p === rowNumber - 1) {
                                // 最后一次不换行
                                tempStr = params.substring(start, paramsNameNumber);
                            } else {
                                // 每一次拼接字符串并换行
                                tempStr = params.substring(start, end) + '\n';
                            }
                            newParamsName += tempStr;// 最终拼成的字符串
                        }
                  } else {
                        // 将旧标签的值赋给新标签
                        newParamsName = params;
                    }
                    // 将最终的字符串返回
                    return newParamsName
                  }
                }
            }]
          }
        }
      }
    },
    methods: {
      getList() {
        var vm = this;
        this.period = this.formData()
        this.period.timeType = parseInt(this.period.timeType)
        $axios.post(`/safetyPlatform/report/allTypeTaskAmountAnalyze`, Object.assign({}, vm.period)).then((res) => {
          vm.topLists = res.data;
        });
        this.getChart1();
        this.getChart2();
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
        $axios.post('/safetyPlatform/report/createAllTypeTaskAmountAnalyzeFile', Object.assign({}, vm.period, {exportType: type})).then((res) => {
          if (res.data === true) {
            Download(`/safetyPlatform/report/exportAllTypeTaskAmountAnalyzeFile/${type}`);
          }
        });
      },
      getChart1() {
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
      getChart2() {
        $axios.post('/safetyPlatform/report/allTypeTaskAmountStatistics', this.period).then((res) => {
          let data = []
          for (let key in res.data) {
            data.push({name: key, value: parseInt(res.data[key])})
          }
          this.chart2.data = data
        });
      }
    },
    mounted() {
      this.getList();
      this.getChart1();
      this.getChart2();
    }
  }
</script>
