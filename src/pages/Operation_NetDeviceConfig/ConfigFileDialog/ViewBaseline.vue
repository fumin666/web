<!--
 * @Author: songyf
 * @Date: 2020-4-16
 * @LastEditors: songyf
 * @Description: 配置文件管理-查看基线
 -->
<template>
  <s-dialog v-model="dialogFlag" title="查看" width="700px" append-to-body class="view-baseline">
    <div class="info">
      <s-row class="info-item">
        <s-col :span="4">文件名称 ：</s-col>
        <s-col :span="20" class="ellipsis" title="title">{{baselineData.backupFileName}}</s-col>
      </s-row>
      <s-row class="info-item">
        <s-col :span="4">{{viewType === 2 ? '备份时间' : '设置时间'}} ：</s-col>
        <s-col :span="20" class="ellipsis" title="title">{{viewType === 2 ? baselineData.createTime : baselineData.baseTime}}</s-col>
      </s-row>
    </div>
    <s-row>
      <span>配置文件内容</span>
    </s-row>
    <div class="config-content">
        <codemirror v-model="code" :options="cmOption" ref="codemirror"></codemirror>
    </div>
  </s-dialog>
</template>

<script>
  import { codemirror } from 'vue-codemirror-lite'
  import 'codemirror/lib/codemirror.css'
  // language
  import 'codemirror/mode/python/python.js'
  // theme css
  import 'codemirror/theme/blackboard.css'
  import 'codemirror/theme/elegant.css'
  // require active-line.js
  import 'codemirror/addon/selection/active-line.js'
  export default {
    components: {
      codemirror
    },
    data() {
      return {
        dialogFlag: false,
        msg: '',
        code: '',
        cmOption: {
          tabSize: 2,
          styleActiveLine: true,
          lineNumbers: false,
          line: false,
          lineWrapping: true,
          mode: 'text/x-python',
          theme: '',
          scrollbarStyle: null,
          readOnly: 'nocursor'
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      baselineData: {
        type: Object,
        default: null
      },
      viewType: {
        type: Number,
        default: 2
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
    },
    created() {
      this.code = this.baselineData.fileContent
    },
    methods: {
    }
  }
</script>
<style lang="stylus">
  .view-baseline
    .info
      .info-item
        margin-bottom 15px
    .config-content
      box-sizing border-box
      border-radius 2px
      .CodeMirror-activeline-background
        background transparent

</style>

