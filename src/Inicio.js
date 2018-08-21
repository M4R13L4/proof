import React, { Component } from 'react';

class About extends Component {
  constructor(){
    super();
    this.state={
    boton: "Seleccionar todo",
    datos: [],
    newdata: [],
    newLink:'',
    nameLink: '',
    newDescription: '',
    data_link: {link: "", name: "", desc:""},
    data_survey:[]
    }
  }

  handleLinkChange(evt) {
    this.setState({
      newLink: evt.target.value,
    });
  }

  handleNamelinkChange(evt) {
    this.setState({
      nameLink: evt.target.value,
    });
  }
  handleDescriptionChange(evt){
    this.setState({
      newDescription: evt.target.value,
    });
  }
  handleSubmit(evt) {
    evt.preventDefault();
    console.log(this.state.nameLink);
    console.log(this.state.newLink);
    console.log(this.state.newDescription);
    this.add_Link(this)
  }

  add_Link (e) {   
    var that = this;       
    that.state.data_link.link=that.state.newLink;
    that.state.data_link.name=that.state.nameLink;
    that.state.data_link.desc=document.getElementById("survey_description").value;
    //that.state.data_survey.push({descripcion: that.state.data_link.desc, nombre: that.state.data_link.name, enlace: that.state.data_link.link});
    //console.log(that.state.data_survey)
    //window.location.reload()
    fetch ("http://192.168.2.107:8080/addLink", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(that.state.data_link)
    }).then(function(response){
      return response.json();
    }).then(function(myJson){
      console.log(myJson.flag);
      if(myJson.flag==="true"){
        console.log("Agregado correctamente"); 
      }else{
        console.log("Hubo un error al insertar")
      }
    });
    window.location.reload()
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
  
  UNSAFE_componentWillMount(){
    this.obtainSurvey(this)
  }

  survey_table(e){
  var that=this;
  let lista=[];
  let dataSurvey=that.state.data_survey;
  if(dataSurvey.length!==0){
    var json = JSON.parse(dataSurvey);
    json.forEach(function(value,key){
    lista.push(
        <tr key={key}>
          <td>{value.nombre}</td>
          <td className="" >{value.descripcion}</td>
        </tr>
        );

    });
    return lista;
  }

  }
  render() {
    return (
      <div className="d-flex row justify-content-center col-12" id="cuadro">
        <div className="" id="izquierda">
          <form onSubmit={this.handleSubmit.bind(this)} method='POST' >
            <label >Nombre:   </label>
              <div className="row d-flex justify-content-center">
                <input className="form-control" style={{width: "50%"}} type='text' name='namedAs' required placeholder='Guardar como...' onChange={this.handleNamelinkChange.bind(this)}></input><br></br>
              </div>
            <label>Link:   </label>
              <input className=" form-control" type='text' name='linkName' required placeholder='Pega el link aqui'  onChange={this.handleLinkChange.bind(this)}></input><br></br>
            <label>Descripción de la encuesta:</label>
              <textarea id="survey_description" name="newDescription" className=" form-control" type='text' onChange={this.handleDescriptionChange.bind(this)} required placeholder='Descripción'></textarea><br></br>
            <br></br>
            <input value="Agregar"   className="btn add" type="submit" data-test="submit" />
          </form>
        </div>

        <div className="table-responsive" id="mainTable">
        <br></br><br></br>
         <table style={{textAlign:"left"}}  className="table table-hover">
           <thead className="thead-dark">
              <tr>
                <th>Nombre de encuesta</th>
                <th>Descripción</th>
              </tr>
            </thead>
          <tbody>
            {this.survey_table(this)}
          </tbody>
         </table>
        </div> 
        
      </div>
    );
  }
}

export default About;

