<template>
  <s-dialog v-model="dialogFlag" title="规则属性" width="600px" class="ruleAddDialog">
    <s-radio-group v-model="ruleFlag">
      <s-row class="ruleCate">
        <s-col class="left ruleName">
          <s-radio :label="1" name="rule">预定义规则</s-radio>
        </s-col>
        <s-col class="fit">
          <s-select v-model="ruleForm.preTemplateId" :disabled="ruleFlag===0">
            <s-option v-for="(option,index) in preRuleOptions" :key="'pre' + index" :value="option.templateId" :label="option.remarks"></s-option>
          </s-select>
        </s-col>
      </s-row>
      <s-row class="ruleCate">
        <s-col span="10">
          <s-radio :label="0" name="rule">自定义规则</s-radio>
        </s-col>
        <s-col></s-col>
      </s-row>
    </s-radio-group>
    <s-form :model="ruleForm" ref="ruleForm" :rules="ruleRules" label-width="120px" class="ruleForm">
      <s-form-item label="匹配模式" prop="pattern">
        <s-input v-model="ruleForm.pattern" :disabled="ruleFlag===1"></s-input>
      </s-form-item>
      <s-form-item label="名称格式" prop="name" tip="可包含普通字符和{$数字}格式的标记，标记用于引用匹配模式里正则表达式的匹配组">
        <s-input v-model="ruleForm.name" :disabled="ruleFlag===1"></s-input>
      </s-form-item>
      <s-form-item label="备注" prop="remarks">
        <s-input v-model="ruleForm.remarks" :disabled="ruleFlag===1"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      dialogFlag: false,
      ruleFlag: 0,
      appId: '',
      preRule: '',
      preRuleOptions: [],
      ruleForm: {
        preTemplateId: '',
        pattern: '',
        name: '',
        remarks: ''
      },
      ruleRules: {
        pattern: [
          Validaters.NotNull,
          Validaters.Max(128)
        ],
        name: [
          Validaters.NotNull,
          Validaters.Max(128)
        ],
        remarks: [Validaters.Max(255)]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    current: {
      type: Object
    }
  },
  computed: {
    isEdit() {
      return Object.keys(this.current).length > 0;
    }
  },
  created() {
    this.appId = this.$route.params.appId;
    if (this.isEdit) {
      for (let i in this.ruleForm) {
        this.ruleForm[i] = this.current[i];
      }
    }
    $axios.get(`/sysDbauditBusiness/getPreDefindedRuleList/${this.appId}`).then(({data}) => {
      if (data) {
        this.preRuleOptions = data;
        if (!this.isEdit) {
          this.ruleForm.preTemplateId = data[0].templateId;
        }
      }
    });
  },
  methods: {
    axiosSave(obj) {
      let param = {
        appId: this.appId,
        flag: this.ruleFlag
      };
      Object.assign(param, obj);
      if (this.isEdit) {
        param.templateId = this.current.templateId;
      }
      $axios.post(`/sysDbauditBusiness/saveRule`, param).then(({data}) => {
        if (data === true) {
          this.$message({showClose: true, message: '保存成功!', type: 'success'});
          this.$emit('reload');
          this.dialogFlag = false;
        } else {
          this.$message({showClose: true, message: '保存失败!', type: 'error'});
        }
      });
    },
    dialogOk() {
      if (this.ruleFlag === 1) { // 预定义
        let obj = {
          preTemplateId: this.ruleForm.preTemplateId
        };
        this.axiosSave(obj);
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (!valid) {
            return;
          }
          let obj = Object.assign({}, this.ruleForm);
          delete obj.preTemplateId;
          this.axiosSave(obj);
        });
      }
    }
  },
  watch: {
    ruleFlag(val) {
      if (val === 1) {
        this.$refs.ruleForm.resetFields();
      }
    },
    value: {
      immediate: true,
      handler(val) {
        this.dialogFlag = val;
      }
    },
    dialogFlag(val) {
      this.$emit('input', val);
    }
  }
}
</script>

<style lang="stylus">
.ruleAddDialog {
  .ruleCate {
    line-height: 36px;
    height: 36px;
    margin-bottom: 22px;

    .s-radio__inner {
      vertical-align: middle;
    }

    .left {
      float: left;
    }

    .ruleName {
      width: 155px;
    }

    .fit {
      overflow: hidden;
      zoom: 1;
    }
  }

  .ruleForm {
    margin-left: 35px;

    .s-form-item-content {
      margin-right: 50px;
    }
  }
}
</style>

