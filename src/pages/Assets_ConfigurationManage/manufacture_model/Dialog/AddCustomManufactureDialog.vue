<!--
 * @Author: 高建鹏
 * @Version: //Q4厂商型号配置
 * @Description:厂商tab编辑添加操作
 * @Position:配置项管理-》厂商型号配置-》厂商页面-》编辑添加操作
 * @Date: 2019-10-30 14:35:06
 * @LastEditors: 高建鹏
 -->
<template>
  <s-dialog v-model="addDialog" :title="rowData ? '编辑' : '添加'" width="550px" :before-close="dialogClose">
    <s-form :model="attributeForm" :rules="rule" ref="attributeForm" label-width="80px">
      <s-form-item label="厂商" prop="caption">
        <s-input v-model.trim="attributeForm.caption"></s-input>
      </s-form-item>
      <s-form-item label="描述" prop="description">
        <s-input v-model="attributeForm.description" type="textarea"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogClose">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import {cloneDeep} from 'lodash';
  import {Validaters} from 'sunflower-common-utils';
  import $axios from 'sunflower-ajax';
  export default {
    props: {
      addDialog: {
        type: Boolean
      },
      rowData: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        attributeForm: {
          uuid: null,
          caption: '',
          description: ''
        },
        rule: {
          caption: [ Validaters.NotNull, Validaters.Max(50) ],
          description: [ Validaters.Max(200) ]
        }
      }
    },
    created() {
      if (this.rowData) {
        this.attributeForm = Object.assign(this.attributeForm, this.rowData);
      }
    },
    methods: {
      dialogClose() {
        this.$emit('update:addDialog', false)
      },
      dialogOk() {
        this.$refs.attributeForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          let form = cloneDeep(this.attributeForm);
          let obj = {
            data: [],
            logTemplate: this.rowData ? `编辑|厂商型号配置>厂商(${this.attributeForm.caption})` : `添加|厂商型号配置>厂商(${this.attributeForm.caption})`
          }
          $axios.post('/resourcemanager/configurationmanage/manufactProduct/saveOrUpdateManufact', form, obj).then((res) => {
            if (res.data.state) {
              this.$message.success('保存成功！')
              this.$emit('reload')
              this.dialogClose();
            } else {
              this.$message.error(res.data.errormsg)
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
</style>
