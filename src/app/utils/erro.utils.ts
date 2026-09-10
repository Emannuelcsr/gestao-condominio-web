import { HttpErrorResponse } from "@angular/common/http";


export function obterMensagemErro(erro:HttpErrorResponse):string{

    if(erro.error?.mensagens?.length > 0){

        return erro.error.mensagens[0];

    }
    
    return 'Ocorreu um erro inesperado.';

}