/**
* Created by alex on 2018/4/19.
*/
<template>
  <s-row type="flex">
    <s-col :span="12">
      <div class="process-manage-kpiitem" :style="{height: contentHeight/2 - 30 + 'px' }">
        <span class='process-manage-kpiitem-title'>特殊运维类型统计</span>
        <div v-nodata="!operationChart1.data.length">
          <s-chart :chart="operationChart1" v-if="operationChart1.data.length"></s-chart>
        </div>
      </div>
    </s-col>
    <s-col :span="12">
      <div class="process-manage-kpiitem" :style="{height: contentHeight/2 - 30 + 'px' }">
        <span class='process-manage-kpiitem-title'>特殊运维工单趋势图</span>
        <span class='process-manage-kpiitem-title fr'>
            <s-select v-model="dayNum" @change="getNewChart">
              <s-option label="一周" value="1"></s-option>
              <s-option label="一月" value="2"></s-option>
            </s-select>
        </span>
        <div v-nodata="!operationChart3.data.length">
          <s-chart :chart="operationChart3" v-if="operationChart3.data.length"></s-chart>
        </div>
      </div>
    </s-col>
    <s-col :span="12">
      <div class="process-manage-kpiitem" :style="{height: contentHeight/2 - 30 + 'px' }">
        <span class='process-manage-kpiitem-title'>审批通过成功率</span>
        <div v-nodata="!operationChart2.data.length">
          <s-chart :chart="operationChart2" v-if="operationChart2.data.length"></s-chart>
        </div>
      </div>
    </s-col>
    <s-col :span="12">
      <div class="process-manage-kpiitem" :style="{height: contentHeight/2 - 30 + 'px' }">
        <span class='process-manage-kpiitem-title'>工作量统计</span>
        <span class='process-manage-kpiitem-title fr'>
            <s-select v-model="stasticType" @change="getNewCharts">
              <s-option label="人员" value="0"></s-option>
              <s-option label="机构" value="1"></s-option>
            </s-select>
        </span>
        <div v-nodata="!Object.keys(operationChart5.data).length">
          <s-charts :chart="operationChart5" v-if="Object.keys(operationChart5.data).length"></s-charts>
        </div>
      </div>
    </s-col>
  </s-row>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default {
    data () {
      return {
        contentHeight: '',
        operationChart1: {
          name: 'chart2',
          type: 'colorfulBarChart',
          width: '100%',
          height: '85%',
          data: []
        },
        operationChart2: {
          name: 'operationChart2',
          type: 'pieChart',
          width: '100%',
          height: '85%',
          data: [],
          option: {
            color: ['#2ec7c9', '#b6a2de'],
            series: [{
              type: 'pie',
              radius: '85%'
            }]
          }
        },
        operationChart3: {
          name: 'operationChart3',
          type: 'lineChart',
          width: '100%',
          height: '85%',
          data: [],
          option: {
            series: [{
              smooth: true,
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            }]
          }
        },
        operationChart5: {
          el: 'operationChart5',
          type: 'threeBarChart',
          width: '100%',
          height: '85%',
          data: {}
        },
        stasticType: '0',
        dayNum: '1'
      }
    },
    created() {
      this.contentHeight = window.outerHeight - 300
      this.getInitData()
    },
    methods: {
      getInitData() {
        $axios.get('/specialOperationApply/operationTypeKpi').then(res => {
          if (res.status === 200) {
            this.operationChart1.data = res.data.data
          } else {
            this.$message({
              message: '获取数据失败，请重试',
              type: 'error'
            });
          }
        });
        $axios.get('/specialOperationApply/operationFinishedCount').then(res => {
          if (res.status === 200) {
            this.operationChart2.data = res.data.data
          } else {
            this.$message({
              message: '获取数据失败，请重试',
              type: 'error'
            });
          }
        });
        this.getDayOrMonth(this.dayNum)
        this.getKpiLoad(this.stasticType)
      },
      getKpiLoad(v) {
        $axios.get('/specialOperationApply/kpiWorkloads/4/' + v).then(res => {
          if (res.status === 200) {
            if (res.data.order && Object.keys(res.data.order).length) {
              this.operationChart5.data = res.data
            }
          } else {
            this.$message({
              message: '获取数据失败，请重试',
              type: 'error'
            });
          }
        });
      },
      getDayOrMonth(v) {
        $axios.get('/specialOperationApply/operationDayNum/' + v).then(res => {
          if (res.status === 200) {
            this.operationChart3.data = res.data.data
          } else {
            this.$message({
              message: '获取数据失败，请重试',
              type: 'error'
            });
          }
        });
      },
      getNewChart(val) {
        this.getDayOrMonth(val)
      },
      getNewCharts(val) {
        this.getKpiLoad(val)
      }
    }
  }
</script>
