import { UsuarioResponse } from "./usuario-response";

export interface SolicitacaoResponse {

    id:number;
    titulo:string;
    descricao:string;
    ativo:boolean;
    categoria:string;
    status:string;
    dataCriacao:string;
    dataAtualizacao:string;
    dataConclusao:string|null;

    usuario: UsuarioResponse;


}