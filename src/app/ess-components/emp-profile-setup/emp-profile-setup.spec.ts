import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpProfileSetup } from './emp-profile-setup';

describe('EmpProfileSetup', () => {
  let component: EmpProfileSetup;
  let fixture: ComponentFixture<EmpProfileSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpProfileSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpProfileSetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
