import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Recycle, Users, MapPin, Leaf } from "lucide-react";

export default function ImpactMetrics() {
  const { data: allUsers = [] } = useQuery({
    queryKey: ["allUsersImpact"],
    queryFn: () => base44.entities.User.list("-points", 200),
  });

  const { data: ecoPoints = [] } = useQuery({
    queryKey: ["ecoPointsCount"],
    queryFn: () => base44.entities.EcoPoint.filter({ active: true }),
  });

  const totalWeight = allUsers.reduce((s, u) => s + (u.total_weight_kg || 0), 0);
  const totalCO2 = allUsers.reduce((s, u) => s + (u.co2_saved_kg || 0), 0);
  const totalDiscards = allUsers.reduce((s, u) => s + (u.total_discards || 0), 0);

  const metrics = [
    { icon: Recycle, label: "Kg Reciclados", value: totalWeight.toFixed(1) + "kg", color: "text-primary", bg: "bg-primary/10" },
    { icon: Leaf, label: "CO₂ Evitado", value: totalCO2.toFixed(1) + "kg", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Users, label: "Usuários Ativos", value: allUsers.length, color: "text-accent", bg: "bg-accent/10" },
    { icon: MapPin, label: "Ecopontos Parceiros", value: ecoPoints.length, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {metrics.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border rounded-2xl p-5 text-center"
        >
          <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mx-auto mb-3`}>
            <m.icon className={`w-5 h-5 ${m.color}`} />
          </div>
          <p className={`font-space font-bold text-xl ${m.color}`}>{m.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
        </motion.div>
      ))}
    </div>
  );
}