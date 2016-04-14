import React, { Component } from 'react';
import Utils from 'utils';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import InstagramPhotos from 'components/InstagramPhotos/InstagramPhotos';

class Popular extends Component {

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      pagination: {},
    };
  }

  getPopular() {
    fetch('/photo/popular')
      .then(Utils.getJSON)
      .then(res => {
        this.setState({
          photos: res.data,
          pagination: res.pagination || {},
        });
      }, err => console.warn(JSON.parse(err)));
  }

  componentDidMount() {
    this.getPopular();
  }

  componentWillReceiveProps(props) {
    this.setState({ photos: [] });
    this.getPopular();
  }

  render() {
    return (
      <div>
        <Header current="Popular" />

        <div className="content">
          <InstagramPhotos photos={this.state.photos} pagination={this.state.pagination} />
        </div>

        <Footer />
      </div>
    );
  }
}

export default Popular;
