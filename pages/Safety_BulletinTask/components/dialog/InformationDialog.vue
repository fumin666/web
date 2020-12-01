<template>
    <div>
        <s-dialog
            v-model="dialogFlag"
            v-if="dialogFlag"
            width="700px"
            append-to-body
            title="工单详情">
            <div style="margin:10px 0">
              <s-tag v-if="rowData.isMeeting === 1" type='tpprimary'>会议通知</s-tag>
              <s-tag v-if="rowData.isMeeting === 0" type='tpwarning'>非会议通知</s-tag>
              <span style="font-weight:bold;margin-left:10px">{{rowData.safeId}}</span>
            </div>
            <div style="margin:20px 0;height:20px;padding-bottom:10px" class="borderBottom">
              <span style="opacity:0.45">创建人：{{rowData.creator}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span style="opacity:0.45;width:100px">创建时间：{{rowData.createTime}}</span>
            </div>
            <div style="margin:20px 0;height:20px">
              <div style="opacity:0.45;width:75px;float:left">标题：</div><div style="float:left">{{rowData.title}}</div>
            </div>
            <div style="margin:20px 0;height:20px" v-for='val in details.safeAttrList' :key='val.uuid' >
              <div v-if='val.attrType !== 6' style="opacity:0.45;width:75px;float:left">{{val.attrName + '：'}}</div><div v-if='val.attrType != 6' style="float:left;">{{val.attrValue}}</div>
              <div v-if='val.attrType === 6' style="opacity:0.45;width:75px;float:left">附件：</div><div v-if='val.attrType === 6'><span @click='fileDownload(val)' style="float:left;cursor: pointer;color:#199fed">{{val.safeTaskAttachmentList.length}}</span>&nbsp;<span> 个</span></div>
            </div>
            <template slot="footer" class="dialog-footer">
                <s-button :type="receipType === 2 ? 'default': 'cancel'" @click="save(2)" :disabled='rowData.orderStatus !== 2' v-if="rowData.isMeeting === 1">参加</s-button>
                <s-button :type="receipType === 3 ? 'default': 'cancel'" @click="save(3)" :disabled='rowData.orderStatus !== 2' v-if="rowData.isMeeting === 1">拒绝</s-button>
                <s-button @click="save(1)" :disabled='rowData.orderStatus !== 2' v-if="rowData.isMeeting !== 1">知道了</s-button>
            </template>
        </s-dialog>
        <s-dialog
            v-model="fileDialog"
            v-if="fileDialog"
            append-to-body
            width="600px"
            title="附件下载">
            <s-table-page :data='fileData' style="margin-top:10px">
                <s-table-column prop="attacthmentName" label="文件名称"></s-table-column>
                <s-table-column prop="attacthmentSize" label="大小(Byte)"></s-table-column>
                <s-table-column label="操作" width="150">
                  <template slot-scope="scope">
                    <i class="iconfont icon-download" title="下载" @click="download(scope.row)"> </i>
                  </template>
                </s-table-column>
              </s-table-page>
        </s-dialog>
    </div>
</template>
<style>

</style>
<script>
import $axios from 'sunflower-ajax'
import {Download} from 'sunflower-common-utils';
export default {
    data() {
        return {
            dialogFlag: false,
            userData: [],
            fileData: [],
            radio: '',
            userUuid: '',
            details: [],
            fileDialog: false
        }
    },
    props: {
        orderUuid: String,
        rowData: Object,
        value: {
            type: Boolean,
            default: false
        },
        receipType: Number
    },
    methods: {
        // 获取用户列表
        getData() {
          $axios.get(`/safetyPlatform/safeOrder/getSafeOrderDetail/${this.rowData.uuid}`).then(res => {
                  this.details = res.data
                  if (this.details.orderStatus === 1) {
                    this.details.orderStatus = '新建'
                  } else if (this.details.orderStatus === 2) {
                    this.details.orderStatus = '进行中'
                  } else {
                    this.details.orderStatus = '已完成'
                  }
          })
        },
        fileDownload(val) {
          this.fileDialog = true
          this.fileData = val.safeTaskAttachmentList
        },
        // 附件下载
        download(val) {
          Download(`/safetyPlatform/fileUpload/downloadOrderTaskFile/${val.uuid}/3`);
        },
        // 信息回执
        save(type) {
          $axios.get(`/safetyPlatform/safeOrder/myNoticeHand/${this.rowData.uuid}/${type}`, {
              data: [this.rowData],
              logTemplate: '操作|通报(#safeId#)'
            }).then(res => {
                if (res.data.state) {
                    this.$message({message: '回复成功!', type: 'success'});
                    this.dialogFlag = false
                    this.$emit('receive', true)
                } else {
                    this.$message({message: res.data.errormsg, type: 'error'});
                }
            })
        }
    },
    created() {
      this.getData()
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val
        }
      },
      dialogFlag(val) {
        this.$emit('input', val)
      }
    }
}
</script>
