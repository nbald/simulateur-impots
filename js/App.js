import React, { Component } from "react";

import SimuStore from "./stores/SimuStore";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import ImpotsSimulation from "./views/impots/ImpotsSimulation.jsx";

import "./main.css";

let _token;

class App extends Component {
  constructor() {
    super();
    this.state = SimuStore.getState();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    _token = SimuStore.addListener(this._onChange);
  }

  componentWillUnmount() {
    _token.remove();
  }

  render() {
    return (
      <BrowserRouter basename={"/"}>
        <Routes>
          <Route path="/" element={<ImpotsSimulation />} />
          <Route path="/revenu" element={<ImpotsSimulation />} />
          <Route path="/heritage" element={<ImpotsSimulation isHeritage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  _onChange() {
    this.setState(SimuStore.getState());
  }
}

export default App;
