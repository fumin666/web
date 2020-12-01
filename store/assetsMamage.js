// 资产管理vuex

const assetsManage = {
  state: {
    specialAttrDataList: [],
    subnetform: ''// ipam.vue中判断
  },
  mutations: {
    setSpecialAttrDataList(state, data) {
      if (!data) return;
      state.specialAttrDataList = data
    },
    setSubnetform(state, data) {
      state.subnetform = data
    }
  }
};
export default assetsManage;