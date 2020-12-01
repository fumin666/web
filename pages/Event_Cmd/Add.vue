<template>
  <s-form
    ref="addForm"
    :model="cmdAddFormData"
    :rules="rules"
    label-width="120px"
    class="cmd-add">
    <s-form-item
      label="命令模板"
      required>
      <s-select v-model="cmdAddFormData.templateUuid" @change="handleCmdTemplateChange" style="width: 195px;">
        <s-option v-for="(item, index) in templateList" :label="item.templateName" :value="item.uuid" :key="index" :title="item.templateName" style="width: 195px;"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item
      label="匹配类型"
      prop="type">
      <s-select v-model="cmdAddFormData.type" @change="handleTypeChange">
        <s-option label="精确匹配" :value="0"></s-option>
        <s-option label="模糊匹配" :value="1"></s-option>
        <s-option label="任意匹配" :value="2"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item
      label="命令名称"
      prop="commandName">
      <s-input v-model="cmdAddFormData.commandName"></s-input>
    </s-form-item>
    <s-form-item
      label="参数"
      :required="isRequired"
      v-show="isShowPara"
      :class="{ 'is-error': isShowError }">
      <s-input v-model="cmdAddFormData.commandPara" @blur="handleParaBlur"></s-input>
      <div class="s-form-my-error" v-show="isShowError" v-text="showErrorMsg"></div>
    </s-form-item>
    <s-form-item
      label="事件级别"
      prop="commandRisk">
      <s-select v-model="cmdAddFormData.commandRisk">
        <s-option label="未知" :value="0"></s-option>
        <s-option label="正常" :value="1"></s-option>
        <s-option label="提示" :value="2"></s-option>
        <s-option label="警告" :value="3"></s-option>
        <s-option label="次要" :value="4"></s-option>
        <s-option label="主要" :value="5"></s-option>
        <s-option label="严重" :value="6"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item
      label="风险等级"
      prop="commandRiskNew">
      <s-select v-model="cmdAddFormData.commandRiskNew">
        <s-option label="低" :value="0"></s-option>
        <s-option label="较低" :value="1"></s-option>
        <s-option label="中" :value="2"></s-option>
        <s-option label="较高" :value="3"></s-option>
        <s-option label="高" :value="4"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item
      label="备注"
      prop="remark">
      <s-input v-model="cmdAddFormData.remark" type="textarea"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      let checkName = (rule, value, callback) => {
        if (value) {
          let res = value.search(/[^!|?|$|.|/|\w]/g);
          if (res > -1) {
            callback(new Error('命令由字母[a-z,A-Z]、数字[0-9]、符号[!?$./_]组成,长度不能超过30'));
          } else {
            callback();
          }
        }
      };
      return {
        cmdAddFormData: {
          type: 0,
          templateUuid: '',
          commandName: '',
          commandPara: '',
          commandRisk: 0,
          commandRiskNew: 0,
          remark: ''
        },
        templateList: [],
        rules: {
          commandName: [
            {required: true, message: '请输入命令名称', trigger: 'blur'},
            {max: 30, message: '长度不能超过30', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          remark: [
            {max: 120, message: '备注信息所允许的最大长度为 120 个字符', trigger: 'change'}
          ]
        },
        isRequired: true,
        isShowPara: true,
        isShowError: false,
        showErrorMsg: '请输入参数'
      }
    },
    props: {
      currentCmd: Object
    },
    methods: {
      handleTypeChange(val) {
        if (val === 0) {
          this.isRequired = true;
          this.isShowPara = true;
        } else if (val === 1) {
          this.isRequired = false;
          this.isShowPara = true;
          this.isShowError = false;
        } else {
          this.isRequired = false;
          this.isShowPara = false;
          this.isShowError = false;
          this.cmdAddFormData.commandPara = '';
        }
      },
      handleCmdTemplateChange(val) {
      },
      handleParaBlur(event) {
        if (this.cmdAddFormData.type === 0) {
          if (event.target.value.length === 0) {
            this.isShowError = true;
            this.showErrorMsg = '请输入参数';
          } else if (event.target.value.indexOf(' ') !== -1) {
            this.isShowError = true;
            this.showErrorMsg = '参数不能包含空格';
          } else if (event.target.value.length > 36) {
            this.isShowError = true;
            this.showErrorMsg = '参数长度不能超过36';
          } else {
            this.isShowError = false;
          }
        } else {
          this.isShowError = false;
        }
      }
    },
    mounted() {
      $axios.get('/commandTemplate/getSimpleChildCommandTemplateList').then(res => {
        if (res.data && res.data.length > 0) {
          this.templateList = res.data
          this.cmdAddFormData.templateUuid = res.data[0].uuid
          if (this.currentCmd) {
            this.cmdAddFormData.templateUuid = this.currentCmd.templateUuid
          }
        }
      })
      if (this.currentCmd) {
        this.cmdAddFormData = JSON.parse(JSON.stringify(this.currentCmd));
        this.handleTypeChange(this.cmdAddFormData.type);
      }
    }
  }
</script>
