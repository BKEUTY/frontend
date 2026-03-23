import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { CButton, CInput } from '../../Component/Common';

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
        membership_level: "Diamond",
        total_spent: 85000000,
        target_spent: 100000000,
        next_level: "VIP"
    });

    const handleUpdate = () => {
        alert(t('update_info_success'));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarMainSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatar} />
                        <TouchableOpacity style={styles.editAvatarBadge}>
                            <Ionicons name="camera" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nameSection}>
                        <Text style={styles.greeting}>{userData.name}</Text>
                        <Text style={styles.usernameText}>@{userData.username}</Text>
                    </View>
                </View>

                {/* VIP Section - Modern Minimal Card */}
                <View style={styles.vipCard}>
                    <View style={styles.vipCardTop}>
                        <View style={styles.vipLevelBadge}>
                            <Ionicons name="diamond-outline" size={14} color="white" style={{ marginRight: 4 }} />
                            <Text style={styles.vipBadgeText}>{userData.membership_level}</Text>
                        </View>
                        <View style={styles.spentInfo}>
                            <Text style={styles.spentLabel}>{t('total_spent')}</Text>
                            <Text style={styles.spentValue}>{new Intl.NumberFormat('vi-VN').format(userData.total_spent)}đ</Text>
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${(userData.total_spent / userData.target_spent) * 100}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressLabel}>
                            {t('next_level_condition')
                                .replace('{amount}', new Intl.NumberFormat('vi-VN').format(userData.target_spent - userData.total_spent) + 'đ')
                                .replace('{level}', userData.next_level)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.formContainer}>
                <CInput
                    label={t('name') || "Họ và tên"}
                    value={userData.name}
                    onChangeText={(text) => setUserData({ ...userData, name: text })}
                />

                <CInput
                    label={t('username')}
                    value={userData.username}
                    style={styles.readOnlyWrapper}
                    editable={false}
                />

                <CInput
                    label={t('gender')}
                    value={userData.gender === 'Nam' ? t('male') : (userData.gender === 'Nu' ? t('female') : t('other'))}
                    onChangeText={(text) => setUserData({ ...userData, gender: text })}
                />

                <CInput
                    label="Email"
                    value={userData.email}
                    keyboardType="email-address"
                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                />

                <CInput
                    label={t('phone')}
                    value={userData.phone}
                    keyboardType="phone-pad"
                    onChangeText={(text) => setUserData({ ...userData, phone: text })}
                />

                <CInput
                    label={t('dob')}
                    value={userData.date_of_birth}
                    onChangeText={(text) => setUserData({ ...userData, date_of_birth: text })}
                />

                <CInput
                    label={t('address')}
                    value={userData.address}
                    multiline
                    onChangeText={(text) => setUserData({ ...userData, address: text })}
                />

                <CInput
                    label={t('join_date')}
                    value={new Date(userData.join_date).toLocaleDateString("vi-VN")}
                    style={styles.readOnlyWrapper}
                    editable={false}
                />

                <CButton
                    title={t('update')}
                    onPress={handleUpdate}
                    style={{ marginTop: 20 }}
                />
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
        backgroundColor: COLORS.background,
        paddingHorizontal: 20,
    },
    avatarMainSection: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 85,
        height: 85,
        borderRadius: 42.5,
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    editAvatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.mainTitle,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    nameSection: {
        marginLeft: 20,
        flex: 1,
    },
    greeting: {
        fontSize: 22,
        fontWeight: '900',
        color: COLORS.mainTitle,
        marginBottom: 2,
    },
    usernameText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
    },
    formContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        color: '#94a3b8',
        marginBottom: 8,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600',
    },
    readOnlyWrapper: {
        opacity: 0.7,
    },
    updateButton: {
        display: 'none' // Replaced by CButton
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // VIP Styles
    vipCard: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    vipCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    vipLevelBadge: {
        backgroundColor: '#00d2d3',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        shadowColor: '#00d2d3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    vipBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    spentInfo: {
        alignItems: 'flex-end',
    },
    spentLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    spentValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b',
    },
    progressContainer: {
        width: '100%',
    },
    progressTrack: {
        height: 10,
        backgroundColor: '#f1f5f9',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.mainTitle,
        borderRadius: 5,
    },
    progressLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '700',
        textAlign: 'center',
    }
});

export default ProfileScreen;
