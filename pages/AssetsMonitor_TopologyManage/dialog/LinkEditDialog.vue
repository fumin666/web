<template>
  <s-dialog v-model="dialogFlag" title="编辑线路" width="900px" class="linkEditDialog">
    <s-form :model="linkForm" :rules="linkRules" ref="linkForm" label-width="120px">
      <s-form-item label="线路名称:" prop="name">
        <s-input v-model="linkForm.name"></s-input>
      </s-form-item>
    </s-form>
    <s-row>
      <s-col span="12">
        <s-row>
          <s-col span="10">
            <div class="grid-content bg-purple">源资产名称</div>
          </s-col>
          <s-col span="14">
            <div class="grid-content bg-purple-light">{{curObj.sourceHostName}}</div>
          </s-col>
        </s-row>
      </s-col>
      <s-col span="12">
        <s-row>
          <s-col span="10">
            <div class="grid-content bg-purple">目标资产名称</div>
          </s-col>
          <s-col span="14">
            <div class="grid-content bg-purple-light">{{curObj.targetHostName}}</div>
          </s-col>
        </s-row>
      </s-col>
    </s-row>
    <s-row>
      <s-col span="12">
        <s-row>
          <s-col span="10">
            <div class="grid-content bg-purple">源资产IP</div>
          </s-col>
          <s-col span="14">
            <div class="grid-content bg-purple-light">{{curObj.sourceIp}}</div>
          </s-col>
        </s-row>
      </s-col>
      <s-col span="12">
        <s-row>
          <s-col span="10">
            <div class="grid-content bg-purple">目标资产IP</div>
          </s-col>
          <s-col span="14">
            <div class="grid-content bg-purple-light">{{curObj.targetIp}}</div>
          </s-col>
        </s-row>
      </s-col>
    </s-row>
    <s-row :gutter="20" style="margin-top: 10px;">
      <s-col span="12" class="source">
        <s-row class="filterInput">
          <s-input v-model="sourceFilterText" class="right-float" placeholder="请输入查询数据" icon="magnifier"></s-input>
        </s-row>
        <s-radio-group v-model="sourceSelectUuid">
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
      <s-col span="12" class="target">
        <s-row class="filterInput">
          <s-input v-model="targetFilterText" class="right-float" placeholder="请输入查询数据" icon="magnifier"></s-input>
        </s-row>
        <s-radio-group v-model="targetSelectUuid">
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
    </s-row>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import {Validaters} from 'sunflower-common-utils';
  import { updateTopoviewLink, axiosGetDevicePort } from '../api/topology_api'

  export default {
    data() {
      return {
        dialogFlag: false,
        linkForm: {
          name: ''
        },
        linkRules: {
          name: [Validaters.NotNull]
        },
        sourceInterfaceList: [],
        targetInterfaceList: [],
        sourceSelectUuid: '',
        targetSelectUuid: '',
        sourceFilterText: '',
        targetFilterText: '',
        isAllTopo: 1
      }
    },
    computed: {
      sourceInterfaceFilterList() {
        if (this.sourceFilterText.trim() === '') return this.sourceInterfaceList;
        return this.sourceInterfaceList.filter(item => {
          return item.monitorName.indexOf(this.sourceFilterText) !== -1;
        });
      },
      targetInterfaceFilterList() {
        if (this.targetFilterText.trim() === '') return this.targetInterfaceList;
        return this.targetInterfaceList.filter(item => {
          return item.monitorName.indexOf(this.targetFilterText) !== -1;
        });
      }
    },
    props: {
      curObj: {
        type: Object
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.linkForm.name = this.curObj.name || (this.curObj.sourceIp + '—' + this.curObj.targetIp);
      this.sourceSelectUuid = this.curObj.sourceNodeTypeUuid;
      this.targetSelectUuid = this.curObj.targetNodeTypeUuid;
      this.axiosData();
    },
    methods: {
      axiosData() {
        axiosGetDevicePort(this.curObj.sourceNodeTypeUuid).then(({data}) => {
          this.sourceInterfaceList = data;
          this.sourceSelectUuid = this.sourceInterfaceList.find(item => {
            return item.instanceIndex === this.curObj.sourceMiUuid;
          }) ? this.curObj.sourceMiUuid : '';
          this.scrollToView('source');
        });
        axiosGetDevicePort(this.curObj.targetNodeTypeUuid).then(({data}) => {
          this.targetInterfaceList = data;
          this.targetSelectUuid = this.targetInterfaceList.find(item => {
            return item.instanceIndex === this.curObj.targetMiUuid;
          }) ? this.curObj.targetMiUuid : '';
          this.scrollToView('target');
        });
      },
      scrollToView(flag) {
        this.$nextTick(() => {
          let curRow = document.querySelector(`.linkEditDialog .${flag} .current-row`);
          if (!curRow) return;
          let scrollWrap = document.querySelector(`.linkEditDialog .${flag} .s-scrollbar-wrap`);
          if (curRow.offsetTop > scrollWrap.clientHeight) {
            scrollWrap.scrollTop = curRow.offsetTop - scrollWrap.clientHeight + 40;
          }
        });
      },
      sourceInterfaceChange(row) {
        this.sourceSelectUuid = row.instanceIndex;
      },
      targetInterfaceChange(row) {
        this.targetSelectUuid = row.instanceIndex;
      },
      sourceInterfaceCurRow(row) {
        if (row.instanceIndex === this.sourceSelectUuid) {
          return 'current-row';
        }
      },
      targetInterfaceCurRow(row) {
        if (row.instanceIndex === this.targetSelectUuid) {
          return 'current-row';
        }
      },
      axiosSave() {
        let param = {
          name: this.linkForm.name,
          sourceMiUuid: this.sourceSelectUuid,
          targetMiUuid: this.targetSelectUuid,
          topoviewInfoUuid: window.paramSubTopo,
          sourceNodeTypeUuid: this.curObj.sourceNodeTypeUuid,
          targetNodeTypeUuid: this.curObj.targetNodeTypeUuid,
          uuid: this.curObj.uuid
        };
        param.type = this.isAllTopo;
        updateTopoviewLink(param).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '更新成功!', type: 'success'});
            this.$emit('reload');
            this.dialogFlag = false;
          } else {
            this.$message({showClose: true, message: '更新失败!', type: 'error'});
          }
        });
      },
      dialogOk() {
        this.$refs.linkForm.validate(valid => {
          if (!valid) return;
          if (!this.sourceSelectUuid || !this.targetSelectUuid) {
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
        })
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

<style lang="stylus">

</style>
