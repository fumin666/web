/**
* Created by dgunzi on 2019/02/27.
* 系统设置标签页
*/
<template>
  <div id="SystemSettingTab">
  <s-row class="info-line">
    系统类型： {{ serverType }}
  </s-row>
  <s-row>
    <s-form :model="configInfo" :rules="rules" label-width="110px" ref="configInfo">
      <div class="config-form">
        <div>
          <s-row class="blockTitle"><div class="title">基础配置</div></s-row>
            <s-form-item label="本机物理IP" prop="physical_ip">
              <s-input v-model="configInfo.physical_ip"></s-input>
            </s-form-item>
            <s-form-item label="本机映射IP" prop="mapper_ip">
              <s-input v-model="configInfo.mapper_ip"></s-input>
            </s-form-item>
        </div>
        <div v-if="configInfo.server_type === '1' && !standAlone">
          <s-row class="blockTitle"><div class="title">特殊配置</div></s-row>
          <s-form-item label="主机IP" prop="master_ip">
            <s-input v-model="configInfo.master_ip"></s-input>
          </s-form-item>
          <s-form-item label="备机IP" prop="slave_ip">
            <s-input v-model="configInfo.slave_ip"></s-input>
          </s-form-item>
          <s-form-item label="浮动IP" prop="vip">
            <s-input v-model="configInfo.vip"></s-input>
          </s-form-item>
        </div>
        <div v-if="configInfo.server_type === '2'">
          <s-row class="blockTitle"><div class="title">特殊配置</div></s-row>
          <s-form-item label="主服务器IP" prop="master_server_ip">
            <s-input v-model="configInfo.master_server_ip"></s-input>
          </s-form-item>
          <s-form-item label="备服务器IP" prop="slave_server_ip"  v-if="configInfo.is_ha === '1'">
            <s-input v-model="configInfo.slave_server_ip"></s-input>
          </s-form-item>
          <s-form-item label="服务器VIP" prop="vip_server_ip" v-if="configInfo.is_ha === '1'">
            <s-input v-model="configInfo.vip_server_ip"></s-input>
          </s-form-item>

        </div>
        <div>
          <s-row class="blockTitle"><div class="title">前端源码模式</div></s-row>
          <s-form-item label="调试模式">
            <s-switch v-model="configInfo.is_open_source_debug" @change="changeDebug" :active-value="1" :inactive-value="0"></s-switch>
          </s-form-item>
        </div>
      </div>
    </s-form>
    <s-button  @click="submitForm" style="margin-left: 80px">保存</s-button>
  </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
      name: 'SystemSettingTab',
      data() {
          return {
            configInfo: {},
            rules: {
              physical_ip: [
                {
                  pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
                  message: '请输入正确的物理IP信息',
                  trigger: 'blur'
                }
              ],
              mapper_ip: [
                  {
                    pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
                    message: '请输入正确的本机映射IP信息',
                    trigger: 'blur'
                  }
              ],
              master_ip: [
                {
                  pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
                  message: '请输入正确的主机IP信息',
                  trigger: 'blur'
                }
              ],
              slave_ip: [
                {
                  pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
                  message: '请输入正确的备机IP信息',
                  trigger: 'blur'
                }
              ],
              vip: [
                {
                  pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
                  message: '请输入正确的浮动IP信息',
                  trigger: 'blur'
                }
              ],
              master_server_ip: [
                {
                  pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
                  message: '请输入正确的主服务器IP信息',
                  trigger: 'blur'
                }
              ],
              vip_server_ip: [
                {
                  pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
                  message: '请输入正确的备服务器IP信息',
                  trigger: 'blur'
                }
              ],
              slave_server_ip: [
                {
                  pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
                  message: '请输入正确的服务器VIP信息',
                  trigger: 'blur'
                }
              ]
            },
            serverType: '',
            standAlone: true
          }
      },
      created() {
        this.getSysconfig()
      },
      methods: {
        submitForm() {
          this.$refs['configInfo'].validate((valid) => {
            if (valid) {
              $axios.post(`/configcenter/sysconfig/setSysConfig`, this.configInfo).then(({data}) => {
                if (data.result) {
                  this.$message.success(data.errormsg);
                } else {
                  this.$message.error(data.errormsg);
                }
              });
            } else {
              return false;
            }
          });
        },
        getSysconfig() {
          $axios.get(`/configcenter/sysconfig/getSysConfig`).then(({data}) => {
            if (data) {
              this.configInfo = data;
              // 主服务器
              if (data.server_type === '1') {
                this.serverType = '主服务器';
                // 判断是否为双机情况
                if (data.master_ip !== 'undefined' && data.slave_ip !== 'undefined' && typeof data.vip !== 'undefined') {
                  this.standAlone = false;
                }
              } else {
                this.serverType = '节点服务器';
                this.standAlone = true;
              }
            }
          });
        },
        changeDebug(mode) {
          var action = 'open';
          if (mode === 0) {
            action = 'close';
          }
          $axios.get(`/configcenter/sysconfig/openSourceDebug/${action}`).then(({data}) => {
            if (data.result) {
              this.$message.success(data.errormsg);
            } else {
              this.$message.error(data.errormsg);
            }
          });
        }
      }
  }
</script>
