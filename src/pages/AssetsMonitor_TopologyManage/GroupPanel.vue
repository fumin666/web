<template>
  <div class="content" id="groupPanel">
    <s-card class="box-card">
      <div slot="header" class="clearfix">
          <span class="card-title">
            <i class="iconfont icon-event"></i>
            区域样式修改
          </span>
          <s-button icon="double-right" size="mini" @click="backAction" title="返回拖拽面板" style="float: right;"></s-button>
      </div>
      <s-row>
        <s-col span="4">
          <div class="s-form-item check-content"><s-checkbox v-model="fillColorFlag">填充颜色</s-checkbox></div>
        </s-col>
        <s-col span="4">
          <div class="s-form-item"><input class="color" id="fillcolorValue" v-model="fillColor" style="width: 56px;" type="text"/></div>
        </s-col>
        <s-col span="4">
          <div class="s-form-item check-content"><s-checkbox v-model="roundedFlag">是否圆角</s-checkbox></div>
        </s-col>
        <s-col span="12">
        </s-col>
      </s-row>
      <s-row>
        <s-col span="4">
          <div class="s-form-item opacity-check-content"><s-checkbox v-model="opacityFlag">透明度</s-checkbox></div>
        </s-col>
        <s-col span="4">
          <div class="s-form-item"><s-input-number v-model="opacity" class="opaInput" :max="100" :min="0"></s-input-number>%</div>
        </s-col>
        <s-col span="4">
          <div class="s-form-item check-content"><s-checkbox v-model="lineFlag">边框样式</s-checkbox></div>
        </s-col>
        <s-col span="12">
          <div class="s-form-item">
            <div class="f-left"><input @blur="strokeColorFiledBlur" class="color" id="strokeColorValue" v-model="strokeColor" style="width: 56px;" type="text"/></div>
            <div class="lineselect" title="线形" @click="lineTypeAction">
              <div class="currenttype" :class="[currentClass]"><div class="line"></div><i class="s-input-icon iconfont icon-bottom"></i></div>
              <div class="alltypes" v-show="typeSelect">
                <div class="type type1" data-type="1" @click="changType('1', $event)" title="实线"><div class="line"></div></div>
                <div class="type type2" data-type="2" @click="changType('2', $event)" title="虚线"><div class="line"></div></div>
                <div class="type type3" data-type="3" @click="changType('3', $event)" title="点线（1）"><div class="line"></div></div>
                <div class="type type4" data-type="4" @click="changType('4', $event)" title="点线（2）"><div class="line"></div></div>
                <div class="type type5" data-type="5" @click="changType('5', $event)" title="点线（3）"><div class="line"></div></div>
              </div>
            </div>
            <div class="f-left">
              <s-select v-model="strokeWidth" placeholder="请选择线宽" class="strokeWidth">
                <s-option label="1pt" :value="1"></s-option>
                <s-option label="2pt" :value="2"></s-option>
                <s-option label="3pt" :value="3"></s-option>
                <s-option label="4pt" :value="4"></s-option>
                <s-option label="5pt" :value="5"></s-option>
              </s-select>
            </div>
          </div>
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
      fillColorFlag: false,
      fillColor: '',
      roundedFlag: false,
      opacityFlag: false,
      opacity: 100,
      lineFlag: false,
      strokeColor: '',
      strokeWidth: '1',
      currentType: '1',
      typeSelect: false
    }
  },
  created() {
    this.init();
  },
  methods: {
    // 刷新数据
    strokeColorFiledBlur(e) {
      this.strokeColor = e.target.value;
    },
    backAction () {
      window.TopologyGraph.getGraphVm().activeTabName = 'fourth';
      window.TopologyGraph.getGraphVm().fourthTabTitle = '拖拽面板';
      window.TopologyGraph.getGraphVm().fourthTabContent = 'dragPanel';
    },
    init () {
      var graph = window.TopologyGraph.getGraph();
      var styleObj = graph.getCellStyle(this.cell);
      if (styleObj.fillColor === 'none') {
        this.fillColorFlag = false;
      } else {
        this.fillColorFlag = true;
        this.fillColor = styleObj.fillColor.substring(1).toUpperCase();
      }
      if (styleObj.strokeColor === '#ffffff' && typeof styleObj.dashed === 'undefined' && typeof styleObj.strokeWidth === 'undefined') {
        this.lineFlag = false;
      } else {
        this.lineFlag = true;
        this.strokeWidth = styleObj.strokeWidth; // 线宽
        this.strokeColor = colorToHex(styleObj.strokeColor.substring(1).toUpperCase()); // 边框颜色
        this.dashed = styleObj.dashed; // 是否为虚线
        // let dashPattern = styleObj.dashPattern; // 虚线的模式
        this.currentType = '1';
        if (styleObj.dashed === 1) {
          this.currentType = '2';
        }
        if (typeof styleObj.dashPattern === 'undefined' && styleObj.dashed === 1) {
          this.currentType = '2';
        } else if (styleObj.dashPattern === '1 1') {
          this.currentType = '3';
        } else if (styleObj.dashPattern === '1 2') {
          this.currentType = '4';
        } else if (styleObj.dashPattern === '1 4') {
          this.currentType = '5';
        }
      }
      if (typeof styleObj.opacity === 'undefined') {
        this.opacityFlag = false;
      } else {
        this.opacityFlag = true;
        this.opacity = styleObj.opacity;
      }
      if (typeof styleObj.rounded === 'undefined' || styleObj.rounded === 0) {
        this.roundedFlag = false;
      } else {
        this.roundedFlag = true;
      }
      loadScript('../../../static/js/jscolor.js', () => {
        window.jscolor.setDir('../../../static/images/colorpicker/');
        window.jscolor.init();
      });
    },
    lineTypeAction () {
      this.typeSelect = !this.typeSelect;
    },
    changType(type, event) {
      event.stopPropagation();
      this.typeSelect = false;
      this.currentType = type + '';
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
      var styleDashed = '1';
      var styleDashedPatten = null;
      if (this.currentType === '1') {
        styleDashed = null;
      }
      if (this.currentType === '3') {
        styleDashedPatten = '1 1';
      }
      if (this.currentType === '4') {
        styleDashedPatten = '1 2';
      }
      if (this.currentType === '5') {
        styleDashedPatten = '1 4';
      }
      try {
        if (this.fillColorFlag) {
          var fillcolorValue = document.getElementById('fillcolorValue').style.backgroundColor;
          graph.setCellStyles(window.mxConstants.STYLE_FILLCOLOR, colorToHex(fillcolorValue));
        } else {
          graph.setCellStyles(window.mxConstants.STYLE_FILLCOLOR, null);
        }
        if (this.lineFlag) {
          var strokeColorValue = document.getElementById('strokeColorValue').style.backgroundColor;
          graph.setCellStyles(window.mxConstants.STYLE_STROKECOLOR, colorToHex(strokeColorValue));
          graph.setCellStyles(window.mxConstants.STYLE_DASHED, styleDashed);
          graph.setCellStyles(window.mxConstants.STYLE_DASH_PATTERN, styleDashedPatten);
          graph.setCellStyles(window.mxConstants.STYLE_STROKEWIDTH, this.strokeWidth);
        } else {
          graph.setCellStyles(window.mxConstants.STYLE_STROKECOLOR, null);
          graph.setCellStyles(window.mxConstants.STYLE_DASHED, null);
          graph.setCellStyles(window.mxConstants.STYLE_DASH_PATTERN, null);
          graph.setCellStyles(window.mxConstants.STYLE_STROKEWIDTH, null);
        }
        if (this.opacityFlag) {
          graph.setCellStyles(window.mxConstants.STYLE_OPACITY, this.opacity);
        } else {
          graph.setCellStyles(window.mxConstants.STYLE_OPACITY, null);
        }
        if (this.roundedFlag) {
          graph.setCellStyles(window.mxConstants.STYLE_ROUNDED, '1');
        } else {
          graph.setCellStyles(window.mxConstants.STYLE_ROUNDED, '0');
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
  },
  computed: {
    currentClass() {
      return 'type' + this.currentType;
    }
  }
}
</script>
<style lang="stylus">
  .strokeWidth input
    height: 36px
</style>

