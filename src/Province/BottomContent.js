import React, { Component } from 'react';
import get from 'lodash/get';
import { Tabs } from 'antd';
import Echart from 'echarts';
import './bottomContent.css';

class LeftContent extends Component {
  
  componentDidMount() {
    this.renderEscapeChart([1700, 800, 600, 1300, 1900, 1400], [950, 500, 1100, 1000, 500, 1000]);
    const data = [820, 932, 780, 934, 1290, 900];
    this.renderInOutChart(data);
    this.renderUseRateChart(64);
    this.renderSwallowChart(58);
    const orderData = [80, 98, 78, 98, 88, 94, 90, 75, 120, 130, 160, 110, 123, 115];
    this.renderOrderChart(orderData);
  }

  renderEscapeChart = (data1, data2) => {
  
    const escape = Echart.init(document.getElementById('escape-chart'), 'customed');
    escape.setOption({
      title: {
        show: false,
      },
      // tooltip: {},
      xAxis: {
        data: ['17时', '18时', '19时', '20时', '21时', '22时'],
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
        splitNumber: 3,
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

  renderInOutChart = (data) => {
  
    // 流转率
    const inOut = Echart.init(document.getElementById('in-out-chart'), 'customed');
    const dataBig = data.map((i) => i + 150);
    inOut.setOption({
      title: {
        show: false,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0:00', '10:00', '13:00', '16:00', '20:00', '24:00'],
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
  renderOrderChart = (data) => {
    // 订单量
    const order = Echart.init(document.getElementById('order-chart'), 'customed');
    const orderDataBig = data.map((i) => i + 20);
    order.setOption({
      title: {
        show: false,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
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

  reloadData = () => {
    const v = this.getValue;
    this.escape.dispose();
    this.inOut.dispose();
    this.useRate.dispose();
    this.swallow.dispose();
    this.order.dispose();
    this.renderEscapeChart([v(600, 1100), v(600, 1100), v(600, 1100), v(600, 1100), v(600, 1100), v(600, 1100)], [v(600, 1100), v(600, 1100), v(600, 1100), v(600, 1100), v(600, 1100), v(600, 1100)]);
    const data = [v(600, 1100), v(600, 1100), v(600, 1100), v(600, 1100), v(600, 1100), v(600, 1100)];
    this.renderInOutChart(data);
    this.renderUseRateChart(64);
    this.renderSwallowChart(58);
    const orderData = [v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70), v(70, 70)];
    this.renderOrderChart(orderData);
    // this.reloadChart(this.escape);
    // this.reloadChart(this.inOut);
    // this.reloadChart(this.useRate);
    // this.reloadChart(this.swallow);
    // this.reloadChart(this.order);
  };

  
  getValue = (min = 20, max = 100) => {
    return parseInt(Math.random() * max + min);
  };

  reloadChart = (chart) => {
    const option = chart.getOption();
    chart.clear();
    chart.setOption(option);
  }

  render() {
    return (
      <div className="bottom-content">
        <div id="use-chart-wrap">
          <div className="line-chart-wrap">
            <div className="use-chart-title">吞吐量</div>
            <div id="swallow-chart"></div>
            <div className="rate">64%</div>
          </div>
          <div className="line-chart-wrap">
            <div className="use-chart-title">利用率</div>
            <div id="use-chart"></div>
            <div className="rate">58%</div>
          </div>
        </div>
        <div id="in-out-chart-wrap">
          <div className="bottom-chart-title">流转率</div>
          <div id="in-out-chart">
          </div>
        </div>
        <div id="escape-chart-wrap">
          <div className="bottom-chart-title">
            <div>逃逸率/逃费率</div>
            <div className="bottom-legend">
              <div className="money">金钱</div>
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