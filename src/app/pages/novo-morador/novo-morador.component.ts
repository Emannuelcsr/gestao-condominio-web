import { Component } from '@angular/core';
import { MenuAdminComponent } from '../../components/menu-admin/menu-admin.component';
import { UsuarioService } from '../../services/usuario.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { obterMensagemErro } from '../../utils/erro.utils';

@Component({
  selector: 'app-novo-morador',
  imports: [ReactiveFormsModule,MenuAdminComponent,RouterLink],
  templateUrl: './novo-morador.component.html',
  styleUrl: './novo-morador.component.css',
})
export class NovoMoradorComponent {
  constructor(private usuarioService: UsuarioService,private router:Router) {}
   mensagemErro = '';
   salvando = false;


  formNovoMorador = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    senha: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });


criar(){

if (this.formNovoMorador.invalid) {
  this.formNovoMorador.markAllAsTouched();
  return;
}

  const dados = this.formNovoMorador.getRawValue();

  this.salvando=true;

  this.usuarioService.novoMorador(dados).subscribe({
    next:(resposta)=>{
      alert('Novo cadastro de morador criado com sucesso')
      this.salvando=false
      this.router.navigate(['/admin/usuarios'])

    },
    error:(erro)=>{
      this.salvando=false
      this.mensagemErro = obterMensagemErro(erro);
    }

  });

}

}
