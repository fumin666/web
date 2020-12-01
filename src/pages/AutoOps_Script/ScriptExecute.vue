<template>
  <section id="scriptExecute" class="scriptExecute autoOps_script">
    <s-scrollbar wrap-class="scroll-height-500px">
      <div class="exeDetail">
        <s-table-page
          :header-search="searchDef()"
          v-loading="flag"
          element-loading-text="正在执行脚本..."
          :init-page-size="5"
          :page-sizes="[5, 10, 15, 20]"
          :data="hostList"
          style="width: 100%">
          <s-table-column label="主机名称" width="200">
            <template slot-scope="scope">
              <s-row>
                <s-col :span="5" style="padding-top: 5px">
                  <i class="iconfont icon-cabinet" style="cursor: initial;"></i>
                </s-col>
                <s-col :span="19">
                  <div>{{scope.row.assetName}}</div>
                  <div class="subContent">{{scope.row.assetIp}}</div>
                </s-col>
              </s-row>
            </template>
          </s-table-column>
          <s-table-column label="脚本名称" prop="scriptName" width="240"></s-table-column>
          <s-table-column label="执行状态" prop="excuteStatus" :filter-method="filterTag" :filters="filters" width="110">
            <template slot-scope="scope">
              <div class="rowScriptStatus" :class="bgColorShow(scope.row.excuteStatus)">
                <span v-if="scope.row.excuteStatus === 1">成功</span>
                <span v-else>失败</span>
              </div>
              <!--<div class="subContent" v-if="scope.row.result.assetAccount">账户：{{scope.row.result.assetAccount}}</div>-->
            </template>
          </s-table-column>
          <s-table-column label="执行结果">
            <template slot-scope="scope">
              <span v-if="scope.row.excuteResult && scope.row.excuteResult.length >= 45">
                {{scope.row.excuteResult.replace('<\/br>', ' ').slice(0,45)}}
                <span class="cellClick" @click="resultMoreHandle(scope.row)">......</span>
              </span>
              <span v-else-if="!scope.row.excuteResult && scope.row.excuteStatus"> -- </span>
              <span v-else>
                <span v-if="scope.row.excuteResult">
                  {{scope.row.excuteResult.replace('<\/br>', ' ')}}
                </span>
              </span>
            </template>
          </s-table-column>
          <s-table-column label="操作" width="85">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看脚本内容" @click="scan(scope.row.scriptContent)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </div>
    </s-scrollbar>
    <s-dialog
      v-model="resultDialog"
      v-if="resultDialog"
      title="执行结果"
      append-to-body
      width="650px">
      <span style="word-wrap: break-word" v-html="resultMore"></span>
    </s-dialog>
    <s-dialog
      v-model="contentDialog"
      v-if="contentDialog"
      title="脚本内容"
      append-to-body
      width="750px">
      <codemirror v-model="code" :options="cmOptions"></codemirror>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  // import Bus from '@/plugins/eventBus';

  import { codemirror } from 'vue-codemirror-lite'
  import 'codemirror/lib/codemirror.css'
  // language
  import 'codemirror/mode/python/python.js'
  // theme css
  import 'codemirror/theme/blackboard.css'
  import 'codemirror/theme/elegant.css'
  // require active-line.js
  import 'codemirror/addon/selection/active-line.js'
  // import {cloneDeep} from 'lodash'

  export default{
    data() {
      return {
        criteria: {
          params: {
            condition: {
            },
            currentPage: 1,
            pageSize: 10,
            totalCount: 0
          }
        },
        assetsSearchKey: '',
        hostList: this.multipleSelectionHost,
        activeName: '',
        code: '',
        cmOptions: {
          tabSize: 2,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          lineWrapping: true,
          mode: 'text/x-python',
          theme: '',
          scrollbarStyle: null
        },
        resultMore: '',
        resultDialog: false,
        contentDialog: false,
        filters: [
          {text: '失败', value: 0},
          {text: '成功', value: 1}
        ],
        excuteStatus: [0, 1]
      }
    },
    props: ['executeResult', 'multipleSelectionHost', 'showDialog', 'flag'],
    components: {
      codemirror
      // Bus
    },
    methods: {
      searchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入关键字',
          searchProps: ['assetName', 'assetIp', 'scriptName', 'excuteResult']
        }
      },
      // 脚本内容弹框
      scan(content) {
        this.code = content
        this.contentDialog = true
      },
      filterTag(value, row) {
        return row.excuteStatus === value
      },
      // 结果展示弹框
      resultMoreHandle(row) {
        this.resultDialog = true
        this.resultMore = row.excuteResult
      },
      // 更改背景颜色
      bgColorShow(state) {
        let colorClass = ''
        switch (Number(state)) {
          case 1: colorClass = 'greenbg'; break;
          case 0: colorClass = 'redbg'; break;
        }
        return colorClass
      },
      getShowList() {
        let params = {
          searchKey: this.assetsSearchKey,
          excuteStatusList: this.excuteStatus,
          immediateTaskInfoUuid: this.executeResult.scriptUuid
        }
        this.criteria.params.condition = Object.assign({}, params)
        $axios.post(`/immediateExcuteTask/showImmediateExcuteScriptTaskResult`, this.criteria.params).then((res) => {
          if (res.data) {
            this.hostList = res.data.pageList
          }
        })
      }
    },
    watch: {
      'multipleSelectionHost': {
        immediate: true,
        handler(val) {
          this.hostList = val
        }
      }
    },
    mounted() {
      this.getShowList()
    },
    created() {
      let mainTheme = localStorage.getItem('theme') || 'fanta'
      if (mainTheme === 'dark') {
        this.cmOptions.theme = 'blackboard'
      } else {
        this.cmOptions.theme = 'elegant'
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .scriptExecute
    .scroll-height-500px
      max-height: 600px
    .exeDetail
      .s-table-header, .s-table-body
        width 100% !important
</style>
