require('./index.html');

ymaps.ready(init);

function init() {
    const map = new ymaps.Map('map', {
        center: [55.75, 37.64],
        zoom: 12,
        controls: [
           'zoomControl'
        ],
        behaviors: ['drag']
    });

    const balloon = `<div class="map__balloon">дом 63 строение 2</div>
                    <div class="map__feedback">Отзыв:</div>
                    <form class="form" id="form" action="">
                    <label><input class="form__name" name="name" type="text" placeholder="Укажите ваше имя"></label>
                    <label><input class="form__location" name="location" type="text" placeholder="Укажите место"></label>
                    <label><textarea class="form__review" name="review" id="review" cols="40" rows="4" placeholder="Оставьте отзыв"></textarea></label>
                    <label><button id="submit" type="submit">Добавить</button></label>
                    </form>`;

    const placemarks = [
        {
            latitude: 55.72,
            longitude: 37.64,
            hintContent: '<div class="map__hint">Техносад</div>',
            balloonContent: balloon
        },
        {
            latitude: 55.73,
            longitude: 37.66,
            hintContent: '<div class="map__hint">Вторая точка</div>',
            balloonContent: balloon
        },
        {
            latitude: 55.70,
            longitude: 37.62,
            hintContent: '<div class="map__hint">Третья точка</div>',
            balloonContent: balloon
        },
        {
            latitude: 55.75,
            longitude: 37.62,
            hintContent: '<div class="map__hint">Четвертая точка</div>',
            balloonContent: balloon
        }
    ], geoObjects = [];

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

    const cluster = new ymaps.Clusterer({
        clusterIcons: [
            {
                href: 'https://cdn-icons-png.flaticon.com/512/149/149724.png',
                size: [70, 70],
                offset: [-35, -35]
            }
        ],
        clusterIconContentLayout: null
    });

    map.geoObjects.add(cluster);
    cluster.add(geoObjects);
}



window.addEventListener('load', ()=> {
    const formSubmit = document.querySelector('#form');
    const submitButton = document.querySelector('#submit');

    console.log('Страница загрузилась');

    // formSubmit.addEventListener('click', (e) => {
    //     console.log(e.target)
    // })
})
