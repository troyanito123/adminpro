import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;

  constructor(public _medicosService: MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cambiarDesde(valor: number){
    let desde = this.desde + valor;
    if(desde < 0){
      return;
    }

    if(desde >= this._medicosService.totalMedicos){
      return;
    }

    this.desde = this.desde + valor;
    this.cargarMedicos();
  }

  cargarMedicos(){
    this._medicosService.cargarMedicos(this.desde).subscribe( medicos => this.medicos = medicos);
  }

  buscarMedicos(termino: string){
    if(termino.length <= 0){
      this.cargarMedicos();
      return;
    }
    this._medicosService.buscarMedicos( termino ).subscribe( medicos => this.medicos = medicos);
  }

  borrarMedico( medico: Medico ){

    Swal.fire({
      type: 'warning',
      title: '¿Está seguro?',
      text: 'Esta a punto de borrar a ' + medico.nombre,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Médico'
    }).then( borrar =>{
      if (borrar.value) {
        this._medicosService.borrarMedico(medico._id).subscribe( (resp) => {
          this.medicos = this.medicos.filter(medico => medico._id !== resp._id);
        });
      }
    });
    
  }

}
