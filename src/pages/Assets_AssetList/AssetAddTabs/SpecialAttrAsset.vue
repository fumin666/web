<!-- 特殊属性 -->
<template>
  <div id="special-attr">
    <s-scrollbar wrap-style="max-height: 230px;" v-if="isEdit === true">
      <s-form label-width="100px" ref="baseForm1" :model="specialEditForm" :rules="rules">
        <s-col v-for="(item, index) in specialEditForm" :key="index" :span="12">
          <s-form-item
            :label="specialEditForm[index].colnumName"
            :key="index"
            :prop="`${index}.defaultValue`"
            style="margin-bottom: 10px;">
            <s-row>
              <s-col :span="18">
                <s-input v-if="item.htmlType === 'udf_char_single_line'" v-model="specialEditForm[index].defaultValue"></s-input>
                <s-select style="width: 100%;" v-if="item.htmlType === 'udf_char_list'" v-model="specialEditForm[index].defaultValue">
                  <s-option v-for="i in item.listvalues"  :key="i.listvalues" :value="i.listvalues" :label="i.listvalues"></s-option>
                </s-select>
                <s-input v-if="item.htmlType === 'udf_long'" v-model="specialEditForm[index].defaultValue"></s-input>
                <s-date-picker
                  v-else-if="item.htmlType==='udf_date'"
                  v-model="specialEditForm[index].defaultValue"
                  type="datetime"
                  style="width: 100%"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择特殊属性日期">
                </s-date-picker>
              </s-col>
            </s-row>
          </s-form-item>
        </s-col>
      </s-form>
    </s-scrollbar>
    <div v-nodata="listData.length == 0" v-if="isEdit === true && listData.length == 0" style="height: 150px"></div>
    <s-row style="text-align: right;margin-top: 10px;" v-if="(listData.length !== 0 && permission) && showFlag">
      <s-button @click="saveSpecialAttr">保 存</s-button>
      <s-button @click="resetAttr">重 置</s-button>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { cloneDeep } from 'lodash'
  import {Validaters} from 'sunflower-common-utils'
  export default {
    data() {
      return {
        initDataList: {},
        attributeValue: '',
        uuid: '',
        showFlag: true,
        isEdit: false,
        addType: '',
        isReset: true,
        listData: [],
        defaultData: [],
        specialEditForm: {},
        rules: {}
      }
    },
    props: {
      addAssetUuid: {
        type: String,
        default: ''
      },
      attrvalueView: {
        type: Object
      },
      permission: {   // 表示是否有操作按钮的权限
        type: Boolean,
        default: false
      },
      citypeUuid: {
        type: String,
        default: ''
      }
    },
    methods: {
      saveSpecialAttr() {
        this.handlerAdd()
      },
      handlerAdd() {
        // 编辑状态下  保存
        let updateArr = [];
        let newData = {};
        let vm = this
        let arr = []
        if (vm.specialEditForm) {
          for (let key in vm.specialEditForm) {
            arr.push(vm.specialEditForm[key]);
          }
          for (let i in arr) {
            let param = {
              ciUuid: vm.addAssetUuid,
              colnumName: arr[i].colnumName,
              htmlType: arr[i].htmlType,
              attributeValue: arr[i].defaultValue,
              attributeUuid: arr[i].uuid,
              isRequired: arr[i].isRequired,
              listvalues: arr[i].htmlType === 'udf_char_list' ? arr[i].listvalues : []
            }
            if (param.htmlType === 'udf_char_single_line') {
              if (param.attributeValue && param.attributeValue.length > 100) {
                vm.$message({type: 'error', message: `"${param.colnumName}"` + '最多输入100个字'})
                return;
              }
            }
            if (param.htmlType === 'udf_date') {
              if (param.attributeValue === '') {
                param.attributeValue = null;
              }
            }
            updateArr.push(param);
            newData[arr[i].colnumName] = arr[i].defaultValue;
          }
          let oldData = {};
          for (let key in vm.defaultData) {
            oldData[vm.defaultData[key].colnumName] = vm.defaultData[key].defaultValue;
          }
          let updataObj = {};
          updataObj.uuid = vm.$route.params.assetUuid;
          for (let key in newData) {
            if (newData[key] !== oldData[key]) {
              updataObj[key] = newData[key]
            }
          }
          vm.$refs.baseForm1.validate(valid => {
            if (valid) {
              $axios.post('/resourcemanager/assetmanager/itasset/saveCitypeAttrValue', updateArr).then((res) => {
                if (res.data === 'true') {
                  vm.$message({
                    message: '保存成功!',
                    type: 'success'
                  })
                  $axios.post('/resourcemanager/assetmanager/itasset/saveAllChangedAttributes', updataObj).then((res) => {})
                  vm.$store.commit('setSpecialAttrDataList', updateArr)
                  // 重置默认数据
                  vm.resetDefaltData(updateArr);
                } else {
                  vm.$message({
                    message: '保存失败!',
                    type: 'error'
                  })
                }
              })
            } else {
              vm.$message({
                message: '请填写完整表单',
                type: 'info'
              })
              return;
            }
          })
        } else {
          vm.$message({
            message: '请先在配置项管理添加特殊属性',
            type: 'info'
          })
        }
      },
      resetDefaltData(val) {
        this.defaultData = [];
        this.listData = [];
        if (val.length > 0) {
          for (let i in val) {
            let param = {
              ciUuid: val[i].ciUuid,
              colnumName: val[i].colnumName,
              defaultValue: val[i].attributeValue,
              uuid: val[i].attributeUuid,
              htmlType: val[i].htmlType,
              isRequired: val[i].isRequired,
              listvalues: val[i].htmlType === 'udf_char_list' ? val[i].listvalues : []
            }
            this.listData.push(cloneDeep(param));
            this.defaultData.push(cloneDeep(param));
          }
        }
      },
      resetAttr() {
        // 编辑重置
        for (let i in this.defaultData) {
          this.specialEditForm[this.defaultData[i].uuid].defaultValue = this.defaultData[i].defaultValue;
        }
      },
      filterAttr(val) {
        this.listData = [];
        this.defaultData = [];
        let vm = this
        $axios.post('resourcemanager/assetmanager/itasset/findAddSelect').then((res) => {
          this.initDataList = res.data.citypeList;
          this.$nextTick(() => {
            if (Object.keys(val).length > 0) {
              for (let i in val) {
                let param = val[i];
                vm.listData.push(cloneDeep(param));
                vm.defaultData.push(cloneDeep(param));
              }
            }
            for (let i in vm.listData) {
              vm.getEditSearchForm(vm.listData[i])
            }
          })
        })
      },
      getEditSearchForm(param) {
        this.$set(this.specialEditForm, param.uuid, {
          colnumName: param.colnumName,
          htmlType: param.htmlType,
          uuid: param.uuid,
          defaultValue: param.defaultValue,
          listvalues: param.listvalues,
          isRequired: param.isRequired
        })
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
        let v = [];
        if (param.htmlType === 'udf_long') {
          if (param.isRequired) {
            v = [Validaters.NotNull, { validator: checkNum, trigger: 'blur' }, {pattern: /^(\-|\+)?\d+(\.\d{1,2})?$/, message: '最多可包含小数点后两位', trigger: 'blur'}]
          } else {
            v = [{ validator: checkNum, trigger: 'blur' }, {pattern: /^(\-|\+)?\d+(\.\d{1,2})?$/, message: '最多可包含小数点后两位', trigger: 'blur'}]
          }
        } else if (param.htmlType === 'udf_char_list') {
          if (param.isRequired) {
            v = [Validaters.SelectValNotNull]
          }
        } else {
          if (param.isRequired) {
            v = [Validaters.NotNull]
          }
        }
        this.$set(this.rules, `${param.uuid}.defaultValue`, v)
      }
    },
    created() {
      if (this.$route.name === 'AssetsAll_assetEdit' || this.$route.name === 'AssetsAll_assetDetail' || this.$route.name === 'assetsManage_assetStatistics' || this.$route.name === 'assetsManage_omaAssetStatistics') {
        this.isEdit = true;
        this.uuid = this.$route.params.assetUuid;
        if (this.$store.state.assetsManage.specialAttrDataList.length === 0) {
          this.filterAttr(this.attrvalueView);
        } else {
          let arr1 = this.$store.state.assetsManage.specialAttrDataList;
          for (let i in arr1) {
            let param = {
              ciUuid: arr1[i].ciUuid,
              colnumName: arr1[i].colnumName,
              defaultValue: arr1[i].attributeValue,
              uuid: arr1[i].attributeUuid,
              htmlType: arr1[i].htmlType,
              isRequired: arr1[i].isRequired,
              listvalues: arr1[i].htmlType === 'udf_char_list' ? arr1[i].listvalues : []
            }
            this.listData.push(cloneDeep(param));
            this.getEditSearchForm(param)
            this.defaultData.push(cloneDeep(param));
          }
        }
      }
    },
    watch: {
      'attrvalueView': function (val) {
        this.filterAttr(this.attrvalueView);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #special-attr
    .special-font-size
      font-size 14px
</style>
