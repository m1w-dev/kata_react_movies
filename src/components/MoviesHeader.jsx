import { Component } from 'react';
import { Tabs, Input } from 'antd';
import propTypes from 'prop-types';

export default class MoviesHeader extends Component {
  static defaultProps = {
    onSearch: () => {},
    onTabClick: () => {},
  };
  static propTypes = {
    onSearch: propTypes.func,
    onTabClick: propTypes.func,
  };

  searchbar = (
    <Input
      placeholder="Type to search"
      onInput={(e) => {
        this.props.onSearch(e.target.value);
      }}
      allowClear
      size="large"
      style={{ width: '90%' }}
    />
  );

  tabs = [
    {
      key: 'search',
      label: 'Search',
      children: this.searchbar,
    },
    {
      key: 'rated',
      label: 'Rated',
    },
  ];

  render() {
    return (
      <Tabs
        items={this.tabs}
        onChange={this.props.onTabClick}
        centered
        style={{ width: '100%', textAlign: 'center' }}
      ></Tabs>
    );
  }
}
