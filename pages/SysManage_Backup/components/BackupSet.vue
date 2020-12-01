<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @Date: 2019-01-28 15:34:21
 * @LastEditors: 高建鹏
 * @LastEditEmail: shifeng199307@gmail.com
 * @LastEditTime: 2019-06-28 14:27:31
 * @Description: 备份设置tab
 -->

<template>
  <div class="backup-set">
    <s-tab v-model="activeTab">

      <!-- 手动备份部分 -->
      <s-tab-pane label="手动备份" name="pane1" v-if="judgeRoleBtn('systemSet_manualBackup') || judgeRoleBtn('gradeProtect_rsManualBackUp')">
        <div style="margin:0 10px;" v-if="activeTab === 'pane1'">
          <s-form ref="manualBackupForm" :model="manualBackupForm" :rules="manualBackupRules" label-width="120px">
            <s-form-item label="备份方式" prop="type">
              <s-select v-model="manualBackupForm.type">
                <s-option label="本地备份" :value="0"></s-option>
                <s-option label="FTP远程备份" :value="1"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item v-if="manualBackupForm.type === 1" label="备份服务器" prop="ftpUuid">
              <s-select v-model="manualBackupForm.ftpUuid">
                <s-option v-for="(item,index) in ftpList" :key="index" :label="item.archiveDeviceName" :value="item.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-button @click="manualBackupOk" :disabled="manualBackupDisabled">保存</s-button>
          </s-form>
        </div>
      </s-tab-pane>

      <!-- 自动备份部分 -->
      <s-tab-pane label="自动备份" name="pane2" v-if="judgeRoleBtn('systemSet_autoBackup') || judgeRoleBtn('gradeProtect_rsAutoBackUp')">
        <div style="margin:0 10px;" v-if="activeTab === 'pane2'">
          <s-form ref="autoBackupForm" :model="autoBackupForm" :rules="autoBackupRules" label-width="120px">
            <s-form-item label="备份方式" prop="type">
              <s-select v-model="autoBackupForm.type">
                <s-option label="本地备份" :value="0"></s-option>
                <s-option label="FTP远程备份" :value="1"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item v-if="autoBackupForm.type === 1" label="备份服务器" prop="ftpUuid">
              <s-select v-model="autoBackupForm.ftpUuid">
                <s-option v-for="(item,index) in ftpList" :key="index" :label="item.archiveDeviceName" :value="item.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-period v-model="autoBackupForm.tScheduleTime" ref="period" :showPeriodItem="true" :isShowNow="'is-show-now'"></s-period>
            <s-form-item label="启动" prop="isOpen">
              <s-switch v-model="autoBackupForm.isOpen"></s-switch>
            </s-form-item>
            <s-button @click="autoBackupOk">保存</s-button>
          </s-form>
        </div>
      </s-tab-pane>

    </s-tab>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  import sPeriod from '@/components/periodFormItem/Period'
  import {cloneDeep} from 'lodash';

  export default {
    components: {
      sPeriod // 定时控件
    },
    data() {
      return {
        tabNameArr: ['systemSet_manualBackup', 'systemSet_autoBackup'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1',
        ftpList: [], // ftp远程服务器列表

        // 手动备份表单
        manualBackupForm: {
          type: 0, // 备份类型: 0本地, 1ftp
          ftpUuid: '' // 备份服务器uuid
        },
        manualBackupRules: { // 动态切换两种校验
        },
        manualBackupRules0: {
          type: [Validaters.NotNull]
        },
        manualBackupRules1: {
          type: [Validaters.NotNull],
          ftpUuid: [Validaters.NotNull]
        },

        // 自动备份表单
        autoBackupForm: {
          type: 0, // 备份类型: 0本地, 1ftp
          ftpUuid: null, // 备份服务器uuid
          isOpen: false, // 启动
          tScheduleTime: {
            timeType: 1,
            day: 1,
            week: 1,
            month: 1,
            year: 1,
            dayOfWeek: [2],
            dayOfMonth: [1],
            monthOfYear: 1,
            isForever: 0,
            firstFireTime: undefined,
            endFireTime: undefined
          } // 定时对象,组件默认
        },
        autoBackupRules: { // 动态切换两种校验
        },
        autoBackupRules0: {
          type: [Validaters.NotNull]
        },
        autoBackupRules1: {
          type: [Validaters.NotNull],
          ftpUuid: [Validaters.NotNull]
        },
        manualBackupDisabled: false
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      this.getFtpList();
      this.getAutoBackupFormData();
      this.manualBackupRules = this.manualBackupRules0; // 首次加载使用rules0为默认
      this.autoBackupRules = this.autoBackupRules0; // 首次加载使用rules0为默认
    },
    watch: {
      'manualBackupForm.type'(val) {
        if (val === 0) {
          this.manualBackupRules = this.manualBackupRules0;
        } else if (val === 1) {
          this.manualBackupRules = this.manualBackupRules1;
        }
      },
      'autoBackupForm.type'(val) {
        if (val === 0) {
          this.autoBackupRules = this.autoBackupRules0;
          this.autoBackupForm.ftpUuid = null;
        } else if (val === 1) {
          this.autoBackupRules = this.autoBackupRules1;
        }
      }
    },
    methods: {
      // 获取自动备份设置数据
      getAutoBackupFormData() {
        $axios.get('/systemmanager/sysBackupLog/getAutoSysBackupConf').then((res) => {
          if (res.data) {
            this.autoBackupForm = {...res.data, isOpen: (res.data.isOpen === 1)}
            if (this.autoBackupForm.tScheduleTime === null) {
              this.autoBackupForm.tScheduleTime = {
                timeType: 1,
                day: 1,
                week: 1,
                month: 1,
                year: 1,
                dayOfWeek: [2],
                dayOfMonth: [1],
                monthOfYear: 1,
                isForever: 0,
                firstFireTime: undefined,
                endFireTime: undefined
              }
            }
        }
        })
      },
      // 获取备份服务器列表
      getFtpList() {
        $axios.get('/archiveDevice/getList').then((res) => {
          if (res.data) {
            this.ftpList = res.data
          }
        })
      },
      // 手动备份表单保存
      manualBackupOk() {
        let formEl = this.$refs.manualBackupForm;
        formEl.validate(valid => {
          // 进行校验，如果没有通过则终止函数
          if (!valid) return;
          // 展开拷贝，去掉地址引用
          let param = {...this.manualBackupForm};
          // 添加日志
          let logParam = {
            data: [this.manualBackupForm],
            logTemplate: '设置|手动备份配置'
          };
          this.manualBackupDisabled = true;
          // 发送请求
          $axios.post(`/systemmanager/sysBackupLog/saveSysBackupLog`, param, logParam).then(({data}) => {
            if (data.state === true) {
              this.$message({showClose: true, message: '保存成功', type: 'success'});
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
            this.manualBackupDisabled = false;
          });
        })
      },
      // 自动备份表单保存
      autoBackupOk() {
        let formEl = this.$refs.autoBackupForm;
        formEl.validate(valid => {
          // 进行校验，如果没有通过则终止函数
          if (!valid) return;
          this.$refs.period.$refs.periodForm.validate((v) => {
            if (!v) return;
            // 展开拷贝，去掉地址引用
            let param = {...this.formattScheduleTime(this.autoBackupForm), isOpen: (this.autoBackupForm.isOpen ? 1 : 0)};
            // 添加日志
            let logParam = {
              data: [this.autoBackupForm],
              logTemplate: '设置|自动备份配置'
            };
            // 发送请求
            $axios.post(`/systemmanager/sysBackupLog/autoSysBackup`, param, logParam).then(({data}) => {
              if (data.state === true) {
                this.$message({showClose: true, message: '保存成功', type: 'success'});
                this.getAutoBackupFormData()
              } else {
                this.$message({showClose: true, message: data.errormsg, type: 'error'});
              }
            });
          });
        })
      },
      delNotNeedKey(arr, target) {
        for (let key in target) {
          if (arr.indexOf(key) < 0) {
            delete target[key]
          }
        }
        return target
      },
      formattScheduleTime(obj) {
        const notPeriod = ['timeType', 'firstFireTime']
        const dayKeys = ['timeType', 'firstFireTime', 'endFireTime', 'day']
        const dayKeysForever = ['timeType', 'firstFireTime', 'isForever', 'day']
        const weekKeys = ['timeType', 'firstFireTime', 'endFireTime', 'week', 'dayOfWeek']
        const weekKeysForever = ['timeType', 'firstFireTime', 'isForever', 'week', 'dayOfWeek']
        const monthKeys = ['timeType', 'firstFireTime', 'endFireTime', 'month', 'dayOfMonth']
        const monthKeysForever = ['timeType', 'firstFireTime', 'isForever', 'month', 'dayOfMonth']
        const yearKeys = ['timeType', 'firstFireTime', 'endFireTime', 'year', 'dayOfMonth', 'monthOfYear']
        const yearKeysForever = ['timeType', 'firstFireTime', 'isForever', 'year', 'dayOfMonth', 'monthOfYear']
        let newForm = cloneDeep(obj)
        if (newForm.isPeriod === 0) {
          newForm.tScheduleTime = this.delNotNeedKey(notPeriod, newForm.tScheduleTime)
          newForm.tScheduleTime.timeType = 7
        } else {
          let type = newForm.tScheduleTime.timeType
          let forever = newForm.tScheduleTime.isForever
          if (type === 1) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(dayKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(dayKeys, newForm.tScheduleTime)
            }
          }
          if (type === 2) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(weekKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(weekKeys, newForm.tScheduleTime)
            }
          }
          if (type === 3) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(monthKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(monthKeys, newForm.tScheduleTime)
            }
          }
          if (type === 4) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(yearKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(yearKeys, newForm.tScheduleTime)
            }
          }
        }
        for (let key in newForm.tScheduleTime) {
          // 转日期为int
          if ((key === 'firstFireTime' || key === 'endFireTime') && newForm.tScheduleTime[key] !== null) {
            newForm.tScheduleTime[key] = parseInt(new Date(newForm.tScheduleTime[key]).getTime() / 1000)
          }
          // 转数组为字符串
          if ((key === 'dayOfWeek' || key === 'dayOfMonth') && newForm.tScheduleTime[key].length > 0) {
            newForm.tScheduleTime[key] = newForm.tScheduleTime[key].join(',')
          }
          // 依据不同情况删除多余字段
        }
        return newForm
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
