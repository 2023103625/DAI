import mongoose, { Schema, Document } from "mongoose";

// 1. Definição da Interface TypeScript (Ajuda o VS Code a dar autocomplete)
export interface IUtilizador extends Document {
  nome: string;
  contacto?: string;
  email: string;
  passwordHash: string;
  perfil: "GESTOR" | "TRABALHADOR" | "TECNICO";
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Criação do Schema do Mongoose
const UtilizadorSchema = new Schema<IUtilizador>(
  {
    nome: {
      type: String,
      required: [true, "O nome é obrigatório."],
    },
    contacto: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "O email é obrigatório."],
      unique: true, // Garante que não existem dois utilizadores com o mesmo email
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor, insira um email válido.",
      ],
    },
    passwordHash: {
      type: String,
      required: [true, "A password é obrigatória."],
      select: false, // Garante que a password não é enviada acidentalmente nos pedidos GET da API
    },
    perfil: {
      type: String,
      enum: ["GESTOR", "TRABALHADOR", "TECNICO"],
      required: [true, "O perfil de utilizador é obrigatório."],
      default: "TRABALHADOR", // Perfil padrão por segurança
    },
    ativo: {
      type: Boolean,
      default: true, // Permite "desativar" contas de trabalhadores que saiam da exploração em vez de apagar
    },
  },
  { 
    timestamps: true // Cria automaticamente os campos createdAt e updatedAt
  }
);

// 3. Exportar o Modelo (A condição 'mongoose.models.Utilizador' evita erros no Next.js durante o hot-reload)
export default mongoose.models.Utilizador || mongoose.model<IUtilizador>("Utilizador", UtilizadorSchema);