<template>
  <section id="scriptCard">
    <s-scrollbar ref="scriptCardScroll" wrap-class="scriptCard-scroll">
      <div v-for="(item, index) in scriptCardList">
        <div class="cardWarp" :class="tabIndex === index ? 'active' : ''" @click="showScript(item, index)">
          <s-row>
            <s-col :span="17">
              <span class="scriptName">
                <div class="sigleLine" :title="item.scriptName">{{item.scriptName}}</div>
              </span>
            </s-col>
            <s-col :span="7" style="text-align: right">
              <i class="iconfont icon-edit" style="float: none;color: #199fed;" @click="editHandle(item)"></i>
              <i class="iconfont icon-error deleteBtn" style="color: #199fed; margin-left: 8%;" :class="{disabledIcon: disabledIcon(item.createUser)}" @click="deleteHandle(item)"></i>
            </s-col>
          </s-row>
          <s-row class="cardFooter">
            <span style="margin-right: 8px;">类型：{{item.scriptFileSuffix}}</span>
            <span style="margin-right: 8px;">提交人：{{item.createUserName}}</span>
            <span>提交时间：{{item.createTime}}</span>
          </s-row>
        </div>
      </div>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus';
  export default{
    data() {
      return {
        currentUserUuid: this.$store.getters.userData.uuid,
        tabIndex: -1
      }
    },
    props: ['scriptCardList', 'uuid'],
    components: {
      // Bus
    },
    methods: {
      disabledIcon(uuid) {
        if (uuid === this.currentUserUuid) {
          return false
        } else {
          return true
        }
      },
      showScript(item, index) {
        this.tabIndex = index
        this.$emit('showCode', item);
      },
      editHandle(item) { // 点编辑的时候显示弹框，弹框里面才可以做保存
        this.$emit('changeCode', item);
      },
      deleteHandle(item) {
        // 创建者不是当前用户则不能操作
        if (item.createUser !== this.currentUserUuid) {
          return false
        }
        this.$confirm('确定删除该脚本?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/scriptConsole/deleteScript/${item.uuid}`, {
            data: [item],
            logTemplate: '删除|脚本(#scriptLibName#/#scriptName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: '删除成功', type: 'success'});
//              this.scriptCardList.forEach((scriptCard, index) => {
//                if (scriptCard.uuid === item.uuid) {
//                  this.scriptCardList.splice(index, 1)
//                }
//              })
              Bus.$emit('updateScriptCard') // 更新脚本card列表
              Bus.$emit('updateLeftMenu', this.uuid) // 更新左侧menu脚本列表
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          })
        }).catch(() => {});
      }
    },
    created() {
    }
  }
</script>
<style scoped>
</style>
