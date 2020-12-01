<template>
  <s-dialog v-model="dialogFlag" title="监控项管理" id="monitorManageDialog" width="800px" :before-close="cancelAction">
    <s-tab :animated="false">
      <s-tab-pane label="自动监控项">
        <s-scrollbar wrap-class="manageDialogScrollbar">
          <s-row class="searchChunk">
            <s-input v-model="filterValue" class="searchInput" placeholder="请输入关键字"></s-input>
            <s-button @click="expandAll">{{expandBtnText}}</s-button>
          </s-row>
          <s-table v-if="itcompTemplate === 'checkport_common'" :data="filterTableData" style="width: 100%"
                   row-key="index"
                   :expand-row-keys="expandKeyArr"
                   @expand-change="expand "
          >
            <s-table-column width='30px' type="expand">

              <template slot-scope="scope">
                <s-row class="expandInfo">
                  <s-col></s-col>
                  <s-col span="8" offset="5">
                    <s-checkbox v-model="scope.row.thresholdIsOpenAll" :true-label="1" :false-label="0"
                                @change="listEventChange(scope.row, $event)">全部产生事件
                    </s-checkbox>
                  </s-col>
                  <s-col span="7">
                    <s-radio-group v-model.number="scope.row.isMonitorAll"
                                   @change="listUseChange(scope.row, $event)">
                      <s-radio :label="1">全启</s-radio>
                      <s-radio :label="0">全禁</s-radio>
                    </s-radio-group>
                  </s-col>
                  <s-col span="3">
                      <s-button @click="delAllList(scope.row)" size="mini">全部删除</s-button>
                  </s-col>
                </s-row>
                <s-row v-for="(item,index) in scope.row.list" :key="index" class="expandInfo">
                  <s-col span="5">
                    <s-tooltip class="item" effect="dark" :content="item.monitorName" placement="top">
                      <div class="monitorName">{{item.monitorName}}</div>
                    </s-tooltip>
                  </s-col>
                  <s-col span="8">
                    <s-checkbox v-model.number="item.thresholdIsOpen" :true-label="1" :false-label="0"
                                @change="itemEventChange(item, scope.row, $event)">异常产生事件
                    </s-checkbox>
                    <s-button @click="changeThreshold(item)" size="mini">修改规则</s-button>
                    <s-button @click="del(item, scope.row, index, scope.row.list)" size="mini">删除</s-button>
                  </s-col>
                  <s-col span="7">
                    <s-radio-group v-model.number="item.isMonitor" @change="itemUseClick(item, scope.row, $event)">
                      <s-radio :label="1">启用</s-radio>
                      <s-radio :label="0">禁用</s-radio>
                    </s-radio-group>
                  </s-col>
                  <s-col span="4">
                    <s-button @click="editList(item,scope.row.list,scope.row)" size="mini">修改</s-button>
                    <s-button @click="delList(item, scope.row, index, scope.row.list)" size="mini">删除</s-button>
                  </s-col>
                </s-row>
              </template>
            </s-table-column>
            <s-table-column width='170px' prop="name" label="标题">
              <template slot-scope="scope">
                <div style="width:100px;float:left" v-text="scope.row.name"></div>
                <i class="iconfont icon-add" @click="add(scope.row)"></i>
              </template>
            </s-table-column>
            <s-table-column label="管理" align="center">
            </s-table-column>
            <s-table-column label="启用/禁用" align="center">
            </s-table-column>
            <s-table-column label="操作" align="center">
            </s-table-column>
          </s-table>
          <s-table v-else :data="filterTableData" style="width: 100%"
                   row-key="index"
                   :expand-row-keys="expandKeyArr"
                   @expand="expand "
          >
            <s-table-column type="expand">

              <template slot-scope="scope">
                <s-row class="expandInfo">
                  <s-col></s-col>
                  <s-col span="8" offset="8">
                    <s-checkbox v-model="scope.row.thresholdIsOpenAll" :true-label="1" :false-label="0"
                                @change="listEventChange(scope.row, $event)">全部产生事件
                    </s-checkbox>
                  </s-col>
                  <s-col span="8">
                    <s-radio-group v-model.number="scope.row.isMonitorAll"
                                   @change="listUseChange(scope.row, $event)">
                      <s-radio :label="1">全启</s-radio>
                      <s-radio :label="0">全禁</s-radio>
                    </s-radio-group>
                  </s-col>
                </s-row>
                <s-row v-for="(item,index) in scope.row.list" :key="index" class="expandInfo">
                  <s-col span="8">
                    <s-tooltip class="item" effect="dark" :content="item.monitorName" placement="top">
                      <div class="monitorName">{{item.monitorName}}</div>
                    </s-tooltip>
                  </s-col>
                  <s-col span="8">
                    <s-checkbox v-model.number="item.thresholdIsOpen" :true-label="1" :false-label="0"
                                @change="itemEventChange(item, scope.row, $event)">异常产生事件
                    </s-checkbox>
                    <s-button @click="changeThreshold(item)" size="mini">修改规则</s-button>
                    <s-button @click="del(item, scope.row, index, scope.row.list)" size="mini">删除</s-button>
                  </s-col>
                  <s-col span="8">
                    <s-radio-group v-model.number="item.isMonitor" @change="itemUseClick(item, scope.row, $event)">
                      <s-radio :label="1">启用</s-radio>
                      <s-radio :label="0">禁用</s-radio>
                    </s-radio-group>
                  </s-col>
                </s-row>
              </template>
            </s-table-column>
            <s-table-column prop="name" label="标题">
            </s-table-column>
            <s-table-column label="管理" align="center">
            </s-table-column>
            <s-table-column label="启用/禁用" align="center">
            </s-table-column>
          </s-table>
        </s-scrollbar>
      </s-tab-pane>
    </s-tab>
    <template slot="footer" class="dialog-footer">
      <s-button @click="manageOk">清除该资产下所有自动监控项</s-button>
      <s-button type="cancel" @click="cancelAction">关闭</s-button>
    </template>
    <add-Configuration :title='portTitle' @upload='upload' :portData='portData' :compId='compId' v-model="addConfiguraDialog" v-if="addConfiguraDialog"></add-Configuration>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import addConfiguration from './AddConfiguration'

  export default {
    data() {
      return {
        dialogFlag: false,
        addConfiguraDialog: false,
        tableData: [],
        expandKeyArr: [],
        filterValue: '',
        expandBtnText: '全部展开',
        portTitle: '',
        portData: {}
      }
    },
    components: {
      addConfiguration
    },
    computed: {
      filterTableData() {
        if (this.filterValue === '') {
          return this.tableData;
        } else {
          let arr = [];
          this.expandKeyArr = [];
          this.tableData.forEach((item, index) => {
            let filterArr = item.list.filter(innerItem => {
              return innerItem.monitorName.indexOf(this.filterValue) !== -1;
            });
            if (filterArr.length > 0) {
              let newItem = Object.assign({}, item);
              newItem.list = filterArr;
              arr.push(newItem);
              this.expandKeyArr.push(index);
            }
          });
          return arr;
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        function getAllFlag(list, key) {
          let arr1 = list.filter(item => {
            return item[key] === 1;
          });
          if (arr1.length === list.length) {
            return 1;
          }
          let arr2 = list.filter(item => {
            return item[key] !== 1;
          });
          if (arr2.length === list.length) {
            return 0;
          }
          return '';
        }
        $axios.post(`/resourcemanager/assetmanage/assetRuning/ciManager/${this.compId}`).then(({data}) => {
          // let arr = [];
          let num = 0;
          for (let i in data) {
            let obj = {};
            obj.index = num++;
            obj.name = i;
            obj.list = data[i];
            obj.thresholdIsOpenAll = getAllFlag(obj.list, 'thresholdIsOpen');
            obj.isMonitorAll = getAllFlag(obj.list, 'isMonitor');
            this.tableData.push(obj);
          }
        });
      },
      expandAll() {
        if (this.expandBtnText === '全部展开') {
          this.expandKeyArr = this.tableData.map(item => {
            return item.index;
          });
          this.expandBtnText = '全部关闭';
        } else {
          this.expandKeyArr = [];
          this.expandBtnText = '全部展开';
        }
      },
      add(row) {
        this.portTitle = '添加'
        this.portData = row
        this.addConfiguraDialog = true
      },
      editList(item, b, c) {
        this.portTitle = '编辑'
        this.portData = item
        this.portData.edit = b
        this.portData.type = c
        this.addConfiguraDialog = true
      },
      delList(item, b, c, d) {
          this.$confirm('确定删除所选内容？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post(`/resourcemanager/assetmanage/assetRuning/batchDeleteSelfDefineItems`, [item.uuid]).then(({data}) => {
              if (data.state === true) {
                this.$message.success('删除监控项成功');
                this.upload()
              } else {
                this.$message.error('删除监控项失败');
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消！'
            })
          })
      },
      upload(val) {
        this.tableData = []
        this.getData()
      },
      delAllList(row) {
          this.$confirm('确定删除所选内容？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let param = []
            console.log(row)
            row.list.map(val => {
              param.push(val.uuid)
            })
            $axios.post(`/resourcemanager/assetmanage/assetRuning/batchDeleteSelfDefineItems`, param).then(({data}) => {
              if (data.state === true) {
                this.$message.success('删除监控项成功');
                this.upload()
              } else {
                this.$message.error('删除监控项失败');
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消！'
            })
          })
      },
      expand(row, expanded) {
        console.log(expanded)
        let num = this.expandKeyArr.indexOf(row.index);
        if (expanded) {
          if (num === -1) {
            this.expandKeyArr.push(row.index);
          }
          if (this.expandKeyArr.length === this.tableData.length) {
            this.expandBtnText = '全部关闭';
          }
        } else {
          this.expandKeyArr.splice(num, 1);
        }
      },
      listEventChange(item, e) {
        // if (e.target.nodeName !== 'INPUT') {
        //   return;
        // }
        this.$nextTick(() => {
          let confirmText = '';
          if (item.thresholdIsOpenAll === 1) {
            confirmText = `确定要全部设置异常产生事件吗？`;
          } else {
            confirmText = `确定要全部关闭异常产生事件吗？`
          }
          let param = `setAllGenerateEvent/${item.list[0].compId}/${item.list[0].monitorType}/${item.thresholdIsOpenAll}`;
          let logParam = {};
          if (this.$route.name === 'AssetsMonitor_info') {
            logParam.data = [Object.assign({}, this.$parent.comp, item)];
            let opeStr = item.thresholdIsOpenAll === 1 ? '开启' : '关闭';
            logParam.logTemplate = opeStr + '全部产生事件|资产(#controlAdderss#/#itcompName#)>IP信息>运行信息>资产信息>监控项管理>监控项(#name#)';
          }
          this.axiosSetEvent(confirmText, param, logParam, () => {
            item.list.forEach(listItem => {
              listItem.thresholdIsOpen = item.thresholdIsOpenAll === 1 ? 1 : 0;
            });
          }, () => {
            this.$message({showClose: true, message: '设置失败，所选监控项中存在没有规则的监控项', type: 'error'});
            item.thresholdIsOpenAll = item.thresholdIsOpenAll === 1 ? 0 : 1;
          }, () => {
            item.thresholdIsOpenAll = item.thresholdIsOpenAll === 1 ? 0 : 1;
          });
        });
      },
      listUseChange(item, e) {
        console.log(item)
          this.$nextTick(() => {
          let confirmText = '';
          if (item.isMonitorAll === 1) {
            confirmText = `确定要全部开启【${item.list[0].monitorType}】类型下的所有监控项吗？`;
          } else if (item.isMonitorAll === 0) {
            confirmText = `确定要全部禁用【${item.list[0].monitorType}】类型下的所有监控项吗？`;
          }
          let param = {
            monitorType: item.list[0].monitorType,
            compentId: item.list[0].compId,
            isMonitor: item.isMonitorAll + ''
          };
          let logParam = {};
          if (this.$route.name === 'AssetsMonitor_info') {
            logParam.data = [Object.assign({}, this.$parent.comp, item)];
            let opeStr = item.isMonitorAll === 1 ? '启用' : '禁用';
            logParam.logTemplate = '全部' + opeStr + '监控项|资产(#controlAdderss#/#itcompName#)>IP信息>运行信息>资产信息>监控项管理>监控项(#name#)';
          }
          this.axiosUseMonitor(confirmText, param, logParam, () => {
            item.list.forEach(listItem => {
              listItem.isMonitor = item.isMonitorAll === 1 ? 1 : 0;
            });
          }, () => {
            item.isMonitorAll = item.isMonitorAll === 1 ? 0 : 1;
          });
          });
      },
      itemEventChange(item, parentItem, e) { // 异常产生事件
        // if (e.target.nodeName !== 'INPUT') {
        //   return;
        // }
        this.$nextTick(() => {
          let confirmText = '';
          if (item.thresholdIsOpen === 1) {
            confirmText = `确定要设置【${item.monitorName}】异常产生事件吗？`;
          } else {
            confirmText = `确定要关闭【${item.monitorName}】异常产生事件吗？`
          }
          let param = `setGenerateEvent/${item.id}/${item.thresholdIsOpen}`;
          let logParam = {};
          if (this.$route.name === 'AssetsMonitor_info') {
            logParam.data = [Object.assign({}, this.$parent.comp, parentItem, {monitorName: item.monitorName})];
            let opeStr = item.thresholdIsOpen === 1 ? '开启' : '关闭';
            logParam.logTemplate = opeStr + '异常产生事件|资产(#controlAdderss#/#itcompName#)>IP信息>运行信息>资产信息>监控项管理>监控项(#name#)>监控项名称(#monitorName#)';
          }
          this.axiosSetEvent(confirmText, param, logParam, () => {
            if (parentItem.list.every(obj => { return obj.thresholdIsOpen === 1 })) {
              parentItem.thresholdIsOpenAll = 1;
            } else if (parentItem.list.every(obj => { return obj.thresholdIsOpen === 0 })) {
              parentItem.thresholdIsOpenAll = 0;
            } else {
              parentItem.thresholdIsOpenAll = null;
            }
          }, () => {
            this.$message({showClose: true, message: '设置失败，设置失败，该监控没有规则！', type: 'error'});
            item.thresholdIsOpen = item.thresholdIsOpen === 1 ? 0 : 1;
          }, () => {
            item.thresholdIsOpen = item.thresholdIsOpen === 1 ? 0 : 1;
          });
        });
      },
      changeThreshold(item) { // 修改规则
        $axios.post(`/resourcemanager/assetmanage/assetRuning/showThreshold/${item.id}`).then(({data}) => {
          if (Object.keys(data).length === 0) {
            this.$message({type: 'warning', message: '该监控没有规则!'})
          } else {
            this.$emit('show-threshold-change', Object.assign({}, item));
          }
        });
      },
      del(item, parentItem, index, list) { // 删除
        this.$confirm(`确定要删除【${item.monitorName}】吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let logParam = {};
          if (this.$route.name === 'AssetsMonitor_info') {
            logParam.data = [Object.assign({}, this.$parent.comp, parentItem, {monitorName: item.monitorName})];
            logParam.logTemplate = '删除|资产(#controlAdderss#/#itcompName#)>IP信息>运行信息>资产信息>监控项管理>监控项(#name#)>监控项名称(#monitorName#)';
          }
          $axios.post('/resourcemanager/assetmanage/assetRuning/deleteCi', item, logParam).then(({data}) => {
            if (data) {
              this.$message({showClose: true, message: '删除成功', type: 'success'});
              list.splice(index, 1);
            } else {
              this.$message({showClose: true, message: '删除失败', type: 'error'});
            }
          });
        }).catch(() => {});
      },
      itemUseClick(item, parentItem, e) { // 启用/禁用
        this.$nextTick(() => {
          let confirmText = '';
          if (item.isMonitor === 1) {
            confirmText = `确定要开启【${item.monitorName}】的监控？`;
          } else if (item.isMonitor === 0) {
            confirmText = `确定要关闭【${item.monitorName}】的监控？`;
          }
          let param = {
            monitorType: item.monitorType,
            resultFlag: 'single',
            monitorId: item.uuid,
            compentId: item.compId,
            isMonitor: item.isMonitor + ''
          };
          let logParam = {};
          if (this.$route.name === 'AssetsMonitor_info') {
            logParam.data = [Object.assign({}, this.$parent.comp, parentItem, {monitorName: item.monitorName})];
            let opeStr = item.isMonitor === 1 ? '启用' : '禁用';
            logParam.logTemplate = opeStr + '监控项|资产(#controlAdderss#/#itcompName#)>IP信息>运行信息>资产信息>监控项管理>监控项(#name#)>监控项名称(#monitorName#)';
          }
          this.axiosUseMonitor(confirmText, param, logParam, () => {
            if (parentItem.list.every(obj => { return obj.isMonitor === 1 })) {
              parentItem.isMonitorAll = 1;
            } else if (parentItem.list.every(obj => { return obj.isMonitor === 0 })) {
              parentItem.isMonitorAll = 0;
            } else {
              parentItem.isMonitorAll = null;
            }
          }, () => {
            item.isMonitor = item.isMonitor === 1 ? 0 : 1;
          });
        });
      },
      axiosSetEvent(confirmText, param, logParam, successCb = () => {}, failCb = () => {}, cancelCb = () => {}) {
        this.$confirm(confirmText, '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'}).then(() => {
          $axios.get(`/resourcemanager/assetmanage/assetRuning/${param}`, logParam).then(({data}) => {
            if (data) {
              this.$message({showClose: true, message: '设置成功', type: 'success'});
              successCb();
            } else {
              failCb();
            }
          })
        }).catch(() => {
          cancelCb();
        });
      },
      axiosUseMonitor(confirmText, param, logParam, successCb = () => {}, failCb = () => {}) {
        this.$confirm(confirmText, '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'}).then(() => {
          $axios.post(`/resourcemanager/assetmanage/assetRuning/openOrForbidCiMonitor`, param, logParam).then(({data}) => {
            if (data) {
              this.$message({showClose: true, message: '设置成功', type: 'success'});
              successCb();
            } else {
              this.$message({showClose: true, message: '设置失败', type: 'error'});
              failCb();
            }
          })
        }).catch(() => {
          failCb();
        });
      },
      manageOk() {
        this.$confirm('清除监控项也会同时清空监控项下的数据，确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let logParam = {};
            if (this.$route.name === 'AssetsMonitor_info') {
              logParam.data = [this.$parent.comp];
              logParam.logTemplate = '清除监控项|资产(#controlAdderss#/#itcompName#)>IP信息>运行信息>资产信息>监控项管理';
            }
            $axios.get(`/resourcemanager/assetmanage/assetRuning/deleteAllCi/${this.compId}`, logParam).then(({data}) => {
              if (data) {
                this.dialogFlag = false;
                this.$emit('reload');
              }
            });
        }).catch(() => {})
      },
      cancelAction() {
        this.dialogFlag = false;
        this.$emit('reload');
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      compId: {
        type: String
      },
      itcompTemplate: {
        type: String
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>
