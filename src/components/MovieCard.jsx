import { Component } from 'react';
import { Col, Row, Image, Typography, Progress, Rate, Spin } from 'antd';
import { format } from 'date-fns';

import MovieGenre from './MovieGenre';

export default class MovieCard extends Component {
  clipDescription = (text, clip = 180) => {
    if (!text) return '';
    text = text.trim();
    if (text.length <= clip + 3) return text;
    let cutted = text.substring(0, clip);
    cutted = cutted.substring(0, cutted.lastIndexOf(' '));
    return `${cutted}...`;
  };

  render() {
    const { poster_path, title, vote_average, release_date, genre_ids, overview, rating } = this.props.data;

    let releaseDate = new Date(release_date);
    releaseDate = releaseDate instanceof Date && !isNaN(releaseDate) ? format(releaseDate, 'MMMM d, y') : 'n/a';

    const movieRate = vote_average * 10;
    const movieRateColor =
      movieRate >= 70 ? '#66E900' : movieRate >= 50 ? '#E9D100' : movieRate >= 30 ? '#E97E00' : '#E90000';

    const genres = genre_ids.map((id) => {
      return <MovieGenre key={id} id={id} />;
    });

    const imageUrl = poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : 'null';

    return (
      <MovieCardTemplate
        imageUrl={imageUrl}
        title={title}
        releaseDate={releaseDate}
        genres={genres}
        overview={this.clipDescription(overview)}
        movieRate={movieRate}
        movieRateColor={movieRateColor}
        onRate={this.props.onRate}
        rating={rating ? rating : 0}
      />
    );
  }
}

const MovieImage = ({ imageUrl, imageAlt }) => {
  const placeholder = (
    <div className="imageLoader">
      <Spin size="large" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
    </div>
  );

  return (
    <Image
      height={'100%'}
      src={imageUrl}
      alt={imageAlt}
      fallback="/placeholder.png"
      style={{ minHeight: '280px', objectFit: 'cover' }}
      placeholder={placeholder}
    ></Image>
  );
};

const MovieData = ({ title, releaseDate, genres, overview, movieRate, movieRateColor }) => {
  return (
    <Row>
      <Col span={20}>
        <div>
          <Typography.Text copyable style={{ fontSize: '1.7rem', lineHeight: '30px' }}>
            {title}
          </Typography.Text>
        </div>
        <div>
          <Typography.Text type="secondary">{releaseDate}</Typography.Text>
        </div>
        <div style={{ margin: '10px 0px', display: 'flex', flexWrap: 'wrap', gap: '8px 8px' }}>{genres}</div>
        <div>
          <Typography.Text>{overview}</Typography.Text>
        </div>
      </Col>
      <Col span={4}>
        <Progress
          type="dashboard"
          percent={movieRate}
          width={30}
          format={(percent) => Math.round(percent * 10) / 100}
          strokeColor={movieRateColor}
        />
      </Col>
    </Row>
  );
};

const MovieRate = ({ onRate, rating }) => {
  return <Rate allowHalf count={10} style={{ fontSize: '1.3rem' }} onChange={onRate} value={rating} />;
};

const MovieCardTemplate = ({
  imageUrl,
  title,
  releaseDate,
  genres,
  overview,
  movieRate,
  movieRateColor,
  onRate,
  rating,
}) => {
  return (
    <Row style={{ width: 450, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' }}>
      <Col span={10}>
        <MovieImage imageUrl={imageUrl} imageAlt={title} />
      </Col>

      <Col
        span={14}
        style={{ padding: 12, display: 'inline-flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <MovieData
          title={title}
          releaseDate={releaseDate}
          genres={genres}
          overview={overview}
          movieRate={movieRate}
          movieRateColor={movieRateColor}
        />
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <MovieRate onRate={onRate} rating={rating} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
