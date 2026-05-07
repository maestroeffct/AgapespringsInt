import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Linking,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AppText } from '../../components/AppText/AppText';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { useTheme } from '../../theme/ThemeProvider';
import { showSuccess } from '../../helpers/toast';
import { givingAccountsQueryOptions } from '../../backend/api/queries';
import { RootStackParamList } from '../../navigation/types';
import createStyles from './styles';

const HERO_IMAGE = require('../../assets/images/impact/impact.png');
const GIVE_WEBSITE = 'https://www.agapespringsint.com/giving';

type Props = NativeStackScreenProps<RootStackParamList, 'Impact'>;

export default function ImpactScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme.colors, isDark);
  const [heroImageError, setHeroImageError] = useState(false);

  const { data: allAccounts = [], isLoading, refetch, isRefetching } = useQuery(givingAccountsQueryOptions());
  const accounts = allAccounts.filter(a => a.category === 'impact');

  const copyNumber = (accountNumber: string, bankName: string) => {
    Clipboard.setString(accountNumber);
    showSuccess('Copied!', `${bankName} account number copied`);
  };

  return (
    <ScreenWrapper padded={false}>
      <View style={styles.root}>
        <AppHeader
          showLogo={false}
          title="Impact 2026"
          leftType="back"
          onLeftPress={() => navigation.goBack()}
          rightType="none"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          {/* ── Hero banner ── */}
          {!heroImageError ? (
            <Image
              source={HERO_IMAGE}
              style={styles.heroImage}
              resizeMode="stretch"
              onError={() => setHeroImageError(true)}
            />
          ) : (
            <LinearGradient
              colors={['#C0102A', '#7B0018']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <View style={styles.decor1} />
              <View style={styles.decor2} />
              <View style={styles.globeWrap}>
                <Ionicons name="globe-outline" size={48} color="rgba(255,255,255,0.25)" />
              </View>
              <View style={styles.ribbonWrap}>
                <View style={styles.ribbonLeft} />
                <View style={styles.ribbonBody}>
                  <AppText font="poppins" style={styles.ribbonTitle}>IMPACT 2026</AppText>
                  <AppText font="poppins" style={styles.ribbonSub}>VISION 100,000 COPIES</AppText>
                </View>
                <View style={styles.ribbonRight} />
              </View>
              <View style={styles.statWrap}>
                <AppText font="poppins" style={styles.statText}>1 PERSON</AppText>
                <View style={styles.statEquals}>
                  <View style={styles.statLine} />
                  <AppText font="poppins" style={styles.statEqualsText}>=</AppText>
                  <View style={styles.statLine} />
                </View>
                <AppText font="poppins" style={styles.statValue}>1,000 COPIES</AppText>
              </View>
              <View style={styles.descPill}>
                <AppText style={styles.descPillText}>
                  Occupy every office, every hotel, home, school, hospital and more
                </AppText>
              </View>
            </LinearGradient>
          )}

          {/* ── CTA banner ── */}
          <View style={styles.ctaBanner}>
            <Ionicons name="globe" size={18} color="#fff" style={styles.ctaIcon} />
            <AppText font="poppins" style={styles.ctaText}>
              MAKE A DIFFERENCE TODAY, LIVE FOR IMPACT!
            </AppText>
          </View>

          {/* ── About section ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="book-outline" size={18} color={theme.colors.primary} />
              </View>
              <AppText font="poppins" style={styles.sectionTitle}>
                Grace & Glory Devotional
              </AppText>
            </View>
            <AppText style={styles.sectionBody}>
              Sponsor Grace & Glory Devotionals today. Start with 100 copies and change lives.
              Together we can place the word of God in every hand across the nations.
            </AppText>
          </View>

          {/* ── Accounts ── */}
          <AppText font="poppins" style={styles.accountsTitle}>
            Give to Impact
          </AppText>

          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
          ) : accounts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="wallet-outline" size={28} color={theme.colors.textSecondary} />
              <AppText style={styles.emptyText}>No account details available yet</AppText>
            </View>
          ) : (
            accounts.map(account => (
              <View key={account.id} style={styles.accountCard}>
                <View style={styles.accountCardTop}>
                  <View style={styles.bankPill}>
                    <Ionicons name="business-outline" size={13} color={theme.colors.primary} />
                    <AppText style={styles.bankPillText}>{account.bankName}</AppText>
                  </View>
                  <View style={styles.currencyBadge}>
                    <AppText style={styles.currencyText}>{account.currency}</AppText>
                  </View>
                </View>
                <AppText style={styles.accountLabel}>{account.name}</AppText>
                <AppText font="poppins" style={styles.accountNumber}>
                  {account.accountNumber}
                </AppText>
                <AppText style={styles.accountHolder} numberOfLines={1}>
                  {account.accountHolderName}
                </AppText>
                <TouchableOpacity
                  onPress={() => copyNumber(account.accountNumber, account.bankName)}
                  style={styles.copyBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="copy-outline" size={15} color={theme.colors.primary} />
                  <AppText style={styles.copyText}>Copy Account Number</AppText>
                </TouchableOpacity>
              </View>
            ))
          )}

          {/* ── Give online ── */}
          <TouchableOpacity
            onPress={() => Linking.openURL(GIVE_WEBSITE)}
            style={styles.giveOnlineBtn}
            activeOpacity={0.85}
          >
            <Ionicons name="globe-outline" size={18} color="#fff" />
            <AppText font="poppins" style={styles.giveOnlineBtnText}>Give Online</AppText>
          </TouchableOpacity>

          <AppText style={styles.footerNote}>
            You will be redirected to the Agapesprings website
          </AppText>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
