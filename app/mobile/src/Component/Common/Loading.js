import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const Loading = ({ size = 'large', color = '#c2185b', text, fullscreen = false }) => {
    if (fullscreen) {
        return (
            <View style={styles.fullscreenContainer}>
                <ActivityIndicator size={size} color={color} />
                {text && <Text style={styles.loadingText}>{text}</Text>}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.loadingText}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    fullscreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    container: {
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: '#636e72',
        fontWeight: '500',
    },
});

export default Loading;
