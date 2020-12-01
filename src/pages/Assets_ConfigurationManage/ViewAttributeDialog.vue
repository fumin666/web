<!--
 * @Author: 高建鹏
 * @Version: //Q4资产通用属性调整
 * @Description:查看属性
 * @Position:配置项管理-》通用属性-》查看操作
 * @Date: 2019-10-30 14:35:06
 * @LastEditors  : mybells
 -->
<template>
  <s-dialog v-model="viewDialog" title="查看" width="550px" :before-close="dialogClose">
    <s-scrollbar wrap-style="max-height:600px;">
      <view-module :data="entryList" isHtml class="assetsViewAttribute"></view-module>
    </s-scrollbar>
  </s-dialog>
</template>

<script type="text/babel">
import viewModule from '@/components/commonView/DialogView'
export default {
  data() {
    return {
      entryList: [],
      dataTemplate: {
        dataType: '属性类型',
        colnumName: '属性名称',
        dropDownOptionList: '选项及默认值',
        attributeDesc: '描述',
        applicationStatus: '是否应用',
        requiredStatus: '是否必填',
        supportEditing: '是否支持批量编辑'
      },
      judge: {
        0: '否',
        1: '是'
      },
      type: {
        1: '文本',
        2: '数值',
        3: '列表',
        4: '日期'
      }
    };
  },
  props: {
    viewDialog: {
      type: Boolean
    },
    rowData: {
      type: Object
    }
  },
  created() {
    let keyArr = Object.keys(this.rowData)
    if (this.rowData.dataType !== 3) {
      this.dataTemplate.dropDownOptionList = '默认值'
    }
    for (let key in this.dataTemplate) {
      if (keyArr.indexOf(key) > -1) {
        if (key === 'dataType') {
          if (this.rowData['colnumName'] === 'IP地址') {
            this.entryList.push({name: this.dataTemplate[key], content: '数值(IP格式)'})
          } else if (this.rowData['colnumName'] === '面板') {
            this.entryList.push({name: this.dataTemplate[key], content: '文本(图片)'})
          } else {
            this.entryList.push({name: this.dataTemplate[key], content: this.type[this.rowData[key]]})
          }
        } else if (key === 'applicationStatus' || key === 'requiredStatus' || key === 'supportEditing') {
          this.entryList.push({name: this.dataTemplate[key], content: this.judge[this.rowData[key]]})
        } else if (key === 'dropDownOptionList') {
          let arr = this.rowData[key] || [];
          // 有childrenList代表树形
          if (this.rowData.dropDownOptionList && this.rowData.dropDownOptionList.length && this.rowData.dropDownOptionList[0].childrenList && this.rowData.dataType === 3) {
            let flag = 'tree'
            this.entryList.push({name: this.dataTemplate[key], content: arr, flag: flag})
          } else if (this.rowData.dropDownOptionList && this.rowData.dropDownOptionList.length && !this.rowData.dropDownOptionList[0].childrenList && this.rowData.dataType === 3) {
            let flag = 'list'
            this.entryList.push({name: this.dataTemplate[key], content: arr, rowData: this.rowData.defaultValue, flag: flag})
          } else {
            this.entryList.push({name: this.dataTemplate[key], content: this.rowData.defaultValue})
          }
        } else {
          this.entryList.push({name: this.dataTemplate[key], content: this.rowData[key]})
        }
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
  .assetsViewAttribute .listyle{
    list-style: none;
    height:30px;
    line-height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
