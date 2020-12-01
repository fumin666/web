<template>
  <s-dialog v-model="dialogFlag" title="高级设置" width="600px" class="advanceSetDialog">
    <s-table :data="advancedSetData" style="width: 100%;">
      <s-table-column label="剪切板上行">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.clipboardUp" :active-value="1" :inactive-value="0"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="剪切板下行">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.clipboardDown" :active-value="1" :inactive-value="0"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="磁盘映射上行">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.diskMappingUp" :active-value="1" :inactive-value="0"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="磁盘映射下行">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.diskMappingDown" :active-value="1" :inactive-value="0"></s-switch>
        </template>
      </s-table-column>
    </s-table>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">保存</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        dialogFlag: false,
        advancedSetData: [{
            clipboardUp: 0,
            clipboardDown: 0,
            diskMappingUp: 0,
            diskMappingDown: 0
        }]
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      protocol: {
        type: Object,
        require: true
      },
      authUuid: {
        type: String,
        require: true
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
    },
    methods: {
      // 保存
      dialogOk() {
        let {clipboardUp, clipboardDown, diskMappingUp, diskMappingDown} = this.advancedSetData[0]
        let saveData = {
          authUuid: this.authUuid,
          portUuid: this.protocol.portuuid,
          deviceUuid: this.protocol.deviceUuid,
          clipboardUp,
          clipboardDown,
          diskMappingUp,
          diskMappingDown
        };
        $axios.post('/authInfo/saveOrUptAuthDeviceHaveShareoptionList', saveData).then(({data}) => {
          if (data === true) {
            this.$emit('closeAdvancedSet');
            this.dialogFlag = false;
            this.$message.success('保存成功！');
          } else {
            this.$message.error('保存失败，请重试！');
          }
        });
      }
    },
    created() {
      let getData = {
        authUuid: this.authUuid,
        portUuid: this.protocol.portuuid
      };
      $axios.post('/deviceauthInfo/getAuthDeviceShareoptionList', getData).then(({data}) => {
        if (data && data.hasOwnProperty('uuid')) {
          let {clipboardUp, clipboardDown, diskMappingUp, diskMappingDown} = data;
          this.advancedSetData = [{
            clipboardUp,
            clipboardDown,
            diskMappingUp,
            diskMappingDown
          }];
        }
      });
    }
  }
</script>
