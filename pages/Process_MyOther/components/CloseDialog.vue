<template>
  <div class="closeDialog">
    <s-form :model="closeform" label-width="100px" ref="closeform" :rules="closeformRule">
      <s-form-item label="拒绝原因" prop="reason">
        <s-input v-model="closeform.reason" type="textarea" :row="3"></s-input>
      </s-form-item>
    </s-form>
  </div>
</template>

<script type="text/ecmascript-6">
 export default {
 data() {
  return {
    closeform: {
      reason: ''
    },
    closeformRule: {
      reason: [{required: true, message: '拒绝理由不能为空', trigger: 'blur'}]
    }
  }
 }
 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
