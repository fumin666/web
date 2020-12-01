<template>
  <s-dialog v-model="dialogFlag" title="软件" width="600px" class="softInfoDialog">
    <s-row class="title">
      <i class="iconfont icon-bulletin"></i> 软件信息
    </s-row>
    <s-form :model="softwareForm" :rules="softwareRules" ref="softwareForm" label-width="120px">
      <s-form-item label="名称:" prop="softWareName">
        <s-input v-model="softwareForm.softWareName"></s-input>
      </s-form-item>
      <s-form-item label="厂商:" prop="manufacter">
        <s-input v-model="softwareForm.manufacter"></s-input>
      </s-form-item>
      <s-form-item label="描述:" prop="softWareDesc">
        <s-input v-model="softwareForm.softWareDesc" type="textarea" :rows="3"></s-input>
      </s-form-item>
      <s-form-item label="安装时间:">
        <s-date-picker v-model="softwareForm.installDate" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"></s-date-picker>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        dialogFlag: false,
        softwareForm: {
          uuid: '',
          serverUuid: '',
          softWareName: '',
          manufacter: '',
          softWareDesc: '',
          installDate: ''
        },
        softwareRules: {
          softWareName: [Validaters.Max(200)],
          manufacter: [Validaters.Max(100)],
          softWareDesc: [Validaters.Max(200)]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      softUuid: {
        type: String,
        require: true
      }
    },
    created() {
      $axios.get(`/resourcemanager/assetmanager/itasset/getSoftwareInfoById/${this.softUuid}`).then(({data}) => {
        for (let i in this.softwareForm) {
          this.softwareForm[i] = data[i];
        }
      });
    },
    methods: {
      dialogOk() {
        this.$refs.softwareForm.validate(valid => {
          if (!valid) return;
          $axios.post(`/resourcemanager/assetmanager/itasset/softwareInfoUpdate`, this.softwareForm).then(({data}) => {
            if (data) {
              this.$message({showClose: true, message: '保存成功', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: '保存失败', type: 'error'});
            }
          });
        });
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
