<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:业务权限管理-》应用系统授权管理添加-》人员授权弹窗
 * @Date: 2020-02-12 17:07:35
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="userDialogFlag" title='按人员授权' width="700px" v-if='userDialogFlag' :before-close='close' append-to-body>
    <s-scrollbar wrap-style="max-height:500px;padding-right:10px;">
      <s-input placeholder="请输入账号名称" v-model="searchKey" class="real-search-input"
               icon="magnifier" @input="searchHandle"></s-input>
      <RealPageTable :ajax-obj="ajaxObj"
                     :showHeaderCheckbox="true"
                     @selection-change="selectionChange">
        <s-table-column type="selection" width="45" :reserve-selection="true">
        </s-table-column>
        <s-table-column prop="userRealName" label="真实姓名" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="userLoginName" label="账号名称" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="departName" label="所属机构" show-overflow-tooltip>
        </s-table-column>
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
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import {debounce, cloneDeep} from 'lodash';
  export default {
    components: {
      RealPageTable
    },
    props: {
      userDialogFlag: Boolean,
      authUserData: {
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
          url: '/oauthAuthorizeOrder/getSysUserList',
          checkedUuidArr: [], // 初始要回显选中的行
          params: {
            currentPage: 1,
            pageSize: 10,
            condition: {
              userLoginName: ''
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
      getList() {
        let params = {
          userLoginName: this.searchKey
        }
        this.ajaxObj.params.condition = params;
        this.ajaxObj.checkedUuidArr = cloneDeep(this.authUserData);
        this.selections = cloneDeep(this.authUserData);
      },
      searchHandle: debounce(function() {
        let params = {
          userLoginName: this.searchKey
        }
        this.ajaxObj.params.condition = params;
        this.ajaxObj.checkedUuidArr = cloneDeep(this.selections);
      }, 500),
      selectionChange(selections) { // 选择的数据
        this.selections = selections;
      },
      save() {
        this.$emit('userReload', this.selections);
      },
      close() {
        this.$emit('update:userDialogFlag', false);
      }
    }
  }
</script>
