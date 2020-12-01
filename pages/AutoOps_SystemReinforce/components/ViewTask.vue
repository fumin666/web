/**
* Created by alex on 2018/8/21.
*/
<template>
  <s-scrollbar wrap-style="height: 400px;">
    <s-collapse v-model="activeNames" accordion>
      <s-collapse-item title="基础设定" name="base">
        <s-form :model="form" ref="taskForm" label-width="120px">
          <s-form-item label="任务名称" prop="taskName">
            <s-input :disabled="true" v-model="form.taskName"></s-input>
          </s-form-item>
          <s-form-item label="是否周期任务" prop="isPeriod">
            <s-radio-group :disabled="true" v-model="form.isPeriod">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-period disableFromProp ref="periods" v-model="form.tScheduleTime" :showPeriodItem="showPeriodItem"></s-period>
          <s-form-item label="备注" prop="description">
            <s-input type="textarea" :disabled="true" v-model="form.description"></s-input>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="选择脚本" name="script">
        <s-form :model="form" ref="taskForm1" label-width="120px">
          <s-form-item label="选择模版" prop="templateUuid">
            <s-select :disabled="true" v-model="form.templateUuid" clearable @change="getTemplateName" style="width: 400px">
              <s-option v-for="item in systemFastenTemplates" :value="item.uuid" :label="item.name"
                        :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="选择脚本" prop="fastenScriptList" style="width: 100%">
            <s-select :disabled="true" v-model="form.fastenScriptList" @change="changeOwnType" collapse-tags multiple style="width: 400px">
              <s-option v-for="(item, index) in scriptList" :value="item.uuid" :label="item.name" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-row>
            <s-table-page
              :page-sizes="[5, 10, 15, 20]"
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
                  <s-input placeholder="请输入脚本参数" :disabled="true" v-model="scope.row.scriptParam"></s-input>
                </template>
              </s-table-column>
            </s-table-page>
          </s-row>
          <s-form-item label="超时时间" prop="timeOut">
            <s-input v-model="form.timeOut" :disabled="true" placeholder="秒，请输入正整数"></s-input>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="选择资产" name="host">
        <s-table-page :data="selectList">
          <s-table-column prop="itcompname" label="主机名"></s-table-column>
          <s-table-column prop="controladderss" label="IP地址"></s-table-column>
          <s-table-column prop="productname" label="操作系统"></s-table-column>
        </s-table-page>
      </s-collapse-item>
      <s-collapse-item title="通知方式" name="message">
        <s-row class="title">邮件</s-row>
        <s-row>
          <s-col span="8">启用邮件发送</s-col>
          <s-col span="16"><s-switch :disabled="true" v-model="openEmail"></s-switch></s-col>
        </s-row>
        <s-row v-show="openEmail">
          <s-table style="width: 100%;" :data="quoteList"  max-height="450">
            <s-table-column label="真实姓名" prop="accountName"></s-table-column>
            <s-table-column label="Email" prop="email"></s-table-column>
          </s-table>
        </s-row>
      </s-collapse-item>
    </s-collapse>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import { intersectObj } from 'sunflower-common-utils'
  import sPeriod from '@/components/periodFormItem/Period'
  import {cloneDeep} from 'lodash'
  export default {
    data() {
      return {
        showPeriodItem: false,
        form: {
          taskName: '',
          isPeriod: '',
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
          isMailbox: 0,
          fastenScriptList: [],
          mailbox: '',
          templateUuid: '',
          taskStatus: 1,
          uuid: ''
        },
        scriptList: [],
        activeNames: 'base',
        criteria: {                 // 真分页分页数据
          condition: {
          },
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        selectList: [],
        systemFastenTemplates: [],
        hostList: [],
        firstPickerOptions: {},
        lastPickerOptions: {},
        middleTemplateName: '',
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
        editDefaultName: ''
      }
    },
    created() {
      if (this.editData !== undefined) {
        this.selectList = this.editData.itcompInfos
        this.form = intersectObj(this.form, this.editData)
        this.paramList = this.editData.fastenScriptList;
        this.form.fastenScriptList = this.editData.fastenScriptList.map(item => item.itemUuid);
        this.form.isPeriod = parseInt(this.form.isPeriod)
        this.form.timeOut = parseInt(this.editData.timeOut);
        this.editDefaultName = this.form.taskName
        this.systemFastenTemplates = this.editData.templates
        if (this.editData.notices.length > 0) {
          this.openEmail = true
          this.quoteList = this.editData.notices
        }
        this.getTemplateName(this.form.templateUuid)
      }
    },
    mounted() {
      this.getInitData()
    },
    components: {
      sPeriod
    },
    props: {
      editData: {
        type: Object
      }
    },
    methods: {
      getTemplateName(value) {
        $axios.get(`/automateSystemFasten/getSystemFastenItemByTemplateUuid/${value}`).then((res) => {
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
      changeOwnType(val) { // 所选的脚本uuid
        $axios.post('/automateSystemFasten/getFastenItemByUuidList', val).then(res => {
          this.paramList = res.data
        })
      },
      getInitData() {
        this.criteria.condition = cloneDeep(this.form)
        this.ajaxObj.params.condition = cloneDeep(this.criteria);
        this.ajaxObj.checkedUuidArr = this.selectList;
      },
      handleData(value) {
        value.totalCount = value.itcompInfos.totalCount;
        let arr = value.itcompInfos.pageList
        arr.forEach((row, index) => {
          if (this.selectList.indexOf(row.uuid) > -1) {
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
      changeHandler(val) {
        this.selectList = val.map(item => {
          return {
            itcompUuid: item.uuid,
            name: item.itcompname,
            ipAddress: item.controladderss,
            type: item.automatetype,
            templateName: this.middleTemplateName
          }
        })
      }
    },
    watch: {
      'form.isPeriod': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      }
    }
  }
</script>
