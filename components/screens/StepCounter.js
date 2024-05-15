import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';

const StepCounter = () => {
  console.log("Entered StepCounter");
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleStepCount = debounce((steps) => {
    setCurrentStepCount(steps);
  }, 1000); // Adjust debounce delay as needed

  const subscribe = async () => {
    console.log('Checking pedometer availability...');
    const isAvailable = await Pedometer.isAvailableAsync();
    console.log('Pedometer available:', isAvailable);
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      console.log('Subscribing to step count updates...');
      const subscription = Pedometer.watchStepCount(result => {
        console.log('New step detected:', result.steps);
        handleStepCount(result.steps); // Call debounce function to update step count with delay
      });

      return subscription;  // Return the subscription object
    }

    return null;  // Return null if not available
  };

  useEffect(() => {
    let subscription;  // Declare variable for the subscription
    setCurrentStepCount(0);  // Reset the current step count at component initialization
    subscribe().then(sub => {
      subscription = sub;  // Assign the returned subscription to the variable
    });

    return () => {
      if (subscription) {
        console.log('Unsubscribing from step count updates...');
        subscription.remove();  // Remove the subscription when the component unmounts
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StepCounter;