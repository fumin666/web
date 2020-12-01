<template>
  <s-form :model="departmentinfo" :rules="rules" ref="departmentinfo" label-width="110px">
    <s-form-item label="机构名称" prop="departName">
      <s-input v-model="departmentinfo.departName"></s-input>
    </s-form-item>
    <s-form-item label="上级机构" prop="departParentUuid">
      <s-input v-model="departParentName" v-if="rootCell" :readonly="true"></s-input>
      <s-select v-model="departmentinfo.departParentUuid" filterable placeholder="请选择" v-if="!rootCell" >
        <s-option v-for="item in parents" :label="item.label" :value="item.value" :key="item.value"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="机构编号" prop="departCode">
      <s-input v-model="departmentinfo.departCode"></s-input>
    </s-form-item>
    <s-form-item label="机构负责人" prop="departLeaderUuid">
      <s-select v-model="departmentinfo.departLeaderUuidList" multiple  filterable placeholder="请选择" style="width:100%;">
        <s-option v-for="item in leaders" :label="item.label" :value="item.value" :key="item.value"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="机构地址" prop="departPlace">
      <s-input v-model="departmentinfo.departPlace"></s-input>
    </s-form-item>
    <s-form-item label="电话" prop="departPhone">
      <s-input v-model="departmentinfo.departPhone"></s-input>
    </s-form-item>
    <s-form-item label="备注" prop="remark">
      <s-input v-model="departmentinfo.remark" type="textarea"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
import $axios from 'sunflower-ajax'
import {intersectObj} from 'sunflower-common-utils'
export default {
  data() {
    let checkName = (rule, value, callback) => {
      if (value) {
        let res = value.search(/[^-|\w|\u4e00-\u9fa5]/g);
        if (res > -1) {
          callback(new Error('由中文、字母、数字、-、_组成'));
        } else {
          callback()
        }
      }
    };
    let checkRepeatName = (rule, value, callback) => {
      if (value !== this.editRepeatName) {
        if (value) {
          $axios.post(`/departmentInfo/nameValidate`, {name: value}).then((res) => {
            let isRepeat = res.data
            if (isRepeat === 'true') {
              callback(new Error('该名称已经存在'));
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
      departParentName: '无',
      rootCell: false,
      editRepeatName: '',
      departmentinfo: {
        departName: '',
        departCode: '',
        departParentUuid: '',
        departLeaderUuidList: [],
        departPlace: '',
        departPhone: '',
        remark: '',
        uuid: ''
      },
      rules: {
        departName: [
          {required: true, message: '请输入机构名称', trigger: 'blur'},
          {max: 30, message: '最大长度30', trigger: 'change'},
          {validator: checkName, trigger: 'blur'},
          {validator: checkRepeatName, trigger: 'blur'}
        ],
        departCode: [
          {max: 30, message: '最大长度30', trigger: 'change'}
        ],
        departParentUuid: [
          {required: true, message: '请选择上级机构', trigger: 'change'}
        ],
        departPlace: [
          {max: 50, message: '最大长度50', trigger: 'blur'}
        ],
        departPhone: [
          {pattern: /^[0-9\-]{3,30}$/, message: '号码可以由数字和-组成，不超过30位', trigger: 'blur'}
        ],
        remark: [
          {max: 120, message: '最大长度120', trigger: 'blur'}
        ]
      },
      parents: [],
      leaders: []
    }
  },
  props: {
    editListObj: {
      type: Object
    }
  },
  methods: {
    getEdit() {
      if (this.editListObj !== undefined && this.editListObj !== null) {
        let departLeaderNameList = this.editListObj.departLeaderName.split(','); // 先把字符串转成数组;
        let departLeaderUuidList = departLeaderNameList.map((name) => {
          let uuid = '';
          this.leaders.forEach((item) => {
            if (name === item.label) {
              uuid = item.value
            }
          });
          return uuid;
        });
        if (this.editListObj.uuid === 'c12704bbea9847d1b745e9e5d33d8731') { // 如果是顶级机构
          this.rootCell = true
        }
        this.departmentinfo = intersectObj(this.departmentinfo, {...this.editListObj, departLeaderUuidList: !this.editListObj.departLeaderName ? [] : departLeaderUuidList})
        this.editRepeatName = this.departmentinfo.departName
      }
    }
  },
  created() {
    let departUuid;
    if (this.editListObj !== undefined && this.editListObj !== null) {
      departUuid = this.editListObj.uuid;
    } else {
      departUuid = null;
    }
    $axios.post(`/departmentInfo/getDepartAndUserInfo/${departUuid}`).then((res) => {
      res.data.listDepart.map(item => {
        this.parents.push({
          label: item.departName,
          value: item.uuid
        })
      })
      let leaderAry = [];
      for (let i = 0, length = res.data.listUserInfo.length; i < length; i++) {
        leaderAry.push({label: res.data.listUserInfo[i].realNameAndEmail, value: res.data.listUserInfo[i].uuid});
      }
      this.leaders = leaderAry;
      this.getEdit();
    });
  }
}
</script>
