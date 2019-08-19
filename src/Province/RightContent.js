import React, { Component } from 'react';
import { Tabs } from 'antd';
import Echart from 'echarts';
import warning from '../resource/image/warning.png';
import horn from '../resource/image/horn.png';
import worker from '../resource/image/work_man.png';
import './RightContent.css';


class rightContent extends Component {

  state = {
    showInfo: false,
  }

  componentDidMount() {
    const data = [820, 932, 780, 934, 1290, 900];
    this.renderSaturationChart(data);
    this.renderOnlineChart([90, 20, 40]);
    
    // function autoScroll() {
    //   const id = '#park-list';
    //   const list = $(id);
    //   const lastTop = list.scrollTop();
    //   list.scrollTop(lastTop + 1);
    //   const newTop = list.scrollTop();
    //   if (newTop === lastTop) {
    //     list.scrollTop(0);
    //   }
    //   requestAnimationFrame(autoScroll);
    // this.autoScroll();
    // }
    requestAnimationFrame(this.autoScroll);

  }

  autoScroll = () => {
    const top = this.ref.scrollTop;
    this.ref.scrollTop = top + 1;
    if (top === this.ref.scrollTop) {
      this.ref.scrollTop = 0;
    }
    requestAnimationFrame(this.autoScroll);
  };

  renderSaturationChart = (data) => {
    const saturation = Echart.init(document.getElementById('saturation-chart'), 'customed');
    this.saturation = saturation;
    const dataBig = data.map((i) => i + 150);
    saturation.setOption({
      title: {
        show: false,
      },
      tooltip: {
        backgroundColor:'#23F5F0',
        borderColor: '#23F5F0',
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
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
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
      series : [
        {
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
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
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
          name: '设备在线率',
          type: 'pie',
          radius : ['30%', '60%'],
          label: {
            show: true,
          },
          data: [
            { value: value[0], name: `在线(${value[0]})`,itemStyle: { color: '#2c82be' }, 
              label: {
                show: true,
                fontSize: 10,
              }, 
            },
            { value: value[1], name:`故障(${value[1]})`, label: { fontSize: 10 }, selected:true, itemStyle: { color: '#c4c38d' } },
            { value: value[2], name:`停用(${value[2]})`, label: { fontSize: 10 },itemStyle: { color: '#9cacba' } },
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
    setTimeout(() => {
      const { currentState } = this.props;
      const v = this.getValue;
      const data = [v(400, 800), v(400, 800), v(400, 800), v(400, 800), v(400, 800), v(400, 800)];
      this.saturation.dispose();
      if (currentState === 'city') {
        const arr = [v(40, 70), v(10, 20), v(10, 20)];
        this.online.dispose();
        this.renderOnlineChart(arr);
      } else {
        this.online.dispose();
      }
      this.renderSaturationChart(data);
    });
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

  hidInfo = () => {
    this.setState({
      showInfo: false,
    });
  };

  showInfo = (index) => {
    const personArr = [
      {
        name: '王刚',
        phone: '15357001171',
        address: '建博路街道收费员',
      },
      {
        name: '李强',
        phone: '15357002171',
        address: '建博路街道收费员',
      },
      {
        name: '张建明',
        phone: '15347002112',
        address: '建博路街道收费员',
      },
      {
        name: '王富强',
        phone: '15347502162',
        address: '建博路街道收费员',
      },
      {
        name: '陈国栋',
        phone: '15341542162',
        address: '建博路街道收费员',
      },
      {
        name: '陈启明',
        phone: '15324542162',
        address: '建博路街道收费员',
      },
      {
        name: '蔡成康',
        phone: '185745842162',
        address: '建博路街道收费员',
      },
      {
        name: '周沁园',
        phone: '136748802162',
        address: '建博路街道收费员',
      },
    ];
    this.setState({
      showInfo: true,
      workManInfo: personArr[index],
    });
  };
  
  renderCenter = () => {
    const { currentState } = this.props;
    const { showInfo, workManInfo } = this.state;
    const stylePark = currentState === 'park' ? 'none' : 'block';
    const styleCity = currentState === 'city' ? 'none' : 'block';
    return (
      <>
        <div id="online-chart" style={{ display: stylePark }}>
        </div>
        <div className="work-man-wrap" style={{ display: styleCity }}>
          <div className="work-man-distribution">
            <div className="work-top">
              {
                [0, 1, 2, 3, 4, 5].map((_, index) => {
                  return (
                    <img alt="" src={worker} className="work-man" onMouseEnter={() => this.showInfo(index)} onMouseLeave={this.hidInfo} />
                  );
                })
              }
            </div>
            <div className="work-left">
              <img alt="" src={worker} className="work-man" onMouseEnter={() => this.showInfo(6)} onMouseLeave={this.hidInfo} />
            </div>
            <div className="work-right">
              <img alt="" src={worker} className="work-man" onMouseEnter={() => this.showInfo(7)} onMouseLeave={this.hidInfo} />
            </div>
          </div>
          {
            showInfo ?
            <div className="work-man-info">
              <div className="info-line">
                <span style={{ marginRight: 4 }}>{workManInfo.name}</span>
                <span>{workManInfo.phone}</span>
              </div>
              <div className="info-content">{workManInfo.address}</div>
            </div>
            :null
          }
        </div>
      </>
    );
  };

  getListRef = (ref) => {
    this.ref = ref;
  };

  render() {
    const { currentState } = this.props;
    const centerLabel = currentState === 'city' ? '设备在线率' : '在岗收费员';
    return (
      <div className="right-container">
        <div className="right-top">
          <div className="second-title">饱和度</div>
          <div id="saturation-chart">
          </div>
        </div>
        <div className="right-center">
          <div className="second-title">
            {centerLabel}
          </div>
          {
            this.renderCenter()
          }
        </div>
        <div className="right-bottom">
          <div className="second-title">消息告警</div>
          <div className="tips-scroll-wrap" ref={this.getListRef}>
            <div className="tips-wrap">
              <div className="warning-item">
                扫雪通知
                <img alt="" src={horn} className="horn" />
              </div>
              <div className="warning-item">上级视察团巡视</div>
              <div className="warning-item">副区长调研审查</div>
              <div className="warning-item">
                渝A387C7 三次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">
                渝A387C7 二次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">副省长调研审查</div>
              <div className="warning-item">
                雾霾通知
                <img alt="" src={horn} className="horn" />
              </div>
              <div className="warning-item">
                渝A351A2 二次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">
                渝A351A2 三次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">设备故障警告
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">订单异常警告
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">区长调研审查</div>
              <div className="warning-item">局部暴雨通知</div>
              
              <div className="warning-item">
                扫雪通知
                <img alt="" src={horn} className="horn" />
              </div>
              <div className="warning-item">上级视察团巡视</div>
              <div className="warning-item">副区长调研审查</div>
              <div className="warning-item">
                渝A387C7 三次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">
                渝A387C7 二次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">副省长调研审查</div>
              <div className="warning-item">
                雾霾通知
                <img alt="" src={horn} className="horn" />
              </div>
              <div className="warning-item">
                渝A351A2 二次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">
                渝A351A2 三次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">设备故障警告
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">订单异常警告
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">区长调研审查</div>
              <div className="warning-item">局部暴雨通知</div>

              <div className="warning-item">
                扫雪通知
                <img alt="" src={horn} className="horn" />
              </div>
              <div className="warning-item">上级视察团巡视</div>
              <div className="warning-item">副区长调研审查</div>
              <div className="warning-item">
                渝A387C7 三次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">
                渝A387C7 二次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">副省长调研审查</div>
              <div className="warning-item">
                雾霾通知
                <img alt="" src={horn} className="horn" />
              </div>
              <div className="warning-item">
                渝A351A2 二次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">
                渝A351A2 三次逃逸
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">设备故障警告
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">订单异常警告
                <img alt="" src={warning} className="warning" />
              </div>
              <div className="warning-item">区长调研审查</div>
              <div className="warning-item">局部暴雨通知</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default rightContent;