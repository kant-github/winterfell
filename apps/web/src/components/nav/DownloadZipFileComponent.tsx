import GithubServer from '@/src/lib/server/github-server';
import { useChatStore } from '@/src/store/user/useChatStore';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { AiFillFileZip } from 'react-icons/ai';
import { toast } from 'sonner';

export default function DownloadZipFileComponent() {
    const { contractId } = useChatStore();
    const { session } = useUserSessionStore();

    async function downloadZipFile() {
        try {
            if (!session || !session.user.token) return;
            const response = await GithubServer.downloadZipFile(
                contractId ?? window.location.pathname.split('/playground/')[1],
                session.user.token,
            );
            console.log(response);

            const blob = new Blob([response.data], { type: 'application/zip' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `winterfell_project.zip`;
            link.click();
        } catch (error) {
            toast.error('Failed to download zip file');
            return;
        }
    }

    return (
        <div className="px-4 py-2 text-[12.5px] text-light/70">
            <div
                onClick={downloadZipFile}
                className="flex justify-between items-center w-full bg-dark/50 hover:bg-dark border border-neutral-800 p-1.5 px-2 rounded-[4px] tracking-wide cursor-pointer"
            >
                Download ZIP
                <AiFillFileZip className="size-4" />
            </div>
        </div>
    );
}
