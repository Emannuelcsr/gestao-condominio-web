import { Component } from '@angular/core';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { OnInit } from '@angular/core';
import { SolicitacaoResponse } from '../../models/solicitacao-response';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MenuMoradorComponent } from '../../components/menu-morador/menu-morador.component';
import { PaginaResponse } from '../../models/pagina-response';
import { UsuarioResponse } from '../../models/usuario-response';
import { UsuarioService } from '../../services/usuario.service';
import { obterMensagemErro } from '../../utils/erro.utils';
import { formatarCategoria, formatarStatus } from '../../utils/solicitacao.utils';

@Component({
  selector: 'app-minhas-solicitacoes',
  imports: [DatePipe, MenuMoradorComponent],
  templateUrl: './minhas-solicitacoes.component.html',
  styleUrl: './minhas-solicitacoes.component.css',
})
export class MinhasSolicitacoesComponent implements OnInit {
  solicitacoes: SolicitacaoResponse[] = [];
  mensagemSucesso = '';
  paginaAtual = 1;
  tamanhoPagina = 5;
  totalPaginas = 0;
  primeiraPagina = true;
  ultimaPagina = false;
  totalElementos = 0;
  usuarios: UsuarioResponse[] = [];
  mensagemErro = '';
  carregandoSolicitacoes = false;
  statusSelecionado = '';
  categoriaSelecionada = '';
  tituloSelecionado = '';
  ordenarPor = 'dataCriacao';
  direcao = 'desc';
  solicitacaoEmProcessamento: number | null = null;
formatarStatus = formatarStatus ;
formatarCategoria = formatarCategoria;


  constructor(
    private solicitacaoService: SolicitacaoService,
    private router: Router,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.listarMinhas();
  }

  atualizarPaginacao(resposta: PaginaResponse<SolicitacaoResponse>) {
    this.solicitacoes = resposta.conteudo;
    this.totalPaginas = resposta.totalPaginas;
    this.primeiraPagina = resposta.primeiraPagina;
    this.ultimaPagina = resposta.ultimaPagina;
    this.totalElementos = resposta.totalElementos;
  }

  proximaPagina() {
    if (!this.ultimaPagina) {
      this.paginaAtual++;

      this.listarMinhas();
    }
  }

  paginaAnterior() {
    if (!this.primeiraPagina) {
      this.paginaAtual--;

      this.listarMinhas();
    }
  }

  listarMinhas() {
    this.carregandoSolicitacoes = true;
    this.solicitacaoService
      .listarMinhas(
        this.categoriaSelecionada,
        this.statusSelecionado,
        this.tituloSelecionado,
        this.paginaAtual,
        this.tamanhoPagina,
        this.ordenarPor,
        this.direcao,
      )
      .subscribe({
        next: (resposta) => {
          this.atualizarPaginacao(resposta);
          this.carregandoSolicitacoes = false;
        },

        error: (erro) => {
          this.mensagemErro = obterMensagemErro(erro);
          this.mensagemSucesso = '';
          this.carregandoSolicitacoes = false;
        },
      });
  }

  excluir(id: number) {
    const confirmar = confirm(
      'Tem certeza que deseja excluir esta solicitacao ?',
    );

    if (!confirmar) {
      return;
    }

    this.solicitacaoEmProcessamento = id;

    this.solicitacaoService.excluir(id).subscribe({
      next: (response) => {
        this.solicitacoes = this.solicitacoes.filter(
          (solicitacao) => solicitacao.id != id,
        );

        if (this.solicitacoes.length === 0 && this.paginaAtual > 1) {
          this.paginaAtual--;
        }

        this.listarMinhas();
        this.mensagemSucesso = response.mensagem;
        this.solicitacaoEmProcessamento = null;
      },
      error: (erro) => {
        this.mensagemErro = obterMensagemErro(erro);
        this.mensagemSucesso = '';
        this.solicitacaoEmProcessamento = null;
      },
    });
  }

  editar(id: number) {
    this.router.navigate(['/solicitacoes/editar', id]);
  }

  filtrar() {
    this.paginaAtual = 1;
    this.listarMinhas();
  }

  limparFiltros(inputTitulo: HTMLInputElement) {
    this.statusSelecionado = '';
    this.categoriaSelecionada = '';
    this.tituloSelecionado = '';
    this.ordenarPor = 'dataCriacao';
    this.direcao = 'desc';

    inputTitulo.value = '';

    this.paginaAtual = 1;

    this.listarMinhas();
  }

  alterarOrdenacao() {
    this.paginaAtual = 1;
    this.listarMinhas();
  }
}
