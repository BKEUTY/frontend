import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyState = ({
    icon = 'file-tray-outline',
    title = 'No data available',
    description,
    actionText,
    onAction
}) => {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={80} color="#c2185b" style={styles.icon} />
            <Text style={styles.title}>{title}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
            {actionText && onAction && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={onAction}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    icon: {
        marginBottom: 24,
        opacity: 0.6,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#636e72',
        textAlign: 'center',
        marginBottom: 32,
        maxWidth: 300,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#c2185b',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EmptyState;
