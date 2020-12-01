/**
* Created by alex on 2019/2/18.
*/
<template>
  <s-form ref="addForm" :model="form" :rules="rules" label-width="90px">
    <s-form-item label="名称" prop="typeName">
      <s-input v-model.trim="form.typeName"></s-input>
    </s-form-item>
    <s-form-item label="备注" prop="remark">
      <s-input type="textarea" :rows="5" v-model="form.remark"></s-input>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {intersectObj} from 'sunflower-common-utils'
  export default {
    data() {
      let vm = this
      let checkRepeat = (rule, value, callback) => { // 校验重复名称
        if (value) {
          if (vm.editData !== undefined) { // 编辑
            $axios.get('/syslogAuditSetting/getAppTypeList').then(({data}) => {
              let dataarr = data.filter(function(item) { return item.uuid !== vm.editData.uuid; })
              let arr = dataarr.map(function(item) { return item.typeName; })
              if (arr.includes(value)) {
                callback(new Error('该名称已经存在！'));
              } else {
                callback();
              }
            })
          } else {
            $axios.get('/syslogAuditSetting/getAppTypeList').then(({data}) => {
              let arr = data.map(function(item) { return item.typeName; })
              if (arr.includes(value)) {
                callback(new Error('该名称已经存在！'));
              } else {
                callback();
              }
            })
          }
        }
      };
      return {
        form: {
          typeName: '',
          remark: '',
          uuid: ''
        },
        rules: {
          typeName: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 30, message: '不能超过30个字符', trigger: 'blur'},
            {validator: checkRepeat, trigger: 'blur'}
          ],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        }
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    created() {
      if (this.editData !== undefined) {
        this.form = intersectObj(this.form, this.editData);
      }
    }
  }
</script>

