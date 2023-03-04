import apiKey from './apiKey';

class apiService {
  _baseUrl = 'https://api.themoviedb.org/3';

  _sendRequest = async (url, payload, page = undefined) => {
    let fetchUrl = new URL(`${this._baseUrl}${url}`);

    fetchUrl.searchParams.append('api_key', apiKey);

    if (page) {
      fetchUrl.searchParams.append('page', Number(page));
    }

    if (payload) {
      for (let key in payload) {
        fetchUrl.searchParams.append(key, payload[key]);
      }
    }

    const res = await fetch(fetchUrl);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, recieved ${res.status}`);
    }

    const data = await res.json();

    return data;
  };

  searchMovies = (text, page = 1) => {
    let pl = {
      query: text.trim(),
    };

    let movies = this._sendRequest('/search/movie', pl, page);

    return movies;
  };
}

export default apiService;
