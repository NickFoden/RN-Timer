import React from "react";
import {
  Dimensions,
  Picker,
  Platform,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    alignItems: "center",
    borderColor: "#89AAFF",
    borderRadius: screen.width / 2,
    borderWidth: 10,
    height: screen.width / 2,
    justifyContent: "center",
    marginTop: 30,
    width: screen.width / 2
  },
  buttonStop: {
    borderColor: "#FF851B"
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF"
  },
  buttonTextStop: {
    color: "#FF851B"
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121b",
        marginLeft: 10
      }
    })
  },
  pickerContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20
  },
  timerText: {
    color: "#fff",
    fontSize: 90
  }
});
const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = length => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }

  return arr;
};
const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

export default class App extends React.Component {
  state = {
    remainingSeconds: 5,
    isRunning: false,
    selectedMinutes: "0",
    selectedSeconds: "5"
  };

  interval = null;

  componentDidUpdate(prevProp, prevState) {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      this.stop();
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  start = () => {
    this.setState(state => ({
      remainingSeconds:
        parseInt(state.selectedMinutes, 10) * 60 +
        parseInt(state.selectedSeconds, 10) -
        1,
      isRunning: true
    }));
    this.interval = setInterval(() => {
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1
      }));
    }, 1000);
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({ remainingSeconds: 5, isRunning: false });
  };

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        mode="dropdown"
        selectedValue={this.state.selectedMinutes}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        onValueChange={itemValue => {
          this.setState({ selectedMinutes: itemValue });
        }}
      >
        {AVAILABLE_MINUTES.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>Minutes</Text>
      <Picker
        mode="dropdown"
        selectedValue={this.state.selectedSeconds}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        onValueChange={itemValue => {
          this.setState({ selectedSeconds: itemValue });
        }}
      >
        {AVAILABLE_SECONDS.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>Seconds</Text>
    </View>
  );

  render() {
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.state.isRunning ? (
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
        ) : (
          this.renderPickers()
        )}

        {this.state.isRunning ? (
          <TouchableOpacity
            onPress={this.stop}
            style={[styles.button, styles.buttonStop]}
          >
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
