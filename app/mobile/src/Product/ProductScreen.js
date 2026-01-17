import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS } from '../constants/Theme';
import axiosClient from '../api/axiosClient';
import { useLanguage } from '../i18n/LanguageContext';

const ProductScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mimic the web fetch
        axiosClient.get('/product')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch products error:", err);
                setLoading(false);
            });
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.productItem}>
            {/* Placeholder image since we might not have the URL working cleanly yet or need specific assets */}
            <View style={styles.imagePlaceholder}>
                <Text style={{ color: '#888' }}>Image</Text>
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.productBottom}>
                    <Text style={styles.productPrice}>{item.price ? item.price.toLocaleString("vi-VN") : 0}đ</Text>
                    <TouchableOpacity style={styles.addToCartBtn} onPress={() => addToCart(item.productId)}>
                        <Text style={styles.addToCartText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const addToCart = async (productId) => {
        try {
            await axiosClient.post('/cart', {
                productId: productId,
                userId: 1, // Hardcoded for now as per web
            });
            Alert.alert("Success", t('add_cart_success')); // Using Alert instead of lower case alert for consistency in RN
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add to cart");
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
        <View style={styles.container}>
            <Text style={styles.headerTitle}>{t('product')}</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.productId?.toString() || Math.random().toString()}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        textAlign: 'center',
        marginVertical: 15,
    },
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productItem: {
        width: '48%',
        backgroundColor: COLORS.background2,
        marginBottom: 15,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2, // Shadow for android
        shadowColor: '#000', // Shadow for IOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    imagePlaceholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        padding: 10,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
        color: '#000',
    },
    productDesc: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
    },
    productBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    addToCartBtn: {
        backgroundColor: COLORS.mainTitle,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ProductScreen;
