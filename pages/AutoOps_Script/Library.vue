<template>
  <section class="scriptLibrary">
    <s-row :gutter="10">
      <s-col :span="9" style="padding:0 12px;">
        <s-card class="box-card" id="box-card">
          <div slot="header" class="clearfix">
            <s-col :span="20">脚本</s-col>
            <s-col :span="4" style="cursor:pointer; font-weight: 400; color: #199fed">
              <div @click="exportScriptDialog">
                <i class="iconfont icon-export"></i>
                导出
              </div>
            </s-col>
          </div>
          <s-row style="margin: 10px 0 10px 0">
            <s-col :span="8">
              <s-button icon="plus" @click="bloomCreateScript = true">新建</s-button>
            </s-col>
            <s-col :span="16" style="text-align: right;">
              <s-input placeholder="请输入脚本名称，脚本类型，提交人" icon="magnifier" v-model="searchValue"></s-input>
            </s-col>
          </s-row>
          <scriptCard :scriptCardList="scriptCardList" :uuid="uuid" @showCode="showCode" @changeCode="changeCode"></scriptCard>
        </s-card>
      </s-col>
      <s-col :span="15" style="padding-left:12px;">
        <s-card class="box-card" id="box-card">
          <div slot="header" class="clearfix">
            <span class="card-title">
              脚本预览
            </span>
            <!--<span style="float: right">-->
              <!--<s-button icon="arrow-left" title="返回列表" @click="goBack()"></s-button>-->
            <!--</span>-->
          </div>
          <div class="codemirror">
            <!-- codemirror -->
            <codemirror v-model="code" :options="cmOption" ref="codemirror"></codemirror>
          </div>
        </s-card>
      </s-col>
    </s-row>
    <s-dialog
      v-model="batchScriptExeDialog"
      v-if="batchScriptExeDialog"
      title="脚本编辑-脚本执行"
      width="900px" append-to-body>
      <batch-script-execute :currentItem="currentItem" @ExcuteScripDialog="ExcuteScripDialog"></batch-script-execute>
    </s-dialog>
    <s-dialog
      v-model="scriptExeDialog"
      v-if="scriptExeDialog"
      title="脚本执行"
      width="850px">
      <script-execute ref="scriptexecute" :executeResult="executeResult" :flag="flag" :multipleSelectionHost="multipleSelectionHost"></script-execute>
    </s-dialog>
    <s-dialog
      v-model="bloomCreateScript"
      v-if="bloomCreateScript"
      title="创建脚本"
      key="bloomCreateScript">
      <create-script ref="createscript" :uuid="uuid"></create-script>
      <template slot="footer">
        <s-button @click="bloomCreateScriptOk">确定</s-button>
        <s-button @click="bloomCreateScript = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="bloomEditScript"
      v-if="bloomEditScript"
      title="编辑"
      width="900px"
      key="bloomEditScript">
      <edit-script ref="editDialog" :code="code" :options="cmOption1"></edit-script>
      <template slot="footer">
        <s-button @click="saveScriptContent" :disabled="saveBtnDis">保存</s-button>
        <s-button @click="batchScriptExe">执行脚本</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="exportFlag"
      v-if="exportFlag"
      title="导出脚本"
      key="exportFlag"
      width="760px"
    >
      <export-script @export="exportData"></export-script>
      <template slot="footer">
        <s-button @click="exportScript">导出</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus';
  import batchScriptExecute from './BatchScriptExecute.vue';
  import CreateScript from './CreateScript.vue';
  import EditScript from './EditScript.vue';
  import ExportScript from './ExportScript.vue';
  import ScriptExecute from './ScriptExecute';
  import scriptCard from './ScriptCard.vue'
  import { codemirror } from 'vue-codemirror-lite'
  import 'codemirror/lib/codemirror.css'
  // language
  import 'codemirror/mode/python/python.js'
  // theme css
  import 'codemirror/theme/blackboard.css'
  import 'codemirror/theme/elegant.css'
  // require active-line.js
  import 'codemirror/addon/selection/active-line.js'
  import {Download} from 'sunflower-common-utils'
  export default {
    components: {
      batchScriptExecute,
      CreateScript,
      EditScript,
      ExportScript,
      ScriptExecute,
      scriptCard,
      codemirror
      // Download,
      // Bus
    },
    data () {
      const code = ''
      return {
        currentUserUuid: this.$store.getters.userData.uuid,
        saveBtnDis: false,
        code,
        cmOption: {
          tabSize: 2,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          lineWrapping: true,
          mode: 'text/x-python',
          theme: '',
          scrollbarStyle: null,
          readOnly: 'nocursor'
        },
        cmOption1: {
          tabSize: 2,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          lineWrapping: true,
          mode: 'text/x-python',
          theme: '',
          scrollbarStyle: null,
          readOnly: false
        },
        batchScriptExeDialog: false,
        bloomCreateScript: false,
        bloomEditScript: false,
        exportFlag: false,
        scriptExeDialog: false,
        scriptCardList: [],
        scriptCardListSearch: [],
        searchValue: '',
        scriptData: {},
        autoMateTaskInfo: [],
        flag: false,
        timer: [], // 用于清除定时器
        currentItem: '', // 当前选中的脚本
        executeResult: {}, // 批量脚本执行结果
        multipleSelectionHost: [] // 已选主机列表
      }
    },
    mounted() {
      let mainTheme = localStorage.getItem('theme') || 'fanta'
      this.getTheme(mainTheme)
      this.initDivHeight();
      window.addEventListener('resize', this.initDivHeight);
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    methods: {
      // 导出脚本
      exportScriptDialog() {
        this.exportFlag = true
      },
      exportData(data) {
        this.scriptData = data
      },
      exportScript() {
        let param = [] // 导出弹框选择的脚本uuid数组
        for (let i in this.scriptData) {
          param.push(this.scriptData[i].uuid)
        }
        if (param.length > 0) {
          $axios.post('/scriptConsole/createScriptFile', param).then((res) => {
            if (res.data) {
              Download(`/scriptConsole/downLoadScriptFile/${res.data}`);
            }
          })
        } else {
          this.$message({message: '请至少选择一个脚本!', type: 'error'});
        }
    },
      initDivHeight () {
      },
      goto(path) {
        this.$router.push(path)
      },
      goBack() {
        this.$router.push('/AutoOpsCenter/script/scriptControl')
      },
      createScript(_data) {
        if (_data.scriptLibUuid) {
          let obj = this.leftMenu.find(item => {
            return item.uuid === _data.scriptLibUuid
          })
          obj = Object.assign({}, obj, _data)
          $axios.post('/scriptConsole/saveScript', _data, {
            data: [obj],
            logTemplate: '添加|脚本(#name#/#scriptName#)'
          }).then((res) => {
            if (res.data.state) {
              this.$message({message: '创建成功', type: 'success'});
              this.bloomCreateScript = false
              Bus.$emit('updateLeftMenu', this.uuid)
              this.updateData()
            } else {
              this.$message({message: res.data.errormsg, type: 'error'});
            }
          })
        } else {
          this.$message({message: '请先选择脚本库！', type: 'error'});
        }
      },
      bloomCreateScriptOk() {
        this.$refs['createscript'].$refs['scriptForm'].validate((valid) => {
          let _data = this.$refs['createscript'].scriptForm;
          if (valid) {
            // 若是脚本则为他所在的脚本库创建脚本
            $axios.get(`/scriptConsole/getScriptByUuid/${this.uuid}`).then((res) => {
              if (res.data) {
                _data.scriptLibUuid = res.data.scriptLibUuid
              }
            }).then(() => {
              this.createScript(_data)
            })
          } else {
            return false;
          }
        })
      },
      isSaveBtnDis(item) {
        // 创建者不是当前用户则不能操作
        if (item.createUser !== this.currentUserUuid) {
          this.saveBtnDis = true
        } else {
          this.saveBtnDis = false
        }
      },
      showCode(item) {
        this.currentItem = item
        this.code = item.content
      },
      changeCode(item) {
        this.currentItem = item
        this.bloomEditScript = true
        this.code = item.content
        this.isSaveBtnDis(item) // 权限不足不能将编辑结果保存
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 19,
          placeholder: '脚本名称',
          searchProps: []
        }
      },
      // 根据这个参数判断是否是父元素节点从而更新数据
      updateData() {
        let params = this.uuid ? this.uuid : null
        this.currentItem = null
        $axios.get(`/scriptConsole/getScriptByLibUuid/${params}`).then((res) => {
          if (res.data instanceof Array) {
            this.scriptCardList = res.data
            this.scriptCardListSearch = res.data // 保存一份数据用于过滤
            this.code = ''
          }
        })
      },
      // 搜索
      searchScript() {
        if (this.searchValue !== '') {
          this.scriptCardList = this.scriptCardListSearch.filter((item) => {
            return item.scriptName.indexOf(this.searchValue) > -1
          })
        } else {
          this.scriptCardList = this.scriptCardListSearch
        }
      },
      // 保存更改内容
      saveScriptContent() {
        if (this.currentItem) {
          let {uuid} = this.currentItem
          this.currentItem.content = this.$refs.editDialog.codes // 不要再次刷新脚本
          $axios.post(`/scriptConsole/updateScriptContent`, {uuid, content: this.$refs.editDialog.codes}, {
            data: [this.currentItem],
            logTemplate: '编辑|脚本(#scriptLibName#/#scriptName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: '修改成功', type: 'success'});
              this.updateData()
            } else {
              this.$message({message: res.data.errormsg, type: 'error'});
            }
          })
        } else {
          this.$message({message: '请先选择一个脚本！', type: 'warning'});
        }
      },
      // 批量脚本执行
      batchScriptExe() {
        if (this.currentItem) {
          this.batchScriptExeDialog = true
        } else {
          this.$message({message: '请先选择一个脚本！', type: 'warning'});
        }
      },
      // 执行结果弹窗
      ExcuteScripDialog(params, multipleSelection) {
        this.executeResult = params
        this.multipleSelectionHost = multipleSelection
        $axios.post(`/immediateExcuteTask/startImmediateExcuteScriptTask`, this.executeResult).then((res) => {
          if (res.data && res.data.status === true && res.data.autoMateTaskInfo instanceof Array) {
            this.batchScriptExeDialog = false
            this.scriptExeDialog = true
            this.autoMateTaskInfo = res.data.autoMateTaskInfo
            this.getAutoScriptTask()
          } else {
            this.$message({message: res.data.errorMsg, type: 'error'})
          }
        })
      },
      // 获取自动化脚本任务信息
      getAutoScriptTask() {
        let taskUuid = ''
        let operateUuid = ''
        let assetUuidList = []
        this.autoMateTaskInfo.map(item => {
          taskUuid = item.taskUuid
          operateUuid = item.operateUuid
          assetUuidList.push(item.assetUuid)
        })
        let params = {
          excutionUuid: taskUuid,
          operateUuid: operateUuid,
          assetList: assetUuidList
        }
        $axios.post('/immediateExcuteTask/getExcuteScriptTaskResultList', params).then((res) => {
          this.multipleSelectionHost.forEach(item => {
            // 刷新表格数据
            res.data.forEach(i => {
              if (item.uuid === i.assetUuid) {
                item['excuteResult'] = i.result
                item['assetName'] = i.assetName
                item['assetIp'] = i.assetIp
                item['scriptName'] = i.scriptName
                item['excuteStatus'] = i.excuteStatus
                item['scriptContent'] = i.scriptContent
              }
            })
          })
          this.multipleSelectionHost = this.multipleSelectionHost.concat([]);
          this.flag = true
          if (res.data.length === this.multipleSelectionHost.length) {
            this.flag = false
            // Bus.$emit('changeHistory', res.data) // 将执行结果直接返回给主页timeline，不用再次调用获取timeline的接口
          } else {
            let timer = setTimeout(() => {
              // 如无返回值，每隔5秒再次调用接口
              this.getAutoScriptTask()
            }, 5000);
            this.timer.push(timer);
          }
        })
      },
      getTheme(val) {
        let vm = this
        this.$nextTick(() => {
          if (val === 'dark') {
            vm.cmOption.theme = 'blackboard'
            vm.cmOption1.theme = 'blackboard'
          } else {
            vm.cmOption.theme = 'elegant'
            vm.cmOption1.theme = 'elegant'
          }
        })
      }
    },
    created() {
      this.updateData()
      Bus.$on('updateScriptCard', () => {
        this.updateData()
        this.code = ''
      })
    },
    beforeDestroy() {
      if (this.timer) { // 如果定时器还在运行 或者直接关闭，不用判断
        this.timer.forEach((item) => {
          clearTimeout(item); // 关闭
        })
      }
    },
    props: ['uuid', 'leftMenu'],
    watch: {
      uuid: {
        immediate: true,
        handler: function(val) {
          this.updateData()
        }
      },
      '$store.state.theme': {
        immediate: true,
        handler: function(val) {
          this.getTheme(val)
        }
      },
      // 搜索
      searchValue: {
        deep: true,
        handler: function () {
          this.searchScript()
        }
      }
    }
  }
</script>
<style>
  .scriptLibrary .CodeMirror {
    height: calc(100vh - 260px);
    margin: 10px 0;
  }
  .codemirror {
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    margin-top: 10px;
  }
  .scriptLibrary .scroll-height-500px {
    max-height: 500px
  }
  .scriptLibrary #box-card .s-card-header {
    border: none;
  }
</style>
