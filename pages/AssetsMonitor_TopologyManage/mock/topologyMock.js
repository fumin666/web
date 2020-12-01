import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {TreeData, TopoviewConfig, getTopoviewData, getViewInfo, getTopoviewLineDetail, getTopoviewNodeDetail} from './topology';

export default {
  bootstrap () {
    let mock = new MockAdapter(axios);

    // 拓扑图左侧树
    mock.onPost('/viewmanager/topoview/getTopoviewTypeTreeList').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, TreeData]);
        }, 1000);
      })
    });

    // 拓扑图全局设置
    mock.onPost('/viewmanager/topoview/getTopoviewConfig').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, TopoviewConfig]);
        }, 1000);
      })
    });

    // 拓扑图全局设置
    mock.onGet('/viewmanager/topoview/getTopoview').reply(config => {
      let { subTopoId } = config.params;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, getTopoviewData(subTopoId)]);
        }, 1000);
      })
    });
    // 拓扑图实时信息
    mock.onGet('/viewmanager/topoview/getTopoviewShowByTopoviewInfoUuid').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, getViewInfo()]);
        }, 1000);
      })
    });

    // 线的详情信息
    mock.onGet('/viewmanager/topoview/getTopoviewLineDetail').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, getTopoviewLineDetail()]);
        }, 1000);
      })
    });

    // 节点详情信息
    mock.onGet('/viewmanager/topoview/getTopoviewNodeDetail').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, getTopoviewNodeDetail()]);
        }, 1000);
      })
    });
    // 保存或者更新拓扑图
    mock.onPost('/viewmanager/topoview/saveOrUpdateTopoview').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, true]);
        }, 1000);
      })
    });
  }
}

