<template>
  <section id="modifyTaskPrint">
    <h2 class="printTitle">服务请求详情</h2>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">请求编号</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.serialCode}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">最终用户公司</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.endCompanyName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">最终用户姓名</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.endUserName}}</s-col>
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
      <s-col span="7" class="title grid-content bg-purple">分类一级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.categoryFirstName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">分类二级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.categorySecondName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">分类三级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.categoryThirdName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">应用系统</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.application}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">目标完成时间</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.finishTime}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">优先级</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.priority}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">请求管理员组</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.managerGroupName}}</s-col>
    </s-row>
    <s-row class="dataRow">
      <s-col span="7" class="title grid-content bg-purple">请求管理员</s-col>
      <s-col span="17" class="value grid-content bg-purple-light">{{detail.managerUserName}}</s-col>
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
      $axios.get(`/itilServiceRequest/getRequestOrderDetail/${this.uuid}`).then(({data}) => {
        if (data) {
          this.detail = data
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
