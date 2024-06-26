import { useContext } from "react";
import { IdContext } from "./IdProvider";

const useIdProvider = () => {
  const provider = useContext(IdContext);
  return {
    ...provider,
  };
};

export default useIdProvider;
