<template>
  <s-form :model="addForm" :rules="rule" ref="addAnnounceForm" label-width="120px">
    <s-form-item label="公告主题" prop="title" >
      <s-input v-model.trim="addForm.title" disabled></s-input>
      <s-input style="display: none"></s-input>
    </s-form-item>
    <s-form-item label="公告类型" prop="announceType">
      <s-radio-group v-model="addForm.announceType" disabled>
        <s-radio label="0">站内公告</s-radio>
        <s-radio label="1">站外公告</s-radio>
      </s-radio-group>
    </s-form-item>
    <s-form-item label="发布人" prop="userName">
      <s-input v-model='addForm.userName' disabled></s-input>
    </s-form-item>
    <s-form-item label="发布时间" prop="createTime">
      <s-date-picker
        v-model="addForm.createTime"
        type="datetime"
        disabled
        placeholder="请选择日期时间">
      </s-date-picker>
    </s-form-item>
    <s-form-item label="公告内容" prop="content">
      <s-input type="textarea" v-model.trim="addForm.content" :rows="5" disabled></s-input>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import {intersectObj} from 'sunflower-common-utils'
  export default {
    data() {
      return {
        addForm: {
          uuid: '',
          announceType: '0',
          title: '',
          content: '',
          userName: '',
          createTime: null
        },
        rule: {
          title: [
            {required: true, message: '标题不可为空', trigger: 'blur'},
            {max: 50, message: '不能超过50个字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '公告不可为空', trigger: 'blur'},
            {max: 250, message: '不能超过250个字符', trigger: 'blur'}
          ]
        }
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    created() {
      if (this.editData !== undefined) {
        this.addForm = intersectObj(this.addForm, this.editData)
        this.addForm.announceType = this.addForm.announceType.toString()
      }
    }
  }
</script>
