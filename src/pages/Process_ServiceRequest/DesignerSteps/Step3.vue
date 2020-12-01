<template>
  <section id="defineForm">
    <s-row class="step-title">
      定义服务请求提交表单字段
      <span class="title-tip">--{{$store.state.serviceRequest.requestName}}</span>
    </s-row>
    <s-row>
      <drag-form ref="dragForm"></drag-form>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import dragForm from '../dragForm/DragForm';

  export default {
    data() {
      return {
      }
    },
    components: {
      dragForm
    },
    methods: {
    },
    created() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
