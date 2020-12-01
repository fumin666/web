<template>
  <s-tab id="downloadDialog" :animated="false">
    <s-tab-pane label="客户端下载">
      <s-table
        :data="clientData">
        <s-table-column
          label="客户端类型">
          <template slot-scope="scope">
            <s-row type="flex">
              <s-col span="6">
                <div class="tableicon" :class="scope.row.class"></div>
              </s-col>
              <s-col span="18">
                <div>{{scope.row.name}}</div>
              </s-col>
            </s-row>
          </template>
        </s-table-column>
        <s-table-column
          prop="version"
          label="支持版本号">
        </s-table-column>
        <s-table-column
          prop="clientName"
          label="客户端名称">
        </s-table-column>
        <s-table-column
          label="下载">
          <template slot-scope="scope">
            <i @click="clientDown(scope.row)" class="iconfont icon-download"></i>
          </template>
        </s-table-column>
      </s-table>
    </s-tab-pane>
    <s-tab-pane label="运维工具下载" v-if="auditShow">
      <s-scrollbar wrap-class="scrollMaxH">
        <s-table
          :data="toolsData">
          <s-table-column
            label="客户端类型"
            width="160">
            <template slot-scope="scope">
              <s-row type="flex" align="middle">
                <s-col span="4">
                  <div class="tableicon" :class="scope.row.class"></div>
                </s-col>
                <s-col span="20">
                  <div>{{scope.row.name}}</div>
                </s-col>
              </s-row>
            </template>
          </s-table-column>
          <s-table-column
            prop="version"
            label="工具版本号">
          </s-table-column>
          <s-table-column
            prop="type"
            label="支持协议"
            width="150">
          </s-table-column>
          <s-table-column
            label="下载"
            width="400">
            <template slot-scope="scope">
              <s-row type="flex" align="middle">
                <s-col span="2"><i v-if="!scope.row.desc" @click="toolDown(scope.row)" class="iconfont icon-download"></i></s-col>
                <s-col span="22">
                  <dl class="md-num">
                    <dt v-if="scope.row.desc" @click="oracleDown(scope.row)" style="cursor: pointer">{{scope.row.desc}}</dt>
                    <dt v-else>本地下载</dt>
                    <dd>{{scope.row.md5}}</dd>
                  </dl>
                </s-col>
              </s-row>
            </template>
          </s-table-column>
        </s-table>
      </s-scrollbar>
    </s-tab-pane>
  </s-tab>
</template>

<script>
  import {Download} from 'sunflower-common-utils'
  export default {
    props: {
      auditShow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        clientData: [
          {
            class: 'win',
            name: 'Windows',
            version: 'Windows XP/7/8/10',
            clientName: 'ssiclient.msi'
          },
          {
            class: 'mac',
            name: 'Mac OS',
            version: 'Mac OS 10.10/10.11.6',
            clientName: 'ssiclientEx.dmg'
          },
          {
            class: 'linux',
            name: 'Linux',
            version: 'CentOS 6.0',
            clientName: 'ssiclient.tar.gz'
          }],
        toolsData: [
          {
            class: 'chrome',
            name: 'Chrome',
            type: 'web',
            version: 'V57.0.2987.133',
            download: '0',
            md5: 'MD5:9D670F1BFEAFC47265F9D567509C2B58'
          },
          {
            class: 'firefox',
            name: 'Firefox',
            type: 'web',
            version: 'V3.10.2',
            download: '1',
            md5: 'MD5:DC2CDDE1EABAE25AF0A46A388963A3C5'
          },
          {
            class: 'IE',
            name: 'IE8',
            type: 'web',
            version: '64位',
            download: '2',
            md5: 'MD5:65D1450BFFC9DD13CBF0A736476FECB4'
          },
          {
            class: 'IE',
            name: 'IE9',
            type: 'web',
            version: '64位',
            download: '3',
            md5: 'MD5:8138B6C0F82333323B6A97A8CE3579C9'
          },
          {
            class: 'IE',
            name: 'IE10',
            type: 'web',
            version: '64位',
            download: '4',
            md5: 'MD5:90B654D9A97805DD77A2B5C5EBC92E18'
          },
          {
            class: 'IE',
            name: 'IE11',
            type: 'web',
            version: '64位',
            download: '5',
            md5: 'MD5:3C0260152686AEA9B361A105ECD18D7F'
          },
          {
            class: 'putty',
            name: 'Putty',
            type: 'SSH,TELNET',
            version: '——',
            download: '6',
            md5: 'MD5:AEB683DB8F1B7C79CA9CAE56C6AAC16F'
          },
          {
            class: 'SecureCRT',
            name: 'SecureCRT',
            type: 'SSH,TELNET',
            version: 'V8.0.4',
            download: '7',
            md5: 'MD5:F8AE853104F6CAB458A77B880B48993E'
          },
          {
            class: 'SecureNetTerm',
            name: 'SecureNetTerm',
            type: 'SSH,TELNET',
            version: 'V6.5.2.1',
            download: '8',
            md5: 'MD5:2AC16F213D5BBBA507DCBB66CCA6CC80'
          },
          {
            class: 'Xshell',
            name: 'Xshell',
            type: 'SSH,TELNET',
            version: 'V4.0.01',
            download: '9',
            md5: 'MD5:AB00F9E3863D50033AD8C7997D9C01E8'
          },
          {
            class: 'FileZilla',
            name: 'FileZilla',
            type: 'FTP,SFTP',
            version: 'V3.10.2',
            download: '10',
            md5: 'MD5:D537D8BA8C5E9E69B345AB9DC2001DC7'
          },
          {
            class: 'FlashFXP',
            name: 'FlashFXP',
            type: 'FTP,SFTP',
            version: 'V5.4.0.3970',
            download: '11',
            md5: 'MD5:8CD4B351244B15C40194185B2C804154'
          },
          {
            class: 'WinSCP',
            name: 'WinSCP',
            type: 'FTP,SFTP',
            version: 'V4.2.8.818',
            download: '12',
            md5: 'MD5:5A530DD83C2C0543059E5E72B59E0BE4'
          },
          {
            class: 'oracle',
            name: 'PLSQL',
            type: 'Oracle',
            version: 'V9',
            download: '13',
            md5: '',
            desc: '官方网站'
          },
          {
            class: 'WinSQL',
            name: 'WinSQL',
            type: 'Oracle，DB2，Informix，Sybase，SQL Server',
            version: 'V9.0.107.624',
            download: '14',
            md5: 'MD5:0F749D6CB60A4E8B8BAFE5550D1664B6'
          },
          {
            class: 'HeidiSQL',
            name: 'HeidiSQL',
            type: 'MySQL，SQL Server',
            version: 'V7.0.0.4051',
            download: '15',
            md5: 'MD5:9C3632925856FE0989C4499AAA5565E3'
          }]
      }
    },
    created () {
      console.log(this.auditShow);
    },
    methods: {
      clientDown(row) {
        Download(`/operationSettings/downLoadClientTool/${row.class}`, {
          logTemplate: '下载|工具下载>客户端下载(' + row.name + ')'
        })
      },
      oracleDown(row) {
        if (row.download === '13') {
          window.open('https://www.oracle.com/cn/downloads/index.html')
        }
      },
      toolDown(row) {
        if (row.download !== '13') {
          Download(`/operationSettings/downloadOperationTools/${row.download}`, {
            logTemplate: '下载|工具下载>运维工具下载(' + row.name + ')'
          })
        }
      }
    }
  }
</script>
