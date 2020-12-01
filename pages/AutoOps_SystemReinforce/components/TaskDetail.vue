/**
* Created by alex on 2018/8/22.
*/
<template>
  <section class="view-box" id="view-box">
    <s-table-page :data='taskList'
                  :header-search='getSearchDef()'>
      <s-table-column
        prop="ipAddress"
        label="IP地址">
      </s-table-column>
      <s-table-column
        prop="productName"
        label="操作系统">
      </s-table-column>
      <s-table-column
        prop="templateName"
        label="模版">
      </s-table-column>
      <s-table-column
        prop="complianceNum"
        label="合规数">
      </s-table-column>
      <s-table-column
        prop="noComplianceNum"
        label="不合规数">
      </s-table-column>
      <s-table-column
        label="合规率趋势">
        <template slot-scope="scope">
          <span v-if="editData.isPeriod === '1'" @click="chartEnter(scope.row)"><i class="iconfont icon-trend" style="font-size: 32px;"></i></span>
          <span v-else> -- </span>
        </template>
      </s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="viewHandler(scope.row)" title="查看详情"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      width="800px"
      title="加固检查项结果详情"
      append-to-body>
      <reinforce-detail :checkUuid="uuid"></reinforce-detail>
    </s-dialog>
    <s-dialog
      v-model="flag"
      v-if="flag"
      width="700px"
      top="10%"
      title="近期合规率趋势"
      append-to-body>
      <s-chart :chart="chart"></s-chart>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import ReinforceDetail from '../components/ReinforceDetail'
  import $axios from 'sunflower-ajax'
  import { merge } from 'lodash'
  import lineChartOption from '@/components/chart/lineChartOption.js'
  export default {
    data () {
      return {
        viewDialog: false,
        taskList: [],
        uuid: '',
        chart: {
          name: 'chart',
          type: 'lineChart',
          width: '600px',
          height: '200px',
          option: {
            dataZoom: {type: 'inside', show: true, realtime: true, start: 0, end: 100},
            grid: {
              x: 40,
              x2: 10
            },
            xAxis: [{
              axisLabel: {
                interval: 0,
                formatter: function(value) {
                  let ret = '';     // 拼接加\n返回的类目项
                  let maxLength = 5;      // 每项显示文字个数
                  let valLength = value.length;     // X轴类目项的文字个数
                  let rowN = Math.ceil(valLength / maxLength);      // 类目项需要换行的行数
                  // 如果类目项的文字大于3,
                  if (rowN > 1) {
                    for (let i = 0; i < rowN; i++) {
                      let temp = '';      // 每次截取的字符串
                      let start = i * maxLength;        // 开始截取的位置
                      let end = start + maxLength;      // 结束截取的位置
                      // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                      temp = value.substring(start, end) + '\n';
                      ret += temp;      // 凭借最终的字符串
                    }
                    return ret;
                  } else {
                    return value;
                  }
                }
              }
            }],
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: function (params) {
                return params[0].name + '<br/>合规率：' + params[0].data + '%'
              }
            }
          },
          data: []
        },
        flag: false,
        currentIp: ''
      }
    },
    props: {
      taskUuid: {
        type: String,
        default: ''
      },
      editData: {
        type: Object,
        default: {}
      }
    },
    created() {
      this.getTaskList()
    },
    mounted() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
    },
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    },
    methods: {
      getTheme(val) {
        if (val === 'dark') {
          this.chart.option = merge({}, this.chart.option, lineChartOption.dark)
        } else {
          this.chart.option = merge({}, this.chart.option, lineChartOption.light)
        }
      },
      chartEnter(row) {
        this.flag = true
        this.chart.data = row.data
      },
      getTaskList() {
        $axios.get(`/automateSystemFasten/getSystemFastenTaskExecuteResultByUuid/${this.taskUuid}`).then((res) => {
          function getChartData() {
            res.data.map(item => {
              item.data = []
              for (let key in item.trendDate) {
                item.data.push({name: key, value: item.trendDate[key]})
              }
            })
            return res.data
          }
          getChartData()
          this.taskList = res.data
        })
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['ipAddress', 'name', 'templateName']
        }
      },
      viewHandler(row) {
        this.viewDialog = true;
        this.uuid = row.uuid
        this.currentIp = row.ipAddress
      }
    },
    components: {
      ReinforceDetail
    }
  }
</script>
<style>
</style>
