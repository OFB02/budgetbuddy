import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { BudgetWidgetView, saveWidgetData } from './BudgetWidget';

export default function WidgetCreatorScreen({ budgetData, onBack }) {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [isCreating, setIsCreating] = useState(false);
  const widgetRef = useRef(null);

  const widgetSizes = [
    { id: 'small', name: 'Small', description: '2x2', icon: 'square-small' },
    { id: 'medium', name: 'Medium', description: '4x2', icon: 'square-medium' },
    { id: 'large', name: 'Large', description: '4x4', icon: 'square' },
  ];

  const handleCreateWidget = async () => {
    try {
      setIsCreating(true);

      // Capture the widget as an image
      const uri = await captureRef(widgetRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const fileName = `BudgetWidget_${budgetData.name.replace(/\s+/g, '_')}_${selectedSize}.png`;
      const newPath = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      // Save widget data for native widgets
      await saveWidgetData(budgetData);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath, {
          mimeType: 'image/png',
          dialogTitle: 'Save Budget Widget',
        });
      } else {
        Alert.alert('Success', 'Widget image created successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create widget: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSetAsWidget = async () => {
    try {
      setIsCreating(true);
      
      // Save widget data for native widget
      const result = await saveWidgetData(budgetData);
      
      if (result.success) {
        Alert.alert(
          'Widget Data Saved',
          'Your budget data has been saved for the widget.\n\nTo add the widget to your home screen:\n\n1. Long press on your home screen\n2. Tap the + button\n3. Search for "Budget Buddy"\n4. Select your preferred widget size\n5. Tap "Add Widget"',
          [{ text: 'Got it!' }]
        );
      } else {
        Alert.alert('Error', 'Failed to save widget data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save widget data: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleExportAllSizes = async () => {
    try {
      setIsCreating(true);
      const sizes = ['small', 'medium', 'large'];
      
      Alert.alert(
        'Export All Sizes',
        'This will create widget images for all three sizes.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Export',
            onPress: async () => {
              for (const size of sizes) {
                setSelectedSize(size);
                await new Promise(resolve => setTimeout(resolve, 500));
                await handleCreateWidget();
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export widgets: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Widget</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="widgets" size={48} color="#4a69bd" />
          <Text style={styles.title}>Budget Widget</Text>
          <Text style={styles.subtitle}>
            Create a home screen widget for "{budgetData.name}"
          </Text>
        </View>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Widget Size</Text>
          <View style={styles.sizeButtons}>
            {widgetSizes.map((size) => (
              <TouchableOpacity
                key={size.id}
                style={[
                  styles.sizeButton,
                  selectedSize === size.id && styles.sizeButtonActive,
                ]}
                onPress={() => setSelectedSize(size.id)}
              >
                <MaterialCommunityIcons
                  name={size.icon}
                  size={32}
                  color={selectedSize === size.id ? '#fff' : '#888'}
                />
                <Text
                  style={[
                    styles.sizeButtonText,
                    selectedSize === size.id && styles.sizeButtonTextActive,
                  ]}
                >
                  {size.name}
                </Text>
                <Text style={styles.sizeButtonDescription}>{size.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Widget Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Widget Preview</Text>
          <View style={styles.previewContainer}>
            <View ref={widgetRef} collapsable={false}>
              <BudgetWidgetView
                budgetData={budgetData}
                currency={budgetData.currency}
                size={selectedSize}
              />
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <MaterialCommunityIcons name="information" size={24} color="#4a69bd" />
          <View style={styles.instructionsContent}>
            <Text style={styles.instructionsTitle}>How to Add Widget</Text>
            <Text style={styles.instructionsText}>
              1. Tap "Create Widget Image" to save the widget as an image{'\n'}
              2. Set it as your wallpaper or use it in other apps{'\n'}
              {'\n'}
              Or tap "Set as Home Widget" to prepare data for a native widget (iOS/Android).
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleCreateWidget}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="image-plus" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Create Widget Image</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleSetAsWidget}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="widgets" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Set as Home Widget</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.tertiaryButton]}
            onPress={handleExportAllSizes}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="download-multiple" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Export All Sizes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Widget Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Widgets</Text>
          <Text style={styles.infoText}>
            • <Text style={styles.infoBold}>Small (2x2):</Text> Compact view with income and savings{'\n'}
            • <Text style={styles.infoBold}>Medium (4x2):</Text> Full stats with progress bar{'\n'}
            • <Text style={styles.infoBold}>Large (4x4):</Text> Interactive Sankey flow diagram showing budget visualization{'\n'}
            {'\n'}
            Widgets update automatically when you save changes to your budget.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  sizeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeButton: {
    flex: 1,
    backgroundColor: '#232340',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sizeButtonActive: {
    backgroundColor: '#4a69bd',
    borderColor: '#6a89dd',
  },
  sizeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginTop: 8,
  },
  sizeButtonTextActive: {
    color: '#fff',
  },
  sizeButtonDescription: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  previewContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsCard: {
    backgroundColor: '#232340',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 20,
    gap: 15,
  },
  instructionsContent: {
    flex: 1,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#4a69bd',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  tertiaryButton: {
    backgroundColor: '#9b59b6',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 22,
  },
  infoBold: {
    color: '#fff',
    fontWeight: '600',
  },
});
