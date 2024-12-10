import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemondialog',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './pokemondialog.component.html',
  styleUrl: './pokemondialog.component.scss',
})
export class PokemondialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PokemondialogComponent>,
    @Inject(MAT_DIALOG_DATA) public pokemon: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
