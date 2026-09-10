import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioMensagem } from '../models/UsuarioMensagem';
import { AtualizarUsuarioRequest } from '../models/atualizarUsuarioRequest';
import { UsuarioResponse } from '../models/usuario-request';
import { CriarUsuarioRequest } from '../models/CriarUsuarioRequest';
import { PaginaResponse } from '../models/pagina-response';
import { SolicitacaoResponse } from '../models/solicitacao-response';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

listarUsuarios(
  pagina: number,
  tamanho: number,
  ordenarPor: string,
  direcao: string
) {
  return this.http.get<PaginaResponse<UsuarioResponse>>(
    `${this.apiUrl}?pagina=${pagina}&tamanho=${tamanho}&ordenarPor=${ordenarPor}&direcao=${direcao}`
  );
}
        

  deletarUsuario(id: number) {
    return this.http.delete<UsuarioMensagem>(`${this.apiUrl}/${id}`);
  }

  atualizarUsuario(id: number, dados: AtualizarUsuarioRequest) {
    return this.http.put<UsuarioResponse>(
      `${this.apiUrl}/${id}`,
      dados,
    );
  }

  buscarUsuario(id: number) {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  novoMorador(dados: CriarUsuarioRequest) {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}`, dados);
  }


  buscarUsuarioLogado(){

     return this.http.get<UsuarioResponse>(`${this.apiUrl}/me`);
  }



}