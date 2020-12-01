/**
* Created by alex on 2019/2/20.
*/
<template>
  <section>
    <s-form ref="addForm" :model="form" :rules="rules" label-width="120px">
      <s-form-item label="启动规则" prop="siem_isOpenDefualt">
        <s-switch v-model="form.siem_isOpenDefualt" :active-value="1" :inactive-value="0"></s-switch>
      </s-form-item>
      <s-form-item label="日志级别" prop="siem_logInfoLevel">
        <s-checkbox-group v-model="form.siem_logInfoLevel">
          <s-checkbox label="0">应急</s-checkbox>
          <s-checkbox label="1">警报</s-checkbox>
          <s-checkbox label="2">致命</s-checkbox>
          <s-checkbox label="3">错误</s-checkbox>
          <s-checkbox label="4">警告</s-checkbox>
          <s-checkbox label="5">提示</s-checkbox>
          <s-checkbox label="6">信息</s-checkbox>
          <s-checkbox label="7">诊断</s-checkbox>
          <s-checkbox label="8">未知</s-checkbox>
        </s-checkbox-group>
      </s-form-item>
      <s-form-item label="日志源" class="apply-special-table">
        <s-table-page :data='hostList'
                   :header-search="getSearchDef()"
                   ref="tableGroup"
                   @selection-change="handleSelectionChange">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column prop="citypeName" label="资产类型"></s-table-column>
          <s-table-column prop="itcompName" label="资产名称"></s-table-column>
          <s-table-column prop="controlAdderss" label="IP"></s-table-column>
        </s-table-page>
      </s-form-item>
      <s-form-item label="分析间隔" prop="siem_defualtPeriod">
        <s-input v-model="form.siem_defualtPeriod" style="width: 160px">
          <template slot="append">分钟</template>
        </s-input>
      </s-form-item>
      <s-form-item label="危害级别设置:">
        <s-button @click="openDialog">编辑规则</s-button>
        <s-table :data='ruleList'>
          <s-table-column prop="name" label="危害级别" width="150px"></s-table-column>
          <s-table-column prop="remark" label="判断参数"></s-table-column>
        </s-table>
      </s-form-item>
      <s-form-item>
        <s-button @click="save">保存</s-button>
      </s-form-item>
    </s-form>
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="800px"
      title="编辑">
      <edit-dialog :currentData="editData" ref="editComponent"></edit-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveData">确定</s-button>
        <s-button type="cancel" @click="editDialog= false">取消</s-button>
      </template>
    </s-dialog>
  </section>

</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  import editDialog from './components/EditDamageRule'
  export default {
    data() {
      return {
        form: {
          siem_defualtPeriod: '',
          siem_isOpenDefualt: '',
          siem_logInfoLevel: []
        },
        rules: {
          typeName: [{required: true, message: '不能为空', trigger: 'blur'}],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        },
        ruleList: [],
        hostList: [],
        editData: {},
        editDialog: false
      }
    },
    created() {
      this.getInit()
    },
    components: {

      editDialog
    },
    methods: {
      openDialog() {
        this.editDialog = true
      },
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['citypeName', 'itcompName', 'controlAdderss']
        }
      },
      handleSelectionChange(val) {
        this.uuids = val.map(item => item.logSorceUuid)
      },
      getInit() {
        $axios.get('/strategyInfo/getHazardAnalysisRule').then((res) => {
          this.hostList = res.data.logSourceList
          this.form = this.disposeHost(res.data.ruleInfo)
          this.ruleList = this.disposeRule(res.data.ruleList)
          this.editData = this.disposeEditData(res.data.ruleList)
          this.$nextTick(() => {
            this.hostList.forEach(item => {
              if (item.isDefault !== null) {
                this.$refs['tableGroup'].$refs['s-table-page'].toggleRowSelection(item, true)
              }
            })
          })
        })
      },
      disposeHost(data) {
        let temporaryObj = {}
        data.forEach(item => {
          switch (item.configName) {
            case 'siem_isOpenDefualt':
              temporaryObj.siem_isOpenDefualt = parseInt(item.configValue)
              break;
            case 'siem_logInfoLevel':
              temporaryObj.siem_logInfoLevel = item.configValue.split('#')
              break;
            case 'siem_defualtPeriod':
              temporaryObj.siem_defualtPeriod = item.configValue
              break;
          }
        })
        return temporaryObj
      },
      disposeRule(data) {
        let oneflag = true
        let twoflag = true
        let threeflag = true
        let fourflag = true
        let ruleLevel = ['应急', '警报', '致命', '错误', '警告', '提示', '信息', '诊断', '未知']
        let temporaryObj = [{id: 1, name: '紧急', remark: ''}, {id: 2, name: '严重', remark: ''}, {id: 3, name: '警告', remark: ''}, {id: 4, name: '提示', remark: ''}]
        data.forEach(item => {
          if (item.ruleValue !== null) {
            let remarkStr = `${ruleLevel[item.logLevel]}>=${item.ruleValue}`
            let remarkStr1 = ` 或 ${ruleLevel[item.logLevel]}>=${item.ruleValue}`
            switch (item.hazardLevel) {
              case 1:
                if (oneflag) {
                  temporaryObj[0].remark += remarkStr
                  oneflag = false
                  break;
                } else {
                  temporaryObj[0].remark += remarkStr1
                  break;
                }
              case 2:
                if (twoflag) {
                  temporaryObj[1].remark += remarkStr
                  twoflag = false
                  break;
                } else {
                  temporaryObj[1].remark += remarkStr1
                  break;
                }
              case 3:
                if (threeflag) {
                  temporaryObj[2].remark += remarkStr
                  threeflag = false
                  break;
                } else {
                  temporaryObj[2].remark += remarkStr1
                  break;
                }
              case 4:
                if (fourflag) {
                  temporaryObj[3].remark += remarkStr
                  fourflag = false
                  break;
                } else {
                  temporaryObj[3].remark += remarkStr1
                  break;
                }
            }
          }
        })
        return temporaryObj
      },
      disposeEditData(data) {
        let temporaryObj = [{name: '紧急', children: []}, {name: '严重', children: []}, {name: '警告', children: []}, {name: '提示', children: []}]
        data.forEach(item => {
          switch (item.hazardLevel) {
            case 1:
              temporaryObj[0].children.push(item); break;
            case 2:
              temporaryObj[1].children.push(item); break;
            case 3:
              temporaryObj[2].children.push(item); break;
            case 4:
              temporaryObj[3].children.push(item); break;
          }
        })
        return temporaryObj
      },
      save() {
        let arr = []
        let arrRuleInfo = []
        let formData = this.form
        this.editData.map(item => arrRuleInfo.push(...item.children))
        for (let key in formData) {
          let value = formData[key]
          key === 'siem_logInfoLevel' ? value = formData[key].join('#') : ''
          arr.push(
            {
              configName: key,
              configValue: value
            }
          )
        }
        let form = {
          ruleInfo: arr,
          logSourceList: this.uuids,
          ruleList: arrRuleInfo
        }
        $axios.post('/strategyInfo/saveHazardAnalysisRule', form, {
          data: [],
          logTemplate: '编辑|日志审计规则（潜在危害分析规则）'
        }).then((res) => {
          if (res.data.state === true) {
            this.$message.success('保存成功')
          } else {
            this.$message.error(res.data.errormsg)
          }
        })
      },
      saveData() {
        this.editData = this.$refs['editComponent'].formData
        let arr = []
        this.editData.map(item => arr.push(...item.children))
        this.ruleList = this.disposeRule(arr)
        this.editDialog = false
      }
    }
  }
</script>
