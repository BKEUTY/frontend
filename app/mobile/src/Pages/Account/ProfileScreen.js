import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { CButton, CInput } from '../../Component/Common';
import userApi from '../../api/userApi';

const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

const ProfileScreen = () => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        id: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'Nam',
        address: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userApi.getProfile();
                if (response.data) {
                    const data = response.data;
                    setUserData({
                        firstname: data.firstname || '',
                        lastname: data.lastname || '',
                        id: data.userId || data.id || '',
                        email: data.email || '',
                        phone: data.phoneNumber || '',
                        date_of_birth: data.dob || '',
                        gender: data.gender || 'Nam',
                        address: data.addresses?.[0]?.address || '',
                    });
                }
            } catch (err) {
                console.error("Fetch profile error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const updateData = {
                firstname: userData.firstname,
                lastname: userData.lastname,
                phoneNumber: userData.phone,
                dob: userData.date_of_birth,
            };
            await userApi.updateProfile(updateData);
            alert(t('update_info_success'));
        } catch (err) {
            alert(t('api_error_profile_update'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.mainTitle} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.avatarMainSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatar} />
                        <TouchableOpacity style={styles.editAvatarBadge}>
                            <Ionicons name="camera" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nameSection}>
                        <Text style={styles.greeting}>{t('welcome')},</Text>
                        <Text style={styles.fullNameText}>#{userData.id}</Text>
                        <Text style={styles.userIdText}>{userData.firstname} {userData.lastname}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.row}>
                    <CInput
                        label={t('first_name')}
                        value={userData.firstname}
                        onChangeText={(text) => setUserData({ ...userData, firstname: text })}
                        style={{ flex: 1, marginRight: 10 }}
                    />
                    <CInput
                        label={t('last_name')}
                        value={userData.lastname}
                        onChangeText={(text) => setUserData({ ...userData, lastname: text })}
                        style={{ flex: 1 }}
                    />
                </View>

                <CInput
                    label={t('user_id')}
                    value={userData.id}
                    style={styles.readOnlyWrapper}
                    editable={false}
                />

                <CInput
                    label="Email"
                    value={userData.email}
                    style={styles.readOnlyWrapper}
                    editable={false}
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
                    placeholder="YYYY-MM-DD"
                />

                <CInput
                    label={t('gender')}
                    value={userData.gender === 'Nam' ? t('male') : (userData.gender === 'Nu' ? t('female') : t('other'))}
                    editable={false}
                    style={styles.readOnlyWrapper}
                />

                <CInput
                    label={t('address')}
                    value={userData.address}
                    multiline
                    editable={false}
                    style={styles.readOnlyWrapper}
                />

                <CButton
                    title={t('update')}
                    onPress={handleUpdate}
                    style={{ marginTop: 10, marginBottom: 30 }}
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingVertical: 30,
        backgroundColor: COLORS.background,
        paddingHorizontal: 20,
    },
    avatarMainSection: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'white',
    },
    editAvatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.mainTitle,
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    nameSection: {
        marginLeft: 15,
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
    },
    fullNameText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.mainTitle,
    },
    userIdText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
        marginTop: 2,
    },
    formContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    readOnlyWrapper: {
        opacity: 0.6,
    }
});

export default ProfileScreen;
