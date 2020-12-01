<template>
  <div id="autoops-checktask">
    <s-tab type="card" style="margin: 10px 20px 10px;">
      <s-tab-pane label="主机列表">
        <s-row style="font-weight: 600">
          <span>任务名称：</span> <span>{{ currentRow.taskName }}</span>
          <span style="margin-left: 250px;">最新执行时间：</span> <span>{{ currentRow.previousFireTime }}</span>
        </s-row>
        <s-scrollbar wrap-class="logWrapHeight">
          <s-table-page :data="assetsList" >
            <s-table-column label="主机名" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="cellClick" @click="axiosHistoryData(scope.row)" style="color: rgb(25, 159, 237);cursor: pointer">{{scope.row.itcompname}}</span>
              </template>
            </s-table-column>
            <s-table-column label="IP地址" prop="controladderss"></s-table-column>
            <s-table-column label="操作系统" prop="productname" show-overflow-tooltip>
              <!--<template slot-scope="scope">-->
                <!--<span v-if="scope.row.automatetype === '1'">Linux</span>-->
                <!--<span v-else-if="scope.row.automatetype === '2'">Windows</span>-->
                <!--<span v-else-if="scope.row.automatetype === '3'">Solaris</span>-->
                <!--<span v-else-if="scope.row.automatetype === '4'">Aix</span>-->
                <!--<span v-else-if="scope.row.automatetype === '5'">Cisco</span>-->
                <!--<span v-else="scope.row.automatetype === '5'">Huawei</span>-->
              <!--</template>-->
            </s-table-column>
            <s-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <i class="iconfont icon-eye" title="查看" @click="safetyScoreSee(scope.row)"></i>
              </template>
            </s-table-column>
          </s-table-page>
        </s-scrollbar>
      </s-tab-pane>
    </s-tab>
    <s-tab type="card" style="margin: 10px 20px 10px;">
      <s-tab-pane label="脚本列表">
        <s-row style="font-weight: 600">
          <span>主机IP地址：</span> <span>{{ controladderss }}</span>
        </s-row>
        <s-scrollbar wrap-class="logWrapHeight">
          <s-table-page :data="historyData" >
            <s-table-column label="执行时间" prop="startTime" show-overflow-tooltip></s-table-column>
            <s-table-column label="脚本名称" prop="scriptName"></s-table-column>
            <s-table-column label="执行参数" prop="scriptParam"></s-table-column>
            <s-table-column label="执行结果" prop="result">
              <template slot-scope="scope">
                <span v-if="scope.row.result && scope.row.result.length >= 10">
                      {{scope.row.result.slice(0,10).replace('<\/br>', ' ')}}
                      <span class="cellClick" @click="resultMoreHandle(scope.row)">......</span>
                    </span>
                <span v-else-if="scope.row.excuteStatus"> -- </span>
                <span v-else>
                  {{scope.row.result.replace('<\/br>', ' ')}}
                </span>
              </template>
            </s-table-column>
            <s-table-column label="执行状态">
              <template slot-scope="scope">
                <span v-html="scope.row.excuteStatus === 1? '成功' : '失败'"></span>
              </template>
            </s-table-column>
            <s-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <i class="iconfont icon-eye" title="查看" @click="rowSee(scope.row)"></i>
              </template>
            </s-table-column>
          </s-table-page>
        </s-scrollbar>
      </s-tab-pane>
    </s-tab>
    <s-dialog
      v-model="scriptHistoryDialog"
      v-if="scriptHistoryDialog"
      title="脚本执行历史记录"
      append-to-body
      width="800px">
      <script-exe-history :historyDetail="historyDetail" @closeDialog="scriptHistoryDialog = false"></script-exe-history>
    </s-dialog>
    <s-dialog
      v-model="resultDialog"
      v-if="resultDialog"
      title="执行结果"
      append-to-body
      width="650px">
      <span style="word-wrap: break-word" v-html="resultMore"></span>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import ScriptExeHistory from '../AutoOps_HostList/ScriptExeHistory';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  // import DateRange from '@/components/tableCom/src/DateRange';

  export default {
    data() {
      return {
        assetsList: [],
        historyData: [],
        inspectName: '',
        excuteTime: '',
        controladderss: '',
        scriptHistoryDialog: false,
        historyDetail: '',
        resultDialog: false
      }
    },
    props: ['currentRow'],
    created() {
      this.getAssetsList()
    },
    methods: {
      // 结果展示弹框
      resultMoreHandle(row) {
        this.resultDialog = true
        this.resultMore = row.result
      },
      getAssetsList() {
        $axios.get(`/autoScriptTask/getAutoScriptTaskRelAssetByTaskUuid/${this.currentRow.uuid}`).then(res => {
          this.assetsList = res.data;
        })
      },
      axiosHistoryData(row) {
        this.controladderss = row.controladderss;
        $axios.get(`/autoScriptTask/getAutoScriptTaskLogByAssetAndTaskUuid/${row.uuid}/${this.currentRow.uuid}`).then(res => {
          this.historyData = res.data;
        })
      },
      rowSee(row) {
        this.historyDetail = row
        this.scriptHistoryDialog = true
      },
      goto(path, item) {
        this.$router.push({
          path: '/AssetsAll/' + path,
          query: {name: item}
        })
      },
      safetyScoreSee(row) {
        this.$router.push({
          path: '/AutoOpsCenter/hostList/hostDetail',
          query: {uuid: row.uuid}
        })
      }
    },
    components: {
      // SearchBox,
      // DateRange,
      ScriptExeHistory
    }
  }
</script>
<style>
  #autoops-checktask .logWrapHeight {
    max-height: 250px
  }
</style>
