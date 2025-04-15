# Finanças Pessoais - Aplicativo de Gestão Financeira

Um aplicativo de gestão financeira pessoal construído com React Native e Expo.

## Funcionalidades

- **Registro de Receitas:** Adicione suas fontes de renda com valores e datas.
- **Registro de Despesas:** Cadastre gastos por categoria.
- **Dashboard:** Visualize o resumo financeiro do mês atual.
- **Relatórios:** Acompanhe sua evolução financeira com gráficos e estatísticas.
- **Taxa de Economia:** Monitore quanto você está economizando mensalmente.

## Tecnologias

- React Native com Expo
- TypeScript
- NativeWind (Tailwind CSS para React Native)
- React Navigation
- AsyncStorage para persistência de dados
- date-fns para manipulação de datas

## Como executar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI

### Instalação

1. Clone o repositório:
```
git clone https://github.com/seu-usuario/casal-finances.git
cd casal-finances
```

2. Instale as dependências:
```
npm install
```

3. Inicie o servidor de desenvolvimento:
```
npm start
```

4. Use o Expo Go em seu dispositivo móvel para escanear o QR code ou execute em um emulador.

## Estrutura do Projeto

```
assets/        # Imagens, fontes e outros recursos estáticos
src/
  components/  # Componentes reutilizáveis
  screens/     # Telas da aplicação
  navigation/  # Configuração de navegação
  hooks/       # Custom hooks
  utils/       # Funções utilitárias
  types/       # Definições de tipos TypeScript
App.tsx        # Ponto de entrada da aplicação
app.json       # Configuração do Expo
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
