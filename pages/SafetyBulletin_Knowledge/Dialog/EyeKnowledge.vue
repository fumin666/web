<!--
 * @Author: mybells
 * @Version://Q1知识库
 * @Description:安全通报->知识库->查看
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="viewDialog" title="查看知识" width="600px" :before-close="dialogClose">
    <s-scrollbar wrap-style="max-height:600px;">
      <view-module :data="entryList" isHtml class="securityViewAttribute"></view-module>
    </s-scrollbar>
  </s-dialog>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';
import viewModule from '@/components/commonView/DialogView'
export default {
  data() {
    return {
      entryList: [],
      dataTemplate: {
        code: '知识编号',
        title: '标题',
        keyword: '关键字',
        content: '描述',
        solution: '解决方案',
        safeTypeName: '知识分类',
        classify: '知识类别',
        createByName: '提交人',
        createTime: '提交时间',
        files: '附件信息'
      }
    };
  },
  props: {
    viewDialog: {
      type: Boolean
    },
    rowUuid: {
      type: String
    }
  },
  created() {
    // 获取编辑数据
    $axios.get(`/safetyPlatform/knowledge/viewKnowledgeDetail/${this.rowUuid}`).then(res => {
      let keyArr = Object.keys(res.data || []);
      for (let key in this.dataTemplate) {
        if (keyArr.indexOf(key) > -1) {
          if (key === 'classify') {
            let classify = '';
            if (res.data[key] === 1) {
              classify = '问题解决方案';
            } else if (res.data[key] === 2) {
              classify = '操作指引';
            }
            this.entryList.push({name: this.dataTemplate[key], content: classify})
          } else if (key === 'files') {
            this.entryList.push({name: this.dataTemplate[key], content: res.data[key], flag: true, download: true})
          } else {
            this.entryList.push({name: this.dataTemplate[key], content: res.data[key]})
          }
        }
      }
    })
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
