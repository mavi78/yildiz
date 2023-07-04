import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { BottomComponent } from './bottom/bottom.component';
import { LeftComponent } from './left/left.component';

@NgModule({
  declarations: [NavbarComponent, TopbarComponent, BottomComponent, LeftComponent],
  imports: [CommonModule],
  exports: [NavbarComponent, TopbarComponent],
})
export class NavbarModule {}
