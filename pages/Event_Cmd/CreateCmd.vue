<template>
  <s-form
    ref="addForm"
    :model="cmdAddFormData"
    :rules="rules"
    label-width="120px"
    class="cmd-add">
    <s-form-item
      label="模板名称"
      prop="templateName">
      <s-input v-model="cmdAddFormData.templateName"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      let checkName = (rule, value, callback) => {
        if (value) {
          if (this.cmdData && this.cmdData.templateName && this.cmdData.templateName === value) {
            callback()
            return;
          }
          $axios.get(`/commandTemplate/checkCommandTemplateName/${value}`).then(res => {
            if (res.data.state) {
              callback()
            } else {
              callback(new Error('该名称已存在！'));
            }
          })
        } else {
          callback(new Error('不能为空！'));
        }
      };
      return {
        cmdAddFormData: {
          templateName: ''
        },
        rules: {
          templateName: [
            {required: true, message: '请输入模板名称', trigger: 'blur'},
            {max: 50, message: '长度不能超过50', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ]
        }
      }
    },
    props: {
      cmdData: Object
    },
    methods: {
    },
    mounted() {
      if (this.cmdData) {
        this.cmdAddFormData = JSON.parse(JSON.stringify(this.cmdData));
      }
    }
  }
</script>
