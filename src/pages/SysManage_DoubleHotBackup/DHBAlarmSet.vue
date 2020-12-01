/*
create by YOU
*/
<template>
  <div class="DHB-alarm-set">
    <s-table-page
      :data="data"
      :header-search="getSearch()"
      :header-actions="getActionsDef()"
      :row-actions="getRowActionsDef()"
      @selection-change="handleSelectionChange"
      actions-col-width="80">
      <s-table-column width="45" type="selection"></s-table-column>
      <s-table-column width="220" label="名称" prop="name" show-overflow-tooltip></s-table-column>
      <s-table-column width="220" label="通知方式" prop="sendMode" show-overflow-tooltip></s-table-column>
      <s-table-column label="描述" prop="description" show-overflow-tooltip></s-table-column>
    </s-table-page>
    <!-- 新增告警 -->
    <s-dialog
      v-model="addDialog"
      v-if="addDialog"
      width="720px"
      title="新增告警">
        <s-table-page
          @selection-change="handleAlarmFullListChange"
          :header-search="getSearch()"
          :data="fullAlarmData"
          height="420">
          <s-table-column width="45" type="selection" :selectable="selectable"></s-table-column>
          <s-table-column label="名称" prop="name" show-overflow-tooltip></s-table-column>
          <s-table-column label="通知方式" prop="sendMode" show-overflow-tooltip></s-table-column>
          <s-table-column label="描述" prop="description" show-overflow-tooltip></s-table-column>
        </s-table-page>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submit">确定</s-button>
        <s-button @click="addDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看告警-->
    <s-dialog v-model="eyeDialog" v-if="eyeDialog" title="查看告警">
      <alarm-view :data="currentAlarmUuid" :userList="userList"></alarm-view>
    </s-dialog>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  // import alarmForm from './AlarmForm.vue'
  import AlarmView from './AlarmView.vue'
  export default {
    components: {
      // alarmForm,
      AlarmView
    },
    data() {
      return {
        fullAlarmData: [],
        fullAlarmDataSelected: [],
        data: [],
        dataUuidList: [],
        selectionList: [],
        userList: [],
        currentAlarmUuid: '',
        addDialog: false,
        eyeDialog: false
      }
    },
    created() {
      // 请求引用数据
      this.getData()
      this.getUsers()
    },
    watch: {
      data: {
        immediate: true,
        deep: true,
        handler(val) {
          this.dataUuidList = val.map(item => item.uuid)
        }
      }
    },
    methods: {
      getData() {
        $axios.get('/systemmanager/sysConfig/getHaAlarmSendInfo').then(({data}) => {
          this.data = data
        })
      },
      handleAlarmFullListChange(selection) {
        this.fullAlarmDataSelected = selection
      },
      getUsers() {
        $axios.post('/iamUserInfo/list', {}).then((res) => {
          if (res.data && res.data instanceof Array) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].userPhone = res.data[i].userCellphone;
            }
            this.userList = res.data;
            console.log(this.userList)
          }
        });
      },
      getSearch() {
        return {
          width: 6,
          offset: 12,
          placeholder: '请输入查询内容',
          searchProps: ['name', 'sendMode', 'description']
        }
      },
      getActionsDef() {
        let _self = this
        return {
          width: 6,
          actions: [
            {
              name: '新增告警',
              icon: 'plus',
              click() {
                _self.type = 'add'
                $axios.get('/infoSend/list').then(({data}) => {
                  _self.fullAlarmData = data
                  _self.addDialog = true
                })
              }
            },
            {
              name: '删除告警',
              icon: 'delete',
              click() {
                if (_self.selectionList.length > 0) {
                  _self.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    _self.handleDelete(_self.selectionList.map(function (item) {
                      return item.uuid
                    }))
                  }).catch(() => {});
                } else {
                  _self.$message.error('请选择删除项')
                }
              }
            }
          ]
        }
      },
      getRowActionsDef() {
        let _self = this
        return [
          {
            name: '查看',
            icon: 'eye',
            click(row) {
              _self.eyeDialog = true
              _self.currentAlarmUuid = row.uuid
            }
          }
        ]
      },
      selectable(row, index) {
        if (this.dataUuidList.indexOf(row.uuid) === -1) {
          return true
        }
      },
      handleSelectionChange(selection) {
        this.selectionList = selection
      },
      submit(type) {
        if (this.fullAlarmDataSelected && this.fullAlarmDataSelected.length > 0) {
          this.addDialog = false
          $axios.post('/systemmanager/sysConfig/saveSendInfo', this.fullAlarmDataSelected.map(item => item.uuid), {
            logTemplate: '添加|双机热备告警设置'
          }).then(({data}) => {
            if (data === true) {
              this.$message.success('保存成功')
              this.getData()
            } else {
              this.$message.error('保存失败')
            }
          })
        } else {
          this.$message.warning('请选择告警!')
        }
      },
      handleDelete(params) {
        $axios.post('/systemmanager/sysConfig/delete', params, {
          logTemplate: '删除|双机热备告警设置'
        }).then(({data}) => {
          if (data === true) {
            this.$message.success('删除成功')
            this.getData()
          } else {
            this.$message.error('删除失败')
          }
        })
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
