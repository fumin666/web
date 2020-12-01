/*
 * @Author: 高建鹏
 * @Date: 2019-06-03 10:15:18
 * @LastEditors  : mybells
 * @Description: 子网扫描
 * @Position:src\pages\Assets_Ipam\Perspective\ScanningSteps
 */
const step1 = {
  state: {
    step1Form: {
      version: 1,
      userName: '',
      snmpPassword: '',
      encryption: '0'
    },
    step1List: [],
    selections: [],
    scanway1: {
      scanmode: 1,
      seed: ''
    }
  },
  mutations: {
    setStep1Form(state, value) {
      state.step1Form = value;
    },
    setStep1Selections(state, value) {
      state.selections = value;
    },
    setStep1List(state, value) {
      state.step1List = value;
    },
    setScanway1(state, value) {
      state.scanway1 = value;
    }
  }
};
const step2 = {
 state: {
    step2Data: {
      finishCount: 0,
      totalCount: 0,
      isfinish: false
    },
    dataList: [],
    progress: 0,
    scanTime: 0
  },
  mutations: {
    setStep2Data(state, value) {
      state.step2Data = value;
    },
    setStep2DataList(state, value) {
      state.dataList = value;
    },
    setStep2Progress(state, value) {
      state.progress = value;
    },
    setStep2ScanTime(state, value) {
      state.scanTime = value;
    },
    set2finishCount(state, value) {
      state.step2Data.finishCount = value;
    },
    set2totalCount(state, value) {
      state.step2Data.totalCount = value;
    },
    set2isfinish(state, value) {
      state.step2Data.isfinish = value;
    }
  }
};
const step3 = {
  state: {
    step3Data: {
      finishCount: 0,
      totalCount: 0,
      isfinish: false
    },
    dataList: [],
    progress: 0,
    scanTime: 0
  },
  mutations: {
    setStep3DataList(state, value) {
      state.dataList = value;
    },
    setStep3Data(state, value) {
      state.step3Data = value;
    },
    setStep3Progress(state, value) {
      state.progress = value;
    },
    setStep3ScanTime(state, value) {
      state.scanTime = value;
    },
    set3finishCount(state, value) {
      state.step3Data.finishCount = value;
    },
    set3totalCount(state, value) {
      state.step3Data.totalCount = value;
    },
    set3isfinish(state, value) {
      state.step3Data.isfinish = value;
    }
  }
};

const scanningSteps = {
  namespaced: true,
  state: {
    current: 0,
    showFooter: true,
    shownext: true,
    runStartTime: 0,
    runEndTime: 0,
    namespace: '',
    lastdata: {}
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
    },
    setShowFooter(state, val) {
      state.showFooter = val;
    },
    setShowNext(state, val) {
      state.shownext = val;
    },
    setRunStartTime(state, val) {
      state.runStartTime = val;
    },
    setRunEndTime(state, val) {
      state.runEndTime = val;
    },
    setNamespace(state, val) {
      state.namespace = val;
    },
    setLastdata(state, val) {
      state.lastdata = val;
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
resetData.store = JSON.parse(JSON.stringify(scanningSteps.state));
export default scanningSteps;
