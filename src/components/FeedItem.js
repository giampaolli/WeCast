import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import imagePng from '../../assets/splash.png'

export default class FeedItem extends Component {
    render() {
        const  { feed } = this.props;
        return (
            <TouchableOpacity>
                <View style={styles.container} >
                    <Image style={styles.image} source={{url: feed.thumbnail}}/>
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
        width: '100%',
        justifyContent: 'space-around',
        marginBottom: 10,
        padding: 10,
        flexDirection: 'row',
    },
    image: {
        width: "30%",
    },
    textContainer: {
        width: "70%"
    },
    pubDate: {
        color: '#B7B7B7',
        fontSize: 14,
        letterSpacing: 0.4,
    },
    title: {
        fontSize: 20,
        flexWrap: 'wrap',
        letterSpacing: 0.4,
    },
    author: {
        fontSize: 16,
        letterSpacing: 0.4,
    },
});
