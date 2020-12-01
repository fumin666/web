<template>
  <s-form :model="myForm" label-width="160px" class="assets-set">
    <s-form-item label="资源切换时间" v-if="myForm.booleanVTime">
      <s-input v-model="myForm.sliderVTime"></s-input>秒
    </s-form-item>
    <s-form-item label="缩放方式">
      <s-select v-model="myForm.scaleType">
        <s-option label="铺满屏幕" :value="0"></s-option>
        <s-option label="保持比例" :value="1"></s-option>
        <s-option label="自定义" :value="2"></s-option>
      </s-select>
    </s-form-item>
    <template v-if="myForm.scaleType === 2">
      <s-form-item label="水平缩放">
        <s-input v-model="myForm.xbei"></s-input>倍
      </s-form-item>
      <s-form-item label="垂直缩放">
        <s-input v-model="myForm.ybei"></s-input>倍
      </s-form-item>
    </template>
  </s-form>
</template>

<script>
  export default {
    props: {
      form: Object
    },
    data() {
      return {
        myForm: this.form
      }
    }
  }
</script>

<style>
  .assets-set .s-form-item-content > .s-input,
  .assets-set .s-form-item-content > .s-select {
    width: 80%;
    margin-right: 10px;
  }
</style>
