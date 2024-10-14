"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient(); // instanciando o PrismaClient para fazer a conexão com o banco de dados
function deleteAllData(orderedFileNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const modelNames = orderedFileNames.map((fileName) => {
            const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName)); // pegando o nome do arquivo sem a extensão
            return modelName.charAt(0).toUpperCase() + modelName.slice(1); // retornando o nome do arquivo com a primeira letra maiúscula 
        });
        for (const modelName of modelNames) { // para cada nome de modelo
            const model = prisma[modelName]; // pegando o modelo do PrismaClient
            try {
                yield model.deleteMany({}); // deletando todos os dados do modelo
                console.log(`Cleared data from ${modelName}`); // logando que os dados foram deletados
            }
            catch (error) {
                console.error(`Error clearing data from ${modelName}:`, error);
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDirectory = path_1.default.join(__dirname, "seedData"); // pegando o diretório dos dados a serem inseridos no banco de dados
        console.log(dataDirectory);
        const orderedFileNames = [
            "team.json", // primeira letra dos nomes dos arquivos ficara em maiusculo para se adequar ao nome dos modelos do PrismaClient
            "project.json",
            "projectTeam.json",
            "user.json",
            "task.json",
            "attachment.json",
            "comment.json",
            "taskAssignment.json",
        ];
        yield deleteAllData(orderedFileNames); // chamando a função para deletar todos os dados do banco de dados
        for (const fileName of orderedFileNames) { // para cada nome de arquivo
            const filePath = path_1.default.join(dataDirectory, fileName); // pegando o caminho do arquivo no nosso projeto
            const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8")); // lendo o arquivo e transformando o conteúdo em um objeto JSON
            const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName)); // pegando o nome do arquivo sem a extensão
            const model = prisma[modelName]; // pegando o modelo do PrismaClient
            try {
                for (const data of jsonData) {
                    console.dir(data);
                    yield model.create({ data }); // inserimos o dado no banco de dados de acordo com o modelo que criamos com base no nome do arquivo
                }
                console.log(`Seeded ${modelName} with data from ${fileName}`);
            }
            catch (error) {
                console.error(`Error seeding data for ${modelName}:`, error);
            }
        }
    });
}
main()
    .catch((e) => console.error(e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
