import React, { Component } from 'react';
import './css/bootstrap.min.css';
import './css/estilos.css';

class DesplegarP extends Component {

  render() {
    let managers_list = [];
    var that = this;
   /*Este componente despliega a cada manager asociado a cada uno de los proyectos, estos a su vez, están relacionados 
    a su respectivo cliente
   */
    this.props.names.forEach(function(value,indice){
      //console.log(value)
      managers_list.push(
        <div key={indice}  className="" >
          <input className="checkbox" data-email={value.email} data-manager_name={value.manager_name} data-manager_id={value.manager_id} data-project_id={that.props.project_id}  name={"checkbox"+that.props.indice} type="checkbox" value={value.manager_name} />
          <label > &nbsp; &nbsp; {value.manager_name}</label>
        </div>
      );
    });
    return (
      <div  className="campo2 container  x d-flex align-items-start flex-column " >
        {managers_list} 
      </div>
    );
  }
}

export default DesplegarP;