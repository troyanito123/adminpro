import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(public _subirArchivoService: SubirArchivoService, public _modalUploadService: ModalUploadService) {}

  ngOnInit() {
  }

  seleccionImage( archivo: File ){

    if(!archivo){ 
      this.imagenSubir = null;
      return;
    }
    
    if(archivo.type.indexOf('image') < 0){
      Swal.fire({
        type: 'error',
        title: 'Solo imágenes',
        text: 'El archivo seleccionado no es una imagen'
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );
    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  subirImagen(){
    this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
              .then( resp =>{
                this._modalUploadService.notificacion.emit( resp );
                this.cerrarModal();
              })
              .catch( err =>{
                console.log('Error en la carga ...');
                
              });
  }

  cerrarModal(){
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalUploadService.ocularModal();
  }

}
