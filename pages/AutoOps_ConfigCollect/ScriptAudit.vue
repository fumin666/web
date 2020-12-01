<template>
  <div style="margin: 20px 0 20px 5px">
    <s-form :model="criteria.condition" label-width="90px" :inline="true" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="脚本库：" prop="scriptLibName">
          <s-select v-model="criteria.condition.scriptLibName" clearable @change="changeSriptHandler">
            <s-option v-for="(item, index) in allScriptLib" :value="item.name" :label="item.name"
                      :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="脚本名称：" prop="scriptName">
          <s-select v-model="criteria.condition.scriptName" clearable>
            <s-option v-for="(item, index) in currentScript" :value="item.scriptName" :label="item.scriptName"
                      :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="主机名称：">
          <s-input v-model="criteria.condition.assetName"></s-input>
        </s-form-item>
        <s-form-item label="IP地址：">
          <s-input v-model="criteria.condition.assetIp"></s-input>
        </s-form-item>
        <s-form-item label="执行状态：">
          <s-select v-model="criteria.condition.excuteStatus" clearable>
            <s-option label="执行失败" value="0"></s-option>
            <s-option label="执行成功" value="1"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="执行人：">
          <s-input v-model="criteria.condition.excuteUserName"></s-input>
        </s-form-item>
        <s-form-item label="开始时间：" prop="beginTimeStr">
          <s-date-picker
            v-model="criteria.condition.startTime"
            type="datetime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="~" prop="endTimeStr" label-width="20px">
          <s-date-picker
            v-model="criteria.condition.endTime"
            type="datetime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束时间">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" @click="getSearchActionDef">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="exportScript('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="exportScript('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="exportScript('pdf')">PDF报表</s-button>
    </s-row>
    <s-table :data='scriptList'>
      <s-table-column
        prop="scriptLibName"
        label="脚本库">
      </s-table-column>
      <s-table-column
        prop="scriptName"
        label="脚本名称">
      </s-table-column>
      <s-table-column
        prop="assetName"
        label="主机名称">
      </s-table-column>
      <s-table-column
        prop="assetIp"
        label="IP地址">
      </s-table-column>
      <s-table-column
        label="执行状态">
        <template slot-scope="scope">
          <span v-if="scope.row.excuteStatus === 0">执行失败</span>
          <span v-if="scope.row.excuteStatus === 1">执行成功</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="scriptParam"
        label="脚本参数">
      </s-table-column>
      <s-table-column
        prop="startTime"
        label="开始时间">
      </s-table-column>
      <s-table-column
        prop="endTime"
        label="结束时间">
      </s-table-column>
      <s-table-column
        prop="result"
        label="执行结果">
        <template slot-scope="scope">
          <span v-text="scope.row.result !==null ? scope.row.result.replace(/<\/br>/g, ' ') : ' -- '"></span>
        </template>
      </s-table-column>
      <s-table-column
        prop="excuteUserName"
        label="执行人">
      </s-table-column>
      <s-table-column label="操作" width="80">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="viewScriptHistory(scope.row.uuid)"></i>
        </template>
      </s-table-column>
    </s-table>
    <s-row class="pageRow">
      <s-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="criteria.currentPage"
        :page-size="criteria.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="criteria.totalCount">
      </s-pagination>
    </s-row>
    <!--脚本历史-->
    <s-dialog
      v-model="historyLogDialog"
      v-if="historyLogDialog"
      title="脚本执行历史记录"
      width="800px">
      <script-history :historyDetail="historyDetail"></script-history>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import ScriptHistory from './components/LogItem.vue'
  // import ShareExecute from './components/LogFileItem.vue'
  import { cloneDeep } from 'lodash'
  import {Download} from 'sunflower-common-utils'
  export default {
    data() {
      return {
        criteria: {                 // 真分页分页数据
          condition: {
            startTime: null,
            endTime: null,
            assetName: '',
            assetIp: '',
            excuteStatus: null,
            scriptLibName: '',
            scriptName: '',
            result: '',
            excuteUserName: ''
          },
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        scriptList: [],
        historyLogDialog: false,
        historyDetail: '',
        allScriptLib: [],
        currentScript: [],
        ajaxData: []
      }
    },
    components: {
      // SearchBox,
      ScriptHistory
      // ShareExecute
    },
    created() {
      this.axiosList(this.criteria)
      this.getallScriptLib()
    },
    methods: {
      exportScript(exportType) {
        let startTime = parseInt(new Date(this.startTime).getTime() / 1000)
        let endTime = parseInt(new Date(this.endTime).getTime() / 1000)
        let param = {
          exportType: exportType,
          assetName: '',
          assetIp: '',
          scriptLibName: '',
          scriptName: '',
          result: '',
          startTime: startTime,
          endTime: endTime
        }
        $axios.post('/automateLog/exportScriptTaskLog', param).then(res => {
          if (res.data) {
            Download(`/automateLog/downloadScriptTaskLog/${exportType}`)
          }
        })
      },
      getallScriptLib() {
        $axios.get('/autoMateCount/getAllScriptByScriptLib').then((res) => {
          if (res.data) {
            this.ajaxData = res.data
            let obj = Object.values(res.data)
            this.allScriptLib = obj.filter(item => item.length > 0).map(item => ({name: item[0].scriptLibName}))
          }
        })
      },
      changeSriptHandler(val) {
        this.currentScript = this.ajaxData[val]
      },
      handleSizeChange(curPageSize) {
        this.criteria.currentPage = 1;
        this.criteria.pageSize = curPageSize;
        this.createNewSearchForm(this.criteria, 1)
      },
      handleCurrentChange(current) {
        if (current === this.criteria.currentPage) return;
        this.criteria.currentPage = current;
        this.createNewSearchForm(this.criteria, 1)
      },
      getSearchActionDef() {
        this.criteria.currentPage = 1
        this.createNewSearchForm(this.criteria, 1)
      },
      viewScriptHistory(uuid) {
        $axios.get(`/automateLog/getScriptTaskLogInfoByUuid/${uuid}`).then((res) => {
          if (res.data) {
            this.historyDetail = res.data
            this.historyLogDialog = true
          }
        })
      },
      axiosList(form) {
        form.condition.excuteStatus = parseInt(form.condition.excuteStatus)
        $axios.post('/automateLog/searchScriptTaskLogList', form).then(res => {
          if (res.status === 200) {
            this.scriptList = res.data.pageList
            this.criteria.pageSize = res.data.pageSize
            this.criteria.totalCount = res.data.totalCount
          } else {
            this.$message.error('获取数据失败');
          }
        });
      },
      createNewSearchForm(obj, flag) {
        let start = null
        let end = null
        let form = cloneDeep(obj)
        if (obj.condition.startTime !== null) {
          start = Date.parse(obj.condition.startTime) / 1000
          form.condition.startTime = start
        }
        if (obj.condition.endTime !== null) {
          end = Date.parse(obj.condition.endTime) / 1000
          form.condition.endTime = end
        }
        if (end - start < 0) {
          this.$message({
            message: '结束时间必须大于开始时间',
            type: 'error'
          });
          return false
        } else {
          flag === 1 ? this.axiosList(form) : this.axiosfileList(form)
        }
      }
    }
  }
</script>

<style scoped>
</style>
