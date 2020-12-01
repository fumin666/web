<template>
  <!--自定义首页 我的工单数量汇总-->
  <div class="diy-process-myOrdersNumber">
    <s-card-diy
      title="我的工单数量汇总"
      :show-more="false"
      show-scrollbar
    >
      <s-chart :chart="chart1" v-if="chart1.data.length"></s-chart>
      <div v-nodata="true" v-else style="height: 250px"></div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import { merge } from 'lodash';
  import ringChartOption from '@/components/chart/pieChartOption.js'
  export default {
    name: 'process-myOrdersNumber',
    data() {
      return {
        chart1: {
          name: 'myOrdersNumber',
          type: 'pieChart',
          width: '100%',
          height: '250px',
          data: [],
          option: {
            legend: {
              left: 'center',
              orient: 'horizontal'
            },
            color: ['#5BC49F', '#71B3FA', '#32D3EB'],
            series: [{
              type: 'pie',
              radius: '50%'
            }]
          }
        },
        roundOption: {
          legend: {
            y: '90%',
            y1: '10px'
          },
          series: [{
            type: 'pie',
            center: ['50%', '45%'],
            radius: '60%'
          }]
        }
      }
    },
    created() {
      this.getData();
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
    },
    components: {
    },
    methods: {
      getTheme(val) {
        if (val === 'dark') {
          this.chart1.option = merge({}, this.chart1.option, ringChartOption.dark, this.roundOption)
        } else {
          this.chart1.option = merge({}, this.chart1.option, ringChartOption.light, this.roundOption)
        }
      },
      getData() {
        let _this = this
        $axios.get('/itilWorkflowCenter/getUserOrdersState').then(res => {
          if (res) {
            var data = [];
            for (let key in res.data) {
              var param = {
                value: 0,
                name: ''
              };
              for (let item in res.data[key]) {
                param.value += res.data[key][item];
                param.name = key;
              }
              data.push(param)
            }
            _this.chart1.data = data
          }
        })
      }
    }
  }
</script>
