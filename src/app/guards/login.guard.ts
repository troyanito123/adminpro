import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/services.index';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private _usuarioService: UsuarioService, private router: Router){}

  canActivate(): boolean{
    
    if (this._usuarioService.estaLogueado()) {
      console.log('Paso el guard');
      return true;
    }else{
      console.log('Bloqueado por el guard'); 
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
