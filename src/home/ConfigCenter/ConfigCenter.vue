/**
* Created by dgunzi on 2019/02/26.
* 配置中心
*/
<template>
  <div>
    <div style="float: right;font-size: 14px;margin-right: 20px;line-height: 35px">{{ ha_status }}</div>
    <s-tab type="card" style="margin-top: 10px" v-if="showTab" v-model="activeTab">
      <s-tab-pane label="产品激活" name="pane1">
        <!--产品激活-->
        <system-active v-if="activeTab === 'pane1'"></system-active>
      </s-tab-pane>
      <s-tab-pane label="产品升级" name="pane2">
        <!--产品升级-->
        <system-update v-if="activeTab === 'pane2'"></system-update>
      </s-tab-pane>
      <s-tab-pane label="系统设置" name="pane3">
        <!--系统设置-->
        <system-setting v-if="activeTab === 'pane3'"></system-setting>
      </s-tab-pane>
      <s-tab-pane v-if="showNodeManage" label="服务节点管理" name="pane4">
        <!--服务节点管理-->
        <service-node-manage v-if="activeTab === 'pane4'"></service-node-manage>
      </s-tab-pane>
      <s-tab-pane label="本机服务管理" name="pane5">
        <local-servie-manage v-if="activeTab === 'pane5'"></local-servie-manage>
      </s-tab-pane>
      <s-tab-pane label="托管中心配置" name="pane6">
        <app-box-config v-if="activeTab === 'pane6'"></app-box-config>
      </s-tab-pane>
    </s-tab>
    <s-dialog v-model="showInitDialog" v-if="showInitDialog" width="600px" title="请进行配置">
      <div style="margin-left: 110px">
        <s-form :model="nodeForm" :rules="rules" ref="nodeForm" label-width="120px">
          <s-form-item label="服务器类型" prop="server_type">
            <s-select v-model="nodeForm.server_type" style="width: 200px">
              <s-option label="主服务器" value="1"></s-option>
              <s-option label="服务节点" value="2"></s-option>
            </s-select>
          </s-form-item>

          <s-form-item label="主服务器模式" prop="collectType" v-if="nodeForm.server_type === '2'">
            <s-radio-group v-model="nodeForm.isHa">
              <s-radio label='0'>单机</s-radio>
              <s-radio label='1'>双机</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-form-item label="主服务器IP" prop="master_server_ip" v-if="nodeForm.server_type === '2'">
            <s-input v-model="nodeForm.master_server_ip" style="width: 200px"></s-input>
          </s-form-item>
          <s-form-item label="服务器VIP" prop="vip_server_ip" v-if="nodeForm.server_type === '2' && nodeForm.isHa === '1'">
            <s-input v-model="nodeForm.vip_server_ip" style="width: 200px"></s-input>
          </s-form-item>
          <s-form-item label="备服务器IP" prop="slave_server_ip" v-if="nodeForm.server_type === '2' && nodeForm.isHa === '1'">
            <s-input v-model="nodeForm.slave_server_ip" style="width: 200px"></s-input>
          </s-form-item>
        </s-form>
      </div>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitForm">确定</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';
import SystemUpdate from '@/pages/SysManage_ConfigCenter/SystemUpdate';
import SystemActive from '@/pages/SysManage_ConfigCenter/SystemActive';
import SystemSetting from '@/pages/SysManage_ConfigCenter/SystemSettingTab';
import ServiceNodeManage from '@/pages/SysManage_ConfigCenter/ServiceNodeManageTab';
import LocalServieManage from '@/pages/SysManage_ConfigCenter/LocalServieManageTab';
import AppBoxConfig from '@/pages/SysManage_ConfigCenter/AppBoxConfig';

export default {
  name: 'ConfigCenter',
  data() {
    return {
      activeTab: 'pane1',
      showInitDialog: false,
      showTab: false,
      nodeForm: {
        server_type: '1',
        isHa: '0',
        master_server_ip: '',
        vip_server_ip: '',
        slave_server_ip: ''
      },
      ha_status: '',
      showNodeManage: false,
      rules: {
        master_server_ip: [
          { required: true, message: '请输入服务器IP', trigger: 'blur' },
          {
            pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
            message: '请输入正确的IP信息',
            trigger: 'blur'
          }
        ],
        vip_server_ip: [
          { required: true, message: '请输入服务器IP', trigger: 'blur' },
          {
            pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
            message: '请输入正确的IP信息',
            trigger: 'blur'
          }
        ],
        slave_server_ip: [
          { required: true, message: '请输入服务器IP', trigger: 'blur' },
          {
            pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
            message: '请输入正确的IP信息',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    SystemUpdate,
    SystemActive,
    SystemSetting,
    ServiceNodeManage,
    LocalServieManage,
    AppBoxConfig
  },
  created() {
    this.getSysconfig()
  },
  watch: {
    'nodeForm.isHa': {
      immediate: true,
      handler(val) {
        this.nodeForm.vip_server_ip = '';
        this.nodeForm.slave_server_ip = '';
      }
    }
  },
  methods: {
    getSysconfig() {
      $axios.get(`/configcenter/sysconfig/getSysConfig`).then(({ data }) => {
        if (data && data.server_type === 'noset') {
          this.showInitDialog = true;
          this.showTab = false;
        } else {
          this.showInitDialog = false;
          this.showTab = true;
          this.ha_status = data.ha_status;
          // 节点服务器，不显示"服务节点管理"功能
          if (data.server_type === '1') {
            this.showNodeManage = true;
          }
        }
      });
    },
    submitForm() {
      this.$refs.nodeForm.validate((valid) => {
        if (!valid) return;
        this.$confirm('此操作会使服务重启, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Loading = this.$loading({
            text: '重启中，请稍候...',
            customClass: 'loadingClass',
            fullscreen: true
          });
          $axios.post('/configcenter/sysconfig/setServerType', {
            serverType: this.nodeForm.server_type,
            master_server_ip: this.nodeForm.master_server_ip,
            vip_server_ip: this.nodeForm.vip_server_ip,
            slave_server_ip: this.nodeForm.slave_server_ip,
            isHa: this.nodeForm.isHa
          }).then(({ data }) => {
            if (data.result) {
              this.showInitDialog = false;
              this.showTab = true;
              Loading.close();
              this.$message.success(data.errormsg);
            } else {
              Loading.close();
              this.$message.error(data.errormsg);
            }
          })
        }).catch(() => { });
      })
    }
  }
}
</script>

