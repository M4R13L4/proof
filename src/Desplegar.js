import React, { Component } from 'react';
import './css/bootstrap.min.css';
import './css/estilos.css';

class Desplegar extends Component {
  cambiar(indice){
    var input = document.getElementById("checkbox"+indice);
      input.checked=true;     
  }
  render() {
    let lista = [];
    var that = this;
    let algo=that.props.indice;
    this.props.datos.forEach(function(value,indice){
      lista.push(<div key={indice} className="d-flex justify-content-start ">
        <input className="checkbox " onChange={that.cambiar.bind(this,algo)} data-email={that.props.manager_email} data-manager_id={that.props.manager_id} data-name_asignado={value.asignado}  data-asignado_id={value.asignado_id} name={"checkbox"+that.props.indice} type="checkbox" value={value.asignado} />
        <label > &nbsp; &nbsp; {value.asignado}</label>
        </div>
        );
    });

    return (
      <div id={"desplegar"+this.props.indice} className="campo container d-none x ">
        {lista} 
      </div>
    );
  }
}

export default Desplegar;