import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';

// Mock Data
const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

const ProfileScreen = () => {
    const { t } = useLanguage();

    const [userData, setUserData] = useState({
        name: "Phạm Thanh Phong",
        username: "thanhphong28",
        email: "phongdeptrai28@gmail.com",
        phone: "0376929681",
        date_of_birth: "2004-08-28",
        gender: "Nam",
        address: "xã Long Phước, tỉnh Đồng Nai",
        join_date: "2026-10-20",
    });

    const handleUpdate = () => {
        // Mock update
        alert(t('update_info_success'));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatar} />
                    <TouchableOpacity style={styles.editAvatarBadge}>
                        <Text style={styles.editAvatarText}>📷</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.greeting}>{t('welcome')} {userData.name}</Text>
            </View>

            <View style={styles.formContainer}>
                {/* Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('name') || "Họ và tên"}</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.name}
                        onChangeText={(text) => setUserData({ ...userData, name: text })}
                    />
                </View>

                {/* Username - Read Only */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('username')}</Text>
                    <TextInput
                        style={[styles.input, styles.readOnlyInput]}
                        value={userData.username}
                        editable={false}
                    />
                </View>

                {/* Gender */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('gender')}</Text>
                    {/* Simplified as text input or custom selector for now */}
                    <TextInput
                        style={styles.input}
                        value={userData.gender === 'Nam' ? t('male') : (userData.gender === 'Nu' ? t('female') : t('other'))}
                        // Simple placeholder interaction
                        onChangeText={(text) => setUserData({ ...userData, gender: text })}
                    />
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.email}
                        keyboardType="email-address"
                        onChangeText={(text) => setUserData({ ...userData, email: text })}
                    />
                </View>

                {/* Phone */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('phone')}</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.phone}
                        keyboardType="phone-pad"
                        onChangeText={(text) => setUserData({ ...userData, phone: text })}
                    />
                </View>

                {/* DOB */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('dob')}</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.date_of_birth}
                        onChangeText={(text) => setUserData({ ...userData, date_of_birth: text })}
                    />
                </View>

                {/* Address */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('address')}</Text>
                    <TextInput
                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                        value={userData.address}
                        multiline
                        onChangeText={(text) => setUserData({ ...userData, address: text })}
                    />
                </View>

                {/* Join Date - Read Only */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('join_date')}</Text>
                    <TextInput
                        style={[styles.input, styles.readOnlyInput]}
                        value={new Date(userData.join_date).toLocaleDateString("vi-VN")}
                        editable={false}
                    />
                </View>

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                    <Text style={styles.updateButtonText}>{t('update')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fce4ec',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'white',
    },
    editAvatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.mainTitle,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    editAvatarText: {
        fontSize: 14,
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    formContainer: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    readOnlyInput: {
        backgroundColor: '#f0f0f0',
        color: '#888',
    },
    updateButton: {
        backgroundColor: COLORS.mainTitle,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
