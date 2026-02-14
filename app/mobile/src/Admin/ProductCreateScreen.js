import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../i18n/LanguageContext';
import { COLORS } from '../../constants/Theme';

const AdminInput = ({ label, placeholder, value, onChangeText, multiline, keyboardType, prefix }) => (
    <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[
            styles.inputContainer,
            multiline && styles.textAreaContainer,
            prefix && { flexDirection: 'row', alignItems: 'center' }
        ]}>
            {prefix && <Text style={styles.inputPrefix}>{prefix}</Text>}
            <TextInput
                style={[styles.input, multiline && styles.textArea]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#94a3b8"
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                textAlignVertical={multiline ? 'top' : 'center'}
                keyboardType={keyboardType}
            />
        </View>
    </View>
);

const ProductCreateScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const [optionTypes, setOptionTypes] = useState([
        { name: t('admin_product_color'), values: [] }
    ]);
    const [newOptionValue, setNewOptionValue] = useState('');
    const [activeOptionIndex, setActiveOptionIndex] = useState(null);

    const [variants, setVariants] = useState([]);

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
        if (currentStep === 0) {
            if (!name) {
                Alert.alert(t('error'), t('admin_error_name_required'));
                return;
            }
            setCurrentStep(1);
        } else if (currentStep === 1) {
            const validOptions = optionTypes.filter(o => o.name && o.values.length > 0);
            if (validOptions.length === 0) {
                Alert.alert(t('error'), t("admin_error_at_least_one_option"));
                return;
            }
            generateVariants(validOptions);
            setCurrentStep(2);
        } else {
            Alert.alert(t('success'), t('admin_msg_create_success'));
            navigation.goBack();
        }
    };

    const generateVariants = (options) => {
        if (!options || options.length === 0) return;

        const mainOption = options[0];
        const generated = mainOption.values.map((val, index) => ({
            id: Date.now() + index,
            name: `${name} - ${val}`,
            price: '0',
            stock: '0',
            value: val
        }));
        setVariants(generated);
    };

    const addOptionType = () => {
        setOptionTypes([...optionTypes, { name: '', values: [] }]);
    };

    const removeOptionType = (index) => {
        const newTypes = [...optionTypes];
        newTypes.splice(index, 1);
        setOptionTypes(newTypes);
    };

    const updateOptionName = (index, text) => {
        const newTypes = [...optionTypes];
        newTypes[index].name = text;
        setOptionTypes(newTypes);
    };

    const addOptionValue = (index) => {
        if (!newOptionValue.trim()) return;
        const newTypes = [...optionTypes];
        newTypes[index].values.push(newOptionValue.trim());
        setOptionTypes(newTypes);
        setNewOptionValue('');
    };

    const removeOptionValue = (typeIndex, valIndex) => {
        const newTypes = [...optionTypes];
        newTypes[typeIndex].values.splice(valIndex, 1);
        setOptionTypes(newTypes);
    };

    const renderGeneralStep = () => (
        <View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{t('admin_section_general')}</Text>
                <AdminInput
                    label={t('admin_label_name')}
                    placeholder={t('admin_placeholder_product_name')}
                    value={name}
                    onChangeText={setName}
                />
                <AdminInput
                    label={t('admin_label_category')}
                    placeholder={t('admin_placeholder_categories')}
                    value={category}
                    onChangeText={setCategory}
                    prefix={<Ionicons name="list" size={18} color="#94a3b8" style={{ marginRight: 8 }} />}
                />
                <AdminInput
                    label={t('admin_label_desc')}
                    placeholder={t('admin_placeholder_desc')}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>{t('admin_section_media')}</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.8}>
                    {image ? (
                        <>
                            <Image source={{ uri: image }} style={styles.previewImage} />
                            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImage(null)}>
                                <Ionicons name="close-circle" size={24} color="#ef4444" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.uploadPlaceholder}>
                            <View style={styles.uploadIconCircle}>
                                <Ionicons name="cloud-upload-outline" size={28} color={COLORS.mainTitle || '#c2185b'} />
                            </View>
                            <Text style={styles.uploadText}>{t('admin_btn_upload')}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderOptionsStep = () => (
        <View>
            <Text style={styles.sectionDesc}>{t('admin_msg_options_desc')}</Text>
            {optionTypes.map((opt, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>{t('admin_label_option_name')} {index + 1}</Text>
                        {index > 0 && <TouchableOpacity onPress={() => removeOptionType(index)}>
                            <MaterialCommunityIcons name="delete-outline" size={24} color="#ef4444" />
                        </TouchableOpacity>}
                    </View>

                    <AdminInput
                        placeholder={t('admin_placeholder_option_name')}
                        value={opt.name}
                        onChangeText={(text) => updateOptionName(index, text)}
                    />

                    <Text style={styles.label}>{t('admin_values')}</Text>
                    <View style={styles.tagsContainer}>
                        {opt.values.map((val, valIdx) => (
                            <TouchableOpacity key={valIdx} style={styles.tag} onPress={() => removeOptionValue(index, valIdx)}>
                                <Text style={styles.tagText}>{val}</Text>
                                <Ionicons name="close" size={14} color={COLORS.mainTitle || '#c2185b'} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.addValueRow}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <AdminInput
                                placeholder={t('admin_placeholder_add_value')}
                                value={activeOptionIndex === index ? newOptionValue : ''}
                                onChangeText={(text) => {
                                    setActiveOptionIndex(index);
                                    setNewOptionValue(text);
                                }}
                            />
                        </View>
                        <TouchableOpacity style={styles.addBtnSmall} onPress={() => addOptionValue(index)}>
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <TouchableOpacity style={styles.dashedBtn} onPress={addOptionType}>
                <Ionicons name="add-circle-outline" size={24} color={COLORS.mainTitle || '#c2185b'} />
                <Text style={styles.dashedBtnText}>{t('admin_btn_add_option')}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderVariantsStep = () => (
        <View>
            <Text style={styles.sectionDesc}>{t('admin_msg_variants_desc')}</Text>
            {variants.map((variant) => (
                <View key={variant.id} style={styles.variantCard}>
                    <View style={styles.variantImagePlaceholder}>
                        <MaterialCommunityIcons name="image-plus" size={24} color="#cbd5e1" />
                    </View>
                    <View style={styles.variantInfo}>
                        <Text style={styles.variantName}>{variant.name}</Text>
                        <View style={styles.variantRow}>
                            <View style={{ flex: 1 }}>
                                <AdminInput
                                    placeholder={t('admin_placeholder_price')}
                                    prefix="$"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ width: 12 }} />
                            <View style={{ flex: 1 }}>
                                <AdminInput
                                    placeholder={t('admin_placeholder_stock')}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('admin_product_create')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.stepperContainer}>
                <View style={styles.stepper}>
                    {[0, 1, 2].map((step) => (
                        <View key={step} style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                currentStep >= step ? styles.stepActive : styles.stepInactive,
                                currentStep === step && styles.stepCurrent
                            ]}>
                                {currentStep > step ? (
                                    <Ionicons name="checkmark" size={16} color="white" />
                                ) : (
                                    <View style={styles.stepIconWrapper}>
                                        {step === 0 && <Feather name="shopping-bag" size={16} color={currentStep >= step ? "white" : "#94a3b8"} />}
                                        {step === 1 && <Feather name="settings" size={16} color={currentStep >= step ? "white" : "#94a3b8"} />}
                                        {step === 2 && <MaterialCommunityIcons name="collage" size={16} color={currentStep >= step ? "white" : "#94a3b8"} />}
                                    </View>
                                )}
                            </View>
                            {step < 2 && (
                                <View style={[
                                    styles.stepLine,
                                    currentStep > step && { backgroundColor: COLORS.mainTitle || '#c2185b' }
                                ]} />
                            )}
                        </View>
                    ))}
                </View>
                <Text style={styles.stepLabel}>
                    {currentStep === 0 ? t('admin_section_general') :
                        currentStep === 1 ? t('admin_step_options') : t('admin_step_variants')}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {currentStep === 0 && renderGeneralStep()}
                {currentStep === 1 && renderOptionsStep()}
                {currentStep === 2 && renderVariantsStep()}
            </ScrollView>

            <View style={styles.footer}>
                {currentStep > 0 && (
                    <TouchableOpacity
                        style={[styles.btn, styles.secondaryBtn]}
                        onPress={() => setCurrentStep(currentStep - 1)}
                    >
                        <Text style={[styles.btnText, { color: '#333' }]}>{t('back')}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.btn, styles.primaryBtn, { flex: 1, marginLeft: currentStep > 0 ? 12 : 0 }]}
                    onPress={handleNext}
                >
                    <Text style={styles.btnText}>
                        {currentStep === 0 ? t('admin_btn_create_continue') :
                            currentStep === 1 ? t('admin_btn_gen_variants') :
                                t('admin_btn_save_finish')}
                    </Text>
                    <Ionicons name={currentStep === 2 ? "checkmark-circle" : "arrow-forward"} size={24} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 40 : 50,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        elevation: 1,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    stepperContainer: {
        backgroundColor: 'white',
        paddingBottom: 16,
        paddingTop: 8,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#64748b",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 16,
        zIndex: 10,
    },
    stepper: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#fff',
        zIndex: 2,
    },
    stepActive: {
        backgroundColor: COLORS.mainTitle || '#c2185b',
        borderColor: COLORS.mainTitle || '#c2185b',
        shadowColor: COLORS.mainTitle || '#c2185b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        transform: [{ scale: 1.05 }],
    },
    stepInactive: {
        backgroundColor: '#f8fafc',
        borderColor: '#cbd5e1',
    },
    stepCurrent: {
        transform: [{ scale: 1.1 }],
        borderColor: COLORS.mainTitle || '#c2185b',
        borderWidth: 2,
        backgroundColor: '#fff',
    },
    stepIconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#e2e8f0',
        marginHorizontal: 8,
        borderRadius: 1,
    },
    stepLabel: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.mainTitle || '#c2185b',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: "#001e3c",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(241, 245, 249, 0.8)',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 10,
        marginLeft: 2,
    },
    sectionDesc: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#f1f5f9',
        paddingHorizontal: 16,
        height: 56,
        justifyContent: 'center',
        marginBottom: 24,
    },
    input: {
        fontSize: 15,
        color: '#0f172a',
        height: '100%',
        fontWeight: '500',
    },
    textAreaContainer: {
        height: 120,
        paddingVertical: 12,
        justifyContent: 'flex-start',
    },
    textArea: {
        textAlignVertical: 'top',
        lineHeight: 22,
    },
    uploadBox: {
        height: 160,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    uploadPlaceholder: {
        alignItems: 'center',
    },
    uploadIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fdf2f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    uploadText: {
        color: '#64748b',
        fontWeight: '600',
        fontSize: 14,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        padding: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fdf2f8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#fbcfe8',
    },
    tagText: {
        fontSize: 13,
        color: COLORS.mainTitle || '#c2185b',
        fontWeight: '600',
    },
    addValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    addBtnSmall: {
        width: 48,
        height: 48,
        backgroundColor: COLORS.mainTitle || '#c2185b',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: COLORS.mainTitle || '#c2185b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 3,
    },
    dashedBtn: {
        height: 56,
        borderWidth: 1.5,
        borderColor: COLORS.mainTitle || '#c2185b',
        borderStyle: 'dashed',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff',
        marginBottom: 32,
    },
    dashedBtnText: {
        color: COLORS.mainTitle || '#c2185b',
        fontWeight: '700',
        fontSize: 15,
    },
    variantCard: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    variantImagePlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    variantInfo: {
        flex: 1,
    },
    variantName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 8,
    },
    variantRow: {
        flexDirection: 'row',
        gap: 10,
    },
    smallInput: {
        flex: 1,
        height: 44,
        marginBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
    inputPrefix: {
        color: '#94a3b8',
        marginRight: 6,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        flexDirection: 'row',
        gap: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 8,
    },
    btn: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    primaryBtn: {
        backgroundColor: COLORS.mainTitle || '#c2185b',
        shadowColor: COLORS.mainTitle || '#c2185b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    secondaryBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        width: 90,
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    }
});

export default ProductCreateScreen;
