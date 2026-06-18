import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export default function StatusTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border p-2 flex overflow-x-auto whitespace-nowrap scrollbar-hide">
      {tabs.map(tab => (
        <Button
          unstyled
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 space-x-reverse px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            activeTab === tab.id 
              ? 'bg-brand-primary text-white shadow-md' 
              : 'text-brand-text-muted hover:bg-brand-content'
          }`}
        >
          <span>{tab.label}</span>
          <Badge unstyled className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-brand-content text-brand-text-primary'}`}>
            {tab.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
