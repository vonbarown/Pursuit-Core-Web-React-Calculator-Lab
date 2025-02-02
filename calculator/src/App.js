import React from "react";
import "./App.css";
import CalculatorForm from './components/CalculatorForm';
import Display from './components/DisplayResult'

class App extends React.Component {
  constructor() {
    super();
    this.initialState = {
      displayValue: 0,
      input: 0,
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
      clear: false,
      clearType: 'AC',
      storage: ''
    };
    this.state = this.initialState;
  }

  showAnswer = e => {
    const { input, displayValue, clear } = this.state

    if (input === '') {
      this.setState({
        previousValue: displayValue,
        input: 0,
      });
    } else {
      this.handleOperationButton(e)
      this.handleMath()
    }
    if (clear === false) {
      this.setState({
        storage: ''
      })
    }
  }

  handleInput = event => {
    let { input, waitingForNewValue, displayValue, clear } = this.state
    this.setState({
      input: parseFloat(input += event.target.innerText),
      displayValue: parseFloat(input)
    });

    if (waitingForNewValue) {
      this.setState((prevState) => {
        return {
          storage: prevState.previousValue,
          previousValue: displayValue,
          clear: true,
          clearType: 'C'
        }
      })
    }
    if (!clear) {
      this.setState((prevState) => {
        return {
          storage: prevState.previousValue,
        }
      })
    }

    this.storage()
  };

  storage = () => {
    let { storage } = this.state
    if (storage !== '') {
      this.setState(() => {
        return {
          previousValue: storage,
          storage: ''
        }
      })
    }

  }

  clear = () => {
    const { clear } = this.state
    clear ? this.setState((prevState) => {
      return {
        displayValue: 0,
        input: '',
        storage: prevState.previousValue
      }
    }) : this.setState(this.initialState);
  }

  handleOperationButton = e => {
    const { input, waitingForNewValue, displayValue, clear } = this.state;
    const value = e.target.value;
    waitingForNewValue ? this.setState({
      operation: value,
      previousValue: parseFloat(displayValue),
      input: '',
    }) : this.setState({
      operation: value,
      previousValue: parseFloat(input),
      input: '',
      waitingForNewValue: true,
    });

    clear ? this.setState({
      clear: false,
      clearType: 'AC'
    }) : this.setState({
      clear: true,
      clearType: 'C'
    })

  };

  handleMath = () => {
    const { operation, previousValue, input, displayValue } = this.state

    switch (operation) {
      case "÷":
        this.setState({
          displayValue: parseFloat(previousValue) / parseFloat(displayValue),
          input: '',
        })
        break;
      case "+":
        this.setState({
          displayValue: parseFloat(previousValue) + parseFloat(displayValue),
          input: '',
        })
        break;
      case "-":
        this.setState({
          displayValue: parseFloat(previousValue) - parseFloat(input),
          input: '',
        })
        break;
      case "x":
        this.setState({
          displayValue: parseFloat(previousValue) * parseFloat(input),
          input: '',
        })
        break;
      default:
        this.setState({
          input: '',
        })
        break;
    }

  };

  //converts between negative and positive
  handleConversionOps = e => {
    const { displayValue, input } = this.state

    switch (e.target.value) {
      case "%":
        this.setState({
          displayValue: parseFloat(displayValue) / 100,
          input: '',
        })
        break;
      case "±":
        this.setState({
          displayValue: (displayValue) * -1,
          input: (displayValue) * -1,
        })
        break;
      case ".":
        if (!displayValue.toString().includes('.')) {
          this.setState({
            input: displayValue + '.',
            displayValue: input,
          })
        }
        break;
      default:
        this.setState({
          input: '',
        })
        break;
    }
  }

  handleSubmit = event => event.preventDefault();

  render() {
    const { displayValue, result, clearType } = this.state;

    console.log(this.state);

    return (
      <div className="App">
        <h1>Simple Calculator</h1>

        <div className='holder'>
          <Display
            displayValue={displayValue}
            result={result}
          />
          <CalculatorForm
            handleInput={this.handleInput}
            handleSubmit={this.handleSubmit}
            handleConversionOps={this.handleConversionOps}
            showAnswer={this.showAnswer}
            clear={this.clear}
            clearType={clearType}
          />
        </div>
      </div>
    );
  }
}

export default App;
