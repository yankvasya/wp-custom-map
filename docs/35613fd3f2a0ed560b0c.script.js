(self.webpackChunkwp_project=self.webpackChunkwp_project||[]).push([[514],{766:(e,t,o)=>{"use strict";o.r(t),o.d(t,{default:()=>n});const n='<!doctype html> <html lang="ru"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>CUSTOM MAP | WP PROJECT</title> </head> <body> <div class="wrapper"> <div class="container"> <div id="map" class="map"></div> </div> </div> <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU"><\/script> </body> </html> '},225:(e,t,o)=>{o(766),ymaps.ready((function(){const e=new ymaps.Map("map",{center:[55.75,37.64],zoom:12,controls:["zoomControl"],behaviors:["drag"]}),t=new ymaps.Clusterer({clusterDisableClickZoom:!0,clusterBalloonPanelMaxMapArea:0,clusterBalloonContentLayoutWidth:330,clusterBalloonContentLayoutHeight:470,clusterBalloonPagerVisible:!1,clusterBalloonContentLayout:"cluster#balloonCarousel",clusterBalloonContentBodyLayout:"cluster#balloonAccordionContent",clusterIcons:[{href:"https://i.ibb.co/2M1V4T3/claster.png",size:[100,100],offset:[-50,-50]}]});setInterval((function(){i.length&&function(){for(const e of i){const{latitude:t,longitude:o}=e;s.push(new ymaps.Placemark([t,o]))}e.geoObjects.add(t),t.add(i),i=[],console.log("новый элемент добавлен")}()}),50);for(const e of a){const{latitude:t,longitude:o,hintContent:n,balloonContent:l}=e;s.push(new ymaps.Placemark([t,o],{hintContent:`<div class="map__hint">${n}</div>`,balloonContent:l},{iconLayout:"default#image",iconImageHref:"https://cdn-icons-png.flaticon.com/512/506/506403.png",iconImageSize:[30,30],iconImageOffset:[-15,-30]}))}e.geoObjects.add(t),t.add(s),e.events.add("click",(function(t){if(e.balloon.isOpen())e.balloon.close();else{const o=t.get("coords");e.balloon.open(o,{contentFooter:c(o),contentBody:l()})}})),t.events.add(["mouseenter","mouseleave","click"],(function(e){const t=e.get("target"),o=e.get("type"),a=e.get("coords");t.getGeoObjects,"click"===o&&(n=a,l(a))}))}));let n=[];const l=(e,t)=>r(e,t);let a=function(){let e=[];for(const t in localStorage){let o={};const n=t.split(",");if(Number(!isNaN(Number(n[0]))&&!isNaN(Number(n[0])))&&void 0!==n[0]&&void 0!==n[1]){const t=[Number(n[0].substr(0,5)),Number(n[1].substr(0,5))];o={latitude:t[0],longitude:t[1],hintContent:`<div class="map__hint">Широта: ${t[0]}; Долгота: ${t[1]}</div>`,balloonContent:r(`[${t[0]}, ${t[1]}]`)},e.push(o)}}return e}(),s=[],i=[];function c([e,t]){const o=`<div class="geo-info">\n                        <div>Новая точка</div>\n                        <div>\n                            <span>Ширина: ${e}</span>\n                            <span>Долгота: ${t}</span>\n                        </div>\n                    </div>`;return n=[e,t],o}function r(e,t){const o='<form class="form" id="form" action="" autocomplete="off">\n                    <label><h2 class="map__feedback" >Отзыв:</h2></label>\n                    <label><input class="form__name" name="name" type="text" placeholder="Укажите ваше имя" autocomplete="off"></label>\n                    <label><input class="form__location" name="location" type="text" placeholder="Укажите место" autocomplete="off"></label>\n                    <label><textarea class="form__review" name="review" id="review" cols="40" rows="4" placeholder="Оставьте отзыв" autocomplete="off"></textarea></label>\n                    <label><button class="form__submit-button" id="submit" type="submit">Добавить</button></label>\n                    </form>';return e?function(e,t,o){const n=function(e){"object"==typeof e&&(e=`[${e[0].toString().substr(0,5)}, ${e[1].toString().substr(0,5)}]`);let t={};for(const o in localStorage){const n=o.split(",");if(Number(!isNaN(Number(n[0]))&&!isNaN(Number(n[1])))&&void 0!==n[0]&&void 0!==n[1]){const l=[Number(n[0].substr(0,5)),Number(n[1].substr(0,5))];console.log(o);const a=[],s=e.split("[").join("").split("]").join("").split("'").join("").split(", ");for(const e of s)a.push(Number(e));a[1]===l[1]&&a[0]===l[0]&&Object.assign(t,{[o]:localStorage[o]})}}return t}(e);return function(e,t){let o="";if(Array.isArray(e))for(const t of e)o+=u(t);else o+=u(e);return`<ul class="old-reviews">${o}</ul> <form class="form" id="form" action="" autocomplete="off">\n                    <label><h2 class="map__feedback" >Отзыв:</h2></label>\n                    <label><input class="form__name" name="name" type="text" placeholder="Укажите ваше имя" autocomplete="off"></label>\n                    <label><input class="form__location" name="location" type="text" placeholder="Укажите место" autocomplete="off"></label>\n                    <label><textarea class="form__review" name="review" id="review" cols="40" rows="4" placeholder="Оставьте отзыв" autocomplete="off"></textarea></label>\n                    <label><button class="form__submit-button" id="submit" type="submit">Добавить</button></label>\n                    </form>`}(t||function(e){let t=[];if("{}"===JSON.stringify(e))return!1;for(const o in e)t.push(JSON.parse(e[o]));return t}(n))}(e,t):o}function u(e){const{name:t,location:o,review:n}={name:void 0!==e.name&&e.name.length>0?e.name:"...",location:void 0!==e.location&&e.location.length>0?e.location:"...",review:void 0!==e.review&&e.review.length>0?e.review:"..."};return`<li class="old-review">\n                            <div class="old-review__name">${t}</div>\n                            <div class="old-review__location">[${o}]</div>\n                            <div class="old-review__review">${n}</div>\n                            </li>`}document.addEventListener("click",(e=>{"BUTTON"===e.target.tagName&&e.target.classList.contains("form__submit-button")&&(e.preventDefault(),function(e){const t=e.target.closest("form"),o=t.elements.name.value,a=t.elements.location.value,s=t.elements.review.value,c={name:o,location:a,review:s},r=JSON.stringify(c);localStorage[n]=r,i.push(new ymaps.Placemark([n[0],n[1]],{hintContent:`<div class="map__hint">Ширина: ${n[0]}; Долгота: ${n[1]}</div>`,balloonContent:l([n[0],n[1]],{name:o,location:a,review:s})},{iconLayout:"default#image",iconImageHref:"https://cdn-icons-png.flaticon.com/512/506/506403.png",iconImageSize:[30,30],iconImageOffset:[-15,-30]})),document.querySelector(".ymaps-2-1-79-balloon__close-button").dispatchEvent(new Event("click",{bubbles:!0}))}(e))}))}},e=>{e(e.s=225)}]);