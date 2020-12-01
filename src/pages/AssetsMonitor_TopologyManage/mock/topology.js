import Mock from 'mockjs';

const TreeData = [{
  'nocheck': true,
  'dataobj': {
    'id': 2,
    'uuid': 'topoviewtypedefaultuuid0000000000000',
    'name': '总拓扑',
    'parentUuid': 'topoviewtypeparentdefaultuuid0000000'
  },
  'nodeIcon': 'icon-folder',
  'objectList': null,
  'parentName': null,
  'parent': true,
  'open': true
}, {
  'nocheck': true,
  'dataobj': {
    'id': 4,
    'uuid': '6f20f3ec16b34c50a067b14180934163',
    'name': '拓扑',
    'parentUuid': 'topoviewtypedefaultuuid0000000000000'
  },
  'nodeIcon': 'icon-folder',
  'objectList': null,
  'parentName': null,
  'parent': true,
  'open': true
}, {
  'nocheck': true,
  'dataobj': {
    'id': 2,
    'uuid': 'topoviewinfodefaultuuid000000000',
    'name': '总拓扑',
    'background': '',
    'label': 1,
    'mapview': '0|0|1',
    'parentUuid': 'topoviewtypedefaultuuid0000000000000',
    'groupUuid': 'ccff98ce0b1b4fe69c15e6f0695258d3',
    'edges': null,
    'vertexs': null,
    'showInfo': null
  },
  'nodeIcon': 'icon-picture',
  'objectList': null,
  'parentName': null,
  'parent': false,
  'open': true
}, {
  'nocheck': true,
  'dataobj': {
    'id': 4,
    'uuid': '2a897d139f8746c9b4b64ff174a27d4a',
    'name': '拓扑1',
    'background': null,
    'label': null,
    'mapview': null,
    'parentUuid': '6f20f3ec16b34c50a067b14180934163',
    'groupUuid': 'ccff98ce0b1b4fe69c15e6f0695258d3',
    'edges': null,
    'vertexs': null,
    'showInfo': null
  },
  'nodeIcon': 'icon-picture',
  'objectList': null,
  'parentName': null,
  'parent': false,
  'open': true
}];

const TopoviewConfig = {
  'realtime': [
    1,
    1,
    0,
    0,
    0
  ],
  'linecolor': {
    '0': 'EF715D',
    '1': '7EAF08',
    '2': 'FCC400'
  },
  'labelcolor': 'ffffff',
  'layout': [
    {
      '1': '500'
    },
    {
      '2': '120'
    },
    {
      '3': '120|20'
    },
    {
      '4': '120|20'
    },
    {
      '5': '120|20'
    },
    {
      '6': '120|20'
    },
    {
      '7': '120|20'
    }
  ],
  'hovercolor': 'f5001d',
  'period': '180',
  'showapp': 0
};

let vertexs = [];
let edges = [];
let imgAry = ['building', 'businessService', 'DataBase', 'display', 'domecamera', 'Firewall', 'guncamera', 'hostHardWare', 'Hub', 'layer3switch', 'networkserver', 'Printer', 'Router', 'Server', 'Switch', 'VirtualDevice'];
let currentTopologyId = 0;
let currentData = null;

function createViewData () {
  let tempObj = {};
  let s = 0;
  let t = 0;
  let stAry = [];
  vertexs = [];
  edges = [];

  for (let i = 0, length = 80; i < length; i++) {
    vertexs.push(Mock.mock({
      'id': Mock.Random.increment(),
      'uuid': Mock.Random.guid(),
      'type': 1,
      'typeUuid': Mock.Random.guid(),
      'hostIp': Mock.Random.ip(),
      'busnessName': Mock.Random.title(2, 3),
      'icon': null,
      'funcType|1': ['SAS', 'SERVER', 'SWITCH', 'VIRTUALDEVICE', 'FIREWALL', 'PRINTER', 'ROUTER'],
      'parent': '-1',
      'style': 'image;image=../static/images/topologyicon/default/' + imgAry[Mock.Random.integer(0, 15)] + '.svg',
      'geo': '{"width":60,"height":60,"x":' + Mock.Random.integer(0, 2000) + ',"y":' + Mock.Random.integer(0, 2000) + '}',
      'isApp': 0,
      'topoviewInfoUuid': 'topoviewinfodefaultuuid000000000',
      'itcompName': Mock.Random.name() + '-PC'
    }));
  }

  for (let i = 0, length = 70; i < length; i++) {
    s = Mock.Random.integer(0, 79);
    t = Mock.Random.integer(0, 79);
    if (checkIndex(s, t)) {
      tempObj[s + '-' + t] = true;
      stAry.push({'s': s, 't': t});
    } else {
      length = length + 1;
    }
  }

  function checkIndex (s, t) {
    if (typeof tempObj[s + '-' + t] === 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  for (let i = 0, length = 70; i < length; i++) {
    edges.push(Mock.mock({
      'id': Mock.Random.increment(),
      'uuid': Mock.Random.guid(),
      'parent': '-1',
      'style': 'noEdgeStyle=1',
      'geo': 'null',
      'sourceNodeUuid': vertexs[stAry[i].s]['typeUuid'],
      'targetNodeUuid': vertexs[stAry[i].t]['typeUuid'],
      'topoviewLinkUuid': Mock.Random.guid(),
      'topoviewInfoUuid': 'topoviewinfodefaultuuid000000000',
      'isOnline': 1,
      'sourceMiUuid': null,
      'targetMiUuid': null,
      'name': null
    }));
  }
}

function getTopoviewData (topologyId) {
  if (topologyId !== currentTopologyId) {
    currentTopologyId = topologyId;
    createViewData();
    let Topoview = {
      'id': 2,
      'uuid': topologyId,
      'name': '总拓扑',
      'background': '',
      'label': 1,
      'mapview': null, // '0|0|1'
      'parentUuid': 'topoviewtypedefaultuuid0000000000000',
      'groupUuid': 'ccff98ce0b1b4fe69c15e6f0695258d3',
      'edges': edges,
      'vertexs': vertexs,
      'showInfo': null
    };
    currentData = Topoview;
  }
  return currentData;
}

let statusAry = ['0', '1', '2'];

function getViewInfo () {
  let topoviewInfo = [];
  for (let i = 0, length = vertexs.length; i < length; i++) {
    topoviewInfo.push(Mock.mock({
      'uuid': vertexs[i].typeUuid,
      'type': 1,
      'status|1': statusAry,
      'unrecoveryIncidentNum': null,
      'inSpeed': null,
      'outSpeed': null,
      'souceItcompUuid': null,
      'targetItcompUuid': null,
      'souceMiUuid': null,
      'targetMiUuid': null,
      'topoviewInfoUuid': 'topoviewinfodefaultuuid000000000'
    }));
  }
  for (let i = 0, length = edges.length; i < length; i++) {
    topoviewInfo.push(Mock.mock({
      'uuid': edges[i].uuid,
      'type': 2,
      'status|1': statusAry,
      'unrecoveryIncidentNum': null,
      'inSpeed|0-1.1-2': 1.1,
      'outSpeed|0-1.1-2': 1.1,
      'souceItcompUuid': edges[i].sourceNodeUuid,
      'targetItcompUuid': edges[i].targetNodeUuid,
      'souceMiUuid': null,
      'targetMiUuid': null,
      'topoviewInfoUuid': 'topoviewinfodefaultuuid000000000'
    }));
  }
  return topoviewInfo;
}

function getTopoviewLineDetail () {
  return {
    'sourceIp': Mock.Random.ip(),
    'targetIp': Mock.Random.ip(),
    'sourceHostName': Mock.Random.title(2, 3) + '-serv',
    'targetHostName': Mock.Random.title(2, 3) + '-serv',
    'sourceInterfaceName': Mock.Random.title(2, 3) + 'net0/47',
    'targetInterfaceName': Mock.Random.title(2, 3) + 'net0/22',
    'sourceData': '{\"outPacket\":\"1.00\",\"ifAdminStatus\":\"1\",\"utilization\":\"5.53\",\"ifType\":\"2\",\"inSpeed\":\"4961.87\",\"outSpeed\":\"564.00\",\"ifOperStatus\":\"1\",\"speed\":\"100.0\",\"inPacket\":\"0.00\",\"monitorItcompKey\":\"bf706057c969430892c281a868e7a6d6\",\"outUtilization\":\"0.56\",\"inUtilization\":\"4.96\",\"ipAddress\":\"--\"}',
    'targetData': '{\"outPacket\":\"1.00\",\"ifAdminStatus\":\"1\",\"utilization\":\"5.50\",\"ifType\":\"2\",\"inSpeed\":\"561.26\",\"outSpeed\":\"4937.38\",\"ifOperStatus\":\"1\",\"speed\":\"100.0\",\"inPacket\":\"0.00\",\"monitorItcompKey\":\"4c502c31c6b946338a8b5f14d5523600\",\"outUtilization\":\"4.94\",\"inUtilization\":\"0.56\",\"ipAddress\":\"--\"}',
    'sourceVlanJson': null,
    'targetVlanJson': null,
    'isOnline': '2'
  };
}

function getTopoviewNodeDetail () {
  return {
    'ip': Mock.Random.ip(),
    'hostName': Mock.Random.title(2, 3),
    'catalogy': '资产系统',
    'status': '正常',
    'cpuFrequ': '0.0%',
    'cpuRate': Mock.Random.float(40, 100, 1, 2),
    'memRate': Mock.Random.float(40, 100, 1, 2),
    'runtime': '21天12小时31分22秒'
  }
}
export { TreeData, TopoviewConfig, getTopoviewData, getViewInfo, getTopoviewLineDetail, getTopoviewNodeDetail };
