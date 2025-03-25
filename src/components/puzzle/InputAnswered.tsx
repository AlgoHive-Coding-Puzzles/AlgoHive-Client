import { InputText } from "primereact/inputtext";
import useIsMobile from "../../lib/hooks/use-is-mobile";

interface InputAnsweredProps {
  solution: string;
}

export default function InputAnswered({ solution }: InputAnsweredProps) {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="p-inputgroup flex-1">
        {!isMobile && (
          <span className="p-inputgroup-addon">
            <i className="pi pi-question-circle mr-2"></i> Your puzzle answer
            was:
          </span>
        )}
        <InputText
          type="text"
          className="w-full max-w-md mx-auto"
          value={solution}
          disabled
        />
      </div>
    </>
  );
}
