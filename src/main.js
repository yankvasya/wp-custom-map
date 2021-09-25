require('./index.html');

ymaps.ready(init);

let currentCoordinates = [];
const balloon = `<form class="form" id="form" action="">
                    <label><h2 class="map__feedback">Отзыв:</h2></label>
                    <label><input class="form__name" name="name" type="text" placeholder="Укажите ваше имя"></label>
                    <label><input class="form__location" name="location" type="text" placeholder="Укажите место"></label>
                    <label><textarea class="form__review" name="review" id="review" cols="40" rows="4" placeholder="Оставьте отзыв"></textarea></label>
                    <label><button id="submit" type="submit">Добавить</button></label>
                    </form>`;
let placemarks = takeAllPlacemarks();
let geoObjects = [];
let newGeoObjects = [];


function init() {
    const map = new ymaps.Map('map', {
        center: [55.75, 37.64],
        zoom: 12,
        controls: [
           'zoomControl'
        ],
        behaviors: ['drag']
    });
    const cluster = new ymaps.Clusterer({
        clusterIcons: [
            {
                href: 'https://static.thenounproject.com/png/331066-200.png',
                size: [70, 70],
                offset: [-35, -35]
            }
        ],
    });

    setInterval(checkNewPlacemarks, 500)


    for (const mark of placemarks) {
       const { latitude, longitude, hintContent, balloonContent } = mark;
       geoObjects.push(new ymaps.Placemark([latitude, longitude],
           {
               hintContent: `<div class="map__hint">${hintContent}</div>`,
               balloonContent: balloonContent
           },
           {
               iconLayout: 'default#image',
               iconImageHref: 'https://cdn-icons-png.flaticon.com/512/506/506403.png',
               iconImageSize: [30, 30],
               iconImageOffset: [-15, -30]
           }
       ));
    }

    map.geoObjects.add(cluster);
    cluster.add(geoObjects);

    function checkNewPlacemarks() {
        if(newGeoObjects.length) {
            (function () {
                map.geoObjects.add(cluster);
                cluster.add(newGeoObjects);
                newGeoObjects = [];
                console.log('новый элемент добавлен');
            })();
        }
    }

    map.events.add('click', function (e) {
        if (!map.balloon.isOpen()) {
            var coords = e.get('coords');
            map.balloon.open(coords, {
                contentFooter: checkLocalStorage(coords),
                contentBody: balloon
                // contentHeader:'Событие!',
            });
        }
        else {
            map.balloon.close();
        }
    });
}

function checkLocalStorage([latitude, longitude]) {
    const coords = `<div>Новая точка</div>
                    <div>Ширина: ${latitude}</div>
                    <div>Долгота: ${longitude}</div>`

    currentCoordinates = [latitude, longitude];

    return coords;
}

function takeAllPlacemarks() {
    let allPlacemarks = [];

    for (key in localStorage) {
        let arrayPlacemark = {};
        const coordsSplited = key.split(',');

        if(Number(!isNaN(Number(coordsSplited[0])) && !isNaN(Number(coordsSplited[0])))) {
            if(coordsSplited[0] !== undefined && coordsSplited[1] !== undefined) {
                const newCoords = [Number(coordsSplited[0].substr(0,5)),
                    Number(coordsSplited[1].substr(0,5))
                ];

                arrayPlacemark = {
                    latitude: newCoords[0],
                    longitude: newCoords[1],
                    hintContent: `<div class="map__hint">Широта: ${newCoords[0]}; Долгота: ${newCoords[1]}</div>`,
                    balloonContent: balloon
                }

                allPlacemarks.push(arrayPlacemark);
            }
        }
    }

    return allPlacemarks;
}

document.addEventListener('click', (e) => {
      e.preventDefault();
      addNewPlaceMark(e);
  });

function addNewPlaceMark(e) {
    if(e.target.tagName === 'BUTTON') {
        e.preventDefault();
        const form = e.target.closest('form');
        const name = form.elements.name.value;
        const location = form.elements.location.value;
        const review = form.elements.review.value;
        const infoPlacemark = {
            name: name,
            location: location,
            review: review
        };
        const stringInfo = JSON.stringify(infoPlacemark);
        const close = document.querySelector('.ymaps-2-1-79-balloon__close-button');

        newGeoObjects.push(new ymaps.Placemark([currentCoordinates[0], currentCoordinates[1]],
                    {
                        hintContent: `<div class="map__hint">Ширина: ${currentCoordinates[0]}; Долгота: ${currentCoordinates[1]}</div>`,
                        balloonContent: balloon
                    },
                    {
                        iconLayout: 'default#image',
                        iconImageHref: 'https://cdn-icons-png.flaticon.com/512/506/506403.png',
                        iconImageSize: [30, 30],
                        iconImageOffset: [-15, -30]
                    }
                ));



        localStorage[currentCoordinates] = stringInfo;
        close.dispatchEvent(new Event("click", {bubbles: true}));
    }
}
