import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Utilizador from "@/models/Utilizador";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // 1. Ligar à Base de Dados
    await connectDB();

    // 2. Obter os dados do pedido
    const body = await req.json();
    const { email, password } = body;

    // 3. Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { erro: "O email e a password são obrigatórios." },
        { status: 400 }
      );
    }

    // 4. Procurar o utilizador pelo email
    // NOTA: Como no modelo pusemos `select: false` na passwordHash, 
    // temos de usar `.select('+passwordHash')` para a trazer da BD especificamente aqui.
    const utilizador = await Utilizador.findOne({ email }).select("+passwordHash");

    // Por questões de segurança, devolvemos sempre "Credenciais inválidas" 
    // para não revelar se o email existe ou não a possíveis atacantes.
    if (!utilizador) {
      return NextResponse.json(
        { erro: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // 5. Comparar a password enviada com a hash guardada na BD
    const passwordValida = await bcrypt.compare(password, utilizador.passwordHash);

    if (!passwordValida) {
      return NextResponse.json(
        { erro: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // 6. Gerar o JSON Web Token (JWT)
    // Este token vai conter o ID e o Perfil do utilizador e expira em 24 horas (1d)
    const token = jwt.sign(
      { id: utilizador._id, perfil: utilizador.perfil },
      process.env.JWT_SECRET || "fallback_secreto_apenas_para_desenvolvimento",
      { expiresIn: "1d" }
    );

    // 7. Retornar os dados do utilizador e o Token
    return NextResponse.json(
      {
        mensagem: "Login efetuado com sucesso!",
        token: token,
        utilizador: {
          id: utilizador._id,
          nome: utilizador.nome,
          email: utilizador.email,
          perfil: utilizador.perfil,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { erro: "Erro interno do servidor durante o login." },
      { status: 500 }
    );
  }
}