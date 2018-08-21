import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/estilos.css';
import Customer from "./CustomerView";
import Manager from "./ManagerView";
import Inicio from "./Inicio";
import ProofSend from "./ProofEmail"
class Main extends Component {
  render() {
    return (
      <Router>
        <div className="container row d-flex flex-wrap justify-content-center" >
          <div className="col-12 d-flex justify-content-center" >
            <nav className="row navbar navbar-light" >
              <Link className="navbar-brand btn word separator" to="/" style={{color: "#005585"}}>Administrar Encuesta</Link>
              <Link className="navbar-brand btn word separator" to="/CustomerView" style={{color: "#005585"}}>Encuestas Clientes</Link>
              <Link className="navbar-brand btn word separator" to="/ManagerView" style={{color: "#005585"}}>Encuestas Gerentes</Link>
              <Link className="navbar-brand btn word separator" to="/ProofSend" style={{color: "#005585"}}> <i className="fa fa-user-secret" aria-hidden="true" title="Pruebas de envío"> </i></Link>
            </nav>
          </div>
          <hr />
          <div className="col-12">
            <Route exact path="/" component={Inicio} />
            <Route path="/CustomerView" component={Customer} />
            <Route path="/ManagerView" component={Manager} />
            <Route path="/ProofSend" component={ProofSend} />
          </div>
        </div>
      </Router>      
    );
  }
}

export default Main;