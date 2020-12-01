/**
* Created by dgunzi on 2018/12/26.
*/
<template>
  <div class="freSetForm">
      <s-form ref="setForm" :model="setForm" :rules="setRules" label-width="120px" id="assetAddDialog">
        <div class="prompt-info"><i class="iconfont icon-alarm"></i> 请选择资产类型，由此确定可选择的资产范围。(必选)</div>
        <s-form-item label="资产类型" prop="ciTypeUuid" class="freitem">
          <s-cascader
            class="inputDialog"
            placeholder="请选择设备的三级分类"
            :options="citypeOptions"
            v-model="setForm.ciTypeUuid"
            @change="selectTreeChange">
          </s-cascader>
        </s-form-item>
        <div class="prompt-info"><i class="iconfont icon-alarm"></i> 请选择资产型号，进一步确定可选择的资产范围。(必选)</div>
        <s-form-item label="资产型号" prop="modelNumber" class="freitem">
          <s-input v-model="setForm.modelNumber" readonly :icon="icon" @click="showModelNumDialog" class="inputDialog" ref="modelInput"></s-input>
        </s-form-item>
        <s-table-page
          ref="multipleTable"
          :data="FreSetData"
          :header-search="getHeaderSearch()"
          :show-header-checkbox="true"
          v-if="tableGroup"
          :height="240">
          <s-table-column type="selection" width="45"/>
          <s-table-column label="资产名称" prop="itcompName"/>
          <s-table-column label="IP" prop="controlAdderss"/>
          <s-table-column label="监控频率(秒)" prop="monitorRate"/>
        </s-table-page>
        <s-form-item label="监控频率" class="rateform  freitem" prop="MonitorRate">
          <s-input v-model="setForm.MonitorRate" class="inputDialog" prop="MonitorRate"
                  placeholder="请输入大于等于30的正整数"></s-input>
          秒
        </s-form-item>
      </s-form>
      <s-button @click="SetdialogSave" class="save" :disabled="dialogDisabled">保存</s-button>
    <!-- 选择资产型号dialog -->
    <model-number-dialog v-model="modelNumberDialogFlag" v-if="modelNumberDialogFlag" @select-model="selectModel">
    </model-number-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  import modelNumberDialog from '../MonitorDialog/ModelNumberSetDialog';
  import {cloneDeep} from 'lodash';

  function validHasMark(rule, value, callback) {
    let reg = /(^[3-9][0-9]$)|(^[1-9][0-9]{2,3}$)/;
    if (!reg.test(value)) {
      callback(new Error(`请输入大于等于30小于9999的正整数`));
    }
    callback();
  }

  export default {
      name: 'FreSetForm',
      data() {
          return {
            icon: 'plus',
            modelNumberDialogFlag: false,
            tableGroup: false,
            selectUuid: [],
            FreSetData: [],
            multidata: [],
            citypeOptions: [],
            setForm: {
              ciTypeUuid: [],
              modelNumber: '',
              productUuid: '',
              MonitorRate: ''
            },
            setRules: {
              ciTypeUuid: [{type: 'array', required: true, message: '不能为空', trigger: 'blur'}],
              MonitorRate: [
                Validaters.NotNull,
                {validator: validHasMark, trigger: 'blur'}
              ]
            },
            dialogDisabled: false
          }
      },
      components: {
        modelNumberDialog
      },
      mounted() {

      },
      created() {
        this.axiosCitypeTree()
      },
      methods: {
        axiosCitypeTree() {
          // 选项卡1：资产类型下拉树
          $axios.get('/resourcemanager/configurationmanage/citype/getCitypeTree').then(({data}) => {
            this.citypeOptions = this.circleGetOptions(data).tree;
          });
        },
        /**
         * 递归修改设备三级分类树返回数据格式
         * childrenList --> children
         * 去除最后一级的childrenList:[] 为空数组引起的bug
         */
        circleGetOptions(arr) {
          return {
            tree: arr.map(item => {
              let obj = {
                value: item.uuid,
                label: item.name,
                node: {catogeryUuid: item.node.catogeryUuid}
              };
              if (item.childrenList && item.childrenList.length > 0) {
                obj.children = this.circleGetOptions(item.childrenList).tree
              }
              return obj;
            })
          }
        },
        // 资产类型变化后响应函数
        selectTreeChange(ary) {
          let param = {
            ciTypeUuid: ary[ary.length - 1]
          };
          this.axiosFreSetData(param, data => {
            if (!param.uuid) {
              this.tableGroup = false;
            }
            this.tableGroup = true;
          });
        },
        // 根据选定的 “资产类型” 发送ajax请求数据，显示在tab-page中
        axiosFreSetData(param, callback = function () {
        }) {
          $axios.post('/systemmanager/sysConfig/getMonitorItcomp', param).then((res) => {
            callback(res.data);
            this.FreSetData = res.data
          })
        },
        // 显示 “资产型号”
        showModelNumDialog() {
          if (this.icon === 'error') {
            this.setForm.modelNumber = '';
            let param = {
              ciTypeUuid: this.setForm.ciTypeUuid[this.setForm.ciTypeUuid.length - 1]
            };
            this.axiosFreSetData(param, data => {});
            return
          }
          let uuidAry = cloneDeep(this.setForm.ciTypeUuid);
          if (!uuidAry[uuidAry.length - 1]) {
            this.$message({showClose: true, message: '请先选择资产类型', type: 'error'});
            return;
          }
          this.modelNumberDialogFlag = true;
        },
        // 根据选定的 “资产型号” 过滤出数据显示在tab-page中
        selectModel(model) {
          this.setForm.modelNumber = model.productName;
          this.setForm.productUuid = model.productUuid;
          // 下面的代码是为了修复验证
          this.$refs.setForm.validateField('modelNumber');
          this.ajaxModelNum();
        },
        // 保存后回显（选择了资产类型和资产型号）
        ajaxModelNum() {
          let lastIndex = this.setForm.ciTypeUuid.length - 1;
          let param = {
            ciTypeUuid: this.setForm.ciTypeUuid[lastIndex],
            manufactUuid: '',
            productUuid: this.setForm.productUuid
          };
          this.axiosmodelNum(param);
        },
        // 保存后回显（仅选择了资产类型）
        ajaxCitype() {
          let lastIndex = this.setForm.ciTypeUuid.length - 1;
          let param = {
            ciTypeUuid: this.setForm.ciTypeUuid[lastIndex]
          };
          this.axiosFreSetData(param);
        },
        // 保存回显时调用，param：选中的资产型号，发送ajax来显示在tab-page中
            axiosmodelNum(param, callback = function () {
        }) {
          $axios.post('/systemmanager/sysConfig/getMonitorItcomp', param).then((res) => {
            callback(res.data);
            this.FreSetData = res.data
          })
        },
        // 获取表格中选中的数据（uuid）
        getTableSelection() {
          let val = this.$refs['multipleTable'].getAllSelectedData();
          let ary = [];
          for (let i of val) {
            ary.push(i.uuid);
          }
          return ary;
        },
        // s-table-page组件的查询方法
        getHeaderSearch() {
          return {
            width: 10,
            placeholder: '请输入资产名称、IP进行查询',
            searchProps: ['itcompName', 'controlAdderss']
            }
        },
        // 保存
        SetdialogSave() {
        let form = this.$refs['setForm'];
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          let setMdata = this.setForm.MonitorRate;
          let addform = {
            rate: setMdata,
            uuids: this.getTableSelection()
          }
          if (addform.uuids.length === 0) {
            this.$message.warning('请勾选所要设置频率的资产');
          } else {
            this.dialogDisabled = true;
            $axios.post('/systemmanager/sysConfig/siteMonitorRate', addform, {
              data: [],
              logTemplate: '设置监控频率|监控频率设置'
            }).then((res) => {
              if (res.data === 'success') {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                if (this.setForm.modelNumber) {
                  this.ajaxModelNum();
                } else {
                  this.ajaxCitype();
                }
                this.dialogDisabled = false;
                this.setForm.MonitorRate = '';
              } else {
                this.$message.error('保存失败');
              }
            });
          }
        })
        }
      },
      watch: {
        'setForm.ciTypeUuid': {
          handler(val) {
            if (val) {
              this.setForm.modelNumber = '';
            }
          }
        },
        'setForm.modelNumber': {
          handler(val) {
            if (!val) {
              this.icon = 'plus';
            } else {
              this.icon = 'error';
            }
          }
        }
      }
  }
</script>

<style scoped>
.freSetForm{
  position: relative;
}
.save{
  position: absolute;
  bottom: -68px;
  right: 70px;
}
</style>
