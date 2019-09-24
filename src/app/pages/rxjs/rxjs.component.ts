import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subcription: Subscription;

  constructor() {

    this.subcription = this.regresaObservable().subscribe( 
      numero => console.log('Subs ', numero),
      error => console.error(error),
      () => console.log('Termino!')
      );
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.subcription.unsubscribe();
  }

  regresaObservable(): Observable<any>{
    return new Observable( observer => {

      let contador = 0;

      let intervalo = setInterval( () => {
        contador += 1;

        let salida = {
          contador
        };

        observer.next(salida);

        // if (contador === 3){
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

      }, 1000);
    }).pipe(
      map( resp => resp['contador']),
      filter( ( valor, index) => {

        if( (valor % 2) === 1 ){
          return true;
        }else{
          return false;
        }
        
      })
    );
  }

}
