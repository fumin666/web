// 资产发现
const step1 = {
  state: {
    step1Form: {
      version: 2,
      userName: '',
      snmpPassword: '',
      encryption: '0'
    },
    stepForm2: {
      subNetAddress: '',
      mxHostCount: 0,
      subNetMask: '',
      ipaddress: '',
      ipType: 4
    },
    step1List: [],
    selections: [],
    seedIP: '',
    scan: {
      status: '',
      msg: '',
      content: '',
      type: ''
    },
    selections2: [],
    stepList2: [],
    graphData: []
  },
  mutations: {

    setStep1Form(state, value) {
      state.step1Form = value;
    },
    setStepForm2(state, value) {
      state.stepForm2 = value;
    },
    setStep1Selections(state, value) {
      state.selections = value;
    },
    setStep1List(state, value) {
      state.step1List = value;
    },
    setSeedIP(state, value) {
      state.seedIP = value;
    },
    setScan(state, value) {
      state.scan = value;
    },
    setStepSelections2(state, value) {
      state.selections2 = value;
    },
    setStepList2(state, value) {
      state.stepList2 = value;
    }
  }
};

const step2 = {
  state: {
    step2Data: {
      applicationNum: '',
      distinguishDeviceNum: '',
      finishCount: '',
      isFinish: false,
      hardwareDeviceNum: '',
      hostDeviceNum: '',
      networkDeviceNum: '',
      other: [],
      router: [],
      scanning: [],
      server: [],
      snmpResponseNum: '',
      switch: [],
      totalCount: ''
    },
    dataList: [],
    progress: 0,
    scanTime: 0
  },
  mutations: {
    setStep2Data(state, value) {
      state.step3Data = value;
    },
    setDataList(state, value) {
      state.dataList = value;
    },
    setStep2Progress(state, value) {
      state.progress = value;
    },
    setStep2ScanTime(state, value) {
      state.scanTime = value;
    }
  }
};

const store = {
  state: {
    scanType: 2, // 全网扫描方式
    current: 0,
    showFooter: true,
    runStartTime: '',
    runEndTime: '',
    namespace: ''
  },
  mutations: {
    scanType(state, n) {
      state.scanType = n;
    },
    prev(state) {
      state.current--
    },
    jump(state) {
      state.current = 5;
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
resetData.store = JSON.parse(JSON.stringify(store.state));

export default store;
