import { anchorContractTemplates } from '@/src/templates/contract_templates.const';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useContractTemplateStore } from '@/src/store/user/useContractTemplateStore';

export default function BaseContractTemplatesPanel() {
    const router = useRouter();
    const { setTemplate } = useContractTemplateStore();

    return (
        <div className="w-full h-full flex flex-col gap-y-3 p-3 tracking-wider">
            <div className="w-full flex justify-between items-center">
                <div className="text-sm text-light/50">Featured Templates</div>
                <span
                    onClick={() => router.push('/home')}
                    className="text-light/50 text-[13px] flex items-center gap-x-1 cursor-pointer hover:text-light/70 transition-colors duration-200 "
                >
                    view all
                    <ChevronRight className="size-3" />
                </span>
            </div>

            <div className="h-full flex gap-x-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {anchorContractTemplates.map((contract) => (
                    <div
                        key={contract.id}
                        className="h-full min-w-[calc(30%-12px)] grid grid-rows-[70%_30%] gap-y-1 overflow-hidden group relative"
                    >
                        <div
                            onClick={() => setTemplate(contract)}
                            className="bg-[#0A0C0D70] hover:border-primary overflow-hidden shadow-sm border border-neutral-800 rounded-[4px] relative"
                        >
                            <Image
                                src={contract.image}
                                alt=""
                                fill
                                className="object-cover opacity-90"
                            />
                        </div>

                        <div className="text-light/60 h-full w-full text-left">
                            <div className="text-xs">{contract.title}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
