import React, { Component } from 'react';
import get from 'lodash/get';
import { Tabs } from 'antd';
import Echart from 'echarts';
import parkList from '../resource/data/parkRealData.js';
import parkOrderList from '../resource/data/parkOrderList.js';
import orderList from '../resource/data/orderList.js';
import swallowList from '../resource/data/swallow.js';
import useRateList from '../resource/data/useRateList.js';
import './bottomContent.css';

class LeftContent extends Component {

  state = {};
  
  componentDidMount() {
    this.renderEscapeChart([1700, 800, 600, 1300, 1900, 1400], [950, 500, 1100, 1000, 500, 1000]);
    const data = [820, 932, 780, 934, 1290, 900];
    this.renderInOutChart(data);
    this.renderUseRateChart(58);
    this.renderSwallowChart(64);
    const orderData = [80, 98, 78, 98, 88, 94, 90, 75, 120, 130, 160, 110, 123, 115];
    this.renderOrderChart(orderData);
  }

  /**
    逃逸率
   */
  renderEscapeChart = (data1, data2, time) => {
  
    const escape = Echart.init(document.getElementById('escape-chart'), 'customed');
    escape.setOption({
      title: {
        show: false,
      },
      
      tooltip: {
        backgroundColor:'rgba(229,182,106, 0.9)',
        borderColor: 'rgba(229,182,106, 0.9)',
        textStyle: {
          fontSize: 14,
          color: '#FFFFFF',
        },
        padding: [2, 5, 2, 5],
        formatter: '{c}',
      },
      xAxis: {
        data: time/* ['17时', '18时', '19时', '20时', '21时', '22时'] */,
      },
      grid: {
        left: 0,
        top: 10,
        bottom: 0,
        right: 0,
        containLabel: true,
        show: false,
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 2,
        interval: 0.5,
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: '销量1',
          type: 'bar',
          data: data1,
          barWidth: 13,
          barCategoryGap: 1,
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
        },
        {
          name: '销量2',
          type: 'bar',
          data: data2,
          barGap: '1%',
          barWidth: 13,
          barCategoryGap: 1,
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
        },
      ]
    });
    this.escape = escape;
  };

  // 吞吐量
  renderInOutChart = (data, time) => {
    const inOut = Echart.init(document.getElementById('in-out-chart'), 'customed');
    var sum=0;
    for(var i = 0; i < data.length; i++){
      sum += data[i];
    }
    var mean  = sum / data.length;
    const dataBig = data.map((i) => i + parseInt(mean * 0.2));
    inOut.setOption({
      title: {
        show: false,
      },
      tooltip: {
        backgroundColor:'rgba(229,182,106, 0.9)',
        borderColor: 'rgba(229,182,106, 0.9)',
        textStyle: {
          fontSize: 14,
          color: '#FFFFFF',
        },
        padding: [2, 5, 2, 5],
        formatter: '{c}',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: time/* ['0:00', '10:00', '13:00', '16:00', '20:00', '24:00'] */,
      },
      grid: {
        left: 0,
        top: 10,
        bottom: 0,
        right: 0,
        containLabel: true,
        show: false,
      },
      yAxis: {
        type: 'value',
        axisTick: {
          interval: 3,
        },
      },
      series: [
        {
          silent: true,
          data: dataBig,
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
          type: 'line',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0, color: '#03E5EE' // 0% 处的颜色
                },
                {
                  offset: 0.8, color: 'rgb(11,16,38)' // 0% 处的颜色
                },
                {
                  offset: 1, color: 'rgb(11,16,38)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            },
            opacity: 0.56,
          },
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            opacity: 0,
          },
          smooth: true,
        },
        {
          data,
          type: 'line',
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
          smooth: true,
          itemStyle: {
            color: '#EE4F45',
            borderWidth: 1,
          },
          lineStyle: {
            color: '#9BED99',
          },
        },
      ]
    });
    this.inOut = inOut;
  };

  /**
   * 利用率
   */
  renderUseRateChart = (data) => {
    
    const useRate = Echart.init(document.getElementById('use-chart'), 'customed');
    useRate.setOption({
      grid: {
        left: 0,
        top: 10,
        bottom: 0,
        right: 0,
        containLabel: true,
        show: false,
      },
      
      tooltip: {
        backgroundColor:'rgba(229,182,106, 0.9)',
        borderColor: 'rgba(229,182,106, 0.9)',
        textStyle: {
          fontSize: 14,
          color: '#FFFFFF',
        },
        padding: [2, 5, 2, 5],
        formatter: '{c}',
      },
      series: [
        {
          name: '业务指标',
          type: 'gauge',
          data: [{value: data}],
          radius: '100%',
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
          axisLabel: {
            show: false,
          },
          axisTick: {            // 坐标轴小标记
            show: false,
            length : 0,        // 属性length控制线长
          },
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 6,
              color: [[0.7, '#042438'],[1, '#808741']],
            }
          },
          splitLine: {           // 分隔线
            length :0,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                width: 2,
            }
          },
          pointer: {
            width: 6,
          },
          itemStyle: {
            color: '#03898E',
          },
          detail : {
            show: false
          },
        }
      ]
    });
    this.useRate = useRate;
  }

  /**
   * 流转率
   */
  renderSwallowChart = (data) => {

    const swallow = Echart.init(document.getElementById('swallow-chart'), 'customed');
    swallow.setOption({
      grid: {
        left: 0,
        top: 10,
        bottom: 0,
        right: 0,
        containLabel: true,
        show: false,
      },
      
      tooltip: {
        backgroundColor:'rgba(229,182,106, 0.9)',
        borderColor: 'rgba(229,182,106, 0.9)',
        textStyle: {
          fontSize: 14,
          color: '#FFFFFF',
        },
        padding: [2, 5, 2, 5],
        formatter: '{c}',
      },
      series: [
        {
          name: '业务指标',
          type: 'gauge',
          data: [{value: data}],
          radius: '100%',
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
          axisLabel: {
            show: false,
          },
          axisTick: {            // 坐标轴小标记
            show: false,
            length : 0,        // 属性length控制线长
          },
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 6,
              color: [[0.5, '#042438'],[1, '#03898E']],
            }
          },
          splitLine: {           // 分隔线
            length :0,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                width: 2,
            }
          },
          pointer: {
            width: 6,
          },
          itemStyle: {
            color: '#03898E',
          },
          detail : {
            show: false
          },
        }
      ]
    });
    this.swallow = swallow;
  }

  // 订单量
  renderOrderChart = (data, time) => {
    const order = Echart.init(document.getElementById('order-chart'), 'customed');
    var sum=0;
    for(var i = 0; i < data.length; i++){
      sum += data[i];
    }
    var mean  = sum / data.length;
    const orderDataBig = data.map((i) => i + parseInt(mean * 0.2));
    order.setOption({
      title: {
        show: false,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: time/* ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'] */,
      },
      
      tooltip: {
        backgroundColor:'rgba(229,182,106, 0.9)',
        borderColor: 'rgba(229,182,106, 0.9)',
        textStyle: {
          fontSize: 14,
          color: '#FFFFFF',
        },
        padding: [2, 5, 2, 5],
        formatter: '{c}',
      },
      grid: {
        left: 0,
        top: 10,
        bottom: 0,
        right: 0,
        containLabel: true,
        show: false,
      },
      yAxis: {
        type: 'value',
        axisTick: {
          interval: 3,
        },
      },
      series: [
        {
          silent: true,
          data: orderDataBig,
          type: 'line',
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0, color: '#03E5EE' // 0% 处的颜色
                },
                {
                  offset: 0.8, color: 'rgb(11,16,38)' // 0% 处的颜色
                },
                {
                  offset: 1, color: 'rgb(11,16,38)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            },
            opacity: 0.56,
          },
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            opacity: 0,
          },
        },
        {
          data: data,
          type: 'line',
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
          itemStyle: {
            opacity: 0,
          },
          yAxis: {
            type: 'value',
            axisTick: {
              interval: 3,
            },
          },
          lineStyle: {
            width: 3,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(255,225,50, 0.54)' // 0% 处的颜色
              }, /* {
                offset: 0.2, color: 'rgba(255,225,50, 1)' // 100% 处的颜色
              }, */ {
                offset: 1, color: '#2DF0DB' // 100% 处的颜色
              }],
            },
          },
        },
      ]
    });
    this.order = order;
  };

  reloadData = (level, name, breadList) => {

    const list = this.findLevelParkList(level, name);

    const v = this.getValue;
    this.escape.dispose();
    this.inOut.dispose();
    this.useRate.dispose();
    this.swallow.dispose();
    this.order.dispose();

    const { escape1, escape2, timeData1 } = this.getEscapeData(list, level, name);
    this.renderEscapeChart(escape1, escape2, timeData1);
    
    const { inOutData, timeData } = this.getInOutData(list, level, name, breadList);
    this.renderInOutChart(inOutData, timeData);


    const swallowData = this.getSwallowData(list, level, name, breadList);
    this.renderSwallowChart(swallowData);
    

    const useRateData = this.getUseRateData(list, level, name, breadList);
    this.renderUseRateChart(useRateData);


    // const orderData = [v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70)];
    const { orderData, timeData2 } = this.getOrderNumData(list, level, name);    
    this.renderOrderChart(orderData, timeData2);


    this.setState({
      swallowRate: swallowData,
      useRateData,
    });
  };

  findLevelParkList = (level, name) => {
    const levelMap = ['', 'area', 'name'];
    const key = levelMap[level];
    let list = [];
    if (key) {
      list = parkList.filter(({ [key]: val }) => val.includes(name) || name.includes(val));
    } else {
      list = parkList;
    }
    return list;
  }

  getSwallowData = (list, level, name) => {
    if (level === 0) {
      return 163.53;
    } else if (level === 1) {
      const map = {
        大足区: 199.24,
        垫江区: 0,
        江北区: 233.33,
        沙坪坝区: 223.42,
        渝北区: 0,
      };
      return map[name] || 0;
    } else if (list.length > 0) {
      const v = list[0];
      const { swallow } = swallowList.find(({ name }) => v.name.includes(name) || name.includes(v.name)) || {};
      return parseFloat(swallow);
    }
    return 0;
  };

  getUseRateData = (list, level, name) => {
    if (level === 0) {
      return 12.35;
    } else if (level === 1) {
      const map = {
        大足区: 15.07,
        垫江区: 0,
        江北区: 44.61,
        沙坪坝区: 15.34,
        渝北区: 0,
      };
      return map[name] || 0;
    } else if (list.length > 0) {
      const v = list[0];
      const { rate } = useRateList.find(({ name }) => v.name.includes(name) || name.includes(v.name)) || {};
      return parseFloat(rate);
    }
    return 0;
  };

  getInOutData = (list, level, name, breadList) => {
    let time = window.moment().hour();
    if (time < 5) {
      time = 5;
    }
    const len = 5;
    const start = time - len;
    const todayData = [];
    let data = [1,2,3,4,5,6];
    const timeData = [`${time - len}:00`, `${time - len + 1}:00`, `${time - len + 2}:00`, `${time - len + 3}:00`, `${time - len + 4}:00`, `${time}:00`];
    const map = {
      大足区: 1847,
      垫江区: 0,
      江北区: 77,
      沙坪坝区: 1345,
      渝北区: 0,
    };
    if (level == 0) {
      // 3269
      data = data.map(() => parseInt(this.getRandom(817.25, 3269)));
    } else if (level === 1) {
      // parseInt(this.getRandom(map[name] || 0, 3269)
      data = data.map(() => parseInt(this.getRandom(map[name] || 0, 3269)));
    } else {
      if (list.length === 0) {
        return {
          inOutData: [],
          timeData: []
        };
      }
      const { name } = list[1] || {};
      const park = list[0];
      const { swallow, 停车位数量 } = swallowList.find(({ name }) => park.name.includes(name) || name.includes(park.name)) || {};
      data = data.map(() => parseInt(this.getRandom(停车位数量, swallow)));
    }
    return {
      inOutData: data,
      timeData,
    };
  };

  getEscapeData = (list, level, name) => {
    let time = window.moment().hour();
    if (time < 5) {
      time = 5;
    }
    const len = 5;
    const start = time - len;
    const escape1 = [];
    const escape2 = [];
    const timeData1 = [`${time - len}时`, `${time - len + 1}时`, `${time - len + 2}时`, `${time - len + 3}时`, `${time - len + 4}时`, `${time}时`];
    [1, 2, 3, 4, 5, 6].forEach(() => {
      escape1.push(+this.getRandom(0, 2).toFixed(2));
      escape2.push(+this.getRandom(0, 2).toFixed(2));
    });

    return {
      escape1, escape2, timeData1
    };
  };

  getOrderNumData = (list, level, name) => {
    let time = window.moment().hour();
    if (time < 5) {
      time = 5;
    }
    const len = 5;
    const start = time - len;
    const data = [];
    const todayKey = '2019-08-21';
    const timeData2 = [`${time - len}:00`, `${time - len + 1}:00`, `${time - len + 2}:00`, `${time - len + 3}:00`, `${time - len + 4}:00`, `${time}:00`];
    const arr = orderList.filter((v) => list.findIndex(({ name }) => v.paName.includes(name) || name.includes(v.paName)) !==-1 );
    
    arr && arr.forEach(({ orders }) => {
      orders.forEach(({ hours, currentDate, orderNum }) => {
        if (+hours >= start && +hours <= time && currentDate === todayKey) {
          const index = +hours - start;
          const val = data[index] || 0;
          data[index] = val + parseInt(orderNum);
        }
      });
    });
    return {
      orderData: data,
      timeData2
    };
  };

  getRandom = (min, max) => {
    min = +min;
    max = +max;
    if (max - min < 0) {
      return Math.random()*(min - max) + max;
    }
    return Math.random()*(max - min) + min;
  };
  
  getValue = (min = 20, max = 100) => {
    return parseInt(Math.random() * max + min);
  };

  render() {
    const { swallowRate, useRateData } = this.state;
    return (
      <div className="bottom-content">
        <div id="use-chart-wrap">
          <div className="line-chart-wrap">
            <div className="use-chart-title">流转率</div>
            <div id="swallow-chart"></div>
            <div className="rate">{swallowRate}%</div>
          </div>
          <div className="line-chart-wrap">
            <div className="use-chart-title">利用率</div>
            <div id="use-chart"></div>
            <div className="rate">{useRateData}%</div>
          </div>
        </div>
        <div id="in-out-chart-wrap">
          <div className="bottom-chart-title">吞吐量</div>
          <div id="in-out-chart">
          </div>
        </div>
        <div id="escape-chart-wrap">
          <div className="bottom-chart-title">
            <div>逃逸率/逃费率</div>
            <div className="bottom-legend">
              <div className="money">金额</div>
              <div className="car">车辆</div>
            </div>
          </div>
          <div id="escape-chart"></div>
        </div>
        <div id="order-chart-wrap">
          <div className="bottom-chart-title">订单量</div>
          <div id="order-chart">

          </div>
        </div>
      </div>
    );
  }
}

export default LeftContent;