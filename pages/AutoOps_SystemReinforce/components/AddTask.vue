/**
* Created by alex on 2018/8/21.
*/
<template>
  <s-scrollbar wrap-style="max-height: 600px;">
    <s-collapse v-model="activeNames" accordion>
      <s-collapse-item title="基础设定" name="base">
        <s-form :model="form" :rules="rules" ref="taskForm" label-width="120px">
          <s-form-item label="任务名称" prop="taskName">
            <s-input v-model="form.taskName"></s-input>
          </s-form-item>
          <s-form-item label="是否周期任务" prop="isPeriod">
            <s-radio-group v-model="form.isPeriod">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-form-item>
          <div v-if="editData">
            <s-period v-if="timeFlag" v-model="form.tScheduleTime" :isShowNow="'is-show-now'"　:showPeriodItem="showPeriodItem" ref="period"></s-period>
          </div>
          <div v-else>
            <s-period v-model="form.tScheduleTime" :isShowNow="'is-show-now'"　:showPeriodItem="showPeriodItem" ref="period"></s-period>
          </div>
          <s-form-item label="备注">
            <s-input type="textarea" v-model="form.description"></s-input>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="选择脚本" name="script">
        <s-form :model="form" :rules="rules" ref="taskForm1" label-width="120px">
          <s-form-item label="选择模版" prop="templateUuid">
            <s-select v-model="form.templateUuid" clearable @change="getTemplateName" style="width: 400px">
              <s-option v-for="item in systemFastenTemplates" :value="item.uuid" :label="item.name"
                        :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="选择脚本" prop="fastenScriptList" style="width: 100%">
            <s-select v-model="form.fastenScriptList" @change="changeOwnType" collapse-tags multiple style="width: 400px">
              <s-option v-for="(item, index) in scriptList" :value="item.uuid" :label="item.name" :key="index" style="width: 400px"></s-option>
            </s-select>
          </s-form-item>
          <s-row>
            <s-table-page
              :data="paramList"
              style="width: 100%">
              <s-table-column
                prop="name"
                label="脚本名称">
              </s-table-column>
              <s-table-column
                prop="scriptFileSuffix"
                label="脚本类型">
              </s-table-column>
              <s-table-column
                label="脚本参数">
                <template slot-scope="scope">
                  <s-input placeholder="请输入脚本参数" v-model="scope.row.scriptParam"></s-input>
                </template>
              </s-table-column>
              <s-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <i class="iconfont icon-delete" title="删除" @click="deleteScipt(scope.row.uuid)"></i>
                </template>
              </s-table-column>
            </s-table-page>
          </s-row>
          <s-form-item label="超时时间" prop="timeOut">
            <s-input v-model="form.timeOut" placeholder="秒，请输入正整数"></s-input>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="选择资产" name="host">
        <div class="inputWrap" style="position: relative;">
          <s-input v-model="form.searchStr" @keyup.enter.native="getInitData" placeholder="请输入内容" class="real-search-input"></s-input>
          <span class="realPageSearch"><i class="iconfont icon-magnifier" @click="getInitData"></i></span>
        </div>
        <RealPageTable ref="sTable" :ajax-obj="ajaxObj"
                       @selection-change="handleSelectionChange"
                       :showHeaderCheckbox="true"
                       :callback="handleData">
          <s-table-column type="selection" width="65"></s-table-column>
          <s-table-column prop="itcompname" label="主机名"></s-table-column>
          <s-table-column prop="controladderss" label="IP地址"></s-table-column>
          <s-table-column prop="productname" label="操作系统"></s-table-column>
        </RealPageTable>
      </s-collapse-item>
      <s-collapse-item title="通知方式" name="message">
        <s-row class="title">邮件</s-row>
        <s-row>
          <s-col span="8">启用邮件发送</s-col>
          <s-col span="16"><s-switch v-model="openEmail"></s-switch></s-col>
        </s-row>
        <s-row v-show="openEmail">
          <s-row class="opeRow">
            <s-button icon="plus" @click="addQuoteManual">手动添加</s-button>
            <s-button icon="link" @click="addQuoteAuto">添加引用</s-button>
            <s-button icon="delete" @click="delQuote">删除引用</s-button>
          </s-row>
          <s-table style="width: 100%;" :data="quoteList" @selection-change="quoteSelectionChange"  max-height="450">
            <s-table-column type="selection" width="45" align="center"></s-table-column>
            <s-table-column label="真实姓名" prop="accountName"></s-table-column>
            <s-table-column label="Email" prop="email"></s-table-column>
          </s-table>
        </s-row>
      </s-collapse-item>
    </s-collapse>
    <add-quote-manual-dialog  v-model="addQuoteManualDialog" v-if="addQuoteManualDialog" @add-quote="addQuoteManualCb">
    </add-quote-manual-dialog>
    <add-quote-auto-dialog
      v-model="addQuoteAutoDialog"
      v-if="addQuoteAutoDialog"
      :user-list="userList"
      :has-select="hasSelectUser"
      @add-quote="addQuoteAutoCb"></add-quote-auto-dialog>
    <!--<s-form ref="addForm" :model="form" :rules="rules" label-width="120px" class="accountAddForm">-->
    <!--<s-form-item label="发送报表">-->
    <!--<s-radio-group v-model="form.isMailbox">-->
    <!--<s-radio :label="1">是</s-radio>-->
    <!--<s-radio :label="0">否</s-radio>-->
    <!--</s-radio-group>-->
    <!--</s-form-item>-->
    <!--<s-form-item v-if="form.isMailbox === 1" label="邮箱" prop="mailbox">-->
    <!--<s-input v-model="form.mailbox"></s-input>-->
    <!--</s-form-item>-->
    <!--</s-form>-->
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import { intersectObj, Validaters } from 'sunflower-common-utils'
  import sPeriod from '@/components/periodFormItem/Period'
  import {cloneDeep} from 'lodash'
  // import {delDiffArray} from 'sunflower-common-utils'
  import filterMixin from '../../AutoOps_Script/FilterMixin';
  // import InputTree from '@/components/inputTree/InputTree'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import AddQuoteAutoDialog from '@/pages/Assets_Polling/AssetPollingDialog/AddQuoteAutoDialog';
  import AddQuoteManualDialog from '@/pages/Assets_Polling/AssetPollingDialog/AddQuoteManualDialog';
  export default {
    mixins: [filterMixin],
    data() {
      let checkRepeatName = (rule, value, callback) => {
        if (value !== this.editDefaultName) {
          if (value) {
            $axios.get(`/automateSystemFasten/checkDuplicateSystemFastenTaskName/${value}`).then((res) => {
              if (res.data === false) {
                callback(new Error('该名称已经存在'));
              } else {
                callback()
              }
            })
          }
        } else {
          callback()
        }
      };
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
      return {
        timeFlag: false,
        showPeriodItem: false,
        paramList: [],
        scriptByUuid: [],
        addQuoteManualDialog: false,
        addQuoteAutoDialog: false,
        quoteSelections: [],
        userList: [], // 引用列表
        rules: {
          taskName: [
            Validaters.NotNull,
            Validaters.Max(30),
            {validator: checkRepeatName, trigger: 'blur'}
          ],
          description: [Validaters.Max(120)],
          timeOut: [{
            required: true, validator: checkInt, trigger: 'blur'
          }],
          priority: [
            {type: 'number', required: true, message: '请选择优先级！', trigger: 'blur'}
          ],
          scriptLibUuid: [
            {required: true, message: '请选择脚本库！', trigger: 'blur'}
          ],
          fastenScriptList: [
            {type: 'array', required: true, message: '请选择脚本！', trigger: 'blur'}
          ],
          templateUuid: [Validaters.NotNull],
          mailbox: [
            Validaters.NotNull,
            Validaters.Email
          ]
        },
        form: {
          searchStr: '',
          taskName: '',
          description: '',
          priority: 1,
          scriptLibUuid: '',
          fastenScriptList: [],
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
          },
          isPeriod: 0,
          isMailbox: 0,
          mailbox: '',
          templateUuid: '',
          taskStatus: 1,
          uuid: ''
        },
        criteria: {                 // 真分页分页数据
          condition: {
          },
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        activeNames: 'base',
        ajaxObj: {
          type: 'post',
          url: '/automateSystemFasten/getSystemFastenTemplateAndItcomps',
          params: {
            condition: {
            }
          },
          checkedUuidArr: []
        },
        isShow: true, // 是否置灰不可选
        openEmail: false, // 启用邮件发送
        quoteList: [], // email数组
        selectEmail: [], // 选中的email数组
        scriptList: [],
        selectList: [],
        systemFastenTemplates: [],
        hostList: [],
        firstPickerOptions: {},
        lastPickerOptions: {},
        editDefaultName: '',
        middleTemplateName: ''
      }
    },
    created() {
      if (this.editData !== undefined) {
        this.selectList = this.editData.itcompInfos
        this.form = intersectObj(this.form, this.editData)
        this.paramList = this.editData.fastenScriptList;
        this.form.fastenScriptList = this.editData.fastenScriptList.map(item => item.itemUuid);
        this.form.isPeriod = parseInt(this.form.isPeriod)
        this.form.tScheduleTime = this.editData.tScheduleTime
        this.timeFlag = true // 请求到数据再执行时间组件
        if (this.editData.notices.length > 0) {
          this.openEmail = true
          this.quoteList = this.editData.notices
        }
        this.form.timeOut = parseInt(this.editData.timeOut);
        this.editDefaultName = this.form.taskName
        this.getTemplateName(this.form.templateUuid)
      }
    },
    components: {
      sPeriod,
      // InputTree,
      RealPageTable,
      AddQuoteAutoDialog,
      AddQuoteManualDialog
    },
    props: {
      editData: {
        type: Object
      }
    },
    mounted() {
      this.axiosUserList();
      this.getInitData()
    },
    methods: {
      axiosUserList() {
        $axios.post('/iamUserInfo/list', {}).then(({data}) => {
          if (data && data instanceof Array) {
            this.userList = data.map(item => {
              item.accountName = item.userRealName;
              item.email = item.userMail;
              item.accountUuid = item.uuid;
              return item;
            })
          }
        });
      },
      quoteSelectionChange(selections) {
        this.quoteSelections = selections;
      },
      addQuoteManual() {
        this.addQuoteManualDialog = true;
      },
      addQuoteAuto() {
        this.addQuoteAutoDialog = true;
      },
      delQuote() {
        if (this.quoteSelections.length === 0) {
          this.$message({message: '请选择要删除的数据', type: 'warning'});
          return;
        }
        this.$confirm('是否删除引用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.quoteSelections.forEach(delItem => {
            for (let j = 0; j < this.quoteList.length; j++) {
              let item = this.quoteList[j];
              if ((delItem.accountUuid && delItem.accountUuid === item.accountUuid) ||
                (!delItem.accountUuid &&
                  delItem.accountName === item.accountName &&
                  delItem.email === item.email)) {
                this.quoteList.splice(j, 1);
                break;
              }
            }
          });
        }).catch(() => {});
      },
      addQuoteManualCb(obj) {
        let arr = this.quoteList;
        for (let i in arr) {
          if (arr[i].email === obj.email) {
            this.$message({message: '不能添加相同的Email', type: 'warning'});
            return
          }
        }
        this.quoteList.push(obj);
      },
      addQuoteAutoCb(arr) {
        let _this = this;
        let handleArr = this.quoteList.filter(item => !item.accountUuid)
        let autoArr = JSON.parse(JSON.stringify(arr));
        handleArr.forEach(function(obj1) {
          arr.forEach(function(obj2) {
            if (obj1.email === obj2.email) {
              _this.$message({message: `列表已存在邮箱${obj1.email},不能添加相同的email`, type: 'warning'});
              autoArr = autoArr.filter(item => item.email !== obj1.email);
            }
          })
        })
        this.quoteList = handleArr.concat(autoArr);
      },
      changeOwnType(val) { // 所选的脚本uuid
        $axios.post('/automateSystemFasten/getFastenItemByUuidList', val).then(res => {
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
              this.form.fastenScriptList.splice(i, 1)
            }
          }
        }).catch(() => {});
      },
      getTemplateName(val) {
        $axios.get(`/automateSystemFasten/getSystemFastenItemByTemplateUuid/${val}`).then((res) => {
          if (this.editData === undefined) {
            this.form.fastenScriptList = []
          }
          if (res.data instanceof Array) {
            this.scriptList = res.data
            if (this.editData === undefined && this.scriptList.length > 0) {
              this.form.fastenScriptList.push(this.scriptList[0].uuid)
            }
            if (this.editData === undefined) {
              this.changeOwnType(this.form.fastenScriptList)
            }
          } else {
            return false
          }
        })
      },
      getInitData() {
        this.criteria.condition = cloneDeep(this.form)
        this.ajaxObj.params = cloneDeep(this.criteria);
        this.ajaxObj.checkedUuidArr = this.selectList;
      },
      handleData(value) {
        value.totalCount = value.itcompInfos.totalCount;
        let arr = value.itcompInfos.pageList
        let selectUuid = []
        if (this.selectList && this.selectList.length > 0) {
          this.selectList.map(item => {
            selectUuid.push(item.uuid)
          })
        }
        arr.forEach((row, index) => {
          if (selectUuid.indexOf(row.uuid) > -1) {
            arr.splice(index, 1)
            arr.unshift(row)
          }
        })
        this.hostList = arr
        this.systemFastenTemplates = value.templates
        let tArr = this.systemFastenTemplates.filter(node => node.uuid === this.form.templateUuid);
        if (tArr.length > 0) {
          this.middleTemplateName = tArr[0].name
        }
        return arr
      },
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['itcompname', 'controladderss', 'productname', 'defaultData']
        }
      },
      handleSelectionChange(val) {
        this.selectList = val
      }
    },
    computed: {
      hasSelectUser() { // 已经引用的
        return this.quoteList.filter(item => item.accountUuid)
      }
    },
    watch: {
      defaultData: {
        handler (value) {

        },
        immediate: true
      },
      'form.isPeriod': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      }
    }
  }
</script>
