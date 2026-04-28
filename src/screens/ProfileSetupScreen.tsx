import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { supabase } from '../lib/supabase';

type Props = {
  userId: string;
  onComplete: () => void;
};

export default function ProfileSetupScreen({ userId, onComplete }: Props) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      const ext = uri.split('.').pop() || 'jpg';
      const fileName = `${userId}/${Date.now()}.${ext}`;

      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error } = await supabase.storage
        .from('photos')
        .upload(fileName, arrayBuffer, { contentType: `image/${ext}` });

      if (error) {
        Alert.alert('Error', 'Failed to upload photo');
        return;
      }

      const { data } = supabase.storage.from('photos').getPublicUrl(fileName);
      setPhotos([...photos, data.publicUrl]);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    const ageNum = parseInt(age);
    if (!ageNum || ageNum < 18 || ageNum > 120) {
      Alert.alert('Error', 'Please enter a valid age (18+)');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('profiles').insert({
      id: userId,
      name: name.trim(),
      age: ageNum,
      bio: bio.trim(),
      photos,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      onComplete();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Set Up Profile</Text>
      <Text style={styles.subtitle}>Let people know who you are</Text>

      <View style={styles.photosSection}>
        <Text style={styles.label}>Photos</Text>
        <View style={styles.photosGrid}>
          {photos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.photo} />
          ))}
          {photos.length < 6 && (
            <TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
              <Text style={styles.addPhotoText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your first name"
          placeholderTextColor={colors.textLight}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Your age"
          placeholderTextColor={colors.textLight}
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          maxLength={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Tell people about yourself..."
          placeholderTextColor={colors.textLight}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          maxLength={300}
        />
        <Text style={styles.charCount}>{bio.length}/300</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Get Started</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: 60,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  photosSection: {
    marginBottom: spacing.lg,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  photo: {
    width: 100,
    height: 133,
    borderRadius: borderRadius.md,
  },
  addPhoto: {
    width: 100,
    height: 133,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  addPhotoText: {
    fontSize: 32,
    color: colors.textLight,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    ...typography.small,
    color: colors.textLight,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
