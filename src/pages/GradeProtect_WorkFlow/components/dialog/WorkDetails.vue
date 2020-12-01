<template>
    <div>
        <div style="font-weight:bold">工作信息</div>
        <div style="margin:10px 0">{{viewData.workInfo}}</div>
        <div>
          <s-row>
            <s-col span='8' style="opacity:0.65">提交人：{{viewData.userName}}</s-col>
            <s-col span='16' style="opacity:0.65">提交时间：{{viewData.createTime}}</s-col>
          </s-row>
        </div>
        <div style="font-weight:bold;margin-top:10px">附件</div>
        <s-table-page :data='tableData' style="margin-top:10px">
          <s-table-column type="selection" width="45">
          </s-table-column>
          <s-table-column prop="fileName" label="文件名称"></s-table-column>
          <s-table-column prop="fileSize" label="大小"></s-table-column>
          <s-table-column label="操作" width="150">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="eyes(scope.row)"> </i>
              <i class="iconfont icon-download" title="下载" @click="download(scope.row)"> </i>
            </template>
          </s-table-column>
        </s-table-page>
    </div>
</template>
<script>
// import $axios from 'sunflower-ajax'
import {Download} from 'sunflower-common-utils';
export default {
    data() {
        return {
            tableData: [
            ],
            workDialog: false
        }
    },
    created() {
        this.tableData = this.viewData.fileList
    },
    props: {
        orderUuid: String,
        curNodeUuid: String,
        viewData: Object
    },
    methods: {
        eyes() {
            this.workDialog = true
        },
        download(row) {
            Download(`/safetyPlatform/fileUpload/downloadOrderTaskFile/${row.fileUuid}/1`);
        }
    }
}
</script>
