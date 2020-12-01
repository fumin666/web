/**
* Created by dgunzi on 2019/02/26.
* 本周运维量统计
*/
<template>
  <s-card class="box-card" style="height: 350px;">
    <div slot="header" class="clearfix">
        <span class="card-title">
          本周运维量统计
        </span>
    </div>
    <div style="width: 100%; height: 370px;margin-top: 10px">
      <s-charts :chart="currentWeekOpChart"></s-charts>
    </div>
  </s-card>
</template>

<script>
  import $axios from 'sunflower-ajax'
    export default {
        name: 'CurrentWeekOpChart',
        data() {
            return {
              currentWeekOpChart: {
                el: 'currentWeekOpChart',
                type: 'lineBarChart',
                width: '100%',
                height: '300px',
                data: {}
              }
            }
        },
        created() {
          this.getData();
        },
      props: {
        uuid: {
          type: String,
          default: ''
        }
      },
        methods: {
          getData() {
            $axios.get('/operationLogStat/getOperationWorkloadByItcomp/' + this.uuid).then(res => {
              this.currentWeekOpChart.data = {
                group: res.data.group,
                order: res.data.order
              }
            })
          }
        }
    }
</script>

<style scoped>

</style>
