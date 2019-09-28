import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators'
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( private http: HttpClient, private router: Router ) {
    this.cargarStorage();
  }

  guardarStorage(id: string, token: string, usuario: Usuario){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  estaLogueado(){
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage(){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }else{
      this.token = '';
      this.usuario = null;
    }
  }

  logout(){
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ){
    let url = `${ URL }/login/google`;
    
    return this.http.post( url, {token} ).pipe(
      map( (resp: any) =>{
        this.guardarStorage(resp.id, resp.token, resp.usuario)
        return true;
      })
    );
  }

  login(usuario: Usuario, recordar: boolean = false){

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    }else{
      localStorage.removeItem('email');
    }
    let url = `${ URL }/login`;
    return this.http.post(url, usuario).pipe(
      map( (resp: any) =>{
        this.guardarStorage(resp.id, resp.token, resp.usuario)
        return true;
      })
    );
  }

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

  actualizarUsuario(usuario: Usuario){
    
    let url = `${ URL }/usuario/${usuario._id}?token=${this.token}`;
    
    return this.http.put(url, usuario).pipe(
      map( (resp: any) =>{
        let usuarioDB: Usuario = resp.usuario;
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
        Swal.fire({
          type: 'success',
          title: 'Usuario actualizado',
          text: usuario.nombre
        });
        return true;
      })
    );
  }
}
