import { Component, OnInit } from '@angular/core';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { SolicitacaoResponse } from '../../models/solicitacao-response';
import { DatePipe } from '@angular/common';
import { MenuAdminComponent } from '../../components/menu-admin/menu-admin.component';
import { PaginaResponse } from '../../models/pagina-response';
import { Route, Router } from '@angular/router';
import { delay } from 'rxjs';
import { obterMensagemErro } from '../../utils/erro.utils';
import {
  formatarStatus,
  formatarCategoria,
} from '../../utils/solicitacao.utils';

@Component({
  selector: 'app-admin',
  imports: [DatePipe, MenuAdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  constructor(
    private solicitacaoService: SolicitacaoService,
    private router: Router,
  ) {}
  solicitacoes: SolicitacaoResponse[] = [];
  solicitacoesInativas: SolicitacaoResponse[] = [];
  mensagemErro = '';
  mensagemSucesso = '';
  mostrarInativas = false;
  paginaAtual = 1;
  tamanhoPagina = 5;
  totalPaginas = 0;
  primeiraPagina = true;
  ultimaPagina = false;
  paginaAtualInativa = 1;
  tamanhoPaginaInativa = 1;
  totalPaginasInativa = 0;
  primeiraPaginaInativa = true;
  ultimaPaginaInativa = false;
  statusSelecionado = '';
  categoriaSelecionada = '';
  totalElementos = 0;
  ordenarPor = 'dataCriacao';
  direcao = 'desc';
  tituloSelecionado = '';
  carregando = false;
  carregandoInativas = false;
  solicitacaoEmProcessamento: number | null = null;
  solicitacaoStatusEmProcessamento: number | null = null;
  formatarStatus = formatarStatus;
  formatarCategoria = formatarCategoria;

  ativo: boolean = true;

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  atualizarPaginacao(resposta: PaginaResponse<SolicitacaoResponse>) {
    this.solicitacoes = resposta.conteudo;
    this.totalPaginas = resposta.totalPaginas;
    this.primeiraPagina = resposta.primeiraPagina;
    this.ultimaPagina = resposta.ultimaPagina;
    this.totalElementos = resposta.totalElementos;
  }

  carregarSolicitacoes() {
    this.carregando = true;

    this.solicitacaoService
      .buscaFiltrada(
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
          this.carregando = false;
        },
        error: (erro) => {
          this.mensagemErro = obterMensagemErro(erro);
          this.mensagemSucesso = '';
          this.carregando = false;
        },
      });
  }

  alterarStatus(
    solicitacao: SolicitacaoResponse,
    novoStatus: string,
    event: Event,
  ) {
    const dados = {
      status: novoStatus,
    };

    this.solicitacaoStatusEmProcessamento = solicitacao.id;

    this.solicitacaoService.atualizarStatus(solicitacao.id, dados).subscribe({
      next: (resposta) => {
        this.mensagemErro = '';
        this.mensagemSucesso = 'Status atualizado com sucesso.';

        const solicitacaoEncontrada = this.solicitacoes.find(
          (item) => item.id === solicitacao.id,
        );

        if (solicitacaoEncontrada) {
          solicitacaoEncontrada.status = resposta.status;
        }
        this.solicitacaoStatusEmProcessamento = null;
      },
      error: (erro) => {
        this.mensagemSucesso = '';
        this.mensagemErro = obterMensagemErro(erro);

        const select = event.target as HTMLSelectElement;
        select.value = solicitacao.status;
        this.solicitacaoStatusEmProcessamento = null;
      },
    });
  }

  listarInativas() {
    this.carregandoInativas = true;

    this.solicitacaoService
      .listarInativas(this.paginaAtualInativa, this.tamanhoPaginaInativa)
      .subscribe({
        next: (resposta) => {
          this.mensagemErro = '';
          this.solicitacoesInativas = resposta.conteudo;
          this.totalPaginasInativa = resposta.totalPaginas;
          this.primeiraPaginaInativa = resposta.primeiraPagina;
          this.ultimaPaginaInativa = resposta.ultimaPagina;
          this.carregandoInativas = false;
        },
        error: (erro) => {
          this.mensagemSucesso = '';
          this.mensagemErro = obterMensagemErro(erro);
          this.carregandoInativas = false;
        },
      });
  }

  alternarInativas() {
    this.mostrarInativas = !this.mostrarInativas;

    if (this.mostrarInativas) {
      this.listarInativas();
    }
  }

  reativar(id: number) {
    this.solicitacaoEmProcessamento = id;

    this.solicitacaoService.reativar(id).subscribe({
      next: (resposta) => {
        console.log(resposta);

        this.solicitacoesInativas = this.solicitacoesInativas.filter(
          (item) => item.id !== id,
        );
        this.carregarSolicitacoes();

        this.ajustarPaginaInativas();
        this.mensagemSucesso = resposta.mensagem;
        this.mensagemErro = '';
        this.solicitacaoEmProcessamento = null;
      },
      error: (erro) => {
        this.mensagemErro = obterMensagemErro(erro);
        this.mensagemSucesso = '';
        this.solicitacaoEmProcessamento = null;
      },
    });
  }

  excluirDefinitivamente(id: number) {
    const confirmar = confirm(
      'Tem certeza que deseja excluir esta solicitação definitivamente?',
    );

    if (!confirmar) {
      return;
    }

    this.solicitacaoEmProcessamento = id;

    this.solicitacaoService.exclusaoDefinitiva(id).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = resposta.mensagem;
        this.mensagemErro = '';

        this.solicitacoesInativas = this.solicitacoesInativas.filter(
          (item) => item.id !== id,
        );

        this.ajustarPaginaInativas();
        this.solicitacaoEmProcessamento = null;
      },
      error: (erro) => {
        this.mensagemErro = obterMensagemErro(erro);
        this.mensagemSucesso = '';
        this.solicitacaoEmProcessamento = null;
      },
    });
  }

  proximaPagina() {
    if (!this.ultimaPagina) {
      this.paginaAtual++;
      this.carregarSolicitacoes();
    }
  }

  paginaAnterior() {
    if (!this.primeiraPagina) {
      this.paginaAtual--;
      this.carregarSolicitacoes();
    }
  }

  proximaPaginaInativa() {
    if (!this.ultimaPaginaInativa) {
      this.paginaAtualInativa++;
      this.listarInativas();
    }
  }

  paginaAnteriorInativa() {
    if (!this.primeiraPaginaInativa) {
      this.paginaAtualInativa--;
      this.listarInativas();
    }
  }

  filtrarStatus() {
    this.paginaAtual = 1;
    this.carregarSolicitacoes();
  }

  filtrarCategoria() {
    this.paginaAtual = 1;
    this.carregarSolicitacoes();
  }

  filtro() {
    this.paginaAtual = 1;

    this.carregarSolicitacoes();
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
    this.carregarSolicitacoes();
  }

  detalhes(id: number) {
    this.router.navigate(['/admin/solicitacoes/detalhes', id]);
  }

  buscaPorTitulo(titulo: string) {
    this.tituloSelecionado = titulo.trim();
    this.paginaAtual = 1;
    this.carregarSolicitacoes();
  }

  aoDigitarTitulo(titulo: string) {
    if (titulo.trim() === '') {
      this.tituloSelecionado = '';
      this.paginaAtual = 1;
      this.carregarSolicitacoes();
    }
  }

  limparFiltros(inputTitulo: HTMLInputElement) {
    this.statusSelecionado = '';
    this.categoriaSelecionada = '';
    this.tituloSelecionado = '';

    inputTitulo.value = '';

    this.paginaAtual = 1;

    this.carregarSolicitacoes();
  }

  ajustarPaginaInativas() {
    if (this.solicitacoesInativas.length === 0 && this.paginaAtualInativa > 1) {
      this.paginaAtualInativa--;
    }

    this.listarInativas();
  }
}
