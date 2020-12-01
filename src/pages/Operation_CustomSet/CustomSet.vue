<template>
  <section>
    <s-tab v-model="activeTab"  @on-click="switchTab">
      <s-tab-pane label="运维自定义脚本" name="pane1" v-if="judgeRoleBtn('operationCenter_operationsCustomScripts')">
        <common-table :tableType="1" key='selfInTable' :lists="selfList" @getData="getSelfList"></common-table>
      </s-tab-pane>
      <s-tab-pane label="改密自定义脚本" name="pane2" v-if="judgeRoleBtn('operationCenter_modifyCustomScripts')">
        <common-table :tableType="2" key='changeInTable' :lists="changeList" @getPass="getChangeList"></common-table>
      </s-tab-pane>
      <s-tab-pane label="检验自定义脚本" name="pane3" v-if="judgeRoleBtn('operationCenter_verifyCustomScripts')">
        <common-table :tableType="3" key='checkInTable' :lists="checkSelfList" @getCheck="getCheckSelfList"></common-table>
      </s-tab-pane>
      <s-tab-pane label="脚本测试日志" name="pane4" v-if="judgeRoleBtn('operationCenter_scriptTestLog')">
        <s-table-page :data='logList'

                  :row-actions='getLogRowDef()'
                  :header-search='getLogSearchDef()'>
          <s-table-column
            prop="scriptName"
            label="脚本名称">
          </s-table-column>
          <s-table-column
            prop="scriptTypeStr"
            label="脚本类型">
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <!--查看详情-->
    <s-dialog
      v-model="viewLogDialog"
      v-if="viewLogDialog"
      width="1100px"
      title="查看详情">
      <view-log :lists="viewLogList"></view-log>
    </s-dialog>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  import commonTable from './CommonTable'
  import viewLog from './ViewLogTable'
  export default {
    data() {
      return {
        tabNameArr: ['operationCenter_operationsCustomScripts', 'operationCenter_modifyCustomScripts', 'operationCenter_verifyCustomScripts', 'operationCenter_scriptTestLog'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1',
        viewLogList: [],
        viewLogDialog: false,
        selfList: [],
        checkSelfList: [],
        changeList: [],
        logList: []
      }
    },
    props: {
      isCard: {
        type: String,
        default: 'card'
      }
    },
    components: {

      commonTable,
      viewLog
    },
    methods: {
      switchTab(idx) {
        switch (idx) {
          case 'pane1': this.getSelfList(); break;
          case 'pane2': this.getChangeList(); break;
          case 'pane3': this.getCheckSelfList(); break;
          case 'pane4': this.getLogList(); break;
        }
      },
      getLogSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['scriptName', 'scriptTypeStr'] // can be string or Array
        }
      },
      getLogRowDef() {
        let vm = this
        return [{
          icon: 'eye',
          click(row) {
            $axios.get(`/operationSettings/listScriptTestLogDetail/${row.scriptName}/${row.scriptType}`).then((res) => {
              vm.viewLogDialog = true
              vm.viewLogList = res.data
            });
          },
          name: '详情'
        }]
      },
      getSelfList: function () {
        $axios.get('/operationSettings/listOperationScript').then((res) => {
          this.selfList = res.data
        });
      },
      getChangeList: function () {
        $axios.get('/operationSettings/getChangeScriptList').then((res) => {
          this.changeList = res.data
        });
      },
      getCheckSelfList: function () {
        $axios.get('/operationSettings/listCheckScript').then((res) => {
          this.checkSelfList = res.data
        });
      },
      getLogList: function () {
        $axios.get('/operationSettings/listScriptTestLog').then((res) => {
          this.logList = res.data
        });
      }
    },
    mounted() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      this.getSelfList()
    }
  }
</script>
