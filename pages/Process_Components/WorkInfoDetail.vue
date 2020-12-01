<template>
  <section id="workInfoDetailCtn" wrap-style="max-height: 450px;">
    <s-row>
      <s-col span="3" class="grid-content bg-purple">类型：</s-col>
      <s-col span="7" class="grid-content bg-purple-light">{{detailData.logTypeStr}}</s-col>
      <s-col span="3" class="grid-content bg-purple">工作信息：</s-col>
      <s-col span="11">
        <s-tooltip :content="detailData.logDetail">
          <div class="grid-content bg-purple-light overflowTxt">{{detailData.logDetail}}</div>
        </s-tooltip>
      </s-col>
    </s-row>
    <s-row>
      <s-col span="3" class="grid-content bg-purple">提交日期：</s-col>
      <s-col span="7" class="grid-content bg-purple-light">{{detailData.createTime}}</s-col>
      <s-col span="3" class="grid-content bg-purple">提交人：</s-col>
      <s-col span="11" class="grid-content bg-purple-light">{{detailData.createUserName}}</s-col>
    </s-row>
    <s-row>
      <s-col span="3" class="grid-content bg-purple">文件：</s-col>
      <s-col span="21">
        <s-table :data="detailData.attachmentList">
          <s-table-column label="附件名称" prop="attacthmentName"></s-table-column>
          <s-table-column label="大小(Byte)" prop="attacthmentSize" width="150px"></s-table-column>
          <s-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <i class="iconfont icon-download" @click="downloadAttachment(scope.row)"></i>
              <i class="iconfont icon-delete" @click="deleteAttachment(scope.row)" :class="{ disabledIcon: disableDel }"></i>
            </template>
          </s-table-column>
        </s-table>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  export default{
    data() {
      return {
        currentUserUuid: this.$store.getters.userData.uuid,
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
        // Download(`${$axios.basePath()}${row.absolutePath}`)
        Download(`/ItilCommonWorkflow/downloadItilOrderFile/${row.uuid}`)
      },
      // 删除附件
      deleteAttachment(row) {
        // 置灰的同时阻止点击事件
        if (this.disableDel) {
          event.stopPropagation()
        } else {
          $axios.get(`/ItilCommonWorkflow/deleteItilOrderLogAttachment/${this.detailData.uuid}/${row.uuid}`)
          this.detailData.attachmentList = this.detailData.attachmentList.filter((item) => item.uuid !== row.uuid)
        }
      }
    },
    created() {
      if (this.detailData.createUser !== this.currentUserUuid) {
        this.disableDel = true;
      } else {
        this.disableDel = false;
      }
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
