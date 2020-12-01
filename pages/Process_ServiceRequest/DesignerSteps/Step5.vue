<template>
  <section id="accessAuth">
    <s-row class="step-title">
      设置服务请求的访问权限
      <span class="title-tip">--{{$store.state.serviceRequest.requestName}}</span>
    </s-row>
    <s-row>
      <s-col :span="4">
        <s-row class="radio-item"><s-radio v-model="accessAuthForm.power" :label="0">公开/无限制</s-radio></s-row>
        <s-row class="radio-item"><s-radio v-model="accessAuthForm.power" :label="1">公司内访问</s-radio></s-row>
        <s-row class="radio-item"><s-radio v-model="accessAuthForm.power" :label="2">组内访问</s-radio></s-row>
      </s-col>
      <s-col :span="20">
        <s-row class="select-item">&nbsp;</s-row>
        <s-row class="select-item">
          <span v-if="accessAuthForm.power!==1">&nbsp;</span>
          <div class="auth-list-ctn" v-if="accessAuthForm.power===1">
            <s-select v-model="currentSelectAuth" placeholder="请选择" @change="addAuth('authCompanyLists')">
              <s-option
                v-for="item in authCompanyLists"
                :label="item.departName" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
            <ul class="showGroup">
              <li v-for="item in accessAuthForm.authList">
                <span>{{item.departName}}</span>
                <span class="tool-bar"><i class="iconfont icon-delete" @click="deleteAuth(item)"></i></span>
              </li>
            </ul>
          </div>
        </s-row>
        <s-row class="select-item">
          <span v-if="accessAuthForm.power!==2">&nbsp;</span>
          <div class="auth-list-ctn" v-if="accessAuthForm.power===2">
            <s-select v-model="currentSelectAuth" placeholder="请选择" @change="addAuth('authGroupLists')">
              <s-option
                v-for="item in authGroupLists"
                :label="item.groupName" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
            <ul class="showGroup">
              <li v-for="item in accessAuthForm.authList">
                <span>{{item.groupName}}</span>
                <span class="tool-bar"><i class="iconfont icon-delete" @click="deleteAuth(item)"></i></span>
              </li>
            </ul>
          </div>
        </s-row>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        authCompanyLists: [],       // 公司列表
        authGroupLists: [],         // 组列表
        currentSelectAuth: '',      // 下拉框当前选中值
        accessAuthForm: {
          power: 0,                 // 授权类型：无限制/公司/组内
          authList: []              // 已选择的列表
        }
      }
    },
    watch: {
      'accessAuthForm.power'(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.currentSelectAuth = ''
          this.accessAuthForm.authList = []
        }
      }
    },
    methods: {
      // 获取公司列表
      getAuthCompanyLists() {
        $axios.get('/itilWorkflowConfig/getAllCompanyList').then(({data}) => {
          if (data && data instanceof Array) {
            this.authCompanyLists = data;
          }
        });
      },
      // 获取组列表
      getAuthGroupLists() {
        let companyUuid = this.$store.state.serviceRequest.companyUuid;
        $axios.get(`/itilWorkflowConfig/getAllItilSupportGroupByDepartUuid/${companyUuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.authGroupLists = data;
          }
        });
      },
      // 添加
      addAuth(name) {
        let uuidList = this.accessAuthForm.authList.map((item) => item.uuid);
        if (uuidList.indexOf(this.currentSelectAuth) === -1) {
          this[name].forEach((item) => {
            if (item.uuid === this.currentSelectAuth) {
              this.accessAuthForm.authList.push(item);
              this.currentSelectAuth = '';
            }
          });
        } else {
          this.currentSelectAuth = '';
          this.$message({
            type: 'warning',
            message: '该项已存在于已选列表中，请勿重复选择!'
          });
        }
      },
      // 删除
      deleteAuth(deItem) {
        this.accessAuthForm.authList = this.accessAuthForm.authList.filter((item) => item.uuid !== deItem.uuid);
      }
    },
    created() {
      this.getAuthCompanyLists();    // 获取公司列表
      this.getAuthGroupLists();      // 获取组列表
    },
    // <keep-alive>切换到当前组件触发该钩子
    activated() {
      let state = this.$store.state.serviceRequest;
      // 编辑设计器时，获取编辑回显数据
      if (state.editDesigner) {
        this.accessAuthForm.power = state.editDesigner.editData.itilRequestDesigner.power;
        this.$nextTick(() => {
          if (this.accessAuthForm.power === 1) {
            this.accessAuthForm.authList = state.editDesigner.editData.itilContentsPowers.map(item => {
              return {
                departName: item.companyName,
                uuid: item.companyUuid
              }
            });
          } else if (this.accessAuthForm.power === 2) {
            this.accessAuthForm.authList = state.editDesigner.editData.itilContentsPowers.map(item => {
              return {
                groupName: item.orgName,
                uuid: item.orgUuid
              }
            });
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #accessAuth
    margin-bottom 120px
    .radio-item, .select-item
      line-height 40px
    .showGroup
      width 350px
      li
        position relative
        font-size 14px
        line-height 28px
        padding-left 20px
        margin-bottom 2px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        &:hover .tool-bar
          opacity 1
        .tool-bar
          position absolute
          right 20px
          opacity 0
          .iconfont
            cursor pointer
            font-size 18px
</style>
