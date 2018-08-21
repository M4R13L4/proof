import React, { Component } from 'react';
import './css/bootstrap.min.css';
import './css/estilos.css';
import DesplegarP from "./DesplegarP"

class DesplegarC extends Component {
    cambio(indice){

    var input = document.getElementsByName("checkbox"+indice);
    var lista = document.getElementsByName("checkbox"+indice);
   
   input.forEach(function(obj,index){
    
    if(obj.checked ){
        lista.forEach(function(value,key){
         if(obj.dataset.project_id===value.dataset.project_id){
            value.checked=true;
         }

        });
      }else{
        lista.forEach(function(value,key){
          if(obj.dataset.project_id===value.dataset.project_id){
            value.checked=false;
         }
        });
      }
   });
      
  }
  render() {
    let lista = [];
    var that = this;    
    let i=0;
    let algo=this.props.indice;

 /*DesplegarP es un componente que despliega los managers asociados a cada proyecto*/
    this.props.datos.forEach(function(value,indice){
      lista.push(<div key={indice} >
                    <div className="d-flex justify-content-start p2 fondo">
                      <input className="checkbox " id={"checkbox"+that.props.indice} onChange={that.cambio.bind(this, algo)} name={"checkbox"+that.props.indice} data-project_name={value.name_project} data-project_id={value.project_id} data-client_id={that.props.client_id} type="checkbox" value={value.name_project} />
                      <label > &nbsp; &nbsp; {value.name_project}</label>
                    </div>
                    <div className="d-flex justify-content-start" >
                      <DesplegarP names={that.props.datos[i].managers} project_id={value.project_id} project_name={value.name_project} indice={that.props.indice} />
                    </div>
                    
                  </div>
                );
        i++;
    });

    return (
      <div id={"desplegar"+this.props.indice} className="campo container d-none x ">
        {lista} 
      </div>

    );
  }
}

export default DesplegarC;