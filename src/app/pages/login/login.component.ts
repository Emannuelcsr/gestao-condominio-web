import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  mensagemErro = '';
  entrando = false;



  formLogin = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    senha: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  entrar() {

    if (this.formLogin.invalid) {
    this.formLogin.markAllAsTouched();
    return;
  }


  this.mensagemErro = '';

    const dados = this.formLogin.getRawValue();

      this.entrando = true;


    this.authService.login(dados).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        const perfil = this.authService.obterPerfil();

        this.entrando = false;
        if (perfil === 'MORADOR') {
          this.router.navigate(['/minhas-solicitacoes']);
        }
        if (perfil === 'ADMINISTRADOR') {
          this.router.navigate(['/admin']);
        }
      },
      error: (erro) => {
        this.mensagemErro = 'E-mail ou senha inválidos';
        this.entrando = false;
      },
    });
  }
}
