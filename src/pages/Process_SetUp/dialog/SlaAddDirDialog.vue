<template>
  <div @click.stop>
    <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑文件夹' : '添加文件夹'" width="600px" class="slaDirAddDialog">
      <s-scrollbar wrap-class="slaDirAddScrollbar">
        <s-form :model="slaAddDirForm" :rules="slaAddDirRule" ref="slaAddDirForm" label-width="130px">
          <s-form-item label="文件夹名称" prop="categoryName">
            <s-input v-model="slaAddDirForm.categoryName"></s-input>
          </s-form-item>
          <s-form-item label="描述" prop="categoryDesc">
            <s-input v-model="slaAddDirForm.categoryDesc" type="textarea"></s-input>
          </s-form-item>
        </s-form>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button :disabled="dialogDisabled" @click="dialogOk">确定</s-button>
        <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      dialogFlag: false,
      dialogDisabled: false,
      slaAddDirForm: {
        categoryName: '',
        categoryDesc: ''
      },
      slaAddDirRule: {
        categoryName: [
          Validaters.NotNull,
          Validaters.Name,
          Validaters.Max(10)
        ],
        categoryDesc: [Validaters.Max(120)]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object
    },
    list: {
      type: Array
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  created() {
    if (this.isEdit) {
      for (let i in this.slaAddDirForm) {
        this.slaAddDirForm[i] = this.row.node[i];
      }
    }
  },
  methods: {
    dialogOk() {
      let form = this.$refs['slaAddDirForm'];
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let params = {...this.slaAddDirForm};
        this.dialogDisabled = true;
        if (this.isEdit) {
          params['uuid'] = this.row.uuid;
          params['id'] = this.row.id;
          params['isDefault'] = this.row.isDefault;
          params['parentUuid'] = this.row.parentUuid;
          $axios.post('/itilSla/updateCategory', params, {
            data: [params],
            logTemplate: '编辑|文件夹(#categoryName#)'
          }).then((res) => {
            this.dialogDisabled = false;
            if (res.data.state === true) {
              this.$message({showClose: true, message: res.data.errormsg, type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
            }
          })
        } else {
          if (JSON.stringify(this.row) === '{}') {
            params['parentUuid'] = 'thetopuuid0000000000000000000000'
          } else {
            params['parentUuid'] = this.row.uuid
          }
          $axios.post('/itilSla/saveCategory', params, {
            data: [params],
            logTemplate: '添加|文件夹(#categoryName#)'
          }).then((res) => {
            this.dialogDisabled = false;
            if (res.data.state === true) {
              this.$message({showClose: true, message: res.data.errormsg, type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
            }
          })
        }
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
  }
}
</script>

<style lang="stylus">
.operationRespAddDialog-checkbox {
  float: left;

  .operationRespAddDialog-checkbox-wrap {
    padding-top: 5px;
  }
}
</style>
