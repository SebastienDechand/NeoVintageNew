import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLucideIcons, LucideLeaf, LucideRecycle, LucideHeart } from '@lucide/angular';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideLucideIcons(LucideLeaf, LucideRecycle, LucideHeart)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
