import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MinhasSolicitacoesComponent } from './pages/minhas-solicitacoes/minhas-solicitacoes.component';
import { EditarSolicitacaoComponent } from './pages/editar-solicitacao/editar-solicitacao.component';
import { NovaSolicitacaoComponent } from './pages/nova-solicitacao/nova-solicitacao.component';
import { AdminComponent } from './pages/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { AdminUsuariosComponent } from './pages/admin-usuarios/admin-usuarios.component';
import { EditarUsuarioComponent } from './pages/editar-usuario/editar-usuario.component';
import { NovoMoradorComponent } from './pages/novo-morador/novo-morador.component';
import { DetalhesSolicitacaoAdminComponent } from './pages/detalhes-solicitacao-admin/detalhes-solicitacao-admin.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { moradorGuard } from './guards/moradorguard';
import { PaginaNaoEncontradaComponent } from './pages/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full'
},

{
    path:'login',
    component:LoginComponent,
    canActivate: [loginGuard]
},
{
    path:'minhas-solicitacoes',
    component:MinhasSolicitacoesComponent,
    canActivate: [moradorGuard]
},
{
    path:'solicitacoes/editar/:id',
    component:EditarSolicitacaoComponent,
    canActivate:[moradorGuard]
    
},
{
    path:'solicitacoes/nova',
    component:NovaSolicitacaoComponent,
    canActivate:[moradorGuard]
},
{
    path:'admin',
    component:AdminComponent,
    canActivate:[adminGuard]
},
{
    path:'admin/usuarios',
    component:AdminUsuariosComponent,
    canActivate:[adminGuard]
},
{
    path:'usuarios/editar/:id',
    component:EditarUsuarioComponent,
    canActivate:[adminGuard]

}
,
{
    path:'admin/novomorador',
    component:NovoMoradorComponent,
    canActivate:[adminGuard]

}
,
{
    path:'admin/solicitacoes/detalhes/:id',
    component:DetalhesSolicitacaoAdminComponent,
    canActivate:[adminGuard]

}

,
{
    path:'usuarios/historico/:id',
    component:HistoricoComponent,
    canActivate:[adminGuard]

},
{
  path: '**',
  component: PaginaNaoEncontradaComponent
}
];
