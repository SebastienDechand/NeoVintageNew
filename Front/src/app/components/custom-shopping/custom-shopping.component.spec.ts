import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { CustomShoppingComponent } from './custom-shopping.component';

describe('CustomShoppingComponent', () => {
  let component: CustomShoppingComponent;
  let fixture: ComponentFixture<CustomShoppingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomShoppingComponent],
      providers: [provideAnimations()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomShoppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
