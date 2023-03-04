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

export default MoviesList;
