
var iconUrl = 'image;image=../static/images/topologyicon/default/';
// var iconEnum = {
//   'DATABASE': 'DataBase.svg',
//   'CAMERAS': 'domecamera.svg',
//   'FIREWALL': 'Firewall.svg',
//   'SERVERHARDWARE': 'hostHardWare.svg',
//   'HUB': 'Hub.svg',
//   'MIDDLEWARE': 'Middleware.svg',
//   'WEBSERVER': 'networkserver.svg',
//   'PRINTER': 'Printer.svg',
//   'ROUTER': 'Router.svg',
//   'SERVER': 'Server.svg',
//   'SWITCH': 'Switch.svg',
//   'UNKNOWN': 'unknown.svg',
//   'VIRTUALDEVICE': 'VirtualDevice.svg',
//   'SAS': 'Server.svg'
// };
var iconEnum = {
  'DATABASE': 'DataBase.svg',
  'CAMERAS': 'domecamera.svg',
  'FIREWALL': 'Firewall.svg',
  'SERVERHARDWARE': 'hostHardWare.svg',
  'HUB': 'Hub.svg',
  'MIDDLEWARE': 'Middleware.svg',
  'WEBSERVER': 'networkserver.svg',
  'PRINTER': 'Printer.svg',
  'ROUTE': 'Router.svg',
  'PCSERVER': 'PCserver.svg',
  'NETWORKSWITCH': 'NetworkSwitch.svg',
  'SECURITYAUDIT': 'SecurityAudit.svg',
  'UNKNOWN': 'unknown.svg',
  'VIRTUALDEVICE': 'VirtualDevice.svg',
  'SAS': 'Server.svg',
  'VIRTUALMACHINE': 'VirtualMachine.svg'
};

function getStyle (obj) {
  if (obj.style) {
    return obj.style;
  } else {
    if (obj.funcType) {
      return iconUrl + (iconEnum[obj.funcType] || iconEnum['UNKNOWN']);
    } else {
      return iconUrl + iconEnum['UNKNOWN'];
    }
  }
}

function getIcon () {
  return iconEnum;
}

export default {
  getStyle: getStyle,
  getIcon: getIcon
};
