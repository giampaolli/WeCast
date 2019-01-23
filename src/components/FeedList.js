import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import FeedItem from './FeedItem'


export default class FeedList extends Component {
    render() {
        const  { items, navigation } = this.props;
        return (
            <ScrollView style={styles.container}>
                {items.map( feed => <FeedItem key={feed.guid} feed={feed} navigation={navigation}/>)}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '70%',
        width: '100%'
    }
});
