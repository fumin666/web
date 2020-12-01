<template>
  <div class="assetAudit">
    <s-tab>
      <s-tab-pane label="IP地址可用性规则">
        <s-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <s-form-item style="margin-left:-50px;font-size:15px"><b>IP地址分配</b> </s-form-item>
          <s-form-item>当IP地址关联了IT资产,则其状态由“可用的”变为“已用的”</s-form-item>
          <s-form-item style="margin-left:-50px;font-size:15px"><b>IP地址回收</b> </s-form-item>
          <s-form-item >
              <span>(1) 当“已用的”IP地址停止使用&nbsp;&nbsp;&nbsp;<s-input v-model="ruleForm.day1" placeholder="请输入内容" style="width:5%;"></s-input> 天,设置IP地址的状态是“暂态的”。</span>
          </s-form-item>
          <s-form-item >
              <span>(2) 当“已用的”IP地址停止使用&nbsp;&nbsp;&nbsp;<s-input v-model="ruleForm.day2" placeholder="请输入内容" style="width:5%;"></s-input> 天,设置IP地址的状态是“可用的”。</span>
          </s-form-item>
          <s-form-item class="footerRow">
            <s-button @click="submitForm('ruleForm')">保存</s-button>
          </s-form-item>
        </s-form>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
          day1: '',
          day2: ''
        },
        rules: {

        }
      }
    },
    methods: {
      submitForm() {

      }
    }
  }
</script>

<style lang="stylus">
.footerRow{
  margin-left :600px;
}
.s-form-item-content{
  font-size: 15px;
}
</style>
