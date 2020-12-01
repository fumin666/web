<template>
  <section>
    <s-form :model="auditForm" ref="ruleForm" :rules="rules" label-width="80px">
      <s-form-item label="审核状态">
        <s-select v-model="auditForm.auditValue" prop="auditValue">
          <s-option label="合规" value="1"></s-option>
          <s-option label="违规" value="2"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="审核批注" tip="审核批注内容所允许的最大长度为120个字符" prop="write">
        <s-input type='textarea' v-model="auditForm.write"></s-input>
      </s-form-item>
    </s-form>
  </section>
</template>
<script>
  export default{
    data() {
      return {
        auditForm: {
          write: '',
          auditValue: ''
        },
        rules: {
          write: [
            {message: '审核批注内容所允许的最大长度为120个字符', trigger: 'blur', max: 120}
          ]
        }
      }
    },
    props: ['audit', 'sessionAuditRemark'],
    methods: {
      getAudit() {
        switch (this.audit) {
          case '合规': this.auditForm.auditValue = '1'; break;
          default: this.auditForm.auditValue = '2'; break;

        }
        this.auditForm.write = this.sessionAuditRemark;
      }
    },
    created() {
      this.getAudit();
    }
  }
</script>
