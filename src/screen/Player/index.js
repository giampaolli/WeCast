import React from 'react';
import {
    Image,
    Slider,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Asset, Audio } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

class Icon {
    constructor(module, width, height) {
        this.module = module;
        this.width = width;
        this.height = height;
        Asset.fromModule(this.module).downloadAsync();
    }
}

const ICON_PLAY_BUTTON = new Icon(require('../../../assets/images/play.png'), 34, 51);
const ICON_PAUSE_BUTTON = new Icon(require('../../../assets/images/pause.png'), 34, 51);
const ICON_STOP_BUTTON = new Icon(require('../../../assets/images/stop.png'), 22, 22);

const DISABLED_OPACITY = 0.5;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.isSeeking = false;
        this.shouldPlayAtEndOfSeek = false;
        this.playbackInstance = null;
        this.state = {
            loopingType: 0,
            muted: false,
            playbackInstancePosition: null,
            playbackInstanceDuration: null,
            shouldPlay: false,
            isPlaying: false,
            isBuffering: false,
            isLoading: true,
            shouldCorrectPitch: true,
            volume: 1.0,
            rate: 1.0,
        };
    }

    componentDidMount() {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
        });
        (async () => {
            await this._loadNewPlaybackInstance(false);
        })();
    }

    componentWillUnmount() {
        this._onStopPressed();
        this.playbackInstance = null;
    }

    async _loadNewPlaybackInstance(playing) {
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            this.playbackInstance.setOnPlaybackStatusUpdate(null);
            this.playbackInstance = null;
        }

        const { navigation } = this.props;
        const feed = navigation.getParam('feed', {});

        const source = { uri: feed.enclosure.link};
        const initialStatus = {
            shouldPlay: playing,
            rate: this.state.rate,
            shouldCorrectPitch: this.state.shouldCorrectPitch,
            volume: this.state.volume,
            isMuted: this.state.muted,
            isLooping: this.state.loopingType === 1,
        };

        const { sound, status } = await Audio.Sound.create(
            source,
            initialStatus,
            this._onPlaybackStatusUpdate
        );
        this.playbackInstance = sound;


        this._updateScreenForLoading(false);
    }

    _updateScreenForLoading(isLoading) {
        if (isLoading) {
            this.setState({
                isPlaying: false,
                playbackInstanceDuration: null,
                playbackInstancePosition: null,
                isLoading: true,
            });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    _onPlaybackStatusUpdate = status => {
        if (status.isLoaded) {
            this.setState({
                playbackInstancePosition: status.positionMillis,
                playbackInstanceDuration: status.durationMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                isBuffering: status.isBuffering,
                rate: status.rate,
                muted: status.isMuted,
                volume: status.volume,
                loopingType: status.isLooping ? 1 : 0,
                shouldCorrectPitch: status.shouldCorrectPitch,
            });
            if (status.didJustFinish && !status.isLooping) {
                this._updatePlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    };

    async _updatePlaybackInstanceForIndex(playing) {
        this._updateScreenForLoading(true);

        this._loadNewPlaybackInstance(playing);
    }

    _onPlayPausePressed = () => {
        if (this.playbackInstance != null) {
            if (this.state.isPlaying) {
                this.playbackInstance.pauseAsync();
            } else {
                this.playbackInstance.playAsync();
            }
        }
    };

    _onStopPressed = () => {
        if (this.playbackInstance != null) {
            this.playbackInstance.stopAsync();
        }
    };

    _onSeekSliderValueChange = value => {
        if (this.playbackInstance != null && !this.isSeeking) {
            this.isSeeking = true;
            this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
            this.playbackInstance.pauseAsync();
        }
    };

    _onSeekSliderSlidingComplete = async value => {
        if (this.playbackInstance != null) {
            this.isSeeking = false;
            const seekPosition = value * this.state.playbackInstanceDuration;
            if (this.shouldPlayAtEndOfSeek) {
                this.playbackInstance.playFromPositionAsync(seekPosition);
            } else {
                this.playbackInstance.setPositionAsync(seekPosition);
            }
        }
    };

    _getSeekSliderPosition() {
        if (
            this.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null
        ) {
            return this.state.playbackInstancePosition / this.state.playbackInstanceDuration;
        }
        return 0;
    }

    _getMMSSFromMillis(millis) {
        const totalSeconds = millis / 1000;
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);

        const padWithZero = number => {
            const string = number.toString();
            if (number < 10) {
                return '0' + string;
            }
            return string;
        };
        return padWithZero(minutes) + ':' + padWithZero(seconds);
    }

    _getTimestamp() {
        if (
            this.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null
        ) {
            return `${this._getMMSSFromMillis(
                this.state.playbackInstancePosition
            )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
        }
        return '';
    }

    render() {
        const { navigation } = this.props;
        const feed = navigation.getParam('feed', {});
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{url: feed.thumbnail}} resizeMode={'contain'} />
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.text}>
                        {feed.title}
                    </Text>
                </View>
                <View style={styles.space} />
                <View
                    style={[
                        styles.playbackContainer,
                        {
                            opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
                        },
                    ]}>
                    <Slider
                        style={styles.playbackSlider}
                        value={this._getSeekSliderPosition()}
                        onValueChange={this._onSeekSliderValueChange}
                        onSlidingComplete={this._onSeekSliderSlidingComplete}
                        disabled={this.state.isLoading}
                    />
                    <View style={styles.timestampRow}>
                        <Text style={[styles.text, styles.buffering, ]}>
                            {this.state.isBuffering ? 'buffering...' : ''}
                        </Text>
                        <Text style={[styles.text, styles.timestamp, ]}>
                            {this._getTimestamp()}
                        </Text>
                    </View>
                </View>
                <View
                    style={[
                        styles.buttonsContainerBase,
                        styles.buttonsContainerTopRow,
                        {
                            opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
                        },
                    ]}>
                    <TouchableOpacity
                        style={styles.wrapper}
                        onPress={this._onPlayPausePressed}
                        disabled={this.state.isLoading}>
                        <Image
                            style={styles.button}
                            source={this.state.isPlaying ? ICON_PAUSE_BUTTON.module : ICON_PLAY_BUTTON.module}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.wrapper}
                        onPress={this._onStopPressed}
                        disabled={this.state.isLoading}>
                        <Image style={styles.button} source={ICON_STOP_BUTTON.module} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    emptyContainer: {
        alignSelf: 'stretch',
    },
    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        // justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    imageContainer: {
        width: '100%',
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined
    },
    wrapper: {},
    nameContainer: {
        height: 14,
    },
    space: {
        height: 14,
    },
    playbackContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        minHeight: 38,
        maxHeight: 38,
    },
    playbackSlider: {
        alignSelf: 'stretch',
        paddingLeft: 10,
        paddingRight: 10,
    },
    timestampRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        minHeight: 14,
    },
    text: {
        fontSize: 14,
        // minHeight: FONT_SIZE,
    },
    buffering: {
        textAlign: 'left',
        paddingLeft: 20,
    },
    timestamp: {
        textAlign: 'right',
        paddingRight: 20,
    },
    buttonsContainerBase: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonsContainerTopRow: {
        maxHeight: ICON_PLAY_BUTTON.height,
        // minWidth: DEVICE_WIDTH / 2.0,
        // maxWidth: DEVICE_WIDTH / 2.0,
    },

});
