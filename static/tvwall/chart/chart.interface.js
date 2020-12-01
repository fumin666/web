define(function(require, exports, module) {
	require('./echarts-all');

	var themeConfig = require('./chart.theme');

	var ec_theme = themeConfig.getTheme();

	var echart = {};

	function getColor (params) {
		var chartColor;
		var value = params.data.value || params.data;
		if (value < 60)		{
			chartColor = '#16b69a';
		}		else if (value >= 60 && value < 90)		{
			chartColor = '#ffbd64';
		}		else if (value >= 90)		{
			chartColor = '#eb7d7e';
		}
		return chartColor;
	}
	function getReverseColor (params) {
		var chartColor;
		var value = params.data.value || params.data;
		if (value < 60)		{
			chartColor = '#eb7d7e';
		}		else if (value >= 60 && value < 90)		{
			chartColor = '#ffbd64';
		}		else if (value >= 90)		{
			chartColor = '#16b69a';
		}
		return chartColor;
	}
	function getColorList(xdata) {
		var colorList = [];
		for (var i = 0; i <= xdata.length - 1; i++) {
			switch (xdata[i]) {
				case '正常':colorList.push('#16b69a'); break;
				case '告警':colorList.push('#ffbd64'); break;
				case '异常':colorList.push('#eb7d7e'); break;
				case '严重':colorList.push('#eb7d7e'); break;
				case '主要':colorList.push('#cd6894'); break;
				case '次要':colorList.push('#724c7d'); break;
				case '警告':colorList.push('#ffbd64'); break;
				case '提示':colorList.push('#5ab1ef'); break;
				case '正常':colorList.push('#16b69a'); break;
				case '未知':colorList.push('#7b7e89'); break;
				case '警报':colorList.push('#e5cf0d'); break;
				case '致命':colorList.push('#d57deb'); break;
				case '错误':colorList.push('#eb7d7e'); break;
				case '信息':colorList.push('#9bcb62'); break;
				case '应急':colorList.push('#95706d'); break;
				case '诊断':colorList.push('#14B79B'); break;
			}
		}
		return colorList;
	}
	var colorStyle = {
		normal: {
			color: function(params) {
				return getReverseColor(params);
			},
			label: {
				show: true,
				position: 'center',
				formatter: '{b}',
				textStyle: {
					baseline: 'top',
					color: '#333333'
				}
			},
			labelLine: {
				show: false
			}
		}
	};
	var labelTop = {
		normal: {
			color: function(params) {
				return getColor(params);
			},
			label: {
				show: true,
				position: 'center',
				formatter: '{b}',
				textStyle: {
					baseline: 'top',
					color: '#333333'
				}
			},
			labelLine: {
				show: false
			}
		}
	};

	var labelFromatter = {
		normal: {
			label: {
				formatter: function (params) {
					if (params.value == 100.0) {
						return '无数据';
					} else {
	                	return (100 - params.value).toFixed(1) + '%';
					}
	            },
				textStyle: {
					baseline: 'bottom',
					color: '#333333'
				}
			}
		}
	};

	var labelBottom = {
		normal: {
			color: '#ccc',
			label: {
				show: true,
				position: 'center'
			},
			labelLine: {
				show: false
			}
		},
		emphasis: {
			color: 'rgba(0,0,0,0)'
		}
	};

	// 环形图表
	echart.ringChart = function(el, data, name, isReverseColor, config) {
			var isReverse = isReverseColor || 2;
			var style = (isReverse == 1) ? colorStyle : labelTop;
			var option = {
			    series: [
			        {
			            type: 'pie',
			            radius: ['60%', '80%'],
			            itemStyle: labelFromatter,
			            data: [
				            {name: '', value: (100 - parseFloat(data)).toFixed(1), itemStyle: labelBottom},
				            {name: (typeof name !== 'undefined') ? name : '', value: parseFloat(data), itemStyle: style}
			            ]
			        }
			    ]
			};

			if (typeof config !== 'undefined') {
				return createChart(el, $.extend(true, {}, option, config));
			} else {
				return createChart(el, option);
			}
	};

	// 三个环
	echart.ringCharts = function (el, dataAry, config) {
			var option = {
			    series: [
			        {
			            type: 'pie',
			            radius: ['50%', '65%'],
			            center: ['23%', '45%'],
			            itemStyle: labelFromatter,
			            data: [
				            {name: '', value: (100 - parseFloat(dataAry[0].value)).toFixed(1), itemStyle: labelBottom},
				            {name: (typeof dataAry[0].name !== 'undefined') ? dataAry[0].name : '', value: parseFloat(dataAry[0].value), itemStyle: labelTop}
			            ]
			        },
			        {
			            type: 'pie',
			            radius: ['75%', '90%'],
			            center: ['50%', '50%'],
			            itemStyle: labelFromatter,
			            data: [
				            {name: '', value: (100 - parseFloat(dataAry[1].value)).toFixed(1), itemStyle: labelBottom},
				            {name: (typeof dataAry[1].name !== 'undefined') ? dataAry[1].name : '', value: parseFloat(dataAry[1].value), itemStyle: labelTop}
			            ]
			        },
			        {
			            type: 'pie',
			            radius: ['50%', '65%'],
			            center: ['77%', '45%'],
			            itemStyle: labelFromatter,
			            data: [
				            {name: '', value: (100 - parseFloat(dataAry[2].value)).toFixed(1), itemStyle: labelBottom},
				            {name: (typeof dataAry[2].name !== 'undefined') ? dataAry[2].name : '', value: parseFloat(dataAry[2].value), itemStyle: labelTop}
			            ]
			        }
			    ]
			};

			if (typeof config !== 'undefined') {
				return createChart(el, $.extend(true, {}, option, config));
			} else {
				return createChart(el, option);
			}
	};
	// 三个一样的环图
	echart.ringSameCharts = function (el, dataAry, config) {
			var option = {
				 legend: {
					        x: 'center',
					        y: 'bottom',
					        data: [
					            dataAry[0].name, dataAry[1].name, dataAry[2].name
					        ]
					    },
			    series: [
			        {
			            type: 'pie',
			            radius: ['40%', '55%'],
			            center: ['15%', '40%'],
			            itemStyle: labelFromatter,
			            data: [
				            {name: '', value: (100 - parseFloat(dataAry[0].value)).toFixed(1), itemStyle: labelBottom},
				            {name: (typeof dataAry[0].name !== 'undefined') ? dataAry[0].name : '', value: parseFloat(dataAry[0].value), itemStyle: labelTop}
			            ]
			        },
			        {
			            type: 'pie',
			            radius: ['40%', '55%'],
			            center: ['50%', '40%'],
			            itemStyle: labelFromatter,
			            data: [
				            {name: '', value: (100 - parseFloat(dataAry[1].value)).toFixed(1), itemStyle: labelBottom},
				            {name: (typeof dataAry[1].name !== 'undefined') ? dataAry[1].name : '', value: parseFloat(dataAry[1].value), itemStyle: labelTop}
			            ]
			        },
			        {
			            type: 'pie',
			            radius: ['40%', '55%'],
			            center: ['85%', '40%'],
			            itemStyle: labelFromatter,
			            data: [
				            {name: '', value: (100 - parseFloat(dataAry[2].value)).toFixed(1), itemStyle: labelBottom},
				            {name: (typeof dataAry[2].name !== 'undefined') ? dataAry[2].name : '', value: parseFloat(dataAry[2].value), itemStyle: labelTop}
			            ]
			        }
			    ]
			};

			if (typeof config !== 'undefined') {
				return createChart(el, $.extend(true, {}, option, config));
			} else {
				return createChart(el, option);
			}
	};

	// 统计环图
	echart.statRingChart = function (el, data, config) {
		 var legend = filterData(data, 'name');
		 var colorList = getColorList(legend);
		 var option = {
		 		color: colorList,
			    tooltip: {
			        trigger: 'item',
			        formatter: '{b} : {c} ({d}%)'
			    },
			    legend: {
			        y: 'bottom',
			      	x: 'center',
			        data: filterData(data, 'name')
			    },
			    calculable: true,
			    series: [
			        {
			            type: 'pie',
			            radius: ['40%', '55%'],
			            itemStyle: {
			                normal: {
			                    label: {
			                        show: false
			                    },
			                    labelLine: {
			                        show: false
			                    }
			                },
			                emphasis: {
			                    label: {
			                        show: true,
			                        position: 'center',
			                        textStyle: {
			                            fontSize: '25',
			                            fontWeight: 'bold'
			                        }
			                    }
			                }
			            },
			            data: data
			        }
			    ]
		};

		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};

	function filterData(data, key) {
		var dataAry = [];
		for (var i = 0, l = data.length; i < l; i++) {
			dataAry.push(data[i][key]);
		}
		return dataAry;
	}

	// 饼图
	echart.pieChart = function(el, data, title, config) {
		var option = {
			    title: {
			        text: (typeof title !== 'undefined') ? title : '',
			        x: 'center'
			    },
			    tooltip: {
			        trigger: 'item',
			        formatter: '{b} : {c} ({d}%)'
			    },
			    legend: {
			        orient: 'vertical',
			        x: 'right',
			        data: filterData(data, 'name')
			    },
			    calculable: true,
			    series: [
			        {
			            type: 'pie',
			            radius: '50%',
			            data: data
			        }
			    ]
		};

		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};

	function createChart(el, option) {
		var chart = echarts.init(document.getElementById(el), ec_theme);
		chart.setOption(option);
		$(window).bind('resize.charts', function() {
			chart.resize();
		});
		return chart;
	}

	// 通过el和配置建立图表
	echart.createChart = createChart;

	// 仪表盘
	echart.gaugeChart = function(el, data, title, config) {
		var formatter = '{c}%';
		if (typeof title !== 'undefined') {
			formatter = '{b} : {c}%';
		}
		var option = {
			    tooltip: {
			        formatter: formatter,
			        zlevel: 2
			    },
			    series: [
			        {
			            name: '',
			            type: 'gauge',
			            splitNumber: 10,       // 分割段数，默认为5
			            axisLine: {            // 坐标轴线
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    width: 8,
			                    color: [[0.6, '#16b69a'], [0.9, '#ffbd64'], [1, '#eb7d7e']]
			                }
			            },
			            axisTick: {            // 坐标轴小标记
			                splitNumber: 10,   // 每份split细分多少段
			                length: 12,        // 属性length控制线长
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    color: 'auto'
			                }
			            },
			            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    color: 'auto'
			                }
			            },
			            splitLine: {           // 分隔线
			                show: true,        // 默认显示，属性show控制显示与否
			                length: 30,         // 属性length控制线长
			                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
			                    color: 'auto'
			                }
			            },
			            pointer: {
			                width: 5
			            },
			            title: {
			                show: true,
			                offsetCenter: [0, '-40%'],       // x, y，单位px
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    fontWeight: 'bolder'
			                }
			            },
			            detail: {
			                formatter: '{value}%',
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    color: 'auto',
			                    fontWeight: 'bolder'
			                }
			            },
			            data: [{value: data, name: (typeof title !== 'undefined') ? title : ''}]
			        }
			    ]
			};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};
	echart.newgaugeChart = function(el, data, title, config) {
		var formatter = '{c}%';
		if (typeof title !== 'undefined') {
			formatter = '{b} : {c}%';
		}
		var option = {
			    tooltip: {
			        formatter: formatter,
			        zlevel: 2
			    },
			    series: [
			        {
			            name: '',
			            type: 'gauge',
			            splitNumber: 10,       // 分割段数，默认为5
			            axisLine: {            // 坐标轴线
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    width: 16
			                }
			            },
			            axisTick: {            // 坐标轴小标记
			                splitNumber: 10,   // 每份split细分多少段
			                length: 12,        // 属性length控制线长
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    color: 'auto'
			                }
			            },
			            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
			            	show: true,
			                formatter: function(v) {
			                    switch (v + '') {
			                        case '0': return '0';
			                        case '20': return '20';
			                        case '40': return '40';
			                        case '60': return '60';
			                        case '80': return '80';
			                        case '100': return '100';
			                        default: return '';
			                    }
			                },
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    color: 'auto'
			                }
			            },
			            splitLine: {           // 分隔线
			                show: true,        // 默认显示，属性show控制显示与否
			                length: 22,         // 属性length控制线长
			                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
			                    color: 'auto'
			                }
			            },
			            pointer: {
			                width: 5
			            },
			            title: {
			                show: true,
			                offsetCenter: [0, '-30%'],       // x, y，单位px
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    fontWeight: 'bolder'
			                }
			            },
			            detail: {
			                formatter: '{value}%',
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    color: 'auto',
			                    fontWeight: 'bolder'
			                }
			            },
			            data: [{value: data, name: (typeof title !== 'undefined') ? title : ''}]
			        }
			    ]
			};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	}

	// 状态仪表盘
	echart.statusChart = function(el, data, title, config) {
		var formatter = '{c}%';
		if (typeof title !== 'undefined') {
			formatter = '{b} : {c}%';
		};
		var option = {
			    tooltip: {
			        formatter: formatter
			    },
			    series: [
			        {
			            name: '',
			            type: 'gauge',
			            startAngle: 180,
			            endAngle: 0,
			            center: ['50%', '90%'],    // 默认全局居中
			            radius: 120,
			            splitLine: {
			            	show: false
			            },
			            axisLine: {            // 坐标轴线
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    width: 80,
			                    color: [[0.6, '#16b69a'], [0.9, '#ffbd64'], [1, '#eb7d7e']]
			                }
			            },
			            axisTick: {            // 坐标轴小标记
			            	show: false
			            },
			            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
			            	margin: 2,
			                formatter: function(v) {
			                    switch (v + '') {
			                        case '10': return '低';
			                        case '50': return '中';
			                        case '90': return '高';
			                        default: return '';
			                    }
			                },
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    color: '#fff',
			                    fontSize: 15,
			                    fontWeight: 'bolder'
			                }
			            },
			            pointer: {
			                width: 20,
			                length: '90%',
			                color: 'rgba(255, 255, 255, 0.8)'
			            },
			            title: {
			                show: true,
			                offsetCenter: [0, '-45%'],       // x, y，单位px
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    color: '#fff',
			                    fontSize: 18,
			                    fontWeight: 'bolder'
			                }
			            },
			            detail: {
			                show: true,
			                backgroundColor: 'rgba(0,0,0,0)',
			                borderWidth: 0,
			                borderColor: '#ccc',
			                width: 100,
			                height: 40,
			                offsetCenter: [0, -30],       // x, y，单位px
			                formatter: '{value}%',
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    fontSize: 15
			                }
			            },
			            data: [{value: data, name: (typeof title !== 'undefined') ? title : ''}]
			        }
			    ]
			};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};

	function filterBarData(data) {
		var returnAry = [[], [], []];
		var filterData = null;
		for (var i = 0, l = data.length; i < l; i++) {
			filterData = parseFloat(data[i].toFixed(2));
			returnAry[0].push(filterData);
			returnAry[1].push(100 - filterData);
			returnAry[2].push('');
		}
		return returnAry;
	}

	// 百分比柱图
	echart.percentBarChart = function(el, data, title, show, position, wid, config) {
		var filterData = filterBarData(data);
		var positionArr = position || null;
		var bWid = wid || null;
		var orShow
		show == 1 ? orShow = false : orShow = true
		var option = {
			    tooltip: {
			        trigger: 'axis'
			    },
			    calculable: true,
			    xAxis: [
			        {
			        	show: orShow,
			            type: 'category',
			            data: filterData[2]
			        }
			    ],
			    yAxis: [
			        {
			        	show: orShow,
			            type: 'value',
			            axisLabel: {
			                  show: true,
			                  interval: 'auto',
			                  formatter: '{value} %'
			                }
			        }
			    ],
			    grid: { // 控制图的大小，调整下面这些值就可以，
		            x: 40,
		            y: 10,
		            x2: 5,
		            y2: 5 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
		        },
			 	tooltip: {
			 		position: positionArr,
			        trigger: 'axis',
			        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        },
			        formatter: function (params) {
			            var tar = params[1];
			            var returnStr = tar.value + '%';
			            if (typeof tar.seriesName !== '') {
			            	returnStr = tar.seriesName + ' : ' + tar.value + '%';
			            }
			            return returnStr;
			        }
			    },
			    series: [
			        {
			            name: (typeof title !== 'undefined') ? title : '',
			            type: 'bar',
			            stack: 'total',
			            barWidth: bWid,
			            itemStyle: {normal: {
			              	color: function(params) {
			                  	return getColor(params);
			                },
			            	label: {show: true, position: 'inside', formatter: '{c} %'
			             }
			        }},
			            data: filterData[0]
			        },
			      	{
			            name: '',
			            type: 'bar',
			            stack: 'total',
			            itemStyle: {
			                normal: {
			                    barBorderColor: 'rgba(0,0,0,0)',
			                    color: 'rgba(0,0,0,0)'
			                },
			                emphasis: {
			                    barBorderColor: 'rgba(0,0,0,0)',
			                    color: 'rgba(0,0,0,0)'
			                }
			            },
			            data: filterData[1]
			        }
			    ]
			};
			if (typeof config !== 'undefined') {
				return createChart(el, $.extend(true, {}, option, config));
			} else {
				return createChart(el, option);
			}
	};

	// 彩虹柱图
	echart.rainbowBarChart = function(el, data, config) {
		var option = {
			    tooltip: {
			        trigger: 'item'
			    },
			    calculable: true,
			    grid: {
			        borderWidth: 0,
			        y: 30,
			        x: 10,
			        x2: 10,
			        y2: 30
			    },
			    xAxis: [
			        {
			            type: 'category',
			            show: true,
			            data: filterData(data, 'name'),
			            axisLine: {
			            	lineStyle: {
			            		color: '#fff'
			            	}
			            },
			            axisTick: {
			            	show: false
			            },
			            splitLine: {
			            	lineStyle: {
			            		color: '#fff'
			            	}
			            }
			        }
			    ],
			    yAxis: [
			        {
			            type: 'value',
			            show: false
			        }
			    ],
				noDataLoadingOption: {
					text: '暂无数据',
					effect: 'whirling'
				},
			    series: [
			        {
			            type: 'bar',
			            itemStyle: {
			                normal: {
			                    color: function(params) {
			                        var colorList = [
			                          '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
			                           '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
			                           '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
			                        ];
			                        return colorList[params.dataIndex];
			                    },
			                    label: {
			                        show: true,
			                        position: 'top',
			                        formatter: '{c}'
			                    }
			                }
			            },
			            data: filterData(data, 'value')
			        }
			    ]
			};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};

	// 过滤多数据图表数据
	function filterMultiChartData(data, keyword) {
		var returnObj = {
			legend: [],
			xAxis: [],
			seriesData: {}
		};
		if (data.length > 0) {
			// 根据一条数据过滤出legend
			for (var key in data[0]) {
				if (key !== keyword) {
					returnObj.legend.push(key);
					returnObj.seriesData[key] = [];
				}
			}
			for (var i = 0, l = data.length; i < l; i++) {
				returnObj.xAxis.push(data[i][keyword]);
				for (var j = 0, ll = returnObj.legend.length; j < ll; j++) {
					var k = returnObj.legend[j];
					returnObj.seriesData[k].push(data[i][k]);
				}
			}
			return returnObj;
		} else {
			throw new Error('MultiChartData data.length is 0!');
		}
	}

	// 计算面积数据的series
	function getAreaChartSeries(legend, seriesData) {
		var series = [];
		for (var i = 0, l = legend.length; i < l; i++) {
			var key = legend[i];
			series.push({
	            name: key,
	            type: 'line',
	            smooth: true,
	            symbol: 'none',
	            itemStyle: {normal: {areaStyle: {type: 'default'}}},
	            data: seriesData[key]
			});
		}
		return series;
	}

	// 面积图
	echart.areaChart = function(el, data, unit, config) {
		var aData = data.data || data;
		var units = unit || '';
		var fData = filterMultiChartData(aData, 'date');
		var option = {
			    tooltip: {
			        trigger: 'axis',
					formatter: function(params) {
							var content = '';
							for (var i = 0; i <= params.length - 1; i++) {
								content += '<br\>' + params[i].seriesName + ':' + params[i].data + units;
							}

					       return params[0].name + content;
					   }
			    },
			    legend: {
			      	x: 'right',
			        data: fData.legend
			    },
			    calculable: true,
			    xAxis: [
			        {
			            type: 'category',
			            boundaryGap: false,
			            data: fData.xAxis
			        }
			    ],
			    yAxis: [
			        {
			            type: 'value'
			        }
			    ],
			    series: getAreaChartSeries(fData.legend, fData.seriesData)
		};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};
	// 过滤数据得到Y轴
	function filterChartYData(data, keyword, keyword1) {
		var returnObj = {
			yAry: {},
			xyData: {},
			splitNum: 0
		};
		// 得到Y轴和匹配对象
		var mapObj = {};
		if (data[keyword].length > 0) {
			var relation = data[keyword];
			var counter = 0;
			for (var i in relation) {
				for (var j in relation[i]) {
				mapObj[parseInt(i) + 1] = parseInt(j);
				returnObj.yAry[parseInt(i) + 1] = relation[i][j];
				}
				counter++;
			}
			returnObj.splitNum = counter;
		// 构建新的data
		var xdata = data[keyword1];
		for (var x in mapObj) {
             	for (var y in xdata) {
				if (xdata[y].value === mapObj[x]) {
					xdata[y].value = x;
				}
        	}
		}
     	returnObj.xyData = xdata;
			return returnObj;
		} else {
			throw new Error('MultiChartData data.length is 0!');
		}
	}
	// 面积y轴文字图
	echart.areaWordChart = function(el, data, name, config) {
		var fData = filterChartYData(data, 'relation', 'data');
		var yAry = fData.yAry;
		var aData = filterMultiChartData(fData.xyData, 'date');
		var option = {
				  legend: {
				        data: [name],
				        x: 'right'
				   },
				   tooltip: {
				        trigger: 'axis',
				        formatter: function(params) {
					       return params[0].seriesName + '<br\>' + params[0].name + ':' + yAry[params[0].value];
					    }
				   },
				   xAxis: [
				       {
				           type: 'category',
				           splitLine: {show: true},
				           data: aData.xAxis
				       }
				   ],
				   yAxis: [
				       {
				           type: 'value',
				           splitNumber: fData.splitNum,
				           axisLabel: {
				                    show: true,
				                    interval: 'auto',
				                    formatter: function (params) {
				                          return yAry[params];
				                    }
				          }
				       }
				   ],
				   calculable: false,

				   series: [
				       {
				           name: name,
				           type: 'line',
				           smooth: true,
				           symbol: 'none',
	            		   itemStyle: {normal: {areaStyle: {type: 'default'}}},
				           data: filterData(fData.xyData, 'value')
				       }
				   ]
				};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};

	function getColorFulBarSeries(data) {
		var seriesData = [];
		var seriesItemObj = {};
		var itemDataAry = [];
		for (var k = 0; k < data.length; k++) {
			itemDataAry.push(0);
		}
		for (var i = 0, l = data.length; i < l; i++) {
			seriesItemObj = {};
			seriesItemObj.name = data[i].name;
			seriesItemObj.type = 'bar';
			seriesItemObj.stack = 'stack';
			// 深拷贝
			seriesItemObj.data = itemDataAry.slice(0);
			seriesItemObj.data[i] = data[i].value;
			seriesItemObj.itemStyle = {
	                normal: {
	                    label: {
	                        show: true,
	                        position: 'top',
	                        formatter: function(params) {
	                        	if (params.name === params.seriesName) {
	                        		return params.value;
	                        	}
	                        }
	                    }
	                }
	        };
			seriesData.push(seriesItemObj);
		}
		return seriesData;
	}

	// 多彩柱图（主要问题在于图例）
	echart.colorfulBarChart = function(el, data, config) {
		var legend = filterData(data, 'name');
		var colorList = getColorList(legend);
		var option = {
				color: colorList,
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        },
			        formatter: function(params, axisStr) {
			        	var index = params.length - 1 - axisStr.split(':')[1];
			        	return params[index].seriesName + ':' + params[index].value;
			        }
			    },
			    legend: {
			      	x: 'right',
			      	orient: 'vertical',
			        data: legend
			    },
			    calculable: true,
			    xAxis: [
			        {
			            type: 'category',
			            splitLine: {show: false},
			            data: legend
			        }
			    ],
			    yAxis: [
			        {
			            type: 'value'
			        }
			    ],
			    series: getColorFulBarSeries(data)
		};
		if (config && config.legend.data) { // 数组不使用深层合并，直接替换掉
			delete option.legend.data;
		}
		if (config && config.series) {
			delete option.series;
		}
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};

	// 计算面积数据的series
	function getStackBarChartSeries(legend, seriesData, yon) {
		var series = [];
		for (var i = 0, l = legend.length; i < l; i++) {
			var key = legend[i];
			var positionStr = '';
			if (yon) {
			  positionStr = 'top';
			} else {
			  positionStr = (i == (l - 1)) ? 'top' : 'insideTop';
			}
			series.push({
	            name: key,
	            type: 'bar',
	            stack: yon ? '' : 'stack',
	            itemStyle: {
	                normal: {
	                    label: {
	                        show: true,
	                        position: positionStr,
							formatter: function(params) {
								if (params.value == 0) {
									return false;
								} else {
									return params.value;
								}
							}
	                    }
	                }
	            },
	            data: seriesData[key]
			});
		}
		return series;
	}
	// IP网段
	echart.stackIpBarChart = function(el, data, config, yon) {
		var fData = filterMultiChartData(data, 'stack');
		var option = {
			color: ['#028003', '#FFA400', '#DB5049', '#FF8463', '#F89F5D', '#FAD85F', '#3185C6', '#9BCA62', '#61C0DE', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				borderWidth: 0,
				y: 60,
				x: 80,
				x2: 80,
				y2: 60
			},
			legend: {
				x: 'center',
				data: fData.legend
			},
			xAxis: [
				{
					type: 'category',
					axisLabel: {
						interval: 0,
						rotate: 15,
						margin: 0,
						textStyle: {
							fontSize: 10,
							fontWeight: 'lighter',
							align: 'left'
						}
					},
					data: fData.xAxis
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: getStackBarChartSeries(fData.legend, fData.seriesData, yon)
		};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};
	// 堆积柱图
	echart.stackBarChart = function(el, data, config, yon) {
		var fData = filterMultiChartData(data, 'stack');
		var option = {
				color: ['#028003', '#FFA400', '#DB5049', '#FF8463', '#F89F5D', '#FAD85F', '#3185C6', '#9BCA62', '#61C0DE', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0'],
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    legend: {
			    	x: 'center',
			        data: fData.legend
			    },
			    xAxis: [
			        {
			            type: 'category',
			            axisLabel: {
			                interval: 0
			            },
			            data: fData.xAxis
			        }
			    ],
			    yAxis: [
			        {
			            type: 'value'
			        }
			    ],
			    series: getStackBarChartSeries(fData.legend, fData.seriesData, yon)
		};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};
	// 计算多维图数据的series
	function getMultiBarChartSeries(legend, seriesData) {
		var series = [];
		var seriesArr = [];
		var placeHoledStyle = {
		    normal: {
		        barBorderColor: 'rgba(0,0,0,0)',
		        color: 'rgba(0,0,0,0)'
		    },
		    emphasis: {
		        barBorderColor: 'rgba(0,0,0,0)',
		        color: 'rgba(0,0,0,0)'
		    }
		};
		var dataStyle = {
		    normal: {
		    	barBorderRadius: 3,
		        label: {
		            show: true,
		            position: 'insideLeft',
					textStyle: {color: '#000'},
		            formatter: '{c}%'
		        }
		    }
		};
		for (var i = 0, l = legend.length; i < l; i++) {
			/* seriesArr.splice(0,seriesArr.length); */
			var key = legend[i];
			var arr = seriesData[key];
			var midArr = [];
			for (j = 0; j < arr.length; j++) {
				midArr.push(100 - arr[j]);
			}
			seriesArr.push(midArr);
			series.push({
	            name: key,
	            type: 'bar',
	            stack: 'stack',
	            itemStyle: dataStyle,
	            data: seriesData[key]
			}, {
	            name: key,
	            type: 'bar',
	            stack: 'stack',
	            itemStyle: placeHoledStyle,
	            data: seriesArr[i]
			});
		}
		return series;
	}
	// 横向多维柱状图
	echart.multiBarChart = function(el, data, config) {
		var fData = filterMultiChartData(data, 'name');
		var fObj = fData.seriesData;
		var counter = 0;
		var colorList = getColorList(fData.legend);
		for (var key in fObj) { counter++ }
		var legendData = [];
		for (var i in fObj) {
			legendData.push(i);
		}
		option = {
			color: colorList,
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'shadow'
		        },
		        formatter: '{b}<br/>{a0}:{c0}%<br/>{a2}:{c2}%<br/>{a4}:{c4}%'
		    },
		    legend: {
		        x: 'right',
		        y: 'top',
		        data: legendData
		    },
		     grid: { // 控制图的大小，调整下面这些值就可以，
		            x: 60,
		            y: 30,
		            x2: 5,
		            y2: 5 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
		        },
		    xAxis: [
		        {
		            type: 'value',
		            position: 'top',
		            splitNumber: counter,
		            splitLine: {show: false},
		            axisLabel: {show: false}
		        }
		    ],
		    yAxis: [
		        {
		            type: 'category',
		            splitLine: {show: false},
		            data: fData.xAxis
		        }
		    ],
		    series: getMultiBarChartSeries(fData.legend, fData.seriesData)
		};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};
	// 百分比层叠表
	echart.stackChart = function(el, data, units, config) {
		var unit = units || 'GB';
		var xyData = filterData(data, 'use');
		var option = {
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        },
			        formatter: function (params) {
            			for (var i = 0, l = option.xAxis[0].data.length; i < l; i++) {
            				if (option.xAxis[0].data[i] == params[0].name) {
            					if (option.series[0].data[i] == '-') {
            						option.series[0].data[i] = 0
            					}
            					if (option.series[1].data[i] == '-') {
            						option.series[1].data[i] = 0
            					}
	                         return '内存使用率' + '</br>' +
	                         		option.series[0].name + ':' + (option.series[0].data[i]).toFixed(2) + unit + '</br>' +
	                         		'剩余' + ':' + parseFloat(option.series[1].data[i] - option.series[0].data[i]).toFixed(2) + unit + '</br>' +
	                         		option.series[1].name + ':' + parseFloat(option.series[1].data[i]).toFixed(2) + unit;
        				}
        			}
      			  }
			    },
				noDataLoadingOption: {
					text: '暂无数据',
					effect: 'whirling'
				},
			    grid: { // 控制图的大小，调整下面这些值就可以，
			    	borderWidth: 0,
		            x: 70,
		            y: 30,
		            x2: 5,
		            y2: 5 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
		        },
			    xAxis: [
							{
								show: true,
					            type: 'category',
					            data: xyData
				        	},
					        {
					            type: 'category',
					            axisLine: {show: false},
					            axisTick: {show: false},
					            axisLabel: {show: false},
					            splitArea: {show: false},
					            splitLine: {
					            	lineStyle: {
					            		color: '#fff'
					            	}
			            		},
					            data: xyData
					        }
						],
			    yAxis: [
			        {
			           		type: 'value',
           					axisLabel: {formatter: '{value}' + unit},
           					splitNumber: 4,
           					axisLine: {show: true},
           					splitArea: {show: false},
           					splitLine: {show: false}
			        }
			    ],
			    series: [
							    {
							        name: '已使用',
							        type: 'bar',
							        itemStyle:
							        	{	emphasis: {
							        			borderColor: '#000000',
							        			color: 'rgba(255,255,255,0.1)'
							       				},
							        		normal: {
							        			color: function (params) {
							        				for (var i = 0, l = option.xAxis[0].data.length; i < l; i++) {
								                          if (option.series[0].data[i] == params.data) {
								                                if (Math.round((params.data / option.series[1].data[i]) * 100) <= 90 && Math.round((params.data / option.series[1].data[i]) * 100) >= 60) {
								                                	return 'rgba(255,189,100,1)';
								                                } else if (Math.round((params.data / option.series[1].data[i]) * 100) >= 90) {
								                                	return 'rgba(235,125,126,1)';
								                                } else {
								                                	return 'rgba(22,182,154,1)';
								                                }
								                          }
								            		}
							        			},
							        			barBorderColor: '#ffffff',
							                	barBorderWidth: 0,
							                	barBorderRadius: 1,
										        label: {
										        	show: true,
										        	formatter: function (params) {
							            				for (var i = 0, l = option.xAxis[1].data.length; i < l; i++) {
									                          if (option.xAxis[1].data[i] == params.name) {
									                                return Math.round((params.value / option.series[1].data[i]) * 100) + '%';
									                          }
							            				}
			      			  						},
			      			  						position: 'insideTop',
			      			  						textStyle: {color: '#000'}
			      			  					}
      			  					}},
							        data: filterData(data, 'use')
							    },
							    {
							        name: '总量',
							        type: 'bar',
							        xAxisIndex: 1,
							        itemStyle: {
							        	emphasis: {
							        			borderColor: '#000000',
							        			color: 'rgba(255,255,255,0.1)'
							       				},
							        	normal: {
							        			barBorderColor: '#dddddd',
							                	barBorderWidth: 2,
							                	barBorderRadius: 4,
							                	color: 'rgba(255,255,255,0.5)',
							                	label: {show: true,
formatter: function(p) {
							                		return '总量:' + p.value;
							                	},
textStyle: {color: '#000'}}}},
							        data: filterData(data, 'sum')
							    }
    					  ]
		};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};
	// 多重折线图UUID显示类型
	function getMultiLineChartSeries(legend, seriesData) {
		var series = [];
		for (var i = 0, l = legend.length; i < l; i++) {
			var key = legend[i];
			series.push({
				name: key,
				type: 'line',
				data: seriesData[key]
			});
		}
		return series;
	}
	echart.multilineChart = function(el, data, name, unit, config) {
		var units = unit || '';
		var aData = data.data || data;
		var fData = filterMultiChartData(aData, 'date');
		var option = {
			tooltip: {
				trigger: 'axis',
				formatter: function (params) {
					var list = ''
					for (var i = 0; i < params.length; i++) {
						var name = params[0].name
						list += params[i].seriesName + ':' + params[i].value + units + '<br/>'
					}
					return name + '的可用率' + '<br/>' + list
				}
			},
			legend: {
				data: fData.legend,
				x: 'right'
			},
			xAxis: [
				{
					type: 'category',
					boundaryGap: true,
					splitLine: {show: false},
					data: fData.xAxis
				}
			],
			yAxis: [
				{
					type: 'value',
					axisLabel: {formatter: '{value}' + units}
				}
			],
			series: getMultiLineChartSeries(fData.legend, fData.seriesData)
		};

		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};
	// 折线图表
	echart.lineChart = function(el, data, name, unit, config) {
		var units = unit || '';
		var option = {
			    tooltip: {
			        trigger: 'axis',
					formatter: '{b}' + '<br/>' + '{a}:' + '{c}' + units
			    },
			    legend: {
			        data: [name],
			      	x: 'right'
			    },
			    // calculable : true,
			    xAxis: [
			        {
			            type: 'category',
			            boundaryGap: true,
			            splitLine: {show: false},
			            data: filterData(data, 'name')
			        }
			    ],
			    yAxis: [
			        {
			            type: 'value',
						axisLabel: {formatter: '{value}' + units}
			        }
			    ],
			    series: [
			        {
			            name: name,
			            type: 'line',
			            data: filterData(data, 'value')
			        }
			    ]
		};

		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};
	// 设备状态线
	echart.statusLineChart = function(el, data, name, config) {
		var yAry = {'1': '未知', '2': '正常', '4': '异常'};
		var option = {
				  legend: {
				        data: [name],
				        x: 'right'
				   },
				   tooltip: {
				        trigger: 'axis',
				        formatter: function(params) {
					       return params[0].seriesName + '<br\>' + params[0].name + ':' + yAry[params[0].value];
					    }
				   },
				   xAxis: [
				       {
				           type: 'category',
				           splitLine: {show: true},
				           data: filterData(data, 'name')
				       }
				   ],
				   yAxis: [
				       {
				           type: 'log',
				           axisLabel: {
				                    show: true,
				                    interval: 'auto',
				                    formatter: function (params) {
				                          return yAry[params];
				                    }
				          }
				       }
				   ],
				   calculable: false,
				   series: [
				       {
				           name: name,
				           type: 'line',
				           data: filterData(data, 'value')
				       },
				      {
				           name: '辅助',
				           type: 'line',
				           itemStyle: {
				                            normal: {
				                                barBorderColor: 'rgba(0,0,0,0)',
				                                color: 'rgba(0,0,0,0)'
				                            },
				                            emphasis: {
				                                barBorderColor: 'rgba(0,0,0,0)',
				                                color: 'rgba(0,0,0,0)'
				                            }
				            },
				           data: [1, 2, 4]
				      }
				   ]
				};
		if (typeof config !== 'undefined') {
			return createChart(el, $.extend(true, {}, option, config));
		} else {
			return createChart(el, option);
		}
	};

	echart.getChartColorList = getColorList;

	module.exports = echart;

 	if (typeof (furnace) !== 'undefined') {
 		furnace.clone(echart);
 	}
});
