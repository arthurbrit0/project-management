import { Authenticator } from "@aws-amplify/ui-react"
import { Amplify } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css"

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '',
        }
    }
})

const formFields = { 
    signUp: {
        username: {
            order: 1,
            placeholder: "Escolha um usuário",
            label: "Usuário",
            inputProps: {required: true},
        },
        email: {
            order: 2,
            placeholder: "Digite seu email",
            label: "Email",
            inputProps: {type: "email", required: true},
        },
        password: {
            order: 3,
            placeholder: "Digite sua senha",
            label: "Senha",
            inputProps: {type: "password", required: true},
        },
        confirm_password: {
            order: 4,
            placeholder: "Confirme sua senha",
            label: "Confirmar senha",
            inputProps: {type: "password", required: true},
        }
    }
}

const AuthProvider = ({ children }: any) => {
  return (
    <div className="mt-5">
        <Authenticator formFields={formFields}>
            {({user}: any) => 
            user ? (
                <div>{children}</div>
            ) : (
                <div>
                    <h1>Por favor, faça o login abaixo:</h1>
                </div>
            )}
        </Authenticator>
    </div>
  )
}

export default AuthProvider