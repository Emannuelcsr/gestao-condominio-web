import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Router, RouterLink } from '@angular/router';
import { MenuMoradorComponent } from '../../components/menu-morador/menu-morador.component';
import { obterMensagemErro } from '../../utils/erro.utils';

@Component({
  selector: 'app-nova-solicitacao',
  imports: [ReactiveFormsModule,MenuMoradorComponent,RouterLink],
  templateUrl: './nova-solicitacao.component.html',
  styleUrl: './nova-solicitacao.component.css'
})
export class NovaSolicitacaoComponent {
  
  constructor(private solicitacaoService:SolicitacaoService,private router:Router){}

  mensagemErro = '';
  mensagemSucesso = '';
  criando = false;

  formNovaSolicitacao = new FormGroup({
    titulo:new FormControl('',{
      nonNullable:true,
      validators:[Validators.required]
    }),
    descricao:new FormControl('',{
      nonNullable:true,
      validators:[Validators.required]
    }),
    categoria:new FormControl('',{
      nonNullable:true,
      validators:[Validators.required]
    })
  });

criar(){


    if (this.formNovaSolicitacao.invalid) {
    this.formNovaSolicitacao.markAllAsTouched();
    return;
  }
  const dados = this.formNovaSolicitacao.getRawValue();
  this.criando = true;

  this.solicitacaoService.criar(dados).subscribe({

    next:(solicitacaoCriada)=>{
      this.criando = false;
      alert('Nova solicitacao criada com sucesso')
      this.router.navigate(['/minhas-solicitacoes'])

    },
    error: (erro) => {
      this.criando = false;
      this.mensagemErro = obterMensagemErro(erro);
      }

  });


}


}
