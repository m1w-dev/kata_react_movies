import apiKey from './apiKey';

class apiService {
  _baseUrl = 'https://api.themoviedb.org/3';

  _sendRequest = async (url, payload = undefined, page = undefined, body = undefined) => {
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

    let res;

    if (body) {
      res = await fetch(fetchUrl, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          ...body,
        }),
      });
    } else {
      res = await fetch(fetchUrl);
    }

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, recieved ${res.status}`);
    }

    const data = await res.json();

    return data;
  };

  createGuestSession = () => {
    return this._sendRequest('/authentication/guest_session/new');
  };

  getGenres = () => {
    return this._sendRequest('/genre/movie/list');
  };

  getRatedMovies = (page, guestKey) => {
    let pl = {
      sort_by: 'created_at.desc',
    };

    return this._sendRequest(`/guest_session/${guestKey}/rated/movies`, pl, page);
  };

  rateMovie = (movieId, rate, guestKey) => {
    let url = `/movie/${movieId}/rating`;
    let pl = {
      guest_session_id: guestKey,
    };
    let body = { value: Number(rate) };

    return this._sendRequest(url, pl, undefined, body);
  };

  _searchMovies = (text, page = 1) => {
    let pl = {
      query: text.trim(),
    };

    let url = pl.query ? '/search/movie' : '/movie/popular';

    let movies = this._sendRequest(url, pl, page);

    return movies;
  };

  _buildMoviesListWithRate = (moviesList, ratedList) => {
    let movies = moviesList.results;
    let ratedMovies = ratedList.results;

    let resultList = movies.map((sMovie) => {
      let isRated = ratedMovies.some((rMovie) => {
        return rMovie.id === sMovie.id;
      });
      if (isRated) {
        let ratedMovie = ratedMovies.find((rMovie) => {
          return rMovie.id === sMovie.id;
        });

        sMovie.rating = ratedMovie.rating;
      }

      return sMovie;
    });

    return new Promise((resolve) => {
      moviesList.results = resultList;
      resolve(moviesList);
    });
  };

  searchMovies = async (text, page = 1, guestKey = false) => {
    let movies = await this._searchMovies(text, page);

    if (!guestKey) return movies;

    let ratedMovies = await this.getRatedMovies(1, guestKey);
    if (ratedMovies.total_pages > 1) {
      for (let page = 2; page <= ratedMovies.total_pages; page++) {
        let newPage = await this.getRatedMovies(page, guestKey);
        ratedMovies.results.push(...newPage.results);
      }
    }

    return this._buildMoviesListWithRate(movies, ratedMovies);
  };
}

export default apiService;
