<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-20 13:17:17
 * @LastEditTime: 2020-03-27 18:14:47
 * @LastEditors: mybells
 -->
<template>
  <div class="manageDialog">
    <s-form ref="manageForm" :model="Manageform" :rules="ManageRule" label-width="90px" style="margin-right:10px;">
      <s-form-item label="一级分类:" prop="fristTypeUuid">
        <s-select v-model="Manageform.fristTypeUuid" style="width: 100%" :allow-create="firstAllowCreate" filterable clearable
                  @focus="getfristData" @change="changeData">
          <s-option v-for="(item, index) in fristData" :label="item.citypeName"
                    :key="index" :value="item.uuid">
          </s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="二级分类:" prop="secondTypeUuid">
        <s-select v-model="Manageform.secondTypeUuid" style="width: 100%" :allow-create="secondAllowCreate" filterable clearable
                  @focus="getsecondData" @change="changethreeData">
          <s-option v-for="(item, index) in secondData" :label="item.citypeName"
                    :key="index" :value="item.uuid">
          </s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="三级分类:" prop="threeTypeUuid">
        <s-select v-model="Manageform.threeTypeUuid" style="width: 100%" :disabled="threeDisable" allow-create filterable clearable
                  @focus="getthreeData"  @change="flagThree=false">
          <s-option v-for="(item, index) in threeData" :label="item.citypeName"
                    :key="index" :value="item.uuid">
          </s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="描述:" prop="remarks">
        <s-input v-model="Manageform.remarks" type="textarea"  placeholder="不能超过120个字符" style="width: 100%"></s-input>
      </s-form-item>
    </s-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash'
  export default {
    data() {
      return {
        Manageform: {
          fristTypeUuid: '',
          secondTypeUuid: '',
          threeTypeUuid: '',
          remarks: ''
        },
        ManageRule: {
          fristTypeUuid: [{ required: true, message: '不能为空', trigger: 'change' }
            ],
          secondTypeUuid: [{ required: true, message: '不能为空', trigger: 'change' }
            ],
          threeTypeUuid: [],
          remarks: [{
            max: 120, message: '最大长度为120', trigger: 'blur'
          }]
        },
        defaultRule: {
          fristTypeUuid: [{ required: true, message: '不能为空', trigger: 'change' }
            ],
          secondTypeUuid: [{ required: true, message: '不能为空', trigger: 'change' }
            ],
          threeTypeUuid: [],
          remarks: [{
            max: 200, message: '最大长度为200', trigger: 'blur'
          }]
        },
        defaultRule2: {
          fristTypeUuid: [{ required: true, message: '不能为空', trigger: 'change' }
            ],
          secondTypeUuid: [{ required: true, message: '不能为空', trigger: 'change' }
            ],
          threeTypeUuid: [],
          remarks: [{
            max: 200, message: '最大长度为200', trigger: 'blur'
          }]
        },
        fristData: [],
        secondData: [],
        threeData: [],
        flagTwo: true,
        flagThree: true,
        firstAllowCreate: true,
        secondAllowCreate: true,
        threeDisable: false
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    watch: {
      shouldValuedThree(val) {
       if (val) {
         this.$set(this, 'ManageRule', this.defaultRule2)
       } else {
         this.$refs.manageForm.clearValidate()
         this.$set(this, 'ManageRule', this.defaultRule)
       }
      },
       'Manageform.threeTypeUuid'(val) {
         if (val) {
           this.$refs['manageForm'].validate((valid) => {
             if (!valid) {
               return false;
             }
           })
         }
       }
    },
    computed: {
      shouldValuedThree() {
        let firstList = this.fristData.map(item => item.uuid)
        let secondList = this.secondData.map(item => item.uuid)
        if (((firstList.indexOf(this.Manageform.fristTypeUuid) !== -1) && (secondList.indexOf(this.Manageform.secondTypeUuid) !== -1) && !this.editData) || (this.editData && this.editData.threeTypeUuid !== null && (firstList.indexOf(this.Manageform.fristTypeUuid) !== -1) && (secondList.indexOf(this.Manageform.secondTypeUuid) !== -1))) {
          return true
        }
        return false
      }
    },
    created() {
      this.getfristData()
      if (this.editData) {
        this.firstAllowCreate = false;
        this.Manageform = cloneDeep(this.editData);
        if (!this.editData.threeTypeUuid) {
          this.threeDisable = true;
          this.secondAllowCreate = true;
        } else {
          this.secondAllowCreate = false;
          this.threeDisable = false;
        }
        this.getsecondData()
        this.getthreeData()
      }
    },
    methods: {
      changeData() {
        if (!this.editData) {
          this.Manageform.secondTypeUuid = ''
          this.Manageform.threeTypeUuid = ''
        } else {
          this.secondData = [];
          this.threeData = [];
          if (this.editData.threeTypeUuid) {
            this.Manageform.secondTypeUuid = ''
          }
        }
      },
      changethreeData() {
        this.flagTwo = false;
        if (!this.editData) {
          this.Manageform.threeTypeUuid = ''
        }
      },
      getfristData() {
        $axios.get('/resourcemanager/configurationmanage/citype/getCitypeTop').then((res) => {
          this.fristData = res.data
        })
      },
      IsUuid(data, uuid) {
        data = data.map(item => {
          return item.uuid
        })
        if (data.indexOf(uuid) === -1) {
          return true
        }
      },
      getsecondData() {
        if (!this.Manageform.fristTypeUuid) {
          this.$message({
            message: '请先选择上一级级分类',
            type: 'warning'
          })
        } else if (!this.editData && this.IsUuid(this.fristData, this.Manageform.fristTypeUuid)) {
          this.$message({
            message: '请手动添加二级分类',
            type: 'info'
          })
          this.secondData = []
        } else {
          $axios.get(`/resourcemanager/configurationmanage/citype/getCitypeByUuid/${this.Manageform.fristTypeUuid}`).then((res) => {
            if (this.editData) {
              let findSame = (res.data || []).find(item => { return item.uuid === this.editData.secondTypeUuid });
              if (!findSame && this.flagTwo && !this.editData.threeTypeUuid) {
                res.data.unshift({citypeName: this.editData.secondTypeName, uuid: this.editData.secondTypeUuid})
              }
            }
            this.secondData = res.data
          })
        }
      },
      getthreeData() {
        if (!this.Manageform.secondTypeUuid || !this.Manageform.fristTypeUuid) {
          this.$message({
            message: '请先选择上一级级分类',
            type: 'warning'
          })
        } else if (!this.editData && this.IsUuid(this.secondData, this.Manageform.secondTypeUuid)) {
          this.$message({
            message: '请手动添加三级分类',
            type: 'info'
          })
          this.threeData = []
        } else {
          $axios.get(`/resourcemanager/configurationmanage/citype/getCitypeByUuid/${this.Manageform.secondTypeUuid}`).then(({data}) => {
            if (this.editData) {
              let findSame = (data || []).find(item => { return item.uuid === this.editData.threeTypeUuid });
              if (!findSame && this.flagThree) {
                data.unshift({citypeName: this.editData.threeTypeName, uuid: this.editData.threeTypeUuid})
              }
            }
            this.threeData = data
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .manageDialog
    margin: 0 auto
    .manageText
      font-size: 14px
      font-weight: bold
</style>
