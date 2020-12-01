<template>
  <div class="warning-strategy-form">
    <s-tab v-model="tab">
      <s-tab-pane label="告警属性">
        <s-form ref="form1" :model="form" :rules="rules" label-width="100px">
          <s-form-item labelWidth="10px">
            <span style="color:rgb(44,172,244)">常规属性</span>
          </s-form-item>
          <s-form-item label="名称" prop="alertName">
            <s-input v-model="form.alertName" :disabled="disabled"></s-input>
          </s-form-item>
          <s-form-item label="描述" prop="remark" prop="remark">
            <s-input type="textarea" v-model="form.remark" :disabled="disabled"></s-input>
          </s-form-item>
        </s-form>
      </s-tab-pane>
      <s-tab-pane label="告警方式">
        <s-form ref="form2" :model="form" label-width="100px">
          <s-form-item labelWidth="10px">
            <s-row>
              <s-col :span="4"><span style="color:rgb(44,172,244)">客户端</span></s-col>
              <s-col :span="4" :offset="16">
                <s-switch v-model="form.client" :disabled="disabled"></s-switch>
              </s-col>
            </s-row>
          </s-form-item>
          <s-form-item labelWidth="10px" v-show="form.client===true">
            <div style="margin-bottom: 10px;" v-if="!disabled">
              <s-button @click="emitObjectList('client')" :disabled="disabled" icon="link">添加引用</s-button>
              <s-button @click="deleteObjectList('client')" :disabled="disabled" icon="delete">删除引用</s-button>
            </div>
            <s-table
              :data="form.clientInfoList"
              @selection-change="handleClientSelectionChange">
              <s-table-column show-overflow-tooltip type="selection" width="45"></s-table-column>
              <s-table-column show-overflow-tooltip label="用户名" prop="userName"></s-table-column>
              <s-table-column show-overflow-tooltip label="真实姓名" prop="relName"></s-table-column>
              <s-table-column show-overflow-tooltip label="手机号" prop="accountNumber"></s-table-column>
            </s-table>
          </s-form-item>
          <s-form-item labelWidth="10px">
            <s-row>
              <s-col :span="4"><span style="color:rgb(44,172,244)">邮件</span></s-col>
              <s-col :span="4" :offset="16">
                <s-switch v-model="form.email" :disabled="disabled"></s-switch>
              </s-col>
            </s-row>
          </s-form-item>
          <s-form-item labelWidth="10px" v-show="form.email===true">
            <div style="margin-bottom: 10px;" v-if="!disabled">
              <s-button @click="addByHand('email')" :disabled="disabled" icon="plus">手动新增</s-button>
              <s-button @click="emitObjectList('email')" :disabled="disabled" icon="link">添加引用</s-button>
              <s-button @click="deleteObjectList('email')" :disabled="disabled"  icon="delete">删除引用</s-button>
            </div>
            <s-table
              :data="form.emailInfoList"
              @selection-change="handleEmailSelectionChange">
              <s-table-column show-overflow-tooltip type="selection" width="45"></s-table-column>
              <s-table-column show-overflow-tooltip label="真实姓名" prop="relName"></s-table-column>
              <s-table-column show-overflow-tooltip label="email" prop="accountNumber"></s-table-column>
            </s-table>
          </s-form-item>
          <s-form-item labelWidth="10px">
            <s-row>
              <s-col :span="4"><span style="color:rgb(44,172,244)">短信</span></s-col>
              <s-col :span="4" :offset="16">
                <s-switch v-model="form.message" :disabled="disabled"></s-switch>
              </s-col>
            </s-row>
          </s-form-item>
          <s-form-item labelWidth="10px" v-show="form.message===true">
            <div style="margin-bottom: 10px;" v-if="!disabled">
              <s-button @click="addByHand('message')" :disabled="disabled" icon="plus">手动新增</s-button>
              <s-button @click="emitObjectList('message')" :disabled="disabled" icon="link">添加引用</s-button>
              <s-button @click="deleteObjectList('message')" :disabled="disabled" icon="delete">删除引用</s-button>
            </div>
            <s-table
              :data="form.messageInfoList"
              @selection-change="handleMessageSelectionChange">
              <s-table-column show-overflow-tooltip type="selection" width="45"></s-table-column>
              <s-table-column show-overflow-tooltip label="真实姓名" prop="relName"></s-table-column>
              <s-table-column show-overflow-tooltip label="手机号" prop="accountNumber"></s-table-column>
            </s-table>
          </s-form-item>
          <s-form-item labelWidth="10px">
            <s-row>
              <s-col :span="4"><span style="color:rgb(44,172,244)">微信</span></s-col>
              <s-col :span="4" :offset="16">
                <s-switch v-model="form.weChat" :disabled="disabled"></s-switch>
              </s-col>
            </s-row>
          </s-form-item>
          <s-form-item labelWidth="10px" v-show="form.weChat===true">
            <div style="margin-bottom: 10px;" v-if="!disabled">
              <s-button @click="addByHand('weChat')" :disabled="disabled" icon="plus">手动新增</s-button>
              <s-button @click="emitObjectList('weChat')" :disabled="disabled" icon="link">添加引用</s-button>
              <s-button @click="deleteObjectList('weChat')" :disabled="disabled" icon="delete">删除引用</s-button>
            </div>
            <s-table
              :data="form.weChatInfoList"
              @selection-change="handleWeChatSelectionChange">
              <s-table-column show-overflow-tooltip type="selection" width="45"></s-table-column>
              <s-table-column show-overflow-tooltip label="真实姓名" prop="relName"></s-table-column>
              <s-table-column show-overflow-tooltip label="微信号" prop="accountNumber"></s-table-column>
            </s-table>
          </s-form-item>
        </s-form>
      </s-tab-pane>
      <s-tab-pane label="告警策略">
        <s-form ref="form3" :model="form" :rules="rules" label-width="120px">
          <s-form-item labelWidth="10px">
            <span style="color:rgb(44,172,244)">工作时间</span>
          </s-form-item>
          <s-form-item label="工作起始时间" prop="startTime">
            <s-time-picker
              v-model="form.startTime"
              :picker-options="startTimePickerOptions"
              @change="firstChange"
              :disabled="disabled">
            </s-time-picker>
          </s-form-item>
          <s-form-item label="工作结束时间" prop="endTime">
            <s-time-picker
              v-model="form.endTime"
              :picker-options="endTimePickerOptions"
              @change="lastChange"
              :disabled="disabled">
            </s-time-picker>
          </s-form-item>
        </s-form>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script type="text/babel">
  import {omit} from 'lodash'
  export default {
    data() {
      return {
        form: {
          alertName: '',
          remark: '',
          client: false,
          email: false,
          message: false,
          weChat: false,
          clientInfoList: [],
          emailInfoList: [],
          messageInfoList: [],
          weChatInfoList: [],
          startTime: new Date('2017-11-11 00:00:00'),
          endTime: new Date('2017-11-11 23:59:59')
        },
        rules: {
          alertName: [{required: true, message: '不能为空', trigger: 'blur'}],
          remark: [{required: true, message: '不能为空', trigger: 'blur'}],
          startTime: [{required: true, message: '不能为空', trigger: 'blur', type: 'date'}],
          endTime: [{required: true, message: '不能为空', trigger: 'blur', type: 'date'}]
        },
        startTimePickerOptions: {selectableRange: '00:00:00 - 23:59:58'},
        endTimePickerOptions: {selectableRange: '00:00:01 - 23:59:59'},
        clientSelectedList: [],
        emailSelectedList: [],
        messageSelectedList: [],
        weChatSelectedList: [],
        disabled: false,
        tab: 0
      }
    },
    mounted() {
      if (this.type !== 'add') {
        this.initData()
      }
      if (this.type === 'eye') {
        this.disabled = true
      }
    },
    methods: {
      initData () {
        let form = this.defaultData
        if (notEmpty(form.clientInfoList)) {
          form.client = true
        }
        if (notEmpty(form.emailInfoList)) {
          form.email = true
        }
        if (notEmpty(form.messageInfoList)) {
          form.message = true
        }
        if (notEmpty(form.weChatInfoList)) {
          form.weChat = true
        }
        function notEmpty(data) {
          if (data && data.length > 0) {
            return true
          }
          return false
        }

        form.startTime = new Date('2017-11-11 ' + form.startTime)
        form.endTime = new Date('2017-11-11 ' + form.endTime)

        this.form = Object.assign({}, this.form, form)
      },
      emitObjectList(name) {
        // 传递当前列表数据
        this.$emit('object-list', {name: name, data: this.form[name + 'InfoList']})
      },
      deleteObjectList(name) {
        this.form[name + 'InfoList'] = this.form[name + 'InfoList'].filter((item) => {
          if (this[name + 'SelectedList'].indexOf(item) === -1) {
            return true
          }
          return false
        })
      },
      handleClientSelectionChange(selection) {
        this.clientSelectedList = selection
      },
      handleEmailSelectionChange(selection) {
        this.emailSelectedList = selection
      },
      handleMessageSelectionChange(selection) {
        this.messageSelectedList = selection
      },
      handleWeChatSelectionChange(selection) {
        this.weChatSelectedList = selection
      },
      // 时间
      firstChange(val) {
        this.endTimePickerOptions = {selectableRange: val + ' - 23:59:59'}
      },
      lastChange(val) {
        this.startTimePickerOptions = {selectableRange: '00:00:00 - ' + val}
      },
      // 提交数据
      pushObjectList(name, data) {
        let newData = data.map((item) => {
          return Object.assign({}, item, {alarmRuleUuid: this.defaultData.uuid})
        })
        this.form[name + 'InfoList'] = this.form[name + 'InfoList'].concat(newData)
      },
      addByHand(type) {
        // email message weChat
        this.$emit('add-by-hand', type)
      },
      getFormData() {
        let data = omit(this.form, ['client', 'message', 'weChat', 'email'])
        data.startTime = formatTime(data.startTime)
        data.endTime = formatTime(data.endTime)
        return data
        function formatTime(time) {
          let val = new Date(time)

          function addZero(t) {
            return t > 9 ? t : '0' + t
          }

          if (Object.prototype.toString.apply(val).indexOf('Date') !== -1) {
            let hour = addZero(val.getHours())
            let minutes = addZero(val.getMinutes())
            let second = addZero(val.getSeconds())
            return hour + ':' + minutes + ':' + second;
          }
          return '';
        }
      },
      validate() {
        let flag = true
        this.$refs.form1.validate((valid) => {
          if (!valid && flag) {
            flag = false
            this.tab = 0
            this.$message.error('请填写完整表单!')
          }
        })
        this.$refs.form2.validate((valid) => {
          if (!valid && flag) {
            flag = false
            this.tab = 2
            this.$message.error('请填写完整表单!')
          }
        })
        if (this.form.clientInfoList.length === 0 && this.form.messageInfoList.length === 0 && this.form.emailInfoList.length === 0 && this.form.weChatInfoList.length === 0 && flag) {
          flag = false
          this.tab = 1
          this.$message.error('请至少选择一种告警方式!')
        }
        return flag
      }
    },
    props: {
      defaultData: {
        type: Object,
        default () {
          return {}
        }
      },
      type: { // add,edit,eye
        type: String,
        default: 'add'
      }
    }
  };
</script>
