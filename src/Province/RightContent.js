import React, { Component } from 'react';
import { Tabs } from 'antd';
import Echart from 'echarts';
import warning from '../resource/image/warning.png';
import horn from '../resource/image/horn.png';
import worker from '../resource/image/work_man.png';
import parkList from '../resource/data/parkRealData.js';
import get from 'lodash/get';
import baohedu from '../resource/data/baohedu.js';
import badList from '../resource/data/bad.js';
import './RightContent.css';


const originPerson = [
  {"name":"肖英杰","phone":"13594641688"},
  {"name":"王奕龙","phone":"18565351666"},
  {"name":"阮涛","phone":"18956534853"},
  {"name":"王波","phone":"15823123723"},
  {"name":"冯爽","phone":"15365428018"},
  {"name":"种嘉乐","phone":"13619247851"},
  {"name":"仲光帅","phone":"18696518611"},
  {"name":"付涛","phone":"18716784227"},
  {"name":"陈玄","phone":"18020558783"},
  {"name":"张佳佳","phone":"13626101589"},
  {"name":"韩小闯","phone":"18651403931"},
  {"name":"魏振东","phone":"17691263095"},
  {"name":"常德存","phone":"13218038573"},
  {"name":"冯伟","phone":"17623401021"},
];


class rightContent extends Component {

  workManIndex = 0;

  state = {
    showInfo: true,
    workManInfo: [],
    personArr: [],
  }

  componentDidMount() {
    this.scrollKey = requestAnimationFrame(this.autoScroll);
    this.autoChange();
  }

  autoChange = () => {
    setInterval(() => {
      const { currentState } = this.props;
      if (currentState === 'city') {
        return;
      }
      const { personArr } = this.state;
      ++this.workManIndex;
      if (this.workManIndex > personArr.length - 1) {
        this.workManIndex = 0;
      }
      this.setState({
        workManInfo: personArr[this.workManIndex],
      });
    }, 6000);
  }

  autoScroll = () => {
    if (this.ref) {
      const top = this.ref.scrollTop;
      this.ref.scrollTop = top + 1;
      if (top === this.ref.scrollTop) {
        this.ref.scrollTop = 0;
      }
    }
    this.scrollKey = requestAnimationFrame(this.autoScroll);
  };

  stop = () => {
    cancelAnimationFrame(this.scrollKey);
  };
  start = () => {
    cancelAnimationFrame(this.scrollKey);
    this.scrollKey = requestAnimationFrame(this.autoScroll);
  }

  renderSaturationChart = (data, time) => {
    const saturation = Echart.init(document.getElementById('saturation-chart'), 'customed');
    this.saturation = saturation;
    const dataBig = data.map((i) => parseInt(i) + 5);
    saturation.setOption({
      title: {
        show: false,
      },
      tooltip: {
        backgroundColor:'#1dc3bf',
        borderColor: '#1dc3bf',
        textStyle: {
          fontSize: 14,
          color: '#FFFFFF',
        },
        padding: [2, 5, 2, 5],
        formatter: '{c}%',
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
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: [
        {
          // tooltip: null,
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
        formatter: ({ percent }) => `${percent}%`,
      },
      series : [
        {
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
          name:'center',
          type:'pie',
          radius: [0, '30%'],
          data:[
            { value:1, name:'TY', itemStyle: { color: '#74a7ce' }  }
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
  
  reloadData = (level, name, breadList) => {

    setTimeout(() => {
      const list = this.findLevelParkList(level, name) || [];
      const { currentState } = this.props;
      const v = this.getValue;
      this.saturation && this.saturation.dispose();
      if (currentState === 'city') {
        const data = this.getDeviceData(list);
        this.online && this.online.dispose();
        this.renderOnlineChart(data);
      } else {
        this.online && this.online.dispose();
        this.reloadPerson(list);
      }
      this.reloadSat(list, level, name, breadList);
    });
  };

  reloadPerson = (list) => {
    let address = '';
    if (list.length > 0) {
      address = get(list, '0.address');
    }
    const getRandomArrayElements = (arr, count) => {
      var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
      while (i-- > min) {
          index = Math.floor((i + 1) * Math.random());
          temp = shuffled[index];
          shuffled[index] = shuffled[i];
          shuffled[i] = temp;
      }
      return shuffled.slice(min);
    }
    const arr = getRandomArrayElements(originPerson, 4);
    arr.forEach((i) => {
      i.address = `${address}处收费员`;
    });
    this.setState({
      personArr: arr,
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

  reloadSat = (list, level, name, breadList) => {
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
      大足区: 60.52,
      垫江区: 0,
      江北区: 96.97,
      沙坪坝区: 95.51,
      渝北区: 0,
    };
    if (level == 0) {
      // 市饱和度：【区平均值，总饱和度】
      data = data.map(() => this.getRandom(50.6, 58.43).toFixed(2));
    } else if (level === 1) {
      // 区饱和度：【总饱和度，区饱和度】
      data = data.map(() => this.getRandom(map[name] || 0, 58.43).toFixed(2));
    } else {
      // 停车场饱和度：【区饱和度的值，停车场的值】
      if (list.length === 0) {
        return;
      }
      const { name: areaName } = breadList[1] || {};
      const park = list[0];
      const { saturation } = baohedu.find(({ saturation, name }) => park.name.includes(name) || name.includes(park.name)) || {};
      data = data.map(() => this.getRandom(map[areaName] || 0, parseFloat(saturation)).toFixed(2));
    }
    this.renderSaturationChart(data, timeData);
  };

  getDeviceData = (list) => {
    const currentList = badList.filter((v) => list.findIndex(({ name }) => v.name.includes(name) || name.includes(v.name)) !==-1);
    const data = [0, 0, 0];
    currentList.forEach(({ all }) => {
      const [online, bad] = data;
      const allD = parseInt(all);
      data[0] = online + allD;
      data[1] = bad + Math.floor(allD * 0.01);
    });
    return data;
  };

  getRandom = (min, max) => {
    if (max - min < 0) {
      return Math.floor(Math.random()*(min - max) + max);
    }
    return Math.floor(Math.random()*(max - min) + min);
  };

  getValue = (min = 20, max = 100) => {
    return parseInt(Math.random() * max + min);
  };

  renderParks = (data) => {
    return data.map(({ no, paName, amount }) => {
      return (
        <div className="list-item" key={no+paName}>
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
    // this.setState({
    //   showInfo: true,
    //   workManInfo: personArr[index],
    // });
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
                [0, 1].map((_, index) => {
                  return (
                    <img alt="" src={worker} className="work-man" key={_} /* onMouseEnter={() => this.showInfo(index)} onMouseLeave={this.hidInfo} */ />
                  );
                })
              }
            </div>
            <div className="work-left">
              <img alt="" src={worker} className="work-man" /* onMouseEnter={() => this.showInfo(6)} onMouseLeave={this.hidInfo}  *//>
            </div>
            <div className="work-right">
              <img alt="" src={worker} className="work-man" /* onMouseEnter={() => this.showInfo(7)} onMouseLeave={this.hidInfo}  *//>
            </div>
          </div>
          {
            showInfo && workManInfo ?
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
          <div className="tips-scroll-wrap" ref={this.getListRef} onMouseEnter={this.stop} onMouseLeave={this.start}>
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