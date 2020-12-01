/**
 * Created by caoLiXin on 2018/11/15.
 */
/**
 * 流程中心-服务请求vuex
 */
const serviceRequest = {
  state: {
    /* **设计器** */
    companyName: '',
    companyUuid: '',
    requestName: '',
    firstCatalogId: '',
    secondCatalogId: '',
    editDesigner: null,
    inlayarr: [], // 内置设置器
    userList: [],
    roleList: [],
    departList: [],
    dimissionList: []
  },
  mutations: {
    // 设置step1所选公司机构数据
    setCompanyData(state, data) {
      state.companyName = data.companyName;   // 名称
      state.companyUuid = data.companyUuid;   // uuid
    },
    // 设置step1所选的服务请求的数据
    setRequestData(state, data) {
      state.firstCatalogId = data.firstCatalogId;   // 配置的服务请求所在的目录一级
      state.secondCatalogId = data.secondCatalogId;   // 配置的服务请求对应的目录二级
      state.secondCatalogName = data.secondCatalogName;   // 配置的服务请求对应的目录二级
      state.requestName = data.requestName;   // 目录二级对应的服务请求名称
    },
    // step1编辑修改设计器提交编辑回显数据
    setEditDesigner(state, data) {
      state.editDesigner = data;
    },
    // 内置设置器
    setInlayarr(state, data) {
      state.inlayarr = data;
    },
    // 角色下拉框数据
    setRoleList(state, data) {
      state.roleList = data;
    },
    // 人员下拉框数据
    setUserList(state, data) {
      state.userList = data;
    },
    // 组织机构下拉框数据
    setDepartList(state, data) {
      state.departList = data;
    },
    // 离职人员下拉框数据
    setDimissionList(state, data) {
      state.dimissionList = data;
    }
  }
}

export default serviceRequest;
