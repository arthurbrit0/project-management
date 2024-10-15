"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
console.log("Teste");
/* IMPORTS DE ROTA */
/* CONFIG */
dotenv_1.default.config(); // carregando as variaveis de ambiente 
const app = (0, express_1.default)(); // instanciando o express na variavel app
/* MIDDLEWARES */
app.use(express_1.default.json()); // habilitando o express para receber json                                                                                       
app.use((0, helmet_1.default)()); // configurando o helmet, que define varios headers de segurança
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" })); // configurando o helmet para permitir requisições de origens diferentes
app.use((0, morgan_1.default)("common")); // configurando o morgan para logar as requisições no console
app.use(body_parser_1.default.json()); // configurando o body-parser para receber requisições em json                                  
app.use(body_parser_1.default.urlencoded({ extended: false })); // configurando o body-parser para receber requisições em urlencoded
app.use((0, cors_1.default)()); // configurando o cors para permitir requisições de origens diferentes
/* ROTAS */
app.get('/', (req, res) => {
    res.send("Essa é a rota home!");
});
app.use('/projects', projectRoutes_1.default);
app.use('/tasks', taskRoutes_1.default);
app.use('/search', searchRoutes_1.default);
app.use('/users', userRoutes_1.default);
/* INICIALIZAÇÃO DO SERVIDOR */
const port = process.env.PORT || 3000; // definindo a porta do servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`); // iniciando o servidor
});
