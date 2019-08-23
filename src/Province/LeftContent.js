import React, { Component } from 'react';
import get from 'lodash/get';
import { Tabs } from 'antd';
import Echart from 'echarts';
import CountUp from 'react-countup';
import imgNumber from '../resource/image/park_number.png';
import imgSeat from '../resource/image/park_seat.png';
import parkList from '../resource/data/parkRealData.js';
import { list1, list2, list3, list4, list5, list6 } from '../resource/data/parkList';
import orderList from '../resource/data/orderList.js';
import baohedu from '../resource/data/baohedu.js';
import parkOrderList from '../resource/data/parkOrderList.js';
import swallowList from '../resource/data/swallow.js';
import badList from '../resource/data/bad.js';
import './leftContent.css';

const { TabPane } = Tabs;

const TOPS_TAB_ARRARY = [
  {
    data: list1,
    title: '车位饱和度排行榜',
    name: '饱和度',
  },
  {
    data: list2,
    title: '实收金额排行榜',
    name: '实收(元)',
  },
  {
    data: list3,
    title: '吞吐量排行榜',
    name: '吞吐量',
  },
  {
    data: list4,
    title: '流转率排行榜',
    name: '流转率',
  },
  {
    data: list5,
    title: '故障率排行榜',
    name: '故障率',
  },
  {
    data: list6,
    title: '逃逸率排行榜',
    name: '逃逸率',
  },
];

class LeftContent extends Component {

  state = {
    seatNumber: 601,
    startSeatAmount: 0,
    endSeatAmount: 412,
    tab: 0,
    topList: TOPS_TAB_ARRARY,
  }

  componentDidMount() {
    // setInterval(() => {
    //   const { tab } = this.state;
    //   const { currentState } = this.props;
    //   const max = currentState === 'city' ? 5 : 4;
    //   let newTab = tab + 1; 
    //   if (newTab > max) {
    //     newTab = 0;
    //   }
    //   this.setState({
    //     tab: newTab,
    //   });
    // }, 6000);
    this.seatAomuntAdd();
  }

  seatAomuntAdd = () => {
    const time = 3000 + parseInt(Math.random() * 5000);
    setTimeout(() => {
      const add = Math.random() < 0.5;
      const { endSeatAmount, seatNumber } = this.state;
      let newEnd = endSeatAmount + (parseInt(0 + Math.random() * 5) * (add ? 1 : -1));
      if (newEnd > seatNumber) {
        newEnd = seatNumber;
      } else if (newEnd <= 0) {
        newEnd = 0;
      }
      this.setState({
        startSeatAmount: endSeatAmount,
        endSeatAmount: newEnd,
      });
      this.seatAomuntAdd();
    }, time);
  };

  renderIcomeChart = (data1, data2, time) => {
    const income = Echart.init(document.getElementById('hour-income-chart'), 'customed');
    income.setOption({
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
        data: time,
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
      },
      series: [
        {
          name: '昨日',
          type: 'bar',
          data: data1,
          barWidth: 13,
          barCategoryGap: 1,
          animationDuration: 2000,
          animationEasing: 'quinticInOut',
        },
        {
          name: '今日',
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
    this.income = income;
  };
  
  reloadData = (level, name) => {
    const list = this.findLevelParkList(level, name) || [];
    let seatNumber = 0;
    list.forEach(({ seatNumber: n }) => {
      seatNumber = seatNumber + Number(n);
    });
    const endSeatAmount = parseInt(seatNumber * 0.8);
    this.reloadChart(this.income, list);
    this.reloadTops(list, level, name);
    this.setState({
      seatNumber,
      startSeatAmount: 0,
      endSeatAmount,
      tab: 0,
    });
  };

  reloadTops = (list, level, name) => {
    const { topList } = this.state;
    const arr0 = baohedu.filter((v) => list.findIndex(({ name }) => v.name.includes(name) || name.includes(v.name)) !==-1).sort((a, b) => parseFloat(b.saturation) - parseFloat(a.saturation));
    if (arr0.length > 5) {
      arr0.length = 5;
    }
    // paName: '半岛明珠停车场',
    // amount: '80%',
    // topList[0].data = arr0.map(({ name, saturation }) => ({ paName: name, amount: `${parseFloat(saturation)}%` }));
    topList[0].data = arr0.map(({ name, saturation }) => ({ paName: name, amount: `${saturation}` }));

    const arr1 = parkOrderList.filter((v) => list.findIndex(({ name }) => v.name.includes(name) || name.includes(v.name)) !==-1).sort((a, b) => parseFloat(b.income) - parseFloat(a.income));
    if (arr1.length > 5) {
      arr1.length = 5;
    }

    topList[1].data = arr1.map(({ name, income }) => ({ paName: name, amount: income }));

    
    const arr2 = swallowList.filter((v) => list.findIndex(({ name }) => v.name.includes(name) || name.includes(v.name)) !==-1).sort((a, b) => parseFloat(b.swallow) - parseFloat(a.swallow));
    if (arr2.length > 5) {
      arr2.length = 5;
    }

    topList[2].data = arr2.map(({ name, swallow }) => ({ paName: name, amount: swallow }));
    
    const arr3 = swallowList.filter((v) => list.findIndex(({ name }) => v.name.includes(name) || name.includes(v.name)) !==-1).sort((a, b) => parseFloat(b.circulation) - parseFloat(a.circulation));
    if (arr3.length > 5) {
      arr3.length = 5;
    }

    // topList[3].data = arr3.map(({ name, circulation }) => ({ paName: name, amount: `${parseFloat(circulation)}%` }));
    topList[3].data = arr3.map(({ name, circulation }) => ({ paName: name, amount: circulation }));
    
    const arr4 = [...list.sort((a, b) => parseFloat(a.bad) - parseFloat(b.bad))];
    if (arr4.length > 5) {
      arr4.length = 5;
    }
    topList[4].data = arr4.map(({ name, bad }) => ({ paName: name, amount: bad }));

    const arr5 = [...list.sort((a, b) => parseFloat(a.escape) - parseFloat(b.escape))];
    if (arr5.length > 5) {
      arr5.length = 5;
    }
    topList[5].data = arr5.map(({ name, escape }) => ({ paName: name, amount: escape }));
    
    this.setState({
      topList: [...topList],
    });
  };

  reloadChart = (chart, list) => {
    const [d1, d2, t] = this.getIncomeData(list);
    chart && chart.dispose();
    this.renderIcomeChart(d1, d2, t);
  }
  
  getIncomeData = (list) => {
    let time = window.moment().hour();
    if (time < 5) {
      time = 5;
    }
    const len = 5;
    const start = time - len;
    const yesterDayKey = '2019-08-20';
    const todayKey = '2019-08-21';
    const yesterdayData = [];
    const todayData = [];
    const timeData = [`${time - len}时`, `${time - len + 1}时`, `${time - len + 2}时`, `${time - len + 3}时`, `${time - len + 4}时`, `${time}时`];
    const dataMap = {
      [yesterDayKey]: yesterdayData,
      [todayKey]: todayData,
    };
    const arr = orderList.filter((v) => list.findIndex(({ name }) => v.paName.includes(name) || name.includes(v.paName)) !==-1 );
    arr && arr.forEach(({ orders }) => {
      orders.forEach(({ hours, currentDate, orderNum, totalCost }) => {
        if (+hours >= start && +hours <= time) {
          const index = +hours - start;
          const data = dataMap[currentDate];
          const val = data[index] || 0;
          data[index] = val + parseInt(totalCost);
        }
      });
    });
    return [yesterdayData, todayData, timeData];
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
  
  getValue = (min = 20, max = 100) => {
    return parseInt(Math.random() * max + min);
  };

  onTabChange = (index) => {
    this.setState({
      tab: index,
    });
  };

  renderParks = (data, title, name) => {
    return (
      <>
        <div className="panel-title">
          <div className="list-title">{title}</div>
          <div className="list-item-title">
            <span className="title-one">名次</span>
            <span className="title-second">停车场</span>
            <span className="title-third">{name}</span>
          </div>
        </div>
        {
          data.length > 0 ? data.map(({ no, paName, amount }, index) => {
            return (
              <div className="list-item" key={amount + paName}>
                <span className="item-one">{index + 1}</span>
                <span className="item-second">{paName}</span>
                <span className="item-third">{amount}</span>
              </div>
            );
          })
          : <div className="no-data-label">暂无数据</div>
        }
      </>
    );
  };

  renderVideo = (index) => {
    return (
      <>
        <div className={`video-wrap video-${index}`}>
          
        </div>
      </>
    );
  };

  renderLeftBottom = () => {
    const { currentState } = this.props;
    const { tab, topList } = this.state;
    if (currentState === 'city') {
      return (
        <>
          <div className="second-title">排行榜topN</div>
          <div className="panel-wrap">
            <div className="tab-wrap">
              <Tabs
                onChange={this.onTabChange}
                activeKey={String(tab)}
                tabPosition="bottom"
                key={currentState}
              >
                {
                  topList.map(({ data, title, name }, index) => {
                    return (
                      <TabPane tab={<span className="panel-dot"></span>} key={index}>
                        {this.renderParks(data, title, name)}
                      </TabPane>
                    );
                  })
                }
              </Tabs>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="second-title">视频监控</div>
        <div className="panel-wrap">
          <div className="tab-wrap">
            <Tabs
              onChange={this.onTabChange}
              tabPosition="bottom"
              activeKey={String(tab)}
              key={currentState}
            >
              {

                [0, 1, 2, 3, 4].map((i, index) => {
                  return (
                  <TabPane tab={<span className="panel-dot"></span>} key={index}>
                    {this.renderVideo(index)}
                  </TabPane>
                  )
                })
              }
            </Tabs>
          </div>
        </div>
      </>
    );
  };

  render() {
    const { seatNumber, startSeatAmount, endSeatAmount } = this.state;
    return (
      <div className="left-container">
        <div className="left-top">
          <div className="second-title">小时收入曲线</div>
          <div className="legend">
            <div className="today">今日</div>
            <div className="yesterday">昨日</div>
          </div>
          <div id="hour-income-chart">
          </div>
        </div>
        <div className="left-center">
          <div className="second-title">
            <span className="park-seat">停车位</span>
            <span className="park-number">停车量</span>
          </div>
          <div className="park-info-container">
            <div className="image-container">
              <div className="seat-image-wrap">
                <img className="image-seat" alt="" src={imgSeat} />
                <div className="seat-amount">
                  <span className="ge-unit">{seatNumber}</span>
                </div>
              </div>
              <div className="number-image-wrap">
                <img className="image-number" alt="" src={imgNumber} />
                <div className="park-amount">
                <CountUp
                  className="liang-unit"
                  start={startSeatAmount}
                  end={endSeatAmount}
                  duration={2}
                >
                </CountUp>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="left-bottom">
          {
            this.renderLeftBottom()
          }
        </div>
      </div>
    );
  }
}

export default LeftContent;