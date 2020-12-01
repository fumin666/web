<template>
  <s-scrollbar wrap-style="max-height:500px;">
    <!--<s-form-->
      <!--ref="riskQuestionForm"-->
      <!--:model="riskQuestionForm"-->
      <!--label-width="50%">-->
      <!--<s-form-item label="1.是否紧急变更？">-->
        <!--<s-radio v-model="riskQuestionForm." :label="1">否</s-radio>-->
        <!--<s-radio v-model="riskQuestionForm." :label="2">是</s-radio>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="2.可能受影响的应用系统级别？">-->
        <!--<s-select v-model="riskQuestionForm.">-->
          <!--<s-option :label="" :value="" :key=""></s-option>-->
        <!--</s-select>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="3.对服务级别的影响？">-->
        <!--<s-select v-model="riskQuestionForm.">-->
          <!--<s-option :label="" :value="" :key=""></s-option>-->
        <!--</s-select>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="4.可能受影响的应用系统数量？">-->
        <!--<s-select v-model="riskQuestionForm.">-->
          <!--<s-option :label="" :value="" :key=""></s-option>-->
        <!--</s-select>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="5.变更实施的难度：技术复杂度？">-->
        <!--<s-select v-model="riskQuestionForm.">-->
          <!--<s-option :label="" :value="" :key=""></s-option>-->
        <!--</s-select>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="6.变更涉及的部门：团队复杂度？">-->
        <!--<s-select v-model="riskQuestionForm.">-->
          <!--<s-option :label="" :value="" :key=""></s-option>-->
        <!--</s-select>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="7.变更是否经过完整的测试？">-->
        <!--<s-select v-model="riskQuestionForm.">-->
          <!--<s-option :label="" :value="" :key=""></s-option>-->
        <!--</s-select>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="8.是否存在回退计划，并进行了验证？">-->
        <!--<s-select v-model="riskQuestionForm.">-->
          <!--<s-option :label="" :value="" :key=""></s-option>-->
        <!--</s-select>-->
      <!--</s-form-item>-->
    <!--</s-form>-->

    <s-row style="text-align: right;">
      <s-button @click="saveRiskQuestion">保存</s-button>
      <s-button type="cancel" @click="cancelRiskQuestion">取消</s-button>
    </s-row>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        riskQuestionForm: {}
      }
    },
    methods: {
      saveRiskQuestion() {
        $axios.post('', this.riskQuestionForm).thne(({data}) => {
          if (data) {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '保存失败，请重试！'
            })
          }
        })
      },
      cancelRiskQuestion() {
        this.$emit('closeDialog')
      }
    },
    created() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
