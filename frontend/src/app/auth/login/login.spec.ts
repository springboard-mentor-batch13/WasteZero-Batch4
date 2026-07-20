import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';


class MockAuthService {
  login() {
    return Promise.resolve(true);
  }

  getUser() {
    return {
      role: 'volunteer'
    };
  }
}

describe('Login', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent,HttpClientTestingModule,RouterTestingModule   ],

      providers: [

        {
          provide: AuthService,
          useClass: MockAuthService
        }

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
     //await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render login form', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
  });
});
