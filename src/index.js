import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import refs from './js/refs';
import { getImages, PER_PAGE } from './js/services';
import "simplelightbox/dist/simple-lightbox.min.css";

const smoothScroll = () => {
    const { height: cardHeight } = refs.galleryEl
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

const cardTemplate = ({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads
 }) => { 
    return `<a class="photo-card" href="${largeImageURL}"><div>
        <div class="thumb">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${downloads}</span>
        </p>
      </div>
    </div></a>`
}

let page = 1;
let lightbox;

const handleSubmit = async (event) => { 
    event.preventDefault();
    refs.galleryEl.innerHTML = "";
    page = 1;
    refs.loadMoreButton.classList.remove('show');

    const searchQuery = refs.inputEl.value;

    if (!searchQuery || !searchQuery.trim()) { 
        Notify.warning("Enter some search query.");
        return;
    }

    const { hits, totalHits } = await getImages(searchQuery, page);
    
    const imagesListMurkup = hits.map((photo) => cardTemplate(photo)).join('');
    refs.galleryEl.insertAdjacentHTML("beforeend", imagesListMurkup);

    lightbox = new SimpleLightbox('.gallery a', { captionDelay: '250', captionsData: 'alt' });

    if (hits.length) {
        // refs.loadMoreButton.classList.add('show');
        Notify.info(`Hooray! We found ${totalHits} images.`);

        if (totalHits > 40) {
        refs.loadMoreButton.classList.add('show');

        }
        
    }
    else { 
        Notify.info("Sorry, there are no images matching your search query. Please try again.");
    }

    

};

const handleClick = async () => { 
    page += 1;
    const searchQuery = refs.inputEl.value;
    const { hits, totalHits } = await getImages(searchQuery, page);
    const imagesListMurkup = hits.map((photo) => cardTemplate(photo)).join('');
    refs.galleryEl.insertAdjacentHTML("beforeend", imagesListMurkup);

    if (lightbox) { 
        lightbox.refresh(); 
    }

    smoothScroll();

    const lastPage = Math.ceil(+totalHits / PER_PAGE);

    if (lastPage === page) {
        refs.loadMoreButton.classList.remove('show');
        Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

refs.formEl.addEventListener('submit', handleSubmit);
refs.loadMoreButton.addEventListener('click', handleClick);