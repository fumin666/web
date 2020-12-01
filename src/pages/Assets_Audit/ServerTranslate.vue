<template>
  <div class="serverTranslate">
    <s-row class="topRow">
      <s-button @click="delBatch" icon="del-task">删除</s-button>
      <s-button @click="delNoTranslate" icon="del-un-translate">删除未翻译业务</s-button>
      <s-button @click="delAll" icon="delete">全部删除</s-button>
    </s-row>
    <s-table-page :data="list"  :header-search="searchDef()"
                 @selection-change="selectionChange">
      <s-table-column type="selection" width="80" align="center"></s-table-column>
      <s-table-column type="index" width="80" align="center"></s-table-column>
      <s-table-column prop="patName" label="业务名称" show-overflow-tooltip></s-table-column>
      <s-table-column prop="patParam" label="参数" show-overflow-tooltip></s-table-column>
      <s-table-column prop="remarks" label="翻译名称" width="200" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <i class="iconfont icon-batch-add" @click="rowCopy(scope.row)" title="克隆"></i>
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <translate-edit-dialog v-if="editDialogFlag"  v-model="editDialogFlag"
                           :cur-trans="curTrans" :type="handleType" @reload="axiosList">
    </translate-edit-dialog>

  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  import translateEditDialog from './AuditDialog/SvTranslateEditDialog';

  export default {
    data() {
      return {
        editDialogFlag: false,
        list: [],
        selections: [],
        curTrans: {},
        handleType: ''
      }
    },
    computed: {
      appId() {
        return this.$route.params.appId;
      }
    },
    created() {
      this.axiosList();
    },
    methods: {
      searchDef() {
        return {
          show: false
        }
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      // 顶部操作按钮------------------------------------
      delBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择业务!', type: 'info'});
          return;
        }
        let param = this.selections.map(item => {
          return item.patId;
        });
        this.axiosDel(param);
      },
      delNoTranslate() {
        $axios.get(`/sysDbauditBusiness/delNotTranslatesByAppid/${this.appId}`).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '删除未翻译的内容成功!', type: 'success'});
            this.axiosList();
          } else {
            this.$message({showClose: true, message: '删除未翻译的内容失败!', type: 'error'});
          }
        })
      },
      delAll() {
        $axios.get(`/sysDbauditBusiness/delAllTranslatesByAppid/${this.appId}`).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '删除成功!', type: 'success'});
            this.axiosList();
          } else {
            this.$message({showClose: true, message: '删除失败!', type: 'error'});
          }
        });
      },
      // 行内操作按钮------------------------------------
      rowCopy(row) {
        this.curTrans = row;
        this.handleType = 'clone';
        this.editDialogFlag = true;
      },
      rowEdit(row) {
        this.curTrans = row;
        this.handleType = 'edit';
        this.editDialogFlag = true;
      },
      rowDel(row) {
        this.axiosDel([row.patId]);
      },
      axiosList() {
        let param = {
          condition: {
            appId: this.appId
          }
        };
        $axios.post(`/sysDbauditBusiness/getTranslateList`, param).then(({data}) => {
          this.list = data;
        });
      },
      axiosDel(param) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post(`/sysDbauditBusiness/delTranslateByIds`, param).then(({data}) => {
            if (data === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.axiosList();
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    components: {
      translateEditDialog
    }
  }
</script>

<style lang="stylus">
  .serverTranslate
    padding 15px
</style>
