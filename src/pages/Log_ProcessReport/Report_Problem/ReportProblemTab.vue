/**
* Created by songyf on 2019/7/29.
* 报表中心-流程统计报表-问题流程报表.
*/

<template>
  <div style="margin: 20px 0 20px 5px">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="问题详情分类统计" name="pane1" v-if="judgeRoleBtn('logCenter_problemDetails')">
        <problem-details v-if="activeTab === 'pane1'"></problem-details>
      </s-tab-pane>
      <s-tab-pane label="未完成详情内容分类统计" name="pane2" v-if="judgeRoleBtn('logCenter_problemComplete')">
        <problem-unfinished v-if="activeTab === 'pane2'"></problem-unfinished>
      </s-tab-pane>
      <s-tab-pane label="问题成功解决情况统计" name="pane3" v-if="judgeRoleBtn('logCenter_problemSucceedSolve')">
        <problem-solve v-if="activeTab === 'pane3'"></problem-solve>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import ProblemDetails from './ProblemDetails'
  import ProblemUnfinished from './ProblemUnfinished'
  import ProblemSolve from './ProblemSolve'
  export default {
    data() {
      return {
        tabNameArr: ['logCenter_problemDetails', 'logCenter_problemComplete', 'logCenter_problemSucceedSolve'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      ProblemDetails,
      ProblemUnfinished,
      ProblemSolve
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
<style lang="stylus">

</style>
