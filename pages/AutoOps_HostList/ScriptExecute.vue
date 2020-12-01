<template>
  <section id="scriptExecute">
    <s-scrollbar wrap-style="max-height: 600px;">
      <s-row>
        <s-form
          ref="scriptForm"
          :inline="true"
          :model="scriptForm"
          :rules="scriptFormRules">
          <s-row>
            <s-form-item label="脚本库" prop="scriptLibUuid">
              <input-tree v-model="scriptForm.scriptLibUuid" :data="scriptLibraryList" :props="myProps" @select-change="changeScriptLibUuid" style="width: 130px;" name="uuid"></input-tree>
            </s-form-item>
            <s-form-item label="脚本名称" prop="scriptUuid">
              <s-select v-model="scriptForm.scriptUuid" style="width: 200px;">
                <s-option
                  style="width: 260px;"
                  v-for="i in scriptList"
                  :label="i.scriptName"
                  :value="i.uuid"
                  :key="i.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="超时时间" prop="timeOut">
              <s-input v-model="scriptForm.timeOut" placeholder="秒，请输入正整数" style="width: 120px;"></s-input>
            </s-form-item>
          </s-row>
          <s-row>
            <s-col :span="21">
              <s-form-item label="脚本参数" prop="scriptParam" class="scriptParamsInput">
                <s-input v-model="scriptForm.scriptParam" placeholder="请输入"></s-input>
              </s-form-item>
            </s-col>
            <s-col :span="3" class="executeScriptBtn">
              <s-button @click="executeScript">执行脚本</s-button>
            </s-col>
          </s-row>
        </s-form>
      </s-row>

      <div class="exeDetail">
        <s-tab v-model="activeName">
          <s-tab-pane label="执行结果" name="result">
            <s-table-page
              v-loading="loading"
              element-loading-text="正在执行脚本..."
              :init-page-size="5"
              :page-sizes="[5, 10, 15, 20]"
              :data="hostList"
              style="width: 100%">
              <s-table-column label="主机名称" width="250">
                <template slot-scope="scope">
                  <s-row>
                    <s-col :span="4">
                    <span class="icon-host-ctn">
                      <i class="iconfont icon-host"></i>
                    </span>
                    </s-col>
                    <s-col :span="20">
                      <div style="padding: 5px 0;">
                        <div class="cellItem">{{scope.row.itcompname}}</div>
                        <div class="cellItem cellItemTip">{{scope.row.controladderss}}</div>
                      </div>
                    </s-col>
                  </s-row>
                </template>
              </s-table-column>
              <s-table-column label="执行状态" width="110">
                <template slot-scope="scope">
                <span class="rowScriptStatus"
                      :style="{background: calScriptStatus(scope.row.excuteStatus).color}">
                  {{calScriptStatus(scope.row.excuteStatus).text}}
                </span>
                </template>
              </s-table-column>
              <s-table-column label="执行结果">
                <template slot-scope="scope">
                  <div
                    class="moreResultTxt"
                    v-text="scope.row.result && scope.row.result.replace(/<\/br>/g, '')">
                  </div>
                  <div
                    class="moreResult"
                    v-if="!scope.row.result && scope.row.excuteStatus"> -- </div>
                  <div
                    class="moreResult"
                    v-if="scope.row.result && scope.row.result.length > 35"
                    @click="moreResult(scope.row.result)">更多...</div>
                </template>
              </s-table-column>
            </s-table-page>
          </s-tab-pane>
          <s-tab-pane label="脚本内容" name="content">
            <div id="scriptContentCtn">
              <div class="scriptContent" v-nodata="!scriptCode">
                <!--<pre>{{scriptCode}}</pre>-->
                <codemirror v-model="scriptCode" :options="cmOptions"></codemirror>
              </div>
            </div>
          </s-tab-pane>
        </s-tab>
      </div>
    </s-scrollbar>

    <s-dialog
      v-model="moreResultDialog"
      v-if="moreResultDialog"
      title="执行结果"
      append-to-body>
      <span style="word-wrap: break-word" v-html="moreResultContent"></span>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import mixins from './MethodsMixin';
  import { cloneDeep } from 'lodash';
  import { codemirror } from 'vue-codemirror-lite';
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/mode/python/python.js';    // language
  import 'codemirror/theme/blackboard.css';     // theme css
  import 'codemirror/theme/elegant.css';
  import 'codemirror/addon/selection/active-line.js';   // require active-line.js
  import InputTree from '@/components/inputTree/InputTree'

  // 校验正整数
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

  export default{
    data() {
      return {
        scriptLibraryList: [],      // 脚本库下拉选项
        scriptList: [],             // 脚本库中所有脚本下拉选择
        hostList: [],               // 执行脚本的主机列表
        hostListOrigin: [],         // 执行脚本的主机列表
        timerList: [],              // 定时5s循环计时器列表
        moreResultDialog: false,    // 执行结果"更多"详情弹框
        moreResultContent: '',      // 执行结果"更多"详情内容
        myProps: {
          children: 'childrenList',
          label: 'name',
          value: 'uuid'
        },
        loading: false,
        // 脚本执行表单
        scriptForm: {
          scriptLibUuid: '',
          scriptUuid: '',
          timeOut: '',
          scriptParam: '',
          assetUuidList: []
        },
        // 脚本执行表单验证规则
        scriptFormRules: {
          scriptLibUuid: [{required: true, message: '不能为空', blur: 'trigger'}],
          scriptUuid: [{required: true, message: '不能为空', blur: 'trigger'}],
          timeOut: [{
            required: true, message: '不能为空', blur: 'trigger'}, {
            validator: checkInt, trigger: 'blur'
          }]
        },
        activeName: 'result',
        // ***脚本内容相关数据***
        scriptCode: '',      // 脚本代码内容
        scriptCodeCache: '', // 脚本内容缓存，等到切换到'脚本内容'tab时，再赋值给scriptCode，防止bug
        // 组件参数
        cmOptions: {
          theme: '',
          mode: 'text/x-python',
          tabSize: 2,
          readOnly: true,
          line: true,
          lineNumbers: false,
          lineWrapping: true,
          styleActiveLine: true,
          scrollbarStyle: null
        },
        autoMateTaskInfo: []
      }
    },
    mixins: [mixins],
    props: {
      type: {
        type: String,
        required: true
      },
      exeingHostsData: {
        type: Array,
        required: true
      }
    },
    components: {
      codemirror,
      InputTree
    },
    watch: {
      'scriptForm.scriptUuid'(newVal) {
        // 脚本选择为空值时重新画脚本内容为''
        if (!newVal) {
          this.scriptCodeCache = '';
          if (this.activeName === 'content') this.scriptCode = '';
          return
        }

        // "脚本名称"改变->获取脚本具体内容
        $axios.get(`/scriptConsole/getScriptByUuid/${newVal}`).then(({data}) => {
          if (data && data.hasOwnProperty('uuid')) {
            this.scriptCodeCache = data.content;
            if (this.activeName === 'content') this.scriptCode = data.content;
          }
        })
      },
      // tab标签切换到"脚本内容"时，将缓存的脚本内容赋值显示
      activeName(newVal) {
        if (newVal === 'content') {
          this.scriptCode = this.scriptCodeCache;
        }
      }
    },
    methods: {
      // 获取所有脚本库下拉选项
      getAllScriptLibrary() {
        $axios.get('/scriptConsole/scriptLibTreeNode').then((res) => {
          if (res.data) {
            this.scriptLibraryList = res.data;
          } else {
            return false
          }
        })
      },
      // 脚本库选择变化 -> 获取脚本库下的脚本
      changeScriptLibUuid(val) {
        $axios.get(`/scriptConsole/getScriptByLibUuid/${val.uuid}`).then((res) => {
          this.scriptForm.scriptUuid = ''
          if (res.data instanceof Array) {
            this.scriptList = res.data
            if (this.scriptList.length > 0) {
              // this.scriptForm.scriptUuid = this.scriptList[0].uuid
            }
          } else {
            return false
          }
        })
      },
      // 执行脚本1-上传表单参数
      executeScript() {
        this.$refs.scriptForm.validate(valid => {
          if (valid) {
            // 获取主机uuids
            this.loading = true
            this.scriptForm.assetUuidList = this.hostList.map(i => {
              i.excuteStatus = 2;  // 解决执行过脚本之后未关闭弹框，再次重新执行一个脚本时，初始化表格"执行状态"列为'执行中'
              return i.uuid;
            });
            this.hostList = this.hostList.concat([]);
            let saveData = cloneDeep(this.scriptForm)
            saveData.timeOut = parseInt(saveData.timeOut);
            $axios.post('/immediateExcuteTask/startImmediateExcuteScriptTask', saveData).then(({data}) => {
              if (data && data.status && data.autoMateTaskInfo instanceof Array) {
                this.autoMateTaskInfo = data.autoMateTaskInfo
                this.getScriptExeResult()
              } else {
                this.$message.error('执行失败，请刷新重试！');
                this.hostList.forEach(i => {
                  i.excuteStatus = 0;  // 第一个接口返回失败，刷新表格"执行状态"列为'失败'
                });
                this.hostList = this.hostList.concat([]);
                this.loading = false
              }
            })
          } else {
            return false;
          }
        })
      },
      // 执行脚本2-循环调用返回值
      getScriptExeResult() {
        let taskUuid = ''
        let operateUuid = ''
        this.autoMateTaskInfo.map(item => {
          taskUuid = item.taskUuid
          operateUuid = item.operateUuid
        })
        let param = {
          excutionUuid: taskUuid,
          operateUuid: operateUuid,
          assetList: this.scriptForm.assetUuidList
        }
        $axios.post('/immediateExcuteTask/getExcuteScriptTaskResultList', param)
        .then(({data}) => {
          // 刷新主机详情页面数据
          this.$emit('freshScriptHistory');
          this.loading = true
          // 刷新表格数据
          this.hostList.forEach(item => {
            data.forEach(i => {
              if (item.uuid === i.assetUuid) {
                item.excuteStatus = i.excuteStatus;     // 脚本执行状态
                item.result = i.result;
              }
            })
          });
          this.hostList = this.hostList.concat([]);
          if (data.length === this.hostList.length) {
            this.loading = false
          } else {
            let timer = setTimeout(() => {
              // 如无返回值，每隔5秒再次调用接口
              this.getScriptExeResult()
            }, 5000);
            this.timerList.push(timer);
          }
        })
      },
      moreResult(result) {
        this.moreResultContent = result;
        this.moreResultDialog = true;
      }
    },
    created() {
      // 判断主题，更换code-mirrie组件样式
      let mainTheme = localStorage.getItem('theme') || 'fanta';
      this.cmOptions.theme = mainTheme === 'dark' ? 'blackboard' : 'elegant';

      this.hostList = this.exeingHostsData.concat([]);    // 初始化显示弹框下方主机列表

      // 弹框下方主机列表原始数据，根据脚本过滤可执行主机时，需要保留最原始数据。
      this.hostListOrigin = this.exeingHostsData.concat([]);

      // 获取脚本库下拉选项
      this.getAllScriptLibrary();
    },
    destroyed() {
      // 销毁定时5s循环计时器
      this.timerList.forEach(timer => {
        clearTimeout(timer)
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #scriptExecute
    .scriptParamsInput
      width 100%
      .s-form-item-content
        width 86%
    .executeScriptBtn
      text-align right
      padding 2px 13px 0 0
    .exeDetail
      .s-table-header, .s-table-body
        width 100% !important
      .icon-host-ctn
        display inline-block
        padding-top 18px
        .icon-Host
          font-size 32px
      .cellItem
        margin-top 3px
      .rowScriptStatus
        display inline-block
        width 54px
        height 22px
        line-height 22px
        border-radius 3px
        font-size 14px
        color #fff
        text-align center
      .moreResultTxt
        float left
        width 88%
        overflow hidden
      div.moreResult
        cursor pointer
        float right
        &:hover
          text-decoration underline
      #scriptContentCtn
        padding-right 2px
        .scriptContent
          min-height 200px
</style>
