<template>
  <s-form ref="exportForm" label-width="80px">
    <s-form-item label="文件名">
      <s-input v-model="exportForm.fileName"></s-input>
    </s-form-item>
    <s-form-item label="格式">
      <s-select v-model="fileType" placeholder="请选择文件格式">
        <s-option v-for="item in options"
                  :label="item.label"
                  :value="item.value" :key="item.value"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item :rules="[
        { required: true, message: '宽度不能为空'},
        { type: 'number', message: '宽度必须为数字值'}
      ]" label="宽度">
      <s-input v-model="exportForm.widthVal" @change="changeWidth"></s-input>
    </s-form-item>
    <s-form-item label="高" :rules="[
        { required: true, message: '高度不能为空'},
        { type: 'number', message: '高度必须为数字值'}
      ]">
      <s-input v-model="exportForm.heightVal" @change="changeHeight"></s-input>
    </s-form-item>
    <s-form-item label="边框宽度" :rules="[
        { required: true, message: '边框宽度不能为空'},
        { type: 'number', message: '边框宽度必须为数字值'}
      ]">
      <s-input v-model="exportForm.borderWidth"></s-input>
    </s-form-item>
  </s-form>
</template>
<script>
  import { exportTopology } from './api/topology_api'
  /**
   * 最大请求数据
   * @constant
   */
  const MAX_REQUEST_SIZE = 10485760;

  /**
   * 最大面积
   * @constant
   */
  const MAX_AREA = 10000 * 10000;

  /**
   * 拓扑导出图片后台请求路径
   * @constant
   */
  // const EXPORT_URL = '/topologyExport';

  export default {
    data () {
      return {
        exportForm: {
          fileName: 'topology' + window.paramSubTopo + '.png',
          borderWidth: 0,
          widthVal: 0,
          heightVal: 0
        },
        fileType: 'png',
        options: [{
          value: 'png',
          label: 'PNG - Portable Network Graphics'
        }, {
          value: 'gif',
          label: 'GIF - Graphics Interchange Format'
        }, {
          value: 'jpg',
          label: 'JPG - JPEG File Interchange Format'
        }, {
          value: 'pdf',
          label: 'PDF - Portable Document Format'
        }]
      }
    },
    methods: {
      getDefaultStyle(obj, attribute) {
        return obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj, false)[attribute];
      },
      submitForm () {
        var imgExport = new window.mxImageExport();
        var b2 = Math.max(0, this.exportForm.borderWidth) + 1;
        var scale2 = this.exportForm.widthVal / this.width;
        var graph = window.TopologyGraph.getGraph();
        var bounds2 = graph.getGraphBounds();
        var vs2 = graph.view.scale;

        // New image export
        var xmlDoc = window.mxUtils.createXmlDocument();
        var root2 = xmlDoc.createElement('output');
        xmlDoc.appendChild(root2);

        // Renders graph. Offset will be multiplied with state's scale when painting state.
        var xmlCanvas = new window.mxXmlCanvas2D(root2);
        xmlCanvas.translate(Math.floor((b2 / scale2 - bounds2.x) / vs2), Math.floor((b2 / scale2 - bounds2.y) / vs2));
        xmlCanvas.scale(scale2 / vs2);
        imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

        // Puts request data together
        var w = Math.ceil(bounds2.width * scale2 / vs2 + 2 * b2);
        var h = Math.ceil(bounds2.height * scale2 / vs2 + 2 * b2);
        var xml2 = window.mxUtils.getXml(root2);

        // Requests image if request is valid
        if (xml2.length <= MAX_REQUEST_SIZE && w > 0 && h > 0 && w * h < MAX_AREA) {
          let graphBg = this.getDefaultStyle(document.getElementById('topology_graph'), 'backgroundImage');
          let bg = 'org_bg_other.png'
          if (graphBg.length > 0) {
            let urlStrAry = graphBg.split('"');
            if (urlStrAry.length > 1) {
              bg = urlStrAry[1].split('/').reverse()[0]
            }
          }
          new window.mxXmlRequest(exportTopology(), 'filename=' + this.exportForm.fileName + '&format=' + this.fileType + '&bg=' + bg + '&w=' + w + '&h=' + h + '&plain=' + encodeURIComponent(xml2)).simulate(document, '_blank');
        } else {
          this.$message({
            message: '请输入合理的尺寸！',
            type: 'warning'
          });
        }
      },
      changeWidth () {
        if (this.width > 0) {
          this.exportForm.heightVal = Math.ceil(this.exportForm.widthVal * this.height / this.width);
        } else {
          this.exportForm.heightVal = 0;
        }
        this.checkValues();
      },
      changeHeight () {
        if (this.height > 0) {
          this.exportForm.widthVal = Math.ceil(this.exportForm.heightVal * this.width / this.height);
        } else {
          this.exportForm.widthVal = 0;
        }
        this.checkValues()
      },
      checkValues () {
        if (this.exportForm.widthVal <= 0 || this.exportForm.heightVal <= 0) {
          this.$message({
            message: '请输入合理的尺寸！',
            type: 'warning'
          });
        }
        if (this.exportForm.widthVal * this.exportForm.heightVal > MAX_AREA) {
          this.$message({
            message: '当前值获得的区域超出系统最大范围！',
            type: 'warning'
          });
        }
      }
    },
    mounted () {
      this.exportForm.widthVal = this.width;
      this.exportForm.heightVal = this.height;
    },
    props: {
      height: {
        required: true,
        type: Number
      },
      width: {
        required: true,
        type: Number
      }
    },
    watch: {
      fileType: function (val, oldVal) {
        this.exportForm.fileName = 'topology' + window.paramSubTopo + '.' + val;
      }
    }
  }

</script>
