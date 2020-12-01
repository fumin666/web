<template>
  <s-form :model="Form" ref="Form" label-width="100px">
    <div style="padding-left: 50px;">
      <s-row>
        <s-col span="18">
          <s-form-item label="角色编号 :">
            <s-input></s-input>
          </s-form-item>
          <s-form-item label="角色名称 :">
            <s-input></s-input>
          </s-form-item>
          <s-form-item label="角色归属 :">
            <s-select v-model="Form.ascription" style="width: 100%">
              <s-option v-for="opt in ascription" :label="opt.value" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="角色权限 :">
            <s-input></s-input>
          </s-form-item>
          <s-form-item label="状态 :">
            <s-select v-model="Form.status" style="width: 100%">
              <s-option v-for="opt in status" :label="opt.value" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-col>
      </s-row>
    </div>
  </s-form>
</template>

<script>
  export default {
    data() {
      return {
        Form: {
          ascription: '',
          status: ''
        },
        ascription: [
          {
            uuid: 1,
            value: '男'
          },
          {
            uuid: 2,
            value: '女'
          }
        ],
        status: [
          {
            uuid: 1,
            value: '启用'
          },
          {
            uuid: 2,
            value: '禁用'
          }
        ]
      }
    }
  }
</script>
