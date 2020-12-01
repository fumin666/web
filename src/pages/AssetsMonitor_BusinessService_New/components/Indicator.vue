
<template>
  <div class="business-card">
    <s-tab>
        <s-tab-pane label="服务状态定义">
        <s-row>
          <s-col class="card-body">
            <s-alert
              :title="`${defaultRules[0] ? defaultRules[0].levelName : ''}!${defaultRules[0] ? defaultRules[0].decription : ''}`"
              type="error"
              :closable="false"></s-alert>
            <s-alert
              :title="`${defaultRules[1] ? defaultRules[1].levelName : ''}!${defaultRules[1] ? defaultRules[1].decription : ''}`"
              type="warning"
              :closable="false"></s-alert>
            <s-alert
              :title="`${defaultRules[2] ? defaultRules[2].levelName : ''}!${defaultRules[2] ? defaultRules[2].decription : ''}`"
              type="success"
              :closable="false"></s-alert>
            <div class="btns" style="margin: 10px 0">
              <s-button icon="set" @click="addRule">自定义规则</s-button>
            </div>
            <s-table
              :data="serviceStatusData"
              style="width: 100%">
              <s-table-column
                prop="levelName"
                label="级别">
              </s-table-column>
              <s-table-column
                label="操作">
                <template slot-scope="scope">
                  <i class="iconfont icon-eye" @click="handleLookRule(scope.row)"></i>
                  <i class="iconfont icon-edit" @click="handleEditRule(scope.row)"></i>
                  <i class="iconfont icon-delete" @click="handleDeleteRule(scope.row)"></i>
                </template>
              </s-table-column>
            </s-table>
          </s-col>
          <s-col :span="8"></s-col>
        </s-row>
        </s-tab-pane>
        <s-tab-pane label="关键指标定义">
          <s-scrollbar wrap-style="max-height: 400px;">
            <s-table-page
            :header-search="{width:5,offset:19,placeholder:'请输入搜索条件'}"
            :row-actions="actionDef()"
            :data="keyIndex">
            <s-table-column
              label="资产名称"
              show-overflow-tooltip
              prop="itcompName">
            </s-table-column>
            <s-table-column
              label="IP地址"
              show-overflow-tooltip
              prop="controlAdderss">
            </s-table-column>
            <s-table-column
              label="层级"
              show-overflow-tooltip
              prop="cascadeLevelStr">
            </s-table-column>
          </s-table-page>
          </s-scrollbar>
        </s-tab-pane>
      </s-tab>
    <!--新增自定义规则-->
    <s-dialog
      v-model="ruleDialog"
      v-if="ruleDialog"
      width="700px"
      :before-close='closeRule'
      title="自定义规则"
      append-to-body>
      <define-rule ref="addRule" :levels="dialogRuleList" :data="ruleData"></define-rule>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitRule('addRule', '添加')">确定</s-button>
        <s-button @click="closeRule">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑自定义规则-->
    <s-dialog
      v-model="editRuleDialog"
      v-if="editRuleDialog"
      :before-close='editCloseRule'
      width="700px"
      title="编辑自定义规则"
      append-to-body>
      <define-rule ref="editRule" :levels="dialogRuleList" :data="ruleData" :uuid="currentUuid"></define-rule>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitRule('editRule', '编辑')">确定</s-button>
        <s-button @click="editCloseRule">取消</s-button>
      </template>
    </s-dialog>
    <!--查看自定义规则-->
    <s-dialog
      v-model="lookRuleDialog"
      v-if="lookRuleDialog"
      width="700px"
      title="查看自定义规则"
      append-to-body>
      <define-rule ref="lookRule" :editAble="false" :levels="dialogRuleList" :data="ruleData"
                   :uuid="currentUuid"></define-rule>
      <template slot="footer" class="dialog-footer">
        <s-button @click="lookRuleDialog = false">确定</s-button>
        <s-button @click="lookRuleDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--无可用自定义规则-->
    <s-dialog
      v-model="noRuleDialog"
      width="400px"
      title="自定义规则"
      append-to-body>无可用自定义规则
      <template slot="footer" class="dialog-footer">
        <s-button @click="noRuleDialog = false">确定</s-button>
      </template>
    </s-dialog>
    <!--设置指标 scroll-height-600px-->
    <s-dialog
      v-model="keyIndexDialog"
      v-if="keyIndexDialog"
      width="700px"
      title="设置指标"
      append-to-body>
      <s-scrollbar wrap-style="height: 320px;">
        <key-index ref="keyIndexData" :data="keyIndexData"></key-index>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitKeyIndexData">确定</s-button>
        <s-button @click="keyIndexDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script type="text/babel">

  // import serviceDialog from './ServiceDialog.vue'
  // import deviceDialog from './DeviceDialog.vue'
  import defineRule from './DefineRule.vue'
  import keyIndex from './SetKeyIndex.vue'
  import $axios from 'sunflower-ajax'
  export default {
    components: {
      // deviceDialog,
      // serviceDialog,
      defineRule,
      keyIndex
    },
    data () {
      return {
        // 服务状态预定义
        currentUuid: '',
        ruleData: {},
        defaultRules: [],
        serviceStatusData: [],
        cells: [],
        ruleDialog: false,
        editRuleDialog: false,
        lookRuleDialog: false,
        unusedRuleList: [],
        dialogRuleList: [],
        noRuleDialog: false,
        // 关键指标预定义
        keyIndex: [],
        keyIndexDialog: false,
        keyIndexData: {},
        keyIndexUuid: '',
        graphInited: false
      }
    },
    props: {
      uuid: {
        type: String
      }
    },
    mounted() {
      this.getBusinessStatus(this.uuid)
      this.getKeyIndex(this.uuid)
    },
    methods: {
      closeRule() {
        this.ruleDialog = false
        this.getBusinessStatus(this.uuid)
      },
      editCloseRule() {
        this.editRuleDialog = false
        this.getBusinessStatus(this.uuid)
      },
      // 服务状态预定义
      getBusinessStatus (id) {
        let _self = this
        $axios.post('/businessservice/serviceStatusDefine/' + id).then(function (res) {
          let data = res.data
          _self.ruleData = data
          _self.defaultRules = data.rulelist
          _self.serviceStatusData = []
          _self.unusedRuleList = []
          data.rulelist.map(function (item) {
            if (item.detailList && item.detailList.length && item.detailList.length > 0) {
              _self.serviceStatusData.push(item)
            } else if (item.detailList === null && item.level !== 3) {
              _self.unusedRuleList.push(item)
            }
          })
        })
      },
      // 关键指标
      getKeyIndex (id) {
        let _self = this
        $axios.post('/businessservice/getBusinessServiceItcompVoListByBusinessServiceUuid/' + id).then(function (res) {
          _self.keyIndex = res.data
          console.log(res.data)
        })
      },
      actionDef () {
        let _self = this
        return [
          {
            icon: 'set',
            name: '设置',
            click (row) {
              $axios.post('/businessservice/getAllBusinessServicesCellMiByBusinessServicesItcompRelUuid/' + row.uuid, {
                data: [row],
                logTemplate: '设置|业务服务定义>业务服务(#name#)'
              }).then(function (res) {
                _self.keyIndexDialog = true
                _self.keyIndexData = res.data
                _self.keyIndexUuid = row.uuid
              })
            }
          }
        ]
      },
      addRule () {
        if (this.unusedRuleList.length === 0) {
          this.noRuleDialog = true
        } else {
          this.dialogRuleList = this.unusedRuleList
          this.ruleDialog = true
        }
      },
      submitRule (form, message) {
        let _self = this
        let params = _self.$refs[form].formData
        console.log(params)
        let flag = true
        params.detailList.map(function (item) {
          Object.keys(item).map(function (key) {
            if (item[key] === '') {
              flag = false
            }
          })
        })
        if (flag) {
          _self.ruleDialog = false
          _self.editRuleDialog = false
          $axios.post('/businessservice/saveBusinessServiceRule', params).then(function (res) {
            if (res.data === true) {
              _self.$message(message + '成功');
              _self.getBusinessStatus(_self.uuid)
              flag = false
            } else {
              _self.$message.error(message + '失败');
            }
          })
        } else {
          _self.$message.error('请选择完整数据');
        }
      },
      handleLookRule (row) {
        this.currentUuid = row.uuid
        this.dialogRuleList = [row].concat(this.unusedRuleList)
        this.lookRuleDialog = true
      },
      handleEditRule (row) {
        this.getBusinessStatus(row.uuid)
        this.currentUuid = row.uuid
        this.dialogRuleList = [row].concat(this.unusedRuleList)
        this.editRuleDialog = true
      },
      handleDeleteRule (row) {
        let _self = this
        $axios.post('/businessservice/deleteBusinessRuleDetail/' + row.uuid).then(function (res) {
          if (res.data === true) {
            _self.$message('删除成功')
            _self.getBusinessStatus(_self.uuid)
          } else {
            _self.$message.error('删除失败，请稍后再试')
          }
        })
      },
      submitKeyIndexData () {
        let _self = this
        let list = _self.$refs.keyIndexData.data.ztreeNodeList
        let miUuidTargetName = []
        list.map(function (item, index) {
            if (item.objectList) {
              item.objectList.map(function (item) {
                if (item.checked) {
                  miUuidTargetName.push(item.value)
                }
              })
            }
        })
        let data = {
          businessServiceMiTargetRelationList: null,
          businessServicesItcompRelUuid: _self.keyIndexUuid,
          miUuidTargetName: miUuidTargetName
        }
        _self.keyIndexDialog = false
        $axios.post('/businessservice/saveOrUptBusinessServicesCellMiByBusinessServicesItcompRelUuid', data).then(function (res) {
          if (res.data) {
            _self.$message('提交成功')
          } else {
            _self.$message.error('提交失败')
          }
        })
      }
    }
  };
</script>
