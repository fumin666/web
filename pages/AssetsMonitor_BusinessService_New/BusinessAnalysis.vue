/*
create by YOU
*/
<template>
  <div>
    <s-table-page
      :data='businessServiceList'
      @selection-change='handleSelection'
      :header-actions="getListActionsDef()"
      :header-search="getSearchDef()"
    >
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column show-overflow-tooltip label="状态" prop="statusName">
        <template slot-scope="scope">
          <s-tag v-if="scope.row.status === 3" type="success">{{scope.row.statusName}}</s-tag>
          <s-tag v-if="scope.row.status === 2" type="warning">{{scope.row.statusName}}</s-tag>
          <s-tag v-if="scope.row.status === 1" type="danger">{{scope.row.statusName}}</s-tag>
          <s-tag v-if="scope.row.status === 4" type="gray">未知</s-tag>
        </template>
      </s-table-column>
      <s-table-column show-overflow-tooltip label="业务服务名称" prop="name"></s-table-column>
      <s-table-column show-overflow-tooltip label="关键度" prop="criticalityName"></s-table-column>
      <s-table-column show-overflow-tooltip label="影响度" prop="effectName"></s-table-column>
      <s-table-column show-overflow-tooltip label="责任人" prop="maintenanceView.userRealName"></s-table-column>
      <s-table-column show-overflow-tooltip label="监控频率(分钟)" prop="frequency"></s-table-column>
      <s-table-column show-overflow-tooltip label="开启监控" prop="isMonitor">
        <template slot-scope="scope">
          <s-switch v-model="scope.row['isMonitor']" size="small" :active-value="1" :inactive-value="0" on-text="" off-text=""
                    @change="monitor(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column show-overflow-tooltip label="操作" width='200'>
        <template slot-scope="scope">
          <i class='icon iconfont icon-eye' title="查看" @click="eyeBusiness(scope.row)"></i>
          <i class='icon iconfont icon-edit' title="编辑" @click="editBusiness(scope.row)"></i>
          <i class='icon iconfont icon-set' title="设置" @click="setBusiness(scope.row)"></i>
          <i class='icon iconfont icon-delete' title="删除" @click="deleteBusiness(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog
      v-model="addDialog"
      v-if="addDialog"
      :before-close="closeAddDialog"
      width="850px"
      title="添加">
      <d-dialog ref="defineDialog"
                :needSelect1="Select2"
                :needSelect2="Select3"
                :needSelect3="Select4"
                :current="currentStep"
                :monitorSys="monitorSys"
                :otherItcomp="otherItcomp"></d-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="currentStep --;lastStep(currentStep)" v-show="currentStep > 0 && currentStep < 4">上一步</s-button>
        <s-button @click="nextStep(currentStep)" v-show="currentStep < 3" :disabled="successAxios">下一步</s-button>
        <s-button @click="addOk" v-show="currentStep === 3">保存</s-button>
        <s-button type="cancel" @click="closeAddDialog">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      :before-close="closeEditDialog"
      width="850px"
      title="修改">
      <d-dialog ref="defineDialog"
                :editData="editForm"
                :needSelect1="Select2"
                :needSelect2="Select3"
                :needSelect3="Select4"
                :current="currentStep"
                :monitorSys="monitorSys"
                :otherItcomp="otherItcomp"></d-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="currentStep --;lastStep(currentStep)" v-show="currentStep > 0 && currentStep < 4">上一步</s-button>
        <s-button @click="nextStep(currentStep,true)" v-show="currentStep < 3" :disabled="successAxios">下一步</s-button>
        <s-button @click="editOk" v-show="currentStep === 3">保存</s-button>
        <s-button type="cancel" @click="closeEditDialog">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="setDialog"
      v-if="setDialog"
      width="850px"
      title="设置">
      <define-rule :uuid="businessServiceUuid"></define-rule>
    </s-dialog>
    <analy-Business-Dialog v-model="BusinessDialog" v-if="BusinessDialog" :busUuid='busUuid' :businessServiceList="businessServiceList"></analy-Business-Dialog>
    <eye-Business-Dialog v-model="eyeDialog" :busRow='busRow' :BuseyeUuid='BuseyeUuid' v-if="eyeDialog"></eye-Business-Dialog>
    <!-- <kpi ref="kpi" :businessServiceList="businessServiceList"></kpi> -->
  </div>
</template>
<script type="text/babel">
  import dDialog from './components/DefineDialog'
  import analyBusinessDialog from './components/analyBusinessDialog'
  import eyeBusinessDialog from './components/eyeBusinessDialog'
  import defineRule from './components/Indicator'
  import {batchUuid} from 'sunflower-common-utils'
  // import kpi from './components/Kpi.vue'
  import $axios from 'sunflower-ajax'
  // import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    components: {
      dDialog,
      // kpi,
      defineRule,
      analyBusinessDialog,
      eyeBusinessDialog
    },
    data () {
      return {
        successAxios: false,
        businessServiceList: [],
        currentStep: 0,
        addDialog: false,
        editDialog: false,
        setDialog: false,
        monitorSys: [],
        otherItcomp: [],
        Select2: null,
        Select3: null,
        Select4: null,
        parentForm: {},
        editForm: {},
        businessServiceUuid: '',
        selection: [],
        BusinessDialog: false,
        busUuid: '',
        eyeDialog: false,
        BuseyeUuid: '',
        busRow: {}

      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      getData() {
        let _self = this
        $axios.post('/businessservice/getAllBusinessInfo').then(function (res) {
          _self.businessServiceList = res.data
        })
      },
      getListActionsDef() {
        let vm = this;
        return {
          width: 16,
          actions: [{
            name: '添加',
            icon: 'add',
            click() {
              vm.addBusiness()
            }
          }, {
            name: '批量删除',
            icon: 'delete',
            click() {
              vm.deleteBus()
            }
          }, {
            name: '业务服务分析',
            icon: 'server',
            click() {
              vm.analysisBusiness()
            }
          }]
        }
      },
      analysisBusiness() {
        if (this.selection.length > 0) {
          this.BusinessDialog = true
        } else {
          this.$message({type: 'error', message: '请至少选择一个业务服务!'})
        }
      },
      search () {
        this.$refs.kpi.search()
      },
      handleSelection(val) {
        this.selection = val.map(item => item.uuid)
        this.busUuid = this.selection
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 20,
          placeholder: '请输入业务服务名称',
          searchProps: ['name']
        }
      },
      monitor(row) {
        let str = row.isMonitor === '0' ? '开启监控|业务服务定义>业务服务(#name#)' : '关闭监控|业务服务定义>业务服务(#name#)'
        $axios.post(`/businessservice/startOrStopMonitor/${row.uuid}/${row.isMonitor}`, {
          data: [{name: this.parentForm.name}],
          logTemplate: str
        }).then(res => {
          if (res.data.state === true) {
            this.getData()
          }
        })
      },
      lastStep(idx) {
        if (idx === 1) { this.select3() }
        if (idx === 2) { this.select4() }
      },
      nextStep(idx, isedit) {
        if (idx === 0) {
          this.step1(isedit)
        }
        if (idx === 1) {
          this.step2(isedit)
        }
        if (idx === 2) {
          this.step3(isedit)
        }
      },
      select3(isedit) {
        const selection = this.$refs['defineDialog'].monitorSelection
        if (isedit && selection.length < 1) {
          this.Select3 = batchUuid('uuid', this.editForm.businessSystemItcompList)
        } else {
          this.Select3 = batchUuid('uuid', selection)
        }
      },
      select4(isedit) {
        const selection = this.$refs['defineDialog'].otherSelection
        if (isedit && selection.length < 1) {
          this.Select4 = batchUuid('uuid', this.editForm.businessSystemItcompList)
        } else {
          this.Select4 = batchUuid('uuid', selection)
        }
      },
      step1(isedit) {
        let flag = isedit || false
        let formVal = this.$refs['defineDialog'].$refs['addForm'].$refs['form']
        formVal.validate(valid => {
          if (!valid) return;
          this.currentStep ++;
          this.parentForm = this.$refs['defineDialog'].$refs['addForm'].defaultData
          if (flag) {
            this.Select2 = batchUuid('uuid', this.editForm.businessServiceSystemList)
          }
        });
      },
      step2(isedit) {
        let flag = isedit || false
        const selection = this.$refs['defineDialog'].businessSelection
        let arr = batchUuid('uuid', selection)
        if (arr.length > 0) {
          this.successAxios = true
          $axios.post(`/businessservice/getAllSystemServer`, arr).then((res) => {
            if (res.data && res.data.status) {
              this.monitorSys = res.data.data;
              this.currentStep ++;
              this.parentForm.businessSystemUuidList = arr
              this.select3(flag)
            } else {
              this.$message({message: res.data.errMsg, type: 'error'});
            }
            this.successAxios = false
          });
        } else {
          this.$message({type: 'error', message: '请至少选择一个'});
        }
      },
      step3(isedit) {
        let flag = isedit || false
        let arr = batchUuid('uuid', this.$refs['defineDialog'].monitorSelection)
        if (arr.length > 0) {
          this.successAxios = true
          $axios.post(`/businessservice/getAllServerItcomp`, arr).then((res) => {
            if (res.data) {
              this.otherItcomp = res.data
              this.currentStep ++;
              this.parentForm.systemServerUuidList = arr
              this.select4(flag)
            } else {
              this.$message({message: '数据有误，请检查!', type: 'error'});
            }
            this.successAxios = false
          });
        } else {
          this.$message({type: 'error', message: '请至少选择一个'});
        }
      },
      closeAddDialog() {
        this.addDialog = false
        this.currentStep = 0
      },
      closeEditDialog() {
        this.editDialog = false
        this.currentStep = 0
      },
      // 添加
      addBusiness() {
        this.addDialog = true
      },
      addOk() {
        let arr = batchUuid('uuid', this.$refs['defineDialog'].otherSelection)
        this.parentForm.serverItcompUuidList = arr
        $axios.post('/businessservice/saveBusinessService', this.parentForm, {
          data: [{name: this.parentForm.name}],
          logTemplate: '添加|业务服务定义>业务服务(#name#)'
        }).then((res) => {
          if (res.data.state === true) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.addDialog = false
            this.currentStep = 0
            this.getData()
          } else {
            this.$message({
              message: res.data.errormsg,
              type: 'error'
            });
          }
        });
      },
      // 修改
      editBusiness(data) {
        $axios.get(`/businessservice/getBusinessServiceInfoDefine/${data.uuid}`).then((res) => {
          this.editForm = res.data
          this.editDialog = true
        })
      },
      editOk() {
        let arr = batchUuid('uuid', this.$refs['defineDialog'].otherSelection)
        this.parentForm.serverItcompUuidList = arr
        this.parentForm.uuid = this.editForm.uuid
        $axios.post('/businessservice/updateBusinessService', this.parentForm, {
          data: [{name: this.parentForm.name}],
          logTemplate: '编辑|业务服务定义>业务服务(#name#)'
        }).then((res) => {
          if (res.data.state === true) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.editDialog = false
            this.currentStep = 0
            this.getData()
          } else {
            this.$message({
              message: res.data.errormsg,
              type: 'error'
            });
          }
        });
      },
      // 设置
      setBusiness(data) {
        this.businessServiceUuid = data.uuid
        this.setDialog = true
      },
      // 删除
      deleteBusiness(deleteData) {
        let list = [deleteData.uuid]
        this.$confirm('确定删除所选业务服务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/businessservice/deleteBusinessInfo`, list, {
            data: [{name: deleteData.name}],
            logTemplate: '删除|业务服务定义>业务服务(#name#)'
          }).then(({data}) => {
            if (data === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getData()
            }
          })
        }).catch(() => {})
      },
      // 批量删除
      deleteBus() {
        let vm = this
        if (vm.selection.length > 0) {
          vm.$confirm('确定删除所选业务服务？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post('/businessservice/deleteBusinessInfo', vm.selection, {
              data: vm.selection,
              logTemplate: '删除|业务服务定义>业务服务(#name#)'
            }).then(function (res) {
              if (res.data === true) {
                vm.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                vm.getData()
              }
            })
          }).catch(() => {})
        } else {
          vm.$message({type: 'error', message: '请至少选择一个要删除的业务服务'})
        }
      },
      // 查看
      eyeBusiness(row) {
        this.eyeDialog = true
        this.busRow = row
        this.BuseyeUuid = row.uuid
      }
    }
  };
</script>
