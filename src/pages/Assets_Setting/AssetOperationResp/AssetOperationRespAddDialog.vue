<template>
  <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑运维责任组' : '新建运维责任组'" width="800px" class="operationRespAddDialog">
    <s-scrollbar wrap-class="operationRespAddScrollbar">
      <s-collapse v-model="activeNames" accordion>
        <s-collapse-item name="form">
          <template slot="title">
            <span class="operationRespAddDialog-title">基础设置</span>
          </template>
          <s-form :model="operationRespForm" :rules="operationRespRule" ref="operationRespForm" label-width="130px">
            <s-form-item label="运维责任组名称" prop="deviceGroupName">
              <s-input v-model="operationRespForm.deviceGroupName"></s-input>
            </s-form-item>
            <s-form-item label="备注" prop="remark">
              <s-input v-model="operationRespForm.remark" type="textarea"></s-input>
            </s-form-item>
          </s-form>
        </s-collapse-item>
        <s-collapse-item name="table">
          <template slot="title">
            <span class="operationRespAddDialog-title">选择资产</span>
          </template>
          <s-table-page
            ref="assetListTable"
            :data="currentListCache"
            :header-search="getHeaderSearch()"
            :show-header-checkbox="true">
            <s-table-column type="selection" width="45"/>
            <s-table-column prop="itcompName" label="资产名称"/>
            <s-table-column prop="controlAdderss" label="IP地址" width="180"/>
            <s-table-column prop="citypeName" label="资产类型"/>
            <s-table-column prop="cmdbOrgName" label="使用部门"/>
          </s-table-page>
        </s-collapse-item>
      </s-collapse>

    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      data: {},
      dialogFlag: false,
      activeNames: ['form'],
      allowAdd: true,
      authOptions: [],
      operationRespForm: {
        deviceGroupName: '',
        remark: ''
      },
      operationRespRule: {
        deviceGroupName: [
          Validaters.NotNull,
          Validaters.Name,
          Validaters.Max(30)
        ],
        remark: [Validaters.Max(120)]
      },
      selectedData: [],
      currentListCache: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    operationResp: {
      type: Object
    },
    operationRespList: {
      type: Array
    }
  },
  computed: {
    isEdit() {
      return Object.keys(this.operationResp).length > 0;
    }
  },
  created() {
    if (this.isEdit) {
      $axios.get(`/operationDeviceGroup/getTdeviceGroupInfoByUuid/${this.operationResp.uuid}`).then(({data}) => {
        this.selectedData = data.itcompUuidList;
        this.getOperationDevice();
        for (let i in this.operationRespForm) {
          this.operationRespForm[i] = data[i];
        }
      })
    } else {
      this.getOperationDevice();
    }
  },
  methods: {
    getOperationDevice() {
      $axios.get('/operationDeviceGroup/getAllMonitorItcomp').then(({data}) => {
        if (data && data instanceof Array) {
          this.currentListCache = [...data];
          if (this.selectedData.length > 0) {
            let arr = [];
            this.$nextTick(() => {
              this.selectedData.forEach(uuid => {
                this.currentListCache.forEach(item => {
                  if (uuid === item.uuid) {
                    arr.push(item);
                  }
                });
              });
              // 设置选中
              this.$refs['assetListTable'].setAllSelectedData(arr);
            });
          }
        }
      });
    },
    getHeaderSearch() {
      return {
        width: 10,
        placeholder: '请输入资产名称、IP地址、资产类型、使用部门查询',
        searchProps: ['itcompName', 'controlAdderss', 'citypeName', 'cmdbOrgName']
      }
    },
    dialogOk() {
      let form = this.$refs['operationRespForm'];
      form.validate((valid) => {
        if (!valid) {
          this.activeNames = ['form']
          return false;// Q4手风琴样式
        }
        let selectedData = this.$refs['assetListTable'].getAllSelectedData();
        let arr = [];
        selectedData.forEach((item) => {
          arr.push(item.uuid);
        });
        let params = {...this.operationRespForm, itcompUuidList: [...arr]};
         if (this.isEdit) {
          params['uuid'] = this.operationResp.uuid;
          let obj = {
            data: [],
            logTemplate: `编辑|运维责任组(${this.operationRespForm.deviceGroupName})`
          }
          $axios.post('/operationDeviceGroup/saveOrUptDeviceGroupInfo', params, obj).then((res) => {
            if (res.data.state === true) {
              this.$message({showClose: true, message: '更新成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.activeNames = ['form'];
              this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
            }
          })
        } else {
           let obj = {
             data: [],
             logTemplate: `添加|运维责任组(${this.operationRespForm.deviceGroupName})`
           }
          $axios.post('/operationDeviceGroup/saveOrUptDeviceGroupInfo', params, obj).then((res) => {
            if (res.data.state === true) {
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.activeNames = ['form'];
              this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
            }
          })
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
  },
  components: {
  }
}
</script>

<style lang="stylus">
.operationRespAddDialog-checkbox {
  float: left;

  .operationRespAddDialog-checkbox-wrap {
    padding-top: 5px;
  }
}
</style>
