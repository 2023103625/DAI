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
}