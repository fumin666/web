<template>
  <div class="assetDocList">
    <s-row class="topRow">
      <s-button @click="add" icon="plus">添加</s-button>
      <s-button @click="del" icon="batch-del">批量删除</s-button>
    </s-row>
    <s-table-page :data="assetDocList"
                  :header-search="searchDef()"
                 @selection-change="selectionChange">
      <s-table-column type="selection" align="center" width="45" show-overflow-tooltip></s-table-column>
      <s-table-column label="文档名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="showDocDetail(scope.row)" class="docName">{{scope.row.docName}}</a>
        </template>
      </s-table-column>
      <s-table-column label="创建者" prop="createrUser.userRealName" show-overflow-tooltip></s-table-column>
      <s-table-column label="创建时间" prop="createTime" show-overflow-tooltip></s-table-column>
      <s-table-column label="关键字" prop="keywords" show-overflow-tooltip></s-table-column>
      <s-table-column label="文档类型" prop="docType" show-overflow-tooltip></s-table-column>
      <s-table-column label="发布时间" prop="releaseTime" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <doc-add-dialog v-model="addDialogFlag" v-if="addDialogFlag"
                    :cur-doc="curDoc" @reload="axiosList">
    </doc-add-dialog>
    <doc-detail-dialog v-model="docDetailDialogFlag" v-if="docDetailDialogFlag"
                    :cur-doc="curDoc">
    </doc-detail-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import docAddDialog from './DocAddDialog';
  import docDetailDialog from './DocDetailDialog';

  export default {
    data() {
      return {
        addDialogFlag: false,
        docDetailDialogFlag: false,
        assetDocList: [],
        selections: [],
        curDoc: {}
      }
    },
    created() {
      this.axiosList();
    },
    methods: {
      searchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入关键字',
          searchProps: ['docName', 'createrUser.userRealName', 'createTime', 'keywords', 'docType', 'releaseTime']
        }
      },
      axiosList() {
        $axios.get(`/documentmanager/document/doclist`).then(({data}) => {
          this.assetDocList = data;
        });
      },
      axiosDel(param) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          let obj = {
            data: param,
            logTemplate: '删除|文档管理(#docName#)'
          }
          let params = param.map(item => {
            return item.uuid;
          });
          $axios.post(`/documentmanager/document/deleteDoc`, params, obj).then(({data}) => {
            if (data) {
              this.$message({showClose: true, message: '删除成功', type: 'success'});
              this.axiosList();
            } else {
              this.$message({showClose: true, message: '删除失败', type: 'error'});
            }
          });
        }).catch(() => {});
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      add() {
        this.curDoc = {};
        this.addDialogFlag = true;
      },
      del() {
        if (this.selections.length <= 0) {
          this.$message({type: 'info', message: '请先选择文档!'});
          return;
        }
        let param = this.selections
        this.axiosDel(param);
      },
      rowEdit(row) {
        this.curDoc = Object.assign({}, row);
        this.addDialogFlag = true;
      },
      rowDel(row) {
        this.axiosDel([row]);
      },
      showDocDetail(row) {
        this.curDoc = Object.assign({}, row);
        this.docDetailDialogFlag = true;
      }
    },
    components: {
      docAddDialog,
      docDetailDialog
    }
  }
</script>

<style lang="stylus">
  .assetDocList
    .topRow
      margin-bottom -31px
    .docName
      text-decoration none
      &:hover
        cursor pointer
        text-decoration underline
</style>
