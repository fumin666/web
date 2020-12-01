import { getPrivilege } from 'sunflower-common-utils'
module.exports = {
  data() {
    return {
      OmaAuth: false, // 运维审计信息
      ImpAuth: false, // 资产监控信息
      SiemAuth: false, // 日志审计信息
      DbaAuth: false, // 数据库审计信息
      WorkFlowAuth: false,
      AutoAuth: false,
      EventAuth: false, // 事件单权限
      ProblemAuth: false, // 问题单权限
      ChangeAuth: false, // 变更单权限
      TaskAuth: false, // 任务单权限
      KnowledgeAuth: false, // 知识单权限
      PublishAuth: false, // 发布单权限
      ServiceAuth: false // 服务请求权限
    }
  },
  created() {
    this.OmaAuth = getPrivilege(['OMA'], this.$store.state.userData.registerModelList)
    this.ImpAuth = getPrivilege(['IMP'], this.$store.state.userData.registerModelList)
    this.SiemAuth = getPrivilege(['SIEM'], this.$store.state.userData.registerModelList)
    this.DbaAuth = getPrivilege(['DBA'], this.$store.state.userData.registerModelList)
    this.WorkFlowAuth = getPrivilege(['WORKFLOW'], this.$store.state.userData.registerModelList)
    this.AutoAuth = getPrivilege(['AUTO'], this.$store.state.userData.registerModelList)
    this.EventAuth = getPrivilege(['0'], this.$store.state.userData.ownerTypeList)
    this.ProblemAuth = getPrivilege(['1'], this.$store.state.userData.ownerTypeList)
    this.ChangeAuth = getPrivilege(['2'], this.$store.state.userData.ownerTypeList)
    this.TaskAuth = getPrivilege(['3'], this.$store.state.userData.ownerTypeList)
    this.KnowledgeAuth = getPrivilege(['4'], this.$store.state.userData.ownerTypeList)
    this.PublishAuth = getPrivilege(['5'], this.$store.state.userData.ownerTypeList)
    this.ServiceAuth = getPrivilege(['6'], this.$store.state.userData.ownerTypeList)
  }
}
