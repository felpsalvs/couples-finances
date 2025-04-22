import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceContext } from '../hooks/useFinanceContext';
import { Ionicons } from '@expo/vector-icons';
import { Category, BudgetType } from '../types/finance';

// Componente para cartão de categoria
const CategoryCard = ({ category, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-card rounded-xl p-4 shadow mb-3 flex-row items-center justify-between"
      onPress={() => onPress(category)}
    >
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: category.color ? category.color + '20' : '#3498db20' }}
        >
          <Ionicons
            name={category.icon || "list-outline"}
            size={20}
            color={category.color || "#3498db"}
          />
        </View>
        <Text className="ml-3 text-text-primary font-medium">{category.name}</Text>
      </View>
      <View className="bg-background px-2 py-1 rounded-full">
        <Text className="text-xs text-text-secondary">
          {category.type === 'shared' ? 'Compartilhada' : 'Individual'}
        </Text>
      </View>
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
    'list-outline',
    'home-outline',
    'fast-food-outline',
    'car-outline',
    'airplane-outline',
    'medical-outline',
    'fitness-outline',
    'shirt-outline',
    'gift-outline',
    'school-outline',
    'book-outline',
    'cafe-outline',
    'cart-outline',
    'cash-outline',
    'pricetags-outline',
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

// Tela principal de categorias
const CategoriesScreen = () => {
  const {
    state,
    getSharedCategories,
    getIndividualCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useFinanceContext();

  const [activeTab, setActiveTab] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryBeingEdited, setCategoryBeingEdited] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<BudgetType>('shared');
  const [newCategoryIcon, setNewCategoryIcon] = useState('list-outline');
  const [newCategoryColor, setNewCategoryColor] = useState('#3498db');

  const tabs = ['Todas', 'Compartilhadas', 'Individuais'];

  // Limpar os campos do formulário
  const resetForm = () => {
    setNewCategoryName('');
    setNewCategoryType('shared');
    setNewCategoryIcon('list-outline');
    setNewCategoryColor('#3498db');
    setCategoryBeingEdited(null);
  };

  // Abrir modal para adicionar categoria
  const handleAddCategory = () => {
    resetForm();
    setModalVisible(true);
  };

  // Abrir modal para editar categoria
  const handleEditCategory = (category: Category) => {
    setCategoryBeingEdited(category);
    setNewCategoryName(category.name);
    setNewCategoryType(category.type);
    setNewCategoryIcon(category.icon || 'list-outline');
    setNewCategoryColor(category.color || '#3498db');
    setModalVisible(true);
  };

  // Salvar categoria (nova ou editada)
  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Erro', 'O nome da categoria é obrigatório');
      return;
    }

    try {
      if (categoryBeingEdited) {
        // Atualizar categoria existente
        await updateCategory({
          ...categoryBeingEdited,
          name: newCategoryName,
          type: newCategoryType,
          icon: newCategoryIcon,
          color: newCategoryColor,
        });
      } else {
        // Adicionar nova categoria
        await addCategory({
          name: newCategoryName,
          type: newCategoryType,
          icon: newCategoryIcon,
          color: newCategoryColor,
          ownerId: newCategoryType === 'individual' ? state.currentUser?.id : undefined,
        });
      }
      resetForm();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a categoria');
      console.error(error);
    }
  };

  // Excluir categoria
  const handleDeleteCategory = async () => {
    if (!categoryBeingEdited) return;

    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir a categoria "${categoryBeingEdited.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(categoryBeingEdited.id);
              resetForm();
              setModalVisible(false);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a categoria');
              console.error(error);
            }
          }
        },
      ]
    );
  };

  // Filtrar categorias com base na aba selecionada
  const getFilteredCategories = () => {
    switch (activeTab) {
      case 0: // Todas
        return [...getSharedCategories(), ...getIndividualCategories()];
      case 1: // Compartilhadas
        return getSharedCategories();
      case 2: // Individuais
        return getIndividualCategories();
      default:
        return [];
    }
  };

  const filteredCategories = getFilteredCategories();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-text-primary">Categorias</Text>
          <TouchableOpacity
            className="w-10 h-10 bg-primary rounded-full items-center justify-center"
            onPress={handleAddCategory}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TabSelector tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={handleEditCategory}
            />
          ))
        ) : (
          <View className="items-center justify-center py-8">
            <Ionicons name="list-outline" size={48} color="#7f8c8d" />
            <Text className="text-text-secondary mt-2 text-center">
              Nenhuma categoria encontrada. Adicione sua primeira categoria clicando no botão +.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal para adicionar/editar categoria */}
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
                {categoryBeingEdited ? 'Editar Categoria' : 'Nova Categoria'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            <Text className="text-text-primary font-medium mb-1">Nome da Categoria</Text>
            <TextInput
              className="bg-background rounded-lg p-3 mb-4 text-text-primary"
              placeholder="Ex: Moradia, Alimentação..."
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <Text className="text-text-primary font-medium mb-2">Tipo de Categoria</Text>
            <View className="flex-row bg-background rounded-lg mb-4">
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-md ${newCategoryType === 'shared' ? 'bg-primary' : 'bg-transparent'}`}
                onPress={() => setNewCategoryType('shared')}
              >
                <Text className={`text-center ${newCategoryType === 'shared' ? 'text-white' : 'text-text-secondary'}`}>
                  Compartilhada
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-md ${newCategoryType === 'individual' ? 'bg-primary' : 'bg-transparent'}`}
                onPress={() => setNewCategoryType('individual')}
              >
                <Text className={`text-center ${newCategoryType === 'individual' ? 'text-white' : 'text-text-secondary'}`}>
                  Individual
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-text-primary font-medium mb-1">Escolha um ícone</Text>
            <IconSelector selectedIcon={newCategoryIcon} onSelect={setNewCategoryIcon} />

            <Text className="text-text-primary font-medium mb-1">Escolha uma cor</Text>
            <ColorSelector selectedColor={newCategoryColor} onSelect={setNewCategoryColor} />

            <View className="flex-row justify-between mb-4">
              {categoryBeingEdited && (
                <TouchableOpacity
                  className="flex-1 mr-2 bg-secondary py-3 px-4 rounded-lg items-center"
                  onPress={handleDeleteCategory}
                >
                  <Text className="text-white font-medium">Excluir</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className={`flex-1 ${categoryBeingEdited ? 'ml-2' : ''} bg-primary py-3 px-4 rounded-lg items-center`}
                onPress={handleSaveCategory}
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

export default CategoriesScreen;