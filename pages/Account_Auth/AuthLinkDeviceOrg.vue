<template>
  <div class="auth-link-deivce-org">
    <s-row>
      <s-col span="4" offset="2">
        <s-checkbox v-model="updown.all">全局</s-checkbox>
      </s-col>
      <s-col span="4">
        <s-checkbox v-model="updown.cutup" :disabled="!updown.all">剪贴板上行</s-checkbox>
      </s-col>
      <s-col span="4">
        <s-checkbox v-model="updown.cutdown"  :disabled="!updown.all">剪贴板下行</s-checkbox>
      </s-col>
      <s-col span="4">
        <s-checkbox v-model="updown.diskup"  :disabled="!updown.all">磁盘映射上行</s-checkbox>
      </s-col>
      <s-col span="6">
        <s-checkbox v-model="updown.diskdown"  :disabled="!updown.all">磁盘映射下行</s-checkbox>
      </s-col>
    </s-row>
    <s-table-page
      :data="deviceOrgList"
      :show-header-checkbox="true"
      :header-search="getHeaderSearch()"
      :row-actions="getRowActions()"
      key="authLinkDeviceOrg"
      ref="authLinkDeviceOrg">
      <s-table-column
        type="selection"
        width="45">
      </s-table-column>
      <s-table-column
        label="运维责任组名称"
        prop="deviceGroupName">
      </s-table-column>
      <s-table-column
        label="备注"
        prop="remark">
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    props: {
      data: Object
    },
    data() {
      return {
        deviceOrgList: [],
        selectedDeviceOrg: [],
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
          icon: 'app',
          name: '高级',
          click(row) {
            vm.showDeviceOrgUpDown(row);
          }
        }]
      },

      getHeaderSearch() {
        return {
          searchProps: ['deviceGroupName', 'remark']
        }
      },

      getList() {
        let vm = this;
        $axios.post('/operationDeviceGroup/getAllDeviceGroupList').then((res) => {
          vm.deviceOrgList = res.data;
          if (this.data) {
            this.$nextTick(() => {
              this.autoSelect();
            });
          }
        });
      },
      showDeviceOrgUpDown(row) {
        this.$emit('showDeviceOrgUpDown', row);
      },
      autoSelect() {
        for (let i = 0; i < this.data.authHaveDeviceGroupLists.length; i++) {
          for (let j = 0; j < this.deviceOrgList.length; j++) {
            if (this.data.authHaveDeviceGroupLists[i].deviceGroupUuid === this.deviceOrgList[j].uuid) {
              this.deviceOrgList[j].authDeviceHaveShareoptionList = this.data.authHaveDeviceGroupLists[i].authDevicegroupShareoptionList;
              this.$refs.authLinkDeviceOrg.toggleRowSelection(this.deviceOrgList[j]);
              break;
            }
          }
        }
      }
    },
    created() {
      this.getList();
    }
  }
</script>
