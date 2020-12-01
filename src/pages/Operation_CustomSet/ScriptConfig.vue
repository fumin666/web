<template>
  <section id="script-config">
    <s-row class="oper-suppage-title">
      <i class="iconfont icon-tag"></i>
      脚本参数
    </s-row>
    <s-row>
      <s-table :data="scriptParameter">
        <s-table-column label="账号类型" prop="accountType"></s-table-column>
        <s-table-column label="账号匹配参数" prop="accountParameter"></s-table-column>
        <s-table-column label="密码匹配参数" prop="passParameter"></s-table-column>
      </s-table>
    </s-row>
    <s-row class="title">
      <i class="iconfont icon-tag"></i>
      登录参数
    </s-row>
    <s-row id="loginAccountDiv">
      <s-form :model="loginAccount" label-width="200px">
        <s-form-item label="登录账号:" prop="approvalDepartmentLevel">
          <s-col span="12">
            <s-select v-model="loginAccount.loginName">
              <s-option label="$User" value="$User"></s-option>
              <s-option label="$AssistUser" value="$AssistUser"></s-option>
              <s-option label="$ReserveUser" value="$ReserveUser"></s-option>
            </s-select>
          </s-col>
        </s-form-item>
      </s-form>
    </s-row>
    <s-row class="title">
      <i class="iconfont icon-tag"></i>
      命令参数
      <s-button @click="addCommand">添加命令</s-button>
    </s-row>
    <s-row>
      <table class="commandTab">
        <thead>
        <div>
          <tr>
            <td>行号</td>
            <td>提示符</td>
            <td>命令</td>
            <td>操作</td>
          </tr>
        </div>
        </thead>
        <tbody>
        <draggable :list="cmdList" @end="test">
          <tr v-for="(item, index) in cmdList" :key="item.id">
            <td>{{item.priority}}</td>
            <td><s-input v-model="item.prompt"></s-input></td>
            <td><s-input v-model="item.cmd"></s-input></td>
            <td><i class="iconfont icon-delete" @click="delCommand(index, item)"></i></td>
          </tr>
        </draggable>
        </tbody>
      </table>
    </s-row>
    <s-row class="recommend">
      <s-col>1.提示符、命令最大长度为64个字符，由中文、字母[a-z,A-Z]、数字[0-9]、符号[$[]#*?:@]组成；</s-col>
      <s-col>2.提示符及命令中不可填写符号$（脚本参数整体填写除外）；</s-col>
      <s-col>3.SSH协议提示符请从密码匹配开始填写；</s-col>
      <s-col>4.TELNET协议提示符请从用户名匹配开始填写；</s-col>
      <s-col>5.最后一行提示符填写成功提示，命令不运行。</s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import draggable from 'vuedraggable'
  export default {
    data() {
      return {
        scriptParameter: [
          {
            accountType: (this.scriptType === 3) ? '校验账号' : (this.scriptType === 2) ? '改密账号' : '运维账号',
            accountParameter: '$User',
            passParameter: '$Pwd'
          }, {
            accountType: '协助账号',
            accountParameter: '$AssistUser',
            passParameter: '$AssistPwd'
          }, {
            accountType: '备用账号',
            accountParameter: '$ReserveUser',
            passParameter: '$ReservePwd'
          }],
        loginAccount: {
          loginName: '$User'
        },
        cmdList: [],
        uuid: ''
      }
    },
    props: {
      pwdData: {
        type: Boolean,
        default: false
      },
      editData: {
        type: Object
      },
      scriptType: {
        type: Number
      }
    },
    created() {
      if (this.pwdData) {
        this.scriptParameter.push({
          accountType: '新密码',
          accountParameter: '-',
          passParameter: '$NewPwd'
        })
      }
      if (this.editData !== undefined) {
        this.loginAccount.loginName = this.editData.loginName
        this.cmdList = this.editData.userdefineScriptCmdList
        this.uuid = this.editData
      }
    },
    components: { draggable },
    methods: {
      test() {
        let arr = this.cmdList
        for (let i = 0; i < arr.length; i++) {
          arr[i].priority = i + 1
        }
      },
      delCommand(index, row) {
        this.cmdList.splice(index, 1)
        for (let i of this.cmdList) {
          if (i.priority > row.priority) {
            i.priority = i.priority - 1
          }
        }
      },
      addCommand() {
        let newIndex = this.cmdList.length + 1
        let newCommand = {
          priority: newIndex,
          prompt: '',
          cmd: ''
        }
        this.cmdList.push(newCommand)
      }
    }
  }
</script>
