import { InputText } from "primereact/inputtext";
import useIsMobile from "../../lib/hooks/use-is-mobile";
import { memo } from "react";

interface InputAnsweredProps {
  solution: string;
}

function InputAnswered({ solution }: InputAnsweredProps) {
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-md">
      <div className="p-inputgroup flex-1">
        {!isMobile && (
          <span className="p-inputgroup-addon">
            <i className="pi pi-check-circle text-green-500 mr-2"></i>
            Your puzzle answer was:
          </span>
        )}
        <InputText
          type="text"
          className="w-full"
          value={solution}
          disabled
          aria-label="Your submitted answer"
        />
        {isMobile && (
          <span className="p-inputgroup-addon bg-green-100">
            <i className="pi pi-check text-green-500"></i>
          </span>
        )}
      </div>
      {isMobile && (
        <div className="text-xs text-center mt-1 text-gray-500">
          Your puzzle answer was accepted
        </div>
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(InputAnswered);
