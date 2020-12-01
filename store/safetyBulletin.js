/**
 * Created by songyf on 2020/3/5.
 */
/**
 * 安全通报-通报类型设计器vuex
 */
const safetyBulletin = {
  state: {
    /* **设计器** */
    editDesigner: null

  },
  mutations: {
    // step1编辑修改设计器提交编辑回显数据
    setEditBulletin(state, data) {
      state.editDesigner = data;
    }
  }
}

export default safetyBulletin;
