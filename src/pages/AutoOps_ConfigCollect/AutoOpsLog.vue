<template>
  <section style="margin-top: 20px" id="autoops-log">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="脚本审计" name="pane1" v-if="judgeRoleBtn('logCenter_autoOperScript') || judgeRoleBtn('autoOperationCenter_logScriptAudit')">
        <s-form :model="criteria.condition" label-width="100px" :inline="true" class="search_form" style="margin-bottom: 15px;">
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
      </s-tab-pane>
      <s-tab-pane label="文件分发" name="pane2" v-if="judgeRoleBtn('logCenter_autoOperFileDistribution') || judgeRoleBtn('autoOperationCenter_logFileDistribution')">
        <section v-if="activeTab === 'pane2'">
          <s-form :model="criteria1.condition" label-width="100px" :inline="true" class="search_form" style="margin-bottom: 15px;">
            <div>
              <s-form-item label="文件名称：">
                <s-input v-model="criteria1.condition.fileName"></s-input>
              </s-form-item>
              <s-form-item label="主机名称：">
                <s-input v-model="criteria1.condition.assetName"></s-input>
              </s-form-item>
              <s-form-item label="主机IP：">
                <s-input v-model="criteria1.condition.assetIp"></s-input>
              </s-form-item>
              <s-form-item label="目标路径：">
                <s-input v-model="criteria1.condition.destPath"></s-input>
              </s-form-item>
              <s-form-item label="执行结果：">
                <s-input v-model="criteria1.condition.result"></s-input>
              </s-form-item>
              <s-form-item label="执行人：">
                <s-input v-model="criteria1.condition.excuteUserName"></s-input>
              </s-form-item>
              <s-form-item label="开始时间：" prop="beginTimeStr">
                <s-date-picker
                  v-model="criteria1.condition.startTime"
                  type="datetime"
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择开始时间">
                </s-date-picker>
              </s-form-item>
              <s-form-item label="~" prop="endTimeStr" label-width="20px">
                <s-date-picker
                  v-model="criteria1.condition.endTime"
                  type="datetime"
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择结束时间">
                </s-date-picker>
              </s-form-item>
            </div>
            <div class="search_btn">
              <s-button icon="magnifier" @click="getSearchActionDef1">查询</s-button>
            </div>
          </s-form>
          <s-table :data='fileList'>
            <s-table-column
              prop="fileName"
              label="文件名称">
            </s-table-column>
            <s-table-column
              prop="fileSize"
              label="文件大小"
              :formatter="formatterFileSize">
            </s-table-column>
            <s-table-column
              prop="assetName"
              label="主机名称">
            </s-table-column>
            <s-table-column
              prop="assetIp"
              label="主机IP">
            </s-table-column>
            <s-table-column
              prop="destPath"
              label="目标路径">
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
              label="执行结果">
              <template slot-scope="scope">
                <span v-html="scope.row.result.replace(/<\/br>/, '')"></span>
              </template>
            </s-table-column>
            <s-table-column
              prop="excuteUserName"
              label="执行人">
            </s-table-column>
            <s-table-column label="操作" width="80">
              <template slot-scope="scope">
                <i class="iconfont icon-eye" @click="viewFile(scope.row.uuid)" title="查看"></i>
              </template>
            </s-table-column>
          </s-table>
          <s-row class="pageRow">
            <s-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="criteria1.currentPage"
              :page-size="criteria1.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="criteria1.totalCount">
            </s-pagination>
          </s-row>
        </section>
      </s-tab-pane>
    </s-tab>
    <!--脚本历史-->
    <s-dialog
      v-model="historyLogDialog"
      v-if="historyLogDialog"
      title="脚本执行历史记录"
      width="800px">
      <script-history :historyDetail="historyDetail"></script-history>
    </s-dialog>
    <!--文件-->
    <s-dialog
      v-model="fileLogDialog"
      v-if="fileLogDialog"
      title="查看详情"
      width="800px">
      <share-execute :historyDetail="fileDetail"></share-execute>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import ScriptHistory from './components/LogItem.vue'
  import ShareExecute from './components/LogFileItem.vue'
  import { cloneDeep } from 'lodash'
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
        criteria1: {                 // 真分页分页数据
          condition: {
            startTime: null,
            endTime: null,
            assetName: '',
            assetIp: '',
            excuteStatus: null,
            fileName: '',
            destPath: '',
            result: '',
            excuteUserName: ''
          },
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        tabNameArrLog: ['logCenter_autoOperScript', 'logCenter_autoOperFileDistribution'], // 页签名字的集合(顺序和页签一致)
        tabNameArrAuto: ['autoOperationCenter_logScriptAudit', 'autoOperationCenter_logFileDistribution'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1',
        scriptList: [],
        fileList: [],
        historyLogDialog: false,
        fileLogDialog: false,
        historyDetail: '',
        fileDetail: '',
        allScriptLib: [],
        currentScript: [],
        ajaxData: []
      }
    },
    components: {
      // SearchBox,
      ScriptHistory,
      ShareExecute
    },
    created() {
      if (this.$route.params.type === '0') { // 自动化运维
        this.activeTab = this.tabIndexName(this.tabNameArrAuto) // 返回第一个为true页签的index
      } else {
        this.activeTab = this.tabIndexName(this.tabNameArrLog) // 返回第一个为true页签的index
      }
      this.axiosList(this.criteria)
      this.axiosfileList(this.criteria1)
      this.getallScriptLib()
    },
    methods: {
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
      formatterFileSize(item) {
        return (item.fileSize / 1024).toFixed(2) + 'KB'
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
      handleSizeChange1(curPageSize) {
        this.criteria1.currentPage = 1;
        this.criteria1.pageSize = curPageSize;
        this.createNewSearchForm(this.criteria1, 2)
      },
      handleCurrentChange1(current) {
        if (current === this.criteria1.currentPage) return;
        this.criteria1.currentPage = current;
        this.createNewSearchForm(this.criteria1, 2)
      },
      getSearchActionDef1() {
        this.criteria1.currentPage = 1
        this.createNewSearchForm(this.criteria1, 2)
      },
      viewFile(uuid) {
        $axios.get(`/automateLog/getFileShareTaskLogInfoByUuid/${uuid}`).then((res) => {
          if (res.data) {
            this.fileDetail = res.data
            this.fileLogDialog = true
          }
        })
      },
      axiosfileList(form) {
        form.condition.excuteStatus = parseInt(form.condition.excuteStatus)
        $axios.post('/automateLog/searchFileShareTaskLogList', form).then(res => {
          if (res.status === 200) {
            this.fileList = res.data.pageList
            this.criteria1.pageSize = res.data.pageSize
            this.criteria1.totalCount = res.data.totalCount
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
<style lang="stylus" rel="stylesheet/stylus">
  #autoops-log
    .s-search-group .s-form .s-form-item
      margin 5px!important
</style>
