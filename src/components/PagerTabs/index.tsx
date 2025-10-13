import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'
import PagerView from 'react-native-pager-view';

const PagerTabs = () => {
    const [activeTab, setActiveTab] = useState(0);
    const pagerRef = useRef(null);

    const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];

    const handleTabPress = (index) => {
        setActiveTab(index);
        pagerRef.current?.setPage(index);
    };

    const handlePageSelected = (e) => {
        setActiveTab(e.nativeEvent.position);
    };

    return (
        <View style={styles.container}>
            {/* Tab Header */}
            <View style={styles.tabHeader}>
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.tab,
                            activeTab === index && styles.activeTab
                        ]}
                        onPress={() => handleTabPress(index)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === index && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Indicator */}
            <View style={styles.indicatorContainer}>
                <View style={[styles.indicator, { left: `${activeTab * 33.33}%` }]} />
            </View>

            {/* PagerView Content */}
            <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={handlePageSelected}
            >
                <View key="1" style={styles.page}>
                    <Text style={styles.pageTitle}>First Page</Text>
                    <Text style={styles.pageText}>This is the content for Tab 1</Text>
                    <Text style={styles.pageText}>You can add forms or any components here</Text>
                </View>
                <View key="2" style={styles.page}>
                    <Text style={styles.pageTitle}>Second Page</Text>
                    <Text style={styles.pageText}>This is the content for Tab 2</Text>
                    <Text style={styles.pageText}>Add your form components here</Text>
                </View>
                <View key="3" style={styles.page}>
                    <Text style={styles.pageTitle}>Third Page</Text>
                    <Text style={styles.pageText}>This is the content for Tab 3</Text>
                    <Text style={styles.pageText}>More content can go here</Text>
                </View>
            </PagerView>
        </View>
    )
}

export default PagerTabs

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        width: '100%',
    },
    tabHeader: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: '#fff',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    indicatorContainer: {
        height: 3,
        backgroundColor: '#fff',
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        width: '33.33%',
        height: '100%',
        backgroundColor: '#007AFF',
        transition: 'left 0.3s ease',
    },
    pagerView: {
        flex: 1,
    },
    page: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    pageText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
        lineHeight: 24,
    },
})