import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5001';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor(private httpClient: HttpClient) {}

  importPokemonCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${API_URL}/api/pokemon/import`, formData);
  }

  getAllPokemons(type?: string, name?: string): Observable<any> {
    let url = `${API_URL}/api/pokemon`;
    const params = new URLSearchParams();

    if (type) {
      params.append('type', type);
    }
    if (name) {
      params.append('name', name);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return this.httpClient.get(url);
  }

  getPokemonById(id: number): Observable<any> {
    return this.httpClient.get(`${API_URL}/api/pokemon/${id}`);
  }

  toggleFavorite(id: number): Observable<any> {
    return this.httpClient.post(`${API_URL}/api/pokemon/favorite/${id}`, {});
  }

  getFavoritePokemons(): Observable<any> {
    return this.httpClient.get(`${API_URL}/api/pokemon/favorites`);
  }
}
