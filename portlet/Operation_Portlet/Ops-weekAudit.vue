/**
* Created by alex on 2018/12/4.
*/
<template>
  <div>
    <s-card-diy :title="'本周审核情况统计'" :more-click="goto">
      <div style="width: 100%">
        <s-chart :chart="auditChart"></s-chart>
      </div>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        auditChart: {
          name: 'auditChart',
          type: 'pieChart',
          width: '100%',
          height: '100%',
          data: '',
          option: {
            series: [{
              radius: '85%'
            }]
          }
        }
      }
    },
    created() {
      $axios.get('/operationCenter/getCheckStateByWeek').then((res) => {
        this.auditChart.data = res.data
      });
    },
    methods: {
      goto() {
        this.$router.push('/OperationCenter/oper_auditstatistic')
      }
    }
  }
</script>
