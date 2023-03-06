import { Tag } from 'antd';

import { GenresConsumer } from './GenresContext';

const MovieGenre = ({ id }) => {
  return (
    <GenresConsumer>
      {(genres) => {
        let currentGenre = genres.find((g) => g.id === id);
        if (currentGenre.name) return <Tag style={{ margin: 0 }}>{currentGenre.name}</Tag>;
        return null;
      }}
    </GenresConsumer>
  );
};

export default MovieGenre;
