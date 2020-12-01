/*
 * @Author: 高建鹏
 * @Date: 2019-06-03 11:18:08
 * @LastEditors: 高建鹏
 * @Description: ip地址扫描
 * @Position: src\pages\Assets_Ipam\Perspective\AddressScanSteps
 */
const step1 = {
 state: {
    step1Data: {
      finishCount: 0,
      totalCount: 0,
      isfinish: false
    },
    dataList: [],
    progress: 0,
    scanTime: 0
  },
  mutations: {
    setStep1DataList(state, value) {
      state.dataList = value;
    },
    setStep1Data(state, value) {
      state.step1Data = value;
    },
    setStep1Progress(state, value) {
      state.progress = value;
    },
    setStep1ScanTime(state, value) {
      state.scanTime = value;
    },
    setfinishCount(state, value) {
      state.step1Data.finishCount = value;
    },
    settotalCount(state, value) {
      state.step1Data.totalCount = value;
    },
    setisfinish(state, value) {
      state.step1Data.isfinish = value;
    }
  }
};
const step2 = {
  state: {

  },
  mutations: {

  }
};

const addressScanSteps = {
  namespaced: true,
  state: {
    current: 0, // 当前step
    showFooter: true,
    runStartTime: 0,
    runEndTime: 0,
    ipsubnetobj: {},
    lastdata: {},
    namespace: ''
  },
  mutations: {
    prev(state) {
      state.current--
    },
    ipsubnetobj(state, obj) {
      state.ipsubnetobj = obj
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
    step2
  }
};

let resetData = {};
resetData.step1 = JSON.parse(JSON.stringify(step1.state));
resetData.step2 = JSON.parse(JSON.stringify(step2.state));
resetData.store = JSON.parse(JSON.stringify(addressScanSteps.state));

export default addressScanSteps;
