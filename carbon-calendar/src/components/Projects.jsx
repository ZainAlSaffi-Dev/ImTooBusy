import { Github, Youtube, ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    id: 'imc',
    title: 'IMC Prosperity 3',
    blurb:
      'Statistical-arb strategies on top of cointegration and Ornstein–Uhlenbeck modelling with Black–Scholes pricing and IV-curve fitting — mean-reversion, basket and options trades, with a Python visualiser for stationarity checks and live P&L.',
    headline: '9th in Australia · 60th globally (15k teams)',
    date: 'Apr 2025',
    tech: ['Python', 'pandas', 'scikit-learn', 'Black–Scholes'],
    links: {
      github: 'https://github.com/ZainAlSaffi-Dev/imc-prosperity3',
      youtube: 'https://www.youtube.com/watch?v=D9cbJJ3oKr4',
    },
  },
  {
    id: 'blackbox',
    title: 'BlackBoxLabs',
    blurb:
      'A RoBERTa-base binary classifier trained on 239k Python pairs using contrastive regularisation and MIST adversarial augmentation, fine-tuned with cross-entropy + consistency penalties to harden against identifier renames and structural edits. Shipped as a CPU-only GitHub App.',
    headline: '98.98% acc · 0.9993 ROC-AUC · 1,000+ DL',
    date: 'Sep 2025',
    tech: ['PyTorch', 'TorchScript INT8', 'GitHub App', 'Nginx / Redis'],
    links: {
      github: 'https://github.com/BlackBox-Labs-TM',
    },
  },
  {
    id: 'valostats',
    title: 'ValoStats',
    blurb:
      'Led a 6-person build using Streamlit and the RIOT API to integrate real-time match data; feature engineering with Gradient Boosting + Logistic Regression predicted outcomes at 90% accuracy.',
    headline: 'People’s Choice — UQCS Hackathon',
    date: 'Aug 2024',
    tech: ['Streamlit', 'Gradient Boosting', 'Riot API'],
    links: {
      github: 'https://github.com/XLeling727/Valostats',
    },
  },
  {
    id: 'algojam',
    title: 'AlgoJam',
    blurb:
      'Pairs trading and ARIMA time-series analysis in a team of three to identify mispricings across simulated markets.',
    headline: '3rd place · IMC-sponsored',
    date: 'Sep 2024',
    tech: ['Python', 'ARIMA', 'Pairs Trading'],
    links: {},
  },
  {
    id: 'skindetect',
    title: 'SkinDetect',
    blurb:
      'Siamese network (ResNet-50 backbone, triplet loss) with oversampling and balanced batches to classify melanoma lesions from the ISIC-2020 dataset; validated with AUC-ROC and t-SNE.',
    headline: '90% accuracy on ISIC-2020',
    date: 'Sep 2024',
    tech: ['PyTorch', 'ResNet-50', 'Siamese'],
    links: {
      github:
        'https://github.com/ZainAlSaffi-Dev/PatternAnalysis-2024/tree/topic-recognition/recognition/Siamese-48008361',
    },
  },
];

const ProjectRow = ({ p }) => (
  <article className="grid md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-ink-300/60 group">
    {/* Date / number column */}
    <div className="md:col-span-3">
      <div className="font-mono text-[11px] uppercase tracking-widest text-ink-600">{p.date}</div>
      <div className="mt-1 text-ink-700 text-sm">{p.headline}</div>
    </div>

    {/* Content */}
    <div className="md:col-span-9">
      <h3 className="text-2xl md:text-3xl text-ink-900 tracking-tightish leading-tight">
        <span className="font-medium">{p.title}</span>
      </h3>
      <p className="mt-4 text-ink-800 text-[15px] leading-relaxed max-w-reading">{p.blurb}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <span
            key={t}
            className="text-xs font-mono text-ink-700 px-2 py-1 border border-ink-300/70 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>

      {(p.links.github || p.links.youtube) && (
        <div className="mt-5 flex items-center gap-5 text-sm">
          {p.links.github && (
            <a
              href={p.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ink-700 hover:text-accent transition-colors"
            >
              <Github size={14} /> Source
              <ArrowUpRight size={12} className="opacity-60" />
            </a>
          )}
          {p.links.youtube && (
            <a
              href={p.links.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ink-700 hover:text-accent transition-colors"
            >
              <Youtube size={14} /> Demo
              <ArrowUpRight size={12} className="opacity-60" />
            </a>
          )}
        </div>
      )}
    </div>
  </article>
);

const Projects = () => {
  return (
    <div className="px-6 py-28 md:py-36">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-baseline justify-between">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif italic font-normal text-ink-900 tracking-tightish">
              Projects.
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-600 hidden md:block">
            ({PROJECTS.length})
          </span>
        </header>

        <div className="border-t border-ink-300/60">
          {PROJECTS.map((p) => (
            <ProjectRow key={p.id} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
