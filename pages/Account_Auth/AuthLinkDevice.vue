<template>
  <div class="auth-link-device">
    <s-row class="updown">
      <s-col span="3">
        <s-checkbox v-model="updown.all">全局</s-checkbox>
      </s-col>
      <s-col span="3">
        <s-checkbox v-model="updown.cutup" :disabled="!updown.all">剪贴板上行</s-checkbox>
      </s-col>
      <s-col span="3">
        <s-checkbox v-model="updown.cutdown"  :disabled="!updown.all">剪贴板下行</s-checkbox>
      </s-col>
      <s-col span="4">
        <s-checkbox v-model="updown.diskup"  :disabled="!updown.all">磁盘映射上行</s-checkbox>
      </s-col>
      <s-col span="4">
        <s-checkbox v-model="updown.diskdown"  :disabled="!updown.all">磁盘映射下行</s-checkbox>
      </s-col>
    </s-row>
    <s-table-page
      :data="deviceList"
      :show-header-checkbox="true"
      :header-search="getHeaderSearch()"
      :row-actions="getRowActions()"
      key="tableTepLinkDev"
      ref="authLinkDevice">
      <s-table-column
        type="selection"/>
      <s-table-column
        prop="devicename"
        label="资产名称"
        show-overflow-tooltip/>
      <s-table-column
        prop="ipaddr"
        label="IP地址"
        width="150"/>
      <s-table-column
        prop="citypeName"
        label="资产类型"
        show-overflow-tooltip/>
      <s-table-column
        label="协议">
        <template slot-scope="scope">
          <span class="clickable" v-text="scope.row.protocolname" @click="showProtocolDetails(scope.row.protocoluuid)"></span>
        </template>
      </s-table-column>
      <s-table-column
        prop="port"
        label="端口"
        width="80"/>
    </s-table-page>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    props: {
      data: Object
    },

    data() {
      return {
        deviceList: [],
        selectedDevUuid: [],
        updown: {
          all: false,
          cutup: false,
          cutdown: false,
          diskup: false,
          diskdown: false
        }
      }
    },

    methods: {
      getRowActions() {
        let vm = this;
        return [{
          icon: 'set',
          name: '设置',
          click(row) {
            vm.showDeviceAccount(row.deviceuuid, row.portuuid, row.protocoluuid);
          },
          show(row) {
            return row.protocoluuid !== '00000000000000000000000000000078' && localStorage.currentAuthPwd !== '1';
          }
        }, {
          icon: 'app',
          name: '高级',
          click(row) {
            vm.showDeviceUpDown(row);
          },
          show(row) {
            return row.protocoluuid === '00000000000000000000000000000077' || (row.protocolClass === '2' && row.protocoltype === '1');
          }
        }]
      },

      getHeaderSearch() {
        return {
          searchProps: ['devicename', 'ipaddr', 'citypeName', 'protocolname', 'port']
        }
      },

      getDevice() {
        let vm = this;
        $axios.post('/authInfo/getItcompPortForAuth').then((res) => {
          vm.deviceList = res.data;
          if (this.data) {
            this.$nextTick(() => {
              this.autoSelect();
            });
          }
        });
      },

      batchUuids() {
        let vm = this;
        for (let i = 0; i < vm.selectedDev.length; i++) {
          vm.selectedDevUuid.push({
            deviceUuid: vm.selectedDev[i].deviceuuid,
            portUuid: vm.selectedDev[i].portuuid
          });
        }
      },

      showProtocolDetails(uuid) {
        this.$emit('showProtocolDetails', uuid);
      },

      showDeviceAccount(deviceuuid, portuuid, protocoluuid) {
        this.$emit('showDeviceAccount', deviceuuid, portuuid, protocoluuid);
      },

      showDeviceUpDown(row) {
        this.$emit('showDeviceUpDown', row);
      },

      autoSelect() {
        for (let i = 0; i < this.data.authHaveDeviceLists.length; i++) {
          for (let j = 0; j < this.deviceList.length; j++) {
            if (this.data.authHaveDeviceLists[i].deviceUuid === this.deviceList[j].deviceuuid &&
                this.data.authHaveDeviceLists[i].portUuid === this.deviceList[j].portuuid) {
              this.deviceList[j].authDeviceHaveShareoptionList = this.data.authHaveDeviceLists[i].authDeviceHaveShareoptionList;
              this.$refs.authLinkDevice.toggleRowSelection(this.deviceList[j]);
              break;
            }
          }
        }
      }
    },

    created() {
      this.getDevice();
    }
  }
</script>

<style>
  .auth-link-device .clickable {
    text-decoration: underline;
    cursor: pointer;
  }
  .auth-link-device .updown {
    height: 40px;
    line-height: 40px;
  }
</style>
