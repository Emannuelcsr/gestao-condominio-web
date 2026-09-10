import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuAdminComponent } from "../../components/menu-admin/menu-admin.component";
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { obterMensagemErro } from '../../utils/erro.utils';

@Component({
  selector: 'app-editar-usuario',
  imports: [MenuAdminComponent,ReactiveFormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css',
})
export class EditarUsuarioComponent implements OnInit {
  mensagemErro = '';
  mensagemSucesso = '';
  id!: number;
  salvando = false;
  carregandoUsuario = false;

  constructor(
    private route: ActivatedRoute,
    private usuarioService:UsuarioService,
    private router: Router,
  ) {}

  formEditar = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required,Validators.email],
    }),
  });

  ngOnInit(): void {
    const idParametro = this.route.snapshot.paramMap.get('id');


    this.carregandoUsuario = true
    if (idParametro) {
      this.id = Number(idParametro);

      this.usuarioService.buscarUsuario(this.id).subscribe({
        next: (usuario) => {
          this.formEditar.patchValue({
            nome: usuario.nome,
            email: usuario.email,
            });
            
            this.carregandoUsuario = false;
            
          },

        error:(erro)=>{
          this.carregandoUsuario = false; 
          this.mensagemErro = obterMensagemErro(erro);
          
        }
      });
    }
  }

  salvar() {

    this.salvando = true;

    if(this.formEditar.invalid){
      this.formEditar.markAllAsTouched();
      return;
    }


    const dados = this.formEditar.getRawValue();

    
    this.usuarioService.atualizarUsuario(this.id,dados).subscribe({
      next: (usuarioAtualizado) => {
        console.log(usuarioAtualizado);
        console.log("atualizado com sucesso")
        this.salvando = false;
        this.router.navigate(['/admin/usuarios']);
      },

      error: (erro) => {
        this.salvando = false;
        this.mensagemErro = obterMensagemErro(erro);
      },


    });
  }

  cancelar() {
  this.router.navigate(['/admin/usuarios']);
}

}
