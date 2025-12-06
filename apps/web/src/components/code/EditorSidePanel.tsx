import { LuFile } from 'react-icons/lu';
import { PiGithubLogoFill } from 'react-icons/pi';
import ToolTipComponent from '../ui/TooltipComponent';
import { Dispatch, SetStateAction } from 'react';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import { cn } from '@/src/lib/utils';
import { RiChat4Fill } from 'react-icons/ri';
import { FaTelegramPlane } from 'react-icons/fa';
import WinterfellChat from '../ui/svg/winterfell-chat';

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
    const { setCollapseFileTree, setCollapsechat, collapseChat } = useCodeEditor();
    const { currentState, setCurrentState } = useSidePanelStore();

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
            icon: <WinterfellChat size={30} />,
            value: SidePanelValues.CHAT,
            onClick: () => setCollapsechat(!collapseChat),
            tooltip: 'Agent Sessions',
        },
        {
            icon: <FaTelegramPlane size={19} />,
            value: SidePanelValues.PLAN,
            onClick: () => {
                handleToggleSidebar(SidePanelValues.PLAN);
            },
            tooltip: 'Plans',
        },
    ];

    function handleToggleSidebar(value: SidePanelValues) {
        setCurrentState(value);
        switch (value) {
            case SidePanelValues.PLAN: {
                setCollapseFileTree(false);
                break;
            }
            case SidePanelValues.FILE: {
                setCollapseFileTree(true);
                break;
            }
            default: {
                setCollapseFileTree(true);
            }
        }
    }

    return (
        <div className="h-full min-w-14 bg-[#101112] border-neutral-800 border-r">
            <div className="flex flex-col gap-y-7 items-center py-5">
                {sidePanelData.map((item, index) => (
                    <ToolTipComponent key={index} side="right" content={item.tooltip}>
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
