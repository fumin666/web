/**
* Created by dgunzi on 2019/02/21.
* 本周审计总数统计
*/
<template>
  <s-card class="box-card" style="height: 350px;">
    <div slot="header" class="clearfix">
      <span class="card-title">
        本周审计总数统计
      </span>
    </div>
    <div>
      <s-chart :chart="chart"></s-chart>
    </div>
  </s-card>
</template>

<script>
    import $axios from 'sunflower-ajax';
    import Bus from '@/plugins/eventBus'
    export default {
        name: 'TotalNumOfWeekChart',
        data() {
            return {
              chart: {
                name: 'chart',
                type: 'rainbowBarChart',
                width: '100%',
                height: '310px',
                data: []
              },
              dbiUuid: ''
            }
        },
        created() {
          this.getChartData();
        },
        mounted () {
        },
        methods: {
          getChartData () {
            Bus.$on('setDbiUuid', (val) => { // 错误#55866，无数据，等待测试中
              this.dbiUuid = val;
              $axios.get(`/dbauditReport/dbiAuditWeek/${this.dbiUuid}`).then(res => {
                if (res.data && res.data instanceof Array) {
                  this.chart.data = res.data;
                }
              });
            });
          }
        }
    }
</script>

<style scoped>

</style>
