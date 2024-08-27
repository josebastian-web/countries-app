import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})

export class SearchBoxComponent implements OnInit, OnDestroy {

  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSubscription?: Subscription;

  @Input()
  public initialValue: string = '';

  @Input()
  public placeholder: string = '';
  // Output es lo que escucharán los componente padres
  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  ngOnInit(): void {
    // Se lo asignamos para hacer una limpieza de esa subscripción en el ngOnDestroy
    this.debouncerSubscription = this.debouncer
    .pipe(
      // Esto es como una barrera para que no se ejecute el subscribe
      debounceTime(1000)
    )
    .subscribe( value => {
      this.onDebounce.emit( value );
    });
  }

  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe();
  }

  emitValue( value: string ):void {
    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string): void {
    this.debouncer.next(searchTerm);
  }

}
