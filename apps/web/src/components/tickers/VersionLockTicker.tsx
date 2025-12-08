import { cn } from '@/src/lib/utils';
import { CiLock } from 'react-icons/ci';
import ToolTipComponent from '../ui/TooltipComponent';

export default function VersionLockTicker({
    className,
    iconClassName,
}: {
    className?: string;
    iconClassName?: string;
}) {
    return (
        <ToolTipComponent content="upcoming" side="top">
            <div
                className={cn(
                    'relative overflow-hidden',
                    'p-2 flex items-center gap-x-1 rounded-[8px]',
                    ' font-normal tracking-wider font-sans',
                    'text-[#FFD700]',
                    'bg-white/3 backdrop-blur-xs',
                    'border border-white/10 shadow-[0_4px_20px_rgba(255,215,0,0.1)]',
                    'before:absolute before:inset-0 before:-top-6 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-40 before:pointer-events-none',
                    'after:absolute after:inset-y-0 after:left-0 after:w-[40%] after:bg-gradient-to-r after:from-white/10 after:to-transparent after:opacity-20 after:blur-md after:pointer-events-none',
                    className,
                )}
            >
                <CiLock className={cn('size-4.5 glow-text', iconClassName)} strokeWidth="0.5" />
            </div>
        </ToolTipComponent>
    );
}
