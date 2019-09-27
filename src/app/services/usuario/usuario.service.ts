import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators'
import Swal from 'sweetalert2'

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient ) { }

  crearUsuario(usuario: Usuario){
    let url = `${ URL }/usuario`;

    return this.http.post(url, usuario).pipe(
      map( (resp: any) =>{
        Swal.fire({
          type: 'success',
          title: 'Usuario creado',
          text: 'Bienvenido ' + usuario.nombre,
        });
        return resp.usuario;
      })
    );
  }
}
