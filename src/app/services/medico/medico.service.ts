import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';
import { Medico } from 'src/app/models/medico.model';
import { Title } from '@angular/platform-browser';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(public http: HttpClient, public _usuarioService: UsuarioService) { }

  cargarMedicos(desde: number = 0){
    let url = `${ URL }/medico?desde=${ desde }`;
    return this.http.get(url).pipe( map( (resp: any) =>{
      this.totalMedicos = resp.total;
      return resp.medicos;
    }));
  }

  buscarMedicos(termino: string){
    let url = `${ URL }/busqueda/coleccion/medicos/${ termino }`;
    return this.http.get(url).pipe( map( (resp: any) => resp.medicos ));
  }

  borrarMedico(id: string){
    let url = `${ URL }/medico/${ id }?token=${ this._usuarioService.token }`;
    return this.http.delete(url).pipe( map( (resp: any) =>{
      Swal.fire({
        type: 'success',
        title: 'Médico Borrado',
        text: 'Se elimino al medico ' + resp.medico.nombre
      });
      return resp.medico;
    }));
  }

  guardarMedico( medico: Medico){
    

    if(medico._id){
      // Actualizando
      let url = `${ URL }/medico/${ medico._id }?token=${ this._usuarioService.token }`;
      return this.http.put(url, medico).pipe(map ( (resp: any) =>{
        Swal.fire({
          type: 'success',
          title: 'Médico actualizado',
          text: 'Se actualizo el medico: ' + medico.nombre
        });
        return resp.medico;
      }));
    }else{
      // Creando
      let url = `${ URL }/medico?token=${ this._usuarioService.token }`;
      return this.http.post(url, medico).pipe(map ( (resp: any) =>{
        Swal.fire({
          type: 'success',
          title: 'Médico creado',
          text: 'Se creo al medico: ' + medico.nombre
        });
        return resp.medico;
      }));
    }

  }

  cargarMedico(id: string){
    let url = `${ URL }/medico/${ id }`;
    return this.http.get(url).pipe( map ( (resp: any) => resp.medico));
  }
}
