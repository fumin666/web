<template>
  <div>
    <s-card v-for="item in scoreSet.cmdbTypes" :key="item.uuid" class="setScore-box-card">
      <div slot="header" class="clearfix">
                <span class="card-title">
                  <s-row>
                    <s-col style="height: 30px; line-height: 30px" span="20">
                      <span class="grade-title">{{ item.cmdbTypeName }}打分设置</span>
                    </s-col>
                    <s-col span="4">
                      <s-button style="float: right"
                                @click="doScoreSet(item)" icon="set">设置</s-button>
                    </s-col>
                  </s-row>
                </span>
      </div>
      <div style="margin: 10px 0;line-height: 30px" class="spanText">
        总分 =
        <span v-if="item.kpiMiList.filter(function (item) { if(item.isSelected === 1) return true; return false; }).length > 0">
                  <span
                    v-for="(i,index) in item.kpiMiList.filter(function (item) {if(item.isSelected === 1) return true; return false; })"
                    :key="index">
                    <s-button size="mini" @click="openRuleDialog(i, item)">{{ i.miName }}</s-button>*
                    <span style="vertical-align: middle">{{ i.weight }}</span>
                    <span
                      v-if="index !== item.kpiMiList.filter(function (item) { if(item.isSelected === 1) return true; return false; }).length - 1">+</span>
                  </span>
                </span>
      </div>
    </s-card>

    <!--资产监控打分设置--设置关键指标-->
    <s-dialog
      v-model="scoreSetKeyDialog"
      v-if="scoreSetKeyDialog"
      width="700px"
      :title="`设置关键指标(${scoreSetKeyDialogName})`">
      <s-tab>
        <s-tab-pane label="选择资产">
          <s-table-page :data='scoreSet.ownerAssets'
                    @selection-change="onAssetsSelectionChange"
                    :searchDef="{show:false}"
                    :header-actions='getListActionofScore()'>
            <s-table-column
              type="selection"
              width="45">
            </s-table-column>
            <s-table-column
              label="资产名称"
              prop="itcompName"
              show-overflow-tooltip>
            </s-table-column>
            <s-table-column
              label="IP地址"
              prop="controlAdderss"
              show-overflow-tooltip>
            </s-table-column>
            <s-table-column
              label="资产类型"
              prop="citypeName"
              show-overflow-tooltip>
            </s-table-column>
          </s-table-page>
          <s-row style="margin-top:20px" :gutter="20">
            <s-col :offset="16" span="4">
              <s-button style="width:100%" @click="saveAssetAndKey">保存</s-button>
            </s-col>
            <s-col span="4">
              <s-button style="width:100%" type="cancel" @click="scoreSetKeyDialog = false">取消</s-button>
            </s-col>
          </s-row>
        </s-tab-pane>
        <s-tab-pane label="选择关键指标">
          <s-table
            @select-all="handleKeySelectionChange"
            @select="handleKeySelectionChange"
            ref="keyTable"
            :data="scoreSet.keyListCache"
            style="width: 100%">
            <s-table-column
              type="selection"
              width="45">
            </s-table-column>
            <s-table-column
              prop="miName"
              label="指标名称">
            </s-table-column>
            <s-table-column
              label="权重">
              <template slot-scope="scope">
                <s-input-number v-model="scope.row.weight" :step="0.01" :min="0" :max="1"
                                placeholder="输入权重"></s-input-number>
              </template>
            </s-table-column>
          </s-table>
          <s-row style="margin-top:20px" :gutter="20">
            <s-col :offset="16" span="4">
              <s-button style="width:100%" @click="saveAssetAndKey">保存</s-button>
            </s-col>
            <s-col span="4">
              <s-button style="width:100%" type="cancel" @click="scoreSetKeyDialog = false">取消</s-button>
            </s-col>
          </s-row>
        </s-tab-pane>
      </s-tab>
    </s-dialog>
    <!--资产监控打分设置--指标规则-->
    <s-dialog
      v-model="scoreSetRuleDialog"
      v-if="scoreSetRuleDialog"
      width="700px"
      :title="`指标规则`">
      <s-button style="margin-bottom: 8px" icon="plus" @click="handleAddRule">添加</s-button>
      <s-button style="margin-bottom: 8px" icon="delete" @click="handleDeleteRule()">删除</s-button>
      <s-table
        @selection-change="handleRuleSelectionChange"
        :data="scoreSet.rulesCache"
        style="width: 100%">
        <s-table-column
          type="selection"
          width="45">
        </s-table-column>
        <s-table-column
          prop="name"
          label="规则">
        </s-table-column>
        <s-table-column
          prop="scoure"
          label="分值">
        </s-table-column>
        <s-table-column
          label="操作">
          <template slot-scope="scope">
            <i @click="handleDeleteRule(scope.row)" class="iconfont icon-delete"></i>
            <i @click="handleEditRule(scope.row)" class="iconfont icon-edit"></i>
          </template>
        </s-table-column>
      </s-table>
    </s-dialog>
    <!--添加指标规则-->
    <s-dialog
      v-model="addRuleDialog"
      v-if="addRuleDialog"
      width="500px"
      title="添加规则">
      <add-rule ref="rule" :ruleItem="scoreSet.ruleItem" :unit="scoreSet.unit" :compare="scoreSet.compare"
                :condition="scoreSet.condition"></add-rule>
      <template slot="footer">
        <s-button @click="saveRule()">保存</s-button>
        <s-button type="cancel" @click="addRuleDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑指标规则-->
    <s-dialog
      v-model="editRuleDialog"
      v-if="editRuleDialog"
      width="500px"
      title="编辑规则">
      <add-rule ref="rule" :ruleItem="scoreSet.ruleItem" :unit="scoreSet.unit" :compare="scoreSet.compare"
                :condition="scoreSet.condition" :data="scoreSet.ruleDataEditing"></add-rule>
      <template slot="footer">
        <s-button @click="saveRule('edit')">保存</s-button>
        <s-button type="cancel" @click="editRuleDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--选择资产-->
    <s-dialog
      v-model="scoreSetassetDialog"
      v-if="scoreSetassetDialog"
      title="选择资产"
      key="bloomSelect"
      width="800px">
      <select-asset ref="scoreSetAsset" :asset="scoreSet.assets"></select-asset>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addAssets">确定</s-button>
        <s-button @click="scoreSetassetDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {cloneDeep} from 'lodash'

  import SelectAsset from '@/home/SystemSet/components/SelectAsset.vue'
  import addRule from '@/home/SystemSet/components/addRule.vue'

  export default {
    data() {
      return {
        scoreSet: {
          cmdbTypes: [],
          uuidCache: '',
          cmdbTypeUuidCache: '',
          keyListCache: [],
          rulesCache: [],
          // 当前编辑中资产
          ruleItem: {},
          // 选中规则组
          selectedRules: [],
          // 规则条件
          compare: [],
          condition: [],
          unit: '',
          // 选择资产
          assets: [],  // 所有资产
          ownerAssets: [],  // 当前资产
          ownerAssetsSelected: [],  // 当前资产
          ruleDataEditing: {} // 编辑中规则
        },
        scoreSetassetDialog: false,
        scoreSetKeyDialog: false,
        scoreSetKeyDialogName: '',
        scoreSetRuleDialog: false,
        addRuleDialog: false,
        editRuleDialog: false,
        selections: []
      }
    },
    created() {
      // 资产监控打分
      this.getDeviceTypes()
    },
    methods: {
      // **************资产监控打分设置********************
      getListActionofScore () {
        let _self = this
        return {
          width: 12,
          actions: [
            {
              name: '添加',
              click() {
                let ownerAssetsUuid = _self.scoreSet.ownerAssets.map(function (item) {
                  return item.uuid
                })
                $axios.get('/kpi/getMonitorItcompByCmdbTypeUuidForKpi/' + _self.scoreSet.uuidCache + '/0').then(({data}) => {
                  _self.scoreSetassetDialog = true
                  _self.scoreSet.assets = data.filter(function (item) {
                    if (ownerAssetsUuid.indexOf(item.uuid) === -1) {
                      return true
                    }
                    return false
                  })
                });
              },
              icon: 'plus'
            },
            {
              name: '删除',
              click() {
                if (_self.scoreSet.ownerAssetsSelected.length > 0) {
                  let ownerAssetsSelectedUuid = _self.scoreSet.ownerAssetsSelected.map(function (item) {
                    return item.uuid
                  })
                  _self.scoreSet.ownerAssets = _self.scoreSet.ownerAssets.filter(function (item) {
                    if (ownerAssetsSelectedUuid.indexOf(item.uuid) === -1) {
                      return true
                    } else {
                      return false
                    }
                  })
                  _self.$message('点击保存提交更改!')
                } else {
                  _self.$message.error('请选择数据!')
                }
              },
              icon: 'delete'
            }
          ]
        }
      },
      // 获取数据
      getDeviceTypes () {
        $axios.get('/kpi/getCmdbTypeList').then(({data}) => {
          this.scoreSet.cmdbTypes = data
        })
      },
      doScoreSet (item) {
        this.scoreSetKeyDialog = true
        // 存储数据
        this.scoreSetKeyDialogName = item.cmdbTypeName
        this.scoreSet.uuidCache = item.uuid
        this.scoreSet.cmdbTypeUuidCache = item.cmdbTypeUuid
        this.scoreSet.keyListCache = cloneDeep(item.kpiMiList)
        // 初始化资产数据
        $axios.get('/kpi/getMonitorItcompByCmdbTypeUuidForKpi/' + this.scoreSet.uuidCache + '/1').then(({data}) => {
          this.scoreSet.ownerAssets = data
        });
        // 设置关键指标选中状态
        this.$nextTick(function () {
          this.scoreSet.keyListCache.forEach((item) => {
            this.$refs.keyTable.toggleRowSelection(item, item.isSelected === 1)
          })
        })
      },
      // 设置
      handleKeySelectionChange (selection) {
        this.selections = selection
        let selected = selection.map(function (item) {
          return item.uuid
        })
        this.scoreSet.keyListCache.forEach((item) => {
          if (selected.indexOf(item.uuid) !== -1) {
            item.isSelected = 1
          } else {
            item.isSelected = 0
          }
        })
      },
      // 指标规则
      openRuleDialog (item, parent) {
        this.scoreSetRuleDialog = true
        this.scoreSetKeyDialogName = parent.cmdbTypeName
        // this.scoreSet.ruleItem.miName 名称
        this.scoreSet.ruleItem = item
        // 比较下拉框
        $axios.get(`/kpi/getKpiCompareByCompareType/${item.compareType}`).then(({data}) => {
          this.scoreSet.compare = data
        })
        // 指标值下拉框
        $axios.get(`/kpi/getKpiMiValueSelectByKpiMiUuid/${item.uuid}`).then(({data}) => {
          this.scoreSet.condition = data
        })
        // 单位
        $axios.get(`/kpi/getKpiMiUnitByKpiMiUuid/${item.uuid}`).then(({data}) => {
          this.scoreSet.unit = data
        })
        this.getCurrentRules()
      },
      onAssetsSelectionChange (selection) {
        this.scoreSet.ownerAssetsSelected = selection
      },
      // 添加资产
      addAssets () {
        this.scoreSetassetDialog = false
        let data = this.$refs.scoreSetAsset.getSelectedData();
        this.scoreSet.ownerAssets.push.apply(this.scoreSet.ownerAssets, data);
      },
      saveAssetAndKey() {
        Promise.all(
          [this.saveAsset(), this.saveKey()]
        ).then((data) => {
          this.scoreSetKeyDialog = false
          if (data.some(item => item)) {
            this.$message.success('保存成功')
          } else {
            this.$message.error('保存失败')
          }
        }).catch((err) => {
          this.$message.error(err + '!')
        })
      },
      saveAsset () {
        return new Promise((resolve, reject) => {
          $axios.post('/kpi/saveKpiItcomp/' + this.scoreSet.uuidCache, this.scoreSet.ownerAssets.map(function (item) {
            return item.uuid
          })).then(({data}) => {
            if (data === true) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      },
      saveKey () {
        return new Promise((resolve, reject) => {
          let _self = this
          let count = 0
          let length = 2
          let params = _self.scoreSet.keyListCache.map(function (item) {
            if (item.isSelected === 1) {
              let newLength = 0
              if (item.weight && item.weight.toString().indexOf('.') !== -1) {
                newLength = item.weight.toString().split('.')[1].length
              }
              count += item.weight
              newLength > length ? length = newLength : length
            }
            return {
              isSelected: item.isSelected,
              uuid: item.uuid,
              weight: item.weight.toFixed(2)
            }
          })
          count = Number.parseFloat(count.toFixed(2))
          if (count === 1 || count === 0) {
            $axios.post('/kpi/saveKpiMiListAndKpiCmdbTypeIsSelected/' + _self.scoreSet.cmdbTypeUuidCache + '/1', params, {
              data: _self.scoreSet.keyListCache,
              logTemplate: `设置|设置>资产类别(${_self.scoreSetKeyDialogName})>指标(#miName#)`
            }).then(function ({data}) {
              if (data === true) {
                resolve(true)
                _self.getDeviceTypes() // 保存成功后刷新数据
              } else {
                resolve(false)
              }
            })
          } else {
            reject(`关键指标权重和为${count.toFixed(length)},权重和必须等于1`)
          }
        })
      },
      // 获取当前选中资产的指标规则
      getCurrentRules () {
        $axios.get(`/kpi/getKpiMiRuleGroupByKpiMiUuid/${this.scoreSet.ruleItem.uuid}`).then(({data}) => {
          this.scoreSet.rulesCache = data
        })
      },
      // 增加、编辑、删除rule
      handleRuleSelectionChange (selection) {
        this.scoreSet.selectedRules = selection
      },
      handleAddRule () {
        this.addRuleDialog = true
      },
      handleEditRule (row) {
        $axios.get(`/kpi/updateKpiMiRule/${row.uuid}`).then(({data}) => {
          this.scoreSet.ruleDataEditing = data
          this.editRuleDialog = true
        })
      },
      handleDeleteRule (row) {
        let params = []
        if (row) {
          params = [row.uuid]
        } else {
          params = this.scoreSet.selectedRules.map(function (item) {
            return item.uuid
          })
        }
        if (params.length > 0) {
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post('/kpi/deleteKpiMiRuleGroupByUuidList', params, {
              data: [],
              logTemplate: `删除|指标规则>资产类别(${this.scoreSetKeyDialogName})>指标(${this.scoreSet.ruleItem.miName})>规则(${this.scoreSet.ruleDataEditing.name})`
            }).then(({data}) => {
              if (data === true) {
                this.$message.success('删除成功')
              } else {
                this.$message.error('删除失败')
              }
              this.getCurrentRules()
            })
          }).catch(() => {})
        } else {
          this.$message.error('请选择数据!')
        }
      },
      // 保存rule
      saveRule (type) {
        // ruleItem.kpiCmdbTypeUuid, ruleItem.miName, scoreSet.ruleScore
        let scoreSet = this.$refs.rule.scoreSet
        let _self = this
        let valueArr = _self.scoreSet.condition.map ? _self.scoreSet.condition.map(function (item) {
          return item.name
        }) : []
        for (let i = 0; i < scoreSet.addRules.length; i++) {
          let keys = Object.keys(scoreSet.addRules[i])
          for (let j = 0; j < keys.length; j++) {
            if (scoreSet.addRules[i][keys[j]].length === 0 || scoreSet.addRules[i][keys[j]] === undefined || scoreSet.addRules[i][keys[j]] === null) {
              this.$message.error('请填写完整表单！')
              return false
            }
          }
        }
        let params = {
          compareCondition: 1,
          kpiMiUuid: _self.scoreSet.ruleItem.uuid,
          name: _self.scoreSet.ruleItem.miName,
          scoure: scoreSet.ruleScore,
          kpiMiRuleList: scoreSet.addRules.map(function (item) {
            if (typeof item.compareValue === 'number') {
              item.compareValue = item.compareValue + ''
              return {
                ...item,
                compareName: item.compareValue
              }
            } else {
              console.log(item.compareValue)
              return {
                ...item,
                compareUuid: item.compareUuid,
                compareValue: _self.scoreSet.condition[valueArr.indexOf(item.compareValue)].value,
                compareName: item.compareValue
              }
            }
          })
        }
        let txt = '添加'
        if (type === 'edit') {
          params.uuid = this.scoreSet.ruleDataEditing.uuid
          txt = '编辑'
        }
        $axios.post('/kpi/saveKpiMiRuleGroupAndMiRule', params, {
          // this.scoreSet.ruleItem.miName
          logTemplate: `${txt}|指标规则>资产类别(${_self.scoreSetKeyDialogName})>指标(${_self.scoreSet.ruleItem.miName})>规则(${this.scoreSet.ruleDataEditing.name})`
        }).then(({data}) => {
          if (data === 'true') {
            this.addRuleDialog = false
            this.editRuleDialog = false
            this.$message.success('保存成功')
            this.getCurrentRules()
          } else {
            this.$message.error(data)
          }
        })
      }
    },
    components: {
      addRule,
      SelectAsset
    }
  }
</script>

<style lang="stylus">
.setScore-box-card
  border-bottom 1px solid #dcdee2
  margin-bottom 5px
  .s-card-header
    border none
#index-body
  .s-card-header
    border none

</style>
