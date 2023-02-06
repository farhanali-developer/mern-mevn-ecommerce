import logo from './logo.svg';
import './App.css';
import { Box } from '@mui/material';
import { Flex } from './CustomComponents/Layout';
import Component1 from './components/Component1';
import Component2 from './components/Component2';

function App() {

  return (
    <div className="App">
      <Component1 />
      <Component2 />

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
