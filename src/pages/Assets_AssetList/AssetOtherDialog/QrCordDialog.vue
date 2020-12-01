<template>
  <s-dialog v-model="dialogFlag" title="生成二维码" width="600px" class="qrCordDialog">
    <div class="qrCordContainer">
      <s-row :gutter="15">
        <s-col span="12" class="qrCord">
          <img :src="baseUrl + qrCordUrl" :style="{'width': width + 'px', 'height': width + 'px'}"/>
        </s-col>
        <s-col span="12" class="assetInfo">
          <s-row class="rowx">
            <span class="namex">资产名称：</span>
            <span class="value" :title="curAsset['itcompName']">{{curAsset['itcompName']?curAsset['itcompName']:'--'}}</span>
          </s-row>
          <s-row class="rowx">
            <span class="namex">IP地址：</span>
            <span class="value" :title="curAsset['controlAdderss']">{{curAsset['controlAdderss']?curAsset['controlAdderss']:'--'}}</span>
          </s-row>
          <s-row class="rowx">
            <span class="namex">资产类型：</span>
            <span class="value" :title="typeof(curAsset['totalTypeName'])==='string'?curAsset['totalTypeName'].split('/').reverse()[0]:'-'">{{typeof(curAsset['totalTypeName'])==='string'?curAsset['totalTypeName'].split('/').reverse()[0]:'-'}}</span>
          </s-row>
          <s-button @click="downQrCord">下载</s-button>
        </s-col>
      </s-row>
    </div>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        qrCordUrl: '',
        width: 170
      }
    },
    props: {
      curAsset: {
        type: Object,
        require: true
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.baseUrl = $axios.basePath();
      let param = {
        uuid: this.curAsset.uuid,
        width: this.width,
        height: this.width
      };
      $axios.post(`resourcemanager/assetQrcode/createAssetQrcode`, param).then(({data}) => {
        this.qrCordUrl = data;
      });
    },
    methods: {
      downQrCord() {
        Download('resourcemanager/assetQrcode/downloadQrcode/' + btoa(this.utf16to8(this.qrCordUrl)));
      },
      utf16to8(str) {
        let out, i, len, c;
        out = '';
        len = str.length;
        for (i = 0; i < len; i++) {
          c = str.charCodeAt(i);
          if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
          } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          }
        }
        return out;
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style lang="stylus" scoped>
.namex{
  font-weight: bold;
}
.rowx{
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}
 /* .qrCordDialog
    .qrCordContainer
      padding 20px 20px 40px 20px
    .qrCord
      text-align center
    .assetInfo
      .s-row
        line-height 40px
        height 40px
        .name
          color: #8A9DB3
          font-size 16px
          font-weight 600
          display inline-block
          width: 100px
      .s-button
        width: 80%
        height 40px
        margin-top 10px
        font-size: 16px
        letter-spacing 5px
        background #06546E
        border 1px solid #00CAF4 */
</style>
