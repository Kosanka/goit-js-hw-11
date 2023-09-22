import axios from "axios";

export const BASE_URL = "https://pixabay.com/api/";
export const API_KEY = "39498710-22cdce9218a359fc8ee6d8a59";
export const IMAGE_TYPE = "photo";
export const ORIENTATION = "horizontal";
export const SAFESEARCH = "true";
export const PER_PAGE = 40;

axios.defaults.baseURL = BASE_URL;
axios.defaults.params = {};
axios.defaults.params['key'] = API_KEY;
axios.defaults.params['image_type'] = IMAGE_TYPE;
axios.defaults.params['orientation'] = ORIENTATION;
axios.defaults.params['safesearch'] = SAFESEARCH;
axios.defaults.params['per_page'] = PER_PAGE;

export const getImages = async (query, page = 1) => { 
    try {
        const { data } = await axios({
            method: "get",
            params: {
                q: query,
                page
            },
        });

        return data;
    } catch (error) {
        throw new Error("Something goes wrong!");
    }
};