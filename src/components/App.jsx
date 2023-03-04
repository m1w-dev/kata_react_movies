import { Component } from 'react';

import apiService from '../services/apiService';

import MoviesList from './MoviesList';

export default class App extends Component {
  api = new apiService();

  state = {
    movies: [],
    currentPage: 1,
    totalPages: 1,
    errors: null,
  };

  updateMovies(text, page = 1) {
    this.api
      .searchMovies(text, page)
      .then((data) => {
        this.setState({
          movies: data.results,
          currentPage: data.page,
          totalPages: data.totalPages,
        });
      })
      .catch((err) => {
        this.setState({ errors: err });
      });
  }

  componentDidMount() {
    this.updateMovies('return');
  }

  componentWillUnmount() {}

  render() {
    return <MoviesList movies={this.state.movies}></MoviesList>;
  }
}
