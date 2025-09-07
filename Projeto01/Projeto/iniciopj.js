const readline = require('readline').createInterface({
    input: process.stdin, output: process.stdout
});

const alunos = []; // { nome, notas: [] }

function pergunta(q) {
    return new Promise(resolve => {
        readline.question(q, ans => resolve(ans));
    });
}

function adc_aluno(nome) {
  let nomeFormatado = nome.trim().toLowerCase(); // remove espaços e padroniza

  // verifica se já existe aluno com esse nome
  let existe_aluno = alunos.some(aluno => aluno.nome.toLowerCase() === nomeFormatado);

  if (existe_aluno) {
    console.log('esse aluno já foi cadastrado!');
    return;
  }

  // adiciona aluno
  alunos.push({ nome: nome, notas: [] });
    console.log("Aluno foi adicionado")

}

function list_alunos() {
    for(let i = 0; i < alunos.length; i++){
        console.log(alunos[i].nome);
    }
}

// função assincrona para adicionar a notas do aluno que já foi cadastrado
async function adc_nota(nomeBuscado) {
  const aluno = alunos.find(a => a.nome.toLowerCase() === nomeBuscado.toLowerCase());
  
// caso,se não encontrar o aluno,vai amostrar a mensagem e sai da função 
  if (!aluno) {
    console.log("Aluno não foi encontrado.");
    return;
  }

  const n1 = parseFloat(await pergunta("Digite a primeira nota do aluno: "));
  const n2 = parseFloat(await pergunta("Digite a segunda nota do aluno: "));
  
  if (Number.isNaN(n1) || Number.isNaN(n2)) {
      console.log("Erro na hora de colocar a nota,só aceita números ");
      return;
  }

  aluno.notas = [n1, n2];
  console.log(`Notas do ${aluno.nome} foram registradas : [${n1}, ${n2}]`);
}


async function clc_Media (){
    const nomeAluno = await pergunta("Digite o nome aluno cadastrado para calcular as duas nota: ")
    
    const aluno = alunos.find(a => a.nome.toLowerCase() === nomeAluno.toLowerCase());
    if (!aluno){
        console.log("Erro esse aluno não foi encontrado. ");
        return;
    }
    if (!aluno.notas || aluno.notas.length < 2){
        console.log(" Esse aluno ainda não tem as notas registradas");
        return;
    }
    const media_aluno = (aluno.notas[0] + aluno.notas[1]) / 2;
    console.log(`A média do ${aluno.nome} é: ${media_aluno.toFixed(2)}`);
}

function mostrarAprovados(){
    if(alunos.length === 0){
        console.log("Não ha alunos cadastrados!");
        return
    }
 console.log("---- Os Alunos Aprovados com a (média ≥ 7) ----");
 
 let algumAprovado = false;
 
 for (let aluno of alunos){
     if (aluno.notas.length === 2){
         const media = (aluno.notas[0] + aluno.notas[1]) / 2;
         
         if (media >= 7){
             console.log(`${aluno.nome} - Média: ${media.toFixed(2)}`) ;
             algumAprovado = true
         }
     }
  }
  if (!algumAprovado){
      console.log("Ainda nesse momento nenhum aluno foi aprovado ")
  }
}

function estatisticasdaTurma() {
    const medias = alunos
        .filter(a => a.notas.length === 2)
        .map(a => (a.notas[0] + a.notas[1]) / 2);

    if (!medias.length){
    console.log("Nenhum aluno com notas não foram registradas.");
    return
}
    const mediasGeral = medias.reduce((a, b) => a + b) / medias.length;

    // Mostrando a tabela da Média Geral //
    console.log("---- Estatísticas da Turma Geral ----");
    console.log(`Média Geral: ${mediasGeral.toFixed(2)}`);
    console.log(`Maior Média: ${Math.max(...medias).toFixed(2)}`);
    console.log(`Menor Média: ${Math.min(...medias).toFixed(2)}`);
}

function ordenarPorMedia() {
    const alunoscomNotas = alunos.filter(a => a.notas.length === 2);
    
    if (alunoscomNotas.length === 0) {
        console.log("Nenhum aluno tem as notas registradas no sistema.");
        return;
    }
    
    alunoscomNotas.forEach(a => {
        a.media = (a.notas[0] + a.notas[1]) / 2;
    });
    
    alunoscomNotas.sort((a, b) => b.media - a.media);
    
    console.log("---> Alunos ordenados por médias do Maior para o menor <---");
    alunoscomNotas.forEach(a => {
        console.log(`${a.nome} -- Média: ${a.media.toFixed(2)}`);
    });
}

async function remover_Aluno() {
    const nome = await pergunta("Digite o nome do aluno que deseja remover da lista: ");
    const index = alunos.findIndex(a => a.nome.toLowerCase() === nome.toLowerCase());
    
    if (index === -1) {
        console.log("Aluno não foi encontrado.");
        return;
    }
    
    alunos.splice(index, 1); // vai remove 1 aluno no índice encontrado na lista //
    console.log(`O aluno ${nome} foi removido com sucesso.`); // vai amostrar o nome do aluno que foi removido //
}

async function main() {
    let sair = false;
    while (!sair) {
        console.log("\n——— Gerenciador de Turma ———");
        console.log("1) Adicionar aluno");
        console.log("2) Listar alunos");
        console.log("3) Registrar notas");
        console.log("4) Calcular média de um aluno");
        console.log("5) Mostrar aprovados");
        console.log("6) Estatísticas da turma");
        console.log("7) Ordenar por média e listar");
        console.log("8) Remover aluno");
        console.log("9) Sair");
        const op = (await pergunta("Escolha uma opção: ")).trim();

        switch(op) {
            case '1':
                const nomeAluno = (await pergunta ("Digite o nome do aluno: "));
                adc_aluno(nomeAluno);
                break;
            case '2':
                list_alunos()
                break;
            case '3':
                const nomeNotas = await pergunta("Digite o nome do aluno para registrar as duas notas: ")
                await adc_nota(nomeNotas);
                break;
            case '4':
                await clc_Media();
                break;
            case '5':
                mostrarAprovados();
                break;
            case '6':
                estatisticasdaTurma()
                break;
            case '7':
                ordenarPorMedia();
                break;
            case '8':
                await remover_Aluno();
                break;
            case '9':
                sair = true;
                console.log("Encerrando...");
                break;
            default:
                console.log("Opção inválida.");
        }
    }
    readline.close();
}

main();