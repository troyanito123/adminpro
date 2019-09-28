import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const URL = environment.url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuarios'): any {

    let url = `${ URL }/img`;

    if(!img){
      return `${ url }/xx/xxxx`;
    }

    if(img.indexOf('https') >= 0){
      return img;
    }

    let resp = '';

    switch (tipo) {
      case 'usuarios':
        resp = `${ url }/usuarios/${ img }`;
        break;

      case 'hospitales':
        resp = `${ url }/hospitales/${ img }`;
        break;

      case 'medicos':
        resp = `${ url }/medicos/${ img }`;
        break;
      default:
        console.log('Tipo de imagen no existe: usuario, medico, hospitales');
        resp = url + '/usuarios/xxxx';
    }

    return resp;
  }

}
