# Gestão da Manutenção
React, TypeScript, Tailwind CSS, componentes baseados em Radix/shadcn, Express e SQLite. Sem Supabase e sem AWS.

## Executar
Requer Node.js 24 ou superior.

1. `npm install`
2. `npm run dev` e abra http://localhost:5173.

Para a versão compilada: `npm run build`, depois `npm start` e abra http://localhost:3001.

O sistema abre diretamente, sem login. O arquivo `.env` é opcional, apenas para ajustar a porta ou o caminho do banco (`DATABASE_PATH`).

O banco é criado em `data/manutencao.sqlite`. Faça backups dessa pasta com o servidor parado. Não versione `.env` ou dados pessoais. O servidor escuta localhost; acesso em rede e HTTPS precisam de configuração própria.

## Funcionalidades
Três telas: Serviços, Funcionários e Relatório individual. O registro pede data, funcionário(s), serviço e status. Máquina/local e observação são opcionais, em texto livre. Não há cadastro de máquinas, login, dashboard ou relatório geral.

Não há registro de horas ou cálculo de tempo. O relatório individual mostra os serviços do período e permite baixar um PDF A4. Funcionários podem ser desativados e o histórico continua disponível. Registros anteriores e equipamentos já cadastrados são preservados no banco; a interface utiliza o nome dos equipamentos antigos. Alterações de serviços preservam a versão anterior no servidor.

## Verificação
`npm run build` e `npm test`.
