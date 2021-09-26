require('./index.html');

ymaps.ready(init);

let currentCoordinates = [];
const balloon = (coords) => takeBalloon(coords);
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
    const customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<h2 class=ballon_header>123</h2>' +
        '<div class=ballon_body>333</div>' +
        '<div class=ballon_footer>333</div>'
    );

    const cluster = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 330,
        clusterBalloonContentLayoutHeight: 400,
        clusterBalloonSidebar: 0,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterIcons: [
            {
                href: 'https://bit.ly/39BCmUT', // https://bit.ly/2Y0lvc3
                size: [50, 50],
                offset: [-25, -25]
            }
        ],
    });

    // интервал на добавление новых плейсмарков
    setInterval(checkNewPlacemarks, 50)

    // Прогружает разово все плейсмарки, что хранятся в localstorage
    // p.s на этой стадии запускается takeAllPlacemarks()
    for (const mark of placemarks) {
       const { latitude, longitude, hintContent, balloonContent } = mark;
       geoObjects.push(new ymaps.Placemark([latitude, longitude],
           {
               hintContent: `<div class="map__hint">${hintContent}</div>`,
               balloonContent: balloonContent,
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

    // Интервал постоянно запускает эту функцию
    // При появление в newGeoObject новых координат запускает добавление новой метки
    // После действия чистит newGeoObject
    function checkNewPlacemarks() {
        if(newGeoObjects.length) {
            (function () {
                for (const mark of newGeoObjects) {
                    const { latitude, longitude } = mark;
                    geoObjects.push(new ymaps.Placemark([latitude, longitude]));
                }
                map.geoObjects.add(cluster);
                cluster.add(newGeoObjects);
                newGeoObjects = [];
                console.log('новый элемент добавлен');
            })();
        }
    }

    // Работает только при попытке добавить НОВУЮ точку на карте
    // Запускает функцию takeCurrentCoords (для получения текущих координат и отображении в футере)
    // Также запускает balloon для создания балуна
    map.events.add('click', function (e) {
        if (!map.balloon.isOpen()) {
            var coords = e.get('coords');
            map.balloon.open(coords, {
                contentFooter: takeCurrentCoords(coords),
                contentBody: balloon(coords), // ПОД ВОПРОСОМ, НУЖНО КООРДЫ УБРАТЬ
            });
        }
        else {
            map.balloon.close();
        }
    });
    cluster.events
        // Можно слушать сразу несколько событий, указывая их имена в массиве.
        .add(['mouseenter', 'mouseleave', 'click'], function (e) {
            const target = e.get('target'),
                type = e.get('type');

            if (typeof target.getGeoObjects != 'undefined') {
                if (type == 'click') {
                    // click cluster target
                }
                // Событие произошло на кластере.
                if (type == 'mouseenter') {
                    // попытка добавить ховер эффетк
                    // target.options._parent._options.clusterIcons[0].href = 'https://bit.ly/2Y0lvc3';
                    target.options.set('iconImageHref', 'https://bit.ly/2Y0lvc3');
                } else {
                    // target.options.set('preset', 'islands#invertedVioletClusterIcons');
                }
            } else {
                // Событие произошло на геообъекте
            }
        });
}

// Функция для футера, в котором будут отображены текущие координаты НОВОЙ метки
function takeCurrentCoords([latitude, longitude]) {
    const coords = `<div class="geo-info">
                        <div>Новая точка</div>
                        <div>
                            <span>Ширина: ${latitude}</span>
                            <span>Долгота: ${longitude}</span>
                        </div>
                    </div>`

    currentCoordinates = [latitude, longitude];

    return coords;
}

// Функция тащит из localstorage данные, проверяет, что название соответствует возможным координатам
// Возвращает объект со всеми записанными координатами и их данными (Имя, место, отзыв)
function takeAllPlacemarks() {
    let allPlacemarks = [];

    for (const key in localStorage) {
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
                    balloonContent: takeBalloon(`[${newCoords[0]}, ${newCoords[1]}]`, true)
                }

                allPlacemarks.push(arrayPlacemark);
            }
        }
    }

    return allPlacemarks;
}

// Если клик произошел по кнопке, то запускает функцию addNewPlaceMark(e);
document.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON' && e.target.classList.contains('form__submit-button')) {
        e.preventDefault();
      addNewPlaceMark(e);
    }
});

// Собирает данные из формы, пушит в newGeoObject эти данные вскоре обрабатываются тем setInterval внутри init()
// После все данные собирает в объект, который по итогу превращает в строку
// Вызывается localStorage[текущие,координаты] = строка данных (которую можно будет распарсить)
function addNewPlaceMark(e) {
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

        newGeoObjects.push(new ymaps.Placemark(
                    [currentCoordinates[0], currentCoordinates[1]],
                    {
                        hintContent: `<div class="map__hint">Ширина: ${currentCoordinates[0]}; Долгота: ${currentCoordinates[1]}</div>`,
                        balloonContent: takeBalloon([currentCoordinates[0], currentCoordinates[1]], {name, location, review})
                    },
                    {
                        iconLayout: 'default#image',
                        iconImageHref: 'https://cdn-icons-png.flaticon.com/512/506/506403.png',
                        iconImageSize: [30, 30],
                        iconImageOffset: [-15, -30]
                    }
                ));

        localStorage[currentCoordinates] = stringInfo;

        // При сабмите закрывает балун
        const close = document.querySelector('.ymaps-2-1-79-balloon__close-button');
        close.dispatchEvent(new Event("click", {bubbles: true}));
}

// Отвечает за создание балуна (разметка + отзывы по текущим координватам)
// На входе принимает координаты (coords)
// Также принимает noData, для новых меток, а именно принимает {имя, место, отзыв}
// Внутри вызывает 2 функции: findReviews и addIndoToMap
function takeBalloon(coords, noData) {
    const balloon = `<form class="form" id="form" action="">
                    <label><h2 class="map__feedback">Отзыв:</h2></label>
                    <label><input class="form__name" name="name" type="text" placeholder="Укажите ваше имя"></label>
                    <label><input class="form__location" name="location" type="text" placeholder="Укажите место"></label>
                    <label><textarea class="form__review" name="review" id="review" cols="40" rows="4" placeholder="Оставьте отзыв"></textarea></label>
                    <label><button class="form__submit-button" id="submit" type="submit">Добавить</button></label>
                    </form>`;

    if (coords && noData) {
        // зачем я кидаю noData в аргументы findReviews ? - я не знаю :)
        const reviews = findReviews(coords, noData);
        let {name, location, review} = addInfoToMap(reviews) ? addInfoToMap(reviews) : noData;

        name = name ? name : '...';
        location = location ? location :'...';
        review= review ? review : '...'

        let oldReviews = '';
        const oldReview = `<li class="old-review">
                            <div class="old-review__name">${name}</div>
                            <div class="old-review__location">${location}</div>
                            <div class="old-review__review">${review}</div>
                            </li>`;
        oldReviews += oldReview;


        return `<ul class="old-reviews">${oldReviews}</ul> ${balloon}`; //+
    }

    return balloon;
}

// Сверяет координаты(coords) со всеми записанными координатами в localStorage
// В случае нахождения вернет объект, внутри которого будут записаны координаты и данные по этим коодинатам
function findReviews(coords) {
    let arrayPlacemark = {};
    for (const key in localStorage) {
        const coordsSplited = key.split(',');

        if(Number(!isNaN(Number(coordsSplited[0])) && !isNaN(Number(coordsSplited[1])))) {
            if(coordsSplited[0] !== undefined && coordsSplited[1] !== undefined) {
                const newCoords = [Number(coordsSplited[0].substr(0,5)),
                    Number(coordsSplited[1].substr(0,5))
                ];

                // Если на входе придет объект, то он его превратит в строку нужного вида :)
                if(typeof coords === 'object') {
                    coords = `[${coords[0]}, ${coords[1]}]`;
                }

                const goodCoords = [];
                const badCoords = coords.split(`[`)
                    .join('')
                    .split(']')
                    .join('')
                    .split(`'`)
                    .join('')
                    .split(', ');

                for(const el of badCoords) {
                    goodCoords.push(Number(el));
                }

                if(goodCoords[1] === newCoords[1] && goodCoords[0] === newCoords[0]) {
                    const obj = Object.assign(arrayPlacemark, {[key]: localStorage[key]});
                }
            }
        }
    }

    return arrayPlacemark;
}

// На входе ловит данные в формате объекта, в котором {координаты,точки: name, location, review}
// Собирает ключ объекта и его значение
// Парсит review и возвращает объект с данными
//
function addInfoToMap(review) {
    const placemarkCoords = Object.keys(review);
    const values = Object.values(review);
    let parsedReview = {};

    for(let i =0; i < placemarkCoords.length; i++) {
        parsedReview = JSON.parse(values[i]);
        return parsedReview;
    }
}


