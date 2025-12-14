import { JSX, useState } from 'react';
import PlanExecutorPanel from './PlanExecutorPanel';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import { SidePanelValues } from './EditorSidePanel';
import { useEditPlanStore } from '@/src/store/code/useEditPlanStore';

export default function PlanPanel(): JSX.Element {
    const [collapsePanel, setCollapsePanel] = useState<boolean>(false);
    const { editExeutorPlanPanel, setEditExeutorPlanPanel } = useExecutorStore();
    const { setCurrentState } = useSidePanelStore();
    const { message } = useEditPlanStore();
    if (!message)
        return (
            <div className="w-full h-full flex items-center justify-center text-light/50 bg-[#151617]">
                No Plan Selected
            </div>
        );
    return (
        <div className="w-full bg-[#16171a]">
            <PlanExecutorPanel
                plan={message}
                onCollapse={() => {
                    setCollapsePanel((prev) => !prev);
                }}
                onEdit={() => {
                    setEditExeutorPlanPanel(!editExeutorPlanPanel);
                }}
                onExpand={() => {
                    setCurrentState(SidePanelValues.PLAN);
                }}
                onDone={() => {
                    setEditExeutorPlanPanel(false);
                }}
                collapse={collapsePanel}
                expanded
                editExeutorPlanPanel={editExeutorPlanPanel}
                className="w-full px-4 py-2"
            />
        </div>
    );
}
