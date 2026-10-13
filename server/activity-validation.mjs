export function validateActivity(a){
 if(typeof a.title!=='string'||!a.title.trim())throw Error('Informe o serviço realizado.');
 if(!Array.isArray(a.employees)||!a.employees.length||a.employees.some(id=>typeof id!=='string'||!id))throw Error('Selecione ao menos um funcionário.');
 if(typeof a.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(a.date)||!Number.isFinite(Date.parse(a.date+'T12:00:00Z'))||new Date(a.date+'T12:00:00Z').toISOString().slice(0,10)!==a.date)throw Error('Informe uma data válida para o serviço.');
 if(!['Pendente','Em andamento','Concluída','Cancelada'].includes(a.status))throw Error('Selecione um status válido para o serviço.');
}
