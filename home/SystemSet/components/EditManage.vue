<template>
      <s-form label-width="300px" ref="manageEdit" :model="manageEdit" :rules="manageRule" :inline-message="true"	>
        <s-form-item label-width="0px" style="margin-bottom:0px;">
          <i class="iconfont icon-info"></i>&nbsp;代理信息
        </s-form-item>
        <s-form-item label="代理名称" prop="name" class="editFormItem bg-purple">
          <s-col span="18">
            <s-input v-model="manageEdit.name"></s-input>
          </s-col>
        </s-form-item>
        <s-form-item label="审计引擎" prop="ip" class="editFormItem bg-purple">
          <s-col span="18">
            <s-input v-model="manageEdit.ip"></s-input>
          </s-col>
        </s-form-item>
        <s-form-item label="备注" prop="remarks" class="editFormItem bg-purple">
          <s-col span="18">
            <s-input v-model="manageEdit.remarks"></s-input>
          </s-col>
        </s-form-item>
      </s-form>
</template>

<script>
import {intersectObj} from 'sunflower-common-utils'
export default {
  data() {
    return {
      manageEdit: {
        name: '',
        ip: '',
        remarks: ''
      },
      manageRule: {
        name: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        ip: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/, message: 'IP格式不正确', trigger: 'blur'}
        ],
        remarks: [
        ]
      }
    }
  },
  props: {
    manageEditData: {
      type: Object
    }
   },
   created () {
     if (this.manageEditData !== undefined) {
       this.manageEdit = intersectObj(this.manageEdit, this.manageEditData)
     }
   }
}
</script>
<style>
.editFormItem{
    padding-left:20px;
    margin-bottom:5px;
  }
</style>
