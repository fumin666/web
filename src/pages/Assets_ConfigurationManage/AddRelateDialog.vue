<template>
  <div class="relateAddContainer">
    <s-form ref="addForm" :model="form" :rules="rules" label-width="120px" class="relateAddForm">
      <s-form-item label="关系类型" prop="forwardRelationtype.relationName">
        <s-col span="20" >
          <s-input v-model.trim="form.forwardRelationtype.relationName"></s-input>
        </s-col>
      </s-form-item>
      <!--<s-form-item label="反向关系类型" prop="reverseRelationtype.relationName">
        <s-col span="20" >
          <s-input v-model="form.reverseRelationtype.relationName"></s-input>
        </s-col>
      </s-form-item>-->
      <s-form-item label="描述" prop="forwardRelationtype.relationDescription">
        <s-col span="20" >
          <s-input v-model.trim="form.forwardRelationtype.relationDescription"></s-input>
        </s-col>
      </s-form-item>
      <s-form-item label="状态" prop="forwardRelationtype.status">
        <s-col span="20" >
          <s-select v-model="form.forwardRelationtype.status">
            <s-option :value="1" label="开启"/>
            <s-option :value="0" label="关闭"/>
          </s-select>
        </s-col>
      </s-form-item>
    </s-form>
  </div>
</template>

<script>
 import {cloneDeep} from 'lodash'
  export default {
    data() {
      return {
        form: {
          forwardRelationtype: {
            relationName: '',
            relationDescription: '',
            status: 1
          }
        },
        rules: {
          'forwardRelationtype.relationName': [
            {required: true, message: '请输入关系类型', trigger: 'blur'},
            {max: 30, message: '最大长度为 30', trigger: 'blur'}
          ],
          'forwardRelationtype.relationDescription': [
            { required: true, message: '描述不能为空', trigger: 'blur' },
            {max: 30, message: '最大长度为 30', trigger: 'blur'}
          ],
          'forwardRelationtype.status': [
            { required: true, message: '状态不能为空', trigger: 'blur', type: 'number' }
          ]
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
        this.form = cloneDeep(this.editData);
      }
    }
  }
</script>
