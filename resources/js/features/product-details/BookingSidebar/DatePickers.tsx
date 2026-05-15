import { useState, useEffect, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parseISO, eachDayOfInterval, isBefore, startOfDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarDays, ChevronDown } from 'lucide-react';
import axios from 'axios';
import 'react-day-picker/dist/style.css';

interface UnavailableRange {
  from: string;
  to: string;
  reason: string;
}

interface DatePickersProps {
  productId: number | string;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  days: number;
  notes?: string;
  setNotes?: (v: string) => void;
}

type PickerMode = 'start' | 'end' | null;

export function DatePickers({
  productId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  days,
}: DatePickersProps) {
  const [unavailableRanges, setUnavailableRanges] = useState<UnavailableRange[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [openPicker, setOpenPicker] = useState<PickerMode>(null);
  const [month, setMonth] = useState<Date>(new Date());

  // Fetch unavailable dates from the backend
  useEffect(() => {
    if (!productId) return;
    setLoadingDates(true);
    axios
      .get(`/product/${productId}/unavailable-dates`)
      .then((res) => setUnavailableRanges(res.data.unavailable ?? []))
      .catch(() => setUnavailableRanges([]))
      .finally(() => setLoadingDates(false));
  }, [productId]);

  // Build a flat Set of disabled date strings for fast lookup
  const disabledDates: Date[] = unavailableRanges.flatMap((range) => {
    try {
      const from = parseISO(range.from);
      const to = parseISO(range.to);
      return eachDayOfInterval({ start: from, end: to });
    } catch {
      return [];
    }
  });

  const today = startOfDay(new Date());

  const isDateUnavailable = useCallback(
    (date: Date): boolean => {
      if (isBefore(date, today)) return true;
      return disabledDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      );
    },
    [disabledDates, today]
  );

  // Check if any date within a range is unavailable
  const rangeHasConflict = useCallback(
    (from: Date, to: Date): boolean => {
      return eachDayOfInterval({ start: from, end: to }).some(isDateUnavailable);
    },
    [isDateUnavailable]
  );

  const selectedStart = startDate ? parseISO(startDate) : undefined;
  const selectedEnd = endDate ? parseISO(endDate) : undefined;

  const handleStartSelect = (date: Date | undefined) => {
    if (!date) return;
    const formatted = format(date, 'yyyy-MM-dd');
    setStartDate(formatted);
    // Clear end if it's now before start or has conflict
    if (selectedEnd && (isBefore(selectedEnd, date) || rangeHasConflict(date, selectedEnd))) {
      setEndDate('');
    }
    setOpenPicker('end');
  };

  const handleEndSelect = (date: Date | undefined) => {
    if (!date) return;
    if (selectedStart && rangeHasConflict(selectedStart, date)) return; // block conflicting range
    setEndDate(format(date, 'yyyy-MM-dd'));
    setOpenPicker(null);
  };

  const modifiers = {
    unavailable: disabledDates,
    ...(selectedStart && selectedEnd
      ? { selected_range: { from: selectedStart, to: selectedEnd } }
      : {}),
  };

  const modifiersClassNames = {
    unavailable: 'rdp-day-unavailable',
    selected_range: 'rdp-day-range',
  };

  const togglePicker = (picker: PickerMode) => {
    setOpenPicker((prev) => (prev === picker ? null : picker));
    if (picker === 'start' && selectedStart) setMonth(selectedStart);
    if (picker === 'end' && (selectedEnd || selectedStart))
      setMonth(selectedEnd ?? selectedStart ?? new Date());
  };

  return (
    <div className="border-t border-border pt-4 space-y-3">
      {/* Custom CSS for react-day-picker unavailable day styling */}
      <style>{`
        .rdp-day-unavailable {
          background-color: #fee2e2 !important;
          color: #dc2626 !important;
          text-decoration: line-through;
          cursor: not-allowed !important;
          border-radius: 4px;
        }
        .rdp-day-unavailable:hover {
          background-color: #fee2e2 !important;
        }
        .rdp-day-range {
          background-color: #dbeafe;
        }
        .rdp {
          --rdp-accent-color: var(--color-primary, #2563eb);
          margin: 0;
        }
        .rdp-caption_label { font-size: 0.9rem; font-weight: 600; }
        .rdp-head_cell { font-size: 0.75rem; color: #6b7280; }
        .rdp-day { font-size: 0.85rem; border-radius: 6px; }
      `}</style>

      {/* Start Date */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">📅 تاريخ الاستلام</label>
        <button
          type="button"
          onClick={() => togglePicker('start')}
          className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary flex items-center justify-between text-sm"
        >
          <span className={startDate ? 'text-gray-800' : 'text-gray-400'}>
            {startDate
              ? format(parseISO(startDate), 'eeee d MMMM yyyy', { locale: ar })
              : 'اختر تاريخ الاستلام'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${openPicker === 'start' ? 'rotate-180' : ''}`}
          />
        </button>

        {openPicker === 'start' && (
          <div className="border border-border rounded-lg bg-white shadow-lg p-2 z-10">
            {loadingDates ? (
              <div className="py-8 text-center text-sm text-gray-500">
                جارٍ تحميل التواريخ المتاحة...
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-2 px-2">
                  الأيام
                  <span className="inline-block w-3 h-3 rounded-sm bg-red-100 border border-red-300 align-middle mx-1" />
                  محجوزة / غير متاحة
                </p>
                <DayPicker
                  mode="single"
                  selected={selectedStart}
                  onSelect={handleStartSelect}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={(date) => isDateUnavailable(date)}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  fromDate={today}
                  locale={ar}
                  dir="rtl"
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* End Date */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">📅 تاريخ الإرجاع</label>
        <button
          type="button"
          onClick={() => togglePicker('end')}
          disabled={!startDate}
          className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary flex items-center justify-between text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={endDate ? 'text-gray-800' : 'text-gray-400'}>
            {endDate
              ? format(parseISO(endDate), 'eeee d MMMM yyyy', { locale: ar })
              : 'اختر تاريخ الإرجاع'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${openPicker === 'end' ? 'rotate-180' : ''}`}
          />
        </button>

        {openPicker === 'end' && (
          <div className="border border-border rounded-lg bg-white shadow-lg p-2 z-10">
            {loadingDates ? (
              <div className="py-8 text-center text-sm text-gray-500">
                جارٍ تحميل التواريخ المتاحة...
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-2 px-2">
                  الأيام
                  <span className="inline-block w-3 h-3 rounded-sm bg-red-100 border border-red-300 align-middle mx-1" />
                  محجوزة / غير متاحة
                </p>
                <DayPicker
                  mode="single"
                  selected={selectedEnd}
                  onSelect={handleEndSelect}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={(date) =>
                    isDateUnavailable(date) ||
                    (selectedStart ? isBefore(date, selectedStart) : false)
                  }
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  fromDate={selectedStart ?? today}
                  locale={ar}
                  dir="rtl"
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Duration summary */}
      {days > 0 && (
        <div className="bg-muted rounded-lg p-3 text-sm flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary shrink-0" />
          <span>
            المدة:{' '}
            <span className="font-semibold">
              {days} {days === 1 ? 'يوم' : 'أيام'}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
