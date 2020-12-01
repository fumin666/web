<template>
  <section class="bulletin-custom-box">
    <!-- 动态属性 -->
    <s-form ref="customForm" :model="customForm" :rules="customRule" label-width="135px">
      <div v-for="(item, index) in customData" :key="item.uuid">
        <s-form-item
          v-if="item.attrType === 1"
          :label="item.attrName"
          :title="item.attrName"
          :prop="item.uuid">
          <s-input
            placeholder="请输入内容"
            v-model="customForm[item.uuid]"
            :disabled="isView">
          </s-input>
        </s-form-item>
        <s-form-item
          v-if="item.attrType === 2"
          :label="item.attrName"
          :title="item.attrName"
          :prop="item.uuid">
          <s-input
            type="textarea"
            placeholder="请输入内容"
            v-model="customForm[item.uuid]"
            :disabled="isView">
          </s-input>
        </s-form-item>
        <s-form-item
          v-if="item.attrType === 3"
          :label="item.attrName"
          :title="item.attrName"
          :prop="item.uuid">
          <s-select
            :clearable="true"
            placeholder="请选择"
            v-model="customForm[item.uuid]"
            :disabled="isView">
            <s-option
              v-for="(option, index) in item.dropDownOptionList"
              :label="option.selectName"
              :value="option.selectName"
              :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item
          v-if="item.attrType === 4"
          :label="item.attrName"
          :title="item.attrName"
          :prop="item.uuid">
          <s-input
            type="textarea"
            placeholder="请输入数值"
            v-model="customForm[item.uuid]"
            :disabled="isView">
          </s-input>
        </s-form-item>
        <s-form-item
          v-if="item.attrType === 5"
          :label="item.attrName"
          :title="item.attrName"
          :prop="item.uuid">
          <s-date-picker
            v-model="customForm[item.uuid]"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
            :disabled="isView">
          </s-date-picker>
        </s-form-item>
        <s-form-item
          v-if="item.attrType === 6"
          label="附件"
          title="附件">
          <s-upload :class="{'upload-box': isView}"
                    :action="uploadUrl"
                    ref="upload"
                    multiple
                    :limit=10
                    :disabled="isView"
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-remove="uploadRemove"
                    :on-exceed="uploadLimit"
                    :with-credentials="true"
                    :file-list="fileList">
            <s-button slot="trigger" icon="export" :disabled="isView">上传</s-button>
          </s-upload>
        </s-form-item>
      </div>
    </s-form>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    components: {
    },
    data() {
      return {
        uploadUrl: `${$axios.basePath()}/safetyPlatform/fileUpload/uploadSafeTaskAttachment`,
        fileList: [],
        resList: null,
        customForm: {
        },
        customRule: {
        },
        textMax: Validaters.Max(30),
        textAreaMax: Validaters.Max(120),
        selectRequire: [Validaters.SelectValNotNull],
        textRequire: [Validaters.NotNull]
      }
    },
    props: {
      customData: {
        type: Array,
        default: []
      },
      isView: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      customData: {
        immediate: true,
        handler(val) {
          let vm = this;
          this.customData.forEach((v) => {
            if (v.attrValue) {
              vm.$set(vm.customForm, v.uuid, v.attrValue)
            } else if (v.attrType === 6 && v.safeTaskAttachmentList !== null && v.safeTaskAttachmentList !== undefined) {
              this.fileList = v.safeTaskAttachmentList.map(item => {
                return {
                  url: item.absolutePath,
                  name: item.attacthmentName,
                  safeAttachmentUuid: item.uuid
                }
              })
              vm.$set(vm.customForm, v.uuid, null)
            } else {
              vm.$set(vm.customForm, v.uuid, null)
            }
            if (v.isRequired === 1) {
              if (v.attrType === 3) {
                vm.$set(vm.customRule, v.uuid, vm.customRule[v.uuid], vm.selectRequire)
              } else {
                vm.$set(vm.customRule, v.uuid, vm.customRule[v.uuid] ? [...vm.textRequire, ...vm.textMax] : [...vm.textRequire, v.attrType !== 2 ? vm.textMax : vm.textAreaMax])
              }
            } else {
              if (v.attrType !== 3) {
                vm.$set(vm.customRule, v.uuid, vm.customRule[v.uuid] ? vm.textMax : v.attrType !== 2 ? vm.textMax : vm.textAreaMax)
              }
            }
          })
          this.resList = this.fileList[0] || null
        }
      }
    },
    created() {
    },
    methods: {
      beforeUpload(file) {
        if (file.size > 100 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过100M!'});
          return false;
        }
        if (this.fileList.length > 0) {
          for (let i in this.fileList) {
            if (file.name === this.fileList[i].name) {
              this.$message({type: 'error', message: '请勿上传重复文件!'});
              return false;
            }
          }
        }
      },
      uploadLimit(files, fileList) {
        if (files.length > 9 || fileList.length > 9 || (files.length + fileList.length) > 9) {
          this.$message({type: 'warning', message: '上传文件个数不能超过10个！'});
          return false;
        }
      },
      uploadSuccess(res, file, fileList) {
        if (res.state === 'true') {
          this.$message({type: 'success', message: '上传成功'});
          this.fileList = fileList;
          this.resList = res;
        } else {
          this.$message({type: 'error', message: res.errormsg});
          this.fileList = [];
        }
      },
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
      },
      // 附件移除
        uploadRemove(file, fileList) {
          let flag = true
        for (let i in this.fileList) {
          if (file.name !== this.fileList[i].name) {
            flag = false
          }
        }
        if (flag) {
          $axios.post('/safetyPlatform/fileUpload/deleteSafeTaskFile', {
            uuid: file.response.safeAttachmentUuid,
            filePath: file.response.filePath
          }).then(({data}) => {
            if (data.state) {
              this.$message({type: 'success', message: data.errormsg});
            } else {
              this.$message({type: 'error', message: data.errormsg})
            }
          });
        }
        this.fileList = fileList;
      }
    }
  }
</script>
<style>
  .bulletin-custom-box .upload-box .icon-error-bold {
    display: none !important;
  }
</style>
