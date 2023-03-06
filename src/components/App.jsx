import { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Pagination, Spin, Alert } from 'antd';
import debounce from 'lodash.debounce';

import apiService from '../services/apiService';

import { GenresProvider } from './GenresContext';
import MoviesHeader from './MoviesHeader';
import MoviesList from './MoviesList';

export default class App extends Component {
  api = new apiService();

  state = {
    search: '',
    movies: [],
    genres: [],
    currentSearchPage: 1,
    currentRatedPage: 1,
    totalPages: 1,
    error: null,
    loading: true,
    tab: 'search',
    guestKey: undefined,
  };

  updateMovies(text, page = 1) {
    this.setState({ loading: true });
    this.api
      .searchMovies(text, page, this.state.guestKey)
      .then((data) => {
        this.setState({
          movies: data.results,
          currentSearchPage: data.page,
          totalPages: data.total_pages,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  getGuestSessionKey = () => {
    this.setState({ loading: true });
    this.api
      .createGuestSession()
      .then((data) => {
        this.setState({ guestKey: data.guest_session_id, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false, error: err });
      });
  };

  getRatedMovies = (page = 1) => {
    this.setState({ loading: true });
    this.api
      .getRatedMovies(page, this.state.guestKey)
      .then((data) => {
        this.setState({
          movies: data.results,
          currentRatedPage: data.page,
          totalPages: data.total_pages,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  rateMovie = (id, rate) => {
    this.setState(({ movies }) => {
      const index = movies.findIndex((el) => el.id === id);
      const updatedItem = { ...movies[index], rating: rate };
      return {
        movies: [...movies.slice(0, index), updatedItem, ...movies.slice(index + 1)],
      };
    });

    this.api
      .rateMovie(id, rate, this.state.guestKey)
      .then((data) => {
        if (!data.success) this.setState({ error: true });
      })
      .catch((err) => {
        this.setState({ loading: false, error: err });
      });
  };

  getGenres = () => {
    this.api
      .getGenres()
      .then((data) => {
        this.setState({ genres: data.genres });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  switchTab = (tab) => {
    this.setState({ tab: tab });
    tab === 'search' ? this.updateMovies(this.state.search, this.state.currentSearchPage) : null;
    tab === 'rated' ? this.getRatedMovies(this.state.currentRatedPage) : null;
  };

  componentDidMount() {
    this.getGenres();
    this.getGuestSessionKey();
    this.updateMovies(this.state.search);
  }

  componentWillUnmount() {}

  render() {
    const data = {
      onSearch: debounce((text) => {
        this.setState({ search: text });
        this.updateMovies(text);
      }, 800),
      onTabClick: (tab) => {
        this.switchTab(tab);
      },
      onRate: this.rateMovie,
      onPage: (page) => {
        if (this.state.tab === 'search') this.updateMovies(this.state.search, page);
        if (this.state.tab === 'rated') this.getRatedMovies(page);
      },
      movies: this.state.movies,
      currentPage: 1,
      totalPages: this.state.totalPages,
    };

    this.state.tab === 'search' ? (data.currentPage = this.state.currentSearchPage) : null;
    this.state.tab === 'rated' ? (data.currentPage = this.state.currentRatedPage) : null;

    const moviesList = !(this.state.loading || this.state.error || data.movies.length == 0) ? (
      <GenresProvider value={this.state.genres}>
        <MoviesList movies={data.movies} onRate={data.onRate}></MoviesList>
      </GenresProvider>
    ) : null;

    const noMoviesFound =
      data.movies.length == 0 && !(this.state.loading || this.state.error || this.state.tab === 'rated') ? (
        <Alert
          message="Not found"
          description="There are no results for your query. Please try to change it or try again later"
          type="warning"
        />
      ) : null;

    const noRatedMoviesFound =
      data.movies.length == 0 && !(this.state.loading || this.state.error || this.state.tab === 'search') ? (
        <Alert
          message="Nothing to show here yet"
          description="Rate the movies to see them on this page"
          type="warning"
        />
      ) : null;

    const loader = this.state.loading ? (
      <Spin size="large" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
    ) : null;

    const fetchError =
      this.state.error && !this.state.loading ? (
        <Alert message="Server Error" description="Something went wrong... Please try again later" type="error" />
      ) : null;

    return (
      <div className="movieApp">
        <Online>
          <header className="mb30 center">
            <MoviesHeader onSearch={data.onSearch} onTabClick={data.onTabClick} />
          </header>
          <main className="mb30 center" style={this.state.loading ? { marginTop: 'auto' } : null}>
            {loader}
            {noMoviesFound}
            {noRatedMoviesFound}
            {fetchError}
            {moviesList}
          </main>
          <footer className="mb30 center" style={{ marginTop: 'auto' }}>
            <Pagination
              onChange={data.onPage}
              current={Number(data.currentPage)}
              defaultCurrent={1}
              total={Number(data.totalPages)}
              pageSize={1}
              showSizeChanger={false}
            />
          </footer>
        </Online>
        <Offline>
          <Alert
            message="Offline"
            description="Please check your Internet Connection"
            type="error"
            className="offlineAlert mt30"
          ></Alert>
        </Offline>
      </div>
    );
  }
}
