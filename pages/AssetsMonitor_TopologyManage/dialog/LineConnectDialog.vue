<!--
  拓扑中连线、拓扑中修改线路端口时的弹框
-->
<template>
  <s-dialog v-model="dialogFlag" title="请选择两个资产之间的对应端口" width="900px" class="lineConnectDialog">
    <s-row>
      <s-form label-width="120px" class="clearfix">
        <s-col span="11">
          <s-form-item class="titleRow">
            <span class="title">{{getTitle(source, sourceShowDevice, 'source')}}</span>
          </s-form-item>
          <s-form-item label="查询数据:">
            <s-input v-model="sourceFilterText"></s-input>
          </s-form-item>
          <!--子拓扑-->
          <div v-if="source.type === 3 && sourceShowDevice">
            <s-table :data="sourceDeviceFilterList" style="width: 200%;" height="350">
              <s-table-column label="资产名称" prop="itcompName">
              </s-table-column>
              <s-table-column label="IP" prop="controlAdderss">
              </s-table-column>
              <s-table-column label="操作" width="80px" align="center">
                <template slot-scope="scope">
                  <i class="iconfont icon-right" title="选择端口" @click="rowSelPort(scope.row, 'source')"></i>
                </template>
              </s-table-column>
            </s-table>
          </div>
          <!--资产-->
          <div v-else class="portContainer">
            <s-button icon="arrow-left" title="返回资产列表" @click="sourceShowDevice=true" class="backDevice" v-if="source.type === 3">
            </s-button>
            <s-table :data="sourcePortFilterList" style="width: 200%;" height="350"
                     :stripe="false"
                     highlight-current-row @current-change="sourceCurrentChange"
                     :row-class-name="sourceCurRowClass">
              <s-table-column type="index" width="80px" align="center">
              </s-table-column>
              <s-table-column label="端口名称">
                <template slot-scope="scope">
                  <span v-html="scope.row.monitorName"></span>
                </template>
              </s-table-column>
            </s-table>
          </div>
        </s-col>
        <s-col span="11" :offset="2">
          <s-form-item class="titleRow">
            <span class="title">{{getTitle(target, targetShowDevice, 'target')}}</span>
          </s-form-item>
          <s-form-item label="查询数据:">
            <s-input v-model="targetFilterText"></s-input>
          </s-form-item>
          <!--子拓扑-->
          <div v-if="target.type === 3 && targetShowDevice">
            <s-table :data="targetDeviceFilterList" style="width: 200%;" height="350">
              <s-table-column label="资产名称" prop="itcompName">
              </s-table-column>
              <s-table-column label="IP" prop="controlAdderss">
              </s-table-column>
              <s-table-column label="操作" width="80px" align="center">
                <template slot-scope="scope">
                  <i class="iconfont icon-right" title="选择端口" @click="rowSelPort(scope.row, 'target')"></i>
                </template>
              </s-table-column>
            </s-table>
          </div>
          <!--资产-->
          <div v-else class="portContainer">
            <s-button icon="arrow-left" title="返回资产列表" @click="targetShowDevice=true" class="backDevice" v-if="target.type === 3">
            </s-button>
            <s-table :data="targetPortFilterList" style="width: 200%;" height="350"
                     :stripe="false"
                     highlight-current-row @current-change="targetCurrentChange"
                     :row-class-name="targetCurRowClass">
              <s-table-column type="index" width="80px" align="center">
              </s-table-column>
              <s-table-column label="端口名称">
                <template slot-scope="scope">
                  <span v-html="scope.row.monitorName"></span>
                </template>
              </s-table-column>
            </s-table>
          </div>
        </s-col>
      </s-form>
      <s-row class="allTopoRadio" v-show="type==='0'">
        <s-radio-group v-model="isAllTopo">
          <s-radio :label="1">保存到所有拓扑</s-radio>
          <s-radio :label="2">保存到当前拓扑</s-radio>
        </s-radio-group>
      </s-row>
    </s-row>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import { axiosGetDevicePort, getMonitorItcompList, addTopoviewLink, saveOrUpdateTopoview, getTopoviewLineDetail } from '../api/topology_api';

  export default {
    data() {
      return {
        dialogFlag: false,
        cellDetail: {},
        sourceDeviceList: [],
        targetDeviceList: [],
        sourcePortList: [],
        targetPortList: [],
        sourceFilterText: '',
        targetFilterText: '',
        sourceSelect: {},
        targetSelect: {},
        isAllTopo: 2,
        sourceShowDevice: true,
        targetShowDevice: true,
        addResult: false,
        sourceSeledDevice: {},
        targetSeledDevice: {}
      }
    },
    props: {
      modifyCell: Object,
      type: String, // 对话框类型 '0':增加  '1':修改
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      source() {
        if (this.modifyCell.source.isIconVertex()) {
          return this.modifyCell.source.underCell;
        }
        return this.modifyCell.source;
      },
      target() {
        if (this.modifyCell.target.isIconVertex()) {
          return this.modifyCell.target.underCell;
        }
        return this.modifyCell.target;
      },
      sourceDeviceFilterList() {
        if (!this.sourceFilterText) return this.sourceDeviceList;
        return this.sourceDeviceList.filter(item => {
          return (item.itcompName.indexOf(this.sourceFilterText) !== -1 || item.controlAdderss.indexOf(this.sourceFilterText) !== -1);
        });
      },
      targetDeviceFilterList() {
        if (!this.targetFilterText) return this.targetDeviceList;
        return this.targetDeviceList.filter(item => {
          return (item.itcompName.indexOf(this.targetFilterText) !== -1 || item.controlAdderss.indexOf(this.targetFilterText) !== -1);
        });
      },
      sourcePortFilterList() {
        if (!this.sourceFilterText) return this.sourcePortList;
        return this.sourcePortList.filter(item => {
          return item.monitorName.indexOf(this.sourceFilterText) !== -1;
        });
      },
      targetPortFilterList() {
        if (!this.targetFilterText) return this.targetPortList;
        return this.targetPortList.filter(item => {
          return item.monitorName.indexOf(this.targetFilterText) !== -1;
        });
      }
    },
    created() {
      if (this.type === '1') {
        getTopoviewLineDetail(this.modifyCell.id).then(data => {
          this.cellDetail = data;
          this.getList(this.source, 'source');
          this.getList(this.target, 'target');
        });
      } else {
        this.getList(this.source, 'source');
        this.getList(this.target, 'target');
      }
    },
    methods: {
      getList(cell, type, flag = true) {
        if (cell.type === 3) {
          let param = {
            subTopoId: cell.id,
            showapp: window.TopologyGraph.getShowApp() || 1
          };
          getMonitorItcompList(param, '1').then(data => {
            this[type + 'DeviceList'] = data;
          });
        } else if (cell.type === 2) {
          this[type + 'PortList'] = [];
        } else {
          let id = flag ? cell.id : cell.uuid;
          axiosGetDevicePort(id).then(({data}) => {
            this[type + 'PortList'] = data;
            if (this.cellDetail[type + 'InterfaceName']) {
              this[type + 'Select'] = this[type + 'PortList'].filter(item => {
                return item.monitorName === this.cellDetail[type + 'InterfaceName'];
              })[0];
            }
          });
        }
      },
      getTitle(cell, flag, type) {
        if (cell.type === 3) {
          if (flag) {
            return cell.hostIp + '中资产列表';
          } else {
            return cell.hostIp + '->' + this[type + 'SeledDevice'].controlAdderss + '端口';
          }
        } else if (cell.type === 2) {
          return '无端口';
        } else {
          return cell.hostIp + '的端口';
        }
      },
      sourceCurRowClass(row) {
        if (row.uuid === this.sourceSelect.uuid) {
          return 'current-row';
        }
      },
      targetCurRowClass(row) {
        if (row.uuid === this.targetSelect.uuid) {
          return 'current-row';
        }
      },
      sourceCurrentChange(row) {
        row && (this.sourceSelect = row);
      },
      targetCurrentChange(row) {
        row && (this.targetSelect = row);
      },
      rowSelPort(row, type) {
        this[type + 'SeledDevice'] = row;
        this[type + 'ShowDevice'] = false;
        this[type + 'FilterText'] = '';
        this.getList(row, type, false);
      },
      orderCell(data) {
        let graph = window.TopologyGraph.getGraph();
        let oldId = this.modifyCell.id; // 手动修改model.cells下自增长的id为接口返回的uuid
        this.modifyCell.id = data;
        delete graph.getModel().cells[oldId];
        graph.getModel().beginUpdate(); // 手动排序，让pointCell位于下面
        graph.orderCells(true, [this.modifyCell]);
        window.TopologyGraph.orderGroup();
        graph.getModel().endUpdate();
      },
      dialogOk() {
        let obj = {
          sourceNodeUuid: this.source.id,
          targetNodeUuid: this.target.id,
          topoviewInfoUuid: window.paramSubTopo
        };
        if (!this.sourceSelect.instanceIndex || !this.targetSelect.instanceIndex) {
          this.$confirm('不选择端口，系统将无法获得资产之间流量', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.checkOnlyCell()) {
              if (this.sourceSelect.instanceIndex) obj.sourceMiUuid = this.sourceSelect.instanceIndex;
              if (this.targetSelect.instanceIndex) obj.targetMiUuid = this.targetSelect.instanceIndex;
              this.axiosSave(obj);
            } else {
              this.$message({showClose: true, message: '无法绘制，已存在一条源节点到目的节点端口相同的连线!', type: 'warning'});
            }
          }).catch(() => {});
        } else {
          if (this.checkOnlyCell()) {
            obj.sourceMiUuid = this.sourceSelect.instanceIndex;
            obj.targetMiUuid = this.targetSelect.instanceIndex;
            this.axiosSave(obj);
          } else {
            this.$message({showClose: true, message: '端口两侧并未修改，请重新选择!', type: 'warning'});
          }
        }
      },
      axiosSave(obj) {
        if (this.type === '0') { // 新增
          let param = Object.assign({}, obj);
          param.style = this.modifyCell.style;
          param.geo = JSON.stringify(this.modifyCell.geometry);
          param.parent = window.TopologyGraph.getParent(this.modifyCell);
          addTopoviewLink(param, this.isAllTopo).then(({data}) => {
            if (data && data.length > 0) {
              this.$message({showClose: true, message: '新增成功!', type: 'success'});
              this.orderCell(data);
              this.addResult = true;
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: '新增失败!', type: 'error'});
            }
          });
        } else { // 编辑
          obj.uuid = this.modifyCell.id;
          obj.type = '2';
          let param = {
            topoviewLine: JSON.stringify([obj])
          };
          saveOrUpdateTopoview(param).then(data => {
            if (data === true) {
              this.$message({showClose: true, message: '修改端口成功!', type: 'success'});
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: '修改端口失败!', type: 'error'});
            }
          });
        }
      },
      checkOnlyCell() { // 检查连线的唯一性
        let sourceid = this.source.id;
        let sourceSelPort = this.sourceSelect.instanceIndex;
        let targetid = this.target.id;
        let targetSelPort = this.targetSelect.instanceIndex;
        let model = window.TopologyGraph.getGraph().getModel();
        let sourceSelPortStr = sourceSelPort == null ? '' : ':' + sourceSelPort;
        let targetSelPortStr = targetSelPort == null ? '' : ':' + targetSelPort;
        let tempId = sourceid + sourceSelPortStr + '_' + targetid + targetSelPortStr;
        let flag = true;
        for (let i in model.cells) {
          if (model.cells[i].id === tempId) {
            flag = false;
          }
        }
        return flag;
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
        if (!val) {
          if (this.type === '0' && !this.addResult) { // 新增连线弹框关闭时移除连线
            window.TopologyGraph.getGraph().removeCells([this.modifyCell]);
          }
          this.$emit('input', val);
        }
      }
    }
  }
</script>
