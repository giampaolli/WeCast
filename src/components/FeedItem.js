import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import imagePng from '../../assets/splash.png'

export default class FeedItem extends Component {
    render() {
        const  { feed, navigation } = this.props;
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Player', {feed})}>
                <View style={styles.container} >
                    <Image
                        style={styles.image}
                        source={{url: feed.thumbnail}}
                        resizeMode={'center'}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.pubDate}>{feed.pubDate}</Text>
                        <Text style={styles.title}>{feed.title}</Text>
                        <Text style={styles.author}>{feed.author}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        flexDirection: 'row',
    },
    image: {
        height: '100%',
        width: "30%",
    },
    textContainer: {
        width: "70%",
        height: '100%',
        paddingLeft: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    pubDate: {
        color: '#B7B7B7',
        fontSize: 12,
        letterSpacing: 0.4,
    },
    title: {
        fontSize: 18,
        flexWrap: 'wrap',
        letterSpacing: 0.4,
    },
    author: {
        fontSize: 14,
        letterSpacing: 0.4,
        color: '#333333',
    },
});
