<!--
 * @Author: songyf
 * @Version: //Q4人员属性配置
 * @Description:添加人员属性配置列表
 * @Position:账号管理-组织机构管理-人员属性配置-添加弹窗
 * @Date: 2019-11-12 11:11:11
 * @LastEditors  : mybells
 -->
<template>
  <s-dialog v-model="addDialog" :title="rowData ? '编辑' : '添加'" width="550px" :before-close="dialogClose" class="custom-attribute">
    <s-form :model="attributeForm" :rules="rule" ref="attributeForm" label-width="140px">
      <s-form-item label="属性名称" prop="propertyName">
        <s-input v-model.trim="attributeForm.propertyName" :disabled="attributeForm.internalFlag === 1"></s-input>
      </s-form-item>
      <s-form-item label="属性类型" prop="propertyType" required>
        <s-select style="width: 100%" v-model="attributeForm.propertyType" :disabled="attributeForm.internalFlag === 1">
          <s-option label="文本" :value="1"></s-option>
          <s-option label="数值" :value="2"></s-option>
          <s-option label="列表" :value="3"></s-option>
          <s-option label="日期" :value="4"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="选项及默认值" v-if="attributeForm.propertyType === 3 && attributeForm.internalFlag === 1" class="AssetsAttr_option">
        <ul style="border: 1px solid #ccc;padding-left:15px;min-height: 40px;">
          <s-scrollbar wrap-style="max-height:150px;">
            <li v-for="(item, index) in attributeForm.dropDownOptionList" :key="index">
              <s-checkbox class="s-radio treeicon ellipsis" v-model="optionbase" @change="handlerChange(item)" :label="item.value" title="设置为默认值">{{item.name}}</s-checkbox>
            </li>
          </s-scrollbar>
        </ul>
      </s-form-item>
      <s-form-item label="选项及默认值" prop="dropDownOptionList" v-else-if="attributeForm.propertyType === 3 && attributeForm.internalFlag !== 1" class="AssetsAttr_option">
        <s-input style="width:290px;" placeholder="最长输入30个字符" v-model.trim="optiontext"></s-input>
        <s-button @click="addOption">添加</s-button>
        <ul style="border: 1px solid #ccc;padding-left:15px;">
          <s-scrollbar wrap-style="max-height:150px;">
            <li v-for="(item, index) in attributeForm.dropDownOptionList" :key="index">
              <s-checkbox class="s-radio treeicon ellipsis" v-model="autooption" @change="handlerCustomChange(item)" :label="item.value" title="设置为默认值">{{item.name}}</s-checkbox>
              <i @click="deleteOption(item.value)" class="iconfont icon-delete" style="color: #2296ff;margin-right: 15px;float: right; position: relative; top: 1px;"></i>
            </li>
          </s-scrollbar>
        </ul>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="attributeForm.propertyType === 1" prop="dropDownOptionText" class="AssetsAttr_option">
        <s-input style="width:308px;" placeholder="最长输入30个字符" v-model.trim="attributeForm.dropDownOptionText"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="attributeForm.propertyType === 2" prop="dropDownOptionNum" class="AssetsAttr_option">
        <s-input style="width:308px;" placeholder="请输入非负数" v-model="attributeForm.dropDownOptionNum"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="attributeForm.propertyType === 4" class="AssetsAttr_option">
        <s-date-picker
          type="datetime"
          placeholder="选择时间"
          v-model="attributeForm.dropDownOptionDate"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="是否加入人员弹窗" prop="applyFlag">
        <s-switch v-model="attributeForm.applyFlag" :active-value="1" :inactive-value="0"
                  :disabled="(!rowData || attributeForm.editFlag) ? false : true" @change="switchChangeApply(attributeForm)"></s-switch>
      </s-form-item>
      <s-form-item label="是否必填项" prop="requiredValueFlag">
        <s-switch v-model="attributeForm.requiredValueFlag" :active-value="1" :inactive-value="0"
                  :disabled="(!rowData || attributeForm.editFlag) ? false : true" @change="switchChangeRequire(attributeForm)"></s-switch>
      </s-form-item>
      <s-form-item label="是否支持批量编辑" prop="batchFlag">
        <s-switch v-model="attributeForm.batchFlag" :active-value="1" :inactive-value="0" v-if="attributeForm.propertyKey === 'userWorkPosition'"
                  disabled  @change="switchChangeBath(attributeForm)" title="工号具有唯一性，不支持批量编辑"></s-switch>
        <s-switch v-model="attributeForm.batchFlag" :active-value="1" :inactive-value="0" v-else
                  :disabled="(!rowData || attributeForm.editFlag) ? false : true" @change="switchChangeBath(attributeForm)"></s-switch>
      </s-form-item>
      <s-form-item label="备注" prop="propertyDesc">
        <s-input v-model="attributeForm.propertyDesc" type="textarea" :disabled="attributeForm.internalFlag === 1"></s-input>
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
      let checkOption = (rule, value, callback) => {
        if (value.length) {
          callback()
        } else {
          callback(new Error('至少设置一个选项'));
        }
      };
      let checkName = (rule, value, callback) => {
        if (value) {
          if (this.editName && this.editName === value) {
            callback()
            return;
          }
          $axios.post(`/userProperties/uniquePropertyName`, {propertyName: value}).then((res) => {
            if (res.data) {
              callback()
            } else {
              callback(new Error('该名称已存在！'));
            }
          })
        } else {
          callback(new Error('不能为空'));
        }
      };
      return {
        titleType: '添加',
        url: '/userProperties/addProperty',
        editName: '',
        optiontext: '',
        optionbase: [],
        autooption: [],
        attributeForm: {
          uuid: null,
          propertyName: '',
          propertyType: 1,
          applyFlag: 0,
          requiredValueFlag: 0,
          batchFlag: 0,
          propertyDesc: '',
          dropDownOptionList: [],
          dropDownOptionText: '',
          dropDownOptionNum: null,
          dropDownOptionDate: null
        },
        rule: {
          propertyName: [ Validaters.NotNull, Validaters.Max(15), { pattern: /^[\u4e00-\u9fa5|a-zA-Z|0-9]+$/, message: '由中文、字母、数字组成', trigger: 'blur' }, {validator: checkName, trigger: 'blur'} ],
          propertyDesc: [ Validaters.Max(120) ],
          dropDownOptionList: [ Validaters.NotNull, {validator: checkOption, trigger: 'blur'} ],
          dropDownOptionText: [ Validaters.Max(30) ],
          dropDownOptionNum: [ {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'} ]
        }
      }
    },
    watch: {
    },
    created() {
      if (this.rowData) {
        this.editName = this.rowData.propertyName;
        this.attributeForm = Object.assign(this.attributeForm, this.rowData);
        this.url = '/userProperties/editProperty'
        this.titleType = '编辑'
        if (!this.attributeForm.dropDownOptionList) {
          this.attributeForm.dropDownOptionList = [];
        }
        if (this.rowData.defaultValue && this.rowData.propertyType === 1) {
          this.attributeForm.dropDownOptionText = this.rowData.defaultValue
        } else if (this.rowData.defaultValue && this.rowData.propertyType === 2) {
          this.attributeForm.dropDownOptionNum = this.rowData.defaultValue
        } else if (this.rowData.defaultValue && this.rowData.propertyType === 3 && this.attributeForm.internalFlag === 1) {
          this.optionbase = [this.rowData.defaultValue]
        } else if (this.rowData.defaultValue && this.rowData.propertyType === 3 && this.attributeForm.internalFlag !== 1) {
          this.autooption = [this.rowData.defaultValue]
        } else if (this.rowData.defaultValue && this.rowData.propertyType === 4) {
          this.attributeForm.dropDownOptionDate = this.rowData.defaultValue
        }
      }
    },
    methods: {
      switchChangeApply(row) {
        $axios.post(`/userProperties/openOrCloseApplySwith`, {uuid: row.uuid, swith: row.applyFlag}, {
          data: [row],
          logTemplate: `${row.applyFlag ? '开启' : '关闭'}|是否加入人员弹窗(#propertyName#)`
        }).then(({data}) => {
        });
        if (row.propertyKey === 'userGender' && row.applyFlag === 1) { // 如果是性别,联动相关操作
          row.requiredValueFlag = 1;
          row.batchFlag = 1;
          this.switchChangeRequire(row);
          this.switchChangeBath(row);
        }
      },
      switchChangeRequire(row) {
        $axios.post(`/userProperties/openOrCloseRequiredSwith`, {uuid: row.uuid, swith: row.requiredValueFlag}, {
          data: [row],
          logTemplate: `${row.requiredValueFlag ? '开启' : '关闭'}|是否必填项(#propertyName#)`
        }).then(({data}) => {
        });
      },
      switchChangeBath(row) {
        $axios.post(`/userProperties/openOrCloseBatchSwith`, {uuid: row.uuid, swith: row.batchFlag}, {
          data: [row],
          logTemplate: `${row.batchFlag ? '开启' : '关闭'}|是否支持批量编辑(#propertyName#)`
        }).then(({data}) => {
        });
      },
      addOption() {
        if (this.optiontext) {
          if (this.attributeForm.dropDownOptionList.map(val => val.value).includes(this.optiontext)) {
            this.$message({type: 'warning', message: '选项不能重复'});
            this.optiontext = ''
          } else {
            if (this.rowData) { // edit
              this.attributeForm.dropDownOptionList.unshift({name: this.optiontext, value: this.optiontext})
            } else { // plus
              this.attributeForm.dropDownOptionList.unshift({name: this.optiontext, value: this.optiontext})
            }
            this.optiontext = '';
          }
        } else {
          this.$message({type: 'warning', message: '选项不能为空'});
        }
        this.$refs.attributeForm.validateField('dropDownOptionList')
      },
      handlerChange(item) {
        this.optionbase = this.optionbase.includes(item.value) ? [item.value] : []
      },
      handlerCustomChange(item) {
        this.autooption = this.autooption.includes(item.value) ? [item.value] : []
      },
      deleteOption(val) {
        let index = this.attributeForm.dropDownOptionList.findIndex(item => item.value === val);
        this.attributeForm.dropDownOptionList.splice(index, 1)
      },
      dialogOk() {
        this.$refs.attributeForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          let form = cloneDeep(this.attributeForm);
          if (!form.dropDownOptionList.length) {
            form.dropDownOptionList = null;
          }
          form.defaultValue = form.dropDownOptionText ? form.dropDownOptionText : form.dropDownOptionNum ? form.dropDownOptionNum : form.dropDownOptionDate ? form.dropDownOptionDate : this.optionbase.length > 0 ? this.optionbase[0] : this.autooption.length > 0 ? this.autooption[0] : null
          $axios.post(this.url, form, {
            data: [form],
            logTemplate: `${this.titleType}|人员管理>人员属性(#propertyName#)`
          }).then((res) => {
            if (res.data) {
              this.$message.success('保存成功！')
              this.$emit('reload')
              this.dialogClose();
            } else {
              this.$message.error('保存失败')
            }
          })
        })
      },
      dialogClose() {
        this.$emit('update:addDialog', false)
      }
    }
  }
</script>

<style scoped>
.treeicon .s-checkbox-inner{
  border-radius: 10px !important;
}
.setOption{
  width: 308px;
  box-sizing: border-box;
}
.setOption li{
  height: 30px;
  padding: 0 10px;
  text-overflow: ellipsis;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
}
.setOption .list-value{
  display: inline-block;
  width: 270px;
}
.addOption:hover{
  font-weight: bold;
  cursor: pointer;
}

</style>
