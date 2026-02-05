
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../i18n/LanguageContext';
import { COLORS } from '../../constants/Theme';

const ProductCreateScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleNext = () => {
        if (currentStep === 0 && !name) {
            Alert.alert(t('error'), t('admin_error_name_required') || 'Name is required');
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('admin_product_create')}</Text>
            </View>

            <View style={styles.stepper}>
                {[0, 1, 2].map((step) => (
                    <View key={step} style={styles.stepItem}>
                        <View style={[
                            styles.stepCircle,
                            currentStep >= step ? styles.stepActive : styles.stepInactive
                        ]}>
                            {currentStep > step ? (
                                <Ionicons name="checkmark" size={16} color="white" />
                            ) : (
                                <Text style={[styles.stepText, currentStep >= step && { color: 'white' }]}>{step + 1}</Text>
                            )}
                        </View>
                        {step < 2 && <View style={[styles.stepLine, currentStep > step && { backgroundColor: COLORS.mainTitle }]} />}
                    </View>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {currentStep === 0 && (
                    <View style={styles.formSection}>
                        <Text style={styles.sectionLabel}>{t('admin_section_general')}</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('admin_label_name')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('admin_placeholder_product_name')}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('admin_label_desc')}</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder={t('admin_placeholder_desc')}
                                multiline
                                numberOfLines={4}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>

                        <Text style={styles.sectionLabel}>{t('admin_section_media')}</Text>
                        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.previewImage} />
                            ) : (
                                <>
                                    <Ionicons name="cloud-upload-outline" size={40} color={COLORS.mainTitle} />
                                    <Text style={styles.uploadText}>{t('admin_btn_upload')}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {currentStep > 0 && (
                    <View style={styles.placeholderSection}>
                        <MaterialCommunityIcons name="progress-wrench" size={64} color="#ccc" />
                        <Text style={styles.placeholderText}>
                            {t('Features coming soon on mobile app')}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.btn, styles.primaryBtn]}
                    onPress={handleNext}
                >
                    <Text style={styles.btnText}>{t('next') || 'Next'}</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    backBtn: {
        padding: 8,
        marginRight: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    stepper: {
        flexDirection: 'row',
        paddingHorizontal: 40,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepActive: {
        backgroundColor: COLORS.mainTitle,
    },
    stepInactive: {
        backgroundColor: '#f1f5f9',
    },
    stepText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: '#f1f5f9',
        marginHorizontal: 8,
    },
    scrollContent: {
        padding: 20,
    },
    formSection: {
        marginBottom: 30,
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 20,
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    uploadBox: {
        height: 160,
        backgroundColor: '#fdf2f8',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fce7f3',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    uploadText: {
        marginTop: 10,
        color: COLORS.mainTitle,
        fontWeight: '700',
    },
    placeholderSection: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        marginTop: 20,
        color: '#94a3b8',
        textAlign: 'center',
        fontSize: 16,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        backgroundColor: '#fff',
    },
    btn: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    primaryBtn: {
        backgroundColor: COLORS.mainTitle,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    }
});

export default ProductCreateScreen;
