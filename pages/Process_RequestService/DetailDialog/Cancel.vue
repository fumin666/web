<template>
  <s-form :model="cancelForm" :rules="cancelFormRules" ref="cancelForm" label-width="100px">
    <s-form-item label="取消原因：" prop="cancel">
      <s-input v-model="cancelForm.cancel" type="textarea" :rows="4"></s-input>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  // import $axios from 'sunflower-ajax';

  export default {
    data () {
      return {
        cancelForm: {
          cancel: ''
        },
        cancelFormRules: {
          cancel: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    components: {
    },
    computed: {
    },
    watch: {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
