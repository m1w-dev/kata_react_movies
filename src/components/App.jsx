import { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Pagination, Spin, Alert } from 'antd';

import apiService from '../services/apiService';

import MoviesHeader from './MoviesHeader';
import MoviesList from './MoviesList';

export default class App extends Component {
  api = new apiService();

  state = {
    search: 'return',
    movies: [],
    currentPage: 1,
    totalPages: 1,
    error: null,
    loading: true,
  };

  updateMovies(text, page = 1) {
    if (!text.trim()) return;
    this.setState({ loading: true });
    this.api
      .searchMovies(text, page)
      .then((data) => {
        this.setState({
          movies: data.results,
          currentPage: data.page,
          totalPages: data.total_pages,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  componentDidMount() {
    this.updateMovies(this.state.search);
  }

  componentWillUnmount() {}

  render() {
    const data = {
      onSearch: (text) => {
        this.setState({ search: text });
        this.updateMovies(text);
      },
      onTabClick: (tab) => console.log('tab', tab),
      onRate: (id, rate) => console.log('id', id, 'rate', rate),
      onPage: (page) => this.updateMovies(this.state.search, page),
      movies: this.state.movies,
      currentPage: this.state.currentPage,
      totalPages: this.state.totalPages,
    };

    const moviesList = !(this.state.loading || this.state.error || data.movies.length == 0) ? (
      <MoviesList movies={data.movies} onRate={data.onRate}></MoviesList>
    ) : null;

    const noMoviesFound =
      data.movies.length == 0 && !(this.state.loading || this.state.error) ? (
        <Alert
          message="Not found"
          description="There are no results for your query. Please try to change it or try again later"
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

    const pollingConfig = {
      interval: 30000,
    };

    return (
      <div className="movieApp">
        <Online polling={pollingConfig}>
          <header className="mb30 center">
            <MoviesHeader onSearch={data.onSearch} onTabClick={data.onTabClick} />
          </header>
          <main className="mb30 center" style={this.state.loading ? { marginTop: 'auto' } : null}>
            {loader}
            {noMoviesFound}
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
        <Offline polling={pollingConfig}>
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
