<<<<<<< HEAD
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Parcela from "@/models/Parcela";
import jwt from "jsonwebtoken";

// GET: Listar parcelas (Pode ser lido por todos os perfis autenticados)
export async function GET(req: Request) {
  try {
    // 1. Verificação do Token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ erro: "Não autorizado. Token em falta." }, { status: 401 });
    }

    // 2. Validar se o token é verdadeiro
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET || "fallback_secreto_apenas_para_desenvolvimento");

    // Se o token for válido, devolve as parcelas
    await connectDB();
    const parcelas = await Parcela.find();
    return NextResponse.json(parcelas, { status: 200 });

  } catch (error) {
    return NextResponse.json({ erro: "Token inválido ou expirado." }, { status: 401 });
  }
}

// POST: Criar nova parcela (Apenas o GESTOR pode fazer isto)
export async function POST(req: Request) {
  try {
    // 1. Obter o cabeçalho de Autorização
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ erro: "Não autorizado. Token em falta." }, { status: 401 });
    }

    // 2. Extrair e descodificar o Token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "fallback_secreto_apenas_para_desenvolvimento"
    ) as { id: string; perfil: string }; // Avisamos o TypeScript do formato do token

    // 3. REGRA DE NEGÓCIO (RBAC): Apenas o Gestor pode criar parcelas
    if (decoded.perfil !== "GESTOR") {
      return NextResponse.json(
        { erro: "Acesso negado. Apenas utilizadores com perfil de GESTOR podem criar parcelas." }, 
        { status: 403 }
      );
    }

    // 4. Se passou nas verificações, cria a parcela na base de dados
    await connectDB();
    const body = await req.json();
    const novaParcela = await Parcela.create(body);
    
    return NextResponse.json(novaParcela, { status: 201 });

  } catch (error) {
    console.error("Erro ao processar o POST:", error);
    return NextResponse.json({ erro: "Token inválido ou expirado." }, { status: 401 });
  }
=======
import { connectDB } from "@/lib/mongoose";
import Parcela from "@/models/Parcela";

export async function GET() {
  await connectDB();
  const parcelas = await Parcela.find();
  return Response.json(parcelas);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const nova = await Parcela.create(body);
  return Response.json(nova);
>>>>>>> 40634f34ca9e2724d782ed2a29fc61ceefcfa8f6
}