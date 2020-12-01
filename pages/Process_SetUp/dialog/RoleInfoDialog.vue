<template>
  <s-form :model="form" ref="form" :rules="rules" label-width="100px">
    <div style="padding-left: 50px;">
      <s-row>
        <s-col span="20">
          <s-form-item prop="roleName" label="角色名称:" style="margin-top: 10px;">
            <s-input v-model="form.roleName" disabled></s-input>
          </s-form-item>
          <s-form-item prop="ownerType" label="角色归属:" style="margin-top: 10px;margin-top: 10px;">
            <s-select v-model="form.ownerType" style="width: 100%" disabled>
              <s-option v-for="item in ownerType" :label="item.value" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="authorityName" label="角色权限:" v-if="flag" style="margin-top: 10px;margin-top: 10px;">
            <s-select v-model="form.authorityUuidList" multiple style="width: 100%" disabled>
              <s-option v-for="item in itilAuthorityList" :label="item.authorityName" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="activeStatus" label="状态:" style="margin-top: 10px;margin-top: 10px;">
            <s-select v-model="form.activeStatus" style="width: 100%" disabled>
              <s-option v-for="item in activeStatus" :label="item.value" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-col>
      </s-row>
    </div>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { intersectObj, Validaters } from 'sunflower-common-utils'
  export default {
    data() {
      return {
        form: {
          uuid: '',
          id: '',
          roleName: '',
          ownerType: '',
          authorityName: '',
          activeStatus: '',
          authorityUuidList: []
        },
        rules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 0, max: 50, message: '最大长度为50', trigger: 'blur'}
          ],
          ownerType: [Validaters.NotNull],
          activeStatus: [Validaters.NotNull]
        },
        ownerType: [
          {
            value: '事件',
            uuid: 0
          },
          {
            value: '问题',
            uuid: 1
          },
          {
            value: '变更',
            uuid: 2
          },
          {
            value: '任务',
            uuid: 3
          },
          {
            value: '知识',
            uuid: 4
          },
          {
            value: '发布',
            uuid: 5
          },
          {
            value: '服务请求',
            uuid: 6
          }
        ],
        itilAuthorityList: [],
        activeStatus: [
          {
            value: '启用',
            uuid: 1
          },
          {
            value: '禁用',
            uuid: 0
          }
        ],
        flag: false
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    methods: {
    },
    created() {
      if (this.editData !== undefined) {
        this.form = intersectObj(this.form, this.editData)
      }
    },
    watch: {
      'form.ownerType': {
        handler: function (val) {
          if (this.editData !== undefined && this.editData.ownerType !== null) {
            if (val !== '' && val === this.editData.ownerType) {
              $axios.get('/itilWorkflowConfig/getAuthorityListByOwnerType/' + val).then((res) => {
                if (res.status === 200) {
                  this.form.authorityUuidList = this.editData.authorityUuidList;
                  this.itilAuthorityList = res.data;
                  this.flag = true
                }
              })
            } else {
              $axios.get('/itilWorkflowConfig/getAuthorityListByOwnerType/' + val).then((res) => {
                if (res.status === 200) {
                  this.form.authorityUuidList = [];
                  this.itilAuthorityList = res.data;
                  this.flag = true
                }
              })
            }
          } else {
            if (val !== '' && val !== null) {
              $axios.get('/itilWorkflowConfig/getAuthorityListByOwnerType/' + val).then((res) => {
                if (res.status === 200) {
                  this.form.authorityUuidList = [];
                  this.itilAuthorityList = res.data;
                  this.flag = true
                }
              })
            }
          }
        },
        deep: true
      }
    }
  }
</script>
