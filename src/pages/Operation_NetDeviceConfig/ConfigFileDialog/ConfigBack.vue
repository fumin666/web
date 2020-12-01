<!--
 * @Author: songyf
 * @Date: 2020-4-16
 * @LastEditors: songyf
 * @Description: 配置文件管理-配置回退
 -->
<template>
  <s-dialog v-model="dialogFlag" title="配置回退" width="500px" append-to-body class="">
    <s-form :model="searchForm" ref="searchForm" :rules="rules" label-width="120px">
      <s-form-item label="选择配置文件" prop="backUpUuid">
        <s-select v-model="searchForm.backUpUuid" clearable filterable style="width: 280px">
          <s-option v-for="(item, index) in backUpList"
                    :value="item.uuid" :label="item.backupFileName"
                    :key="index">
          </s-option>
        </s-select>
      </s-form-item>
    </s-form>

    <template slot="footer" class="dialog-footer">
      <s-button @click="saveData">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    components: {
    },
    data() {
      return {
        dialogFlag: false,
        searchForm: {
          backUpUuid: ''
        },
        rules: {
          backUpUuid: [
            {required: true, message: '请选择', trigger: 'change'}
          ]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      backUpList: {
        type: Array,
        default: []
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
    created() {
    },
    methods: {
      saveData() {
        this.$refs['searchForm'].validate(valid => {
          if (valid) {
            this.$confirm('配置回退会重启交换机，确定回退？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              $axios.get(`/netConfigManage/netWorkBack/${this.searchForm.backUpUuid}`).then(({data}) => {
                if (data.state) {
                  this.dialogFlag = false
                  this.$message({type: 'success', message: data.errormsg});
                } else {
                  this.$message({type: 'error', message: data.errormsg});
                }
              })
            }).catch(() => {});
          } else {
            this.$message({type: 'warning', message: '请选择配置文件!'});
          }
        })
      }
    }
  }
</script>
<style>
</style>

