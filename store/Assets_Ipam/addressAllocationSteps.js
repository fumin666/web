/*
 * @Author: 高建鹏
 * @Date: 2019-06-03 15:35:59
 * @LastEditors: 高建鹏
 * @Description: ip地址分配
 * @Position: src\pages\Assets_Ipam\Perspective\AddressAllocationSteps
 */
const step1 = {
  state: {
    step1Form: {
      applyNum: 1,
      SFXZZW: 0
      // BZ: ''
    },
    tableData: [],
    selections: []
  },
  mutations: {
    setStep1FormList(state, value) {
      state.step1Form = value;
    },
    setStep1Table(state, value) {
      state.tableData = value;
    },
    setStep1Selections(state, value) {
      state.selections = value;
    },
    setStep1applyNum(state, value) {
      state.step1Form.applyNum = value;
    },
    setStep1SFXZZW(state, value) {
      state.step1Form.SFXZZW = value;
    }
  }
};
const step2 = {
 state: {
    table1Data: [],
    table2Data: [],
    selections: []
  },
  mutations: {
    setStep2Table1(state, value) {
      state.table1Data = value;
    },
    setStep2Table2(state, value) {
      state.table2Data = value;
    },
    setStep2Selections(state, value) {
      state.selections = value;
    }
  }
};
const step3 = {
 state: {
    tableData: []
  },
  mutations: {
    setStep3Table(state, value) {
      state.tableData = value;
    }
  }
};

const addressAllocationSteps = {
  namespaced: true,
  state: {
    current: 0 // 当前step
  },
  mutations: {
    prev(state) {
      state.current--
    },
    jump(state) {
      state.current = 3;
    },
    next(state, step) {
      if (step) {
        state.current = step;
      } else {
        state.current++;
      }
    },
    reset(state, step) {
      if (step) {
        state['step' + step] = JSON.parse(JSON.stringify(resetData['step' + step]));
      } else {
        for (let i in resetData) {
          if (i !== 'store') {
            state[i] = JSON.parse(JSON.stringify(resetData[i]));
          } else {
            Object.assign(state, resetData.store);
          }
        }
      }
    }
  },
  modules: {
    step1,
    step2,
    step3
  }
};

let resetData = {};
resetData.step1 = JSON.parse(JSON.stringify(step1.state));
resetData.step2 = JSON.parse(JSON.stringify(step2.state));
resetData.step3 = JSON.parse(JSON.stringify(step3.state));
resetData.store = JSON.parse(JSON.stringify(addressAllocationSteps.state));

export default addressAllocationSteps;
