<!--
 * @Author: 高建鹏
 * @Version: //Q4资产通用属性调整
 * @Description:添加编辑通用属性
 * @Position:配置项管理-》通用属性-》添加编辑操作
 * @Date: 2019-10-30 14:35:06
 * @LastEditors  : mybells
 -->
<template>
  <s-dialog v-model="addDialog" :title="rowData ? '编辑' : '添加'" width="550px" :before-close="dialogClose" class="custom-attribute">
    <s-form :model="attributeForm" :rules="rule" ref="attributeForm" label-width="140px">
      <s-form-item label="属性类型" prop="dataType" required>
        <s-select style="width: 100%" v-model="attributeForm.dataType" :disabled="attributeForm.defaultStatus === 1">
          <s-option label="文本" :value="1"></s-option>
          <s-option label="数值" :value="2"></s-option>
          <s-option label="列表" :value="3"></s-option>
          <s-option label="日期" :value="4"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="属性名称" prop="colnumName">
        <s-input v-model.trim="attributeForm.colnumName" :disabled="attributeForm.defaultStatus === 1"></s-input>
      </s-form-item>
      <s-form-item label="选项及默认值" v-if="attributeForm.dataType === 3 && attributeForm.defaultStatus === 1" class="AssetsAttr_option">
        <s-scrollbar wrap-style="max-height:200px;">
          <div style="border: 1px solid #ccc;padding-left:15px;min-height: 40px;">
            <s-tree
              v-if="attributeForm.dropDownOptionList && attributeForm.dropDownOptionList.length && attributeForm.dropDownOptionList[0].childrenList"
              class="treeicon"
              icon-class="edit"
              :data="attributeForm.dropDownOptionList"
              :props="defaultProps"
              v-model="treeoption"
              show-checkbox
              :check-strictly="true"
              default-expand-all
              node-key="uuid"
              ref="tree"
              @check-change="checkChange">
            </s-tree>
            <ul v-else>
              <li v-for="(item, index) in attributeForm.dropDownOptionList" :key="index">
                <s-checkbox class="s-radio treeicon ellipsis" v-model="optionbase" @change="handlerChange(item)" :label="item.realValue" title="设置为默认值">{{item.listvalues}}</s-checkbox>
              </li>
            </ul>
          </div>
        </s-scrollbar>
      </s-form-item>
      <s-form-item label="选项及默认值" prop="dropDownOptionList" v-else-if="attributeForm.dataType === 3 && attributeForm.defaultStatus !== 1" class="AssetsAttr_option">
        <s-input style="width:290px;" placeholder="最长输入30个字符" v-model.trim="optiontext"></s-input>
        <s-button @click="addOption">添加</s-button>
        <ul style="border: 1px solid #ccc;padding-left:15px;">
          <s-scrollbar wrap-style="max-height:150px;">
            <li v-for="(item, index) in attributeForm.dropDownOptionList" :key="index">
              <s-checkbox class="s-radio treeicon ellipsis" v-model="autooption" @change="handlerAutoChange(item)" :label="item.realValue" title="设置为默认值">{{item.listvalues}}</s-checkbox>
              <i @click="deleteOption(item.listvalues)" class="iconfont icon-delete" style="color: #2296ff;margin-right: 15px;float: right; position: relative; top: 1px;"></i>
            </li>
          </s-scrollbar>
        </ul>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="attributeForm.dataType === 1" prop="dropDownOptionText" class="AssetsAttr_option">
        <s-input style="width:308px;" placeholder="最长输入30个字符" v-model.trim="attributeForm.dropDownOptionText"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="attributeForm.dataType === 2" prop="dropDownOptionNum" class="AssetsAttr_option">
        <s-input style="width:308px;" placeholder="请输入数值" v-model="attributeForm.dropDownOptionNum"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="attributeForm.dataType === 4" class="AssetsAttr_option">
        <s-date-picker
          v-if="attributeForm.colnumName==='服务到期日'"
          type="datetime"
          placeholder="选择时间"
          v-model="attributeForm.dropDownOptionDate"
          :editable="false"
          :picker-options="pickerOptions0"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss">
        </s-date-picker>
        <s-date-picker
          v-else
          type="datetime"
          placeholder="选择时间"
          v-model="attributeForm.dropDownOptionDate"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="描述" prop="attributeDesc">
        <s-input v-model="attributeForm.attributeDesc" type="textarea" :disabled="attributeForm.defaultStatus === 1"></s-input>
      </s-form-item>
      <s-form-item label="是否应用" prop="applicationStatus">
          <s-switch v-model="attributeForm.applicationStatus" size="small" :active-value="1" :inactive-value="0"
                    :disabled="attributeForm.switchStatus===1||isOnlyTeamLeader" @change="switchChange(attributeForm)"></s-switch>
      </s-form-item>
      <s-form-item label="是否必填" prop="requiredStatus">
          <s-switch v-model="attributeForm.requiredStatus" size="small" :active-value="1" :inactive-value="0"
                    :disabled="attributeForm.switchStatus===1||isOnlyTeamLeader" @change="switchChange(attributeForm)"></s-switch>
      </s-form-item>
      <s-form-item label="是否支持批量编辑" prop="supportEditing">
          <s-switch v-if="attributeForm.colnumName!=='资产编码'" size="small" v-model="attributeForm.supportEditing" :active-value="1" :inactive-value="0"
                    :disabled="attributeForm.switchStatus===1||isOnlyTeamLeader" @change="switchChange(attributeForm)"></s-switch>
          <s-switch v-if="attributeForm.colnumName==='资产编码'" size="small" v-model="attributeForm.supportEditing" :active-value="1" :inactive-value="0"
                    :disabled="true||isOnlyTeamLeader" @change="switchChange(attributeForm)"></s-switch>
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
          $axios.get(`/resourcemanager/configurationmanage/generalProperty/duplicatedCheck/${value}`).then((res) => {
            if (res.data.state) {
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
        defaultProps: {
          label: 'name',
          children: 'childrenList',
          uuid: 'uuid'
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        optiontext: '',
        optionbase: [],
        treeoption: '',
        autooption: [],
        editName: '',
        isOnlyTeamLeader: false,
        attributeForm: {
          uuid: null,
          dataType: 1,
          colnumName: '',
          attributeDesc: '',
          dropDownOptionList: [],
          dropDownOptionText: '',
          dropDownOptionNum: null,
          dropDownOptionDate: null,
          applicationStatus: 1,
          requiredStatus: 0,
          supportEditing: 0,
          switchStatus: 0
        },
        rule: {
          colnumName: [ Validaters.NotNull, Validaters.Max(40), { pattern: /^[\u4e00-\u9fa5|a-zA-Z|0-9|(|)]+$/, message: '由中文、字母、数字组成', trigger: 'blur' }, {validator: checkName, trigger: 'blur'} ],
          attributeDesc: [ Validaters.Max(120) ],
          dropDownOptionList: [ Validaters.NotNull, {validator: checkOption, trigger: 'blur'} ],
          dropDownOptionText: [ Validaters.Max(30) ],
          dropDownOptionNum: [ {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'} ]
        }
      }
    },
    watch: {
    },
    created() {
      let role = this.$store.state.userData.roleUuidsStr ? this.$store.state.userData.roleUuidsStr.split(',') : [];
      if (role.length === 1 && role[0] === 'tsecondroleinfo00000000000000008') {
        // 如果角色只有团队主管，只能查看
        this.isOnlyTeamLeader = true;
      }
      if (this.rowData) {
        this.editName = this.rowData.colnumName;
        this.attributeForm = Object.assign(this.attributeForm, this.rowData);
        if (!this.attributeForm.dropDownOptionList) {
          this.attributeForm.dropDownOptionList = [];
        }
        if (this.rowData.defaultValue && this.rowData.dataType === 1) {
          this.attributeForm.dropDownOptionText = this.rowData.defaultValue
        } else if (this.rowData.defaultValue && this.rowData.dataType === 2) {
          this.attributeForm.dropDownOptionNum = this.rowData.defaultValue
        } else if (this.rowData.defaultValue && this.rowData.dataType === 3 && this.attributeForm.defaultStatus === 1 && this.attributeForm.dropDownOptionList.length && !this.attributeForm.dropDownOptionList[0].childrenList) {
          this.optionbase = [this.rowData.defaultValue]
        } else if (this.rowData.defaultValue && this.rowData.dataType === 3 && this.attributeForm.defaultStatus === 1 && this.attributeForm.dropDownOptionList.length && this.attributeForm.dropDownOptionList[0].childrenList) {
          this.treeoption = this.rowData.defaultValue
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys([this.treeoption], true)
          })
        } else if (this.rowData.defaultValue && this.rowData.dataType === 3 && this.attributeForm.defaultStatus !== 1) {
          this.autooption = [this.rowData.defaultValue]
        } else if (this.rowData.defaultValue && this.rowData.dataType === 4) {
          this.attributeForm.dropDownOptionDate = this.rowData.defaultValue
        }
      }
      let checkNum = (rule, value, callback) => {
        let reg = /^-?\d+(\.{0,1}\d+){0,1}$/
        if (value) {
          if (!reg.test(value)) {
            callback(new Error('请输入数值'))
          } else {
            let x = -2147483648;
            let y = 2147483648;
            if (parseFloat(value) <= y && parseFloat(value) >= x) {
              callback()
            } else {
              callback(new Error('请输入(-2147483648~2147483648)范围内的数值'))
            }
          }
        } else {
          callback()
        }
      };
      if ((this.rowData && this.rowData.defaultStatus !== 1) || !this.rowData) {
        this.rule.dropDownOptionNum[0] = {pattern: /^(\-|\+)?\d+(\.\d{1,2})?$/, message: '最多可包含小数点后两位', trigger: 'blur'}
        this.rule.dropDownOptionNum.push({validator: checkNum})
      }
    },
    methods: {
      checkChange(item, node) {
        if (node === true) {
          this.treeoption = item.uuid
          this.$refs.tree.setCheckedKeys([item.uuid], true)
        }
      },
      handlerChange(item) {
        this.optionbase = this.optionbase.includes(item.realValue) ? [item.realValue] : []
      },
      handlerAutoChange(item) {
        this.autooption = this.autooption.includes(item.realValue) ? [item.realValue] : []
      },
      switchChange(row) {
        $axios.post(`/resourcemanager/configurationmanage/generalProperty/generalPropertyStatusSwitch`, row).then((res) => {});
      },
      addOption() {
        if (this.optiontext) {
          if (this.optiontext.length > 30) {
            this.$message({type: 'warning', message: '最长输入30个字符'});
          } else if (this.attributeForm.dropDownOptionList.map(val => val.listvalues).includes(this.optiontext)) {
            this.$message({type: 'warning', message: '选项不能重复'});
            this.optiontext = null
          } else {
            if (this.rowData) { // edit
              this.attributeForm.dropDownOptionList.push({uuid: this.attributeForm.uuid, listvalues: this.optiontext, realValue: this.optiontext})
            } else { // plus
              this.attributeForm.dropDownOptionList.push({uuid: null, listvalues: this.optiontext, realValue: this.optiontext})
            }
            this.optiontext = null;
          }
        } else {
          this.$message({type: 'warning', message: '选项不能为空'});
        }
        this.$refs.attributeForm.validateField('dropDownOptionList')
      },
      deleteOption(val) {
        let index = this.attributeForm.dropDownOptionList.findIndex(item => item.listvalues === val);
        this.attributeForm.dropDownOptionList.splice(index, 1)
      },
      dialogClose() {
        this.$emit('update:addDialog', false)
      },
      dialogOk() {
        let vm = this
        this.$refs.attributeForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          let form = cloneDeep(this.attributeForm);
          if (!form.dropDownOptionList.length) {
            form.dropDownOptionList = null;
          }
          let obj = {
            data: [form],
            logTemplate: this.rowData ? '编辑|通用属性>通用属性(#colnumName#)' : '添加|通用属性>通用属性(#colnumName#)'
          }
          form.defaultValue = form.dropDownOptionText ? form.dropDownOptionText : form.dropDownOptionNum ? form.dropDownOptionNum : form.dropDownOptionDate ? form.dropDownOptionDate : vm.optionbase.length > 0 ? vm.optionbase[0] : vm.autooption.length > 0 ? vm.autooption[0] : vm.treeoption ? vm.treeoption : null
          $axios.post('/resourcemanager/configurationmanage/generalProperty/saveOrUpdateProperty', form, obj).then((res) => {
            if (res.data.state) {
              vm.$message.success('保存成功！')
              vm.$emit('reload')
              vm.dialogClose();
            } else {
              vm.$message.error('保存失败')
            }
          })
        })
      }
    }
  }
</script>

<style>
.setOption{
  width: 308px;
  box-sizing: border-box;
}
.setOption li{
  padding: 0 10px;
  height: 30px;
  text-overflow: ellipsis;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
}
.addOption:hover{
  font-weight: bold;
  cursor: pointer;
}
.treeicon .s-checkbox-inner{
  border-radius: 10px !important;
}
</style>
