<template>
  <s-scrollbar wrap-style="max-height: 420px;">
    <s-collapse v-model="activeName" accordion>
      <s-collapse-item title="基础设定" name="1">
        <s-form :model="collectTask" :rules="rules" label-width="120px" ref="addForm">
          <s-form-item label="稽核任务名称" prop="taskName">
            <s-input v-model="collectTask.taskName"></s-input>
          </s-form-item>
          <s-form-item label="是否周期任务" prop="isPeriod">
            <s-radio-group v-model="collectTask.isPeriod">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-period v-model="collectTask.tScheduleTime" :showPeriodItem="showPeriodItem" :isShowNow="'is-show-now'" ref="timeForm"></s-period>
          <s-form-item label="备注" prop="remark">
            <s-input type="textarea" v-model="collectTask.remark"></s-input>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="稽核对象" name="2">
        <s-table-page
          ref="multipleTable"
          :data="collectDeviceList"
          :header-search="defSearch()"
          :header-actions="defAction()"
          @selection-change="handleSelectionChange">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            label="资产名称"
            prop="monitorItcomp.itcompName">
          </s-table-column>
          <s-table-column
            label="IP地址"
            prop="monitorItcomp.controlAdderss">
          </s-table-column>
          <s-table-column
            label="资产类别"
            prop="monitorItcomp.citypeName">
          </s-table-column>
          <s-table-column
            label="协议名称">
            <template slot-scope="scope">
              <s-select v-model="scope.row.portUuid" placeholder="请选择">
                <s-option
                  v-for="item in scope.row.tAssetsPortInfoList"
                  :label="item.protocolName"
                  :key="item.uuid"
                  :value="item.uuid">
                </s-option>
              </s-select>
            </template>
          </s-table-column>
          <s-table-column
            label="资产账号">
            <template slot-scope="scope">
              <s-select v-model="scope.row.accountUuid" placeholder="请选择">
                <s-option
                  v-for="item in scope.row.accountInfoList"
                  :label="item.accountName"
                  :key="item.uuid"
                  :value="item.uuid">
                </s-option>
              </s-select>
            </template>
          </s-table-column>
        </s-table-page>
      </s-collapse-item>
      <s-collapse-item title="通知方式" name="3">
        <s-form ref="form" :model="formClient" label-width="130px" label-position="left">
          <p class="phead">邮件</p>
          <s-form-item label="启用邮件发送">
            <s-switch
              v-model="openEmail"
              on-text="ON"
              off-text="OFF">
            </s-switch>
          </s-form-item>
          <s-table-page
            v-show="openEmail"
            :data="listEmail"
            :header-actions="getEmailActionsDef()"
            :header-search="{show: false}"
            :paginationShow="false"
            @selection-change="handleEmailChange"
            key="formEmail">
            <s-table-column type="selection" width="45"></s-table-column>
            <s-table-column label="真实姓名" prop="userName"></s-table-column>
            <s-table-column label="Email" prop="userEmail"></s-table-column>
          </s-table-page>
        </s-form>
      </s-collapse-item>
    </s-collapse>
  </s-scrollbar>
</template>

<script>
  import {cloneDeep} from 'lodash'
  import {delDiffArray} from 'sunflower-common-utils'
  import sPeriod from '@/components/periodFormItem/Period'
  let collectTaskFilter = function (value) {
    if (value.accountInfoList) {
      value.accountInfoList.map(function (val, key) {
        if (val.snmpCWordOr || val.snmpCWordRw) {
          value.accountInfoList.splice(key, 1)
        }
      })
    }
    if (!value.accountInfoList || value.accountInfoList.length === 0) {
      value.accountUuid = ''
    }
    let Arr = ['SNMPV1', 'SNMPV2', 'WMI', 'PASSWORD', 'IPMI']
    if (value.tAssetsPortInfoList) {
      value.tAssetsPortInfoList.map(function (val, key) {
        if (Arr.indexOf(val.protocolName) !== -1) {
          value.tAssetsPortInfoList.splice(key, 1)
        }
      })
    }
    if (!value.tAssetsPortInfoList || value.tAssetsPortInfoList.length === 0) {
      value.portUuid = ''
    }
  }
  export default {
    components: {

      sPeriod
    },
    data() {
      return {
        showPeriodItem: false,
        nowTimeType: 1,
        value: '',
        activeName: '1',
        collectTask: {
          taskName: '',
          isPeriod: 0,
          remark: '',
          tScheduleTime: {
            timeType: 1,
            day: 1,
            week: 1,
            month: 1,
            year: 1,
            dayOfWeek: [2],
            dayOfMonth: [1],
            monthOfYear: 1,
            isForever: 0,
            firstFireTime: undefined,
            endFireTime: undefined
          }
        },
        openEmail: false,
        listEmail: this.data,
        delEmail: [],
        formClient: {},
        collectDeviceList: [],
        multipleSelection: [],
        rules: {
          taskName: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 32, message: '最大长度为32', trigger: 'blur'}
          ],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        },
        edit: false,
        firstPickerOptions: {},
        lastPickerOptions: {},
        wordText: ['日', '周', '月', '年']
      }
    },
    watch: {
      'collectTask.isPeriod': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      },
      selectObjects (val) {
        let _self = this;
        _self.collectDeviceList = _self.collectDeviceList.concat(val.map(function (item) {
          let value = cloneDeep(item)
          collectTaskFilter(value)
          _self.$set(value, 'accountUuid', value.accountInfoList && value.accountInfoList.length > 0 ? value.accountInfoList[0].uuid : '')
          _self.$set(value, 'deviceUuid', value.monitorItcomp.uuid)
          _self.$set(value, 'portUuid', value.tAssetsPortInfoList && value.tAssetsPortInfoList.length > 0 ? value.tAssetsPortInfoList[0].uuid : '')
          return value
        }));
      },
      defaultData: {
        handler (value) {
          let _self = this
          let val = cloneDeep(value)
          if (val.collectTask) {
            _self.edit = true
            _self.collectTask.uuid = ''
            val.collectTask.firstFireTime = val.collectTask.beginTime
            val.collectTask.beginTime = null
            val.collectTask.endFireTime = val.collectTask.endTime
            val.collectTask.endTime = null
            val.collectTask.creatTmeString = val.collectTask.creatTme
            val.collectTask.creatTme = null
            val.collectTask.lastTimeString = val.collectTask.lastTime
            val.collectTask.lastTime = null
            val.collectTask.nextTimeString = val.collectTask.nextTime
            val.collectTask.nextTime = null
            _self.collectTask = val.collectTask
            if (val.collectDeviceList) {
              _self.collectDeviceList = val.collectDeviceList.map(function (val) {
                collectTaskFilter(val)
                _self.$set(val, 'monitorItcomp', {})
                _self.$set(val.monitorItcomp, 'itcompName', val.deviceName)
                _self.$set(val.monitorItcomp, 'controlAdderss', val.ip)
                _self.$set(val.monitorItcomp, 'citypeName', val.deviceType)
                _self.$set(val.monitorItcomp, 'uuid', val.uuid)
                return val
              })
            } else {
              _self.collectDeviceList = []
            }
          }
          if (val.infoSendModeList && val.infoSendModeList.length > 0) {
            _self.openEmail = true;
            _self.listEmail = val.infoSendModeList;
          }
        },
        immediate: true
      },
      data(val) {
        this.listEmail = val;
      }
    },
    methods: {
      // 定义稽核对象表格查询
      defSearch() {
        return {
          width: 8,
          offset: 8,
          placeholder: '请输入资产名称、类型、IP地址查询',
          searchProps: ['monitorItcomp.itcompName', 'monitorItcomp.controlAdderss', 'monitorItcomp.citypeName']
        }
      },
      // 定义稽核对象表格表头操作
      defAction() {
        let _this = this
        return {
          width: 8,
          actions: [{
            name: '添加',
            icon: 'plus',
            click() {
              _this.handleAddObject()
            }
          }, {
            name: '删除',
            icon: 'delete',
            click() {
              _this.deleteList()
            }
          }]
        }
      },
      toTab(n) {
        this.activeName = n
      },
      isShow(val) {
        if (val.indexOf(this.nowTimeType) > -1) {
          return true
        } else {
          return false
        }
      },
      showNext(val) {
        this.nowTimeType = val
      },
      handleSelectionChange(rows) {
        this.multipleSelection = rows;
      },
      deleteList() {
        if (this.multipleSelection.length === 0) {
          this.$message({type: 'warning', message: '请至少勾选一条数据！'});
          return
        }
        for (let i = this.collectDeviceList.length - 1; i >= 0; i--) {
          let value = this.collectDeviceList[i];
          let index = this.multipleSelection.findIndex(el => {
            return value.deviceUuid === el.deviceUuid
          });
          if (index !== -1) {
            this.collectDeviceList.splice(i, 1)
          }
        }
      },
      handleAddObject () {
        this.$emit('open-object', cloneDeep(this.collectDeviceList));
      },
      getEmailActionsDef() {
        let vm = this;
        return {
          width: 24,
          actions: [{
            name: '手动增加',
            icon: 'plus',
            click() {
              vm.$emit('showEmailM');
            }
          }, {
            name: '添加引用',
            icon: 'link',
            click() {
              vm.$emit('showEmail');
            }
          }, {
            name: '删除引用',
            icon: 'delete',
            click() {
              if (vm.delEmail.length === 0) {
                vm.$message({type: 'info', message: '请选择要删除的引用'});
              } else {
                delDiffArray(vm.listEmail, vm.delEmail);
              }
            }
          }]
        }
      },
      handleEmailChange(val) {
        this.delEmail = val;
      }
    },
    props: {
      selectObjects: {
        type: Array,
        default: function () {
          return []
        }
      },
      defaultData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      data: Array
    }
  }
</script>
