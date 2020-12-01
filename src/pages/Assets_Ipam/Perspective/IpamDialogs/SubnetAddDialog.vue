<!--
 * @Author: 高建鹏
 * @LastEditors: 高建鹏
 * @Description: 子网添加
 * @Position: ipam -》 ip地址管理-》子网视角-》this
 * @Date: 2019-04-22 13:53:52
 * @LastEditTime: 2019-12-03 14:13:03
 -->
<template>
<div>
  <s-dialog v-model="addDialog" width="700px" :title="show===true?'子网编辑':'子网添加'" :before-close="addCancel">
    <s-scrollbar wrap-style="max-height: 500px;">
      <s-form :model="contentForm" :rules="rules" ref="contentForm" class="demo-ruleForm" label-width="100px">
        <s-form-item label="组织机构" prop="departUuid">
          <select-tree v-model="contentForm.departUuid" style="width: 250px" url="/departmentInfo/getAllDepartmentInfoForTree"></select-tree>
        </s-form-item>
        <s-form-item label="子网名称" prop="subNetName">
          <s-input v-model="contentForm.subNetName"></s-input>
        </s-form-item>
        <s-form-item label="子网地址" prop="subNetAddress">
          <s-input v-model="contentForm.subNetAddress" :disabled="show" @blur="subNetAddressBlur"></s-input>
        </s-form-item>
        <s-form-item label="子网掩码" prop="subNetMask">
          <s-select v-model="contentForm.subNetMask" :disabled="show" @change="subNetMaskChange">
            <s-option v-for="(val,index) in maskList" :label="val" :value="val" :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="IP地址段" prop="ipaddress">
          <s-input v-model="contentForm.ipaddress" disabled></s-input>
        </s-form-item>
        <s-form-item label="最大资产数" prop="mxHostCount">
          <s-input v-model="contentForm.mxHostCount" disabled></s-input>
        </s-form-item>
        <s-form-item label="描述" prop="remark">
          <s-input type="textarea" v-model="contentForm.remark"></s-input>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="addEnsure">确定</s-button>
      <s-button type="cancel" @click="addCancel">取消</s-button>
    </template>
  </s-dialog>
</div>
</template>

<script>
import SelectTree from '@/components/selectTree/SelectTree'
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';
export default {
  components: {
    SelectTree
  },
  props: {
    addDialog: {
      type: Boolean
    },
    subnetobj: {
      type: Object
    }
  },
  data() {
    return {
      show: false,
      rules: {
        departUuid: {
          required: true,
          message: '请选择组织机构',
          trigger: 'blur'
        },
        subNetName: [{
          max: 50,
          message: '最长输入50个字符',
          trigger: 'blur'
        }],
        subNetAddress: [
          Validaters.NotNull,
          Validaters.IP
        ],
        subNetMask: {
          required: true,
          message: '请选择子网掩码',
          trigger: 'blur'
        },
        remark: [Validaters.Max(120)]
      },
      organizationList: [],
      maskList: [],
      contentForm: {
        departUuid: '',
        subNetName: '',
        subNetAddress: '',
        subNetMask: '',
        ipaddress: '',
        mxHostCount: '',
        remark: ''
      }
    }
  },
  mounted() {
    if (this.subnetobj.uuid) { // 编辑
      Object.assign(this.contentForm, this.subnetobj);
      this.$nextTick(function() {
        this.subNetAddressBlur()
        this.subNetMaskChange(this.contentForm.subNetMask)
      })
      this.show = true;
    } else {
      this.show = false;
    }
  },
  methods: {
    subNetAddressBlur() {
      this.$refs.contentForm.validateField('subNetAddress', err => {
        if (!err) {
          if (Validaters.isIpv4(this.contentForm.subNetAddress)) {
            this.maskList = [
              '255.255.255.0',
              '255.255.255.128',
              '255.255.255.192',
              '255.255.255.224',
              '255.255.255.240',
              '255.255.255.248',
              '255.255.255.252'
            ];
            if (!this.contentForm.subNetMask) {
              return;
            }
            this.contentForm.ipaddress = this.ipStartAndEnd(254, 3, this.contentForm.subNetAddress);
          } else {
            this.maskList = ['ipv6'];
            if (!this.contentForm.subNetMask) {
              return;
            }
            this.contentForm.ipaddress = this.ipv6StartAndEnd(this.contentForm.subNetAddress);
          }
          this.contentForm.mxHostCount = 254;
        }
      })
    },
    subNetMaskChange(option) {
      let a = this.contentForm.subNetAddress;
      switch (option) {
        case '255.255.255.0':
          this.contentForm.mxHostCount = 254;
          this.contentForm.ipaddress = this.ipStartAndEnd(254, 3, a);
          break;
        case '255.255.255.128':
          this.contentForm.mxHostCount = 126;
          this.contentForm.ipaddress = this.ipStartAndEnd(126, 3, a);
          break;
        case '255.255.255.192':
          this.contentForm.mxHostCount = 62;
          this.contentForm.ipaddress = this.ipStartAndEnd(62, 3, a);
          break;
        case '255.255.255.224':
          this.contentForm.mxHostCount = 30;
          this.contentForm.ipaddress = this.ipStartAndEnd(30, 3, a);
          break;
        case '255.255.255.240':
          this.contentForm.mxHostCount = 14;
          this.contentForm.ipaddress = this.ipStartAndEnd(14, 3, a);
          break;
        case '255.255.255.248':
          this.contentForm.mxHostCount = 6;
          this.contentForm.ipaddress = this.ipStartAndEnd(6, 3, a);
          break;
        case '255.255.255.252':
          this.contentForm.mxHostCount = 2;
          this.contentForm.ipaddress = this.ipStartAndEnd(2, 3, a);
          break;
        default:
      }
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
    },
    addEnsure() {
      this.$refs.contentForm.validate(vaild => {
        if (!vaild) {
          return false;
        }
        if (this.show) { // 编辑
          let obj = {
            data: [this.contentForm],
            logTemplate: '编辑|子网(#subNetName#)'
          }
          $axios.post(`/ipamNetsegment/editSubNetsegment`, this.contentForm, obj).then(({data}) => {
            if (data.state) {
              this.$message({
                type: 'success',
                message: '修改成功！'
              })
              this.$emit('addEnsure')
            } else {
              this.$message({
                type: 'error',
                message: data.errormsg
              })
            }
          })
        } else {
          let obj = {
            data: [this.contentForm],
            logTemplate: '添加|子网(#subNetName#)'
          }
          $axios.post(`/ipamNetsegment/addSubNetsegment`, this.contentForm, obj).then(({data}) => {
            if (data.state) {
              this.$message({
                type: 'success',
                message: '添加成功！'
              })
              this.$emit('addEnsure')
            } else {
              this.$message({
                type: 'error',
                message: data.errormsg
              })
            }
          })
        }
      });
    },
    addCancel() {
      this.$emit('addCancel')
    }
  }
}
</script>

<style scoped>

</style>
