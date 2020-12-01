<!--
 * @Author: songyf
 * @Date: 2020-2-19
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置-通报类型设计器-表单定义
 -->
<template>
  <section id="defineForm">
    <s-row class="step-title">
      通报类型表单属性定义
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
