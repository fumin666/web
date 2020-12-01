<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:业务权限管理-》应用系统授权管理添加-》组织机构授权弹窗
 * @Date: 2020-02-12 17:07:35
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="orgDialogFlag" title='按组织机构授权' width="700px" v-if='orgDialogFlag' :before-close='close' append-to-body>
    <s-scrollbar wrap-style="max-height:500px;padding-right:10px;">
      <s-table-page ref="orgtable" :data="dataList" :show-header-checkbox="!isEye" :header-search="searchDef()" @selection-change="selectionChange" style="width: 100%;">
        <s-table-column type="selection" width="45" v-if="!isEye"></s-table-column>
        <s-table-column prop="departName" label="组织机构名称" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="departCode" label="机构编号" show-overflow-tooltip>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="save" v-if="!isEye">确定</s-button>
      <s-button type="cancel" @click="close">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import {intersectionBy} from 'lodash';
  import $axios from 'sunflower-ajax';
  export default {
    components: {
    },
    props: {
      orgDialogFlag: Boolean,
      isEye: Boolean,
      authOraData: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },
    data() {
      return {
        dataList: [],
        selections: [] // 选中的数据集合
      }
    },
    created() {
      if (this.isEye) {
        this.dataList = this.authOraData;
      } else {
        this.getList()
      }
    },
    methods: {
      getList() {
        $axios.get('/departmentInfo/getAllDepart').then(res => {
          this.dataList = res.data || []
          this.$nextTick(() => {
            intersectionBy(this.dataList, this.authOraData, 'uuid').forEach(item => {
              this.$refs.orgtable.toggleRowSelection(item, true);
            })
          })
        })
      },
      searchDef() {
        return {
          width: 10,
          offset: 20,
          placeholder: '请输入关键字',
          searchProps: ['departName', 'departCode']
        }
      },
      selectionChange(selections) { // 选择的数据
        this.selections = selections;
      },
      save() {
        this.$emit('oraReload', this.selections);
      },
      close() {
        this.$emit('update:orgDialogFlag', false);
      }
    }
  }
</script>
