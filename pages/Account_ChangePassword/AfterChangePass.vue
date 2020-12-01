<template>
  <s-row>
    <s-form ref="afterChangePassForm" :model="afterChangePassForm" :rules="afterChangePassRules" label-width="130px">
      <s-form-item label="邮件接收者:" prop="email">
        <s-input v-model="afterChangePassForm.email"></s-input>
      </s-form-item>
      <s-form-item label="附件密码:" prop="resultEmailPwd">
        <s-input v-model="afterChangePassForm.resultEmailPwd" type="password"></s-input>
      </s-form-item>
      <s-form-item label="改密结果发送至:" prop="backupServerUuid">
        <s-select v-model="afterChangePassForm.backupServerUuid">
          <s-option v-for="list in hostLists"
                    :value="list.uuid"
                    :key="list.uuid"
                    :label="`${list.archiveDeviceName}(${list.archiveDeviceIp})`"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
  </s-row>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {intersectObj} from 'sunflower-common-utils'
  // import {Validaters} from 'sunflower-common-utils';

  export default{
    data () {
      let checkEmail = (rule, value, callback) => {
        if (value) {
          // 验证邮箱格式
          let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
          if (!reg.test(value)) {
            callback(new Error('邮箱格式不正确'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        hostLists: [],
        afterChangePassForm: {
          email: null,
          resultEmailPwd: null,
          backupServerUuid: null,
          uuid: null
        },
        afterChangePassRules: {
          email: [{validator: checkEmail, trigger: 'blur'}]
        }
      }
    },
    props: {
      originData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      // 改密后设置表单验证
      validateAfter() {
        let validRes = false;
        this.$refs['afterChangePassForm'].validate(valid => {
         if (valid) {
           if (this.afterChangePassForm.email) {
             if (this.afterChangePassForm.resultEmailPwd) {
               validRes = true;
             } else {
               validRes = 'pwd';
             }
           } else {
             validRes = true;
           }
         }
        });
        return validRes;
      },
      // 保存改密后设置
      saveAfterForm (changeTaskUuid) {
        // 新增时promise.resolve(changeTaskUuid) || 编辑时this.originData.uuid
        this.afterChangePassForm.uuid = changeTaskUuid || this.originData.uuid;
        return new Promise((resolve, reject) => {
          $axios.post('/tPasswdChangeTask/afterTPasswdChangeTask', this.afterChangePassForm).then((res) => {
            let resData = res.data
            if (resData === 'true') {
              resolve('after');
            } else {
              this.$message.error('“改密后设置”保存失败，请重试！')
              reject('after');
            }
          });
        });
      }
    },
    created() {
      // 获取备用服务器列表
      $axios.post('/archiveDevice/getList').then(({data}) => {
        if (data && data instanceof Array) {
          this.hostLists = data;
        }
      })
      this.afterChangePassForm = intersectObj(this.afterChangePassForm, this.originData);
    }
  }
</script>

