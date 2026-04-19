"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NovaParcelaModal from "@/components/NovaParcelaModal";

// 1. Definir a estrutura da Parcela
interface Parcela {
  _id: string;
  nome: string;
  area: number;
  tipoCultura: string;
  estadoAtual: string;
}

export default function ParcelasPage() {
  // 2. Estados da Página
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado que controla o modal
  const router = useRouter();

  // 3. Função para ir buscar os dados à API (separada para ser reutilizada)
  async function carregarParcelas() {
    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Não tens sessão iniciada. Por favor, faz login.");
      setLoading(false);
      return;
    }

    try {
      const resposta = await fetch("/api/parcelas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Passa o token de segurança
        },
      });

      if (!resposta.ok) {
        throw new Error("Erro ao carregar as parcelas. Token pode ter expirado.");
      }

      const dados = await resposta.json();
      setParcelas(dados);
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  // 4. Executa a função automaticamente quando a página abre
  useEffect(() => {
    carregarParcelas();
  }, []);

  // 5. Ecrã de Carregamento
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-500 font-semibold animate-pulse">A carregar os teus terrenos...</p>
      </div>
    );
  }

  // 6. Ecrã de Erro / Sem acesso
  if (erro) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
          <p className="font-bold">Atenção:</p>
          <p>{erro}</p>
        </div>
      </div>
    );
  }

  // 7. Interface Principal
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestão de Terrenos</h1>
          <p className="text-gray-600 mt-1">Acompanha o estado das tuas parcelas</p>
        </div>
        
        {/* Botão para abrir o Modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
        >
          + Nova Parcela
        </button>
      </div>

      {/* Renderizar o Modal apenas quando isModalOpen for "true" */}
      {isModalOpen && (
        <NovaParcelaModal
          onClose={() => setIsModalOpen(false)} // Função que o modal usa para se fechar
          onSuccess={carregarParcelas}          // O modal avisa a página para recarregar os dados
        />
      )}

      {/* Grelha de Cartões */}
      {parcelas.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-500">Ainda não tens nenhuma parcela registada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parcelas.map((parcela) => (
            <div
              key={parcela._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition duration-200 overflow-hidden"
            >
              {/* Título do Cartão */}
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">{parcela.nome}</h2>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded-md">
                  {parcela.area} ha
                </span>
              </div>

              {/* Informações da Parcela */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Cultura:</span>
                  <span className="font-medium text-gray-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                    {parcela.tipoCultura}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Estado Atual:</span>
                  <span className="font-medium text-gray-700 bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                    {parcela.estadoAtual}
                  </span>
                </div>
              </div>

              {/* Botões de Ação (Ainda sem funcionalidade, mas prontos para o futuro) */}
              <div className="p-4 bg-gray-50 flex gap-2 border-t border-gray-100">
                <button className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition text-sm">
                  Editar
                </button>
                <button className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition text-sm">
                  Ver Histórico
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}