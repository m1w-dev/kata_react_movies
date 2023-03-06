import propTypes from 'prop-types';

import MovieCard from './MovieCard';

const MoviesList = ({ movies, onRate }) => {
  let moviesCards = movies.map((movieData) => {
    let { id, ...data } = movieData;
    return (
      <MovieCard
        key={id}
        data={data}
        id={id}
        onRate={(rate) => {
          onRate(id, rate);
        }}
      ></MovieCard>
    );
  });

  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px' }}>{moviesCards}</div>;
};

MoviesList.defaultProps = {
  movies: [],
  onRate: () => {},
};
MoviesList.propTypes = {
  movies: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.any,
      poster_path: propTypes.string,
      title: propTypes.string,
      vote_average: propTypes.number,
      release_date: propTypes.string,
      genre_ids: propTypes.arrayOf(propTypes.number),
      overview: propTypes.string,
      rating: propTypes.number,
    })
  ),
  onRate: propTypes.func,
};

export default MoviesList;
