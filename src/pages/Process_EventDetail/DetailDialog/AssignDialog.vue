<template>
  <s-dialog v-model="dialogFlag" :title="'指派给' + type" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" :rules="rules" ref="form" label-width="120px">
        <s-form-item prop="" label="支持组：" prop="groupUuid">
          <s-select v-model="form.groupUuid">
            <s-option v-for="(item, index) in groupList" :key="index"
              :label="item.groupName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="" label="受派人：" prop="userUuid">
          <s-select v-model="form.userUuid" :disabled="type === '我'">
            <s-option v-for="item in userList" :label="item.userRealName" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-form>
    </s-row>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        groupList: [],
        userList: [],
        form: {
          groupUuid: '',
          userUuid: ''
        },
        rules: {
          groupUuid: [ Object.assign({}, Validaters.NotNull, {trigger: 'change'}) ],
          userUuid: [ Object.assign({}, Validaters.NotNull, {trigger: 'change'}) ]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: '我'
      },
      companyUuid: {
        type: String,
        default: ''
      }
    },
    created() {
      if (this.type === '我') {
        this.axiosMeInfo();
      } else {
        this.axiosOtherGroup();
      }
    },
    methods: {
      axiosMeInfo() {
        $axios.get('/itilIncidentCenter/getMyNameAndGroup').then(({data}) => {
          this.groupList = data.itilSupportGroupList;
          this.userList = [data.iamUserInfo]
          this.form.userUuid = data.iamUserInfo.uuid;
          this.form.groupUuid = this.groupList[0].uuid;
        })
      },
      axiosOtherGroup() {
        $axios.get(`/itilIncidentCenter/getGroup/${this.companyUuid}`).then(({data}) => {
          this.groupList = data;
        })
      },
      axiosOtherUser(groupUuid) {
        $axios.get(`/itilIncidentCenter/getIncidentOrderUser/${groupUuid}`).then(({data}) => {
          this.userList = data;
        })
      },
      dialogOk() {
        this.$refs.form.validate(valid => {
          if (!valid) return;
          let typeUrl = this.type === '我' ? 'incidentOrderOrderAssigne' : 'incidentOrderOrderAssigneOther';
          $axios.get(`/itilIncidentCenter/${typeUrl}/${this.$route.params.orderUuid}/${this.form.userUuid}/${this.form.groupUuid}`).then(({data}) => {
            this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
            if (data.state) {
              this.$emit('finish');
              this.dialogFlag = false;
            }
          })
        });
      }
    },
    watch: {
      'form.groupUuid': {
        handler(val) {
          if (this.type !== '我') {
            this.axiosOtherUser(val)
          }
        }
      },
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style lang="stylus">

</style>
