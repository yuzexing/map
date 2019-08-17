import React, { Component } from 'react';
import get from 'lodash/get';
import { Select } from 'antd';
import image from '../resource/image/logo.png';
import location from '../resource/image/location.png';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import BottomContent from './BottomContent';
import country from '../resource/data/country.js';
import './index.css';

const moment = window.moment;
const Option = Select.Option;

class Map extends Component {

  state = {
    time: moment().format('YYYY年MMMDo dddd ah:mm'),
    currentAdcode: 500000,
    countryName: '重庆',
  }

  init = true;

  constructor(props) {
    super(props);
    setInterval(() => {
      const time = moment().format('YYYY年MMMDo dddd ah:mm');
      const { time: oldTime } = this.state;
      if (time !== oldTime) {
        this.setState({
          time,
        });
      }
    }, 1000);
  }

  componentDidMount() {
    const { currentAdcode } = this.state;
    const _this = this;
    const AMap = window.AMap;
    var map = new window.AMap.Map('container', {
      zoom: 4,
      mapStyle: 'amap://styles/8a86a4429d9ce1a16a59a1adbf1ec697',
      rotateEnable: false,
      dragEnable: false,
      zoomEnable: false,
      doubleClickZoom: false,
      keyboardEnable: false,
      scrollWheel: false,
      touchZoom: false,
    });
    const a = map.getLayers();
    map.remove(a);
    // return;
    //just some colors
    // var colors = [
    //     "#3366cc"/* , "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
    //     "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
    //     "#651067", "#329262", "#5574a6", "#3b3eac" */
    // ];

    window.AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer, $) {
        //创建一个实例
        var districtExplorer = window.districtExplorer = new DistrictExplorer({
            eventSupport: true, // 打开事件支持
            map: map
        });

        //当前聚焦的区域
        var currentAreaNode = null;

        //鼠标hover提示内容
        // var $tipMarkerContent = $('<div class="tipMarker top"></div>');

        // var tipMarker = new window.AMap.Marker({
        //     content: $tipMarkerContent.get(0),
        //     offset: new window.AMap.Pixel(0, 0),
        //     bubble: true
        // });

        //根据Hover状态设置相关样式
        function toggleHoverFeature(feature, isHover, position) {

            // tipMarker.setMap(isHover ? map : null);

            if (!feature) {
              return;
            }

            var props = feature.properties;

            if (isHover) {
              //更新提示内容
              // $tipMarkerContent.html(props.adcode + ': ' + props.name);
              // //更新位置
              // tipMarker.setPosition(position || props.center);
            }

            // $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover);

            //更新相关多边形的样式
            var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
            for (var i = 0, len = polys.length; i < len; i++) {

              polys[i].setOptions({
                fillOpacity: isHover ? 0.7 : 1
              });
            }
        }

        //监听feature的hover事件
        districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
            toggleHoverFeature(feature, e.type === 'featureMouseover',
                e.originalEvent ? e.originalEvent.lnglat : null);
        });

        //监听鼠标在feature上滑动
        districtExplorer.on('featureMousemove', function(e, feature) {
          //更新提示位置
          // tipMarker.setPosition(e.originalEvent.lnglat);
        });

        //feature被点击
        districtExplorer.on('featureClick', function(e, feature) {

          var props = feature.properties;

          //如果存在子节点
          if (props.childrenNum > 0) {
            //切换聚焦区域
            switch2AreaNode(props.adcode);
          }
        });

        //外部区域被点击
        // districtExplorer.on('outsideClick', function(e) {

        //   districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {

        //     if (routeFeatures && routeFeatures.length > 1) {
        //       //切换到省级区域
        //       switch2AreaNode(routeFeatures[1].properties.adcode);
        //     } else {
        //       //切换到全国
        //       // switch2AreaNode(100000);
        //     }

        //   }, {
        //     levelLimit: 2
        //   });
        // });
        const colorStyle = ['dot-red', 'dot-yelow', 'dot-blue'];
        const renderAreaPoint = (areaNode) => {
          const points = get(areaNode, '_data.geoData.sub.features') || [];
          points.forEach(({ properties }) => {
            let random = Math.floor(Math.random() * 3);
            if (random >= 3) random = 2;
            const color = colorStyle[random];
            const marker = new window.AMap.Marker({
              position: properties.center,
              anchor: 'center',
              content: `<div class='wave solid ${color}'><div class='circle'></div><div class='content fa fa-bell'><i class=''></i></div></div>`,
              label: {
                content: `<div class='parkName'>${properties.name}</div>`,
                direction: 'bottom',
              },
              offset: new window.AMap.Pixel(0, 0),
              bubble: true,
            });
            map.add(marker);
          });
        }

        //绘制某个区域的边界
        function renderAreaPolygons(areaNode) {

          //更新地图视野
          // map.setBounds(areaNode.getBounds(), null, null, true);
          // map.setFitView(districtExplorer.getAllFeaturePolygons(), true, [0, 0, 0, 0]);
          // console.log(areaNode);
          // debugger

          //清除已有的绘制内容
          districtExplorer.clearFeaturePolygons();

          map.clearMap();

          //绘制子区域
          districtExplorer.renderSubFeatures(areaNode, function(feature, i) {

            // var fillColor = colors[i % colors.length];
            // var strokeColor = colors[colors.length - 1 - i % colors.length];

            return {
              cursor: 'default',
              bubble: true,
              strokeColor: '#016CAA', //线颜色
              strokeOpacity: 1, //线透明度
              strokeWeight: 1, //线宽
              fillColor: '#004074', //填充色
              fillOpacity: 1, //填充透明度
            };
          });

          //绘制父区域
          districtExplorer.renderParentFeature(areaNode, {
            cursor: 'default',
            bubble: true,
            strokeColor: '#004074', //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 1, //线宽
            fillColor: null, //填充色
            fillOpacity: 0.35, //填充透明度
          });
          // console.log(districtExplorer.getAllFeaturePolygons());
          // map.setFitView(districtExplorer.getAllFeaturePolygons(), true, [200, 200, 300, 300]);
          map.setFitView(districtExplorer.getAllFeaturePolygons(), true, [200, 100, 200, 200]);
        
        }

        //切换区域后刷新显示内容
        function refreshAreaNode(areaNode) {

            districtExplorer.setHoverFeature(null);

            renderAreaPolygons(areaNode);

            renderAreaPoint(areaNode);
        }

        //切换区域
        function switch2AreaNode(adcode, callback) {

            if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
                return;
            }

            loadAreaNode(adcode, function(error, areaNode) {

                if (error) {

                    if (callback) {
                        callback(error);
                    }

                    return;
                }

                currentAreaNode = window.currentAreaNode = areaNode;

                //设置当前使用的定位用节点
                districtExplorer.setAreaNodesForLocating([currentAreaNode]);

                refreshAreaNode(areaNode);

                if (callback) {
                    callback(null, areaNode);
                }
            });
            // TODO:
            if (_this.init) {
              _this.init = false;
              return;
            }
            _this.reloadData();
          }

        //加载区域
        function loadAreaNode(adcode, callback) {

            districtExplorer.loadAreaNode(adcode, function(error, areaNode) {

                if (error) {

                    if (callback) {
                        callback(error);
                    }

                    console.error(error);

                    return;
                }

                if (callback) {
                    callback(null, areaNode);
                }
            });
        }
        // 切换为定位城市
        switch2AreaNode(currentAdcode);
        _this.switch2AreaNode = switch2AreaNode;
    });
  }

  handleChange = adcode => {
    const { name } = country.find(({ adcode: code }) => code === adcode);
    this.setState({ currentAdcode: adcode, countryName: this.handleConutryName(name) });
    this.switch2AreaNode(adcode);
  };

  handleConutryName = (name) => {
    const replaceArr = ['省', '市', "壮族自治区", '自治区', '回族自治区', '维吾尔自治区', '特别行政区'];
    let temp = name;
    replaceArr.forEach((key) => {
      temp = temp.replace(key, '');
    });
    return temp;
  };

  reloadData = () => {
    console.log('test');
    if (this.bottomRef) {
      this.bottomRef.reloadData();
    }
    if (this.leftRef) {
      this.leftRef.reloadData();
    }
    if (this.rightRef) {
      this.rightRef.reloadData();
    }
  };

  getBottomRef = (ref) => {
    this.bottomRef = ref;
  };

  getLeftRef = (ref) => {
    this.leftRef = ref;
  };

  getRightRef = (ref) => {
    this.rightRef = ref;
  };

  render() {
    const { time, currentAdcode, countryName } = this.state;
    return (
      <div className="container">
        <div id="top" className="top">
          <div className="top-line">
            <img alt="" src={image} className="logo" />
            <span className="time">
              {time}
            </span>
          </div>
          <div className="title">
            {countryName}智慧停车大数据平台
          </div>
          <div className="right-option">
            <Select
              style={{ width: 120 }}
              // onChange={this.handleChange}
              placeholder="请选择停车场"
              className="city-select"
            >
              <Option value="test">至德路停车场</Option>
            </Select>
            <Select
              defaultValue={currentAdcode} // 重庆 500000
              style={{ width: 100, marginRight: 12 }}
              onChange={this.handleChange}
              placeholder="请选择省份"
              className="city-select"
            >
              {
                country.map(({ name, adcode }) => <Option value={adcode}>{name}</Option>)
              }
            </Select>
            <span className="location-city-name">重庆</span>
            <img alt="" src={location} className="location" />
          </div>
        </div>
        <div id="center" className="center">
          <div id="left" className="left">
            <LeftContent ref={this.getLeftRef} />
          </div>
          <div id="inner-center" className="inner-center">
            <div id="inner-top" className="inner-top">
              <div className="total-price-wrap">
                <div className="card-number">4</div>
                <div className="card-number">3</div>
                <div className="card-number">3</div>
                <div className="card-number no-margin">8</div>
                <div className="dot"></div>
                <div className="card-number">2</div>
                <div className="card-number">8</div>
                <div className="price-unit">元</div>
              </div>
            </div>
            <div id="map-center" className="map-center">
              <div className="map-legend">
                <div className="legend-item">严重区</div>
                <div className="legend-item yellow">较严重区</div>
                <div className="legend-item blue">非严重区</div>
              </div>
            </div>
            <div id="inner-bottom" className="inner-bottom">
              <BottomContent ref={this.getBottomRef} />
            </div>
          </div>
          <div id="right" className="right">
            <RightContent ref={this.getRightRef} />
          </div>
        </div>

        <div className="map-wrap">
          <div id="container" className="map-container"></div>
        </div>
      </div>
    );
  }
}

export default Map;