/**
* Created by dgunzi on 2019/03/07.
* 添加端口表单
*/
<template>
  <s-form label-width="120px" :rules="rules" :model="form" ref="form">
    <s-form-item label="别名" prop="bName">
      <s-input v-model="form.bName"></s-input>
    </s-form-item>
    <s-form-item label="端口" prop="port">
      <s-input v-model="form.port"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
    export default {
        name: 'NodePortForm',
        data() {
            return {
              rules: {
                bName: [
                  {required: true, message: '请输入别名', trigger: 'blur'}
                ],
                port: [
                  {required: true, message: '请输入端口号', trigger: 'blur'},
                  {
                    pattern: /(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
                    message: '请输入正确的端口号',
                    trigger: 'blur'
                  }
                ]
              }
            }
        },
        props: {
          form: {
            type: Object,
            default: () => {
              return {
                bName: '',
                port: ''
              }
            }
          }
        },
        created() {
            // this.axiosCitypeTree()
        },
        methods: {}
    }
</script>

<style scoped>

</style>
