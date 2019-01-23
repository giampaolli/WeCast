import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

import FeedList from './src/components/FeedList'
import feedJson from './feed';

export default class App extends React.Component {

  state = {
    items: [],
    feed: {}
  };

  componentDidMount() {
    // const resp = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=http://feeds.feedburner.com/podcastmrg');
    const resp = feedJson;
    this.setState({
      items: resp.items,
      feed: resp.feed,
    })
  }

  render() {
    const { items, feed } = this.state;
    return (
      <View style={styles.container}>
        <Text>{feed !== undefined ? feed.title : 'carregando...'}</Text>
        <FeedList items={items} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});
