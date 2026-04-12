import React from 'react';
import { createFolder, listFiles, writeFile } from '../utils/fs';
import { useQuery } from '@tanstack/react-query';
import { ParentList } from '../components/ParentList';
import { Button, Text, TextInput } from 'react-native-paper';
import { View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavProp } from '../utils/types';

export const CharacterList = () => {
  const navigation = useNavigation<NavProp>();

  const [createDialogVisible, setCreateDialogVisible] = React.useState(false);
  const [newCharacterName, setNewCharacterName] = React.useState('');

  const { data: characters, refetch } = useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      return listFiles('Characters');
    },
  });

  const createCharacter = React.useCallback(async () => {
    if (!newCharacterName) return;
    await createFolder('Characters', newCharacterName);
    await writeFile(
      `Characters/${newCharacterName}`,
      'main.json',
      JSON.stringify({ name: newCharacterName }),
    );
    await refetch();
  }, [newCharacterName, refetch]);

  return (
    <View>
      <ParentList
        parents={characters ?? []}
        navigate={({ name }) => navigation.navigate('Character', { name })}
        renderContent={({ name }) => (
          <Text style={{ fontSize: 18 }}>{name}</Text>
        )}
        onCreateNew={() => {
          setCreateDialogVisible(true);
        }}
      />
      <Modal
        visible={createDialogVisible}
        onRequestClose={() => setCreateDialogVisible(false)}
        animationType="slide"
        backdropColor="gainsboro"
      >
        <View style={{ padding: 20, gap: 8 }}>
          <Text
            variant="headlineLarge"
            style={{
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 16,
              borderBottomColor: 'silver',
              borderBottomWidth: 3,
            }}
          >
            Create Character
          </Text>
          <TextInput
            label="Character Name"
            value={newCharacterName}
            onChangeText={setNewCharacterName}
          />
          <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
            <Button onPress={() => setCreateDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={async () => {
                await createCharacter();
                setCreateDialogVisible(false);
              }}
              mode="contained"
              buttonColor="teal"
            >
              Create
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};
