<template>
  <s-form :model="form" ref="form" :rules="rules" label-width="100px">
    <div style="padding-left: 50px;">
      <s-row>
        <s-col span="20">
          <s-form-item prop="authorityName" label="权限名称:" style="margin-top: 15px;">
            <s-input v-model="form.authorityName" :maxlength="50" disabled></s-input>
          </s-form-item>
          <s-form-item prop="ownerType" label="归属流程:" style="margin-top: 15px;">
            <s-select v-model="form.ownerType" style="width: 100%" disabled>
              <s-option v-for="item in ownerType" :label="item.value" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="authorityDesc" label="权限描述:" style="margin-top: 15px;">
            <s-input type="textarea" v-model="form.authorityDesc" :rows="3" :maxlength="100"></s-input>
          </s-form-item>
        </s-col>
      </s-row>
    </div>
  </s-form>
</template>

<script>
  import {intersectObj} from 'sunflower-common-utils'
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        form: {
          id: '',
          authorityName: '',
          authorityDesc: '',
          uuid: '',
          ownerType: ''
        },
        rules: {
          authorityName: [Validaters.NotNull],
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
          }
        ]
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
        this.form = intersectObj(this.form, this.editData);
      }
    }
  }
</script>
