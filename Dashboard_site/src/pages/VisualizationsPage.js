import React from 'react';
import { Home } from 'lucide-react';

const visualizations = [
  {
    id: 1,
    title: 'Overall Dashboard',
    src: 'https://app.powerbi.com/view?r=eyJrIjoiNzE5ODIzMjAtZTBlMC00YjcxLTgyOWYtNDI2MzM4ZTk2NzY3IiwidCI6IjZiOGI4Mjk2LWJkZmYtNGFkOC05M2FkLTg0YmNiZjM4NDJmNSJ9&pageName=b61615edebca9c009c18',
  },
  {
    id: 2,
    title: 'Scatter Chart',
    src: 'https://app.powerbi.com/view?r=eyJrIjoiNzE5ODIzMjAtZTBlMC00YjcxLTgyOWYtNDI2MzM4ZTk2NzY3IiwidCI6IjZiOGI4Mjk2LWJkZmYtNGFkOC05M2FkLTg0YmNiZjM4NDJmNSJ9&pageName=09d8b519df497a475225',
  },
  {
    id: 3,
    title: 'Stacked Column Chart',
    src: 'https://app.powerbi.com/view?r=eyJrIjoiNzE5ODIzMjAtZTBlMC00YjcxLTgyOWYtNDI2MzM4ZTk2NzY3IiwidCI6IjZiOGI4Mjk2LWJkZmYtNGFkOC05M2FkLTg0YmNiZjM4NDJmNSJ9&pageName=5acc16741b05e5035908',
  },
  {
    id: 4,
    title: 'Pie Chart',
    src: 'https://app.powerbi.com/view?r=eyJrIjoiNzE5ODIzMjAtZTBlMC00YjcxLTgyOWYtNDI2MzM4ZTk2NzY3IiwidCI6IjZiOGI4Mjk2LWJkZmYtNGFkOC05M2FkLTg0YmNiZjM4NDJmNSJ9&pageName=fa51103457a8acf3b496',
  },
  {
    id: 5,
    title: 'Line Chart',
    src: 'https://app.powerbi.com/view?r=eyJrIjoiNzE5ODIzMjAtZTBlMC00YjcxLTgyOWYtNDI2MzM4ZTk2NzY3IiwidCI6IjZiOGI4Mjk2LWJkZmYtNGFkOC05M2FkLTg0YmNiZjM4NDJmNSJ9&pageName=382a3aaf1a599bf8204f',
  },
  {
    id: 6,
    title: 'Map Visualization',
    src: 'https://app.powerbi.com/view?r=eyJrIjoiNzE5ODIzMjAtZTBlMC00YjcxLTgyOWYtNDI2MzM4ZTk2NzY3IiwidCI6IjZiOGI4Mjk2LWJkZmYtNGFkOC05M2FkLTg0YmNiZjM4NDJmNSJ9&pageName=94645965477b3bf5a4ad',
  },
  {
    id: 7,
    title: 'Bar Chart',
    src: 'https://app.powerbi.com/view?r=eyJrIjoiNzE5ODIzMjAtZTBlMC00YjcxLTgyOWYtNDI2MzM4ZTk2NzY3IiwidCI6IjZiOGI4Mjk2LWJkZmYtNGFkOC05M2FkLTg0YmNiZjM4NDJmNSJ9&pageName=4920ee1ca5ad829493dd',
  },
];

const VisualizationsPage = ({ goHome }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={goHome}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-6"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <h1 className="text-4xl font-bold text-white mb-2">Data Visualizations</h1>
        <p className="text-gray-300 mb-8">
          Explore interactive Power BI dashboards and charts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visualizations.map((viz) => (
            <div
              key={viz.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 flex flex-col hover:scale-[1.02] transition-transform duration-200"
            >
              <h2 className="text-xl font-bold text-white mb-2">{viz.title}</h2>
              <iframe
                title={viz.title}
                width="100%"
                height="300"
                src={viz.src}
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualizationsPage;
