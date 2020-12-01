<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @Date: 2019-02-14 16:55:30
 * @LastEditors: 高建鹏
 * @LastEditEmail: shifeng199307@gmail.com
 * @LastEditTime: 2019-06-17 10:46:51
 * @Description: 远程恢复dialog
 -->

<template>
  <s-dialog v-model="dialogFlag" :title="'远程恢复'" width="660px" class="remoteRecDialog">
    <s-form :model="form" :rules="rules" ref="remoteRecForm" label-width="130px">
      <s-form-item label="选择应用服务器" prop="ftpUuid">
        <s-select v-model="form.ftpUuid">
          <s-option v-for="(item,index) in ftpList" :key="index" :label="item.archiveDeviceName" :value="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="备份目录" prop="ftpFilePath" tip="windows路径示例：c:\folder\   Linux示例：/c/folder/">
        <s-input v-model="form.ftpFilePath" placeholder="输入文件全路径，带文件名"></s-input>
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
      form: {
        ftpUuid: '',
        ftpFilePath: ''
      },
      rules: {
        ftpUuid: [Validaters.NotNull],
        ftpFilePath: [Validaters.NotNull, Validaters.Max(120)]
      },
      ftpList: [] // 远程服务器列表
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  created() {
    this.getFtpList();
  },
  methods: {
    // 获取备份服务器列表
    getFtpList() {
      $axios.get('/archiveDevice/getList').then((res) => {
        if (res.data) {
          this.ftpList = res.data
        }
      })
    },
    dialogOk() {
      let form = this.$refs['remoteRecForm'];
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let params = {...this.form};
        $axios.post('systemmanager/sysBackupLog/ftpDownload', params).then((res) => {
          if (res.data.state === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
            this.$emit('reload');
            this.dialogFlag = false;
          } else {
            this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
          }
        })
      })
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
  components: {
  }
}
</script>

<style lang="stylus">
.remoteRecDialog-checkbox {
  float: left;

  .remoteRecDialog-checkbox-wrap {
    padding-top: 5px;
  }
}
</style>
