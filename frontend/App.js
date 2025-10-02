import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';

export default function App() {
  const [contador, setContador] = useState(0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>¡Bienvenido  </Text>
        
        <Text style={styles.subtitle}>
          Tu app está funcionando perfectamente
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contador: {contador}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonAdd]} 
              onPress={() => setContador(contador + 1)}
            >
              <Text style={styles.buttonText}>+ Incrementar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.buttonReset]} 
              onPress={() => setContador(0)}
            >
              <Text style={styles.buttonText}> Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>:v Características de Expo:</Text>
          <Text style={styles.infoText}>• Hot Reload automático</Text>
          <Text style={styles.infoText}>• Funciona en iOS, Android y Web</Text>
          <Text style={styles.infoText}>• Sin necesidad de Xcode/Android Studio</Text>
          <Text style={styles.infoText}>• Muchas librerías incluidas</Text>
        </View>
      </View>
      
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 120,
  },
  buttonAdd: {
    backgroundColor: '#3498db',
  },
  buttonReset: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#ecf0f1',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    paddingLeft: 10,
  },
});