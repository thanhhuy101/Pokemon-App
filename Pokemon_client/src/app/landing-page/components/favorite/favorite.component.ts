import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../../models/pokemon.models';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PokemondialogComponent } from '../../../pokemondialog/pokemondialog.component';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, SharedModule, FooterComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent {
  favoritePokemons: Pokemon[] = [];
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.loadFavorites();
  }

  loadFavorites() {
    const storedFavorites = localStorage.getItem('favoritePokemons');
    if (storedFavorites) {
      this.favoritePokemons = JSON.parse(storedFavorites);
    }
  }

  removeFromFavorites(pokemon: Pokemon) {
    const index = this.favoritePokemons.findIndex((p) => p.id === pokemon.id);
    if (index !== -1) {
      this.favoritePokemons.splice(index, 1);
      localStorage.setItem(
        'favoritePokemons',
        JSON.stringify(this.favoritePokemons)
      );

      this.snackBar.open(`Removed ${pokemon.name} from favorites!`, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
    }
  }

  viewPokemonDetails(pokemon: Pokemon): void {
    this.dialog.open(PokemondialogComponent, {
      width: '500px',
      data: pokemon,
    });
  }
}
