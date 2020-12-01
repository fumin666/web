/**
 * Created by dingyf on 2017/6/21.
 */
import { template } from 'lodash'
var templateStr = '' +
'<div typeid="<%=attrid%>" class="field-outer-container" id="Attribute_<%=attrid%>" data-attrid="<%=attrid%>">' +
'  <table width="100%" height="30" cellspacing="0" cellpadding="0" border="0">' +
'    <tbody><tr>' +
'      <td class="padralr8"><label id="label_<%=attrid%>"><%=attrname%></label></td>' +
'      <td width="177">' +
'        <input type="text" />' +
'      </td>' +
'      <td width="24" valign="middle" nowrap="nowrap"></td>' +
'      <td width="17" valign="top" class="editfldicnbg"><i alt="edit" class="icon iconfont icon-edit editfieldicon"></i></td>' +
'      <td width="26" valign="top" class="cmdbedtclose"><i alt="close" class="icon iconfont icon-cancel closefieldicon"></i></td>' +
'    </tr></tbody>' +
'  </table>' +
'</div>';
export default template(templateStr);
