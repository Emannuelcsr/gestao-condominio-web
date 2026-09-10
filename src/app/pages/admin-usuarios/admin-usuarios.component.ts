import { Component, OnInit } from '@angular/core';
import { UsuarioResponse } from '../../models/usuario-response';
import { MenuAdminComponent } from '../../components/menu-admin/menu-admin.component';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { PaginaResponse } from '../../models/pagina-response';
import { obterMensagemErro } from '../../utils/erro.utils';

@Component({
  selector: 'app-admin-usuarios',
  imports: [MenuAdminComponent, RouterLink],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css',
})
export class AdminUsuariosComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  usuarios: UsuarioResponse[] = [];
  mensagemErro = '';
  mensagemSucesso = '';
  paginaAtual = 1;
  tamanhoPagina = 5;
  totalPaginas = 0;
  primeiraPagina = true;
  ultimaPagina = false;
  totalElementos = 0;
  ordenarPor = 'nome';
  direcao = 'asc';
  carregandoUsuarios = false;
  usuarioEmProcessamento: number | null = null;

  ngOnInit(): void {
    this.listarUsuarios();
  }
  atualizarPaginacao(resposta: PaginaResponse<UsuarioResponse>) {
    this.usuarios = resposta.conteudo;
    this.totalPaginas = resposta.totalPaginas;
    this.primeiraPagina = resposta.primeiraPagina;
    this.ultimaPagina = resposta.ultimaPagina;
    this.totalElementos = resposta.totalElementos;
  }

  listarUsuarios() {
    this.carregandoUsuarios = true;
    this.usuarioService
      .listarUsuarios(
        this.paginaAtual,
        this.tamanhoPagina,
        this.ordenarPor,
        this.direcao,
      )
      .subscribe({
        next: (resposta) => {
          this.atualizarPaginacao(resposta);
          this.carregandoUsuarios = false;
        },

        error: (erro) => {
          this.mensagemErro = obterMensagemErro(erro);
          this.mensagemSucesso = '';
          this.carregandoUsuarios = false;
        },
      });
  }

  deletarUsuario(id: number) {

        const confirmar = confirm(
      'Tem certeza que deseja excluir este usuario definitivamente?',
    );

    if (!confirmar) {
      return;
    }

    this.usuarioEmProcessamento = id;

    this.usuarioService.deletarUsuario(id).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = resposta.mensagem;
        this.mensagemErro = '';

        this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id);
        if (this.usuarios.length === 0 && this.paginaAtual > 1) {
          this.paginaAtual--;
        }

        this.listarUsuarios();
        this.usuarioEmProcessamento = null;
      },

      error: (erro) => {
        this.mensagemErro = obterMensagemErro(erro);
        this.mensagemSucesso = '';
        this.usuarioEmProcessamento = null;
      },
    });
  }

  editar(id: number) {
    this.router.navigate(['/usuarios/editar', id]);
  }

  proximaPagina() {
    if (!this.ultimaPagina) {
      this.paginaAtual++;

      this.listarUsuarios();
    }
  }

  paginaAnterior() {
    if (!this.primeiraPagina) {
      this.paginaAtual--;

      this.listarUsuarios();
    }
  }

  ordenar(campo: string){

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
    this.listarUsuarios();
  }

  historico(id:number){

    this.router.navigate(['/usuarios/historico/', id]);
    
  }

}
