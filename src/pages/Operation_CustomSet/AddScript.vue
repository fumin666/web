<template>
  <s-form ref="addScriptForm" :model="addAuthForm" :rules="rules" label-width="120px">
    <s-form-item label="脚本名称" prop="scriptName">
      <s-input v-model="addAuthForm.scriptName"></s-input>
    </s-form-item>
    <s-form-item label="协议名称" prop="scriptProtocol">
      <s-select v-model="addAuthForm.scriptProtocol">
        <s-option v-for="item in scriptProtocol" :key="item.id" :label="item" :value="item"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="备注" prop="remark">
      <s-input type="textarea" v-model="addAuthForm.remark" :rows="5"></s-input>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import {intersectObj} from 'sunflower-common-utils'
  export default {
    data() {
      let checkName = function(rule, value, callback) {
        if (!value) {
          callback();
          return;
        };
        let res = value.search(/[^-|\w|\u4e00-\u9fa5]/g);
        if (res > -1) {
          callback(new Error('由中文、字母、数字、-、_组成'));
        }
        callback();
      };
      return {
        addAuthForm: {
          uuid: '',
          scriptName: '',
          scriptProtocol: 'SSHv1',
          remark: ''
        },
        rules: {
          scriptName: [
            {required: true, message: '请输入脚本名称', trigger: 'blur'},
            {max: 30, message: '最大长度为30个字符', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          remark: [
            { max: 120, message: '最大长度为120个字符', trigger: 'blur' }
          ]
        },
        scriptProtocol: []
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    created() {
      if (this.editData !== undefined) {
        this.addAuthForm = intersectObj(this.addAuthForm, this.editData)
      }
      this.getScriptProtocol()
    },
    methods: {
      getScriptProtocol() {
        $axios.get('/operationSettings/getScriptProtocol').then((res) => {
          this.scriptProtocol = res.data
        })
      }
    }
  }
</script>
