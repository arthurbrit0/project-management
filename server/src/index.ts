import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";

console.log("Teste")

/* IMPORTS DE ROTA */

/* CONFIG */
dotenv.config();                                                        // carregando as variaveis de ambiente 
const app = express();                                                  // instanciando o express na variavel app

/* MIDDLEWARES */

app.use(express.json());                                                // habilitando o express para receber json                                                                                       
app.use(helmet());                                                      // configurando o helmet, que define varios headers de segurança
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));  // configurando o helmet para permitir requisições de origens diferentes
app.use(morgan("common"));                                              // configurando o morgan para logar as requisições no console
app.use(bodyParser.json());                                             // configurando o body-parser para receber requisições em json                                  
app.use(bodyParser.urlencoded({ extended: false }));                    // configurando o body-parser para receber requisições em urlencoded
app.use(cors());                                                        // configurando o cors para permitir requisições de origens diferentes

/* ROTAS */

app.get('/', (req, res) => {                                            // rota home de teste para verificar se o servidor está rodando                           
    res.send("Essa é a rota home!")
})

app.use('/projects', projectRoutes)
app.use('/tasks', taskRoutes)
app.use('/search', searchRoutes)
app.use('/users', userRoutes)
app.use('/teams', teamRoutes)

/* ROTA PARA COGNITO */


/* INICIALIZAÇÃO DO SERVIDOR */

const port = Number(process.env.PORT) || 3000;                                  // definindo a porta do servidor
app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${port}`)                            // iniciando o servidor
})

