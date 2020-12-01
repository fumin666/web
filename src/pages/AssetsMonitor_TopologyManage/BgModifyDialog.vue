<template>
  <s-dialog v-model="dialogFlag" title="拓扑图背景" width="450px" class="icon-modify-dialog">
    <div class="topoContent" id="backgoundPanel">
      <s-card class="box-card">
        <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-log"></i>
              背景设置
            </span>
        </div>
        <div class="bgPanel">
          <div id="thumb_bg" class="thumb_bg">
            <img v-if="this.bgsrc !== 'org_bg.png'"  :src="imageSrc">
            <div v-if="this.bgsrc === 'org_bg.png'" style="background-image: url(/static/images/topologybg/org_bg.png); background-repeat: repeat;width: 100%;height: 100%;border:1px solid;"></div>
          </div>
          <div class="btns">
            <s-upload
              ref="upload"
              class="upload-demo"
              :show-file-list="false"
              :action="uploadPath"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-error="uploadError"
              :with-credentials="true">
              <s-button>点击上传</s-button>
            </s-upload>
            <s-button @click="defaultAction" class="deleteBtn">默认背景</s-button>
            <s-button @click="dialogReset" class="deleteBtn">重置背景</s-button>
          </div>
          <div class="clr"></div>
          <div class="tip">建议文件小于4M</div>
          <div class="tip">应用后，图片将拉伸平铺的方式应用到拓扑图中</div>
        </div>
      </s-card>
    </div>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">应用</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>
<script>
  import TopologyAjax from './module/topology.ajax'
  import GraphConfig from './module/topology.graphConfig'
  import { uploadForTopologyBg } from './api/topology_api'
  let _TOPOLOGYBG_PATH = '../../../static/images/topologybg/';
  export default {
    data() {
      return {
        dialogFlag: false,
        imageSrc: '',
        uploadPath: uploadForTopologyBg()
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      bgsrc: {
        type: String,
        default: false
      }
    },
    mounted () {
      if (this.bgsrc === 'org_bg.png') {
        this.imageSrc = _TOPOLOGYBG_PATH + this.bgsrc;
      } else {
        this.imageSrc = _TOPOLOGYBG_PATH + this.bgsrc;
      }
    },
    methods: {
      defaultAction() {
        this.imageSrc = _TOPOLOGYBG_PATH + 'org_bg.png';
      },
      dialogReset() {
        if (this.bgsrc === 'org_bg.png') {
          this.imageSrc = _TOPOLOGYBG_PATH + this.bgsrc;
        } else {
          this.imageSrc = _TOPOLOGYBG_PATH + this.bgsrc;
        }
      },
      dialogOk() {
        this.saveBackground(this.imageSrc.replace(_TOPOLOGYBG_PATH, ''));
      },
      saveBackground(style) {
        var node = {
          uuid: window.paramSubTopo,
          background: style
        };
        var param = {
          topoviewInfo: JSON.stringify(node)
        };
        TopologyAjax.ajaxSaveOrUpdateTopo(param, (res) => {
          if (res) {
            GraphConfig.setTopologyBgImg(style);
            window.TopologyGraph.getGraphVm().ground = style;
            this.dialogFlag = false;
          } else {
            this.$message({showClose: true, message: '操作失败!', type: 'error'});
          }
        });
      },
      handleAvatarSuccess(res, file) {
        res = (new Function('', 'return ' + res))();
        this.imageSrc = _TOPOLOGYBG_PATH + res.imgName;
      },
      uploadError() {
        this.$message({
          type: 'error',
          message: '上传失败'
        });
      },
      beforeAvatarUpload(file) {
        if (!file.type.match(/image.*/)) {
          this.$message.error('只能上传图片为背景!');
          return false;
        }
        if (!(file.size / 1024 / 1024 < 4)) {
          this.$message.error('上传图片大小不能超过4M!');
          return false;
        }
        return true;
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
  #backgoundPanel
    height 240px
    .bgPanel
      margin-top 10px;
    .thumb_bg
      float left
      width 290px
      height 165px
      margin-left 5px;
      img
        width 280px
        height 160px
        border-width 1px
        border-style solid
    .btns
      float left
      width 90px
      height 160px
      text-align right
    .deleteBtn
      margin-top 10px
    .clr
      clear both
    .tip
      font-size 12px
      margin-left 5px
</style>
