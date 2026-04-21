import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const ReturnsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useLanguage();
    const { orderId } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState(null);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    
    // Mock existing returns for UI
    const [existingReturns] = useState([
        {
            id: "RET12345",
            orderId: "DH9982",
            date: "15/03/2024",
            status: "PENDING",
            reason: "Sản phẩm bị hư hỏng",
            items: ["Serum Vitamin C BKEUTY"]
        }
    ]);

    const reasons = [
        { id: 'DAMAGED', label: t('reason_damaged') || "Sản phẩm bị hư hỏng" },
        { id: 'WRONG', label: t('reason_wrong') || "Giao sai sản phẩm" },
        { id: 'QUALITY', label: t('reason_quality') || "Chất lượng không như mô tả" },
        { id: 'OTHERS', label: t('reason_others') || "Lý do khác" },
    ];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5 - images.length,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImages([...images, ...result.assets.map(a => a.uri)]);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = () => {
        if (!reason || !description) {
            alert(t('fill_all_fields'));
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert(t('request_submitted'));
            navigation.goBack();
        }, 1500);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerCard}>
                <LinearGradient colors={[COLORS.mainTitle, COLORS.mainTitleDark || '#880e4f']} style={styles.headerGradient}>
                    <Ionicons name="reload-circle-outline" size={48} color="white" />
                    <Text style={styles.headerTitle}>{t('return_requests')}</Text>
                    <Text style={styles.headerSubtitle}>{t('returns_desc') || "Quản lý các yêu cầu đổi trả của bạn"}</Text>
                </LinearGradient>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('request_new_return') || "Yêu cầu mới"}</Text>
                    <View style={styles.formCard}>
                        <Text style={styles.label}>{t('order_id')}</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="receipt-outline" size={20} color="#94a3b8" />
                            <TextInput
                                style={styles.input}
                                value={orderId ? `DH${orderId}` : ''}
                                placeholder={t('order_placeholder')}
                                editable={false}
                            />
                        </View>

                        <Text style={styles.label}>{t('return_reason')}</Text>
                        <View style={styles.reasonGrid}>
                            {reasons.map((r) => (
                                <TouchableOpacity
                                    key={r.id}
                                    style={[styles.reasonChip, reason === r.id && styles.activeReasonChip]}
                                    onPress={() => setReason(r.id)}
                                >
                                    <Text style={[styles.reasonText, reason === r.id && styles.activeReasonText]}>{r.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>{t('return_description')}</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder={t('desc_placeholder')}
                            multiline
                            numberOfLines={4}
                            value={description}
                            onChangeText={setDescription}
                        />

                        <Text style={styles.label}>{t('upload_evidence')}</Text>
                        <View style={styles.imageGrid}>
                            {images.map((uri, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image source={{ uri }} style={styles.image} />
                                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(index)}>
                                        <Ionicons name="close-circle" size={20} color={COLORS.mainTitle} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {images.length < 5 && (
                                <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                                    <Ionicons name="camera-outline" size={30} color="#94a3b8" />
                                    <Text style={styles.uploadText}>{images.length}/5</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity 
                            style={[styles.submitBtn, loading && styles.disabledBtn]} 
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="white" /> : (
                                <Text style={styles.submitBtnText}>{t('confirm')}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('history') || "Lịch sử"}</Text>
                    {existingReturns.map((item) => (
                        <View key={item.id} style={styles.returnCard}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.retId}>#{item.id}</Text>
                                    <Text style={styles.ordRef}>{item.orderId}</Text>
                                </View>
                                <View style={[styles.statusBadge, item.status === 'PENDING' ? styles.statusPending : styles.statusApproved]}>
                                    <Text style={[styles.statusText, item.status === 'PENDING' ? styles.statusTextPending : styles.statusTextApproved]}>
                                        {t(item.status.toLowerCase())}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.cardBody}>
                                <Text style={styles.reasonLabel}>{item.reason}</Text>
                                <Text style={styles.dateLabel}>{item.date}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    headerCard: {
        height: 220,
        overflow: 'hidden',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: 'white',
        marginTop: 12,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
        textAlign: 'center',
    },
    content: {
        padding: 20,
        marginTop: -30,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        ...SHADOWS.medium,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600',
    },
    reasonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    reasonChip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    activeReasonChip: {
        backgroundColor: '#fff1f2',
        borderColor: COLORS.mainTitle,
    },
    reasonText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
    },
    activeReasonText: {
        color: COLORS.mainTitle,
    },
    textArea: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        padding: 16,
        height: 120,
        fontSize: 15,
        color: '#1e293b',
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    imageWrapper: {
        width: 70,
        height: 70,
        borderRadius: 12,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    removeBtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    uploadBtn: {
        width: 70,
        height: 70,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    uploadText: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: '700',
        marginTop: 4,
    },
    submitBtn: {
        backgroundColor: COLORS.mainTitle,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    submitBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    returnCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.small,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    retId: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1e293b',
    },
    ordRef: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusPending: {
        backgroundColor: '#fff7ed',
    },
    statusApproved: {
        backgroundColor: '#f0fdf4',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    statusTextPending: {
        color: '#f97316',
    },
    statusTextApproved: {
        color: '#16a34a',
    },
    cardBody: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 12,
    },
    reasonLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    dateLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
    }
});

export default ReturnsScreen;
