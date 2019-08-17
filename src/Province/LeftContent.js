import React, { Component } from 'react';
import get from 'lodash/get';
import { Tabs } from 'antd';
import Echart from 'echarts';
import imgNumber from '../resource/image/park_number.png';
import imgSeat from '../resource/image/park_seat.png';
import { list1, list2, list3, list4, list5 } from '../resource/data/parkList';
import './leftContent.css';

const { TabPane } = Tabs;

class LeftContent extends Component {

  state = {
  }

  componentDidMount() {
    this.renderIcomeChart([1700, 800, 600, 1300, 1900, 1400], [950, 500, 1100, 1000, 500, 1000]);
  }

  renderIcomeChart = (data1, data2) => {
    const income = Echart.init(document.getElementById('hour-income-chart'), 'customed');
    income.setOption({
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
      },
      series: [
        {
          name: '1',
          type: 'bar',
          data: data1,
          barWidth: 13,
          barCategoryGap: 1,
        },
        {
          name: '2',
          type: 'bar',
          data: data2,
          barGap: '1%',
          barWidth: 13,
          barCategoryGap: 1,
        },
      ]
    });
    this.income = income;
  };
  
  reloadData = () => {
    this.reloadChart(this.income);
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

  onTabChange = () => {
  
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
                  <span className="ge-unit">300</span>
                </div>
              </div>
              <div className="number-image-wrap">
                <img className="image-number" alt="" src={imgNumber} />
                <div className="park-amount">
                  <span className="liang-unit">200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="left-bottom">
          <div className="second-title">排行榜tops</div>
          <div className="panel-wrap">
            <div className="panel-title">
              <div className="list-title">订单数排行榜</div>
              <div className="list-item-title">
                <span className="title-one">名次</span>
                <span className="title-second">停车场</span>
                <span className="title-third">数量</span>
              </div>
            </div>
            <div className="tab-wrap">
              <Tabs
                defaultActiveKey="1"
                onChange={this.onTabChange}
                tabPosition="bottom"
              >
                <TabPane tab={<span className="panel-dot"></span>} key="1">
                  {this.renderParks(list1)}
                </TabPane>
                <TabPane tab={<span className="panel-dot"></span>} key="2">
                  {this.renderParks(list2)}
                </TabPane>
                <TabPane tab={<span className="panel-dot"></span>} key="3">
                  {this.renderParks(list3)}
                </TabPane>
                <TabPane tab={<span className="panel-dot"></span>} key="4">
                  {this.renderParks(list4)}
                </TabPane>
                <TabPane tab={<span className="panel-dot"></span>} key="5">
                  {this.renderParks(list5)}
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeftContent;