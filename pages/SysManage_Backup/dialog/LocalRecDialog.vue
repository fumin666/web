<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @LastEditors: 高建鹏
 * @LastEditEmail: shifeng199307@gmail.com
 * @Description: 本地恢复弹框
 * @Date: 2019-02-22 13:55:29
 * @LastEditTime: 2019-06-14 17:39:41
 -->

<template>
  <s-dialog v-model="dialogFlag" title="本地恢复" width="600px" class="">
    <s-scrollbar wrap-style="max-height: 500px;">
      <s-row type="flex" justify="center">
        <s-upload ref="upload" class="upload-demo" drag :auto-upload="false" :on-success="uploadSuccess" :accept="'.tar'" :before-upload="handleChange" :action="`/systemmanager/sysBackupLog/uploadBackupFile`" mutiple>
          <i class="iconfont icon-cloud"></i>
          <div class="s-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="s-upload__tip" slot="tip">只能上传(版本号_XXX.tar)文件</div>
        </s-upload>
      </s-row>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
//  import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      baseUrl: $axios.basePath(),
      fileList: [],
      file: '',
      dialogFlag: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange(file) {
      let arr = file.name.split('.')
      let num = arr.length - 1
      if (arr[num] !== 'tar') {
        this.$message.error('文件类型必须是tar')
        return false
      }
    },
    dialogOk() {
      this.$refs['upload'].submit()
    },
    uploadSuccess(res, file) {
      this.$emit('reload');
      $axios.log({logTemplate: `上传|(${file.name}备份包)成功`});
      this.dialogFlag = false
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

<style lang="stylus">
.uploadBox {
  line-height: 30px;
  width: 400px;
  margin: 20px auto 0;
}
</style>
