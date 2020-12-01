<template>
  <div class="assetsAddContainer">
    <s-form ref="addForm" :model="form" :rules="rules" label-width="60px" class="assetsAddForm">
        <s-form-item label="名称" prop="assetstatusName">
            <s-input v-model.trim="form.assetstatusName" :maxlength="5" placeholder="最大长度为5个字符"></s-input>
        </s-form-item>
        <s-form-item label="描述" prop="assetstatusDesc" style="margin-top:30px">
          <s-input v-model.trim="form.assetstatusDesc" placeholder="最大长度为500个字符" :maxlength="500"></s-input>
        </s-form-item>
      </s-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          assetstatusDesc: '',
          assetstatusName: ''
        },
        rules: {
          assetstatusName: [
            {required: true, message: '请输入资产状态名称', trigger: 'blur'},
            {max: 30, message: '最大长度为 30', trigger: 'blur'}
          ],
          assetstatusDesc: [{
            max: 500, message: '最大长度为500', trigger: 'blur'
          }]
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
        this.form = this.editData
      }
    }
  }
</script>

