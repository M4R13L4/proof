import React, { Component } from 'react';
import DesplegarC from './DesplegarC'
import ModalC from "./ModalC"
import './css/bootstrap.min.css';
import './css/estilos.css';


class CustomerView extends Component {

  constructor(){
    super();
    this.state={
    boton: "Seleccionar todo",
    datos: [],
    newdata: [],
    data_survey:[],
    flag_check: 0,
    aux: [],
    assignment: [],
    modal_data:[]

    }
  }
  /**
    Se realizan la querys necesarias (primero: los clientes con sus respectivos proyectos y managers asociados;
                                      segundo: se obtienen las encuestas almacenasdas;
                                      tercero: se obtienen los consultores asociados a cada manager, esto con la misma query
                                                que se usa en la vista de managers (ManagerView) )
  */
  UNSAFE_componentWillMount() {
   this.enviar(this)
   this.obtainSurvey(this)
   this.obtainAssignment(this)
   
  }
  /*Función que obtienedel servidor a todos los consultores asociados a cada manager*/
  obtainAssignment(e){
    let that = this;
    fetch('http://192.168.2.107:8080/managerView')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        that.setState({
          aux: JSON.stringify(myJson)
        });
      });

  }

/**
  Función que en la variable "assigment" almacena por medio de un array de objetos lo datos de
  de los colsultores asociados a cada manager, {manager_name: , manager_id: , email: , asignados: [{asignado: ,asignado_id: }] }
*/
  createAssignment(e){    
    let cadena = this.state.aux;      
    let i, flag;
    let that = this;
    let manager=[];
    that.state.assignment=[];

    if(cadena.length!==0){   
      let json = JSON.parse(cadena);
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
              that.state.assignment.push({managerName: objeto.name,manager_id: objeto.manager_id,email: objeto.email, asignados:[]});
              that.state.assignment[i].asignados.push({asignado: objeto.name_asig+" "+objeto.pat_last_name+" "+ objeto.mat_last_name, asignado_id: objeto.employee_id})
              flag=1;
            }else{
              that.state.assignment[i].asignados.push({asignado: objeto.name_asig +" "+objeto.pat_last_name +" "+objeto.mat_last_name, asignado_id: objeto.employee_id})
            }
          }
        });
      }
    }
  }
  /**
    Función que realiza la query al servidor para solicitar las encuestas disponibles.
    El resultado se guarda en "data_survey"
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
    Función que genera el select de las encuestas
  */
  genera_select(e){
    var cadena = this.state.data_survey;      
    let lista_survey = [];
    if(cadena.length!==0){
      var json = JSON.parse(cadena);   
      lista_survey.push(<option key='-1' value=''>Selecciona una encuesta.</option>);
      json.forEach(
        function(value,key){
            lista_survey.push(<option key={key} value={value.enlace} data-survey_name={value.nombre}>{value.nombre}</option>);
        }
      );
      return lista_survey;
    }    
  }
  /**
    Función que realiza la query al servidor para solicitar los clientes,proyectos  y managers asociados
    a cada uno de ellos. Se guarda en la variable "datos"
  */
  enviar (e) {
    var that = this;
    fetch('http://192.168.2.107:8080/customerView')
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
  Función que se activa al pulsar la flecha para desplegar los proyectos y managers asociados a cada cliente.
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
  Función que cambia los estados de los checkbox asociados a cada cliente. Al marcar el checkbox de
  un cliente, se marcan los proyectos y manager asociados a ese cliente.
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
    let that=this,flag=0, no_enviados=[];     
    var lista,i,j, mssg, data_mssg={manager_name: '', message: '', email:''};
    var checkboxs = document.getElementsByName("checkbox");
    let surveyLink=document.getElementById("survey").value;
    let aux=[];

    checkboxs.forEach(function(value,key){
      lista = document.getElementsByName("checkbox"+key);
      data_mssg={manager_name: '', message: '', email:''}
      lista.forEach(async function(obj,ind){
        if(obj.dataset.manager_name && obj.checked && aux.indexOf(obj.dataset.manager_name)===-1){
          aux.push(obj.dataset.manager_name)
          //data_mssg.email=obj.dataset.email; //para que se le envie a cada manager ,asigna el email correspondiente
          data_mssg.email="mandyrm@outlook.es";
          data_mssg.manager_name=obj.dataset.manager_name;
          mssg="Hola "+ obj.dataset.manager_name.substring(0,obj.dataset.manager_name.indexOf(' '))+":\n Nos encantaría tu evaluación de las siguientes personas.\n\n";
          for(i=0;i<that.state.assignment.length;i++){
            if(that.state.assignment[i].managerName.localeCompare(obj.dataset.manager_name)===0){
                for(j=0;j<that.state.assignment[i].asignados.length;j++){
                    mssg+=that.state.assignment[i].asignados[j].asignado+"\n\t\t";
                    mssg+= that.genera_link(surveyLink, obj.dataset.manager_name, obj.dataset.manager_id,that.state.assignment[i].asignados[j].asignado, that.state.assignment[i].asignados[j].asignado_id)+"\n\n"
                }
            }
          }
          data_mssg.message=mssg;
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
          
      });
    });
    /*if(no_enviados.length!==0)
      that.failure_send(no_enviados)  */
    console.log(no_enviados)

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
  }

  genera_btn(e){
    var cadena = this.state.datos;      
    var that = this;
    var customer=[];
    var customer_project=[];
    let lista = [];
    that.state.newdata=[];
    if(cadena.length!==0){   
      
      var json = JSON.parse(cadena);
      /*Filtrado a los clientes de manera que no se repitan al mostrar y que no haya clientes sin nombre*/
      json.forEach(function(objeto,indice){
        if(customer.indexOf(objeto.short_name)===-1 && objeto.short_name.localeCompare("")!==0){
          customer.push(objeto.short_name);
        }
      });
      /*Filtrado a los proyectos asignados a los clientes de manera que no se repitan al mostrar*/
      json.forEach(function(objeto,indice){

        if(customer_project.indexOf(objeto.name_project)===-1 && objeto.name_project.localeCompare("")!==0){
          customer_project.push(objeto.name_project);
        }
      });
      /*llenado de JSON, abajo se rellena el customerName y el name_project, cuidando que niguno se repita.
        */
      let i,j, flag,flag2;
     
     for(i=0;i<customer.length;i++){
      flag=0;
          json.forEach(function(objeto,indice){
            if(objeto.short_name.localeCompare(customer[i])===0){
              if(flag===0){
                that.state.newdata.push({client_name: customer[i], client_id: objeto.client_id, project:[]});
                that.state.newdata[i].project.push({name_project: objeto.name_project, project_id: objeto.project_id, managers: []})
                flag=1;
                
              }else{
                flag2=0;
                /* Revisa que el nombre del project no se repita */
                for(j=0;j<that.state.newdata[i].project.length;j++){
                  if(that.state.newdata[i].project[j].name_project.localeCompare(objeto.name_project)===0)
                        flag2=1;
                }
                if(flag2!==1)
                  that.state.newdata[i].project.push({name_project: objeto.name_project, project_id: objeto.project_id, managers: []})
              }
            }
          });
      }
      /* A cada project se le relaciona con sus asignados*/
      for(i=0;i<customer.length;i++){
        json.forEach(function(objeto,indice){
          for(j=0;j<that.state.newdata[i].project.length;j++){
            if(objeto.name_project.localeCompare(that.state.newdata[i].project[j].name_project)===0){
              that.state.newdata[i].project[j].managers.push({manager_name: objeto.name, manager_id: objeto.manager_id, email: objeto.email })
            }
          }
        });
      }
      /*Se generan los botones para cada cliente, el Componente DesplegarC, despliega a los proyectos de cada cliente*/
      that.state.newdata.forEach(function(objeto,indice){
        if(true){
          lista.push(<div key={indice}  className="row d-flex justify-content-center showData"><br></br><br></br>
            <input name="checkbox" id={"checkbox"+indice} data-client_name={objeto.client_name} data-client_id={objeto.client_id} className="col-3 col-sm-3 col-md-3 col-lg-3 checkbox" type="checkbox"
            onChange={that.cambio.bind(that,indice)} value={objeto.client_name} />
            <label className="col-7 col-sm-7 col-md-7 col-lg-7" >{objeto.client_name}</label>
            <button id={indice} type="button" onClick={that.desplegar.bind(that,indice)}
              className="btn   desplegar col-2 col-sm-2 col-md-2 col-lg-2"><i id={"btn-d"+indice} className="fa fa-arrow-down" aria-hidden="true"></i></button>
              <DesplegarC datos={objeto.project} client_id={objeto.client_id} indice={indice} />

          </div>
          );
        }
      });
      //console.log(lista)
      return lista;
    }
  }
/**
  Función que verifica que al menos exista un manager marcado.
  De haber al menos uno, cambia el valor de la variable "flag_check"  a 1,
  de lo contrario se mantiene en 0.
*/
  verifyChecked(e){
    let that=this;     
    var lista;
    var checkboxs = document.getElementsByName("checkbox");
    that.state.modal_data=[];
    checkboxs.forEach(function(value,key){
      lista = document.getElementsByName("checkbox"+key);
      lista.forEach(function(obj,ind){
        if(obj.dataset.manager_name && obj.checked){
          that.state.flag_check=1; 
          if(that.state.modal_data.indexOf(obj.dataset.manager_name)===-1){
            that.state.modal_data.push(obj.dataset.manager_name) 
          }
          
        }
          
        });
    });
    that.setState({
      modal_data : that.state.modal_data
    })    
  }
/**
  Función que verifica el form de la vista. 
*/
  handleSubmit(evt) {
    evt.preventDefault();    
    let that=this;
    //Se verifica que exista al menos un manager marcado.
    that.verifyChecked(that)
    //Si existe al menos uno marcado, se activa el modal, si no un alert
    if(that.state.flag_check!==0)
      document.getElementById("modalC").click();
    else
      alert("selecciona al menos una opción")
  }

  render() {
    return (
      <div className="d-flex justify-content-center" >
      {this.createAssignment(this)}
      <form key="checks" className="form container "  onSubmit={this.handleSubmit.bind(this)} method='POST'>
        <div className="d-flex justify-content-center">
          <select className="form-control" required id="survey">
            {this.genera_select(this)}
          </select>  
        </div>
        <br></br>
          <div className="row d-flex justify-content-end">
            <button type="button" onClick={this.select_all.bind(this)} id="selectAll" className="btn add stateBtn">{this.state.boton} </button>
          </div>
          <br></br>
          {this.genera_btn(this)}
          <br></br>
          <div className="row d-flex justify-content-center">
            <input type="submit" value="Enviar" className="btn add"></input>
          </div>
        </form>
        <ModalC datos={this.state.modal_data}/>
        <button id="send_mail" style={{display:"none"}} onClick={this.send_mail.bind(this)}></button>
      </div>
    );
  }
}

export default CustomerView;