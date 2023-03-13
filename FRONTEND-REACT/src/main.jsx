//IMPORTACIONES OBLIGATORIAS DE REACT
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
//IMPORTAR ASSETS ( RECURSOS: HOJAS DE ESTILO, IMAGENES, FUENTES)
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css';
import './assets/css/normalize.css';
import './assets/css/styles.css';
import './assets/css/responsive.css';

//CARGAR configuracion react time ago
import TimeAgo from 'javascript-time-ago';
import es from 'javascript-time-ago/locale/es-PE.json';

TimeAgo.addDefaultLocale(es);
TimeAgo.addLocale(es);


ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
