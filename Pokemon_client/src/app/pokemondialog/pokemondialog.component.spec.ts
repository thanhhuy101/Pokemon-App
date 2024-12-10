import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemondialogComponent } from './pokemondialog.component';

describe('PokemondialogComponent', () => {
  let component: PokemondialogComponent;
  let fixture: ComponentFixture<PokemondialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemondialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemondialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
