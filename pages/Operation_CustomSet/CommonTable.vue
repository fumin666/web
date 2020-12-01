<template>
  <section>
    <s-table-page :data='lists'

                  :header-actions='getListActionsDef()'
                  :hasActionCol='false'
                  :header-search='getSearchDef()'>
      <s-table-column
        prop="scriptName"
        label="脚本名称">
      </s-table-column>
      <s-table-column
        prop="scriptProtocol"
        label="协议">
      </s-table-column>
      <s-table-column
        label="操作">
        <template slot-scope="scope">
          <i title='修改' class="iconfont icon-edit" @click="handleEdit(scope.row)"></i>
          <i title='脚本配置' class="iconfont icon-script-set" @click="handleScript(scope.row)"></i>
          <i title='账号关联' class="iconfont icon-association" @click="handleAccount(scope.row)"></i>
          <i title='脚本测试' class="iconfont icon-script-language" v-if="scope.row.canTest"
             @click="handleCheck(scope.row)"></i>
          <i title='删除' class="iconfont icon-delete" v-if="!(scope.row.canTest)" @click="handleDel(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--新增-->
    <s-dialog
      v-model="addScriptDialog"
      v-if="addScriptDialog"
      width="880px"
      title="添加">
      <s-scrollbar wrap-class="default-dialog-scroll">
        <add-dialog :current="current" :scriptUuid="uuid" ref="addForm" :type="tableType"
                    @doCheck="doCheck"></add-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="isShowNextBtn" @click="nextBtnHandler">下一步</s-button>
        <s-button v-if="isShowNextBtn" type="cancel" @click="closeClick">取消</s-button>
      </template>
    </s-dialog>
    <!--修改-->
    <s-dialog
      v-model="editScriptDialog"
      v-if="editScriptDialog"
      width="700px"
      title="修改">
      <s-scrollbar wrap-class="default-dialog-scroll">
        <add-script :editData="editScriptData" ref="editForm" @doCheck="doCheck"></add-script>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveEdit">保存</s-button>
        <s-button type="cancel" @click="editScriptDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--脚本配置-->
    <s-dialog
      v-model="scriptDialog"
      v-if="scriptDialog"
      width="700px"
      title="脚本配置">
      <s-scrollbar wrap-class="default-dialog-scroll">
        <script-config :editData="editScriptSet" :scriptType="tableType" :pwdData="pwdData"
                       ref="editScriptSetForm"></script-config>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveScriptSet">保存</s-button>
        <s-button type="cancel" @click="scriptDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--账号关联-->
    <s-dialog
      v-model="accountDialog"
      v-if="accountDialog"
      width="700px"
      title="账号关联">
      <s-scrollbar wrap-class="default-dialog-scroll">
        <account-relation :editData="editAccountRel" :checkType="tableType" :uuid="editUuid"
                          ref="accountRel"></account-relation>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveAccountRel">保存</s-button>
        <s-button type="cancel" @click="accountDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--脚本测试-->
    <s-dialog
      v-model="checkDialog"
      v-if="checkDialog"
      width="1100px"
      title="脚本测试">
      <s-scrollbar wrap-class="default-dialog-scroll">
        <test-list :uuid="uuid" :checkType="tableType" @doCheck="doCheck" ref="checkComponent"></test-list>
      </s-scrollbar>
    </s-dialog>
    <!--改密脚本测试密码-->
    <s-dialog
      v-model="pwdDialog"
      v-if="pwdDialog"
      width="600px"
      title="测试">
      <s-scrollbar wrap-class="default-dialog-scroll">
        <s-form ref="testPassWordForm" :model="testPwdform" :rules="testPwdformRules" label-width="160px">
          <s-form-item label="新密码" prop="newPwd">
            <s-input type="password" v-model="testPwdform.newPwd"></s-input>
          </s-form-item>
          <s-form-item label="重复新密码" prop="newPwdRepeat">
            <s-input type="password" v-model="testPwdform.newPwdRepeat"></s-input>
          </s-form-item>
          <s-tag>测试成功后，密码将变为新密码，建议使用测试账号</s-tag>
        </s-form>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="testBtn" @click="changePassTest">确定</s-button>
        <s-button v-if="!testBtn" disabled style="width:100px">
          <div style="float: left">准备测试</div>
          <s-spin color="#30a6fd" type="clip" size="8px"></s-spin>
        </s-button>
        <s-button type="cancel" @click="pwdDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--导入-->
    <s-dialog
      v-model="importOrgDialog"
      v-if="importOrgDialog"
      title="脚本导入">
      <div class="importContainer">
        <slot></slot>
        <s-upload
          :action="actionUrl"
          ref="upload"
          :auto-upload="false"
          :on-error='uploadError'
          :with-credentials="true"
          :on-change="handleChange"
          :on-success="uploadSuccess">
          <s-button slot="trigger"><i class="iconfont icon-folder"> 浏览</i></s-button>
          <s-button @click="importScript"><i class="iconfont icon-cloud"> 点击上传</i></s-button>
        </s-upload>
        <s-row style="margin-top: 10px">
          <s-col :span="8">
            <div class="grid-content bg-purple">导入成功</div>
          </s-col>
          <s-col :span="16">
            <div class="grid-content bg-purple-light">{{successData.successNum || '--'}}</div>
          </s-col>
        </s-row>
        <s-row>
          <s-col :span="8">
            <div class="grid-content bg-purple">导入失败</div>
          </s-col>
          <s-col :span="16">
            <div class="grid-content bg-purple-light">
              {{successData.failNum || '--'}}
              <span>{{successData.licenseStatus ? `(${successData.licenseStatus})` : ''}}</span>
            </div>
          </s-col>
        </s-row>
        <s-row v-if="successData.fileName.length>0">
          <s-col :span="8">
            <div class="grid-content bg-purple">失败记录下载</div>
          </s-col>
          <s-col :span="16">
            <div class="grid-content bg-purple-light">
              <span>导入失败的记录下载</span>
              <span style="cursor: pointer;margin-left: 15px"><i @click="failFileDown()"
                                                                 class="iconfont icon-download"></i></span>
            </div>
          </s-col>
        </s-row>
      </div>
    </s-dialog>
  </section>
</template>

<script type="text/babel">

  import addDialog from './AddSelfDialog'
  import addScript from './AddScript'
  import scriptConfig from './ScriptConfig'
  import accountRelation from './AccountRelation'
  import testList from './TestList'
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  export default {
    data() {
      const validPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      }
      const validPassCom = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.testPwdform.newPwd) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      }
      return {
        importOrgDialog: false,
        editScriptDialog: false,
        editScriptData: {},
        addScriptDialog: false,
        scriptDialog: false,
        editScriptSet: {},
        editAccountRel: {},
        accountDialog: false,
        pwdDialog: false,
        checkDialog: false,
        testBtn: true,
        current: 0,
        uuid: '',
        actionUrl: '',
        editUuid: '',
        testPwdform: {
          newPwd: '',
          newPwdRepeat: ''
        },
        testPwdformRules: {
          newPwd: [{validator: validPass, trigger: 'blur'}],
          newPwdRepeat: [{validator: validPassCom, trigger: 'blur'}]
        },
        testRow: '',
        pwdData: false,
        fileList: [],
        successData: {
          failNum: '',
          successNum: '',
          fileName: [],
          licenseStatus: ''
        }
      }
    },
    props: {
      lists: [Array],
      tableType: {
        type: Number,
        default: 1
      }
    },
    computed: {
      isShowNextBtn() {
        let flag
        (this.current === 3) ? flag = false : flag = true
        return flag
      }
    },
    components: {

      addDialog,
      scriptConfig,
      accountRelation,
      testList,
      addScript
    },
    methods: {
      failFileDown() {
        Download(this.successData.fileName[0]);
      },
      changePassTest() {
        let vm = this
        vm.testBtn = false
        this.$refs['testPassWordForm'].validate((valid) => {
          if (!valid) {
            vm.testBtn = true
            return false;
          }
          $axios.post('operationSettings/changeScriptTestExe', {
            uuid: vm.testRow.uuid,
            newPasswd: vm.testPwdform.newPwd
          }).then((res) => {
            vm.testBtn = true
            vm.$message({
              message: '测试完成',
              type: 'success'
            });
            vm.pwdDialog = false
            vm.testPwdform = {
              newPwd: '',
              newPwdRepeat: ''
            }
          }).then(() => {
            let uuid = vm.$parent.scriptUuid || vm.uuid
            $axios.get(`/operationSettings/getScriptTestList/${uuid}`).then((res) => {
              if (vm.$refs['checkComponent'] !== undefined) {
                vm.$refs['checkComponent'].getAccountAssDevice();
              } else if (vm.$refs['addForm'] !== undefined) {
                vm.$refs['addForm'].getTestList()
              } else if (vm.$refs['editForm'] !== undefined) {
                vm.$refs['editForm'].getTestList()
              }
            })
          })
        })
      },
      doCheck(row) {
        this.testRow = row
        this.pwdDialog = true
      },
      uploadSuccess(res, file) {
        console.log(res)
        let operateContent
        (this.tableType === 1) ? operateContent = '运维' : (this.tableType === 2) ? operateContent = '改密' : operateContent = '检验'
        this.$message({
          type: 'success',
          message: `导入成功${res.successNum}条,导入失败${res.failNum}条`
        });
        $axios.log({
          data: [file],
          logTemplate: `导入|${operateContent}自定义脚本(${file.name})`,
          result: '成功'
        });
        this.successData.failNum = res.failNum
        this.successData.successNum = res.successNum
        this.successData.fileName = res.fileName || []
        this.successData.licenseStatus = res.licenseStatus || ''
        this.getData()
      },
      uploadError(err) {
        console.log(err)
      },
      handleDel(row) {
        let vm = this
        let obj = this.getOperationLog(row, 0)
        vm.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          $axios.get(`/operationSettings/deleteUserdefineScript/${row.uuid}`, obj).then((res) => {
            if (res.data === 'success') {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getData()
            }
          })
        }).catch(() => {
        });
      },
      handleCheck(row) {
        this.checkDialog = true
        this.uuid = row.uuid
      },
      handleAccount(row) {
        this.editUuid = row.uuid
        $axios.get(`/operationSettings/getAssociatedAccount/${row.uuid}`).then((res) => {
          this.accountDialog = true
          this.editAccountRel = res.data
          this.uuid = row.uuid
        });
      },
      handleScript(row) {
        this.tableType === 2 ? this.pwdData = true : this.pwdData = false
        $axios.get(`/operationSettings/editScriptCmd/${row.uuid}`).then((res) => {
          this.scriptDialog = true
          this.editScriptSet = res.data
          this.uuid = row.uuid
        });
      },
      handleEdit(row) {
        $axios.get(`/operationSettings/editScript/${row.uuid}`).then((res) => {
          this.editScriptDialog = true
          this.editScriptData = res.data
        });
      },
      saveEdit() {
        let url = this.getUrl()
        let form = this.$refs['editForm'].$refs['addScriptForm'];
        let editForm = this.$refs['editForm'].addAuthForm;
        let obj = this.getOperationLog(editForm, 1)
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post(url, editForm, obj).then((res) => {
            if (res.data.hasOwnProperty('modifySuccess')) {
              this.$message({
                message: res.data.modifySuccess,
                type: 'success'
              });
              this.editScriptDialog = false
              this.getData()
            } else {
              this.$message({
                message: '保存失败请检查',
                type: 'error'
              });
            }
          });
        });
      },
      saveScriptSet() {
        let login = this.$refs['editScriptSetForm'].loginAccount.loginName;
        let CmdList = this.$refs['editScriptSetForm'].cmdList;
        let form = {
          loginName: login,
          userdefineScriptCmdList: CmdList,
          scriptUuid: this.uuid
        }
        $axios.post('/operationSettings/batchSaveSetOperationScript', form).then((res) => {
          if (res.data.hasOwnProperty('success')) {
            this.$message({
              message: res.data.success,
              type: 'success'
            });
            this.scriptDialog = false
          } else if (res.data.hasOwnProperty('failure')) {
            this.$message({
              message: res.data.failure,
              type: 'error'
            });
          }
        });
      },
      saveAccountRel() {
        let formList = this.$refs['accountRel'].accountList
        for (let i of formList) {
          delete i.idx
          delete i.AccountInfo
        }
        let form = {
          userdefineScriptAccountList: formList,
          scriptUuid: this.uuid
        }
        $axios.post('/operationSettings/batchSaveAssociatedAccount', form).then((res) => {
          if (res.data.hasOwnProperty('success')) {
            this.$message({
              message: res.data.success,
              type: 'success'
            });
            this.accountDialog = false
            this.getData()
          } else if (res.data.hasOwnProperty('failure')) {
            this.$message({
              message: res.data.failure,
              type: 'error'
            });
          }
        });
      },
      getListActionsDef() {
        let self = this
        return {
          width: 12,
          actions: [{
            name: '添加',
            click() {
              self.addScriptDialog = true
              self.current = 0
            },
            icon: 'plus'
          }, {
            name: '脚本导入',
            click() {
              self.importOrgDialog = true
              self.fileList = []
            },
            icon: 'import'
          }, {
            name: '脚本导出',
            click() {
              self.exportScript()
            },
            icon: 'export'
          }]
        }
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 8,
          placeholder: '请输入查询条件',
          searchProps: ['scriptName', 'scriptProtocol'] // can be string or Array
        }
      },
      nextBtnHandler() {
        let clickFun = this.current
        switch (clickFun) {
          case 0:
            this.firstClick();
            break;
          case 1:
            this.secondClick();
            break;
          case 2:
            this.thirdClick();
            break;
        }
      },
      firstClick() {
        let url = this.getUrl()
        let form = this.$refs['addForm'].$refs['addScript'].$refs['addScriptForm'];
        let addForm = this.$refs['addForm'].$refs['addScript'].addAuthForm;
        let obj = this.getOperationLog(addForm, 2)
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post(url, addForm, obj).then((res) => {
            if (res.data.hasOwnProperty('saveSuccess')) {
              this.$message({
                message: res.data.saveSuccess,
                type: 'success'
              });
              this.current = this.current + 1
              this.uuid = res.data.scriptUuid
            } else if (res.data.hasOwnProperty('scriptNameExisted')) {
              this.$message({
                message: res.data.scriptNameExisted,
                type: 'error'
              });
            } else {
              this.$message({
                message: '保存失败请检查',
                type: 'error'
              });
            }
          });
        });
      },
      secondClick() {
        let login = this.$refs['addForm'].$refs['scriptConfig'].loginAccount.loginName;
        let CmdList = this.$refs['addForm'].$refs['scriptConfig'].cmdList;
        let form = {
          loginName: login,
          userdefineScriptCmdList: CmdList,
          scriptUuid: this.uuid
        }
        $axios.post('/operationSettings/batchSaveSetOperationScript', form).then((res) => {
          if (res.data.hasOwnProperty('success')) {
            this.$message({
              message: res.data.success,
              type: 'success'
            });
            this.current = this.current + 1
          } else if (res.data.hasOwnProperty('failure')) {
            this.$message({
              message: res.data.failure,
              type: 'error'
            });
          } else {
            this.$message({
              message: '保存失败请检查',
              type: 'error'
            });
          }
        });
      },
      thirdClick() {
        let formList = this.$refs['addForm'].$refs['accountRel'].accountList
        for (let i of formList) {
          delete i.idx
          delete i.AccountInfo
        }
        let form = {
          userdefineScriptAccountList: formList,
          scriptUuid: this.uuid
        }
        $axios.post('/operationSettings/batchSaveAssociatedAccount', form).then((res) => {
          if (res.data.hasOwnProperty('success')) {
            this.$message({
              message: res.data.success,
              type: 'success'
            });
            this.current = this.current + 1
          } else if (res.data.hasOwnProperty('failure')) {
            this.$message({
              message: res.data.failure,
              type: 'error'
            });
          } else {
            this.$message({
              message: '保存失败请检查',
              type: 'error'
            });
          }
        });
      },
      closeClick() {
        this.addScriptDialog = false;
        this.getData()
      },
      getUrl() {
        let url = '';
        switch (this.tableType) {
          case 1:
            url = '/operationSettings/saveOperationScript';
            break;
          case 2:
            url = '/operationSettings/saveChangeScript';
            break;
          case 3:
            url = '/operationSettings/saveCheckScript';
            break;
        }
        return url
      },
      getOperationLog(form, type) {
        let logObj;
        let operateType;
        type === 1 ? operateType = '编辑' : (type === 2) ? operateType = '添加' : operateType = '删除'
        switch (this.tableType) {
          case 1:
            logObj = {
              data: [{name: form.scriptName}],
              logTemplate: operateType + '|自定义脚本设置>运维自定义脚本(#name#)'
            };
            break;
          case 2:
            logObj = {
              data: [{name: form.scriptName}],
              logTemplate: operateType + '|自定义脚本设置>改密自定义脚本(#name#)'
            };
            break;
          case 3:
            logObj = {
              data: [{name: form.scriptName}],
              logTemplate: operateType + '|自定义脚本设置>检验自定义脚本(#name#)'
            };
            break;
        }
        return logObj
      },
      getData() {
        switch (this.tableType) {
          case 1:
            this.$emit('getData');
            break;
          case 2:
            this.$emit('getPass');
            break;
          case 3:
            this.$emit('getCheck');
            break;
        }
      },
      exportScript() {
        let type
        let operateContent
        if (this.lists.length === 0) {
          this.$message({
            type: 'info',
            message: '暂无可导出的信息'
          });
          return false;
        }
        (this.tableType === 1) ? type = 3 : (this.tableType === 2) ? type = 2 : type = 1;
        (this.tableType === 1) ? operateContent = '导出|自定义脚本设置>运维自定义脚本（operationScript.xls）' : (this.tableType === 2)
          ? operateContent = '导出|自定义脚本设置>改密自定义脚本（changeScript.xls）' : operateContent = '导出|自定义脚本设置>检验自定义脚本（checkScript.xls）'
        this.$confirm('是否导出脚本?', '脚本导出', {
          onfirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Download(`/operationSettings/exportScript/${type}`, {
            logTemplate: operateContent
          })
        }).catch(() => {
        });
      },
      importScript() {
        let type
        if (this.fileList.length > 1) {
          this.$message({
            type: 'warning',
            message: '请每次上传一个文件！'
          });
          return false
        }
        if (this.fileList.length === 0) {
          this.$message({
            type: 'error',
            message: '请至少上传一个文件'
          });
          return false
        }
        (this.tableType === 1) ? type = 3 : (this.tableType === 2) ? type = 2 : type = 1
        this.actionUrl = `${$axios.basePath()}/operationSettings/importScript/${type}`
        this.$nextTick(() => {
          this.$refs['upload'].submit()
        })
      },
      handleChange(file, fileList) {
        let fileTypes = ['xls', 'xlsx']
        let type = file.name.split('.').pop();
        let message = `请选择xls、xlsx类型的文件`;
        if (fileTypes.indexOf(type) === -1) {
          this.$message({
            type: 'error',
            message: message
          });
          fileList.pop();
        }
        this.fileList = fileList
      }
    },
    watch: {
      addScriptDialog(val) {
        if (val === false) {
          this.getData()
        }
      },
      pwdDialog(val) {
        if (val === false) {
          this.$refs['testPassWordForm'].resetFields()
        }
      }
    }
  }
</script>
<style lang="stylus">
</style>

