import {jsPDF} from 'jspdf';
import {type Data,type Employee,type Activity,dateLabel} from './data';
import {regular,bold} from './assets/pdf-fonts';
const ink='#182134',muted='#65738c',navy='#19354b',light='#f6f7f9',line='#dce2ea';
export function buildPDF(d:Data,e:Employee,rows:Activity[],from:string,to:string,generated=new Date()){
 const doc=new jsPDF({unit:'pt',format:'a4'});
 doc.addFileToVFS('DejaVuSans.ttf',regular);doc.addFont('DejaVuSans.ttf','DejaVu','normal');
 doc.addFileToVFS('DejaVuSans-Bold.ttf',bold);doc.addFont('DejaVuSans-Bold.ttf','DejaVu','bold');
 const left=62.3622,right=532.9134,width=right-left,bottom=760;
 function text(value:string,x:number,y:number,size=9,color=ink,weight:'normal'|'bold'='normal',align:'left'|'right'|'center'='left'){
  doc.setFont('DejaVu',weight);doc.setFontSize(size);doc.setTextColor(color);doc.text(value,x,y,{align});
 }
 function wrap(value:string,w:number,size=8.8,weight:'normal'|'bold'='normal'):string[]{doc.setFont('DejaVu',weight);doc.setFontSize(size);return doc.splitTextToSize(value,w)}
 function rounded(x:number,y:number,w:number,h:number,r:number,color:string){doc.setFillColor(color);doc.roundedRect(x,y,w,h,r,r,'F')}
 function rule(y:number){doc.setDrawColor(line);doc.setLineWidth(.65);doc.line(left,y,right,y)}
 text('MANUTENÇÃO  /  RELATÓRIO INDIVIDUAL',left,68.03,8.5,muted,'bold');
 text('Relatório de atividades',left,99.21,20,ink,'bold');
 const names=wrap(e.name,Math.max(180,width*.48),10.5,'bold');
 const roleX=Math.max(147.4016,Math.min(left+doc.getTextWidth(e.name)+25,left+width*.52));
 const roles=wrap(e.role||'',right-roleX,10.5);
 names.forEach((n,i)=>text(n,left,124.72+i*14,10.5,ink,'bold'));
 roles.forEach((r,i)=>text(r,roleX,124.72+i*14,10.5,muted));
 const extra=(Math.max(names.length,roles.length,1)-1)*14;
 rule(138.9+extra);text('Período',left,153.07+extra,9.5,muted);text(`${dateLabel(from)} a ${dateLabel(to)}`,116.2205,153.07+extra,9.5,ink,'bold');
 const cardY=181.4173+extra,cardH=51.0236,gap=11.3386,cardW=(width-3*gap)/4;
 const stats:[string,number][]=[['SERVIÇOS',rows.length],['CONCLUÍDOS',rows.filter(a=>a.status==='Concluída').length],['PENDENTES',rows.filter(a=>a.status==='Pendente').length],['EM ANDAMENTO',rows.filter(a=>a.status==='Em andamento').length]];
 stats.forEach(([label,value],i)=>{const x=left+i*(cardW+gap);rounded(x,cardY,cardW,cardH,8.5,light);text(label,x+11.3386,cardY+21.26,7.5,muted);text(String(value),x+11.3386,cardY+39.12,15,ink,'bold')});
 let y=266.45+extra;
 text('Atividades',left,y+2.85,11,ink,'bold');text(`${rows.length} ${rows.length===1?'registro':'registros'}`,right,y+2.85,8.5,muted,'normal','right');
 y=292.063+extra;
 const columns=[73.7008,161.5748,286.2992,447.874],cellWidths=[76,113,150,62];
 function tableHeader(){rounded(left,y,width,25.5118,5.67,navy);['Data','Máquina / local','Serviço realizado','Status'].forEach((label,i)=>text(label,columns[i],y+15.78,7.7,'#ffffff','bold'));y+=28.3465}
 function nextPage(){doc.addPage();text('MANUTENÇÃO  /  RELATÓRIO INDIVIDUAL',left,68.03,8.5,muted,'bold');text(e.name,left,94,11,ink,'bold');text(`${dateLabel(from)} a ${dateLabel(to)}`,right,94,8.5,muted,'normal','right');y=115}
 tableHeader();
 const badgeColors:Record<string,[string,string]>={'Concluída':['#e8f6ef','#27815b'],'Pendente':['#fff3df','#a57728'],'Em andamento':['#e8f0fb','#4275a3'],'Cancelada':['#e9edf2','#65738c']};
 for(const a of rows){
  const machine=d.machines.find(m=>m.id===a.machine)?.name||a.machine||'—';
  const cells=[dateLabel(a.date),machine,a.title].map((v,i)=>wrap(v,cellWidths[i]));
  const status=wrap(a.status,58,7.6,'bold');const rowH=Math.max(31.18,Math.max(...cells.map(c=>c.length),status.length)*12+17);
  // Quebra linhas muito longas em páginas, sem cortar o conteúdo.
  let offset=0;const count=Math.max(...cells.map(c=>c.length),status.length);
  while(offset<count){if(y+29>bottom){nextPage();tableHeader()}
   const fit=Math.max(1,Math.floor((bottom-y-17)/12));const length=Math.min(count-offset,fit);const h=count<=fit&&offset===0?rowH:Math.max(31.18,length*12+17);
   rounded(left,y,width,h,5.67,light);
   cells.forEach((cell,i)=>cell.slice(offset,offset+length).forEach((s,j)=>text(s,columns[i],y+19.08+j*12,8.8)));
   const visible=status.slice(offset,offset+length);if(visible.length){const colors=badgeColors[a.status]||badgeColors.Cancelada;const bh=Math.max(18.42,visible.length*11+7);rounded(columns[3],y+(h-bh)/2,68.03,bh,9.2,colors[0]);visible.forEach((s,j)=>text(s,columns[3]+34.015,y+(h-bh)/2+12.25+j*11,7.6,colors[1],'bold','center'))}
   y+=h+2.83;offset+=length;
  }
 }
 y+=25.75;
 const notes=rows.filter(a=>a.notes?.trim()).map(a=>({date:dateLabel(a.date),title:a.title,note:a.notes}));
 if(d.settings.reportNotes?.trim())notes.push({date:'',title:'',note:d.settings.reportNotes});
 if(y+65>bottom)nextPage();text('Observações relevantes',left,y+11,11,ink,'bold');y+=28.02;
 if(!notes.length)text('Nenhuma observação no período.',left,y+16,8.5,muted);
 for(const note of notes){
  const titles=wrap(note.title,width-105,9);const lines=wrap(note.note,width-34.02,8.5);let offset=0;
  do{const headerH=Math.max(17,titles.length*12+5);if(y+headerH+30>bottom)nextPage();const fit=Math.max(1,Math.floor((bottom-y-headerH-14)/12));const visible=lines.slice(offset,offset+fit);const h=Math.max(42.52,headerH+visible.length*12+12);
   rounded(left,y,width,h,7.1,light);rounded(left,y,6.24,h,3.12,navy);text(note.date,left+17.008,y+16.34,8,muted);titles.forEach((t,i)=>text(t,150.2362,y+16.34+i*12,9));visible.forEach((s,i)=>text(s,left+17.008,y+headerH+12+i*12,8.5,muted));y+=h+8.5;offset+=visible.length;
  }while(offset<lines.length);
 }
 const stamp=`${generated.toLocaleDateString('pt-BR')} • ${generated.toLocaleTimeString('pt-BR')}`;
 for(let page=1;page<=doc.getNumberOfPages();page++){doc.setPage(page);rule(776.69);text('Relatório gerado pelo setor de manutenção.',left,796.54,7.6,muted);text(`${stamp}   |   ${page}/${doc.getNumberOfPages()}`,right,796.54,7.6,muted,'normal','right')}
 return doc;
}
export function makePDF(d:Data,e:Employee,rows:Activity[],from:string,to:string){buildPDF(d,e,rows,from,to).save(`relatorio-${e.name.replaceAll(' ','-')}-${from}.pdf`)}
