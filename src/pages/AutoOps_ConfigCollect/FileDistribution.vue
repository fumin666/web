<template>
  <section style="margin: 20px 0 20px 5px;">
    <s-form :model="criteria1.condition" label-width="90px" :inline="true" class="search_form" style="margin: 10px 0;">
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
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="exportFile('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="exportFile('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="exportFile('pdf')">PDF报表</s-button>
    </s-row>
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

<script>
  import $axios from 'sunflower-ajax';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  // import ScriptHistory from './components/LogItem.vue'
  import ShareExecute from './components/LogFileItem.vue'
  import { cloneDeep } from 'lodash'
  import {Download} from 'sunflower-common-utils'
  export default {
    data() {
      return {
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
        scriptList: [],
        fileList: [],
        fileLogDialog: false,
        fileDetail: ''
      }
    },
    components: {
      // SearchBox,
      // ScriptHistory,
      ShareExecute
    },
    created() {
      this.axiosfileList(this.criteria1)
    },
    methods: {
      exportFile(exportType) {
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
        $axios.post('/automateLog/exportFileShareTaskLog', param).then(res => {
          if (res.data === true) {
            Download(`/automateLog/downloadFileShareTaskLog/${exportType}`)
          }
        })
      },
      formatterFileSize(item) {
        return (item.fileSize / 1024).toFixed(2) + 'KB'
      },
      axiosList(form) {
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

<style scoped>
</style>
