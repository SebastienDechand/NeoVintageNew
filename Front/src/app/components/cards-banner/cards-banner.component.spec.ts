import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLucideIcons, LucideLeaf, LucideRecycle, LucideHeart } from '@lucide/angular';

import { CardsBannerComponent } from './cards-banner.component';

describe('CardsBannerComponent', () => {
  let component: CardsBannerComponent;
  let fixture: ComponentFixture<CardsBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsBannerComponent],
      providers: [provideLucideIcons(LucideLeaf, LucideRecycle, LucideHeart)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsBannerComponent);
    component = fixture.componentInstance;
    component.icon = 'leaf';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
