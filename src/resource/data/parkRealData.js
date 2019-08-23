const a = [
  {"name":"宏声广场西","position":"105.730911729601,29.70869140625","address":"北环中路宏声文化广场","area":"大足","seatNumber":"22","adcode":"500111"},
  {"name":"宏声广场东","position":"105.732460666233,29.708492838542","address":"北环中路宏声文化广场","area":"大足","seatNumber":"22","adcode":"500111"},
  {"name":"圣迹公园南","position":"105.748228352865,29.677599826389","address":"圣迹公园路","area":"大足","seatNumber":"36","adcode":"500111"},
  {"name":"圣迹公园北","position":"105.752035590278,29.682161187066","address":"圣迹公园路","area":"大足","seatNumber":"92","adcode":"500111"},
  {"name":"圣迹公园西","position":"105.748527560764,29.679959309896","address":"圣迹公园","area":"大足","seatNumber":"16","adcode":"500111"},
  {"name":"宏声广场北","position":"105.730724555122,29.710277777778","address":"政府二环北路东段1","area":"大足","seatNumber":"14","adcode":"500111"},
  {"name":"广电大厦停车场","position":"105.743591037327,29.698082411025","address":"棠凤路","area":"大足","seatNumber":"14","adcode":"500111"},
  {"name":"棠凤路停车场","position":"105.758148600261,29.688013237848","address":"二环南路788号","area":"大足","seatNumber":"14","adcode":"500111"},
  {"name":"清明桥2停车场","position":"105.748181694879,29.701135253907","address":"清明桥路95号","area":"大足","seatNumber":"98","adcode":"500111"},
  {"name":"双塔路停车场","position":"105.722850477431,29.70454779731","address":"双塔路","area":"大足","seatNumber":"13","adcode":"500111"},
  {"name":"龙都花园A栋停车场","position":"105.729950358073,29.704841037327","address":"龙都花园A栋","area":"大足","seatNumber":"9","adcode":"500111"},
  {"name":"香榭雅筑停车场","position":"105.72754421658,29.711875","address":"北环二路与建新路交叉口东北200米","area":"大足","seatNumber":"34","adcode":"500111"},
  {"name":"旺福名居停车场1","position":"105.727400987414,29.71169108073","address":"建新路旺福名居","area":"大足","seatNumber":"35","adcode":"500111"},
  {"name":"旺福名居停车场4","position":"105.72620795356,29.712513020834","address":"旺福名居","area":"大足","seatNumber":"18","adcode":"500111"},
  {"name":"旺福名居停车场3","position":"105.726249457466,29.711736924914","address":"旺福名居","area":"大足","seatNumber":"7","adcode":"500111"},
  {"name":"圣迹西路停车场","position":"105.746503634983,29.683591579862","address":"圣迹西路","area":"大足","seatNumber":"22","adcode":"500111"},
  {"name":"锦绣南山停车场","position":"105.727526041667,29.695502929688","address":"锦绣南山","area":"大足","seatNumber":"38","adcode":"500111"},
  {"name":"西城国际停车场","position":"105.71755967882,29.698233506945","address":"西城国际西禅路","area":"大足","seatNumber":"132","adcode":"500111"},
  {"name":"翠屏安置房停车场","position":"105.718212619358,29.69561577691","address":"西禅路","area":"大足","seatNumber":"63","adcode":"500111"},
  {"name":"碧玉江南停车场","position":"105.727253960504,29.697218967014","address":"翠溪路碧玉江南","area":"大足","seatNumber":"16","adcode":"500111"},
  {"name":"半岛明珠停车场","position":"105.714531792535,29.702323133681","address":"滨河南路半岛明珠","area":"大足","seatNumber":"40","adcode":"500111"},
  {"name":"龙岗西路停车场","position":"105.716088053386,29.702464463976","address":"龙岗西路300号","area":"大足","seatNumber":"12","adcode":"500111"},
  {"name":"大荣路停车场","position":"105.709659016928,29.697665473091","address":"大荣路贵和苑","area":"大足","seatNumber":"59","adcode":"500111"},
  {"name":"碧玉江南2停车场","position":"105.729747450087,29.696729329428","address":"碧玉江南后羽绒厂家属院","area":"大足","seatNumber":"12","adcode":"500111"},
  {"name":"宏运商业城停车场","position":"105.74171983507,29.703020562066","address":"北环路苏舒布艺加工厂","area":"大足","seatNumber":"40","adcode":"500111"},
  {"name":"老车站停车场","position":"105.722856987848,29.699608832466","address":"双塔路218号","area":"大足","seatNumber":"15","adcode":"500111"},
  {"name":"碧玉江南3停车场","position":"105.727921006945,29.697869737414","address":"翠溪路碧玉江南","area":"大足","seatNumber":"34","adcode":"500111"},
  {"name":"温州商贸城东停车场","position":"107.373078884549,30.320868598091","address":"重庆市垫江区牡丹大道86号附近","area":"垫江","seatNumber":"35","adcode":"500231"},
  {"name":"温州商贸城西停车场","position":"107.37253092448,30.321541069879","address":"重庆市垫江区牡丹大道24号附近","area":"垫江","seatNumber":"302","adcode":"500231"},
  {"name":"新城绿洲地面停车场","position":"106.53159857856,29.578825954862","address":"重庆市江北区渝澳大道69号","area":"江北","seatNumber":"32","adcode":"500105"},
  {"name":"沙坪坝天鑫花园东门占道停车","position":"106.463603244358,29.542488878039","address":"天鑫花园东门","area":"沙坪坝","seatNumber":"96","adcode":"500106"},
  {"name":"康城路停车场1","position":"106.320740288629,29.580965169271","address":"康城北路","area":"沙坪坝","seatNumber":"97","adcode":"500106"},
  {"name":"至德路西段北侧停车场","position":"106.319826117622,29.615517035591","address":"大学城至德路","area":"沙坪坝","seatNumber":"102","adcode":"500106"},
  {"name":"至德路西段南侧停车场","position":"106.320201822917,29.615344780816","address":"大学城至德路","area":"沙坪坝","seatNumber":"43","adcode":"500106"},
  {"name":"景阳路停车场","position":"106.32200358073,29.615822211372","address":"大学城景阳路","area":"沙坪坝","seatNumber":"73","adcode":"500106"},
  {"name":"景阳路停车场2","position":"106.322684733073,29.614138997396","address":"大学城景阳路","area":"沙坪坝","seatNumber":"41","adcode":"500106"},
  {"name":"至德路中段停车场","position":"106.323917100695,29.614919433594","address":"大学城至德路","area":"沙坪坝","seatNumber":"44","adcode":"500106"},
  {"name":"国鑫路停车场","position":"106.348063151042,29.633943142362","address":"大学城丰文街道国鑫路","area":"沙坪坝","seatNumber":"106","adcode":"500106"},
  {"name":"国博中心展会","position":"106.549559733073,29.720119900174","address":"国博中心展会","area":"渝北","seatNumber":"100","adcode":"500112"},
  ];

export default (() => {
  return a.map((b) => {
    b.bad = Math.random().toFixed(2) + '%';
    b.escape = (Math.random() * 2).toFixed(2) + '%';
    return b;
  });
})();
