// src/audioRecording.js
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { generateUUID } from '../utils/uuid';

export async function requestAudioPermission() {
  try {
    const { granted } = await Audio.requestPermissionsAsync();
    return granted;
  } catch (err) {
    console.warn('Permission request error', err);
    return false;
  }
}

const getValidAndroidInterruptionMode = () => {
  if (Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX !== undefined) {
    return Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX;
  }
  if (Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS !== undefined) {
    return Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS;
  }
  return undefined;
};

export async function startRecording() {
  try {
    // request permission first (you might call this separately)
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) throw new Error('Microphone permission not granted');

    const androidInterruption = getValidAndroidInterruptionMode();
    const iosInterruption = Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX || undefined;

    // Build options object with only valid fields
    const audioMode = {
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    };

    if (androidInterruption !== undefined) {
      audioMode.interruptionModeAndroid = androidInterruption;
    }
    if (iosInterruption !== undefined) {
      audioMode.interruptionModeIOS = iosInterruption;
    }

    // Android-specific duck/interrupt flags (only add if available)
    if (Audio.shouldDuckAndroid !== undefined) {
      audioMode.shouldDuckAndroid = true;
    }

    await Audio.setAudioModeAsync(audioMode);

    const recording = new Audio.Recording();

    // Use preset or custom options
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await recording.startAsync();

    return recording;
  } catch (err) {
    console.error('startRecording error', err);
    throw err;
  }
}


export async function stopRecording(recording) {
  try {
    if (!recording) throw new Error('No recording instance provided');

    await recording.stopAndUnloadAsync();

    // temp uri:
    const uri = recording.getURI();
    if (!uri) throw new Error('Recording URI not found');

    // create stable filename
    const id = generateUUID();
    // keep original extension if available
    const originalExt = uri.split('.').pop().split('?')[0] || 'm4a';
    const fileName = `${id}.${originalExt}`;
    const dest = `${FileSystem.documentDirectory}${fileName}`;

    // Move the file into documentDirectory (persistent)
    // use moveFileAsync if supported, otherwise copy + delete fallback
    try {
      // prefer move
      if (FileSystem.moveFileAsync) {
        await FileSystem.moveFileAsync({ from: uri, to: dest });
      } else {
        // older API
        await FileSystem.copyFileAsync({ from: uri, to: dest });
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch (e) {
      // fallback to copyAsync naming if your SDK differs
      try {
        await FileSystem.copyFileAsync({ from: uri, to: dest });
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch (err) {
        console.warn('File move/copy failed, recording will use temp URI', err);
        return { uri, fileName: null, filePath: uri };
      }
    }

    return { uri: dest, fileName, filePath: dest };
  } catch (err) {
    console.error('Failed to stop recording', err);
    throw err;
  }
}
export async function playAudio(uri, { onPlaybackStatusUpdate } = {}) {
  try {
    const sound = new Audio.Sound();
    await sound.loadAsync({ uri }, {}, true);
    if (onPlaybackStatusUpdate) sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    await sound.playAsync();
    return sound; // caller may call unloadAsync() when done
  } catch (err) {
    console.error('Error playing audio', err);
    throw err;
  }
}
