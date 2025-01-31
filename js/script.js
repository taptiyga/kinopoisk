const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR =
    "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=";
const API_URL_SEARCH =
    "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

let currentPage = 1; // Текущая страница
let loading = false; // Указатель загрузки

// Начальная загрузка популярных фильмов
getMovies(`${API_URL_POPULAR}${currentPage}`);

// Функция для получения фильмов с текущей страницы
async function getMovies(url) {
    if (loading) return; // Если загрузка идёт, выйти
    loading = true; // Устанавливаем флаг загрузки
    try {
        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });

        // Проверяем, успешен ли ответ
        if (!resp.ok) {
            throw new Error(`Ошибка HTTP: ${resp.status}`);
        }

        const respData = await resp.json();
        showMovies(respData);
    } catch (error) {
        console.error('Произошла ошибка при получении данных:', error);
    } finally {
        loading = false; // Сбрасываем флаг загрузки после завершения загрузки
    }
}

function getClassByRate(value) {
    if (value >= 7) {
        return 'green';
    } else if (value > 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function showMovies(data) {
    const moviesEl = document.querySelector('.movies');

    data.films.forEach((movie) => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('card-movies', 'movies__card');
        movieEl.innerHTML = `
            <div class="card-movies__inner">
                <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}" class="card-movies__img">
                <div class="card-movies__darkened"></div>
            </div>
            <div class="card-movies__info info-movies">
                <div class="info-movies__title">${movie.nameRu}</div>
                <div class="info-movies__category">${movie.genres.map(genre => `${genre.genre}`).join(', ')}</div>
                ${movie.rating ? `<div class="info-movies__average info-movies__average_${getClassByRate(movie.rating)}">${movie.rating}</div>` : ''}
            </div>`;
        movieEl.addEventListener('click', () => openModal(movie.filmId));
        moviesEl.appendChild(movieEl);
    });
}

const form = document.querySelector('form');
const search = document.querySelector('.content-header__search');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        currentPage = 1; // Сбрасываем текущую страницу
        document.querySelector('.movies').innerHTML = ''; // Очищаем предыдущие результаты
        getMovies(apiSearchUrl);
        search.value = '';
    }
});

// Modal
const modal = document.querySelector('.modal');
async function openModal(id) {
    try {
        const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const respData = await resp.json();
        modal.classList.add('modal__show');
        document.body.classList.add('stop-scrolling');

        modal.innerHTML = `     
            <div class="modal__card card-modal">
                <img src="${respData.posterUrl}" alt="" class="card-modal__backdrop">
                <h2 class="card-modal__title">${respData.nameRu}</h2>
                <span class="card-modal__year">Год - ${respData.year}</span>
                <ul class="card-modal__info info-modal">
                    <div class="loader"></div>
                    <li class="info-modal__genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`).join(', ')}</li>
                    ${respData.filmLength ? `<li class="info-modal__runtime"> Время - ${respData.filmLength} минут</li>` : ''}
                    <li>Сайт: <a class="info-modal__site" href='${respData.webUrl}'>${respData.webUrl}</a></li>
                    <li class="info-modal__overview">Описание - ${respData.description}</li>
                </ul>
                <button type="button" class="card-modal__button_close button">Закрыть</button>
            </div>`;
        const btnClose = document.querySelector('.card-modal__button_close');
        btnClose.addEventListener('click', () => closeModal());
    } catch (error) {
        console.error('Произошла ошибка при получении данных:', error);
    }
}

function closeModal() {
    modal.classList.remove('modal__show');
    document.body.classList.remove('stop-scrolling');
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Обработчик события прокрутки для бесконечной загрузки
window.addEventListener('scroll', async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentPage++; // Увеличиваем номер страницы для следующей загрузки
        await getMovies(`${API_URL_POPULAR}${currentPage}`); // Загружаем фильмы на следующей странице
    }
});
// Объяснение кода

// Объявление функции:

// async function getMovies(url) {

// Функция объявлена как async, что позволяет использовать оператор await внутри нее.Это означает, что функция будет возвращать промис и может использовать асинхронные операции.

// Блок try...catch:

//     try {
//         // код
//     } catch (error) {
//         // обработка ошибок
//     }

// Блок try используется для выполнения кода, который может вызвать ошибку.Если ошибка возникает, управление передается в блок catch, где мы можем обработать ошибку.

// Отправка запроса с помощью fetch:

//     const resp = await fetch(url, {
//         headers: {
//             "Content-Type": "application/json",
//             "X-API-KEY": API_KEY // Убедитесь, что API_KEY определен
//         }
//     });

// fetch(url, { headers: { ... } }) отправляет HTTP - запрос на указанный URL.Мы передаем заголовки, включая Content - Type и X - API - KEY, которые могут быть необходимы для API.

// await заставляет функцию ждать завершения запроса, прежде чем продолжить выполнение кода.

// Проверка успешности ответа:

// if (!resp.ok) {
//     throw new Error(`Ошибка HTTP: ${resp.status}`);
// }

// resp.ok — это булевое значение, которое будет равно true, если HTTP - статус ответа находится в диапазоне 200 - 299(успешный ответ).

// Если ответ не успешен, мы выбрасываем ошибку с сообщением, содержащим статус ответа(resp.status).Это позволяет нам понять, что именно пошло не так(например, 404 - не найдено, 500 - ошибка сервера и т.д.).

// Преобразование ответа в JSON:

// const respData = await resp.json();

// Если ответ успешен, мы преобразуем его в формат JSON с помощью метода json().Этот метод также является асинхронным, поэтому мы используем await.

// Вывод данных в консоль:

// console.log(respData);

// После успешного получения и преобразования данных мы выводим их в консоль.

// Обработка ошибок:

// catch (error) {
//    console.error('Произошла ошибка при получении данных:', error);
// }

// Если в блоке try произошла ошибка(например, проблемы с сетью или ошибка при преобразовании ответа), она будет перехвачена в блоке catch. Мы выводим сообщение об ошибке в консоль, что помогает в отладке.
// Общая логика функции
// Функция getMovies асинхронно отправляет HTTP - запрос на указанный URL с заголовками, включая Content - Type и X - API - KEY.После получения ответа она проверяет, успешен ли запрос.Если да, то преобразует ответ в формат JSON и выводит его в консоль.Если что - то идет не так(например, ошибка сети или неуспешный ответ), функция обрабатывает ошибку и выводит сообщение в консоль.

//         Заключение
// Таким образом, функция getMovies становится более надежной и информативной, что делает ее лучше подготовленной к работе с реальными API.Обработка ошибок и проверка успешности ответа позволяют избежать неожиданных сбоев и упрощают отладку.