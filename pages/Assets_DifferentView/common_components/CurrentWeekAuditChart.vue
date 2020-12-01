/**
* Created by dgunzi on 2019/02/25.
*/
<template>
  <s-card class="box-card" style="height: 350px;">
    <div slot="header" class="clearfix">
        <span class="card-title">
          本周审核情况统计
        </span>
    </div>
    <div style="width: 100%; height: 370px;margin-top: 10px">
      <s-charts :chart="auditChart"></s-charts>
    </div>
  </s-card>
</template>

<script>
     import $axios from 'sunflower-ajax'
    export default {
        name: 'currentWeekAuditChart',
        data() {
          let options = {
            legend: {
              right: 0,
              data: []
            },
            tooltip: {},
            color: ['#A7F585', '#FF766F', '#CDD4E7'],
            series: [
              {
                type: 'pie',
                radius: '55%',
                label: {
                  normal: {
                    formatter: '{d}%',
                    color: '#919191'
                  }
                },
                data: []
              }
            ]
          };
          return {
            auditChart: {
              el: 'auditChart',
              type: 'baseChart',
              width: '100%',
              height: '300px',
              opt: options
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
            $axios.get('/operationLogStat/getApproveStateByItcomp/' + this.uuid).then(res => {
              for (let i in res.data) {
                this.auditChart.opt.legend.data.push(res.data[i].name);
                let newObj = {
                  value: parseInt(res.data[i].value),
                  name: res.data[i].name
                }
                this.auditChart.opt.series[0].data.push(newObj)
              }
            })
          }
        }
    }
</script>

<style scoped>

</style>
