<template>
  <section id="workInfoDetailCtn" wrap-style="max-height: 450px;">
    <s-row>
      <s-col span="3" class="grid-content bg-purple">节点名称：</s-col>
      <s-col span="7" class="grid-content bg-purple-light">{{detailData.nodeName}}</s-col>
      <s-col span="3" class="grid-content bg-purple">工作信息：</s-col>
      <s-col span="11">
        <s-tooltip :content="detailData.logDetail">
          <div class="grid-content bg-purple-light overflowTxt" :title="detailData.workInfo">{{detailData.workInfo}}</div>
        </s-tooltip>
      </s-col>
    </s-row>
    <s-row>
      <s-col span="3" class="grid-content bg-purple">提交日期：</s-col>
      <s-col span="7" class="grid-content bg-purple-light">{{detailData.createTime}}</s-col>
      <s-col span="3" class="grid-content bg-purple">提交人：</s-col>
      <s-col span="11" class="grid-content bg-purple-light">{{detailData.userName}}</s-col>
    </s-row>
    <s-row v-if="detailData.workType === 3">
      <s-col span="10" class="grid-content bg-purple">审批意见：</s-col>
      <s-col span="14" class="grid-content bg-purple-light">{{detailData.approvalStatus === 1 ? '通过' : '拒绝'}}</s-col>
    </s-row>
    <s-row>
      <s-col span="3" class="grid-content bg-purple">文件：</s-col>
      <s-col span="21">
        <s-table :data="detailData.fileList">
          <s-table-column label="附件名称" prop="fileName"></s-table-column>
          <s-table-column label="大小(Byte)" prop="fileSize" width="150px"></s-table-column>
          <s-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <i class="iconfont icon-download" @click="downloadAttachment(scope.row)"></i>
              <i class="iconfont icon-delete" @click="deleteAttachment(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  // import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils';
  export default{
    data() {
      return {
        disableDel: true
      }
    },
    props: {
      detailData: {
        type: Object,
        required: true
      }
    },
    methods: {
      // 下载附件
      downloadAttachment(row) {
        Download(`/safetyPlatform/fileUpload/downloadOrderTaskFile/${row.fileUuid}/1`);
      },
      // 删除附件
      deleteAttachment(row) {
        // 置灰的同时阻止点击事件
        let parms = {
          type: '1',
          fileUuid: row.fileUuid,
          filePath: row.filePath
        }
        this.$emit('deleteAttachment', parms)
      }
    },
    created() {

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #workInfoDetailCtn
    .bg-purple, .bg-purple-light
      padding 0 5px 0
    .overflowTxt
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
</style>
