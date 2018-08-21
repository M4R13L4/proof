import React from 'react';
import Modal from 'react-responsive-modal';
 
export default class Mod extends React.Component {
  
  state = {
    open: false,
  };
 
  onOpenModal = () => {
    this.setState({ open: true });
  };
 
  onCloseModal = () => {
    this.setState({ open: false });
  };

  showWarning(e){
    let i, proof=[];
   // console.log(this.props.datos)
    if(this.props.datos.length!==0){
      this.props.datos.forEach(function(value,indice){
        
        proof.push(<p key={indice} className="manager_modal">{value.manager}</p>)
        //console.log(value.asignados)
        for(i=0;i<value.asignados.length;i++){
          
          proof.push(<p key={Math.random() * 100} className="asignados_modal">{value.asignados[i].nombre}</p>)
        }
      });
     // console.log(mssg)
      return proof;
    }
  }
  activar(e){
    //console.log("estoy clickando")
    document.getElementById("active_send_mail").click();
    document.getElementById("accept").setAttribute("disabled", "disabled")
    this.setState({ open: false });
    document.getElementById("selectAll").click();
    //window.location.reload();
  }
  render() {
    const { open } = this.state;
    //console.log(document.getElementById("survey"))
    return (
      <div style={{overflow: "auto"}}>
        <button onClick={this.onOpenModal} id="modal" style={{display: "none"}}></button>
        <Modal open={open} onClose={this.onCloseModal} center>
          <br></br>
          <h4>Enviar a las siguientes personas?</h4>
          <div style={{overflow: "auto", maxHeight:"400px",maxWidth: "500px"}}>
            {this.showWarning(this)}
          </div>
          <button onClick={this.activar.bind(this)} id="accept">Aceptar</button>
        </Modal>
      </div>
    );
  }
}