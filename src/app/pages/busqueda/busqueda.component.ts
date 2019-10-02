import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from '../../models/medico.model';

const URL = environment.url;

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  hospitales: Hospital[] = [];
  medicos: Medico[] = [];

  constructor(public activatedRoute: ActivatedRoute, public http: HttpClient) {
    activatedRoute.params.subscribe( params => {
      let termino =  params['termino'];
      this.buscar(termino);
    })
  }

  ngOnInit() {
  }

  buscar(termino: string){

    let url = `${ URL }/busqueda/todo/${ termino }`
    this.http.get(url).subscribe( (resp: any) => {
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospitales;
    });
  }

}
