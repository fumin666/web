<template>
  <section id="knowledgeTaskPrint">
    <!--<h2 class="printTitle">知识库打印预览</h2>-->
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">知识库文章编号</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.serialCode}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">标题</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.briefDesc}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">问题描述</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.detailDesc}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">解决方案</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.solutionText}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">知识库类别</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.knowledgeTypeName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">知识分类一级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.categoryFirstName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">知识分类二级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.categorySecondName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">知识分类三级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.categoryThirdName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">应用系统名称</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.appSystemName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">公司</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.companyName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">关键字</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.keyword}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">知识库管理员</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.adminGroupName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">IT内部运维使用</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.isItOperation === 1 ? '是' : '否'}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">审批意见</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.refuseReason}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">提交时间</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.createTime}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">状态</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.knowledgeStatusName}}</s-col>
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
      $axios.get(`/itilKnowledgeOrder/getKnowledgeOrderDetail/${this.uuid}`).then(({data}) => {
        if (data) {
          this.detail = data
//          this.detail.riskLevelStr = this.detail.changeRiskLevelMap[this.detail.riskLevel]
//          this.detail.changePathStr = this.detail.changePathMap[this.detail.changePath]
//          this.detail.changeRequestUser_company = this.detail.createUserCompanyOrgDepart.companyName
//          this.detail.changeRequestUser_org = this.detail.createUserCompanyOrgDepart.organizationName
//          this.detail.changeRequestUser_depart = this.detail.createUserCompanyOrgDepart.departName
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
