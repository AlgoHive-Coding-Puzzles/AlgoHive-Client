import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";

interface GetInputButtonProps {
  inputRequesting: boolean;
  pollingForTry: boolean;
  handleInputRequest: () => void;
}

const GetInputTemplate = ({
  inputRequesting,
  pollingForTry,
  handleInputRequest,
}: GetInputButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      label={
        inputRequesting
          ? t("puzzles.input.openingInput")
          : pollingForTry
          ? t("puzzles.input.checkingInput")
          : t("puzzles.input.getInput")
      }
      className="w-full max-w-xs"
      onClick={handleInputRequest}
      icon={
        inputRequesting || pollingForTry
          ? "pi pi-spinner pi-spin"
          : "pi pi-download"
      }
      disabled={inputRequesting || pollingForTry}
      size="small"
      style={{
        backgroundColor: "#101018",
        color: "#fff",
        border: "0.8px solid #fff",
      }}
    />
  );
};

export default GetInputTemplate;
