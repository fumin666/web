<template>
  <div class="tvwall-add-page">
    <s-form :model="form" :rules="rules" label-width="140px" ref="addForm">
      <s-form-item label="页面名称" prop="pageName">
        <s-input v-model="form.pageName"></s-input>
      </s-form-item>
      <s-form-item label="区块数量">{{form.cellNum}} 个</s-form-item>
      <s-form-item label="是否显示logo">
        <s-switch v-model="form.isShowLogo"
                  :active-value="1"
                  :inactive-value="0">
        </s-switch>
      </s-form-item>
      <s-form-item label="备注" prop="remark">
        <s-input v-model="form.remark" type="textarea"></s-input>
      </s-form-item>
    </s-form>
  </div>
</template>

<script>
  export default {
    props: {
      info: Object
    },
    data() {
      return {
        form: JSON.parse(JSON.stringify(this.info)),
        rules: {
          pageName: [
            { required: true, message: '请输入页面名称', trigger: 'blur' },
            { max: 20, message: '最大长度为20', trigger: 'blur' }
          ],
          remark: [
            {max: 50, message: '最大长度为50', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      beforeAdd() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$emit('editPost', this.form);
          } else {
            return false;
          }
        });
      }
    }
  }
</script>
