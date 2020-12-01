/*
create by YOU
*/
<template>
  <s-scrollbar wrap-style="max-height: 550px;">
    <s-collapse v-model="activeName" accordion>
    <s-collapse-item title="巡检设置" name="1">
      <!--巡检设置-->
      <s-form :rules="basicRule" ref="form" label-width="120px" :model="form">
        <s-form-item label="巡检名称" prop="inspectName">
          <s-input :disabled="disabled" v-model="form.inspectName"></s-input>
        </s-form-item>
        <s-form-item label="维护人员" prop="dutyUserUuid">
          <select-dialog
            :disabled="disabled"
            v-model="form.dutyUserUuid"
            title="选择维护人员"
            :options="userList"
            :config="config"
            valueProp="uuid"
          >
            <s-option v-for="item in userList" :label="item.userRealName" :value="item.uuid"
                      :key="item.uuid"></s-option>
          </select-dialog>
        </s-form-item>
        <s-form-item label="是否周期任务" prop="isPeriodicTask">
          <s-radio-group v-model="form.isPeriodicTask">
            <s-radio :label="0">否</s-radio>
            <s-radio :label="1">是</s-radio>
          </s-radio-group>
        </s-form-item>
        <s-period ref="periods" v-if="asnycPeriod" v-model="form.tScheduleTime" :isShowNow="'is-show-now'" :showPeriodItem="showPeriodItem"></s-period>
        <s-form-item label="备注" prop="remark">
          <s-input type="textarea" v-model="form.remark"></s-input>
        </s-form-item>
      </s-form>
    </s-collapse-item>
    <s-collapse-item title="巡检对象" name="2">
      <s-table-page
        ref="serviceList"
        :data="serviceList"
        :header-search="searchDef()"
        :show-header-checkbox="true">
        <s-table-column type="selection"></s-table-column>
        <s-table-column prop="name" label="业务服务名称"></s-table-column>
        <s-table-column prop="criticalityName" label="关键程度"></s-table-column>
        <s-table-column prop="effectName" label="影响度"></s-table-column>
        <s-table-column prop="createTime" label="创建时间"></s-table-column>
      </s-table-page>
    </s-collapse-item>
    <s-collapse-item title="通知方式" name="3">
      <!--通知方式-->
      <!--<s-row>
        <s-checkbox :disabled="disabled" v-model="client">启用客户端发送</s-checkbox>
        <div v-if="client" class="listener-area">
          <div style="margin-bottom: 3px">
            <s-button :disabled="disabled" icon="link" @click="addAccess(1)">添加引用</s-button>
            <s-button :disabled="disabled" icon="delete" @click="submitDelClient">删除引用</s-button>
          </div>
          <s-table
            @selection-change="onClientChange"
            :data="clientList">
            <s-table-column
              :disabled="disabled"
              type="selection"
              width="45">
            </s-table-column>
            <s-table-column
              prop="userLoginName"
              show-overflow-tooltip
              label="账号名称">
            </s-table-column>
            <s-table-column
              prop="userRealName"
              show-overflow-tooltip
              label="真实姓名">
            </s-table-column>
            <s-table-column
              prop="userMail"
              show-overflow-tooltip
              label="Email">
            </s-table-column>
          </s-table>
        </div>
      </s-row>-->
      <s-row>
        <s-checkbox :disabled="disabled" v-model="email">启用邮件发送</s-checkbox>
        <div v-if="email" class="listener-area">
          <div style="margin-bottom: 3px">
            <s-button :disabled="disabled" icon="link" @click="addAccess(2)">添加引用</s-button>
            <s-button :disabled="disabled" icon="delete" @click="submitDelEmail">删除引用</s-button>
          </div>
          <s-table
            @selection-change="onEmailChange"
            :data="emailList">
            <s-table-column
              :disabled="disabled"
              type="selection"
              width="45">
            </s-table-column>
            <s-table-column
              prop="userLoginName"
              show-overflow-tooltip
              label="账号名称">
            </s-table-column>
            <s-table-column
              prop="userRealName"
              show-overflow-tooltip
              label="真实姓名">
            </s-table-column>
            <s-table-column
              prop="userMail"
              show-overflow-tooltip
              label="Email">
            </s-table-column>
          </s-table>
        </div>
      </s-row>
    </s-collapse-item>
  </s-collapse>
    <!--客户端-->
    <s-dialog
      append-to-body
      v-model="clientDialog"
      width="600px"
      title="增加引用">
      <s-scrollbar wrap-style="max-height: 510px;">
        <cite-area ref="client" :data="citeData"></cite-area>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitClient">确定</s-button>
        <s-button @click="clientDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--Email-->
    <s-dialog
      append-to-body
      v-model="emailDialog"
      width="600px"
      title="增加引用">
      <s-scrollbar wrap-style="max-height: 510px;">
        <cite-area ref="email" :data="citeData"></cite-area>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitEmail">确定</s-button>
        <s-button @click="emailDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import SelectDialog from '@/components/selectDialog'
  import sPeriod from '@/components/periodFormItem/Period'

  import citeArea from './CiteArea';
  let cover = function (obj, data) {
    let newObj = {}
    for (let key in obj) {
      newObj[key] = data[key]
    }
    return newObj
  }
  export default {
    data () {
      return {
        asnycPeriod: false,
        clientDialog: false,
        emailDialog: false,
        citeData: {},
        showPeriodItem: false,
        activeName: '1',
        config: [
          {name: '账号名称', value: 'userLoginName'},
          {name: '真实姓名', value: 'userRealName'},
          {name: '所属机构', value: 'departName'},
          {name: '角色', value: 'roleName'},
          {name: '状态', value: 'statusName'}
        ],
        form: {
          inspectName: '',
          dutyUserUuid: '',
          serviceUuids: [],
          clientUuids: [],
          emailUuids: [],
          isPeriodicTask: 0,
          remark: '',
          email: false,
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
        client: false,
        email: false,
        userList: [],
        serviceList: [],
        clientList: [],
        emailList: [],
        clientDelList: [],
        emailDelList: [],
        basicRule: {
          inspectName: [
            {required: true, message: '请输入巡检名称', trigger: 'blur'},
            {max: 30, message: '不能超过30个字符', trigger: 'blur'},
            {
              pattern: new RegExp("^[^`~!@#$^&*()=|{}':;',\\[\\]\\\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]{1,}$"),
              message: '名称不能包含【`~!@#$^&*()=|{}:;,\[].<>/?~！@#￥……&*（）——|{}【】‘；：”“。，、？】等特殊字符',
              trigger: 'blur'
            }
          ],
          dutyUserUuid: [{required: true, message: '请选择用户', trigger: 'change'}],
          time: [{required: true, message: '请选择时间', trigger: 'change'}],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        }
      }
    },
    components: {
      SelectDialog,
      sPeriod,

      citeArea
    },
    mounted () {
      this.$nextTick(() => {
        this.init()
      })
    },
    watch: {
      'form.isPeriodicTask': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      },
      email (val) {
        this.form.email = this.email
      },
      client (val) {
        if (val) {
          this.form.clientUuids = this.clientList.map(item => item.uuid)
        } else {
          this.form.clientUuids = []
        }
      },
      clientList (val) {
        this.form.clientUuids = val.map(item => item.uuid)
      },
      emailList (val) {
        this.form.emailUuids = val.map(item => item.uuid)
      }
    },
    methods: {
      submitClient() {
        this.clientDialog = false
        this.clientList = this.clientList.concat(this.$refs.client.selected)
      },
      submitEmail() {
        this.emailDialog = false
        this.emailList = this.emailList.concat(this.$refs.email.selected)
      },
      toTab(n) {
        this.activeName = n
      },
      searchDef() {
        return {
          width: 6,
          placeholder: '请输入查询条件',
          searchProps: ['name', 'createTime', 'criticalityName', 'effectName']
        }
      },
      init () {
        let _self = this
        // 维护人员
        $axios.post('/businessinspect/getUnselectedSysUser', []).then(function (res) {
          _self.userList = res.data
        })
        // 巡检服务
        $axios.post('/businessinspect/getServiceList').then(function (res) {
          _self.asnycPeriod = true
          _self.serviceList = res.data
          // 初始化数据
          let defaultData = _self.data
          if (_self.data.uuid) {
            _self.form = cover(_self.form, defaultData)
            _self.form.uuid = defaultData.uuid
            // 选中表格
            _self.$nextTick(function () {
              _self.serviceList.map(function (item, index) {
                if (_self.data.serviceUuids.indexOf(item.uuid) !== -1) {
                  _self.$refs.serviceList.toggleRowSelection(item, true)
                }
              })
            })
            if (defaultData.clientUuids && defaultData.clientUuids.length > 0 || defaultData.emailUuids && defaultData.emailUuids.length > 0) {
              $axios.post('/businessinspect/getUnselectedSysUser', []).then(function (res) {
                let users = res.data
                if (defaultData.clientUuids && defaultData.clientUuids.length > 0) {
                  _self.client = true
                  defaultData.clientUuids.map(function (uuid) {
                    for (let key in users) {
                      if (users[key].uuid === uuid) {
                        _self.clientList.push(users[key])
                        break;
                      }
                    }
                  })
                }
                if (defaultData.emailUuids && defaultData.emailUuids.length > 0) {
                  _self.email = true
                  defaultData.emailUuids.map(function (uuid) {
                    for (let key in users) {
                      if (users[key].uuid === uuid) {
                        _self.emailList.push(users[key])
                        break;
                      }
                    }
                  })
                }
              })
            }
          }
        })
      },
      onServiceChange (selection) {
        this.form.serviceUuids = selection.map(item => item.uuid)
      },
      addAccess (type) {
        $axios.post('/businessinspect/getUnselectedSysUser', []).then((res) => {
          let added
          type === 1 ? added = this.clientList : added = this.emailList
          this.citeData = res.data.filter(function (item) {
            for (let i in added) {
              if (added[i].uuid === item.uuid) {
                return false
              }
            }
            return item
          })
          type === 1 ? this.clientDialog = true : this.emailDialog = true
        })
      },
      onClientChange (selection) {
        this.clientDelList = selection
      },
      onEmailChange (selection) {
        this.emailDelList = selection
      },
      submitDelClient () {
        let _self = this
        this.clientList = this.clientList.filter(function (item) {
          if (_self.clientDelList.indexOf(item) !== -1) {
            return false
          }
          return item
        })
      },
      submitDelEmail () {
        let _self = this
        this.emailList = this.emailList.filter(function (item) {
          if (_self.emailDelList.indexOf(item) !== -1) {
            return false
          }
          return item
        })
      },
      selectable (row, index) {
        if (this.disabled) {
          return false
        } else {
          return true
        }
      }
    },
    props: {
      data: Object,
      disabled: {
        type: Boolean,
        default: false
      },
      paneName: String
    }
  };
</script>
