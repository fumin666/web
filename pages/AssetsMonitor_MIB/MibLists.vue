<template>
  <section id="MibListCtn">
    <s-table-page
      :data="MibLists"

      :header-actions='getListActionsDef()'
      :row-actions='getListRowActionsDef()'
      :header-search='getListSearchDef()'
      @selection-change="handleSelectionChange"
      actionColWidth="80px">
      <s-table-column
        type="selection"
        width="50">
      </s-table-column>
      <s-table-column
        prop="template"
        label="模板名称">
      </s-table-column>
      <s-table-column
        prop="cateTypeName"
        label="资产类型">
        <template slot-scope="scope">{{scope.row.threeTypeName || scope.row.secondTypeName || scope.row.fristTypeName}}</template>
      </s-table-column>
      <s-table-column
        prop="manufactName"
        label="资产厂商">
      </s-table-column>
      <s-table-column
        prop="productName"
        label="资产型号">
      </s-table-column>
    </s-table-page>

    <!--MIB 列表新增-->
    <s-dialog
      v-model="addDialogFlag"
      v-if="addDialogFlag"
      title="添加"
      top="10%"
      width="900px">
      <add-mib-list>
      </add-mib-list>
    </s-dialog>

    <!--MIB 列表详情查看-->
    <s-dialog
      v-model="viewMibListDialog"
      v-if="viewMibListDialog"
      title="详情查看"
      width="800px">
      <view-mib-list
        :rowData="listRowData">
      </view-mib-list>
    </s-dialog>

    <!--MIB 列表编辑-->
    <s-dialog
      v-model="editMibListDialog"
      v-if="editMibListDialog"
      title="编辑"
      width="900px">
      <edit-mib-list
        :rowData="listRowData">
      </edit-mib-list>
    </s-dialog>

    <!--MIB 监控项类型详情查看-->
    <s-dialog
      v-model="viewMonitorTypeDialog"
      v-if="viewMonitorTypeDialog"
      title="详情查看"
      width="800px">
      <view-monitor-type
        :detailData="monitorTypeDetail">
      </view-monitor-type>
    </s-dialog>

    <!--MIB 自动识别资产厂商-->
    <s-dialog
      v-model="autoDistingushManufactDialog"
      v-if="autoDistingushManufactDialog"
      title="自动识别"
      top="10%"
      width="800px">
      <auto-distingush-manufact>
      </auto-distingush-manufact>
    </s-dialog>

    <!--MIB 自动识别OID-->
    <s-dialog
      v-model="autoDistingushOidDialog"
      v-if="autoDistingushOidDialog"
      title="自动识别">
      <auto-distingush-oid>
      </auto-distingush-oid>
    </s-dialog>

    <!--MIB 模板检测-->
    <s-dialog
      v-model="templateCheckDialogFlag"
      v-if="templateCheckDialogFlag"
      title="模板检测">
      <template-check
        :templateUuid="templateUuid"
      ></template-check>
    </s-dialog>

    <!--新增监控项类型-->
    <s-dialog
      v-model="addMonitorTypeDialog"
      v-if="addMonitorTypeDialog"
      title="添加"
      width="900px"
      top="10%">
      <add-monitor-type>
      </add-monitor-type>
    </s-dialog>

    <!--编辑监控项类型-->
    <s-dialog
      v-model="editMonitorTypeDialog"
      v-if="editMonitorTypeDialog"
      title="编辑"
      top="10%"
      width="900px">
      <edit-monitor-type
        :initData="editMonitorTypeInit">
      </edit-monitor-type>
    </s-dialog>

    <!--新增中间监控指标-->
    <s-dialog
      v-model="addMiddleMonitorDialog"
      v-if="addMiddleMonitorDialog"
      title="添加">
      <add-middle-monitor
        :callerName="callerName">
      </add-middle-monitor>
    </s-dialog>

    <!--编辑中间监控指标-->
    <s-dialog
      v-model="editMiddleMonitorDialog"
      v-if="editMiddleMonitorDialog"
      title="编辑">
      <edit-middle-monitor
        :editMiddleMonitorData="editMiddleMonitorData">
      </edit-middle-monitor>
    </s-dialog>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  import {Download} from 'sunflower-common-utils'
  import addMibList from './AddMibList.vue'
  import autoDistingushManufact from './AutoDistingushManufact.vue'
  import autoDistingushOid from './AutoDistinguishOid.vue'
  import templateCheck from './TemplateCheck.vue'
  import addMonitorType from './AddMonitorType.vue'
  import editMonitorType from './EditMonitorType.vue'
  import addMiddleMonitor from './AddMiddleMonitor.vue'
  import editMiddleMonitor from './EditMiddleMonitor.vue'

  import viewMibList from './ViewMibList.vue'
  import editMibList from './EditMibList.vue'

  import viewMonitorType from './ViewMonitorType.vue'

  export default{
    data () {
      return {
        MibLists: [],                 // MIB 列表数据
        MibListsSelections: [],       // MIB 列表多选数据
        listRowData: {},              // MIB 列表详情数据
        monitorTypeDetail: {},        // 监控项类型详情数据

        templateUuid: '',             // 监控模板Uuid
        editMonitorTypeInit: {},      // 编辑监控项类型初始化数据
        callerName: '',               // 新增中间监控指标弹框调用者标识
        editMiddleMonitorData: {},              // 编辑中间监控指标弹框所需数据

        addDialogFlag: false,                   // 新增MIB
        autoDistingushManufactDialog: false,    // 自动识别资产厂商
        autoDistingushOidDialog: false,         // 自动识别OID
        templateCheckDialogFlag: false,         // 模板检测
        addMonitorTypeDialog: false,            // 新增监控项类型
        editMonitorTypeDialog: false,           // 编辑监控项类型
        addMiddleMonitorDialog: false,          // 新增中间监控指标
        editMiddleMonitorDialog: false,         // 编辑中间监控指标

        viewMibListDialog: false,               // MIB 列表详情查看
        editMibListDialog: false,               // MIB 列表编辑

        viewMonitorTypeDialog: false            // 监控项类型详情查看
      }
    },
    components: {

      addMibList,
      autoDistingushManufact,
      autoDistingushOid,
      templateCheck,
      addMonitorType,
      editMonitorType,
      addMiddleMonitor,
      editMiddleMonitor,

      viewMibList,
      editMibList,

      viewMonitorType
    },
    methods: {
      // button按钮初始化
      getListActionsDef() {
        let self = this
        return {
          width: 6,
          actions: [{
            name: '添加',
            icon: 'plus',
            click() {
              self.addDialogFlag = true
            }
          }, {
            name: '批量删除',
            icon: 'batch-del',
            click() {
              if (self.MibListsSelections.length === 0) {
                self.$message({
                  type: 'warning',
                  message: '请至少选择一项内容'
                })
              } else {
                let deleteDataArr = []
                let logData = []
                self.MibListsSelections.forEach((selection) => {
                  deleteDataArr.push(selection.uuid)
                  let logDataObj = {name: selection.name}
                  logData.push(logDataObj)
                })
                self.deleteMibTemplate(deleteDataArr, logData)
              }
            }
          }]
        }
      },
      // 表格搜索
      getListSearchDef() {
        return {
          width: 4,
          offset: 14,
          placeholder: '请输入查询条件'
          // searchProps: ['', '', ''] // can be string or Array
        }
      },
      // 表格行内操作按钮初始化
      getListRowActionsDef() {
        let vm = this;
        let def = [{
          name: '查看',
          icon: 'eye',
          click(row) {
            vm.viewMibListDialog = true
            vm.listRowData = row
          }
        }, {
          name: '编辑',
          icon: 'edit',
          click(row) {
            vm.editMibListDialog = true
            vm.listRowData = row
          }
        }, {
          name: '删除',
          icon: 'delete',
          click(row) {
            let uuids = [row.uuid]
            let logData = [{name: row.name}]
            vm.deleteMibTemplate(uuids, logData)
          }
        }, {
          name: '导出',
          icon: 'export',
          click(row) {
            Download(`/systemmanager/mibtool/downLoadTemplates/${row.uuid}`, {
              logTemplate: `导出|模板(${row.name})`
            })
          }
        }]
        return def
      },

      // MIB 列表初始化(刷新)
      MibListsInit() {
        $axios.get('systemmanager/mibtool/getCustomTemplate').then((res) => {
          let resData = res.data
          if (res) {
            this.MibLists = resData
          }
        })
      },

      // MIB 列表多选
      handleSelectionChange(val) {
        this.MibListsSelections = val
      },

      /*
       * MIB 列表删除请求
       */
      deleteMibTemplate(uuidArr, logData) {
        let _that = this
        _that.$confirm('确定删除所选模板？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post('/systemmanager/mibtool/deleteTemplates', uuidArr, {
            data: logData,
            logTemplate: `删除|模板(#name#)`
          }).then((res) => {
            let resData = res.data
            if (resData === 'success') {
              _that.MibListsInit()
              _that.$message({
                type: 'success',
                message: '删除成功！'
              })
            } else {
              _that.$message({
                type: 'error',
                message: '删除失败，请重试！'
              })
            }
          })
        }).catch(() => {
          _that.$message({
            type: 'info',
            message: '已取消！'
          })
        })
      }
    },
    mounted() {
      this.MibListsInit()
      // 自动识别厂商
      Bus.$on('showAutoCheckManufactDialog', () => {
        this.autoDistingushManufactDialog = true
      })
      // 自动识别资产厂商成功
      Bus.$on('confirmDistingushManufact', () => {
        this.autoDistingushManufactDialog = false
      })
      // 自动识别OID
      Bus.$on('showAutoCheckOidDialog', () => {
        this.autoDistingushOidDialog = true
      })
      // 自动识别OID成功
      Bus.$on('autoCheckOidOver', () => {
        this.autoDistingushOidDialog = false
      })
      // 模板检测
      Bus.$on('showTemplateCheckDialog', (data) => {
        this.templateUuid = data
        this.templateCheckDialogFlag = true
      })
      // 模板检测成功
      Bus.$on('closeAutoDistinguishTemplate', () => {
        this.templateCheckDialogFlag = false
      })
      // 添加监控项类型
      Bus.$on('showMonitorTypeDialog', () => {
        this.addMonitorTypeDialog = true
      })
      // 新增监控项类型成功
      Bus.$on('closeMonitorTypeOver', () => {
        this.addMonitorTypeDialog = false
      })
      // MIB列表新增 -> 编辑监控项类型
      Bus.$on('showEditMonitorType', (data) => {
        this.editMonitorTypeInit = data
        this.editMonitorTypeDialog = true
      })
      // 编辑监控项类型成功
      Bus.$on('editMonitorTypeOver', () => {
        this.editMonitorTypeDialog = false
      })
      // 添加中间监控指标
      Bus.$on('showMiddleMonitorDialog', (data) => {
        this.addMiddleMonitorDialog = true
        this.callerName = data
      })
      // 编辑中间监控项指标
      Bus.$on('showMiddleMonitorDialog-edit', (data) => {
        this.editMiddleMonitorDialog = true
        this.editMiddleMonitorData = data
      })
      // 添加中间监控指标成功
      Bus.$on('closeMiddleMonitorDialog', () => {
        this.addMiddleMonitorDialog = false
      })
      // 编辑中间监控指标成功
      Bus.$on('closeMiddleMonitorDialog-edit', () => {
        this.editMiddleMonitorDialog = false
      })
      // MIB 新增模板成功
      Bus.$on('addMibTemplateSuccess', () => {
        this.addDialogFlag = false
        this.MibListsInit()
      })
      // 查看监控项类型详情
      Bus.$on('viewMonitorTypeDialog', (data) => {
        this.monitorTypeDetail = data
        this.viewMonitorTypeDialog = true
      })
      // MIB 列表编辑 ->  监控项类型编辑
      Bus.$on('showEditMib_EditMonitorType', (data) => {
        this.editMonitorTypeInit = data
        this.editMonitorTypeDialog = true
      })
      // MIB 编辑列表项成功
      Bus.$on('updateMibListSuccess', () => {
        this.editMibListDialog = false
        this.MibListsInit()
      })
    }
  }
</script>

<style>
  #MibListCtn{
    margin: 20px;
  }
  #MibListCtn .footerRow{
    text-align: right;
    margin-top: 15px
  }
</style>
