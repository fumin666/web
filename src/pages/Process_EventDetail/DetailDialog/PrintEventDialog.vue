<template>
  <section id="modifyTaskPrint">
    <h2 class="printTitle">事件单详情</h2>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">事件单编号</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.serialCode}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">最终用户姓名</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.endUserName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">简要描述</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.briefDesc }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">详细描述</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.detailDesc }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">事件分类一级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.categoryFirstName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">事件分类二级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.categorySecondName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">事件分类三级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.categoryThirdName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">事件来源</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.incidentSource }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">紧急性</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.criticality }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">影响度</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.effect }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">处理组</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.assignGroupName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">处理人</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.assignUserName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">状态</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.incidentStatus }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">解决方案</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.solutioninfo }}</s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        detail: {}
      }
    },
    props: {
      uuid: {
        type: String,
        required: true
      }
    },
    methods: {
      filterIncidentSource(val) {
        for (let i in this.detail.incidentSourceMap) {
          if (parseInt(i) === val) {
            return this.detail.incidentSourceMap[i];
          }
        }
      },
      filterCriticality(val) {
        for (let i in this.detail.criticalityMap) {
          if (parseInt(i) === val) {
            return this.detail.criticalityMap[i];
          }
        }
      },
      filterEffect(val) {
        for (let i in this.detail.effectMap) {
          if (parseInt(i) === val) {
            return this.detail.effectMap[i];
          }
        }
      },
      filterIncidentStatus(val) {
        for (let i in this.detail.statusMap) {
          if (parseInt(i) === val) {
            return this.detail.statusMap[i];
          }
        }
      }
    },
    created() {
      $axios.get(`/itilIncidentCenter/getItilIncidentOrderByUuid/${this.uuid}`).then(({data}) => {
        if (data) {
          this.detail = data
          this.detail.incidentSource = this.filterIncidentSource(this.detail.incidentSource);
          this.detail.criticality = this.filterCriticality(this.detail.criticality);
          this.detail.effect = this.filterEffect(this.detail.effect)
          this.detail.incidentStatus = this.filterIncidentStatus(this.detail.incidentStatus);
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
