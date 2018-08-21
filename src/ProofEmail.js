import React from 'react';
 
export default class ProofEmail extends React.Component {
   constructor(){
    super();
    this.state={
      data_survey:[] ,
      email: ""
    }
  }

  UNSAFE_componentWillMount() {
     this.obtainSurvey(this)
  }

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
  genera_select(e){
    var cadena = this.state.data_survey;      
    let lista_survey = [];
    if(cadena.length!==0){
      var json = JSON.parse(cadena);    
      lista_survey.push(<option key='-1' value=''>Selecciona una encuesta</option>);
      json.forEach(function(value,key){
          lista_survey.push(<option  key={key} value={value.enlace} data-survey_name={value.nombre}>{value.nombre}</option>);
      });
      //console.log(lista_survey)
      return lista_survey;
    }    
  }

  verifyEmail(evt){
    let that=this;
    this.setState({
      email: evt.target.value,
    });
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{1,4})+$/;
    if (regex.test(that.state.email))
      document.getElementById("sendFake").style.display="block"
  }
  send_mail(e){
    let that=this,flag=0, data_mssg={manager_name: '', message: '', email:''};
    data_mssg.message="Hola:\n nos encantaría que contestaras la siguiente encuesta.\n"+document.getElementById("survey").value;
    data_mssg.email=document.getElementById("proofEmail").value;
    fetch('http://192.168.2.107:8080/sendMail',{
            method : "POST",
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify(data_mssg)
          }).then(function(response){
              return response.json();
            }).then(function(json){
              flag = json.flag;
            });
  }
  render() {
    
    return (
      <div  className="row d-flex justify-content-center" >
        <div  id="proofSend">  
        <form>
          <select className="form-control " data-size="5" required id="survey">
              {this.genera_select(this)}
          </select>
            <br></br>
          <label >Email: </label>
            <div className="row d-flex justify-content-center">
              <input   placeholder="email@domain" style={{width: "70%", textAlign: "center"}} type="text" className=" form-control" id="proofEmail" onChange={this.verifyEmail.bind(this)}/>
              </div>
            <br></br>
              
            <div className="row d-flex justify-content-center">
              <input type="submit" id="sendFake"  value="Enviar Prueba" className="btn add stateBtn" style={{display: "none"}} onClick={this.send_mail.bind(this)}/>
            </div>  
        </form>
        </div>
      </div>
    );
  }
}