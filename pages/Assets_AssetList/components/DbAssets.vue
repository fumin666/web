<template>
  <section id="DbAssets">
    <s-row class="operateChunk">
      <s-col class="left-float">
        <s-dropdown trigger="click" @on-click="add" placement="bottom-start">
          <s-button icon="plus">添加</s-button>
          <s-dropdown-menu slot="list">
            <s-dropdown-item name="table">表和视图</s-dropdown-item>
            <s-dropdown-item name="col">字段</s-dropdown-item>
            <s-dropdown-item name="val">值</s-dropdown-item>
            <s-dropdown-item name="procedure">存储过程</s-dropdown-item>
          </s-dropdown-menu>
        </s-dropdown>
        <s-button icon="delete" @click="clearAsset">清空资产</s-button>
        <s-button icon="receive" @click="immediateObtain" :disabled="sendDisable">立即获取数据库资产</s-button>
      </s-col>
      <s-col span="10" class="right-float">
        <s-select v-model="searchType">
          <s-option label="表和视图/备注" value="table"></s-option>
          <s-option label="字段/备注" value="col"></s-option>
          <s-option label="值/备注" value="val"></s-option>
          <s-option label="存储过程/备注" value="procedure"></s-option>
        </s-select>
        <s-input
          v-model="searchValue"
          icon="magnifier"
          :on-icon-click="search"
          @keyup.enter.native="search">
        </s-input>
      </s-col>
    </s-row>
    <s-row>
      <page-infinite-table
        loading-text="正在加载中"
        :row-class-name="currentRowClass"
        :start-ajax="startAjax"
        :ajax-obj="axiosTableObj"
        @row-click="rowClick"
        @load-callback="tableLoadCb">
        <s-table-column label="表和视图">
          <s-table-column prop="tableName" label="表名">
          </s-table-column>
          <s-table-column prop="comment" label="备注">
          </s-table-column>
          <s-table-column prop="level" label="敏感度">
            <template slot-scope="scope">
              {{scope.row.level | filterSensitivity}}
            </template>
          </s-table-column>
          <s-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" @click.stop="dbRowEdit(scope.row, 'table')" title="编辑"></i>
            </template>
          </s-table-column>
        </s-table-column>
      </page-infinite-table>
    </s-row>
    <s-row :gutter="10">
      <s-col span="14">
        <page-infinite-table
          loading-text="正在加载中"
          :row-class-name="currentRowClass"
          :start-ajax="startAjax && Object.keys(tableCurRow).length > 0"
          :ajax-obj="axiosColObj"
          @row-click="rowClick"
          @load-callback="colLoadCb">
          <s-table-column label="字段">
            <s-table-column prop="colName" label="字段名">
            </s-table-column>
            <s-table-column prop="comment" label="备注">
            </s-table-column>
            <s-table-column prop="level" label="敏感度">
              <template slot-scope="scope">
                {{scope.row.level | filterSensitivity}}
              </template>
            </s-table-column>
            <s-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <i class="iconfont icon-edit" @click.stop="dbRowEdit(scope.row, 'table')" title="编辑"></i>
              </template>
            </s-table-column>
          </s-table-column>
        </page-infinite-table>
      </s-col>
      <s-col span="10">
        <page-infinite-table
          loading-text="正在加载中"
          :row-class-name="currentRowClass"
          :start-ajax="startAjax && Object.keys(colCurRow).length > 0"
          :ajax-obj="axiosValObj"
          @row-click="rowClick"
          @load-callback="valLoadCb">
          <s-table-column label="值">
            <s-table-column prop="valName" label="值名">
            </s-table-column>
            <s-table-column prop="comment" label="备注">
            </s-table-column>
            <s-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <i class="iconfont icon-edit" @click.stop="dbRowEdit(scope.row, 'table')" title="编辑"></i>
              </template>
            </s-table-column>
          </s-table-column>
        </page-infinite-table>
      </s-col>
    </s-row>
    <s-row>
      <page-infinite-table
        loading-text="正在加载中"
        :row-class-name="currentRowClass"
        :start-ajax="startAjax"
        :ajax-obj="axiosProcedureObj"
        @row-click="rowClick"
        @load-callback="proLoadCb">
        <s-table-column label="存储过程">
          <s-table-column prop="procedureName" label="存储过程名">
          </s-table-column>
          <s-table-column prop="comment" label="备注">
          </s-table-column>
          <s-table-column prop="level" label="敏感度">
            <template slot-scope="scope">
              {{scope.row.level | filterSensitivity}}
            </template>
          </s-table-column>
          <s-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" @click.stop="dbRowEdit(scope.row, 'table')" title="编辑"></i>
            </template>
          </s-table-column>
        </s-table-column>
      </page-infinite-table>
    </s-row>

    <db-add-dialog
      v-if="dbAddDialogFlag" v-model="dbAddDialogFlag"
      :db-add-obj="dbAddObj" :db-edit-obj="editRow" @reload="reloadDb">
    </db-add-dialog>
    <!--导入-->
    <import-dialog v-if="dbImportDialogFlag" v-model="dbImportDialogFlag" :save-log="true"
                   :upload-obj="uploadObj" :down-obj="downObj" @reload="initData"
                   :file-types="['xls', 'xlsx']"
    ></import-dialog>
    <get-socket v-if="socketFlag" :name-space="nameSpace" ref="socket"
                @message-callback="messageCallback"></get-socket>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils';
  import dbAddDialog from '@/pages/AssetsMonitor_List/MonitorDialog/DbAddDialog';
  import importDialog from '@/components/importDialog/ImportDialog';
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  import getSocket from '@/components/socketClient/SocketClient'

  export default{
    data() {
      return {
        /* 数据库资产tab相关数据 */
        hasDbData: false,
        searchType: 'table',
        searchValue: '',
        realSearchValue: '',
        dbAddDialogFlag: false,
        dbImportDialogFlag: false,
        uploadObj: {},
        downObj: {},
        startAjax: false,
        axiosTableObj: {
          type: 'post',
          url: '/resourcemanager/assetmanage/databaseasset/getDbaInfoTable',
          params: {
            condition: {}
          }
        },
        axiosColObj: {
          type: 'post',
          url: '/resourcemanager/assetmanage/databaseasset/getDbaInfoColByTableId',
          params: {
            condition: {}
          }
        },
        axiosValObj: {
          type: 'post',
          url: '/resourcemanager/assetmanage/databaseasset/getDbaInfoValByColId',
          params: {
            condition: {}
          }
        },
        axiosProcedureObj: {
          type: 'post',
          url: '/resourcemanager/assetmanage/databaseasset/getDbaInfoProc',
          params: {
            condition: {}
          }
        },
        tableCurRow: {},
        colCurRow: {},
        valCurRow: {},
        procedureCurRow: {},
        editRow: {},
        sendDisable: false,
        socketFlag: false
      }
    },
    props: {
      dbUuid: {
        type: String,
        required: true
      }
    },
    computed: {
      dbAddObj() {
        return {
          dbUuid: this.dbUuid
        }
      }
    },
    components: {
      dbAddDialog,
      pageInfiniteTable,
      getSocket,
      importDialog
    },
    methods: {
      // 批量导入
      importBatch() {
        this.uploadObj = {
          type: 'post',
          url: `/resourcemanager/assetmanage/databaseasset/importdbaasset/${this.dbAddObj.dbUuid}`
        };
        this.downObj = {
          text: '数据库导入模板',
          url: '/resourcemanager/assetmanage/databaseasset/exportdbaassetTemplate'
        };
        this.dbImportDialogFlag = true;
      },
      messageCallback(data) {
        let message = JSON.parse(data.message);
        console.log(message)
        // true 表示成功
        if (message.state) {
          this.reloadDb();
          // 恢复按钮状态
          this.sendDisable = false;
        } else {
          this.$message({showClose: true, message: message.errormsg, type: 'info'});
        }
      },
      // 添加
      add(name) {
        this.editRow = {}
        switch (name) {
          case 'table':
            this.$set(this.dbAddObj, 'type', 'table');
            this.dbAddDialogFlag = true;
            break;
          case 'col':
            if (!this.tableCurRow || Object.keys(this.tableCurRow).length === 0) {
              this.$message({showClose: true, message: '请选择表和视图', type: 'success'});
            } else {
              this.$set(this.dbAddObj, 'type', 'col');
              this.$set(this.dbAddObj, 'tableId', this.tableCurRow.tableId);
              this.dbAddDialogFlag = true;
            }
            break;
          case 'val':
            if (!this.tableCurRow || Object.keys(this.tableCurRow).length === 0) {
              this.$message({showClose: true, message: '请选择表和视图', type: 'success'});
            } else if (!this.colCurRow || Object.keys(this.colCurRow).length === 0) {
              this.$message({showClose: true, message: '请选择字段', type: 'success'});
            } else {
              this.$set(this.dbAddObj, 'type', 'val');
              this.$set(this.dbAddObj, 'tableId', this.tableCurRow.tableId);
              this.$set(this.dbAddObj, 'colId', this.colCurRow.colId);
              this.dbAddDialogFlag = true;
            }
            break;
          case 'procedure':
            this.$set(this.dbAddObj, 'type', 'procedure');
            this.dbAddDialogFlag = true;
            break;
        }
      },
      // 导出
      db_export () {
        // 只要表/存储过程有数据就可以导出
        if (Object.keys(this.tableCurRow).length === 0 && Object.keys(this.procedureCurRow).length === 0) {
          this.$message({showClose: true, message: '请选择数据库资产', type: 'error'});
          return;
        }
        Download(`/resourcemanager/assetmanage/databaseasset/expordbatasset/${this.dbAddObj.dbUuid}`);
      },
      // 清空资产
      clearAsset() {
        this.$confirm('确定清空资产？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/resourcemanager/assetmanage/databaseasset/clearDbaAssetInfo/${this.dbUuid}`).then(({data}) => {
            if (data < 0) {
              this.$message({showClose: true, message: '删除失败', type: 'error'});
            } else {
              this.$message({showClose: true, message: '删除成功', type: 'success'});
              this.reloadDb()
            }
          })
        }).catch(() => {});
      },
      // 立即获取数据库资产
      immediateObtain() {
        $axios.get(`/resourcemanager/assetmanage/databaseasset/immediateObtain/${this.dbUuid}`).then(({data}) => {
          if (data.errcode === '0') {
            this.sendDisable = true;
            this.$message({showClose: true, message: '已经发起获取请求，请稍等！', type: 'success'});
          } else {
            this.$message({showClose: true, message: '立即获取失败！', type: 'error'});
          }
        });
      },
      // 查询搜索
      search() {
        switch (this.searchType) {
          case 'table':
            this.axiosTableObj.params.condition = {
              dbuuid: this.dbUuid,
              queryValue: this.searchValue
            };
            break;
          case 'col':
            this.axiosColObj.params.condition = {
              tableId: this.tableCurRow.tableId,
              queryValue: this.searchValue
            };
            break;
          case 'val':
            this.axiosValObj.params.condition = {
              colId: this.colCurRow.colId,
              queryValue: this.searchValue
            };
            break;
          case 'procedure':
            this.axiosProcedureObj.params.condition = {
              dbuuid: this.dbUuid,
              queryValue: this.searchValue
            };
            break;
        }
      },
      /* 行操作 */
      rowClick(row) {
        if (row.hasOwnProperty('procedureId')) {
          this.procedureCurRow = Object.assign({}, row);
        } else if (row.hasOwnProperty('valId')) {
          this.valCurRow = Object.assign({}, row);
        } else if (row.hasOwnProperty('colId')) {
          this.colCurRow = Object.assign({}, row);
          this.axiosValObj.params.condition.colId = this.colCurRow.colId;
        } else {
          this.tableCurRow = Object.assign({}, row);
          this.axiosColObj.params.condition.tableId = this.tableCurRow.tableId;
        }
      },
      dbRowEdit(row, flag) {
        this.editRow = Object.assign({}, row);
        this.dbAddDialogFlag = true;
      },
      currentRowClass(row) {
        if (row.hasOwnProperty('procedureId')) {
          if (this.procedureCurRow && row.procedureId === this.procedureCurRow.procedureId) {
            return 'current-row';
          }
        } else if (row.hasOwnProperty('valId')) {
          if (this.valCurRow && row.valId === this.valCurRow.valId) {
            return 'current-row';
          }
        } else if (row.hasOwnProperty('colId')) {
          if (this.colCurRow && row.colId === this.colCurRow.colId) {
            return 'current-row';
          }
        } else {
          if (this.tableCurRow && row.tableId === this.tableCurRow.tableId) {
            return 'current-row';
          }
        }
      },
      tableLoadCb(list) {
        this.tableCurRow = list[0] || {};
        this.axiosColObj.params.condition = {
          tableId: this.tableCurRow.tableId
        };
      },
      colLoadCb(list) {
        this.colCurRow = list[0] || {};
        this.axiosValObj.params.condition = {
          colId: this.colCurRow.colId
        }
      },
      valLoadCb(list) {
        this.valCurRow = list[0] || {};
      },
      proLoadCb(list) {
        this.procedureCurRow = list[0] || {};
      },
      reloadDb(flag) {
        switch (flag) {
          case 'table':
            this.axiosTableObj.params.condition = {
              dbuuid: this.dbUuid
            };
            break;
          case 'col':
            this.axiosColObj.params.condition = {
              tableId: this.tableCurRow.tableId
            };
            break;
          case 'val':
            this.axiosValObj.params.condition = {
              colId: this.colCurRow.colId
            };
            break;
          case 'procedure':
            this.axiosProcedureObj.params.condition = {
              dbuuid: this.dbUuid
            };
            break;
          default:
            this.axiosTableObj.params.condition = {
              dbuuid: this.dbUuid
            };
            this.axiosProcedureObj.params.condition = {
              dbuuid: this.dbUuid
            };
            break;
        }
      },
      initData() {
        this.tableCurRow = {};
        this.colCurRow = {};
        this.valCurRow = {};
        this.procedureCurRow = {};
        this.startAjax = true;
        this.axiosTableObj.params.condition = {
          dbuuid: this.dbUuid
        };
        this.axiosProcedureObj.params.condition = {
          dbuuid: this.dbUuid
        };
      }
    },
    filters: {
      filterSensitivity(val) {
        switch (val) {
          case 0:
            return '低';
          case 1:
            return '中';
          case 2:
            return '高';
        }
      }
    },
    created() {
      this.initData();
      // 创建聊天室
      this.nameSpace = 'dbassetObtain'
      $axios.get('/iamUserInfo/createPageConnection/dbassetObtain').then(({data}) => {
        this.socketFlag = true;
      });
      // 判断立即获取数据库资产按钮是否可用  0-启用按钮；1-禁用按钮
      $axios.get(`/resourcemanager/assetmanage/databaseasset/obtainStatus/${this.dbUuid}`).then(({data}) => {
        if (data.data.status === 1) {
          this.sendDisable = true;
        } else {
          this.sendDisable = false;
        }
      });
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .dbTab
    & > .s-row
      margin-bottom 10px
    .s-table-body-wrapper
      overflow-x: hidden
  .operateChunk
    .left-float
      float: left
    .right-float
      float: right
      text-align right
      & > .s-input
        width: auto
</style>
