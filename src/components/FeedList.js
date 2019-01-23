import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import FeedItem from './FeedItem'


export default class FeedList extends Component {
    render() {
        const  { items } = this.props;
        if (items === undefined) return (<View><Text>carregando...</Text></View>);
        return (
            <ScrollView style={styles.container}>
                {
                    items.map( feed => <FeedItem key={feed.guid} feed={feed}/>)
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%'
    }
});
