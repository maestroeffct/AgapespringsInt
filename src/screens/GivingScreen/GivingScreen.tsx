import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Linking,
  Modal,
  ActivityIndicator,
  FlatList,
  TextInput,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../theme/ThemeProvider';
import { showSuccess } from '../../helpers/toast';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import {
  churchLocationsQueryOptions,
  givingAccountsQueryOptions,
  GivingAccountItem,
  ChurchLocationItem,
} from '../../backend/api/queries';
import { useSelectedGivingLocation } from '../../hooks/useSelectedGivingLocation';
import createStyles from './styles';

type GivingTab = { id: 'tithe_offering' | 'partnership'; label: string };

const GIVING_TABS: GivingTab[] = [
  { id: 'tithe_offering', label: 'Tithe & Offering' },
  { id: 'partnership', label: 'Partnership' },
];

type OtherCategory = {
  id:
    | 'kids_teens'
    | 'welfare'
    | 'special_meeting'
    | 'resources'
    | 'seed'
    | 'projects';
  label: string;
  icon: string;
};

const OTHER_CATEGORIES: OtherCategory[] = [
  { id: 'projects', label: 'Projects', icon: 'construct-outline' },
  { id: 'special_meeting', label: 'Special Meeting', icon: 'star-outline' },
  { id: 'seed', label: 'Seed', icon: 'leaf-outline' },
  { id: 'welfare', label: 'Welfare', icon: 'heart-outline' },
  { id: 'kids_teens', label: 'Kids & Teens', icon: 'people-outline' },
  { id: 'resources', label: 'Resources', icon: 'book-outline' },
];

// ─── BankCard ─────────────────────────────────────────────────────────────────
function BankCard({
  account,
  isDark,
  primary,
}: {
  account: GivingAccountItem;
  isDark: boolean;
  primary: string;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors, isDark);
  const cardBg = isDark ? '#1a1a1a' : '#f7f7f7';
  const textPrimary = isDark ? '#ffffff' : '#111827';
  const textSecondary = isDark ? '#9ca3af' : '#6b7280';
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb';

  const copyNumber = () => {
    Clipboard.setString(account.accountNumber);
    showSuccess('Copied!', `${account.bankName} account number copied`);
  };

  return (
    <View style={[styles.bankCard, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.bankCardTop}>
        <View style={[styles.bankPill, { backgroundColor: primary + '22' }]}>
          <Ionicons name="business-outline" size={13} color={primary} />
          <Text style={[styles.bankPillText, { color: primary }]}>
            {account.bankName}
          </Text>
        </View>
        {account.currency && (
          <View
            style={[
              styles.currencyBadge,
              { backgroundColor: primary + '18', borderColor: primary + '30' },
            ]}
          >
            <Ionicons name="cash-outline" size={12} color={primary} />
            <Text style={[styles.currencyText, { color: primary }]}>
              {account.currency}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.accountName, { color: textPrimary }]}>
        {account.name}
      </Text>

      <View style={styles.accountNumberWrap}>
        <Text style={[styles.accountNumber, { color: textPrimary }]}>
          {account.accountNumber}
        </Text>
      </View>

      <Text
        style={[styles.sortCode, { color: textSecondary }]}
        numberOfLines={1}
      >
        {account.accountHolderName}
      </Text>

      <TouchableOpacity
        onPress={copyNumber}
        style={[styles.copyBtn, { borderColor: primary + '40' }]}
        activeOpacity={0.7}
      >
        <Ionicons name="copy-outline" size={15} color={primary} />
        <Text style={[styles.copyText, { color: primary }]}>
          Copy Account Number
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── LocationPicker Modal ─────────────────────────────────────────────────────
function LocationPickerModal({
  visible,
  onClose,
  onSelect,
  selectedId,
  isDark,
  primary,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (loc: ChurchLocationItem | null) => void;
  selectedId?: string;
  isDark: boolean;
  primary: string;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors, isDark);
  const { data: locations = [], isLoading } = useQuery(
    churchLocationsQueryOptions(),
  );
  const bg = isDark ? '#111111' : '#ffffff';
  const textPrimary = isDark ? '#ffffff' : '#111827';
  const textSecondary = isDark ? '#9ca3af' : '#6b7280';
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={[styles.modalSheet, { backgroundColor: bg }]}>
        <View style={[styles.modalHandle, styles.modalHandleBg]} />
        <Text style={[styles.modalTitle, { color: textPrimary }]}>
          Select Your Branch
        </Text>
        <Text style={[styles.modalSub, { color: textSecondary }]}>
          Account details will update based on your branch
        </Text>

        {isLoading ? (
          <ActivityIndicator color={primary} style={styles.loader} />
        ) : (
          <FlatList
            data={locations}
            keyExtractor={item => item.id}
            style={styles.listTopMargin}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedId;
              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  style={[
                    styles.locationItem,
                    { borderBottomColor: borderColor },
                    isSelected && { backgroundColor: primary + '12' },
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.flex1}>
                    <Text style={[styles.locationName, { color: textPrimary }]}>
                      {item.name}
                    </Text>
                    {item.address ? (
                      <Text
                        style={[
                          styles.locationAddress,
                          { color: textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {item.address}
                      </Text>
                    ) : null}
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={primary}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => {
            onSelect(null);
            onClose();
          }}
          style={[styles.clearBtn, { borderColor: borderColor }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.clearBtnText, { color: textSecondary }]}>
            Clear selection
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ─── GivingScreen ─────────────────────────────────────────────────────────────
export default function GivingScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme.colors, isDark);
  const primary = theme.colors.primary;
  const scrollViewRef = useRef<ScrollView>(null);
  const otherAccountsY = useRef(0);

  const [activeTab, setActiveTab] = useState<'tithe_offering' | 'partnership'>(
    'tithe_offering',
  );
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedOther, setSelectedOther] = useState<OtherCategory | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');

  const { location, loaded, saveLocation } = useSelectedGivingLocation();
  const { data: accounts = [], isLoading: loadingAccounts } = useQuery(
    givingAccountsQueryOptions(loaded ? location?.id ?? undefined : undefined),
  );

  const cardBg = isDark ? '#141414' : '#f0f0f0';
  const sectionBg = isDark ? '#0d0d0d' : '#ffffff';
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb';
  const textPrimary = isDark ? '#ffffff' : '#111827';
  const textSecondary = isDark ? '#9ca3af' : '#6b7280';

  const tabAccounts = accounts.filter(a =>
    activeTab === 'tithe_offering'
      ? a.category === 'tithe' ||
        a.category === 'offering' ||
        a.category === 'tithe_offering'
      : a.category === activeTab,
  );

  const otherAccounts = selectedOther
    ? accounts.filter(a => a.category === selectedOther.id)
    : [];

  const searchResults =
    searchQuery.trim().length > 0
      ? accounts.filter(a => {
          const q = searchQuery.toLowerCase();
          return (
            a.name?.toLowerCase().includes(q) ||
            a.bankName?.toLowerCase().includes(q) ||
            a.accountHolderName?.toLowerCase().includes(q) ||
            a.accountNumber?.includes(q)
          );
        })
      : [];

  const isSearching = searchQuery.trim().length > 0;

  const selectOtherCategory = (item: OtherCategory) => {
    const isActive = selectedOther?.id === item.id;
    setSelectedOther(isActive ? null : item);
    if (!isActive) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: otherAccountsY.current,
          animated: true,
        });
      }, 50);
    }
  };

  const openGiveWebsite = () => {
    Linking.openURL('https://www.agapespringsint.com/giving');
  };

  return (
    <ScreenWrapper padded={false}>
      <View style={styles.safe}>
        <AppHeader
          showLogo
          logoVariant="compact"
          title="Giving"
          rightType="none"
          onLeftPress={() => navigation.openDrawer()}
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Branch selector ── */}
          <TouchableOpacity
            onPress={() => setShowLocationPicker(true)}
            style={[
              styles.branchSelector,
              { backgroundColor: sectionBg, borderColor },
            ]}
            activeOpacity={0.8}
          >
            <View
              style={[styles.branchIcon, { backgroundColor: primary + '18' }]}
            >
              <Ionicons name="location-outline" size={16} color={primary} />
            </View>
            <View style={styles.flex1}>
              <Text style={[styles.branchLabel, { color: textSecondary }]}>
                Your Branch
              </Text>
              <Text
                style={[
                  styles.branchName,
                  { color: location ? textPrimary : textSecondary },
                ]}
              >
                {location ? location.name : 'Select your branch'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={textSecondary} />
          </TouchableOpacity>
          {/* ── Search bar ── */}
          <View
            style={[
              styles.searchBar,
              { backgroundColor: sectionBg, borderColor },
            ]}
          >
            <Ionicons name="search-outline" size={17} color={textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: textPrimary }]}
              placeholder="Search accounts..."
              placeholderTextColor={textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={17} color={textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          {/* ── Search results ── */}
          {isSearching && (
            <View style={styles.searchResults}>
              {searchResults.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="search-outline"
                    size={28}
                    color={textSecondary}
                  />
                  <Text style={[styles.emptyText, { color: textSecondary }]}>
                    No accounts found
                  </Text>
                </View>
              ) : (
                searchResults.map(account => (
                  <BankCard
                    key={account.id}
                    account={account}
                    isDark={isDark}
                    primary={primary}
                  />
                ))
              )}
            </View>
          )}
          {/* ── Main giving card ── */}
          {!isSearching && (
            <View
              style={[
                styles.mainCard,
                { backgroundColor: cardBg, borderColor },
              ]}
            >
              {/* Tab selector */}
              <View style={styles.tabRow}>
                {GIVING_TABS.map(tab => {
                  const isActive = tab.id === activeTab;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => setActiveTab(tab.id)}
                      style={[
                        styles.tabBtn,
                        isActive && { backgroundColor: primary },
                      ]}
                      activeOpacity={0.8}
                    >
                      {isActive && (
                        <Ionicons
                          name="heart"
                          size={12}
                          color="#fff"
                          style={styles.tabIcon}
                        />
                      )}
                      <Text
                        style={[
                          styles.tabLabel,
                          { color: isActive ? '#fff' : textSecondary },
                          isActive && styles.tabLabelActive,
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Accounts */}
              <View style={styles.accountsContainer}>
                {loadingAccounts ? (
                  <ActivityIndicator color={primary} style={styles.tabLoader} />
                ) : tabAccounts.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="wallet-outline"
                      size={32}
                      color={textSecondary}
                    />
                    <Text style={[styles.emptyText, { color: textSecondary }]}>
                      No accounts available
                    </Text>
                  </View>
                ) : (
                  tabAccounts.map(account => (
                    <BankCard
                      key={account.id}
                      account={account}
                      isDark={isDark}
                      primary={primary}
                    />
                  ))
                )}
              </View>

              {/* Give Online row */}
              <TouchableOpacity
                onPress={openGiveWebsite}
                style={[styles.giveOnlineRow, { borderTopColor: borderColor }]}
                activeOpacity={0.7}
              >
                <View>
                  <Text
                    style={[styles.giveOnlineLabel, { color: textPrimary }]}
                  >
                    Give Online{' '}
                    <Text style={[styles.comingSoon, { color: textSecondary }]}>
                      (coming soon)
                    </Text>
                  </Text>
                  <View style={styles.paymentIcons}>
                    <View style={styles.payIconMC}>
                      <Text style={styles.payIconText}>MC</Text>
                    </View>
                    <View style={styles.payIconPS}>
                      <Text style={styles.payIconText}>PS</Text>
                    </View>
                    <View style={styles.payIconVISA}>
                      <Text style={styles.payIconText}>VISA</Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={primary} />
              </TouchableOpacity>
            </View>
          )}
          {/* end !isSearching */}
          {/* ── Other ways to give ── */}
          {!isSearching && (
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              Other ways to Give
            </Text>
          )}
          {!isSearching && (
            <FlatList
              data={OTHER_CATEGORIES}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.otherList}
              renderItem={({ item }) => {
                const isActive = selectedOther?.id === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => selectOtherCategory(item)}
                    activeOpacity={0.8}
                    style={[
                      styles.otherCard,
                      {
                        backgroundColor: isActive ? primary + '18' : sectionBg,
                        borderColor: isActive ? primary : borderColor,
                      },
                    ]}
                  >
                    <View style={styles.otherCardHeader}>
                      <View
                        style={[
                          styles.otherIcon,
                          { backgroundColor: primary + '20' },
                        ]}
                      >
                        <Ionicons
                          name={item.icon as any}
                          size={18}
                          color={primary}
                        />
                      </View>
                      {isActive && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={primary}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.otherCardTitle,
                        { color: isActive ? primary : textPrimary },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[styles.otherCardSub, { color: textSecondary }]}
                    >
                      Tap to view accounts
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
          {selectedOther && (
            <View
              style={styles.otherAccountsWrap}
              onLayout={e => {
                otherAccountsY.current = e.nativeEvent.layout.y;
              }}
            >
              {otherAccounts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="wallet-outline"
                    size={28}
                    color={textSecondary}
                  />
                  <Text style={[styles.emptyText, { color: textSecondary }]}>
                    No accounts available for {selectedOther.label}
                  </Text>
                </View>
              ) : (
                otherAccounts.map(account => (
                  <BankCard
                    key={account.id}
                    account={account}
                    isDark={isDark}
                    primary={primary}
                  />
                ))
              )}
            </View>
          )}
        </ScrollView>

        <LocationPickerModal
          visible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelect={saveLocation}
          selectedId={location?.id}
          isDark={isDark}
          primary={primary}
        />
      </View>
    </ScreenWrapper>
  );
}
