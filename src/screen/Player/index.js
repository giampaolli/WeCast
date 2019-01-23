import React, { Component } from 'react';
import { View, Text} from 'react-native';

export default class Player extends Component {
    render() {
        const { navigation } = this.props;
        const feed = navigation.getParam('feed', {});

        return (
            <View style={styles.container}>
                <Text>{feed.title}</Text>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
    },
};
