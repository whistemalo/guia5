import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Formulario from './src/components/Formulario';
import Cita from './src/components/Cita';
import colors from './src/utils/colors';

export default function App() {

  //State de citas
  const [citas, setCitas] = useState([])
  const [mostrarForm, guardarMostrarForm] = useState(false);

  useEffect( () => {
    //Obtener citas del Storage
    const obtenerCitasStorage = async () => {
      try{
        const citasStorage = await AsyncStorage.getItem('citas');
        if(citasStorage)
        {
          setCitas(JSON.parse(citasStorage))
        }
      }
      catch(error)
      {
        console.log(error);
      }
    }

    obtenerCitasStorage();
  }, [])

  //Eliminar pacientes del State
  const eliminarPaciente = id => {
    const citasFiltradas = citas.filter( cita => cita.id !== id )
    setCitas( citasFiltradas )
    guardarCitasStorage( JSON.stringify(citasFiltradas) )
  }

  //Muestra u oculta el Formulario
  const mostrarFormulario = () => {
    guardarMostrarForm(!mostrarForm)
  }

  //Oculta teclado
  const cerrarTeclado = () => {
    Keyboard.dismiss()
  }

  //Agregar citas al Storage
  const guardarCitasStorage = async ( citasJSON ) => {
    try
    {
      await AsyncStorage.setItem('citas', citasJSON)
    }
    catch(error)
    {
      console.log(error);
    }
  }


  return (
    <TouchableWithoutFeedback 
      onPress = { () => cerrarTeclado() }
    >
      <View style = { styles.contenedor }>
        <Text style = { styles.titulo }>Administrador de Citas</Text>
        <View>
          <TouchableHighlight
            onPress = { () => mostrarFormulario() }
            style = { styles.btnMostrarForm }
          >
            <Text style = { styles.textoMostrarForm }>{ mostrarForm ? 'Cancelar Crear Cita' : 'Crear Nueva Cita'}</Text>
          </TouchableHighlight>
        </View>
        <View style = { styles.contenido }>
          {
            mostrarForm ? (
              <>
                <Text style = { styles.titulo }>Crear Nueva Cita</Text>
                <Formulario 
                  citas = { citas }
                  setCitas = { setCitas }
                  guardarMostrarForm = { guardarMostrarForm }
                  guardarCitasStorage = { guardarCitasStorage }
                />
              </>
            ) : (
              <>
                <Text style = { styles.titulo }>{ citas.length > 0 ? 'Administrar tus citas' : 'No hay citas, agrega una'}</Text>
                <FlatList 
                  style = { styles.listado }
                  data = { citas }
                  renderItem = { ({ item }) => <Cita item = { item } eliminarPaciente = { eliminarPaciente } keyExtractor = { cita => cita.id } />}
                />
              </>
            )
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: colors.PRIMARY_COLOR,
    flex: 1
  },
  titulo: {
    color: '#FFF',
    marginTop: 20 ,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  contenido: {
    flex: 1,
    marginHorizontal: '2.5%',
  },
  listado: {
    flex: 1,
  },
  btnMostrarForm: {
    padding: 10,
    backgroundColor: colors.BUTTON_COLOR,
    marginVertical: 10
  },
  textoMostrarForm: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
