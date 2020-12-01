<template>
  <div class="closeDialog">
    <s-form :model="closeform" label-width="100px" ref="closeform">
      <s-form-item label="关闭代码：" prop="closeCode">
        <s-select v-model="closeform.closeCode">
          <s-option v-for="(value, key, index) in changeCloseCodeMap" :label="value" :value="parseInt(key)" :key="key"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        closeform: {
          closeCode: 1  // 默认值为成功
        },
        changeCloseCodeMap: {
          1: '成功',
          0: '失败'
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
