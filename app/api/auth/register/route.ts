import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Utilizador from "@/models/Utilizador";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // 1. Ligar à Base de Dados
    await connectDB();

    // 2. Obter os dados enviados no corpo do pedido (body)
    const body = await req.json();
    const { nome, contacto, email, password, perfil } = body;

    // 3. Validação básica
    if (!nome || !email || !password) {
      return NextResponse.json(
        { erro: "Nome, email e password são obrigatórios." },
        { status: 400 }
      );
    }

    // 4. Verificar se o email já está registado
    const utilizadorExistente = await Utilizador.findOne({ email });
    if (utilizadorExistente) {
      return NextResponse.json(
        { erro: "Já existe um utilizador registado com este email." },
        { status: 400 }
      );
    }

    // 5. Encriptar a password (Hashing)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 6. Criar o Utilizador na Base de Dados
    const novoUtilizador = await Utilizador.create({
      nome,
      contacto,
      email,
      passwordHash, // Guardamos a hash encriptada, NUNCA a password original!
      perfil: perfil || "GESTOR", // Se não enviarem perfil, assume GESTOR por defeito
    });

    // 7. Retornar resposta de sucesso (omitindo sempre a password da resposta!)
    return NextResponse.json(
      {
        mensagem: "Utilizador criado com sucesso!",
        utilizador: {
          id: novoUtilizador._id,
          nome: novoUtilizador.nome,
          email: novoUtilizador.email,
          perfil: novoUtilizador.perfil,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registar utilizador:", error);
    return NextResponse.json(
      { erro: "Erro interno do servidor ao criar utilizador." },
      { status: 500 }
    );
  }
}