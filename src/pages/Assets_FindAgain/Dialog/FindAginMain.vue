<!--
 * @Author: 高建鹏
 * @Version: //Q4资产发现
 * @Description:资产发现
 * @Position:资产发现主页面
 * @Date: 2019-06-05 16:37:35
 * @LastEditors  : mybells
 -->
<template>
<s-dialog id="findAgainDialog" v-model="findAgainDialogFlag" width="800px" title="扫描发现" :before-close="close">
  <s-scrollbar wrap-style="max-height: 550px;">
    <s-row>
      <s-col :span="14">
        <s-row>
          <s-col>
            <div class="table-block-title">SNMP共同体</div>
            <span>凭证(版本号)：</span>
            <li class="listblock" v-for="item in step1List" :key="item.uuid" @mouseenter="showUuid=item.uuid" @mouseleave="showUuid=null">
              {{item.community || item.userName}}
              (v{{item.version}})
              <i class="iconfont icon-error" v-show="item.uuid===showUuid" @click="axiosDeleteVerify([item.uuid])"></i>
            </li>
            <i class="iconfont icon-plus handlerPlus" @click="handlerPlus"></i>
          </s-col>
        </s-row>
        <s-row>
          <s-col>
            <div class="table-block-title">扫描方式</div>
            <s-radio-group v-model="scanType" style="margin-bottom: 10px;">
              <s-radio class="radio" :label="2">全网扫描</s-radio>
              <s-radio class="radio" :label="3">从种子扫描</s-radio>
              <s-radio class="radio" :label="1" @click.native="getstepList2">手动添加</s-radio>
            </s-radio-group>
            <s-row v-if="scanType===2" style="height:50px;">
            </s-row>
            <s-row v-if="scanType===3" style="height:50px;">
              <s-input style="width: 252px" v-model="seedIP" placeholder="请输入"></s-input>
            </s-row>
          </s-col>
        </s-row>
      </s-col>
      <s-col :span="10" style="text-align:center;position: absolute; right: 0; top: calc(50% - 150px);">
        <img v-if="scanType===2" src="/static/images/assetpolling/findAgain/scanstatic.svg" style="width:70%;margin-top:20px;">
        <img v-if="scanType===3" src="/static/images/assetpolling/findAgain/scanstatic2.svg" style="width:70%;margin-top:20px;">
        <img v-if="scanType===1" src="/static/images/assetpolling/findAgain/scanstatic3.svg" style="width:70%;margin-top:20px;">
      </s-col>
    </s-row>
    <s-row v-if="scanType===1">
      <s-form :inline="true" :model="stepForm2" ref="stepForm2" :rules="step2Rules" label-width="95px">
        <s-form-item label="子网地址：" prop="subNetAddress" style="">
          <s-input v-model="stepForm2.subNetAddress" @blur="subNetAddressBlur"></s-input>
        </s-form-item>
        <s-form-item label="子网掩码：" prop="subNetMask">
          <s-select v-model="stepForm2.subNetMask" @change="subNetMaskChange">
            <s-option v-for="subNetMask in subNetMaskLIst" :key="subNetMask" :label="subNetMask"
                      :value="subNetMask"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item>
          <s-button @click="step2Submit" icon="plus">添加</s-button>
        </s-form-item>
      </s-form>
      <s-table
        id="step2Table"
        ref="table2"
        :stripe="false"
        style="width: 99%;margin-right:10px;"
        :data="stepList2">
        <s-table-column prop="subNetAddress" label="子网地址"></s-table-column>
        <s-table-column prop="subNetMask" label="子网掩码"></s-table-column>
        <s-table-column prop="mxHostCount" label="最大资产数" width="110px"></s-table-column>
        <s-table-column label="IP地址段" min-width="150px">
          <template slot-scope="scope">{{scope.row.startIpaddress}}~{{scope.row.endIpaddress}}</template>
        </s-table-column>
        <s-table-column min-width="40px">
          <template slot-scope="scope">
            <i class="iconfont icon-error" @click="deleteSelection(scope.row)"></i>
          </template>
        </s-table-column>
      </s-table>
    </s-row>
  </s-scrollbar>
  <template slot="footer" class="dialog-footer">
    <s-button @click="startscan">开始扫描</s-button>
    <s-button @click="close">取消</s-button>
  </template>

  <!-- 添加SNMP共同体 -->
  <addCommonDialog v-if="SNMPDialogFlag" :SNMPDialogFlag.sync="SNMPDialogFlag" @reload="getCommonData"></addCommonDialog>
</s-dialog>
</template>

<script>
import {cloneDeep} from 'lodash'
import $axios from 'sunflower-ajax';
import addCommonDialog from './AddCommonDialog.vue';
import {Validaters} from 'sunflower-common-utils';
export default {
  components: {
    addCommonDialog
  },
  data() {
    return {
      showUuid: null,
      findAgainDialogFlag: true, // 当前弹窗一直默认开启
      tempstepform2: {},
      SNMPDialogFlag: false, // 添加共同体弹窗
      step2Rules: {// 手动扫描方式校验
        subNetAddress: [
          Validaters.NotNull,
          Validaters.oneIP
        ],
        subNetMask: [
          Validaters.NotNull
        ]
      },
      subNetMaskLIst: []
    }
  },
  computed: {
    scanType: {
      get() {
        return this.$store.state.assetFindAgain.scanType;
      },
      set(val) {
        this.$store.commit('scanType', val);
      }
    },
    step1List: {
      get() {
        return this.$store.state.assetFindAgain.step1.step1List;
      },
      set(val) {
        this.$store.commit('setStep1List', val);
      }
    },
    seedIP: {
      get() {
        return this.$store.state.assetFindAgain.step1.seedIP;
      },
      set(val) {
        this.$store.commit('setSeedIP', val);
      }
    },
    stepForm2: {
      get() {
        return this.$store.state.assetFindAgain.step1.stepForm2;
      },
      set(val) {
        this.$store.commit('setStepForm2', val);
      }
    },
    stepList2: {
      get() {
        return this.$store.state.assetFindAgain.step1.stepList2;
      },
      set(val) {
        this.$store.commit('setStepList2', val);
      }
    }
  },
  created() {
    this.tempstepform2 = cloneDeep(this.stepForm2);
    this.getCommonData();
  },
  methods: {
    // get common data
    getCommonData() {
      $axios.post('/resourcemanager/discovery/listCommunitys').then((response) => {
        let {status, msg, data} = response;
        if (status !== 200) {
          this.$message({
            title: '错误',
            message: msg,
            type: 'error'
          });
        } else {
          this.step1List = data;
        }
      })
    },
    // 增加SNMP共同体
    handlerPlus() {
      this.SNMPDialogFlag = true;
    },
    // delete common data
    axiosDeleteVerify(params) {
      this.$confirm('确定删除当前凭证？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.post('/resourcemanager/discovery/deleteCommunitys', params).then(response => {
          if (response.data === 'success') {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            });
            this.getCommonData();
          } else {
            this.$message({
              showClose: true,
              message: '删除失败！',
              type: 'warnimg'
            });
          }
        });
      }).catch(() => {});
    },
    // 开始扫描
    startscan() {
      if (this.step1List.length <= 0) {
        this.$message({showClose: true, message: '请至少添加一项凭证！', type: 'warning'});
        return false;
      }
      // 种子
      if (this.scanType === 3) {
        let regIpv4 = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        let regIpv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
        if (!this.seedIP) {
          this.$message({showClose: true, message: '请输入IP！', type: 'warning'});
          return;
        }
        if (this.seedIP.indexOf(',') !== -1) {
          this.$message({showClose: true, message: '只能输入一个IP地址！', type: 'warning'});
          return;
        }
        if (!regIpv4.test(this.seedIP) && !regIpv6.test(this.seedIP)) {
          this.$message({showClose: true, message: '请输入正确格式的IP！', type: 'warning'});
          return;
        }
      }
      // 手动
      if (this.scanType === 1) {
        if (!this.stepList2.length) {
          this.$message({showClose: true, message: '请至少添加一项网段！', type: 'warning'});
          return;
        }
      }
      this.$store.commit('next');// 打开扫描弹窗
    },
    // 关闭资产发现
    close() {
      this.$emit('close')
    },
    /* 手动扫描方法 **********************************/
    step2Submit() {
      let vm = this;
      this.$refs.stepForm2.validate(valid => {
        if (!valid) {
          return false;
        }
        let param = {};
        for (let i in this.stepForm2) {
          if (i !== 'ipaddress') {
            param[i] = this.stepForm2[i];
          }
        }
        let ipAddressArr = this.stepForm2.ipaddress.split('~');
        if (ipAddressArr.length === 2) {
          param.startIpaddress = ipAddressArr[0];
          param.endIpaddress = ipAddressArr[1];
        }
        let flag = 1;
        vm.stepList2.forEach(function (obj) {
          if (obj.startIpaddress === param.startIpaddress && obj.endIpaddress === param.endIpaddress && obj.mxHostCount === param.mxHostCount && obj.subNetAddress === param.subNetAddress && obj.subNetMask === param.subNetMask) {
            vm.$message({showClose: true, message: '不能添加重复数据！', type: 'error'});
            flag = 0;
            return;
          }
        })
        if (flag === 1) {
          $axios.post('/resourcemanager/discovery/addNetSegment', param).then(({data, status}) => {
            if (status === 200 && data.state) {
              this.$message({showClose: true, message: data.errormsg, type: 'success'});
              this.stepForm2 = cloneDeep(this.tempstepform2);
              this.$set(this, 'subNetMaskLIst', [])
              vm.getstepList2()
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        }
      });
    },
    // 获取手动添加网段列表
    getstepList2() {
      $axios.post('/resourcemanager/discovery/listNetSegments').then((response) => {
        let {status, msg, data} = response;
        if (status !== 200) {
          this.$message({
            title: '错误',
            message: msg,
            type: 'error'
          });
        } else {
          this.stepList2 = data;
        }
      })
    },
    // 手动添加的网段删除
    deleteSelection(row) {
      let param = [row.uuid];
      this.$confirm('确定删除当前网段？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.post('/resourcemanager/discovery/deleteNetSegments', param).then(({data, status}) => {
          if (status === 200 && data === 'success') {
            this.$message({showClose: true, message: '删除成功！', type: 'success'});
            this.getstepList2();
          } else {
            this.$message({showClose: true, message: '删除失败！', type: 'error'});
          }
        });
      }).catch(() => {});
    },
    subNetAddressBlur() {
      this.$refs.stepForm2.validateField('subNetAddress', err => {
        if (!err) {
          this.stepForm2.mxHostCount = 254;
          if (Validaters.isIpv4(this.stepForm2.subNetAddress)) {
            this.subNetMaskLIst = [
              '255.255.255.0',
              '255.255.255.128',
              '255.255.255.192',
              '255.255.255.224',
              '255.255.255.240',
              '255.255.255.248',
              '255.255.255.252'
            ];
            this.stepForm2.ipType = 4;
            this.stepForm2.ipaddress = this.ipStartAndEnd(254, 3, this.stepForm2.subNetAddress);
          } else {
            this.subNetMaskLIst = ['ipv6'];
            this.stepForm2.ipType = 6;
            this.stepForm2.ipaddress = this.ipv6StartAndEnd(this.stepForm2.subNetAddress);
          }
          // this.stepForm2.subNetMask = this.subNetMaskLIst[0];
        }
      })
    },
    subNetMaskChange(option) {
      let a = this.stepForm2.subNetAddress;
      switch (option) {
        case '255.255.255.0':
          this.stepForm2.mxHostCount = 254;
          this.stepForm2.ipaddress = this.ipStartAndEnd(254, 3, a);
          break;
        case '255.255.255.128':
          this.stepForm2.mxHostCount = 126;
          this.stepForm2.ipaddress = this.ipStartAndEnd(126, 3, a);
          break;
        case '255.255.255.192':
          this.stepForm2.mxHostCount = 62;
          this.stepForm2.ipaddress = this.ipStartAndEnd(62, 3, a);
          break;
        case '255.255.255.224':
          this.stepForm2.mxHostCount = 30;
          this.stepForm2.ipaddress = this.ipStartAndEnd(30, 3, a);
          break;
        case '255.255.255.240':
          this.stepForm2.mxHostCount = 14;
          this.stepForm2.ipaddress = this.ipStartAndEnd(14, 3, a);
          break;
        case '255.255.255.248':
          this.stepForm2.mxHostCount = 6;
          this.stepForm2.ipaddress = this.ipStartAndEnd(6, 3, a);
          break;
        case '255.255.255.252':
          this.stepForm2.mxHostCount = 2;
          this.stepForm2.ipaddress = this.ipStartAndEnd(2, 3, a);
          break;
        default:
      }
      this.$refs.stepForm2.validateField('ipaddress');
    },
    ipStartAndEnd(maxNum, index, subAddress) {
      let result = '';
      let subs = subAddress.split('.');
      let beginIP = '';
      let endIP = '';
      let partLength = maxNum + 2
      if (index === 3) {
        let start = Math.floor(Number.parseInt(subs[3]) / partLength) * partLength + 1
        beginIP = subs[0] + '.' + subs[1] + '.' + subs[2] + '.' + start;
        endIP = subs[0] + '.' + subs[1] + '.' + subs[2] + '.' + (start + maxNum - 1);
      } else if (index === 2) {
        let start = Math.floor(Number.parseInt(subs[2]) / partLength) * partLength + 1
        beginIP = subs[0] + '.' + subs[1] + '.' + start + '.' + subs[3];
        endIP = subs[0] + '.' + subs[1] + '.' + (start + maxNum - 1) + '.' + subs[3];
      }
      result = beginIP + '~' + endIP;
      return result;
    },
    ipv6StartAndEnd(ip) {
      return ip.slice(0, -2) + '00' + '~' + ip.slice(0, -2) + 'ff';
    }
  },
  watch: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
