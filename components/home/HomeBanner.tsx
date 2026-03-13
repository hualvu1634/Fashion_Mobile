import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';
import { getOptimizedImageSource } from '../../utils/imageUtils';

const { width } = Dimensions.get('window');

interface HomeBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  imageUrl: string;
  link: `/${string}`;
}

export const HomeBanner: React.FC<HomeBannerProps> = ({
  title,
  subtitle,
  buttonText,
  imageUrl,
  link,
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push(link as any)}>
      <ImageBackground
        source={getOptimizedImageSource(imageUrl, 'large')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    borderRadius: 16,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
  },
  content: {
    maxWidth: '80%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray[200],
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
