import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { SolicitacaoService } from '../../services/solicitacao.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuMoradorComponent } from '../../components/menu-morador/menu-morador.component';
import { obterMensagemErro } from '../../utils/erro.utils';
@Component({
  selector: 'app-editar-solicitacao',
  imports: [ReactiveFormsModule, MenuMoradorComponent],
  templateUrl: './editar-solicitacao.component.html',
  styleUrl: './editar-solicitacao.component.css',
})
export class EditarSolicitacaoComponent implements OnInit {
  id!: number;

  mensagemErro = '';
  carregandoSolicitacao = false;
  salvando = false;

  constructor(
    private route: ActivatedRoute,
    private solicitacaoService: SolicitacaoService,
    private router: Router,
  ) {}

  formEditar = new FormGroup({
    titulo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    descricao: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    categoria: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    const idParametro = this.route.snapshot.paramMap.get('id');

    if (idParametro) {
      this.id = Number(idParametro);

      this.buscarMinhaPorId();
    }
  }

buscarMinhaPorId() {

  this.carregandoSolicitacao = true;

  this.solicitacaoService.buscarMinhaPorId(this.id).subscribe({
    next: (solicitacao) => {
      this.formEditar.patchValue({
        titulo: solicitacao.titulo,
        descricao: solicitacao.descricao,
        categoria: solicitacao.categoria,
      });

      this.carregandoSolicitacao = false;
    },

    error: (erro) => {
      this.mensagemErro = obterMensagemErro(erro);
      this.carregandoSolicitacao = false;
    },
  });
}

  salvar() {
    if (this.formEditar.invalid) {
      this.formEditar.markAllAsTouched();
      return;
    }

    const dados = this.formEditar.getRawValue();
    this.salvando = true;
    this.solicitacaoService.atualizar(this.id, dados).subscribe({
      next: (solicitacaoAtualizada) => {
        alert('Solicitação atualizada com sucesso');
        this.salvando = false;
        this.router.navigate(['/minhas-solicitacoes']);
      },

      error: (erro) => {
        this.mensagemErro = obterMensagemErro(erro);
        this.salvando = false;
      },
    });
  }

  cancelar() {
    this.salvando = false;
    this.router.navigate(['/minhas-solicitacoes']);
  }
}
