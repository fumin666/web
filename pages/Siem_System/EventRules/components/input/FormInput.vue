<template>
  <span>
    <s-tooltip content="日志内容限制在20个字符以内。" placement="bottom" effect="light" v-if="!disabled">
      <s-input v-model="currentValue" @input="onInput" @change="onChange"  :maxlength="20"></s-input>
    </s-tooltip>
     <s-input v-if="disabled" v-model="currentValue" @input="onInput" @change="onChange" :disabled="disabled" :maxlength="20"></s-input>
  </span>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        currentValue: ''
      }
    },
    props: {
      value: '',
      disabled: false
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val === this.currentValue) return
          this.currentValue = val
        }
      }
    },
    methods: {
      onInput(val) {
        this.$emit('input', val)
      },
      onChange(val) {
        this.$emit('change', val)
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
