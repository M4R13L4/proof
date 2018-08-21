import React, { Component } from 'react';
import Desplegar from './Desplegar'
import './css/bootstrap.min.css';
import './css/estilos.css';
import Modal from "./Modal";

class ManagerView extends Component {

  constructor(){
    super();
    this.state={
      boton: "Seleccionar todo", //Mantiene el estado del botón selectAll
      datos: [],//Guarda los datos que retorna el server al pedir los manager y sus consultores asociados
      newdata: [],//Guarda un array de objetos con la información de los manager y sus consultores
      data_survey:[], //Guarda los datos que retorna el server, de las encuestas disponibles
      flag_check: 0, //Mantiene el estado para saber si existen opciones marcadas
      modal_data:[] //Guarda los valores de los datos que fueron marcados para mostrarlos en el modal
    
    }
  }
  /**
    Inicialmente se realizan las siguientes peticiones al servidor: 
      1.- Los datos de los managers y sus respectivos consultores asociados
      2.- Las encuestas disponibles para mostrar
  */
  UNSAFE_componentWillMount() {
     this.enviar(this)
     this.obtainSurvey(this)
  }
/**
  Función que realiza la petición al servidor para solicitar las encuestas disponibles.
  Estas se almacenan en la variable "data_survey"
*/
  obtainSurvey(e){
    var that = this;
    fetch('http://192.168.2.107:8080/prueba')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        that.setState({
          data_survey: JSON.stringify(myJson)
        });
      });
  }
  /**
    Función que hace la primer petición al servidor, solicitando a los managers y sus respectivos
    consultores asociados. Se almacena en la variable "datos"
  */
  enviar (e) {
    var that = this;
    fetch('http://192.168.2.107:8080/managerView')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        that.setState({
          datos: JSON.stringify(myJson)
        });
      });
  }
/**
  Función que se activa al pulsar el botón "Seleccionar todo" / "Desmarcar todo". 
  Busca a todos los checkboxs de la vista y los marca o desmarca, y cambia el letrero del botón, según sea el caso.
*/
  select_all(){
    var that = this;
    var checkboxs = document.getElementsByName("checkbox");
    var cadena = this.state.boton;
    if(cadena==="Seleccionar todo"){
      checkboxs.forEach(function(value,key){
        value.checked=true;
        that.cambio(key);
      });
      this.setState({
        boton : "Desmarcar todo"
      });
    }else{
      checkboxs.forEach(function(value,key){
        value.checked=false;
        that.cambio(key);
      });
      this.setState({
        boton : "Seleccionar todo"
      });
    }
  }
/**
  Función que se activa al pulsar la flecha para desplegar alos consultores asociados a cada manager.
  La flecha cambia de dirección. En caso de pulsar nuevamente, lo anterior se oculta.
*/
  desplegar(indice){   
    var btn = document.getElementById("btn-d"+indice);
    var div = document.getElementById("desplegar"+indice);
    if(div.classList.contains("d-none")){
      div.classList.remove("d-none");
      btn.setAttribute("class","fa fa-arrow-up");
    }else{
      div.classList.add("d-none");
      btn.setAttribute("class","fa fa-arrow-down");
    }
  }
/**
  Función que cambia los estados de los checkbox asociados a cada manager. Al marcar el checkbox de
  un manager, se marcan los consultores asociada este.
*/
  cambio(indice){
    var input = document.getElementById("checkbox"+indice);
    var lista = document.getElementsByName("checkbox"+indice);
    if(input.checked ){
      lista.forEach(function(value,key){
        value.checked = true;
      });
    }else{
      lista.forEach(function(value,key){
        value.checked = false;
      });
    }
  }
  /**
  Función que envía los correos a los respectcivos destinatarios.
*/
  send_mail (e) {
    let that=this,flag=0;     
    let lista,no_enviados=[];
    let checkboxs = document.getElementsByName("checkbox");
    let surveyLink=document.getElementById("survey").value;

    for(let i=0; i<checkboxs.length;++i){
      var mssg="";
      var data_mssg={manager_name: '', message: '', email:''};
      //console.log(checkboxs[i])
      //if(flag===0)
      //  i++;
      if(checkboxs[i].checked){
        data_mssg.email="mandyrm@outlook.es"
        //data_mssg.email="emmanuel.cuevas.ext@xideral.co"
        data_mssg.manager_name=checkboxs[i].dataset.manager_name;
        mssg+="Hola "+checkboxs[i].dataset.manager_name.substring(0,checkboxs[i].dataset.manager_name.indexOf(' '))+":\n Nos encantaría tu evaluación de las siguientes personas.\n\n";
        lista = document.getElementsByName("checkbox"+i);
       // console.log(lista)
        lista.forEach( function(obj,ind){
          if(obj.checked){
            that.state.flag_check= 1;
            mssg+=obj.dataset.name_asignado+"\n\t\t";
            mssg+= that.genera_link(surveyLink, checkboxs[i].dataset.manager_name, checkboxs[i].dataset.manager_id,obj.dataset.name_asignado, obj.dataset.asignado_id)+"\n\n"
          }
        });
        data_mssg.message=mssg;       
       // console.log(data_mssg)
        fetch('http://192.168.2.107:8080/sendMail',{
            method : "POST",
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify(data_mssg)
          }).then(function(response){
              return response.json();
            }).then(function(json){
              flag = json.flag;
            });
          if(flag!==0)
            no_enviados.push(flag)

      }  
    }
    /*if(no_enviados.length>0)
      that.failure_send(no_enviados)
    console.log(no_enviados)*/
   //window.location.reload();
  }

 /* failure_send(no_enviados){
    if(no_enviados.length!==0){
      let fail=[],flag=0;
      for(let i=0; i<no_enviados.length;i++){
        fetch('http://192.168.2.107:8080/sendMail',{
              method : "POST",
              headers : {"Content-Type": "application/json"},
              body : JSON.stringify({manager_name: no_enviados[i].manager_name, message: no_enviados[i].message, email: no_enviados[i].email})
            }).then(function(response){
                return response.json();
              }).then(function(json){
                flag = json.flag;
              });
              if(flag!==0)
                fail.push(flag)
      }
      if(fail.length!==0)
        this.failure(fail);
    }
  }*/
  genera_link(enlace,manager_name,manager_id,name_evaluado,id_evaluado){
    let  aux_first='', aux_second='', val=0;
      //se agrega el nombre del manager al link
      aux_first=enlace.substring(val,enlace.indexOf('['));
      aux_second=enlace.substring(enlace.indexOf(']')+1);
      enlace=aux_first+manager_name.replace(/\s/g,"")+aux_second;
      //se agrega el id del manager al link
      aux_first=enlace.substring(val,enlace.indexOf('['));
      aux_second=enlace.substring(enlace.indexOf(']')+1);
      enlace=aux_first+manager_id+aux_second;
      //se agrega el nombre del evaluado
      aux_first=enlace.substring(val,enlace.indexOf('['));
      aux_second=enlace.substring(enlace.indexOf(']')+1);
      enlace=aux_first+name_evaluado.replace(/\s/g,"")+aux_second;
      //se agrega id del evaluado
      aux_first=enlace.substring(val,enlace.indexOf('['));
      aux_second=enlace.substring(enlace.indexOf(']')+1);
      enlace=aux_first+id_evaluado+aux_second;
      
      return enlace;
      //console.log(enlace)
  }
 /**
    Función que genera el select de las encuestas
  */
  genera_select(e){
    var cadena = this.state.data_survey;      
    let lista_survey = [];
    if(cadena.length!==0){
      var json = JSON.parse(cadena);    
      lista_survey.push(<option key='-1' value=''>Selecciona una encuesta</option>);
      json.forEach(function(value,key){
          lista_survey.push(<option  key={key} value={value.enlace} data-survey_name={value.nombre}>{value.nombre}</option>);
      });
      return lista_survey;
    }    
  }

  genera_btn(e){
    var cadena = this.state.datos;      
    var i, flag;
    var that = this;
    var manager=[];
    let lista = [];
    that.state.newdata=[];

    if(cadena.length!==0){   
      var json = JSON.parse(cadena);
      json.forEach(function(objeto,indice){
        if(manager.indexOf(objeto.name)===-1 && objeto.name.localeCompare("")!==0){
          manager.push(objeto.name);
        }
      });
     for(i=0;i<manager.length;i++){
      flag=0;
          json.forEach(function(objeto,indice){
            if(objeto.name.localeCompare(manager[i])===0){
              if(flag===0){
                that.state.newdata.push({managerName: objeto.name,manager_id: objeto.manager_id,email: objeto.email, asignados:[]});
                that.state.newdata[i].asignados.push({asignado: objeto.name_asig+" "+objeto.pat_last_name+" "+ objeto.mat_last_name, asignado_id: objeto.employee_id})
                flag=1;
              }else{
                that.state.newdata[i].asignados.push({asignado: objeto.name_asig +" "+objeto.pat_last_name +" "+objeto.mat_last_name, asignado_id: objeto.employee_id})
              }
            }
          });
      }
      that.state.newdata.forEach(function(objeto,indice){
        if(true){
          lista.push(<div key={indice}  className="row d-flex justify-content-center showData"><br></br><br></br>
            <input name="checkbox" id={"checkbox"+indice} data-manager_name={objeto.managerName} data-manager_id={objeto.manager_id} data-email={objeto.email} className="col-3 col-sm-3 col-md-3 col-lg-3 checkbox" type="checkbox"
            onChange={that.cambio.bind(that,indice)} value={objeto.managerName} />
            <label className=" col-7 col-sm-7 col-md-7 col-lg-7" >{objeto.managerName}</label>
            <button id={indice} type="button" onClick={that.desplegar.bind(that,indice)}
              className="btn  desplegar col-2 col-sm-2 col-md-2 col-lg-2"><i id={"btn-d"+indice} className="fa fa-arrow-down" aria-hidden="true"></i></button>
              <Desplegar datos={objeto.asignados} manager_id={objeto.manager_id} manager_email={objeto.email}indice={indice} />
          </div>
          );
        }
      });
      //console.log(lista)
      return lista;
    }
  }


/**
  Verifica que exita al menos un manager marcado y que este a su vez tenga un consultor de su lista marcado.
  Si es el caso, cambia el valor de la variable "flag_check" a 1, de lo contrario lo deja en 0
*/
  verifyChecked(e){
    let that=this;     
    var lista,i=0;
    var checkboxs = document.getElementsByName("checkbox");
    that.state.modal_data=[]
    
    checkboxs.forEach(function(value,key){
      if(value.checked){
        that.state.modal_data.push({manager: value.value, asignados: []})
        lista = document.getElementsByName("checkbox"+key);
        lista.forEach(function(obj,ind){
          if(obj.checked){
            that.state.modal_data[i].asignados.push({nombre: obj.value})
            that.state.flag_check= 1;
          }
        });
        i++;
      }
      });
    that.setState({
      modal_data : that.state.modal_data
    })
   // console.log(that.state.modal_data)
  }
/**
  Función que verifica el form de la vista. 
*/
  handleSubmit(evt) {
    evt.preventDefault();
    let that=this;
    //Verifica que exista al menos un manager marcado y un consultor asociado a este.
    that.verifyChecked(that)
    //Si existe al menos uno, se activa el modal, si no, un alert.
    if(that.state.flag_check!==0){
      document.getElementById("modal").click();
    }
    else
      alert("Selecciona al menos una opción")
  }

  render() {
    return (
      <div  >
        <form key="checks" className="form container scroll" onSubmit={this.handleSubmit.bind(this)} method='POST' id="unnecessaryInProof">
          <div className="d-flex justify-content-center">
            <select className="form-control " data-size="5" required id="survey">
              {this.genera_select(this)}
            </select>  
          </div>
          <br></br>
          <div className="row d-flex justify-content-end">
            <button type="button" id="selectAll" onClick={this.select_all.bind(this)} className="btn add stateBtn">{this.state.boton}</button>
          </div>
          
            <br></br>
            {this.genera_btn(this)}
            <br></br>
            <div className="row d-flex justify-content-center">
              <input type="submit" className="btn add " value="Enviar"></input>
            </div>  
        </form>
        <Modal datos={this.state.modal_data} id="mod_window" />
        <button id="active_send_mail" style={{display:"none"}} onClick={this.send_mail.bind(this)}></button>

      </div>
    );
  }
}

export default ManagerView;