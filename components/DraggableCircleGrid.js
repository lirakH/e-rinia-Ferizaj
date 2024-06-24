// DraggableCircleGrid.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import CircleItem from './CircleItem';  // Ensure the path is correct based on your project structure

const DraggableCircleGrid = ({ items }) => {
    const [data, setData] = useState(items);

    return (
        <View style={styles.container}>
            <DraggableFlatList
                data={data}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item, drag, isActive }) => (
                    <CircleItem item={item} drag={drag} isActive={isActive} />
                )}
                onDragEnd={({ data }) => setData(data)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 140, // Adjust based on your content size
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingVertical: 0,
    },
});

export default DraggableCircleGrid;
