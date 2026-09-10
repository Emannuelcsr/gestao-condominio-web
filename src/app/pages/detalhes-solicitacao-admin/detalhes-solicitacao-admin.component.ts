import { Component, OnInit } from '@angular/core';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SolicitacaoResponse } from '../../models/solicitacao-response';
import { MenuAdminComponent } from "../../components/menu-admin/menu-admin.component";
import { DatePipe } from '@angular/common';
import { obterMensagemErro } from '../../utils/erro.utils';


@Component({
  selector: 'app-detalhes-solicitacao-admin',
  imports: [MenuAdminComponent,DatePipe,RouterLink],
  templateUrl: './detalhes-solicitacao-admin.component.html',
  styleUrl: './detalhes-solicitacao-admin.component.css'
})
export class DetalhesSolicitacaoAdminComponent implements OnInit {

  solicitacoes!: SolicitacaoResponse;
  mensagemErro = '';


  constructor(private route: ActivatedRoute,private solicitacao:SolicitacaoService){}
  id!: number;
  
  ngOnInit(): void {


     const idParametro = this.route.snapshot.paramMap.get('id');

     console.log(idParametro)

    if (idParametro) {
      this.id = Number(idParametro);
      this.detalhesSolicitacoes(this.id);
    }
  }


  detalhesSolicitacoes(id:number){

    this.solicitacao.detalhesSolicitacoes(id).subscribe({

      next:(resposta)=>{

        this.solicitacoes = resposta;
        console.log(resposta);

      },
      error:(erro)=>{

        this.mensagemErro = obterMensagemErro(erro);

      }

    });


    }
  }
  