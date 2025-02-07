import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  shakeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
});

export default function App() {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [shakeDetected, setShakeDetected] = useState();
  const [mySound, setMySound] = useState();

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener((data) => {
      setData(data);

      if (Math.abs(data.x - x) > 0.2 || Math.abs(data.y - y) > 0.2 || Math.abs(data.z - z) > 0.2) {
        setShakeDetected(true);
        playSound();
      } else {
        setShakeDetected(false);
      }
    });

    return () => subscription.remove();
  }, [x, y, z]);

  async function playSound() {
    const soundfile = require('./shaker.wav');
    const { sound } = await Audio.Sound.createAsync(soundfile);
    setMySound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return mySound
        ? () => {
          console.log('Unloading Sound');
          mySound.unloadAsync();
        }
        : undefined;
  }, [mySound]);

  return (
      <View>
        <StatusBar style="auto" />
        <Text style={styles.text}>x: {x}</Text>
        <Text style={styles.text}>y: {y}</Text>
        <Text style={styles.text}>z: {z}</Text>
        {shakeDetected && <Text>SHAKE!</Text>}
      </View>
  );
}
