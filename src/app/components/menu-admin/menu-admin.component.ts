import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioResponse } from '../../models/usuario-response';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-menu-admin',
  imports: [RouterLink],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css'
})
export class MenuAdminComponent implements OnInit{

usuario?: UsuarioResponse;
  constructor(private router:Router,private authService:AuthService, private usuarioService:UsuarioService){}

ngOnInit(): void {
      this.usuarioLogado();

  }

usuarioLogado() {
  this.usuarioService.buscarUsuarioLogado().subscribe({
    next: (response) => {
      this.usuario = response;
    },
  });
}

  sair():void{

    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
