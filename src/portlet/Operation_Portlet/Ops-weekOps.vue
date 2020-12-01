/**
* Created by alex on 2018/12/4.
*/
<template>
  <div>
    <s-card-diy :title="'本周运维量统计'" :more-click="goto">
      <div style="width: 100%">
        <s-charts :chart="operChart"></s-charts>
      </div>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        operChart: {
          el: 'opsWeekChart',
          type: 'lineBarChart',
          width: '100%',
          height: '100%',
          data: {},
          opt: {
            tooltip: {
              show: true,
              formatter: function(params) {
                let str = params[0].name;
                for (let i = 0; i < params.length; i++) {
                  str += '<br/>' + params[i].marker + params[i].seriesName + ': ' + params[i].value
                }
                str += '分钟';
                return str;
              }
            }
          }
        }
      }
    },
    created() {
      $axios.get('/operationCenter/getUserOperationWorkloadByWeek').then((res) => {
        this.operChart.data = res.data
      });
    },
    methods: {
      goto() {
        this.$router.push('/OperationCenter/oper_statistic')
      }
    }
  }
</script>
