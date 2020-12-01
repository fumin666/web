<template>
  <section id="modifyTaskPrint">
    <h2 class="printTitle">发布单详情</h2>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">发布单号</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.serialCode }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">受益人公司</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.benefitCompanyStr }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">受益人姓名</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.benefitPersonStr }}</s-col>
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
      <s-col span="7" class="title grid-content bg-purple">发布分级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light"> {{ detail.publishLevel }} </s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">业务理由</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.businessReason }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">发布类型</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.publishType }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">应用系统</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.appSystem }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">目标完成时间</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.planFinishTimeStr }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">分类一级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.categoryFirstName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">分类二级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.categorySecondName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">分类三级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.categoryThirdName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">影响度</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.impactLevel }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">紧急性</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.emergencyLevel }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">优先级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.priorityLevel }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">风险级别</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.riskLevel }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">发布经理组</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.managerGroupName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">发布经理</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.managerUserName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">发布协调员组</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.coordinateGroupName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">发布协调员</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.coordinateUserName }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">提交时间</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.createTime }}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">状态</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{ detail.publishStatusName }}</s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
//  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
      }
    },
    props: {
      detail: {
        type: Object,
        required: true
      }
    },
    filters: {
    },
    methods: {},
    created() {
    },
    watch: {
      'detail.publishLevel': {
        deep: true,
        handler: function (val) {
          for (let i in this.detail.publishLevelMap) {
            if (parseInt(i) === val) {
              this.detail.publishLevel = this.detail.publishLevelMap[i];
            }
          }
        }
      },
      'detail.businessReason': {
        deep: true,
        handler: function (val) {
          for (let i in this.detail.businessReasonMap) {
            if (parseInt(i) === val) {
              this.detail.businessReason = this.detail.businessReasonMap[i];
            }
          }
        }
      },
      'detail.publishType': {
        deep: true,
        handler: function (val) {
          for (let i in this.detail.publishTypeMap) {
            if (parseInt(i) === val) {
              this.detail.publishType = this.detail.publishTypeMap[i];
            }
          }
        }
      },
      'detail.impactLevel': {
        deep: true,
        handler: function (val) {
          for (let i in this.detail.impactLevelMap) {
            if (parseInt(i) === val) {
              this.detail.impactLevel = this.detail.impactLevelMap[i];
            }
          }
        }
      },
      'detail.emergencyLevel': {
        deep: true,
        handler: function (val) {
          for (let i in this.detail.emergencyLevelMap) {
            if (parseInt(i) === val) {
              this.detail.emergencyLevel = this.detail.emergencyLevelMap[i];
            }
          }
        }
      },
      'detail.priorityLevel': {
        deep: true,
        handler: function (val) {
          for (let i in this.detail.priorityLevelMap) {
            if (parseInt(i) === val) {
              this.detail.priorityLevel = this.detail.priorityLevelMap[i];
            }
          }
        }
      },
      'detail.riskLevel': {
        deep: true,
        handler: function (val) {
          for (let i in this.detail.riskLevelMap) {
            if (parseInt(i) === val) {
              this.detail.riskLevel = this.detail.riskLevelMap[i];
            }
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
