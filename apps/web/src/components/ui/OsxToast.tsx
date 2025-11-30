import { ToastContentProps } from 'react-toastify';

interface CustomNotificationData {
    title: string;
    content?: string;
}

interface CustomNotificationProps extends ToastContentProps<CustomNotificationData> {}

export default function OsxToast({ closeToast }: ToastContentProps) {
    return (
        <div>
            <button className="rounded-full absolute top-[-8px] left-[-6px] opacity-0 group-hover:opacity-100 transition-opacity  shadow-inner shadow-zinc-400 bg-zinc-700/70  size-5 grid place-items-center border border-zinc-400"></button>
            <p>Hello hover me</p>
        </div>
    );
}
