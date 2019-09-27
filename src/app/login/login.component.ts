import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/services.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;
  auth2: any;

  constructor(public router: Router, private _usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    
    if(this.email.length > 1){
      this.recuerdame = true;
    }
  }

  googleInit(){
    gapi.load('auth2', () =>{
      this.auth2 = gapi.auth2.init({
        client_id: '829404181351-ttqahk9apsvkfuis50d5u7562879avvl.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSigin(document.getElementById('btnGoogle'));

    });
  }

  attachSigin(element){
    this.auth2.attachClickHandler( element, {}, googleUser =>{
      // let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;

      this._usuarioService.loginGoogle(token).subscribe( () => window.location.href = '#/dashboard' );
      
    });
  }

  ingresar(forma: NgForm){
    
    if(forma.invalid){return;}

    let usuario = new Usuario(null, forma.value.email, forma.value.password);

    this._usuarioService.login(usuario, this.recuerdame).subscribe( resp => this.router.navigate(['/dashboard']));
    
  }

}
