import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient(); // instanciando o PrismaClient para fazer a conexão com o banco de dados

async function deleteAllData(orderedFileNames: string[]) { // função para deletar todos os dados do banco de dados
  const modelNames = orderedFileNames.map((fileName) => {  // mapeando os nomes dos arquivos de dados
    const modelName = path.basename(fileName, path.extname(fileName)); // pegando o nome do arquivo sem a extensão
    return modelName.charAt(0).toUpperCase() + modelName.slice(1); // retornando o nome do arquivo com a primeira letra maiúscula 
  });

  for (const modelName of modelNames) { // para cada nome de modelo
    const model: any = prisma[modelName as keyof typeof prisma]; // pegando o modelo do PrismaClient
    try {
      await model.deleteMany({}); // deletando todos os dados do modelo
      console.log(`Cleared data from ${modelName}`); // logando que os dados foram deletados
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  
  const dataDirectory = path.join(__dirname, "seedData"); // pegando o diretório dos dados a serem inseridos no banco de dados

  console.log(dataDirectory)

  const orderedFileNames = [ // array com os nomes dos arquivos de dados, que serão tratados como modelos (tabelas) do banco de dados
    "team.json",             // primeira letra dos nomes dos arquivos ficara em maiusculo para se adequar ao nome dos modelos do PrismaClient
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  await deleteAllData(orderedFileNames); // chamando a função para deletar todos os dados do banco de dados

  for (const fileName of orderedFileNames) { // para cada nome de arquivo
    const filePath = path.join(dataDirectory, fileName); // pegando o caminho do arquivo no nosso projeto
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8")); // lendo o arquivo e transformando o conteúdo em um objeto JSON
    const modelName = path.basename(fileName, path.extname(fileName)); // pegando o nome do arquivo sem a extensão
    const model: any = prisma[modelName as keyof typeof prisma]; // pegando o modelo do PrismaClient

    try {
      for (const data of jsonData) { 
        console.dir(data)
        await model.create({ data }); // inserimos o dado no banco de dados de acordo com o modelo que criamos com base no nome do arquivo
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());