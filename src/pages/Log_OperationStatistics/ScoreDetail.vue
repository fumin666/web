/**
 * @author fumin
 * @date 2019/7/29
 * @Description: 报表中心 -> 运维审计报表 -> 智能审计 -> 智能评分详细弹框
*/
<template>
  <div>
    <div style="margin: 22px 0;">
      智能评分 xx  =  100  - 风险级别高的个数 * 风险级别高的分值 –
      风险级别较高的个数 * 风险级别较高的分值 – 风险级别中的个数 * 风险级别中的分值
      – 风险级别较低的个数 * 风险级别较低的分值 – 风险级别低的个数 * 风险级别低的分值
    </div>
    <div style="margin-bottom: 15px;">* 会话阻断次数大于0时，智能评分为0</div>
    <span>{{score}}</span>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
    export default {
      data() {
        return {
          score: ''
        }
      },
      methods: {
        getScore(scoreData) {
          $axios.get(`/operationLogStat/viewScoreDetail/${scoreData.uuid}`).then((res) => {
            this.score = res.data
          })
        }
      },
      created() {
        this.getScore(this.scoreData)
      },
      props: {
        scoreData: {
          type: Object
        }
      }
    }
</script>

<style scoped>

</style>
