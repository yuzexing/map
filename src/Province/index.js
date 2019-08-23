import React, { Component } from 'react';
import get from 'lodash/get';
import { Select, Breadcrumb } from 'antd';
import CountUp from 'react-countup';
import image from '../resource/image/logo.png';
import location from '../resource/image/location.png';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import BottomContent from './BottomContent';
import area from '../resource/data/area.js';
import parkList from '../resource/data/parkRealData.js';
import parkOrderList from '../resource/data/parkOrderList.js';
import './index.css';


const moment = window.moment;
const Option = Select.Option;


const STATE_PARK = 'park';
const STATE_CITY = 'city';

const initCity = '重庆';


class Map extends Component {

  state = {
    time: moment().format('YYYY年MMMDo dddd ah:mm'),
    currentAdcode: 500000,
    countryName: initCity,
    currentState: STATE_CITY,
    // currentState: STATE_PARK,
    startMoney: 4000,
    endMoney: 12826,
    breadList: [{ name: initCity, adcode: 500000 }],
  }

  init = true;

  constructor(props) {
    super(props);
    // start timer
    setInterval(() => {
      const time = moment().format('YYYY年MMMDo dddd ah:mm');
      const { time: oldTime } = this.state;
      if (time !== oldTime) {
        this.setState({
          time,
        });
      }
    }, 1000);
    const time = 1000 * 60 * 60 * 2;
    setTimeout(() => {
      window.location.reload(true);
    }, time);
    // 统计初始化数据
    // 市总金额
    this.state.endMoney = parseInt(12826 * this.getTimeRate());
  }

  getTimeRate = () => {
    return moment().hour() / 24;
  }

  componentDidMount() {
    const map = new window.AMap.Map('container', {
      layers: [],
      features: [],
      zoom: 4,
      mapStyle: 'amap://styles/8a86a4429d9ce1a16a59a1adbf1ec697',
      rotateEnable: false,
      dragEnable: true,
      zoomEnable: true,
      doubleClickZoom: false,
      keyboardEnable: false,
      scrollWheel: true,
      touchZoom: false,
      viewMode: "3D", //开启3D视图,默认为关闭
      pitch: 30,
    });
    map.remove(map.getLayers());
    this.map = map;
    window.AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], this.initMap);
    this.moneyAdd();
    setTimeout(() => {
      if (this.mapRef) {
        this.mapRef.style.opacity = 1;
      }
    }, 800);
    this.reloadData();
  }

  getMapRef = (ref) => {
    this.mapRef = ref;
  };

  getAreaMap = (ref) => {
    this.areaMapRef = ref;  
  };

  getAreaMapWrap = (ref) => {
    this.areaMapRefWrap = ref;  
  };

  initMap = (DistrictExplorer, $) => {
    window.DistrictExplorer = DistrictExplorer;
    const map = this.map;
    const _this = this;
    const { currentAdcode } = this.state;
    const AMap = window.AMap;
      //创建一个实例
    const districtExplorer = window.districtExplorer = new DistrictExplorer({
      eventSupport: true, // 打开事件支持
      map: map
    });
    this.districtExplorer = districtExplorer;

    //当前聚焦的区域
    var currentAreaNode = null;
    const setListener = () => {

      districtExplorer.off('featureMouseout featureMouseover featureMousemove featureClick');
      
      //根据Hover状态设置相关样式
      function toggleHoverFeature(feature, isHover, position) {
        if (!feature) {
          return;
        }
        var props = feature.properties;
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
    });
    //feature被点击
    districtExplorer.on('featureClick', function(e, feature) {
      var props = feature.properties;
      //如果存在子节点
      const { name, adcode } = get(feature, 'properties');
      if (props.childrenNum > 0) {
        //切换聚焦区域
        switch2AreaNode(props.adcode);
        _this.onAreaClick(name, adcode, false);
      } else {
        renderBottomFeature(feature);
        _this.onAreaClick(name, adcode, false);
      }
    });
  }
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

    /**
     * 县级区级尺度
     */
    const renderBottomFeature = (feature) => {
      this.createParkMap(feature);
      // districtExplorer.loadAreaNode(feature.properties.adcode, (error, areaNode) => {
      //   currentAreaNode = window.currentAreaNode = areaNode;

      //   //设置当前使用的定位用节点
      //   districtExplorer.setAreaNodesForLocating([currentAreaNode]);
      //   console.log(error);
      //   console.log(areaNode);
      // });
      
      // //清除已有的绘制内容
      // districtExplorer.clearFeaturePolygons();

      // map.clearMap();
      
      // districtExplorer.renderFeature(feature, {
      //   cursor: 'default',
      //   bubble: true,
      //   strokeColor: '#016CAA', //线颜色
      //   strokeOpacity: 1, //线透明度
      //   strokeWeight: 1, //线宽
      //   fillColor: '#004074', //填充色
      //   fillOpacity: 1, //填充透明度
      // });
      // const polygons = districtExplorer.getAllFeaturePolygons();
      // map.setFitView(polygons, true, [50, 50, 100, 100]);
      // districtExplorer.off('featureMouseout featureMouseover featureMousemove featureClick');
      // const marker = new window.AMap.Marker({
      //   position: get(feature, 'properties.center'),
      //   anchor: 'center',
      //   content: `<div class='wave solid dot-blue'><div class='circle'></div><div class='content fa fa-bell'><i class=''></i></div></div>`,
      //   label: {
      //     content: `<div class='parkName'>${get(feature, 'properties.name')}</div>`,
      //     direction: 'bottom',
      //   },
      //   offset: new window.AMap.Pixel(0, 0),
      //   bubble: true,
      // });
      // map.add(marker);
      // const p = polygons[0];
      // const path = p.getPath()[0] || [];
      // let park = findPark(path, p);
      // if (!park || park.length === 0) park = findPark(path, p);
      // if (!park || park.length === 0) park = findPark(path, p);
      // if (!park || park.length === 0) park = findPark(path, p);
      
      // park.forEach((i) => {
      //   const m = new window.AMap.Marker({
      //     position: i,
      //     anchor: 'center',
      //     content: `<div class='wave solid dot-yellow'><div class='circle'></div><div class='content fa fa-bell'><i class=''></i></div></div>`,
      //     label: {
      //       content: `<div class='parkName'>${'智能停车场'}</div>`,
      //       direction: 'bottom',
      //     },
      //     offset: new window.AMap.Pixel(0, 0),
      //     bubble: false,
      //   });
      //   m.on('click', () => {
      //     _this.handleSelectPark();
      //   });
      //   map.add(m);
      // });
    }

    //绘制某个区域的边界
    function renderAreaPolygons(areaNode) {
      //清除已有的绘制内容
      districtExplorer.clearFeaturePolygons();
      map.clearMap();
      //绘制子区域
      districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
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
        // strokeWeight: 4,
      });
      map.setFitView(districtExplorer.getAllFeaturePolygons(), true, [50, 50, 100, 100]);
    }

    //切换区域后刷新显示内容
    function refreshAreaNode(areaNode) {

      districtExplorer.setHoverFeature(null);

      renderAreaPolygons(areaNode);

      renderAreaPoint(areaNode);
    }

    //切换区域
    function switch2AreaNode(adcode, callback) {

      setListener();

      if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
        return;
      }

      loadAreaNode(adcode, (error, areaNode) => {
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

  }

  moneyAdd = () => {
    const time = 8000 + parseInt(Math.random() * 10000);
    setTimeout(() => {
      const { endMoney } = this.state;
      const newMoney = parseInt(endMoney) + parseInt((0 + Math.random() * 10));
      this.setState({
        startMoney: +endMoney,
        endMoney: +newMoney,
      });
      this.moneyAdd();
    }, time);
  };

  createParkMap = (feature) => {
    if (this.areaMapRef) {
      this.areaMapRef.style.opacity = 0;
    }
    const list = feature.geometry.coordinates;
    const mask = [];
    list.forEach((i) => {
      i.forEach((k) => {
        k.forEach((j) => {
          if (Array.isArray(j)) {
            mask.push(j);
          } else {
            mask.push([j.lng, j.lat])
          }
        });
      });
    });
    this.mapRef.style.display = 'none';
    this.mapRef.style.opacity = 0;
    this.areaMapRefWrap.style.display = 'block';
    const map = new window.AMap.Map('areaMapContainer', {
      zoom: 4,
      mapStyle: 'amap://styles/17d8fd383666128008fea137b6eb830d',
      rotateEnable: false,
      dragEnable: true,
      zoomEnable: true,
      doubleClickZoom: false,
      keyboardEnable: false,
      scrollWheel: true,
      touchZoom: false,
      viewMode: "3D", //开启3D视图,默认为关闭
      pitch: 45,
      mask: mask,
    });
    this.areaMap = map;
    const layer = map.getLayers();
    layer[0].setzIndex(500);
    if (this.areaMapRef) {
      setTimeout(() => {
        this.areaMapRef.style.opacity = 1;
      }, 800);
    }

    const districtExplorer = new window.DistrictExplorer({
      eventSupport: true, // 打开事件支持
      map: map
    });
    this.currentAreaAdcode = feature.properties.adcode;
    this.areaDistrictExplorer = districtExplorer;
    
    // const getRandomPoint = (path) => {
    //   const index = parseInt(Math.random() * path.length, 10);
    //   const { lat, lng } = path[index];
    //   const p = new window.AMap.LngLat(lng, lat);
    //   const ln = Math.random() * 10000;
    //   const la = Math.random() * 10000;
    //   const offset = p.offset(1000 + ln * 5, 1000 + la * 5);
    //   return offset;
    // }
    // const findPark = (path, p) => {
      
    //   const positionList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => getRandomPoint(path))
    //     .filter((i) => p.contains(i))
    // }

    // districtExplorer.loadAreaNode(feature.properties.adcode, (error, areaNode) => {
    //     currentAreaNode = window.currentAreaNode = areaNode;

    //     //设置当前使用的定位用节点
    //     districtExplorer.setAreaNodesForLocating([currentAreaNode]);
    //   });
      
    //   //清除已有的绘制内容
      districtExplorer.clearFeaturePolygons();

      map.clearMap();
      
      districtExplorer.renderFeature(feature, {
        cursor: 'default',
        bubble: true,
        strokeColor: '#016CAA', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        fillColor: '#004074', //填充色
        fillOpacity: 0, //填充透明度
        zIndex: -1000,
      });
      const polygons = districtExplorer.getAllFeaturePolygons();
      // map.setFitView(polygons, true, [50, 50, 100, 100]);
      // districtExplorer.off('featureMouseout featureMouseover featureMousemove featureClick');
      const marker = new window.AMap.Marker({
        position: get(feature, 'properties.center'),
        anchor: 'center',
        content: `<div class='wave solid dot-blue'><div class='circle'></div><div class='content fa fa-bell'><i class=''></i></div></div>`,
        label: {
          content: `<div class='parkName'>${get(feature, 'properties.name')}</div>`,
          direction: 'bottom',
        },
        offset: new window.AMap.Pixel(0, 0),
        bubble: true,
      });
      map.add(marker);
      let park = [];
      if ([500111, 500231, 500105, 500106, 500112].includes(this.currentAreaAdcode)) {
        // 自有数据
        park = parkList.filter(({ adcode }) => adcode == this.currentAreaAdcode);
      } else {
      // 造数据
        // const p = polygons[0];
        // const path = p.getPath()[0] || [];
        // park = findPark(path, p);
        // if (!park || park.length === 0) park = findPark(path, p);
        // if (!park || park.length === 0) park = findPark(path, p);
        // if (!park || park.length === 0) park = findPark(path, p);
      }
      const bounds = [];
      if (park.length > 0) {
        park && park.forEach(({ position, name, adcode }) => {
          const [lng, lat] = position.split(',');
          const p = new window.AMap.LngLat(lng, lat);
          const m = new window.AMap.Marker({
            position: p,
            anchor: 'center',
            content: `<div class='wave solid dot-yellow'><div class='circle'></div><div class='content fa fa-bell'><i class=''></i></div></div>`,
            label: {
              content: `<div class='parkName'>${name}</div>`,
              direction: 'bottom',
            },
            offset: new window.AMap.Pixel(0, 0),
            bubble: false,
          });
          bounds.push(m);
          m.on('click', () => {
            this.handleSelectPark(name);
          });
          map.add(m);
        });
        map.setFitView(bounds, true, [0, 0, 0, 0]);
      } else {
        map.setFitView(polygons, true, [0, 0, 0, 0]);
      }
  }

  onAreaClick = (name, adcode) => {
    // const seatNumber = parkList.filter(({ adcode: a }) => a == adcode).reduce((total, c) => total + parseInt(c.seatNumber), 0);
    const breadList = [
      {
        name: initCity,
        adcode: 500000,
      },
      {
        name,
        adcode: adcode,
      },
    ];
    this.setState({
      breadList,
    });
    this.reloadData();
  };

  loadFeature = (adcode) => {
    this.districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
      const feature = areaNode.getParentFeature();
      this.createParkMap(feature);
    });
  };

  handleChange = (adcode) => {
    this.changeAreaMap(adcode);
    const { name } = area.find(({ adcode: code }) => code == adcode);
    this.onAreaClick(name, adcode, false);
  };

  // handleChange = adcode => {
  //   const { currentState } = this.state;
  //   if (currentState === STATE_PARK) {
  //     this.changeMap();
  //     this.setState({
  //       currentState: STATE_CITY,
  //     });
  //   }
  //   const { name } = area.find(({ adcode: code }) => code == adcode);
  //   this.setState({
  //     currentAdcode: adcode,
  //     // countryName: this.handleConutryName(name),
  //     breadList: [{name, adcode}],
  //   });
  //   this.switch2AreaNode(adcode);
  // };

  handleSelectPark = (paName) => {
    // TODO: check
    const { adcode } = parkList.find(({ name }) => paName === name);
    const { name: cityName } = area.find(({ adcode: code }) => code == adcode);
    const breadList = [
      {
        name: initCity,
        adcode: 500000,
      },
      {
        name: cityName,
        adcode: adcode,
      },
      {
        name: paName,
      },
    ];
    this.setState({
      breadList,
    });
    this.setState({
      currentState: STATE_PARK,
    });
    if (/* this.state.currentState === STATE_PARK &&  */this.currentAreaAdcode == adcode) {
      this.reloadData();
      return;
    }
    this.changeAreaMap(adcode);
    this.reloadData();
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
    setTimeout(() => {
      const { breadList } = this.state;
      const len = breadList.length - 1;
      const last = breadList[len];
      if (this.bottomRef) {
        this.bottomRef.reloadData(len, last.name, breadList);
      }
      if (this.leftRef) {
        this.leftRef.reloadData(len, last.name);
      }
      if (this.rightRef) {
        this.rightRef.reloadData(len, last.name, breadList);
      }
      this.indexReloadData(len, last.name);
    });
  };

  indexReloadData = (level, name) => {
    if (level === 0) {
      this.setState({
        endMoney: parseInt(12826 * this.getTimeRate()),
        startMoney: 8000,
      });
    } else if (level === 1) {
      const map = {
        大足区: '927',
        垫江区: '337',
        江北区: '928',
        沙坪坝区: '602',
        渝北区: '100',
      };
      
      this.setState({
        endMoney: parseInt((+map[name] || 0) * this.getTimeRate()),
        startMoney: 500,
      });
    } else {
      const list = this.findLevelParkList(level, name);
      if (Array.isArray(list) && list.length > 0) {
        const item = list[0] || {};
        const taget = parkOrderList.find(({ name: paName }) => paName.includes(item.name) || item.name.includes(paName)) || {};
        this.setState({
          endMoney: parseInt((+taget.income || 0) * this.getTimeRate()),
          startMoney: 0,
        });
      } else {
        this.setState({
          endMoney: 0,
          startMoney: 0,
        });
      }
    }
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

  getBottomRef = (ref) => {
    this.bottomRef = ref;
  };

  getLeftRef = (ref) => {
    this.leftRef = ref;
  };

  getRightRef = (ref) => {
    this.rightRef = ref;
  };

  switch2Adcode = (adcode, index) => {
    // 展示上一级地图
    const { breadList } = this.state;
    const newBread = breadList.slice(0, index + 1);
    this.setState({
      breadList: newBread,
    });
    if (index !== 2) {
      this.setState({
        currentState: STATE_CITY,
      });
    }
    if (/* this.state.currentState === STATE_PARK && */ this.currentAreaAdcode == adcode) {
      
    } else {
      this.changeMap();
      this.setState({
        currentState: STATE_CITY,
      });
      this.switch2AreaNode(adcode);
    }
    this.reloadData();
  };

  changeMap = () => {
    if (!this.areaMap) {
      return;
    }
    this.areaMap.destroy();
    this.areaMap = null;
    this.mapRef.style.display = 'block';
    this.mapRef.style.opacity = 1;
    this.areaMapRefWrap.style.display = 'none';
    this.areaMapRef.style.opacity = 0;
  };

  changeAreaMap = (adcode) => {
    this.loadFeature(adcode);
  };

  render() {
    const { time, currentAdcode, countryName, currentState, startMoney, endMoney, breadList } = this.state;
    const isPark = currentState === STATE_PARK;
    const breadListLen = breadList.length;
    return (
      <div className="container">
        <div id="top" className="top">
          <div className="top-line">
            <div>
              <img alt="" src={image} className="logo" />
              <span className="time">
                {time}
              </span>
            </div>
            <Breadcrumb>
            {
              breadList.map(({ name, adcode }, index) => {
                const canClick = index !== (breadListLen - 1);
                return (
                  <Breadcrumb.Item key={adcode + index}>
                    <span className={`bread-item ${canClick ? 'active' : 'current'}`} onClick={canClick ? () => this.switch2Adcode(adcode, index) : null}>{name}</span>
                  </Breadcrumb.Item>
                );
              })
            }
            </Breadcrumb>
          </div>
          <div className="title">
            {countryName}智慧停车大数据平台
          </div>
          <div className="right-option">
            <Select
              style={{ width: 120 }}
              onChange={this.handleSelectPark}
              placeholder="请选择停车场"
              className="city-select"
            >
              {
                parkList.map(({ adcode, name }) => <Option value={name} key={name}>{name}</Option>)
              }
            </Select>
            <Select
              // defaultValue={} // 重庆 500000
              style={{ width: 100, marginRight: 12 }}
              onChange={this.handleChange}
              placeholder="请选择区域"
              className="city-select"
            >
              {
                area.map(({ name, adcode }) => <Option value={adcode} key={adcode}>{name}</Option>)
              }
            </Select>
            <span className="location-city-name">重庆</span>
            <img alt="" src={location} className="location" />
          </div>
        </div>
        <div id="center" className="center">
          <div id="left" className="left">
            <LeftContent ref={this.getLeftRef} currentState={currentState} />
          </div>
          <div id="inner-center" className="inner-center">
            <div id="inner-top" className="inner-top">
              <CountUp
                className="total-price-wrap"
                start={startMoney}
                end={endMoney}
                duration={2}
                formattingFn={(value) => {
                  const str = String(value).split('');
                  const len = str.length;
                  const arr = str.map((i, idx) => {
                    if (i === '.') {
                      return `<div class="dot"></div>`;
                    }
                    const style = /* idx === (len - 4) ? 'no-margin' : */ '';
                    return (
                      `<div class="card-number ${style}">${i}</div>`
                    );
                  });
                  if (len < 5) {
                    const diff = 5-len;
                    Array(diff).fill(0).forEach(() => {
                      arr.unshift(`<div class="card-number"></div>`);
                    });
                  }
                  arr.push(`<div class="price-unit">元</div>`);
                  return arr.join('');
                }}
                decimals={0}
              >
              </CountUp>
            </div>
            {
              isPark ? 
              <div id="map-center" className="map-center">
                <div className="map-legend">
                  <div className="legend-item blue">地域名</div>
                  <div className="legend-item yellow">停车场</div>
                </div>
              </div>
              :
              <div id="map-center" className="map-center">
                <div className="map-legend">
                  <div className="legend-item">严重区</div>
                  <div className="legend-item yellow">较严重区</div>
                  <div className="legend-item blue">非严重区</div>
                </div>
              </div>
            }
            <div id="inner-bottom" className="inner-bottom">
              <BottomContent ref={this.getBottomRef} />
            </div>
          </div>
          <div id="right" className="right">
            <RightContent ref={this.getRightRef} currentState={currentState} />
          </div>
        </div>

        <div className="map-wrap">
          <div id="container" ref={this.getMapRef} className="map-container"></div>
        </div>
        <div className="area-map-wrap" ref={this.getAreaMapWrap}>
          <div id="areaMapContainer" ref={this.getAreaMap} className="area-map-container"></div>
        </div>
      </div>
    );
  }
}

export default Map;