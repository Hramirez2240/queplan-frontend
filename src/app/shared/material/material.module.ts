import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  exports: [MatCardModule, MatTableModule, MatChipsModule, MatIconModule],
})
export class MaterialModule {}
