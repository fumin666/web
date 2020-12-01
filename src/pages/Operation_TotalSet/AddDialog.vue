<template>
  <div class="accountAddContainer">
    <s-scrollbar wrap-class="scrollheight">
      <s-form ref="addForm" :model="form" :rules="rules" label-width="125px" class="accountAddForm">
        <s-form-item label="名称" prop="specialoperTypeName">
            <s-input v-model.trim="form.specialoperTypeName"></s-input>
        </s-form-item>
        <s-form-item label="英文名称" prop="enSpecialoperTypeName">
            <s-input v-model.trim="form.enSpecialoperTypeName"></s-input>
        </s-form-item>
        <s-form-item label="类型" prop="specialoperCategory">
          <s-col span="8" >
            <s-select v-model="form.specialoperCategory" placeholder="请选择所属机构">
              <s-option label="在线审批" :value="1"></s-option>
              <s-option label="离岸审批" :value="0"></s-option>
            </s-select>
          </s-col>
        </s-form-item>
        <s-form-item label="中间审批人权限" v-if="selectChange" prop="approveAuthUuids">
            <s-checkbox-group v-model="form.approveAuthUuids">
              <s-checkbox v-for="item in approvers" :key="item.approveAuthId" :label="item.uuid">{{item.approveAuthName}}</s-checkbox>
            </s-checkbox-group>
        </s-form-item>
        <s-form-item label="是否发送短信" prop="shortmessage">
          <s-col span="8">
            <s-radio-group :disabled="!selectChange" v-model="form.shortmessage">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-col>
        </s-form-item>
        <s-form-item label="是否发送邮件" prop="sendEmail">
          <s-col span="8">
            <s-radio-group  :disabled="!selectChange" v-model="form.sendEmail">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-col>
        </s-form-item>
        <s-form-item label="备注" prop="remark">
            <s-input type="textarea" :rows="3" v-model="form.remark"></s-input>
        </s-form-item>
      </s-form>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {intersectObj} from 'sunflower-common-utils'
  export default {
    data() {
      let validNotNull = { required: true, message: '不能为空', trigger: 'blur' };
      return {
        form: {
          uuid: '',
          specialoperTypeName: '',
          enSpecialoperTypeName: '',
          approveAuthUuids: [],
          specialoperCategory: 1,
          shortmessage: 0,
          sendEmail: 0,
          remark: ''
        },
        approvers: [],
        categoryChange: true,
        rules: {
          specialoperTypeName: [
            validNotNull,
            { max: 30, message: '最大长度为30', trigger: 'blur' },
            { pattern: /[_\-\.\d\w\u4e00-\u9fa5]+/, message: '只能由中文、字母、数字、符号[_-.]构成', trigger: 'blur' }
          ],
          enSpecialoperTypeName: [
            validNotNull,
            { max: 30, message: '最大长度为30', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9_\-\.$][a-zA-Z0-9_\-\s\.@\\$]{0,29}$/, message: '只能由字母、数字、符号[_-.]构成', trigger: 'blur' }
          ],
          specialoperCategory: [
            { type: 'number', required: true, message: '不能为空', trigger: 'change' }
          ],
          approveAuthUuids: [
            { type: 'array', required: true, message: '不能为空', trigger: 'change' }
          ],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        }
      }
    },
    computed: {
      selectChange() {
        return this.categoryChange
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    mounted() {
      if (this.editData !== undefined) {
        this.form = intersectObj(this.form, this.editData)
        if (this.form.approveAuthUuids === null) {
          this.form.approveAuthUuids = []
        }
      }
      $axios.get('/operationSettings/getMiddleApproveAuth').then(response => {
        this.approvers = response.data;
      });
    },
    watch: {
      form: {
        handler(val) {
          if (val.specialoperCategory === '1' || val.specialoperCategory === 1) {
            this.categoryChange = true
          } else {
            this.categoryChange = false;
            val.shortmessage = 1;
          }
        },
        deep: true
      }
    }
  }
</script>
