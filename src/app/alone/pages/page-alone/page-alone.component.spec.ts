import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAloneComponent } from './page-alone.component';

describe('PageAloneComponent', () => {
  let component: PageAloneComponent;
  let fixture: ComponentFixture<PageAloneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageAloneComponent]
    });
    fixture = TestBed.createComponent(PageAloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
