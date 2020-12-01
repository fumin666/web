<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:一级页面应用系统登录弹窗
 * @Date: 2020-03-20 14:37:02
 * @LastEditors: mybells
 -->
<template>
  <div>
    <s-dialog v-model="loginDialog" title="应用系统登录" width="700px" :before-close="dialogClose" class="app-system">
      <s-table-page :data="dataList" style="width: 100%;" maxHeight="300">
        <s-table-column prop="appName" label="应用系统名称" show-overflow-tooltip width="300">
          <template slot-scope="scope">
            <s-popover ref="popover4" placement="bottom-start" width="250" trigger="hover" style="border-radius: 5px;" v-if="scope.row.status">
              <s-scrollbar wrap-style="max-height:200px;padding-right:10px;">
              <ul>
                <li v-for="(item, index) in scope.row.authUrl" :key="index" style="word-break: break-all; white-space: nowrap;height: 25px; line-height: 20px; font-size: 14px;"> <a href="javascript:void(0);" @click="goto(Object.values(item)[0],scope.row.appName)"  class="link-color">{{Object.keys(item)[0]}}</a>
                </li>
              </ul>
              </s-scrollbar>
            </s-popover>
            <a href="javascript:void(0)" v-if="scope.row.status" v-popover:popover4 style="font-size:14px;" class="link-color" :class="{'is-disabled': scope.row.status === 0}">
              {{scope.row.appName}}
              <i class="iconfont icon-right link-color" :class="{'is-disabled': scope.row.status === 0}" style="font-size:14px;"></i>
            </a>
            <a href="javascript:void(0)" v-if="!scope.row.status" style="font-size:14px;" class="link-color ellipsis" :class="{'is-disabled': scope.row.status === 0}">
              {{scope.row.appName}}
              <i class="iconfont icon-right link-color" :class="{'is-disabled': scope.row.status === 0}" style="font-size:14px;"></i>
            </a>
          </template>
        </s-table-column>
        <s-table-column prop="status" label="状态" show-overflow-tooltip width="80">
          <template slot-scope="scope">
            {{scope.row.status === 1 ? '开启' : '停用'}}
          </template>
        </s-table-column>
        <s-table-column prop="clientId" label="客户端ID" show-overflow-tooltip minWidth="200"></s-table-column>
      </s-table-page>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    props: {
      loginDialog: Boolean
    },
    data() {
      return {
        dataList: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        $axios.get(`/oauthClient/getOAuthAppSystemInfo/${this.$store.state.userData.uuid}`).then(res => {
          this.dataList = res.data || [];
        })
      },
      dialogClose() {
        this.$emit('update:loginDialog', false);
      },
      goto(path, name) {
        $axios.get(`/oauthClient/getOAuthAppSystemInfo/${this.$store.state.userData.uuid}`, {
          data: [{name}],
          logTemplate: '登录|应用系统登录>应用系统(#name#)'
        }).then(res => {})
        window.open(window.location.origin + path)
      }
    }
  }
</script>
<style lang="stylus">
  .app-system
    .is-disabled
      cursor not-allowed
      color rgba(0, 0, 0, 0.25)!important
</style>
