/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-20 14:18:37
 * @LastEditTime: 2020-04-02 12:05:25
 * @LastEditors: mybells
 */

module.exports = {
  data() {
    return {
      isSuperAdmin: false,   // 是否为超级管理员
      isSystemAdmin: false,   // 是否为系统管理员
      isConfigAdmin: false,    // 是否为配置管理员（流程）
      isOperation: false,       // 是否为运维人员
      isOMATeamLeader: false,   // 是否为团队主管
      isSafeAdministrator: false, // 是否为安全管理员
      isAuditAdministrator: false  // 是否为审计管理员

    }
  },
  created() {
    this.isSuperAdmin = this.checkRoleByUuid('tsecondroleinfo00000000000000000');
    this.isSystemAdmin = this.checkSysAdminRole();
    this.isConfigAdmin = this.checkConfigAdminRole();
    this.isOperation = this.checkOperationAdminRole();
    this.isOMATeamLeader = this.checkTeamLeaderAdminRole();
    this.isSafeAdministrator = this.checkSafeAdminRole();
    this.isAuditAdministrator = this.checkAuditAdminRole();
  },
  methods: {
    checkRoleByUuid(uuid) {
      return this.$store.state.userData.roleUuidsStr && this.$store.state.userData.roleUuidsStr.indexOf(uuid) !== -1;
    },
    checkSysAdminRole() {  // 系统管理员
      return this.checkRoleByUuid('tsecondroleinfo00000000000000000') || this.checkRoleByUuid('tsecondroleinfo00000000000000003') || this.checkRoleByUuid('tsecondroleinfo00000000000000005') || this.checkRoleByUuid('tsecondroleinfo00000000000000010') || this.checkRoleByUuid('tsecondroleinfo00000000000000012') || this.checkRoleByUuid('tsecondroleinfo00000000000000014') || this.checkRoleByUuid('tsecondroleinfo00000000000000028') || this.checkRoleByUuid('tsecondroleinfo00000000000000042');
    },
    isConfigAdminCheck(monitorItcomp) {
      return this.isSystemAdmin || (monitorItcomp.maintenanceStaffuuid === this.$store.state.userData.uuid);
    },
    checkConfigAdminRole() { // 配置管理员（流程）
      return this.checkRoleByUuid('tsecondroleinfo00000000000000000') || this.checkRoleByUuid('tsecondroleinfo00000000000000015');
    },
    checkOperationAdminRole() { // 运维人员
      return this.checkRoleByUuid('tsecondroleinfo00000000000000000') || this.checkRoleByUuid('tsecondroleinfo00000000000000009');
    },
    checkTeamLeaderAdminRole() { // 团队主管
      return this.checkRoleByUuid('tsecondroleinfo00000000000000000') || this.checkRoleByUuid('tsecondroleinfo00000000000000008');
    },
    checkSafeAdminRole() { // 安全管理员
      return this.checkRoleByUuid('tsecondroleinfo00000000000000000') || this.checkRoleByUuid('tsecondroleinfo00000000000000001');
    },
    checkAuditAdminRole() { // 审计管理员
      return this.checkRoleByUuid('tsecondroleinfo00000000000000000') || this.checkRoleByUuid('tsecondroleinfo00000000000000002');
    }
  }
}
