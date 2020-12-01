<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:业务权限管理-》应用系统资源管理->查看操作
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="viewDialog" title="查看" width="600px" :before-close="dialogClose">
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
        appName: '应用系统名称',
        clientId: 'Client_Id',
        clientSecret: 'Client_Secret',
        redirectUris: '回调地址',
        grantTypes: '令牌类型',
        scope: '授权范围',
        status: '状态'
      }
    };
  },
  props: {
    viewDialog: {
      type: Boolean
    },
    currentRow: {
      type: Object
    }
  },
  created() {
    // 获取编辑数据
    $axios.get(`/oauthClient/getOauthClient/${this.currentRow.clientId}`).then(res => {
      let keyArr = Object.keys(res.data) || [];
      for (let key in this.dataTemplate) {
        if (keyArr.indexOf(key) > -1) {
          if (key === 'status') {
            let status = '开启';
            if (res.data[key] === 0) {
              status = '关闭';
            }
            this.entryList.push({name: this.dataTemplate[key], content: status})
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
