<template>
  <section id="defineProcess">
    <s-row class="step-title">
      定义服务请求单对应的流程
      <span class="title-tip">--{{$store.state.serviceRequest.requestName}}</span>
    </s-row>
    <s-radio-group v-model="defineProcess.itilType" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">
      <s-radio :label="6">生成服务请求单</s-radio><br/>
      <s-radio :label="2" v-if="ownerTypeList.includes(2)">生成变更单</s-radio><br/>
      <s-radio :label="0" v-if="ownerTypeList.includes(0)">生成事件单</s-radio><br/>
    </s-radio-group>
  </section>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        defineProcess: {
          itilType: 6
        }
      }
    },
    computed: {
      ownerTypeList() {
        return this.$store.state.userData.ownerTypeList
      },
      inlayarr() {
        return this.$store.state.serviceRequest.inlayarr
      },
      designeruuid() {
        if (this.$store.state.serviceRequest.editDesigner) {
          return this.$store.state.serviceRequest.editDesigner.uuid
        } else {
          return null;
        }
      }
    },
    methods: {},
    created() {},
    // <keep-alive>切换到当前组件触发该钩子
    activated() {
      let state = this.$store.state.serviceRequest;
      // 编辑设计器时，获取编辑回显数据
      if (state.editDesigner) {
        this.defineProcess.itilType = state.editDesigner.editData.itilRequestDesigner.itilType;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #defineProcess
    margin-bottom 120px
    .s-radio-group .s-radio
      margin-bottom 20px
</style>
