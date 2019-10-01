import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { map } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  token: string;

  constructor(private http: HttpClient, public _usuarioService: UsuarioService) {
    this.token = localStorage.getItem('token');
  }

  cargarHospitales(desde: number){
    let url = `${ URL }/hospital?desde=${ desde }`;
    return this.http.get(url);   
  }

  obtenerHospital(id: string){
    let url = `${ URL }/hospital/${ id }`;
    return this.http.get(url).pipe( map ( (resp: any) => resp.hospital));
  }

  borrarHospital(id: string){
    let url = `${ URL }/hospital/${ id }?token=${ this._usuarioService.token }`;
    return this.http.delete(url).pipe( map( (resp: any) => resp.hospital));
  }

  crearHospital(nombre: string){
    let url = `${ URL }/hospital?token=${ this._usuarioService.token }`;
    return this.http.post(url, {nombre}).pipe( map( (resp: any) => resp.hospital));
  }

  buscarHospital(termino: string){
    let url = `${ URL }/busqueda/coleccion/hospitales/${ termino }`;
    return this.http.get(url).pipe( map( (resp: any) => resp.hospitales));
  }

  actualizarHospital(hospital: Hospital){
    let url = `${ URL }/hospital/${ hospital._id }?token=${ this._usuarioService.token }`;
    return this.http.put(url, hospital).pipe( map( (resp: any) => resp.hospital));
  }
  
}
