<template>
  <section id="modifyTaskPrint">
    <h2 class="printTitle">变更单详情</h2>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更单编号</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.serialCode}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更请求人公司</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.changeRequestUser_company}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更请求人组织</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.changeRequestUser_org}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更请求人部门</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.changeRequestUser_depart}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更分类一级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.categoryFirstName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更分类二级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.categorySecondName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更分类三级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.categoryThirdName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">简要描述</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.briefDesc}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">详细描述</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.detailDesc}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">风险级别</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.riskLevelStr}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更路径</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.changePathStr}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">受影响单位</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.effectOrgnizitionName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更经理</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.managerUserName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">变更管理员</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.adminUserName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">计划开始时间</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.planStartTime}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">计划结束时间</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.planEndTime}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">提交时间</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.createTime}}</s-col>
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
    methods: {},
    created() {
      $axios.get(`/itilChangeOrder/getChangeOrderDetail/${this.uuid}`).then(({data}) => {
        if (data) {
          this.detail = data
          this.detail.riskLevelStr = this.detail.changeRiskLevelMap[this.detail.riskLevel]
          this.detail.changePathStr = this.detail.changePathMap[this.detail.changePath]
          this.detail.changeRequestUser_company = this.detail.createUserCompanyOrgDepart.companyName
          this.detail.changeRequestUser_org = this.detail.createUserCompanyOrgDepart.organizationName
          this.detail.changeRequestUser_depart = this.detail.createUserCompanyOrgDepart.departName
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
