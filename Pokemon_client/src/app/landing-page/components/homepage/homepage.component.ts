import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../../services/pokemon/pokemon.service';
import { Pokemon } from '../../../models/pokemon.models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PokemondialogComponent } from '../../../pokemondialog/pokemondialog.component';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../footer/footer.component';

declare var $: any;

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, SharedModule, FooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  ytbUrls: string[] = [
    'https://www.youtube.com/embed/1roy4o4tqQM',
    'https://www.youtube.com/embed/D0zYJ1RQ-fs',
    'https://www.youtube.com/embed/bILE5BEyhdo',
    'https://www.youtube.com/embed/uBYORdr_TY8',
  ];
  pokemons: Pokemon[] = [];
  isLoading: boolean = false;
  totalPokemons: number = 0;
  pageSize: number = 20;
  pageIndex: number = 0;

  favoritePokemons: Pokemon[] = [];

  searchTerm: string = '';
  selectedType: string = '';
  selectedSpeed: string = '';
  isLegendary: boolean = false;
  pokemonTypes: string[] = [
    'Fire',
    'Water',
    'Grass',
    'Electric',
    'Rock',
    'Ground',
    'Ice',
    'Fighting',
    'Psychic',
    'Bug',
    'Ghost',
    'Dragon',
    'Dark',
    'Steel',
  ];
  filteredPokemons: Pokemon[] = [];
  allPokemons: Pokemon[] = [];
  displayedPokemons: Pokemon[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private pokemonService: PokemonService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPokemons();
    this.filteredPokemons = this.pokemons;
  }

  ngAfterViewInit() {
    $('.video-carousel').slick({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3, // Hiển thị 3 slides cùng lúc
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000, // Tự động chuyển sau 3 giây
      arrows: true,
      centerMode: true, // Căn giữa slide hiện tại
      centerPadding: '60px',
      cssEase: 'ease-out',
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            centerPadding: '40px',
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            centerPadding: '30px',
          },
        },
      ],
    });
  }

  loadPokemons() {
    this.pokemonService
      .getAllPokemons(this.selectedType, this.searchTerm)
      .subscribe(
        (pokemons) => {
          this.allPokemons = pokemons;
          this.totalPokemons = pokemons.length;
          this.applyFilters();
        },
        (error) => console.error('Error fetching pokemons:', error)
      );
  }
  updateDisplayedPokemons() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pokemons = this.filteredPokemons.slice(startIndex, endIndex);
  }

  uploadCSV(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.pokemonService.importPokemonCsv(file).subscribe(
        (response) => {
          console.log('Import successful', response);
          this.loadPokemons(); // Reload the pokemon list after successful import
          this.isLoading = false;
        },
        (error) => {
          console.error('Import failed', error);
          this.isLoading = false;
        }
      );
    }
  }

  getPokemons() {
    this.pokemonService.getAllPokemons().subscribe(
      (pokemons) => console.log('Pokemons:', pokemons),
      (error) => console.error('Error fetching pokemons:', error)
    );
  }

  getPokemon(id: number) {
    this.pokemonService.getPokemonById(id).subscribe(
      (pokemon) => console.log('Pokemon:', pokemon),
      (error) => console.error('Error fetching pokemon:', error)
    );
  }

  toggleFavorite(id: number) {
    // Lấy danh sách favorite hiện tại từ localStorage
    const storedFavorites = localStorage.getItem('favoritePokemons');
    this.favoritePokemons = storedFavorites ? JSON.parse(storedFavorites) : [];

    const index = this.favoritePokemons.findIndex((p) => p.id === id);
    if (index === -1) {
      // Thêm vào danh sách yêu thích
      const pokemon = this.pokemons.find((p) => p.id === id);
      if (pokemon) {
        this.favoritePokemons.push(pokemon);
        localStorage.setItem(
          'favoritePokemons',
          JSON.stringify(this.favoritePokemons)
        );

        this.snackBar.open(`Added ${pokemon.name} to favorites!`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });

        // Chuyển hướng đến trang favorite
        this.router.navigate(['/landing-page/favorite']);
      }
    } else {
      // Xóa khỏi danh sách yêu thích
      const removedPokemon = this.favoritePokemons[index];
      this.favoritePokemons.splice(index, 1);
      localStorage.setItem(
        'favoritePokemons',
        JSON.stringify(this.favoritePokemons)
      );

      this.snackBar.open(
        `Removed ${removedPokemon.name} from favorites!`,
        'Close',
        {
          duration: 3000,
          panelClass: ['snackbar-success'],
        }
      );
    }
  }

  getFavorites() {
    this.pokemonService.getFavoritePokemons().subscribe(
      (favorites) => console.log('Favorite pokemons:', favorites),
      (error) => console.error('Error fetching favorites:', error)
    );
  }

  viewPokemonDetails(pokemon: any): void {
    this.dialog.open(PokemondialogComponent, {
      width: '500px',
      data: pokemon,
    });
  }

  applyFilters() {
    // Lọc từ danh sách đầy đủ
    this.filteredPokemons = this.allPokemons.filter((pokemon) => {
      // Lọc theo tên
      const nameMatch =
        !this.searchTerm ||
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Lọc theo loại
      const typeMatch =
        !this.selectedType ||
        pokemon.type1?.toLowerCase() === this.selectedType.toLowerCase() ||
        pokemon.type2?.toLowerCase() === this.selectedType.toLowerCase();

      // Lọc theo legendary
      const legendaryMatch = !this.isLegendary || pokemon.legendary;

      // Lọc theo tốc độ
      let speedMatch = true;
      if (this.selectedSpeed) {
        const speed = pokemon.speed || 0;
        switch (this.selectedSpeed) {
          case '0-50':
            speedMatch = speed >= 0 && speed <= 50;
            break;
          case '51-100':
            speedMatch = speed > 50 && speed <= 100;
            break;
          case '101+':
            speedMatch = speed > 100;
            break;
        }
      }

      return nameMatch && typeMatch && legendaryMatch && speedMatch;
    });

    // Cập nhật tổng số Pokemon và reset về trang đầu tiên
    this.totalPokemons = this.filteredPokemons.length;
    this.pageIndex = 0;
    this.updateDisplayedPokemons();
  }

  // updateDisplayedPokemons() {
  //   const startIndex = this.pageIndex * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.pokemons = this.filteredPokemons.slice(startIndex, endIndex);
  // }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedPokemons();
  }
}
