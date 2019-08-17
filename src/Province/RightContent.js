import React, { Component } from 'react';
import { Tabs } from 'antd';
import Echart from 'echarts';
import warning from '../resource/image/warning.png';
import horn from '../resource/image/horn.png';
import './RightContent.css';


class rightContent extends Component {

  state = {
  }

  componentDidMount() {
    const data = [820, 932, 780, 934, 1290, 900];
    this.renderSaturationChart(data);
    this.renderOnlineChart([90, 20, 40]);
  }

  renderSaturationChart = (data) => {
    const saturation = Echart.init(document.getElementById('saturation-chart'), 'customed');
    this.saturation = saturation;
    const dataBig = data.map((i) => i + 150);
    saturation.setOption({
      title: {
        show: false,
      },
      // tooltip: {},
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
        type: 'value'
      },
      series: [
        {
          data: dataBig,
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
                  offset: 0, color: '#4A90E2' // 0% 处的颜色
                },
                {
                  offset: 0.1, color: '#4A90E2' // 0% 处的颜色
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
          smooth: true,
          itemStyle: {
            color: '#F5A623',
            borderWidth: 2,
          },
          lineStyle: {
            color: '#2CA1FC',
          },
        },
      ]
    });
  };

  renderOnlineChart = (value) => {
    const online = Echart.init(document.getElementById('online-chart'), 'customed');
    online.setOption({
      grid: {
        left: 0,
        top: 10,
        bottom: 0,
        right: 0,
        containLabel: true,
        show: false,
      },
      series : [
        {
          name:'center',
          type:'pie',
          radius: [0, '30%'],
          data:[
            { value:1, name:'直', itemStyle: { color: '#74a7ce' }  }
          ],
          silent: true,
          label: {
            show:false,
          },
        },
        {
          name: '访问来源',
          type: 'pie',
          radius : ['30%', '60%'],
          label: {
            show: true,
          },
          data: [
            { value: value[0], name:'在线', itemStyle: { color: '#2c82be' }, 
              label: {
                show: true,
              }, 
            },
            { value: value[1], name:'故障', selected:true, itemStyle: { color: '#c4c38d' } },
            { value: value[2], name:'停用', itemStyle: { color: '#9cacba' } },
          ],
          avoidLabelOverlap: false,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
        }
      ]
    });
    this.online = online;
  };
  
  reloadData = () => {
    const v = this.getValue;
    const data = [v(400, 800), v(400, 800), v(400, 800), v(400, 800), v(400, 800), v(400, 800)];
    const arr = [v(40, 70), v(10, 20), v(10, 20)];
    this.saturation.dispose();
    this.online.dispose();
    this.renderSaturationChart(data);
    this.renderOnlineChart(arr);
    // this.reloadAreaChart(this.saturation);
    // this.reloadPieChart(this.online);
  };
  
  reloadAreaChart = (chart) => {
    const v = this.getValue;
    const data = [v(400, 800), v(400, 800), v(400, 800), v(400, 800), v(400, 800), v(400, 800)];
    const dataBig = data.map((i) => i + 150);
    chart.setOption({
      series: [
        {data: dataBig},
        {data},
      ],
    });
  };

  reloadPieChart = (chart) => {
    chart.setOption({
      series: [
      {},
      {
        data: [
          {
            value: this.getValue(40, 70), name:'在线', itemStyle: { color: '#2c82be' }, 
            label: {
              show: true,
            }, 
          }, 
          {
            value: this.getValue(10, 20), name:'故障', selected:true, itemStyle: { color: '#c4c38d' } 
          },
          { value: this.getValue(10, 20), name:'停用', itemStyle: { color: '#9cacba' } },
        ],
      }],
    });
  }

  getValue = (min = 20, max = 100) => {
    return parseInt(Math.random() * max + min);
  };

  renderParks = (data) => {
    return data.map(({ no, paName, amount }) => {
      return (
        <div className="list-item">
          <span className="item-one">{no}</span>
          <span className="item-second">{paName}</span>
          <span className="item-third">{amount}</span>
        </div>
      );
    })
  };

  render() {
    return (
      <div className="right-container">
        <div className="right-top">
          <div className="second-title">饱和度</div>
          <div id="saturation-chart">
          </div>
        </div>
        <div className="right-center">
          <div className="second-title">
            设备在线率
          </div>
          <div id="online-chart">
          </div>
        </div>
        <div className="right-bottom">
          <div className="second-title">消息告警</div>
          <div className="tips-wrap">
            <div className="warning-item">
              扫雪通知
              <img alt="" src={horn} className="horn" />
            </div>
            <div className="warning-item">上级视察团巡视</div>
            <div className="warning-item">副区长调研审查</div>
            <div className="warning-item">
              苏X387s7 三次逃逸
              <img alt="" src={warning} className="warning" />
            </div>
            <div className="warning-item">
              苏X387s7 二次逃逸
              <img alt="" src={warning} className="warning" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default rightContent;