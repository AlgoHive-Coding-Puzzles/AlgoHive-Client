interface BackButtonProps {
  onClickAction: () => void;
  text: string;
}

export default function BackButton({ onClickAction, text }: BackButtonProps) {
  return (
    <button className="p-[3px] relative" onClick={onClickAction}>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg" />
      <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
        <div className="flex items-center gap-2">
          <i className="pi pi-arrow-left" />
          <span className="relative z-10">{text}</span>
        </div>
        <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-200" />
      </div>
    </button>
  );
}
