import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(public _usuarioService: UsuarioService, public router: Router){}

  canActivate(): boolean{

    let res = false;

    if(this._usuarioService.usuario.role === 'ADMIN_ROLE'){
      res = true;
    }else{
      console.log('Bloquedado por el AdminGuard');
      this._usuarioService.logout();
    }
    return res;
  }
  
}
