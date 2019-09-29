import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from 'src/app/services/services.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(private _usuarioService: UsuarioService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios(){
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) =>{
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number){
    let desde = this.desde + valor;
    if(desde >= this.totalRegistros){
      return;
    }

    if(desde < 0){
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string){

    if(termino.length <= 0){
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this._usuarioService.buscarUsuarios(termino).subscribe( (usuarios: Usuario[]) =>{
      this.usuarios = usuarios;
      this.cargando = false;
    });
    
  }

  borrarUsuario(usuario: Usuario){

    if(usuario._id === this._usuarioService.usuario._id){
      Swal.fire({
        type: 'error',
        title: '!No puede borrar este usuario!',
        text: 'No se puede borrar a ti mismo'
      });
      return;
    }

    Swal.fire({
      type: 'warning',
      title: '¿Está seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar usuario'
    }).then( borrar =>{
      if (borrar.value) {
        this._usuarioService.borrarUsuario(usuario._id)
                            .subscribe( (borrado: boolean) =>{
                              console.log(borrado);
                              this.cargarUsuarios();
                            });
      }
    })

    
  }

  

}
