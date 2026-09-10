import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioResponse } from '../../models/usuario-response';

@Component({
  selector: 'app-menu-morador',
  imports: [RouterLink],
  templateUrl: './menu-morador.component.html',
  styleUrl: './menu-morador.component.css'
})
export class MenuMoradorComponent implements OnInit {

  usuario!: UsuarioResponse;
  constructor(private router:Router,private authService:AuthService, private usuarioService:UsuarioService){}
  ngOnInit(): void {
    this.usuarioLogado()
  }

  sair(){
    this.authService.logout();

    this.router.navigate(['/login'])
  }


usuarioLogado() {
  this.usuarioService.buscarUsuarioLogado().subscribe({
    next: (response) => {

      this.usuario = response;
    },
  });
}



}
