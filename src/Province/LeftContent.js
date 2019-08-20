import React, { Component } from 'react';
import get from 'lodash/get';
import { Tabs } from 'antd';
import Echart from 'echarts';
import imgNumber from '../resource/image/park_number.png';
import imgSeat from '../resource/image/park_seat.png';
import { list1, list2, list3, list4, list5, list6 } from '../resource/data/parkList';
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
    seatAmount: 412,
    tab: 0,
  }

  componentDidMount() {
    this.renderIcomeChart([1700, 800, 600, 1300, 1900, 1400], [950, 500, 1100, 1000, 500, 1000]);
    setInterval(() => {
      const { tab } = this.state;
      const { currentState } = this.props;
      const max = currentState === 'city' ? 5 : 4;
      let newTab = tab + 1; 
      if (newTab > max) {
        newTab = 0;
      }
      this.setState({
        tab: newTab,
      });
    }, 6000);
  }

  renderIcomeChart = (data1, data2) => {
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
  
  reloadData = () => {
    this.reloadChart(this.income);
    this.setState({
      seatNumber: 100 + parseInt(Math.random() * 600),
      seatAmount: 100 + parseInt(Math.random() * 1000),
      tab: 0,
    });
  };

  reloadChart = (chart) => {
    const v = this.getValue;
    const data1 = [v(600, 1100),v(600, 1100),v(600, 1100),v(600, 1100),v(600, 1100),v(600, 1100)];
    const data2 = [v(600, 1100),v(600, 1100),v(600, 1100),v(600, 1100),v(600, 1100),v(600, 1100)];
    chart.dispose();
    this.renderIcomeChart(data1, data2);
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
          data.map(({ no, paName, amount }, index) => {
            return (
              <div className="list-item" key={amount + paName}>
                <span className="item-one">{index + 1}</span>
                <span className="item-second">{paName}</span>
                <span className="item-third">{amount}</span>
              </div>
            );
          })
        }
      </>
    );
    // return 
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
    const { tab } = this.state;
    if (currentState === 'city') {
      return (
        <>
          <div className="second-title">排行榜tops</div>
          <div className="panel-wrap">
            <div className="tab-wrap">
              <Tabs
                // defaultActiveKey="0"
                onChange={this.onTabChange}
                activeKey={String(tab)}
                tabPosition="bottom"
                key={currentState}
              >
                {
                  TOPS_TAB_ARRARY.map(({ data, title, name }, index) => {
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
    const { seatNumber, seatAmount } = this.state;
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
                  <span className="liang-unit">{seatAmount}</span>
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