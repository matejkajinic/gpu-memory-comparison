import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const memoryTypes = [
  {
    name: 'HBM3E',
    speed: 1200,
    latency: 10,
    pricePerGB: 40,
    keyFeatures: 'Highest bandwidth, 3D stacking, 9.6 GT/s data rate',
    applications: 'AI accelerators, high-end GPUs, HPC'
  },
  {
    name: 'GDDR6X',
    speed: 1008,
    latency: 12,
    pricePerGB: 15,
    keyFeatures: 'High bandwidth, PAM4 signaling, power-efficient',
    applications: 'High-end gaming GPUs, professional graphics'
  },
  {
    name: 'GDDR6',
    speed: 960,
    latency: 14,
    pricePerGB: 10,
    keyFeatures: 'Widely used, up to 24 Gbps per pin',
    applications: 'Gaming GPUs, mid-range to high-end graphics cards'
  },
  {
    name: 'HBM2E',
    speed: 460,
    latency: 20,
    pricePerGB: 30,
    keyFeatures: 'High bandwidth, lower power consumption',
    applications: 'Data center GPUs, AI training'
  },
  {
    name: 'GDDR5X',
    speed: 448,
    latency: 20,
    pricePerGB: 8,
    keyFeatures: 'Improved GDDR5, higher data rates',
    applications: 'Older high-end GPUs, some current mid-range cards'
  },
  {
    name: 'GDDR5',
    speed: 336,
    latency: 25,
    pricePerGB: 5,
    keyFeatures: 'Legacy standard, still widely used',
    applications: 'Budget GPUs, older graphics cards'
  },
  {
    name: 'SRAM (L1 Cache)',
    speed: 10000,
    latency: 1,
    pricePerGB: 10000,
    keyFeatures: 'Extremely fast, very low capacity',
    applications: 'CPU and GPU cache, fastest on-chip memory'
  }
];

const GPUMemoryComparison = () => {
  const [selectedTypes, setSelectedTypes] = useState(memoryTypes.map(type => type.name));
  const [metric, setMetric] = useState('speed');
  const [ballPositions, setBallPositions] = useState({});

  const toggleMemoryType = (typeName) => {
    setSelectedTypes(prev => 
      prev.includes(typeName) ? prev.filter(t => t !== typeName) : [...prev, typeName]
    );
  };

  const filteredData = memoryTypes.filter(type => selectedTypes.includes(type.name));

  const chartData = filteredData.map(type => ({
    name: type.name,
    [metric]: type[metric],
  }));

  const getMetricUnit = () => {
    switch (metric) {
      case 'speed': return 'GB/s';
      case 'latency': return 'ns';
      case 'pricePerGB': return '$/GB';
      default: return '';
    }
  };

  useEffect(() => {
    const minLatency = Math.min(...filteredData.map(type => type.latency));
    const maxLatency = Math.max(...filteredData.map(type => type.latency));
    const scaleFactor = 1;

    const intervalId = setInterval(() => {
      setBallPositions(prev => {
        const newPositions = { ...prev };
        filteredData.forEach(type => {
          const normalizedLatency = Math.log(type.latency) / Math.log(maxLatency);
          const speed = (1 - normalizedLatency) * scaleFactor + scaleFactor * 0.1;
          newPositions[type.name] = (prev[type.name] || 0) + speed;
          if (newPositions[type.name] >= 100) {
            newPositions[type.name] = 0;
          }
        });
        return newPositions;
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [filteredData]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">GPU Memory Comparison</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Memory Types:</h2>
        <div className="flex flex-wrap gap-2">
          {memoryTypes.map(type => (
            <button
              key={type.name}
              onClick={() => toggleMemoryType(type.name)}
              className={`px-3 py-1 rounded ${
                selectedTypes.includes(type.name)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Comparison Table:</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Memory Type</th>
                <th className="py-2 px-4 border">Speed (GB/s)</th>
                <th className="py-2 px-4 border">Latency (ns)</th>
                <th className="py-2 px-4 border">Price per GB ($)</th>
                <th className="py-2 px-4 border">Key Features</th>
                <th className="py-2 px-4 border">Applications</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(type => (
                <tr key={type.name}>
                  <td className="py-2 px-4 border">{type.name}</td>
                  <td className="py-2 px-4 border">{type.speed}</td>
                  <td className="py-2 px-4 border">{type.latency}</td>
                  <td className="py-2 px-4 border">{type.pricePerGB}</td>
                  <td className="py-2 px-4 border">{type.keyFeatures}</td>
                  <td className="py-2 px-4 border">{type.applications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Comparison Chart:</h2>
        <div className="mb-4">
          <label className="mr-2">Select Metric:</label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="speed">Speed</option>
            <option value="latency">Latency</option>
            <option value="pricePerGB">Price per GB</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ left: 60, right: 20, top: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis unit={getMetricUnit()} />
            <Tooltip />
            <Legend />
            <Bar dataKey={metric} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Latency Visualization:</h2>
        <p className="text-sm text-gray-600 mb-4">
          (Logarithmic scale: movement speed is inversely proportional to log(latency).)
        </p>
        <div className="space-y-4">
          {filteredData.map((type) => (
            <div key={type.name} className="flex items-center">
              <span className="w-24 text-right mr-4">{type.name}</span>
              <div className="flex-grow h-6 bg-gray-200 rounded-full relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-6 h-6 bg-blue-500 rounded-full transition-all duration-50"
                  style={{ left: `calc(${ballPositions[type.name] || 0}% - 1.5rem)` }}
                />
              </div>
              <span className="ml-4 w-16">{type.latency} ns</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Upcoming Technologies:</h2>
        <p className="text-sm text-gray-600">
          HBM4 is in development and expected to offer significant improvements:
          <ul className="list-disc list-inside mt-2">
            <li>It will use a 2048-bit interface, potentially doubling the bandwidth compared to HBM3E.</li>
            <li>Theoretical peak memory bandwidth per stack is expected to exceed 1.5 TB/s.</li>
            <li>SK Hynix and Samsung are aiming for mass production of HBM4 by 2026.</li>
          </ul>
        </p>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Note: The values for speed, latency, and price per GB are approximations and can vary based on specific implementations and market conditions.</p>
      </div>
    </div>
  );
};

export default GPUMemoryComparison;