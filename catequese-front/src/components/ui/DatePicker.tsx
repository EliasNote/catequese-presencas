import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedValue = value && value.length === 10 ? parse(value, 'dd/MM/yyyy', new Date()) : null;
  const selectedDate = parsedValue && isValid(parsedValue) ? parsedValue : null;

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate?.getTime()]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const handleDateClick = (date: Date) => {
    onChange(format(date, 'dd/MM/yyyy'));
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length >= 5) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    } else if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    onChange(val);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF200]"
          placeholder="DD/MM/AAAA"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-md border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="rounded-full p-1 hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-medium capitalize text-slate-900">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </div>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="rounded-full p-1 hover:bg-slate-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
              <div key={i} className="w-8 py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: days[0].getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 py-1" />
            ))}
            {days.map(day => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                    isSelected
                      ? "bg-[#FFF200] text-slate-900 hover:bg-[#E6D900]"
                      : isToday
                      ? "bg-slate-100 font-bold text-yellow-600 hover:bg-slate-200"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
