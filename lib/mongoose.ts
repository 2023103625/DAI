import mongoose from "mongoose";

<<<<<<< HEAD
export async function connectDB() {
  // Se já estiver ligado, não faz nada
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // Vai buscar a variável ao ficheiro .env.local
  const uri = process.env.MONGODB_URI;

  // Se a variável não existir, dá um erro claro logo no início!
  if (!uri) {
    throw new Error("Por favor, define a variável MONGODB_URI no ficheiro .env.local");
  }

  // Liga à base de dados
  await mongoose.connect(uri);
=======
const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
>>>>>>> 40634f34ca9e2724d782ed2a29fc61ceefcfa8f6
}