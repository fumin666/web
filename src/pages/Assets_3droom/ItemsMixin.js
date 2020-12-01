/**
 * 可导入资产类型
 */

let ItemsMixin = {
  data () {
    return {
      items: [
        {
          'name': '摄像头',
          'image': 'static/3droom/models/thumbnails/thumbnail_camera.png',
          'model': 'static/3droom/models/js/jiankong.obj',
          'type': '13',
          'ctype': 'camera'
        },
        {
          'name': '机柜',
          'image': 'static/3droom/models/thumbnails/thumbnail_empty_cabinet.png',
          'model': 'interior',
          'type': '15',
          'ctype': 'emptyCabinet'
        },
        {
          'name': '列头柜',
          'image': 'static/3droom/models/thumbnails/thumbnail_arrayAbinet.png',
          'model': 'static/3droom/models/js/lietougui.obj',
          'type': '24',
          'ctype': 'arrayAbinet'
        },
        {
          'name': 'UPS',
          'image': 'static/3droom/models/thumbnails/thumbnail_ups.png',
          'model': 'static/3droom/models/js/ups.obj',
          'type': '24',
          'ctype': 'ups'
        },
        {
          'name': '配电柜',
          'image': 'static/3droom/models/thumbnails/thumbnail_peidiangui.png',
          'model': 'static/3droom/models/js/peidiangui.obj',
          'type': '24',
          'ctype': 'peidiangui'
        },
        {
          'name': '机房空调',
          'image': 'static/3droom/models/thumbnails/thumbnail_CRAirConditioner.png',
          'model': 'static/3droom/models/js/jifangkongtiao.obj',
          'type': '24',
          'ctype': 'CRAirConditioner'
        },
        {
          'name': '出风口',
          'image': 'static/3droom/models/thumbnails/thumbnail_airoutletpng.png',
          'model': 'interior',
          'type': '10',
          'ctype': 'airoutlet'
        },
        {
          'name': '宣传展板',
          'image': 'static/3droom/models/thumbnails/thumbnail_message.png',
          'model': 'interior',
          'type': '11',
          'ctype': 'messagePanel'
        },
        {
          'name': '电视',
          'image': 'static/3droom/models/thumbnails/thumbnail_television.png',
          'model': 'interior',
          'type': '11',
          'ctype': 'television'
        },
        {
          'name': '家用空调',
          'image': 'static/3droom/models/thumbnails/thumbnail_air_condition.png',
          'model': 'static/3droom/models/js/kongtiao.obj',
          'type': '24',
          'ctype': 'aircondition'
        },
        {
          'name': '显示器',
          'image': 'static/3droom/models/thumbnails/thumbnail_computer.png',
          'model': 'static/3droom/models/js/computer.js',
          'type': '21',
          'ctype': 'pc'
        },
        {
          'name': '笔记本电脑',
          'image': 'static/3droom/models/thumbnails/thumbnail_laptop.png',
          'model': 'static/3droom/models/js/bijiben.obj',
          'type': '25',
          'ctype': 'laptop'
        },
        {
          'name': '台式电脑',
          'image': 'static/3droom/models/thumbnails/thumbnail_desktopComputer.png',
          'model': 'static/3droom/models/js/taishidiannao.obj',
          'type': '25',
          'ctype': 'desktopComputer'
        },
        {
          'name': '关着的门',
          'image': 'static/3droom/models/thumbnails/thumbnail_Screen_Shot_2014-10-27_at_8.04.12_PM.png',
          'model': 'static/3droom/models/js/closed-door28x80_baked.js',
          'type': '7',
          'ctype': 'closedDoor'
        },
        {
          'name': '敞开的门',
          'image': 'static/3droom/models/thumbnails/thumbnail_Screen_Shot_2014-10-27_at_8.22.46_PM.png',
          'model': 'static/3droom/models/js/open_door.js',
          'type': '7',
          'ctype': 'openDoor'
        },
        {
          'name': '玻璃门',
          'image': 'static/3droom/models/thumbnails/thumbnail_door.png',
          'model': 'interior',
          'type': '12',
          'ctype': 'glassDoor'
        },
        {
          'name': '玻璃窗',
          'image': 'static/3droom/models/thumbnails/thumbnail_glasses.png',
          'model': 'interior',
          'type': '14',
          'ctype': 'glasses'
        },
        {
          'name': '门禁',
          'image': 'static/3droom/models/thumbnails/thumbnail_doorControl.png',
          'model': 'interior',
          'type': '16',
          'ctype': 'doorControl'
        },
        {
          'name': '柱子',
          'image': 'static/3droom/models/thumbnails/thumbnail_column.png',
          'model': 'interior',
          'type': '17',
          'ctype': 'column'
        },
        {
          'name': '办公椅',
          'image': 'static/3droom/models/thumbnails/thumbnail_officeChair.png',
          'model': 'static/3droom/models/js/bangongyi.obj',
          'type': '24',
          'ctype': 'officeChair'
        },
        {
          'name': '办公桌-简易',
          'image': 'static/3droom/models/thumbnails/thumbnail_officeDesk.png',
          'model': 'static/3droom/models/js/bangongzhuo.obj',
          'type': '24',
          'ctype': 'officeDesk'
        },
        {
          'name': '桌子',
          'image': 'static/3droom/models/thumbnails/thumbnail_desk.png',
          'model': 'static/3droom/models/js/desk.js',
          'type': '8',
          'ctype': 'desk'
        },
        {
          'name': '椅子',
          'image': 'static/3droom/models/thumbnails/thumbnail_chair.png',
          'model': 'static/3droom/models/js/chair.js',
          'type': '8',
          'ctype': 'chair'
        },
        {
          'name': '双人沙发',
          'image': 'static/3droom/models/thumbnails/thumbnail_doubleSofa.png',
          'model': 'static/3droom/models/js/dashafa.obj',
          'type': '24',
          'ctype': 'doubleSofa'
        },
        {
          'name': '单人沙发',
          'image': 'static/3droom/models/thumbnails/thumbnail_singleSofa.png',
          'model': 'static/3droom/models/js/shafa.obj',
          'type': '24',
          'ctype': 'armchair'
        },
        {
          'name': '茶几',
          'image': 'static/3droom/models/thumbnails/thumbnail_teaTable.png',
          'model': 'static/3droom/models/js/chajizi.obj',
          'type': '24',
          'ctype': 'teaTable'
        },
        {
          'name': '植物',
          'image': 'static/3droom/models/thumbnails/thumbnail_plant.png',
          'model': 'static/3droom/models/js/plant.obj',
          'type': '20',
          'ctype': 'plant'
        },
        {
          'name': '植物2',
          'image': 'static/3droom/models/thumbnails/thumbnail_plant2.png',
          'model': 'static/3droom/models/js/huapen.obj',
          'type': '26',
          'ctype': 'customPlant'
        },
        {
          'name': '灭火器',
          'image': 'static/3droom/models/thumbnails/thumbnail_extinguisher.png',
          'model': 'static/3droom/models/js/extinguisher.js',
          'type': '8',
          'ctype': 'extinguisher'
        },
        {
          'name': '消防柜',
          'image': 'static/3droom/models/thumbnails/thumbnail_fireStation.png',
          'model': 'static/3droom/models/js/xiaofangshuangui.js',
          'type': '8',
          'ctype': 'fireStation'
        }
      ]
    }
  },
  methods: {
    getInfoByCtype(ctype) {
      return this.items.find((element) => {
        return element.ctype === ctype;
      });
    }
  }
};

export default ItemsMixin;
