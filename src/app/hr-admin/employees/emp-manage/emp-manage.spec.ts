import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpManage } from './emp-manage';

describe('EmpManage', () => {
  let component: EmpManage;
  let fixture: ComponentFixture<EmpManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpManage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpManage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
