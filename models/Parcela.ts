import mongoose from "mongoose";

const ParcelaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },

  coordenadas: {
    type: String, // depois podes evoluir para GeoJSON
  },

  area: {
    type: Number,
    required: true,
  },

  estadoAtual: {
    type: String,
    enum: ["Semeado", "Em Crescimento", "Colheita", "Repouso"],
    required: true,
  },

  tipoCultura: {
    type: String,
    enum: ["Milho", "Trigo", "Pastagem", "Outro"],
    required: true,
  },

}, { timestamps: true });

export default mongoose.models.Parcela || mongoose.model("Parcela", ParcelaSchema);