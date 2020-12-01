<!--
 * @Author: mybells
 * @Version://Q1知识库
 * @Description:安全通报->知识库->查看
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="viewDialog" title="查看" width="600px" :before-close="dialogClose">
    <s-scrollbar wrap-style="max-height:600px;">
      <view-module :data="entryList" class="securityViewAttribute"></view-module>
    </s-scrollbar>
  </s-dialog>
</template>

<script type="text/babel">
// import $axios from 'sunflower-ajax';
import viewModule from '@/components/commonView/DialogView'
export default {
  data() {
    return {
      entryList: [],
      dataTemplate: {
        reportTaskName: '报表名称',
        typeStr: '报表类型',
        reportName: '报表文件',
        fileTypeStr: '输出格式',
        createTime: '生成时间'
      }
    };
  },
  props: {
    viewDialog: {
      type: Boolean
    },
    rowData: Object
  },
  created() {
    // 获取编辑数据
    let keyArr = Object.keys(this.rowData || []);
    for (let key in this.dataTemplate) {
      if (keyArr.indexOf(key) > -1) {
        this.entryList.push({name: this.dataTemplate[key], content: this.rowData[key]})
      }
    }
  },
  components: {
    viewModule
  },
  methods: {
    dialogClose() {
      this.$emit('update:viewDialog', false)
    }
  }
}
</script>
<style>
  .securityViewAttribute .listyle{
    list-style: none;
    height:30px;
    line-height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
