/**
* Created by dgunzi on 2019/03/07.
* 添加策略表单
*/
<template>
  <s-form :model="Form" ref="Form" :rules="Rules" label-width="100px">
    <s-form-item label="子网地址" prop="subNetIP">
      <s-input v-model="Form.subNetIP" @blur="calcIpInfo" style="width: 250px"></s-input>
    </s-form-item>
    <s-form-item label="子网掩码" prop="subNetMask">
      <s-select v-model="Form.subNetMask" @change="changeHost" style="width: 250px">
        <s-option v-for="subNetMask in subNetMaskLIst" :key="subNetMask" :label="subNetMask"
                  :value="subNetMask"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="IP地址段" prop="segmentIp">
      <s-input v-model="Form.segmentIp" placeholder="请按照IP~IP格式输入" :disabled=true style="width: 250px"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
  import {Validaters} from 'sunflower-common-utils';

  export default {
    name: 'AddIPRule',
    data() {
      return {
        Form: {
          subNetIP: '',
          mxHostCount: '',
          segmentIp: ''
        },
        Rules: {
          subNetIP: [
            Validaters.NotNull,
            Validaters.IP
          ],
          subNetMask: [Validaters.NotNull],
          segmentIp: [Validaters.NotNull]
        },
        subNetMaskLIst: []
      }
    },
    created() {
    },
    methods: {
      calcIpInfo() {
        this.$refs.Form.validateField('subNetIP', err => {
          if (!err) {
            this.Form.mxHostCount = 254;
            if (Validaters.isIpv4(this.Form.subNetIP)) {
              this.subNetMaskLIst = [
                '255.255.255.0',
                '255.255.255.128',
                '255.255.255.192',
                '255.255.255.224',
                '255.255.255.240',
                '255.255.255.248',
                '255.255.255.252'
              ];
              this.Form.segmentIp = this.ipStartAndEnd(254, 3, this.Form.subNetIP);
            } else {
              this.subNetMaskLIst = ['ipv6'];
              this.Form.segmentIp = this.ipv6StartAndEnd(this.Form.subNetIP);
            }
          }
        })
      },
      changeHost(val) {
        let a = this.Form.subNetIP
        switch (val) {
          case '255.255.255.0':
            let ip = this.ipStartAndEnd(254, 3, a);
            this.Form.segmentIp = ip;
            break;
          case '255.255.255.128':
            let ip1 = this.ipStartAndEnd(126, 3, a);
            this.Form.segmentIp = ip1;
            break;
          case '255.255.255.192':
            let ip2 = this.ipStartAndEnd(62, 3, a);
            this.Form.segmentIp = ip2;
            break;
          case '255.255.255.224':
            let ip3 = this.ipStartAndEnd(30, 3, a);
            this.Form.segmentIp = ip3;
            break;
          case '255.255.255.240':
            let ip4 = this.ipStartAndEnd(14, 3, a);
            this.Form.segmentIp = ip4;
            break;
          case '255.255.255.248':
            let ip5 = this.ipStartAndEnd(6, 3, a);
            this.Form.segmentIp = ip5;
            break;
          case '255.255.255.252':
            let ip6 = this.ipStartAndEnd(2, 3, a);
            this.Form.segmentIp = ip6;
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
      }
    }
  }
</script>

<style scoped>

</style>
