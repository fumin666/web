<template>
  <section id="console">
    <span id="go-to-designer" title="进入服务请求设计器" @click="goToDesigner">进入设计器</span>
    <s-tab v-model="activeName" type="card">
      <s-tab-pane label="浏览请求条目" name="first">
        <s-scrollbar wrap-class="scrollHeight">
          <view-service-request v-if="activeName==='first'" :res="res"></view-service-request>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="我提交的申请" name="second">
        <s-scrollbar wrap-class="scrollHeight">
          <my-application v-if="activeName==='second'"></my-application>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="我的关注列表" name="third">
        <s-scrollbar wrap-class="scrollHeight">
          <my-attention v-if="activeName==='third'"></my-attention>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="知识库" name="fourth">
        <s-scrollbar wrap-class="scrollHeight">
          <knowledge v-if="activeName==='fourth'"></knowledge>
        </s-scrollbar>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import processRoleMixin from '@/home/ProcessCenter/processRoleMixin'
  import Knowledge from './ConsoleTabs/Knowledge';
  import MyApplication from './ConsoleTabs/MyApplication';
  import MyAttention from './ConsoleTabs/MyAttention';
  import ViewServiceRequest from './ConsoleTabs/ViewServiceRequest';

  export default {
    data() {
      return {
        activeName: 'first',
        res: false
      }
    },
    mixins: [processRoleMixin],
    components: {
      Knowledge,
      MyApplication,
      MyAttention,
      ViewServiceRequest
    },
    methods: {
      // 进入服务请求设计器
      goToDesigner() {
        if (this.$route.name === 'diy') {
          this.$router.push('ProcessCenter/designer');
        } else {
          this.$router.push('designer');
        }
      }
    },
    created() {
      // 获取所有的内置设计器的uuid数组
      let self = this;
      $axios.get(`/itilServiceRequest/getRequestDesignerIsInternalList`).then((res) => {
        if (res.status === 200) {
          self.$store.commit('setInlayarr', res.data);
        }
      })
      this.nowUserData = this.$store.state.userData;
      // 人员下拉框数据
      let getuser = function() {
        return $axios.get('/itilServiceRequest/userListForItil').then(res => {
          let arr = res.data;
          let userarr = arr.map(function(item) {
            item.listvalues = item.realNameAndEmail
            return item
          })
          self.$store.commit('setUserList', userarr);
        })
      }
      // 组织机构下拉框数据
      let oranginaze = function() {
        return $axios.get('/iamUserInfo/getDepartList').then(res => {
          let arr = res.data;
          let oranginazearr = arr.map(function(item) {
            return {uuid: item.uuid, listvalues: item.departName}
          })
          self.$store.commit('setDepartList', oranginazearr);
        })
      }
      // 角色下拉框数据
      let role = function() {
        return $axios.get('/iamUserInfo/getRoleList').then(res => {
          let arr = res.data;
          let rolearr = arr.map(function(item) {
            return {uuid: item.uuid, listvalues: item.roleName}
          })
          self.$store.commit('setRoleList', rolearr);
        })
      }
      // 离职人员下拉框数据
      let dimission = function() {
        return $axios.get('/iamUserInfo/getAllLeaveOfficeUser').then(res => {
          let arr = res.data;
          if (res.data instanceof Array) {
            let userarr = arr.map(function(item) {
              item.listvalues = item.realNameAndEmail
              return item
            })
            self.$store.commit('setDimissionList', userarr);
          }
        })
      }
      Promise.all([getuser(), oranginaze(), role(), dimission()]).then(function () {
        // 3个请求现在都执行完成
        self.res = true;
      });
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #console
    padding 10px 0
    #go-to-designer
      position absolute
      top 18px
      right 20px
      font-size 14px
      font-weight bold
      cursor pointer
      z-index 1
    .scrollHeight
      max-height calc(100vh - 170px)
</style>
