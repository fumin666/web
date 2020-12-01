<template>
  <section style="margin-top: 20px">
    <s-tab tab-position="left" v-model="activeTab">
      <s-tab-pane label="端口设置">
        <s-col span="16" offset="4">
          <!-- <s-form :model="Port" :rules="portRule" label-width="240px" ref="portForm">
            <s-form-item label="SSH端口" prop="autoOperSshPort">
                <s-input v-model="Port.autoOperSshPort"></s-input>
            </s-form-item>
            <s-form-item label="Windows端口" prop="autoOperWindowsPort">
              <s-input v-model="Port.autoOperWindowsPort"></s-input>
            </s-form-item>
            <s-form-item label="SSH用户名" prop="autoOperSshUser">
              <s-input :disabled="currentUserName !== null" v-model="Port.autoOperSshUser"></s-input>
            </s-form-item>
            <s-form-item label="SSH密码" prop="autoOperSshPass">
              <s-input :disabled="currentPassWord !== null" type="password" v-model="Port.autoOperSshPass"></s-input>
            </s-form-item>
            <s-form-item>
              <s-button @click="savePort">保存</s-button>
              <s-button @click="editPort">修改</s-button>
            </s-form-item>
          </s-form> -->
          <community></community>
        </s-col>
      </s-tab-pane>
      <s-tab-pane label="会话设置">
        <s-col span="16" offset="4">
          <s-form ref="conversationForm" :model="conversation" :rules="cRules" label-width="240px">
            <s-form-item :label="conversation.configName" prop="configValue">
                <s-input placeholder="请输入秒数" v-model="conversation.configValue">
                  <template slot="append">秒</template>
                </s-input>
            </s-form-item>
            <s-form-item>
              <s-button @click="saveConversation">保存</s-button>
            </s-form-item>
          </s-form>
        </s-col>
      </s-tab-pane>
      <s-tab-pane label="服务器脚本">
        <s-col span="16" offset="4">
          <s-table :show-header="false" :data="serverScriptList">
            <s-table-column>
              <template slot-scope="scope">
                {{scope.row.name}}脚本
              </template>
            </s-table-column>
            <s-table-column
              prop="fileName">
            </s-table-column>
            <s-table-column label="操作" width="160px">
              <template slot-scope="scope">
                <i class="iconfont icon-edit" @click="editHandler(scope.row.type)" title="编辑脚本"></i>
                <i class="iconfont icon-update" @click="uploadHandler(scope.row.type)" title="上传脚本"></i>
              </template>
            </s-table-column>
          </s-table>
        </s-col>
      </s-tab-pane>
    </s-tab>
    <!--上传-->
    <s-dialog
      v-model="uploadDialog"
      v-if="uploadDialog"
      width="500px"
      title="上传服务器脚本">
      <s-row type="flex" justify="center">
        <s-upload
          ref="upload"
          drag
          :auto-upload="false"
          :on-success="uploadSuccess"
          :on-change="handleChange"
          :action="uploadUrl">
          <i class="iconfont icon-cloud"></i>
          <div class="s-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </s-upload>
      </s-row>
      <template slot="footer">
        <s-button @click="uploadSave">上传</s-button>
      </template>
    </s-dialog>
    <!--查看脚本-->
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      width="700px"
      title="编辑脚本">
      <codemirror v-model="code" :options="cmOption"></codemirror>
      <template slot="footer">
        <s-button @click="editScriptContent">保存</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="700px"
      title="修改密码">
      <s-form ref="userInfoForm" :model="userInfo" :rules="portRule" label-width="240px">
        <s-form-item label="SSH用户名" prop="autoOperSshUser">
          <s-input v-model="userInfo.autoOperSshUser"></s-input>
        </s-form-item>
        <s-form-item label="SSH密码" prop="autoOperSshPass">
          <s-input type="password" v-model="userInfo.autoOperSshPass"></s-input>
        </s-form-item>
      </s-form>
      <template slot="footer">
        <s-button @click="ajaxPortWithPasswordChange">保存</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import community from './components/CommunityConfig'
  import { codemirror } from 'vue-codemirror-lite'
  import 'codemirror/lib/codemirror.css'
  // language
  import 'codemirror/mode/python/python.js'
  // theme css
  import 'codemirror/theme/blackboard.css'
  import 'codemirror/theme/elegant.css'
  // require active-line.js
  import 'codemirror/addon/selection/active-line.js'
  // 校验正整数
  let checkInt = (rule, value, callback) => {
    let reg = /^[1-9]\d*$/
    if (value && !reg.test(value)) {
      callback(new Error('请输入正整数值'))
    } else {
      callback()
    }
  }
  export default {
    data() {
      return {
        activeTab: 0,
        code: '',
        cmOption: {
          tabSize: 2,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          lineWrapping: true,
          mode: 'text/x-python',
          theme: '',
          scrollbarStyle: null
        },
        serverScriptList: [],
        portJson: [],
        Port: {
          autoOperSshPort: '',
          autoOperWindowsPort: '',
          autoOperSshUser: '',
          autoOperSshPass: ''
        },
        userInfo: {
          autoOperSshPort: '',
          autoOperWindowsPort: '',
          autoOperSshUser: '',
          autoOperSshPass: ''
        },
        userRule: {
          autoOperSshUser: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          autoOperSshPass: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        portRule: {
          autoOperSshPort: [
            {validator: checkInt, trigger: 'blur'},
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          autoOperWindowsPort: [
            {validator: checkInt, trigger: 'blur'},
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          autoOperSshUser: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          autoOperSshPass: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        conversation: {
          configName: '',
          configValue: ''
        },
        cRules: {
          configValue: [
            {validator: checkInt, trigger: 'blur'},
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        viewDialog: false,
        uploadDialog: false,
        editDialog: false,
        uploadUrl: '',
        currentPassWord: '',
        currentUserName: '',
        scriptJson: ''
      }
    },
    components: {
      community,
      codemirror
    },
    created() {
      let mainTheme = localStorage.getItem('theme') || 'fanta'
      if (mainTheme === 'dark') {
        this.cmOption.theme = 'blackboard'
      } else {
        this.cmOption.theme = 'elegant'
      }
      this.getInitData()
      this.createServerScriptList()
    },
    methods: {
      editPort() {
        this.editDialog = true
      },
      getInitData() {
        $axios.get('/systemmanager/sysConfig/getAutoopsessionTimeout').then(({data}) => {
          this.conversation.configName = data.configName
          this.conversation.configValue = data.configValue
        })
        $axios.get('/systemmanager/sysConfig/getPortAutoOper').then(({data}) => {
          this.portJson = data
          for (let i of data) {
            this.Port[i.configName] = i.configValue
            this.userInfo[i.configName] = i.configValue
          }
          this.userInfo.autoOperSshUser = ''
          this.userInfo.autoOperSshPass = ''
          this.currentPassWord = this.Port.autoOperSshPass
          this.currentUserName = this.Port.autoOperSshUser
        })
      },
      saveConversation() {
        this.$refs['conversationForm'].validate(valid => {
          if (!valid) return;
          $axios.post(`/systemmanager/sysConfig/updateAutoopsessionTimeout/${this.conversation.configValue}`, {
            data: [],
            logTemplate: '配置|采集配置>会话设置'
          }).then(({data}) => {
            if (data) {
              this.$message({type: 'success', message: '保存成功!'});
            } else {
              this.$message({type: 'error', message: '保存失败!'});
            }
          })
        })
      },
      savePort() {
        let form = []
        for (let i = 0; i < this.portJson.length; i++) {
          form.push({
            configName: this.portJson[i].configName,
            configValue: this.Port[this.portJson[i].configName],
            uuid: this.portJson[i].uuid
          })
        }
        this.$refs['portForm'].validate(valid => {
          if (!valid) return;
          if (this.currentPassWord === null) {
            $axios.post('/systemmanager/sysConfig/savePortAutoOperPwd', form).then(({data}) => {
              if (data) {
                this.$message({type: 'success', message: '保存成功!'});
                this.getInitData()
              } else {
                this.$message({type: 'error', message: '保存失败!'});
              }
            })
          } else {
            this.ajaxPort(form)
          }
        })
      },
      ajaxPort(form) {
        $axios.post('/systemmanager/sysConfig/savePortAutoOper', form).then(({data}) => {
          if (data) {
            this.$message({type: 'success', message: '保存成功!'});
            this.getInitData()
          } else {
            this.$message({type: 'error', message: '保存失败!'});
          }
        })
      },
      ajaxPortWithPasswordChange() {
        let form = []
        for (let i = 0; i < this.portJson.length; i++) {
          form.push({
            configName: this.portJson[i].configName,
            configValue: this.userInfo[this.portJson[i].configName],
            uuid: this.portJson[i].uuid
          })
        }
        this.$refs['userInfoForm'].validate(valid => {
          if (!valid) return;
          $axios.post('/systemmanager/sysConfig/savePortAutoOperPwd', form).then(({data}) => {
            if (data) {
              this.$message({type: 'success', message: '保存成功!'});
              this.getInitData()
              this.editDialog = false
            } else {
              this.$message({type: 'error', message: '保存失败!'});
            }
          })
        })
      },
      createServerScriptList() {
        let name = ['Linux', 'Windows', 'Solaris', 'AIX']
        let fileName = ['Configuration_Item_linux.sh', 'Configuration_Item_windows.ps1', 'Configuration_Item_Solaris.sh', 'Configuration_Item_AIX.sh']
        for (let i = 0; i < name.length; i++) {
          this.serverScriptList.push({
            name: name[i],
            fileName: fileName[i],
            type: i + 1
          })
        }
      },
      uploadHandler(type) {
         this.uploadUrl = `${$axios.basePath()}cicollectTaskinfo/uploadScriptCollect/${type}`
         this.uploadDialog = true
      },
      uploadSuccess(res) {
          if (res) {
            this.$message.success('上传成功')
            this.uploadDialog = false
          } else {
            this.$message.error('文件格式有误，上传失败')
          }
      },
      handleChange(file, fileList) {
          if (fileList.length > 1) {
            this.$message({message: '每次只能上传一个脚本', type: 'error'});
            fileList = fileList.pop();
          }
      },
      uploadSave() {
        if (this.$refs['upload'].uploadFiles.length === 0) {
          this.$message.error('请选择文件')
        } else {
          this.$refs['upload'].submit()
        }
      },
      editHandler(type) {
        $axios.get(`/cicollectTaskinfo/getScriptCollect/${type}`).then(({data}) => {
          this.viewDialog = true
          this.code = data.content
          this.scriptJson = data
        })
      },
      editScriptContent() {
        if (this.scriptJson.content === undefined) {
          this.$message.error('请先上传脚本，才可进行编辑')
          return false
        }
        this.scriptJson.content = this.code
        $axios.post('/cicollectTaskinfo/updateScriptCollect', this.scriptJson, {
          logTemplate: '编辑|采集配置>服务器脚本'
        }).then(({data}) => {
          if (data) {
            this.$message({type: 'success', message: '保存成功!'});
            this.viewDialog = false
          } else {
            this.$message({type: 'error', message: '保存失败!'});
          }
        })
      }
    }
  }
</script>
