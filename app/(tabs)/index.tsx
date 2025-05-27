// app/login.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    router.replace('/');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Cadastro' }} />
      <ThemedView style={styles.container}>
        {/* Imagem do logo */}
        <Image
          source={require('../../assets/images/LogoVersaoExetendida.png')}
          style={styles.logo}
        />
        
        <ThemedText
          type="title"
          style={{ color: '#000', marginBottom: 24, textAlign: 'center' }}
        >
          Faça seu Login
        </ThemedText>

<TextInput
          placeholder="Nome"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />

<TextInput
          placeholder="Sobrenome"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />

<TextInput
          placeholder="Número de Celular"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />

<TextInput
          placeholder="CPF"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />

<TextInput
          placeholder="E-mail"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />

<TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      </ThemedView>
    </>
  );
}
export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    router.replace('/'); // redireciona para a Home
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <ThemedView style={styles.container}>
        {/* Imagem do logo */}
        <Image
          source={require('../../assets/images/LogoVersaoExetendida.png')}
          style={styles.logo}
        />
        
        <ThemedText
          type="title"
          style={{ color: '#000', marginBottom: 24, textAlign: 'center' }}
        >
          Faça seu Login
        </ThemedText>

        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </Pressable>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    gap: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
