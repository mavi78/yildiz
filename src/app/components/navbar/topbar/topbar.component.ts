import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  QueryList,
} from '@angular/core';
import { BottomComponent } from '../bottom/bottom.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements AfterContentInit {
  @ContentChildren('cmb') content!: QueryList<any>;

  ngAfterContentInit(): void {
    this.content.forEach((m: any) => {
      console.log(m);
    });
  }
}
