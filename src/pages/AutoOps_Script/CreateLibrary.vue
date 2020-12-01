<template>
  <section class="createScriptLibrary">
    <s-form :model="libraryForm" :rules="rules1" ref="libraryFormRef" label-width="130px">
      <!--上级脚本库名称是必填-->
      <s-form-item label="一级脚本库名称" prop="firstLibUuid" tip="长度为2-50字符">
        <s-select v-if="libraryForm.parent !== 'thetopuuid0000000000000000000000'"
                  v-model="libraryForm.firstLibUuid"
                  :disabled="disabledFlag" filterable allow-create>
          <s-option
            v-for="item in options"
            :key="item.value"
            :label="item.libName"
            :value="item.uuid">
          </s-option>
        </s-select>
        <s-input v-else v-model="libraryForm.firstLibUuid"></s-input>
      </s-form-item>
      <!--脚本库名称是非必填-->
      <s-form-item v-if="libraryForm.parent !== 'thetopuuid0000000000000000000000'" label="二级脚本库名称" prop="secondLibName" tip="长度为2-50字符">
        <s-input v-model="libraryForm.secondLibName"></s-input>
      </s-form-item>
      <s-form-item label="备注" prop="description" tip="长度为0-256字符">
        <s-input v-model="libraryForm.description" type="textarea" :rows="3"></s-input>
      </s-form-item>
    </s-form>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        libraryForm: {
          parent: '',
          uuid: '',
          firstLibName: '',
          firstLibUuid: '',
          secondLibName: '',
          description: ''
        },
        rules1: {
          firstLibUuid: [
            { required: true, min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          secondLibName: [
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          description: [
            { min: 0, max: 256, message: '长度在 0 到 256 个字符', trigger: 'blur' }
          ]
        },
        // 保存编辑之前的命令名称，方便之后对比是否改变
        exist_name: '',
        options: [],
        disabledFlag: false
      };
    },
    props: {
      current: Object
    },
    mounted() {
      if (this.current) {
        this.libraryForm = this.current;
        this.libraryForm.firstLibUuid = this.current.parent
        this.exist_name = this.libraryForm.libName;
        if (this.libraryForm.parent === 'thetopuuid0000000000000000000000') {
          this.disabledFlag = false
          this.libraryForm.firstLibUuid = this.current.libName
        } else {
          this.disabledFlag = true
          this.libraryForm.secondLibName = this.current.libName
        }
      }
      $axios.get('/scriptConsole/getAllFirstScriptLib').then(res => {
        this.options = res.data
      })
    }
  }
</script>

