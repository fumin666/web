<template>
    <s-chart :chart="chart"></s-chart>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array
      },
      title: {
        type: String
      },
      titleSize: {
        type: Number
      },
      width: {
        type: String
      },
      height: {
        type: String
      },
      borderWidth: {
        type: Number
      },
      color: {
        type: Array
      },
      name: {
        type: String
      },
      showLabel: {
        type: Boolean,
        default: false
      }
    },
    created() {
      if (this.$store.state.theme !== window.localStorage.theme) {
        this.$store.commit('setTheme', window.localStorage.theme || 'fanta');
      }
    },
    computed: {
      chart() {
        let obj = {
          name: this.name,
          type: 'pieChart',
          width: this.width || '100%',
          height: this.height || '300px',
          data: this.data,
          option: {
            legend: {
              textStyle: {
                color: this.$store.getters.theme.color
              }
            },
            title: {
              text: this.title || '',
              textStyle: {
                align: 'left',
                color: this.$store.getters.theme.color,
                fontSize: this.titleSize || 18
              },
              top: '3%',
              left: '3%'
            },
            series: [{
              itemStyle: {
                normal: {
                    borderWidth: this.borderWidth || 0,
                    borderColor: this.$store.getters.theme.background
                },
                emphasis: {
                    borderWidth: 0,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                  normal: {
                    show: this.showLabel,
                      formatter: ['{b|{b}}', '{c|{c}}'].join('\n'),
                      rich: {
                          c: {
                              color: this.$store.getters.theme.color,
                              fontSize: 18,
                              fontWeight: 'bold',
                              lineHeight: 5
                          },
                          b: {
                              color: this.$store.getters.theme.color,
                              fontSize: 15,
                              height: 40
                          }
                      }
                  }
              },
              labelLine: {
                  normal: {
                    show: this.showLabel
                  }
              }
            }]
          }
        }
        if (this.color) {
          obj.option.color = this.color
        }
        return obj;
      }
    }
  }
</script>