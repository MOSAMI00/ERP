import { useState } from 'react';
import { Download, FileText, ChevronDown } from 'lucide-react';
import ChartsRow1 from './components/ChartsRow1';
import ChartsRow2 from './components/ChartsRow2';
import KpisTable from './components/KpisTable';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import {
  govData,
  profitData,
  compareData,
  topOwnersData,
  gaugeData,
  disputeRate,
} from '../../data/analytics';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('هذا الأسبوع');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const formatCurrency = (value) => {
    if(value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if(value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border flex flex-wrap gap-4 items-center justify-between z-20 relative">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-10 pr-4 py-2 border border-brand-border rounded-lg bg-brand-content text-brand-text-primary text-sm font-bold focus:outline-none focus:border-brand-primary"
              options={[{ value: 'هذا الأسبوع', label: 'هذا الأسبوع' }, { value: 'هذا الشهر', label: 'هذا الشهر' }, { value: 'هذا العام', label: 'هذا العام' }, { value: 'مخصص', label: 'تاريخ مخصص...' }]}
            />
            <ChevronDown size={16} className="absolute left-3 top-3 text-brand-text-muted" />
          </div>

          {dateRange === 'مخصص' && (
            <div className="flex items-center space-x-2 space-x-reverse text-sm">
              <input type="date" className="border border-brand-border rounded-lg px-3 py-1.5 bg-brand-content" />
              <span className="text-brand-text-muted">إلى</span>
              <input type="date" className="border border-brand-border rounded-lg px-3 py-1.5 bg-brand-content" />
              <Button unstyled className="bg-brand-primary text-white px-4 py-1.5 rounded-lg hover:bg-brand-primary/90 transition-colors">تطبيق</Button>
            </div>
          )}
        </div>

        <div className="relative">
          <Button 
            unstyled
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-primary/90 transition-colors"
          >
            <Download size={16} />
            <span>تصدير التقرير</span>
            <ChevronDown size={14} className="ml-1" />
          </Button>
          
          {showExportOptions && (
            <div className="absolute left-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-brand-border overflow-hidden z-50">
              <Button unstyled className="w-full text-right px-4 py-2.5 text-sm font-bold hover:bg-brand-content transition-colors flex items-center">
                <FileText size={16} className="ml-2 text-brand-danger" /> PDF
              </Button>
              <Button unstyled className="w-full text-right px-4 py-2.5 text-sm font-bold hover:bg-brand-content transition-colors flex items-center border-t border-brand-border">
                <FileText size={16} className="ml-2 text-brand-success" /> CSV
              </Button>
            </div>
          )}
        </div>
      </div>

      <ChartsRow1 govData={govData} profitData={profitData} formatCurrency={formatCurrency} />
      <ChartsRow2 compareData={compareData} topOwnersData={topOwnersData} gaugeData={gaugeData} disputeRate={disputeRate} />
      <KpisTable />
    </div>
  );
}
