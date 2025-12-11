import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
    required?: boolean;
    direction?: 'up' | 'down';
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = "Select an option...", id, required, direction = 'down' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    const baseClasses = "relative block w-full px-4 py-3 text-left bg-slate-100/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-300/50 dark:border-slate-600/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-400 transition cursor-pointer";

    const positionClasses = direction === 'up' ? 'bottom-full mb-1' : 'mt-1';
    const animationClass = direction === 'up' ? 'animate-fade-in-up' : 'animate-fade-in-down';

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                className={`${baseClasses} flex items-center justify-between`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                id={id}
            >
                <span className={value ? 'dark:text-white text-slate-800' : 'text-slate-500 dark:text-slate-400'}>
                    {value || placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {/* Hidden native select for form submission, validation, and semantics */}
            <select name={id} value={value} required={required} className="hidden" onChange={() => {}} aria-hidden="true" tabIndex={-1}>
                <option value="" disabled>{placeholder}</option>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            
            {isOpen && (
                <ul
                    className={`absolute z-10 w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-300/50 dark:border-slate-600/50 rounded-lg shadow-xl max-h-60 overflow-y-auto ${positionClasses} ${animationClass}`}
                    style={{ animationDuration: '300ms' }}
                    role="listbox"
                    aria-labelledby={id}
                >
                    {options.map((option) => (
                        <li
                            key={option}
                            className="px-4 py-3 text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-blue-500/20 dark:hover:bg-blue-500/30 transition-colors"
                            onClick={() => handleSelect(option)}
                            role="option"
                            aria-selected={value === option}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;