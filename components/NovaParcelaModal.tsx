"use client";

import { useState } from "react";

interface NovaParcelaModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NovaParcelaModal({ onClose, onSuccess }: NovaParcelaModalProps) {
  // Estados para o formulário
  const [nome, setNome] = useState("");
  const [area, setArea] = useState("");
  const [tipoCultura, setTipoCultura] = useState("Pastagem");
  const [estadoAtual, setEstadoAtual] = useState("Repouso");
  const [submetendo, setSubmetendo] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmetendo(true);
    setErro("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/parcelas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          area: Number(area),
          tipoCultura,
          estadoAtual,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro || "Erro ao criar parcela.");
      }

      onSuccess(); // Atualiza a lista de parcelas na página principal
      onClose();   // Fecha o modal
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setSubmetendo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Nova Parcela</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">{erro}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Parcela</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              placeholder="Ex: Zona Norte - Lote A"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área (ha)</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="0.00"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cultura</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                value={tipoCultura}
                onChange={(e) => setTipoCultura(e.target.value)}
              >
                <option value="Milho">Milho</option>
                <option value="Trigo">Trigo</option>
                <option value="Pastagem">Pastagem</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
              value={estadoAtual}
              onChange={(e) => setEstadoAtual(e.target.value)}
            >
              <option value="Semeado">Semeado</option>
              <option value="Em Crescimento">Em Crescimento</option>
              <option value="Colheita">Colheita</option>
              <option value="Repouso">Repouso</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submetendo}
              className={`flex-1 px-4 py-2.5 rounded-lg text-white font-bold transition shadow-md ${
                submetendo ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submetendo ? "A guardar..." : "Guardar Parcela"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}