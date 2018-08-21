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
    let proof=[];
    if(this.props.datos.length!==0){
      this.props.datos.forEach(function(value,indice){
        proof.push(<p key={indice} className="asignados_modal">{value}</p>)
      });
      return proof;
    }
  }
  activar(e){
    document.getElementById("send_mail").click();
    document.getElementById("accept").setAttribute("disabled", "disabled")
    this.setState({ open: false });
    let lista=document.getElementsByTagName("input");
    for(let i=0; i<lista.length;i++){
      if(lista[i].type === "checkbox" && lista[i].checked)
        lista[i].checked=false;
    }
    

  }
  render() {
    const { open } = this.state;
    //console.log(document.getElementById("survey"))
    return (
      <div style={{overflow: "auto"}}>
        <button onClick={this.onOpenModal} id="modalC" style={{display: "none"}}></button>
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