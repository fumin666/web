<template>
  <s-dialog v-model="dialogFlag" title="查看文档" width="600px" class="docDetailDialog" append-to-body>
    <s-tab :animated="false">
      <s-tab-pane label="文档明细">
        <s-scrollbar wrap-class="docDetailScrollbar">

          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">文档名称</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.docName}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">创建者</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.createrUser ? curDoc.createrUser.userLoginName : ''}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">创建时间</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.createTime}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">关键字</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.keywords}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">组织机构</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.departmentInfo.departName}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">维护人</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.maintenceUser ? curDoc.maintenceUser.userLoginName : ''}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">复查状态</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.checkstatus}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">文档类型</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.docType}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">文档状态</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.docStatus}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">发布时间</div>
            </s-col>
            <s-col span="16">
              <div class="grid-content bg-purple-light">{{curDoc.releaseTime}}</div>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">用途</div>
            </s-col>
            <s-col span="16">
              <s-tooltip :content="curDoc.use">
                <div class="grid-content bg-purple-light">{{curDoc.use}}</div>
              </s-tooltip>
            </s-col>
          </s-row>
          <s-row :gutter="10">
            <s-col span="8">
              <div class="grid-content bg-purple">描述</div>
            </s-col>
            <s-col span="16">
              <s-tooltip :content="curDoc.docDesc">
                <div class="grid-content bg-purple-light">{{curDoc.docDesc}}</div>
              </s-tooltip>
            </s-col>
          </s-row>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="上传附件">
        <s-table-page :data="docFiles">
          <s-table-column label="附件名称" prop="fileName" show-overflow-tooltip></s-table-column>
          <s-table-column label="大小(Byte)" prop="fileSize"></s-table-column>
          <s-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <i class="iconfont icon-download" @click="downFile(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        baseUrl: '',
        dialogFlag: false,
        docFiles: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curDoc: {
        type: Object
      }
    },
    created() {
      this.baseUrl = $axios.basePath();
      this.docFiles = this.curDoc.documentAttachmentList.map((item, index) => {
        return {
          uuid: item.uuid,
          fileName: item.attacthmentName,
          fileSize: item.attacthmentSize,
          absolutePath: item.absolutePath,
          index: index
        }
      });
    },
    methods: {
      downFile(file) {
        Download(`documentmanager/document/downloadAttach/${file.uuid}`);
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
  .docDetailDialog
    .docDetailScrollbar
      padding-right 17px
      max-height: 500px
    .grid-content
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
</style>
