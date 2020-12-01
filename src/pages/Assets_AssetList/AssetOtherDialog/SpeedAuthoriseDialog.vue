<template>
  <section id="authorise-dialog-ctn">
    <s-dialog v-model="dialogFlag" title="快速授权" width="600px" class="authoriseDialog">
        <s-form
          id="authorise-form"
          style="margin:20px 0;"
          ref="authoriseForm"
          :model="authoriseForm"
          :rules="authoriseFormRules"
          label-width="130px">
          <s-form-item label="选择授权清单：" prop="authorise">
            <s-select v-model="authoriseForm.authorise" clearable filterable placeholder="请选择" @change="selectAuthorise">
              <s-option
                v-for="list in authoriseList"
                :label="list.colname"
                :value="list.uuid"
                :key="list.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-form>
      <template slot="footer">
        <s-button @click="dialogOk">保存</s-button>
        <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        dialogFlag: false,
        authoriseList: [],              // 授权清单列表
        // 授权清单下拉选项选中值
        authoriseForm: {
          authorise: ''
        },
        // 授权清单表单验证
        authoriseFormRules: {
          authorise: [{ required: true, message: '请选择授权清单', trigger: 'change' }]
        },
        authoriseLabel: ''
      }
    },
    components: {},
    props: {
      value: {
        type: Boolean,
        default: false
      },
      authoriseAssets: {
        type: Array,
        required: true
      }
    },
    computed: {
      // 快速授权的资产uuids
      assetUuids() {
        return this.authoriseAssets.map(item => item.uuid);
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
      selectAuthorise(val) {
        let obj = {};
        obj = this.authoriseList.find((item) => {
          return item.uuid === val;
        });
        this.authoriseLabel = obj
      },
      // 获取授权清单下拉选项列表
      getAuthoriseList() {
        $axios.get('/operationAuth/getAuthNameList').then(({data}) => {
          if (data && data instanceof Array) {
            this.authoriseList = data;
            // this.authoriseForm.authorise = this.authoriseForm.authorise || data[0].uuid;    // 默认选中第一个授权清单
          }
        });
      },
      // 保存快速授权
      dialogOk() {
        this.$refs.authoriseForm.validate(valid1 => {
          if (valid1) {
            let params = {
              authUuid: this.authoriseForm.authorise,
              itcompUuids: this.assetUuids
            }
            let arr = {}
            this.authoriseAssets.map(item => {
              arr = Object.assign({}, item, this.authoriseLabel)
            })
            $axios.post('/operationAuth/quickAuth', params, {
              data: [arr],
              logTemplate: '快速授权|资产(#controlAdderss#/#itcompName#)授权给授权策略(#colname#)'
            }).then(({data}) => {
              if (data.state === true) {
                this.$message.success(data.errormsg);
                this.$emit('closeDialog');
                this.dialogFlag = false;
              } else {
                this.$message.error(data.errormsg);
              }
            });
          }
        })
      }
    },
    created() {
      this.getAuthoriseList();    // 获取授权清单列表
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
