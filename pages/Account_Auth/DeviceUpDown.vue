<template>
  <div class="deivce-up-down">
    <s-form :data="deviceForm">
      <s-form-item label="剪贴板上行">
        <s-switch v-model="deviceForm.clipboardUp" size="small" :active-value="1" :inactive-value="0" :disabled="isView"></s-switch>
      </s-form-item>
      <s-form-item label="剪贴板下行">
        <s-switch v-model="deviceForm.clipboardDown" size="small" :active-value="1" :inactive-value="0" :disabled="isView"></s-switch>
      </s-form-item>
      <s-form-item label="磁盘映射上行">
        <s-switch v-model="deviceForm.diskMappingUp" size="small" :active-value="1" :inactive-value="0" :disabled="isView"></s-switch>
      </s-form-item>
      <s-form-item label="磁盘映射下行">
        <s-switch v-model="deviceForm.diskMappingDown" size="small" :active-value="1" :inactive-value="0" :disabled="isView"></s-switch>
      </s-form-item>
    </s-form>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    props: {
      data: Object,
      isView: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        deviceForm: {
          clipboardUp: 0,
          clipboardDown: 0,
          diskMappingUp: 0,
          diskMappingDown: 0
        }
      }
    },
    mounted() {
      this.getHave()
    },
    methods: {
      getHave() {
        let params = {
          authUuid: this.data.authUuid,
          tempUuid: this.data.tempUuid,
          uniqueUuid: this.data.uuid
        };
        $axios.post(`/operationAuth/getClipboardDiskMapSetting`, params).then(({data}) => {
          if (data) {
            this.deviceForm.clipboardUp = data.clipboardUp;
            this.deviceForm.clipboardDown = data.clipboardDown;
            this.deviceForm.diskMappingUp = data.diskMappingUp;
            this.deviceForm.diskMappingDown = data.diskMappingDown;
          }
        });
      }
    }
  }
</script>
