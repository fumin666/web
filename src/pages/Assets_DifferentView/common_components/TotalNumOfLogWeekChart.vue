/**
* Created by dgunzi on 2019/02/21.
* 本周日志总数统计
*/
<template>
  <s-card class="box-card" style="height: 350px;">
    <div slot="header" class="clearfix">
      <span class="card-title">
        本周日志总数统计
      </span>
    </div>
    <div>
     <s-chart :chart="chart4"></s-chart>
    </div>
  </s-card>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
      name: 'TotalNumOfWeekChart',
      data() {
        return {
          chart4: {
            name: 'chart4',
            type: 'rainbowBarChart',
            width: '50%',
            height: '320px',
            data: {
            }
          }
        }
      },
      created() {
        let uuid = this.$route.params.assetUuid
        $axios.get(`/searchManage/getLogInfoFor7Day/${uuid}`).then(({data}) => {
          this.chart4.data = data
        })
      }
  }
</script>
