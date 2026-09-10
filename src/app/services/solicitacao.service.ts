import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginaResponse } from '../models/pagina-response';
import { SolicitacaoResponse } from '../models/solicitacao-response';
import { SolicitacaoMensagem } from '../models/solicitacao-mensagem-response';
import { AtualizarSolicitacaoRequest } from '../models/atualizar-solicitacao-request';
import { CriarSolicitacaoRequest } from '../models/criar-solicitacao-request';
import { Route } from '@angular/router';
import { AtualizarStatusSolicitacaoRequest } from '../models/AtualizarSolicitacaoRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiUrl}/solicitacoes`;

  listarMinhas(    categoria: string,
    status: string,
    titulo: string,
    pagina: number,
    tamanho: number,
    ordenarPor: string,
    direcao: string,
  ) {
    let params = new HttpParams();

    params = params
      .set('pagina', pagina)
      .set('tamanho', tamanho)
      .set('ordenarPor', ordenarPor)
      .set('direcao', direcao);

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    if (status) {
      params = params.set('status', status);
    }

    if (titulo) {
      params = params.set('titulo', titulo);
    }


    return this.http.get<PaginaResponse<SolicitacaoResponse>>(
      `${this.apiUrl}/minhas/paginado`,      
      { params },
    );
  }

  excluir(id: number) {
    return this.http.delete<SolicitacaoMensagem>(
      `${this.apiUrl}/${id}`,
    );
  }

  buscarMinhaPorId(id: number) {
    return this.http.get<SolicitacaoResponse>(
      `${this.apiUrl}/minhas/${id}`,
    );
  }

  atualizar(id: number, dados: AtualizarSolicitacaoRequest) {
    return this.http.put<SolicitacaoResponse>(
      `${this.apiUrl}/${id}`,
      dados,
    );
  }

  criar(dados: CriarSolicitacaoRequest) {
    return this.http.post<SolicitacaoResponse>(
    `${this.apiUrl}`,
      dados,
    );
  }

  atualizarStatus(id: number, dados: AtualizarStatusSolicitacaoRequest) {
    return this.http.patch<SolicitacaoResponse>(
      `${this.apiUrl}/${id}/status`,
      dados,
    );
  }

  listarInativas(pagina: number, tamanho: number) {
    return this.http.get<PaginaResponse<SolicitacaoResponse>>(
      `${this.apiUrl}/inativas/paginado?pagina=${pagina}&tamanho=${tamanho}`,
    );
  }

  reativar(id: number) {
    return this.http.patch<SolicitacaoMensagem>(
      `${this.apiUrl}/reativar/${id}`,
      null,
    );
  }

  exclusaoDefinitiva(id: number) {
    return this.http.delete<SolicitacaoMensagem>(
      `${this.apiUrl}/exclusao/${id}`,
    );
  }

  detalhesSolicitacoes(id: number) {
    return this.http.get<SolicitacaoResponse>(
      `${this.apiUrl}/${id}`,
    );
  }

  buscaFiltrada(
    categoria: string,
    status: string,
    titulo: string,
    pagina: number,
    tamanho: number,
    ordenarPor: string,
    direcao: string,
  ) {
    let params = new HttpParams();

    params = params
      .set('pagina', pagina)
      .set('tamanho', tamanho)
      .set('ordenarPor', ordenarPor)
      .set('direcao', direcao);

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    if (status) {
      params = params.set('status', status);
    }

    if (titulo) {
      params = params.set('titulo', titulo);
    }

    return this.http.get<PaginaResponse<SolicitacaoResponse>>(
    `${this.apiUrl}/filtros/paginado`,
      { params },
    );
  }

solicitacoesPorMorador(
  pagina: number,
  tamanho: number,
  idMorador: number,
  ordenarPor:string,
  direcao:string,
) {
  return this.http.get<PaginaResponse<SolicitacaoResponse>>(
    `${this.apiUrl}/historico/${idMorador}/paginado?pagina=${pagina}&tamanho=${tamanho}&ordenarPor=${ordenarPor}&direcao=${direcao}`,
  );
}
}
