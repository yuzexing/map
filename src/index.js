import React from 'react';
// import t from 'requirejs';
import ReactDOM from 'react-dom';
import './resource/theme/customed.js';
import './index.css';
import App from './Province';

window.moment.locale('zh-cn');


// server key=ba9395cee0ff7f7d2bac886862976a9c
// js key=780252de883f65c6c39b3cad39a334c6

ReactDOM.render(<App />, document.getElementById('root'));
