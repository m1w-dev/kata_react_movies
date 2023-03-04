import { Component } from 'react';
import { Tabs, Input } from 'antd';

export default class MoviesHeader extends Component {
  searchbar = (
    <Input.Search
      placeholder="Type to search"
      onSearch={this.props.onSearch}
      enterButton
      allowClear
      size="large"
      style={{ width: '90%' }}
      required
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
      disabled: true,
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