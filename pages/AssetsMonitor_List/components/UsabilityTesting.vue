/**
* Created by songyf on 2019/6/17.
*/
<template>
  <div class="availableForm">
      <s-form ref="availableForm" :model="availableForm" :rules="availableRules" label-width="120px" id="assetAddDialog">
        <s-form-item label="ping检测频率" prop="pingRate">
          <s-input v-model="availableForm.pingRate" class="inputDialog"></s-input>
          秒
        </s-form-item>
        <div class="tips">请输入大于等于10小于9999的正整数</div>
        <s-form-item label="凭证检测频率" prop="credenceRate">
          <s-input v-model="availableForm.credenceRate" class="inputDialog"></s-input>
          秒
        </s-form-item>
        <div class="tips">请输入大于等于60小于9999的正整数</div>
      </s-form>
      <s-button @click="SetdialogSave" class="save" style="margin-left:120px">保存</s-button>
  </div>
</template>
<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  function validHasMark(rule, value, callback) {
    let reg = /(^[1-9][0-9]$)|(^[1-9][0-9]{2,3}$)/;
    if (!reg.test(value)) {
      callback(new Error(`请输入大于等于10小于9999的正整数`));
    }
    callback();
  }
  function validHasMark60(rule, value, callback) {
    let reg = /(^[6-9][0-9]$)|(^[1-9][0-9]{2,3}$)/;
    if (!reg.test(value)) {
      callback(new Error(`请输入大于等于60小于9999的正整数`));
    }
    callback();
  }

  export default {
      name: 'availableForm',
      data() {
          return {
            availableForm: {
              pingRate: '',
              credenceRate: ''
            },
            availableRules: {
              pingRate: [
                Validaters.NotNull,
                {validator: validHasMark, trigger: 'blur'}
              ],
              credenceRate: [
                Validaters.NotNull,
                {validator: validHasMark60, trigger: 'blur'}
              ]
            }
          }
      },
      created() {
        this.getAvailableForm()
      },
      methods: {
        // 获取
        getAvailableForm() {
          let vm = this;
          $axios.get('/systemmanager/sysConfig/getAvailableRate').then((res) => {
            vm.availableForm.pingRate = res.data.pingRate;
            vm.availableForm.credenceRate = res.data.credenceRate
          });
        },
        // 保存
        SetdialogSave() {
          let form = this.$refs['availableForm'];
          form.validate((valid) => {
            if (!valid) {
              return false;
            }
            let param = {
              pingRate: this.availableForm.pingRate.toString(),
              credenceRate: this.availableForm.credenceRate.toString()
            };
            $axios.post('/systemmanager/sysConfig/siteAvailableRate', param, {
              logTemplate: '编辑|可用性检测频率设置'
            }).then((res) => {
              if (res.data.state === true) {
                this.$message({type: 'success', message: '保存成功'});
              } else {
                this.$message({type: 'error', message: res.data.errormsg});
              }
            });
          })
        }
      }
  }
</script>

<style scoped>
.availableForm{
  position: relative;
}
/* .save{
  position: absolute;
  bottom: -68px;
  right: 70px;
} */
.availableForm .s-form-item{
  /*margin-bottom: 0px;*/
}
.availableForm .tips{
  margin-left: 120px;
  margin-bottom: 15px;
  color: #cccccc;
}
</style>
