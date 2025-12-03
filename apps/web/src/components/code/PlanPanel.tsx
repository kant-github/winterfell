import { JSX, useState } from "react";
import PlanExecutorPanel from "./PlanExecutorPanel";
import { useExecutorStore } from "@/src/store/model/useExecutorStore";
import { useSidePanelStore } from "@/src/store/code/useSidePanelStore";
import { SidePanelValues } from "./EditorSidePanel";

export default function PlanPanel(): JSX.Element {
    const [collapsePanel, setCollapsePanel] = useState<boolean>(false);
    const { editExeutorPlanPanel, setEditExeutorPlanPanel } = useExecutorStore()
    const { setCurrentState } = useSidePanelStore();
    return (
        <div className="w-full bg-[#16171a]">
            <PlanExecutorPanel
                onCollapse={() => {
                    setCollapsePanel(prev => !prev)
                }}
                onEdit={() => {
                    setEditExeutorPlanPanel(!editExeutorPlanPanel);
                }}
                onExpand={() => {
                    setCurrentState(SidePanelValues.PLAN)
                }}
                collapse={collapsePanel}
                expanded
                editExeutorPlanPanel={editExeutorPlanPanel}
                className="w-full px-2 py-2"
            />
        </div>
    )
}