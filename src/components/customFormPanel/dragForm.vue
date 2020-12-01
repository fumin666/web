<template>
  <div class="conForm" v-clickoutside="closeTree">
    <table cellpadding="0" cellspacing="0" width="100%" id="dropTable" style="margin-bottom:20px">
      <tbody>
      <tr>
        <td valign="top" width="218">
          <div class="attrib-curve">
            <div class="attrib-content atcolor">
              <div style="border-bottom:none;" class="fields">
                <ul id="fieldicons" class="field-icons">
                  <!--Q1删除系统属性类型-->
                  <!--<li class="field-icons-active" typeid="0">-->
                    <!--<table width="100%" cellspacing="0" cellpadding="0" class="dragItem">-->
                      <!--<tbody>-->
                      <!--<tr>-->
                        <!--<td width="22"><i class="icon iconfont icon-set"></i></td>-->
                        <!--<td valign="middle">系统属性</td>-->
                        <!--<td width="11"><i class="icon iconfont icon-arrow-right"></i></td>-->
                      <!--</tr>-->
                      <!--</tbody>-->
                    <!--</table>-->
                  <!--</li>-->
                  <li class="field-icons-active" typeid="1">
                    <table width="100%" cellspacing="0" cellpadding="0" class="dragItem">
                      <tbody>
                      <tr>
                        <td width="22"><i class="icon iconfont icon-file"></i></td>
                        <td valign="middle">文本</td>
                        <td width="11"><i class="icon iconfont icon-arrow-right"></i></td>
                      </tr>
                      </tbody>
                    </table>
                  </li>
                  <li class="field-icons-active" typeid="2">
                    <table width="100%" cellspacing="0" cellpadding="0" class="dragItem">
                      <tbody>
                      <tr>
                        <td width="22"><i class="icon iconfont icon-list"></i></td>
                        <td valign="middle">列表</td>
                        <td width="11"><i class="icon iconfont icon-arrow-right"></i></td>
                      </tr>
                      </tbody>
                    </table>
                  </li>
                  <li class="field-icons-active" typeid="3">
                    <table width="100%" cellspacing="0" cellpadding="0" class="dragItem">
                      <tbody>
                      <tr>
                        <td width="22"><i class="icon iconfont icon-after-change-psw"></i></td>
                        <td valign="middle">数值</td>
                        <td width="11"><i class="icon iconfont icon-arrow-right"></i></td>
                      </tr>
                      </tbody>
                    </table>
                  </li>
                  <li class="field-icons-active" typeid="4">
                    <table width="100%" cellspacing="0" cellpadding="0" class="dragItem">
                      <tbody>
                      <tr>
                        <td width="22"><i class="icon iconfont icon-calendar"></i></td>
                        <td valign="middle">日期</td>
                        <td width="11"><i class="icon iconfont icon-arrow-right"></i></td>
                      </tr>
                      </tbody>
                    </table>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
        <td valign="top">
          <div id="NewCITypeCanvas_CT" class="uicomponent">
            <div height="100" id="DropFieldsInfo"><br><br><br><br>在此拖放字段!</div>
            <div id="hiddendiv" style="position:absolute;left:0px;top:0px;visibility:hidden;z-index:1"></div>
            <div id="dotlayer" style="visibility:hidden;zIndex:99;margin:3px;"></div>
            <div id="dragForm" style="display:none;">
              <s-scrollbar wrap-style="max-height:250px;">
              <table width="100%" cellspacing="0" cellpadding="0" id="MainContent">
                <tbody>
                <tr>
                  <td width="50%" valign="top" class="form-split-left gridColumn" id="formcontainer">
                    <div id="dummy1" nowrap="nowrap" class="field-outer-container gridItem"
                         style="cursor: move;border:none;"></div>
                    <drag-template v-for="item in leftContainer" :key="item.uid" :divId="item.divId" :uid="item.uid"
                                   :attrTag="item.attrTag" :options="item.options" :value="item.value"
                                   :select="item.select"></drag-template>
                  </td>
                  <td width="50%" valign="top" class="form-split-right gridColumn" id="formcontainer1">
                    <div id="dummy2" nowrap="nowrap" class="field-outer-container gridItem"
                         style="cursor: move;border:none;"></div>
                    <drag-template v-for="item in rightContainer" :key="item.uid" :divId="item.divId" :uid="item.uid"
                                   :attrTag="item.attrTag" :options="item.options" :value="item.value"
                                   :select="item.select"></drag-template>
                  </td>
                </tr>
                </tbody>
              </table>
              </s-scrollbar>
            </div>
            <div style="display:none;" id="source-fields">
              <div typeid="0" class="field-outer-container" divid="365000000181001" id="365000000181001"></div>
            </div>
            <div style="display:none;" id="single-line">
              <div typeid="1" class="field-outer-container" divid="365000000181002" id="365000000181002"></div>
            </div>
            <div style="display:none;" id="pick-list">
              <div typeid="2" class="field-outer-container" divid="365000000181003" id="365000000181003"></div>
            </div>
            <div style="display:none;" id="Long">
              <div typeid="3" class="field-outer-container" divid="365000000181004" id="365000000181004"></div>
            </div>
            <div style="display:none;" id="DateTime">
              <div typeid="4" class="field-outer-container" divid="365000000181005" id="365000000181005"></div>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <s-dialog v-model="addSysAttrDialogModel" title="选择系统属性" v-if="addSysAttrDialogModel" append-to-body>
      <add-sys-attr-dialog ref="systemAttrDialog" :attrVal="attrVal"></add-sys-attr-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitSysAttrForm">确定</s-button>
        <s-button type="cancel" @click="cancelSysAttrForm">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog v-model="addTextAttrDialogModel" title="添加属性" height="150" v-if="addTextAttrDialogModel" append-to-body>
      <add-text-attr-dialog ref="textAttrDialog" :attrVal="attrVal" :dragData="dragData" :currentType="currentType"></add-text-attr-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitTextAttrForm">确定</s-button>
        <s-button type="cancel" @click="cancelTextAttrForm">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog v-model="addSelectAttrDialogModel" title="添加属性" height="150" v-if="addSelectAttrDialogModel" append-to-body>
      <add-select-attr-dialog ref="selectAttrDialog" :attrVal="attrVal"></add-select-attr-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitSelectAttrForm">确定</s-button>
        <s-button type="cancel" @click="cancelSelectAttrForm">取消</s-button>
      </template>
    </s-dialog>
 <!--   <div class="config">
      <div class="savediv">
        <s-button @click="Typesave">保存</s-button>
      </div>
    </div>-->
  </div>
</template>
<script>
  import {docid, showLayer, fadeIn, findPosX, findPosY, disableDefaultAction, getDialogTitle} from './util'
  import {each, map, cloneDeep} from 'lodash'
  import GridCustomize from './GridCustomize'
  import addSysAttrDialog from './addSysAttrDialog'
  import addTextAttrDialog from './addTextAttrDialog'
  import addSelectAttrDialog from './addSelectAttrDialog'
  import dragTemplate from './dragTemplate'
  import {Validaters} from 'sunflower-common-utils'
  import $axios from 'sunflower-ajax'
  import Clickoutside from '@/components/inputTree/clickoutside';
  let $ = window.$;
  window.dragging = false;
  var MainContent = null;
  var mouseLeft;
  var mouseTop;
  var editfcid = null;
  var fcls = 'field-outer-container';
  var fmcls = 'field-outer-container-hover';
  var facls = 'field-outer-container-action';
  var typearr = [];
  typearr[0] = 'source-fields';
  typearr[1] = 'single-line';
  typearr[2] = 'pick-list';
  typearr[3] = 'Long';
  typearr[4] = 'DateTime';
  var selfid = null;
  var movrfcid = null;
  export default {
    data() {
      return {
        // TOR: true,
        Relateuuid: '',
        TagsData: [],
        inputVisible: false,
        boxData: [],
        selectModel: {},
        citypeOptions: [],
        typeName: '',
        citypeValue: '',
        Relatevalue: '',
        RelateDialog: false,
        relateData: [],
        selData: [],
        parselUuid: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        parUuid: [],
        upSelectUuid: [],
        currentName: '',
        configForm: {
          version: 1,
          catogeryUuid: '',
          parentUuid: '',
          citypeName: '',
          citypeDescription: ''
        },
        configRules: {
          citypeName: [Validaters.NotNull]

        },
        attrData: [],  // 用于保存属性列表
        attrMap: {},
        mfobj: null,
        helem: null,
        askstate: false,
        addSysAttrDialogModel: false,
        addTextAttrDialogModel: false,
        addSelectAttrDialogModel: false,
        addTextAttrDialogTitle: '添加属性-文本',
        currentType: '-1',
        editOrAdd: 0, // 0 表示为添加 1 表示编辑
        leftContainer: [],
        rightContainer: [],
        selectCaUuid: [],
        selectCadatalist: [],
        citypeData: [],
        attr: [],
        attrVal: {}, // 添加和编辑时获取所有属性对象数组，用于校验是否重名
        attrm: [],
        boxDatauuid: [],
        scrollEle: {},
        disabled: false
      }
    },
    mounted() {
      this.init();
      this.loadEditAttr(this.attrMap);
    },
    components: {
      addSysAttrDialog,
      addTextAttrDialog,
      addSelectAttrDialog,
      dragTemplate
    },
    directives: { Clickoutside },
    watch: {
      addTextAttrDialogModel(val) {
        if (!val) {
          this.cancelTextAttrForm()
        }
      },
      addSysAttrDialogModel(val) {
        if (!val) {
          this.cancelSysAttrForm()
        }
      },
      addSelectAttrDialogModel(val) {
        if (!val) {
          this.cancelSelectAttrForm()
        }
      },
      value: {
        immediate: true,
        handler(val) {
          this.RelateDialog = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    props: {
      dragData: {
     type: Object
      }
    },
    created() {
      this.upSelect(this.dragData.threeTypeUuid || this.dragData.secondTypeUuid)
    },
    methods: {
      submitSysAttrForm() {
       let form = this.$refs.systemAttrDialog.$refs.sysAttrform
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          this.$refs.systemAttrDialog.submitForm(this.editOrAdd, () => {
            let id = this.$refs.systemAttrDialog.uid;
            let attr = this.$refs.systemAttrDialog.attr;
            this.attrMap[id] = cloneDeep(attr);
            MainContent.registerEventForEl(docid('Attribute_' + id));
            this.addSysAttrDialogModel = false;
          });
        })
      },
      cancelSysAttrForm() {
        this.addSysAttrDialogModel = false;
        this.$refs.systemAttrDialog.cancelForm();
      },
      submitTextAttrForm() {
        let form = this.$refs.textAttrDialog.$refs.sysAttrform
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          this.$refs.textAttrDialog.submitForm(this.editOrAdd, this.currentType, () => {
            let id = this.$refs.textAttrDialog.uid;
            let attr = this.$refs.textAttrDialog.attr;
            this.attrMap[id] = cloneDeep(attr);
            MainContent.registerEventForEl(docid('Attribute_' + id));
            this.addTextAttrDialogModel = false;
          });
        })
      },
      cancelTextAttrForm() {
        this.addTextAttrDialogModel = false;
        this.$refs.textAttrDialog.cancelForm();
      },
      submitSelectAttrForm() {
        let form = this.$refs.selectAttrDialog.$refs.sysAttrform
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.$refs.selectAttrDialog.attrForm.options.length <= 0) {
            this.$message({
              message: '至少添加一个选项',
              type: 'info'
            })
          } else {
            this.$refs.selectAttrDialog.submitForm(this.editOrAdd, () => {
              let id = this.$refs.selectAttrDialog.uid;
              let attr = this.$refs.selectAttrDialog.attr;
              this.attrMap[id] = cloneDeep(attr);
              MainContent.registerEventForEl(docid('Attribute_' + id));
              this.addSelectAttrDialogModel = false;
            });
          }
        })
      },
      cancelSelectAttrForm() {
        this.addSelectAttrDialogModel = false;
        this.$refs.selectAttrDialog.cancelForm();
      },
      movemouse(b) { // b是event
        if (this.mfobj.className !== 'field-icons-hover') {
          this.mfobj.className = 'field-icons-hover';
        }
        window.dragging = true;
        disableDefaultAction(b);
        if (document.all) {
          mouseLeft = window.event.clientX + $(window).scrollLeft();
          mouseTop = window.event.clientY;
        } else {
          mouseLeft = b.clientX;
          mouseTop = b.clientY;
        }
//        this.helem.style.left = (mouseLeft - $(this.helem.offsetParent).position().left - $(this.helem.offsetParent).css('margin-left').replace('px', '') - this.helem.offsetWidth / 2) + 'px';
//        this.helem.style.top = (mouseTop - $(this.helem.offsetParent).position().top - $(this.helem.offsetParent).css('margin-top').replace('px', '') - this.helem.offsetHeight / 2) + 'px';
        // 新的高度计算，如果再把这个组件拿出弹框的话用上边的注释，代码看不懂，先这样改了
        let DialogEl = document.querySelector('.special-status-dialog .s-dialog')
        this.helem.style.left = (mouseLeft - this.helem.offsetWidth / 2 - (DialogEl.offsetLeft - DialogEl.offsetWidth / 2)) + 'px';
        this.helem.style.top = (mouseTop - this.helem.offsetHeight / 2 - DialogEl.offsetTop) + 'px';

        this.helem.style.visibility = 'visible';
        var a = this.domousemove(mouseLeft, mouseTop, true);
        if (a !== true) {
          this.domousemove(mouseLeft, mouseTop, false);
        }
      },
      getOffsetLeft(e, target) {},
      getOffsetTop() {},
      domousemove(l, m, d) {
        var f = docid('formcontainer1').getElementsByTagName('div');
        if (d === true) {
          f = docid('formcontainer').getElementsByTagName('div');
        }
        var b = docid('dotlayer');
        var n = false;
        let DialogEl = document.querySelector('.special-status-dialog .s-dialog')
        for (var c = 0; c < f.length; c++) {
          var e = f.item(c);
//          var orderStr = parseInt(findPosX(e));
          // 此行为适应弹框而改，上一行注释为以前的代码
          var orderStr = parseInt(findPosX(e)) - DialogEl.offsetWidth / 2;
          var g = parseInt(findPosY(e));
          if (e.className.indexOf(fcls) === -1) {
            continue
          }
          if ((d === true && l + this.helem.offsetWidth / 2 < orderStr) || (d === false && l < orderStr) || (c === 0 && (m + this.helem.offsetHeight / 2 < g))) {
            if ((d === false && l < orderStr) && findPosY(docid('formcontainer')) + docid('formcontainer').offsetHeight > (m + this.helem.offsetHeight / 2)) {
              docid('formcontainer').appendChild(b);
              showLayer(b, true)
            } else {
              // document.documentElement.appendChild(b);
              docid('NewCITypeCanvas_CT').appendChild(b);
              showLayer(b, false)
            }
            n = true;
            break;
          } else {
            if (l > orderStr + b.offsetWidth) {
              if (d === true && findPosY(docid('formcontainer1')) + docid('formcontainer1').offsetHeight > (m + this.helem.offsetHeight / 2)) {
                docid('formcontainer1').appendChild(b);
                showLayer(b, true)
              } else {
                // document.documentElement.appendChild(b);
                docid('NewCITypeCanvas_CT').appendChild(b);
                showLayer(b, false);
              }
              n = false;
              break;
            }
          }
          if (m - this.helem.offsetHeight - e.offsetHeight < g) {
            var a = e.nextSibling;
            if (a) {
              e.parentNode.insertBefore(b, a)
            } else {
              e.parentNode.appendChild(b);
            }
            showLayer(b, true);
            n = true;
            break;
          }
        }
        return n;
      },
      // 拖拽添加
      addField(e, g) {
        if (e != null && e !== '' && e.length !== 0 && e.indexOf('error:') === 0) {
          return;
        }
        this.askstate = true;
        this.removedrag();
        var d = '';
        var f;
        var n = -1;
        var orderStr;
        var b = 1;
        if (editfcid == null) {
          b = g.cd;
          n = g.before;
          var l = document.createElement('div');
          if (n === -1 || n === '') {
            if (b === 1) {
              docid('formcontainer').appendChild(l);
              l.outerHTML = e;
              orderStr = this.getLast(true);
            } else {
              docid('formcontainer1').appendChild(l);
              l.outerHTML = e;
              orderStr = this.getLast();
            }
          } else {
            f = docid(n);
            if (b === 1 && f.parentNode === docid('formcontainer1')) {
              docid('formcontainer').appendChild(l);
              l.outerHTML = e;
              orderStr = this.getLast(true);
            } else {
              if (f) {
                f.parentNode.insertBefore(l, f);
                l.outerHTML = e;
                orderStr = this.getPrev(docid(n));
              } else {
                docid('formcontainer1').appendChild(l);
                l.outerHTML = e;
                orderStr = this.getLast();
              }
            }
          }
        } else {
          docid(editfcid).outerHTML = e;
          orderStr = docid(editfcid);
        }
        var a = docid('formcontainer').innerHTML;
        docid('formcontainer').innerHTML = a;
        if (g && g.selAppId) {
          var p = g.selAppId;
          var c = docid('input' + d);
          c.setAttribute('refAppId', p);
        }
        if (selfid && selfid !== null) {
          var o = docid(selfid);
          if (o) {
            o.className = fcls;
          }
        }
        selfid = null;
        if (orderStr && orderStr.id) {
          fadeIn(orderStr.id, 150, this.clearMovr);
          selfid = orderStr.id;
          docid(selfid).className = facls;
          var m = docid(selfid);
          m.innerHTML = '<div id="loadDiv" class="CIprogress"><span>Loading</span></div>';
        } else {
          this.clearMovr();
        }
        // 提示弹出框
        this.showf('loadDiv');
      },
      showf(id) {
        this.attrVal = cloneDeep(this.attrMap);
        // 隐藏loading
        docid(id).style.visibility = 'hidden';
        // var m = typearr[this.helem.getElementsByTagName('li').item(0).getAttribute('typeid')];
        var g = this.helem.getElementsByTagName('li').item(0).getAttribute('typeid');
        this.currentType = g;
        // addDialog.init(g);
        if (g === '0') { // 系统参数
          this.addSysAttrDialogModel = true;
          this.editOrAdd = 0; // 表示为添加
        }
        if (g === '1' || g === '3' || g === '4') { // 文本 数值 日期
          this.addTextAttrDialogTitle = getDialogTitle(g);
          this.addTextAttrDialogModel = true;
          this.editOrAdd = 0; // 表示为添加
        }
        if (g === '2') { // 列表
          this.addSelectAttrDialogModel = true;
          this.editOrAdd = 0; // 表示为添加
        }
      },
      removedrag() {
        if (this.helem) {
          this.helem.style.visibility = 'hidden';
          // document.documentElement.appendChild(docid('dotlayer'));
          docid('NewCITypeCanvas_CT').appendChild(docid('dotlayer'));
          showLayer(docid('dotlayer'), false);
        }
        // docid('DropFieldsInfo').style.display = 'none';
        // docid('dragForm').style.display = 'block';
      },
      getPrev(ele) {
        var c = docid('formcontainer').getElementsByTagName('div');
        var a = '';
        for (var b = 0; b < c.length; b++) {
          var d = c.item(b);
          if (d.className.indexOf(fcls) === -1) {
            continue;
          }
          if (d === ele) {
            return a;
          }
          a = d;
        }
        var container1Divs = docid('formcontainer1').getElementsByTagName('div');
        for (var i = 0; i < container1Divs.length; i++) {
          var divEle = container1Divs.item(i);
          if (divEle.className.indexOf(fcls) === -1) {
            continue;
          }
          if (divEle === ele) {
            return a;
          }
          a = divEle;
        }
      },
      getLast(flag) {
        var b = docid('formcontainer1').getElementsByTagName('div');
        if (flag === true) {
          b = docid('formcontainer').getElementsByTagName('div');
        }
        var e;
        for (var a = 0; a < b.length; a++) {
          var c = b.item(a);
          if (c.className.indexOf(fcls) === -1) {
            continue;
          }
          e = c;
        }
        return e;
      },
      clearMovr() { // 清理
        MainContent.regEventByClass('div', 'field-outer-container');
        this.askstate = false;
        if (selfid && selfid != null) {
        }
        ;
      },
      onLoad() {
        this.scrollEle = document.querySelectorAll('.sysScrollHeight.s-scrollbar-wrap')[0];
        MainContent = new GridCustomize('MainContent', 'setSeq', this.scrollEle);
        MainContent.setVM(this);
        MainContent.regEventByClass('div', 'field-outer-container');
      },
      dragstop(b) {
        this.mfobj.className = 'field-icons-active';
        document.onmousemove = null;
        document.onmouseup = null;
        if (document.all) {
          document.onselectstart = null;
        }
        var a = this.helem.getElementsByTagName('li').item(0).getAttribute('typeid');
        this.helem.style.visibility = 'hidden';
        this.helem.style.left = '0px';
        this.helem.style.top = '0px';
        if (docid('dotlayer').style.visibility === 'visible') {
          a = parseInt(a);
          var c = this.dootherwororderStrs(a, true);
          this.addField(docid(typearr[a]).innerHTML, c);
        } else {
          this.removedrag();
        }
        window.dragging = false;
      },
      dootherwororderStrs(a, d) {
        var formcontainer = 1;
        var container1Divs = docid('formcontainer1').getElementsByTagName('div');
        if (container1Divs.length > 1) {
          formcontainer = 2;
        }
        var index = -1;
        if (d) {
          formcontainer = 2;
          var e = docid('dotlayer');
          if (e.parentNode.id === 'formcontainer') {
            formcontainer = 1;
          }
          var g = e.parentNode.getElementsByTagName('div');
          for (var c = 0; c < g.length; c++) {
            if (g.item(c) === e && c !== g.length - 1) {
              index = g.item(c + 1).id + '';
              break;
            }
          }
          if (index === -1 && formcontainer === 1) {
            g = docid('formcontainer1').getElementsByTagName('div');
            if (g.length > 1) {
              index = g.item(1).id + '';
            }
          }
        }
        editfcid = null;
        var f = [];
        f.cd = formcontainer;
        f.before = index;
        return f;
      },
      movefield(f, orderStr) {
        docid('DropFieldsInfo').style.display = 'none';
        docid('dragForm').style.display = 'block';
        disableDefaultAction(f);
        if (document.all) {
          mouseLeft = window.event.clientX + $(window).scrollLeft() - parseInt(findPosX(orderStr));
          mouseTop = window.event.clientY - parseInt(findPosY(orderStr));
        } else {
          mouseLeft = f.clientX - parseInt(findPosX(orderStr));
          mouseTop = f.clientY - parseInt(findPosY(orderStr));
        }
        // 下面一行,为适应弹框的位置计算，新加的代码
        let DialogEl = document.querySelector('.special-status-dialog .s-dialog')
        this.mfobj = orderStr;
        this.helem = document.getElementById('hiddendiv');
//        this.helem.style.left = mouseLeft + 'px';
        // 下面一行,为适应弹框的位置计算，新加的代码,上方注释为以前的代码
        this.helem.style.left = (mouseLeft - (DialogEl.offsetLeft - DialogEl.offsetWidth / 2)) + 'px';
        this.helem.style.top = mouseTop + 'px';
        var e = orderStr.outerHTML;
        if (!orderStr.outerHTML) {
          var g;
          g = document.createElement('div');
          g.appendChild(orderStr.cloneNode(true));
          e = g.innerHTML;
        }
        this.helem.innerHTML = '<ul class="field-icons">' + e + '</ul>';
        this.helem.style.width = '205px';
        var d = docid('formcontainer').getElementsByTagName('div');
        var a = null;
        if (d.length < 2) {
          var c = docid('formcontainer1').getElementsByTagName('div');
          if (c.length < 2) {
            a = d.item(0);
          } else {
            d = c;
          }
        }
        if (a == null) {
          a = d.item(1);
        }
        // 鼠标浮动层
        var b = docid('dotlayer');
        b.style.width = a.offsetWidth + 'px';
        b.style.height = '40px';
        movrfcid = null;
        document.onmousemove = this.movemouse;
        document.onmouseup = this.dragstop;
      },
      fieldContainerMouse(ele, flag) {
        // mydiv = ele;
        if (window.dragging !== true && this.askstate !== true) {
          if (selfid !== null) {
            docid(selfid).className = fcls;
            selfid = null
          }
          var classNameStr = ele.className.split(' ')[0];
          var eleId = ele.id;
          if (flag && classNameStr.indexOf(fmcls) !== -1) {
            ele.className = fcls
          } else {
            if (!flag && classNameStr.indexOf(fmcls) === -1) {
              if (movrfcid) {
                var movDiv = docid(movrfcid);
                if (movDiv && movDiv.className.indexOf(fmcls) !== -1) {
                  movDiv.className = fcls
                }
              }
              movrfcid = eleId;
              ele.className = fmcls
            }
          }
        }
      },
      init() {
        this.$nextTick(() => {
          this.onLoad();
        });
        let _self = this;
        // 委托事件
        $('#dropTable').undelegate().delegate('.field-icons-active', 'mouseover', function () {
          if (window.dragging !== true) {
            $(this).removeClass().addClass('field-icons-hover');
          }
        }).delegate('.field-icons-hover', 'mouseout', function () {
          if (window.dragging !== true) {
            $(this).removeClass().addClass('field-icons-active');
          }
        }).delegate('.fields .field-icons-hover', 'mousedown', function (e) {
          _self.movefield(e, this);
        }).delegate('.field-outer-container', 'mouseover', function (e) {
          _self.fieldContainerMouse(this);
        }).delegate('.field-outer-container-hover', 'mouseout', function (e) {
          _self.fieldContainerMouse(this, 'true');
        });
      },
      attrDataArray() {
        map(this.attrMap, (value, key) => {
          this.attrData.push(value);
        })
        return this.attrData;
      },
      clearAttrData() {
        this.attrMap = {};
        this.attrData = [];
      },
      loadEditAttr(typeattrList) {
        if (typeof typeattrList !== 'undefined' && typeattrList.length > 0) {
          $('#DropFieldsInfo').hide();
          $('#dragForm').show();
          $('#dragForm').show();
          each(typeattrList, (item, index) => {
            this.attrMap[item.uuid] = item;
            if (item.htmlType === 'udf_char_list') {
              this.options = [];
              this.value = '';
              // 无法展示下拉列表所以不给数据
              if (index % 2 === 0) {
                this.leftContainer.push({
                  uid: item.uuid,
                  divId: 'Attribute_' + item.uuid,
                  attrTag: item.colnumName,
                  options: [],
                  value: '',
                  select: true
                });
              } else {
                this.rightContainer.push({
                  uid: item.uuid,
                  divId: 'Attribute_' + item.uuid,
                  attrTag: item.colnumName,
                  options: [],
                  value: '',
                  select: true
                });
              }
            } else {
              if (index % 2 === 0) {
                this.leftContainer.push({
                  uid: item.uuid,
                  divId: 'Attribute_' + item.uuid,
                  attrTag: item.colnumName,
                  select: false
                });
              } else {
                this.rightContainer.push({
                  uid: item.uuid,
                  divId: 'Attribute_' + item.uuid,
                  attrTag: item.colnumName,
                  select: false
                });
              }
            }
          });
          this.$nextTick(function () {
            MainContent.regEventByClass('div', 'field-outer-container');
          });
        }
      },
      selList () {
        if (this.configForm.version === 1) {
          this.selData = this.selectCaUuid.slice(0, this.selectCaUuid.length - 1);
          this.configForm.catogeryUuid = this.selData[0].uuid
          this.select()
        } else {
          this.selData = this.selectCaUuid.slice(this.selectCaUuid.length - 1, this.selectCaUuid.length);
          this.configForm.catogeryUuid = this.selData[0].uuid
        }
      },
      select () {
        let uuid = this.configForm.catogeryUuid
        this.parselUuid = this.selData.filter(function (item) {
          return item.uuid === uuid
        })
        for (let i = 0; i < this.parselUuid.length; i++) {
          let arr = this.parselUuid[i]
          this.parUuid = arr.childrenList
        }
        for (let i = 0; i < this.parUuid.length; i++) {
          if (this.parUuid[i].childrenList.length !== 0) {
            let parArr = this.parUuid[i].childrenList
            // this.parUuid.push(parArr)
            for (let j = 0; j < parArr.length; j++) {
              let b = parArr[j]
              this.parUuid.push(b)
            }
          }
        }
        this.configForm.parentUuid = this.parUuid[0].uuid
        this.upSelect(this.configForm.parentUuid)
      },
      upSelect(uuid) {
        // 删除手动添加的dom节点
       /* let elements = new Array(...document.querySelector('#MainContent').querySelectorAll('.field-outer-container'))
        elements.map(item => {
          if (item.parentNode && !item.getAttribute('nowrap')) {
            item.parentNode.removeChild(item)
          }
        }) */
        this.rightContainer = []
        this.leftContainer = []
        this.attrm = []
        this.attrMap = {}
        $axios.post(`/resourcemanager/configurationmanage/citype/getcitypeDetail/${uuid}`).then((res) => {
            this.attrm = []
            this.citypeData = res.data
            for (let i = 0; i < this.citypeData.typeAttributeList.length; i++) {
                let clist = this.citypeData.typeAttributeList[i]
                this.$set(clist, 'uid', clist.uuid)
                this.$set(clist, 'divId', 'Attribute_' + clist.uuid)
                this.$set(clist, 'attrTag', clist.colnumName)
                this.$set(clist, 'options', [])
                this.$set(clist, 'value', clist.defaultValue)
                this.$set(clist, 'select', true)
              this.attrm.push(clist)
            }

            this.loadEditAttr(this.attrm);
          })
      },
      closeTree() {
        this.RelateDialog = false
      },
     Typesave() {
      let param = {
        savetype: 1,
        typeAttributeList: [],
        uuid: this.dragData.threeTypeUuid || this.dragData.secondTypeUuid
       }
       for (let i in this.attrMap) {
         let attrTemp = {
           colnumName: this.attrMap[i].colnumName,
           htmlType: this.attrMap[i].htmlType,
           isSyetemAttribute: this.attrMap[i].isSyetemAttribute,
           attributeDesc: this.attrMap[i].attributeDesc,
           listvalues: this.attrMap[i].listvalues,
           defaultValue: this.attrMap[i].defaultValue,
           isRequired: this.attrMap[i].isRequired
         }
         this.attrMap[i].uid && (attrTemp.uuid = this.attrMap[i].uuid);
         param.typeAttributeList.push(attrTemp);
       }
       $axios.post('/resourcemanager/configurationmanage/citype/save', param, {
       }).then((res) => {
       if (res.data === 'true') {
       this.$message({showClose: true, message: '保存成功!', type: 'success'});
       } else {
       this.$message({showClose: true, message: '保存失败!', type: 'error'});
       }
       })
       }
      }
  }

</script>
<style lang="stylus" rel="stylesheet/stylus">
  .config
    .s-form-item-label
       text-align: right
</style>
