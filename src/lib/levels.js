export const LEVELS = [
  { name: "Bronze", min: 0, color: "from-amber-700 to-amber-500", badge: "🥉", textColor: "text-amber-600", bgColor: "bg-amber-100", borderColor: "border-amber-300" },
  { name: "Prata", min: 500, color: "from-gray-400 to-gray-300", badge: "🥈", textColor: "text-gray-500", bgColor: "bg-gray-100", borderColor: "border-gray-300" },
  { name: "Ouro", min: 1500, color: "from-yellow-500 to-yellow-300", badge: "🥇", textColor: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-300" },
  { name: "Platina", min: 3500, color: "from-cyan-500 to-blue-400", badge: "💎", textColor: "text-cyan-600", bgColor: "bg-cyan-50", borderColor: "border-cyan-300" },
  { name: "Eco Master", min: 7000, color: "from-emerald-500 to-teal-400", badge: "🌍", textColor: "text-emerald-600", bgColor: "bg-emerald-50", borderColor: "border-emerald-300" },
];

export function getLevelInfo(points = 0) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.min) level = l;
  }
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const progress = nextLevel 
    ? ((points - level.min) / (nextLevel.min - level.min)) * 100 
    : 100;
  return { ...level, progress, nextLevel, points };
}