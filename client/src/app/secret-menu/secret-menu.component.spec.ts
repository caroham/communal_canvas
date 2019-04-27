import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretMenuComponent } from './secret-menu.component';

describe('SecretMenuComponent', () => {
  let component: SecretMenuComponent;
  let fixture: ComponentFixture<SecretMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecretMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
