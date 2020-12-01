<template>
  <s-dialog v-model="dialogFlag" title="选择该节点的图标" width="540px" class="icon-modify-dialog">
    <div class="topoContent">
      <s-card  class="box-card">
        <div slot="header" class="clearfix">
          <span class="card-title">
            <i class="iconfont icon-log"></i>
            系统默认图标
          </span>
          <s-tooltip class="item" effect="dark" content="双击列表中图标即可替换" placement="top">
            <i class="icon iconfont icon-help"></i>
          </s-tooltip>
        </div>
        <div class="defaultIcoList">
          <s-scrollbar wrap-class="default-ico-list-scrollbar">
            <div class="item" v-for="item in iconAry" :key="item" v-on:dblclick="itemClick(item)">
              <img :src="filterSrc(item)" width="60" height="60"/>
            </div>
          </s-scrollbar>
        </div>
      </s-card>
    </div>
    <div class="topoContent">
      <s-card  class="box-card">
        <div slot="header" class="clearfix">
          <span class="card-title">
            <i class="iconfont icon-upload-pic"></i>
            上传图标
          </span>
          <s-tooltip class="item" effect="dark" content="选择文件后，自动上传图标并进行替换" placement="top">
            <i class="icon iconfont icon-help"></i>
          </s-tooltip>
        </div>
        <div class="uploadIcoContent">
          <s-upload
            class="upload-icon"
            drag
            :action="uploadPath"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="uploadError"
            >
            <i class="s-icon-upload"></i>
            <div class="s-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="s-upload__tip" slot="tip">请选择1*1比例图片上传，建议选择大小60*60像素，
              且不超过50KB</div>
          </s-upload>
        </div>
      </s-card>
    </div>
    <template slot="footer" class="dialog-footer">
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
//  import $axios from 'sunflower-ajax';
  import TopologyAjax from './module/topology.ajax'
  var baseUrl = '../../../static/images/topologyicon/default';
  var baseCustomUrl = '../../../static/images/topologyicon';
import { uploadTopologyIco } from './api/topology_api';
  export default {
    data() {
      return {
        iconAry: ['Building', 'businessService', 'DataBase', 'display', 'domecamera', 'Firewall', 'Firewallnofire', 'guncamera', 'hostHardWare', 'Hub', 'layer3switch', 'Middleware', 'networkserver', 'Printer', 'Router', 'Server', 'standardApp', 'subtopology', 'Switch', 'unknown', 'VirtualDevice'],
        dialogFlag: false,
        uploadPath: uploadTopologyIco()
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      cell: {
        type: Object,
        default: true
      }
    },
    methods: {
      filterSrc (image, flag) {
        let imgUrl = flag === 'custom' ? baseCustomUrl : baseUrl;
        return imgUrl + '/' + image + (flag === 'custom' ? '' : '.svg');
      },
      itemClick (item) {
        this.saveCellStyle('image;image=' + this.filterSrc(item), () => {
          var imgData = {'imgName': item, 'imgHeight': '60', 'imgWidth': '60'};
          this.close(imgData);
        });
      },
      close (imgData, flag) {
        var size = this.calcIcoSize(imgData);
        var imgSrc = this.filterSrc(imgData.imgName, flag);
        var graph = window.TopologyGraph.getGraph();
        graph.setCellStyles(window.mxConstants.STYLE_IMAGE, imgSrc, [this.cell]);
        graph.setCellStyles(window.mxConstants.STYLE_IMAGE_HEIGHT, size.imgHeight, [this.cell]);
        graph.setCellStyles(window.mxConstants.STYLE_IMAGE_WIDTH, size.imgWidth, [this.cell]);
        graph.refresh();
        this.dialogFlag = false;
      },
      calcIcoSize (data) {
        var imgWidth = 60;
        var imgHeight = 60;
        var width = parseInt(data.imgWidth);
        var height = parseInt(data.imgHeight);
        if (width <= imgWidth && height <= imgHeight) {
          imgWidth = width;
          imgHeight = height;
        } else {
          if (width > height) {
            imgHeight = Math.round(imgWidth / width * height);
          }
          if (width < height) {
            imgWidth = Math.round(imgHeight / height * width);
          }
        }
        return {
          imgWidth: imgWidth,
          imgHeight: imgHeight
        };
      },
      saveCellStyle(style, callback) {
        var nodeArr = [];
        var node = {
          uuid: this.cell.uuid,
          style: style,
          topoviewInfoUuid: window.paramSubTopo
        };
        nodeArr.push(node);
        var param = {
          topoviewNode: JSON.stringify(nodeArr)
        };
        TopologyAjax.ajaxSaveOrUpdateTopo(param, function () {
          callback();
        });
      },
      handleAvatarSuccess(res, file) {
        this.saveCellStyle('image;image=../static/images/topologyicon/' + res.fileName, () => {
          var imgData = {'imgName': res.fileName, 'imgHeight': '60', 'imgWidth': '60'};
          this.close(imgData, 'custom');
        });
      },
      uploadError() {
        this.$message({
          type: 'error',
          message: '上传失败'
        });
      },
      beforeAvatarUpload(file) {
        const isLt50KB = file.size / 1024 < 50;
        if (!isLt50KB) {
          this.$message.error('上传图片大小不能超过 50KB!');
        }
        return isLt50KB;
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

