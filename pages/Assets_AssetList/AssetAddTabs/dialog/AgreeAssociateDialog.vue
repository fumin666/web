/**
* Created by songyf on 2019/4/3.
* 资产管理详情-协议设置-关联弹窗
*/
<template>
  <div class="AgreeAssociateForm">
    <s-scrollbar wrap-class="minHeightScrollbar">
      <s-row class="left-btn">
        <s-button @click="addAgree">添加</s-button>
        <s-dialog v-model="addAgreeDialog" v-if="addAgreeDialog" :title= "isEdit?'编辑':'添加'" width="750px" class="addAgree" append-to-body>
          <add-agree-dialog :agreeAssociated="agreeAssociated" :curAsset="curAsset" :currentRow="currentRow" :isEdit="isEdit" @closeAddAgree="closeAddAgree"></add-agree-dialog>
        </s-dialog>
      </s-row>
      <s-row>
        <s-table-page :data="configList"
                     :row-actions='rowActionsDef()'
        >
          <s-table-column prop="dbname" label="实例名" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="tnsInfo" label="TNS信息" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="remark" label="备注" show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
      </s-row>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import addAgreeDialog from './addAgreeDialog';

  export default {
    data() {
      return {
        addAgreeDialog: false,
        isEdit: false,
        currentRow: {},
        configList: []
      }
    },
    props: {
      agreeAssociated: {
        type: Object,
        required: true
      },
      curAsset: {
        type: Object,
        default: {}
      }
    },
    created () {
      this.getTab1eList();
    },
    methods: {
      getTab1eList() {
        $axios.get(`/databaseDbname/getDbnameListByPortUuid/${this.agreeAssociated.uuid}`).then((res) => {
          if (res.data) {
            this.configList = res.data;
          } else {
            this.configList = []
          }
        });
      },
      addAgree() {
        this.isEdit = false;
        this.currentRow = {};
        this.addAgreeDialog = true
      },
      closeAddAgree() {
        this.getTab1eList();
        this.addAgreeDialog = false
      },
      // 表格相关--------------------------------------------------------------
      rowActionsDef() {
        let vm = this;
        return [
          {
            icon: 'edit',
            name: '编辑',
            click: (row) => {
              vm.rowEdit(row)
            }
          }, {
            icon: 'delete',
            name: '删除',
            click: (row) => {
              vm.rowDel(row)
            }
          }];
      },
      nullFunc() {
        return null
      },
      rowEdit (row) {
        this.currentRow = Object.assign({}, row);
        this.isEdit = true;
        this.addAgreeDialog = true;
      },
      rowDel (row) {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          let deleteArr = row.uuid;
          $axios.get(`/databaseDbname/deleteDbnameByUuid/${deleteArr}`).then((res) => {
            if (res.data.state) {
              this.$message({showClose: true, message: '删除成功', type: 'success'});
              this.getTab1eList();
            } else {
              this.$message({showClose: true, message: '删除失败', type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    components: {
      addAgreeDialog
    }
  }
</script>

<style lang="stylus" scoped>
  .AgreeAssociateForm
    .minHeightScrollbar{
      max-height: 300px;
    }
    .footerRow{
      text-align : right;
      margin : 15px 0 5px 0
    }
</style>

