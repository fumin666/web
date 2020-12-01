<template>
<s-scrollbar wrap-style="max-height:450px;">
  <s-form :model="staffForm" :rules="staffRule" ref="staffForm" label-width="130px">
    <s-row type="flex" justify="between">
      <s-col span="18">
        <s-form-item label="真实姓名" prop="userRealName">
          <s-input v-model="staffForm.userRealName"></s-input>
        </s-form-item>
        <s-form-item label="工号" prop="userWorkPosition">
          <s-input v-model="staffForm.userWorkPosition"></s-input>
        </s-form-item>
        <s-form-item label="所属机构" prop="departUuid" required>
          <s-select style="width: 100%" v-model="staffForm.departUuid" filterable placeholder="请选择所属机构">
            <s-option v-for="depart in departOptions" :label="depart.departName" :value="depart.uuid" :key="depart.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="岗位" prop="position">
          <s-input v-model="staffForm.position"></s-input>
        </s-form-item>
      </s-col>
      <s-col span="5" style="padding: 4px 0">
        <img width="120px" height="150px" style="margin-left: 10px" v-if="imageUrl" :src="imageUrl"
                   class="avatar">
        <s-upload ref="upload" :action="upLoadUrl" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
          <s-button style="width: 120px;margin: 10px 0 0 10px">修改</s-button>
        </s-upload>
      </s-col>
    </s-row>
    <s-form-item label="人员类型" prop="userClassify" required>
      <s-select style="width: 100%" v-model="staffForm.userClassify">
        <s-option label="内部人员" :value="1"></s-option>
        <s-option label="内部临时" :value="2"></s-option>
        <s-option label="职能人员" :value="3"></s-option>
        <s-option label="应用人员" :value="4"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="是否VIP" prop="isVIP" required>
      <s-select style="width: 100%" v-model="staffForm.isVIP" filterable>
        <s-option label="否" :value="0"></s-option>
        <s-option label="是" :value="1"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="性别" prop="userGender" required>
      <s-select style="width: 100%" v-model="staffForm.userGender" filterable>
        <s-option label="保密" :value="0"></s-option>
        <s-option label="男" :value="1"></s-option>
        <s-option label="女" :value="2"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="最高学历" prop="lastEducation">
      <s-select style="width: 30%" v-model="staffForm.lastEducation" filterable placeholder="请选择最高学历">
        <s-option label="初中及以下" :value="1"></s-option>
        <s-option label="中专/中技" :value="2"></s-option>
        <s-option label="高中" :value="3"></s-option>
        <s-option label="大专" :value="4"></s-option>
        <s-option label="本科" :value="5"></s-option>
        <s-option label="硕士" :value="6"></s-option>
        <s-option label="博士" :value="7"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="入职日期" prop="entryTimeStr">
      <s-date-picker v-model="staffForm.entryTimeStr" type="date" value-format="yyyy-MM-dd 00:00:00" format="yyyy-MM-dd" :editable="false">
      </s-date-picker>
    </s-form-item>
    <s-form-item label="Email" prop="userMail">
      <s-input v-model="staffForm.userMail"></s-input>
    </s-form-item>
    <s-form-item label="手机号码" prop="userCellphone" :required="needPhone">
      <s-input v-model="staffForm.userCellphone"></s-input>
    </s-form-item>
    <s-form-item label="微信号" prop="userWechat">
      <s-input v-model="staffForm.userWechat"></s-input>
    </s-form-item>
    <s-form-item label="办公号码" prop="userPhone">
      <s-input v-model="staffForm.userPhone"></s-input>
    </s-form-item>
    <s-form-item label="短号号码" prop="userShortNumber">
      <s-input v-model="staffForm.userShortNumber"></s-input>
    </s-form-item>
    <s-form-item label="工位" prop="userWorkStation">
      <s-input v-model="staffForm.userWorkStation"></s-input>
    </s-form-item>
    <s-form-item label="个人地址" prop="userAddress">
      <s-input v-model="staffForm.userAddress"></s-input>
    </s-form-item>
    <s-form-item label="备注" prop="remark">
      <s-input type="textarea" :rows="2" v-model="staffForm.remark"></s-input>
    </s-form-item>
  </s-form>
</s-scrollbar>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';
import {
  indexOf
} from 'lodash';

const photoUrl = 'static/images/system/UserPhoto.png'
import {
  intersectObj
} from 'sunflower-common-utils'

export default {
  data() {
    let checkEmailName = (rule, value, callback) => {
      if (value !== this.editDefaultEmail) {
        if (value) {
          $axios.post(`/iamUserInfo/checkEmail`, {
            name: value
          }).then((res) => {
            if (res.data.state === false) {
              callback(new Error('该邮箱已经存在！'));
            } else {
              callback()
            }
          })
        }
      } else {
        callback()
      }
    };
    let checkWorkPosition = (rule, value, callback) => { // 校验重复工号
      if (value !== this.editDefaultOrderNumber) {
        if (value) {
          $axios.get(`/iamUserInfo/checkWorkPosition/${value}`).then((res) => {
            if (res.data.state === false) {
              callback(new Error('该工号已经存在！'));
            } else {
              callback()
            }
          })
        }
      } else {
        callback()
      }
    };
    return {
      departOptions: [],
      roleOptions: [],
      staffForm: {
        uuid: '',
        userRealName: '',
        departUuid: '',
        userWorkPosition: '',
        userGender: 0,
        userMail: '',
        lastEducation: 5,
        entryTimeStr: '',
        userCellphone: '',
        userWechat: '',
        userPhone: '',
        userShortNumber: '', // 短号号码
        userWorkStation: '', // 工位
        userAddress: '',
        position: '',
        remark: '',
        userPhotopath: '',
        isVIP: 0,
        userClassify: 1 // 人员类型 1:内部人员
      },
      staffRule: {
        userRealName: [
          Validaters.NotNull,
          Validaters.Name,
          Validaters.Max(30)
        ],
        departUuid: [Validaters.NotNull],
        userMail: [
          Validaters.NotNull,
          Validaters.Email,
          Validaters.Max(50),
          {
            validator: checkEmailName,
            trigger: 'blur'
          }
        ],
        userCellphone: [
          Validaters.Max(20),
          Validaters.MobilePhone
        ],
        userWorkPosition: [
          Validaters.NotNull,
          Validaters.Max(18),
          {
            validator: checkWorkPosition,
            trigger: 'blur'
          }
        ],
        userWechat: [
          Validaters.Max(30)
        ],
        userAddress: [
          Validaters.Max(30)
        ],
        position: [
          Validaters.Max(30)
        ],
        userPhone: [
          Validaters.Max(30),
          Validaters.TelePhone
        ],
        lastEducation: [],
        userClassify: [Validaters.NotNull],
        isVIP: [Validaters.NotNull],
        userGender: [Validaters.NotNull],
        remark: [Validaters.Max(120)],
        userShortNumber: [Validaters.Number]
        // entryTimeStr: [Validaters.LargerNowDate]
      },
      needPhone: false,
      editDefaultName: '',
      editDefaultEmail: '',
      editDefaultOrderNumber: '',
      upLoadUrl: $axios.basePath() + '/fileUpload/uploadUserPhoto',
      imageUrl: photoUrl
    }
  },
  props: {
    editObj: {
      type: Object
    }
  },
  created() {
    this.staffForm = intersectObj(this.staffForm, this.editObj)
    this.imageUrl = this.staffForm.userPhotopath || photoUrl
    this.editDefaultEmail = this.editObj.userMail;
    this.editDefaultOrderNumber = this.editObj.userWorkPosition;
    $axios.get(`/iamUserInfo/getDepartList`).then(({
      data
    }) => {
      this.departOptions = data;
    });
    // 判断电话号码是否必填
    $axios.get(`/iamUserInfo/getIamSysLoginType`).then(({
      data
    }) => {
      if (data === 'true') {
        this.needPhone = true;
      }
    });
  },
  methods: {
    validate() {
      this.$refs.staffForm.validateField('entryTimeStr');
    },
    handleAvatarSuccess(res, file) {
      this.staffForm.userPhotopath = res.userPhotopath
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const Image = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp']
      const isLt2M = file.size / 1024 / 1024 < 2;
      let isJPG
      indexOf(Image, file.type) < 0 ? isJPG = false : isJPG = true;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpg,jpeg,png,bmp 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  },
  watch: {
    needPhone(val) {
      if (val) {
        this.staffRule.userCellphone.push(Validaters.NotNull)
      }
    }
  }
}
</script>

<style>
#rowsy1 {
  margin-left: 28px
}

#rowsy2 {
  margin-left: 28px
}
</style>
