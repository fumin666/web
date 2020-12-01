<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:业务权限管理-》应用系统授权管理添加-》授权应用系统添加弹窗
 * @Date: 2020-02-12 17:07:35
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="addDialogFlag" title='添加' width="700px" v-if='addDialogFlag' :before-close='close' append-to-body>
    <s-scrollbar wrap-style="max-height:500px;padding-right:10px;">
      <s-input placeholder="请输入账号名称" v-model="searchKey" class="real-search-input"
               icon="magnifier" @input="searchHandle"></s-input>
      <RealPageTable :ajax-obj="ajaxObj"
                     :showHeaderCheckbox="true"
                    :callback="handleData"
                     @selection-change="selectionChange">
        <s-table-column type="selection" width="45"> </s-table-column>
        <s-table-column prop="appName" label="应用系统名称" show-overflow-tooltip></s-table-column>
        <s-table-column prop="clientId" label="Client_Id" show-overflow-tooltip></s-table-column>
        <s-table-column prop="redirectUris" label="回调地址" show-overflow-tooltip></s-table-column>
      </RealPageTable>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="save">确定</s-button>
      <s-button type="cancel" @click="close">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  // import $axios from 'sunflower-ajax';
  import {debounce, cloneDeep} from 'lodash';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    components: {
      RealPageTable
    },
    props: {
      addDialogFlag: Boolean,
      authSysData: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },
    data() {
      return {
        searchKey: '',
        selections: [], // 选中的数据集合
        ajaxObj: {
          type: 'post',
          url: '/oauthClient/getOauthClientList',
          checkedUuidArr: [], // 初始要回显选中的行
          params: {
            currentPage: 1,
            pageSize: 10,
            condition: {
              appName: ''
            }
          }
        }
      }
    },
    created() {
      this.$nextTick(() => {
        this.getList()
      })
    },
    methods: {
      handleData(data) {
        data.pageList.forEach(item => { item.uuid = item.clientId })
        return data.pageList;// 返回表格数据数组
      },
      getList() {
        let params = {
          appName: this.searchKey
        }
        this.ajaxObj.params.condition = params;
        this.ajaxObj.checkedUuidArr = cloneDeep(this.authSysData);
        this.selections = cloneDeep(this.authSysData);
      },
      searchHandle: debounce(function() {
        let params = {
          appName: this.searchKey
        }
        this.ajaxObj.params.condition = params;
        this.ajaxObj.checkedUuidArr = cloneDeep(this.selections);
      }, 500),
      selectionChange(selections) { // 选择的数据
        this.selections = selections;
      },
      save() {
        this.$emit('sysReload', this.selections);
      },
      close() {
        this.$emit('update:addDialogFlag', false);
      }
    }
  }
</script>
