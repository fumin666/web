<template>
  <section id="knowledgeVisible">
    <s-form :model="visibleForm" ref="visibleForm" label-width="120px">
      <s-form-item label="公开/所有人可见" prop="visibleLevel1">
        <s-radio-group v-model="visibleLevel1">
          <s-radio :label="0">是</s-radio>
          <s-radio :label="1">否</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-form-item label="组内可见" prop="visibleLevel2">
        <s-radio-group v-model="visibleLevel2">
          <s-radio :label="0">是</s-radio>
          <s-radio :label="1">否</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-form-item v-if="visibleLevel1">
        <s-select v-model="visibleGroupUuid" placeholder="请选择支持组" @change="addGroup" style="width: 400px">
          <s-option v-for="item in visibleGroupList" :label="item.groupName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
        <ul class="showGroup">
          <li v-for="item in groupShowList">
          <span>
             <i class="iconfont icon-file"></i>
          </span>
          <span>
            {{item.groupName}}
          </span>
            <span>
            <i class="iconfont icon-correct-bold"></i>
            <i class="iconfont icon-error-bold" @click="deleteGroup(item)"></i>
          </span>
          </li>
        </ul>
      </s-form-item>
    </s-form>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  export default {
    data () {
      return {
        visibleForm: {},
        visibleLevel1: 0,
        visibleGroupUuid: '',
        visibleGroupList: [],
        groupShowList: []
      }
    },
    computed: {
      visibleLevel2: {
        get: function () {
          return Number(!this.visibleLevel1)
        },
        set: function (val) {
          this.visibleLevel1 = Number(!val)
        }
      }
    },
    props: {
      companyUuid: '',
      visibleLevel: {
        type: Number,
        default: 0
      },
      visibleGroupUuids: {
        type: String,
        default: ''
      }
    },
    components: {
    },
    methods: {
      addGroup() {
        let uuidList = this.groupShowList.map((item) => item.uuid)
        if (uuidList.indexOf(this.visibleGroupUuid) < 0) {
          this.visibleGroupList.forEach((item) => {
            if (item.uuid === this.visibleGroupUuid && this.visibleGroupUuid !== '') {
              this.groupShowList.push(item)
              this.visibleGroupUuid = ''
            }
          })
        } else {
          this.visibleGroupUuid = ''
          this.$message({
            type: 'warning',
            message: '支持组已选择!'
          });
        }
      },
      deleteGroup(deItem) {
        this.groupShowList = this.groupShowList.filter((item) => item.uuid !== deItem.uuid)
      }
    },
    mounted() {
      if (this.visibleLevel !== undefined) {
        this.visibleLevel1 = this.visibleLevel
      }
    },
    created() {
      $axios.get(`/itilWorkflowConfig/getAllSupportGroupByCompanyUuid/${this.companyUuid}`).then((res) => {
        if (res.data) {
          this.visibleGroupList = res.data
          if (this.visibleGroupUuids) {
            this.uuids = this.visibleGroupUuids.split(',')
            this.uuids.forEach((item) => {
              this.visibleGroupList.forEach((visibelItem) => {
                if (item === visibelItem.uuid) {
                  this.groupShowList.push(visibelItem)
                }
              })
            })
          }
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
