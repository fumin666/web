<template>
  <section id="two-content">
    <s-table-page
      :data="lists"
      :header-search="getSearchDef()"
      :header-actions="getListActionsDef()"
      :row-actions="getRowActionsDef()"
      @selection-change="handleSelectionChange"
      actions-col-width="150">
      <s-table-column
        type="selection"
        width="45">
      </s-table-column>
      <s-table-column
        property="title"
        label="主题"
        width="220">
      </s-table-column>
      <s-table-column
        property="announceTypeStr"
        label="类型"
        width="120">
      </s-table-column>
      <s-table-column
        property="userName"
        label="发布人"
        width="120">
      </s-table-column>
      <s-table-column
        property="createTime"
        label="发布时间"
        width="320">
      </s-table-column>
      <s-table-column
        property="content"
        label="内容">
      </s-table-column>
    </s-table-page>
    <s-dialog
      v-model="announceDialog"
      v-if="announceDialog"
      title="发布公告">
      <add-announce ref="announce"></add-announce>
      <template slot="footer">
        <s-button @click="announceSave">保存</s-button>
        <s-button type="cancel" @click="announceDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="editAnnounceDialog"
      v-if="editAnnounceDialog"
      title="修改公告">
      <add-announce ref="announceEdit" :show='1' :editData='editdata'></add-announce>
      <template slot="footer">
        <s-button @click="announceEdit">保存</s-button>
        <s-button type="cancel" @click="editAnnounceDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="viewAnnounceDialog"
      v-if="viewAnnounceDialog"
      title="查看公告">
      <view-announce ref="announceEdit" :editData='editdata'></view-announce>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import addAnnounce from './AddAnnounce'
  import viewAnnounce from './ViewAnnounce'
  import {batchUuid} from 'sunflower-common-utils'

  export default {
    data() {
      return {
        lists: [],
        announceDialog: false,
        viewAnnounceDialog: false,
        editAnnounceDialog: false,
        multipleSelection: [],
        batchUuids: [],
        editdata: {}
      }
    },
    components: {
      addAnnounce,
      viewAnnounce
    },
    created() {
      this.getList()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.batchUuids = batchUuid('uuid', this.multipleSelection)
      },
      getList() {
        $axios.get('/systemmanager/otherConfig/sysAnnouncement/list').then(response => {
          this.lists = response.data.map((obj) => {
            obj.announceTypeStr = obj.announceType === 0 ? '站内公告' : '站外公告';
            return obj;
          });
        });
      },
      getRowActionsDef() {
        let vm = this;
        return [{
          name: '查看',
          icon: 'eye',
          click: (row) => {
            $axios.get(`/systemmanager/otherConfig/sysAnnouncement/getAnnounceByUuid/${row.uuid}`).then((res) => {
              vm.viewAnnounceDialog = true
              vm.editdata = res.data
            })
          }
        }, {
          name: '修改',
          icon: 'edit',
          click: (row) => {
            $axios.get(`/systemmanager/otherConfig/sysAnnouncement/getAnnounceByUuid/${row.uuid}`).then((res) => {
              vm.editAnnounceDialog = true
              vm.editdata = res.data
            })
          }
        }, {
          name: '删除',
          icon: 'delete',
          click: (row) => {
            vm.$confirm('确定删除公告？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              $axios.post('/systemmanager/otherConfig/sysAnnouncement/delete', [row.uuid], {
                data: [row],
                logTemplate: '删除|(#title#)'
              }).then((res) => {
                if (res.data === 'success') {
                  vm.$message({type: 'success', message: '删除成功'});
                  vm.getList();
                }
              });
            }).catch(() => {});
          }
        }]
      },
      getListActionsDef() {
        let self = this
        return {
          actions: [{
            name: '添加',
            click: function() {
              self.announceDialog = true
            },
            icon: 'plus'
          }, {
            name: '批量删除',
            click: function() {
              if (self.batchUuids.length === 0) {
                self.$message({type: 'info', message: '请至少选择一个'});
                return false
              }
              self.$confirm('确定全部删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                $axios.post('/systemmanager/otherConfig/sysAnnouncement/delete', self.batchUuids, {
                  data: self.multipleSelection,
                  logTemplate: '删除|(#title#)'
                }).then((res) => {
                  if (res.data === 'success') {
                    self.$message({type: 'success', message: '批量删除成功'});
                    self.getList();
                  }
                });
              }).catch(() => {});
            },
            icon: 'batch-del'
          }]
        }
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入主题、类型、发布人、发布时间、内容进行查询',
          searchProps: ['title', 'userName', 'announceTypeStr', 'createTime', 'content'] // can be string or Array
        }
      },
      announceSave() {
        let formObj = this.$refs['announce'].$refs['addAnnounceForm']
        let form = this.$refs['announce'].addForm
        formObj.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post('/systemmanager/otherConfig/sysAnnouncement/save', form, {
            data: [{title: form.title}],
            logTemplate: '发布|(#title#)'
          }).then((res) => {
            if (res.data === 'success') {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.getList()
              this.announceDialog = false
            }
          });
        })
      },
      announceEdit() {
        let formObj = this.$refs.announceEdit.$refs['addAnnounceForm']
        let form = this.$refs.announceEdit.addForm
        formObj.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post('/systemmanager/otherConfig/sysAnnouncement/saveEditAnnounce', form, {
            data: [{title: form.title}],
            logTemplate: '编辑|(#title#)'
          }).then((res) => {
            if (res.data === 'success') {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.getList()
              this.editAnnounceDialog = false
            }
          });
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #two-content
    margin 20px
</style>
