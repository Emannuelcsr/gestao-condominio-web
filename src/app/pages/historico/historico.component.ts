import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { SolicitacaoResponse } from '../../models/solicitacao-response';
import { PaginaResponse } from '../../models/pagina-response';
import { MenuAdminComponent } from '../../components/menu-admin/menu-admin.component';
import { DatePipe } from '@angular/common';
import { obterMensagemErro } from '../../utils/erro.utils';
import { formatarCategoria, formatarStatus } from '../../utils/solicitacao.utils';

@Component({
  selector: 'app-historico',
  imports: [MenuAdminComponent, DatePipe],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css',
})
export class HistoricoComponent implements OnInit {
  solicitacoes: SolicitacaoResponse[] = [];
  paginaAtual = 1;
  tamanhoPagina = 5;
  totalPaginas = 0;
  primeiraPagina = true;
  ultimaPagina = false;
  totalElementos = 0;
  ordenarPor = 'dataCriacao';
  direcao = 'desc';
  mensagemErro = '';
  mensagemSucesso = '';
  id!: number;
  carregando = false;
  nomeMorador = '';
  formatarStatus = formatarStatus;
  formatarCategoria = formatarCategoria;

  constructor(
  private route: ActivatedRoute,
  private solicitacoesService: SolicitacaoService,
  private usuarioService: UsuarioService,
  private router: Router,
  ) {}

ngOnInit(): void {
  const idParametro = this.route.snapshot.paramMap.get('id');

  if (idParametro) {
    this.id = Number(idParametro);

    this.usuarioService.buscarUsuario(this.id).subscribe({
      next: (resposta) => {
        this.nomeMorador = resposta.nome;
      }
    });

    this.carregarHistorico();
  }
}

  carregarHistorico() {
    this.carregando = true;
    this.solicitacoesService
      .solicitacoesPorMorador(
        this.paginaAtual,
        this.tamanhoPagina,
        this.id,
        this.ordenarPor,
        this.direcao,
      )
      .subscribe({
        next: (resposta) => {
          this.atualizarPaginacao(resposta);
          this.carregando = false;
         
        },
        error: (erro) => {
          this.mensagemErro = obterMensagemErro(erro);
          this.mensagemSucesso = '';
          this.carregando = false;
        },
      });
  }

  atualizarPaginacao(resposta: PaginaResponse<SolicitacaoResponse>) {
    this.solicitacoes = resposta.conteudo;
    this.totalPaginas = resposta.totalPaginas;
    this.primeiraPagina = resposta.primeiraPagina;
    this.ultimaPagina = resposta.ultimaPagina;
    this.totalElementos = resposta.totalElementos;
  }

  paginaAnterior() {
    if (!this.primeiraPagina) {
      this.paginaAtual--;
      this.carregarHistorico() ;
    }
  }

  proximaPagina() {
    if (!this.ultimaPagina) {
      this.paginaAtual++;
      this.carregarHistorico() ;
    }
  }

  ordenar(campo: string) {
    if (this.ordenarPor === campo) {
      if (this.direcao === 'asc') {
        this.direcao = 'desc';
      } else {
        this.direcao = 'asc';
      }
    } else {
      this.direcao = 'asc';
    }

    this.ordenarPor = campo;
    this.paginaAtual = 1;
    this.carregarHistorico() ;
  }


voltar() {
  this.router.navigate(['/admin/usuarios']);
}
}