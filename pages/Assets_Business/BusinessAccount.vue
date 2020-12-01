/**
* Created by fumin on 2019/5/5.
*/
<template>
  <section >
    <s-row :gutter="10">
      <s-col :span="4" class="noPrint">
        <s-tab v-model="activeTab">
          <s-tab-pane label="业务系统">
            <ul class="business-ul" :v-model="activeTabs">
              <li :class="activeTabs === index ? 'activeLi' : 'business-li'"
                  :key="business.uuid" v-for="(business,index) in businessRole"
                  @click="handleNodeClick(business.uuid,index)"
              >
                <span slot="label"><img src="../../../static/images/asseticon/files.png" alt="" style="vertical-align: middle;"> {{business.name}}</span>
              </li>
            </ul>
          </s-tab-pane>
        </s-tab>
      </s-col>
      <s-col :span="20">
        <div class="listChunk">
          <s-row style="float:left;">
              <s-button icon="plus" @click="addHandler">添加</s-button>
              <s-button icon="union" @click="batchUnionHandler">批量同步</s-button>
              <s-button icon="batch-import" @click="importBatch">批量导入</s-button>
              <s-button icon="batch-export" @click="batchCloseHandler">批量导出</s-button>
          </s-row>
          <s-table-page
            :data="assetList"
            @selection-change="selectionChange"
            ref="assetListTable"
            :header-search="getSearchDef()"
            >
            <s-table-column type="selection" width="45" align="center"></s-table-column>
            <s-table-column prop="name" label="账号名称"></s-table-column>
            <s-table-column prop="bRoleName" label="业务角色"></s-table-column>
            <s-table-column prop="classify" label="账号分类"></s-table-column>
            <s-table-column prop="status" label="状态"></s-table-column>
            <s-table-column label="操作" width="250" align="center">
              <template slot-scope="scope">
                <i class="iconfont icon-eye" @click="viewConfigBase(scope.row)" title="查看"></i>
                <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
                <i class="iconfont icon-tool" @click="rowUnion(scope.row)" title="同步"></i>
                <i class="iconfont icon-delete" @click="rowDelete(scope.row)" title="删除"></i>
              </template>
            </s-table-column>
          </s-table-page>
        </div>
      </s-col>
    </s-row>
    <!--查看-->
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      title="查看业务账号"
      width="900px"
    >
      <view-dialog :viewRow="viewRow"></view-dialog>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="600px"
      title="编辑业务账号">
      <add-dialog ref="editDialogComponent" :sysUuid="currentUuid" :editData="editData"></add-dialog>
      <template slot="footer">
        <s-button @click="editSave">保存</s-button>
        <s-button type="cancel" @click="editDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--添加-->
    <s-dialog
      v-model="addDialog"
      v-if="addDialog"
      width="600px"
      title="添加业务账号">
      <add-dialog ref="addComponent" :sysUuid="currentUuid"></add-dialog>
      <template slot="footer">
        <s-button @click="addSave">保存</s-button>
        <s-button type="cancel" @click="addDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!-- 导入 -->
    <Import-Dialog v-if="importDialogFlag" v-model="importDialogFlag" :uploadObj="uploadObj" :downObj="downObj"
                   ></Import-Dialog>
  </section>
</template>

<script>
  import viewDialog from './dialog/viewDialog'
  import ImportDialog from '@/components/importDialog/ImportDialog';
  import { Download, base64 } from 'sunflower-common-utils'
  import addDialog from './dialog/addDialog'
  import $axios from 'sunflower-ajax';
  // import inputTree from '@/components/inputTree/InputTree';
  import {cloneDeep} from 'lodash';
  export default {
    data() {
      return {
        businessRole: [],
        activeTab: 0,
        activeTabs: 0,
        assetList: [],
        selections: [],
        viewRow: {},
        viewDialog: false,
        editDialog: false,
        addDialog: false,
        batchEditDialog: false,
        editData: '',
        currentUuid: '',
        importDialogFlag: false,
        uploadObj: {
          url: 'iamBusinessAccount/importBusinessAccount',
          type: 'get'
        },
        downObj: {
          url: 'iamBusinessAccount/importBusinessAccountTemplate',
          text: '批量导入业务账号模板'
        }
      }
    },
    components: {
      viewDialog,
      addDialog,
      // inputTree,
      ImportDialog
    },
    mounted() {
      // this.axiosAssetList(this.currentUuid)
      this.getbusiness()
    },
    methods: {
      getbusiness() {
        $axios.get(`/iamBusinessSystem/list`).then(({data}) => {
          this.businessRole = data
          this.currentUuid = this.businessRole[0].uuid
          this.axiosAssetList(this.currentUuid)
      })
      },
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['name', 'bRoleName', 'classify', 'status'] // can be string or Array
        }
      },
      axiosAssetList(uuid) {
        $axios.get(`/iamBusinessAccount/list/${uuid}`).then((res) => {
          this.assetList = res.data;
        });
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      // 顶部按钮-----------------------------------------------------------------------------------
      addHandler() {
        if (this.businessRole.length) {
          this.addDialog = true
        } else {
          this.$message.warning('必须选择业务系统！');
        }
      },
      addSave() {
        let form = cloneDeep(this.$refs['addComponent'].form)
        form.bSystemUuid = this.currentUuid
        let encrypt = new base64()
        form.passWord === '' ? form.passWord = '' : form.passWord = encrypt.encode(form.passWord)
        this.$refs['addComponent'].$refs['formRef'].validate(valid => {
          if (!valid) {
            return false;
          }
          $axios.post('/iamBusinessAccount/add', form).then((res) => {
            if (res.data.state) {
              this.$message.success(res.data.errormsg);
              this.axiosAssetList(this.currentUuid);
              this.addDialog = false
            } else {
              this.$message.error(res.data.errormsg);
            }
          })
        })
      },
      batchUnionHandler() {
        this.$message({
          type: 'info',
          message: '暂无可对接业务系统'
        })
        // if (this.selections.length === 0) {
        //   this.$message.error('至少选中一个')
        // } else {
        //   this.batchEditDialog = true
        // }
      },
      batchCloseHandler() {
        if (this.selections.length === 0) {
          this.$message.error('至少选中一个')
        } else {
          this.$confirm('确定导出?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
            let emportuuid = [...this.selections.map(item => item.uuid)]
            let uuidstr = ''
            emportuuid.forEach(val => {
              uuidstr += val + ','
            })
            if (uuidstr.length > 0) {
              uuidstr = uuidstr.substr(0, uuidstr.length - 1)
            }
              Download(`iamBusinessAccount/exportBusinessAccount/${uuidstr}`);
          }).catch(() => {
          });
        }
      },
      importBatch() {
        this.importDialogFlag = true
      },
      closeMonitor(uuids) {
        $axios.post('/syslogAuditSetting/batchCloseAudit', uuids).then((res) => {
          if (res.data.state) {
            this.$message.success(res.data.errormsg);
            // this.axiosAssetList();
          } else {
            this.$message.error(res.data.errormsg);
          }
        })
      },
      batchDeleteHandler() {
        if (this.selections.length === 0) {
          this.$message.error('至少选中一个')
        } else {
          let uuid = this.selections.map(item => (item.uuid))
          this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post('/iamBusinessAccount/delete', uuid).then(({data}) => {
              if (data.state) {
                this.$message({showClose: true, message: '删除成功!', type: 'success'});
                this.axiosAssetList(this.currentUuid);
              } else {
                this.$message({showClose: true, message: '删除失败!', type: 'error'});
              }
            });
          }).catch(() => {});
        }
      },
      // 行内图标按钮操作
      viewConfigBase(row) {
        this.viewRow = row.uuid
        this.viewDialog = true
      },
      rowEdit(rowData) {
        this.editData = rowData
        this.editDialog = true
      },
      editSave() {
        let form = cloneDeep(this.$refs['editDialogComponent'].form)
        form.bSystemUuid = this.currentUuid
        form.uuid = this.editData.uuid
        let encrypt = new base64()
        form.passWord === '' ? form.passWord = '' : form.passWord = encrypt.encode(form.passWord)
        this.$refs['editDialogComponent'].$refs['formRef'].validate(valid => {
          if (!valid) {
            return false;
          }
          $axios.post('/iamBusinessAccount/update', form).then((res) => {
            if (res.data.state) {
              this.$message.success(res.data.errormsg);
              this.axiosAssetList(this.currentUuid);
              this.editDialog = false
            } else {
              this.$message.error(res.data.errormsg);
            }
          })
        })
      },
      rowUnion(row) {
        this.$message({
          type: 'info',
          message: '暂无可对接业务系统'
        })
      },
      rowDelete(row) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          let param = [row.uuid]
          $axios.post('/iamBusinessAccount/delete', param).then(({data}) => {
            if (data.state) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.axiosAssetList(this.currentUuid);
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {});
      },
      handleNodeClick(uuid, index) {
        this.activeTabs = index
        this.currentUuid = uuid
        this.axiosAssetList(uuid);
      }
    }
  }
</script>

<style scoped lang="stylus">
 .listChunk .s-table span.ip
      cursor pointer
 .business-ul .business-li{
   padding: 10px
   cursor pointer
 }
   .business-ul li{
     font-size:14px
   }
 .business-ul .business-li:hover{
   background: #e5e5e5
 }
   .business-ul .activeLi{
     color: #ffa954;
     padding: 10px
     cursor pointer
   }
 .content .listChunk .searchBtChunk
    margin-bottom: -2%;
</style>
