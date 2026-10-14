import React, { useState, useId } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, Flame, Scale, ArrowRight, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const StereCalculator: React.FC<{
  onSelectLength?: (len: string) => void;
}> = ({ onSelectLength }) => {
  const { addToCart } = useApp();
  const surfaceSliderId = useId();

  // Inputs
  const [surface, setSurface] = useState<number>(100);
  const [heatingType, setHeatingType] = useState<'principal' | 'appoint' | 'plaisir'>('principal');
  const [appliance, setAppliance] = useState<'poele' | 'insert' | 'cheminee' | 'chaudiere'>('poele');
  const [insulation, setInsulation] = useState<'bonne' | 'standard' | 'faible'>('standard');
  const [logLength, setLogLength] = useState<'25 cm' | '33 cm' | '50 cm'>('33 cm');

  // Calculation parameters based on French ADEME & ONF standards
  // Base consumption in kWh/m²/year
  const insulationKwh: Record<string, number> = {
    bonne: 65,     // RT2012 / RE2020
    standard: 105, // Logement moyen rénové
    faible: 155,   // Passoire thermique ou ancienne
  };

  // Heating share
  const heatingShare: Record<string, number> = {
    principal: 0.90, // 90% des besoins couverts par le bois
    appoint: 0.40,   // 40% (soirées et week-ends)
    plaisir: 0.15,   // 15% (flambées ponctuelles)
  };

  // Appliance efficiency
  const applianceEfficiency: Record<string, number> = {
    poele: 0.80,     // Poêle à bois haute performance
    insert: 0.70,    // Insert ou foyer fermé
    cheminee: 0.20,  // Foyer ouvert
    chaudiere: 0.85, // Chaudière bûches
  };

  // Calorific power of dry hardwood (<18% moisture): ~1900 kWh / stère
  const kwhPerStere = 1900;

  // Needed heat energy in kWh
  const totalHeatNeededKwh = surface * insulationKwh[insulation] * heatingShare[heatingType];
  const usefulWoodEnergyPerStere = kwhPerStere * applianceEfficiency[appliance];

  // Raw stères
  const rawSteres = totalHeatNeededKwh / usefulWoodEnergyPerStere;
  // Round to nearest 0.5 stère, minimum 1 stère
  const estimatedSteres = Math.max(1, Math.round(rawSteres * 2) / 2);

  // Apparent volume in m³ depending on cut length (Norme NF / Afnor)
  // 1 stère of 1m = 1 m³
  // 1 stère of 50cm = 0.80 m³
  // 1 stère of 33cm = 0.70 m³
  // 1 stère of 25cm = 0.60 m³
  const m3Coefficient: Record<string, number> = {
    '25 cm': 0.60,
    '33 cm': 0.70,
    '50 cm': 0.80,
  };
  const apparentVolumeM3 = Number((estimatedSteres * m3Coefficient[logLength]).toFixed(2));

  // Weight estimation for dry hardwood (< 18% moisture: ~420 kg / stère)
  const weightPerStere: Record<string, number> = {
    '25 cm': 430,
    '33 cm': 420,
    '50 cm': 410,
  };
  const totalWeightKg = Math.round(estimatedSteres * weightPerStere[logLength]);

  // Pricing comparison
  // French market comparison vs Hooden direct price (average 70 € / stère)
  const marketAvgPricePerStere = 110;
  const marketEstimatedCost = Math.round(estimatedSteres * marketAvgPricePerStere);

  // Hooden competitive price per stère in this length (average 70 € / stère)
  const hoodenPricePerStere = logLength === '50 cm' ? 63 : logLength === '25 cm' ? 74 : 70;
  const hoodenEstimatedCost = Math.round(estimatedSteres * hoodenPricePerStere);
  const estimatedSavings = Math.max(0, marketEstimatedCost - hoodenEstimatedCost);

  // Find best matching product in catalog
  const matchingProduct = PRODUCTS.find(p => p.length === logLength && p.inStock) || PRODUCTS[0];

  const handleScrollToCatalog = () => {
    if (onSelectLength) {
      onSelectLength(logLength);
    }
    const elem = document.getElementById('catalog');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="calculateur-steres" className="py-8 bg-neutral-100/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Direct, without fluff */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-mono-hooden font-bold uppercase mb-1.5">
              <Calculator className="w-3.5 h-3.5 text-amber-800" />
              Outil interactif officiel
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif-hooden tracking-tight">
              Calculateur de Stères de Chauffage
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
              Estimez précisément le volume en stères, le cubage en m³ et le poids nécessaires pour votre saison.
            </p>
          </div>

          <div className="text-xs font-mono-hooden text-neutral-500 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shrink-0">
            Bois sec &lt; 18% d'humidité
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls - Left column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 space-y-5 shadow-xs">
            {/* 1. Surface */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor={surfaceSliderId} className="text-xs font-bold text-neutral-800 uppercase font-mono-hooden">
                  1. Surface habitable chauffée au bois
                </label>
                <span className="text-base font-extrabold text-amber-900 font-mono-hooden bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  {surface} m²
                </span>
              </div>

              <input
                id={surfaceSliderId}
                aria-label="Surface habitable chauffée au bois en mètres carrés"
                type="range"
                min={30}
                max={250}
                step={5}
                value={surface}
                onChange={(e) => setSurface(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer h-2 bg-neutral-200 rounded-lg"
              />

              <div className="flex gap-1.5 mt-2.5">
                {[50, 80, 100, 130, 160, 200].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSurface(s)}
                    className={`px-2.5 py-1 text-xs rounded-md font-mono-hooden cursor-pointer transition-colors ${
                      surface === s
                        ? 'bg-amber-800 text-white font-bold'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {s}m²
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Usage type */}
            <div>
              <div className="text-xs font-bold text-neutral-800 uppercase font-mono-hooden mb-2">
                2. Rôle du chauffage au bois
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'principal', title: 'Principal', desc: '100% de la saison froide' },
                  { id: 'appoint', title: 'Appoint', desc: 'Soirées & week-ends' },
                  { id: 'plaisir', title: 'Plaisir', desc: 'Flambées occasionnelles' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHeatingType(item.id as any)}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      heatingType === item.id
                        ? 'border-amber-800 bg-amber-50/70 ring-1 ring-amber-800'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-neutral-900">{item.title}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Appliance & Insulation in two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-800 uppercase font-mono-hooden block mb-1.5">
                  3. Appareil
                </label>
                <select
                  value={appliance}
                  onChange={(e) => setAppliance(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white font-medium focus:outline-none focus:border-amber-800"
                >
                  <option value="poele">Poêle à bois moderne (Rdt ~80%)</option>
                  <option value="insert">Insert / Foyer fermé (Rdt ~70%)</option>
                  <option value="chaudiere">Chaudière à bûches (Rdt ~85%)</option>
                  <option value="cheminee">Cheminée ouverte (Rdt ~20%)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 uppercase font-mono-hooden block mb-1.5">
                  4. Isolation du logement
                </label>
                <select
                  value={insulation}
                  onChange={(e) => setInsulation(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white font-medium focus:outline-none focus:border-amber-800"
                >
                  <option value="bonne">Très bonne (RT2012 / RE2020)</option>
                  <option value="standard">Standard / Rénovée</option>
                  <option value="faible">Ancienne / Peu isolée</option>
                </select>
              </div>
            </div>

            {/* 5. Length choice */}
            <div>
              <div className="text-xs font-bold text-neutral-800 uppercase font-mono-hooden mb-2">
                5. Taille de coupe des bûches
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '25 cm', label: '25 cm', detail: 'Foyers étroits' },
                  { id: '33 cm', label: '33 cm', detail: 'Standard universel' },
                  { id: '50 cm', label: '50 cm', detail: 'Grands inserts XL' },
                ].map((len) => (
                  <button
                    key={len.id}
                    type="button"
                    onClick={() => setLogLength(len.id as any)}
                    className={`py-2 px-3 text-center rounded-lg border transition-all cursor-pointer ${
                      logLength === len.id
                        ? 'border-amber-800 bg-amber-800 text-white font-bold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{len.label}</div>
                    <div className={`text-[10px] ${logLength === len.id ? 'text-amber-100' : 'text-neutral-500'}`}>
                      {len.detail}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary - Right column */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-neutral-900 text-white rounded-2xl p-5 sm:p-6 flex-1 flex flex-col justify-between border border-neutral-800 shadow-md">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono-hooden flex items-center gap-1.5">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                    Estimation Saisonnière
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono-hooden">
                    Bûches séchées &lt; 18%
                  </span>
                </div>

                {/* Big Key Metric */}
                <div className="text-center py-2 bg-neutral-800/60 rounded-xl border border-neutral-700/60 mb-5">
                  <div className="text-xs text-neutral-400 uppercase font-mono-hooden font-bold">
                    Besoin recommandé pour l'hiver
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-amber-400 font-serif-hooden my-1">
                    {estimatedSteres} <span className="text-2xl font-sans text-neutral-300">stères</span>
                  </div>
                  <div className="text-xs text-neutral-300 font-mono-hooden">
                    soit environ <strong className="text-white">{apparentVolumeM3} m³</strong> rangés en coupe {logLength}
                  </div>
                </div>

                {/* Metric grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono-hooden">
                  <div className="p-3 bg-neutral-800/40 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-[11px] flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-neutral-400" />
                      Poids sec estimé
                    </div>
                    <div className="text-base font-bold text-white mt-1">
                      {totalWeightKg.toLocaleString('fr-FR')} kg
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      (~{weightPerStere[logLength]} kg/stère)
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-800/40 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Prix Hooden TTC
                    </div>
                    <div className="text-base font-bold text-amber-400 mt-1">
                      {hoodenEstimatedCost} € TTC
                    </div>
                    <div className="text-[10px] text-emerald-400 font-sans font-medium">
                      Économie ~{estimatedSavings} € vs marché
                    </div>
                  </div>
                </div>

                {/* Market Benchmark Box - factual & transparent */}
                <div className="p-3 rounded-lg bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-300 space-y-1 font-mono-hooden mb-5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-neutral-400">Prix moyen marché du stère :</span>
                    <span className="line-through text-neutral-400">{marketAvgPricePerStere} €</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-amber-300 font-semibold">Prix moyen Hooden :</span>
                    <strong className="text-emerald-400 font-bold">70 € / stère ({hoodenPricePerStere} € en {logLength})</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => addToCart(matchingProduct, 1)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter le lot conseillé ({matchingProduct.name.split(':')[1]?.trim() || matchingProduct.name})</span>
                </button>

                <button
                  type="button"
                  onClick={handleScrollToCatalog}
                  className="w-full py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Voir tous les lots disponibles en {logLength}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
