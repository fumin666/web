<template>
  <section>
    <s-tab type="card" id="change-pass" @on-click="refreshData" class="oper-subpage-margin">
      <s-tab-pane label="运维列表" v-if="judgeRoleBtn('operationCenter_pwOperationList')">
        <div class="input-search fr" style="width: 280px; margin-bottom: 10px">
          <s-input placeholder="请输入内容" v-model="searchKey" class="real-search-input"
                   @keyup.enter.native="getLists"></s-input>
          <i class="iconfont icon-magnifier search-btn" @click="getLists"></i>
        </div>
        <RealPageTable :ajax-obj="ajaxObj" :useVirtual="true" :height="600">
          <s-table-column
            prop="itcompName"
            label="资产名称"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="itcompPort"
            label="端口"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="protocolName"
            label="协议"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="clipboard"
            label="剪切板"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="disk_mapping"
            label="磁盘映射"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="statusStr"
            label="状态">
          </s-table-column>
          <s-table-column label="操作" width="120">
            <template slot-scope="scope">
              <i v-if="startBtnShow(scope.row) && scope.row.canOperate" class="iconfont icon-start"
                 @click="startHandle(scope.row)" title="开始会同"></i>
              <i v-if="resetBtnShow(scope.row) && scope.row.canOperate" class="iconfont icon-shut-down"
                 @click="resetHandle(scope.row)" title="重启会同"></i>
              <i v-if="opsBtnShow(scope.row) && scope.row.canOperate" class="iconfont icon-special-oper"
                 @click="opsHandle(scope.row)" title="会同运维"></i>
              <i v-if="cancelBtnShow(scope.row) && scope.row.canOperate" class="iconfont icon-cancel"
                 @click="cancelHandle(scope.row)" title="取消会同"></i>
              <i v-if="!scope.row.canOperate" class="iconfont icon-ban" @click="stopHandle" title="禁止"></i>
            </template>
          </s-table-column>
        </RealPageTable>
      </s-tab-pane>
      <s-tab-pane label="运维会同" v-if="judgeRoleBtn('operationCenter_pwConjunction')">
        <s-table-page :data='confer'

                      :row-actions='getConferRowActionsDef()'
                      :header-search='getSearchDefConf()'>
          <s-table-column
            prop="itcompName"
            label="资产名称">
          </s-table-column>
          <s-table-column
            prop="itcompPort"
            label="端口"
            :formatter="formatterPort">
          </s-table-column>
          <s-table-column
            prop="protocolName"
            label="协议">
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址">
          </s-table-column>
          <s-table-column
            prop="userRealName"
            label="发起人">
          </s-table-column>
          <s-table-column
            prop="statusStr"
            label="状态"
            :formatter="formatterConfer">
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <!--运维会同弹窗-->
    <s-dialog
      v-model="optConnectDialog"
      v-if="optConnectDialog"
      width="600px"
      title="密码会同">
      <s-form ref="onlyPwd" :model="form" label-width="120px">
        <s-form-item label="密码" prop="devicePasswd">
          <s-input type="password" v-model="form.devicePasswd"></s-input>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="optOk">确定</s-button>
        <s-button type="cancel" @click="optConnectDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--开始会同弹窗-->
    <s-dialog
      v-model="startDialog"
      v-if="startDialog"
      width="600px"
      title="开始会同">
      <s-scrollbar wrap-class="default-dialog-scroll">
        <s-form ref="startPwd" :model="opsForm" :rules="opsFormRules" label-width="120px">
          <div v-if="protoclFlag">
            <s-form-item label="协议名称" prop="protocolUuid">
              <s-select v-model="opsForm.protocolUuid" filterable clearable>
                <s-option v-for="item in opsProtocolOptions" :label="item.protocolName" :value="item.uuid"
                          :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="端口" prop="port">
              <s-input v-model="opsForm.port"></s-input>
            </s-form-item>
          </div>
          <s-form-item label="用户名" prop="accountName">
            <s-input v-model="opsForm.accountName"></s-input>
          </s-form-item>
          <s-form-item label="密码" prop="devicePasswd">
            <s-input type="password" v-model="opsForm.devicePasswd"></s-input>
          </s-form-item>
          <s-form-item label="密码属性" prop="pwdType">
            <s-radio-group v-model="opsForm.pwdType">
              <s-radio label="1">前段密码</s-radio>
              <s-radio label="2">后段密码</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-form-item label="会同人" prop="conUserUuid">
            <s-select v-model="opsForm.conUserUuid" filterable clearable>
              <s-option v-for="item in optMan" :key="item.id" :label="item.userRealName" :value="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <template v-if="browserFlag">
            <s-form-item label="相对路径" prop="subpath">
              <s-col span="20">
                <s-input type="text" v-model="opsForm.subpath"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="浏览器">
              <s-col span="8">
                <s-select v-model="opsForm.browser" placeholder="请选择分辨率">
                  <s-option label="Internet Explorer" :value=0></s-option>
                  <s-option label="FireFox" :value=1></s-option>
                </s-select>
              </s-col>
            </s-form-item>
            <s-form-item label="提交方式">
              <s-col span="8">
                <s-select v-model="opsForm.submitType" placeholder="请选择分辨率">
                  <s-option label="按钮" :value=0></s-option>
                  <s-option label="链接" :value=1></s-option>
                  <s-option label="不代填" :value=2></s-option>
                  <s-option label="不提交" :value=3></s-option>
                </s-select>
              </s-col>
            </s-form-item>
            <s-form-item label="代填用户控件名" prop="userLableName">
              <s-col span="20">
                <s-input type="text" v-model="opsForm.userLableName"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="代填密码控件名" prop="pwdLableName">
              <s-col span="20">
                <s-input type="text" v-model="opsForm.pwdLableName"></s-input>
              </s-col>
            </s-form-item>
          </template>
        </s-form>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="startSave">确定</s-button>
        <s-button type="cancel" @click="startDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--会同弹窗-->
    <s-dialog
      v-model="opsDialog"
      v-if="opsDialog"
      width="600px"
      title="会同运维">
      <s-scrollbar wrap-class="default-dialog-scroll">
        <s-row>
        <span v-if="showName">
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">用户名</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">{{accountName}}</div>
            </s-col>
          </s-row>
        </span>
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">密码</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">******</div>
            </s-col>
          </s-row>
          <!--协议端口-->
          <div v-if="protocolName">
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">协议</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{protocolName}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">端口</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{port}}</div>
              </s-col>
            </s-row>
          </div>

          <!--相对路径-->
          <div v-if="subpath">
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">相对路径</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{subpath}}</div>
              </s-col>
            </s-row>

            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">浏览器</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{browser === 0 ? 'Internet Explorer' : 'FireFox' }}</div>
              </s-col>
            </s-row>

            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">提交方式</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{switchSubType(submitType)}}</div>
              </s-col>
            </s-row>

            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">代填用户控件名</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{userLableName}}</div>
              </s-col>
            </s-row>

            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">代填密码控件名</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{pwdLableName}}</div>
              </s-col>
            </s-row>

          </div>
          <span>
            <s-row v-if="dbShow">
              <s-col :span="10">
                <div class="grid-content bg-purple"><span class="rednotnull">*</span>数据库</div>
              </s-col>
              <s-col :span="14">
                <s-form class="grid-content bg-purple-light" ref="opsDbName" :model="optForm" :rules="optFormRules">
                  <s-form-item prop="strDBname" v-if="optDb.length !==0">
                    <s-select v-model="optForm.strDBname">
                      <s-option v-for="item in optDb" :key="item.id" :label="item" :value="item"></s-option>
                    </s-select>
                  </s-form-item>
                  <s-form-item prop="strDBname" v-else class="oper-input-box">
                     <s-input type="text" v-model="optForm.strDBname"></s-input>
                  </s-form-item>
                </s-form>
              </s-col>
            </s-row>
        </span>
        </s-row>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOps">确定</s-button>
        <s-button type="cancel" @click="closeOps">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  import {Validaters} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  const defaultProtocolName = '00000000000000000000000000000072'  // ssh
  const web = '00000000000000000000000000000111'  // web
  export default {
    data() {
      let checkPort = (rule, value, callback) => {  // 校验端口号
        if (value > 65535) {
          callback(new Error('端口号不能大于65535！'));
        } else {
          callback()
        }
      };
      return {
        optForm: {
          uuid: '',
          pwdConUuid: '',
          strDBname: ''
        },
        optFormRules: {
          strDBname: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        opsProtocolOptions: [],
        protoclFlag: false,
        opsForm: {
          protocolUuid: '',
          port: '',
          accountName: '',
          devicePasswd: '',
          pwdType: '1',
          conUserUuid: '',
          uuid: '',
          subpath: '',
          browser: 0,
          submitType: 0,
          userLableName: '',
          pwdLableName: ''
        },
        opsFormRules: {
          protocolUuid: [Validaters.SelectValNotNull],
          port: [
            Validaters.NotNull,
            Validaters.Number,
            {validator: checkPort, trigger: 'blur'}
          ],
          accountName: [{required: true, message: '不能为空', trigger: 'blur'}],
          devicePasswd: [{required: true, message: '不能为空', trigger: 'blur'}],
          conUserUuid: [{required: true, message: '不能为空', trigger: 'change'}],
          subpath: [
            Validaters.NotNull,
            Validaters.Max(255)
          ],
          userLableName: [
            Validaters.Max(255)
          ],
          pwdLableName: [
            Validaters.Max(255)
          ]
        },
        startDialog: false,
        opsDialog: false,
        confer: [],
        optMan: [],
        optDb: [],
        accountName: '',
        subpath: '',
        browser: 0,
        submitType: 0,
        userLableName: '',
        pwdLableName: '',
        protocolName: '',
        port: '',
        optConnectDialog: false,
        form: {
          devicePasswd: '',
          protocolName: '',
          uuid: ''
        },
        editOpt: {},
        showName: false,
        browserFlag: false,
        dbShow: false,
        ajaxObj: {
          type: 'post',
          url: '/pwdConnect/getPwdConnectList',
          params: {
            condition: {
            }
          }
        },
        searchKey: ''
      }
    },
    components: {
      RealPageTable
    },
    mounted() {
      this.getLists()
      this.getConfer()
    },
    methods: {
      getOpsProtocolOptions() { // 获取协议下拉框
        $axios.post('/basicOperation/getOperationProtocolList').then((res) => {
          if (res.data) {
            let protocolArr = cloneDeep(res.data)
            protocolArr = protocolArr.filter(item => {
              if (item.protocolName !== 'xwin') {
                return item
              }
            });
            this.opsProtocolOptions = protocolArr
            this.opsForm.protocolUuid = defaultProtocolName
          }
        });
      },
      refreshData(key) {
        if (key === 0) {
          this.getLists();
        }
        if (key === 1) {
          this.getConfer();
        }
      },
      startSave() {
        this.$refs.startPwd.validate((valid) => {
          if (valid) {
            $axios.post('/pwdConnect/startCon', this.opsForm).then(res => {
              if (res.data.status === 'true') {
                this.$message({message: res.data.msg, type: 'success'});
                this.startDialog = false;
                this.getLists();
              } else {
                this.$message({message: res.data.msg, type: 'error'});
              }
            })
          } else {
            return false
          }
        })
      },
      startHandle(row) {
        if (row.canOperate === false) {
          this.$message({message: '禁止会同', type: 'error'});
          return false
        }
        this.opsForm.pwdConUuid = row.pwdConUuid
        this.opsForm.uuid = row.uuid
        $axios.get(`/pwdConnect/startConInitFormInfo/${row.itcompUuid}`).then(res => {
          this.startDialog = true
          this.optMan = res.data
          if (!row.portUuid) {
            this.getOpsProtocolOptions()
            this.protoclFlag = true
          } else {
            this.protoclFlag = false
          }
        });
      },
      saveOps() {
        if (this.$refs.opsDbName) {
          this.$refs.opsDbName.validate(valid => {
            if (!valid) return;
            this.startOps()
          })
        } else {
          this.startOps()
        }
      },
      startOps() {
        $axios.post('/pwdConnect/startClient', this.optForm).then(res => {
          if (res.status === 200) {
            if (res.data.status === 'true') {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.opsDialog = false
              this.getLists()
              if (res.data.url !== '' || res.data.url !== null || res.data.url !== undefined) {
                window.location.href = res.data.url
              }
            }
            if (res.data.status === 'false') {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          }
        })
      },
      closeOps() {
        this.opsDialog = false
      },
      opsHandle(row) {
        $axios.get(`/pwdConnect/conInitFormInfo/${row.uuid}/${row.pwdConUuid}`).then(res => {
          if (res.data.select !== undefined && res.data.select.strDBname !== null) {
            this.dbShow = true
            this.optDb = res.data.select.strDBname
          } else {
            this.optDb = [];
            this.dbShow = false
          }
          if (res.data.accountName !== undefined && res.data.accountName !== '') {
            this.showName = true
            this.accountName = res.data.accountName
            if (res.data.subpath) {
              this.subpath = res.data.subpath;
              this.browser = res.data.browser;
              this.submitType = res.data.submitType;
              this.userLableName = res.data.userLableName;
              this.pwdLableName = res.data.pwdLableName;
            } else {
              this.subpath = '';
            }
          }
          this.protocolName = res.data.protocolName ? res.data.protocolName : '';
          this.port = res.data.port ? res.data.port : '';
          this.opsDialog = true
          this.optForm.uuid = row.uuid
          this.optForm.pwdConUuid = row.pwdConUuid
        });
      },
      resetHandle(row) {
        this.$confirm('确定重启会同？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/pwdConnect/restartCon/${row.pwdConUuid}`).then((res) => {
            if (res.data.status === 'true') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.getLists();
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          }).catch(() => {
          });
        })
      },
      cancelHandle(row) {
        this.$confirm('确定取消会同？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/pwdConnect/cancelCon/${row.pwdConUuid}`).then((res) => {
            if (res.data.status === 'true') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.getLists();
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
        }).catch(() => {
        });
      },
      stopHandle() {
        this.$message({message: '禁止操作', type: 'warning'});
      },
      startBtnShow(row) {
        if (row.status === 0 || row.status === 1 || row.status === 8) {
          return true
        }
      },
      resetBtnShow(row) {
        if (row.status === 4 || row.status === 6) {
          return true
        }
      },
      opsBtnShow(row) {
        if (row.status === 7) {
          return true
        }
      },
      cancelBtnShow(row) {
        if (row.status === 2 || row.status === 3 || row.status === 5) {
          if (row.status !== 5) {
            return true
          }
        }
      },
      optOk() {
        $axios.post('/pwdConnect/pwdCon', this.form).then((res) => {
          if (res.data.status === 'true') {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.optConnectDialog = false
            this.getConfer()
          } else if (res.data.status === 'false') {
            this.optConnectDialog = false
            this.getConfer()
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      formatterStatus(item) {
        return item.status === 0 ? '删除' : '正常';
      },
      formatterConfer(item) {
        switch (item.status) {
          case 0:
            return '开始会同';
          case 1:
            return '重启会同';
          case 2:
            return '等待会同';
          case 3:
            return '会同就绪';
          case 4:
            return '会同错误';
          case 5:
            return '正在会同';
          case 6:
            return '取消会同';
          case 7:
            return '会同完成';
        }
      },
      formatterPort(item) {
        if (item.itcompPort === null) {
          return item.port
        }
        return item.itcompPort
      },
      getSearchDefConf() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['itcompName', 'itcompPort', 'protocolName', 'controlAdderss', 'userRealName', 'statusStr'] // can be string or Array
        }
      },
      getConferRowActionsDef() {
        let vm = this
        return [{
          icon: 'union',
          click(row) {
            vm.optConnectDialog = true
            vm.form.protocolName = row.protocolName
            vm.form.uuid = row.uuid
          },
          name: '会同'
        }]
      },
      getLists() {
        let params = {
          content: this.searchKey
        }
        this.ajaxObj.params.condition = params;
      },
      getConfer() {
        $axios.get('/pwdConnect/getOptConnectList').then(res => {
          this.confer = res.data
        });
      },
      initState() {
        this.opsForm.subpath = '';
        this.opsForm.browser = 0;
        this.opsForm.submitType = 0;
        this.opsForm.userLableName = '';
        this.opsForm.pwdLableName = '';
      },
      switchSubType(val) {
        switch (val) {
          case 0:
            return '按钮'
          case 1:
            return '链接'
          case 2:
            return '不代填'
          case 3:
            return '不代填'
        }
      }
    },
    watch: {
      startDialog(val) {
        if (val === false) {
          this.$refs['startPwd'].resetFields()
        }
      },
      optConnectDialog(val) {
        if (val === false) {
          this.$refs['onlyPwd'].resetFields()
        }
      },
      opsDialog(val) {
        if (val === false) {
          this.optForm = {
            uuid: '',
            pwdConUuid: '',
            strDBname: ''
          }
        }
      },
      'opsForm.protocolUuid': {
        immediate: true,
        handler(val) {
          this.opsProtocolOptions.map(v => {
            if (v.uuid === val) {
              this.opsForm.port = v.protocolPort;
            }
          });
          if (val === web) {
            this.browserFlag = true
          } else {
            this.browserFlag = false
            this.initState()
          }
        }
      }
    }
  }
</script>
<style lang="stylus">
  .input-search
    position relative
    .search-btn
      position absolute
      right 5px
      top 7.5px
  .oper-input-box
    .s-form-item-content
      line-height 30px
    .s-input
      height 30px
</style>
