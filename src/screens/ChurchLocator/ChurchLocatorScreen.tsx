import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText } from '../../components/AppText/AppText';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { useChurchLocations } from '../../backend/api/hooks/useChurchLocations';
import { useTheme } from '../../theme/ThemeProvider';
import styles from './styles';
import { AppHeader } from '../../components/AppHeader/AppHeader';

type Props = {
  navigation: any;
};

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, '');
}

export default function ChurchLocatorScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { data, isLoading, isRefetching, refetch } = useChurchLocations();

  const items = data ?? [];

  const onPressPhone = async (phone: string) => {
    if (!phone) return;
    const tel = `tel:${normalizePhone(phone)}`;
    const canOpen = await Linking.canOpenURL(tel);
    if (canOpen) {
      await Linking.openURL(tel);
    }
  };

  const onPressMap = async (mapUrl: string) => {
    if (!mapUrl) return;
    const canOpen = await Linking.canOpenURL(mapUrl);
    if (canOpen) {
      await Linking.openURL(mapUrl);
    }
  };

  return (
    <ScreenWrapper
      padded={false}
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
    >
      <AppHeader
        title={'Church Locator'}
        showLogo={false}
        leftType="back"
        rightType={'none'}
        onLeftPress={() => navigation.goBack()}
      />

      {isLoading && items.length === 0 ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={item.map_url ? 0.85 : 1}
              onPress={() => onPressMap(item.map_url)}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.textSecondary,
                  borderColor: theme.colors.accent,
                },
              ]}
            >
              <AppText font="geomanist" variant="h2" style={styles.nameText}>
                {item.name}
              </AppText>
              <AppText
                font="geomanist"
                variant="body"
                style={styles.addressText}
              >
                {item.address}
              </AppText>

              {!!item.phone && (
                <TouchableOpacity
                  onPress={() => onPressPhone(item.phone)}
                  activeOpacity={0.8}
                >
                  <AppText
                    font="geomanist"
                    variant="body"
                    style={styles.phoneText}
                  >
                    {item.phone}
                  </AppText>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenWrapper>
  );
}
