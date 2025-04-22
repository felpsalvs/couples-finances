import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceContext } from '../hooks/useFinanceContext';
import { Ionicons } from '@expo/vector-icons';
import { Account, AccountType } from '../types/finance';

// Componente para cartão de conta
const AccountCard = ({ account, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-card rounded-xl p-4 shadow mb-3 flex-row items-center justify-between"
      onPress={() => onPress(account)}
    >
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: account.color ? account.color + '20' : '#3498db20' }}
        >
          <Ionicons
            name={account.icon || "wallet-outline"}
            size={20}
            color={account.color || "#3498db"}
          />
        </View>
        <View className="ml-3">
          <Text className="text-text-primary font-medium">{account.name}</Text>
          <Text className="text-text-secondary text-xs">
            {account.type === 'shared' ? 'Conta Compartilhada' : 'Conta Individual'}
          </Text>
        </View>
      </View>
      <Text className="text-lg font-bold text-text-primary">
        {`R$ ${account.balance.toFixed(2).replace('.', ',')}`}
      </Text>
    </TouchableOpacity>
  );
};

// Componente para abas
const TabSelector = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View className="flex-row bg-background rounded-lg p-1 mb-4">
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setActiveTab(index)}
          className={`flex-1 py-2 px-4 rounded-md ${activeTab === index ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text className={`text-center font-medium ${activeTab === index ? 'text-white' : 'text-text-secondary'}`}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Seletor de ícones
const IconSelector = ({ selectedIcon, onSelect }) => {
  const icons = [
    'wallet-outline',
    'card-outline',
    'cash-outline',
    'business-outline',
    'home-outline',
    'briefcase-outline',
    'pricetags-outline',
    'gift-outline'
  ];

  return (
    <View className="flex-row flex-wrap mt-2 mb-4 bg-background p-2 rounded-lg">
      {icons.map((icon, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(icon)}
          className={`w-10 h-10 m-1 rounded-full items-center justify-center ${selectedIcon === icon ? 'bg-primary/20' : 'bg-card'}`}
        >
          <Ionicons
            name={icon}
            size={20}
            color={selectedIcon === icon ? '#3498db' : '#7f8c8d'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Seletor de cores
const ColorSelector = ({ selectedColor, onSelect }) => {
  const colors = [
    '#3498db', // Azul
    '#2ecc71', // Verde
    '#e74c3c', // Vermelho
    '#f39c12', // Laranja
    '#9b59b6', // Roxo
    '#1abc9c', // Turquesa
    '#34495e', // Azul escuro
    '#7f8c8d', // Cinza
  ];

  return (
    <View className="flex-row flex-wrap mt-2 mb-4 bg-background p-2 rounded-lg">
      {colors.map((color, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(color)}
          className={`w-10 h-10 m-1 rounded-full items-center justify-center`}
          style={{ backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0, borderColor: 'white' }}
        />
      ))}
    </View>
  );
};

// Tela principal de contas
const AccountsScreen = () => {
  const {
    state,
    getSharedAccounts,
    getIndividualAccounts,
    addAccount,
    updateAccount,
    deleteAccount
  } = useFinanceContext();

  const [activeTab, setActiveTab] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [accountBeingEdited, setAccountBeingEdited] = useState<Account | null>(null);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');
  const [newAccountType, setNewAccountType] = useState<AccountType>('shared');
  const [newAccountIcon, setNewAccountIcon] = useState('wallet-outline');
  const [newAccountColor, setNewAccountColor] = useState('#3498db');
  const [newAccountVisible, setNewAccountVisible] = useState(true);

  const tabs = ['Todas', 'Compartilhadas', 'Individuais'];

  // Limpar os campos do formulário
  const resetForm = () => {
    setNewAccountName('');
    setNewAccountBalance('');
    setNewAccountType('shared');
    setNewAccountIcon('wallet-outline');
    setNewAccountColor('#3498db');
    setNewAccountVisible(true);
    setAccountBeingEdited(null);
  };

  // Abrir modal para adicionar conta
  const handleAddAccount = () => {
    resetForm();
    setModalVisible(true);
  };

  // Abrir modal para editar conta
  const handleEditAccount = (account: Account) => {
    setAccountBeingEdited(account);
    setNewAccountName(account.name);
    setNewAccountBalance(account.balance.toString());
    setNewAccountType(account.type);
    setNewAccountIcon(account.icon || 'wallet-outline');
    setNewAccountColor(account.color || '#3498db');
    setNewAccountVisible(account.isVisible);
    setModalVisible(true);
  };

  // Salvar conta (nova ou editada)
  const handleSaveAccount = async () => {
    if (!newAccountName.trim()) {
      Alert.alert('Erro', 'O nome da conta é obrigatório');
      return;
    }

    const balance = parseFloat(newAccountBalance.replace(',', '.'));
    if (isNaN(balance)) {
      Alert.alert('Erro', 'O saldo deve ser um número válido');
      return;
    }

    try {
      if (accountBeingEdited) {
        // Atualizar conta existente
        await updateAccount({
          ...accountBeingEdited,
          name: newAccountName,
          balance,
          type: newAccountType,
          icon: newAccountIcon,
          color: newAccountColor,
          isVisible: newAccountVisible,
        });
      } else {
        // Adicionar nova conta
        await addAccount({
          name: newAccountName,
          balance,
          type: newAccountType,
          icon: newAccountIcon,
          color: newAccountColor,
          isVisible: newAccountVisible,
          ownerId: newAccountType === 'individual' ? state.currentUser?.id : undefined,
        });
      }
      resetForm();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a conta');
      console.error(error);
    }
  };

  // Excluir conta
  const handleDeleteAccount = async () => {
    if (!accountBeingEdited) return;

    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir a conta "${accountBeingEdited.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(accountBeingEdited.id);
              resetForm();
              setModalVisible(false);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a conta');
              console.error(error);
            }
          }
        },
      ]
    );
  };

  // Filtrar contas com base na aba selecionada
  const getFilteredAccounts = () => {
    switch (activeTab) {
      case 0: // Todas
        return [...getSharedAccounts(), ...getIndividualAccounts()];
      case 1: // Compartilhadas
        return getSharedAccounts();
      case 2: // Individuais
        return getIndividualAccounts();
      default:
        return [];
    }
  };

  const filteredAccounts = getFilteredAccounts();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-text-primary">Contas</Text>
          <TouchableOpacity
            className="w-10 h-10 bg-primary rounded-full items-center justify-center"
            onPress={handleAddAccount}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TabSelector tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {filteredAccounts.length > 0 ? (
          filteredAccounts.map(account => (
            <AccountCard
              key={account.id}
              account={account}
              onPress={handleEditAccount}
            />
          ))
        ) : (
          <View className="items-center justify-center py-8">
            <Ionicons name="wallet-outline" size={48} color="#7f8c8d" />
            <Text className="text-text-secondary mt-2 text-center">
              Nenhuma conta encontrada. Adicione sua primeira conta clicando no botão +.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal para adicionar/editar conta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-card rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-text-primary">
                {accountBeingEdited ? 'Editar Conta' : 'Nova Conta'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            <Text className="text-text-primary font-medium mb-1">Nome da Conta</Text>
            <TextInput
              className="bg-background rounded-lg p-3 mb-4 text-text-primary"
              placeholder="Ex: Conta Corrente, Poupança..."
              value={newAccountName}
              onChangeText={setNewAccountName}
            />

            <Text className="text-text-primary font-medium mb-1">Saldo Atual</Text>
            <TextInput
              className="bg-background rounded-lg p-3 mb-4 text-text-primary"
              placeholder="0,00"
              keyboardType="decimal-pad"
              value={newAccountBalance}
              onChangeText={setNewAccountBalance}
            />

            <Text className="text-text-primary font-medium mb-2">Tipo de Conta</Text>
            <View className="flex-row bg-background rounded-lg mb-4">
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-md ${newAccountType === 'shared' ? 'bg-primary' : 'bg-transparent'}`}
                onPress={() => setNewAccountType('shared')}
              >
                <Text className={`text-center ${newAccountType === 'shared' ? 'text-white' : 'text-text-secondary'}`}>
                  Compartilhada
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-md ${newAccountType === 'individual' ? 'bg-primary' : 'bg-transparent'}`}
                onPress={() => setNewAccountType('individual')}
              >
                <Text className={`text-center ${newAccountType === 'individual' ? 'text-white' : 'text-text-secondary'}`}>
                  Individual
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-text-primary font-medium mb-1">Escolha um ícone</Text>
            <IconSelector selectedIcon={newAccountIcon} onSelect={setNewAccountIcon} />

            <Text className="text-text-primary font-medium mb-1">Escolha uma cor</Text>
            <ColorSelector selectedColor={newAccountColor} onSelect={setNewAccountColor} />

            {newAccountType === 'individual' && (
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-text-primary font-medium">Visível para o parceiro</Text>
                <Switch
                  value={newAccountVisible}
                  onValueChange={setNewAccountVisible}
                  trackColor={{ false: '#e2e8f0', true: '#3498db30' }}
                  thumbColor={newAccountVisible ? '#3498db' : '#cbd5e1'}
                />
              </View>
            )}

            <View className="flex-row justify-between mb-4">
              {accountBeingEdited && (
                <TouchableOpacity
                  className="flex-1 mr-2 bg-secondary py-3 px-4 rounded-lg items-center"
                  onPress={handleDeleteAccount}
                >
                  <Text className="text-white font-medium">Excluir</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className={`flex-1 ${accountBeingEdited ? 'ml-2' : ''} bg-primary py-3 px-4 rounded-lg items-center`}
                onPress={handleSaveAccount}
              >
                <Text className="text-white font-medium">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AccountsScreen;