import { LuFile } from 'react-icons/lu';
import { PiGithubLogoFill } from 'react-icons/pi';
import ToolTipComponent from '../ui/TooltipComponent';
import { Dispatch, SetStateAction } from 'react';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import { cn } from '@/src/lib/utils';
import { RiChat4Fill } from 'react-icons/ri';
import { FaTelegramPlane } from 'react-icons/fa';

export enum SidePanelValues {
    FILE = 'FILE',
    GITHUB = 'GITHUB',
    CHAT = 'CHAT',
    PLAN = 'PLAN',
}

interface EditorSidePanel {
    setSidePanelRenderer:
        | Dispatch<SetStateAction<SidePanelValues>>
        | ((value: SidePanelValues | null) => void);
}

export default function EditorSidePanel() {
    const { collapseFileTree, setCollapseFileTree, setCollapsechat, collapseChat } =
        useCodeEditor();
    const { setCurrentState } = useSidePanelStore();
    const { currentState } = useSidePanelStore();

    const sidePanelData = [
        {
            icon: <LuFile size={20} />,
            value: SidePanelValues.FILE,
            onClick: () => handleToggleSidebar(SidePanelValues.FILE),
            tooltip: 'Files',
        },
        {
            icon: <PiGithubLogoFill size={21} />,
            value: SidePanelValues.GITHUB,
            onClick: () => handleToggleSidebar(SidePanelValues.GITHUB),
            tooltip: 'GitHub Repository',
        },
        {
            icon: <RiChat4Fill size={19} />,
            value: SidePanelValues.CHAT,
            onClick: () => {
                setCollapsechat(!collapseChat);
                // handleToggleSidebar(SidePanelValues.CHAT);
            },
            tooltip: 'Agent Sessions',
        },
        {
            icon: <FaTelegramPlane size={19} />,
            value: SidePanelValues.PLAN,
            onClick: () => {
                handleToggleSidebar(SidePanelValues.PLAN);
            },
            tooltip: 'Agent Sessions',
        },
    ];

    function handleToggleSidebar(value: SidePanelValues) {
        if (collapseFileTree) {
            if (value === currentState) {
                setCollapseFileTree(false);
            } else {
                setCurrentState(value);
            }
        } else {
            setCollapseFileTree(true);
            setCurrentState(value);
        }
    }

    return (
        <div className="h-full min-w-14 bg-dark-base border-neutral-800 border-r">
            <div className="flex flex-col gap-y-7 items-center py-5">
                {sidePanelData.map((item) => (
                    <ToolTipComponent side="right" key={item.tooltip} content={item.tooltip}>
                        <div
                            onClick={item.onClick}
                            className={cn(
                                'cursor-pointer text-light/70 hover:text-primary/70 transition-colors',
                                currentState && currentState === item.value
                                    ? 'text-primary/70'
                                    : 'text-light/70',
                            )}
                        >
                            {item.icon}
                        </div>
                    </ToolTipComponent>
                ))}
            </div>
        </div>
    );
}
