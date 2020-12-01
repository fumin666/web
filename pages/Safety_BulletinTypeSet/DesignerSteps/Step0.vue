<!--
 * @Author: songyf
 * @Date: 2020-2-19
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置-通报类型设计器-设计器概述
 -->
<template>
  <section id="guide">
    <s-row class="step-title">设计器使用引导</s-row>
    <s-row class="guide-tip" style="opacity: 0.65;font-size: 14px;">设计一套自己企业使用的安全通报，您需要完成以下几步： </s-row>
    <s-row>
      <ul class="guide-text" style="opacity: 0.65;font-size: 14px;">
        <li>1. 定义通报类型的名称和类型 </li>
        <li>2. 定义通报类型的表单属性 </li>
        <li>3. 针对通报类型的的分类，设计流程结点及走向信息</li>
      </ul>
    </s-row>
    <s-row class="choice">你可以选择以下操作：</s-row>
    <s-row>
      <s-button @click="createDesigner" >{{bulletinState !== null ? '编辑' : '创建'}}</s-button>
      <s-button @click="cancel" type="cancel">取消</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import Bus from '@/plugins/eventBus';

  export default {
    data() {
      return {
      }
    },
    components: {
    },
    props: {
      bulletinState: {
        type: Object,
        default: null
      }
    },
    watch: {
      bulletinState: {
        immediate: true,
        handler(val) {
        }
      }
    },
    methods: {
      // 创建设计器
      createDesigner() {
        this.$store.commit('setEditDesigner', null);
        Bus.$emit('goToStep1');
      },
      // 取消
      cancel() {
        this.$router.push(`/SafetyBulletin/safetyBulletin_tbconfig`);
      }
    },
    created() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #guide
    .guide-tip, .choice
      font-size 15px
      margin-bottom 30px
    .choice
      margin 40px 0 20px
    ul.guide-text
      li
        padding 6px
</style>
