<template>
  <section class="createTask">
    <s-scrollbar wrap-style="max-height: 600px;">
      <s-collapse v-model="activeNames" accordion>
        <s-collapse-item title="基础设定" name="base">
          <s-form :model="taskForm" :rules="rules1" ref="taskForm" label-width="120px">
            <s-form-item label="任务名称" prop="taskName">
              <s-input v-model="taskForm.taskName" disabled></s-input>
            </s-form-item>
            <s-form-item label="优先级" prop="priority" style="width: 100%">
              <s-select v-model="taskForm.priority" style="width: 100%" disabled>
                <s-option v-for="(item, index) in priorityList" :label="item.name" :value="Number(item.value)" :key="index"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="是否周期任务" prop="isPeriodicTask">
              <s-radio-group v-model="taskForm.isPeriodicTask" disabled>
                <s-radio :label="0">否</s-radio>
                <s-radio :label="1">是</s-radio>
              </s-radio-group>
            </s-form-item>
            <div v-if="current">
              <s-period disableFromProp v-if="timeFlag" v-model="taskForm.tScheduleTime" :isShowNow="'is-show-now'"　:showPeriodItem="showPeriodItem" ref="period"></s-period>
            </div>
            <div v-else>
              <s-period disableFromProp v-model="taskForm.tScheduleTime" :isShowNow="'is-show-now'"　:showPeriodItem="showPeriodItem" ref="period"></s-period>
            </div>
            <s-form-item label="备注">
              <s-input type="textarea" v-model="taskForm.remark" disabled></s-input>
            </s-form-item>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="选择脚本" name="script">
          <s-form :model="taskForm" :rules="rules1" ref="taskForm1" label-width="120px">
            <s-form-item label="脚本库" prop="scriptLibUuid" style="width: 100%">
              <input-tree v-model="taskForm.scriptLibUuid" disabled :data="scriptLibraryList" :props="myProps" @select-change="getScriptList" style="width: 400px;" name="uuid"></input-tree>
            </s-form-item>
            <s-form-item label="脚本名称" prop="scriptUuidParList" style="width: 100%">
              <s-select v-model="taskForm.scriptUuidParList" disabled @change="changeOwnType" collapse-tags multiple style="width: 400px">
                <s-option v-for="(item, index) in scriptList" :value="item.uuid" :label="item.scriptName" style="width: 400px;" :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-row>
              <s-table-page

                :searchDef="{show: false}"
                :paginationDef="{pageSize: 10, pageSizes: [5, 10, 15, 20]}"
                :data="paramList"
                style="width: 100%">
                <s-table-column
                  prop="scriptName"
                  label="脚本名称">
                </s-table-column>
                <s-table-column
                  prop="scriptFileSuffix"
                  label="脚本类型">
                </s-table-column>
                <s-table-column
                  label="脚本参数">
                  <template slot-scope="scope">
                    <s-input placeholder="请输入脚本参数" v-model="scope.row.scriptParam" disabled></s-input>
                  </template>
                </s-table-column>
              </s-table-page>
            </s-row>
            <s-form-item label="超时时间" prop="timeOut">
              <s-input v-model="taskForm.timeOut" disabled placeholder="秒，请输入正整数"></s-input>
            </s-form-item>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="选择主机" name="host">
          <RealPageTable :ajax-obj="ajaxObj"
                         @selection-change="handleSelectionChange"
                         :callback="handleData">
            <s-table-column type="selection" width="65" :selectable="selectable"></s-table-column>
            <s-table-column prop="itcompname" label="主机名"></s-table-column>
            <s-table-column prop="controladderss" label="IP地址"></s-table-column>
            <s-table-column prop="productname" label="操作系统"></s-table-column>
          </RealPageTable>
        </s-collapse-item>
      </s-collapse>
    </s-scrollbar>
  </section>
</template>
<script>
 import $axios from 'sunflower-ajax';
 import filterMixin from './FilterMixin';
 import sPeriod from '@/components/periodFormItem/Period'
 import { cloneDeep } from 'lodash';

 import InputTree from '@/components/inputTree/InputTree'
 import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    mixins: [filterMixin],
    data() {
      let checkInt = (rule, value, callback) => {
        if (value || value === 0) {
          let reg = /^[1-9]\d*$/;
          if (!reg.test(value)) {
            callback(new Error('请输入正整数值'));
          } else {
            callback();
          }
        } else {
          callback(new Error('不能为空'));
        }
      };
      var validatorName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名称不能为空！'))
        }
        // 如果是编辑页面，并且命令集未改变则不判断是否重复
        if (this.current) {
          if (value !== this.exist_name) {
            $axios.get('/autoScriptTask/nameValidate/' + value).then((res) => {
              if (res.data.state) {
                callback(new Error('名称已存在！'));
              }
            });
          }
        } else {
          $axios.get('/autoScriptTask/nameValidate/' + value).then((res) => {
            if (res.data.state) {
              callback(new Error('名称已存在！'));
            }
          });
        }
        setTimeout(() => {
//      长度为2-256
          if (value.length < 2 || value.length > 30) {
            callback(new Error('长度为2-30字符！'));
          } else {
            callback();
          }
        }, 500);
      };
      return {
        timeFlag: false,
        taskForm: {
          taskName: '',
          remark: '',
          priority: 1,
          scriptLibUuid: '',
          scriptUuidParList: [],
          timeOut: null,
          isPeriodicTask: 0,
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
        paramList: [],
        myProps: {
          children: 'childrenList',
          label: 'name',
          value: 'uuid'
        },
        myHostProps: {
          children: 'childrenList',
          label: 'name'
        },
        firstGroupList: [],
        showPeriodItem: false,
        rules1: {
          taskName: [
            {required: true, validator: validatorName, trigger: 'blur'}
          ],
          timeOut: [{
            required: true, validator: checkInt, trigger: 'blur'
          }],
          priority: [
            {type: 'number', required: true, message: '请选择优先级！', trigger: 'blur'}
          ],
          scriptLibUuid: [
            {required: true, message: '请选择脚本库！', trigger: 'blur'}
          ],
          scriptUuidParList: [
            {type: 'array', required: true, message: '请选择脚本！', trigger: 'blur'}
          ]
        },
        groupName: '',
        scriptLibraryList: [],
        scriptList: [],
        priorityList: [],
        activeNames: 'base',
        scriptDataFilter: [],
        multipleSelection: [],
        hostList: [],
        weekList: ['日', '一', '二', '三', '四', '五', '六'],
        assetsSearchKey: '',
        ajaxObj: {
          type: 'post',
          url: '/autoScriptTask/getRelationAssetList',
          params: {
            condition: {
            }
          },
          checkedUuidArr: []
        },
        flag: true,
        firstGroupUuid: '',
        secondGroupUuid: '',
        scriptParamList: {}
      };
    },
    components: {

      sPeriod,
      InputTree,
      RealPageTable
    },
    methods: {
      selectable() {
        return false
      },
      getFirstGroup() {
        $axios.get(`/autoMateItcomp/getAutoMGTreeNodeList`).then((res) => {
          if (res.data instanceof Array && res.data.length > 0) {
            this.firstGroupList = res.data
            // this.groupName = this.firstGroupList[0].parentUuid
          }
        })
      },
      changeOwnType(val) { // 所选的脚本uuid
        $axios.post('/scriptConsole/getScriptByUuidList', val).then(res => {
          this.paramList = res.data
        })
      },
      deleteScipt(uuid) { // 删除参数
        this.$confirm('确认删除吗?', '忽略', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i in this.paramList) {
            if (this.paramList[i].uuid === uuid) {
              this.paramList.splice(i, 1)
              this.taskForm.scriptUuidParList.splice(i, 1)
            }
          }
        }).catch(() => {});
      },
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['itcompname', 'controladderss', 'productname']
        }
      },
      // 主机数据
      getData() {
        let params = {
          searchStr: this.assetsSearchKey,
          firstGroupUuid: this.firstGroupUuid,
          secondGroupUuid: this.secondGroupUuid
        }
        params.taskUuid = this.current.uuid
        this.ajaxObj.params.condition = cloneDeep(params);
      },
      handleData(value) {
        let arr = value.pageList
        this.hostList = arr
        let vm = this
        if (this.flag) {
          for (let i in vm.hostList) {
            if (vm.hostList[i].isSelect === 1) {
              vm.multipleSelection.push(vm.hostList[i])
              this.ajaxObj.checkedUuidArr = this.multipleSelection
            }
          }
          this.flag = false
        }
        return arr
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 优先级下拉框
      getPriority() {
        $axios.get(`/autoScriptTask/getAutoScriptTaskSelectData`).then((res) => {
          if (res.data && res.data.priorityList instanceof Array) {
            this.priorityList = res.data.priorityList
          }
        })
      },
      // 所有脚本库列表
      getScriptLibList() {
        return $axios.get('/scriptConsole/scriptLibTreeNode').then((res) => {
          if (res.data) {
            this.scriptLibraryList = res.data
          } else {
            return false
          }
        })
      },
      // 脚本库对应的所有脚本
      getScriptList(val) {
        $axios.get(`/scriptConsole/getScriptByLibUuid/${val.uuid}`).then((res) => {
          if (this.current === undefined) {
            this.taskForm.scriptUuidParList = []
          }
          if (res.data instanceof Array) {
            this.scriptList = res.data
            if (this.current === undefined && this.scriptList.length > 0) {
              this.taskForm.scriptUuidParList.push(this.scriptList[0].uuid)
            }
            if (this.current === undefined) {
              this.changeOwnType(this.taskForm.scriptUuidParList)
            }
          } else {
            return false
          }
        })
      },
      validatorAny(rule, value, callback) {
        callback();
      }
    },
    watch: {
      'taskForm.scriptUuidParList': {
        immediate: true,
        handler() {
          this.filterHostListLibrary('taskForm', 'scriptUuidParList')
        }
      },
      'taskForm.isPeriodicTask': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      }
    },
    props: {
      current: Object
    },
    created() {
      this.getFirstGroup()
      if (this.current) {
        let vm = this
        $axios.get(`/autoScriptTask/getAutoScriptTaskByUuid/${this.current.uuid}`).then(res => {
          vm.scriptParamList = res.data
          vm.taskForm = cloneDeep(vm.scriptParamList);
          vm.taskForm.tScheduleTime = res.data.tScheduleTime
          vm.timeFlag = true // 请求到数据再执行时间组件
          vm.exist_name = vm.taskForm.taskName;
          vm.paramList = vm.scriptParamList.scriptUuidParList;
          let scriptUuidParList = []
          res.data.scriptUuidParList.map(item => {
            scriptUuidParList.push(item.scriptUuid)
          })
          vm.taskForm.scriptUuidParList = scriptUuidParList
        })
      }
    },
    mounted() {
      this.getData()
      this.getScriptLibList().then(() => {
      })
      this.getPriority()
    }
  }
</script>
<style>
  .createTask .scroll-height-200px {
    max-height: 200px
  }
</style>

