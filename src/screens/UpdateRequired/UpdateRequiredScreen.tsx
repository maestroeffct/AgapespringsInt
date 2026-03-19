import React from 'react';
import { Linking, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppText } from '../../components/AppText/AppText';
import { AppButton } from '../../components/AppButton/AppButton';
import { useTheme } from '../../theme/ThemeProvider';
import { RootStackParamList } from '../../navigation/types';
import { createStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateRequired'>;

export default function UpdateRequiredScreen({ route }: Props) {
  const { theme } = useTheme();
  const styles = React.useMemo(
    () => createStyles(theme.colors),
    [theme.colors],
  );
  const { currentVersion, minimumVersion, storeUrl } = route.params;

  const handleUpdate = async () => {
    if (!storeUrl) {
      return;
    }

    await Linking.openURL(storeUrl);
  };

  return (
    <ScreenWrapper padded={false}>
      <View style={styles.container}>
        <View style={styles.card}>
          <AppText font="poppins" variant="body" style={styles.eyebrow}>
            Update Required
          </AppText>

          <AppText font="poppins" variant="h2" style={styles.title}>
            Please update the app to continue
          </AppText>

          <AppText variant="body" style={styles.message}>
            A newer version of Agapesprings is required before you can enter the
            app.
          </AppText>

          <View style={styles.versionMeta}>
            <AppText variant="caption" style={styles.versionText}>
              Current version: {currentVersion}
            </AppText>
            <AppText variant="caption" style={styles.versionText}>
              Minimum required: {minimumVersion}
            </AppText>
          </View>

          <AppButton
            title="Update App"
            onPress={handleUpdate}
            style={styles.button}
            disabled={!storeUrl}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
