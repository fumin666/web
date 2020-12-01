<template>
  <section id="receive">
    <s-row :gutter="20" class="interlligentTab">
      <s-col :span="12">
        <div class="logscontainer">
          <div class="card-title header">
            <i class="iconfont icon-set title"></i>
            Syslog日志接收级别设置
          </div>
          <s-form class="logform" ref="formReceive" :model="formReceive" label-width="150px" :rules="rulesReceive" style="display:grid;padding-left: 20px">
            <s-form-item label="Syslog监听端口" prop="monitorPort" style="margin-bottom: 15px;">
              <s-input v-model="formReceive.monitorPort" style="width: 95%"></s-input>
            </s-form-item>
            <s-form-item label=" Syslog接收级别" style="margin-bottom: 25px; padding-left: 10px">
              <s-checkbox-group v-model="formReceive.checkList">
                <s-checkbox label="应急"></s-checkbox>
                <s-checkbox label="警报"></s-checkbox>
                <s-checkbox label="致命"></s-checkbox>
                <s-checkbox label="错误"></s-checkbox>
                <s-checkbox label="警告"></s-checkbox>
                <s-checkbox label="提示"></s-checkbox>
                <s-checkbox label="信息"></s-checkbox>
                <s-checkbox label="诊断"></s-checkbox>
                <s-checkbox label="未知"></s-checkbox>
              </s-checkbox-group>
              <h4 style="color:#b22222">(至少勾选一项)</h4>
            </s-form-item>
            <s-button @click="submitReceive()" style="margin: 0 auto">保存</s-button>
          </s-form>

        </div>
      </s-col>
      <s-col :span="12">
        <div class="logscontainer">
          <div class="card-title header">
            <i class="iconfont icon-set title"></i>
            Trap日志接收级别设置
          </div>
          <s-form class="logform" ref="formReceiveTrap" :model="formReceiveTrap" label-width="150px" :rules="ruleReceiveTrap" style="display:grid;padding-left: 20px">
            <s-form-item label="Trap监听端口" prop="monitorPort" style="margin-bottom: 15px;">
              <s-input v-model="formReceiveTrap.monitorPort" style="width: 95%"></s-input>
            </s-form-item>
            <s-form-item label="  Trap接收级别" style="margin-bottom: 25px; padding-left: 10px">
              <s-checkbox-group v-model="formReceiveTrap.checkList">
                <s-checkbox label="应急"></s-checkbox>
                <s-checkbox label="警报"></s-checkbox>
                <s-checkbox label="致命"></s-checkbox>
                <s-checkbox label="错误"></s-checkbox>
                <s-checkbox label="警告"></s-checkbox>
                <s-checkbox label="提示"></s-checkbox>
                <s-checkbox label="信息"></s-checkbox>
                <s-checkbox label="诊断"></s-checkbox>
                <s-checkbox label="未知"></s-checkbox>
              </s-checkbox-group>
              <h4 style="color:#b22222">(至少勾选一项)</h4>
            </s-form-item>
            <s-button @click="submitReceiveTrap()" style="margin: 0 auto">保存</s-button>
          </s-form>
        </div>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      formReceive: {
        monitorPort: '',
        monitorPortUuid: '',
        checkList: ['应急', '警报', '致命', '错误', '警告', '提示', '信息', '诊断', '未知'],
        checkListUuid: ''
      },
      rulesReceive: {
        monitorPort: [
          Validaters.NotNull,
          Validaters.Port
        ]
      },
      formReceiveTrap: {
        monitorPort: '',
        monitorPortUuid: '',
        checkList: ['应急', '警报', '致命', '错误', '警告', '提示', '信息', '诊断', '未知'],
        checkListUuid: ''
      },
      ruleReceiveTrap: {
        monitorPort: [
          Validaters.NotNull,
          Validaters.Port
        ]
      }
    }
  },
  methods: {
    search() {
      let _self = this;
      let checkArr = ['应急', '警报', '致命', '错误', '警告', '提示', '信息', '诊断', '未知'];
      $axios.get(`/logReceiveSetting/getSettingInfo`).then((res) => {
        // sysLog日志接收级别设置
        if (res.data.sysLogSetting) {
          _self.formReceive.monitorPort = res.data.sysLogPortSetting[0].configValue;
          _self.formReceive.monitorPortUuid = res.data.sysLogPortSetting[0].uuid;
          // 1|2|3|4格式对应为具体的级别名称
          _self.formReceive.checkList = res.data.sysLogSetting[0].configValue.split('|').map((item, index) => {
            return checkArr[Number(item)]
          })
          if (_self.formReceive.checkList.length === 9) {
            _self.formReceive.checkList[_self.formReceiveTrap.checkList.length - 1] = '未知'
          }
          _self.formReceive.checkList.forEach((item, index) => {
            if (_self.formReceive.checkList[index] === undefined) {
              _self.formReceive.checkList[index] = '未知'
            }
          })
          _self.formReceive.checkListUuid = res.data.sysLogSetting[0].uuid;
        }
        //  trap日志接收级别设置
        if (res.data.trapSetting) {
          _self.formReceiveTrap.monitorPort = res.data.trapSetting[0].configValue;
          _self.formReceiveTrap.monitorPortUuid = res.data.trapSetting[0].uuid;
          // 1|2|3|4格式对应为具体的级别名称
          _self.formReceiveTrap.checkList = res.data.trapSetting[1].configValue.split('|').map((item, index) => {
            return checkArr[Number(item)]
          })
          if (_self.formReceiveTrap.checkList.length === 9) {
            _self.formReceiveTrap.checkList[_self.formReceiveTrap.checkList.length - 1] = '未知'
          }
          _self.formReceiveTrap.checkList.forEach((item, index) => {
            if (_self.formReceiveTrap.checkList[index] === undefined) {
              _self.formReceiveTrap.checkList[index] = '未知'
            }
          })
          _self.formReceiveTrap.checkListUuid = res.data.trapSetting[1].uuid;
        }
      })
    },
    submitReceive() {
      this.$refs.formReceive.validate((valid) => {
        if (valid) {
          let _self = this;
          let checkArr = ['应急', '警报', '致命', '错误', '警告', '提示', '信息', '诊断', '未知'];
          // 转换成2|3|4|5|6|7|8格式
          // 把不存在的项为undefined
          let checkList = checkArr.map((item, index) => {
            if (_self.formReceive.checkList.indexOf(item) > -1) {
              // filter会将为0的那项过滤，但是'0'不过滤
              return String(index);
            }
          });
          // 排除掉undefined
          let paramCheckList = checkList.filter((item) => {
            if (item !== 'undefined') {
              return item
            }
          })
          // 拼接格式
          // param设置动态key不能直接写
          let param = {};
          param[_self.formReceive.monitorPortUuid] = _self.formReceive.monitorPort;
          paramCheckList.forEach((item, index) => {
            if (paramCheckList[index] === '8') {
              paramCheckList[index] = '-1'
            }
          })
          param[_self.formReceive.checkListUuid] = paramCheckList.join('|')
          let obj = {
            data: [],
            logTemplate: '编辑|日志审计配置>日志接收配置>syslog日志接收级别'
          }
          $axios.post(`/logReceiveSetting/sysLogSetting`, param, obj).then((res) => {
            if (res.data === 'success') {
              _self.$message({
                message: '保存成功！',
                type: 'success'
              });
              // 重新渲染列表
              _self.search()
            } else {
              _self.$message({
                message: '保存失败！',
                type: 'error'
              });
            }
          })
        }
      })
    },
    submitReceiveTrap() {
      this.$refs.formReceiveTrap.validate((valid) => {
        if (valid) {
          let _self = this;
          let checkArr = ['应急', '警报', '致命', '错误', '警告', '提示', '信息', '诊断', '未知'];
          // 转换成2|3|4|5|6|7|8格式
          // 把不存在的项为undefined
          let checkList = checkArr.map((item, index) => {
            if (_self.formReceiveTrap.checkList.indexOf(item) > -1) {
              // filter会将为0的那项过滤，但是'0'不过滤
              return String(index);
            }
          });
          // 排除掉undefined
          let paramCheckList = checkList.filter((item) => {
            if (item !== 'undefined') {
              return item
            }
          })
          // 拼接格式
          // param设置动态key不能直接写
          paramCheckList.forEach((item, index) => {
            if (paramCheckList[index] === '8') {
              paramCheckList[index] = '-1'
            }
          })
          let param = {};
          param[_self.formReceiveTrap.monitorPortUuid] = _self.formReceiveTrap.monitorPort;
          param[_self.formReceiveTrap.checkListUuid] = paramCheckList.join('|')
          let obj = {
            data: [],
            logTemplate: '编辑|日志审计配置>日志接收配置>trap日志接收级别'
          }
          $axios.post(`/logReceiveSetting/sysLogSetting`, param, obj).then((res) => {
            if (res.data === 'success') {
              _self.$message({
                message: '保存成功！',
                type: 'success'
              });
              // 重新渲染列表
              _self.search()
            } else {
              _self.$message({
                message: '保存失败！',
                type: 'error'
              });
            }
          })
        }
      })
    }
  },
  created() {
    this.search()
  }
};
</script>

