<template>
  <s-form ref="serverForm" :model="serverForm" :rules="serverRule" label-width="120px">
    <s-form-item label="服务器类型" prop="archiveDeviceType">
      <s-col span="20">
        <s-select v-model="serverForm.archiveDeviceType">
          <s-option label="FTP服务器" :value="1"></s-option>
          <s-option label="SFTP服务器" :value="2"></s-option>
        </s-select>
      </s-col>
    </s-form-item>
    <s-form-item label="服务器名称" prop="archiveDeviceName">
      <s-col span="20">
        <s-input v-model="serverForm.archiveDeviceName"></s-input>
      </s-col>
    </s-form-item>
    <s-form-item label="服务器IP" prop="archiveDeviceIp">
      <s-col span="20">
        <s-input v-model="serverForm.archiveDeviceIp"></s-input>
      </s-col>
    </s-form-item>
    <s-form-item label="服务器端口" prop="archiveDevicePort">
      <s-col span="20">
        <s-input v-model="serverForm.archiveDevicePort"></s-input>
      </s-col>
    </s-form-item>
    <s-form-item label="服务器账号名" prop="archiveDeviceAccount">
      <s-col span="20">
        <s-input v-model="serverForm.archiveDeviceAccount"></s-input>
      </s-col>
    </s-form-item>
    <s-form-item label="口令" prop="archiveDevicePasswd">
      <s-col span="20">
        <s-input type="password" v-model="serverForm.archiveDevicePasswd"></s-input>
      </s-col>
    </s-form-item>
    <s-form-item label="归档路径" prop="archiveDeviceDir" tip="示例：/backup/" class="path-form-item">
      <s-col span="20">
        <s-input v-model="serverForm.archiveDeviceDir"></s-input>
      </s-col>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import {intersectObj} from 'sunflower-common-utils'
  export default {
    data() {
      return {
        serverRule: {
          archiveDeviceAccount: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 30, message: '长度不能超过30位', trigger: 'blur'}
          ],
          archiveDeviceDir: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {pattern: /^[^\u4e00-\u9fa5]*$/, message: '目录不能包含中文', trigger: 'blur'},
            {max: 50, message: '长度不能超过50位', trigger: 'blur'}
          ],
          archiveDeviceIp: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/, message: 'IP格式不正确', trigger: 'blur'}
          ],
          archiveDeviceName: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          archiveDevicePasswd: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 50, message: '长度不能超过50位', trigger: 'blur'}
          ],
          archiveDevicePort: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {
              pattern: /(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
              message: '请输入正确的端口号',
              trigger: 'blur'
            }
          ]
        },
        serverForm: {
          archiveDeviceAccount: '',
          archiveDeviceDir: '',
          archiveDeviceIp: '',
          archiveDeviceName: '',
          archiveDevicePasswd: '',
          archiveDevicePort: '',
          archiveDeviceType: 1,
          uuid: ''
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
        this.serverForm = intersectObj(this.serverForm, this.editData)
        this.serverForm.archiveDevicePort = this.serverForm.archiveDevicePort.toString()
      }
    }
  }
</script>
<style>
  .path-form-item .s-form-item-content{
    margin-right: 0!important;
  }

</style>
