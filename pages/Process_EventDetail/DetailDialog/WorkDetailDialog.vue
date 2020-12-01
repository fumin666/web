<template>
  <s-dialog v-model="dialogFlag" title="工作信息详情" width="600px" class="">
    <s-scrollbar wrap-style="height: 400;">
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">类型：</div>
        </s-col>
        <s-col :span="18">
          <div class="grid-content bg-purple-light">{{workInfo.logTypeStr}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">工作信息：</div>
        </s-col>
        <s-col :span="18">
          <s-tooltip :content="workInfo.logDetail">
            <div style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap; " class="grid-content bg-purple-light">{{workInfo.logDetail}}</div>
          </s-tooltip>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">提交日期：</div>
        </s-col>
        <s-col :span="18">
          <div class="grid-content bg-purple-light">{{workInfo.createTime}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">提交人：</div>
        </s-col>
        <s-col :span="18">
          <div class="grid-content bg-purple-light">{{workInfo.createUserName}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">文件：</div>
        </s-col>
        <s-col :span="18">
          <s-table :data="workInfo.attachmentList" style="width: 100%;">
            <s-table-column prop="attacthmentName" label="附件名称" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="attacthmentSize" label="大小（Byte）">
            </s-table-column>
            <s-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <i class="iconfont icon-download" title="下载" @click="downFile(scope.row)"></i>
                <i class="iconfont icon-delete" title="删除" :class="{ disabledIcon: scope.row.disableDel }" @click="deleteAttachment(scope.row)" ></i>
              </template>
            </s-table-column>
          </s-table>
        </s-col>
      </s-row>
    </s-scrollbar>
  </s-dialog>
</template>

<script>
  import {Download} from 'sunflower-common-utils';
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        dialogFlag: false,
        currentUserUuid: this.$store.getters.userData.uuid,
        disableDel: true
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      workInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      downFile(row) {
        Download(`/ItilCommonWorkflow/downloadItilOrderFile/${row.uuid}`);
      },
      deleteAttachment(row) {
        // 置灰的同时阻止点击事件
        if (row.disableDel) {
          event.stopPropagation()
        } else {
          $axios.get(`/ItilCommonWorkflow/deleteItilOrderLogAttachment/${this.workInfo.uuid}/${row.uuid}`)
          this.workInfo.attachmentList = this.workInfo.attachmentList.filter((item) => item.uuid !== row.uuid)
        }
      }
    },
    created() {
      if (this.workInfo.attachmentList) {
        if (this.workInfo.createUser !== this.currentUserUuid) {
          this.workInfo.attachmentList.forEach((item) => { item.disableDel = true })
        } else {
          this.workInfo.attachmentList.forEach((item) => { item.disableDel = false })
        }
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
    }
  }
</script>

<style lang="stylus">

</style>
