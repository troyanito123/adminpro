import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/services.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;

  constructor(public router: Router, private _usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.email = localStorage.getItem('email') || '';
    console.log(this.email);
    
    if(this.email.length > 1){
      this.recuerdame = true;
    }
  }

  ingresar(forma: NgForm){
    
    if(forma.invalid){return;}

    let usuario = new Usuario(null, forma.value.email, forma.value.password);

    this._usuarioService.login(usuario, this.recuerdame).subscribe( resp => this.router.navigate(['/dashboard']));
    
  }

}
