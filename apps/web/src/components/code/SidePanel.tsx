'use client';
import 'react-complex-tree/lib/style-modern.css';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { SidePanelValues } from './EditorSidePanel';
import GithubPanel from './GithubPanel';
import FileTree from './Filetree';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import useResize from '@/src/hooks/useResize';

export default function SidePanel() {
    const { currentState } = useSidePanelStore();
    const { collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const { dimension, startResize } = useResize({
        side: 'width',
        min: 240,
        max: 288,
        onClose: () => setCollapseFileTree(false),
    })

    if (!collapseFileTree) return null;

    function renderSidePanels() {
        switch (currentState) {
            case SidePanelValues.FILE:
                return <FileTree />;
            case SidePanelValues.GITHUB:
                return <GithubPanel />;
            default:
                return <div></div>;
        }
    }

    return (
        <div
            className="flex max-h-full bg-[#16171a] uext-neutral-200 border-r border-neutral-800 min-w-[15rem] max-w-[18rem] cursor-ew-resize "
            style={{
                width: `min(${dimension}px, calc(100% - 6rem))`,
                maxWidth: 'calc(100% - 6rem)',
            }}
        >
            <div className="w-[3px] cursor-ew-resize bg-neutral-800" onMouseDown={startResize} />
            <div className="flex-1 flex-col h-full select-none cursor-default ">
                <div className="w-full h-full ">{renderSidePanels()}</div>
            </div>
        </div>
    );
}
