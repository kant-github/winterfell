import { Select, SelectTrigger, SelectContent, SelectItem } from '@/src/components/ui/select';
import { EXECUTOR } from '@winterfell/types';
import { cn } from '@/src/lib/utils';
import { GoInfinity } from 'react-icons/go';
import { FaTelegramPlane } from 'react-icons/fa';

interface ModelSelectProps {
    value: EXECUTOR;
    onChange: (value: EXECUTOR) => void;
}

export default function ExecutorSelect({ value, onChange }: ModelSelectProps) {
    return (
        <Select value={value} onValueChange={(val) => onChange(val as EXECUTOR)}>
            <SelectTrigger
                className={cn(
                    'w-12 h-7 text-[10px] flex items-center justify-center gap-1 rounded-lg border-none outline-none focus:outline-none',
                    'px-1 py-0 min-h-0 h-7 !h-7 !px-1 !py-0',
                    value === EXECUTOR.AGENTIC
                        ? 'text-[#6c44fc] hover:bg-[#6c44fc30] bg-[#6c44fc30] border [&>svg]:!text-[#6c44fc] focus:outline-none outline-none selection:outline-none'
                        : 'bg-[#FFBF0030] hover:bg-[#FFBF0030] text-[#FFBF00] border [&>svg]:!text-[#FFBF00] focus:outline-none outline-none selection:outline-none',
                )}
            >
                <div className="flex items-center text-[12px]">
                    {value === EXECUTOR.AGENTIC ? (
                        <GoInfinity color="#6c44fc" size={14} />
                    ) : (
                        <FaTelegramPlane color="#FFBF00" size={14} />
                    )}
                </div>
            </SelectTrigger>

            <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                <SelectItem value="agentic" className="text-xs flex items-center gap-2">
                    <GoInfinity />
                    Agentic
                </SelectItem>

                <SelectItem value="claude" className="text-xs flex items-center gap-2">
                    <FaTelegramPlane />
                    Pan
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
