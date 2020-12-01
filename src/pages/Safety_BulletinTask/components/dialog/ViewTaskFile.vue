<!--
 * @Author: songyf
 * @Date: 2020-1-19
 * @LastEditors: songyf
 * @Description: 安全通报-安全通报任务-查看附件
 -->
<template>
  <s-dialog v-model="dialogFlag" title="查看附件" width="780px" append-to-body class="">
    <s-scrollbar wrap-class="default-dialog-scroll">
      <s-button icon="download" @click="bathDownload" style="margin-bottom: 10px">批量下载</s-button>
      <s-table-page :data="workflowFileList"
                    @selection-change="selectionChange">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column prop="fileName" label="名称" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="createTime" label="上传日期" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.createTime | filterTime}}
          </template>
        </s-table-column>
        <s-table-column prop="fileSize" label="大小" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.fileSize}} M
          </template>
        </s-table-column>
        <s-table-column
          label="下载">
          <template slot-scope="scope">
            <i @click="downloadFile(scope.row)" class="iconfont icon-download"></i>
          </template>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
  </s-dialog>
</template>

<script>
  import { parseNumAllTime, Download } from 'sunflower-common-utils'
  export default {
    components: {
    },
    data() {
      return {
        dialogFlag: false,
        selections: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      workflowFileList: {
        type: Array,
        default: []
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    created() {
    },
    filters: {
      filterTime(val) {
        return parseNumAllTime(val)
      }
    },
    methods: {
      selectionChange(val) {
        this.selections = val
      },
      bathDownload() { // 批量批量删除
        if (this.selections.length) {
          this.selections.forEach(v => {
            this.downloadFile(v)
          })
        } else {
          this.$message({
            message: '请至少选择一条数据！',
            type: 'warning'
          });
        }
      },
      downloadFile(row) {
        Download(`/safetyPlatform/fileUpload/downloadOrderTaskFile/${row.uuid}/1`, {
          logTemplate: '下载|查看任务执行结果>附件(' + row.fileName + ')'
        })
      }
    }
  }
</script>
<style>
</style>

