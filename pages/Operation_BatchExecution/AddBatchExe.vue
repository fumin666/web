<template>
  <s-scrollbar wrap-class="scrollMaxheight">
    <s-form ref="addScriptForm" :rules="rules" :model="addForm" label-width="120px">
      <s-form-item label="任务名称" prop="taskName">
        <s-input v-model="addForm.taskName"></s-input>
      </s-form-item>
      <s-form-item label="执行周期" prop="taskPeriod">
        <s-select v-model="addForm.taskPeriod" @change="showNext" style="width:80px">
          <s-option label="日" value="1"></s-option>
          <s-option label="周" value="2"></s-option>
          <s-option label="月" value="3"></s-option>
        </s-select>
        <s-select v-model="addForm.week" v-if="weekIsShow" style="width:100px">
          <s-option label="星期一" value="1"></s-option>
          <s-option label="星期二" value="2"></s-option>
          <s-option label="星期三" value="3"></s-option>
          <s-option label="星期四" value="4"></s-option>
          <s-option label="星期五" value="5"></s-option>
          <s-option label="星期六" value="6"></s-option>
          <s-option label="星期日" value="7"></s-option>
        </s-select>
        <span v-if="dayIsShow">
          <s-select v-model="addForm.day" style="width:80px">
            <s-option v-for="(item, index) in 28" :key="item.id" :label="index + 1" :value="index + 1"></s-option>
          </s-select>
          <span>日</span>
        </span>
        <s-select v-model="addForm.hour" style="width:80px">
          <s-option v-for="(item, index) in 24" :key="item.id" :label="index" :value="index"></s-option>
        </s-select>
        <span>:</span>
        <s-select v-model="addForm.minute" style="width:80px">
          <s-option label="00" value="00"></s-option>
          <s-option label="30" value="30"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="开始时间" prop="beginTimeDate">
        <s-date-picker type="date" value-format="yyyy-MM-dd"　placeholder="选择日期" v-model="addForm.beginTimeDate"></s-date-picker>
      </s-form-item>
      <s-form-item label="结束时间" prop="endTimeDate">
        <s-date-picker type="date" value-format="yyyy-MM-dd"　placeholder="选择日期" v-model="addForm.endTimeDate"></s-date-picker>
      </s-form-item>
      <s-form-item label="脚本目录" prop="scriptDir">
        <s-input v-model="addForm.scriptDir"></s-input>
      </s-form-item>
      <s-form-item label="上传脚本" class="is-required">
        <s-upload
          ref="upload"
          :action="actionUrl"
          :auto-upload="false"
          :on-success="uploadSuccess"
          :accept="'.sh'">
          <s-button icon="cloud">上传脚本</s-button>
        </s-upload>
      </s-form-item>
      <s-form-item label="文件服务器" prop="ftpServerId">
        <s-select v-model="addForm.ftpServerId">
          <s-option v-for="item in archiveDevice" :key="item.id" :label="`${item.archiveDeviceName}(${item.archiveDeviceIp})`" :value="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="结果存放目录" prop="ftpServerDir">
        <s-input v-model="addForm.ftpServerDir"></s-input>
      </s-form-item>
      <s-form-item label="邮件接收者" prop="mailbox">
        <s-input type="textarea" v-model="addForm.mailbox" :rows="5"></s-input>
      </s-form-item>
      <s-form-item label="备注" prop="remark">
        <s-input type="textarea" v-model="addForm.remark" :rows="5"></s-input>
      </s-form-item>
    </s-form>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        addForm: {
          taskName: '',
          taskPeriod: '1',
          week: '1',
          day: '1',
          hour: '0',
          minute: '00',
          ftpServerDir: '',
          beginTimeDate: '',
          endTimeDate: '',
          scriptDir: '',
          ftpServerId: '',
          myfile: [],
          mailbox: '',
          remark: '',
          upLoadUrl: ''
        },
        dayIsShow: false,
        weekIsShow: false,
        archiveDevice: [],
        rules: {
          taskName: [
            {required: true, message: '请输入任务名称', trigger: 'blur'},
            {
              pattern: /^[\w\u4e00-\u9fa5\.\-]{1,30}$/,
              message: '名称为中文、字母、数字、及符号[_-.]组合，且长度不超过30个字符',
              trigger: 'blur'
            }
          ],
          scriptDir: [
            {required: true, message: '请输入脚本目录', trigger: 'blur'}
          ],
          ftpServerDir: [
            {required: true, message: '请输入结果存放目录', trigger: 'blur'}
          ],
          beginTimeDate: [
            { required: true, message: '请选择开始日期', trigger: 'change' }
          ],
          endTimeDate: [
            { required: true, message: '请选择结束日期', trigger: 'change' }
          ],
          ftpServerId: [
            { required: true, message: '请选择文件服务器', trigger: 'change' }
          ],
          mailbox: [
            {pattern: /^([A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4},)*[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, message: '请输入正确的邮箱，多个用英文逗号分割', trigger: 'blur'}
          ],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        },
        actionUrl: ''
      }
    },
    props: {
      uuid: {
        type: String
      }
    },
    mounted() {
      this.getScriptProtocol()
    },
    methods: {
      uploadSuccess() {
        this.$message({
          message: '保存成功',
          type: 'success'
        });
      },
      showNext(val) {
        switch (val) {
          case '1': this.dayIsShow = false; this.weekIsShow = false; break;
          case '2': this.dayIsShow = false; this.weekIsShow = true; break;
          case '3': this.dayIsShow = true; this.weekIsShow = false; break;
        }
      },
      getScriptProtocol() {
        $axios.get('/operationBatchExcute/getArchiveDeviceList').then((res) => {
          this.archiveDevice = res.data
          this.addForm.ftpServerId = res.data[0].uuid
        })
      }
    },
    watch: {
      uuid(val) {
        this.actionUrl = $axios.basePath() + '/operationBatchExcute/uploadFileBatchExcute/' + val
        this.$nextTick(() => {
          this.$refs['upload'].submit()
        })
      }
    }
  }
</script>
