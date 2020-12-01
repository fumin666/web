// 流程中心vuex

const processCenter = {
  state: {
    rolesMap: {
      'incident_user': 0, // 事件请求人
      'incident_handler': 1, // 事件处理人
      'incident_desk_first': 2, // 服务台
      'incident_manager': 3, // 事件经理
      'problem_user': 1, // 问题请求人
      'problem_expert': 2, // 问题专家
      'problem_manager': 3, // 问题经理
      'change_user': 1, // 变更请求人
      'change_minstrator': 2, // 变更管理员
      'change_manager': 3, // 变更经理
      'knowledge_user': 1, // 知识库提交人
      'knowledge_minstrator': 2, // 知识库管理员
      'knowledge_approve': 3, // 知识库审批人
      'publish_submitter': 1, // 发布提交人
      'publish_coordinator': 2, // 发布协调员
      'publish_approver': 3, // 发布审批人
      'publish_manager': 4, // 发布经理
      'publish_executive': 5, // 发布实施人
      'service_submitter': 1, // 服务请求提交人
      'service_minstrator': 2, // 服务请求管理员
      'service_approve': 3, // 服务请求审批人
      'service_assignee': 4 // 服务请求受派者
    },
    rolePro: { // 默认角色权限级别
      'incident': -1,
      'problem': -1,
       problemArr: [],
      'service': -1,
       serviceArr: [],
      'change': -1,
      'knowledge': -1,
      'publish': -1
    },
    status: [
      ['新建', '已指派', '待决', '进行中', '已解决', '已关闭', '已取消'], // 事件0
      ['草稿', '评审中', '已指派', '调查中', '待决', '已完成', '已关闭', '已取消'], // 问题1
      ['草稿', '变更请求', '已计划审批', '计划', '技术审批', '正在执行', '待决', '已完成', '已关闭', '已取消', '已拒绝'], // 变更2
      ['草稿', '已指派', '处理中', '已完成', '已关闭', '已取消'], // 任务3
      ['草稿', '已启动', '发布审批', '待发布', '已发布', '注销审批', '已废弃', '已拒绝', '已取消'], // 知识4
      ['草稿', '启动审批', '计划审批', '开发审批', '测试审批', '部署审批', '关闭审批', '进行中', '待决', '已完成', '已拒绝', '已取消', '已关闭'], // 发布5
      ['草稿', '已提交', '启动审批', '已指派', '进行中', '已完成', '已关闭', '已拒绝', '已取消', '待决']  // 服务请求6
    ]
  },
  mutations: {
    setRolePro(state, value) {
      state.rolePro = value;
    }
  }
};
export default processCenter;
