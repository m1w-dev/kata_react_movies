import { Tag } from 'antd';
import propTypes from 'prop-types';

import { GenresConsumer } from './GenresContext';

const MovieGenre = ({ id }) => {
  return (
    <GenresConsumer>
      {(genres) => {
        let currentGenre = genres.find((g) => g.id === id);
        if (currentGenre) return <Tag style={{ margin: 0 }}>{currentGenre.name}</Tag>;
        return null;
      }}
    </GenresConsumer>
  );
};

MovieGenre.defaultProps = {
  id: undefined,
};
MovieGenre.propTypes = {
  id: propTypes.any.isRequired,
};

export default MovieGenre;
