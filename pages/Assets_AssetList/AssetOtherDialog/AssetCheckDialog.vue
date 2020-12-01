<template>
  <s-dialog v-model="dialogFlag" title="资产账号稽核" top="10vh" width="800px" class="checkDialog" id="checkDialog">
    <s-scrollbar wrap-style="max-height: 450px;">
      <s-table-page
        :data="checkList"
        :header-search="defSearch()"
        key="checkListTable">
        <s-table-column label="资产名称" prop="monitorItcomp.itcompName" align="center"></s-table-column>
        <s-table-column label="IP地址" prop="monitorItcomp.controlAdderss" align="center"></s-table-column>
        <s-table-column label="资产类别" prop="monitorItcomp.citypeName" align="center"></s-table-column>
        <s-table-column label="协议名称" align="center">
          <template slot-scope="scope">
            <s-select v-model="scope.row.monitorItcomp.port_uuid">
              <s-option v-for="(option,index) in filterPort(scope.row.tAssetsPortInfoList)" :key="index"
                        :label="option.protocolName" :value="option.uuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="资产账号" align="center">
          <template slot-scope="scope">
            <s-select v-model="scope.row.monitorItcomp.account_uuid">
              <s-option v-for="(option,index) in filterAccount(scope.row.accountInfoList)" :key="index"
                        :label="option.accountName" :value="option.uuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">稽核</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        dialogFlag: false,
        checkList: []
      }
    },
    props: {
      assetList: {
        type: Array,
        default: []
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      let param = this.assetList.map(item => {
        return {
          citypeName: item['citypeName'],
          citypeUuid: item.citypeUuid,
          controlAdderss: item['controlAdderss'],
          itcompName: item['itcompName'],
          uuid: item.uuid
        };
      });
      $axios.post(`/collectTask/manualCheckList`, param).then(({data}) => {
        // [错误 #52479修复]-过滤掉"协议名称"/"资产账号"都没有下拉选项的资产
        this.checkList = data.filter((item, idx) => {
          return item.accountInfoList.length > 0 && item.tAssetsPortInfoList.length > 0;
        });
        this.checkList.forEach(item => {
          this.$set(item.monitorItcomp, 'port_uuid', '');
          this.$set(item.monitorItcomp, 'account_uuid', '');
        });
      });
    },
    methods: {
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入资产名称、IP地址、资产类别查询',
          searchProps: ['monitorItcomp.itcompName', 'monitorItcomp.controlAdderss', 'monitorItcomp.citypeName']
        }
      },
      filterPort(arr) {
        return arr.filter(item => {
          return item.protocolName !== 'VNC';
        })
      },
      filterAccount(arr) {
        return arr.filter(item => {
          return item.accountName && !(item.snmpCWordOr || item.snmpCWordRw);
        });
      },
      dialogOk() {
        let flag = this.checkList.every(item => {
          return item.monitorItcomp.port_uuid && item.monitorItcomp.account_uuid
        });
        if (!flag) {
          this.$message({showClose: true, message: '必须要选择协议名称和资产账号', type: 'warning'});
          return;
        }
        let arr = this.checkList.map(item => {
          return {
            device_uuid: item.monitorItcomp.uuid,
            port_uuid: item.monitorItcomp.port_uuid,
            account_uuid: item.monitorItcomp.account_uuid
          }
        });
        let param = {
          info: arr
        };
        let Loading = this.$loading({
          text: '正在稽核中...',
          customClass: 'checkLoading'
        });
        // 此处时间较长
        $axios.post(`/collectTask/manualCheck`, param, {timeout: 60000}, {
          data: this.checkList.map(item => item.monitorItcomp),
          logTemplate: '资产账号稽核|资产(#controlAdderss#/#itcompName#)'
        }).then(res => {
          Loading.close();
          if (res) {
            if (res.data.errcode === 1) {
              this.$emit('complete', res.data);
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: res.data.msg, type: 'error'});
            }
          } else {
            this.$message({showClose: true, message: '稽核失败', type: 'error'});
          }
        });
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

