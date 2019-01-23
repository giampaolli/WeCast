import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import axios from 'axios';

import FeedList from '../../components/FeedList'
import feedJson from '../../../feed';

export default class Feed extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        items: [],
        feed: {}
    };

    async componentDidMount() {
        const data = {
            api_key: '1h7vo6fm0ecqiyayuhu4km9vweue4fzpaa5nhrfg',
            rss_url: 'http://feeds.feedburner.com/podcastmrg',
            count: 1000
        };

        const resp = await axios.get('https://api.rss2json.com/v1/api.json', {params: data});
        // const resp = feedJson;
        this.setState({
            items: resp.data.items,
            feed: resp.data.feed,
        })
    }

    render() {
        const { items, feed } = this.state;
        return (
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={{url: feed.image}}
                    resizeMode={'center'}
                />
                <FeedList items={items} navigation={this.props.navigation}/>
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
    image: {
        height: '30%',
        width: '100%',
        marginBottom: 5,
    },
});
