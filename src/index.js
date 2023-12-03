import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery__images');
const loadMore = document.querySelector('.load__images');

async function getApiInfo(searched, pages) {
    const url = 'https://pixabay.com/api/'
    const params= {
        key: '40960381-08cae8203cb7081d274a7ee8e',
        q: searched,
        safeSearch: true,
        orientation: "horizontal",
        page: pages
    }
    try{
        const response = await axios.get(url, { params })
        const images = response.data;
        return images
    } catch(err) {
        console.log("ERROR", err);
    }
}

function galleryStructure(data) {
    const HTMLelements = data.map(element => {
        return `
            <div class="image__card">
                <img class="element__img" src="${element.webformatURL}" alt="photo" loading="lazy">

                <ul class="element__info">
                    <li class="element__data">
                        <h4 class="element__data__title">Likes</h4>
                        <p class="element__data__value">${element.likes}</p>
                    </li>

                    <li class="element__data">
                        <h4 class="element__data__title">Views</h4> 
                        <p class="element__data__value">${element.views}</p>
                    </li>

                    <li class="element__data"> 
                        <h4 class="element__data__title">Comments</h4>
                        <p class="element__data__value">${element.comments}</p>
                    </li>

                    <li class="element__data"> 
                        <h4 class="element__data__title">Downloads</h4>
                        <p class="element__data__value">${element.downloads}</p>
                    </li>
                </ul>
            </div>
            `;
    }).join('');

    return HTMLelements;
}

let search = ''
let images = [];
let page = 1;

const searchInfo = async () => {
    try {
        const fullInfo = await getApiInfo(search, page);
        fullInfo.hits.forEach(element => {
            images.push(element)
        });

        gallery.innerHTML = galleryStructure(images)

        if(page === 1){
            if(images.length === 0){
                Notiflix.Notify.failure('Oh, unfortunately there are no images matching with your search. Try again')
                loadMore.classList.add('hidden')
            }else{
                Notiflix.Notify.success(`Awesome! We found ${fullInfo.totalHits} images.`)
                loadMore.classList.remove('hidden')
            }
        }
    } catch(err) {
        console.error('ERROR:', err);
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();
    search = form.elements.searchQuery.value;
    page = 1
    images = []
    searchInfo()
}); 

loadMore.addEventListener('click', async e =>{
    page += 1;
    searchInfo()
});