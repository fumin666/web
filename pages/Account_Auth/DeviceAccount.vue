<template>
  <div class="device-account">
    <s-scrollbar wrap-style="max-height: 600px;">
      <s-table
        :data="allList"
        @selection-change="handleAccountChange"
        ref="deviceAccountList">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column label="账号名" prop="accountName" show-overflow-tooltip></s-table-column>
        <s-table-column label="账户角色" prop="accountTypeStr" show-overflow-tooltip></s-table-column>
        <s-table-column label="状态">
          <template slot-scope="scope">
            <span v-text="accountStatus[scope.row.status]"></span>
          </template>
        </s-table-column>
        <s-table-column label="备注" prop="remark"></s-table-column>
        <s-table-column label="操作" v-if="!isOrder">
          <template slot-scope="scope">
            <i class="iconfont icon-set" v-if="booleanSet" @click="showDb(scope.row.uuid)"></i>
          </template>
        </s-table-column>
      </s-table>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    props: {
      data: {
        required: true,
        type: Object
      },
      isOrder: {
        type: Boolean,
        default: false
      },
      selectedAccountArr: {
        type: Array
      }
    },
    data() {
      return {
        authUuid: this.data.authUuid,
        portUuid: this.data.portUuid,
        allList: [],
        selfList: [],
        selectedAccount: [],
        accountStatus: ['未激活', '激活', '锁定', '注销'],
        ppArr: [
          '00000000000000000000000000000080', // ORACLE
          '00000000000000000000000000000081', // DB2
          '00000000000000000000000000000082', // INFORMIX
          '00000000000000000000000000000084', // MySQL
          '00000000000000000000000000000085', // SQL SERVER
          '00000000000000000000000000000086', // Sybase
          '00000000000000000000000000000112', // postgreAdmin
          '00000000000000000000000000000113', // mssqlserver
          '00000000000000000000000000000114', // plsql
          '00000000000000000000000000000116', // sqlyog
          '00000000000000000000000000000118', // mysqlfront
          '00000000000000000000000000000120'  // toadoracle
        ],
        qqArr: [
          '00000000000000000000000000000114', // plsql
          '00000000000000000000000000000120', // toadoracle
          '00000000000000000000000000000080',  // ORACLE
          '00000000000000000000000000000113' // mssqlserver
        ],
        booleanSet: false
      }
    },
    methods: {
      getList() {
        $axios.get(`/assetsAccountInfo/getTAssetsPortInfoItByUuid/${this.portUuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            let pp = [];
            if (this.ppArr.indexOf(this.data.protocolUuid) > -1) {
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].accountTypeStr === '数据库账户') {
                  pp.push(res.data[i]);
                }
              }
              this.allList = pp;
              if (this.qqArr.indexOf(this.data.protocolUuid) > -1) {
                this.booleanSet = true;
              }
            } else {
              this.allList = res.data;
            }
            if (!this.isOrder) {
              this.getSelfList();
            } else {
              this.getSelectList();
            }
          }
        });
      },
      getSelectList() { // 选中已经保存的数据
        let vm = this;
        for (let i = 0; i < vm.allList.length; i++) {
          for (let j = 0; j < vm.selectedAccountArr.length; j++) {
            if (vm.selectedAccountArr[j].portUuid === this.portUuid && vm.allList[i].assetsUuid === vm.selectedAccountArr[j].deviceUuid) {
              for (let m = 0; m < vm.selectedAccountArr[j].accountUuidList.length; m++) {
                if (vm.allList[i].uuid === vm.selectedAccountArr[j].accountUuidList[m]) {
                  vm.$nextTick(() => {
                    vm.$refs.deviceAccountList.toggleRowSelection(vm.allList[i]);
                  });
                }
              }
            }
          }
        }
      },
      getSelfList() {
        $axios.get(`/authInfo/getAuthHaveResourceList/${this.authUuid}/${this.portUuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.selfList = res.data;
            if (this.selfList.length > 0) {
              this.$nextTick(() => {
                this.autoSelect();
              });
            }
          }
        });
      },
      autoSelect() {
        for (let i = 0; i < this.selfList.length; i++) {
          for (let j = 0; j < this.allList.length; j++) {
            if (this.selfList[i].accountUuid === this.allList[j].uuid) {
              this.$refs.deviceAccountList.toggleRowSelection(this.allList[j]);
              continue;
            }
          }
        }
      },
      handleAccountChange(val) {
        this.selectedAccount = val;
      },
      showDb(uuid) {
        this.$emit('showDb', {
          portUuid: this.portUuid,
          accountUuid: uuid,
          authUuid: this.authUuid
        });
      }
    },
    created() {
      this.getList();
    }
  }
</script>
