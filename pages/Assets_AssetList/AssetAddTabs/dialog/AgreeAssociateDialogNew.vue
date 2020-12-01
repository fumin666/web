/**
* Created by songyf on 2019/4/3.
* 资产管理详情-协议设置-关联弹窗
*/
<template>
  <div class="AgreeAssociateForm">
    <s-scrollbar wrap-class="minHeightScrollbar">
      <s-row class="left-btn">
        <s-button @click="addAgree">添加</s-button>
        <s-dialog v-model="addAgreeDialog" v-if="addAgreeDialog" :title= "isEdit?'编辑':'添加'" width="700px" class="addAgree" append-to-body>
          <add-agree-dialog :agreeAssociated="agreeAssociated" :currentRow="currentRow" :isEdit="isEdit" @closeAddAgree="closeAddAgree"></add-agree-dialog>
        </s-dialog>
      </s-row>
      <s-row>
        <s-table-page :data="configList"
                     highlight-current-row
                     :row-actions='rowActionsDef()'
                     ref="configList"
        >
          <s-table-column width="100" center label="单选">
            <template slot-scope="scope">
              <s-radio class="radioType" v-model="radio" :label="scope.row.id" @change="getCurrentRow(scope.row)"></s-radio>
            </template>
          </s-table-column>
          <s-table-column prop="dbname" label="实例名" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="tnsInfo" label="TNS信息" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="remark" label="备注" show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
      </s-row>
    </s-scrollbar>
    <s-row class="footerRow">
      <s-button @click="saveDb()">保存</s-button>
      <s-button type="cancel" @click="cancelDb">取消</s-button>
    </s-row>
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
        configList: [],
        radio: '',
        selectedOperations: {}
      }
    },
    props: {
      agreeAssociated: {
        type: Object,
        required: true
      },
      associateRow: {
        type: Object
      }
    },
    created () {
      this.getTab1eList();
    },
    methods: {
      getTab1eList() {
        $axios.get(`/databaseDbname/getDbnameListForAccount/${this.agreeAssociated.uuid}/${this.associateRow.uuid}`).then((res) => {
          if (res.data) {
            this.configList = res.data;
            this.configList.forEach(item => { // 根据数据中的hasAuthed默认选中
              if (item.hasAuthed === true) {
                this.getCurrentRow(item)
              }
            });
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
      saveDb () {
        this.$emit('saveDb', this.selectedOperations)
      },
      cancelDb () {
        this.$emit('cancelDb')
      },
      getCurrentRow(row) { // 获取单选框选中行的data
        if (row.hasAuthed) {
          this.radio = row.id
        }
        this.selectedOperations = row
      },
      // 表格相关--------------------------------------------------------------
      rowActionsDef() {
        return [
          {
            icon: 'edit',
            name: '编辑',
            click: this.disEdit ? this.nullFunc : this.rowEdit
          }, {
            icon: 'delete',
            name: '删除',
            click: this.disEdit ? this.nullFunc : this.rowDel
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
        })
      }
    },
    components: {
      addAgreeDialog
    }
  }
</script>

<style>
  .radioType .s-radio__label{
    display: none;
  }
  .AgreeAssociateForm .minHeightScrollbar{
      max-height: 300px;
  }
  .AgreeAssociateForm .footerRow{
      text-align : right;
      margin : 15px 0 5px 0
  }
</style>

