import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { jwtDecode } from 'jwt-decode';
import { DadosToken } from '../models/dados-token';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http:HttpClient) { }

login(dados:LoginRequest){

  return this.http.post<LoginResponse>(`${this.apiUrl}/login`,dados);
}

logout():void{
  localStorage.removeItem('token');
}


estaAutenticado(): boolean {

  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {

    const dadosToken = jwtDecode(token);

    const agora = Math.floor(Date.now() / 1000);

    if (dadosToken.exp && dadosToken.exp > agora) {
      return true;
    }

    localStorage.removeItem('token');

    return false;

  } catch {

    localStorage.removeItem('token');

    return false;
  }
}




obterPerfil(): string | null {

  if (!this.estaAutenticado()) {
    return null;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {

    const dadosToken = jwtDecode<DadosToken>(token);

    return dadosToken.perfil;

  } catch {

    localStorage.removeItem('token');

    return null;
  }
}

}
