import { Component, OnInit, NgModule } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _hospitalService: HospitalService, public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe( () => this.cargarHospitales());
  }

  cargarHospitales(){
    this._hospitalService.cargarHospitales(this.desde).subscribe( (resp: any)=> {
      this.hospitales = resp.hospitales;
      this.totalRegistros = resp.total;
    });
  }

  cambiarDesde(desde : number){
    let d = this.desde + desde;
    if(d >= this.totalRegistros){
      return;
    }
    if(d < 0){
      return;
    }
    this.desde = d;
    this.cargarHospitales();
  }

  buscarHospital( termino: string ){
    if(termino.length <= 0){
      this.cargarHospitales();
      return;
    }
    this._hospitalService.buscarHospital(termino).subscribe( resp => this.hospitales = resp);
  }

  crearHospital(){
    Swal.fire({
      title: 'Hospital Nuevo',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Crear'
    }).then((crear) => {
      if (crear.value) {
        Swal.fire({
          allowOutsideClick: false,
          type: 'info',
          text: 'Espere porfavor...'
        });
        Swal.showLoading();
        this._hospitalService.crearHospital(crear.value).subscribe( hospital =>{
          Swal.fire({
            type: 'success',
            title: 'Hospital creado',
            text: 'Se creo el hospital: ' + hospital.nombre
          });
          this.cargarHospitales();
        });
      }
    });

  }

  actualizarHospital(hospital: Hospital){
    
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se actualizará el nombre del hospital a: " + hospital.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizalo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: false,
          type: 'info',
          text: 'Actualizando ...'
        });
        Swal.showLoading();
        this._hospitalService.actualizarHospital(hospital).subscribe( hospital => {
          this.cargarHospitales();
          Swal.fire({
            type: 'info',
            title: 'Actualizacion correcta',
            text: 'Se actualizo correctamente el hospital ' + hospital.nombre
          });
        });
      }
    });
  }

  eliminarHospital(hospital: Hospital){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se eliminara el hospital " + hospital.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: false,
          type: 'info',
          text: 'Eliminando ...'
        });
        Swal.showLoading();
        this._hospitalService.borrarHospital(hospital._id).subscribe( hospital => {
          this.cargarHospitales();
          Swal.fire({
            type: 'info',
            title: 'Eliminacion correcta',
            text: 'Se elimino correctamente el hospital ' + hospital.nombre
          });
        });
      }
    })
    
  }

  mostrarModal(id: string){
    this._modalUploadService.mostrarModal('hospitales', id);
  }


}
