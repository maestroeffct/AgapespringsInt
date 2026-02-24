import React from 'react';
import { FlatList } from 'react-native';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { TestimonyCard } from '../../components/Cards/TestimonyCard.tsx/TestimonyCard';

export default function TestimonyListScreen({ navigation }: any) {
  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="Testimony Section"
        showLogo={false}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
      />

      <FlatList
        data={[1, 2, 3, 4, 5]}
        keyExtractor={(_, i) => String(i)}
        renderItem={() => <TestimonyCard full />}
        contentContainerStyle={{ padding: 16 }}
      />
    </ScreenWrapper>
  );
}
