import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators'
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable } from 'rxjs';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor( private http: HttpClient, private router: Router, private _subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  estaLogueado(){
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage(){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    }else{
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  logout(){
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ){
    let url = `${ URL }/login/google`;
    
    return this.http.post( url, {token} ).pipe(
      map( (resp: any) =>{
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu)
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
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu)
        return true;
      }),
      catchError( err =>{
        Swal.fire('Error en el login', err.error.mensaje, 'error');
        throw err
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
      }),
      catchError( err =>{
        Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
        throw err
      })
    );
  }

  actualizarUsuario(usuario: Usuario){
    
    let url = `${ URL }/usuario/${usuario._id}?token=${this.token}`;
    
    return this.http.put(url, usuario).pipe(
      map( (resp: any) =>{

        if(usuario._id === this.usuario._id){
          let usuarioDB: Usuario = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }
        Swal.fire({
          type: 'success',
          title: 'Usuario actualizado',
          text: usuario.nombre
        });
        return true;
      }),
      catchError( err =>{
        Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
        throw err
      })
    );
  }

  cambiarImagen(archivo: File, id: string){
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) =>{
        this.usuario.img = resp.usuario.img;
        Swal.fire({
          type: 'success',
          title: 'Imagen actualizada',
          text: this.usuario.nombre
        });
        this.guardarStorage(id, this.token, this.usuario, this.menu);
        
      })
      .catch(err =>{
        console.log(err);
        
      })
  }

  cargarUsuarios(desde: number = 0){
    let url = `${ URL }/usuario?desde=${ desde }`;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string){
    let url = `${ URL }/busqueda/coleccion/usuarios/${ termino }`;
    return this.http.get(url).pipe( map( (resp: any) => resp.usuarios ));
  }

  borrarUsuario(id: string){
    let url = `${ URL }/usuario/${ id }?token=${ this.token }`;
    return this.http.delete(url).pipe(
      map( resp =>{
        Swal.fire({
          type: 'success',
          title: 'Usuario borrado',
          text: 'El usuario ha sido eliminado correctamente'
        });
        return true;
      })
    );
  }
}
