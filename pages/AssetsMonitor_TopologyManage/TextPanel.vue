<template>
  <div class="content" id="textPanel">
    <s-card class="box-card">
      <div slot="header" class="clearfix">
          <span class="card-title">
            <i class="iconfont icon-event"></i>
            文字样式修改
          </span>
          <s-button icon="double-right" size="mini" @click="backAction" title="返回拖拽面板" style="float: right;"></s-button>
      </div>
      <s-row>
        <s-col span="4">
          <div class="s-form-item check-content"><s-checkbox v-model="fontColorFlag">字体颜色</s-checkbox></div>
        </s-col>
        <s-col span="4">
          <div class="s-form-item"><input class="color" id="fontColorValue" v-model="fontColor" style="width: 56px;" type="text"/></div>
        </s-col>
        <s-col span="4">
          <div class="s-form-item check-content"><s-checkbox v-model="labelBackgroundColorFlag">背景颜色</s-checkbox></div>
        </s-col>
        <s-col span="12">
          <div class="s-form-item"><input class="color" id="labelBackgroundColorValue" v-model="labelBackgroundColor" style="width: 56px;" type="text"/></div>
        </s-col>
      </s-row>
      <s-row>
        <s-col span="4">
          <div class="s-form-item check-content"><s-checkbox v-model="fontSizeFlag">字体大小</s-checkbox></div>
        </s-col>
        <s-col span="4">
          <div class="s-form-item"><s-input-number v-model="fontSize" :min="10" :max="100"></s-input-number></div>
        </s-col>
        <s-col span="4">
          <div class="s-form-item style-check-content"><s-checkbox v-model="fontStyleFlag">加粗</s-checkbox></div>
        </s-col>
        <s-col span="12">
        </s-col>
      </s-row>
      <s-row>
        <s-col span="18">
          <div class="s-form-item btn-content">
            <s-button @click="applyForm">应用</s-button>
            <s-button type="cancel" @click="resetForm">重置</s-button>
          </div>
        </s-col>
        <s-col span="6">
        </s-col>
      </s-row>
    </s-card>
  </div>
</template>
<script>
  import TopologyAjax from './module/topology.ajax'
  import {loadScript} from 'sunflower-common-utils'
  import colorToHex from '@/common/utils/colorToHex'
  export default {
    data () {
      return {
        fontStyleFlag: false,
        fontStyle: '',
        fontColorFlag: false,
        fontColor: '',
        fontSizeFlag: false,
        fontSize: 24,
        labelBackgroundColorFlag: false,
        labelBackgroundColor: ''
      }
    },
    created() {
      this.init();
    },
    methods: {
      backAction () {
        window.TopologyGraph.getGraphVm().activeTabName = 'fourth';
        window.TopologyGraph.getGraphVm().fourthTabTitle = '拖拽面板';
        window.TopologyGraph.getGraphVm().fourthTabContent = 'dragPanel';
      },
      init () {
        var graph = window.TopologyGraph.getGraph();
        var cell = graph.getSelectionCell();
        var styleObj = graph.getCellStyle(cell);
        if (typeof styleObj.fontStyle === 'undefined') {
          this.fontStyleFlag = false;
        } else {
          this.fontStyleFlag = true;
          this.fontStyle = styleObj.fontStyle;
        }
        if (styleObj.fontColor === '#ffffff') {
          this.fontColorFlag = false;
        } else {
          this.fontColorFlag = true;
          this.fontColor = styleObj.fontColor.substring(1).toUpperCase();
        }
        if (styleObj.fontSize === '24') {
          this.fontSizeFlag = false;
        } else {
          this.fontSizeFlag = true;
          this.fontSize = styleObj.fontSize;
        }
        if (typeof styleObj.labelBackgroundColor === 'undefined') {
          this.labelBackgroundColorFlag = false;
        } else {
          this.labelBackgroundColorFlag = true;
          this.labelBackgroundColor = styleObj.labelBackgroundColor.substring(1).toUpperCase();
        }
        loadScript('../../../static/js/jscolor.js', () => {
          window.jscolor.setDir('../../../static/images/colorpicker/');
          window.jscolor.init();
        });
      },
      resetForm () {
        this.init();
      },
      applyForm () {
        var graph = window.TopologyGraph.getGraph();
        var selCell = graph.getSelectionCell();
        var originStyle = selCell.style;
        this.applyAction(function () {
          var item = {
            uuid: selCell.uuid,
            style: selCell.style,
            value: selCell.value,
            topoviewInfoUuid: window.paramSubTopo
          };
          var param = {
            'topoviewDomain': JSON.stringify([item])
          };
          TopologyAjax.ajaxSaveOrUpdateTopo(param, function (response) {
            if (!response) {
              selCell.style = originStyle;
              graph.refresh();
            }
          });
        });
      },
      applyAction (callback) {
        var graph = window.TopologyGraph.getGraph();
        graph.getModel().beginUpdate();
        try {
          if (this.fontColorFlag) {
            var fontColorValue = document.getElementById('fontColorValue').style.backgroundColor;
            graph.setCellStyles(window.mxConstants.STYLE_FONTCOLOR, colorToHex(fontColorValue));
          } else {
            graph.setCellStyles(window.mxConstants.STYLE_FONTCOLOR, '#ffffff');
          }
          if (this.fontSizeFlag) {
            graph.setCellStyles(window.mxConstants.STYLE_FONTSIZE, this.fontSize);
          } else {
            graph.setCellStyles(window.mxConstants.STYLE_FONTSIZE, 24);
          }
          if (this.labelBackgroundColorFlag) {
            var labelBackgroundColorValue = document.getElementById('labelBackgroundColorValue').style.backgroundColor;
            graph.setCellStyles(window.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, colorToHex(labelBackgroundColorValue));
          } else {
            graph.setCellStyles(window.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, null);
          }
          if (this.fontStyleFlag) {
            graph.setCellStyles(window.mxConstants.STYLE_FONTSTYLE, window.mxConstants.FONT_BOLD);
          } else {
            graph.setCellStyles(window.mxConstants.STYLE_FONTSTYLE, null);
          }
        } finally {
          graph.getModel().endUpdate();
        }
        if (callback) {
          callback();
        }
      }
    },
    props: {
      cell: {
        type: Object,
        required: true
      }
    },
    watch: {
      cell: function (val, oldVal) {
        this.init();
      }
    }
  }
</script>
<style lang="stylus">
  #textPanel
    width calc(100% - 10px)
    height 280px
    margin 0px
    .s-form-item
      margin-bottom 0px
      padding-bottom 10px;
      padding-top 10px;
      height 32px
      .s-checkbox
        margin-top 7px
    .check-content
      margin-right 15px
      text-align right
    .style-check-content
      margin-right 43px
      text-align right
    .color
      border-radius 4px
      height 32px
      border-width 1px
      border-style solid
    .btn-content
      text-align center
    .box-card
      width 100%
</style>
