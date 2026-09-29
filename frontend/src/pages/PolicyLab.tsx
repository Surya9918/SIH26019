import { useState, useEffect, useRef, useCallback } from 'react';
import { FlaskConical, Play, Save, Activity, Settings2, Download } from 'lucide-react';
import { fetchApi } from '../services/api';

export function PolicyLab() {
  const [params, setParams] = useState({
    urban_growth_rate: 4.0,
    buffer_zone_km: 5.0,
    tod_density_factor: 1.5,
  });
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSimulation = useCallback(async (currentParams: typeof params) => {
    setRunning(true);
    try {
      const res = await fetchApi<any>('/scenarios/simulate', {
        method: 'POST',
        body: JSON.stringify({
          parameters: currentParams,
          state: "Telangana",
          district: "Rangareddy",
          baseline_year: 2026,
          target_year: 2035
        })
      });
      if (res.simulation && res.simulation.status !== 'unavailable') {
        setResults(res.simulation);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRunning(false);
    }
  }, []);

  // Auto-run simulation on mount and whenever params change (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSimulation(params);
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [params, runSimulation]);

  const handleSimulate = () => runSimulation(params);

  const handleSaveConfiguration = async () => {
    if (!results) {
      alert("Please run a simulation first before saving.");
      return;
    }
    const title = window.prompt("Enter scenario title:");
    if (!title) return;
    const description = window.prompt("Enter description (optional):") || "";
    
    try {
      const res = await fetchApi<any>('/scenarios/save', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          state: "Telangana",
          district: "Rangareddy",
          baseline_year: 2026,
          target_year: 2035,
          parameters: params,
          results: results
        })
      });
      if (res.status === 'SUCCESS') {
        alert("Configuration saved successfully!");
      } else {
        alert("Failed to save configuration.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving configuration.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Policy Innovation Lab</h1>
          <p className="text-slate-500 max-w-3xl leading-relaxed">
            Stochastic simulation and econometric modeling for predictive land use governance and policy impact assessment.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSaveConfiguration} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-gov-blue" />
              <h3 className="font-bold text-slate-800">Simulation Parameters</h3>
            </div>
            
            <div className="p-5 space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Urban Growth Rate</label>
                  <span className="text-sm font-mono text-gov-blue">{params.urban_growth_rate.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" max="10.0" step="0.1" 
                  value={params.urban_growth_rate}
                  onChange={e => setParams({...params, urban_growth_rate: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-blue"
                />
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Projected annual population and built-up area expansion. Higher rates increase agricultural land conversion pressure.
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Buffer Zone</label>
                  <span className="text-sm font-mono text-gov-blue">{params.buffer_zone_km.toFixed(1)} km</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" max="20.0" step="0.5" 
                  value={params.buffer_zone_km}
                  onChange={e => setParams({...params, buffer_zone_km: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-blue"
                />
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Regulated restriction radius around protected water bodies and eco-sensitive zones.
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">TOD Density Factor</label>
                  <span className="text-sm font-mono text-gov-blue">{params.tod_density_factor.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" max="5.0" step="0.1" 
                  value={params.tod_density_factor}
                  onChange={e => setParams({...params, tod_density_factor: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-blue"
                />
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Transit-Oriented Development FAR/FSI multiplier along major transit corridors.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={handleSimulate}
                  disabled={running}
                  className="w-full py-3 bg-gov-blue hover:bg-gov-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  {running ? <Activity className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                  {running ? 'Executing Simulation...' : 'Run Simulation'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {results ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gov-green mb-1 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-gov-green animate-pulse"></span>
                    Simulation Complete
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Projected Impact Analysis</h3>
                </div>
                <button className="w-10 h-10 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-gov-blue transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Food Security Risk</div>
                  <div className="text-3xl font-black text-slate-900">{results.policy_alternative?.food_production_risk_index?.toFixed(1) || 0}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1">Lower is better</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Agri-Land Conserved</div>
                  <div className="text-3xl font-black text-gov-green">
                    {results.net_policy_benefits?.prime_agricultural_land_conserved_sqkm?.toFixed(1) || 0} sqkm
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-1">Prevented conversion loss</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Generated Insights</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-slate-700 bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                    <div className="mt-0.5 text-gov-blue"><FlaskConical className="w-4 h-4" /></div>
                    {results.policy_recommendation}
                  </li>
                  <li className="flex gap-3 text-sm text-slate-700 bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                    <div className="mt-0.5 text-gov-green"><Activity className="w-4 h-4" /></div>
                    CO2 Emissions Avoided: {results.net_policy_benefits?.carbon_emission_avoidance_mt_co2e} MT CO2e
                  </li>
                  <li className="flex gap-3 text-sm text-slate-700 bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                    <div className="mt-0.5 text-gov-saffron"><Save className="w-4 h-4" /></div>
                    Infrastructure Capital Savings: ₹{results.net_policy_benefits?.infrastructure_capital_savings_cr_inr} Crores
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50/50 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-300">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Ready for Simulation</h3>
              <p className="text-sm max-w-sm leading-relaxed">
                Adjust the parameters on the left and run the simulation to project econometric and spatial impacts on land governance.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
