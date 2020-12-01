<!--链路选项卡、链路页面新增线路弹框-->
<template>
  <s-dialog v-model="dialogFlag" title="新增线路" width="900px" class="linkAddDialog">
    <s-row class="linkStep1" v-show="current === 0">
      <s-form :model="step1Form" :rules="step1Rules" ref="step1Form" label-width="120px">
        <s-col span="11" class="source">
          <s-form-item label="线路名称:" prop="name">
            <s-input v-model="step1Form.name" :maxlength="40"></s-input>
          </s-form-item>
          <s-form-item label="查询数据:">
            <s-input v-model="step1Form.sourceFilterText"></s-input>
          </s-form-item>
          <s-radio-group v-model="step1SourceSelectUuid">
            <s-table :data="sourceDeviceList" style="width: 100%;" height="350"
                   @current-change="sourceDeviceChange" :row-class-name="sourceDeviceCurRow">
              <s-table-column width="55px" align="center">
                <template slot-scope="scope">
                  <s-radio :label="scope.row.uuid" :disabled="isDisabled(scope.row, step1TargetSelectUuid)"></s-radio>
                </template>
              </s-table-column>
              <s-table-column label="源资产" prop="controlAdderss">
                <template slot-scope="scope">
                  {{scope.row.controlAdderss}}—{{scope.row.itcompName}}
                </template>
              </s-table-column>
            </s-table>
          </s-radio-group>
        </s-col>
        <s-col span="11" :offset="2" class="target">
          <s-form-item style="height: 36px;"></s-form-item>
          <s-form-item label="查询数据:">
            <s-input v-model="step1Form.targetFilterText"></s-input>
          </s-form-item>
          <s-radio-group v-model="step1TargetSelectUuid">
            <s-table :data="targetDeviceList" style="width: 100%;" height="350"
                   @current-change="targetDeviceChange" :row-class-name="targetDeviceCurRow">
              <s-table-column width="55px" align="center">
                <template slot-scope="scope">
                  <s-radio :label="scope.row.uuid" :disabled="isDisabled(scope.row, step1SourceSelectUuid)"></s-radio>
                </template>
              </s-table-column>
              <s-table-column label="目标资产" prop="controlAdderss">
                <template slot-scope="scope">
                  {{scope.row.controlAdderss}}—{{scope.row.itcompName}}
                </template>
              </s-table-column>
            </s-table>
          </s-radio-group>
        </s-col>
      </s-form>
    </s-row>
    <s-row class="linkStep2" v-if="current === 1">
      <s-form :model="step2Form" label-width="120px">
        <s-col span="11">
          <s-form-item class="titleRow">
            <span class="title">{{step1SourceSelect.controlAdderss}}的端口</span>
          </s-form-item>
          <s-form-item label="查询数据:">
            <s-input v-model="step2Form.sourceFilterText"></s-input>
          </s-form-item>
          <s-radio-group v-model="step2SourceSelectUuid">
            <s-table :data="sourceInterfaceFilterList" style="width: 100%;" height="350"
                     @current-change="sourceInterfaceChange" :row-class-name="sourceInterfaceCurRow">
              <s-table-column width="55px" align="center">
                <template slot-scope="scope">
                  <s-radio :label="scope.row.instanceIndex"></s-radio>
                </template>
              </s-table-column>
              <s-table-column label="端口名称">
                <template slot-scope="scope">
                  <span v-html="scope.row.monitorName"></span>
                </template>
              </s-table-column>
            </s-table>
          </s-radio-group>
        </s-col>
        <s-col span="11" :offset="2">
          <s-form-item class="titleRow">
            <span class="title">{{step1TargetSelect.controlAdderss}}的端口</span>
          </s-form-item>
          <s-form-item label="查询数据:">
            <s-input v-model="step2Form.targetFilterText"></s-input>
          </s-form-item>
          <s-radio-group v-model="step2TargetSelectUuid">
            <s-table :data="targetInterfaceFilterList" style="width: 100%;" height="350"
                     @current-change="targetInterfaceChange" :row-class-name="targetInterfaceCurRow">
              <s-table-column width="55px" align="center">
                <template slot-scope="scope">
                  <s-radio :label="scope.row.instanceIndex"></s-radio>
                </template>
              </s-table-column>
              <s-table-column label="端口名称">
                <template slot-scope="scope">
                  <span v-html="scope.row.monitorName"></span>
                </template>
              </s-table-column>
            </s-table>
          </s-radio-group>
        </s-col>
      </s-form>
    </s-row>
    <s-row class="allTopoRadio" v-show="from === 'lineTab' && current === 1">
      <s-radio-group v-model="isAllTopo">
        <s-radio :label="1">保存到所有拓扑</s-radio>
        <s-radio :label="2">保存到当前拓扑</s-radio>
      </s-radio-group>
    </s-row>
    <template slot="footer" class="dialog-footer" v-if="loadFinish">
      <s-button @click="prev" v-show="current === 1">上一步</s-button>
      <s-button @click="next" v-show="current === 0">下一步</s-button>
      <s-button @click="dialogOk" v-show="current === 1">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import {Validaters} from 'sunflower-common-utils';
  import { getMonitorItcompList, addTopoviewLink, addTopoviewLine, axiosGetDevicePort } from '../api/topology_api'

  export default {
    data() {
      return {
        dialogFlag: false,
        current: 0,
        isAllTopo: 1,
        step1Form: {
          name: '',
          sourceFilterText: '',
          targetFilterText: ''
        },
        step1Rules: {
          name: [Validaters.NotNull]
        },
        step1List: [],
        step1SourceSelectUuid: '',
        step1TargetSelectUuid: '',
        step2Form: {
          sourceFilterText: '',
          targetFilterText: ''
        },
        sourceInterfaceList: [],
        targetInterfaceList: [],
        step2SourceSelectUuid: '',
        step2TargetSelectUuid: '',
        loadFinish: false
      }
    },
    computed: {
      sourceDeviceList() {
        if (!this.step1Form.sourceFilterText) return this.step1List;
        return this.step1List.filter(item => {
          return item.controlAdderss.indexOf(this.step1Form.sourceFilterText) !== -1 || item.itcompName.indexOf(this.step1Form.sourceFilterText) !== -1;
        });
      },
      targetDeviceList() {
        if (!this.step1Form.targetFilterText) return this.step1List;
        return this.step1List.filter(item => {
          return item.controlAdderss.indexOf(this.step1Form.targetFilterText) !== -1 || item.itcompName.indexOf(this.step1Form.targetFilterText) !== -1;
        });
      },
      step1SourceSelect() {
        return this.step1List.find(item => {
          return item.uuid === this.step1SourceSelectUuid;
        });
      },
      step1TargetSelect() {
        return this.step1List.find(item => {
          return item.uuid === this.step1TargetSelectUuid;
        });
      },
      sourceInterfaceFilterList() {
        if (!this.step2Form.sourceFilterText) return this.sourceInterfaceList;
        return this.sourceInterfaceList.filter(item => {
          return item.monitorName.indexOf(this.step2Form.sourceFilterText) !== -1;
        });
      },
      targetInterfaceFilterList() {
        if (!this.step2Form.targetFilterText) return this.targetInterfaceList;
        return this.targetInterfaceList.filter(item => {
          return item.monitorName.indexOf(this.step2Form.targetFilterText) !== -1;
        });
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      from: String
    },
    mounted() {
      this.$nextTick(() => {
        this.loadStep1Data();
      });
    },
    methods: {
      loadStep1Data() {
        let param = {
          subTopoId: window.paramSubTopo,
          showapp: (this.from === 'lineTab' ? window.TopologyGraph.getShowApp() : this.$route.params.showapp)
        };
        let type = this.from === 'lineTab' ? '3' : '4';
        let Loading = this.$loading({
          target: '.linkAddDialog .linkStep1',
          customClass: 'loadingClass'
        });
        getMonitorItcompList(param, type).then(data => {
          Loading.close();
          this.loadFinish = true;
          this.step1List = data;
        });
      },
      loadStep2Data() {
        axiosGetDevicePort(this.step1SourceSelectUuid).then(({data}) => {
          this.sourceInterfaceList = data;
        });
        axiosGetDevicePort(this.step1TargetSelectUuid).then(({data}) => {
          this.targetInterfaceList = data;
        });
      },
      isDisabled(row, uuid) {
        return row.uuid === uuid;
      },
      sourceDeviceChange(row) {
        if (row.uuid !== this.step1TargetSelectUuid) {
          this.step1SourceSelectUuid = row.uuid;
        }
      },
      targetDeviceChange(row) {
        if (row.uuid !== this.step1SourceSelectUuid) {
          this.step1TargetSelectUuid = row.uuid;
        }
      },
      sourceDeviceCurRow(row) {
        if (row.uuid === this.step1SourceSelectUuid) {
          return 'current-row';
        }
      },
      targetDeviceCurRow(row) {
        if (row.uuid === this.step1TargetSelectUuid) {
          return 'current-row';
        }
      },
      sourceInterfaceChange(row) {
        this.step2SourceSelectUuid = row.instanceIndex;
      },
      targetInterfaceChange(row) {
        this.step2TargetSelectUuid = row.instanceIndex;
      },
      sourceInterfaceCurRow(row) {
        if (row.instanceIndex === this.step2SourceSelectUuid) {
          return 'current-row';
        }
      },
      targetInterfaceCurRow(row) {
        if (row.instanceIndex === this.step2TargetSelectUuid) {
          return 'current-row';
        }
      },
      prev() {
        this.current --;
      },
      next() {
        if (!this.step1SourceSelectUuid) {
          this.$message({showClose: true, message: '请选择源资产', type: 'error'});
          return;
        } else if (!this.step1TargetSelectUuid) {
          this.$message({showClose: true, message: '请选择目的资产', type: 'error'});
          return;
        }
        this.$refs.step1Form.validate(valid => {
          if (!valid) return;
          this.current ++;
          this.loadStep2Data();
        });
      },
      insertEdgeInTopo(param, response) { // 新增线路后在图中插入线路
        let graph = window.TopologyGraph.getGraph();
        let model = window.TopologyGraph.getGraph().getModel();
        if (model.getCell(param.sourceNodeUuid) && model.getCell(param.targetNodeUuid)) {
          model.beginUpdate();
          let edge = graph.insertEdge(graph.getDefaultParent(), response, '', model.getCell(param.sourceNodeUuid), model.getCell(param.targetNodeUuid));
          graph.orderCells(true, [edge]);
          model.endUpdate();
        }
      },
      dialogOk() {
        if (!this.step2SourceSelectUuid || !this.step2TargetSelectUuid) {
          this.$confirm('不选择端口，系统将无法获得资产之间流量', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axiosSave();
          }).catch(() => {});
        } else {
          this.axiosSave();
        }
      },
      axiosSave() {
        let param = {
          name: this.step1Form.name,
          sourceMiUuid: this.step2SourceSelectUuid,
          targetMiUuid: this.step2TargetSelectUuid,
          topoviewInfoUuid: window.paramSubTopo
        };
        let cb = ({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
            this.$emit('reload');
            this.dialogFlag = false;
          } else {
            this.$message({showClose: true, message: '保存失败!', type: 'error'});
          }
        };
        if (this.from === 'lineTab') {
          param.sourceNodeUuid = this.step1SourceSelectUuid;
          param.targetNodeUuid = this.step1TargetSelectUuid;
          addTopoviewLink(param, this.isAllTopo).then(({data}) => {
            if (data && data.length > 0) {
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.$emit('reload');
              window.TopologyGraph.setLoading(true); // 屏蔽连线后出现的弹框
              this.insertEdgeInTopo(param, data);
              window.TopologyGraph.setLoading(false);
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: '保存失败!', type: 'error'});
            }
          });
        } else {
          param.sourceNodeTypeUuid = this.step1SourceSelectUuid;
          param.targetNodeTypeUuid = this.step1TargetSelectUuid;
          param.type = this.isAllTopo;
          addTopoviewLine(param).then(cb);
        }
      }
    },
    watch: {
      step1List(val) {
        if (val.length > 0) {
          this.$nextTick(() => {
            let leftIndex = 0;
            let rightIndex = 0;
            let itemOffsetH = document.querySelector('.linkStep1 .s-table-row').offsetHeight;
            val.forEach((item, index) => {
              if (this.step1SourceSelectUuid === item.uuid) {
                leftIndex = index;
              }
              if (this.step1TargetSelectUuid === item.uuid) {
                rightIndex = index;
              }
            });
            let leftWrap = document.querySelector('.linkStep1 .source .s-table-body-wrapper');
            if (leftWrap.scrollHeight > leftWrap.offsetHeight) {
              leftWrap.scrollTop = itemOffsetH * leftIndex;
            }
            let rightWrap = document.querySelector('.linkStep1 .target .s-table-body-wrapper');
            if (rightWrap.scrollHeight > rightWrap.offsetHeight) {
              rightWrap.scrollTop = itemOffsetH * rightIndex;
            }
          });
        }
      },
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

