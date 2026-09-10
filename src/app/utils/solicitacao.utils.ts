export function formatarStatus(status: string): string {

  switch (status) {

    case 'ABERTA':
      return 'Aberta';

    case 'EM_ANALISE':
      return 'Em análise';

    case 'EM_ANDAMENTO':
      return 'Em andamento';

    case 'AGUARDANDO_RESPOSTA':
      return 'Aguardando resposta';

    case 'CONCLUIDA':
      return 'Concluída';

    case 'CANCELADA':
      return 'Cancelada';

    default:
      return status;
  }
}


export function formatarCategoria(categoria: string): string {

  switch (categoria) {

    case 'MANUTENCAO':
      return 'Manutenção';

    case 'LIMPEZA':
      return 'Limpeza';

    case 'SEGURANCA':
      return 'Segurança';

    case 'BARULHO':
      return 'Barulho';

    case 'ILUMINACAO':
      return 'Iluminação';

    case 'VAZAMENTO':
      return 'Vazamento';

    case 'ELEVADOR':
      return 'Elevador';

    case 'AREA_COMUM':
      return 'Área comum';

    case 'OUTROS':
      return 'Outros';

    default:
      return categoria;
  }
}