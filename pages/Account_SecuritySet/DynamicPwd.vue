<template>
  <section>
    <s-table-page
      id="dynamicPwdTable"
      :data="dynamicPwdList"
      :header-actions='getListActionsDef()'
      :header-search='getListSearchDef()'
      >
      <s-table-column
        width="145"
        label="令牌序列号"
        show-overflow-tooltip
        prop="tokenId">
      </s-table-column>
      <s-table-column
        label="冻结状态"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-text="scope.row.freezeState===1?'已冻结':'未冻结'"></span>
        </template>
      </s-table-column>
      <s-table-column
        label="挂失状态"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-text="scope.row.lostState===1?'已挂失':'未挂失'"></span>
        </template>
      </s-table-column>
      <s-table-column
        label="锁定状态"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-text="scope.row.lockState===1?'已锁定':'未锁定'"></span>
        </template>
      </s-table-column>
      <s-table-column
        label="登录账户"
        show-overflow-tooltip
        prop="userLoginName">
      </s-table-column>
      <s-table-column
        label="人员姓名"
        show-overflow-tooltip
        prop="userRealName">
      </s-table-column>
      <s-table-column
        label="操作" width="300">
        <template slot-scope="scope">
          <i class="iconfont icon-link" @click="link(scope.row)" title="令牌注册"></i>
          <i class="iconfont icon-refresh-circle" @click="refresh(scope.row)" title="令牌同步"></i>
          <i v-if="scope.row.userLoginName !== null" class="iconfont icon-error" @click="jieBang(scope.row)" title="令牌解绑"></i>
          <i :class="scope.row.lockState === 0 ? 'iconfont icon-lingpaisuoding':'iconfont icon-lingpaijiesuo'" @click="lock(scope.row)" :title="scope.row.lockState === 0?'锁定':'解锁'"></i>
          <i :class="scope.row.freezeState === 0 ? 'iconfont icon-lingpaidongjie':'iconfont icon-lingpaijiedong'" @click="freeze(scope.row)" :title="scope.row.freezeState === 0?'冻结':'解冻'"></i>
          <i :class="scope.row.lostState === 0 ? 'iconfont icon-lingpaiguashi':'iconfont icon-lingpaijiegua'" @click="report(scope.row)" :title="scope.row.lostState === 0?'挂失':'解挂'"></i>
          <i class="iconfont icon-delete" @click="del(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  // import importDialog from '@/components/importDialog/ImportDialog'

  export default{
    components: {
      // importDialog
    },
    data() {
      return {
        dynamicPwdList: []               // 动态口令牌列表
      }
    },
    methods: {
      // 一级功能按钮初始化
      getListActionsDef() {
        let self = this
        return {
          width: 12,
          actions: [{
            name: '导入令牌种子',
            icon: 'import',
            click: function() {
              self.$emit('importDynToken')
            }
          }, {
            name: '令牌更新',
            icon: 'refresh-circle',
            click: function() {
              let loadingMsg = self.$message({
                type: 'info',
                duration: 0,
                showClose: true,
                message: '令牌更新中，请稍候...'
              })
              $axios.post('/systemmanager/sysInteriorTokenList/updateDynamicToken', {}, {
                data: [],
                logTemplate: '更新|登录认证配置>动态口令牌>令牌种子'
              }).then(res => {
                if (res.data === 'success') {
                  $axios.get('/systemmanager/sysInteriorTokenList/list').then(res => {
                    let resData = res.data
                    if (resData && resData instanceof Array) {
                      self.dynamicPwdList = resData
                      loadingMsg.close()
                      self.$message({
                        type: 'success',
                        message: '令牌更新成功！'
                      })
                    }
                  })
                } else if (res.data === 'failed') {
                  loadingMsg.close()
                  self.$message({
                    type: 'error',
                    message: '令牌更新失败，请重试！'
                  })
                } else {
                  loadingMsg.close()
                  self.$message({
                    type: 'error',
                    message: res.data || '令牌更新失败，请重试！'
                  })
                }
              })
            }
          }]
        }
      },
      // 表格搜索初始化
      getListSearchDef() {
        return {
          width: 8,
          offset: 4,
          placeholder: '请输入查询条件',
          searchProps: ['tokenId', 'userLoginName', 'userRealName', 'freezeState', 'lostState', 'lockState']
        }
      },
      // 锁定
      lock(row) {
        let type = row.lockState === 0 ? 1 : 0
        $axios.get(`/systemmanager/sysInteriorTokenList/tokenLockOperate/${row.uuid}/${type}`).then(res => {
          if (res.data.state === true) {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.initDynamicTokenList()
          } else {
            this.$message({
              type: 'error',
              message: res.data.errormsg
            })
          }
        })
      },
      // 冻结
      freeze(row) {
        let type = row.freezeState === 0 ? 1 : 0
        $axios.get(`/systemmanager/sysInteriorTokenList/tokenFreezeOperate/${row.uuid}/${type}`).then(res => {
          if (res.data.state === true) {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.initDynamicTokenList()
          } else {
            this.$message({
              type: 'error',
              message: res.data.errormsg
            })
          }
        })
      },
      // 挂失
      report(row) {
        let type = row.lostState === 0 ? 1 : 0
        $axios.get(`/systemmanager/sysInteriorTokenList/tokenLostOperate/${row.uuid}/${type}`).then(res => {
          if (res.data.state === true) {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.initDynamicTokenList()
          } else {
            this.$message({
              type: 'error',
              message: res.data.errormsg
            })
          }
        })
      },
      link(row) {
        if (row.userLoginName || row.userRealName) {
          this.$confirm('该令牌已绑定账号，是否先解除绑定？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.unbundling(row)
          }).catch(() => {})
        } else {
          this.$emit('registerTokenAddUser', row.uuid)
        }
      },
      jieBang(row) {
        if (row.userLoginName || row.userRealName) {
          this.$confirm('确定解除绑定？', '解绑提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.unbundling(row)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '解绑操作已取消！'
            })
          })
        } else {
          this.$message.warning('该口令牌未绑定用户，无需解绑！');
        }
      },
      refresh(row) {
        this.$emit('showSysToken', row.tokenId)
      },
      del(row) {
        if (!(row.userLoginName || row.userRealName)) {
          this.$confirm('确定删除该口令牌？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/systemmanager/sysInteriorTokenList/deleteToken/${row.uuid}`).then(({data}) => {
              if (data.state === true) {
                this.initDynamicTokenList();
                this.$message.success('删除成功！');
              } else {
                this.$message.error('删除失败，请重试！');
              }
            });
          }).catch(() => {
          });
        } else {
          this.$message.warning('该口令牌已绑定用户，无法删除！');
        }
      },
      // 令牌解绑
      unbundling(row) {
        $axios.get(`/systemmanager/sysInteriorTokenList/unbind/${row.uuid}`).then(res => {
          if (res.data === 'success') {
            this.$message({
              type: 'success',
              message: '令牌解绑成功！'
            })
            this.initDynamicTokenList()
          } else {
            this.$message({
              type: 'error',
              message: '令牌解绑失败，请重试！'
            })
          }
        })
      },
      // 动态口令牌列表初始化(刷新)
      initDynamicTokenList() {
        $axios.get('/systemmanager/sysInteriorTokenList/list').then(res => {
          let resData = res.data
          if (resData && resData instanceof Array) {
            this.dynamicPwdList = resData
          }
        })
      }
    },
    created() {
      this.initDynamicTokenList()
    },
    mounted() {
      // 导入令牌种子成功
      Bus.$on('importDynTokenSuccess', () => {
        this.initDynamicTokenList()
      })
      // 令牌注册-添加用户成功
      Bus.$on('addTokenUserSuccess', () => {
        this.initDynamicTokenList()
      })
      // 令牌同步成功
      Bus.$on('sysTokenSuccess', () => {
        this.initDynamicTokenList()
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #dynamicPwdTable
    .isUnbind
      .icon-edit, .icon-delete
        display none
    .isRegister
      .icon-error
        display none
</style>
