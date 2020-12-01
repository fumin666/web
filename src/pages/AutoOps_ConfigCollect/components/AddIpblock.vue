<template>
  <s-form :model="Form" ref="Form" :rules="Rules" label-width="100px">
    <s-form-item label="子网地址" prop="subNetAddress">
      <s-input v-model="Form.subNetAddress" @blur="calcIpInfo"></s-input>
    </s-form-item>
    <s-form-item label="子网掩码" prop="subNetMask">
      <s-select v-model="Form.subNetMask" @change="changeHost">
        <s-option v-for="subNetMask in subNetMaskLIst" :key="subNetMask" :label="subNetMask"
                  :value="subNetMask"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="最大资产数" prop="mxHostCount">
      <s-input-number v-model="Form.mxHostCount" :disabled=true></s-input-number>
    </s-form-item>
    <s-form-item label="IP地址段" prop="ipaddress">
      <s-input v-model="Form.ipaddress" placeholder="请按照IP~IP格式输入" :disabled=true></s-input>
    </s-form-item>
  </s-form>
</template>
<script type="text/babel">
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data () {
      return {
        Form: {
          subNetAddress: '',
          mxHostCount: '',
          subNetMask: ''
        },
        Rules: {
          subNetAddress: [
            Validaters.NotNull,
            Validaters.IP
          ],
          mxHostCount: [Validaters.NotNull],
          subNetMask: [Validaters.NotNull],
          ipaddress: [Validaters.NotNull]
        },
        subNetMaskLIst: []
      }
    },
    methods: {
      calcIpInfo() {
        this.$refs.Form.validateField('subNetAddress', err => {
          if (!err) {
            this.Form.mxHostCount = 254;
            if (Validaters.isIpv4(this.Form.subNetAddress)) {
              this.subNetMaskLIst = [
                '255.255.255.0',
                '255.255.255.128',
                '255.255.255.192',
                '255.255.255.224',
                '255.255.255.240',
                '255.255.255.248',
                '255.255.255.252'
              ];
              this.Form.ipType = 4;
              this.Form.ipaddress = this.ipStartAndEnd(254, 3, this.Form.subNetAddress);
            } else {
              this.subNetMaskLIst = ['ipv6'];
              this.Form.ipType = 6;
              this.Form.ipaddress = this.ipv6StartAndEnd(this.Form.subNetAddress);
            }
            this.$nextTick(() => {
              this.Form.subNetMask = this.subNetMaskLIst[0];
            })
          }
        })
      },
      changeHost(val) {
        let a = this.Form.subNetAddress
        switch (val) {
          case '255.255.255.0':
            this.Form.mxHostCount = '254';
            let ip = this.ipStartAndEnd(254, 3, a);
            this.Form.ipaddress = ip;
            break;
          case '255.255.255.128':
            this.Form.mxHostCount = '126';
            let ip1 = this.ipStartAndEnd(126, 3, a);
            this.Form.ipaddress = ip1;
            break;
          case '255.255.255.192':
            this.Form.mxHostCount = '62';
            let ip2 = this.ipStartAndEnd(62, 3, a);
            this.Form.ipaddress = ip2;
            break;
          case '255.255.255.224':
            this.Form.mxHostCount = '30';
            let ip3 = this.ipStartAndEnd(30, 3, a);
            this.Form.ipaddress = ip3;
            break;
          case '255.255.255.240':
            this.Form.mxHostCount = '14';
            let ip4 = this.ipStartAndEnd(14, 3, a);
            this.Form.ipaddress = ip4;
            break;
          case '255.255.255.248':
            this.Form.mxHostCount = '6';
            let ip5 = this.ipStartAndEnd(6, 3, a);
            this.Form.ipaddress = ip5;
            break;
          case '255.255.255.252':
            this.Form.mxHostCount = '2';
            let ip6 = this.ipStartAndEnd(2, 3, a);
            this.Form.ipaddress = ip6;
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
