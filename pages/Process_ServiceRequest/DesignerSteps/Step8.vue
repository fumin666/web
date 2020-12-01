/*原来的step7.vue，删除step7后，将原来的step7.vue迁移至step8.vue中（暂时不使用）*/
<template>
  <section id="notification">
    <s-row class="step-title">
      设置服务请求邮件通知
      <span class="title-tip">--{{$store.state.serviceRequest.requestName}}</span>
    </s-row>
    <s-checkbox-group v-model="notificationForm.noticeRules">
      <s-checkbox label="0">启动审批时通知审批人</s-checkbox></br>
      <s-checkbox label="1">启动审批通过时通知最终用户</s-checkbox></br>
      <s-checkbox label="2">已指派时通知受派者</s-checkbox></br>
      <s-checkbox label="3">进行时通知最终用户</s-checkbox></br>
      <s-checkbox label="4">已完成时通知最终用户</s-checkbox></br>
      <s-checkbox label="5">待决时通知最终用户</s-checkbox></br>
      <s-checkbox label="6">已拒绝时通知受派者</s-checkbox></br>
      <s-checkbox label="7">已取消时通知最终用户</s-checkbox></br>
    </s-checkbox-group>
  </section>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        notificationForm: {
          noticeRules: ['0', '1', '2', '3', '4', '5', '6', '7']
        }
      }
    },
    methods: {
    },
    created() {},
    // <keep-alive>切换到当前组件触发该钩子
    activated() {
      let state = this.$store.state.serviceRequest;
      // 编辑设计器时，获取编辑回显数据
      if (state.editDesigner) {
        this.notificationForm.noticeRules = [];
        if (state.editDesigner.editData.itilRequestDesigner.noticeRules) {
          this.notificationForm.noticeRules = state.editDesigner.editData.itilRequestDesigner.noticeRules.split(',');
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #notification
  .s-checkbox-group .s-checkbox
  margin-bottom 20px
</style>
