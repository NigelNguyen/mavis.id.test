import toast from "react-hot-toast";

export const tryCatch = async (callback: () => Promise<void>) => {
  try {
    const isAuthenticated = !!localStorage.getItem("MAVIS.ID:PROFILE");
    if (!isAuthenticated) throw new Error("unknown account")
    await callback();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("unknown account")) {
        return toast.error("Please connect with Mavis ID.");
      }
      toast.error("Error occurred.\n Please check your log in console!");
      console.error(error)
    }
  }
};
